#!/usr/bin/env node
// job4-batch-status.mjs — Job 4 start summary report.
//
// Emits the canonical pre-Job-4 batch overview from `payloads/*.yaml` (source
// of truth at this point). Igor reads this before any SA UI mutation happens.
//
// Per stem: cycle, annot count, action breakdown (approve/QC_Return/delete),
// derived task-level QC status, per-annot one-liner with skill deltas + feedback
// excerpt. Tail summary lists every stem's QC status.
//
// Choreography: this is the canonical 'Job 4 start report' — re-derived from
// filesystem each invocation, no state file. Run as needed; idempotent.
//
// Usage: node scripts/job4-batch-status.mjs

import fs from 'node:fs';
import path from 'node:path';

const PAYLOAD_DIR = 'payloads';
const SA_APPLIED_DIR = path.join(PAYLOAD_DIR, 'sa_applied');

// Stem order MUST match Job 4's per-task-serial processing order — i.e.,
// manifest order (per CLAUDE.md §Job 0 Steps "for each stem in manifest order").
// Object.values preserves insertion order in modern JS, so reading the manifest
// keeps the fan-out sequence aligned. Fallback to filesystem-alpha only when no
// manifest exists (off-manifest stems are advisory; should not happen mid-batch).
let stems;
const manifestPath = 'scrapes/_manifest.json';
if (fs.existsSync(manifestPath)) {
  const m = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  stems = (Array.isArray(m) ? m : Object.values(m))
    .map(t => t.stem || t.SA_TASK_FILENAME?.replace(/\.json$/, ''))
    .filter(Boolean);
} else {
  stems = fs.readdirSync(PAYLOAD_DIR).filter(f => f.endsWith('.yaml') && !f.endsWith('.cycle1.yaml')).map(f => f.replace(/\.yaml$/, ''));
}

function parseAnnots(yamlText) {
  const annots = [];
  const blocks = yamlText.split(/(?=^  - n: \d+\s*$)/m).slice(1);
  for (const blk of blocks) {
    const n = parseInt(/^  - n: (\d+)/.exec(blk)?.[1] ?? 0, 10);
    if (!n) continue;
    const get = (re) => re.exec(blk)?.[1]?.trim();
    const action = get(/^      action:\s*(\S+)/m);
    const rating = get(/^      rating:\s*(\S+)/m);
    const fb = /^      feedback:\s*"([\s\S]*?)"\s*$/m.exec(blk)?.[1] ?? (get(/^      feedback:\s*(null)\s*$/m) === 'null' ? null : null);
    const sc = /^      skills_check:\s*\[([^\]]*)\]/m.exec(blk)?.[1].split(',').map(s => s.trim()).filter(Boolean) ?? [];
    const su = /^      skills_uncheck:\s*\[([^\]]*)\]/m.exec(blk)?.[1].split(',').map(s => s.trim()).filter(Boolean) ?? [];
    annots.push({ n, action, rating, feedback: fb, skills_check: sc, skills_uncheck: su });
  }
  return annots;
}

function abbrev(text, maxLen) {
  if (!text) return '';
  const t = text.replace(/\s+/g, ' ').trim();
  return t.length > maxLen ? t.slice(0, maxLen - 1) + '…' : t;
}

console.log('============================================================');
console.log(`  Job 4 batch status — ${new Date().toISOString().slice(0,10)}`);
console.log('============================================================');

const totals = { stems: 0, approve: 0, qc_return: 0, delete: 0, applied: 0 };
const summary = [];

// Pre-pass: classify stems so we can render in two phases (matches Job 4
// processing order: clean approves first, then rejections/deletes).
const classified = [];
for (const stem of stems) {
  const livePath = path.join(PAYLOAD_DIR, `${stem}.yaml`);
  const appliedPath = path.join(SA_APPLIED_DIR, `${stem}.yaml`);
  let path_, applied = false;
  if (fs.existsSync(livePath)) path_ = livePath;
  else if (fs.existsSync(appliedPath)) { path_ = appliedPath; applied = true; }
  else { classified.push({ stem, missing: true }); continue; }

  const cycle = fs.existsSync(`tasks/${stem}.cycle1.md`) ? 2 : 1;
  const txt = fs.readFileSync(path_, 'utf8');
  const annots = parseAnnots(txt);
  const approve = annots.filter(a => a.action === 'approve').length;
  const qcReturn = annots.filter(a => a.action === 'QC_Return').length;
  const del = annots.filter(a => a.action === 'delete').length;
  // Task-level QC: explicit `task.qc_disposition` field wins (Igor's manual
  // override at 3a for Skipped / Hold / Unusable). Fall back to derivation
  // from per-annot actions when absent.
  const explicitQc = /^\s*qc_disposition:\s*(\S+)/m.exec(txt)?.[1]?.trim();
  const qcStatus = explicitQc
    ?? ((cycle === 2) ? 'QC_Complete' : (qcReturn > 0 ? 'QC_Return' : 'QC_Complete'));
  const phase = (qcReturn + del) > 0 ? 2 : 1;
  classified.push({ stem, path_, applied, cycle, annots, approve, qcReturn, del, qcStatus, phase });
}

