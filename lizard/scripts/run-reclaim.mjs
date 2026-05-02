#!/usr/bin/env node
// run-reclaim.mjs — Igor's flip resolution path: update HAI shadow record via
// /reclaim endpoint AFTER Igor has decided to flip a verdict post-shadow.
//
// Pipeline context (post-2026-05-02 swap): when Job 4 (HAI shadow) raises a
// warning on an auto-verdict annot AND Igor agrees with HAI's LLM — i.e. flips
// the answer — this script:
//   1. Calls HAI's /reclaim endpoint to update the shadow record's Rewrite
//      Answer with the new value (preserves audit-trail invariant: post-reclaim
//      HAI Rewrite == final SA Rewrite).
//   2. Updates the sidecar entry: reclaimed=true, reclaim_diff="answer: X → Y".
//   3. Updates the shadow proof file (tasks/shadows/<uuid>.md) with the new
//      values + reclaim metadata.
//
// Igor must FIRST update tasks/<S>.md (append #### Igor Verdict (post-shadow)
// on the affected annot) AND re-fan the payload (run-job3.mjs --force-overwrite,
// which writes to payloads/<S>.yaml — must be moved out of shadow_applied/ first
// or this script handles the swap). After this script completes for ALL flipped
// annots, run mark-resolved.mjs to clear the gate.
//
// ⚠ STUB STATUS (2026-05-02): /reclaim endpoint URL + auth + payload shape are
// not yet wired. This script enforces the sidecar/proof-file bookkeeping AND
// emits the curl/fetch invocation Igor needs to run by hand. Once endpoint
// specs are confirmed, replace the print-and-exit with an actual fetch().
//
// Usage:
//   STEM=<stem> ANNOT=<n> NEW_ANSWER="<text>" \
//     [LIZARD_DIR=<path>] node scripts/run-reclaim.mjs
//
// Exit codes:
//   0 = OK (sidecar + proof updated; endpoint call printed for manual exec)
//   1 = IO / parse error
//   2 = precondition violated (sidecar missing, annot not gated, etc.)
//   3 = endpoint call failed (once wired up)

import { readFileSync, writeFileSync, existsSync, renameSync } from 'fs';
import { join, resolve, dirname as pathDirname } from 'path';
import { fileURLToPath } from 'url';

const __dir = pathDirname(fileURLToPath(import.meta.url));
const LIZARD_DIR = process.env.LIZARD_DIR ?? resolve(__dir, '..');
const STEM = process.env.STEM;
const ANNOT = parseInt(process.env.ANNOT ?? '0', 10);
const NEW_ANSWER = process.env.NEW_ANSWER;

if (!STEM || !ANNOT || NEW_ANSWER === undefined) {
  console.error('[run-reclaim] ERROR: STEM, ANNOT, NEW_ANSWER env vars required');
  console.error('  example: STEM=Plot_X_42 ANNOT=2 NEW_ANSWER="24" node scripts/run-reclaim.mjs');
  process.exit(1);
}

const SIDECAR_PATH = join(LIZARD_DIR, 'payloads', 'shadow_applied', `${STEM}.shadows.yaml`);
const SHADOWS_DIR  = join(LIZARD_DIR, 'tasks', 'shadows');

if (!existsSync(SIDECAR_PATH)) {
  console.error(`[run-reclaim] ERROR: ${SIDECAR_PATH} missing. Stem must be at shadow_applied/ stage.`);
  process.exit(2);
}

const sidecarTxt = readFileSync(SIDECAR_PATH, 'utf8');

// Find the annot block.
const blocks = sidecarTxt.split(/(?=^  - n: \d+\s*$)/m);
const header = blocks[0];
const annotBlocks = blocks.slice(1);

const targetIdx = annotBlocks.findIndex(blk => {
  const m = /^  - n:\s*(\d+)/m.exec(blk);
  return m && parseInt(m[1], 10) === ANNOT;
});
if (targetIdx === -1) {
  console.error(`[run-reclaim] ERROR: annot ${ANNOT} not found in sidecar`);
  process.exit(2);
}

const targetBlk = annotBlocks[targetIdx];
const get = (re) => re.exec(targetBlk)?.[1]?.trim();
const uuid = get(/^    uuid:\s*(\S+)/m);
const verdictSource = get(/^    verdict_source:\s*(\S+)/m) ?? 'auto';
const haiLlmEval = get(/^    hai_llm_eval:\s*(\S+)/m) ?? 'clean';
const haiLlmComment = /^    hai_llm_comment:\s*"([^"]*)"\s*$/m.exec(targetBlk)?.[1] ?? '';
const wasReclaimed = /^    reclaimed:\s*true\s*$/m.test(targetBlk);

if (verdictSource !== 'auto') {
  console.error(`[run-reclaim] WARN: A${ANNOT} verdict_source=${verdictSource} (not 'auto'). Igor-verdict annots are gate-immune; flip is allowed but unusual.`);
}
if (wasReclaimed) {
  console.error(`[run-reclaim] ERROR: A${ANNOT} already reclaimed. Repeat reclaims not currently supported.`);
  process.exit(2);
}

