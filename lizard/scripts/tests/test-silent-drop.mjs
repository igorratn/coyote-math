#!/usr/bin/env node
// test-silent-drop.mjs
// Regression test for: 2026-04-23 "silent reviewer drop" incident.
//
// Original failure mode (cycle-1 architecture):
//   A reviewer wrote an output file, subprocess exited 0, but the file didn't
//   contain any `## Annotation N` headers. run-job2 counted this as success
//   and job2-merge silently skipped the reviewer.
//
// Current architecture (2026-04-24, first-verdict-wins):
//   - Quorum is gone (MIN_REVIEWERS removed). Defense lives entirely in
//     run-job2.validateReviewerOutput, which rejects bad output as bad_output
//     before the merger sees it.
//   - Two silent-drop modes are now guarded: (a) zero `## Annotation N`
//     headers, (b) any annotation block missing the required `**Flags:**` field.
//   - The merger walks reviewers in order; first parseable Rating wins. With
//     only one good reviewer, the test asserts that reviewer's verdict ends up
//     in the task file for every annot.
//
// This test does NOT call any model API — it injects synthetic reviewer outputs.

import { writeFileSync, existsSync, readFileSync } from 'fs';
import { join } from 'path';
import { spawnSync } from 'child_process';
import {
  LIZARD_DIR, FIXTURE_STEM, startTest, step, endTest, freshTmpDir, assert,
  parseAnnotations,
} from './test-helpers.mjs';

startTest(`regression: silent reviewer drop (2026-04-23 gpt incident)`);

// Stub outputs — deliberately malformed in different ways.
const STUB_EMPTY         = '# Empty stub\n\nNo annotations here at all.\n';
const STUB_PLURAL        = '# Review\n\n## Annotations\n\nAll good.\n';

// "Has annotation header but no Flags field" — the new silent-drop mode.
const stubMissingFlags = (stem, ns) => [
  `# Review: ${stem}`,
  '',
  '## Read-First Observations',
  '- stub',
  '',
  ...ns.flatMap(n => [
    `## Annotation ${n}`,
    '',
    `- **Rating:** thumbs-up`,
    `- **Final Rewrite Answer:** ${n}`,
    // intentionally missing **Flags:** line
    '',
    `### Two-Part Check`,
    'OK.',
    '',
  ]),
  '## Fix List',
  '- None',
  '',
].join('\n');

// Fully well-formed output (used as the "winner" reviewer).
const goodOutput = (stem, ns, rating) => [
  `# Review: ${stem}`,
  '',
  '## Read-First Observations',
  '- stub',
  '',
  ...ns.flatMap(n => [
    `## Annotation ${n}`,
    '',
    `- **Rating:** ${rating}`,
    `- **Final Rewrite Answer:** ${n}`,
    `- **Flags:** []`,
    '',
    `### Two-Part Check`,
    'OK.',
    '',
  ]),
  '## Fix List',
  '- None',
  '',
].join('\n');

// Build a pseudo /tmp/lizard/<stem>/ dir with mixed-quality reviewer outputs.
const TEST_STEM = FIXTURE_STEM;
const fakeDir = freshTmpDir(`silent-drop-${TEST_STEM}`);

// Count annotations in real skeleton (fixture must exist)
const skelPath = join(LIZARD_DIR, 'tasks', 'skeleton', `${TEST_STEM}.md`);
const skelTxt = readFileSync(skelPath, 'utf8');
const uniqAnns = parseAnnotations(skelTxt);
assert(uniqAnns.length > 0, `fixture skeleton has 0 annotations — pick a different fixture`);

// Write stubs:
//   gpt    = empty stub (0 annotation headers — old silent-drop mode)
//   grok   = plural-heading stub (still 0 valid annotation headers)
//   gemini = annotations present but missing **Flags:** field (NEW silent-drop mode)
//   opus   = good
writeFileSync(join(fakeDir, 'gpt-review.md'),    STUB_EMPTY);
writeFileSync(join(fakeDir, 'grok-review.md'),   STUB_PLURAL);
writeFileSync(join(fakeDir, 'gemini-review.md'), stubMissingFlags(TEST_STEM, uniqAnns));
writeFileSync(join(fakeDir, 'opus-review.md'),   goodOutput(TEST_STEM, uniqAnns, 'thumbs-up'));

// ---- assertion 1: validator regex catches both silent-drop modes ----

step('validator regex parses gpt empty stub → 0 annotations', () => {
  const txt = readFileSync(join(fakeDir, 'gpt-review.md'), 'utf8');
  const ns = parseAnnotations(txt);
  assert(ns.length === 0, `gpt empty stub parsed to ${ns.length} annotations, expected 0`);
});

step('validator regex parses grok plural-heading stub → 0 annotations', () => {
  const txt = readFileSync(join(fakeDir, 'grok-review.md'), 'utf8');
  const ns = parseAnnotations(txt);
  assert(ns.length === 0, `grok stub parsed to ${ns.length} annotations, expected 0`);
});

