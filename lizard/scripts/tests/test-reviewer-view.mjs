#!/usr/bin/env node
// test-reviewer-view.mjs
// Tests for the reviewer-skeleton-view builder (to be implemented).
//
// Background: as of 2026-04-25, every reviewer subprocess reads the full
// tasks/skeleton/<stem>.md and reviews every non-unchanged annot. Two changes:
//   1. Sequential filtering — when reviewer A auto-resolves annot N, reviewer B
//      shouldn't see annot N at all. Each reviewer gets a custom skeleton view
//      with only the annots still pending review.
//   2. Blind review — strip annotator's ANSWER field from the reviewer's view
//      so reviewer's verdict isn't anchored on annotator's number.
//
// This test file defines the contract for `buildReviewerView(skeletonText, opts)`
// from scripts/reviewer-view.mjs (to be implemented). It MUST:
//   - Include only the annot numbers in opts.annots (cycle-1 + cycle-2 sections both)
//   - Drop the **Annotator Answer:** line from each kept annot block
//   - Drop the #### Rewrite Answer block from each kept annot block
//   - Preserve task-info header (task_id, sa_task_filename, image, cycle marker)
//   - Preserve `## Cycle 2 Review` section if any kept annot is cycle-2 [CHANGED]
//   - Drop [UNCHANGED] cycle-2 annot blocks unconditionally (carry-forwards
//     never need review)
//
// Usage: node scripts/tests/test-reviewer-view.mjs

import '../log-ts.mjs';
import { startTest, step, endTest, assert } from './test-helpers.mjs';
import { buildReviewerView } from '../reviewer-view.mjs';

startTest('reviewer-view: skeleton subset + blind annotator answer');

const SKELETON_CYCLE1 = `# Skeleton: TestStem
- **task_id:** test_1
- **SA_TASK_FILENAME:** test.json
- **Image:** screenshots/test.png
- **Date:** 2026-04-25
- **Review Cycle:** 1st

## Annotation 1
- **Skills Tagged:** Logical Reasoning
- **Question Type:** SAQ
- **Model Answer:** 99
- **Annotator Answer:** 42

#### Full Prompt
Compute X using the chart.

#### Rewrite Answer
42

---

## Annotation 2
- **Skills Tagged:** Math Reasoning
- **Question Type:** MCQ
- **Model Answer:** A
- **Annotator Answer:** B

#### Full Prompt
Pick from A/B/C/D.
A. one
B. two
C. three
D. four

#### Rewrite Answer
B

---

## Annotation 3
- **Skills Tagged:** Spatial Reasoning
- **Question Type:** SAQ
- **Model Answer:** 7
- **Annotator Answer:** 11

#### Full Prompt
Count the widgets.

#### Rewrite Answer
11

---
`;

const SKELETON_CYCLE2 = `${SKELETON_CYCLE1}
## Cycle 2 Review

### Cycle 2 — Annotation 1 [UNCHANGED]
- **Status:** carry-forward thumbs-up

### Cycle 2 — Annotation 2 [CHANGED — FULL REVIEW, approve/delete only]
- **Status:** changed
- **Annotator Answer:** C

#### Full Prompt
Pick from A/B/C/D (rewritten).
A. blue
B. red
C. green
D. yellow

#### Rewrite Answer
C

---
`;

// ---------- Subset behaviour ----------

