#!/usr/bin/env bash
# sa-push-devbrowser.sh — single-shot SA push via dev-browser (Job 5 actor).
#
# Usage:
#   STEM=<stem> bash scripts/sa-push-devbrowser.sh
#
# Reads payloads/shadow_applied/<stem>.yaml, navigates to SA editor, applies
# per-annot edits via inlined sa-apply.js helpers, runs pre-save audit, clicks
# Save. Does NOT finalize — caller runs run-job5.mjs --finalize after.
#
# Outputs parseable lines on stdout (key=value):
#   SA_TASK_ID=<numeric>
#   IFRAME_OK=true|false
#   APPLY_WRITES_JSON=<json>
#   APPLY_ERRORS_JSON=<json>
#   AUDIT_OK=true|false
#   AUDIT_MISMATCHES_JSON=<json>
#   SAVED=true|false
#   WALL_SECONDS=<n>
#
# Codified 2026-05-06. Replaces chrome-mcp evaluate_script round-trips for
# Job 5 (per 2026-05-05 dev-browser-for-Job-5 rule).
set -e

: "${STEM:?STEM env required}"

LIZARD_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PAYLOAD="$LIZARD_DIR/payloads/shadow_applied/$STEM.yaml"
[ -f "$PAYLOAD" ] || { echo "ERROR: payload not found at $PAYLOAD"; exit 1; }

# Pre-Save skill-audit gate (codified 2026-05-06 — Dashboard batch incident:
# 12 skill mismatches shipped to SA before the audit was wired in). Refuses
# the SA push if any annot's prompt fails the codified skill heuristics
# (Enumeration on count/how-many/identify-all; Math on sum/mean/etc; TCG on
# chart/graph/table/etc). Set SKIP_SKILL_AUDIT=1 to bypass (e.g. when Igor has
# already accepted the mismatches via post-batch review).
if [ "${SKIP_SKILL_AUDIT:-0}" != "1" ]; then
  if ! node "$LIZARD_DIR/scripts/skill-audit-sanity.mjs" "$STEM" >&2; then
    echo "ERROR: skill-audit-sanity refused $STEM. Resolve mismatches in payload (or set SKIP_SKILL_AUDIT=1 to bypass)." >&2
    exit 4
  fi
fi

# Stage payload + sa-apply.js as files dev-browser sandbox can readFile().
TMP_DIR="$HOME/.dev-browser/tmp"
mkdir -p "$TMP_DIR"
PAYLOAD_NAME="sa-payload-$STEM.yaml"
cp "$PAYLOAD" "$TMP_DIR/$PAYLOAD_NAME"
SA_APPLY_NAME="sa-apply.js"
cp "$LIZARD_DIR/scripts/sa-apply.js" "$TMP_DIR/$SA_APPLY_NAME"

# Parse task_id from payload (numeric SA internal ID — used in editor URL).
TASK_ID=$(grep -m1 '^\s*task_id:' "$PAYLOAD" | awk '{print $NF}')
[ -n "$TASK_ID" ] || { echo "ERROR: task_id missing from payload"; exit 1; }
echo "SA_TASK_ID=$TASK_ID"

