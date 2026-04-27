#!/usr/bin/env node
// reconcile-stats.mjs
// Rescans every tasks/<stem>.md with an `#### Igor Verdict` section and
// rebuilds per-reviewer Igor-graded counters in scripts/reviewer-stats.json.
//
// Stateless: clears igor_graded blocks and rebuilds from scratch each run,
// so safe to re-run at any time. Does NOT touch fires/first_agree counters
// (those are maintained by run-job2.mjs).
//
// Usage:
//   node scripts/reconcile-stats.mjs
//   DRY=1 node scripts/reconcile-stats.mjs   # print result, don't write

import { readFileSync, writeFileSync, readdirSync, existsSync } from 'fs';
import { join, dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const __dir = dirname(fileURLToPath(import.meta.url));
const LIZARD_DIR = resolve(__dir, '..');
const STATS_PATH = join(LIZARD_DIR, 'scripts', 'reviewer-stats.json');
const TASKS_DIR = join(LIZARD_DIR, 'tasks');

const DRY = !!process.env.DRY;

// ---------- helpers ----------

function normAnswer(s) {
  if (s == null) return '';
  return s.toString()
    .replace(/[`*_]/g, '')
    .replace(/^[A-D]\.\s*/, '')
    .replace(/\s*\(.*?\)\s*$/, '')
    .replace(/[.!?,;:]+$/, '')
    .trim()
    .toLowerCase();
}

function normRating(s) {
  if (!s) return null;
  const t = s.toLowerCase();
  if (t.includes('thumbs-up') || t.includes('thumbs up')) return 'up';
  if (t.includes('thumbs-down') || t.includes('thumbs down')) return 'down';
  return null;
}

// ---------- annotation block parser ----------

function parseAnnotations(src) {
  const re = /^## Annotation (\d+)\s*$/gm;
  const blocks = [];
  let m;
  while ((m = re.exec(src)) !== null) blocks.push({ n: +m[1], start: m.index });
  const out = [];
  for (let i = 0; i < blocks.length; i++) {
    const end = i + 1 < blocks.length ? blocks[i + 1].start : src.length;
    const body = src.slice(blocks[i].start, end);
    out.push({ n: blocks[i].n, body });
  }
  return out;
}

function extractField(body, label) {
  const re = new RegExp(`\\*\\*${label}:\\*\\*\\s*(.+?)$`, 'm');
  const m = re.exec(body);
  return m ? m[1].trim() : '';
}

// Parse Merge Log per-reviewer rows:
//   - **grok:** thumbs-down — Final: `N/A — prompt invalid` ✗no-match [G2,TYPE1]
function parseReviewers(body) {
  const mergeBlock = /####\s+Merge Log\n([\s\S]*?)(?=\n####|\n---|\n## |$)/.exec(body);
  if (!mergeBlock) return [];
  const mb = mergeBlock[1];
  const rows = [];
  const re = /^-\s+\*\*([a-zA-Z0-9_-]+):\*\*\s*([^—\n]+?)\s*—\s*Final:\s*`([^`]*)`/gm;
  let m;
  while ((m = re.exec(mb)) !== null) {
    rows.push({
      name: m[1].toLowerCase(),
      rating: normRating(m[2]),
      finalAnswer: m[3].trim(),
    });
  }
  return rows;
}

// Parse Igor Verdict section:
//   #### Igor Verdict
//   - rating: thumbs-up
//   - final_answer: B
function parseIgorVerdict(body) {
  const block = /####\s+Igor Verdict\n([\s\S]*?)(?=\n####|\n---|\n## |$)/.exec(body);
  if (!block) return null;
  const b = block[1];
  const rating = /-\s*rating:\s*(.+?)$/m.exec(b);
  const answer = /-\s*final[_-]answer:\s*(.+?)$/m.exec(b);
  const r = rating ? normRating(rating[1]) : null;
  if (!r) return null; // require at least rating
  return {
    rating: r,
    finalAnswer: answer ? answer[1].trim() : '',
  };
}

// ---------- aggregator ----------

function emptyBucket() {
  return {
    rating_match: 0,
    rating_miss: 0,
    answer_match: 0,
    answer_miss: 0,
  };
}

function bumpBucket(bucket, igor, rv) {
  if (igor.rating === rv.rating) bucket.rating_match += 1;
  else bucket.rating_miss += 1;
  // Only count answer match when Igor supplied a final answer
  if (igor.finalAnswer) {
    const ia = normAnswer(igor.finalAnswer);
    const ra = normAnswer(rv.finalAnswer);
    if (ia && ra && ia === ra) bucket.answer_match += 1;
    else bucket.answer_miss += 1;
  }
}

// ---------- main ----------

const stats = existsSync(STATS_PATH)
  ? JSON.parse(readFileSync(STATS_PATH, 'utf8'))
  : { per_reviewer: {}, default_order: [], updated_at: null };

// Clear igor_graded blocks on every reviewer (fresh rebuild)
for (const r of Object.keys(stats.per_reviewer)) {
  stats.per_reviewer[r].igor_graded = {
    annotations_scored: 0,
    ...emptyBucket(),
    by_skill: {},
    by_qtype: {},
  };
}

const stems = readdirSync(TASKS_DIR)
  .filter((f) => f.endsWith('.md'))
  .map((f) => f.replace(/\.md$/, ''));

let taskFilesScanned = 0;
let annotationsGraded = 0;
let tasksWithIgorVerdicts = 0;

for (const stem of stems) {
  const path = join(TASKS_DIR, `${stem}.md`);
  const src = readFileSync(path, 'utf8');
  const annots = parseAnnotations(src);
  let hasAny = false;
  for (const a of annots) {
    const igor = parseIgorVerdict(a.body);
    if (!igor) continue;
    hasAny = true;
    annotationsGraded += 1;
    const skills = extractField(a.body, 'Skills Tagged').split(',').map((s) => s.trim()).filter(Boolean);
    const qtype = extractField(a.body, 'Question Type') || 'unknown';
    const reviewers = parseReviewers(a.body);
    for (const rv of reviewers) {
      if (!rv.rating) continue;
      const name = rv.name;
      if (!stats.per_reviewer[name]) {
        stats.per_reviewer[name] = {
          fires: 0, first_agree: 0, any_agree: 0, escalates: 0, errors: 0,
          igor_graded: { annotations_scored: 0, ...emptyBucket(), by_skill: {}, by_qtype: {} },
        };
      }
      const r = stats.per_reviewer[name].igor_graded;
      r.annotations_scored += 1;
      bumpBucket(r, igor, rv);
      for (const skill of skills) {
        r.by_skill[skill] ??= emptyBucket();
        bumpBucket(r.by_skill[skill], igor, rv);
      }
      r.by_qtype[qtype] ??= emptyBucket();
      bumpBucket(r.by_qtype[qtype], igor, rv);
    }
  }
  taskFilesScanned += 1;
  if (hasAny) tasksWithIgorVerdicts += 1;
}

stats.updated_at = new Date().toISOString();
stats.igor_reconcile = {
  task_files_scanned: taskFilesScanned,
  tasks_with_igor_verdicts: tasksWithIgorVerdicts,
  annotations_graded: annotationsGraded,
  reconciled_at: stats.updated_at,
};

if (DRY) {
  console.log(JSON.stringify(stats, null, 2));
} else {
  writeFileSync(STATS_PATH, JSON.stringify(stats, null, 2));
  console.error(`[reconcile-stats] scanned ${taskFilesScanned} task files, ${tasksWithIgorVerdicts} had Igor verdicts, ${annotationsGraded} annotations graded`);
  console.error(`[reconcile-stats] wrote: ${STATS_PATH}`);
  // Print one-line summary per reviewer
  for (const [name, r] of Object.entries(stats.per_reviewer)) {
    const g = r.igor_graded;
    if (!g || !g.annotations_scored) continue;
    const ratingPct = ((g.rating_match / (g.rating_match + g.rating_miss)) * 100).toFixed(1);
    const ansDen = g.answer_match + g.answer_miss;
    const ansPct = ansDen ? ((g.answer_match / ansDen) * 100).toFixed(1) : 'n/a';
    console.error(`  ${name.padEnd(8)}: n=${g.annotations_scored}  rating=${ratingPct}%  answer=${ansPct}%`);
  }
}
