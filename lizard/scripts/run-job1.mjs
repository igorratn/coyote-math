#!/usr/bin/env node
// run-job1.mjs — Job 1: parse scrape file and write skeleton to tasks/skeleton/<stem>.md
//
// Usage: STEM=<stem> LIZARD_DIR=<path> node scripts/run-job1.mjs
//   or:  node scripts/run-job1.mjs <stem>
//
// Reads: scrapes/<stem>.txt
// Writes: tasks/skeleton/<stem>.md
// Fails (exit 1) if: scrape not found, parse error, consistency check fails, verdict guard

import { readFileSync, writeFileSync, existsSync, mkdirSync, renameSync } from 'fs';
import { resolve, join } from 'path';

const LIZARD_DIR = process.env.LIZARD_DIR || process.cwd();
const stem = process.env.STEM || process.argv[2];

if (!stem) {
  console.error('[run-job1] STEM env or argv[2] required');
  process.exit(1);
}

const scrapePath = join(LIZARD_DIR, 'scrapes', `${stem}.txt`);
const skeletonPath = join(LIZARD_DIR, 'tasks', 'skeleton', `${stem}.md`);
const priorTaskPath = join(LIZARD_DIR, 'tasks', `${stem}.md`);

if (!existsSync(scrapePath)) {
  console.error(`[run-job1] scrape not found: ${scrapePath}`);
  process.exit(1);
}

// Cycle detection by filesystem convention (not manifest):
//   tasks/<stem>.md absent + no archive + no done payload → cycle 1
//   tasks/<stem>.md present                               → cycle 2 (archive cycle 1 first)
//   tasks/<stem>.cycle1.md exists                         → cycle 2 (already archived)
//   payloads/done/<stem>.yaml exists                      → cycle 2 (cycle 1 already shipped)
// (codified 2026-05-04: prior bug — Plot_Titration_67 finalized to done/ in a
// prior session, then re-queued; cycle detection only checked tasks/ paths
// and treated it as cycle 1, missing the cycle-2 scope filter for returnees.)
// task_id + SA_TASK_FILENAME come from scrape headers below — no manifest read needed.
const archivePath = priorTaskPath.replace(/\.md$/, '.cycle1.md');
const donePayloadPath = join(LIZARD_DIR, 'payloads', 'done', `${stem}.yaml`);
const doneCycle1PayloadPath = join(LIZARD_DIR, 'payloads', 'done', `${stem}.cycle1.yaml`);

// Cycle-3 guard (codified 2026-05-05): both done/<stem>.yaml AND
// done/<stem>.cycle1.yaml present means cycle 2 already finalized — Job 1 fire
// would be cycle 3 (not supported). queue-intake.mjs has the same guard;
// this is defense-in-depth in case a queue file was hand-written.
if (existsSync(donePayloadPath) && existsSync(doneCycle1PayloadPath)) {
  console.error(`[run-job1] ABORT: cycle 3 not supported — both done/${stem}.yaml and done/${stem}.cycle1.yaml exist.`);
  console.error(`  Stem already finished cycle 2. Move done/ artifacts aside if you really need to re-process.`);
  process.exit(1);
}

const cycle = (existsSync(priorTaskPath) || existsSync(archivePath) || existsSync(donePayloadPath)) ? 2 : 1;
const taskId = '?';            // overridden by scrape header below
const saTaskFilename = stem + '.json';  // overridden by scrape header below

// Cycle-2 archive: move tasks/<stem>.md → tasks/<stem>.cycle1.md before Job 2
// rebuilds the task file fresh. Makes tasks/<stem>.md effectively write-once
// per cycle — no need for a content-inspection guard against verdict wipe.
// If the archive already exists, this is a re-run; refuse to clobber it.
if (cycle === 2 && existsSync(priorTaskPath)) {
  if (existsSync(archivePath)) {
    console.error(`[run-job1] ABORT: both ${priorTaskPath} and ${archivePath} exist — archive collision.`);
    console.error(`  Move/rename one aside and re-run.`);
    process.exit(1);
  }
  renameSync(priorTaskPath, archivePath);
  console.error(`[run-job1] cycle 2 detected — archived ${stem}.md → ${stem}.cycle1.md`);
}

// ---------- Parse scrape ----------
const raw = readFileSync(scrapePath, 'utf8');
const lines = raw.split('\n');

