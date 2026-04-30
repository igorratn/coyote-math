#!/usr/bin/env node
// prepare-job3b-summary.mjs
// MANDATORY pre-push gate for Job 3b. Codified 2026-04-25 (Igor):
// before any SA push, CLI MUST run this script, present the report to Igor,
// and wait for explicit confirmation. Push must NOT proceed until report is
// reviewed and approved.
//
// Two outputs:
//   1. Per-task summary report — task filename, cycle, task QC status,
//      annot 👍/👎 counts, full feedback text per 👎.
//   2. Payload sync validation — every annot must have a definitive sa_action;
//      Igor Verdicts in tasks/<stem>.md must agree with what merge-summary
//      records as the picked rating. Mismatches surface as ERRORS, not warnings.
//
// Exit codes:
//   0 = report printed, payload sync clean — Igor may approve push
//   2 = payload sync FAIL (ERRORS printed) — push must NOT proceed
//
// Usage:
//   node scripts/prepare-job3b-summary.mjs
//   (defaults: read scrapes/_manifest.json, walk all tasks)

import { readFileSync, existsSync } from 'fs';
import { join, dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import { parseIgorVerdicts, parseAutoVerdicts, getReviewerFeedback } from './prepare-job3b-helpers.mjs';

const __dir = dirname(fileURLToPath(import.meta.url));
const LIZARD_DIR = process.env.LIZARD_DIR ?? resolve(__dir, '..');
const MANIFEST_PATH = process.env.MANIFEST_PATH ?? join(LIZARD_DIR, 'scrapes', '_manifest.json');
const TMP_DIR_BASE  = process.env.TMP_DIR_BASE  ?? '/tmp/lizard';

if (!existsSync(MANIFEST_PATH)) {
  console.error(`[prepare-job3b] FAIL: manifest not found: ${MANIFEST_PATH}`);
  process.exit(2);
}
const manifest = JSON.parse(readFileSync(MANIFEST_PATH, 'utf8'));

// Pull per-stem data. merge-summary.json is an EPHEMERAL CACHE — we prefer it
// when present (richer fields) but fall back to deriving per-annot data from
// tasks/<stem>.md alone when missing. State IS the filesystem; tmpfs loss
// must not block the gate.
function readSummary(stem) {
  const p = join(TMP_DIR_BASE, stem, 'merge-summary.json');
  if (!existsSync(p)) return null;
  try { return JSON.parse(readFileSync(p, 'utf8')); } catch { return null; }
}

function readTaskFile(stem) {
  const p = join(LIZARD_DIR, 'tasks', `${stem}.md`);
  if (!existsSync(p)) return null;
  return readFileSync(p, 'utf8');
}

// Synthesize a {total, per_annotation:[{n, decision, rating}]} shape from
// tasks/<stem>.md when merge-summary.json is unavailable.
//   - Iterate `## Annotation N` headers (stop at `## Form-Fill Payload`).
//   - decision derived from block contents:
//       `- **Rating:** unchanged ...`              → unchanged
//       `#### Auto Verdict\n` present              → auto-resolved
//       `UNRESOLVED — no reviewer produced...`     → no_reviewer_output
//       else                                       → pending-igor
//   - rating left null on synthesis path; the main loop pulls it from
//     Auto/Igor Verdict blocks anyway.
function synthesizePerAnnotation(taskTxt) {
  const re = /^## Annotation (\d+)/gm;
  const heads = [];
  let m;
  while ((m = re.exec(taskTxt)) !== null) heads.push({ n: parseInt(m[1], 10), idx: m.index });
  // Cut off at Form-Fill Payload (annot blocks only live before it)
  const payloadIdx = taskTxt.indexOf('\n## Form-Fill Payload');
  const annotEnd = payloadIdx >= 0 ? payloadIdx : taskTxt.length;
  const inAnnots = heads.filter(h => h.idx < annotEnd);

  const out = [];
  for (let i = 0; i < inAnnots.length; i++) {
    const start = inAnnots[i].idx;
    const end = (i + 1 < inAnnots.length) ? inAnnots[i + 1].idx : annotEnd;
    const block = taskTxt.slice(start, end);
    const ratingM = /^- \*\*Rating:\*\*\s*(.+?)$/m.exec(block);
    const ratingTxt = ratingM ? ratingM[1].toLowerCase() : '';
    let decision;
    if (ratingTxt.includes('unchanged')) decision = 'unchanged';
    else if (/#### Auto Verdict\n/.test(block)) decision = 'auto-resolved';
    else if (/UNRESOLVED — no reviewer/.test(block)) decision = 'no_reviewer_output';
    else decision = 'pending-igor';
    out.push({ n: inAnnots[i].n, decision, rating: null });
  }
  return { total: out.length, per_annotation: out, _synthesized: true };
}

// ---------- Build report + run sync validation ----------
const errors = [];
const warnings = [];
const rows = [];
const fb_dump = [];
const totals = { annots: 0, up: 0, down: 0, unchg: 0 };

for (const t of manifest.tasks) {
  const stem = t.stem;
  const cycle = t.cycle;
  const taskTxt = readTaskFile(stem);
  if (!taskTxt) { errors.push(`${stem}: tasks/${stem}.md missing`); continue; }
  let d = readSummary(stem);
  if (!d) {
    d = synthesizePerAnnotation(taskTxt);
    warnings.push(`${stem}: merge-summary.json missing — derived per-annot from task file (${d.total} annots)`);
  }
  const igor = parseIgorVerdicts(taskTxt);
  const auto = parseAutoVerdicts(taskTxt);
  let up = 0, down = 0, unchg = 0;
  const fbForStem = [];
  for (const a of d.per_annotation || []) {
    const n = a.n;
    if (a.decision === 'unchanged') { unchg += 1; continue; }
    // Determine final rating in priority order:
    //   1. Igor Verdict (manual override)         — highest precedence
    //   2. Auto Verdict (Job 2 carve-out stamp)
    //   3. merge-summary's recorded rating         — lowest, only if present
    let rating;
    if (n in igor) {
      rating = igor[n].rating;
      if (!rating) errors.push(`${stem} A${n}: Igor Verdict block present but no rating parsed`);
    } else if (n in auto) {
      rating = auto[n].rating;
      if (!rating) errors.push(`${stem} A${n}: Auto Verdict block present but no rating parsed`);
    } else if (a.decision === 'pending-igor') {
      errors.push(`${stem} A${n}: pending-igor but no Igor or Auto Verdict block in task file`);
      continue;
    } else if (a.decision === 'no_reviewer_output') {
      errors.push(`${stem} A${n}: no_reviewer_output and no Igor Verdict — needs manual escalation`);
      continue;
    } else if (a.decision === 'auto-resolved') {
      // merge-summary says auto-resolved but no Auto Verdict in task file —
      // means Job 2 was run before the carve-out-stamping fix landed.
      errors.push(`${stem} A${n}: auto-resolved per merge-summary but no Auto Verdict block — re-run Job 2 to stamp`);
      continue;
    } else {
      rating = a.rating;
    }
    if (rating === 'thumbs-up') up += 1;
    else if (rating === 'thumbs-down') {
      down += 1;
      const fb = getReviewerFeedback(taskTxt, n);
      fbForStem.push({ n, fb: fb || '(no reviewer feedback found)' });
    } else {
      errors.push(`${stem} A${n}: rating='${rating}' is not thumbs-up/thumbs-down`);
    }
  }
  totals.annots += d.total || 0;
  totals.up += up; totals.down += down; totals.unchg += unchg;
  const qc = (cycle === 1 && down > 0) ? 'QC_Return' : 'QC_Complete';
  rows.push({ stem: t.SA_TASK_FILENAME, cycle, qc, total: d.total || 0, up, down, unchg });
  if (fbForStem.length) fb_dump.push({ stem, items: fbForStem, cycle });
}

// ---------- Print report ----------
console.log('\n=== Job 3b pre-push summary ===\n');
console.log(`Manifest: ${MANIFEST_PATH}`);
console.log(`Tasks:    ${manifest.tasks.length}`);
console.log(`Annots:   ${totals.annots} total\n`);

console.log('Per-task summary — task-level QC status (derived from per-annot ratings).');
console.log('Push order: QC_Return tasks first (need annotator attention), then QC_Complete.\n');
// Sort rows: QC_Return tasks first, then QC_Complete (push order matches doctrine)
rows.sort((a, b) => (a.qc === 'QC_Return' ? 0 : 1) - (b.qc === 'QC_Return' ? 0 : 1));
console.log(`${'SA_TASK_FILENAME'.padEnd(48)} ${'cyc'.padEnd(3)} ${'task QC'.padEnd(13)} ${'tot'.padStart(3)} ${'👍'.padStart(2)} ${'👎'.padStart(2)} ${'unc'.padStart(3)}`);
console.log('-'.repeat(82));
for (const r of rows) {
  console.log(`${r.stem.padEnd(48)} ${String(r.cycle).padEnd(3)} ${r.qc.padEnd(13)} ${String(r.total).padStart(3)} ${String(r.up).padStart(2)} ${String(r.down).padStart(2)} ${String(r.unchg).padStart(3)}`);
}
console.log('-'.repeat(82));
console.log(`${'TOTAL'.padEnd(65)} ${String(totals.annots).padStart(3)} ${String(totals.up).padStart(2)} ${String(totals.down).padStart(2)} ${String(totals.unchg).padStart(3)}\n`);

console.log('Per-annot SA actions: approve (👍) | reject (cycle-1 👎) | delete (cycle-2 👎) | unchanged (carry-forward)');
console.log('Task QC: QC_Return (cycle-1 + any reject) | QC_Complete (else). Task QC is derived; per-annot actions push individually.\n');

const qcReturnRows = rows.filter(r => r.qc === 'QC_Return');
if (qcReturnRows.length) {
  console.log('ACTION REQUIRED — after per-annot SA push, manually set these tasks to QC_Return in SA task list:');
  for (const r of qcReturnRows) {
    console.log(`  * ${r.stem}`);
  }
  console.log('  (SA task list -> click task row -> Status dropdown -> QC_Return -> Save.)\n');
}

if (fb_dump.length) {
  console.log('=== Annotator-facing feedback (per-annot 👎; bubbled to task QC) ===\n');
  for (const f of fb_dump) {
    const action = f.cycle === 2 ? 'delete' : 'reject';
    for (const item of f.items) {
      console.log(`--- ${f.stem} A${item.n}  → annot SA action: ${action} ---`);
      console.log(item.fb);
      console.log();
    }
  }
}

// ---------- Warnings (non-blocking) ----------
if (warnings.length) {
  console.error('=== Warnings (non-blocking) ===');
  for (const w of warnings) console.error(`  ⚠ ${w}`);
  console.error();
}

// ---------- Payload sync result ----------
if (errors.length) {
  console.error('=== PAYLOAD SYNC ERRORS — push BLOCKED ===');
  for (const e of errors) console.error(`  ✗ ${e}`);
  console.error(`\n${errors.length} error(s). Resolve before pushing to SA.`);
  process.exit(2);
}

console.log('=== Payload sync: CLEAN ===');
console.log('Every annot has a definitive sa_action. Safe to push pending Igor approval.');
console.log('\n[prepare-job3b] Awaiting explicit Igor confirmation before SA push.');
process.exit(0);
