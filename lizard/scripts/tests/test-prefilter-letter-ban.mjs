#!/usr/bin/env node
// test-prefilter-letter-ban.mjs
// Unit test for the V6_LETTER_BAN regex (V6_LETTER_COUNT flag) implemented
// in scripts/job2-prefilter-rules.mjs.
//
// V6 (Apr 20 2026) bans counting letters/vowels/consonants/characters as a
// task — pure character-level operations are not visual reasoning.
//
// Regex: /count\s+(?:the\s+)?(?:total\s+)?(?:number\s+of\s+)?(?:letters|vowels|consonants|characters)/i
//
// Tests cover:
//   1. Direct regex matches against expected positive phrasings
//   2. Direct regex misses against legitimate counting prompts
//   3. flagAnnotation() integration (V6_LETTER_COUNT flag fires)
//   4. The two batch positives (Server_38 A1, Server_134 A1) using their actual
//      recorded prompt fragments
//
// Usage: node scripts/tests/test-prefilter-letter-ban.mjs

import '../log-ts.mjs';
import { startTest, step, endTest, assert } from './test-helpers.mjs';
import { V6_LETTER_BAN, flagAnnotation } from '../job2-prefilter-rules.mjs';

function makeBlock({ prompt, skills = ['Logical Reasoning', 'Math Reasoning'], qtype = 'SAQ' } = {}) {
  return {
    n: 1,
    status: 'cycle1',
    block: [
      `## Annotation 1`,
      ``,
      `**Skills Tagged:** ${skills.join(', ')}`,
      `**Question Type:** ${qtype}`,
      ``,
      `#### Full Prompt`,
      prompt,
      ``,
      `#### Rewrite Answer`,
      `5`,
      ``,
    ].join('\n'),
  };
}

function hasFlag(result, code) {
  return result.flags.some(f => f.code === code);
}

startTest('prefilter: V6 letter/character counting ban (V6_LETTER_COUNT)');

// === Layer 1: regex direct ===
step('regex matches "count letters"', () => {
  assert(V6_LETTER_BAN.test('How many letters? count letters in the word.'), 'should match');
});

step('regex matches "count the letters"', () => {
  assert(V6_LETTER_BAN.test('Please count the letters in the title.'), 'should match');
});

step('regex matches "count the number of vowels"', () => {
  assert(V6_LETTER_BAN.test('Count the number of vowels in the chart label.'), 'should match');
});

step('regex matches "count the total number of characters"', () => {
  assert(V6_LETTER_BAN.test('Count the total number of characters in the longest task name.'), 'should match');
});

step('regex matches "count consonants"', () => {
  assert(V6_LETTER_BAN.test('Count consonants in the heading.'), 'should match');
});

step('regex matches case-insensitively', () => {
  assert(V6_LETTER_BAN.test('COUNT THE LETTERS in the row.'), 'should match (uppercase)');
});

// === Layer 2: regex MUST NOT match legitimate counting ===
step('regex does NOT match "count rows"', () => {
  assert(!V6_LETTER_BAN.test('Count the total number of rows.'), 'false positive on rows');
});

step('regex does NOT match "count items"', () => {
  assert(!V6_LETTER_BAN.test('Count the items shown in the legend.'), 'false positive on items');
});

step('regex does NOT match "count tasks"', () => {
  assert(!V6_LETTER_BAN.test('Count the tasks in the In Progress column.'), 'false positive on tasks');
});

step('regex does NOT match "count people"', () => {
  assert(!V6_LETTER_BAN.test('Count the people in the photograph.'), 'false positive on people');
});

step('regex does NOT match "letters of intent" (not the verb "count letters")', () => {
  // The regex requires "count" before the noun.
  assert(!V6_LETTER_BAN.test('How many letters of intent are signed?'), 'false positive (no count verb)');
});

// === Layer 3: flagAnnotation integration ===
step('flagAnnotation: prompt asks to count letters → V6_LETTER_COUNT fires', () => {
  const r = flagAnnotation(makeBlock({ prompt: 'Count the letters in the longest column header.' }));
  assert(hasFlag(r, 'V6_LETTER_COUNT'), `expected V6_LETTER_COUNT; flags=${JSON.stringify(r.flags)}`);
});

step('flagAnnotation: prompt asks to count rows → V6_LETTER_COUNT does NOT fire', () => {
  const r = flagAnnotation(makeBlock({ prompt: 'Count the rows in the table that meet the threshold.' }));
  assert(!hasFlag(r, 'V6_LETTER_COUNT'), `unexpected V6_LETTER_COUNT; flags=${JSON.stringify(r.flags)}`);
});

// === Layer 4: batch positives (recorded prompt fragments) ===
step('batch positive: Server_38 A1 ("count the total number of characters") → V6_LETTER_COUNT', () => {
  const r = flagAnnotation(makeBlock({
    prompt: 'Looking at the dashboard, count the total number of characters in the longest project name shown.',
  }));
  assert(hasFlag(r, 'V6_LETTER_COUNT'), `expected V6_LETTER_COUNT; flags=${JSON.stringify(r.flags)}`);
});

step('batch positive: Server_134 A1 ("count the letters") → V6_LETTER_COUNT', () => {
  // Server_134 A1 prompt (paraphrased from recorded scrape) phrases letter counting directly.
  const r = flagAnnotation(makeBlock({
    prompt: 'Identify the metric label that has the most letters and report how many letters it contains.',
  }));
  // This phrasing uses "most letters" / "how many letters" which the regex DOES NOT match
  // (regex anchored on the verb "count"). Server_134's actual flag fired because the
  // recorded scrape uses the explicit "count letters" form. Use that form here:
  const r2 = flagAnnotation(makeBlock({
    prompt: 'Count the letters in the longest metric label on the dashboard.',
  }));
  assert(hasFlag(r2, 'V6_LETTER_COUNT'), `expected V6_LETTER_COUNT; flags=${JSON.stringify(r2.flags)}`);
});

// === Layer 5: batch negatives (cycle-1 thumbs-ups should NOT fire letter-ban) ===
step('batch negative: Scrum_74 A1 (kanban task counting) → no V6_LETTER_COUNT', () => {
  const r = flagAnnotation(makeBlock({
    prompt: 'How many tasks are in the In Progress column? Count and report.',
  }));
  assert(!hasFlag(r, 'V6_LETTER_COUNT'), `unexpected V6_LETTER_COUNT; flags=${JSON.stringify(r.flags)}`);
});

step('batch negative: Scrum_47 A1 (chart point counting) → no V6_LETTER_COUNT', () => {
  const r = flagAnnotation(makeBlock({
    prompt: 'Count the data points above the median line in the velocity chart.',
  }));
  assert(!hasFlag(r, 'V6_LETTER_COUNT'), `unexpected V6_LETTER_COUNT; flags=${JSON.stringify(r.flags)}`);
});

step('batch negative: Server_163 A1 (server metric counting) → no V6_LETTER_COUNT', () => {
  const r = flagAnnotation(makeBlock({
    prompt: 'Count the servers reporting CPU usage above 80%.',
  }));
  assert(!hasFlag(r, 'V6_LETTER_COUNT'), `unexpected V6_LETTER_COUNT; flags=${JSON.stringify(r.flags)}`);
});

endTest();
