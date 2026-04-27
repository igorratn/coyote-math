#!/usr/bin/env node
// test-pipeline.mjs
// End-to-end integration test: full run-job2.mjs on the FIXTURE_STEM task
// (see test-helpers.mjs for which stem is the current fixture).
//
// What it asserts (against the new first-verdict-wins merger, 2026-04-24):
//   1. env-check passes (sips, keys for the configured reviewers, claude CLI, ...)
//   2. run-job2 exits 0 with PARALLEL=1 SKIP_EARLY_STOP=1 (force all configured reviewers)
//   3. merge-summary.json written + every reviewer in fire order present in reviewers_used
//   4. tasks/<stem>.md written
//   5. every annot has summary.decision === 'pending-igor' (no auto-resolve)
//   6. every annot has a `reviewer` attribution (no `no_reviewer_output` survivors)
//   7. every annot block in task file has bolded **Reviewer:**, **Rating:**,
//      **Flags:**, **Final Answer (reviewer):** fields
//
// Reviewer set is taken from run-job2's DEFAULT_ORDER (currently 2-reviewer mode:
// gpt + opus). Test adapts automatically if fire order changes.
//
// Expensive: hits all configured model APIs (~30s-3min depending on count).
// Skip cleanly if env-check fails (no API keys, etc.)
//
// Usage: node scripts/tests/test-pipeline.mjs

import { existsSync, readFileSync, rmSync, copyFileSync } from 'fs';
import { join } from 'path';
import { spawnSync } from 'child_process';
import {
  LIZARD_DIR, FIXTURE_STEM, startTest, step, endTest, assert,
  splitAnnotationBlocks, parseFlagsField,
} from './test-helpers.mjs';

startTest(`pipeline: run-job2.mjs end-to-end on ${FIXTURE_STEM}`);

