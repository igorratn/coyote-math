#!/usr/bin/env node
// test-prefilter-historical-snapshot.mjs
// Snapshot test for the Job 2 prefilter against the 2026-04-23 16-stem batch.
//
// What this guards:
//   1. Every (stem, annot) pair produces the same hard flags as recorded.
//      Catches future regex drift / rule edits that change behavior on real data.
//   2. Catch-rate floor: prefilter must catch ≥9 of 22 thumbs-downs (current
//      baseline; was 12 before 2026-04-25 cycle-2 re-scrape — Scrum_57 A1/A5
//      and Scrum_59 A1 added anchor skills, legitimately losing G1_NO_ANCHOR).
//      If a rule edit drops recall, the test fails.
//   3. Precision floor: 0 hard flags on the 28 thumbs-up annotations + 3
//      unchanged carry-forwards. Any false positive on previously-accepted work
//      is a regression.
//
// Source of truth:
//   - Skeletons: lizard/tasks/skeleton/<stem>.md (committed)
//   - Verdicts:  lizard/tasks/<stem>.md (committed, parsed for **Rating:** lines)
//   - Baseline: HARD_FLAG_BASELINE below (snapshot from 2026-04-24)
//
// To re-baseline (after an intentional rule change):
//   1. Run the prefilter on all 16 stems
//   2. Replace HARD_FLAG_BASELINE with the new matrix
//   3. Update RECALL_FLOOR + PRECISION_FLOOR to match
//   4. Document the rule change in the commit message
//
// Usage: node scripts/tests/test-prefilter-historical-snapshot.mjs

import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import '../log-ts.mjs';
import { startTest, step, endTest, assert, LIZARD_DIR } from './test-helpers.mjs';
import { prefilterSkeleton } from '../job2-prefilter-rules.mjs';

const BATCH_2026_04_23 = [
  'Report_Dashboard_Scrum_Dashboard_6',
  'Report_Dashboard_Scrum_Dashboard_47',
  'Report_Dashboard_Scrum_Dashboard_53',
  'Report_Dashboard_Scrum_Dashboard_57',
  'Report_Dashboard_Scrum_Dashboard_59',
  'Report_Dashboard_Scrum_Dashboard_74',
  'Report_Dashboard_Server_Dashboard_22',
  'Report_Dashboard_Server_Dashboard_38',
  'Report_Dashboard_Server_Dashboard_43',
  'Report_Dashboard_Server_Dashboard_55',
  'Report_Dashboard_Server_Dashboard_58',
  'Report_Dashboard_Server_Dashboard_132',
  'Report_Dashboard_Server_Dashboard_134',
  'Report_Dashboard_Server_Dashboard_163',
  'Report_Dashboard_Server_Dashboard_164',
  'Report_Dashboard_Server_Dashboard_168',
];

// Hard flags only (severity: 'hard'). Soft flags (SKILL_UNKNOWN, G4_CROSS_REF,
// G2_SUBJECTIVE, QTYPE_MISMATCH) are excluded — they're informational, not
// gating. Snapshot frozen 2026-04-24 from running real prefilter on real
// skeletons in lizard/tasks/skeleton/.
const HARD_FLAG_BASELINE = {
  Report_Dashboard_Scrum_Dashboard_6: {
    1: [], 2: [], 3: [], 4: [], 5: [],
  },
  Report_Dashboard_Scrum_Dashboard_47: {
    1: [], 2: ['G1_NO_ANCHOR'], 3: [], 4: [],
  },
  Report_Dashboard_Scrum_Dashboard_53: {
    1: [], 2: [], 3: [], 4: [], 5: [],
  },
  Report_Dashboard_Scrum_Dashboard_57: {
    1: [], 2: [], 3: [], 4: ['G1_NO_ANCHOR'], 5: [],
  },
  Report_Dashboard_Scrum_Dashboard_59: {
    1: [],
  },
  Report_Dashboard_Scrum_Dashboard_74: {
    1: [], 2: [], 3: [], 4: [], 5: [],
  },
  Report_Dashboard_Server_Dashboard_22: {
    1: ['G1_NO_ANCHOR'],
  },
  Report_Dashboard_Server_Dashboard_38: {
    1: ['V6_LETTER_COUNT'],
  },
  Report_Dashboard_Server_Dashboard_43: {
    1: [], 2: [],
  },
  Report_Dashboard_Server_Dashboard_55: {
    1: [], 2: [], 3: [], 4: [], 5: [],
  },
  Report_Dashboard_Server_Dashboard_58: {
    1: [], 2: [], 3: ['G1_NO_ANCHOR'], 4: [],
  },
  Report_Dashboard_Server_Dashboard_132: {
    1: ['G1_NO_ANCHOR'], 2: [], 3: [],
  },
  Report_Dashboard_Server_Dashboard_134: {
    1: ['V6_LETTER_COUNT'], 2: ['G1_NO_ANCHOR'], 3: [],
  },
  Report_Dashboard_Server_Dashboard_163: {
    1: [], 2: [], 3: [], 4: [], 5: [],
  },
  Report_Dashboard_Server_Dashboard_164: {
    1: ['G1_NO_ANCHOR'], 2: [],
  },
  Report_Dashboard_Server_Dashboard_168: {
    1: [], 2: [],
  },
};

