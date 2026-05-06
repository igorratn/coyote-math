#!/usr/bin/env bash
# sa-restore-prompts-devbrowser.sh — emergency restore for prompts overwritten
# by sa-apply.js's broken Rewrite Answer walk-up (codified 2026-05-06 — V6
# batch incident: tas[0] at depth 8 = "Annotator Question" textarea, not
# Rewrite Answer; 12 prompts across 8 stems were clobbered with the answer).
#
# Reads payloads/done/<stem>.yaml for the source-of-truth prompts (from
# hai.prompt block scalars) and writes them back into SA's "Annotator Question"
# textareas. Skips thumbs-down annots — they were untouched (sa-apply.js skips
# rewrite-write on 👎).
#
# Usage:
#   STEM=<stem> bash scripts/sa-restore-prompts-devbrowser.sh
#
# Outputs key=value lines: SA_TASK_ID, IFRAME_OK, RESTORED_JSON, SAVED, WALL_SECONDS.
set -e

: "${STEM:?STEM env required}"

LIZARD_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PAYLOAD="$LIZARD_DIR/payloads/done/$STEM.yaml"
[ -f "$PAYLOAD" ] || { echo "ERROR: payload not in done/ at $PAYLOAD"; exit 1; }

TMP_DIR="$HOME/.dev-browser/tmp"
mkdir -p "$TMP_DIR"

# Build per-annot {n, rating, prompt} JSON. Skip thumbs-down (untouched).
ANNOTS_JSON=$(node -e '
const fs = require("fs");
const text = fs.readFileSync("'"$PAYLOAD"'", "utf8");
// Split per annot block.
const blocks = text.split(/^\s*- n:\s*/m).slice(1);
const out = [];
for (const block of blocks) {
  const n = parseInt(block.match(/^(\d+)/)[1], 10);
  const rating = block.match(/rating:\s*(\S+)/)?.[1];
  if (rating !== "thumbs-up") continue;  // 👎 untouched
  // Extract hai.prompt block scalar — preserve blank lines.
  const lines = block.split("\n");
  let inPrompt = false;
  let promptIndent = null;
  const promptLines = [];
  for (const l of lines) {
    if (/^\s+prompt:\s*\|/.test(l)) { inPrompt = true; continue; }
    if (inPrompt) {
      const blank = /^\s*$/.test(l);
      if (blank) { promptLines.push(""); continue; }
      const indentM = /^( +)/.exec(l);
      const indent = indentM ? indentM[1].length : 0;
      if (promptIndent === null) promptIndent = indent;
      if (indent < promptIndent) break;
      promptLines.push(l.slice(promptIndent));
    }
  }
  const prompt = promptLines.join("\n").replace(/\n+$/, "");
  out.push({ n, prompt });
}
process.stdout.write(JSON.stringify(out));')

[ -n "$ANNOTS_JSON" ] && [ "$ANNOTS_JSON" != "[]" ] || { echo "RESTORED_JSON=[] (no thumbs-up annots, nothing to restore)"; exit 0; }

ANNOTS_NAME="sa-restore-$STEM.json"
printf '%s' "$ANNOTS_JSON" > "$TMP_DIR/$ANNOTS_NAME"

TASK_ID=$(grep -m1 '^\s*task_id:' "$PAYLOAD" | awk '{print $NF}')
echo "SA_TASK_ID=$TASK_ID"

EDITOR_URL="https://app.superannotate.com/editor/35245/290044/$TASK_ID?sort=name&direction=asc"
START=$(date +%s)

dev-browser --connect --timeout 180 <<DBSCRIPT
const EDITOR_URL = "${EDITOR_URL}";
const ANNOTS_NAME = "${ANNOTS_NAME}";

const page = await browser.getPage("sa-lizard-restore");
await page.goto(EDITOR_URL, { waitUntil: "domcontentloaded" });

await page.waitForFunction(() => {
  const ifr = document.querySelector('iframe.custom-llm') || document.querySelector('iframe[src*="custom-llm"]');
  if (!ifr || !ifr.contentDocument) return false;
  return Array.from(ifr.contentDocument.querySelectorAll('p.title')).some(p => p.textContent.trim() === 'QC');
}, null, { timeout: 60000 });
console.log("IFRAME_OK=true");

const annots = JSON.parse(await readFile(ANNOTS_NAME));

const result = await page.evaluate((annots) => {
  const ifr = document.querySelector('iframe.custom-llm') || document.querySelector('iframe[src*="custom-llm"]');
  const doc = ifr.contentDocument;

  // Find all textareas labeled "Annotator Question" (one per annot, in order).
  function findPromptTextareas() {
    const tas = Array.from(doc.querySelectorAll('textarea'));
    return tas.filter(t => {
      let cur = t;
      for (let d = 0; d < 6 && cur; d++) {
        const titleEl = cur.parentElement?.querySelector('p.title, p[class*="title"], h3, h4, label');
        if (titleEl && titleEl.textContent.trim() === 'Annotator Question') return true;
        cur = cur.parentElement;
      }
      return false;
    });
  }

  function setTextareaNative(ta, value) {
    const setter = Object.getOwnPropertyDescriptor(ta.ownerDocument.defaultView.HTMLTextAreaElement.prototype, 'value').set;
    setter.call(ta, value);
    ta.dispatchEvent(new Event('input', { bubbles: true }));
    ta.dispatchEvent(new Event('change', { bubbles: true }));
  }

  const promptTas = findPromptTextareas();
  const restored = [];
  const errors = [];

  for (const a of annots) {
    const idx = a.n - 1;
    const ta = promptTas[idx];
    if (!ta) { errors.push(`A\${a.n}: no Annotator Question textarea at index \${idx} (only \${promptTas.length} found)`); continue; }
    const before = ta.value;
    if (before === a.prompt) { restored.push({ n: a.n, status: 'already-correct', len: a.prompt.length }); continue; }
    setTextareaNative(ta, a.prompt);
    const after = ta.value;
    const ok = after.trim() === a.prompt.trim();
    restored.push({ n: a.n, status: ok ? 'restored' : 'readback-mismatch', before_len: before.length, after_len: after.length, expected_len: a.prompt.length });
  }

  // Save
  let saved = false;
  try {
    const saveBtn = Array.from(doc.querySelectorAll('button')).find(b => b.textContent.trim() === 'Save' && !b.disabled);
    if (saveBtn) { saveBtn.click(); saved = true; }
  } catch (e) { errors.push('save: ' + e.message); }

  return { restored, errors, saved };
}, annots);

console.log("RESTORED_JSON=" + JSON.stringify(result.restored));
console.log("ERRORS_JSON=" + JSON.stringify(result.errors));
console.log("SAVED=" + result.saved);
DBSCRIPT

WALL=$(($(date +%s) - START))
echo "WALL_SECONDS=$WALL"
