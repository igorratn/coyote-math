#!/usr/bin/env node
// test-flags-parser.mjs
// Unit test for the closed-enum **Flags:** parser in scripts/job2-merge.mjs.
//
// Per templates/review-prompt.md, every reviewer must emit a structured
//   - **Flags:** [G1, Type 7, IMAGE_UNREADABLE]
// line per annotation. The merger parses it via:
//   1. regex /^\s*-?\s*\*\*Flags:\*\*\s*\[([^\]]*)\]/mi
//   2. comma-split the bracket contents
//   3. normalizeFlag() canonicalizes each entry against VALID_FLAGS (18 codes)
//   4. invalid entries silently dropped (validator at run-job2 layer catches
//      malformed *files*; the parser only sees survivors)
//
// What this test guards:
//   - Closed enum membership (18 canonical codes, no others)
//   - Loose-form normalization: TYPE7 → Type 7, g1 → G1, image-unreadable → IMAGE_UNREADABLE
//   - Junk silently dropped (FOO → null)
//   - Empty list parses to []
//   - Missing **Flags:** field surfaces flagsMissing=true
//
// Usage: node scripts/tests/test-flags-parser.mjs

import '../log-ts.mjs';
import { startTest, step, endTest, assert } from './test-helpers.mjs';
import {
  VALID_FLAGS, normalizeFlag, parseReviewerOutput,
} from '../job2-merge.mjs';

startTest('flags-parser: closed-enum normalize + parseReviewerOutput');

// ---- Layer 1: VALID_FLAGS membership ----

step('VALID_FLAGS has exactly 18 codes', () => {
  assert(VALID_FLAGS.size === 18, `expected 18, got ${VALID_FLAGS.size}`);
});

step('VALID_FLAGS contains all 5 G-codes', () => {
  for (const c of ['G1', 'G2', 'G3', 'G4', 'G5']) {
    assert(VALID_FLAGS.has(c), `missing ${c}`);
  }
});

step('VALID_FLAGS contains all 12 Type codes', () => {
  for (let i = 1; i <= 12; i++) {
    const c = `Type ${i}`;
    assert(VALID_FLAGS.has(c), `missing ${c}`);
  }
});

step('VALID_FLAGS contains IMAGE_UNREADABLE', () => {
  assert(VALID_FLAGS.has('IMAGE_UNREADABLE'), 'missing IMAGE_UNREADABLE');
});

step('VALID_FLAGS rejects out-of-enum codes', () => {
  for (const bad of ['Type 0', 'Type 13', 'G0', 'G6', 'image_unreadable', 'TYPE7']) {
    assert(!VALID_FLAGS.has(bad), `unexpected ${bad} in enum`);
  }
});

// ---- Layer 2: normalizeFlag ----

step('normalizeFlag passes canonical forms unchanged', () => {
  assert(normalizeFlag('G1') === 'G1', 'G1');
  assert(normalizeFlag('Type 7') === 'Type 7', 'Type 7');
  assert(normalizeFlag('IMAGE_UNREADABLE') === 'IMAGE_UNREADABLE', 'IMAGE_UNREADABLE');
});

step('normalizeFlag canonicalizes TYPE7 / type7 / Type-7 → Type 7', () => {
  assert(normalizeFlag('TYPE7') === 'Type 7', `TYPE7 → ${normalizeFlag('TYPE7')}`);
  assert(normalizeFlag('type7') === 'Type 7', `type7 → ${normalizeFlag('type7')}`);
  assert(normalizeFlag('Type-7') === 'Type 7', `Type-7 → ${normalizeFlag('Type-7')}`);
  assert(normalizeFlag('type 7') === 'Type 7', `type 7 → ${normalizeFlag('type 7')}`);
});

step('normalizeFlag canonicalizes g1 / G1 → G1', () => {
  assert(normalizeFlag('g1') === 'G1', `g1 → ${normalizeFlag('g1')}`);
  assert(normalizeFlag('G 5') === 'G5', `G 5 → ${normalizeFlag('G 5')}`);
});

step('normalizeFlag canonicalizes IMAGE_UNREADABLE variants', () => {
  assert(normalizeFlag('image_unreadable') === 'IMAGE_UNREADABLE', 'image_unreadable');
  assert(normalizeFlag('image-unreadable') === 'IMAGE_UNREADABLE', 'image-unreadable');
  assert(normalizeFlag('Image Unreadable') === 'IMAGE_UNREADABLE', 'Image Unreadable');
});