// Igor verdicts harvested from tasks/<stem>.md `**Rating:**` lines on 2026-04-24.
// Only thumbs-down + thumbs-up listed (carry-forward unchanged are excluded —
// they were skipped at review time per skip_review=true).
// Format: stem -> { annot_n: 'thumbs-down' | 'thumbs-up' | 'unchanged' }
const IGOR_VERDICTS = {
  Report_Dashboard_Scrum_Dashboard_6: { 1: 'unchanged', 2: 'thumbs-up', 3: 'unchanged', 4: 'thumbs-up', 5: 'unchanged' },
  Report_Dashboard_Scrum_Dashboard_47: { 1: 'thumbs-up', 2: 'thumbs-down', 3: 'thumbs-up', 4: 'thumbs-up' },
  Report_Dashboard_Scrum_Dashboard_53: { 1: 'thumbs-down', 2: 'thumbs-up', 3: 'thumbs-down', 4: 'thumbs-up', 5: 'thumbs-down' },
  Report_Dashboard_Scrum_Dashboard_57: { 1: 'thumbs-down', 2: 'thumbs-up', 3: 'thumbs-up', 4: 'thumbs-down', 5: 'thumbs-down' },
  Report_Dashboard_Scrum_Dashboard_59: { 1: 'thumbs-down' },
  Report_Dashboard_Scrum_Dashboard_74: { 1: 'thumbs-up', 2: 'thumbs-up', 3: 'thumbs-up', 4: 'thumbs-up', 5: 'thumbs-up' },
  Report_Dashboard_Server_Dashboard_22: { 1: 'thumbs-down' },
  Report_Dashboard_Server_Dashboard_38: { 1: 'thumbs-down' },
  Report_Dashboard_Server_Dashboard_43: { 1: 'thumbs-down', 2: 'thumbs-down' },
  Report_Dashboard_Server_Dashboard_55: { 1: 'thumbs-down', 2: 'thumbs-up', 3: 'thumbs-down', 4: 'thumbs-up', 5: 'thumbs-down' },
  Report_Dashboard_Server_Dashboard_58: { 1: 'thumbs-up', 2: 'thumbs-up', 3: 'thumbs-down', 4: 'thumbs-up' },
  Report_Dashboard_Server_Dashboard_132: { 1: 'thumbs-down', 2: 'thumbs-down', 3: 'thumbs-down' },
  Report_Dashboard_Server_Dashboard_134: { 1: 'thumbs-down', 2: 'thumbs-down', 3: 'thumbs-up' },
  Report_Dashboard_Server_Dashboard_163: { 1: 'thumbs-up', 2: 'thumbs-up', 3: 'thumbs-up', 4: 'thumbs-up', 5: 'thumbs-up' },
  Report_Dashboard_Server_Dashboard_164: { 1: 'thumbs-down', 2: 'thumbs-up' },
  Report_Dashboard_Server_Dashboard_168: { 1: 'thumbs-up', 2: 'thumbs-up' },
};

