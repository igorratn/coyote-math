#!/usr/bin/env node
// test-auto-resolve.mjs
// E2E unit test for the merger's auto-resolve gate.
//
// Policy (2026-04-25 v2, Igor — see CLAUDE.md "JOB 3 RESOLUTION"):
//   👍 case: ANY reviewer 👍 → auto-resolved. SA push approves annotator's
//   answer regardless of reviewer's own Final Answer.
//   👎 case: ALL reviewers fired (≥2) + ALL 👎 + ALL flagged G1 → auto-resolved.
//
// Rule evolution:
//   2026-04-24: all fired + all 👍 + all same answer (too strict)
//   2026-04-25 v1: any 👍 + reviewer's answer matches annotator's
//   2026-04-25 v2 (current): any 👍 (drop the answer-match requirement)
//
// This test invokes the merger as a subprocess against a synthetic skeleton +
// reviewer files in a temp dir, then inspects merge-summary.json.
//
// Usage: node scripts/tests/test-auto-resolve.mjs

import '../log-ts.mjs';
import { mkdtempSync, writeFileSync, mkdirSync, readFileSync, rmSync } from 'fs';
import { tmpdir } from 'os';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { spawnSync } from 'child_process';
import { startTest, step, endTest, assert, LIZARD_DIR } from './test-helpers.mjs';

const __dir = dirname(fileURLToPath(import.meta.url));
const MERGER = join(LIZARD_DIR, 'scripts', 'job2-merge.mjs');

startTest('auto-resolve: gate fires only on full-coverage all-up same-answer');

// Build a minimal skeleton with one annotation (n=1).
function makeSkeleton(stem) {
  return [
    `# Cycle 1 — Skeleton: ${stem}`,
    ``,
    `- **task_id:** test_${stem}`,
    `- **SA_TASK_FILENAME:** ${stem}.json`,
    `- **Image:** screenshots/${stem}.png`,
    ``,
    `## Annotation 1`,
    `- **Skills Tagged:** Logical Reasoning`,
    `- **Question Type:** SA`,
    `- **Model Answer:** A`,
    `- **Annotator Answer:** A`,
    ``,
    `#### Full Prompt`,
    `What is 2+2?`,
    ``,
    `#### Rewrite Answer`,
    `4`,
    ``,
    `---`,
  ].join('\n');
}

// Build a reviewer review file with a given rating + finalAnswer for annot 1.
function makeReview({ rating, finalAnswer = 'A', flags = '[]' }) {
  return [
    `## Read-First Observations`,
    `- stub`,
    ``,
    `## Annotation 1`,
    ``,
    `- **Rating:** ${rating}`,
    `- **Final Rewrite Answer:** ${finalAnswer}`,
    `- **Flags:** ${flags}`,
    ``,
    `### Two-Part Check`,
    `OK.`,
    ``,
    `## Fix List`,
    `- None`,
  ].join('\n');
}

// runMerger:
//   reviewers: list to pass via REVIEWERS env (explicit). If `null`, REVIEWERS is
//     omitted entirely so the merger uses filesystem auto-discovery.
function runMerger({ stem, reviewers, reviewFiles }) {
  const tmpDir = mkdtempSync(join(tmpdir(), `lizard-autoresolve-${stem}-`));
  const tasksDir = join(tmpDir, 'tasks');
  const skelDir = join(tasksDir, 'skeleton');
  const reviewDir = join(tmpDir, 'tmp', stem);
  mkdirSync(skelDir, { recursive: true });
  mkdirSync(reviewDir, { recursive: true });
  writeFileSync(join(skelDir, `${stem}.md`), makeSkeleton(stem), 'utf8');
  // Mirror lizard layout enough for OUT_TASK to land
  for (const [name, body] of Object.entries(reviewFiles)) {
    writeFileSync(join(reviewDir, `${name}-review.md`), body, 'utf8');
  }
  const env = {
    ...process.env,
    STEM: stem,
    LIZARD_DIR: tmpDir,
    REVIEW_DIR: reviewDir,
  };
  if (reviewers !== null) env.REVIEWERS = reviewers.join(',');
  // Otherwise leave REVIEWERS unset → merger auto-discovers from REVIEW_DIR.
  const r = spawnSync('node', [MERGER], { env, encoding: 'utf8' });
  if (r.status !== 0) {
    console.error('  merger stderr:\n' + (r.stderr || '').split('\n').slice(-10).join('\n'));
    throw new Error(`merger exit ${r.status}`);
  }
  const summary = JSON.parse(readFileSync(join(reviewDir, 'merge-summary.json'), 'utf8'));
  const taskFile = readFileSync(join(tasksDir, `${stem}.md`), 'utf8');
  rmSync(tmpDir, { recursive: true, force: true });
  return { summary, taskFile };
}

// Note: makeSkeleton sets `**Annotator Answer:** A` — so reviewer finalAnswer 'A'
// matches annotator, anything else doesn't.

