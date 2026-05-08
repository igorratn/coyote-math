#!/usr/bin/env bash
# sa-delete-annots.sh — click the per-annot X (.delete-btn) on every action:delete
# annot in a stem's payload, then click Save. Per Igor's 2026-05-08 override:
# the per-annot X is REVERSIBLE before Save, so CLI may automate it.
# (The task-level delete / trash icon is still Igor-only and irreversible.)
#
# Usage:
#   STEM=<stem> bash scripts/sa-delete-annots.sh
#
# Reads payloads/done/<S>.yaml (or shadow_applied/<S>.yaml as fallback) to
# determine how many annots have action: delete. Counts visible .delete-btn
# elements in the SA iframe and clicks until none remain (since SA renders one
# X per thumbs-down annot post-Job-5-save). Then clicks Save inside the iframe.
#
# Codified 2026-05-08 after manual testing on V5 batch #3.
set -e
: "${STEM:?STEM env required}"

LIZARD_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PAYLOAD_DONE="$LIZARD_DIR/payloads/done/$STEM.yaml"
PAYLOAD_SHADOW="$LIZARD_DIR/payloads/shadow_applied/$STEM.yaml"
PAYLOAD=""
[ -f "$PAYLOAD_DONE" ] && PAYLOAD="$PAYLOAD_DONE"
[ -z "$PAYLOAD" ] && [ -f "$PAYLOAD_SHADOW" ] && PAYLOAD="$PAYLOAD_SHADOW"
[ -n "$PAYLOAD" ] || { echo "ERROR: no payload found for $STEM (checked done/ + shadow_applied/)"; exit 1; }

