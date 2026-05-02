#!/usr/bin/env node
// mark-resolved.mjs — Igor's no-flip resolution gate override (per-stem actor).
//
// Pipeline context (post-2026-05-02 swap): Job 4 (HAI shadow) writes per-annot
// hai_llm_eval to the sidecar. If any auto-verdict annot has non-clean eval,
// Job 5 (SA push) refuses to fire — the resolution gate is engaged.
//
// This script is the no-flip override path: Igor reads the HAI warnings, decides
// he disagrees with HAI's LLM (i.e. his 3a-equivalent auto-verdict was correct,
// and HAI is the wrong-by-policy 5th opinion). He marks the sidecar as resolved,
// which lets Job 5 fire.
//
// For the FLIP path, see run-reclaim.mjs (different script — also re-fans the
// payload and updates the HAI shadow record via /reclaim).
//
// Idempotent: re-running on an already-resolved stem exits 0 (no-op).
//
// Usage:
//   STEM=<stem> node scripts/mark-resolved.mjs
//
// Exit codes:
//   0 = OK (sidecar marked igor_resolved: true)
//   1 = IO / parse error
//   2 = precondition violated (sidecar missing, no warnings to resolve, etc.)

import { readFileSync, writeFileSync, existsSync, renameSync } from 'fs';
import { join, resolve, dirname as pathDirname } from 'path';
import { fileURLToPath } from 'url';

const __dir = pathDirname(fileURLToPath(import.meta.url));
const LIZARD_DIR = process.env.LIZARD_DIR ?? resolve(__dir, '..');
const STEM = process.env.STEM;
if (!STEM) {
  console.error('[mark-resolved] ERROR: STEM env var required');
  process.exit(1);
}

const SIDECAR_PATH = join(LIZARD_DIR, 'payloads', 'shadow_applied', `${STEM}.shadows.yaml`);
const PAYLOAD_PATH = join(LIZARD_DIR, 'payloads', 'shadow_applied', `${STEM}.yaml`);

if (!existsSync(SIDECAR_PATH)) {
  console.error(`[mark-resolved] ERROR: ${SIDECAR_PATH} missing. Stem must be at shadow_applied/ stage (Job 4 done) for resolution to apply.`);
  process.exit(2);
}
if (!existsSync(PAYLOAD_PATH)) {
  console.error(`[mark-resolved] ERROR: ${PAYLOAD_PATH} missing. Sidecar without payload is an inconsistent state.`);
  process.exit(2);
}

const txt = readFileSync(SIDECAR_PATH, 'utf8');

// Parse igor_resolved + per-annot eval to print a useful summary.
const igorResolvedRaw = /^\s*igor_resolved:\s*(true|false)\s*$/m.exec(txt)?.[1];
const alreadyResolved = igorResolvedRaw === 'true';

const blocks = txt.split(/(?=^  - n: \d+\s*$)/m).slice(1);
const warned = [];
for (const blk of blocks) {
  const get = (re) => re.exec(blk)?.[1]?.trim();
  const n = parseInt(get(/^  - n:\s*(\d+)/m) ?? 0, 10);
  if (!n) continue;
  const verdictSource = get(/^    verdict_source:\s*(\S+)/m) ?? 'auto';
  const haiLlmEval = get(/^    hai_llm_eval:\s*(\S+)/m) ?? 'clean';
  const haiLlmComment = /^    hai_llm_comment:\s*"([^"]*)"\s*$/m.exec(blk)?.[1] ?? '';
  if (verdictSource === 'auto' && haiLlmEval !== 'clean') {
    warned.push({ n, haiLlmEval, haiLlmComment });
  }
}

if (alreadyResolved) {
  console.error(`[mark-resolved] ${STEM}: already resolved (igor_resolved: true) — no-op.`);
  process.exit(0);
}

if (warned.length === 0) {
  console.error(`[mark-resolved] ${STEM}: no warnings to resolve (gate is already clean). Marking resolved anyway for symmetry.`);
}

// Replace igor_resolved line (idempotent — should always be present).
let newTxt;
if (/^igor_resolved:\s*(true|false)\s*$/m.test(txt)) {
  newTxt = txt.replace(/^igor_resolved:\s*(true|false)\s*$/m, 'igor_resolved: true');
} else {
  // Insert after stem line.
  newTxt = txt.replace(/^(stem:\s*\S+)\s*$/m, '$1\nigor_resolved: true');
}

const tmp = SIDECAR_PATH + '.tmp';
writeFileSync(tmp, newTxt, 'utf8');
renameSync(tmp, SIDECAR_PATH);

console.error(`[mark-resolved] ✓ ${STEM}: sidecar marked igor_resolved: true.`);
if (warned.length > 0) {
  console.error(`[mark-resolved] Warnings overridden (no flip):`);
  for (const w of warned) {
    console.error(`[mark-resolved]   A${w.n}: eval=${w.haiLlmEval}${w.haiLlmComment ? ' — ' + w.haiLlmComment.slice(0, 80) : ''}`);
  }
}
console.error(`[mark-resolved] Job 5 (SA push) is now eligible: STEM=${STEM} node scripts/run-job5.mjs`);
process.exit(0);
