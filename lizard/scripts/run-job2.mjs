#!/usr/bin/env node
// run-job2.mjs
// Sequential 4-reviewer fire + merge for a single task (Job 2).
// Steps:
//   1. Prefilter skeleton → /tmp/lizard/<stem>/prefilter.json
//   2. Fire reviewers in DEFAULT_ORDER (opus → gpt → gemini → grok). Per-annot
//      filtering: each reviewer sees only annots still pending after upstream
//      auto-resolves. First-👍-wins early-stop.
//   3. Merge → writes tasks/<stem>.md + merge-summary.json
//   4. Update scripts/reviewer-stats.json (fires, agree, escalate counters)
//
// Usage:
//   STEM=<stem> [LIZARD_DIR=<path>] [REVIEWERS=opus,gpt] node scripts/run-job2.mjs
//
// Env:
//   STEM       — required
//   REVIEWERS  — override fire order (comma-separated). Default: filesystem
//                pool in DEFAULT_ORDER policy.
//   REVIEWER_FAIL_POLICY — abort (default) | drop. On reviewer failure
//                (exit_nonzero / no_output / bad_output), default is exit 4
//                with details so Igor can inspect before silently dropping a
//                model. Re-invoke with REVIEWER_FAIL_POLICY=drop to keep
//                going past failures (codified 2026-05-01).

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { resolve, join, dirname as pathDirname } from 'path';
import { defaultReviewAnnots } from './reviewer-view.mjs';
import { fileURLToPath } from 'url';
import { spawnSync } from 'child_process';

const __dir = pathDirname(fileURLToPath(import.meta.url));
const LIZARD_DIR = process.env.LIZARD_DIR ?? resolve(__dir, '..');
const STEM = process.env.STEM;
if (!STEM) { console.error('ERROR: STEM env var required'); process.exit(1); }

// Sequential-only fire (parallel mode dropped 2026-04-27). Early-stop always
// on: after each reviewer, drop auto-resolved annots from pending list; next
// reviewer fires only on still-pending. SKIP_EARLY_STOP env retired.

const STATS_PATH = join(LIZARD_DIR, 'scripts', 'reviewer-stats.json');
const TMP_DIR = join('/tmp/lizard', STEM);
mkdirSync(TMP_DIR, { recursive: true });

// Reviewer pool derived from filesystem: any `scripts/run-<name>-reviewer.mjs`
// counts as a registered reviewer. Adding/removing a model = drop a file, no
// code edit. Convention over configuration.
import { readdirSync } from 'fs';
const REGISTRY = Object.fromEntries(
  readdirSync(join(LIZARD_DIR, 'scripts'))
    .map(f => f.match(/^run-(.+)-reviewer\.mjs$/))
    .filter(Boolean)
    .map(m => [m[1], { script: m[0], out: `${m[1]}-review.md` }])
);

// 4-reviewer sequential fire order (codified 2026-04-27): opus fires first
// (free on Max plan; covers most cases). Remaining annots flow to gpt → gemini
// → grok. Any 👍 along the way auto-resolves (first-👍-wins). All-4-👎-G1
// auto-resolves down. Residual (mixed 👎 or non-G1) escalates to Igor at Job 3a.
const DEFAULT_ORDER = ['opus', 'gpt', 'gemini', 'grok'];

function loadStats() {
  if (!existsSync(STATS_PATH)) {
    return { generated_at: null, per_reviewer: {}, default_order: DEFAULT_ORDER };
  }
  const raw = JSON.parse(readFileSync(STATS_PATH, 'utf8'));
  // If stats file was seeded with stale order, add missing reviewers
  const existing = raw.default_order ?? [];
  const missing = DEFAULT_ORDER.filter(n => !existing.includes(n));
  if (missing.length) raw.default_order = [...existing, ...missing];
  return raw;
}

function saveStats(stats) {
  stats.updated_at = new Date().toISOString();
  writeFileSync(STATS_PATH, JSON.stringify(stats, null, 2), 'utf8');
}

