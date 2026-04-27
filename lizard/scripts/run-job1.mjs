#!/usr/bin/env node
// run-job1.mjs — Job 1: parse scrape file and write skeleton to tasks/skeleton/<stem>.md
//
// Usage: STEM=<stem> LIZARD_DIR=<path> node scripts/run-job1.mjs
//   or:  node scripts/run-job1.mjs <stem>
//
// Reads: scrapes/<stem>.txt
// Writes: tasks/skeleton/<stem>.md
// Fails (exit 1) if: scrape not found, parse error, consistency check fails, verdict guard

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { resolve, join } from 'path';

const LIZARD_DIR = process.env.LIZARD_DIR || process.cwd();
const stem = process.env.STEM || process.argv[2];

if (!stem) {
  console.error('[run-job1] STEM env or argv[2] required');
  process.exit(1);
}

const scrapePath = join(LIZARD_DIR, 'scrapes', `${stem}.txt`);
const skeletonPath = join(LIZARD_DIR, 'tasks', 'skeleton', `${stem}.md`);
const manifestPath = join(LIZARD_DIR, 'scrapes', '_manifest.json');

if (!existsSync(scrapePath)) {
  console.error(`[run-job1] scrape not found: ${scrapePath}`);
  process.exit(1);
}

// Read manifest for cycle + task_id
let cycle = 1;
let taskId = '?';
let saTaskFilename = stem + '.json';
try {
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
  const entry = manifest.tasks?.find(t => t.stem === stem);
  if (entry) {
    cycle = entry.cycle ?? 1;
    taskId = String(entry.task_id ?? '?');
    saTaskFilename = entry.SA_TASK_FILENAME ?? saTaskFilename;
  }
} catch { /* manifest optional */ }

// Verdict guard: refuse to overwrite if existing skeleton has Igor Verdict blocks
if (existsSync(skeletonPath)) {
  const existing = readFileSync(skeletonPath, 'utf8');
  if (existing.includes('#### Igor Verdict')) {
    console.error(`[run-job1] ABORT: ${skeletonPath} already contains Igor Verdict block(s). Delete verdicts or move file aside before re-running Job 1.`);
    process.exit(1);
  }
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
  const qcFeedback = getSectionBlock('QC_FEEDBACK');
  const promptLen = parseInt(getSectionField('PROMPT_LEN') || '0', 10);

  if (promptLen < 50) {
    console.error(`[run-job1] A${i}: prompt_len ${promptLen} < 50 — aborting`);
    process.exit(1);
  }
  if (!annotatorAnswer) {
    console.error(`[run-job1] A${i}: empty answer — aborting`);
    process.exit(1);
  }

  // Strip question-type tokens from skills list (MCQ/Short answer question are qtype, not skills)
  const skillsClean = skills.split(',').map(s => s.trim())
    .filter(s => s !== 'MCQ' && s !== 'Short answer question' && s.length > 0)
    .join(', ');

  annotations.push({ n: i, skills: skillsClean, qtype, modelAnswer, annotatorAnswer, stumped, workRating, qcRating, prompt, qcFeedback });
}

// ---------- Build skeleton markdown ----------
const cycleLabel = cycle === 1 ? '1st' : cycle === 2 ? '2nd' : cycle === 3 ? '3rd' : `${cycle}th`;
const today = new Date().toISOString().slice(0, 10);

const lines_out = [];
lines_out.push(`# Skeleton: ${stem}`);
lines_out.push('');
lines_out.push('## Task Info');
lines_out.push(`- **task_id:** ${scrapeTaskId}`);
lines_out.push(`- **SA_TASK_FILENAME:** ${scrapeFilename}`);
lines_out.push(`- **Image:** screenshots/${stem}.${imgExt} — (description)`);
lines_out.push(`- **Date:** ${today}`);
lines_out.push(`- **Review Cycle:** ${cycleLabel}`);

for (const a of annotations) {
  lines_out.push('');
  lines_out.push(`## Annotation ${a.n}`);
  lines_out.push('- **Shadow Task:** ⬜ not submitted');
  lines_out.push(`- **Skills Tagged:** ${a.skills}`);
  lines_out.push(`- **Question Type:** ${a.qtype}`);
  lines_out.push(`- **Model Answer:** ${a.modelAnswer}`);
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
  if (a.qcFeedback) {
    lines_out.push('');
    lines_out.push('#### QC_FEEDBACK');
    lines_out.push(a.qcFeedback);
  }
  lines_out.push('');
  lines_out.push('#### Two-Part Check');
  lines_out.push('(to be filled by reviewer)');
  lines_out.push('');
  lines_out.push('#### Edits Made');
  lines_out.push('(to be filled by reviewer)');
  lines_out.push('');
  lines_out.push('#### Feedback');
  lines_out.push('(to be filled by reviewer)');
  if (a.n < annotations.length) {
    lines_out.push('');
    lines_out.push('---');
  }
}
lines_out.push('');

mkdirSync(join(LIZARD_DIR, 'tasks', 'skeleton'), { recursive: true });
writeFileSync(skeletonPath, lines_out.join('\n'), 'utf8');

console.log(`[run-job1] skeleton written: ${skeletonPath}`);
console.log(`[run-job1] stem=${stem} cycle=${cycle} n_annotations=${nAnnotations}`);
