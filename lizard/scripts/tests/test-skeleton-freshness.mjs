#!/usr/bin/env node
// test-skeleton-freshness.mjs
// Regression test for the cycle integrity / freshness guards in run-job2.mjs.
//
// What this guards (added 2026-04-24 after the cycle-2 skeleton-stale incident):
//   A. Skeleton mtime ≥ scrape mtime — else exit 4 (Job 1 needs re-run after re-scrape).
//   B. If prior tasks/<stem>.md exists, skeleton MUST contain `## Cycle 2 Review` — else exit 4.
//   C. If manifest declares cycle:2 for stem, skeleton MUST contain `## Cycle 2 Review` — else exit 4.
//
// Background: on 2026-04-24 a 16-stem batch silently produced wrong-cycle output
// because skeletons were stale (built April 20 for cycle 1; scrapes overwritten
// April 23 for cycle 2; Job 1 was never re-run). run-job2.mjs had no defensive
// guard — went straight to merge against the stale skeleton, lost cycle-2
// unchanged-carry-forward semantics, gave Igor wrong-cycle task files.
//
// Each test case sets up an isolated LIZARD_DIR with the precise file shape that
// should trip a specific guard, runs `node scripts/run-job2.mjs` with
// SKIP_ENV_CHECK=1 SKIP_FRESHNESS_CHECK=0, asserts exit code 4 + expected stderr.
//
// Usage: node scripts/tests/test-skeleton-freshness.mjs

import '../log-ts.mjs';
import { mkdtempSync, writeFileSync, mkdirSync, utimesSync, rmSync, existsSync } from 'fs';
import { tmpdir } from 'os';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { spawnSync } from 'child_process';
import { startTest, step, endTest, assert, LIZARD_DIR } from './test-helpers.mjs';

const __dir = dirname(fileURLToPath(import.meta.url));
const RUN_JOB2 = join(LIZARD_DIR, 'scripts', 'run-job2.mjs');

startTest('skeleton-freshness: cycle integrity guards in run-job2.mjs');

// Build a minimal LIZARD_DIR layout in a tmp dir.
function makeLizardDir() {
  const root = mkdtempSync(join(tmpdir(), 'lizard-freshness-'));
  // Mirror enough of the lizard tree for run-job2's existsSync checks
  mkdirSync(join(root, 'tasks', 'skeleton'), { recursive: true });
  mkdirSync(join(root, 'scrapes'), { recursive: true });
  mkdirSync(join(root, 'config'),  { recursive: true });
  // env-check looks for these — it's skipped via SKIP_ENV_CHECK=1, but for safety:
  writeFileSync(join(root, 'config', 'reviewers.yaml'), 'reviewers: []\n', 'utf8');
  // Symlink scripts/ to the real one so node can find run-job2.mjs imports
  // — actually run-job2.mjs is invoked by absolute path, but it imports siblings.
  // Easier: point LIZARD_DIR at the real lizard dir but override per-stem files.
  return root;
}

// We can't fully isolate LIZARD_DIR easily because run-job2.mjs reads sibling
// scripts (env-check, etc) via LIZARD_DIR. Instead, use the real LIZARD_DIR but
// pick a stem name that won't collide with any real file, and write that stem's
// skeleton/scrape/task/manifest into the real lizard tree under a unique prefix.
const TEST_STEM = `__test_freshness_${Date.now()}`;
const SKELETON_PATH = join(LIZARD_DIR, 'tasks', 'skeleton', `${TEST_STEM}.md`);
const SCRAPE_PATH   = join(LIZARD_DIR, 'scrapes', `${TEST_STEM}.txt`);
const PRIOR_TASK    = join(LIZARD_DIR, 'tasks', `${TEST_STEM}.md`);
// Don't write to real manifest — use a tmp manifest path via env (see below).

// Cleanup helper — wipe per-test artifacts so cases don't bleed into each other.
function cleanup() {
  for (const p of [SKELETON_PATH, SCRAPE_PATH, PRIOR_TASK]) {
    try { rmSync(p); } catch {}
  }
}

// Run run-job2.mjs and capture exit + stderr. SKIP_ENV_CHECK so we don't
// require API keys / sips during the test. SKIP_FRESHNESS_CHECK is intentionally
// NOT set — we want the guards to fire.
function runJob2({ extraEnv = {} } = {}) {
  const r = spawnSync('node', [RUN_JOB2], {
    env: {
      ...process.env,
      STEM: TEST_STEM,
      LIZARD_DIR,
      SKIP_ENV_CHECK: '1',
      ...extraEnv,
    },
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
    timeout: 15_000,
  });
  return { code: r.status, stderr: r.stderr || '', stdout: r.stdout || '' };
}

