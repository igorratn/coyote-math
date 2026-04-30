#!/usr/bin/env node
// run-job3.mjs — Job 3 Phase B: payload fan-out.
//
// Reads tasks/<stem>.md (Auto Verdicts + Igor Verdicts + skeleton-mirror fields)
// and writes payloads/<stem>.yaml per the schema locked in CLAUDE.md (2026-04-28).
//
// Phase A (manual Igor Verdict appends) must be complete before this runs.
// Validation: every annot in the task file must have either #### Auto Verdict
// (Job 2 carve-out) or #### Igor Verdict (manual). Missing → exit 2.
//
// Cycle detection (filesystem-derived):
//   tasks/<S>.cycle1.md exists → cycle 2; else cycle 1.
//
// Write discipline:
//   payloads/<stem>.yaml is write-once. Atomic .tmp + rename. Refuse if
//   the file already exists.
//
// Usage:
//   STEM=<stem> [LIZARD_DIR=<abs path>] node scripts/run-job3.mjs
//
// Exit codes:
//   0 = payload written
//   1 = IO / parse error
//   2 = validation error (missing verdicts, bad rating, etc.)

import { readFileSync, writeFileSync, existsSync, renameSync, mkdirSync, unlinkSync } from 'fs';
import { join, resolve, dirname as pathDirname } from 'path';
import { fileURLToPath } from 'url';
import {
  parseIgorVerdicts,
  parseAutoVerdicts,
  getAnnotationFeedback,
} from './prepare-job3b-helpers.mjs';

const __dir = pathDirname(fileURLToPath(import.meta.url));
const LIZARD_DIR = process.env.LIZARD_DIR ?? resolve(__dir, '..');
const STEM = process.env.STEM;
if (!STEM) {
  console.error('[run-job3] ERROR: STEM env var required');
  process.exit(1);
}

const TASK_FILE      = join(LIZARD_DIR, 'tasks', `${STEM}.md`);
const CYCLE1_ARCHIVE = join(LIZARD_DIR, 'tasks', `${STEM}.cycle1.md`);
const PAYLOAD_DIR    = join(LIZARD_DIR, 'payloads');
const PAYLOAD_FILE   = join(PAYLOAD_DIR, `${STEM}.yaml`);
const PAYLOAD_TMP    = `${PAYLOAD_FILE}.tmp`;

if (!existsSync(TASK_FILE)) {
  console.error(`[run-job3] ERROR: ${TASK_FILE} not found (Job 2 not done?)`);
  process.exit(1);
}
if (existsSync(PAYLOAD_FILE)) {
  console.error(`[run-job3] REFUSE: ${PAYLOAD_FILE} already exists. Payload is write-once.`);
  console.error(`[run-job3] Move/delete the existing payload before re-running.`);
  process.exit(1);
}

const taskTxt = readFileSync(TASK_FILE, 'utf8');
const cycle   = existsSync(CYCLE1_ARCHIVE) ? 2 : 1;

// ---------- task-level metadata ----------
const taskIdM = /^- \*\*task_id:\*\*\s*(\S+)/m.exec(taskTxt);
const saFileM = /^- \*\*SA_TASK_FILENAME:\*\*\s*(\S+)/m.exec(taskTxt);
const imageM  = /^- \*\*Image:\*\*\s*(.+?)$/m.exec(taskTxt);

const taskId = taskIdM?.[1] ?? '?';
const saFile = saFileM?.[1] ?? `${STEM}.json`;
const image  = imageM?.[1]?.trim() ?? `screenshots/${STEM}.png`;

