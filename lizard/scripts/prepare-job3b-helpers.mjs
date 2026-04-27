// prepare-job3b-helpers.mjs
// Small parsing helpers extracted from prepare-job3b-summary.mjs so they can
// be unit-tested. Keep this module minimal — anything that touches fs/manifest
// stays in the main script.

export function parseIgorVerdicts(taskTxt) {
  // Returns { annotN: { rating, finalAnswer, notes } }
  const out = {};
  if (!taskTxt) return out;
  const blocks = taskTxt.split(/(?=^## Annotation \d+\s*$)/m);
  for (const blk of blocks) {
    const hm = /^## Annotation (\d+)/.exec(blk);
    if (!hm) continue;
    const n = parseInt(hm[1], 10);
    const iv = /#### Igor Verdict\n([\s\S]+?)(?=\n#### |\n---|(?![\s\S]))/.exec(blk);
    if (!iv) continue;
    const r  = /rating:\s*(thumbs-up|thumbs-down)/.exec(iv[1]);
    const a  = /final_answer:\s*(.+)/.exec(iv[1]);
    const nt = /notes:\s*(.+)/.exec(iv[1]);
    out[n] = {
      rating: r ? r[1] : null,
      finalAnswer: a ? a[1].trim() : null,
      notes: nt ? nt[1].trim() : null,
    };
  }
  return out;
}

export function getReviewerFeedback(taskTxt, n) {
  // Pull picked-reviewer Feedback line for annot N (used for QC_Return text).
  // NB: JS regex has NO \Z anchor — JS treats \Z as a literal 'Z'. The earlier
  // implementation used \Z in the lookahead; that caused the annot-block match
  // to terminate at the first capital Z in the prompt (e.g. "A-Z"). Use
  // (?![\s\S]) for end-of-string instead.
  const annotBlock = new RegExp(`^## Annotation ${n}\\b[\\s\\S]*?(?=^## |(?![\\s\\S]))`, 'm').exec(taskTxt);
  if (!annotBlock) return null;
  const fb = /#### Reviewer Body \([^)]+\) \(picked\)[\s\S]*?- \*\*Feedback:\*\*\s*([\s\S]+?)(?=\n\n|\n####|\n---|(?![\s\S]))/.exec(annotBlock[0]);
  if (fb) return fb[1].trim();
  // Fallback to first reviewer's feedback
  const fb2 = /#### Reviewer Body[\s\S]*?- \*\*Feedback:\*\*\s*([\s\S]+?)(?=\n\n|\n####|\n---|(?![\s\S]))/.exec(annotBlock[0]);
  return fb2 ? fb2[1].trim() : null;
}