// Minimal valid skeleton — 1 annotation, no Cycle 2 marker (= cycle 1).
// withCycle2 modes:
//   false  — no `## Cycle 2 Review` section (cycle 1)
//   true   — basic cycle-2 section (no [CHANGED]/[UNCHANGED] tag — for legacy tests)
//   'unchanged-stale' — [CHANGED] tag but cycle-2 prompt IDENTICAL to cycle-1 (Guard D trip)
//   'unchanged-tag'   — [UNCHANGED] tag, no prompt block (clean)
//   'changed-clean'   — [CHANGED] tag, cycle-2 prompt DIFFERENT from cycle-1 (Guard D pass)
function writeSkeleton({ withCycle2 = false } = {}) {
  let cycle2Block = '';
  if (withCycle2 === true) {
    cycle2Block = `\n## Cycle 2 Review\n\n### Cycle 2 — Annotation 1\n- raw cycle-2 data\n`;
  } else if (withCycle2 === 'unchanged-stale') {
    cycle2Block = `\n## Cycle 2 Review\n\n### Cycle 2 — Annotation 1 [CHANGED — FULL REVIEW, approve/delete only]\n- **Status:** changed\n\n#### Full Prompt\nWhat is 2+2?\n\n#### Rewrite Answer\n4\n`;
  } else if (withCycle2 === 'unchanged-tag') {
    cycle2Block = `\n## Cycle 2 Review\n\n### Cycle 2 — Annotation 1 [UNCHANGED]\n- carry-forward\n`;
  } else if (withCycle2 === 'changed-clean') {
    cycle2Block = `\n## Cycle 2 Review\n\n### Cycle 2 — Annotation 1 [CHANGED — FULL REVIEW, approve/delete only]\n- **Status:** changed\n\n#### Full Prompt\nWhat is 5+5?\n\n#### Rewrite Answer\n10\n`;
  }
  writeFileSync(SKELETON_PATH, [
    `# Skeleton: ${TEST_STEM}`,
    `- **task_id:** test_${Date.now()}`,
    `- **SA_TASK_FILENAME:** ${TEST_STEM}.json`,
    ``,
    `## Annotation 1`,
    `- **Skills Tagged:** Logical Reasoning`,
    `- **Question Type:** SAQ`,
    `- **Model Answer:** A`,
    `- **Annotator Answer:** A`,
    ``,
    `#### Full Prompt`,
    `What is 2+2?`,
    ``,
    `#### Rewrite Answer`,
    `4`,
    cycle2Block,
  ].join('\n'), 'utf8');
}

function writeScrape() {
  // Must pass validate-scrape Guard E (all checks, including cycle-2 ≥2 submissions).
  writeFileSync(SCRAPE_PATH, [
    'TASK_ID: test',
    'SA_TASK_FILENAME: test.json',
    'IMAGE_URL: https://example.com/test.png',
    'N_ANNOTATIONS: 1',
    'STATUS_LOG_LEN: 200',
    'STATUS_LOG_TEXT: 16 Apr 2026 | to: Submit_to_QC; 22 Apr 2026 | to: QualityCheck',
    '',
    '=== ANNOTATION 1 ===',
    'SKILLS: Logical Reasoning, Math Reasoning',
    'QTYPE: SAQ',
    'MODEL_GENERATED_ANSWER: A',
    'ANSWER: A',
    'ANSWER_LEN: 1',
    '',
    '--- PROMPT ---',
    'This is a sample prompt that is at least 30 chars long.',
    '',
    '--- QC_FEEDBACK ---',
    '',
    '',
    '=== STATUS_LOG_TEXT ===',
    '16 Apr 2026 | from: InProgress, to: Submit_to_QC',
    '22 Apr 2026 | from: Returned_to_Annotator, to: QualityCheck',
    '',
    '=== STATUS_LOG_JSON ===',
    '{"schema_version":1}',
  ].join('\n'), 'utf8');
}

function writePriorTaskFile() {
  writeFileSync(PRIOR_TASK, `# Review: ${TEST_STEM}\n## Annotation 1\n- prior cycle-1 review\n`, 'utf8');
}

// Set mtime of a file to (now - secondsAgo).
function ageFile(path, secondsAgo) {
  const t = (Date.now() / 1000) - secondsAgo;
  utimesSync(path, t, t);
}