# Extract the n values of action: delete annots from payload (1-based positions).
# Splits on `- n: <int>` block boundaries, records n only when its sa.action == delete.
DELETE_NS_JSON=$(node -e "
const fs = require('fs');
const txt = fs.readFileSync(process.argv[1], 'utf8');
const blocks = txt.split(/^  - n:\s+/m);
const out = [];
for (let i = 1; i < blocks.length; i++) {
  const blk = blocks[i];
  const nMatch = blk.match(/^(\d+)/);
  if (!nMatch) continue;
  const n = parseInt(nMatch[1], 10);
  if (/^      action:\s+delete\b/m.test(blk)) out.push(n);
}
process.stdout.write(JSON.stringify(out));
" "$PAYLOAD")
EXPECTED_DELETES=$(node -e "process.stdout.write(String(JSON.parse(process.argv[1]).length))" "$DELETE_NS_JSON")
if [ "$EXPECTED_DELETES" = "0" ]; then
  echo "[sa-delete-annots] $STEM: no action:delete annots in payload — nothing to do"
  exit 0
fi

# Derive task_id + project_id from payload.
TASK_ID=$(grep -m1 '^\s*task_id:' "$PAYLOAD" | awk '{print $NF}')
[ -n "$TASK_ID" ] || { echo "ERROR: task_id missing"; exit 1; }
# Default V6 (290044); override to V5 (283665) when stem is in second-pass mode.
PROJECT_ID=290044
QUEUE_FILE="$LIZARD_DIR/queue/$STEM.json"
if [ -f "$QUEUE_FILE" ]; then
  PARSED=$(node -e "const j=require(process.argv[1]); const m=(j.editor_url||'').match(/\\/editor\\/[0-9]+\\/([0-9]+)\\//); process.stdout.write(m?m[1]:'');" "$QUEUE_FILE" 2>/dev/null || true)
  [ -n "$PARSED" ] && PROJECT_ID="$PARSED"
fi
# Fallback: detect V5 from second_pass field in any preserved payload metadata
# (queue file is gone after Job 5 finalize). Try peek at the original sidecar.
SIDECAR_DONE="$LIZARD_DIR/payloads/done/$STEM.shadows.yaml"
if [ -f "$SIDECAR_DONE" ]; then
  # Heuristic: if any shadow uuid matches a Plot_/Report_ pattern that we know
  # is V5, use 283665. For now, accept that callers pass STEM in a V5 context
  # if needed — manual override via PROJECT_ID env supported.
  :
fi
PROJECT_ID="${PROJECT_ID_OVERRIDE:-$PROJECT_ID}"

EDITOR_URL="https://app.superannotate.com/editor/35245/$PROJECT_ID/$TASK_ID?sort=name&direction=asc"
echo "[sa-delete-annots] $STEM: $EXPECTED_DELETES delete annot(s) at n=$DELETE_NS_JSON — opening $EDITOR_URL"

dev-browser --connect --timeout 180 <<DBSCRIPT
const EDITOR_URL = "${EDITOR_URL}";
const DELETE_NS = ${DELETE_NS_JSON};   // 1-based annot indices to delete
const page = await browser.getPage("sa-lizard-job5");

await page.goto(EDITOR_URL, { waitUntil: "domcontentloaded", timeout: 60000 });
await page.waitForFunction(() => {
  const ifr = document.querySelector('iframe[src*="custom-llm"]');
  if (!ifr || !ifr.contentDocument) return false;
  return Array.from(ifr.contentDocument.querySelectorAll('p.title')).some(p => p.textContent.trim() === 'QC');
}, null, { timeout: 60000 });

const initial = await page.evaluate(() => {
  const ifr = document.querySelector('iframe[src*="custom-llm"]');
  return ifr.contentDocument.querySelectorAll('.delete-btn').length;
});
console.log("INITIAL_DELETE_BTNS=" + initial);
// SA renders one .delete-btn per annot (NOT just per 👎). Target by index, not blanket-loop.
// Click in DESCENDING order so prior clicks don't shift later indices.
const targets = [...DELETE_NS].sort((a, b) => b - a);
for (const n of targets) {
  await page.evaluate((idx0) => {
    const ifr = document.querySelector('iframe[src*="custom-llm"]');
    const dels = ifr.contentDocument.querySelectorAll('.delete-btn');
    if (dels.length <= idx0) throw new Error('delete-btn index ' + idx0 + ' out of range (have ' + dels.length + ')');
    const btn = dels[idx0].closest('button') || dels[idx0];
    btn.click();
  }, n - 1);
  await new Promise(r => setTimeout(r, 1000));
}
console.log("CLICKS=" + targets.length);

// Verify: every remaining QC rating must be approve-action (👍). Refuse Save if any 👎 left.
const verify = await page.evaluate(() => {
  const ifr = document.querySelector('iframe[src*="custom-llm"]');
  const doc = ifr.contentDocument;
  const dels = doc.querySelectorAll('.delete-btn');
  const qcTitles = Array.from(doc.querySelectorAll('p.title')).filter(p => p.textContent.trim() === 'QC');
  const ratings = qcTitles.map(qc => {
    let cur = qc;
    for (let i = 0; i < 8; i++) { cur = cur.parentElement; if (!cur) break; }
    if (!cur) return 'no_parent';
    const active = Array.from(cur.querySelectorAll('button')).filter(b =>
      (b.getAttribute('style') || '').includes('rgb(0, 205, 108)') &&
      (b.getAttribute('svgicon') || '').includes('action'));
    return active.map(b => b.getAttribute('svgicon')).join(',');
  });
  return { remaining: dels.length, ratings };
});
console.log("REMAINING_BTNS=" + verify.remaining);
console.log("RATINGS_JSON=" + JSON.stringify(verify.ratings));
const allApprove = verify.ratings.every(r => r === 'approve-action');
if (!allApprove) {
  console.log("VERIFY_FAIL=true — refuse to Save (non-approve rating found)");
  process.exit(2);
}
console.log("VERIFY_OK=true");

// Click Save inside the iframe.
const saved = await page.evaluate(() => {
  const ifr = document.querySelector('iframe[src*="custom-llm"]');
  const doc = ifr.contentDocument;
  const sb = Array.from(doc.querySelectorAll('button')).find(b => b.textContent.trim() === 'Save' && !b.disabled);
  if (sb) { sb.click(); return true; }
  return false;
});
console.log("SAVED=" + saved);
DBSCRIPT