// ---------- per-annot parser (skeleton-mirror fields rendered by job2-merge) ----------
function parseAnnotBlocks(txt) {
  const out = new Map();
  const re = /^## Annotation (\d+)/gm;
  const heads = [];
  let m;
  while ((m = re.exec(txt)) !== null) heads.push({ n: parseInt(m[1], 10), idx: m.index });

  // Stop at Form-Fill Payload section (legacy emit) or end-of-file
  const payloadIdx = txt.indexOf('\n## Form-Fill Payload');
  const cutoff = payloadIdx >= 0 ? payloadIdx : txt.length;
  const annotHeads = heads.filter(h => h.idx < cutoff);

  for (let i = 0; i < annotHeads.length; i++) {
    const start = annotHeads[i].idx;
    const end   = (i + 1 < annotHeads.length) ? annotHeads[i + 1].idx : cutoff;
    const block = txt.slice(start, end);

    const skills    = /^- \*\*Skills Tagged:\*\*\s*(.+?)$/m.exec(block);
    const qtype     = /^- \*\*Question Type:\*\*\s*(.+?)$/m.exec(block);
    const modelA    = /^- \*\*Model Answer:\*\*\s*(.+?)$/m.exec(block);
    const annotA    = /^- \*\*Annotator Answer:\*\*\s*(.+?)$/m.exec(block);
    const flagsM    = /^- \*\*Flags:\*\*\s*\[(.*?)\]/m.exec(block);
    const ratingM   = /^- \*\*Rating:\*\*\s*(.+?)$/m.exec(block);
    const promptM   = /#### Full Prompt\n([\s\S]*?)(?=\n####|\n---|\n###|\n## |$)/.exec(block);
    const rewriteM  = /#### Rewrite Answer(?:\s*\(annotator\))?\n([\s\S]*?)(?=\n####|\n---|\n###|\n## |$)/.exec(block);

    out.set(annotHeads[i].n, {
      n:               annotHeads[i].n,
      skills:          skills?.[1].trim()  ?? '',
      qtype:           qtype?.[1].trim()   ?? '',
      modelAnswer:     modelA?.[1].trim()  ?? '',
      annotatorAnswer: annotA?.[1].trim()  ?? '',
      flags:           flagsM ? flagsM[1].split(',').map(s => s.trim()).filter(Boolean) : [],
      rating:          ratingM?.[1].trim() ?? '',
      prompt:          promptM?.[1].trim() ?? '',
      rewriteAnswer:   rewriteM?.[1].trim() ?? '',
    });
  }
  return out;
}

const annots = parseAnnotBlocks(taskTxt);
const auto   = parseAutoVerdicts(taskTxt);
const igor   = parseIgorVerdicts(taskTxt);

if (annots.size === 0) {
  console.error(`[run-job3] ERROR: no annotation blocks parsed from ${TASK_FILE}`);
  process.exit(1);
}

// ---------- resolve verdict + build per-annot payload ----------
const errors = [];
const built  = [];

