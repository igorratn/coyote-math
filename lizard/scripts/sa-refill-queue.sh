#!/usr/bin/env bash
# sa-refill-queue.sh — Loop "Request tasks" + auto-skip Annotator_Skipped until
# we have up to MAX_VALID (default 4) eligible status=6 stems for the pipeline.
#
# Workflow per iteration:
#   1. Click "Request tasks" in SA queue (pull fresh items)
#   2. Read current queue rows
#   3. For each status=4 (Annotator_Skipped): auto-disposition "Valid Skip to Skipped" via SA UI
#   4. Count remaining valid (status=6 non-NV) stems
#   5. Stop if count >= MAX_VALID OR loop max reached
#
# Codified 2026-05-10 (Igor): always run before starting a new pipeline batch.
#
# Usage:
#   bash scripts/sa-refill-queue.sh
#   MAX_VALID=4 MAX_LOOPS=5 bash scripts/sa-refill-queue.sh
set -e

PROJECT_ID="${PROJECT_ID:-290044}"
MAX_VALID="${MAX_VALID:-4}"
MAX_LOOPS="${MAX_LOOPS:-5}"
LIZARD_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

for loop in $(seq 1 $MAX_LOOPS); do
  echo "=== iteration $loop/$MAX_LOOPS ==="

  RAW=$(dev-browser --connect --timeout 90 <<DBSCRIPT 2>&1
const page = await browser.getPage("sa-lizard-queue");
await page.goto("https://app.superannotate.com/35245/project/${PROJECT_ID}/data?sort=name&direction=asc&status=6", { waitUntil: "domcontentloaded", timeout: 60000 });
await new Promise(r => setTimeout(r, 4000));

// Click "Request tasks"
const reqClicked = await page.evaluate(() => {
  const btn = Array.from(document.querySelectorAll('button')).find(b => (b.innerText || '').trim() === 'Request tasks' && b.offsetParent !== null && !b.disabled);
  if (!btn) return false;
  btn.click();
  return true;
});
console.log("REQUEST_TASKS=" + reqClicked);
await new Promise(r => setTimeout(r, 5000));

// Read all rows (status=6 + status=4 both surface here)
const rows = await page.evaluate(() => {
  const trs = Array.from(document.querySelectorAll('tr'));
  const out = [];
  for (const tr of trs) {
    const link = tr.querySelector('a[href*="/editor/"]');
    if (!link) continue;
    const cells = Array.from(tr.querySelectorAll('td')).map(c => c.textContent.trim());
    const status = link.href.match(/status=(\\d+)/)?.[1] || '?';
    const taskId = link.href.match(/\\/editor\\/[0-9]+\\/[0-9]+\\/(\\d+)/)?.[1];
    out.push({ stem: cells[0].replace(/\\.json\$/, ''), task_id: taskId, status, category: cells[1] || '-' });
  }
  return out;
});
console.log("ROWS=" + JSON.stringify(rows));
DBSCRIPT
)
  ROWS=$(echo "$RAW" | grep '^ROWS=' | tail -n1 | sed 's/^ROWS=//')
  N=$(echo "$ROWS" | node -e 'process.stdin.on("data", d => console.log(JSON.parse(d).length))' 2>/dev/null || echo 0)
  STATUS4=$(echo "$ROWS" | node -e 'process.stdin.on("data", d => console.log(JSON.parse(d).filter(r => r.status === "4").length))' 2>/dev/null || echo 0)
  VALID=$(echo "$ROWS" | node -e 'process.stdin.on("data", d => console.log(JSON.parse(d).filter(r => r.status === "6" && r.category !== "return_to_QC_by_NV").length))' 2>/dev/null || echo 0)
  echo "  total=$N · status=4=$STATUS4 · valid_status=6=$VALID"

  # Disposition any status=4 stems
  if [ "$STATUS4" -gt 0 ]; then
    STATUS4_IDX=$(echo "$ROWS" | node -e 'let buf=""; process.stdin.on("data", d => buf+=d); process.stdin.on("end", () => { const r = JSON.parse(buf).map((x,i) => x.status === "4" ? i : -1).filter(i => i >= 0); console.log(JSON.stringify(r)); })')
    for i in $(echo "$STATUS4_IDX" | node -e 'process.stdin.on("data", d => console.log(JSON.parse(d).join(" ")))'); do
      STEM=$(echo "$ROWS" | node -e "let buf=''; process.stdin.on('data', d => buf+=d); process.stdin.on('end', () => console.log(JSON.parse(buf)[$i].stem))")
      TASK_ID=$(echo "$ROWS" | node -e "let buf=''; process.stdin.on('data', d => buf+=d); process.stdin.on('end', () => console.log(JSON.parse(buf)[$i].task_id))")
      echo "  [skip] $STEM (task $TASK_ID)"
      EDITOR_URL="https://app.superannotate.com/editor/35245/${PROJECT_ID}/${TASK_ID}?imageId=${TASK_ID}&imageName=${STEM}.json&status=4&sort=name&direction=asc"
      export EDITOR_URL
      dev-browser --connect --timeout 60 <<DBSCRIPT 2>&1 | grep -E '^(CLICKED|ERROR|DONE)' | head -5 || true
const page = await browser.getPage("sa-skip-loop");
await page.goto("${EDITOR_URL}", { waitUntil: "domcontentloaded", timeout: 60000 });
await new Promise(r => setTimeout(r, 5000));
const frame = page.frameLocator('iframe[src*="custom-llm"]');
try {
  await frame.locator('button:has-text("Annotator_Skip")').click({ timeout: 15000 });
  console.log("CLICKED=AnnotSkip");
  await new Promise(r => setTimeout(r, 800));
  await frame.locator('.sn-dropdown-item:has-text("Valid Skip to Skipped")').click({ timeout: 10000 });
  console.log("CLICKED=ValidSkipToSkipped");
  await new Promise(r => setTimeout(r, 1500));
  // Click Save if enabled
  const saveOk = await page.evaluate(() => {
    const ifr = document.querySelector('iframe[src*="custom-llm"]');
    const sb = Array.from(ifr.contentDocument.querySelectorAll('button')).find(b => (b.innerText||'').trim() === 'Save');
    return sb && !sb.disabled;
  });
  if (saveOk) {
    await frame.locator('button:has-text("Save"):not([disabled])').click({ timeout: 5000 });
    console.log("CLICKED=Save");
  }
  console.log("DONE");
} catch (e) {
  console.log("ERROR: " + String(e.message || e).slice(0, 100));
}
DBSCRIPT
    done
    # After dispositioning, loop again to refresh queue
    sleep 2
    continue
  fi

  # No more status=4 — check if we have enough valid
  if [ "$VALID" -ge "$MAX_VALID" ]; then
    echo "  reached MAX_VALID=$MAX_VALID — stopping"
    break
  fi
  if [ "$VALID" -eq "$N" ] && [ "$VALID" -lt "$MAX_VALID" ]; then
    echo "  no status=4 left, valid=$VALID < target $MAX_VALID — done (project pool may be exhausted)"
    break
  fi
done
echo "=== final: status=6 valid stems ==="
bash "$LIZARD_DIR/scripts/sa-request-tasks.sh" 2>/dev/null | grep '^ROWS_JSON=' | sed 's/^ROWS_JSON=//' | node -e 'process.stdin.on("data", d => { const rows = JSON.parse(d); console.log("count: " + rows.length); for (const r of rows) console.log("  " + r.stem); })'
