#!/usr/bin/env node
// job5-batch-status.mjs — Job 5 start summary report (post-2026-05-02 swap).
//
// Emits the canonical pre-Job-5 batch overview. Reads payloads/shadow_applied/
// (the Job 4 → Job 5 hand-off slot) and the per-stem sidecar to surface the
// resolution gate state per stem.
//
// Per stem: cycle, annot count, action breakdown (approve/QC_Return/delete),
// derived task-level QC status, per-annot one-liner with skill deltas + feedback
// excerpt, plus the resolution gate state (clean / engaged / resolved).
//
// Choreography: this is the canonical 'Job 5 start report' — re-derived from
// filesystem each invocation, no state file. Run as needed; idempotent.
//
// Usage: node scripts/job5-batch-status.mjs

import fs from 'node:fs';
import path from 'node:path';

const PAYLOAD_DIR = 'payloads';
const SHADOW_APPLIED_DIR = path.join(PAYLOAD_DIR, 'shadow_applied');
const DONE_DIR = path.join(PAYLOAD_DIR, 'done');

// Pre-Job-5 stems live in shadow_applied/. Optionally include done stems for
// audit (last 24h) — but default keeps the report focused on what's actionable.
const includeDone = process.argv.includes('--include-done');

let stems;
const manifestPath = 'scrapes/_manifest.json';
if (fs.existsSync(manifestPath)) {
  const m = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  stems = (Array.isArray(m) ? m : Object.values(m))
    .map(t => t.stem || t.SA_TASK_FILENAME?.replace(/\.json$/, ''))
    .filter(Boolean);
} else {
  // Fallback: glob shadow_applied/ for stems pre-Job-5.
  stems = fs.existsSync(SHADOW_APPLIED_DIR)
    ? fs.readdirSync(SHADOW_APPLIED_DIR).filter(f => f.endsWith('.yaml') && !f.endsWith('.shadows.yaml')).map(f => f.replace(/\.yaml$/, ''))
    : [];
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
    const verdictSource = get(/^      verdict_source:\s*(\S+)/m) ?? 'auto';
    const fb = /^      feedback:\s*"([\s\S]*?)"\s*$/m.exec(blk)?.[1] ?? (get(/^      feedback:\s*(null)\s*$/m) === 'null' ? null : null);
    const sc = /^      skills_check:\s*\[([^\]]*)\]/m.exec(blk)?.[1].split(',').map(s => s.trim()).filter(Boolean) ?? [];
    const su = /^      skills_uncheck:\s*\[([^\]]*)\]/m.exec(blk)?.[1].split(',').map(s => s.trim()).filter(Boolean) ?? [];
    annots.push({ n, action, rating, verdictSource, feedback: fb, skills_check: sc, skills_uncheck: su });
  }
  return annots;
}

function parseSidecar(txt) {
  const igorResolvedRaw = /^\s*igor_resolved:\s*(true|false)\s*$/m.exec(txt)?.[1];
  const igorResolved = igorResolvedRaw === 'true';
  const shadows = [];
  const blocks = txt.split(/(?=^  - n: \d+\s*$)/m).slice(1);
  for (const blk of blocks) {
    const get = (re) => re.exec(blk)?.[1]?.trim();
    const n = parseInt(get(/^  - n:\s*(\d+)/m) ?? 0, 10);
    if (!n) continue;
    shadows.push({
      n,
      verdict_source: get(/^    verdict_source:\s*(\S+)/m) ?? 'auto',
      hai_llm_eval: get(/^    hai_llm_eval:\s*(\S+)/m) ?? 'clean',
      hai_llm_comment: /^    hai_llm_comment:\s*"([^"]*)"\s*$/m.exec(blk)?.[1] ?? '',
      reclaimed: /^    reclaimed:\s*(true|false)\s*$/m.exec(blk)?.[1] === 'true',
    });
  }
  return { igor_resolved: igorResolved, shadows };
}

console.log('============================================================');
console.log(`  Job 5 batch status — ${new Date().toISOString().slice(0,10)}`);
console.log('============================================================');

const totals = { stems: 0, approve: 0, qc_return: 0, delete: 0, done: 0, gate_engaged: 0, gate_resolved: 0 };
const summary = [];