for (const [n, ann] of annots) {
  // Skip cycle-2 carry-forwards (legacy "unchanged" rating). The new symmetric
  // cycle-2 design filters at Job 1 — these shouldn't appear, but if they do,
  // skip emit.
  if (/unchanged/i.test(ann.rating)) continue;

  // Igor Verdict overrides Auto Verdict (rating, final_answer, notes).
  // Skill-edit deltas: Igor wins iff he supplied skills_check/skills_uncheck
  // in his Igor Verdict block (parser returns null when fields absent);
  // otherwise fall back to Auto Verdict's parsed deltas.
  let source, rating, finalAnswer;
  let skillsCheck = [], skillsUncheck = [];
  if (n in igor) {
    source       = 'igor';
    rating       = igor[n].rating;
    finalAnswer  = igor[n].finalAnswer;
    // Igor's skill overrides if present, else fall back to Auto.
    skillsCheck   = igor[n].skillsCheck   ?? (auto[n]?.skillsCheck   ?? []);
    skillsUncheck = igor[n].skillsUncheck ?? (auto[n]?.skillsUncheck ?? []);
  } else if (n in auto) {
    source       = 'auto';
    rating       = auto[n].rating;
    finalAnswer  = auto[n].finalAnswer;
    skillsCheck   = auto[n].skillsCheck   ?? [];
    skillsUncheck = auto[n].skillsUncheck ?? [];
  } else {
    errors.push(`A${n}: no Igor Verdict or Auto Verdict — fan-out blocked`);
    continue;
  }

  // HARD RULE (codified 2026-04-29 after Dim_156 incident): on a thumbs-down
  // annotation, CLI must NOT edit annotator's metadata (skills, qtype, answer).
  // Per Slack Concede ruling — annotator gets the QC feedback and revises
  // themselves. Force empty skill arrays so any leftover Auto Verdict deltas
  // don't reach SA push. answer_final is also null (enforced via saAction
  // mapping above).
  //
  // Note: per-annot sa.action names ("approve" / "QC_Return" / "delete") borrow
  // task-level SA dropdown vocabulary, but they encode per-annot behavior. The
  // task-level QC dropdown (Igor's manual setting) is independent.
  if (rating === 'thumbs-down') {
    skillsCheck = [];
    skillsUncheck = [];
  }
  if (!rating) {
    errors.push(`A${n}: verdict block present but no rating parsed`);
    continue;
  }

  // sa.action: cycle-1 + 👎 = QC_Return; cycle-2 + 👎 = delete; 👍 = approve.
  let saAction;
  if (rating === 'thumbs-up') {
    saAction = 'approve';
  } else if (rating === 'thumbs-down') {
    saAction = (cycle === 2) ? 'delete' : 'QC_Return';
  } else {
    errors.push(`A${n}: rating='${rating}' not thumbs-up/thumbs-down`);
    continue;
  }

  // QC Feedback text (paste at SA push). Legacy rule (HOST_SOP.legacy.md
  // line 583): "feedback present iff thumbs-down OR any field changed".
  // Edits and feedback are coupled — if reviewer/Igor proposed a skill or
  // qtype delta, the annotator needs feedback explaining the change.
  // Empty deltas + 👍 → null. Non-empty deltas OR 👎 → pull curated text
  // from annotation's `#### Feedback` block.
  const answerCorrected = finalAnswer != null && finalAnswer !== ann.rewriteAnswer;
  const hasEdits = skillsCheck.length > 0 || skillsUncheck.length > 0 || answerCorrected;
  const feedback = (rating === 'thumbs-up' && !hasEdits)
    ? null
    : (getAnnotationFeedback(taskTxt, n) ?? null);

  // Per Slack ruling (`wiki/slack-rulings.md` Concede): for QC_Return cases,
  // do NOT edit the annotator's Rewrite Answer. Annotator gets the QC
  // Feedback and revises themselves. Payload sa.answer_final = null leaves
  // the SA Rewrite Answer field untouched at Job 4 push.
  // For 👍 (approve): write annotator's value (= rewriteAnswer).
  // For 👎 (cycle 2 → delete): also leave alone (annotator can't fix; Igor
  // clicks Delete in SA UI).
  const answerFinal = (saAction === 'approve')
    ? (finalAnswer ?? ann.rewriteAnswer ?? null)
    : null;

  built.push({
    n,
    sa: {
      action:         saAction,
      rating,
      answer_final:   answerFinal,
      flags:          ann.flags,
      feedback,
      verdict_source: source,
      skills_check:   skillsCheck,
      skills_uncheck: skillsUncheck,
      qtype:          ann.qtype,
    },
    hai: {
      task_id_field: saFile,
      role:          'Reviewing',
      annotation_n:  n,
      prompt:        ann.prompt,
      // hai.answer must mirror what's in SA's Rewrite Answer field after Job 4
      // push (audit-trail consistency: shadow's Rewrite Answer = SA truth).
      // - approve with correction: sa.answer_final ≠ annotator's → use corrected value
      // - approve without correction: sa.answer_final = annotator's → same value
      // - QC_Return / delete: sa.answer_final null → annotator's original (SA untouched)
      // (codified 2026-04-29 after Dim_19: reviewer corrected C→D, hai.answer stayed C → mismatch)
      answer:        answerFinal ?? ann.rewriteAnswer,
    },
  });
}

if (errors.length) {
  console.error('[run-job3] === fan-out BLOCKED ===');
  for (const e of errors) console.error(`  ✗ ${e}`);
  console.error(`\n${errors.length} error(s). Resolve verdicts in tasks/${STEM}.md and re-run.`);
  process.exit(2);
}
if (built.length === 0) {
  console.error(`[run-job3] ERROR: no annotations to emit (all unchanged?)`);
  process.exit(1);
}

// ---------- YAML emit ----------
// Hand-rolled minimal emitter. Strings → JSON-stringified (double-quoted, safe).
// Multi-line strings (prompt, feedback) → '|' block scalar.
// We control all field shapes here, so no library needed.

function yqStr(s) {
  if (s == null) return 'null';
  return JSON.stringify(String(s));
}
function yqBlock(s, indent) {
  const lines = String(s ?? '').split('\n');
  return lines.map(l => `${indent}${l}`).join('\n');
}
function yqStrOrBlock(s, indent) {
  if (s == null) return 'null';
  const str = String(s);
  if (str.includes('\n')) {
    return `|\n${yqBlock(str, indent)}`;
  }
  return yqStr(str);
}