// Floors locked from 2026-04-24 baseline. Recall is allowed to GO UP (more
// thumbs-downs caught is good); precision must NEVER go down (no false
// positives on accepted work).
const RECALL_FLOOR = 9;      // ≥9 of 22 thumbs-downs caught (updated 2026-04-25 per cycle-2 re-scrape)
const PRECISION_TARGET = 0;  // exactly 0 hard flags on thumbs-ups + unchanged

function readSkeleton(stem) {
  const p = join(LIZARD_DIR, 'tasks', 'skeleton', `${stem}.md`);
  if (!existsSync(p)) throw new Error(`skeleton not found: ${p}`);
  return readFileSync(p, 'utf8');
}

function hardCodes(annot) {
  return annot.flags.filter(f => f.severity === 'hard').map(f => f.code).sort();
}

startTest('prefilter: historical snapshot vs 2026-04-23 batch (16 stems)');

// Pre-flight: skeleton files exist
step('all 16 batch skeletons present', () => {
  for (const stem of BATCH_2026_04_23) {
    const p = join(LIZARD_DIR, 'tasks', 'skeleton', `${stem}.md`);
    assert(existsSync(p), `missing skeleton: ${p}`);
  }
});

// Per-stem snapshot match
for (const stem of BATCH_2026_04_23) {
  step(`${stem}: hard flags match baseline`, () => {
    const skel = readSkeleton(stem);
    const annots = prefilterSkeleton(skel);
    const expected = HARD_FLAG_BASELINE[stem];
    assert(expected, `no baseline entry for ${stem} — re-baseline needed`);
    assert(annots.length === Object.keys(expected).length,
      `${stem}: got ${annots.length} annots, baseline has ${Object.keys(expected).length}`);
    for (const a of annots) {
      const got = hardCodes(a);
      const want = (expected[a.n] ?? []).slice().sort();
      assert(JSON.stringify(got) === JSON.stringify(want),
        `${stem} A${a.n}: hard flags drift — got [${got.join(',')}], want [${want.join(',')}]`);
    }
  });
}

// Aggregate recall + precision against Igor verdicts
step(`recall ≥${RECALL_FLOOR}/22 thumbs-downs caught + precision ${PRECISION_TARGET} FP on accepted`, () => {
  let totalDown = 0, totalUp = 0, totalUnchanged = 0;
  let downCaught = 0, upFP = 0, unchangedFP = 0;

  for (const stem of BATCH_2026_04_23) {
    const skel = readSkeleton(stem);
    const annots = prefilterSkeleton(skel);
    const verdicts = IGOR_VERDICTS[stem];
    assert(verdicts, `no verdicts for ${stem}`);

    for (const a of annots) {
      const v = verdicts[a.n];
      const hasHard = a.flags.some(f => f.severity === 'hard');
      if (v === 'thumbs-down') {
        totalDown++;
        if (hasHard) downCaught++;
      } else if (v === 'thumbs-up') {
        totalUp++;
        if (hasHard) upFP++;
      } else if (v === 'unchanged') {
        totalUnchanged++;
        if (hasHard) unchangedFP++;
      }
    }
  }

  const pct = (downCaught / totalDown * 100).toFixed(1);
  assert(totalDown === 22, `expected 22 thumbs-downs in batch, got ${totalDown}`);
  assert(totalUp === 28, `expected 28 thumbs-ups in batch, got ${totalUp}`);
  assert(totalUnchanged === 3, `expected 3 unchanged in batch, got ${totalUnchanged}`);
  assert(downCaught >= RECALL_FLOOR,
    `recall regression: caught ${downCaught}/${totalDown} (${pct}%), floor ${RECALL_FLOOR}`);
  assert(upFP === PRECISION_TARGET,
    `precision regression on thumbs-ups: ${upFP} FP (must be ${PRECISION_TARGET})`);
  assert(unchangedFP === PRECISION_TARGET,
    `precision regression on unchanged: ${unchangedFP} FP (must be ${PRECISION_TARGET})`);
  return `caught ${downCaught}/${totalDown} dn (${pct}%), 0 FP on ${totalUp} up + ${totalUnchanged} unchanged`;
});

endTest();
