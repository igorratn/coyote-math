#!/usr/bin/env node
// run-job4.mjs — Job 4: SA push (per-stem actor).
//
// Job 4 has two responsibilities, split across modes:
//   --precheck (default): validate filesystem precondition, parse payload,
//     emit the apply plan + DOM scripts the agent will run via Chrome MCP.
//   --finalize: after agent confirms SA Save toast, atomically move the
//     payload to payloads/sa_applied/. This is the binary state-flip:
//     payload in payloads/ → not applied; in sa_applied/ → applied.
//
// SA UI mutation itself (navigate, evaluate_script per annot, click Save)
// is agent-driven via Chrome MCP. The DOM mechanics are documented in
// CLAUDE.md §"Apply execution model" (ported from HOST_SOP.legacy.md §818-851).
//
// Usage:
//   STEM=<stem> node scripts/run-job4.mjs                # default --precheck
//   STEM=<stem> node scripts/run-job4.mjs --precheck     # parse + emit plan
//   STEM=<stem> node scripts/run-job4.mjs --finalize     # post-Save: mv payload
//
// Exit codes:
//   0 = OK
//   1 = IO / parse error
//   2 = precondition violated (payload missing, already applied, etc.)
//   3 = finalize failed (mv error)

import { readFileSync, existsSync, renameSync, mkdirSync } from 'fs';
import { join, resolve, dirname as pathDirname } from 'path';
import { fileURLToPath } from 'url';

const __dir = pathDirname(fileURLToPath(import.meta.url));
const LIZARD_DIR = process.env.LIZARD_DIR ?? resolve(__dir, '..');
const STEM = process.env.STEM;
if (!STEM) {
  console.error('[run-job4] ERROR: STEM env var required');
  process.exit(1);
}

const MODE = process.argv.includes('--finalize') ? 'finalize' : 'precheck';

const PAYLOAD_LIVE     = join(LIZARD_DIR, 'payloads', `${STEM}.yaml`);
const PAYLOAD_APPLIED_DIR = join(LIZARD_DIR, 'payloads', 'sa_applied');
const PAYLOAD_APPLIED  = join(PAYLOAD_APPLIED_DIR, `${STEM}.yaml`);

// ---------- precondition ----------
if (existsSync(PAYLOAD_APPLIED)) {
  console.error(`[run-job4] REFUSE: ${PAYLOAD_APPLIED} already exists. Stem is past Job 4 (binary write-once gate).`);
  process.exit(2);
}
if (!existsSync(PAYLOAD_LIVE)) {
  console.error(`[run-job4] ERROR: ${PAYLOAD_LIVE} missing. Job 3b not done (payload not fanned out).`);
  process.exit(1);
}

if (MODE === 'finalize') {
  // Atomic move: live → sa_applied/. Caller (agent) must have confirmed Save toast.
  mkdirSync(PAYLOAD_APPLIED_DIR, { recursive: true });
  renameSync(PAYLOAD_LIVE, PAYLOAD_APPLIED);
  console.error(`[run-job4] ✓ ${STEM}: payload archived → ${PAYLOAD_APPLIED}`);
  process.exit(0);
}

// ---------- precheck: parse payload, emit plan ----------
const yaml = readFileSync(PAYLOAD_LIVE, 'utf8');

// Lightweight YAML parsing (we wrote this format ourselves in run-job3.mjs).
const taskId = /^\s*task_id:\s*(\d+)/m.exec(yaml)?.[1];
const stem   = /^\s*stem:\s*(\S+)/m.exec(yaml)?.[1];
if (!taskId || !stem) {
  console.error(`[run-job4] ERROR: payload parse failed (task_id=${taskId} stem=${stem})`);
  process.exit(1);
}
if (stem !== STEM) {
  console.error(`[run-job4] ERROR: payload stem '${stem}' != env STEM '${STEM}'`);
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
  console.error('[run-job4] ERROR: no annot entries parsed from payload');
  process.exit(1);
}

// Derive editor URL. SA editor URL pattern: from manifest's editor_url field.
// Cycle-2 stems still use the same task_id / editor URL.
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
  applied_path_when_done: PAYLOAD_APPLIED,
}, null, 2));

console.error(`\n[run-job4] ${STEM}: precheck OK — ${annots.length} annot(s) ready to push.`);
console.error(`[run-job4] Editor URL: ${editorUrl ?? '(missing from manifest — agent must resolve from task_id)'}`);
console.error(`[run-job4] Agent: follow CLAUDE.md §"Job 4 — SA push" to apply via Chrome MCP.`);
console.error(`[run-job4] After SA Save toast, run: STEM=${STEM} node scripts/run-job4.mjs --finalize`);
