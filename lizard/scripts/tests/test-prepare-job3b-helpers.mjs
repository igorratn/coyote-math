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

import { parseIgorVerdicts, parseAutoVerdicts, getReviewerFeedback, getAnnotationFeedback } from '../prepare-job3b-helpers.mjs';

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

// ---------- Test 7: parseAutoVerdicts — 👍-close carve-out ----------
{
  const taskTxt =
    `# Review: foo\n\n` +
    `## Annotation 1\n\n` +
    `- **Rating:** thumbs-up\n\n` +
    `**Auto-resolved at Job 2 (👍).** opus 👍 (matches annotator). Skipped at Job 3a.\n\n` +
    `#### Auto Verdict\n` +
    `carve_out: 👍-close\n` +
    `rating: thumbs-up\n` +
    `final_answer: 42\n` +
    `source: opus\n` +
    `sa_action: approve\n` +
    `notes: opus 👍 close to annotator; SA approves annotator's answer.\n\n` +
    `---\n`;

  const v = parseAutoVerdicts(taskTxt);
  if (v[1] && v[1].carveOut === '👍-close' && v[1].rating === 'thumbs-up'
      && v[1].finalAnswer === '42' && v[1].source === 'opus' && v[1].saAction === 'approve') {
    pass('parseAutoVerdicts: 👍-close block parsed (carveOut, rating, finalAnswer, source, saAction)');
  } else {
    fail(`parseAutoVerdicts 👍-close mismatch: ${JSON.stringify(v[1])}`);
  }
}

// ---------- Test 8: parseAutoVerdicts — 👎-unanimous-G1 carve-out (cycle-2 delete) ----------
{
  const taskTxt =
    `# Review: foo\n\n` +
    `## Annotation 3\n\n` +
    `- **Rating:** thumbs-down\n\n` +
    `**Auto-resolved at Job 2 (👎).** All 4 reviewers 👎 with G1. SA action: **delete** (cycle 2). Skipped at Job 3a.\n\n` +
    `#### Auto Verdict\n` +
    `carve_out: 👎-unanimous-G1\n` +
    `rating: thumbs-down\n` +
    `final_answer: N/A\n` +
    `source: gpt\n` +
    `sa_action: delete\n` +
    `notes: All 4 reviewers 👎 with G1 (V6 anchor-skill fail). cycle 2.\n\n` +
    `---\n`;

  const v = parseAutoVerdicts(taskTxt);
  if (v[3] && v[3].carveOut === '👎-unanimous-G1' && v[3].rating === 'thumbs-down'
      && v[3].saAction === 'delete') {
    pass('parseAutoVerdicts: 👎-unanimous-G1 (cycle-2 delete) block parsed');
  } else {
    fail(`parseAutoVerdicts 👎-unanimous-G1 mismatch: ${JSON.stringify(v[3])}`);
  }
}

// ---------- Test 9: parseAutoVerdicts — no Auto Verdict block returns empty ----------
{
  const taskTxt =
    `# Review: foo\n\n` +
    `## Annotation 1\n\n` +
    `#### Igor Verdict\nrating: thumbs-up\n\n---\n`;

  const v = parseAutoVerdicts(taskTxt);
  if (Object.keys(v).length === 0) {
    pass('parseAutoVerdicts: returns empty when no Auto Verdict blocks present');
  } else {
    fail(`parseAutoVerdicts should be empty, got: ${JSON.stringify(v)}`);
  }
}

// ---------- Test 10: Igor Verdict + Auto Verdict in same annot — both parse independently ----------
{
  const taskTxt =
    `# Review: foo\n\n` +
    `## Annotation 1\n\n` +
    `#### Auto Verdict\n` +
    `carve_out: 👍-close\n` +
    `rating: thumbs-up\n` +
    `final_answer: 42\n` +
    `source: opus\n` +
    `sa_action: approve\n` +
    `notes: auto.\n\n` +
    `#### Igor Verdict\n` +
    `rating: thumbs-down\n` +
    `final_answer: 99\n` +
    `notes: Igor overrode auto.\n\n` +
    `---\n`;

  const auto = parseAutoVerdicts(taskTxt);
  const igor = parseIgorVerdicts(taskTxt);
  if (auto[1]?.rating === 'thumbs-up' && igor[1]?.rating === 'thumbs-down'
      && igor[1]?.finalAnswer === '99') {
    pass('override: Igor Verdict + Auto Verdict in same block parse independently');
  } else {
    fail(`override mismatch: auto=${JSON.stringify(auto[1])} igor=${JSON.stringify(igor[1])}`);
  }
}

