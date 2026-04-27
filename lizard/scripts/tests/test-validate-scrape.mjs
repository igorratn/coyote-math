#!/usr/bin/env node
// test-validate-scrape.mjs
// Unit test for scripts/validate-scrape.mjs.
//
// Background: 2026-04-25 batch had 5 of 6 Scrum cycle-2 scrapes silently
// broken. Two failure modes:
//   (a) STATUS_LOG_TEXT section empty (Scrum_57/59/74) — partial scrape
//   (b) status_log only had 1 cycle event for a cycle-2 stem (Scrum_47/53)
//       — annotator never submitted cycle-2, OR scraper grabbed cycle-1 prompt
// Reviewers ran on stale data; verdicts were invalid. No validator caught it.
// This test guards each failure mode + happy paths.
//
// Usage: node scripts/tests/test-validate-scrape.mjs

import '../log-ts.mjs';
import { mkdtempSync, writeFileSync, rmSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';
import { startTest, step, endTest, assert } from './test-helpers.mjs';
import { validateScrape } from '../validate-scrape.mjs';

startTest('validate-scrape: scrape-completeness checks');

const TMP = mkdtempSync(join(tmpdir(), 'lizard-validate-scrape-'));
let probeIdx = 0;
function writeScrape(content) {
  const p = join(TMP, `scrape-${probeIdx++}.txt`);
  writeFileSync(p, content, 'utf8');
  return p;
}

// Helper: build a synthetic scrape with knobs.
function buildScrape({
  taskId = '187111000',
  nAnnots = 1,
  promptLen = 100,
  emptyStatusLog = false,
  submissionCount = 1,  // how many "to: Submit_to_QC" lines in status_log
  omitTaskId = false,
} = {}) {
  const lines = [];
  if (!omitTaskId) lines.push(`TASK_ID: ${taskId}`);
  lines.push(`SA_TASK_FILENAME: test.json`);
  lines.push(`IMAGE_URL: http://example.com/test.png`);
  lines.push(`N_ANNOTATIONS: ${nAnnots}`);
  if (emptyStatusLog) {
    lines.push(`STATUS_LOG_LEN: `);
    lines.push(`STATUS_LOG_TEXT: `);
  } else {
    lines.push(`STATUS_LOG_LEN: 200`);
    lines.push(`STATUS_LOG_TEXT: 16 Apr 2026, 18:00:00 | x@y.com | from: InProgress, to: Submit_to_QC`);
  }
  lines.push('');
  for (let i = 1; i <= nAnnots; i++) {
    lines.push(`=== ANNOTATION ${i} ===`);
    lines.push(`SKILLS: Logical Reasoning, MCQ`);
    lines.push(`QTYPE: MCQ`);
    lines.push(`MODEL_GENERATED_ANSWER: A`);
    lines.push(`ANSWER: B`);
    lines.push(`STUMPED: True`);
    lines.push(`WORK_RATING: disapprove`);
    lines.push(``);
    lines.push(`--- PROMPT ---`);
    lines.push('x'.repeat(promptLen));  // synthetic prompt of given length
    lines.push(``);
    lines.push(`--- QC_FEEDBACK ---`);
    lines.push(``);
  }
  lines.push(`=== STATUS_LOG_TEXT ===`);
  if (emptyStatusLog) {
    lines.push(``);
  } else {
    for (let i = 0; i < submissionCount; i++) {
      lines.push(`${16 + i} Apr 2026, 18:00:00 | x@y.com | from: InProgress, to: Submit_to_QC`);
    }
  }
  return lines.join('\n');
}

// ---------- Happy paths ----------

step('cycle-1 scrape with full data → ok', () => {
  const p = writeScrape(buildScrape({ submissionCount: 1 }));
  const r = validateScrape(p, { cycle: 1 });
  assert(r.ok, `expected ok, got: ${r.reason}`);
});

step('cycle-2 scrape with 2 submissions → ok', () => {
  const p = writeScrape(buildScrape({ submissionCount: 2 }));
  const r = validateScrape(p, { cycle: 2 });
  assert(r.ok, `expected ok, got: ${r.reason}`);
});

step('multi-annotation scrape → ok', () => {
  const p = writeScrape(buildScrape({ nAnnots: 5, submissionCount: 2 }));
  const r = validateScrape(p, { cycle: 2 });
  assert(r.ok, `expected ok, got: ${r.reason}`);
});

// ---------- Failure mode A: empty STATUS_LOG_TEXT (Scrum_57/59/74) ----------

step('empty STATUS_LOG_LEN → fail', () => {
  const p = writeScrape(buildScrape({ emptyStatusLog: true }));
  const r = validateScrape(p, { cycle: 1 });
  assert(!r.ok, 'expected fail');
  assert(/STATUS_LOG_LEN/.test(r.reason), `expected STATUS_LOG_LEN reason, got: ${r.reason}`);
});

// ---------- Failure mode B: cycle-2 with only 1 submission (Scrum_47/53) ----------

step('cycle-2 stem with 1 submission → fail (stale)', () => {
  const p = writeScrape(buildScrape({ submissionCount: 1 }));
  const r = validateScrape(p, { cycle: 2 });
  assert(!r.ok, 'expected fail');
  assert(/stale|submission/.test(r.reason), `expected stale/submission reason, got: ${r.reason}`);
});

step('cycle-1 stem with 1 submission → ok (cycle-1 expected)', () => {
  const p = writeScrape(buildScrape({ submissionCount: 1 }));
  const r = validateScrape(p, { cycle: 1 });
  assert(r.ok, `cycle-1 should pass with 1 submission, got: ${r.reason}`);
});

// ---------- Other validation cases ----------

step('missing TASK_ID → fail', () => {
  const p = writeScrape(buildScrape({ omitTaskId: true }));
  const r = validateScrape(p);
  assert(!r.ok && /TASK_ID/.test(r.reason), `got: ${r.reason}`);
});

step('annotation with short prompt (<30 chars) → fail', () => {
  const p = writeScrape(buildScrape({ promptLen: 10 }));
  const r = validateScrape(p);
  assert(!r.ok && /PROMPT/.test(r.reason), `got: ${r.reason}`);
});

step('N_ANNOTATIONS mismatch → fail', () => {
  // Build scrape that says N_ANNOTATIONS:3 but only has 1 actual block
  const txt = buildScrape({ nAnnots: 1 }).replace('N_ANNOTATIONS: 1', 'N_ANNOTATIONS: 3');
  const p = writeScrape(txt);
  const r = validateScrape(p);
  assert(!r.ok && /N_ANNOTATIONS|blocks/.test(r.reason), `got: ${r.reason}`);
});

step('missing file → fail with code 1', () => {
  const r = validateScrape('/tmp/this-does-not-exist-xyz.txt');
  assert(!r.ok && r.code === 1, `expected code 1, got code=${r.code}`);
});

// Cleanup
try { rmSync(TMP, { recursive: true, force: true }); } catch {}

endTest();
