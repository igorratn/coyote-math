#!/usr/bin/env node
// run-job5.mjs — Job 5: SA push (per-stem actor, terminal step).
//
// Pipeline order (post-2026-05-02 swap): 0 → 1 → 2 → 3a → 3b → 4 (HAI shadow)
// → resolution gate → 5 (this) → done.
//
// Reads payloads/shadow_applied/<S>.yaml (Job 4 output). Resolution gate:
// refuses to fire if any annot has verdict_source=auto AND hai_llm_eval≠clean
// AND sidecar igor_resolved!=true. Igor resolves via mark-resolved.mjs (no
// flip) or run-reclaim.mjs (flip + /reclaim shadow).
//
// On finalize: atomic mv payload + sidecar shadow_applied/ → done/, then
// rm queue/<S>.json (pipeline exit gate). Crash between mv and rm leaves an
// orphan queue file; the per-stem self-heal at the top of this script picks
// it up on the next invocation.
//
// Modes:
//   --precheck (default): validate filesystem precondition + resolution gate,
//     parse payload, emit the apply plan + DOM scripts the agent will run via
//     Chrome MCP.
//   --finalize: after agent confirms SA Save toast, atomically mv payload +
//     sidecar to done/ AND rm queue/<S>.json.
//
// SA UI mutation itself (navigate, evaluate_script per annot, click Save) is
// agent-driven via Chrome MCP. DOM mechanics in CLAUDE.md §Job 5 + scripts/sa-apply.js.
//
// Usage:
//   STEM=<stem> node scripts/run-job5.mjs                # default --precheck
//   STEM=<stem> node scripts/run-job5.mjs --precheck     # parse + emit plan
//   STEM=<stem> node scripts/run-job5.mjs --finalize     # post-Save: mv + rm queue
//
// Exit codes:
//   0 = OK
//   1 = IO / parse error
//   2 = precondition violated (payload missing, already done, etc.)
//   3 = finalize failed (mv error)
//   4 = resolution gate engaged (auto-verdict annots have non-clean HAI eval; Igor must resolve)

import { readFileSync, existsSync, renameSync, mkdirSync, unlinkSync } from 'fs';
import { join, resolve, dirname as pathDirname } from 'path';
import { fileURLToPath } from 'url';

const __dir = pathDirname(fileURLToPath(import.meta.url));
const LIZARD_DIR = process.env.LIZARD_DIR ?? resolve(__dir, '..');
const STEM = process.env.STEM;
if (!STEM) {
  console.error('[run-job5] ERROR: STEM env var required');
  process.exit(1);
}

const MODE = process.argv.includes('--finalize') ? 'finalize' : 'precheck';

const SHADOW_APPLIED_DIR = join(LIZARD_DIR, 'payloads', 'shadow_applied');
const PAYLOAD_LIVE       = join(SHADOW_APPLIED_DIR, `${STEM}.yaml`);
const SIDECAR_LIVE       = join(SHADOW_APPLIED_DIR, `${STEM}.shadows.yaml`);
const PAYLOAD_DONE_DIR   = join(LIZARD_DIR, 'payloads', 'done');
const PAYLOAD_DONE       = join(PAYLOAD_DONE_DIR, `${STEM}.yaml`);
const SIDECAR_DONE       = join(PAYLOAD_DONE_DIR, `${STEM}.shadows.yaml`);
const QUEUE_FILE         = join(LIZARD_DIR, 'queue', `${STEM}.json`);

// ---------- per-stem orphan self-heal ----------
// If queue entry exists alongside an already-finalized done payload, this is
// an orphan from a crash between the atomic mv and rm queue/<S>.json — BUT
// only when the current-cycle shadow_applied payload is ABSENT. If
// shadow_applied/ still has the payload, done/ is a prior-cycle artifact
// (cycle 2 case); do NOT treat it as an orphan — fall through to archive it.
if (existsSync(QUEUE_FILE) && existsSync(PAYLOAD_DONE) && !existsSync(PAYLOAD_LIVE)) {
  unlinkSync(QUEUE_FILE);
  console.error(`[run-job5] ${STEM}: orphan queue entry detected (done/ present, no shadow_applied/) — cleaned up`);
  process.exit(0);
}

