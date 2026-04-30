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
    const sr = /source:\s*(.+)/.exec(iv[1]);
    const nt = /notes:\s*(.+)/.exec(iv[1]);
    const sc = /skills_check:\s*\[([^\]]*)\]/.exec(iv[1]);
    const su = /skills_uncheck:\s*\[([^\]]*)\]/.exec(iv[1]);
    out[n] = {
      rating: r ? r[1] : null,
      finalAnswer: a ? a[1].trim() : null,
      source: sr ? sr[1].trim() : null,
      notes: nt ? nt[1].trim() : null,
      // Optional skill-edit overrides — present iff Igor included them in the
      // Igor Verdict block at 3a. null (rather than []) signals "Igor did not
      // override; fall back to Auto Verdict's deltas".
      skillsCheck:   sc ? sc[1].split(',').map(s => s.trim()).filter(Boolean) : null,
      skillsUncheck: su ? su[1].split(',').map(s => s.trim()).filter(Boolean) : null,
    };
  }
  return out;
}

export function parseAutoVerdicts(taskTxt) {
  // Returns { annotN: { carveOut, rating, finalAnswer, source, saAction, notes } }
  // Auto Verdict blocks are written by Job 2's merger (job2-merge.mjs) for
  // carve-out cases (👍-close and 👎-unanimous-G1). Their presence in the task
  // file means the annotation is 3a-done without Igor walkthrough.
  const out = {};
  if (!taskTxt) return out;
  const blocks = taskTxt.split(/(?=^## Annotation \d+\s*$)/m);
  for (const blk of blocks) {
    const hm = /^## Annotation (\d+)/.exec(blk);
    if (!hm) continue;
    const n = parseInt(hm[1], 10);
    const av = /#### Auto Verdict\n([\s\S]+?)(?=\n#### |\n---|(?![\s\S]))/.exec(blk);
    if (!av) continue;
    const co = /carve_out:\s*(.+)/.exec(av[1]);
    const r  = /rating:\s*(thumbs-up|thumbs-down)/.exec(av[1]);
    const a  = /final_answer:\s*(.+)/.exec(av[1]);
    const sr = /source:\s*(.+)/.exec(av[1]);
    const sa = /sa_action:\s*(.+)/.exec(av[1]);
    const nt = /notes:\s*(.+)/.exec(av[1]);
    const sc = /skills_check:\s*\[([^\]]*)\]/.exec(av[1]);
    const su = /skills_uncheck:\s*\[([^\]]*)\]/.exec(av[1]);
    out[n] = {
      carveOut: co ? co[1].trim() : null,
      rating: r ? r[1] : null,
      finalAnswer: a ? a[1].trim() : null,
      source: sr ? sr[1].trim() : null,
      saAction: sa ? sa[1].trim() : null,
      notes: nt ? nt[1].trim() : null,
      skillsCheck:   sc ? sc[1].split(',').map(s => s.trim()).filter(Boolean) : [],
      skillsUncheck: su ? su[1].split(',').map(s => s.trim()).filter(Boolean) : [],
    };
  }
  return out;
}

export function getReviewerFeedback(taskTxt, n) {
  // DEPRECATED 2026-04-29: pulled the picked-reviewer's per-body Feedback line.
  // Wrong source — Igor's curated 3a Feedback never reached payload. Keep for
  // backward compat / tests; new callers must use getAnnotationFeedback.
  const annotBlock = new RegExp(`^## Annotation ${n}\\b[\\s\\S]*?(?=^## |(?![\\s\\S]))`, 'm').exec(taskTxt);
  if (!annotBlock) return null;
  const fb = /#### Reviewer Body \([^)]+\) \(picked\)[\s\S]*?- \*\*Feedback:\*\*\s*([\s\S]+?)(?=\n\n|\n####|\n---|(?![\s\S]))/.exec(annotBlock[0]);
  if (fb) return fb[1].trim();
  const fb2 = /#### Reviewer Body[\s\S]*?- \*\*Feedback:\*\*\s*([\s\S]+?)(?=\n\n|\n####|\n---|(?![\s\S]))/.exec(annotBlock[0]);
  return fb2 ? fb2[1].trim() : null;
}

export function getAnnotationFeedback(taskTxt, n) {
  // Pull the curated `#### Feedback` block under `## Annotation N` — the one
  // produced at Job 3a (Igor walkthrough) or stamped by Job 2. This is the
  // text that goes into payload sa.feedback for 👎 cases (and gets pasted into
  // the SA QC Feedback box at Job 4).
  //
  // For 👍 the curated body is "(none — thumbs-up)" or empty — null policy is
  // enforced by the caller (run-job3.mjs forces feedback=null on rating==='thumbs-up').
  //
  // Reviewer-body sections use `- **Feedback:**` inline-bulleted form, not a
  // `#### Feedback` heading, so they don't collide with this match. Some
  // legacy task files have multiple `#### Feedback` blocks (one stale + one
  // curated); take the LAST one — Job 2 / 3a always appends curated at bottom.
  const annotBlock = new RegExp(`^## Annotation ${n}\\b[\\s\\S]*?(?=^## |(?![\\s\\S]))`, 'm').exec(taskTxt);
  if (!annotBlock) return null;
  const re = /^#### Feedback\s*\n([\s\S]*?)(?=^#### |^---|(?![\s\S]))/gm;
  let last = null;
  let m;
  while ((m = re.exec(annotBlock[0])) !== null) last = m;
  if (!last) return null;
  const body = last[1].trim();
  if (!body) return null;
  return body;
}