// Read current Rewrite Answer from the proof file (was frozen at shadow submit).
const proofPath = join(SHADOWS_DIR, `${uuid}.md`);
let oldAnswer = '(unknown)';
if (existsSync(proofPath)) {
  const proofTxt = readFileSync(proofPath, 'utf8');
  const m = /^## Rewrite Answer\s*\n([\s\S]+?)(?=\n##|\n*$)/m.exec(proofTxt);
  if (m) oldAnswer = m[1].trim();
}

const reclaimDiff = `answer: ${oldAnswer} → ${NEW_ANSWER}`;

// ─── /reclaim endpoint call ───────────────────────────────────────────────
// TODO (codified 2026-05-02): wire to HAI /reclaim endpoint.
// Spec needed from Igor:
//   - URL pattern (e.g. https://ai.joinhandshake.com/api/.../reclaim/<uuid>)
//   - Auth (session cookie via Chrome MCP, or separate API token)
//   - Method (PATCH / POST / PUT)
//   - Payload shape (just answer? prompt? rating?)
//   - Whether re-triggers HAI's LLM eval (infinite-warning risk)
//   - Window (only "in progress" or any submitted shadow? expiry?)
console.error(`\n[run-reclaim] ⚠ STUB: /reclaim endpoint not yet wired.`);
console.error(`[run-reclaim] Manual /reclaim call required for shadow ${uuid}:`);
console.error(`[run-reclaim]   shadow uuid: ${uuid}`);
console.error(`[run-reclaim]   old answer:  ${oldAnswer}`);
console.error(`[run-reclaim]   new answer:  ${NEW_ANSWER}`);
console.error(`[run-reclaim]   diff:        ${reclaimDiff}`);
console.error(`[run-reclaim] Once spec is provided, replace this stub with a fetch() call.\n`);

// ─── Update sidecar entry ─────────────────────────────────────────────────
let updatedBlk = targetBlk;
updatedBlk = updatedBlk.replace(/^    reclaimed:\s*(true|false)\s*$/m, '    reclaimed: true');
if (/^    reclaim_diff:\s*null\s*$/m.test(updatedBlk)) {
  updatedBlk = updatedBlk.replace(/^    reclaim_diff:\s*null\s*$/m, `    reclaim_diff: "${reclaimDiff.replace(/"/g, '\\"')}"`);
} else if (/^    reclaim_diff:\s*"[^"]*"\s*$/m.test(updatedBlk)) {
  updatedBlk = updatedBlk.replace(/^    reclaim_diff:\s*"[^"]*"\s*$/m, `    reclaim_diff: "${reclaimDiff.replace(/"/g, '\\"')}"`);
} else {
  // Insert after reclaimed line.
  updatedBlk = updatedBlk.replace(/^(    reclaimed:\s*true)\s*$/m, `$1\n    reclaim_diff: "${reclaimDiff.replace(/"/g, '\\"')}"`);
}

annotBlocks[targetIdx] = updatedBlk;
const newSidecar = header + annotBlocks.join('');

const tmp = SIDECAR_PATH + '.tmp';
writeFileSync(tmp, newSidecar, 'utf8');
renameSync(tmp, SIDECAR_PATH);
console.error(`[run-reclaim] ✓ ${STEM} A${ANNOT}: sidecar updated (reclaimed: true, ${reclaimDiff})`);

// ─── Update proof file ────────────────────────────────────────────────────
if (existsSync(proofPath)) {
  let proofTxt = readFileSync(proofPath, 'utf8');
  // Add reclaim metadata to the metadata block (after Status line).
  if (!/^- \*\*Reclaimed at:\*\*/m.test(proofTxt)) {
    proofTxt = proofTxt.replace(
      /^(- \*\*Status:\*\*[^\n]*)\n/m,
      `$1\n- **Reclaimed at:** ${new Date().toISOString()}\n- **Reclaim diff:** ${reclaimDiff}\n`
    );
  }
  // Replace the Rewrite Answer block with the new value.
  proofTxt = proofTxt.replace(
    /^(## Rewrite Answer\s*\n)([\s\S]+?)(?=\n##|\n*$)/m,
    `$1${NEW_ANSWER}`
  );
  const proofTmp = proofPath + '.tmp';
  writeFileSync(proofTmp, proofTxt, 'utf8');
  renameSync(proofTmp, proofPath);
  console.error(`[run-reclaim] ✓ proof file updated: tasks/shadows/${uuid}.md`);
} else {
  console.error(`[run-reclaim] WARN: proof file ${proofPath} missing — skip proof update`);
}

console.error(`\n[run-reclaim] Next steps:`);
console.error(`[run-reclaim]   1. Manually call HAI /reclaim endpoint (until stub is replaced).`);
console.error(`[run-reclaim]   2. Repeat for any other flipped annots in this stem.`);
console.error(`[run-reclaim]   3. STEM=${STEM} node scripts/mark-resolved.mjs   (clear gate)`);
console.error(`[run-reclaim]   4. STEM=${STEM} node scripts/run-job5.mjs        (SA push)`);
process.exit(0);