// Compute fire order. Policy: FN-dominant. Opus over-rejects → goes LAST as safety net.
// First-thumbs-up-wins means we want most-agreeable reviewers first to maximize early-stop.
// This is a policy decision, NOT a metric to be optimized from stats. Stats are kept
// for observability only; they don't re-sort fire order (which would promote Opus after
// a single lucky agree-run and defeat the cost model).
//
// User can override per run via REVIEWERS=a,b,c env.
function resolveFireOrder() {
  if (process.env.REVIEWERS) {
    return process.env.REVIEWERS.split(',').map(s => s.trim()).filter(Boolean);
  }
  return DEFAULT_ORDER.filter(n => REGISTRY[n]);
}

const FIRE_ORDER = resolveFireOrder();
console.error(`[run-job2] STEM=${STEM}`);
console.error(`[run-job2] fire order: ${FIRE_ORDER.join(' → ')}`);

// Guard: environment must be capable of running all reviewers.
// Catches the silent-failure modes (missing sips, /tmp not writable, missing
// API keys, etc.) that otherwise produce stub reviews + wrong merge verdicts.
// Override with SKIP_ENV_CHECK=1 only if you know what you're doing.
if (process.env.SKIP_ENV_CHECK !== '1') {
  console.error(`\n[run-job2] === Step 0: env-check ===`);
  const r = spawnSync('node', [join(LIZARD_DIR, 'scripts', 'env-check.mjs')], {
    env: { ...process.env, LIZARD_DIR },
    encoding: 'utf8',
    stdio: ['ignore', 'inherit', 'inherit'],
  });
  if (r.status !== 0) {
    console.error(`[run-job2] ERROR: env-check failed (exit=${r.status}) — refusing to run`);
    console.error(`  fix the ✗ items above, or set SKIP_ENV_CHECK=1 to bypass (not recommended)`);
    process.exit(3);
  }
}

// Guard: skeleton must exist — Job 2 can't run without Job 0+1 having completed first
const SKELETON_PATH = join(LIZARD_DIR, 'tasks', 'skeleton', `${STEM}.md`);
if (!existsSync(SKELETON_PATH)) {
  console.error(`[run-job2] ERROR: skeleton missing — run Job 0+1 first`);
  console.error(`  expected: ${SKELETON_PATH}`);
  process.exit(2);
}

// Freshness guards dropped 2026-04-27. Choreography model: Job 1 actor's
// precondition (skeleton missing or older than scrape) handles staleness
// upstream. Scrape validation belongs at Job 0 exit, not Job 2 entry. Job 2
// trusts that any `scrapes/<stem>.txt` + `tasks/skeleton/<stem>.md` it sees
// are valid by construction. SKIP_FRESHNESS_CHECK env flag retired.

