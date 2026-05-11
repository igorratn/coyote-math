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

PROJECT_ID=$(echo "$EDITOR_URL" | sed -E 's|.*/editor/[0-9]+/([0-9]+)/.*|\1|')
[ -n "$PROJECT_ID" ] || PROJECT_ID=290044

dev-browser --connect --timeout 120 <<DBSCRIPT
const EDITOR_URL = "${EDITOR_URL}";
const SCRAPE_SRC_NAME = "${SCRAPE_SRC_NAME}";
const STEM = "${STEM}";
const PROJECT_ID = "${PROJECT_ID}";

const page = await browser.getPage("sa-lizard-job0");
await page.goto(EDITOR_URL, { waitUntil: "domcontentloaded" });

// Stale-task_id fallback (codified 2026-05-10): if direct navigation lands on
// "Item unavailable" (SA reassigned the task_id since the queue refill captured
// it), navigate to the queue list and click the row by stem name to pick up
// the current assignment URL. Update the queue file with the fresh task_id.
await new Promise(r => setTimeout(r, 4000));
const unavailable = await page.evaluate(() => {
  const ifr = document.querySelector('iframe.custom-llm') || document.querySelector('iframe[src*="custom-llm"]');
  if (!ifr || !ifr.contentDocument) return false;
  return (ifr.contentDocument.body.innerText || '').includes('Item unavailable');
});
if (unavailable) {
  console.log("STALE_TASK_ID=true (Item unavailable on direct URL — falling back to queue-list click)");
  await page.goto(\`https://app.superannotate.com/35245/project/\${PROJECT_ID}/data?sort=name&direction=asc&status=6\`, { waitUntil: "domcontentloaded", timeout: 30000 });
  await new Promise(r => setTimeout(r, 4000));
  const clicked = await page.evaluate((stem) => {
    const trs = Array.from(document.querySelectorAll('tr'));
    for (const tr of trs) {
      const link = tr.querySelector('a[href*="/editor/"]');
      if (link && link.textContent.includes(stem)) {
        const href = link.href;
        link.click();
        return href;
      }
    }
    return null;
  }, STEM);
  if (!clicked) {
    console.log("OK=false");
    console.log("ERROR=stale task_id AND stem not found in queue list — possibly handed to another reviewer");
    process.exit(1);
  }
  console.log("NEW_EDITOR_URL=" + clicked);
  await writeFile("sa-fresh-url.txt", clicked);
  await new Promise(r => setTimeout(r, 4000));
}

// Wait for iframe + image loaded + sufficient textarea count.
// (Updated 2026-05-10: prior wait checked a hard-coded status-log index that
// SA layout moved; replaced with a coarse readiness check — the scrape script
// itself does the precise DOM mapping and returns ok:false if anything is
// missing. img src is an AWS pre-signed URL — wait until "?" appears so we
// don't capture a partial src.)
await page.waitForFunction(() => {
  const ifr = document.querySelector('iframe.custom-llm') || document.querySelector('iframe[src*="custom-llm"]');
  if (!ifr || !ifr.contentDocument) return false;
  const doc = ifr.contentDocument;
  const tas = doc.querySelectorAll('textarea');
  if (tas.length < 14) return false;  // header + at least 1 annot section (~10 + 4 = 14)
  // At least one textarea must hold the prompt or rewrite content (>= 50 chars).
  const hasContent = Array.from(tas).some(t => (t.value || '').length >= 50);
  if (!hasContent) return false;
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
# If stale-task_id fallback fired, also patch the queue file with the fresh
# editor_url + task_id picked up from the queue-list click.
FRESH_URL_FILE="$TMP_DIR/sa-fresh-url.txt"
if [ -f "$FRESH_URL_FILE" ]; then
  FRESH_URL=$(cat "$FRESH_URL_FILE")
  FRESH_TASK_ID=$(echo "$FRESH_URL" | sed -E 's|.*/editor/[0-9]+/[0-9]+/([0-9]+).*|\1|')
  if [ -n "$FRESH_TASK_ID" ] && [ "$FRESH_TASK_ID" != "$TASK_ID" ]; then
    echo "STALE_TASK_ID_FIXED: $TASK_ID → $FRESH_TASK_ID"
    node -e '
      const fs = require("fs");
      const p = "'"$QUEUE_FILE"'";
      const o = JSON.parse(fs.readFileSync(p, "utf8"));
      o.task_id = "'"$FRESH_TASK_ID"'";
      o.editor_url = "'"$FRESH_URL"'";
      fs.writeFileSync(p + ".tmp", JSON.stringify(o, null, 2) + "\n");
      fs.renameSync(p + ".tmp", p);
    '
    TASK_ID="$FRESH_TASK_ID"
    EDITOR_URL="$FRESH_URL"
    echo "SA_TASK_ID=$TASK_ID (updated)"
  fi
  rm -f "$FRESH_URL_FILE"
fi

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
