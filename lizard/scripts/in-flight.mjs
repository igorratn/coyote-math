#!/usr/bin/env node
// in-flight.mjs — list active stems (one per file in queue/) with their
// current furthest-reached pipeline stage.
//
// In the queue-as-active-set design: queue/<S>.json exists ⇔ stem in flight.
// Created at intake, deleted at Job 5 finalize. So `ls queue/` IS the
// in-flight list; this script just adds a per-stem stage label.
//
// Usage:
//   node scripts/in-flight.mjs           # human-readable table
//   node scripts/in-flight.mjs --json    # JSON [{stem, stage}, ...]
//   node scripts/in-flight.mjs --stems   # bare stem list (one per line)
//
// Library: import { computeInFlight } from './in-flight.mjs'

import { readdirSync, existsSync, statSync } from 'fs';
import { join } from 'path';

// Stage detection — applied per queued stem in pipeline order. Furthest
// reached wins. Cycle-1 archive files are audit, not stage markers.
//
// Pipeline order (post-2026-05-02 swap):
//   queue → scrape → skeleton → task → payload → shadow_applied (Job 4 done) → done (Job 5 done)
const STAGE_RULES = [
  ['queued',          (D, s) => existsSync(join(D, 'queue',                    `${s}.json`))],
  ['scraped',         (D, s) => existsSync(join(D, 'scrapes',                  `${s}.txt`))],
  ['skeleton',        (D, s) => existsSync(join(D, 'tasks/skeleton',           `${s}.md`))],
  ['task',            (D, s) => existsSync(join(D, 'tasks',                    `${s}.md`))],
  ['payload',         (D, s) => existsSync(join(D, 'payloads',                 `${s}.yaml`))],
  ['shadow_applied',  (D, s) => existsSync(join(D, 'payloads/shadow_applied',  `${s}.yaml`))],
  ['done',            (D, s) => existsSync(join(D, 'payloads/done',            `${s}.yaml`))],
];

function listQueuedStems(LIZARD_DIR) {
  const dir = join(LIZARD_DIR, 'queue');
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter(f => f.endsWith('.json') && !f.startsWith('.'))
    .map(f => f.slice(0, -5))
    .sort();
}

function furthestStage(LIZARD_DIR, stem) {
  let stage = null;
  for (const [name, check] of STAGE_RULES) {
    if (check(LIZARD_DIR, stem)) stage = name;
  }
  return stage || 'unknown';
}

export function computeInFlight(LIZARD_DIR = process.cwd()) {
  return listQueuedStems(LIZARD_DIR).map(stem => ({
    stem,
    stage: furthestStage(LIZARD_DIR, stem),
  }));
}

// CLI
if (import.meta.url === `file://${process.argv[1]}`) {
  const LIZARD_DIR = process.env.LIZARD_DIR || process.cwd();
  const rows = computeInFlight(LIZARD_DIR);

  if (process.argv.includes('--json')) {
    process.stdout.write(JSON.stringify(rows, null, 2) + '\n');
  } else if (process.argv.includes('--stems')) {
    for (const { stem } of rows) console.log(stem);
  } else {
    if (rows.length === 0) {
      console.log('(queue empty — nothing in flight)');
    } else {
      // Order columns by pipeline progression for readability
      const stageOrder = STAGE_RULES.map(r => r[0]);
      rows.sort((a, b) => {
        const r = stageOrder.indexOf(b.stage) - stageOrder.indexOf(a.stage);
        return r !== 0 ? r : a.stem.localeCompare(b.stem);
      });
      const w = Math.max(4, ...rows.map(r => r.stem.length));
      console.log('stage'.padEnd(11) + ' stem');
      console.log('-'.repeat(11) + ' ' + '-'.repeat(w));
      for (const { stem, stage } of rows) {
        console.log(stage.padEnd(11) + ' ' + stem);
      }
      console.log('');
      console.log(`(${rows.length} in flight — queue/ holds ${rows.length} file${rows.length === 1 ? '' : 's'})`);
    }
  }
}
