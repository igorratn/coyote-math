#!/usr/bin/env node
// test-parse-edits-made.mjs
// Coverage for parseEditsMade — picks up skill-edit recommendations from
// reviewer's `Edits Made` field (HOST_SOP.legacy.md line 560 spec).
//
// Real-world phrasings from current 6-stem batch (2026-04-28):
//   - opus: "Optional tag cleanup — drop `Spatial Reasoning` (still ≥3 skills…)"
//   - opus: "Remove 'Spatial Reasoning' from skill tags (not a spatial-reasoning question)…"
//   - gemini: "Changed skill tags from 'Math, Logical, TCG' to 'Math, TCG'"
//   - "None" → no edits

import { parseEditsMade } from '../parse-edits-made.mjs';

let failed = 0;
const fail = (msg) => { console.error(`  FAIL: ${msg}`); failed++; };
const pass = (msg) => { console.error(`  ok:   ${msg}`); };

function assertSets(label, got, expectCheck, expectUncheck) {
  const okC = JSON.stringify(got.skills_check.sort())   === JSON.stringify([...expectCheck].sort());
  const okU = JSON.stringify(got.skills_uncheck.sort()) === JSON.stringify([...expectUncheck].sort());
  if (okC && okU) pass(label);
  else fail(`${label} → got check=${JSON.stringify(got.skills_check)}, uncheck=${JSON.stringify(got.skills_uncheck)} (expected check=${JSON.stringify(expectCheck)}, uncheck=${JSON.stringify(expectUncheck)})`);
}

// 1. "None" → empty
assertSets('"None" → empty', parseEditsMade('None'), [], []);
assertSets('"None." → empty', parseEditsMade('None.'), [], []);
assertSets('empty string → empty', parseEditsMade(''), [], []);
assertSets('null → empty', parseEditsMade(null), [], []);
assertSets('undefined → empty', parseEditsMade(undefined), [], []);

// 2. "Drop `X`" pattern
assertSets(
  'opus: "Optional tag cleanup — drop `Spatial Reasoning`"',
  parseEditsMade('Optional tag cleanup — drop `Spatial Reasoning` (still ≥3 skills with Enum + Math + Logical + TCG anchors).'),
  [], ['Spatial Reasoning']
);

// 3. "Remove 'X' from skill tags"
assertSets(
  'opus: "Remove \'Spatial Reasoning\' from skill tags"',
  parseEditsMade("Remove 'Spatial Reasoning' from skill tags (not a spatial-reasoning question). Keep Enumeration, Logical Reasoning, Table/Chart/Graph Understanding."),
  [], ['Spatial Reasoning']
);

// 4. "Changed skill tags from 'A, B, C' to 'D, E'" → diff
assertSets(
  'gemini: "Changed skill tags from `Math Reasoning, Logical Reasoning, Table/Chart/Graph Understanding` to `Math Reasoning, Table/Chart/Graph Understanding`"',
  parseEditsMade('Changed skill tags from "Math Reasoning, Logical Reasoning, Table/Chart/Graph Understanding" to "Math Reasoning, Table/Chart/Graph Understanding". Logical Reasoning is not a primary skill needed to solve this.'),
  [], ['Logical Reasoning']
);

// 5. "Changed ... from 'A, B' to 'A, C'" → uncheck B, check C
assertSets(
  'gemini-style: drop one + add one via "from X to Y"',
  parseEditsMade('Changed skill tags from "Enumeration, Math Reasoning" to "Enumeration, Logical Reasoning"'),
  ['Logical Reasoning'], ['Math Reasoning']
);

// 6. "Add `X`"
assertSets(
  'add `Logical Reasoning`',
  parseEditsMade('Add `Logical Reasoning` to skill tags (chain inference required).'),
  ['Logical Reasoning'], []
);

// 7. QTYPE flip — drop MCQ, add Short answer question
assertSets(
  'qtype flip: drop MCQ + add Short answer question',
  parseEditsMade('Drop `MCQ` and add `Short answer question` (no fixed choice options provided).'),
  ['Short answer question'], ['MCQ']
);

// 8. Mention without verb (e.g. in reasoning prose) → no delta
assertSets(
  'mention without verb → no delta',
  parseEditsMade('The Spatial Reasoning tag is borderline but acceptable here.'),
  [], []
);

// 9. Token spelled inconsistently (case) → canonicalized
assertSets(
  'canonicalize case via "drop"',
  parseEditsMade('drop spatial reasoning'),
  [], ['Spatial Reasoning']
);

// 10. Multiple drops in one Edits Made
assertSets(
  'multiple drops',
  parseEditsMade('Drop `Spatial Reasoning` and remove `World Knowledge` (over-tagged).'),
  [], ['Spatial Reasoning', 'World Knowledge']
);

// 11. Unknown token → ignored
assertSets(
  'unknown token ignored',
  parseEditsMade('Drop `Quantum Reasoning` (not a real skill)'),
  [], []
);

// 12. Edge case: "include World Knowledge"
assertSets(
  'include verb → check',
  parseEditsMade('Include `World Knowledge` (annotator missed this anchor).'),
  ['World Knowledge'], []
);

// 13. Edge case: same skill mentioned with both add and drop verbs (last verb wins per closest-preceding-word rule)
// "Drop X" then later "actually add X" → check
assertSets(
  'conflicting verbs: closest preceding wins',
  parseEditsMade('Initially I considered drop `Logical Reasoning`, but actually add `Logical Reasoning`.'),
  ['Logical Reasoning'], []
);

// 14. Multi-line free-form — recognize verb-token pairs across line breaks
assertSets(
  'multi-line edits',
  parseEditsMade(`- Removed: Spatial Reasoning (over-tagged)
- Added: World Knowledge (anchor needed)`),
  ['World Knowledge'], ['Spatial Reasoning']
);

// 15. "drop the Spatial Reasoning tag" — verb + filler + token
assertSets(
  'verb with filler words before token',
  parseEditsMade('drop the Spatial Reasoning tag — over-tagged'),
  [], ['Spatial Reasoning']
);

// ---------- Result ----------
if (failed) {
  console.error(`\n[test-parse-edits-made] ${failed} FAIL`);
  process.exit(1);
}
console.error(`\n[test-parse-edits-made] all PASS`);
