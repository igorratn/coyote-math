#!/usr/bin/env node
// test-pipeline.mjs
// End-to-end Job 1 → Job 2 contract test (pre-flight gate for batched Job 2 runs).
//
// 2026-04-27 rewrite: previously this test ran Job 2 only (parallel, 4 reviewers,
// hand-made skeleton). That left the Job 1 → Job 2 format contract UNTESTED — a
// gap that let Plot_Dimensionality_reduction_graphs_52 ship a skeleton the merger
// parsed as 0 annotations, despite a green pre-flight.
//
// New scope:
//   1. Run Job 1 (run-job1.mjs) on a real fixture scrape → skeleton
//   2. Assert skeleton has parseable `## Annotation N` headers (the broken contract)
//   3. Run Job 2 (run-job2.mjs) sequentially with REVIEWERS=opus (single reviewer)
//   4. Assert merge-summary.json has correct n_annotations + reviewer attribution
//   5. Assert task file has Reviewer/Rating/Flags/FinalAnswer fields per annot block
//
// Why one annot + one reviewer:
//   - The _52 bug was a Job1↔Job2 *format* drift; one annot suffices to catch it
//   - Multi-reviewer combine logic is covered by unit tests
//     (test-pick-best-verdict.mjs, test-auto-resolve.mjs)
//   - Cuts pre-flight from ~3min → ~30-60s
//   - opus is free on Max plan + only needs `claude` CLI, no API keys
//
// Fixture: Report_Dashboard_Server_Dashboard_38 (1 annot, cycle 1).
//
// Non-destructive: backs up real skeleton + task file before running, restores on exit
// (including failure / SIGINT). reviewer-stats.json is allowed to drift (counter file).
//
// Usage: node scripts/tests/test-pipeline.mjs

import { existsSync, readFileSync, copyFileSync, rmSync, unlinkSync } from 'fs';
import { join } from 'path';
import { spawnSync } from 'child_process';
import {
  LIZARD_DIR, PIPELINE_FIXTURE_STEM, startTest, step, endTest, assert,
  splitAnnotationBlocks, parseFlagsField,
} from './test-helpers.mjs';

const STEM = PIPELINE_FIXTURE_STEM;
const REVIEWER = 'opus';

startTest(`pipeline: Job 1 + Job 2 e2e on ${STEM} (1 annot, single reviewer=${REVIEWER})`);

// ---------- env preflight ----------
step('claude CLI + sips present', () => {
  const claude = spawnSync('claude', ['--version'], { encoding: 'utf8' });
  if (claude.status !== 0) {
    console.error('[TEST] pipeline: SKIP (claude CLI missing — required for opus reviewer)');
    process.exit(0);
  }
  const sips = spawnSync('sips', ['--version'], { encoding: 'utf8' });
  if (sips.status !== 0) {
    console.error('[TEST] pipeline: SKIP (sips missing — required for image crop)');
    process.exit(0);
  }
  return 'ok';
});

// ---------- fixture presence preflight ----------
const scrapePath = join(LIZARD_DIR, 'scrapes', `${STEM}.txt`);
const screenshotPng = join(LIZARD_DIR, 'screenshots', `${STEM}.png`);
const screenshotJpg = join(LIZARD_DIR, 'screenshots', `${STEM}.jpg`);
step('fixture scrape + screenshot present in repo', () => {
  assert(existsSync(scrapePath), `fixture scrape missing: ${scrapePath}`);
  assert(existsSync(screenshotPng) || existsSync(screenshotJpg),
    `fixture screenshot missing: ${screenshotPng} (or .jpg)`);
});

// ---------- backup live state (so test is non-destructive) ----------
const skeletonPath = join(LIZARD_DIR, 'tasks', 'skeleton', `${STEM}.md`);
const taskPath = join(LIZARD_DIR, 'tasks', `${STEM}.md`);
const tmpDir = join('/tmp/lizard', STEM);
const skeletonBackup = join('/tmp', `lizard-pipeline-skel-backup-${STEM}.md`);
const taskBackup = join('/tmp', `lizard-pipeline-task-backup-${STEM}.md`);

const hadSkeleton = existsSync(skeletonPath);
const hadTask = existsSync(taskPath);
if (hadSkeleton) copyFileSync(skeletonPath, skeletonBackup);
if (hadTask) copyFileSync(taskPath, taskBackup);

let cleanupRan = false;
function cleanup() {
  if (cleanupRan) return;
  cleanupRan = true;
  try {
    if (hadSkeleton) copyFileSync(skeletonBackup, skeletonPath);
    else if (existsSync(skeletonPath)) unlinkSync(skeletonPath);
  } catch {}
  try {
    if (hadTask) copyFileSync(taskBackup, taskPath);
    else if (existsSync(taskPath)) unlinkSync(taskPath);
  } catch {}
  for (const p of [skeletonBackup, taskBackup]) {
    try { unlinkSync(p); } catch {}
  }
  try { rmSync(tmpDir, { recursive: true, force: true }); } catch {}
}
process.on('exit', cleanup);
process.on('SIGINT',  () => { cleanup(); process.exit(130); });
process.on('SIGTERM', () => { cleanup(); process.exit(143); });

// ---------- step 1: clear any verdict-stamped skeleton so Job 1 can run ----------
step('pre-clear skeleton if it has Igor Verdict (run-job1 verdict guard)', () => {
  if (existsSync(skeletonPath)) {
    const txt = readFileSync(skeletonPath, 'utf8');
    if (txt.includes('#### Igor Verdict')) unlinkSync(skeletonPath);
  }
  return 'ready';
});