const classified = [];
for (const stem of stems) {
  const shadowPath = path.join(SHADOW_APPLIED_DIR, `${stem}.yaml`);
  const sidecarPath = path.join(SHADOW_APPLIED_DIR, `${stem}.shadows.yaml`);
  const donePath = path.join(DONE_DIR, `${stem}.yaml`);

  let path_, stage, sidecarTxt = null;
  if (fs.existsSync(shadowPath)) {
    path_ = shadowPath; stage = 'shadow_applied';
    if (fs.existsSync(sidecarPath)) sidecarTxt = fs.readFileSync(sidecarPath, 'utf8');
  } else if (includeDone && fs.existsSync(donePath)) {
    path_ = donePath; stage = 'done';
  } else {
    classified.push({ stem, missing: true });
    continue;
  }

  const cycle = fs.existsSync(`tasks/${stem}.cycle1.md`) ? 2 : 1;
  const txt = fs.readFileSync(path_, 'utf8');
  const annots = parseAnnots(txt);
  const approve = annots.filter(a => a.action === 'approve').length;
  const qcReturn = annots.filter(a => a.action === 'QC_Return').length;
  const del = annots.filter(a => a.action === 'delete').length;
  const explicitQc = /^\s*qc_disposition:\s*"?([^"\n]+?)"?\s*$/m.exec(txt)?.[1]?.trim();
  const qcStatus = explicitQc
    ?? ((cycle === 2) ? 'QC_Complete' : (qcReturn > 0 ? 'QC_Return' : 'QC_Complete'));
  const phase = (qcReturn + del) > 0 ? 2 : 1;

  // Gate state (only meaningful for shadow_applied stems pre-Job-5).
  let gateState = 'n/a', gatedAnnots = [];
  if (stage === 'shadow_applied' && sidecarTxt) {
    const sidecar = parseSidecar(sidecarTxt);
    gatedAnnots = sidecar.shadows.filter(s => s.verdict_source === 'auto' && s.hai_llm_eval !== 'clean');
    if (gatedAnnots.length === 0) gateState = 'clean';
    else gateState = sidecar.igor_resolved ? 'resolved' : 'engaged';
  }

  classified.push({ stem, path_, stage, cycle, annots, approve, qcReturn, del, qcStatus, phase, gateState, gatedAnnots });
}

function renderStem(item) {
  if (item.missing) {
    console.log(`\n--- ${item.stem} ---`);
    console.log('  ❌ no payload (Job 4 not done?)');
    return;
  }
  totals.stems++;
  totals.approve += item.approve;
  totals.qc_return += item.qcReturn;
  totals.delete += item.del;
  if (item.stage === 'done') totals.done++;
  if (item.gateState === 'engaged') totals.gate_engaged++;
  if (item.gateState === 'resolved') totals.gate_resolved++;

  console.log(`\n--- ${item.stem} ---`);
  const stamp = item.stage === 'done' ? ' · ✅ done'
              : item.gateState === 'engaged' ? ' · ✋ gate ENGAGED'
              : item.gateState === 'resolved' ? ' · ✓ gate resolved'
              : ' · ✓ gate clean';
  console.log(`  Cycle: ${item.cycle} · QC: ${item.qcStatus}${stamp} · ${item.annots.length} annots (👍 ${item.approve} / 👎 ${item.qcReturn + item.del}${item.del > 0 ? ` / del ${item.del}` : ''})`);
  for (const a of item.annots) {
    const icon = a.rating === 'thumbs-up' ? '👍' : '👎';
    const skillStr = (a.skills_uncheck.length || a.skills_check.length)
      ? ` · ${a.skills_uncheck.length ? '−' + a.skills_uncheck.join(',') : ''}${a.skills_check.length ? ' +' + a.skills_check.join(',') : ''}`
      : '';
    const sourceTag = a.verdictSource === 'igor' ? ' [igor]' : '';
    console.log(`    A${a.n} ${icon} ${a.action}${sourceTag}${skillStr}`);
    if (a.feedback) console.log(`        ${a.feedback.replace(/\\"/g, '"')}`);
  }
  // Render gate-engaged annots inline so they're impossible to miss.
  if (item.gateState === 'engaged') {
    console.log('    ── HAI LLM warnings (auto-verdict annots — Igor must resolve) ──');
    for (const ga of item.gatedAnnots) {
      console.log(`    A${ga.n}: eval=${ga.hai_llm_eval}${ga.hai_llm_comment ? ' — ' + ga.hai_llm_comment.slice(0, 100) : ''}`);
    }
  }
  summary.push({
    stem: item.stem, cycle: item.cycle, qcStatus: item.qcStatus,
    approve: item.approve, qcReturn: item.qcReturn, del: item.del,
    stage: item.stage, gateState: item.gateState, phase: item.phase,
  });
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
  console.log(`\n--- missing payloads (Job 4 not done) ---`);
  for (const item of missingStems) renderStem(item);
}

console.log('\n============================================================');
console.log('  Summary (Job 5 fire order: phase 1 then phase 2)');
console.log('============================================================');
for (const s of summary) {
  const status = s.stage === 'done' ? '[done]   '
               : s.gateState === 'engaged' ? '[gated]  '
               : s.gateState === 'resolved' ? '[resolved]'
               : '[ready]  ';
  const ph = `P${s.phase}`;
  console.log(`  ${status} ${ph} ${s.stem.padEnd(50)} c${s.cycle}  QC=${s.qcStatus.padEnd(11)} 👍${s.approve} 👎${s.qcReturn}${s.del ? ` del${s.del}` : ''}`);
}
console.log(`\n  Totals: ${totals.stems} stems · ${totals.approve} approve · ${totals.qc_return} QC_Return · ${totals.delete} delete · ${totals.done} done · ${totals.gate_engaged} gate-engaged · ${totals.gate_resolved} gate-resolved`);
