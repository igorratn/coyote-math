#!/usr/bin/env node
// test-prepare-job3b-helpers.mjs
// Regression test for prepare-job3b-summary parsing helpers.
//
// Bug history (2026-04-25):
//   The annot-block extraction regex used `\Z` as the end-of-string anchor.
//   JS regex has NO \Z — it's treated as the literal character 'Z'. That
//   caused getReviewerFeedback() to cut the annot block at the first capital
//   Z in the body (e.g. "A-Z" or "Z-axis" in a prompt), so the picked
//   reviewer Feedback was unreachable and the pre-push gate reported
//   "(no reviewer feedback found)" for any annot whose prompt contained Z.
//
//   Fix: replace \Z with (?![\s\S]) (negative lookahead — matches at end of
//   string only).
//
// Coverage:
//   1. Picked Feedback extracted when prompt contains capital Z (regression).
//   2. Picked Feedback extracted on a normal annot block.
//   3. Falls back to first reviewer Feedback when no (picked) tag present.
//   4. Igor Verdict parsed correctly when followed by ---.
//   5. Igor Verdict parsed correctly when at end of file (no trailing ---).

import { parseIgorVerdicts, getReviewerFeedback } from '../prepare-job3b-helpers.mjs';

let failed = 0;
const fail = (msg) => { console.error(`  FAIL: ${msg}`); failed++; };
const pass = (msg) => { console.error(`  ok:   ${msg}`); };

// ---------- Fixture builders ----------
function annotBlock({ n, prompt, pickedReviewer = 'gpt', pickedFeedback, otherFeedback }) {
  let s = `## Annotation ${n}\n\n`;
  s += `- **Rating:** thumbs-down\n\n`;
  s += `#### Full Prompt\n${prompt}\n\n`;
  s += `#### Rewrite Answer (annotator)\nfoo\n\n`;
  s += `#### Reviewer Body (${pickedReviewer}) (picked)\n`;
  s += `- **Rating:** thumbs-down\n`;
  s += `- **Final Rewrite Answer:** N/A\n`;
  s += `- **Flags:** [G1]\n`;
  s += `- **Two-Part Check:**\n`;
  s += `  1. Question: Some text.\n`;
  s += `  2. Answer: More text.\n`;
  s += `- **Edits Made:** None.\n`;
  s += `- **Feedback:** ${pickedFeedback}\n\n`;
  if (otherFeedback) {
    s += `#### Reviewer Body (opus)\n`;
    s += `- **Rating:** thumbs-down\n`;
    s += `- **Feedback:** ${otherFeedback}\n\n`;
  }
  s += `---\n\n`;
  return s;
}

// ---------- Test 1: REGRESSION — prompt with "A-Z" must not break annot block ----------
{
  const taskTxt =
    `# Review: foo\n\n` +
    annotBlock({
      n: 1,
      prompt: 'Extract the first and last letters (A-Z or a-z) of each title.',
      pickedFeedback: 'PICKED-FB-A1: V6 character-extraction ban.',
    }) +
    `## Form-Fill Payload\n\n\`\`\`yaml\n...\n\`\`\`\n`;

  const fb = getReviewerFeedback(taskTxt, 1);
  if (fb && fb.startsWith('PICKED-FB-A1')) {
    pass('regression: prompt with "A-Z" → picked Feedback found');
  } else {
    fail(`regression: prompt with "A-Z" → expected PICKED-FB-A1, got ${JSON.stringify(fb)}`);
  }
}

// ---------- Test 2: REGRESSION — prompt with bare "Z" elsewhere ----------
{
  const taskTxt =
    `# Review: foo\n\n` +
    annotBlock({
      n: 2,
      prompt: 'Sum the values along the Z axis of the chart.',
      pickedFeedback: 'PICKED-FB-A2: stub.',
    }) +
    `## Form-Fill Payload\n`;

  const fb = getReviewerFeedback(taskTxt, 2);
  if (fb && fb.startsWith('PICKED-FB-A2')) {
    pass('regression: prompt with "Z axis" → picked Feedback found');
  } else {
    fail(`regression: prompt with "Z axis" → expected PICKED-FB-A2, got ${JSON.stringify(fb)}`);
  }
}

