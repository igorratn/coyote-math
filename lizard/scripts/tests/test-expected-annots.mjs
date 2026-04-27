#!/usr/bin/env node
// test-expected-annots.mjs
// Unit test for the EXPECTED_ANNOTS dedupe logic in run-job2.mjs.
//
// Bug history (2026-04-24): run-job2.mjs computed EXPECTED_ANNOTS as
//   (text.match(/^##+\s+(?:Cycle\s*2\s*—\s*)?Annotation\s+\d+\b/gm) ?? []).length
// which double-counted cycle-2 skeletons that contain BOTH `## Annotation 1` AND
// `## Cycle 2 — Annotation 1` for the same N. Fix:
//   new Set([...text.matchAll(re)].map(m => parseInt(m[1], 10))).size
// This test asserts the fix on synthetic inputs. No fixture, no API, <1s.
//
// Rule (per feedback_bug_requires_fix_and_test.md): every bug must get a
// regression test. This is the test for that bug.
//
// Usage: node scripts/tests/test-expected-annots.mjs

import '../log-ts.mjs';
import { startTest, step, endTest, assert } from './test-helpers.mjs';

// The exact logic from run-job2.mjs — kept inline here so this test is
// self-contained. If run-job2.mjs's regex changes, update this too (or
// refactor both to import a shared helper).
function countUniqueAnnots(text) {
  return new Set(
    [...text.matchAll(/^##+\s+(?:Cycle\s*2\s*—\s*)?Annotation\s+(\d+)\b/gm)].map(m => parseInt(m[1], 10))
  ).size;
}

startTest('expected_annots: skeleton header dedupe');

step('empty text → 0', () => {
  assert(countUniqueAnnots('') === 0, `expected 0, got ${countUniqueAnnots('')}`);
});

step('cycle 1 skeleton (plain headers) counts correctly', () => {
  const t = `
## Task Info
foo

## Annotation 1
body

## Annotation 2
body
`;
  const n = countUniqueAnnots(t);
  assert(n === 2, `expected 2, got ${n}`);
});

step('cycle 2 skeleton with BOTH plain + Cycle 2 header for same N → dedupes to 1', () => {
  // This is the exact bug scenario from 2026-04-24. Scrum_6's skeleton had
  // both forms for every annotation. Old code counted it as 2; fix counts as 1.
  const t = `
## Annotation 1
prior cycle content

## Cycle 2 — Annotation 1
rewrite for cycle 2
`;
  const n = countUniqueAnnots(t);
  assert(n === 1, `expected 1 (same annotation, two header forms), got ${n}`);
});

step('cycle 2 skeleton with 3 annots, each having both header forms → 3', () => {
  const t = `
## Annotation 1
x

## Cycle 2 — Annotation 1
x

## Annotation 2
x

## Cycle 2 — Annotation 2
x

## Annotation 3
x

## Cycle 2 — Annotation 3
x
`;
  const n = countUniqueAnnots(t);
  assert(n === 3, `expected 3 unique annots, got ${n}`);
});

step('mixed h2/h3 headers (##, ###) both count', () => {
  const t = `
## Annotation 1
x

### Annotation 2
x
`;
  const n = countUniqueAnnots(t);
  assert(n === 2, `expected 2 (h2 + h3 should both match), got ${n}`);
});

step('em-dash variant in "Cycle 2 —" dedupes correctly', () => {
  // The regex accepts `Cycle 2 — Annotation N` with optional spaces.
  const t = `
## Annotation 5

## Cycle 2 — Annotation 5

##  Cycle 2  —  Annotation 5
`;
  const n = countUniqueAnnots(t);
  assert(n === 1, `expected 1 (all three point at annot 5), got ${n}`);
});

step('duplicate plain headers for same N still dedupe', () => {
  // Shouldn't happen in practice, but Set-based dedupe should handle it.
  const t = `
## Annotation 1
first

## Annotation 1
duplicate (malformed skeleton)
`;
  const n = countUniqueAnnots(t);
  assert(n === 1, `expected 1 (dedupe identical headers), got ${n}`);
});

step('non-annotation h2 headers do NOT count', () => {
  const t = `
## Task Info
x

## Image description
x

## Read-First Observations
x

## Annotation 1
x
`;
  const n = countUniqueAnnots(t);
  assert(n === 1, `expected 1 (only real Annotation header), got ${n}`);
});

step('header must be at line start — mid-line "## Annotation 1" ignored', () => {
  const t = `
Some prose talking about ## Annotation 1 but not a real header.

## Annotation 2
real one
`;
  const n = countUniqueAnnots(t);
  assert(n === 1, `expected 1 (only the real line-start header), got ${n}`);
});

endTest();
