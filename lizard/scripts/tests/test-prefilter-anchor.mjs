#!/usr/bin/env node
// test-prefilter-anchor.mjs
// Unit test for the V6 anchor-skill rule (G1_NO_ANCHOR + G1_ENUM_ALONE)
// implemented in scripts/job2-prefilter-rules.mjs.
//
// Anchor skills: Logical Reasoning, Table/Chart/Graph Understanding, World Knowledge.
// Rule: every prompt must include ≥1 anchor skill in its Skills Tagged list.
// No anchor → G1_NO_ANCHOR (hard).
//
// Tests run two layers:
//   1. ANCHOR_SKILLS set membership (synthetic).
//   2. flagAnnotation() on synthetic blocks (mirror real production data path).
//
// Plus 3 batch positives (must flag) + 3 batch negatives (must NOT flag),
// using minimal synthetic blocks built from the recorded skill arrays.
//
// Usage: node scripts/tests/test-prefilter-anchor.mjs

import '../log-ts.mjs';
import { startTest, step, endTest, assert } from './test-helpers.mjs';
import { ANCHOR_SKILLS, flagAnnotation } from '../job2-prefilter-rules.mjs';

// Build a minimal annotation block that the prefilter parsers can read.
// Real skeletons are richer; this is the smallest valid input shape.
function makeBlock({ n = 1, skills = [], qtype = 'MCQ', prompt = 'Question?\nA. one\nB. two\nC. three\nD. four' } = {}) {
  return {
    n,
    status: 'cycle1',
    block: [
      `## Annotation ${n}`,
      ``,
      `**Skills Tagged:** ${skills.join(', ')}`,
      `**Question Type:** ${qtype}`,
      ``,
      `#### Full Prompt`,
      prompt,
      ``,
      `#### Rewrite Answer`,
      `A`,
      ``,
    ].join('\n'),
  };
}

function hasFlag(result, code) {
  return result.flags.some(f => f.code === code);
}

startTest('prefilter: anchor-skill rule (G1_NO_ANCHOR)');

step('ANCHOR_SKILLS contains exactly LR/TCG/WK', () => {
  assert(ANCHOR_SKILLS.size === 3, `expected 3 anchor skills, got ${ANCHOR_SKILLS.size}`);
  assert(ANCHOR_SKILLS.has('Logical Reasoning'), 'missing Logical Reasoning');
  assert(ANCHOR_SKILLS.has('Table/Chart/Graph Understanding'), 'missing TCG Understanding');
  assert(ANCHOR_SKILLS.has('World Knowledge'), 'missing World Knowledge');
});

step('ANCHOR_SKILLS does NOT contain Enumeration / AP / SR / MR', () => {
  assert(!ANCHOR_SKILLS.has('Enumeration'), 'Enumeration should not be anchor');
  assert(!ANCHOR_SKILLS.has('Attribute Perception'), 'Attribute Perception should not be anchor');
  assert(!ANCHOR_SKILLS.has('Spatial Reasoning'), 'Spatial Reasoning should not be anchor');
  assert(!ANCHOR_SKILLS.has('Math Reasoning'), 'Math Reasoning should not be anchor');
});

step('skills with Logical Reasoning anchor → no G1_NO_ANCHOR', () => {
  const r = flagAnnotation(makeBlock({ skills: ['Enumeration', 'Logical Reasoning'] }));
  assert(!hasFlag(r, 'G1_NO_ANCHOR'), `unexpected G1_NO_ANCHOR; flags=${JSON.stringify(r.flags)}`);
});

step('skills with TCG Understanding anchor → no G1_NO_ANCHOR', () => {
  const r = flagAnnotation(makeBlock({ skills: ['Attribute Perception', 'Table/Chart/Graph Understanding'] }));
  assert(!hasFlag(r, 'G1_NO_ANCHOR'), `unexpected G1_NO_ANCHOR; flags=${JSON.stringify(r.flags)}`);
});

step('skills with World Knowledge anchor → no G1_NO_ANCHOR', () => {
  const r = flagAnnotation(makeBlock({ skills: ['Math Reasoning', 'World Knowledge'] }));
  assert(!hasFlag(r, 'G1_NO_ANCHOR'), `unexpected G1_NO_ANCHOR; flags=${JSON.stringify(r.flags)}`);
});

step('all-anchor skill set → no G1_NO_ANCHOR', () => {
  const r = flagAnnotation(makeBlock({ skills: ['Logical Reasoning', 'Table/Chart/Graph Understanding', 'World Knowledge'] }));
  assert(!hasFlag(r, 'G1_NO_ANCHOR'), `unexpected G1_NO_ANCHOR; flags=${JSON.stringify(r.flags)}`);
});