// Count expected annotations from skeleton — reviewers must emit one block per annotation.
// Used downstream to reject silently-malformed reviewer outputs (the failure mode that
// hid the gpt bug: file exists, exit=0, but regex finds 0 `## Annotation N` headers).
const SKELETON_TEXT = readFileSync(SKELETON_PATH, 'utf8');
const EXPECTED_ANNOTS = new Set(
  [...(SKELETON_TEXT.matchAll(/^##+\s+(?:Cycle\s*2\s*—\s*)?Annotation\s+(\d+)\b/gm))].map(m => parseInt(m[1], 10))
).size;
if (EXPECTED_ANNOTS === 0) {
  console.error(`[run-job2] ERROR: skeleton has 0 annotations — nothing to review`);
  process.exit(2);
}
console.error(`[run-job2] skeleton has ${EXPECTED_ANNOTS} annotation(s) — each reviewer must emit at least that many`);

// Validate a reviewer's output file:
//   1. Must parse to ≥EXPECTED_ANNOTS `## Annotation N` blocks (silent-drop guard #1).
//   2. Each block must contain a `**Flags:**` line (silent-drop guard #2 — structured
//      Flags field is the merger's only source for taxonomy codes; missing = empty
//      flags inferred, which loses signal silently).
// Keep regex in sync with job2-merge.mjs and scripts/tests/test-helpers.mjs.
// Returns { ok: bool, found: number, reason: string|null }.
function validateReviewerOutput(outPath, expected = EXPECTED_ANNOTS) {
  if (!existsSync(outPath)) return { ok: false, found: 0, reason: 'file_missing' };
  const txt = readFileSync(outPath, 'utf8');
  if (txt.length < 200) return { ok: false, found: 0, reason: `too_short (${txt.length} bytes)` };
  const matches = [...txt.matchAll(/^##+\s+(?:Cycle\s*2\s*—\s*)?Annotation\s+(\d+)\b/gm)];
  const uniqNs = new Set(matches.map(m => parseInt(m[1], 10)));
  if (uniqNs.size < expected) {
    return { ok: false, found: uniqNs.size,
      reason: `parsed ${uniqNs.size}/${expected} annotations (reviewer violated "## Annotation N" format rule)` };
  }
  // Per-block **Flags:** check. Split file by annotation header positions.
  const positions = matches.map(m => m.index);
  positions.push(txt.length);
  const missingFlags = [];
  for (let i = 0; i < matches.length; i++) {
    const n = parseInt(matches[i][1], 10);
    const block = txt.slice(positions[i], positions[i + 1]);
    if (!/^\s*-?\s*\*\*Flags:\*\*\s*\[/mi.test(block)) {
      missingFlags.push(n);
    }
  }
  if (missingFlags.length) {
    return { ok: false, found: uniqNs.size,
      reason: `missing **Flags:** field in annotation(s) ${missingFlags.join(',')} (reviewer violated structured-fields rule)` };
  }
  return { ok: true, found: uniqNs.size, reason: null };
}

// ---------- step 1: prefilter ----------
console.error(`\n[run-job2] === Step 1: prefilter ===`);
{
  const r = spawnSync('node', [join(LIZARD_DIR, 'scripts', 'job2-prefilter.mjs')], {
    env: { ...process.env, STEM, LIZARD_DIR },
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'inherit'],
  });
  if (r.status !== 0) { console.error('[run-job2] prefilter failed'); process.exit(1); }
}

// ---------- step 2: reviewers ----------
// Sequential filtering: each reviewer fires on a SUBSET of annots — only the
// ones still needing review (pending list). After each fire, dry-merge, and
// drop annots the merger now classifies as 'auto-resolved' from the pending
// list. Stop firing when pending list is empty.
function runReviewer(name, annotsList) {
  const entry = REGISTRY[name];
  if (!entry) { console.error(`[run-job2] skip unknown reviewer '${name}'`); return { name, ok: false, err: 'unknown' }; }
  const outPath = join(TMP_DIR, entry.out);
  const annotsEnv = annotsList?.length ? annotsList.join(',') : '';
  console.error(`\n[run-job2] === firing ${name} → ${outPath} (ANNOTS=${annotsEnv || 'all'}) ===`);
  const started = Date.now();
  const env = { ...process.env, STEM, LIZARD_DIR, OUT: outPath };
  if (annotsEnv) env.ANNOTS = annotsEnv;
  const r = spawnSync('node', [join(LIZARD_DIR, 'scripts', entry.script)], {
    env,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'inherit'],
    maxBuffer: 50 * 1024 * 1024,
  });
  const dur = ((Date.now() - started) / 1000).toFixed(1);
  if (r.status !== 0) { console.error(`[run-job2] ${name} FAILED (${dur}s, exit=${r.status})`); return { name, ok: false, err: 'exit_nonzero', dur }; }
  if (!existsSync(outPath)) { console.error(`[run-job2] ${name} ran but output missing`); return { name, ok: false, err: 'no_output', dur }; }
  // Reviewer must cover the requested annots (or all if no subset).
  const expectedCount = annotsList?.length ?? EXPECTED_ANNOTS;
  const v = validateReviewerOutput(outPath, expectedCount);
  if (!v.ok) {
    console.error(`[run-job2] ${name} BAD OUTPUT (${dur}s): ${v.reason} — file kept at ${outPath} for inspection`);
    return { name, ok: false, err: `bad_output: ${v.reason}`, dur };
  }
  console.error(`[run-job2] ${name} OK (${dur}s, ${v.found}/${expectedCount} annotations parsed)`);
  return { name, ok: true, dur, parsed: v.found };
}

function runMerger({ commit }) {
  // Run merger as subprocess. commit=false → DRY_RUN=1, summary only, no task
  // file write (used inside the reviewer loop to update pending list).
  // commit=true → writes tasks/<stem>.md (final pass after loop).
  const envReviewers = runResults.filter(r => r.ok).map(r => r.name).join(',');
  const r = spawnSync('node', [join(LIZARD_DIR, 'scripts', 'job2-merge.mjs')], {
    env: {
      ...process.env, STEM, LIZARD_DIR,
      REVIEWERS: envReviewers,
      DRY_RUN: commit ? '0' : '1',
    },
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'inherit'],
  });
  if (r.status !== 0) return null;
  const summaryPath = join(TMP_DIR, 'merge-summary.json');
  if (!existsSync(summaryPath)) return null;
  return JSON.parse(readFileSync(summaryPath, 'utf8'));
}

// Initial pending list — annots that need review.
//   cycle 1 → all `## Annotation N` numbers
//   cycle 2 → only [CHANGED] cycle-2 numbers (carry-forward [UNCHANGED] never need review)
let pending = defaultReviewAnnots(SKELETON_TEXT);
console.error(`[run-job2] initial pending = ${pending.join(',') || '(none)'} (${pending.length} annot(s))`);

// Stump pre-filter (codified 2026-05-01): drop annots whose prefilter detected
// no model answer or model == annotator. Auto Verdict 👎 emitted by the merger
// via stumpfail.json — no reviewers fire on these (deterministic fact, not
// guideline interpretation). stumpFailSet stays in outer scope so the pending
// recalculation never re-adds stump-failed annots via no_reviewer_output.
// (codified 2026-05-01: prior bug — stump-failed annots leaked back into
// pending as no_reviewer_output, causing reviewers to fire on them anyway.)
let stumpFailSet = new Set();
{
  const prefilterPath = join(TMP_DIR, 'prefilter.json');
  if (existsSync(prefilterPath)) {
    const pf = JSON.parse(readFileSync(prefilterPath, 'utf8'));
    const stumpFails = pf.annotations
      .filter(a => a.prefilter_verdict)
      .map(a => ({ n: a.n, code: a.prefilter_verdict.carve_out, reason: a.prefilter_verdict.reason }));
    if (stumpFails.length) {
      stumpFailSet = new Set(stumpFails.map(s => s.n));
      pending = pending.filter(n => !stumpFailSet.has(n));
      for (const sf of stumpFails) {
        console.error(`[run-job2] stump pre-filter: A${sf.n} → 👎 (${sf.code}) — ${sf.reason}`);
      }
      console.error(`[run-job2] pending after stump pre-filter = ${pending.join(',') || '(none)'} (${pending.length} annot(s))`);
      // Write stumpfail.json so merger can emit Auto Verdict 👎 blocks without
      // needing reviewer output for these annotations.
      writeFileSync(join(TMP_DIR, 'stumpfail.json'), JSON.stringify({ stump_fails: stumpFails }, null, 2), 'utf8');
    }
  }
}

const runResults = [];
let lastSummary = null;

// Sequential fire with per-annot filtering: each reviewer fires only on the
// annots still in `pending`. After each, dry-merge and drop annots the merger
// classifies as auto-resolved.
for (const name of FIRE_ORDER) {
  if (pending.length === 0) {
    console.error(`[run-job2] ✓ pending list empty — stopping early before firing '${name}'`);
    break;
  }
  const res = runReviewer(name, pending);
  runResults.push(res);
  if (!res.ok) {
    // Reviewer failure gate (codified 2026-05-01). Default: abort with details
    // so Igor can inspect the failure before dropping a model. Silent drops
    // hide gemini API errors, validation failures, etc. — Igor wants confirmation.
    const policy = (process.env.REVIEWER_FAIL_POLICY ?? 'abort').toLowerCase();
    if (policy === 'drop') {
      console.error(`[run-job2] ${name} failed (${res.err}) — REVIEWER_FAIL_POLICY=drop, continuing`);
      continue;
    }
    console.error(`[run-job2] ABORT: ${name} failed (${res.err}). Output (if any) at /tmp/lizard/${STEM}/${name}-review.md.`);
    console.error(`[run-job2] Inspect, then re-invoke with REVIEWER_FAIL_POLICY=drop to skip ${name}, or fix and retry.`);
    process.exit(4);
  }
  lastSummary = runMerger({ commit: false });
  if (lastSummary) {
    // Chain stops only on auto-resolved (close-match 👍). Big-diff 👍 → decision
    // stays 'pending-igor' → annot stays in pending → next reviewer probes for
    // a matching 👍. Chain exits when pending is empty or FIRE_ORDER exhausted.
    const stillPending = lastSummary.per_annotation
      .filter(a => (a.decision === 'pending-igor' || a.decision === 'no_reviewer_output') && !stumpFailSet.has(a.n))
      .map(a => a.n);
    const dropped = pending.filter(n => !stillPending.includes(n));
    if (dropped.length) {
      console.error(`[run-job2] ${name} stopped chain on A${dropped.join(',A')} — dropping from pending`);
    }
    pending = stillPending;
    console.error(`[run-job2] pending after ${name}: ${pending.join(',') || '(none)'}`);
  }
}

if (!lastSummary) {
  console.error('[run-job2] ERROR: no merge summary produced');
  process.exit(1);
}

// Final commit: actually write tasks/<stem>.md (immutable). Loop iterations
// were dry-runs (summary only); this is the only call that mutates the
// canonical task file.
console.error(`[run-job2] === final merge: committing tasks/${STEM}.md ===`);
lastSummary = runMerger({ commit: true });
if (!lastSummary) {
  console.error('[run-job2] ERROR: final merge commit failed');
  process.exit(1);
}

// ---------- step 4: update stats ----------
const stats = loadStats();
for (const name of FIRE_ORDER) {
  const fired = runResults.find(r => r.name === name);
  if (!fired || !fired.ok) continue;
  stats.per_reviewer[name] ??= { fires: 0, first_agree: 0, any_agree: 0, escalates: 0, errors: 0 };
  const s = stats.per_reviewer[name];
  s.fires += 1;
}
// New policy: every non-unchanged annot is `pending-igor` and escalates to 3a.
// `first_agree` is now attributed to the reviewer whose verdict was picked
// (first reviewer to emit a parseable rating). Reconciled against Igor's verdict
// later by reconcile-stats.mjs (Job 3a).
for (const a of lastSummary.per_annotation) {
  if (a.decision === 'pending-igor' && a.reviewer) {
    stats.per_reviewer[a.reviewer] ??= { fires: 0, first_agree: 0, any_agree: 0, escalates: 0, errors: 0 };
    stats.per_reviewer[a.reviewer].first_agree += 1;
  }
  if (a.decision === 'no_reviewer_output') {
    // No reviewer covered this annot — count escalate against everyone fired.
    for (const fired of runResults.filter(r => r.ok)) {
      stats.per_reviewer[fired.name] ??= { fires: 0, first_agree: 0, any_agree: 0, escalates: 0, errors: 0 };
      stats.per_reviewer[fired.name].escalates += 1;
    }
  }
}
for (const res of runResults) {
  if (!res.ok) {
    stats.per_reviewer[res.name] ??= { fires: 0, first_agree: 0, any_agree: 0, escalates: 0, errors: 0 };
    stats.per_reviewer[res.name].errors += 1;
    const s = stats.per_reviewer[res.name];
    s.error_types ??= {};
    const errKey = res.err?.startsWith('bad_output') ? 'bad_output' : (res.err ?? 'unknown');
    s.error_types[errKey] = (s.error_types[errKey] ?? 0) + 1;
  }
}
// Stats are observability only. Fire order is the hardcoded FN-dominant policy;
// we record it here for auditability but don't re-derive anything from it.
stats.default_order = DEFAULT_ORDER;
saveStats(stats);

// ---------- final report ----------
console.error(`\n[run-job2] === done ===`);
console.error(`[run-job2] pending-igor:        ${lastSummary.pending}`);
console.error(`[run-job2] no_reviewer_output:  ${lastSummary.unresolved}`);
console.error(`[run-job2] unchanged:           ${lastSummary.unchanged}`);
console.error(`[run-job2] per-annotation:`);
for (const a of lastSummary.per_annotation) {
  const by = a.reviewer ? ` by:${a.reviewer}` : '';
  const rt = a.rating ? ` ${a.rating}` : '';
  const fl = a.flags?.length ? ` [${a.flags.join(',')}]` : '';
  console.error(`  A${a.n}: ${a.decision}${by}${rt}${fl}`);
}
console.error(`[run-job2] task file: ${join(LIZARD_DIR, 'tasks', `${STEM}.md`)}`);
console.error(`[run-job2] reviewer outputs: ${TMP_DIR}/`);
console.error(`[run-job2] stats: ${STATS_PATH}`);
