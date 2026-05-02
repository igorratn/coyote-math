#!/usr/bin/env node
// queue-intake.mjs — Job 0 inbound: write queue/<stem>.json files for stems
// Igor wants Job 0 to scrape next.
//
// Replaces the manifest freeze. No batch concept — Igor can run this as often
// as he wants; queue/ accumulates pending intake. Job 0 actor drains it.
//
// Usage:
//   # pipe filtered SA queue rows in (output of filter-queue-rows.mjs):
//   cat rows.json | node scripts/queue-intake.mjs            # interactive picker
//   cat rows.json | node scripts/queue-intake.mjs --all      # queue every row
//   cat rows.json | node scripts/queue-intake.mjs --pick 1,3,5
//
// Input row shape: { stem, name, category, editor_url, status }  (matches the
// shape filter-queue-rows.mjs already emits and what was previously written
// into the manifest).
//
// Per-row output written to queue/<stem>.json (atomic .tmp → rename). Refuses
// to overwrite an existing queue file unless --force.

import { writeFileSync, existsSync, mkdirSync, renameSync, readdirSync } from 'fs';
import { join } from 'path';
import readline from 'readline';

const LIZARD_DIR = process.env.LIZARD_DIR || process.cwd();
const QUEUE_DIR = join(LIZARD_DIR, 'queue');
const SCRAPES_DIR = join(LIZARD_DIR, 'scrapes');
const TASKS_DIR = join(LIZARD_DIR, 'tasks');

function readStdin() {
  return new Promise((resolve, reject) => {
    let raw = '';
    process.stdin.setEncoding('utf8');
    process.stdin.on('data', c => { raw += c; });
    process.stdin.on('end', () => resolve(raw));
    process.stdin.on('error', reject);
  });
}

function ask(q) {
  return new Promise(resolve => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    rl.question(q, ans => { rl.close(); resolve(ans); });
  });
}

function parsePickArg(arg) {
  return new Set(
    arg.split(',').map(s => s.trim()).filter(Boolean).map(s => parseInt(s, 10) - 1)
  );
}

function writeQueueFile(row, force) {
  if (!existsSync(QUEUE_DIR)) mkdirSync(QUEUE_DIR, { recursive: true });
  const path = join(QUEUE_DIR, `${row.stem}.json`);
  if (existsSync(path) && !force) {
    return { stem: row.stem, status: 'skip-exists' };
  }
  const scrapePath = join(SCRAPES_DIR, `${row.stem}.txt`);
  const isCycle2 = existsSync(join(TASKS_DIR, `${row.stem}.md`));
  const reScrape = existsSync(scrapePath);
  const tmp = path + '.tmp';
  writeFileSync(tmp, JSON.stringify(row, null, 2) + '\n');
  renameSync(tmp, path);
  const status = isCycle2 ? 'queued-cycle2' : reScrape ? 'queued-rescrape' : 'queued';
  return { stem: row.stem, status };
}

(async () => {
  const args = process.argv.slice(2);
  const force = args.includes('--force');
  const all = args.includes('--all');
  const pickIdx = args.indexOf('--pick');
  const pickSet = pickIdx >= 0 ? parsePickArg(args[pickIdx + 1] || '') : null;

  const raw = await readStdin();
  let rows;
  try { rows = JSON.parse(raw); }
  catch (e) {
    console.error(`[queue-intake] stdin must be JSON array of rows: ${e.message}`);
    process.exit(2);
  }
  if (!Array.isArray(rows) || rows.length === 0) {
    console.error('[queue-intake] no rows on stdin');
    process.exit(1);
  }

  let chosen;
  if (all) {
    chosen = rows;
  } else if (pickSet) {
    chosen = rows.filter((_, i) => pickSet.has(i));
  } else {
    // interactive picker
    console.log(`\n${rows.length} candidate row(s):\n`);
    rows.forEach((r, i) => {
      const isCycle2 = existsSync(join(TASKS_DIR, `${r.stem}.md`));
      const cycle2Tag = isCycle2 ? '  ⚠️  [CYCLE 2 RETURN]' : '';
      const catTag = r.category && r.category !== '-' ? `  [${r.category}]` : '';
      console.log(`  [${i + 1}] ${r.stem}${cycle2Tag}${catTag}`);
    });
    console.log('');
    const ans = await ask('queue which? (e.g. 1,3,5  or "all"  or empty to abort): ');
    const trimmed = ans.trim();
    if (!trimmed) { console.log('aborted.'); process.exit(0); }
    if (trimmed.toLowerCase() === 'all') chosen = rows;
    else {
      const idx = parsePickArg(trimmed);
      chosen = rows.filter((_, i) => idx.has(i));
    }
  }

  if (chosen.length === 0) {
    console.error('[queue-intake] nothing selected');
    process.exit(1);
  }

  const results = chosen.map(r => writeQueueFile(r, force));
  const counts = results.reduce((m, r) => (m[r.status] = (m[r.status] || 0) + 1, m), {});
  console.log('');
  for (const r of results) {
    console.log(`  ${r.status.padEnd(16)} queue/${r.stem}.json`);
  }
  console.log('');
  console.log('summary: ' + Object.entries(counts).map(([k, v]) => `${k}=${v}`).join('  '));
})();
