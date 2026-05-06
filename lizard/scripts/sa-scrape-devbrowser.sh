#!/usr/bin/env bash
# sa-scrape-devbrowser.sh — Job 0 scrape via dev-browser.
#
# Usage:
#   STEM=<stem> bash scripts/sa-scrape-devbrowser.sh
#
# Reads queue/<stem>.json for task_id + editor_url, navigates SA editor,
# evaluates scripts/scrape-superannotate.js (modified inline to RETURN the
# content string instead of triggering a browser download), writes content
# to scrapes/<stem>.txt, then curls IMAGE_URL to screenshots/<stem>.<ext>.
#
# Outputs: SA_TASK_ID, OK, N_ANNOTATIONS, IMAGE_URL, IMAGE_PATH, WALL_SECONDS.
# Codified 2026-05-06 — extends 2026-05-05 dev-browser-for-Job-5 codification
# to Job 0. Replaces chrome-mcp evaluate_script + ~/Downloads picker round-trips.
set -e

: "${STEM:?STEM env required}"

LIZARD_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
QUEUE_FILE="$LIZARD_DIR/queue/$STEM.json"
[ -f "$QUEUE_FILE" ] || { echo "ERROR: queue file not found at $QUEUE_FILE"; exit 1; }

TASK_ID=$(node -e 'console.log(JSON.parse(require("fs").readFileSync("'"$QUEUE_FILE"'","utf8")).task_id)')
EDITOR_URL=$(node -e 'console.log(JSON.parse(require("fs").readFileSync("'"$QUEUE_FILE"'","utf8")).editor_url)')
[ -n "$TASK_ID" ] && [ -n "$EDITOR_URL" ] || { echo "ERROR: task_id or editor_url missing from queue file"; exit 1; }
echo "SA_TASK_ID=$TASK_ID"

TMP_DIR="$HOME/.dev-browser/tmp"
mkdir -p "$TMP_DIR"

# Stage scrape script as content. We strip its outer arrow-fn wrapper so dev-browser
# can eval it as a function body; the existing script triggers a download via Blob+anchor,
# which we don't want in dev-browser context — instead we'll ignore that side effect and
# pull `content` out of the eval scope. Simplest: read script verbatim, then in the
# page-side wrapper invoke it AND grab `content` via a leak (declare globally).
SCRAPE_SRC_NAME="scrape-superannotate.js"
cp "$LIZARD_DIR/scripts/scrape-superannotate.js" "$TMP_DIR/$SCRAPE_SRC_NAME"

START=$(date +%s)
SCRAPE_OUT="$TMP_DIR/sa-scrape-$STEM.json"

dev-browser --connect --timeout 120 <<DBSCRIPT
const EDITOR_URL = "${EDITOR_URL}";
const SCRAPE_SRC_NAME = "${SCRAPE_SRC_NAME}";

const page = await browser.getPage("sa-lizard-job0");
await page.goto(EDITOR_URL, { waitUntil: "domcontentloaded" });

// Wait for iframe + status log populated at expected position + img src loaded.
// STATUS_LOG_TEXT lives at textareas[3 + n*10 + 1] (per scrape-superannotate.js).
// img src is an AWS pre-signed URL (~1500 chars with query string) — wait until
// it includes "?" so we don't capture a partial src.
await page.waitForFunction(() => {
  const ifr = document.querySelector('iframe.custom-llm') || document.querySelector('iframe[src*="custom-llm"]');
  if (!ifr || !ifr.contentDocument) return false;
  const doc = ifr.contentDocument;
  const qcCount = Array.from(doc.querySelectorAll('p.title')).filter(p => p.textContent.trim() === 'QC').length;
  if (qcCount < 1) return false;
  const tas = Array.from(doc.querySelectorAll('textarea'));
  // n = qcCount; status log textarea index = 3 + n*10 + 1 = 4 + n*10
  const statusLogIdx = 4 + qcCount * 10;
  const statusLog = tas[statusLogIdx]?.value || '';
  if (!statusLog || statusLog.length < 20) return false;  // need real status content
  const img = doc.querySelector('img');
  if (!img || !img.src || !img.src.includes('?')) return false;
  return true;
}, null, { timeout: 90000 });
await new Promise(r => setTimeout(r, 2000));

