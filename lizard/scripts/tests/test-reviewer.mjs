#!/usr/bin/env node
// test-reviewer.mjs
// Generic per-reviewer smoke test. Invoked via wrappers:
//   test-reviewer-gpt.mjs, test-reviewer-grok.mjs, test-reviewer-gemini.mjs, test-reviewer-opus.mjs
//
// What it checks:
//   1. required env (API key or CLI) present — SKIP cleanly if not, don't FAIL
//   2. reviewer subprocess exits 0 on the Scrum_6 fixture
//   3. output file exists + is > 500 bytes
//   4. output contains ≥N `## Annotation N` headers (N = skeleton count)
//   5. each annotation block has Rating + Final Rewrite Answer
//   6. output has the required `## Read-First Observations` block
//
// Regression target: 2026-04-23 gpt silent-drop — reviewer wrote output that
// the merger's regex found 0 annotations in, but run-job2 counted it as success.
// This test would have caught it on step 4.

import { existsSync, readFileSync } from 'fs';
import { join } from 'path';
import {
  FIXTURE_STEM, LIZARD_DIR, startTest, step, endTest, freshTmpDir,
  runReviewerScript, countSkeletonAnnotations, assert,
  parseAnnotations, splitAnnotationBlocks, parseRating, parseFinalAnswer,
} from './test-helpers.mjs';

const REQUIREMENTS = {
  gpt:    { envKey: 'OPENAI_API_KEY' },
  grok:   { envKey: 'XAI_API_KEY'    },
  gemini: { envKey: 'GEMINI_API_KEY' },
  opus:   { cli: 'claude'            },
};

function skip(reason) {
  console.error(`[TEST] reviewer SKIP: ${reason}`);
  process.exit(0); // 0 = not a failure, just unrunnable in this env
}

function hasKeyViaEnvOrDotenv(envKey) {
  if (process.env[envKey]) return true;
  const envFile = join(LIZARD_DIR, '.env');
  if (!existsSync(envFile)) return false;
  const re = new RegExp(`^\\s*${envKey}\\s*=\\s*.+`, 'm');
  return re.test(readFileSync(envFile, 'utf8'));
}

function claudeCliPresent() {
  const { spawnSync } = require('child_process');
  const r = spawnSync('claude', ['--version'], { encoding: 'utf8' });
  return r.status === 0;
}

export async function run(REVIEWER) {
  const req = REQUIREMENTS[REVIEWER];
  if (!req) { console.error(`unknown reviewer: ${REVIEWER}`); process.exit(2); }

  startTest(`reviewer:${REVIEWER} on ${FIXTURE_STEM}`);

  // Pre-flight (soft): skip if required secret/CLI missing so CI on a locked-down
  // host doesn't falsely fail. A real Mac dev box will have everything.
  if (req.envKey && !hasKeyViaEnvOrDotenv(req.envKey)) {
    skip(`${req.envKey} not set — cannot run ${REVIEWER}`);
  }
  if (req.cli) {
    const { spawnSync } = await import('child_process');
    const r = spawnSync(req.cli, ['--version'], { encoding: 'utf8' });
    if (r.status !== 0) skip(`${req.cli} CLI not on PATH — cannot run ${REVIEWER}`);
  }

  const expectedAnnots = countSkeletonAnnotations();
  const outDir = freshTmpDir(`${REVIEWER}-${FIXTURE_STEM}`);

  let result;
  step(`spawn run-${REVIEWER}-reviewer.mjs (timeout 5min)`, () => {
    result = runReviewerScript({ reviewer: REVIEWER, outDir });
    assert(result.exitCode === 0, `exit=${result.exitCode}, stderr tail:\n${result.stderr}`);
    assert(existsSync(result.outPath), `output file missing: ${result.outPath}`);
    return `${result.dur}s, ${result.sizeBytes} bytes`;
  });

  step('output file > 500 bytes (stubs/refusals are smaller)', () => {
    assert(result.sizeBytes > 500,
      `only ${result.sizeBytes} bytes — likely a refusal or error stub`);
  });

  let ns, blocks;
  step(`output has ≥${expectedAnnots} "## Annotation N" headers (strict)`, () => {
    ns = parseAnnotations(result.text);
    blocks = splitAnnotationBlocks(result.text);
    assert(ns.length >= expectedAnnots,
      `parsed ${ns.length}/${expectedAnnots} headers — reviewer violated "## Annotation N" format rule`);
    return `${ns.length} parsed, ${blocks.size} blocks`;
  });

  step('every annotation block has bolded "**Rating:**" line', () => {
    // Precondition: headers must have parsed, else we're asserting over an empty set.
    assert(ns && ns.length >= expectedAnnots,
      `cannot check Rating: only ${ns?.length ?? 0}/${expectedAnnots} headers parsed (fix step 3 first)`);
    const missing = [];
    for (const n of ns.slice(0, expectedAnnots)) {
      if (!parseRating(blocks.get(n) ?? '')) missing.push(n);
    }
    assert(missing.length === 0,
      `no Rating parsed in annotation(s): ${missing.join(', ')}`);
    return `${expectedAnnots}/${expectedAnnots} have Rating`;
  });

  step('every annotation block has bolded "**Final Rewrite Answer:**" line', () => {
    assert(ns && ns.length >= expectedAnnots,
      `cannot check Final Rewrite Answer: only ${ns?.length ?? 0}/${expectedAnnots} headers parsed (fix step 3 first)`);
    const missing = [];
    for (const n of ns.slice(0, expectedAnnots)) {
      if (!parseFinalAnswer(blocks.get(n) ?? '')) missing.push(n);
    }
    assert(missing.length === 0,
      `no Final Rewrite Answer parsed in annotation(s): ${missing.join(', ')} — check bold markers`);
    return `${expectedAnnots}/${expectedAnnots} have Final Rewrite Answer`;
  });

  step('output includes "## Read-First Observations" block', () => {
    assert(/## Read-First Observations/.test(result.text),
      `missing "## Read-First Observations" — prompt template violation`);
  });

  step('output path saved — inspect at:', () => result.outPath);

  endTest();
}
