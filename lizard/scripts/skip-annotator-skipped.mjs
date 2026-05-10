#!/usr/bin/env node
// skip-annotator-skipped.mjs — Annotator_Skipped (SA status=4) handler.
//
// Per Nikhil D. (HAI) pinned ruling 2:53PM in #lizard-reviewers (handshakeai-
// community.slack.com C0ANPTSDQ81): when an annotator skipped an image, the
// reviewer DOES NOT add new annotations. Move the task to one of three
// dispositions based on image suitability:
//
//   "Valid Skipped to Hold"    — image issue (blurry / unusable per playbook)
//   "Valid Skipped to Skipped" — useable image; SA will reassign to another annotator
//   "Valid Skip to Unusable"   — toxic content
//
// This script is a one-shot wrapper around `run-task-skip.mjs` for status=4
// stems that haven't been queued yet. It writes a minimal queue file then
// invokes run-task-skip.mjs to set the disposition + remove the queue file.
//
// Usage:
//   STEM=<stem> TASK_ID=<numeric_sa_task_id> \
//     DISPOSITION="Valid Skipped to Hold|Skipped|Unusable" \
//     [REASON="<short reason>"] \
//     [PROJECT_ID=290044] \
//     node scripts/skip-annotator-skipped.mjs
//
// Env:
//   STEM         — stem (required).
//   TASK_ID      — numeric SA task id (required).
//   DISPOSITION  — one of the three V6 skip strings above (required).
//   REASON       — optional one-line context for the audit stamp.
//   PROJECT_ID   — defaults to 290044 (V6).
//
// Exit codes:
//   0 = OK (skipped, or already skipped)
//   2 = bad input

import { existsSync, writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const STEM = process.env.STEM;
const TASK_ID = process.env.TASK_ID;
const DISPOSITION = process.env.DISPOSITION;
const REASON = process.env.REASON ?? '';
const PROJECT_ID = process.env.PROJECT_ID ?? '290044';

if (!STEM)        { console.error('[skip-annotator-skipped] ERROR: STEM env required'); process.exit(2); }
if (!TASK_ID)     { console.error('[skip-annotator-skipped] ERROR: TASK_ID env required'); process.exit(2); }
if (!DISPOSITION) { console.error('[skip-annotator-skipped] ERROR: DISPOSITION env required'); process.exit(2); }

const VALID = [
  'Valid Skipped to Hold', 'Valid Skipped to Skipped',
  'Valid Skip to Hold',    'Valid Skip to Skipped',
  'Valid Skip to Unusable',
];
if (!VALID.includes(DISPOSITION)) {
  console.error(`[skip-annotator-skipped] ERROR: DISPOSITION="${DISPOSITION}" not valid`);
  console.error(`  valid: ${VALID.map(s => `"${s}"`).join(', ')}`);
  process.exit(2);
}

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const LIZARD_DIR = process.env.LIZARD_DIR ?? join(SCRIPT_DIR, '..');
const QUEUE_PATH = join(LIZARD_DIR, 'queue', `${STEM}.json`);

if (!existsSync(dirname(QUEUE_PATH))) mkdirSync(dirname(QUEUE_PATH), { recursive: true });

if (!existsSync(QUEUE_PATH)) {
  // Write minimal queue file. category="annotator_skipped" so downstream tools
  // (and humans) can distinguish from the normal review path.
  const editorUrl = `https://app.superannotate.com/editor/35245/${PROJECT_ID}/${TASK_ID}?imageId=${TASK_ID}&imageName=${STEM}.json&status=4&sort=name&direction=asc`;
  const row = {
    stem: STEM,
    name: `${STEM}.json`,
    category: 'annotator_skipped',
    editor_url: editorUrl,
    status: '4',
  };
  writeFileSync(QUEUE_PATH + '.tmp', JSON.stringify(row));
  execSync(`mv "${QUEUE_PATH}.tmp" "${QUEUE_PATH}"`);
  console.log(`[skip-annotator-skipped] ${STEM}: queue file written → ${QUEUE_PATH}`);
} else {
  console.log(`[skip-annotator-skipped] ${STEM}: queue file already exists, reusing`);
}

// Hand off to run-task-skip.mjs (handles stamping + queue removal).
const env = { ...process.env, STEM, DISPOSITION, REASON };
try {
  execSync(`node "${join(SCRIPT_DIR, 'run-task-skip.mjs')}"`, { stdio: 'inherit', env });
} catch (e) {
  console.error(`[skip-annotator-skipped] ${STEM}: run-task-skip.mjs failed (exit ${e.status})`);
  process.exit(e.status || 1);
}

// Write audit record file so Job 5 summary / reports can enumerate skip dispositions.
// Filename is `<STEM>.skipped.yaml` — distinct from `<STEM>.yaml` (regular payload)
// so existing readers ignore it; new readers grep for `.skipped.yaml`.
const DONE_DIR = join(LIZARD_DIR, 'payloads', 'done');
if (!existsSync(DONE_DIR)) mkdirSync(DONE_DIR, { recursive: true });
const SKIPPED_PATH = join(DONE_DIR, `${STEM}.skipped.yaml`);
const stamp = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Los_Angeles' }).format(new Date());
const yamlContent = [
  `stem: ${STEM}`,
  `task_id: ${TASK_ID}`,
  `project_id: ${PROJECT_ID}`,
  `disposition: "${DISPOSITION}"`,
  `reason: ${REASON ? `"${REASON.replace(/"/g, '\\"')}"` : 'null'}`,
  `applied_at: ${stamp}`,
  `kind: annotator_skipped_passthrough`,
  ``,
].join('\n');
writeFileSync(SKIPPED_PATH + '.tmp', yamlContent);
execSync(`mv "${SKIPPED_PATH}.tmp" "${SKIPPED_PATH}"`);
console.log(`[skip-annotator-skipped] ${STEM}: audit record written → ${SKIPPED_PATH}`);
console.log(`[skip-annotator-skipped] ${STEM}: disposition "${DISPOSITION}" applied. Set the SA task QC dropdown manually.`);
