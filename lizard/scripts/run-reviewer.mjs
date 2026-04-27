#!/usr/bin/env node
// run-reviewer.mjs
// Single entry point for all reviewer subprocesses. Picks an adapter based on
// REVIEWER env (or --reviewer arg). Replaces the previous 4 separate scripts:
//   run-gpt-reviewer.mjs, run-opus-reviewer.mjs, run-grok-reviewer.mjs,
//   run-gemini-reviewer.mjs (now thin wrappers).
//
// Usage:
//   STEM=<stem> REVIEWER=gpt|opus|grok|gemini [LIZARD_DIR=<path>] [OUT=<path>]
//     [ANNOTS=1,3,5] node scripts/run-reviewer.mjs
//   node scripts/run-reviewer.mjs --reviewer gpt   (CLI arg form)
//
// Env:
//   STEM        — required (task stem)
//   REVIEWER    — required (gpt|opus|grok|gemini); --reviewer arg also accepted
//   ANNOTS      — comma-separated annot numbers to review (default: all per cycle)
//   OUT         — output path (default: /tmp/lizard/<stem>/<reviewer>-review.md)
//   LIZARD_DIR  — workspace root (default: parent of scripts/)
//   <ADAPTER>_API_KEY  — per adapter (OPENAI_API_KEY, XAI_API_KEY, GEMINI_API_KEY)
//   GPT_MODEL / OPUS_MODEL / GROK_MODEL / GEMINI_MODEL  — model overrides

import './log-ts.mjs';
import { resolve, join, dirname as pathDirname } from 'path';
import { fileURLToPath } from 'url';
import { prepareReview, buildPromptText, writeReviewOutput, loadDotEnv } from './reviewer-shared.mjs';

const __dir = pathDirname(fileURLToPath(import.meta.url));
const LIZARD_DIR = process.env.LIZARD_DIR ?? resolve(__dir, '..');

// Pick reviewer from --reviewer CLI arg or REVIEWER env
function resolveReviewerName() {
  const argIdx = process.argv.indexOf('--reviewer');
  if (argIdx !== -1 && process.argv[argIdx + 1]) return process.argv[argIdx + 1];
  if (process.env.REVIEWER) return process.env.REVIEWER;
  console.error('ERROR: REVIEWER env or --reviewer arg required (gpt|opus|grok|gemini)');
  process.exit(1);
}

const reviewerName = resolveReviewerName();
const STEM = process.env.STEM;
if (!STEM) { console.error('ERROR: STEM env var required'); process.exit(1); }

// Default OUT keyed on reviewer name
const OUT = process.env.OUT ?? join('/tmp/lizard', STEM, `${reviewerName}-review.md`);

// Load .env so adapter API-key checks find their vars
loadDotEnv(LIZARD_DIR);

// Dispatch to adapter
let adapter, callArgs;
if (reviewerName === 'gpt' || reviewerName === 'grok') {
  const mod = await import('./reviewer-adapters/openai-compat.mjs');
  const profile = mod.profiles[reviewerName];
  if (!profile) { console.error(`ERROR: no openai-compat profile for ${reviewerName}`); process.exit(1); }
  adapter = mod.review;
  callArgs = { profile };  // adapter expects {profile, ...sources}
} else if (reviewerName === 'gemini') {
  const mod = await import('./reviewer-adapters/gemini.mjs');
  adapter = mod.review;
  callArgs = {};
} else if (reviewerName === 'opus') {
  const mod = await import('./reviewer-adapters/opus-cli.mjs');
  adapter = mod.review;
  callArgs = { STEM };  // opus needs STEM for tmp file naming
} else {
  console.error(`ERROR: unknown reviewer '${reviewerName}' (must be gpt|opus|grok|gemini)`);
  process.exit(1);
}

// Prepare common sources (skeleton view, framework, claudeMd, image, crops)
let prep;
try {
  prep = prepareReview({ STEM, LIZARD_DIR, OUT });
} catch (e) {
  console.error(`[run-reviewer] prepare failed: ${e.message}`);
  process.exit(1);
}
console.error(`[run-reviewer] reviewer=${reviewerName} stem=${STEM} annots=${prep.annotsList.join(',')}`);

const promptText = buildPromptText({
  STEM,
  paths: prep.paths,
  skeletonView: prep.skeletonView,
  framework: prep.framework,
  claudeMd: prep.claudeMd,
});

const reviewText = await adapter({
  ...callArgs,
  mainImageBase64: prep.mainImageBase64,
  mediaType: prep.mediaType,
  quadCrops: prep.quadCrops,
  promptText,
});

writeReviewOutput(OUT, reviewText);