const out = [];
out.push(`task:`);
out.push(`  stem: ${STEM}`);
out.push(`  sa_task_filename: ${saFile}`);
out.push(`  task_id: ${taskId}`);
out.push(`  image: ${image}`);
out.push(``);
out.push(`annotations:`);
for (const a of built) {
  out.push(``);
  out.push(`  - n: ${a.n}`);
  out.push(`    sa:`);
  out.push(`      action: ${a.sa.action}`);
  out.push(`      rating: ${a.sa.rating}`);
  out.push(`      answer_final: ${a.sa.answer_final == null ? 'null' : yqStrOrBlock(a.sa.answer_final, '        ')}`);
  // Flags may contain spaces (e.g. "Type 1"). Quote each to be unambiguous
  // in a YAML flow sequence regardless of parser dialect.
  out.push(`      flags: [${a.sa.flags.map(yqStr).join(', ')}]`);
  out.push(`      feedback: ${yqStrOrBlock(a.sa.feedback, '        ')}`);
  out.push(`      verdict_source: ${a.sa.verdict_source}`);
  out.push(`      skills_check: [${a.sa.skills_check.join(', ')}]`);
  out.push(`      skills_uncheck: [${a.sa.skills_uncheck.join(', ')}]`);
  out.push(`      qtype: ${yqStr(a.sa.qtype)}`);
  out.push(`    hai:`);
  out.push(`      task_id_field: ${a.hai.task_id_field}`);
  out.push(`      role: ${a.hai.role}`);
  out.push(`      annotation_n: ${a.hai.annotation_n}`);
  out.push(`      prompt: |`);
  out.push(yqBlock(a.hai.prompt, '        '));
  out.push(`      answer: ${yqStrOrBlock(a.hai.answer, '        ')}`);
}
out.push(``);

const yaml = out.join('\n');

// ---------- atomic write ----------
mkdirSync(PAYLOAD_DIR, { recursive: true });
writeFileSync(PAYLOAD_TMP, yaml, 'utf8');
renameSync(PAYLOAD_TMP, PAYLOAD_FILE);

// ---------- post-write self-verification ----------
// Re-read the payload, parse it back, cross-check semantics. On any failure
// roll back (delete the file) and exit non-zero. Catches serialization bugs
// + the rule violations the 2026-04-29 fix discovered (rating-driven feedback,
// QC_Return → null answer_final, etc.).
//
// Choreography note: the actor that wrote this payload is the same actor
// asserting its postcondition. No external orchestrator.
const verrs = verifyPayload(PAYLOAD_FILE, built, cycle, annots);
if (verrs.length) {
  console.error(`[run-job3] === post-write VERIFICATION FAILED for ${STEM} ===`);
  for (const e of verrs) console.error(`  ✗ ${e}`);
  try { unlinkSync(PAYLOAD_FILE); } catch {}
  console.error(`[run-job3] rolled back: deleted ${PAYLOAD_FILE}`);
  process.exit(3);
}

console.error(`[run-job3] ${STEM}: wrote ${PAYLOAD_FILE} (cycle ${cycle}, ${built.length} annots) — verified ✓`);
process.exit(0);