// ---------- cycle-N archive: prior done/ must be moved out of the way ----------
// When shadow_applied/ has the current-cycle payload AND done/ already has a
// prior-cycle payload, archive done/ → done/<stem>.cycle1.yaml before finalize.
if (existsSync(PAYLOAD_LIVE) && existsSync(PAYLOAD_DONE)) {
  const PAYLOAD_DONE_C1 = join(PAYLOAD_DONE_DIR, `${STEM}.cycle1.yaml`);
  const SIDECAR_DONE_C1 = join(PAYLOAD_DONE_DIR, `${STEM}.cycle1.shadows.yaml`);
  if (existsSync(PAYLOAD_DONE_C1)) {
    console.error(`[run-job5] ERROR: ${PAYLOAD_DONE_C1} already exists — cycle 3 not supported`);
    process.exit(2);
  }
  renameSync(PAYLOAD_DONE, PAYLOAD_DONE_C1);
  if (existsSync(SIDECAR_DONE)) renameSync(SIDECAR_DONE, SIDECAR_DONE_C1);
  console.error(`[run-job5] ${STEM}: prior-cycle done/ archived → *.cycle1.yaml — proceeding`);
}

// ---------- precondition ----------
if (existsSync(PAYLOAD_DONE)) {
  console.error(`[run-job5] REFUSE: ${PAYLOAD_DONE} already exists. Stem is past Job 5 (terminal).`);
  process.exit(2);
}
if (!existsSync(PAYLOAD_LIVE)) {
  console.error(`[run-job5] ERROR: ${PAYLOAD_LIVE} missing. Job 4 (HAI shadow) not done — payload not in shadow_applied/.`);
  process.exit(1);
}
if (!existsSync(SIDECAR_LIVE)) {
  console.error(`[run-job5] ERROR: ${SIDECAR_LIVE} missing. Job 4 finalize incomplete — no sidecar.`);
  process.exit(1);
}
if (!existsSync(QUEUE_FILE)) {
  console.error(`[run-job5] REFUSE: ${QUEUE_FILE} missing. Stem is not in the active-work queue.`);
  process.exit(2);
}

// ---------- resolution gate ----------
// Refuse Job 5 fire if any auto-verdict annot has non-clean HAI LLM eval AND
// sidecar igor_resolved != true. Igor-verdict annots are gate-immune (their
// adjudication at 3a already weighed equivalent reviewer-LLM opinions).
const sidecarTxt = readFileSync(SIDECAR_LIVE, 'utf8');
const sidecar = parseSidecar(sidecarTxt);
const gatedAnnots = sidecar.shadows.filter(s =>
  s.verdict_source === 'auto' && s.hai_llm_eval !== 'clean'
);
if (gatedAnnots.length > 0 && !sidecar.igor_resolved) {
  console.error(`\n[run-job5] ✋ RESOLUTION GATE ENGAGED for ${STEM}.`);
  console.error(`[run-job5] ${gatedAnnots.length} auto-verdict annot(s) with non-clean HAI LLM eval — Igor must resolve before SA push.`);
  for (const a of gatedAnnots) {
    console.error(`[run-job5]   A${a.n}: eval=${a.hai_llm_eval}${a.hai_llm_comment ? ' — ' + a.hai_llm_comment.slice(0, 100) : ''}`);
    console.error(`[run-job5]     proof: tasks/shadows/${a.uuid}.md`);
  }
  console.error(`\n[run-job5] To resolve:`);
  console.error(`[run-job5]   No flip (HAI's warning doesn't change Igor's mind):`);
  console.error(`[run-job5]     STEM=${STEM} node scripts/mark-resolved.mjs`);
  console.error(`[run-job5]   Flip (Igor agrees with HAI's warning, updates answer):`);
  console.error(`[run-job5]     1. Edit tasks/${STEM}.md → append #### Igor Verdict (post-shadow) on affected annot(s)`);
  console.error(`[run-job5]     2. STEM=${STEM} node scripts/run-job3.mjs --force-overwrite   (re-fan payload)`);
  console.error(`[run-job5]        WARNING: --force-overwrite re-writes payloads/<S>.yaml; current shadow_applied payload must be moved out of the way first`);
  console.error(`[run-job5]     3. STEM=${STEM} ANNOT=<n> NEW_ANSWER="<text>" node scripts/run-reclaim.mjs   (per flipped annot)`);
  console.error(`[run-job5]     4. STEM=${STEM} node scripts/mark-resolved.mjs`);
  process.exit(4);
}

