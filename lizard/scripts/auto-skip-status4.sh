#!/usr/bin/env bash
# auto-skip-status4.sh — Auto-apply "Valid Skip to Skipped" to all status=4
# (Annotator_Skipped) stems in the V6 queue.
#
# Codified 2026-05-10 (Igor): default disposition for status=4 is "Valid Skip
# to Skipped" — no scrape, no analysis, no prompts. Run this anytime to
# clear the status=4 backlog. Idempotent (skips already-handled stems).
#
# For exceptions (image issue → Hold, toxic → Unusable), use
# `skip-annotator-skipped.mjs` directly with a different DISPOSITION.
#
# Usage:
#   bash scripts/auto-skip-status4.sh
set -e

PROJECT_ID="${PROJECT_ID:-290044}"
LIZARD_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

# Read status=4 queue rows.
ROWS=$(dev-browser --connect --timeout 60 <<DBSCRIPT 2>&1
const page = await browser.getPage("sa-lizard-queue");
await page.goto("https://app.superannotate.com/35245/project/${PROJECT_ID}/data?sort=name&direction=asc&status=4", { waitUntil: "domcontentloaded", timeout: 60000 });
await new Promise(r => setTimeout(r, 4000));
const rows = await page.evaluate(() => {
  const trs = Array.from(document.querySelectorAll('tr'));
  const out = [];
  for (const tr of trs) {
    const link = tr.querySelector('a[href*="/editor/"]');
    if (!link) continue;
    const cells = Array.from(tr.querySelectorAll('td')).map(c => c.textContent.trim());
    const status = link.href.match(/status=(\\d+)/)?.[1] || '?';
    if (status !== '4') continue;
    const taskId = link.href.match(/\\/editor\\/[0-9]+\\/[0-9]+\\/(\\d+)/)?.[1];
    out.push({ stem: cells[0].replace(/\\.json\$/, ''), task_id: taskId });
  }
  return out;
});
console.log("ROWS=" + JSON.stringify(rows));
DBSCRIPT
)

ROWS_JSON=$(echo "$ROWS" | grep '^ROWS=' | tail -n1 | sed 's/^ROWS=//')
if [ -z "$ROWS_JSON" ] || [ "$ROWS_JSON" = "[]" ]; then
  echo "[auto-skip-status4] no status=4 stems in queue"
  exit 0
fi
echo "[auto-skip-status4] found $(echo "$ROWS_JSON" | node -e 'process.stdin.on("data", d => console.log(JSON.parse(d).length))') status=4 stems"

# Iterate and apply "Valid Skip to Skipped" to each.
N=$(echo "$ROWS_JSON" | node -e 'process.stdin.on("data", d => console.log(JSON.parse(d).length))')
for i in $(seq 0 $((N - 1))); do
  STEM=$(echo "$ROWS_JSON" | node -e "let buf=''; process.stdin.on('data', d => buf+=d); process.stdin.on('end', () => console.log(JSON.parse(buf)[$i].stem))")
  TASK_ID=$(echo "$ROWS_JSON" | node -e "let buf=''; process.stdin.on('data', d => buf+=d); process.stdin.on('end', () => console.log(JSON.parse(buf)[$i].task_id))")
  # Skip if already handled (skipped record exists in done/).
  if [ -f "$LIZARD_DIR/payloads/done/${STEM}.skipped.yaml" ]; then
    echo "  [skip] $STEM: already handled (skipped record exists)"
    continue
  fi
  echo "  [apply] $STEM (task_id=$TASK_ID) → Valid Skip to Skipped"
  STEM="$STEM" TASK_ID="$TASK_ID" DISPOSITION="Valid Skip to Skipped" \
    REASON="Auto-applied default disposition for Annotator_Skipped (Igor 2026-05-10 rule)." \
    node "$LIZARD_DIR/scripts/skip-annotator-skipped.mjs"
done

echo "[auto-skip-status4] done. Set the SA task QC dropdowns manually for each."
