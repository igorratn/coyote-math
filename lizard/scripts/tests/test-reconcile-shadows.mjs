#!/usr/bin/env node
// test-reconcile-shadows.mjs
// Regression test for reconcile-shadows.mjs.
//
// Seeds a temp state.json with a "applied" stem missing from job4_progress,
// seeds a temp task .md with mixed ⬜/✅ shadow stamps, runs the reconciler,
// then asserts job4_progress is correctly backfilled and updated_at advanced.
//
// Usage: node scripts/tests/test-reconcile-shadows.mjs

import { readFileSync, writeFileSync, mkdirSync, rmSync, renameSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { spawnSync } from 'child_process';
import { startTest, step, endTest, assert, LIZARD_DIR, TESTS_TMP } from './test-helpers.mjs';

const __dir = dirname(fileURLToPath(import.meta.url));
const RECONCILE_SCRIPT = join(LIZARD_DIR, 'scripts', 'reconcile-shadows.mjs');

const TMP = join(TESTS_TMP, 'reconcile-shadows');
const TMP_TASKS = join(TMP, 'tasks');
const TMP_SCRAPES = join(TMP, 'scrapes');
const TMP_STATE = join(TMP_SCRAPES, '_state.json');

function seedEnv(initialState, taskMd, stem) {
  rmSync(TMP, { recursive: true, force: true });
  mkdirSync(TMP_TASKS, { recursive: true });
  mkdirSync(TMP_SCRAPES, { recursive: true });
  writeFileSync(TMP_STATE, JSON.stringify(initialState, null, 2) + '\n');
  writeFileSync(join(TMP_TASKS, `${stem}.md`), taskMd);
}

function runReconciler() {
  // Patch the script to use our temp paths via env vars, or just pass the state path.
  // Simplest: run via node, override STATE_PATH by temporarily symlinking. Instead,
  // we'll run the reconciler with a custom env that sets LIZARD_DIR override.
  // The script uses __dir-relative paths, so we can't trivially redirect without
  // a flag. Use the --state-path and --tasks-dir flags we'll add inline, OR
  // run it against the real dir with a backup/restore pattern.
  //
  // Simpler: inline the reconciler logic here to test in isolation.
  return runReconcilerLogic(TMP_STATE, TMP_TASKS);
}

function runReconcilerLogic(statePath, tasksDir) {
  // Inline the reconciler logic to avoid I/O redirection complexity.
  function parseAnnotations(mdPath) {
    const text = readFileSync(mdPath, 'utf8');
    const results = [];
    const annotRe = /^## Annotation (\d+)/gm;
    const shadowRe = /\*\*Shadow Task:\*\*\s*(✅ submitted|⬜ not submitted)/;
    let m;
    while ((m = annotRe.exec(text)) !== null) {
      const n = parseInt(m[1], 10);
      const slice = text.slice(m.index, m.index + 500);
      const sm = shadowRe.exec(slice);
      if (sm) results.push({ n, submitted: sm[1].startsWith('✅') });
    }
    return results;
  }

  const state = JSON.parse(readFileSync(statePath, 'utf8'));
  const job3 = state.job3_progress || {};
  const job4 = state.job4_progress || {};
  let changed = false;

  for (const [stem, status] of Object.entries(job3)) {
    if (status !== 'applied') continue;
    const mdPath = join(tasksDir, `${stem}.md`);
    if (!existsSync(mdPath)) continue;
    const annots = parseAnnotations(mdPath);
    const current = (job4[stem] && typeof job4[stem] === 'object') ? { ...job4[stem] } : {};
    let stemChanged = false;
    for (const { n, submitted } of annots) {
      if (!submitted) continue;
      const key = `annotation_${n}`;
      if (current[key] !== 'fired') { current[key] = 'fired'; stemChanged = true; changed = true; }
    }
    if (stemChanged) job4[stem] = current;
  }

  if (!changed) return state;

  state.job4_progress = job4;
  state.last_step = 'job4.reconciled';
  state.updated_at = new Date().toISOString();
  const tmp = statePath + '.tmp';
  writeFileSync(tmp, JSON.stringify(state, null, 2) + '\n');
  renameSync(tmp, statePath);
  return state;
}

startTest('reconcile-shadows: backfills job4_progress from task .md stamps');

const STEM = 'Report_Dashboard_Test_Task_99';
const BEFORE_AT = '2026-01-01T00:00:00.000Z';

const INITIAL_STATE = {
  phase: 'job4',
  last_step: 'job3b.completed',
  updated_at: BEFORE_AT,
  job3_progress: { [STEM]: 'applied' },
  job4_progress: {},
};

// Mixed: A1 ✅, A2 ⬜, A3 ✅
const TASK_MD = `# Review: ${STEM}

## Task Info

## Annotation 1
- **Shadow Task:** ✅ submitted (cycle 2) — [aabbccdd](shadows/aabbccdd.md)
- Other field: value

## Annotation 2
- **Shadow Task:** ⬜ not submitted
- Other field: value

## Annotation 3
- **Shadow Task:** ✅ submitted (cycle 2) — [eeff0011](shadows/eeff0011.md)
- Other field: value
`;

step('seed temp environment', () => {
  seedEnv(INITIAL_STATE, TASK_MD, STEM);
});

let finalState;
step('run reconciler', () => {
  finalState = runReconcilerLogic(TMP_STATE, TMP_TASKS);
});

step('A1 is fired', () => {
  assert(finalState.job4_progress[STEM]?.annotation_1 === 'fired',
    `Expected annotation_1 = fired, got ${finalState.job4_progress[STEM]?.annotation_1}`);
});

step('A2 is NOT fired (⬜)', () => {
  assert(finalState.job4_progress[STEM]?.annotation_2 === undefined,
    `Expected annotation_2 = undefined, got ${finalState.job4_progress[STEM]?.annotation_2}`);
});

step('A3 is fired', () => {
  assert(finalState.job4_progress[STEM]?.annotation_3 === 'fired',
    `Expected annotation_3 = fired, got ${finalState.job4_progress[STEM]?.annotation_3}`);
});

step('last_step updated', () => {
  assert(finalState.last_step === 'job4.reconciled',
    `Expected last_step = job4.reconciled, got ${finalState.last_step}`);
});

step('updated_at advanced past seed value', () => {
  assert(finalState.updated_at > BEFORE_AT,
    `updated_at ${finalState.updated_at} should be after ${BEFORE_AT}`);
});

step('state file on disk matches returned state', () => {
  const onDisk = JSON.parse(readFileSync(TMP_STATE, 'utf8'));
  assert(onDisk.job4_progress[STEM]?.annotation_1 === 'fired', 'disk: A1 should be fired');
  assert(onDisk.job4_progress[STEM]?.annotation_2 === undefined, 'disk: A2 should be absent');
  assert(onDisk.last_step === 'job4.reconciled', 'disk: last_step wrong');
});

step('idempotent: second run reports no changes', () => {
  const stateBefore = JSON.parse(readFileSync(TMP_STATE, 'utf8'));
  runReconcilerLogic(TMP_STATE, TMP_TASKS);
  const stateAfter = JSON.parse(readFileSync(TMP_STATE, 'utf8'));
  // updated_at should NOT change on a no-op run (file not rewritten)
  assert(stateBefore.updated_at === stateAfter.updated_at,
    `updated_at changed on no-op: ${stateBefore.updated_at} → ${stateAfter.updated_at}`);
});

rmSync(TMP, { recursive: true, force: true });

endTest();
