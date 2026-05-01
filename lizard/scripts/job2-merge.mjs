#!/usr/bin/env node
// job2-merge.mjs (v2 — minimal, first-verdict-wins)
//
// Per annot, walks REVIEWERS in fire order. First reviewer that emits a parseable
// Rating wins. Records verdict; non-carve-out annots defer to Igor at Job 3. No
// annotator-answer matching, no quorum, no prefilter integration, no flag
// aggregation. Carve-out cases (👍-close, 👎-unanimous-G1) get an Auto Verdict
// block embedded per annot — readable from the task file alone.
//
// Reviewers MUST emit structured `**Flags:** [...]` field per annot (closed enum,
// 18 codes). See templates/review-prompt.md.
//
// Usage:
//   STEM=<stem> REVIEWERS=gpt,grok,gemini,opus \
//   [LIZARD_DIR=<path>] [REVIEW_DIR=<path>] node scripts/job2-merge.mjs
//
// Output:
//   tasks/<stem>.md           — Igor reads this at Job 3 (no payload block; Job 3
//                               fan-out emits payloads/<stem>.yaml separately)
//   <REVIEW_DIR>/merge-summary.json   — ephemeral cache (not load-bearing)

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { resolve, join, dirname as pathDirname } from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import { detectBigDiff } from './job2-prefilter-rules.mjs';
import { parseEditsMade } from './parse-edits-made.mjs';

const __dir = pathDirname(fileURLToPath(import.meta.url));

// Detect script-vs-import: tests import this file purely for the parser exports
// (normalizeFlag, parseReviewerOutput, VALID_FLAGS) and must not trigger the
// orchestration body (which requires STEM env, file I/O, etc.).
const IS_ENTRY = import.meta.url === pathToFileURL(process.argv[1] ?? '').href;

const LIZARD_DIR = process.env.LIZARD_DIR ?? resolve(__dir, '..');
const STEM = process.env.STEM;
if (IS_ENTRY && !STEM) { console.error('ERROR: STEM env var required'); process.exit(1); }

// Known reviewer pool (in default fire order). Used both for explicit REVIEWERS
// env parsing and for filesystem auto-discovery.
const KNOWN_REVIEWERS = ['gpt', 'opus', 'gemini', 'grok'];

// REVIEW_DIR / paths require STEM. Compute lazily inside the IS_ENTRY block.
const REVIEW_DIR   = STEM ? (process.env.REVIEW_DIR ?? join('/tmp/lizard', STEM)) : null;

// Reviewer set resolution (2026-04-25):
//   1. If REVIEWERS env set → use it verbatim (override for tests / scripted control).
//   2. Else auto-discover: scan REVIEW_DIR for `<known-reviewer>-review.md` files,
//      include those in fire order. No need to pass REVIEWERS=... when the merger
//      should "consider every reviewer that produced output".
//   3. Fallback (no STEM, no REVIEW_DIR) → KNOWN_REVIEWERS (lets test-only imports work).
const REVIEWERS = (() => {
  if (process.env.REVIEWERS) {
    return process.env.REVIEWERS.split(',').map(s => s.trim()).filter(Boolean);
  }
  if (REVIEW_DIR) {
    return KNOWN_REVIEWERS.filter(name => existsSync(join(REVIEW_DIR, `${name}-review.md`)));
  }
  return KNOWN_REVIEWERS;
})();
const skeletonPath = STEM ? join(LIZARD_DIR, 'tasks', 'skeleton', `${STEM}.md`) : null;
const OUT_TASK     = STEM ? join(LIZARD_DIR, 'tasks', `${STEM}.md`) : null;
const OUT_SUMMARY  = STEM ? join(REVIEW_DIR, 'merge-summary.json') : null;

// ---------- closed flag enum ----------

export const VALID_FLAGS = new Set([
  'G1','G2','G3','G4','G5',
  'Type 1','Type 2','Type 3','Type 4','Type 5','Type 6',
  'Type 7','Type 8','Type 9','Type 10','Type 11','Type 12',
  'IMAGE_UNREADABLE',
]);

