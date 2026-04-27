#!/usr/bin/env node
// test-pick-best-verdict.mjs
// Unit test for pickBestVerdictFromParsed in scripts/job2-merge.mjs.
//
// Per-annot verdict policy (2026-04-24, Igor):
//   - Iterate reviewers in fire order
//   - Return first reviewer with rating === 'thumbs-up' (any reviewer's 👍 wins)
//   - Else return first reviewer with rating === 'thumbs-down'
//   - Else null (no_reviewer_output)
//
// Pairs with parallel-fire model: both reviewers run, merger picks per-annot.
// A 👍 from anyone is enough — Igor only needs one model to vouch for the annot.
//
// Usage: node scripts/tests/test-pick-best-verdict.mjs

import '../log-ts.mjs';
import { startTest, step, endTest, assert } from './test-helpers.mjs';
import { pickBestVerdictFromParsed } from '../job2-merge.mjs';

startTest('pick-best-verdict: thumbs-up wins, else first thumbs-down');

// Build a parsedReviewersMap shaped like parseReviewerOutput's return value.
// Map<reviewerName, { annotations: Map<n, { rating, finalAnswer, flags, body }> }>
function makeParsed(spec) {
  const m = new Map();
  for (const [name, annots] of Object.entries(spec)) {
    const aMap = new Map();
    for (const [n, rating] of Object.entries(annots)) {
      aMap.set(parseInt(n, 10), {
        rating,
        finalAnswer: rating === 'thumbs-up' ? 'A' : null,
        flags: [],
        flagsMissing: false,
        body: `## Annotation ${n}\n- **Rating:** ${rating}\n`,
      });
    }
    m.set(name, { annotations: aMap });
  }
  return m;
}

step('single reviewer, thumbs-up → that reviewer picked', () => {
  const parsed = makeParsed({ gpt: { 1: 'thumbs-up' } });
  const got = pickBestVerdictFromParsed(parsed, ['gpt', 'opus'], 1);
  assert(got !== null && got.name === 'gpt', `got=${JSON.stringify(got)}`);
  assert(got.rating === 'thumbs-up', `rating=${got.rating}`);
});

step('single reviewer, thumbs-down → that reviewer picked', () => {
  const parsed = makeParsed({ gpt: { 1: 'thumbs-down' } });
  const got = pickBestVerdictFromParsed(parsed, ['gpt', 'opus'], 1);
  assert(got !== null && got.name === 'gpt', `got=${JSON.stringify(got)}`);
  assert(got.rating === 'thumbs-down', `rating=${got.rating}`);
});

step('gpt 👎 + opus 👍 → opus wins (thumbs-up beats thumbs-down)', () => {
  const parsed = makeParsed({
    gpt:  { 1: 'thumbs-down' },
    opus: { 1: 'thumbs-up' },
  });
  const got = pickBestVerdictFromParsed(parsed, ['gpt', 'opus'], 1);
  assert(got.name === 'opus', `expected opus, got ${got.name}`);
  assert(got.rating === 'thumbs-up', `rating=${got.rating}`);
});

step('gpt 👍 + opus 👎 → gpt wins (first thumbs-up in fire order)', () => {
  const parsed = makeParsed({
    gpt:  { 1: 'thumbs-up' },
    opus: { 1: 'thumbs-down' },
  });
  const got = pickBestVerdictFromParsed(parsed, ['gpt', 'opus'], 1);
  assert(got.name === 'gpt', `expected gpt, got ${got.name}`);
});

step('gpt 👍 + opus 👍 → gpt wins (first in fire order)', () => {
  const parsed = makeParsed({
    gpt:  { 1: 'thumbs-up' },
    opus: { 1: 'thumbs-up' },
  });
  const got = pickBestVerdictFromParsed(parsed, ['gpt', 'opus'], 1);
  assert(got.name === 'gpt', `expected gpt, got ${got.name}`);
});

step('gpt 👎 + opus 👎 → gpt wins (first thumbs-down in fire order)', () => {
  const parsed = makeParsed({
    gpt:  { 1: 'thumbs-down' },
    opus: { 1: 'thumbs-down' },
  });
  const got = pickBestVerdictFromParsed(parsed, ['gpt', 'opus'], 1);
  assert(got.name === 'gpt', `expected gpt, got ${got.name}`);
  assert(got.rating === 'thumbs-down', `rating=${got.rating}`);
});

step('no reviewer covers annot → null', () => {
  const parsed = makeParsed({ gpt: { 2: 'thumbs-up' } });  // covers 2, not 1
  const got = pickBestVerdictFromParsed(parsed, ['gpt', 'opus'], 1);
  assert(got === null, `expected null, got ${JSON.stringify(got)}`);
});

step('reviewer present but rating is null/missing → skipped', () => {
  const parsed = makeParsed({});
  parsed.set('gpt', {
    annotations: new Map([[1, { rating: null, finalAnswer: null, flags: [], flagsMissing: false, body: '' }]]),
  });
  parsed.set('opus', {
    annotations: new Map([[1, { rating: 'thumbs-up', finalAnswer: 'A', flags: [], flagsMissing: false, body: '' }]]),
  });
  const got = pickBestVerdictFromParsed(parsed, ['gpt', 'opus'], 1);
  assert(got !== null && got.name === 'opus', `expected opus, got ${JSON.stringify(got)}`);
});

step('mixed annots: per-annot pick, not per-task', () => {
  // gpt: A1=👎, A2=👍.  opus: A1=👍, A2=👎.
  // Expect: A1 → opus (👍), A2 → gpt (👍 first).
  const parsed = makeParsed({
    gpt:  { 1: 'thumbs-down', 2: 'thumbs-up' },
    opus: { 1: 'thumbs-up',   2: 'thumbs-down' },
  });
  const a1 = pickBestVerdictFromParsed(parsed, ['gpt', 'opus'], 1);
  const a2 = pickBestVerdictFromParsed(parsed, ['gpt', 'opus'], 2);
  assert(a1.name === 'opus' && a1.rating === 'thumbs-up', `A1: ${JSON.stringify(a1)}`);
  assert(a2.name === 'gpt'  && a2.rating === 'thumbs-up', `A2: ${JSON.stringify(a2)}`);
});

step('fire order matters: reverse order flips the tie-break', () => {
  const parsed = makeParsed({
    gpt:  { 1: 'thumbs-up' },
    opus: { 1: 'thumbs-up' },
  });
  const fwd = pickBestVerdictFromParsed(parsed, ['gpt', 'opus'], 1);
  const rev = pickBestVerdictFromParsed(parsed, ['opus', 'gpt'], 1);
  assert(fwd.name === 'gpt' && rev.name === 'opus',
    `fwd=${fwd.name} rev=${rev.name}`);
});

step('empty fire order → null', () => {
  const parsed = makeParsed({ gpt: { 1: 'thumbs-up' } });
  const got = pickBestVerdictFromParsed(parsed, [], 1);
  assert(got === null, `expected null, got ${JSON.stringify(got)}`);
});

endTest();
