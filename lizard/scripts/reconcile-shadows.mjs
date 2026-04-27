#!/usr/bin/env node
// reconcile-shadows.mjs
// Backfills _state.json job4_progress by scanning task .md files for ✅ shadow stamps.
// Safe to run multiple times (idempotent). Does not reset already-recorded entries.
//
// Usage: node scripts/reconcile-shadows.mjs [--dry-run]

import { readFileSync, writeFileSync, existsSync, renameSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dir = dirname(fileURLToPath(import.meta.url));
const LIZARD = join(__dir, '..');
const STATE_PATH = join(LIZARD, 'scrapes', '_state.json');
const TASKS_DIR = join(LIZARD, 'tasks');

const DRY_RUN = process.argv.includes('--dry-run');

function readState() {
  return JSON.parse(readFileSync(STATE_PATH, 'utf8'));
}

// Parse annotation blocks from a task .md file.
// Returns array of { n, submitted: bool }
function parseAnnotations(mdPath) {
  const text = readFileSync(mdPath, 'utf8');
  const results = [];
  const annotRe = /^## Annotation (\d+)/gm;
  const shadowRe = /\*\*Shadow Task:\*\*\s*(✅ submitted|⬜ not submitted)/;
  let m;
  while ((m = annotRe.exec(text)) !== null) {
    const n = parseInt(m[1], 10);
    const slice = text.slice(m.index, m.index + 500);
    const sm = shadowRe.exec(slice);
    if (sm) {
      results.push({ n, submitted: sm[1].startsWith('✅') });
    }
  }
  return results;
}

const state = readState();
const job3 = state.job3_progress || {};
const job4 = state.job4_progress || {};

let changed = false;

for (const [stem, status] of Object.entries(job3)) {
  if (status !== 'applied') continue;

  const mdPath = join(TASKS_DIR, `${stem}.md`);
  if (!existsSync(mdPath)) continue;

  const annots = parseAnnotations(mdPath);
  if (annots.length === 0) continue;

  const current = (job4[stem] && typeof job4[stem] === 'object') ? { ...job4[stem] } : {};
  let stemChanged = false;

  for (const { n, submitted } of annots) {
    if (!submitted) continue;
    const key = `annotation_${n}`;
    if (current[key] !== 'fired') {
      console.log(`  ${stem} A${n}: → fired`);
      current[key] = 'fired';
      stemChanged = true;
      changed = true;
    }
  }

  if (stemChanged) {
    job4[stem] = current;
  }
}

if (!changed) {
  console.log('No state drift — _state.json already up to date.');
  process.exit(0);
}

state.job4_progress = job4;
state.last_step = 'job4.reconciled';
state.updated_at = new Date().toISOString();

if (DRY_RUN) {
  console.log('\n[DRY RUN] Would write:');
  console.log(JSON.stringify(state, null, 2));
  process.exit(0);
}

const tmp = STATE_PATH + '.tmp';
writeFileSync(tmp, JSON.stringify(state, null, 2) + '\n', 'utf8');
renameSync(tmp, STATE_PATH);
console.log(`\n_state.json updated (last_step: ${state.last_step})`);
