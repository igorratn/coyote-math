#!/usr/bin/env node
// pick-newest-scrape.mjs
// Job 0 helper: picks the newest `sa-scrape-<task_id>*.txt` file from a directory
// by mtime. Browser-added `(1)`, `(2)` suffixes on re-download mean the
// un-suffixed file is often stale — never assume name, always pick newest.
//
// Usage:
//   TASK_ID=187109779 node scripts/pick-newest-scrape.mjs
//   TASK_ID=187109779 DIR=/path/to/dir node scripts/pick-newest-scrape.mjs
//
// Env:
//   TASK_ID — required, numeric SA task id
//   DIR     — directory to scan; default ~/Downloads
//
// Exit codes:
//   0 — found, prints absolute path on stdout
//   1 — no matches (callers can branch on this; treat as Job 0 hard fail)
//   2 — bad input (missing TASK_ID)

import { readdirSync, statSync } from 'fs';
import { join } from 'path';
import { homedir } from 'os';

const TASK_ID = process.env.TASK_ID;
const DIR = process.env.DIR || join(homedir(), 'Downloads');

if (!TASK_ID) {
  console.error('ERROR: TASK_ID env var required');
  process.exit(2);
}

// Match: sa-scrape-<task_id> followed by anything ending in .txt
// e.g. sa-scrape-187109779.txt, sa-scrape-187109779 (1).txt, sa-scrape-187109779-foo.txt
const re = new RegExp(`^sa-scrape-${TASK_ID}.*\\.txt$`);

let entries;
try {
  entries = readdirSync(DIR).filter(f => re.test(f));
} catch (e) {
  console.error(`ERROR: could not read ${DIR}: ${e.message}`);
  process.exit(1);
}

if (entries.length === 0) {
  console.error(`ERROR: no files matching sa-scrape-${TASK_ID}*.txt in ${DIR}`);
  process.exit(1);
}

const ranked = entries
  .map(f => ({ f, mtime: statSync(join(DIR, f)).mtimeMs }))
  .sort((a, b) => b.mtime - a.mtime);

if (entries.length > 1) {
  console.error(`[pick-newest-scrape] ${entries.length} candidates; picked newest by mtime:`);
  for (const r of ranked) {
    console.error(`  ${new Date(r.mtime).toISOString()}  ${r.f}`);
  }
}

console.log(join(DIR, ranked[0].f));
