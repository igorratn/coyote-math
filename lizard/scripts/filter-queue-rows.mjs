#!/usr/bin/env node
// filter-queue-rows.mjs
// Job 0 helper: filter SA queue rows down to the set eligible for the regular
// review pipeline. Rule (simplified 2026-04-27): exclude rows where
// `category === 'return_to_QC_by_NV'`. Those go through the separate Job NV
// rebuttal flow (see HOST_SOP §"Job NV"), not the regular batch.
//
// SA's status filter (`status=6` = In QC) already excludes terminal statuses
// (QC_Complete, Skipped, Unusable) at the URL level — no client-side filter
// for those. We only need to peel off NV returns here.
//
// Usage:
//   node scripts/filter-queue-rows.mjs < input.json > output.json
//   echo '<json>' | node scripts/filter-queue-rows.mjs
//
// Input: JSON array of row objects, each with at least `{ stem, category }`.
// Output: JSON array of rows, same shape, with `return_to_QC_by_NV` rows removed.
//
// Library mode: `import { filterQueueRows } from './filter-queue-rows.mjs'`.

const NV_CATEGORY = 'return_to_QC_by_NV';

export function filterQueueRows(rows) {
  if (!Array.isArray(rows)) {
    throw new Error('filter-queue-rows: input must be an array');
  }
  return rows.filter(r => r && r.category !== NV_CATEGORY);
}

// CLI entry point — only when invoked directly, not on import.
if (import.meta.url === `file://${process.argv[1]}`) {
  let raw = '';
  process.stdin.setEncoding('utf8');
  process.stdin.on('data', chunk => { raw += chunk; });
  process.stdin.on('end', () => {
    let rows;
    try { rows = JSON.parse(raw); }
    catch (e) {
      console.error(`ERROR: stdin must be valid JSON: ${e.message}`);
      process.exit(2);
    }
    let out;
    try { out = filterQueueRows(rows); }
    catch (e) { console.error(`ERROR: ${e.message}`); process.exit(2); }
    process.stdout.write(JSON.stringify(out, null, 2) + '\n');
    const removed = rows.length - out.length;
    if (removed > 0) {
      console.error(`[filter-queue-rows] excluded ${removed} ${NV_CATEGORY} row(s); kept ${out.length}/${rows.length}`);
    }
  });
}
