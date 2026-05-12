#!/usr/bin/env node
// post-fire-analyze.mjs — analyze a fire-stem.sh run log and emit a per-run
// report. Called from fire-stem.sh's EXIT trap.
//
// Usage:
//   node scripts/post-fire-analyze.mjs <path-to-fire-log>
//
// Reads the log + cross-references shadow_applied/ sidecars to determine which
// annots fired cleanly vs aborted vs warned. Emits markdown report alongside
// the log file (<log>.report.md). Prints summary to stdout.

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { resolve, basename, dirname, join } from 'path';

const LIZARD_DIR = resolve(dirname(new URL(import.meta.url).pathname), '..');

const logPath = process.argv[2];
if (!logPath) {
  console.error('usage: post-fire-analyze.mjs <fire-log-path>');
  process.exit(2);
}
if (!existsSync(logPath)) {
  console.error(`log not found: ${logPath}`);
  process.exit(2);
}

const raw = readFileSync(logPath, 'utf8');
const lines = raw.split(/\r?\n/);

// Parse stem from filename: logs/fire/<unix-ts>-<STEM>.log
const fname = basename(logPath);
const stemMatch = fname.match(/^\d+-(.+?)\.log$/);
const stem = stemMatch?.[1] || 'unknown';

// Outcome ledger — one entry per fire attempt.
const attempts = [];
let currentAnnot = null;

// Abort signatures we recognize (extend as new patterns appear).
const ABORT_SIGS = [
  { sig: 'FRESHNESS_FAIL=not_on_step1', meaning: 'cross-allocation — page past Step 1', gate: 'fire-shadow-devbrowser.sh:168' },
  { sig: 'FRESHNESS_FAIL=step1_textarea_prefilled', meaning: 'cross-allocation — Step 1 pre-filled', gate: 'fire-shadow-devbrowser.sh:173' },
  { sig: 'Failed to submit block', meaning: 'HAI server error mid-submit', gate: 'manual recovery (reload + walk)' },
  { sig: 'waitForFunction', meaning: 'timeout waiting for DOM element', gate: 'check HAI page state; consider longer timeout' },
  { sig: 'TimeoutError', meaning: 'Playwright/dev-browser timeout', gate: 'check sandbox timeout setting' },
  { sig: 'evaluate', meaning: 'page.evaluate threw — DOM mismatch', gate: 'inspect script selector vs current HAI DOM' },
];

function classifyAbort(blockText) {
  for (const { sig, meaning, gate } of ABORT_SIGS) {
    if (blockText.includes(sig)) return { signature: sig, meaning, gate };
  }
  return { signature: 'unknown', meaning: 'unrecognized error', gate: 'inspect log directly' };
}

let pendingAttempt = null;
let buffer = [];

for (const ln of lines) {
  buffer.push(ln);
  if (buffer.length > 200) buffer.shift();

  // Begin annot attempt: "[fire-stem] $STEM A$N: rating=… image=…" or "verdict_source=…"
  // (success and abort lines also start with "[fire-stem] $STEM A$N:" so we
  // disambiguate by requiring rating= / verdict_source= / image= keyword)
  const begin = ln.match(/^\[fire-stem\] .+ A(\d+):.+(rating=|image=|verdict_source=|prompt_changed_cycle2)/);
  if (begin) {
    if (pendingAttempt && !pendingAttempt.closed) {
      attempts.push({ ...pendingAttempt, closed: true, status: 'incomplete' });
    }
    pendingAttempt = { n: parseInt(begin[1], 10), bufferStart: buffer.length, closed: false };
  }

  // Success: "[fire-stem] $STEM A$N: uuid=… time=… eval=…"
  const success = ln.match(/^\[fire-stem\] .+ A(\d+): uuid=(\w+) time=(\S+) eval=(\S+)/);
  if (success && pendingAttempt && pendingAttempt.n === parseInt(success[1], 10)) {
    pendingAttempt.status = 'fired';
    pendingAttempt.uuid = success[2];
    pendingAttempt.time_logged = success[3];
    pendingAttempt.eval = success[4];
    pendingAttempt.closed = true;
    attempts.push(pendingAttempt);
    pendingAttempt = null;
  }

  // Abort: "[fire-stem] $STEM A$N: fire-shadow exited $EC — abort"
  const abort = ln.match(/^\[fire-stem\] .+ A(\d+): fire-shadow exited (\d+) — abort/);
  if (abort && pendingAttempt && pendingAttempt.n === parseInt(abort[1], 10)) {
    const blockText = buffer.slice(Math.max(0, buffer.length - 50)).join('\n');
    const cls = classifyAbort(blockText);
    pendingAttempt.status = 'abort';
    pendingAttempt.exit_code = parseInt(abort[2], 10);
    pendingAttempt.signature = cls.signature;
    pendingAttempt.meaning = cls.meaning;
    pendingAttempt.gate = cls.gate;
    pendingAttempt.closed = true;
    attempts.push(pendingAttempt);
    pendingAttempt = null;
  }
}