// ---------- precheck: parse payload, emit plan ----------
const yaml = readFileSync(PAYLOAD_LIVE, 'utf8');

// Lightweight YAML parsing (we wrote this format ourselves in run-job3.mjs).
const taskId = /^\s*task_id:\s*(\d+)/m.exec(yaml)?.[1];
const stem   = /^\s*stem:\s*(\S+)/m.exec(yaml)?.[1];
if (!taskId || !stem) {
  console.error(`[run-job5] ERROR: payload parse failed (task_id=${taskId} stem=${stem})`);
  process.exit(1);
}
if (stem !== STEM) {
  console.error(`[run-job5] ERROR: payload stem '${stem}' != env STEM '${STEM}'`);
  process.exit(1);
}

const annots = [];
const blocks = yaml.split(/(?=^  - n: \d+\s*$)/m).slice(1);
for (const blk of blocks) {
  const get = (re) => re.exec(blk)?.[1]?.trim();
  const n = parseInt(get(/^  - n:\s*(\d+)/m) ?? 0, 10);
  if (!n) continue;
  const action = get(/^      action:\s*(\S+)/m);
  const rating = get(/^      rating:\s*(\S+)/m);
  const answerFinalRaw = /^      answer_final:\s*(.+)$/m.exec(blk)?.[1]?.trim();
  const answerFinal = (answerFinalRaw === 'null' || !answerFinalRaw) ? null
                    : answerFinalRaw.replace(/^"([\s\S]*)"\s*$/, '$1');
  const feedbackRaw = /^      feedback:\s*(.+)$/m.exec(blk)?.[1]?.trim();
  const feedback = (feedbackRaw === 'null' || !feedbackRaw) ? null
                 : feedbackRaw.replace(/^"([\s\S]*)"\s*$/, '$1').replace(/\\"/g, '"');
  const skillsCheck   = /^      skills_check:\s*\[([^\]]*)\]/m.exec(blk)?.[1].split(',').map(s => s.trim()).filter(Boolean) ?? [];
  const skillsUncheck = /^      skills_uncheck:\s*\[([^\]]*)\]/m.exec(blk)?.[1].split(',').map(s => s.trim()).filter(Boolean) ?? [];
  const qtype = get(/^      qtype:\s*"([^"]+)"/m) ?? get(/^      qtype:\s*(\S+)/m);
  annots.push({ n, action, rating, answerFinal, feedback, skillsCheck, skillsUncheck, qtype });
}

if (!annots.length) {
  console.error('[run-job5] ERROR: no annot entries parsed from payload');
  process.exit(1);
}