// Read the fire order from run-job2.mjs DEFAULT_ORDER so this test follows
// whatever reviewer set is currently configured (2-reviewer fast mode, full 4,
// or anything else). Falls back to ['gpt','opus'] if the source can't be parsed.
function loadFireOrder() {
  try {
    const src = readFileSync(join(LIZARD_DIR, 'scripts', 'run-job2.mjs'), 'utf8');
    const m = /const DEFAULT_ORDER\s*=\s*\[([^\]]+)\]/.exec(src);
    if (!m) return ['gpt', 'opus'];
    return m[1].split(',').map(s => s.trim().replace(/['"]/g, '')).filter(Boolean);
  } catch { return ['gpt', 'opus']; }
}
const FIRE_ORDER = loadFireOrder();

// Per-reviewer required env. Only check the ones in current fire order.
const REVIEWER_ENV = {
  gpt:    { envKey: 'OPENAI_API_KEY' },
  grok:   { envKey: 'XAI_API_KEY'    },
  gemini: { envKey: 'GEMINI_API_KEY' },
  opus:   { cli: 'claude'            },
};

// Pre-flight: only check env bits that run-job2 actually needs. Specifically
// skip "background process survival" — irrelevant to spawnSync-based runs,
// fails spuriously on some Macs. If a required API key / CLI is missing, the
// reviewer subprocess failure downstream will surface it clearly anyway.
step(`essential env present (fire order: ${FIRE_ORDER.join('+')}, sips)`, () => {
  const envFile = join(LIZARD_DIR, '.env');
  const envText = existsSync(envFile) ? readFileSync(envFile, 'utf8') : '';
  const hasKey = (k) => !!process.env[k] || new RegExp(`^\\s*${k}\\s*=\\s*.+`, 'm').test(envText);

  const missing = [];
  for (const r of FIRE_ORDER) {
    const need = REVIEWER_ENV[r];
    if (!need) continue;
    if (need.envKey && !hasKey(need.envKey)) missing.push(need.envKey);
    if (need.cli) {
      const ver = spawnSync(need.cli, ['--version'], { encoding: 'utf8' });
      if (ver.status !== 0) missing.push(`${need.cli} CLI`);
    }
  }

  const sips = spawnSync('sips', ['--version'], { encoding: 'utf8' });
  if (sips.status !== 0) missing.push('sips (macOS image crop tool)');

  if (missing.length) {
    console.error(`  missing: ${missing.join(', ')}`);
    console.error(`[TEST] pipeline: SKIP (env not ready)`);
    process.exit(0);
  }
  return `all required for ${FIRE_ORDER.join('+')} + sips present`;
});

// Protect any existing real merge at tasks/<stem>.md — back up before running.
const liveTaskPath = join(LIZARD_DIR, 'tasks', `${FIXTURE_STEM}.md`);
const backupPath = join('/tmp', `lizard-pipeline-backup-${FIXTURE_STEM}.md`);
const hadLive = existsSync(liveTaskPath);
if (hadLive) {
  copyFileSync(liveTaskPath, backupPath);
  console.error(`  (backed up existing ${liveTaskPath} → ${backupPath})`);
}

let summary;
step('run-job2.mjs PARALLEL=1 SKIP_EARLY_STOP=1 (exits 0)', () => {
  const r = spawnSync('node', [join(LIZARD_DIR, 'scripts', 'run-job2.mjs')], {
    env: {
      ...process.env,
      STEM: FIXTURE_STEM,
      LIZARD_DIR,
      PARALLEL: '1',
      SKIP_EARLY_STOP: '1',
      SKIP_ENV_CHECK: '1',        // already verified above
      SKIP_FRESHNESS_CHECK: '1',  // fixture is cycle-1 by design
    },
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
    timeout: 600_000, // 10 min
    maxBuffer: 100 * 1024 * 1024,
  });
  assert(r.status === 0,
    `run-job2 exit=${r.status}\nstderr tail:\n${(r.stderr ?? '').slice(-2000)}`);

  const summaryPath = join('/tmp/lizard', FIXTURE_STEM, 'merge-summary.json');
  assert(existsSync(summaryPath), `no merge-summary.json at ${summaryPath}`);
  summary = JSON.parse(readFileSync(summaryPath, 'utf8'));
});

step(`all configured reviewers fired + present in reviewers_used (${FIRE_ORDER.join('+')})`, () => {
  const used = new Set(summary.reviewers_used);
  const missing = FIRE_ORDER.filter(n => !used.has(n));
  assert(missing.length === 0,
    `missing reviewers in merge: ${missing.join(',')} (got: ${[...used].join(',')})`);
  return `${[...used].join(',')}`;
});

step('task file written', () => {
  assert(existsSync(liveTaskPath), `tasks/${FIXTURE_STEM}.md not written`);
});

step('every annot decision is pending-igor or auto-resolved (no orphans)', () => {
  const nonUnchanged = summary.per_annotation.filter(a => a.decision !== 'unchanged');
  const valid = new Set(['pending-igor', 'auto-resolved']);
  const offenders = nonUnchanged.filter(a => !valid.has(a.decision));
  assert(offenders.length === 0,
    `${offenders.length} annotation(s) with unexpected decision: ${offenders.map(a=>`A${a.n}=${a.decision}`).join(', ')}`);
  const p = nonUnchanged.filter(a => a.decision === 'pending-igor').length;
  const r = nonUnchanged.filter(a => a.decision === 'auto-resolved').length;
  return `${p} pending-igor + ${r} auto-resolved (of ${nonUnchanged.length} non-unchanged)`;
});

step('every non-unchanged annot has a reviewer attribution (no no_reviewer_output)', () => {
  const orphans = summary.per_annotation.filter(a =>
    a.decision !== 'unchanged' && (!a.reviewer || a.decision === 'no_reviewer_output'));
  assert(orphans.length === 0,
    `${orphans.length} annot(s) lacking reviewer attribution despite ${FIRE_ORDER.length} reviewer(s) fired: ` +
    `${orphans.map(a=>`A${a.n}`).join(',')}`);
});

// Regression (2026-04-24): renderAnnotation embedded reviewer body verbatim
// including its leading `## Annotation N` header → rendered task file had
// TWO `## Annotation N` headers per N → splitAnnotationBlocks (Map.set on same
// key) overwrote the outer block with the inner reviewer-body block, losing
// the structured Reviewer/Final-Answer fields. Fix: strip the inner header
// before embed. Test guards against re-introduction.
step('task file: exactly one `## Annotation N` header per N (no duplicate from embedded body)', () => {
  const doc = readFileSync(liveTaskPath, 'utf8');
  const re = /^##+\s+(?:Cycle\s*2\s*—\s*)?Annotation\s+(\d+)\b.*$/gm;
  const counts = new Map();
  let m;
  while ((m = re.exec(doc)) !== null) {
    const n = parseInt(m[1], 10);
    counts.set(n, (counts.get(n) ?? 0) + 1);
  }
  const dups = [...counts.entries()].filter(([, c]) => c > 1);
  assert(dups.length === 0,
    `duplicate Annotation headers: ${dups.map(([n,c]) => `A${n}×${c}`).join(', ')}`);
  return `${counts.size} unique annotation header(s), no duplicates`;
});

step('task file: each annot block has Reviewer/Rating/Flags/Final Answer fields', () => {
  const doc = readFileSync(liveTaskPath, 'utf8');
  const blocks = splitAnnotationBlocks(doc);
  const missing = [];
  for (const a of summary.per_annotation) {
    if (a.decision === 'unchanged') continue; // unchanged blocks have a different shape
    const blk = blocks.get(a.n) ?? '';
    const checks = {
      Reviewer: /^\s*-?\s*\*\*Reviewer:\*\*\s*\S/m.test(blk),
      Rating:   /^\s*-?\s*\*\*Rating:\*\*\s*\S/m.test(blk),
      Flags:    parseFlagsField(blk) !== null,
      FinalAns: /^\s*-?\s*\*\*Final Answer \(reviewer\):\*\*\s*\S/m.test(blk),
    };
    for (const [name, ok] of Object.entries(checks)) {
      if (!ok) missing.push(`A${a.n}.${name}`);
    }
  }
  assert(missing.length === 0, `missing fields: ${missing.join(', ')}`);
  return `all annot blocks have all 4 required fields`;
});

// Restore the user's original task file so the test is non-destructive.
if (hadLive) {
  copyFileSync(backupPath, liveTaskPath);
  try { rmSync(backupPath); } catch {}
  console.error(`  (restored original ${liveTaskPath} from backup)`);
}

endTest();