if (pendingAttempt && !pendingAttempt.closed) {
  attempts.push({ ...pendingAttempt, status: 'incomplete' });
}

// Group + summary
const fired = attempts.filter(a => a.status === 'fired');
const aborts = attempts.filter(a => a.status === 'abort');
const incomplete = attempts.filter(a => a.status === 'incomplete');
const warnings = fired.filter(a => a.eval && a.eval !== 'clean');

const sigCounts = {};
for (const a of aborts) {
  sigCounts[a.signature] = (sigCounts[a.signature] || 0) + 1;
}

// Build report
const lines2 = [];
lines2.push(`# Fire-stem run report — ${stem}`);
lines2.push('');
lines2.push(`**Log:** \`${logPath}\``);
lines2.push(`**Attempts:** ${attempts.length} (fired ${fired.length}, abort ${aborts.length}, incomplete ${incomplete.length})`);
if (warnings.length) lines2.push(`**HAI warnings:** ${warnings.length} of ${fired.length} fires`);
lines2.push('');

if (attempts.length) {
  lines2.push('## Attempt ledger');
  lines2.push('');
  lines2.push('| Annot | Status | UUID | eval | signature |');
  lines2.push('|---|---|---|---|---|');
  for (const a of attempts) {
    const uuid = a.uuid || '—';
    const ev = a.eval || '—';
    const sig = a.signature || (a.status === 'fired' ? 'OK' : '?');
    lines2.push(`| A${a.n} | ${a.status} | \`${uuid}\` | ${ev} | ${sig} |`);
  }
  lines2.push('');
}

if (aborts.length) {
  lines2.push('## Abort taxonomy');
  lines2.push('');
  for (const [sig, count] of Object.entries(sigCounts)) {
    const sample = aborts.find(a => a.signature === sig);
    lines2.push(`- **${sig}** × ${count} — ${sample?.meaning || ''}`);
    if (sample?.gate) lines2.push(`  - Gate to audit: \`${sample.gate}\``);
  }
  lines2.push('');
}

if (warnings.length) {
  lines2.push('## HAI eval warnings');
  lines2.push('');
  for (const w of warnings) {
    lines2.push(`- A${w.n} (\`${w.uuid}\`): eval=${w.eval} — needs resolution gate review`);
  }
  lines2.push('');
}

// Fragility flags — heuristic anomaly detection.
const flags = [];
if (aborts.length > 0 && fired.length === 0) flags.push('CRITICAL: 0 fires, all attempts aborted');
if (aborts.length > 0 && aborts.length >= fired.length) flags.push('HIGH: abort rate ≥ 50%');
if (incomplete.length > 0) flags.push(`MEDIUM: ${incomplete.length} attempts incomplete (script killed mid-fire?)`);
if (sigCounts['unknown']) flags.push(`MEDIUM: ${sigCounts['unknown']} aborts with unrecognized signature — extend ABORT_SIGS table`);

if (flags.length) {
  lines2.push('## Fragility flags');
  lines2.push('');
  for (const f of flags) lines2.push(`- ${f}`);
  lines2.push('');
}

lines2.push('## Suggested action');
lines2.push('');
if (aborts.length === 0 && warnings.length === 0) {
  lines2.push('Clean run. No action needed.');
} else if (aborts.length > 0) {
  lines2.push('- Inspect the gate(s) listed under Abort taxonomy.');
  lines2.push('- If the same signature appears 2+ times in this run, treat as regression.');
  lines2.push(`- Open the full log: \`${logPath}\``);
}
if (warnings.length) {
  lines2.push(`- Run \`STEM=${stem} node scripts/mark-resolved.mjs\` after Igor adjudicates warnings.`);
}

const report = lines2.join('\n') + '\n';
const reportPath = logPath.replace(/\.log$/, '.report.md');
writeFileSync(reportPath, report);

// Stdout summary
console.log('');
console.log(`[post-fire-analyze] ${stem}: ${fired.length} fired, ${aborts.length} abort, ${warnings.length} warning`);
if (flags.length) console.log(`[post-fire-analyze] flags: ${flags.join('; ')}`);
console.log(`[post-fire-analyze] report → ${reportPath}`);