// ---------- Guard A: stale skeleton (scrape newer than skeleton) ----------

step('Guard A: scrape newer than skeleton → exit 4', () => {
  cleanup();
  writeSkeleton({ withCycle2: false });
  writeScrape();
  ageFile(SKELETON_PATH, 600);  // skeleton 10 min old
  ageFile(SCRAPE_PATH, 60);     // scrape 1 min old (newer)
  const r = runJob2();
  assert(r.code === 4, `expected exit 4, got ${r.code}\nstderr:\n${r.stderr}`);
  assert(/skeleton is stale/.test(r.stderr), `expected 'skeleton is stale' in stderr:\n${r.stderr}`);
  cleanup();
});

step('Guard A: SKIP_FRESHNESS_CHECK=1 bypasses stale check', () => {
  cleanup();
  writeSkeleton({ withCycle2: false });
  writeScrape();
  ageFile(SKELETON_PATH, 600);
  ageFile(SCRAPE_PATH, 60);
  const r = runJob2({ extraEnv: { SKIP_FRESHNESS_CHECK: '1' } });
  // Exit won't be 4. It'll either be 0 (unlikely without reviewers) or fail downstream.
  // Important: stderr must NOT mention 'skeleton is stale'.
  assert(!/skeleton is stale/.test(r.stderr),
    `bypass should suppress stale-check, got:\n${r.stderr.slice(0, 500)}`);
  cleanup();
});

// ---------- Guard B: prior task exists but skeleton lacks Cycle 2 ----------

step('Guard B: prior task file exists + skeleton has no Cycle 2 → exit 4', () => {
  cleanup();
  writeSkeleton({ withCycle2: false });
  writeScrape();
  writePriorTaskFile();
  // Make scrape OLDER than skeleton so guard A doesn't fire first
  ageFile(SCRAPE_PATH, 600);
  ageFile(SKELETON_PATH, 60);
  const r = runJob2();
  assert(r.code === 4, `expected exit 4, got ${r.code}\nstderr:\n${r.stderr}`);
  assert(/cycle-2 mismatch/.test(r.stderr) && /prior task file exists/.test(r.stderr),
    `expected cycle-2 mismatch with prior task message:\n${r.stderr}`);
  cleanup();
});

step('Guard B: prior task + skeleton WITH Cycle 2 → guard passes', () => {
  cleanup();
  writeSkeleton({ withCycle2: true });
  writeScrape();
  writePriorTaskFile();
  ageFile(SCRAPE_PATH, 600);
  ageFile(SKELETON_PATH, 60);
  const r = runJob2();
  // Must NOT fail with exit 4 from cycle-2 mismatch. May fail later (no reviewers etc).
  assert(!/cycle-2 mismatch/.test(r.stderr),
    `should not trip cycle-2 mismatch, stderr:\n${r.stderr.slice(0, 500)}`);
  cleanup();
});

// ---------- Guard C: manifest cycle vs skeleton ----------

step('Guard C: manifest cycle:2 + skeleton no Cycle 2 → exit 4', () => {
  cleanup();
  writeSkeleton({ withCycle2: false });
  writeScrape();
  ageFile(SCRAPE_PATH, 600);
  ageFile(SKELETON_PATH, 60);
  // Use MANIFEST_PATH env override so we don't touch the real manifest.
  const tmpManifest = join(tmpdir(), `lizard-freshtest-manifest-${Date.now()}.json`);
  writeFileSync(tmpManifest, JSON.stringify({
    batch_frozen_at: 'test',
    tasks: [{ stem: TEST_STEM, task_id: 1, cycle: 2 }],
  }), 'utf8');
  try {
    const r = runJob2({ extraEnv: { MANIFEST_PATH: tmpManifest } });
    assert(r.code === 4, `expected exit 4, got ${r.code}\nstderr:\n${r.stderr}`);
    assert(/manifest declares cycle 2/.test(r.stderr),
      `expected 'manifest declares cycle 2' in stderr:\n${r.stderr}`);
  } finally {
    try { rmSync(tmpManifest); } catch {}
    cleanup();
  }
});

