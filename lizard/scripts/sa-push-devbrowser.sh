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

EDITOR_URL="https://app.superannotate.com/editor/35245/290044/$TASK_ID?sort=name&direction=asc"
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
const result = await page.evaluate(({ saApplySrc, annots }) => {
  // Load helpers into the parent-frame scope (they walk into the iframe themselves).
  // sa-apply.js uses bare function declarations — eval() in page scope makes them callable.
  eval(saApplySrc);
  // saContext / saApplyAnnots / saPreSaveAudit / saSave are now in scope.
  const ctx = saContext();
  const apply = saApplyAnnots({ annots });
  const audit = saPreSaveAudit({ annots });
  let saved = { saved: false };
  if (audit.ok && apply.errors.length === 0) {
    saved = saSave();
  }
  return { ctx, apply, audit, saved };
}, { saApplySrc, annots });

console.log("APPLY_WRITES_JSON=" + JSON.stringify(result.apply.writes));
console.log("APPLY_ERRORS_JSON=" + JSON.stringify(result.apply.errors));
console.log("AUDIT_OK=" + result.audit.ok);
console.log("AUDIT_MISMATCHES_JSON=" + JSON.stringify(result.audit.mismatches));
console.log("SAVED=" + result.saved.saved);
if (result.saved.error) console.log("SAVE_ERROR=" + result.saved.error);
DBSCRIPT

WALL=$(($(date +%s) - START))
echo "WALL_SECONDS=$WALL"
