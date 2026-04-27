#!/usr/bin/env node
// test-merger-verdict-guard.mjs
// Regression test: job2-merge.mjs must refuse to overwrite tasks/<stem>.md
// when the existing file contains '#### Igor Verdict' blocks.
//
// Bug history (2026-04-25):
//   Merger rewrites tasks/<stem>.md from scratch on every run. If Job 3a has
//   already appended Igor Verdict blocks, a re-merge silently wipes them and
//   the only record of Igor's per-annot decisions is gone. Mitigation today:
//   re-append by hand. Guard added 2026-04-26 to refuse the overwrite.
//
// This test guards against accidental removal of the guard. It is a source-
// inspection test (not an integration test), kept simple per Igor's "simplest
// possible check" directive.

import { readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dir = dirname(fileURLToPath(import.meta.url));
const MERGER = join(__dir, '..', 'job2-merge.mjs');

const src = readFileSync(MERGER, 'utf8');

let failed = 0;
const fail = (msg) => { console.error(`  FAIL: ${msg}`); failed++; };
const pass = (msg) => { console.error(`  ok:   ${msg}`); };

// 1. The literal verdict marker must appear in a guard condition.
if (src.includes(`includes('#### Igor Verdict')`)) {
  pass('guard literal "#### Igor Verdict" present in job2-merge.mjs');
} else {
  fail('guard string `includes(\'#### Igor Verdict\')` missing — re-merge could wipe Job 3a verdicts');
}

// 2. Guard must exit non-zero (process.exit(1)) on the verdict-found path.
//    Easiest robust check: the guard block must contain both the marker and a process.exit(1).
const idx = src.indexOf(`includes('#### Igor Verdict')`);
if (idx >= 0) {
  const window = src.slice(idx, idx + 600);
  if (/process\.exit\(1\)/.test(window)) {
    pass('guard exits non-zero when verdict blocks present');
  } else {
    fail('guard found but does not call process.exit(1) within 600 chars — re-merge may not actually halt');
  }
}

if (failed) {
  console.error(`\n[test-merger-verdict-guard] ${failed} FAIL`);
  process.exit(1);
}
console.error(`\n[test-merger-verdict-guard] all PASS`);