step('validator detects missing **Flags:** field in gemini stub', () => {
  // Mirror the per-block check in run-job2.validateReviewerOutput.
  const txt = readFileSync(join(fakeDir, 'gemini-review.md'), 'utf8');
  const matches = [...txt.matchAll(/^##+\s+(?:Cycle\s*2\s*—\s*)?Annotation\s+(\d+)\b/gm)];
  assert(matches.length === uniqAnns.length, `gemini stub should have ${uniqAnns.length} headers`);
  const positions = matches.map(m => m.index);
  positions.push(txt.length);
  const missing = [];
  for (let i = 0; i < matches.length; i++) {
    const block = txt.slice(positions[i], positions[i + 1]);
    if (!/^\s*-?\s*\*\*Flags:\*\*\s*\[/mi.test(block)) {
      missing.push(parseInt(matches[i][1], 10));
    }
  }
  assert(missing.length === uniqAnns.length,
    `expected all ${uniqAnns.length} blocks to lack Flags field, got ${missing.length}`);
  return `${missing.length}/${uniqAnns.length} blocks correctly flagged as missing **Flags:**`;
});

// ---- assertion 2: merger with only opus parseable still produces verdicts ----

step('merger first-verdict-wins: opus alone covers every annot', () => {
  // The merger doesn't run a validator — it simply tries each reviewer in
  // REVIEWERS order. Since gpt/grok have 0 parseable annotation blocks and
  // gemini's blocks have no Rating-style fields parseable enough to win
  // (empty stub still parses partially though), we force REVIEWERS=opus to
  // simulate the realistic case: everyone else was rejected at validator,
  // only opus's output was passed to the merger.
  //
  // Under v2 auto-resolve rule, a single-reviewer 👍 auto-resolves (accepts
  // annotator's answer). So valid decisions here are pending-igor OR auto-resolved;
  // anything else (no_reviewer_output) means the verdict was lost.
  const r = spawnSync('node', [join(LIZARD_DIR, 'scripts', 'job2-merge.mjs')], {
    env: {
      ...process.env,
      STEM: TEST_STEM,
      LIZARD_DIR,
      REVIEWERS: 'opus',
      REVIEW_DIR: fakeDir,
    },
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  assert(r.status === 0, `merger exit=${r.status}; stderr:\n${(r.stderr ?? '').slice(-800)}`);

  const summary = JSON.parse(readFileSync(join(fakeDir, 'merge-summary.json'), 'utf8'));
  const VALID = new Set(['unchanged', 'pending-igor', 'auto-resolved']);
  const orphans = summary.per_annotation.filter(a => !VALID.has(a.decision));
  assert(orphans.length === 0,
    `expected every annot pending-igor or auto-resolved; got: ${orphans.map(a=>`A${a.n}=${a.decision}`).join(',')}`);
  const resolved = summary.per_annotation.filter(a =>
    a.decision === 'pending-igor' || a.decision === 'auto-resolved');
  const wrongReviewer = resolved.filter(a => a.reviewer !== 'opus');
  assert(wrongReviewer.length === 0,
    `expected all verdicts attributed to opus; got: ${wrongReviewer.map(a=>`A${a.n}=${a.decision}/${a.reviewer}`).join(',')}`);
  return `${resolved.length} annot(s) resolved, all attributed to opus`;
});

// ---- assertion 3: merger with NO parseable reviewer → no_reviewer_output ----

step('merger with all malformed reviewers → no_reviewer_output for each annot', () => {
  // gemini has annotation headers but blocks lack a Rating line, so
  // pickFirstVerdict returns null → decision === 'no_reviewer_output'.
  const r = spawnSync('node', [join(LIZARD_DIR, 'scripts', 'job2-merge.mjs')], {
    env: {
      ...process.env,
      STEM: TEST_STEM,
      LIZARD_DIR,
      REVIEWERS: 'gpt,grok',  // only the empty + plural stubs
      REVIEW_DIR: fakeDir,
    },
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  assert(r.status === 0, `merger exit=${r.status}`);
  const summary = JSON.parse(readFileSync(join(fakeDir, 'merge-summary.json'), 'utf8'));
  const nro = summary.per_annotation.filter(a => a.decision === 'no_reviewer_output');
  // Cycle-2 unchanged annots wouldn't be no_reviewer_output. Fixture is cycle-1
  // so every annot is mergeable.
  const expectedNoCov = summary.per_annotation.filter(a => a.decision !== 'unchanged').length;
  assert(nro.length === expectedNoCov,
    `expected ${expectedNoCov} annot(s) flagged no_reviewer_output, got ${nro.length}`);
  return `${nro.length}/${expectedNoCov} annot(s) correctly flagged no_reviewer_output`;
});

endTest();