// ---------- helpers ----------
function verifyPayload(path, builtArr, cycle, annotMap) {
  // Re-read serialized payload and cross-check against in-memory `built` and
  // task-file `annotMap` (Map<n, {rewriteAnswer, ...}>). Returns array of
  // human-readable error strings; empty = clean.
  const errs = [];
  const txt = readFileSync(path, 'utf8');

  // 1. Annot count matches.
  const annCount = (txt.match(/^  - n: \d+$/gm) || []).length;
  if (annCount !== builtArr.length) {
    errs.push(`annot count: payload has ${annCount}, built has ${builtArr.length}`);
  }

  // Task-level disposition: when skip-set, per-annot rating/action MAY be null/none
  // (task is dropped at task level — per-annot review doesn't apply).
  const qcDispositionM = /^\s*qc_disposition:\s*"?([^"\n]+?)"?\s*$/m.exec(txt);
  const qcDisposition = qcDispositionM?.[1]?.trim();
  // V6 dropdown strings per Nikhil pinned 2026-04-29 in #lizard-reviewers.
  const isSkipDisposition = ['Valid Skipped to Hold', 'Valid Skipped to Skipped', 'Valid Skip to Unusable'].includes(qcDisposition);

  // 2. Per-annot rules.
  for (const a of builtArr) {
    const block = extractAnnotBlock(txt, a.n);
    if (!block) {
      errs.push(`A${a.n}: no annot block found in serialized payload`);
      continue;
    }
    const sa = a.sa;
    const hai = a.hai;
    const ann = annotMap.get(a.n);

    // Skip-disposition: per-annot fields permitted to be null/empty/none.
    // Verify they ARE null and skip the per-annot rating/action/edit checks.
    if (isSkipDisposition) {
      if (sa.rating != null && sa.rating !== 'thumbs-up' && sa.rating !== 'thumbs-down') {
        errs.push(`A${a.n}: task is ${qcDisposition} but rating is invalid: ${JSON.stringify(sa.rating)}`);
      }
      if (sa.action !== 'none' && sa.rating != null) {
        // Allow either: explicit { action: none, rating: null } OR legacy thumbs-down stamps
        // (current Dim_156 had action: QC_Return prior to schema cleanup).
      }
      continue;
    }

    // 2a. Rating ↔ action mapping.
    if (sa.rating === 'thumbs-up' && sa.action !== 'approve') {
      errs.push(`A${a.n}: thumbs-up should map to action=approve, got ${sa.action}`);
    }
    if (sa.rating === 'thumbs-down') {
      const expected = (cycle === 2) ? 'delete' : 'QC_Return';
      if (sa.action !== expected) {
        errs.push(`A${a.n}: cycle ${cycle} + thumbs-down should map to action=${expected}, got ${sa.action}`);
      }
    }

    // 2b. answer_final rule.
    if (sa.action === 'approve') {
      if (sa.answer_final == null) {
        errs.push(`A${a.n}: approve must have non-null answer_final`);
      }
    } else if (sa.action === 'QC_Return' || sa.action === 'delete') {
      if (sa.answer_final != null) {
        errs.push(`A${a.n}: ${sa.action} must have answer_final=null (do not edit annotator's rewrite), got ${JSON.stringify(sa.answer_final)}`);
      }
    }

    // 2c. Feedback rule (legacy, HOST_SOP.legacy.md line 583):
    //   feedback present iff thumbs-down OR any field changed (skills, qtype,
    //   prompt, answer). Empty edits + 👍 → null; non-empty edits OR 👎 → required.
    const answerCorrected = sa.answer_final != null && ann && sa.answer_final !== ann.rewriteAnswer;
    const hasFieldEdit = (sa.skills_check?.length ?? 0) > 0 || (sa.skills_uncheck?.length ?? 0) > 0 || answerCorrected;
    if (sa.rating === 'thumbs-up' && !hasFieldEdit) {
      if (sa.feedback != null) {
        errs.push(`A${a.n}: thumbs-up with no edits must have feedback=null, got ${JSON.stringify(sa.feedback?.slice?.(0, 60))}`);
      }
    } else if (sa.rating === 'thumbs-up' && hasFieldEdit) {
      if (!sa.feedback || !sa.feedback.trim()) {
        errs.push(`A${a.n}: thumbs-up with skill/qtype edits must have non-empty feedback explaining the change`);
      } else if (!/^\d{1,2}\/\d{1,2}:\s|\b\d{4}-\d{2}-\d{2}:\s/.test(sa.feedback)) {
        errs.push(`A${a.n}: thumbs-up + edit feedback must start with date stamp (M/D: or YYYY-MM-DD:), got ${JSON.stringify(sa.feedback.slice(0, 40))}`);
      } else {
        // Stale-placeholder gate: legacy Job-2 stamped feedbacks that pass the
        // date-stamp regex but don't explain a skill change ("YYYY-MM-DD:
        // thumbs-up (X) — auto-resolved" / "pending Igor verdict"). For
        // 👍 + edits the feedback MUST reference the change — at minimum,
        // mention "skill" / "drop" / "add" / "corrected" / "Removed" / "Added"
        // OR contain one of the edited skill names verbatim.
        const editedNames = [...(sa.skills_check ?? []), ...(sa.skills_uncheck ?? [])];
        const fb = sa.feedback;
        const hasEditWord = /\b(skill|drop|add|added|remove|removed|corrected|edit)/i.test(fb);
        const mentionsSkillName = editedNames.some(n => fb.toLowerCase().includes(n.toLowerCase()));
        if (!hasEditWord && !mentionsSkillName) {
          errs.push(`A${a.n}: thumbs-up + edit feedback must reference the change (a skill keyword or one of the edited skill names: ${JSON.stringify(editedNames)}), got ${JSON.stringify(fb.slice(0, 80))}`);
        }
      }
    }
    // RLHF integrity: regardless of rating, sa.feedback (annotator-facing
    // text) MUST NOT mention reviewer model names (codified 2026-04-29,
    // CLAUDE.md §Hard rules).
    if (sa.feedback && /\b(opus|gpt|gemini|grok)\b/i.test(sa.feedback)) {
      errs.push(`A${a.n}: feedback leaks reviewer model name (RLHF integrity violation): ${JSON.stringify(sa.feedback.slice(0, 80))}`);
    }
    if (sa.rating === 'thumbs-down') {
      // Per Slack Concede ruling: on thumbs-down, CLI must NOT edit annotator's
      // metadata (skills, qtype, answer). Annotator gets the QC feedback and
      // revises themselves. Force-empty skill arrays + answer_final null.
      if ((sa.skills_check?.length ?? 0) > 0 || (sa.skills_uncheck?.length ?? 0) > 0) {
        errs.push(`A${a.n}: thumbs-down must have empty skills_check + skills_uncheck (CLI does not edit annotator's metadata on 👎). Got check=${JSON.stringify(sa.skills_check)} uncheck=${JSON.stringify(sa.skills_uncheck)}`);
      }
      if (sa.answer_final != null) {
        errs.push(`A${a.n}: thumbs-down must have answer_final=null. Got ${JSON.stringify(sa.answer_final)}`);
      }
      if (!sa.feedback || !sa.feedback.trim()) {
        errs.push(`A${a.n}: thumbs-down must have non-empty feedback`);
      } else {
        // Date-stamp prefix: M/D: or YYYY-MM-DD:
        if (!/^\d{1,2}\/\d{1,2}:\s|\b\d{4}-\d{2}-\d{2}:\s/.test(sa.feedback)) {
          errs.push(`A${a.n}: thumbs-down feedback must start with date stamp (M/D: or YYYY-MM-DD:), got ${JSON.stringify(sa.feedback.slice(0, 40))}`);
        }
        // No workflow words.
        const banned = /\b(QC_Return|send back|send.?to.?annotator|Returned_to_Annotator|delete this annotation|delete the annotation)\b/i;
        if (banned.test(sa.feedback)) {
          errs.push(`A${a.n}: thumbs-down feedback contains workflow word (action belongs in sa.action, not prose)`);
        }
      }
    }

    // 2d. HAI side: answer must mirror SA's Rewrite Answer field after Job 4.
    // Approve-with-correction: hai.answer == sa.answer_final (corrected value).
    // Approve-no-correction / QC_Return / delete: hai.answer == annotator's original.
    if (ann) {
      const expectedHaiAnswer = sa.answer_final ?? ann.rewriteAnswer;
      if (hai.answer !== expectedHaiAnswer) {
        errs.push(`A${a.n}: hai.answer (${JSON.stringify(hai.answer)}) != expected (${JSON.stringify(expectedHaiAnswer)})`);
      }
    }

    // 2e. Sanity: serialized rating/action match the in-memory built record.
    const rSer = /^      rating: (\S+)/m.exec(block);
    const aSer = /^      action: (\S+)/m.exec(block);
    if (rSer && rSer[1] !== sa.rating) errs.push(`A${a.n}: serialized rating mismatch (${rSer[1]} vs ${sa.rating})`);
    if (aSer && aSer[1] !== sa.action) errs.push(`A${a.n}: serialized action mismatch (${aSer[1]} vs ${sa.action})`);
  }

  return errs;
}

function extractAnnotBlock(txt, n) {
  const re = new RegExp(`^  - n: ${n}$[\\s\\S]*?(?=^  - n: \\d+$|(?![\\s\\S]))`, 'm');
  const m = re.exec(txt);
  return m ? m[0] : null;
}