// ---------- step 2: Job 1 — generate skeleton from scrape ----------
step('Job 1 (run-job1.mjs) generates skeleton from scrape (exits 0)', () => {
  const r = spawnSync('node', [join(LIZARD_DIR, 'scripts', 'run-job1.mjs')], {
    env: { ...process.env, STEM, LIZARD_DIR },
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
    timeout: 30_000,
  });
  assert(r.status === 0,
    `run-job1 exit=${r.status}\nstderr:\n${(r.stderr ?? '').slice(-1500)}`);
  assert(existsSync(skeletonPath), `skeleton not written at ${skeletonPath}`);
});

// ---------- step 3: Job1 → Job2 contract — skeleton has parseable annotation headers ----------
// This is the assertion that would have caught the _52 zero-annotation merger failure.
step('skeleton has 1 parseable `## Annotation N` header (Job 1 ↔ Job 2 contract)', () => {
  const skel = readFileSync(skeletonPath, 'utf8');
  const matches = [...skel.matchAll(/^##+\s+(?:Cycle\s*2\s*—\s*)?Annotation\s+(\d+)\b/gm)];
  assert(matches.length === 1,
    `skeleton has ${matches.length} annotation header(s) — expected 1 ` +
    `(regex matches what job2-merge.mjs uses)`);
});

// ---------- step 4: Job 2 — run sequential with single reviewer ----------
let summary;
step(`Job 2 (run-job2.mjs REVIEWERS=${REVIEWER}, sequential) exits 0`, () => {
  const r = spawnSync('node', [join(LIZARD_DIR, 'scripts', 'run-job2.mjs')], {
    env: {
      ...process.env,
      STEM,
      LIZARD_DIR,
      REVIEWERS: REVIEWER,
      SKIP_ENV_CHECK: '1',        // already verified above
      SKIP_FRESHNESS_CHECK: '1',  // fixture is cycle-1, freshness checks irrelevant
    },
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
    timeout: 600_000,             // 10 min — opus reasoning can take a while
    maxBuffer: 100 * 1024 * 1024,
  });
  assert(r.status === 0,
    `run-job2 exit=${r.status}\nstderr tail:\n${(r.stderr ?? '').slice(-2000)}`);

  const summaryPath = join(tmpDir, 'merge-summary.json');
  assert(existsSync(summaryPath), `no merge-summary.json at ${summaryPath}`);
  summary = JSON.parse(readFileSync(summaryPath, 'utf8'));
});

// ---------- step 5: merge-summary contract ----------
step('merge-summary.per_annotation has 1 entry (catches _52-style zero-annot bug)', () => {
  const n = summary.per_annotation?.length ?? 0;
  assert(n === 1, `per_annotation has ${n} entries, expected 1`);
});

step(`merge-summary lists ${REVIEWER} in reviewers_used`, () => {
  const used = new Set(summary.reviewers_used ?? []);
  assert(used.has(REVIEWER),
    `${REVIEWER} missing from reviewers_used: [${[...used].join(',')}]`);
});

step('annotation has reviewer attribution + valid decision', () => {
  const a = summary.per_annotation[0];
  assert(a.reviewer,
    `annotation has no reviewer attribution: ${JSON.stringify(a)}`);
  const valid = new Set(['pending-igor', 'auto-resolved']);
  assert(valid.has(a.decision),
    `unexpected decision: ${a.decision} (want one of ${[...valid].join('/')})`);
});

// ---------- step 6: task file contract ----------
step('task file written with required fields (Reviewer/Rating/Flags/Final Answer)', () => {
  assert(existsSync(taskPath), `tasks/${STEM}.md not written`);
  const doc = readFileSync(taskPath, 'utf8');
  const blocks = splitAnnotationBlocks(doc);
  assert(blocks.size === 1,
    `task file has ${blocks.size} annot block(s), expected 1`);
  const blk = blocks.get(1) ?? '';
  const checks = {
    Reviewer: /^\s*-?\s*\*\*Reviewer:\*\*\s*\S/m.test(blk),
    Rating:   /^\s*-?\s*\*\*Rating:\*\*\s*\S/m.test(blk),
    Flags:    parseFlagsField(blk) !== null,
    FinalAns: /^\s*-?\s*\*\*Final Answer \(reviewer\):\*\*\s*\S/m.test(blk),
  };
  const missing = Object.entries(checks).filter(([, ok]) => !ok).map(([k]) => k);
  assert(missing.length === 0,
    `missing fields in A1 block: ${missing.join(', ')}`);
});

// Regression (2026-04-24): renderAnnotation embedded reviewer body verbatim
// including its leading `## Annotation N` header → task file had TWO `## Annotation N`
// headers per N → splitAnnotationBlocks (Map.set on same key) overwrote the outer
// block with the inner reviewer-body block, losing the structured fields.
step('task file: exactly one `## Annotation N` header (no duplicate-from-embed regression)', () => {
  const doc = readFileSync(taskPath, 'utf8');
  const matches = [...doc.matchAll(/^##+\s+(?:Cycle\s*2\s*—\s*)?Annotation\s+(\d+)\b.*$/gm)];
  assert(matches.length === 1,
    `task file has ${matches.length} annot header(s), expected 1`);
});

endTest();