step('skills without any anchor → G1_NO_ANCHOR fires (Enum + AP)', () => {
  const r = flagAnnotation(makeBlock({ skills: ['Enumeration', 'Attribute Perception'] }));
  assert(hasFlag(r, 'G1_NO_ANCHOR'), `expected G1_NO_ANCHOR; flags=${JSON.stringify(r.flags)}`);
});

step('skills without any anchor → G1_NO_ANCHOR fires (Enum + SR + MR)', () => {
  const r = flagAnnotation(makeBlock({ skills: ['Enumeration', 'Spatial Reasoning', 'Math Reasoning'] }));
  assert(hasFlag(r, 'G1_NO_ANCHOR'), `expected G1_NO_ANCHOR; flags=${JSON.stringify(r.flags)}`);
});

step('Enumeration + non-anchor → G1_ENUM_ALONE fires', () => {
  // Enum-alone heuristic: 2 skills, one is Enumeration, neither is an anchor.
  const r = flagAnnotation(makeBlock({ skills: ['Enumeration', 'Spatial Reasoning'] }));
  assert(hasFlag(r, 'G1_ENUM_ALONE'), `expected G1_ENUM_ALONE; flags=${JSON.stringify(r.flags)}`);
  // Should also fire G1_NO_ANCHOR (no anchor present).
  assert(hasFlag(r, 'G1_NO_ANCHOR'), `expected G1_NO_ANCHOR co-fire; flags=${JSON.stringify(r.flags)}`);
});

step('Enumeration + anchor → G1_ENUM_ALONE does NOT fire', () => {
  const r = flagAnnotation(makeBlock({ skills: ['Enumeration', 'Logical Reasoning'] }));
  assert(!hasFlag(r, 'G1_ENUM_ALONE'), `unexpected G1_ENUM_ALONE; flags=${JSON.stringify(r.flags)}`);
});

// Batch-validated cases — these mirror the actual recorded skill arrays from
// the 2026-04-23 16-task batch (sourced from the merged tasks/<stem>.md files).
step('batch positive: Scrum_57 A1 skills [Enumeration, Spatial Reasoning, Math Reasoning] → G1_NO_ANCHOR', () => {
  const r = flagAnnotation(makeBlock({ skills: ['Enumeration', 'Spatial Reasoning', 'Math Reasoning'] }));
  assert(hasFlag(r, 'G1_NO_ANCHOR'), `expected G1_NO_ANCHOR; flags=${JSON.stringify(r.flags)}`);
});

step('batch positive: Scrum_59 A1 skills [Enumeration, Attribute Perception, Math Reasoning] → G1_NO_ANCHOR', () => {
  const r = flagAnnotation(makeBlock({ skills: ['Enumeration', 'Attribute Perception', 'Math Reasoning'] }));
  assert(hasFlag(r, 'G1_NO_ANCHOR'), `expected G1_NO_ANCHOR; flags=${JSON.stringify(r.flags)}`);
});

step('batch positive: Server_22 A1 skills [Enumeration, Attribute Perception, Math Reasoning] → G1_NO_ANCHOR', () => {
  const r = flagAnnotation(makeBlock({ skills: ['Enumeration', 'Attribute Perception', 'Math Reasoning'] }));
  assert(hasFlag(r, 'G1_NO_ANCHOR'), `expected G1_NO_ANCHOR; flags=${JSON.stringify(r.flags)}`);
});

step('batch negative (thumbs-up): Scrum_74 A1 skills [Enumeration, Math Reasoning, World Knowledge] → no G1_NO_ANCHOR', () => {
  const r = flagAnnotation(makeBlock({ skills: ['Enumeration', 'Math Reasoning', 'World Knowledge'] }));
  assert(!hasFlag(r, 'G1_NO_ANCHOR'), `unexpected G1_NO_ANCHOR; flags=${JSON.stringify(r.flags)}`);
});

step('batch negative (thumbs-up): Scrum_53 A1 skills [Attribute Perception, Spatial Reasoning, Logical Reasoning, World Knowledge] → no G1_NO_ANCHOR', () => {
  const r = flagAnnotation(makeBlock({ skills: ['Attribute Perception', 'Spatial Reasoning', 'Logical Reasoning', 'World Knowledge'] }));
  assert(!hasFlag(r, 'G1_NO_ANCHOR'), `unexpected G1_NO_ANCHOR; flags=${JSON.stringify(r.flags)}`);
});

step('batch negative (thumbs-up): Server_168 A1 skills [Enumeration, Attribute Perception, Table/Chart/Graph Understanding] → no G1_NO_ANCHOR', () => {
  const r = flagAnnotation(makeBlock({ skills: ['Enumeration', 'Attribute Perception', 'Table/Chart/Graph Understanding'] }));
  assert(!hasFlag(r, 'G1_NO_ANCHOR'), `unexpected G1_NO_ANCHOR; flags=${JSON.stringify(r.flags)}`);
});

endTest();