# Build apply-annots JSON from payload (just the fields sa-apply needs).
ANNOTS_JSON=$(node -e '
const fs = require("fs");
const text = fs.readFileSync("'"$PAYLOAD"'", "utf8");
const annots = text.split(/^\s*- n:\s*/m).slice(1);
const out = [];
for (const block of annots) {
  const n = parseInt(block.match(/^(\d+)/)[1], 10);
  const rating = block.match(/rating:\s*(\S+)/)?.[1];
  const action = block.match(/action:\s*(\S+)/)?.[1];
  const af = block.match(/answer_final:\s*(.+)/)?.[1]?.trim();
  let answer_final = null;
  if (af && af !== "null") {
    answer_final = af.replace(/^["]|["]$/g, "").replace(/\\"/g, "\"");
  }
  const sc = (block.match(/skills_check:\s*\[(.*?)\]/)?.[1] || "").split(",").map(s => s.trim().replace(/^["]|["]$/g, "")).filter(Boolean);
  const su = (block.match(/skills_uncheck:\s*\[(.*?)\]/)?.[1] || "").split(",").map(s => s.trim().replace(/^["]|["]$/g, "")).filter(Boolean);
  const qtype = block.match(/qtype:\s*"?([^"\n]+)"?/)?.[1]?.trim().replace(/^"|"$/g, "");
  // Feedback: support both single-line "..." and YAML | block scalar.
  let feedback = null;
  const fb1 = block.match(/feedback:\s*"((?:[^"\\]|\\.)*)"/s);
  if (fb1) feedback = fb1[1].replace(/\\"/g, "\"").replace(/\\n/g, "\n");
  else {
    const fb2 = block.match(/feedback:\s*\|\s*\n((?:        .+\n?)+)/);
    if (fb2) feedback = fb2[1].replace(/^        /gm, "").replace(/\n+$/, "");
    else if (/feedback:\s*null/.test(block)) feedback = null;
  }
  // Extract hai.prompt block scalar — preserve blank lines (used by pre-save prompt readback).
  let hai_prompt = null;
  const lines = block.split("\n");
  let inP = false, pIndent = null, pLines = [];
  for (const l of lines) {
    if (/^\s+prompt:\s*\|/.test(l)) { inP = true; continue; }
    if (inP) {
      if (/^\s*$/.test(l)) { pLines.push(""); continue; }
      const im = /^( +)/.exec(l);
      const ind = im ? im[1].length : 0;
      if (pIndent === null) pIndent = ind;
      if (ind < pIndent) break;
      pLines.push(l.slice(pIndent));
    }
  }
  if (pLines.length) hai_prompt = pLines.join("\n").replace(/\n+$/, "");
  // Guard rail: every annot MUST have hai.prompt for the pre-save readback gate
  // (codified 2026-05-06 — V6 batch incident). Without it, audit silently skips
  // and we lose prompt-corruption detection.
  if (!hai_prompt) {
    console.error(`ERROR: A${n} hai.prompt missing or empty in payload — refusing to push (pre-save audit guard requires it)`);
    process.exit(2);
  }
  out.push({ n, rating, action, answer_final, skills_check: sc, skills_uncheck: su, qtype, feedback, hai_prompt });
}
process.stdout.write(JSON.stringify(out));')

# If extraction errored, ANNOTS_JSON is empty and the next step will fail; bail loud.
[ -n "$ANNOTS_JSON" ] || { echo "ERROR: payload extraction failed (see node stderr above)"; exit 2; }

ANNOTS_NAME="sa-annots-$STEM.json"
printf '%s' "$ANNOTS_JSON" > "$TMP_DIR/$ANNOTS_NAME"

# Derive project_id from queue file (handles V5 283665 vs V6 290044). Fall back to V6 if missing.
QUEUE_FILE="queue/${STEM}.json"
PROJECT_ID=290044
if [ -f "$QUEUE_FILE" ]; then
  PARSED=$(node -e "const j=require('./'+process.argv[1]); const m=(j.editor_url||'').match(/\\/editor\\/[0-9]+\\/([0-9]+)\\//); process.stdout.write(m?m[1]:'');" "$QUEUE_FILE" 2>/dev/null)
  [ -n "$PARSED" ] && PROJECT_ID="$PARSED"
fi
EDITOR_URL="https://app.superannotate.com/editor/35245/$PROJECT_ID/$TASK_ID?sort=name&direction=asc"
START=$(date +%s)

dev-browser --connect --timeout 180 <<DBSCRIPT
const EDITOR_URL = "${EDITOR_URL}";
const PAYLOAD_NAME = "${PAYLOAD_NAME}";
const SA_APPLY_NAME = "${SA_APPLY_NAME}";
const ANNOTS_NAME = "${ANNOTS_NAME}";

const page = await browser.getPage("sa-lizard-job5");
await page.goto(EDITOR_URL, { waitUntil: "domcontentloaded" });

