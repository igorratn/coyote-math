#!/usr/bin/env bash
# sa-request-tasks.sh — click "Request tasks" in SA V6 queue page, then read
# the refreshed list of eligible status=6 rows.
#
# Codified 2026-05-10 (Igor): SA's V6 queue may not auto-populate; reviewers
# must click "Request tasks" to pull new items from the project pool. ALWAYS
# click "Request tasks" before reading the queue, otherwise the queue may
# appear empty even when new stems are available.
#
# This script ALSO auto-skips any status=4 (Annotator_Skipped) stems with the
# default disposition "Valid Skip to Skipped" before reading status=6 (Igor
# 2026-05-10 rule: status=4 always auto-skipped, no scrape/analysis).
#
# Usage:
#   bash scripts/sa-request-tasks.sh
#
# Output: JSON array of eligible status=6 rows on stdout (each {stem, name,
# task_id, editor_url, status}).
set -e

PROJECT_ID="${PROJECT_ID:-290044}"
LIZARD_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

# First, auto-clear any status=4 backlog with default disposition.
echo "[sa-request-tasks] auto-skipping status=4 backlog first..." >&2
bash "$LIZARD_DIR/scripts/auto-skip-status4.sh" >&2 || echo "[sa-request-tasks] WARN: auto-skip-status4 failed (continuing)" >&2

dev-browser --connect --timeout 90 <<DBSCRIPT
const page = await browser.getPage("sa-lizard-queue");
await page.goto("https://app.superannotate.com/35245/project/${PROJECT_ID}/data?sort=name&direction=asc&status=6", { waitUntil: "domcontentloaded", timeout: 60000 });
await new Promise(r => setTimeout(r, 4000));

// Click "Request tasks" — pulls new items from the project pool into reviewer's
// personal queue. Without this click, the queue may show no new rows even when
// items are available at the project level.
const clicked = await page.evaluate(() => {
  const btn = Array.from(document.querySelectorAll('button')).find(b => (b.innerText || '').trim() === 'Request tasks' && b.offsetParent !== null && !b.disabled);
  if (!btn) return false;
  btn.click();
  return true;
});
console.log("REQUEST_TASKS_CLICKED=" + clicked);

// Wait for the new rows to load. SA queue refreshes async after Request tasks.
await new Promise(r => setTimeout(r, 5000));

// Read the (possibly-refreshed) queue rows.
const rows = await page.evaluate(() => {
  const trs = Array.from(document.querySelectorAll('tr'));
  const out = [];
  for (const tr of trs) {
    const link = tr.querySelector('a[href*="/editor/"]');
    if (!link) continue;
    const cells = Array.from(tr.querySelectorAll('td')).map(c => c.textContent.trim());
    const status = link.href.match(/status=(\\d+)/)?.[1] || '?';
    const taskId = link.href.match(/\\/editor\\/[0-9]+\\/[0-9]+\\/(\\d+)/)?.[1];
    if (status !== '6' || cells[1] === 'return_to_QC_by_NV') continue;
    const stem = cells[0].replace(/\\.json\$/, '');
    out.push({ stem, name: cells[0], task_id: taskId, editor_url: link.href, status });
  }
  return out;
});
console.log("ROWS_JSON=" + JSON.stringify(rows));
DBSCRIPT
