#!/usr/bin/env node
// job2-prefilter.mjs
// CLI wrapper around scripts/job2-prefilter-rules.mjs. Reads STEM env var,
// loads tasks/skeleton/<stem>.md, runs prefilterSkeleton, writes JSON to OUT.
//
// All rule definitions live in job2-prefilter-rules.mjs (importable from tests).
//
// Flags are HINTS to the merger — they do NOT auto-reject on their own
// (FN-dominant cost model: never reject without reviewer confirmation).
// If a flag triggers AND a reviewer also flags the same issue → confirm.
// If a flag triggers but all reviewers approve → escalate to Igor, don't reject.
//
// Usage:
//   STEM=<stem> [LIZARD_DIR=<path>] [OUT=<path>] node scripts/job2-prefilter.mjs

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { resolve, join, dirname as pathDirname } from 'path';
import { fileURLToPath } from 'url';
import { prefilterSkeleton } from './job2-prefilter-rules.mjs';

const __dir = pathDirname(fileURLToPath(import.meta.url));
const LIZARD_DIR = process.env.LIZARD_DIR ?? resolve(__dir, '..');
const STEM = process.env.STEM;
if (!STEM) { console.error('ERROR: STEM env var required'); process.exit(1); }

const skeletonPath = join(LIZARD_DIR, 'tasks', 'skeleton', `${STEM}.md`);
const OUT = process.env.OUT ?? join('/tmp/lizard', STEM, 'prefilter.json');

if (!existsSync(skeletonPath)) {
  console.error(`[job2-prefilter] ERROR: skeleton not found — run Job 0+1 first`);
  console.error(`  expected: ${skeletonPath}`);
  process.exit(2);
}
const skeleton = readFileSync(skeletonPath, 'utf8');

const annotations = prefilterSkeleton(skeleton);
const result = {
  stem: STEM,
  generated_at: new Date().toISOString(),
  annotations,
};

const summary = {
  total: result.annotations.length,
  skipped_unchanged: result.annotations.filter(a => a.skip_review).length,
  any_hard_flag: result.annotations.filter(a => a.flags.some(f => f.severity === 'hard')).length,
  any_soft_flag: result.annotations.filter(a => a.flags.some(f => f.severity === 'soft')).length,
};
result.summary = summary;

mkdirSync(pathDirname(OUT), { recursive: true });
writeFileSync(OUT, JSON.stringify(result, null, 2), 'utf8');

console.error(`[job2-prefilter] ${STEM}: ${summary.total} annots, ${summary.skipped_unchanged} skip(unchanged), ${summary.any_hard_flag} hard flag(s), ${summary.any_soft_flag} soft flag(s)`);
for (const a of result.annotations) {
  if (!a.flags.length) continue;
  const codes = a.flags.map(f => `${f.severity[0]}:${f.code}`).join(' ');
  console.error(`  A${a.n} [${a.status}]: ${codes}`);
}
console.error(`[job2-prefilter] wrote: ${OUT}`);
process.stdout.write(JSON.stringify(result, null, 2));
