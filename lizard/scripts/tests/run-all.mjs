#!/usr/bin/env node
// run-all.mjs — pre-flight gate for Job 2.
// Runs the two mandatory tests in order; exits non-zero if either fails.
//
// Usage: node scripts/tests/run-all.mjs
//
// Sequence:
//   1. test-expected-annots.mjs               (unit, <1s) — EXPECTED_ANNOTS dedupe regression
//   2. test-prefilter-anchor.mjs              (unit, <1s) — V6 anchor-skill rule (G1_NO_ANCHOR)
//   3. test-prefilter-letter-ban.mjs          (unit, <1s) — V6 letter/character counting ban
//   4. test-prefilter-historical-snapshot.mjs (unit, <1s) — full 16-stem batch flag matrix
//   5. test-flags-parser.mjs                  (unit, <1s) — closed-enum Flags normalizer
//   6. test-silent-drop.mjs                   (unit, <1s) — silent-drop guard (validator + merger)
//   7. test-pipeline.mjs                      (e2e, ~3min) — full 4-reviewer run on fixture

import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { spawnSync } from 'child_process';

const __dir = dirname(fileURLToPath(import.meta.url));

const TESTS = [
  'test-expected-annots.mjs',
  'test-prefilter-anchor.mjs',
  'test-prefilter-letter-ban.mjs',
  'test-prefilter-historical-snapshot.mjs',
  'test-flags-parser.mjs',
  'test-pick-best-verdict.mjs',
  'test-auto-resolve.mjs',
  'test-validate-scrape.mjs',
  'test-skeleton-freshness.mjs',
  'test-reviewer-view.mjs',
  'test-silent-drop.mjs',
  'test-prepare-job3b-helpers.mjs',
  'test-merger-verdict-guard.mjs',
  'test-reconcile-shadows.mjs',
  'test-chrome-debug-dismiss.py',
  'test-pipeline.mjs',
];

let anyFail = false;
const suiteStart = Date.now();

for (const f of TESTS) {
  const started = Date.now();
  const cmd = f.endsWith('.py') ? '/opt/homebrew/bin/python3.11' : 'node';
  const r = spawnSync(cmd, [join(__dir, f)], { stdio: 'inherit', timeout: 900_000 });
  const dur = ((Date.now() - started) / 1000).toFixed(1);
  const ok = r.status === 0;
  if (!ok) anyFail = true;
  process.stderr.write(`[run-all] ${ok ? 'PASS' : 'FAIL'} ${f} (${dur}s)\n`);
  if (!ok) {
    process.stderr.write(`[run-all] STOP — ${f} failed; fix before running Job 2\n`);
    process.exit(1);
  }
}

const total = ((Date.now() - suiteStart) / 1000).toFixed(1);
process.stderr.write(`[run-all] all tests passed (${total}s)\n`);
process.exit(0);