// ---------- Test 11: getAnnotationFeedback — Igor's curated 👎 feedback (after reviewer body) ----------
{
  // Realistic shape: reviewer body has its own `- **Feedback:**` line; the
  // curated annotation-level `#### Feedback` block sits below, before
  // `#### Igor Verdict`. Bug 1 (2026-04-29): old getReviewerFeedback pulled
  // from the reviewer body, ignoring this curated text.
  let s = `# Review: foo\n\n## Annotation 1\n\n`;
  s += `- **Rating:** thumbs-down\n\n`;
  s += `#### Reviewer Body (opus) (picked)\n`;
  s += `- **Rating:** thumbs-down\n`;
  s += `- **Feedback:** REVIEWER-FB-OPUS: pre-V6 reasoning.\n\n`;
  s += `---\n\n`;
  s += `#### Edits Made\n(none)\n\n`;
  s += `#### Feedback\n4/28: IGOR-CURATED-FB: V6 reasoning.\n\n`;
  s += `#### Igor Verdict\nrating: thumbs-down\nfinal_answer: foo\nsource: opus\nnotes: ok\n\n`;
  s += `---\n## Annotation 2\n`;

  const fb = getAnnotationFeedback(s, 1);
  if (fb && fb.startsWith('4/28: IGOR-CURATED-FB')) {
    pass('getAnnotationFeedback: pulls curated Igor feedback, NOT reviewer-body feedback');
  } else {
    fail(`getAnnotationFeedback: expected curated, got ${JSON.stringify(fb)}`);
  }
}

// ---------- Test 12: getAnnotationFeedback — multiple #### Feedback blocks → take the LAST ----------
{
  // Legacy task files have a stale Job-2-stamped Feedback block above the
  // 3a-curated one. Helper must take the LAST occurrence.
  let s = `# Review: foo\n\n## Annotation 1\n\n`;
  s += `#### Reviewer Body (opus) (picked)\n- **Feedback:** REVIEWER-FB.\n\n`;
  s += `#### Feedback\n2026-04-28: thumbs-down (opus) — pending Igor verdict\n\n`;
  s += `#### Igor Verdict\nrating: thumbs-down\nsource: custom\nnotes: ok\n\n`;
  s += `#### Feedback\n4/28: CURATED-LAST.\n\n`;  // hypothetical: 3a appended below Igor Verdict
  s += `---\n`;

  const fb = getAnnotationFeedback(s, 1);
  if (fb === '4/28: CURATED-LAST.') {
    pass('getAnnotationFeedback: takes the LAST `#### Feedback` block when multiple present');
  } else {
    fail(`getAnnotationFeedback: expected last block, got ${JSON.stringify(fb)}`);
  }
}

// ---------- Test 13: getAnnotationFeedback — empty / "(none)" body returns body string ----------
{
  // Helper returns the body verbatim; null-on-thumbs-up policy is enforced
  // by the caller (run-job3.mjs). Helper just parses.
  let s = `# Review: foo\n\n## Annotation 1\n\n`;
  s += `#### Feedback\n(none — thumbs-up)\n\n`;
  s += `#### Igor Verdict\nrating: thumbs-up\nsource: custom\nnotes: ok\n\n`;
  s += `---\n`;

  const fb = getAnnotationFeedback(s, 1);
  if (fb === '(none — thumbs-up)') {
    pass('getAnnotationFeedback: returns "(none — thumbs-up)" verbatim (caller forces null)');
  } else {
    fail(`getAnnotationFeedback empty-body: expected "(none — thumbs-up)", got ${JSON.stringify(fb)}`);
  }
}

// ---------- Test 14: getAnnotationFeedback — no `#### Feedback` block → null ----------
{
  let s = `# Review: foo\n\n## Annotation 1\n\n`;
  s += `#### Igor Verdict\nrating: thumbs-up\nsource: custom\nnotes: ok\n\n`;
  s += `---\n`;

  const fb = getAnnotationFeedback(s, 1);
  if (fb === null) {
    pass('getAnnotationFeedback: returns null when no `#### Feedback` block exists');
  } else {
    fail(`getAnnotationFeedback no-block: expected null, got ${JSON.stringify(fb)}`);
  }
}

// ---------- Result ----------
if (failed) {
  console.error(`\n[test-prepare-job3b-helpers] ${failed} FAIL`);
  process.exit(1);
}
console.error(`\n[test-prepare-job3b-helpers] all PASS`);