function getHeader(key) {
  const line = lines.find(l => l.startsWith(key + ': '));
  return line ? line.slice(key.length + 2).trim() : '';
}

const scrapeTaskId = getHeader('TASK_ID') || taskId;
const scrapeFilename = getHeader('SA_TASK_FILENAME') || saTaskFilename;
const imageUrl = getHeader('IMAGE_URL');
const nAnnotations = parseInt(getHeader('N_ANNOTATIONS') || '0', 10);

if (nAnnotations < 1) {
  console.error(`[run-job1] N_ANNOTATIONS < 1 in scrape — aborting`);
  process.exit(1);
}

// Determine image extension from IMAGE_URL
let imgExt = 'png';
try {
  const urlNoQuery = imageUrl.split('?')[0];
  const basename = urlNoQuery.split('/').pop() || '';
  const ext = basename.split('.').pop();
  if (ext && ext.length <= 4) imgExt = ext;
} catch { /* leave default */ }

// Split scrape into per-annotation sections
// Sections start with "=== ANNOTATION N ===" and end before next section or "=== STATUS_LOG"
const annotations = [];
for (let i = 1; i <= nAnnotations; i++) {
  const startMarker = `=== ANNOTATION ${i} ===`;
  const endMarker = i < nAnnotations ? `=== ANNOTATION ${i + 1} ===` : '=== STATUS_LOG_TEXT ===';

  const startIdx = lines.findIndex(l => l.trim() === startMarker);
  const endIdx = lines.findIndex(l => l.trim() === endMarker);

  if (startIdx === -1) {
    console.error(`[run-job1] annotation ${i} marker not found in scrape`);
    process.exit(1);
  }

  const section = lines.slice(startIdx + 1, endIdx === -1 ? undefined : endIdx).join('\n');

  function getSectionField(key) {
    const re = new RegExp(`^${key}: (.*)$`, 'm');
    const m = section.match(re);
    return m ? m[1].trim() : '';
  }

  function getSectionBlock(label) {
    // Extract content between "--- LABEL ---" and next "---" block or end
    const startRe = new RegExp(`^--- ${label} ---$`, 'm');
    const sm = section.match(startRe);
    if (!sm || sm.index === undefined) return '';
    const afterStart = section.slice(sm.index + sm[0].length).trimStart();
    const nextBlock = afterStart.match(/^--- .+ ---$/m);
    const content = nextBlock
      ? afterStart.slice(0, nextBlock.index)
      : afterStart;
    return content.trim();
  }

  const skills = getSectionField('SKILLS');
  const qtype = getSectionField('QTYPE');
  const modelAnswer = getSectionField('MODEL_GENERATED_ANSWER');
  const annotatorAnswer = getSectionField('ANSWER');
  const stumped = getSectionField('STUMPED');
  const workRating = getSectionField('WORK_RATING');
  const qcRating = getSectionField('QC_RATING');
  const prompt = getSectionBlock('PROMPT');
  const promptLen = parseInt(getSectionField('PROMPT_LEN') || '0', 10);

  if (promptLen < 50) {
    console.error(`[run-job1] A${i}: prompt_len ${promptLen} < 50 — aborting`);
    process.exit(1);
  }
  if (!annotatorAnswer) {
    console.error(`[run-job1] A${i}: empty answer — aborting`);
    process.exit(1);
  }
  // Empty/API-failure model answer → treat as not stumped (model = annotator).
  // Codified 2026-04-29: original rule was to abort; updated 2026-05-01 per ruling:
  // no model answer is treated identically to model answering correctly (not stumped).
  // Feedback to annotator: regenerate model answer before resubmitting.
  const ma = (modelAnswer ?? '').trim();
  const apiFailureRe = /^\(?\s*(empty|none|null|n\/a|api\s*(failure|error|timeout))/i;
  const modelAnswerEffective = (!ma || apiFailureRe.test(ma)) ? annotatorAnswer : modelAnswer;

  // Strip question-type tokens from skills list (MCQ/Short answer question are qtype, not skills)
  const skillsClean = skills.split(',').map(s => s.trim())
    .filter(s => s !== 'MCQ' && s !== 'Short answer question' && s.length > 0)
    .join(', ');

  const modelAnswerMissing = (!ma || apiFailureRe.test(ma));
  annotations.push({ n: i, skills: skillsClean, qtype, modelAnswer: modelAnswerEffective, modelAnswerMissing, annotatorAnswer, stumped, workRating, qcRating, prompt });
}

// Cycle-2 scope filter (CLAUDE.md §Job 1 step 6): emit skeleton only for the
// thumbs-down returnees. Carry-forward (approve / unset) annots stay as-is in
// SA from cycle 1 — Job 5 won't touch them. Cycle 1: include all.
// (codified 2026-05-03 — incident: Violin_163 cycle 2 emitted all 5 annots,
// re-reviewed/re-pushed already-approved A4+A5 unnecessarily.)
const annotationsForSkeleton = (cycle === 2)
  ? annotations.filter(a => a.qcRating === 'disapprove')
  : annotations;
if (cycle === 2) {
  const dropped = annotations.filter(a => a.qcRating !== 'disapprove').map(a => a.n);
  if (dropped.length) {
    console.error(`[run-job1] cycle-2 scope filter: keeping ${annotationsForSkeleton.map(a => a.n).join(',') || '(none)'} (returnees); dropping ${dropped.join(',')} (carry-forward, qc=approve/unset)`);
  }
  if (annotationsForSkeleton.length === 0) {
    console.error(`[run-job1] cycle-2 scope filter: 0 thumbs-down annots — nothing to re-review. Aborting.`);
    process.exit(1);
  }
}

// ---------- Build skeleton markdown ----------
const cycleLabel = cycle === 1 ? '1st' : cycle === 2 ? '2nd' : cycle === 3 ? '3rd' : `${cycle}th`;
// Date in PST YYYY-MM-DD — codified 2026-05-09 (Igor: always PST regardless of TZ env).
const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Los_Angeles' }).format(new Date());

const lines_out = [];
lines_out.push(`# Skeleton: ${stem}`);
lines_out.push('');
lines_out.push('## Task Info');
lines_out.push(`- **task_id:** ${scrapeTaskId}`);
lines_out.push(`- **SA_TASK_FILENAME:** ${scrapeFilename}`);
lines_out.push(`- **Image:** screenshots/${stem}.${imgExt} — (description)`);
lines_out.push(`- **Date:** ${today}`);
lines_out.push(`- **Review Cycle:** ${cycleLabel}`);

for (const a of annotationsForSkeleton) {
  lines_out.push('');
  lines_out.push(`## Annotation ${a.n}`);
  lines_out.push(`- **Skills Tagged:** ${a.skills}`);
  lines_out.push(`- **Question Type:** ${a.qtype}`);
  lines_out.push(`- **Model Answer:** ${a.modelAnswerMissing ? '(no model answer — treat as not stumped)' : a.modelAnswer}`);
  lines_out.push(`- **Annotator Answer:** ${a.annotatorAnswer}`);
  lines_out.push(`- **STUMPED:** ${a.stumped}`);
  lines_out.push(`- **WORK_RATING:** ${a.workRating}`);
  lines_out.push(`- **QC_RATING:** ${a.qcRating || 'unset'}`);
  lines_out.push('');
  lines_out.push('#### Full Prompt');
  lines_out.push(a.prompt);
  lines_out.push('');
  lines_out.push('#### Rewrite Answer');
  lines_out.push(a.annotatorAnswer);
  lines_out.push('');
  lines_out.push('#### Two-Part Check');
  lines_out.push('(to be filled by reviewer)');
  lines_out.push('');
  lines_out.push('#### Edits Made');
  lines_out.push('(to be filled by reviewer)');
  lines_out.push('');
  lines_out.push('#### Feedback');
  if (a.modelAnswerMissing) {
    lines_out.push('(pre-flight) Model did not generate an answer for this annotation — treated as not stumped. Annotator must regenerate model response before resubmitting.');
  } else {
    lines_out.push('(to be filled by reviewer)');
  }
  if (a !== annotationsForSkeleton[annotationsForSkeleton.length - 1]) {
    lines_out.push('');
    lines_out.push('---');
  }
}
lines_out.push('');

mkdirSync(join(LIZARD_DIR, 'tasks', 'skeleton'), { recursive: true });
writeFileSync(skeletonPath, lines_out.join('\n'), 'utf8');

console.log(`[run-job1] skeleton written: ${skeletonPath}`);
console.log(`[run-job1] stem=${stem} cycle=${cycle} n_annotations=${annotationsForSkeleton.length}${cycle === 2 ? ` (of ${nAnnotations} total)` : ''}`);
