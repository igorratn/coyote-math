#!/usr/bin/env node
// run-task-skip.mjs — Task-level skip-disposition exit (per-stem actor).
//
// When Igor sets the SA task-level dropdown to a skip-set value (V5 Unusable /
// Skipped, or V6 "Valid Skipped to Hold" / "Valid Skipped to Skipped" / "Valid
// Skip to Unusable"), the task exits the lizard pipeline without writing a
// payload. Per CLAUDE.md (codified 2026-04-30 — Funnel_108): no Job 3b/4/5 fire
// because their preconditions require payload files that are intentionally
// never produced for this stem.
//
// What this actor does:
//   1. Validates DISPOSITION env is in V5 ∪ V6 skip-set.
//   2. Stamps tasks/<S>.md with a top-of-file disposition note (idempotent —
//      refuses to add a second marker; updates the existing one if present).
//   3. Removes queue/<S>.json (atomic).
//
// Idempotent: re-running on a stem whose queue file is already gone exits 0
// with "already skipped" — caller can fire repeatedly without harm.
//
// Usage:
//   STEM=<stem> DISPOSITION="<V5 or V6 dropdown string>" \
//     [LIZARD_DIR=<path>] [REASON="<short reason>"] \
//     node scripts/run-task-skip.mjs
//
// Env:
//   STEM         — stem (required).
//   DISPOSITION  — literal SA dropdown string (required). Must match what Igor
//                  actually set in the SA UI. V5: "Unusable" or "Skipped". V6:
//                  "Valid Skipped to Hold", "Valid Skipped to Skipped", "Valid
//                  Skip to Unusable".
//   REASON       — optional one-line context (e.g. "image too low resolution").
//   LIZARD_DIR   — defaults to ../ relative to this script.
//
// Exit codes:
//   0 = OK (skipped, or already skipped)
//   1 = IO / parse error
//   2 = precondition violated (queue file missing on first run; payload exists;
//       invalid disposition)

import { existsSync, readFileSync, writeFileSync, renameSync, unlinkSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const STEM = process.env.STEM;
if (!STEM) {
  console.error('[run-task-skip] ERROR: STEM env var required'); process.exit(2);
}
const DISPOSITION = process.env.DISPOSITION;
if (!DISPOSITION) {
  console.error('[run-task-skip] ERROR: DISPOSITION env var required'); process.exit(2);
}
const REASON = process.env.REASON ?? '';

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const LIZARD_DIR = process.env.LIZARD_DIR ?? join(SCRIPT_DIR, '..');

// V5 ∪ V6 skip-set. V5 strings come from older SA dropdown; V6 strings per
// Nikhil pinned 2026-04-29 in #lizard-reviewers.
const V5_SKIP = ['Unusable', 'Skipped'];
const V6_SKIP = ['Valid Skipped to Hold', 'Valid Skipped to Skipped', 'Valid Skip to Unusable'];
const SKIP_SET = [...V5_SKIP, ...V6_SKIP];

if (!SKIP_SET.includes(DISPOSITION)) {
  console.error(`[run-task-skip] ERROR: DISPOSITION="${DISPOSITION}" not in skip-set`);
  console.error(`  valid values: ${SKIP_SET.map(s => `"${s}"`).join(', ')}`);
  process.exit(2);
}

const QUEUE_PATH         = join(LIZARD_DIR, 'queue',    `${STEM}.json`);
const TASK_PATH          = join(LIZARD_DIR, 'tasks',    `${STEM}.md`);
const PAYLOAD_PATH       = join(LIZARD_DIR, 'payloads', `${STEM}.yaml`);
const SHADOW_APPLIED_PATH= join(LIZARD_DIR, 'payloads', 'shadow_applied', `${STEM}.yaml`);
const DONE_PATH          = join(LIZARD_DIR, 'payloads', 'done',           `${STEM}.yaml`);

// Idempotency: queue gone AND any of the downstream stages absent → already
// skipped (or stem never existed). Exit 0 silently.
if (!existsSync(QUEUE_PATH)) {
  console.error(`[run-task-skip] ${STEM}: queue file already gone — already skipped (no-op)`);
  process.exit(0);
}

// Refuse if a payload was already produced — that's a different exit path
// (Job 3b → Job 4 → Job 5) and overlapping with task-skip would orphan the
// payload. Caller must clean up first.
for (const p of [PAYLOAD_PATH, SHADOW_APPLIED_PATH, DONE_PATH]) {
  if (existsSync(p)) {
    console.error(`[run-task-skip] ERROR: ${STEM}: payload exists at ${p}`);
    console.error(`  task-skip exit path is for stems with NO payload. Resolve payload first.`);
    process.exit(2);
  }
}

const stamp = `2026-04-30`; // ISO date stamp; bump if needed
const marker = '> **TASK-LEVEL SKIP-DISPOSITION';
const note = `> **TASK-LEVEL SKIP-DISPOSITION (${stamp}):** Igor set SA task-level dropdown to **${DISPOSITION}**.${REASON ? ` ${REASON}` : ''} Per-annot review does not apply: no payload written, no Job 3b/4/5 fire (their preconditions require \`payloads/<S>.yaml\`, which is intentionally never produced for this stem). Queue entry removed by \`scripts/run-task-skip.mjs\`. Reviewer bodies (if present below) are retained as audit trail only — verdicts are superseded by the task-level skip.\n\n`;

// Stamp tasks/<S>.md (if present). If the file doesn't exist (rare — e.g.
// queue intake done but Job 1 never ran), skip the stamp; queue removal alone
// is sufficient to exit the pipeline.
if (existsSync(TASK_PATH)) {
  const txt = readFileSync(TASK_PATH, 'utf8');
  let newTxt;
  if (txt.includes(marker)) {
    // Replace existing marker block (idempotent update).
    newTxt = txt.replace(/^> \*\*TASK-LEVEL SKIP-DISPOSITION[\s\S]*?\n\n/m, note);
    console.error(`[run-task-skip] ${STEM}: updated existing skip marker in tasks/<S>.md`);
  } else {
    // Insert after the H1 line.
    const lines = txt.split('\n');
    const h1Idx = lines.findIndex(l => /^# /.test(l));
    if (h1Idx === -1) {
      // No H1 — prepend.
      newTxt = note + txt;
    } else {
      // Insert after H1 + blank line.
      const before = lines.slice(0, h1Idx + 1).join('\n');
      const after  = lines.slice(h1Idx + 1).join('\n');
      newTxt = `${before}\n\n${note}${after.startsWith('\n') ? after.slice(1) : after}`;
    }
    console.error(`[run-task-skip] ${STEM}: stamped skip marker into tasks/<S>.md`);
  }
  // Atomic write.
  const tmp = TASK_PATH + '.tmp';
  writeFileSync(tmp, newTxt, 'utf8');
  renameSync(tmp, TASK_PATH);
} else {
  console.error(`[run-task-skip] ${STEM}: tasks/<S>.md absent — skipping stamp (queue removal alone exits pipeline)`);
}

// Remove queue file. This is the pipeline-wide exit gate per CLAUDE.md.
unlinkSync(QUEUE_PATH);
console.error(`[run-task-skip] ${STEM}: removed ${QUEUE_PATH}`);
console.error(`[run-task-skip] ${STEM}: exited pipeline with disposition "${DISPOSITION}"`);
process.exit(0);