const scrapeSrc = await readFile(SCRAPE_SRC_NAME);

// The scrape script body is an IIFE-style arrow fn: `() => { ... }`.
// Wrap it so we get its return value AND skip the Blob/anchor download path.
// Strategy: monkeypatch document.body.appendChild on the inner arrow fn's a-tag,
// but simpler — just eval the script, capture its return, then ignore download.
const result = await page.evaluate((src) => {
  // Monkey-patch URL.createObjectURL to no-op so the download trigger is silent.
  const _createUrl = URL.createObjectURL;
  URL.createObjectURL = () => 'blob:noop';
  // We also want the raw content string, not just the metadata return. Patch
  // Blob constructor to capture the content text passed to it.
  let capturedContent = null;
  const _Blob = window.Blob;
  window.Blob = function(parts, opts) {
    if (Array.isArray(parts) && typeof parts[0] === 'string' && parts[0].startsWith('TASK_ID:')) {
      capturedContent = parts[0];
    }
    return new _Blob(parts, opts);
  };
  let meta;
  try {
    meta = eval('(' + src + ')()');
  } finally {
    URL.createObjectURL = _createUrl;
    window.Blob = _Blob;
  }
  return { meta, content: capturedContent };
}, scrapeSrc);

if (!result.meta || !result.meta.ok) {
  console.log("OK=false");
  console.log("ERROR=" + JSON.stringify(result.meta));
  process.exit(1);
}
if (!result.content) {
  console.log("OK=false");
  console.log("ERROR=content not captured (Blob patch missed)");
  process.exit(1);
}

console.log("OK=true");
console.log("N_ANNOTATIONS=" + result.meta.n_annotations);
console.log("IMAGE_URL=" + result.meta.image_url);
console.log("CONTENT_LEN=" + result.content.length);

// Write content + meta to a tmp JSON for shell to pick up.
await writeFile("sa-scrape-out.json", JSON.stringify({
  meta: result.meta,
  content: result.content,
}));
DBSCRIPT

# Pull staged output back.
SCRAPE_JSON="$TMP_DIR/sa-scrape-out.json"
[ -f "$SCRAPE_JSON" ] || { echo "ERROR: dev-browser did not write sa-scrape-out.json"; exit 1; }

CONTENT=$(node -e 'process.stdout.write(JSON.parse(require("fs").readFileSync("'"$SCRAPE_JSON"'","utf8")).content)')
SCRAPE_PATH="$LIZARD_DIR/scrapes/$STEM.txt"
mkdir -p "$LIZARD_DIR/scrapes"
printf '%s' "$CONTENT" > "$SCRAPE_PATH"
echo "SCRAPE_PATH=$SCRAPE_PATH"

# Image fetch (skip if exists). Pull URL from scrape file (full pre-signed URL),
# NOT from meta.image_url — empirically meta.image_url can be truncated
# vs the IMAGE_URL line in content (likely Angular re-render between var capture
# and Blob construction; codified 2026-05-06).
IMG_URL=$(grep '^IMAGE_URL:' "$SCRAPE_PATH" | cut -d' ' -f2-)
EXT=$(basename "${IMG_URL%%\?*}" | awk -F. '{print $NF}')
IMG_PATH="$LIZARD_DIR/screenshots/$STEM.$EXT"
mkdir -p "$LIZARD_DIR/screenshots"
if [ -f "$IMG_PATH" ]; then
  echo "IMAGE_PATH=$IMG_PATH (exists, reused)"
else
  curl -fsSL -o "$IMG_PATH" "$IMG_URL"
  echo "IMAGE_PATH=$IMG_PATH"
fi

WALL=$(($(date +%s) - START))
echo "WALL_SECONDS=$WALL"