if (MODE === 'finalize') {
  // Atomic mv: payload + sidecar shadow_applied/ → done/. Caller (agent) must
  // have confirmed SA Save toast. Then rm queue/<S>.json (pipeline exit gate).
  mkdirSync(PAYLOAD_DONE_DIR, { recursive: true });
  renameSync(PAYLOAD_LIVE, PAYLOAD_DONE);
  renameSync(SIDECAR_LIVE, SIDECAR_DONE);
  // Pipeline exit gate: rm queue/<S>.json — stem leaves active-work set.
  unlinkSync(QUEUE_FILE);
  console.error(`[run-job5] ✓ ${STEM}: payload + sidecar archived → ${PAYLOAD_DONE_DIR}/, queue entry cleared`);
  process.exit(0);
}

// Derive editor URL. SA editor URL pattern: from manifest's editor_url field.
let editorUrl = null;
const manifestPath = join(LIZARD_DIR, 'scrapes', '_manifest.json');
if (existsSync(manifestPath)) {
  const m = JSON.parse(readFileSync(manifestPath, 'utf8'));
  const list = Array.isArray(m) ? m : Object.values(m);
  const entry = list.find(t => (t.stem === STEM) || (t.SA_TASK_FILENAME?.replace(/\.json$/, '') === STEM));
  if (entry?.editor_url) editorUrl = entry.editor_url;
}

// ---------- emit plan ----------
console.log(JSON.stringify({
  stem: STEM,
  task_id: taskId,
  editor_url: editorUrl,
  annot_count: annots.length,
  gate_status: gatedAnnots.length === 0 ? 'clean' : (sidecar.igor_resolved ? 'resolved' : 'engaged'),
  annots: annots.map(a => ({
    n: a.n,
    action: a.action,
    rating: a.rating,
    answer_final: a.answerFinal,
    feedback: a.feedback,
    skills_check: a.skillsCheck,
    skills_uncheck: a.skillsUncheck,
    qtype: a.qtype,
    has_skill_edit: a.skillsCheck.length > 0 || a.skillsUncheck.length > 0,
    has_answer_edit: a.answerFinal !== null,
    has_feedback: a.feedback !== null,
    needs_human_delete: a.action === 'delete',
  })),
  done_path_when_finalized: PAYLOAD_DONE,
}, null, 2));

console.error(`\n[run-job5] ${STEM}: precheck OK — ${annots.length} annot(s) ready to push.`);
console.error(`[run-job5] Gate: ${gatedAnnots.length === 0 ? 'clean' : (sidecar.igor_resolved ? 'resolved (igor_resolved=true)' : 'ENGAGED')}`);
console.error(`[run-job5] Editor URL: ${editorUrl ?? '(missing from manifest — agent must resolve from task_id)'}`);
console.error(`[run-job5] Agent: follow CLAUDE.md §"Job 5 — SA push" to apply via Chrome MCP.`);
console.error(`[run-job5] After SA Save toast, run: STEM=${STEM} node scripts/run-job5.mjs --finalize`);

// ---------- helpers ----------
function parseSidecar(txt) {
  const stem = /^\s*stem:\s*(\S+)/m.exec(txt)?.[1];
  const igorResolvedRaw = /^\s*igor_resolved:\s*(true|false)\s*$/m.exec(txt)?.[1];
  const igorResolved = igorResolvedRaw === 'true';
  const shadows = [];
  const blocks = txt.split(/(?=^  - n: \d+\s*$)/m).slice(1);
  for (const blk of blocks) {
    const get = (re) => re.exec(blk)?.[1]?.trim();
    const n = parseInt(get(/^  - n:\s*(\d+)/m) ?? 0, 10);
    if (!n) continue;
    shadows.push({
      n,
      uuid:            get(/^    uuid:\s*(\S+)/m),
      verdict_source:  get(/^    verdict_source:\s*(\S+)/m) ?? 'auto',
      hai_llm_eval:    get(/^    hai_llm_eval:\s*(\S+)/m) ?? 'clean',
      hai_llm_comment: /^    hai_llm_comment:\s*"([^"]*)"\s*$/m.exec(blk)?.[1] ?? '',
    });
  }
  return { stem, igor_resolved: igorResolved, shadows };
}