// ---------- Test 3: normal annot (no Z in prompt) still works ----------
{
  const taskTxt =
    `# Review: foo\n\n` +
    annotBlock({
      n: 1,
      prompt: 'Count the number of dials in the image.',
      pickedFeedback: 'PICKED-FB-NORMAL: ok feedback.',
    }) +
    `## Form-Fill Payload\n`;

  const fb = getReviewerFeedback(taskTxt, 1);
  if (fb && fb.startsWith('PICKED-FB-NORMAL')) {
    pass('baseline: normal annot block → picked Feedback found');
  } else {
    fail(`baseline: expected PICKED-FB-NORMAL, got ${JSON.stringify(fb)}`);
  }
}

// ---------- Test 4: picked is not the first reviewer body ----------
{
  // Build manually: first body is opus (not picked), second is gpt (picked).
  let s = `# Review: foo\n\n## Annotation 1\n\n`;
  s += `#### Full Prompt\nDoes anything contain Z?\n\n`;
  s += `#### Reviewer Body (opus)\n- **Rating:** thumbs-down\n- **Feedback:** OPUS-FB-FIRST.\n\n`;
  s += `#### Reviewer Body (gpt) (picked)\n- **Rating:** thumbs-up\n- **Feedback:** PICKED-FB-SECOND.\n\n`;
  s += `---\n\n## Form-Fill Payload\n`;

  const fb = getReviewerFeedback(s, 1);
  if (fb && fb.startsWith('PICKED-FB-SECOND')) {
    pass('picked-second: returns picked reviewer Feedback, not first');
  } else {
    fail(`picked-second: expected PICKED-FB-SECOND, got ${JSON.stringify(fb)}`);
  }
}

// ---------- Test 5: parseIgorVerdicts — verdict followed by --- ----------
{
  const taskTxt =
    `# Review: foo\n\n` +
    `## Annotation 1\n\n` +
    `#### Igor Verdict\n` +
    `- rating: thumbs-up\n` +
    `- final_answer: 42\n` +
    `- notes: looked fine\n` +
    `- date: 2026-04-25\n\n` +
    `---\n` +
    `## Annotation 2\n\n` +
    `#### Igor Verdict\n` +
    `- rating: thumbs-down\n` +
    `- date: 2026-04-25\n\n` +
    `---\n`;

  const v = parseIgorVerdicts(taskTxt);
  if (v[1] && v[1].rating === 'thumbs-up' && v[1].finalAnswer === '42' && v[1].notes === 'looked fine') {
    pass('parseIgorVerdicts: A1 thumbs-up + final_answer + notes parsed');
  } else {
    fail(`parseIgorVerdicts A1 mismatch: ${JSON.stringify(v[1])}`);
  }
  if (v[2] && v[2].rating === 'thumbs-down' && v[2].finalAnswer === null) {
    pass('parseIgorVerdicts: A2 thumbs-down (no final_answer) parsed');
  } else {
    fail(`parseIgorVerdicts A2 mismatch: ${JSON.stringify(v[2])}`);
  }
}

// ---------- Test 6: parseIgorVerdicts — verdict at end of file (no ---) ----------
{
  const taskTxt =
    `# Review: foo\n\n` +
    `## Annotation 1\n\n` +
    `#### Igor Verdict\n` +
    `- rating: thumbs-up\n` +
    `- date: 2026-04-25\n`;

  const v = parseIgorVerdicts(taskTxt);
  if (v[1] && v[1].rating === 'thumbs-up') {
    pass('parseIgorVerdicts: end-of-file verdict parsed (no trailing ---)');
  } else {
    fail(`parseIgorVerdicts end-of-file mismatch: ${JSON.stringify(v[1])}`);
  }
}

// ---------- Result ----------
if (failed) {
  console.error(`\n[test-prepare-job3b-helpers] ${failed} FAIL`);
  process.exit(1);
}
console.error(`\n[test-prepare-job3b-helpers] all PASS`);