step('normalizeFlag returns null for junk', () => {
  for (const bad of ['FOO', 'bar', '', 'Type 0', 'Type 13', 'G0', 'G6', 'random']) {
    const got = normalizeFlag(bad);
    assert(got === null, `expected null for "${bad}", got "${got}"`);
  }
});

// ---- Layer 3: parseReviewerOutput end-to-end ----

const buildReview = (annots) => [
  '## Read-First Observations',
  '- stub',
  '',
  ...annots.flatMap(({ n, flagsLine, rating = 'thumbs-up' }) => [
    `## Annotation ${n}`,
    '',
    `- **Rating:** ${rating}`,
    `- **Final Rewrite Answer:** A`,
    flagsLine,  // pass through verbatim
    '',
    '### Two-Part Check',
    'OK.',
    '',
  ]),
  '## Fix List',
  '- None',
].join('\n');

step('parseReviewerOutput: empty Flags list → flags=[]', () => {
  const txt = buildReview([{ n: 1, flagsLine: '- **Flags:** []' }]);
  const parsed = parseReviewerOutput(txt);
  const a = parsed.annotations.get(1);
  assert(a, 'no annotation 1 parsed');
  assert(Array.isArray(a.flags) && a.flags.length === 0, `expected [], got ${JSON.stringify(a.flags)}`);
  assert(a.flagsMissing === false, 'flagsMissing should be false when [] present');
});

step('parseReviewerOutput: canonical Flags → preserved', () => {
  const txt = buildReview([{ n: 1, flagsLine: '- **Flags:** [G1, Type 7, IMAGE_UNREADABLE]' }]);
  const parsed = parseReviewerOutput(txt);
  const a = parsed.annotations.get(1);
  assert(JSON.stringify(a.flags) === JSON.stringify(['G1', 'Type 7', 'IMAGE_UNREADABLE']),
    `got ${JSON.stringify(a.flags)}`);
});

step('parseReviewerOutput: loose Flags → normalized', () => {
  const txt = buildReview([{ n: 1, flagsLine: '- **Flags:** [g1, TYPE7, image-unreadable]' }]);
  const parsed = parseReviewerOutput(txt);
  const a = parsed.annotations.get(1);
  assert(JSON.stringify(a.flags) === JSON.stringify(['G1', 'Type 7', 'IMAGE_UNREADABLE']),
    `got ${JSON.stringify(a.flags)}`);
});

step('parseReviewerOutput: junk codes silently dropped', () => {
  const txt = buildReview([{ n: 1, flagsLine: '- **Flags:** [G1, FOO, Type 7, garbage]' }]);
  const parsed = parseReviewerOutput(txt);
  const a = parsed.annotations.get(1);
  assert(JSON.stringify(a.flags) === JSON.stringify(['G1', 'Type 7']),
    `expected junk dropped, got ${JSON.stringify(a.flags)}`);
});

step('parseReviewerOutput: missing **Flags:** line → flagsMissing=true, flags=[]', () => {
  const txt = buildReview([{ n: 1, flagsLine: '' }]);  // no Flags line
  const parsed = parseReviewerOutput(txt);
  const a = parsed.annotations.get(1);
  assert(a.flagsMissing === true, `expected flagsMissing=true, got ${a.flagsMissing}`);
  assert(a.flags.length === 0, `expected flags=[], got ${JSON.stringify(a.flags)}`);
});

step('parseReviewerOutput: multiple annots, mixed Flags', () => {
  const txt = buildReview([
    { n: 1, flagsLine: '- **Flags:** [G1]' },
    { n: 2, flagsLine: '- **Flags:** []' },
    { n: 3, flagsLine: '- **Flags:** [Type 3, IMAGE_UNREADABLE]' },
  ]);
  const parsed = parseReviewerOutput(txt);
  assert(JSON.stringify(parsed.annotations.get(1).flags) === JSON.stringify(['G1']));
  assert(parsed.annotations.get(2).flags.length === 0);
  assert(JSON.stringify(parsed.annotations.get(3).flags) === JSON.stringify(['Type 3', 'IMAGE_UNREADABLE']));
});

step('parseReviewerOutput: parses Rating + Final Rewrite Answer alongside Flags', () => {
  const txt = buildReview([{
    n: 1,
    flagsLine: '- **Flags:** [G1]',
    rating: 'thumbs-down',
  }]);
  const parsed = parseReviewerOutput(txt);
  const a = parsed.annotations.get(1);
  assert(a.rating === 'thumbs-down', `rating=${a.rating}`);
  assert(a.finalAnswer === 'A', `finalAnswer=${a.finalAnswer}`);
});

endTest();