// Wait for SA iframe + at least one QC header.
await page.waitForFunction(() => {
  const ifr = document.querySelector('iframe.custom-llm') || document.querySelector('iframe[src*="custom-llm"]');
  if (!ifr || !ifr.contentDocument) return false;
  return Array.from(ifr.contentDocument.querySelectorAll('p.title')).some(p => p.textContent.trim() === 'QC');
}, null, { timeout: 60000 });
console.log("IFRAME_OK=true");

const annots = JSON.parse(await readFile(ANNOTS_NAME));
const saApplySrc = await readFile(SA_APPLY_NAME);

// Inline sa-apply.js into page context, then call its functions.
// Apply edits + audit first; then in a separate evaluate pass, click per-annot
// delete X for action:delete annots, verify only approve ratings remain, save.
// Two-pass split required because delete-btn clicks need a setTimeout slack
// between iterations (React re-renders the list each click) which page.evaluate's
// async callback supports cleanly. Codified 2026-05-09 (Igor override): integrate
// per-annot delete into the same Save event, never leave 👎 in SA after Save.
const applyResult = await page.evaluate(({ saApplySrc, annots }) => {
  eval(saApplySrc);
  const ctx = saContext();
  const apply = saApplyAnnots({ annots });
  const audit = saPreSaveAudit({ annots });
  return { ctx, apply, audit };
}, { saApplySrc, annots });

console.log("APPLY_WRITES_JSON=" + JSON.stringify(applyResult.apply.writes));
console.log("APPLY_ERRORS_JSON=" + JSON.stringify(applyResult.apply.errors));
console.log("AUDIT_OK=" + applyResult.audit.ok);
console.log("AUDIT_MISMATCHES_JSON=" + JSON.stringify(applyResult.audit.mismatches));

let saved = { saved: false };
if (applyResult.audit.ok && applyResult.apply.errors.length === 0) {
  // Identify action:delete annots (1-based n). Note: flat schema from ANNOTS_JSON
  // build at line 57+ — fields live at top level (a.action), not nested under .sa.
  const deleteNs = annots.filter(a => a.action === 'delete').map(a => a.n).sort((a,b) => b-a);
  if (deleteNs.length > 0) {
    console.log("DELETE_NS=" + JSON.stringify([...deleteNs].sort((a,b) => a-b)));
    for (const n of deleteNs) {
      await page.evaluate((idx0) => {
        const ifr = document.querySelector('iframe[src*="custom-llm"]');
        const dels = ifr.contentDocument.querySelectorAll('.delete-btn');
        if (dels.length <= idx0) throw new Error('delete-btn index ' + idx0 + ' out of range (have ' + dels.length + ')');
        const btn = dels[idx0].closest('button') || dels[idx0];
        btn.click();
      }, n - 1);
      await new Promise(r => setTimeout(r, 1000));
    }
    // Verify: every remaining QC rating must be approve-action (👍).
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
    console.log("DELETE_REMAINING_BTNS=" + verify.remaining);
    console.log("DELETE_RATINGS_JSON=" + JSON.stringify(verify.ratings));
    const allApprove = verify.ratings.every(r => r === 'approve-action');
    if (!allApprove) {
      console.log("DELETE_VERIFY_FAIL=true — refuse to Save (non-approve rating found post-delete)");
    } else {
      console.log("DELETE_VERIFY_OK=true");
      saved = await page.evaluate(({ saApplySrc }) => { eval(saApplySrc); return saSave(); }, { saApplySrc });
    }
  } else {
    saved = await page.evaluate(({ saApplySrc }) => { eval(saApplySrc); return saSave(); }, { saApplySrc });
  }
}
const result = { ctx: applyResult.ctx, apply: applyResult.apply, audit: applyResult.audit, saved };

console.log("SAVED=" + result.saved.saved);
if (result.saved.error) console.log("SAVE_ERROR=" + result.saved.error);
DBSCRIPT

WALL=$(($(date +%s) - START))
echo "WALL_SECONDS=$WALL"