// Regression (2026-04-25): Server_132 case — cycle-1 stem, today's batch wrote
// a task file, re-running Job 2 found "task file exists + no Cycle 2 marker"
// and tripped Guard B. Fix: defer to manifest. If manifest says cycle:1, skip B.
step('Guard B: cycle-1 manifest + prior task file (same-batch re-run) → guard passes', () => {
  cleanup();
  writeSkeleton({ withCycle2: false });
  writeScrape();
  writePriorTaskFile();  // cycle-1 task file present from earlier in same batch
  ageFile(SCRAPE_PATH, 600);
  ageFile(SKELETON_PATH, 60);
  const tmpManifest = join(tmpdir(), `lizard-freshtest-manifest-${Date.now()}.json`);
  writeFileSync(tmpManifest, JSON.stringify({
    batch_frozen_at: 'test',
    tasks: [{ stem: TEST_STEM, task_id: 1, cycle: 1 }],
  }), 'utf8');
  try {
    const r = runJob2({ extraEnv: { MANIFEST_PATH: tmpManifest } });
    // Must NOT trip cycle-2 mismatch (manifest says cycle 1, so Guard B should defer)
    assert(!/cycle-2 mismatch/.test(r.stderr),
      `cycle-1 manifest should suppress Guard B, got:\n${r.stderr.slice(0, 600)}`);
  } finally {
    try { rmSync(tmpManifest); } catch {}
    cleanup();
  }
});

step('Guard C: manifest cycle:1 + skeleton no Cycle 2 → guard passes (no false positive)', () => {
  cleanup();
  writeSkeleton({ withCycle2: false });
  writeScrape();
  ageFile(SCRAPE_PATH, 600);
  ageFile(SKELETON_PATH, 60);
  const tmpManifest = join(tmpdir(), `lizard-freshtest-manifest-${Date.now()}.json`);
  writeFileSync(tmpManifest, JSON.stringify({
    batch_frozen_at: 'test',
    tasks: [{ stem: TEST_STEM, task_id: 1, cycle: 1 }],
  }), 'utf8');
  try {
    const r = runJob2({ extraEnv: { MANIFEST_PATH: tmpManifest } });
    // Must NOT trip cycle-2 mismatch. May fail later (no reviewers etc).
    assert(!/manifest declares cycle 2/.test(r.stderr),
      `should not trip cycle-2 mismatch on cycle:1 manifest, got:\n${r.stderr.slice(0, 500)}`);
  } finally {
    try { rmSync(tmpManifest); } catch {}
    cleanup();
  }
});

// ---------- Guard D: cycle-2 [CHANGED] annot must have prompt different from cycle-1 ----------
// Regression (2026-04-25): all 6 Scrum cycle-2 stems had stale scrapes — cycle-2
// [CHANGED] annots had prompts identical to cycle-1 (scraper grabbed wrong content).
// Igor caught it manually on Scrum_53 A3. Codify so future stale scrapes fail loud.

step('Guard D: cycle-2 [CHANGED] annot with prompt = cycle-1 prompt → exit 4 (stale scrape)', () => {
  cleanup();
  writeSkeleton({ withCycle2: 'unchanged-stale' });
  writeScrape();
  ageFile(SCRAPE_PATH, 600);
  ageFile(SKELETON_PATH, 60);
  const r = runJob2();
  assert(r.code === 4, `expected exit 4, got ${r.code}\nstderr:\n${r.stderr}`);
  assert(/likely stale scrape/.test(r.stderr) || /identical to cycle-1/.test(r.stderr),
    `expected 'likely stale scrape' or 'identical to cycle-1':\n${r.stderr}`);
  cleanup();
});

step('Guard D: cycle-2 [CHANGED] annot with prompt different from cycle-1 → guard passes', () => {
  cleanup();
  writeSkeleton({ withCycle2: 'changed-clean' });
  writeScrape();
  ageFile(SCRAPE_PATH, 600);
  ageFile(SKELETON_PATH, 60);
  const r = runJob2();
  assert(!/likely stale scrape/.test(r.stderr),
    `clean rewrite should pass Guard D, got:\n${r.stderr.slice(0, 600)}`);
  cleanup();
});

step('Guard D: cycle-2 [UNCHANGED] tag (no Cycle 2 prompt block) → guard passes (carry-forward)', () => {
  cleanup();
  writeSkeleton({ withCycle2: 'unchanged-tag' });
  writeScrape();
  ageFile(SCRAPE_PATH, 600);
  ageFile(SKELETON_PATH, 60);
  const r = runJob2();
  assert(!/likely stale scrape/.test(r.stderr),
    `[UNCHANGED] should pass Guard D, got:\n${r.stderr.slice(0, 600)}`);
  cleanup();
});

endTest();