step('cycle-1: include only annots in opts.annots', () => {
  const view = buildReviewerView(SKELETON_CYCLE1, { annots: [1, 3] });
  assert(/^## Annotation 1\b/m.test(view), 'A1 should be present');
  assert(!/^## Annotation 2\b/m.test(view), 'A2 should be excluded');
  assert(/^## Annotation 3\b/m.test(view), 'A3 should be present');
});

step('cycle-1: empty annots list → no annotation blocks (only header)', () => {
  const view = buildReviewerView(SKELETON_CYCLE1, { annots: [] });
  assert(!/^## Annotation/m.test(view), 'no annotation blocks expected');
  assert(/task_id/.test(view), 'task header should still be present');
});

step('cycle-1: include all → all 3 annot blocks present', () => {
  const view = buildReviewerView(SKELETON_CYCLE1, { annots: [1, 2, 3] });
  assert(/^## Annotation 1\b/m.test(view));
  assert(/^## Annotation 2\b/m.test(view));
  assert(/^## Annotation 3\b/m.test(view));
});

// ---------- Blind annotator answer ----------

step('blind: strip **Annotator Answer:** lines from kept blocks', () => {
  const view = buildReviewerView(SKELETON_CYCLE1, { annots: [1, 2, 3] });
  assert(!/\*\*Annotator Answer:\*\*/.test(view),
    'all **Annotator Answer:** lines should be stripped');
});

step('blind: strip #### Rewrite Answer blocks (and their content)', () => {
  const view = buildReviewerView(SKELETON_CYCLE1, { annots: [1, 2, 3] });
  assert(!/#### Rewrite Answer/.test(view),
    'all #### Rewrite Answer headers should be stripped');
  // Sanity: the value "42" appears in the prompt anchor "Compute X using the chart"
  // so we can't grep the bare number. But the dedicated "42" rewrite answer line
  // must not survive. Check that no line contains exactly the rewrite answer alone:
  const lines = view.split('\n').map(l => l.trim());
  assert(!lines.includes('42'), 'rewrite answer "42" must not survive as a bare line');
  assert(!lines.includes('B'),  'rewrite answer "B" must not survive as a bare line');
  assert(!lines.includes('11'), 'rewrite answer "11" must not survive as a bare line');
});

step('blind: keep the prompt + skills + model answer (only annotator/rewrite stripped)', () => {
  const view = buildReviewerView(SKELETON_CYCLE1, { annots: [1] });
  assert(/Compute X using the chart/.test(view), 'prompt body must survive');
  assert(/Skills Tagged/.test(view), 'skills line must survive');
  assert(/\*\*Model Answer:\*\*/.test(view), 'model answer must survive (not stripped)');
});

// ---------- Cycle-2 handling ----------

step('cycle-2: [UNCHANGED] annot blocks dropped from Cycle 2 Review section', () => {
  const view = buildReviewerView(SKELETON_CYCLE2, { annots: [1, 2] });
  // Cycle-1 A1 may be present (depending on whether annots includes 1)
  // But the cycle-2 [UNCHANGED] block for A1 must be absent
  assert(!/Cycle 2 — Annotation 1 \[UNCHANGED\]/.test(view),
    'cycle-2 [UNCHANGED] A1 block should be dropped');
});

step('cycle-2: include cycle-2 [CHANGED] block when annot in opts.annots', () => {
  const view = buildReviewerView(SKELETON_CYCLE2, { annots: [2] });
  assert(/Cycle 2 — Annotation 2 \[CHANGED/.test(view),
    'cycle-2 [CHANGED] A2 should be present');
  // And its answer-related fields blinded
  assert(!/\*\*Annotator Answer:\*\*\s*C/.test(view),
    'cycle-2 annotator answer should be stripped too');
  assert(!/#### Rewrite Answer\nC/.test(view),
    'cycle-2 rewrite answer should be stripped too');
});

step('cycle-2: omit Cycle 2 Review section when no cycle-2 annots in opts.annots', () => {
  // If we only ask for annot 1 (which is [UNCHANGED] in cycle 2), the cycle-2
  // section should be empty or absent.
  const view = buildReviewerView(SKELETON_CYCLE2, { annots: [1] });
  assert(!/Cycle 2 — Annotation 2/.test(view),
    'A2 cycle-2 block should not appear');
});

// ---------- Header preservation ----------

step('header (task_id, sa_task_filename, image, date, cycle) preserved', () => {
  const view = buildReviewerView(SKELETON_CYCLE1, { annots: [1] });
  for (const field of ['task_id', 'SA_TASK_FILENAME', 'Image', 'Date', 'Review Cycle']) {
    assert(view.includes(field), `header field "${field}" missing`);
  }
});

endTest();
