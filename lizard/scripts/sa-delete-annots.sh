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

# Count action: delete annots in payload.
EXPECTED_DELETES=$(grep -c '^      action: delete' "$PAYLOAD" 2>/dev/null || true)
EXPECTED_DELETES=${EXPECTED_DELETES:-0}
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
echo "[sa-delete-annots] $STEM: $EXPECTED_DELETES delete annot(s) — opening $EDITOR_URL"

dev-browser --connect --timeout 180 <<DBSCRIPT
const EDITOR_URL = "${EDITOR_URL}";
const EXPECTED = ${EXPECTED_DELETES};
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
if (initial !== EXPECTED) {
  console.log("WARN: payload says " + EXPECTED + " deletes but UI shows " + initial + " delete-btns. Continuing.");
}

// Click each .delete-btn one at a time (DOM updates after each click).
let clicks = 0;
for (let i = 0; i < EXPECTED + 5; i++) {
  const remaining = await page.evaluate(() => {
    const ifr = document.querySelector('iframe[src*="custom-llm"]');
    const dels = ifr.contentDocument.querySelectorAll('.delete-btn');
    if (dels.length === 0) return 0;
    const btn = dels[0].closest('button') || dels[0];
    btn.click();
    return dels.length;
  });
  if (remaining === 0) break;
  clicks++;
  await new Promise(r => setTimeout(r, 800));
}
console.log("CLICKS=" + clicks);

// Wait briefly for any DOM settle, then click Save inside the iframe.
await new Promise(r => setTimeout(r, 1000));
const saved = await page.evaluate(() => {
  const ifr = document.querySelector('iframe[src*="custom-llm"]');
  const doc = ifr.contentDocument;
  const sb = Array.from(doc.querySelectorAll('button')).find(b => b.textContent.trim() === 'Save' && !b.disabled);
  if (sb) { sb.click(); return true; }
  return false;
});
console.log("SAVED=" + saved);
DBSCRIPT