function renderStem(item) {
  if (item.missing) {
    console.log(`\n--- ${item.stem} ---`);
    console.log('  ❌ no payload (3b not done?)');
    return;
  }
  totals.stems++;
  totals.approve += item.approve;
  totals.qc_return += item.qcReturn;
  totals.delete += item.del;
  if (item.applied) totals.applied++;

  console.log(`\n--- ${item.stem} ---`);
  const stamp = item.applied ? ' · ✅ SA applied' : '';
  console.log(`  Cycle: ${item.cycle} · QC: ${item.qcStatus}${stamp} · ${item.annots.length} annots (👍 ${item.approve} / 👎 ${item.qcReturn + item.del}${item.del > 0 ? ` / del ${item.del}` : ''})`);
  for (const a of item.annots) {
    const icon = a.rating === 'thumbs-up' ? '👍' : '👎';
    const skillStr = (a.skills_uncheck.length || a.skills_check.length)
      ? ` · ${a.skills_uncheck.length ? '−' + a.skills_uncheck.join(',') : ''}${a.skills_check.length ? ' +' + a.skills_check.join(',') : ''}`
      : '';
    console.log(`    A${a.n} ${icon} ${a.action}${skillStr}`);
    if (a.feedback) console.log(`        ${a.feedback.replace(/\\"/g, '"')}`);
  }
  summary.push({ stem: item.stem, cycle: item.cycle, qcStatus: item.qcStatus, approve: item.approve, qcReturn: item.qcReturn, del: item.del, applied: item.applied, phase: item.phase });
}

const phase1 = classified.filter(c => !c.missing && c.phase === 1);
const phase2 = classified.filter(c => !c.missing && c.phase === 2);
const missingStems = classified.filter(c => c.missing);

console.log(`\n┏━ PHASE 1 — clean approves (${phase1.length} stem(s); no rejections, no deletes) ━`);
for (const item of phase1) renderStem(item);

if (phase2.length) {
  const totalQc = phase2.reduce((s, x) => s + x.qcReturn, 0);
  const totalDel = phase2.reduce((s, x) => s + x.del, 0);
  const cycle2deletes = phase2.some(x => x.del > 0);
  console.log(`\n┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓`);
  console.log(`┃ ⚠  PAUSE — review before pushing PHASE 2                                       ┃`);
  console.log(`┃                                                                                ┃`);
  console.log(`┃ Phase 2: ${String(phase2.length).padEnd(2)} stem(s) · ${String(totalQc).padEnd(2)} QC_Return · ${String(totalDel).padEnd(2)} delete                              ┃`);
  console.log(`┃                                                                                ┃`);
  console.log(`┃ Cycle-1 👎 → SA QC_Return (annotator gets task back, fixes per feedback).      ┃`);
  if (cycle2deletes) {
    console.log(`┃ Cycle-2 👎 → SA delete (IRREVERSIBLE). Igor clicks SA Delete manually after    ┃`);
    console.log(`┃   CLI applies feedback + thumbs-down rating. CLI NEVER clicks Delete itself.  ┃`);
  }
  console.log(`┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛`);
  for (const item of phase2) renderStem(item);
}

if (missingStems.length) {
  console.log(`\n--- missing payloads (3b not done) ---`);
  for (const item of missingStems) renderStem(item);
}

console.log('\n============================================================');
console.log('  Summary (Job 4 fire order: phase 1 then phase 2)');
console.log('============================================================');
for (const s of summary) {
  const status = s.applied ? '[applied]' : '[ready]  ';
  const ph = `P${s.phase}`;
  console.log(`  ${status} ${ph} ${s.stem.padEnd(50)} c${s.cycle}  QC=${s.qcStatus.padEnd(11)} 👍${s.approve} 👎${s.qcReturn}${s.del ? ` del${s.del}` : ''}`);
}
console.log(`\n  Totals: ${totals.stems} stems · ${totals.approve} approve · ${totals.qc_return} QC_Return · ${totals.delete} delete · ${totals.applied} already SA-applied`);