step('one 👍 matching annotator → auto-resolved (single reviewer is enough)', () => {
  const { summary, taskFile } = runMerger({
    stem: 'autoSingleMatch',
    reviewers: ['gpt'],
    reviewFiles: {
      gpt: makeReview({ rating: 'thumbs-up', finalAnswer: 'A' }),
    },
  });
  assert(summary.per_annotation[0].decision === 'auto-resolved',
    `decision=${summary.per_annotation[0].decision}`);
  assert(/Auto-resolved at Job 2/.test(taskFile));
});

step('one 👍 NOT matching annotator → STILL auto-resolved (v2: any 👍 wins)', () => {
  const { summary } = runMerger({
    stem: 'autoSingleNoMatch',
    reviewers: ['gpt'],
    reviewFiles: {
      gpt: makeReview({ rating: 'thumbs-up', finalAnswer: 'B' }),
    },
  });
  assert(summary.per_annotation[0].decision === 'auto-resolved',
    `decision=${summary.per_annotation[0].decision}`);
});

step('both 👍 both matching annotator → auto-resolved', () => {
  const { summary } = runMerger({
    stem: 'autoBothMatch',
    reviewers: ['gpt', 'opus'],
    reviewFiles: {
      gpt:  makeReview({ rating: 'thumbs-up', finalAnswer: 'A' }),
      opus: makeReview({ rating: 'thumbs-up', finalAnswer: 'A' }),
    },
  });
  assert(summary.per_annotation[0].decision === 'auto-resolved');
});

step('gpt 👍 matches, opus 👍 different answer → auto-resolved (gpt vouches)', () => {
  const { summary, taskFile } = runMerger({
    stem: 'autoOneMatchOneDiff',
    reviewers: ['gpt', 'opus'],
    reviewFiles: {
      gpt:  makeReview({ rating: 'thumbs-up', finalAnswer: 'A' }),
      opus: makeReview({ rating: 'thumbs-up', finalAnswer: 'B' }),
    },
  });
  assert(summary.per_annotation[0].decision === 'auto-resolved',
    `decision=${summary.per_annotation[0].decision}`);
  // pick = the matching one (gpt)
  assert(summary.per_annotation[0].reviewer === 'gpt',
    `pick should be gpt (matching), got ${summary.per_annotation[0].reviewer}`);
  // both bodies still in task file
  assert(/Reviewer Body \(gpt\)/.test(taskFile) && /Reviewer Body \(opus\)/.test(taskFile),
    'both reviewer bodies should be present');
});

step('gpt 👎, opus 👍 matches → auto-resolved (opus vouches)', () => {
  const { summary } = runMerger({
    stem: 'autoOpusVouches',
    reviewers: ['gpt', 'opus'],
    reviewFiles: {
      gpt:  makeReview({ rating: 'thumbs-down', finalAnswer: 'B' }),
      opus: makeReview({ rating: 'thumbs-up',   finalAnswer: 'A' }),
    },
  });
  assert(summary.per_annotation[0].decision === 'auto-resolved');
  assert(summary.per_annotation[0].reviewer === 'opus');
});

step('gpt 👍 NOT matching, opus 👍 NOT matching → STILL auto-resolved (v2: any 👍 wins)', () => {
  const { summary } = runMerger({
    stem: 'autoNoMatch',
    reviewers: ['gpt', 'opus'],
    reviewFiles: {
      gpt:  makeReview({ rating: 'thumbs-up', finalAnswer: 'B' }),
      opus: makeReview({ rating: 'thumbs-up', finalAnswer: 'C' }),
    },
  });
  assert(summary.per_annotation[0].decision === 'auto-resolved',
    `decision=${summary.per_annotation[0].decision}`);
});

step('both 👎 without G1 → pending-igor (no auto-resolve-down trigger)', () => {
  const { summary } = runMerger({
    stem: 'autoBothDownNoG1',
    reviewers: ['gpt', 'opus'],
    reviewFiles: {
      gpt:  makeReview({ rating: 'thumbs-down', finalAnswer: 'A', flags: '[Type 3]' }),
      opus: makeReview({ rating: 'thumbs-down', finalAnswer: 'A', flags: '[Type 7]' }),
    },
  });
  assert(summary.per_annotation[0].decision === 'pending-igor',
    `expected pending (no G1), got ${summary.per_annotation[0].decision}`);
});

// ---------- Auto-resolve down (G1 unanimous) gate ----------

step('both 👎 with G1 → auto-resolved (down case)', () => {
  const { summary, taskFile } = runMerger({
    stem: 'autoBothDownG1',
    reviewers: ['gpt', 'opus'],
    reviewFiles: {
      gpt:  makeReview({ rating: 'thumbs-down', finalAnswer: 'N/A — prompt invalid', flags: '[G1]' }),
      opus: makeReview({ rating: 'thumbs-down', finalAnswer: 'N/A — prompt invalid', flags: '[G1]' }),
    },
  });
  assert(summary.per_annotation[0].decision === 'auto-resolved',
    `expected auto-resolved, got ${summary.per_annotation[0].decision}`);
  assert(summary.per_annotation[0].rating === 'thumbs-down',
    `expected pick rating thumbs-down, got ${summary.per_annotation[0].rating}`);
  assert(/Auto-resolved at Job 2 \(👎\)/.test(taskFile), 'task file missing 👎 callout');
});