// Normalize loose forms to canonical. "TYPE7"/"type 7"/"Type-7" → "Type 7".
// Returns canonical string if valid, else null.
export function normalizeFlag(raw) {
  const s = raw.trim();
  if (!s) return null;
  if (VALID_FLAGS.has(s)) return s;
  // Type N variants
  const t = /^type\s*-?\s*(\d{1,2})$/i.exec(s);
  if (t) {
    const cand = `Type ${parseInt(t[1], 10)}`;
    if (VALID_FLAGS.has(cand)) return cand;
  }
  // G[1-5] variants
  const g = /^g\s*([1-5])$/i.exec(s);
  if (g) return `G${g[1]}`;
  // IMAGE_UNREADABLE variants
  if (/^image[_\s-]?unreadable$/i.test(s)) return 'IMAGE_UNREADABLE';
  return null;
}

// ---------- reviewer parser (structured fields only) ----------
// Pure function — exported for unit tests. Lives above the IS_ENTRY guard so
// importers get it without triggering the orchestration body.

export function parseReviewerOutput(text) {
  const out = { readFirst: null, annotations: new Map(), fixList: null };

  const rf = /## Read-First Observations\s*\n([\s\S]*?)(?=\n## |\n---\s*$|$)/.exec(text);
  if (rf) out.readFirst = rf[1].trim();

  const fx = /## Fix List\s*\n([\s\S]*?)$/.exec(text);
  if (fx) out.fixList = fx[1].trim();

  // Per-annotation blocks. Same regex as run-job2 validator.
  const annRe = /^##+\s+(?:Cycle\s*2\s*—\s*)?Annotation\s+(\d+)\b.*$/gm;
  const locs = [];
  let m;
  while ((m = annRe.exec(text)) !== null) locs.push({ n: parseInt(m[1], 10), start: m.index });

  for (let i = 0; i < locs.length; i++) {
    const end = (i + 1 < locs.length) ? locs[i + 1].start : (fx ? fx.index : text.length);
    const block = text.slice(locs[i].start, end).trim();

    // Rating
    const ratingM = /\bRating\b[^\n]{0,80}?\b(thumbs[- ]?up|thumbs[- ]?down|N\/A)\b/i.exec(block);
    const rating = ratingM ? ratingM[1].toLowerCase().replace(/\s/g, '-') : null;

    // Final Rewrite Answer
    const finalM = /\*\*Final Rewrite Answer(?:\s*\(REQUIRED\))?:\*\*\s*(.+?)(?=\n\s*\n|\n\*\*|\n####|\n##|\n---|\n-\s+\*\*|$)/is.exec(block);
    let finalAnswer = null;
    if (finalM) {
      finalAnswer = finalM[1]
        .replace(/\s*\n.*$/s, '')
        .replace(/^\*\*(.+?)\*\*$/, '$1')
        .trim()
        .replace(/^`([^`]+)`\s*(?:\(.*\))?\s*$/, '$1')
        .replace(/^`(.+)`$/, '$1')
        .replace(/^\s*\*\*\s*|\s*\*\*\s*$/g, '')
        .replace(/\s*\(.*\)\s*$/, '')
        .trim();
    }

    // Flags — structured field, closed enum
    const flagsM = /^\s*-?\s*\*\*Flags:\*\*\s*\[([^\]]*)\]/mi.exec(block);
    let flags = [];
    let flagsMissing = false;
    if (!flagsM) {
      flagsMissing = true;
    } else {
      const raw = flagsM[1].split(',').map(s => s.trim()).filter(Boolean);
      flags = raw.map(normalizeFlag).filter(Boolean);
      // Drop any out-of-enum entries silently (validator catches malformed file at run-job2 layer).
    }

    // Edits Made — free-form text the reviewer used to recommend skill / qtype
    // tweaks. Captured here so the merger can derive skills_check / skills_uncheck
    // deltas at Auto Verdict emission time (HOST_SOP.legacy.md line 560).
    const editsM = /^\s*-?\s*\*\*Edits Made:\*\*\s*([\s\S]*?)(?=^\s*-?\s*\*\*[A-Z]|^####|^---|(?![\s\S]))/mi.exec(block);
    const editsMadeText = editsM ? editsM[1].trim() : '';

    out.annotations.set(locs[i].n, {
      rating,
      finalAnswer,
      flags,
      flagsMissing,
      editsMadeText,
      body: block,
    });
  }
  return out;
}

// ---------- skeleton parser ----------

function parseSkeletonAnnotations(src) {
  const annots = new Map();
  const c1Re = /^## Annotation (\d+)\s*$/gm;
  const c2Re = /^### Cycle 2 — Annotation (\d+)(.*)$/gm;

  const blocks = [];
  let m;
  while ((m = c1Re.exec(src)) !== null) blocks.push({ n: parseInt(m[1], 10), start: m.index, cycle: 1, header: m[0] });
  while ((m = c2Re.exec(src)) !== null) blocks.push({ n: parseInt(m[1], 10), start: m.index, cycle: 2, header: m[0] });
  blocks.sort((a, b) => a.start - b.start);

  for (let i = 0; i < blocks.length; i++) {
    const end = (i + 1 < blocks.length) ? blocks[i + 1].start : src.length;
    const body = src.slice(blocks[i].start, end);
    if (/## Cycle 2 Review/.test(body) && !/### Cycle 2/.test(blocks[i].header)) continue;

    const status = /\[UNCHANGED\]/.test(blocks[i].header) ? 'unchanged'
                 : /\[CHANGED/.test(blocks[i].header)   ? 'changed'
                 : 'cycle1';
    const rewrite = /#### Rewrite Answer\n([\s\S]*?)(?=\n####|\n---|\n###|\n## |$)/.exec(body);
    const prompt  = /#### Full Prompt\n([\s\S]*?)(?=\n####|\n---|\n###|\n## |$)/.exec(body);
    const skills  = /\*\*Skills Tagged:\*\*\s*(.+?)$/m.exec(body);
    const qtype   = /\*\*Question Type:\*\*\s*(.+?)$/m.exec(body);
    const modelA  = /\*\*Model Answer:\*\*\s*(.+?)$/m.exec(body);
    const annotA  = /\*\*Annotator Answer:\*\*\s*(.+?)$/m.exec(body);

    const prev = annots.get(blocks[i].n);
    const entry = {
      n: blocks[i].n,
      cycle: blocks[i].cycle,
      status,
      rewriteAnswer: rewrite ? rewrite[1].trim() : '',
      prompt: prompt ? prompt[1].trim() : '',
      skills: skills ? skills[1].trim() : '',
      qtype: qtype ? qtype[1].trim() : '',
      modelAnswer: modelA ? modelA[1].trim() : '',
      annotatorAnswer: annotA ? annotA[1].trim() : '',
    };
    if (!prev || (prev.cycle === 1 && entry.cycle === 2)) {
      annots.set(blocks[i].n, entry);
    }
  }
  return [...annots.values()].sort((a, b) => a.n - b.n);
}

// ---------- per-annot verdict picker (pure, exported for tests) ----------
//
// Iterates `reviewerOrder` (e.g. ['gpt','opus']), looks up annotation `skelN`
// in each reviewer's parsed output (Map<name, {annotations: Map<n, {rating,...}>}>),
// returns the picked entry or null. Policy: prefer thumbs-up, else first thumbs-down.
// See pickBestVerdict comment in the orchestration block.
export function pickBestVerdictFromParsed(parsedReviewersMap, reviewerOrder, skelN) {
  let firstDown = null;
  for (const name of reviewerOrder) {
    const pr = parsedReviewersMap.get(name);
    if (!pr) continue;
    const a = pr.annotations.get(skelN);
    if (!a || !a.rating) continue;
    if (a.rating === 'thumbs-up') return { name, ...a };
    if (a.rating === 'thumbs-down' && !firstDown) firstDown = { name, ...a };
  }
  return firstDown;
}

// ---------- IS_ENTRY guard: orchestration body below ----------
// Tests import this file purely for the parseReviewerOutput / normalizeFlag /
// VALID_FLAGS exports above. Skip everything below when not the entry point.
if (!IS_ENTRY) {
  // no-op
} else {

const skeleton = readFileSync(skeletonPath, 'utf8');

const reviewerFiles = new Map();
for (const name of REVIEWERS) {
  const p = join(REVIEW_DIR, `${name}-review.md`);
  if (existsSync(p)) {
    reviewerFiles.set(name, { path: p, text: readFileSync(p, 'utf8') });
  } else {
    console.error(`[job2-merge] WARN: no review file for '${name}' at ${p} — skipping`);
  }
}
if (!reviewerFiles.size) {
  console.error('[job2-merge] ERROR: no reviewer outputs found'); process.exit(1);
}

const parsedReviewers = new Map();
for (const [name, { text }] of reviewerFiles.entries()) {
  parsedReviewers.set(name, parseReviewerOutput(text));
}

const skelAnnots = parseSkeletonAnnotations(skeleton);

// Task-level metadata
const taskIdM    = /\*\*task_id:\*\*\s*(\S+)/.exec(skeleton);
const saFilenameM = /\*\*SA_TASK_FILENAME:\*\*\s*(\S+)/.exec(skeleton);
const imageM      = /\*\*Image:\*\*\s*(.+?)$/m.exec(skeleton);
const isCycle2    = /## Cycle 2 Review/.test(skeleton);

// ---------- per-annot pick: delegate to the pure exported helper ----------
const pickBestVerdict = (skelN) => pickBestVerdictFromParsed(parsedReviewers, REVIEWERS, skelN);

const merged = [];
for (const skel of skelAnnots) {
  if (isCycle2 && skel.status === 'unchanged') {
    merged.push({ n: skel.n, decision: 'unchanged', skel });
    continue;
  }
  const pick = pickBestVerdict(skel.n);
  // Always collect ALL reviewers' views for this annot so Igor sees both
  // perspectives at 3a — not just the picked one. Order = fire order.
  const allViews = [];
  for (const name of REVIEWERS) {
    const pr = parsedReviewers.get(name);
    if (!pr) continue;
    const a = pr.annotations.get(skel.n);
    if (a) allViews.push({ name, ...a });
  }
  // Auto-resolve up gate (probe model — codified 2026-04-27):
  //   Reviewers fire sequentially as binary probes. 👎 → fire next probe;
  //   👍 → stop the chain. Disposition of the 👍 depends on whether the
  //   reviewer's own Final Answer matches the annotator's rewrite:
  //     · close (numeric diff ≤ 10%, non-numeric exact-norm match) → auto-resolved
  //     · big-diff → pending-igor (sloppy 👍, or corrective 👍 — Igor decides)
  //   Either way the chain stops; the run-job2 loop drops the annot from
  //   pending whenever rating === 'thumbs-up' regardless of decision.
  let decision;
  let finalPick = pick;
  if (!pick) {
    decision = 'no_reviewer_output';
  } else {
    const anyUp = allViews.find(v => v.rating === 'thumbs-up');
    if (anyUp) {
      const bigDiff = detectBigDiff(anyUp.finalAnswer, skel.rewriteAnswer);
      decision = bigDiff ? 'pending-igor' : 'auto-resolved';
      finalPick = anyUp;
    } else {
      // Auto-resolve down gate (2026-04-25, Igor codification):
      //   ALL configured reviewers fired (≥2) AND ALL rated 👎 AND ALL flagged G1
      //   → auto-resolved (decision = 'auto-resolved', pick rating = thumbs-down).
      //   V6 G1 = anchor-skill rule fail (no Logical Reasoning / TCG / World
      //   Knowledge tag). Structural — annotator can't fix without changing
      //   tagged skills, which would be a different prompt entirely. When two
      //   independent models both flag G1, the prompt is unfixable as written
      //   and Igor doesn't need to verdict.
      //
      //   Bulk-delete pattern observed in 2026-04-25 batch: 14/15 both-👎 cases
      //   were G1; Igor confirmed all 14 as deletes — codify the pattern.
      //
      //   The verdict here is just thumbs-down. Whether SA action becomes
      //   delete (cycle 2) or QC_Return (cycle 1) is decided downstream at
      //   Job 3 fan-out (run-job3.mjs) per CLAUDE.md cycle/action mapping.
      const fullCoverage = REVIEWERS.length >= 2 && allViews.length === REVIEWERS.length;
      const allDown = allViews.length > 0 && allViews.every(v => v.rating === 'thumbs-down');
      const allG1 = allViews.length > 0 && allViews.every(v => (v.flags || []).includes('G1'));
      if (fullCoverage && allDown && allG1) {
        decision = 'auto-resolved';
        // pick stays as pickBestVerdict's first 👎 — render switches on pick.rating
      } else {
        decision = 'pending-igor';
      }
    }
  }
  merged.push({ n: skel.n, decision, pick: finalPick, allViews, skel });
}

// ---------- emit task file ----------

const taskId = taskIdM?.[1] ?? '?';
const saFile = saFilenameM?.[1] ?? `${STEM}.json`;
const image  = imageM?.[1] ?? `screenshots/${STEM}.png`;
const today  = process.env.LOCAL_DATE ?? new Date().toLocaleDateString('en-CA');

function renderUnchanged(entry) {
  const { skel } = entry;
  const lines = [];
  lines.push(`## Annotation ${entry.n}\n`);
  lines.push(`- **Rating:** unchanged (thumbs-up carry-forward from prior cycle)`);
  lines.push(`- **Flags:** []`);
  lines.push(`- **Skills Tagged:** ${skel.skills}`);
  lines.push(`- **Question Type:** ${skel.qtype}`);
  lines.push(`- **Model Answer:** ${skel.modelAnswer}`);
  lines.push(`- **Annotator Answer:** ${skel.annotatorAnswer}\n`);
  lines.push(`#### Full Prompt\n${skel.prompt}\n`);
  lines.push(`#### Rewrite Answer\n${skel.rewriteAnswer}\n`);
  lines.push(`---\n`);
  return lines.join('\n');
}

function renderAnnotation(entry) {
  if (entry.decision === 'unchanged') return renderUnchanged(entry);

  const { n, pick, allViews = [], skel } = entry;
  const lines = [];
  lines.push(`## Annotation ${n}\n`);

  if (!pick) {
    lines.push(`- **Rating:** UNRESOLVED — no reviewer produced a verdict`);
    lines.push(`- **Flags:** []`);
    lines.push(`- **Skills Tagged:** ${skel.skills}`);
    lines.push(`- **Question Type:** ${skel.qtype}`);
    lines.push(`- **Model Answer:** ${skel.modelAnswer}`);
    lines.push(`- **Annotator Answer:** ${skel.annotatorAnswer}\n`);
    lines.push(`#### Full Prompt\n${skel.prompt}\n`);
    lines.push(`#### Rewrite Answer\n${skel.rewriteAnswer}\n`);
    // Even without a parseable rating, embed any reviewer bodies that landed
    // — Igor may still glean signal from the prose.
    const stripHeader = (body) =>
      body.replace(/^##+\s+(?:Cycle\s*2\s*—\s*)?Annotation\s+\d+\b.*\n?/, '');
    for (const v of allViews) {
      lines.push(`#### Reviewer Body (${v.name}) — no parseable rating\n${stripHeader(v.body)}\n`);
    }
    lines.push(`**ESCALATE — Igor resolve at Job 3.** No reviewer produced a verdict. Re-run reviewers or escalate manually.\n`);
    lines.push(`---\n`);
    return lines.join('\n');
  }

  const flagsStr = pick.flags.length ? `[${pick.flags.join(', ')}]` : '[]';

  // One-line verdict summary across ALL reviewers (helps Igor scan at 3a).
  // Format: "gpt: 👎, opus: 👍 (picked)"
  const ratingIcon = (r) => r === 'thumbs-up' ? '👍' : r === 'thumbs-down' ? '👎' : '?';
  const verdictSummary = allViews.map(v =>
    `${v.name}: ${ratingIcon(v.rating)}${v.name === pick.name ? ' (picked)' : ''}`
  ).join(', ');

  lines.push(`- **Reviewer:** ${pick.name}`);
  lines.push(`- **Rating:** ${pick.rating}`);
  lines.push(`- **All Verdicts:** ${verdictSummary}`);
  lines.push(`- **Flags:** ${flagsStr}`);
  lines.push(`- **Final Answer (reviewer):** ${pick.finalAnswer ?? '(none parsed)'}`);
  lines.push(`- **Skills Tagged:** ${skel.skills}`);
  lines.push(`- **Question Type:** ${skel.qtype}`);
  lines.push(`- **Model Answer:** ${skel.modelAnswer}`);
  lines.push(`- **Annotator Answer:** ${skel.annotatorAnswer}\n`);

  lines.push(`#### Full Prompt\n${skel.prompt}\n`);
  lines.push(`#### Rewrite Answer (annotator)\n${skel.rewriteAnswer}\n`);

  // Embed EVERY reviewer's body (not just the picked one) so Igor sees both
  // perspectives at 3a — especially important when reviewers disagree.
  // Strip leading `## Annotation N` from each body so the embedded headers
  // don't collide with the outer annotation header (downstream parsers key
  // blocks by annotation number — duplicate inner headers would overwrite).
  const stripHeader = (body) =>
    body.replace(/^##+\s+(?:Cycle\s*2\s*—\s*)?Annotation\s+\d+\b.*\n?/, '');
  for (const v of allViews) {
    const tag = v.name === pick.name ? ' (picked)' : '';
    lines.push(`#### Reviewer Body (${v.name})${tag}\n${stripHeader(v.body)}\n`);
  }

  // Cycle-aware SA action (per HOST_SOP.md):
  //   cycle 1 + 👎 = QC_Return (annotator gets to rewrite)
  //   cycle 2 + 👎 = delete (annotator already had a chance)
  //   any cycle + 👍 = approve annotator's answer
  const downAction = isCycle2 ? 'delete' : 'QC_Return';
  const cycleLabel = isCycle2 ? 'cycle 2' : 'cycle 1';

  // Skill-edit deltas parsed from picked reviewer's `Edits Made` text. The
  // merger emits these inline in the Auto Verdict block so Job 3b can read
  // them without re-parsing reviewer prose. Empty arrays = no edits.
  // Igor can override at 3a by appending his own skills_check: / skills_uncheck:
  // lines in the Igor Verdict block (Igor wins).
  const editsDelta = parseEditsMade(pick.editsMadeText ?? '');
  const checkStr   = `[${editsDelta.skills_check.join(', ')}]`;
  const uncheckStr = `[${editsDelta.skills_uncheck.join(', ')}]`;
  const hasSkillEdit = editsDelta.skills_check.length > 0 || editsDelta.skills_uncheck.length > 0;

  if (entry.decision === 'auto-resolved') {
    if (pick.rating === 'thumbs-up') {
      const matchNote = pick.finalAnswer && skel.rewriteAnswer
        && pick.finalAnswer.trim().toLowerCase() === skel.rewriteAnswer.trim().toLowerCase()
        ? '(matches annotator)'
        : `(reviewer's own answer was \`${pick.finalAnswer ?? '?'}\`, but rule = accept annotator's answer)`;
      lines.push(`**Auto-resolved at Job 2 (👍).** ${pick.name} 👍 ${matchNote}. SA action at Job 4: approve annotator's answer \`${skel.rewriteAnswer}\` (${cycleLabel}). Skipped at Job 3 walkthrough.\n`);
      // Auto Verdict block — makes carve-out classification readable from the
      // task file alone (state IS the filesystem). prepare-job3b-summary.mjs
      // counts an annot as 3a-done if it has Auto Verdict OR Igor Verdict.
      lines.push(`#### Auto Verdict`);
      lines.push(`carve_out: 👍-close`);
      lines.push(`rating: thumbs-up`);
      lines.push(`final_answer: ${skel.rewriteAnswer}`);
      lines.push(`source: ${pick.name}`);
      lines.push(`sa_action: approve`);
      lines.push(`skills_check: ${checkStr}`);
      lines.push(`skills_uncheck: ${uncheckStr}`);
      const skillNote = hasSkillEdit ? ` Skill edits: check=${checkStr}, uncheck=${uncheckStr}.` : '';
      lines.push(`notes: ${pick.name} 👍 close to annotator; SA approves annotator's answer.${skillNote}\n`);
    } else {
      lines.push(`**Auto-resolved at Job 2 (👎).** All ${allViews.length} reviewers 👎 with G1 (V6 anchor-skill fail). SA action at Job 4: **${downAction}** (${cycleLabel}). Skipped at Job 3 walkthrough.\n`);
      lines.push(`#### Auto Verdict`);
      lines.push(`carve_out: 👎-unanimous-G1`);
      lines.push(`rating: thumbs-down`);
      lines.push(`final_answer: ${pick.finalAnswer ?? 'N/A'}`);
      lines.push(`source: ${pick.name}`);
      lines.push(`sa_action: ${downAction}`);
      lines.push(`skills_check: ${checkStr}`);
      lines.push(`skills_uncheck: ${uncheckStr}`);
      lines.push(`notes: All ${allViews.length} reviewers 👎 with G1 (V6 anchor-skill fail). ${cycleLabel}.\n`);
    }
  } else {
    const igorDownAction = `(${cycleLabel}: 👎 → ${downAction}; 👍 → approve)`;
    lines.push(`**Pending Igor at Job 3.** Reviewer verdicts above are advisory; Igor decides 👍/👎. ${igorDownAction}\n`);
  }

  lines.push(`#### Edits Made\n(to be filled at Job 3 if needed)\n`);
  // Feedback block: legacy V6 rule (HOST_SOP.legacy.md line 583) requires a
  // dated rationale whenever any field changed. For auto-resolved 👍 with
  // skill deltas, emit an edit-explaining feedback so payload sa.feedback
  // mirrors something useful (Job 3b verifier requires non-null when edits).
  // Format: M/D: short-date.
  const mdToday = `${new Date().getMonth() + 1}/${new Date().getDate()}`;
  let feedbackBody;
  if (entry.decision === 'auto-resolved' && pick.rating === 'thumbs-up' && hasSkillEdit) {
    // Legacy format (HOST_SOP era): preserve the reviewer's reasoning text but
    // NEVER name the reviewer model. RLHF integrity — annotator reads QC
    // feedback; LLM identity must not leak. See CLAUDE.md §Hard rules.
    let editsText = (pick.editsMadeText ?? '').trim();
    // False-correction guard (codified 2026-04-30 from OKR_117 A2): when the
    // picked reviewer's Final Answer equals the annotator's rewrite, the SA
    // action is `approve annotator's answer` — no answer edit happens. But
    // reviewers (esp. gemini) sometimes write "Corrected the final rewrite
    // answer" in their Edits Made because they computed a value the model got
    // wrong. That prose, pasted verbatim into the annotator-facing QC
    // feedback, falsely claims a correction. Strip such claims when there's
    // no actual answer edit, leaving any genuine skill/qtype/prompt edit prose
    // intact.
    const finalEqAnnotator = pick.finalAnswer && skel.rewriteAnswer
      && pick.finalAnswer.trim().toLowerCase() === skel.rewriteAnswer.trim().toLowerCase();
    if (finalEqAnnotator && editsText) {
      // Match "Corrected the final (rewrite )?answer..." up to a sentence
      // boundary (period + space, or end of string). Case-insensitive.
      // Variants caught: "Corrected the final answer", "Corrected the rewrite
      // answer", "Corrected the final rewrite answer", "Final answer
      // corrected", "Answer corrected", "Fixed the rewrite answer".
      editsText = editsText
        .replace(/(?:^|(?<=\.\s))(?:Corrected|Fixed|Updated)\s+(?:the\s+)?(?:final\s+)?(?:rewrite\s+)?answer[^.]*\.\s*/gi, '')
        .replace(/(?:^|(?<=\.\s))(?:Final\s+)?(?:rewrite\s+)?answer\s+(?:was\s+)?corrected[^.]*\.\s*/gi, '')
        .replace(/^\s*\.\s*/, '')   // tidy leading orphan period
        .trim();
    }
    feedbackBody = editsText
      ? `${mdToday}: Skill tag corrected: ${editsText}`
      : `${mdToday}: Skill tag corrected (no rationale captured).`;
  } else {
    const feedbackTag = entry.decision === 'auto-resolved' ? 'auto-resolved' : 'pending Igor verdict';
    feedbackBody = `${today}: ${pick.rating} (${pick.name}) — ${feedbackTag}`;
  }
  lines.push(`#### Feedback\n${feedbackBody}\n`);
  lines.push(`---\n`);
  return lines.join('\n');
}

// renderFormFillPayload was removed 2026-04-28: payload now lives in
// payloads/<stem>.yaml, written by Job 3's run-job3.mjs fan-out. The task
// file is the human-readable review record only — no embedded YAML.

const totalAnnots    = merged.length;
const pendingCount    = merged.filter(m => m.decision === 'pending-igor').length;
const autoResolvedCount = merged.filter(m => m.decision === 'auto-resolved').length;
const unresolvedCount = merged.filter(m => m.decision === 'no_reviewer_output').length;
const unchangedCount  = merged.filter(m => m.decision === 'unchanged').length;

const taskStatus = pendingCount + unresolvedCount > 0
  ? (autoResolvedCount > 0 ? 'PARTIAL-AUTO-RESOLVED' : 'ALL-PENDING-IGOR')
  : (autoResolvedCount > 0 ? 'ALL-AUTO-RESOLVED' : 'ALL-UNCHANGED');

let doc = '';
doc += `# Review: ${STEM}\n\n`;
doc += `## Task Info\n`;
doc += `- **task_id:** ${taskId}\n`;
doc += `- **SA_TASK_FILENAME:** ${saFile}\n`;
doc += `- **Image:** ${image}\n`;
doc += `- **Date:** ${today}\n`;
doc += `- **Review Cycle:** ${isCycle2 ? '2nd' : '1st'}\n`;
if (!isCycle2) {
  const hasPending = merged.some(m => m.decision === 'pending-igor' || m.decision === 'no_reviewer_output');
  const hasDown    = merged.some(m => m.decision !== 'unchanged' && m.pick?.rating === 'thumbs-down');
  const qcStatus   = hasPending ? 'TBD' : hasDown ? 'QC_Return' : 'QC_Complete';
  doc += `- **Task QC Status:** ${qcStatus}\n`;
}
doc += `\n`;
doc += `## Task Status\n`;
doc += `- **Status:** ${taskStatus}\n`;
doc += `- **Reviewers fired:** ${[...reviewerFiles.keys()].join(', ')}\n`;
doc += `- **Summary:** ${pendingCount} pending Igor, ${autoResolvedCount} auto-resolved, ${unresolvedCount} no-reviewer-output, ${unchangedCount} unchanged-carry-forward (of ${totalAnnots} total)\n\n`;
doc += `---\n\n`;

for (const entry of merged) doc += renderAnnotation(entry);

// DRY_RUN mode: skip the immutable task-file write. run-job2 calls the merger
// repeatedly during the reviewer loop (to update the pending list), but only
// the FINAL pass should commit tasks/<stem>.md. Loop iterations pass
// DRY_RUN=1; the final commit call does not.
const DRY_RUN = process.env.DRY_RUN === '1';

if (!DRY_RUN) {
  // Immutability guard: tasks/<stem>.md is write-once. Job 1 archives any
  // prior-cycle file to <stem>.cycle1.md before this point. If <stem>.md
  // still exists, refuse to clobber.
  if (existsSync(OUT_TASK)) {
    console.error(`[job2-merge] REFUSE: ${OUT_TASK} already exists. tasks/<stem>.md is write-once.`);
    console.error(`[job2-merge] Move it aside or delete it before re-merging.`);
    process.exit(1);
  }
  writeFileSync(OUT_TASK, doc, 'utf8');
}

// Summary JSON — kept lean for run-job2 stats consumer
const summary = {
  stem: STEM,
  generated_at: new Date().toISOString(),
  reviewers_used: [...reviewerFiles.keys()],
  fire_order: REVIEWERS,
  total: totalAnnots,
  pending: pendingCount,
  auto_resolved: autoResolvedCount,
  unresolved: unresolvedCount,
  unchanged: unchangedCount,
  // run-job2 early-stop reads `escalate`. Auto-resolved annots are NOT escalated.
  escalate: pendingCount + unresolvedCount,
  agree: autoResolvedCount,
  cycle: isCycle2 ? 2 : 1,
  per_annotation: merged.map(m => {
    // sa_action: per-annot SA action (NOT task-level status).
    //   👍 → approve (SA approves the annotator's answer on this annot)
    //   👎 + cycle 1 → reject (SA marks annot down; task-level QC_Return derived from any reject)
    //   👎 + cycle 2 → delete (SA removes the annot; task-level QC_Complete still applies)
    //   unchanged carry-forward → none (no SA edit on this annot)
    //   no_reviewer_output → escalate (needs manual handling)
    // Task-level QC status (QC_Return / QC_Complete) is computed downstream from
    // per-annot sa_action — see scripts/prepare-job3b-summary.mjs.
    let saAction;
    if (m.decision === 'unchanged') saAction = 'none';
    else if (m.decision === 'no_reviewer_output') saAction = 'escalate';
    else if (m.pick?.rating === 'thumbs-up') saAction = 'approve';
    else if (m.pick?.rating === 'thumbs-down') saAction = isCycle2 ? 'delete' : 'reject';
    else saAction = 'pending';
    return {
      n: m.n,
      decision: m.decision,
      reviewer: m.pick?.name ?? null,
      rating: m.pick?.rating ?? null,
      final_answer: m.pick?.finalAnswer ?? null,
      flags: m.pick?.flags ?? [],
      flags_missing: m.pick?.flagsMissing ?? false,
      sa_action: saAction,  // approve | QC_Return | delete | none | escalate | pending
    };
  }),
};
mkdirSync(pathDirname(OUT_SUMMARY), { recursive: true });
writeFileSync(OUT_SUMMARY, JSON.stringify(summary, null, 2), 'utf8');

console.error(`[job2-merge] ${STEM}: ${pendingCount} pending Igor, ${autoResolvedCount} auto-resolved, ${unresolvedCount} no-reviewer-output, ${unchangedCount} unchanged`);
console.error(`[job2-merge] wrote: ${OUT_TASK}`);
console.error(`[job2-merge] summary: ${OUT_SUMMARY}`);

} // end of IS_ENTRY orchestration block