step('both 👎, gpt has G1 + opus has G2 → pending-igor (G1 not unanimous)', () => {
  const { summary } = runMerger({
    stem: 'autoG1NotUnanimous',
    reviewers: ['gpt', 'opus'],
    reviewFiles: {
      gpt:  makeReview({ rating: 'thumbs-down', finalAnswer: 'X', flags: '[G1]' }),
      opus: makeReview({ rating: 'thumbs-down', finalAnswer: 'X', flags: '[G2]' }),
    },
  });
  assert(summary.per_annotation[0].decision === 'pending-igor',
    `expected pending (G1 only on one), got ${summary.per_annotation[0].decision}`);
});

step('one 👎 only, has G1 → pending-igor (need ≥2 reviewers for auto-resolve-down)', () => {
  const { summary } = runMerger({
    stem: 'autoSingleDownG1',
    reviewers: ['gpt'],
    reviewFiles: {
      gpt:  makeReview({ rating: 'thumbs-down', finalAnswer: 'X', flags: '[G1]' }),
    },
  });
  assert(summary.per_annotation[0].decision === 'pending-igor');
});

step('three reviewers all 👎 with G1 → auto-resolved (down)', () => {
  const { summary } = runMerger({
    stem: 'autoTripleDownG1',
    reviewers: ['gpt', 'grok', 'opus'],
    reviewFiles: {
      gpt:  makeReview({ rating: 'thumbs-down', finalAnswer: 'N/A', flags: '[G1, Type 3]' }),
      grok: makeReview({ rating: 'thumbs-down', finalAnswer: 'N/A', flags: '[G1]' }),
      opus: makeReview({ rating: 'thumbs-down', finalAnswer: 'N/A', flags: '[G1, Type 7]' }),
    },
  });
  assert(summary.per_annotation[0].decision === 'auto-resolved');
});

// ---------- Reviewer auto-discovery ----------
// 2026-04-25: dropped the requirement to pass REVIEWERS=gpt,opus,gemini,grok
// every time we add a reviewer. Merger now scans REVIEW_DIR for any known
// reviewer's `<name>-review.md` and includes those in fire order.

step('auto-discover: 3 reviewer files present, no REVIEWERS env → all 3 included', () => {
  const { summary } = runMerger({
    stem: 'autoDiscover3',
    reviewers: null,  // omit REVIEWERS env → triggers auto-discovery
    reviewFiles: {
      gpt:    makeReview({ rating: 'thumbs-down', finalAnswer: 'X', flags: '[G1]' }),
      opus:   makeReview({ rating: 'thumbs-down', finalAnswer: 'X', flags: '[G2]' }),
      gemini: makeReview({ rating: 'thumbs-down', finalAnswer: 'X', flags: '[G1]' }),
    },
  });
  const used = new Set(summary.reviewers_used);
  assert(used.has('gpt') && used.has('opus') && used.has('gemini'),
    `auto-discovery missed reviewers: got ${[...used].join(',')}`);
});

step('auto-discover: just gemini file present → only gemini', () => {
  const { summary } = runMerger({
    stem: 'autoDiscoverGeminiOnly',
    reviewers: null,
    reviewFiles: {
      gemini: makeReview({ rating: 'thumbs-up', finalAnswer: 'A' }),
    },
  });
  const used = new Set(summary.reviewers_used);
  assert(used.size === 1 && used.has('gemini'),
    `expected only gemini, got ${[...used].join(',')}`);
  // Single 👍 → auto-resolved under v2 rule
  assert(summary.per_annotation[0].decision === 'auto-resolved');
});

step('auto-discover: REVIEWERS env still overrides filesystem', () => {
  const { summary } = runMerger({
    stem: 'autoDiscoverOverride',
    reviewers: ['gpt'],  // explicit override — ignore opus/gemini files even if present
    reviewFiles: {
      gpt:    makeReview({ rating: 'thumbs-down', finalAnswer: 'X', flags: '[G1]' }),
      opus:   makeReview({ rating: 'thumbs-up',   finalAnswer: 'A' }),
      gemini: makeReview({ rating: 'thumbs-up',   finalAnswer: 'A' }),
    },
  });
  const used = new Set(summary.reviewers_used);
  assert(used.size === 1 && used.has('gpt'),
    `REVIEWERS override should restrict to gpt, got ${[...used].join(',')}`);
  // gpt 👎 only → pending-igor (opus/gemini 👍s ignored due to override)
  assert(summary.per_annotation[0].decision === 'pending-igor');
});

step('answers normalize: " A " === "a" → auto-resolve', () => {
  const { summary } = runMerger({
    stem: 'autoNormAns',
    reviewers: ['gpt', 'opus'],
    reviewFiles: {
      gpt:  makeReview({ rating: 'thumbs-up', finalAnswer: ' A ' }),
      opus: makeReview({ rating: 'thumbs-up', finalAnswer: 'a' }),
    },
  });
  assert(summary.per_annotation[0].decision === 'auto-resolved',
    `decision=${summary.per_annotation[0].decision}`);
});

endTest();
