#!/usr/bin/env node
// run-all.mjs — pre-flight gate for Job 2.
// Runs the mandatory tests in order; exits non-zero if any fails.
//
// Usage: node scripts/tests/run-all.mjs
//
// Sentinel (added 2026-04-27):
//   To avoid re-running the full suite per task in a multi-task batch, this
//   script self-manages a sentinel in `scrapes/_state.json.preflight`. After a
//   green run it stamps `{ passed_at: <ISO>, batch: <state.batch> }`. On entry,
//   if the sentinel exists AND its batch matches `state.batch` AND it's within
//   SENTINEL_TTL_MS, the script exits 0 immediately (no tests fired).
//   Override the cache with FORCE_PREFLIGHT=1.
//   Skip stamping (e.g. dev runs) with STAMP=0.
//   Override state path (e.g. for tests) with STATE_PATH=<abs path>.
//
// Spec: CLAUDE.md §3.5 — "Job 2 pre-flight gate (MANDATORY) … once per batch,
//   not per task."
//
// Sequence:
//   1. test-expected-annots.mjs               (unit, <1s) — EXPECTED_ANNOTS dedupe regression
//   2. test-prefilter-anchor.mjs              (unit, <1s) — V6 anchor-skill rule (G1_NO_ANCHOR)
//   3. test-prefilter-letter-ban.mjs          (unit, <1s) — V6 letter/character counting ban
//   4. test-prefilter-historical-snapshot.mjs (unit, <1s) — full 16-stem batch flag matrix
//   5. test-flags-parser.mjs                  (unit, <1s) — closed-enum Flags normalizer
//   …
//   N. test-pipeline.mjs                      (e2e, ~30-60s) — Job 1+2 contract on fixture

import { dirname, join, resolve } from 'path';
import { fileURLToPath } from 'url';
import { spawnSync } from 'child_process';
import { existsSync, readFileSync, writeFileSync, renameSync } from 'fs';

const __dir = dirname(fileURLToPath(import.meta.url));
const LIZARD_DIR = resolve(__dir, '..', '..');

// ---------- sentinel helpers ----------
const STATE_PATH = process.env.STATE_PATH || join(LIZARD_DIR, 'scrapes', '_state.json');
const SENTINEL_TTL_MS = parseInt(process.env.SENTINEL_TTL_MS || `${6 * 60 * 60 * 1000}`, 10); // 6h default

function readState() {
  if (!existsSync(STATE_PATH)) return null;
  try { return JSON.parse(readFileSync(STATE_PATH, 'utf8')); }
  catch (e) {
    process.stderr.write(`[run-all] warn: could not parse ${STATE_PATH}: ${e.message}\n`);
    return null;
  }
}

function writeStateAtomic(state) {
  const tmp = STATE_PATH + '.tmp';
  writeFileSync(tmp, JSON.stringify(state, null, 2), 'utf8');
  renameSync(tmp, STATE_PATH);
}

function checkSentinel(state) {
  const s = state?.preflight;
  if (!s?.passed_at || !('batch' in s)) {
    return { skip: false, reason: 'no sentinel recorded' };
  }
  if (s.batch !== state.batch) {
    return { skip: false, reason: `batch changed (sentinel batch=${s.batch}, current=${state.batch})` };
  }
  const age = Date.now() - new Date(s.passed_at).getTime();
  if (Number.isNaN(age) || age < 0) {
    return { skip: false, reason: `unparseable sentinel timestamp ${s.passed_at}` };
  }
  if (age > SENTINEL_TTL_MS) {
    return { skip: false, reason: `sentinel stale (${(age / 3_600_000).toFixed(1)}h old, ttl=${(SENTINEL_TTL_MS / 3_600_000).toFixed(1)}h)` };
  }
  return { skip: true, reason: `passed_at=${s.passed_at}, batch=${s.batch}, age=${(age / 60_000).toFixed(0)}m` };
}

function stampSentinel() {
  const state = readState();
  // Don't materialize state.json if it doesn't exist — the orchestrator owns it
  if (!state) {
    process.stderr.write(`[run-all] (no _state.json present — skipping sentinel stamp)\n`);
    return;
  }
  state.preflight = {
    passed_at: new Date().toISOString(),
    batch: state.batch ?? null,
  };
  state.updated_at = new Date().toISOString();
  writeStateAtomic(state);
  process.stderr.write(`[run-all] stamped sentinel: batch=${state.preflight.batch}, passed_at=${state.preflight.passed_at}\n`);
}

// ---------- entry: check sentinel ----------
const FORCE = process.env.FORCE_PREFLIGHT === '1';
const initialState = readState();
if (FORCE) {
  process.stderr.write(`[run-all] FORCE_PREFLIGHT=1 — bypassing sentinel\n`);
} else if (initialState) {
  const { skip, reason } = checkSentinel(initialState);
  if (skip) {
    process.stderr.write(`[run-all] SKIP — pre-flight already green for this batch (${reason})\n`);
    process.stderr.write(`[run-all] override: FORCE_PREFLIGHT=1 node scripts/tests/run-all.mjs\n`);
    process.exit(0);
  }
  process.stderr.write(`[run-all] sentinel check: ${reason} — running tests\n`);
} else {
  process.stderr.write(`[run-all] no _state.json — running tests without sentinel context\n`);
}

// ---------- run tests ----------
const TESTS = [
  'test-expected-annots.mjs',
  'test-prefilter-anchor.mjs',
  'test-prefilter-letter-ban.mjs',
  'test-prefilter-historical-snapshot.mjs',
  'test-flags-parser.mjs',
  'test-pick-best-verdict.mjs',
  'test-auto-resolve.mjs',
  'test-validate-scrape.mjs',
  'test-skeleton-freshness.mjs',
  'test-reviewer-view.mjs',
  'test-silent-drop.mjs',
  'test-prepare-job3b-helpers.mjs',
  'test-merger-verdict-guard.mjs',
  'test-reconcile-shadows.mjs',
  'test-chrome-debug-dismiss.py',
  'test-pipeline.mjs',
];

const suiteStart = Date.now();

for (const f of TESTS) {
  const started = Date.now();
  const cmd = f.endsWith('.py') ? '/opt/homebrew/bin/python3.11' : 'node';
  const r = spawnSync(cmd, [join(__dir, f)], { stdio: 'inherit', timeout: 900_000 });
  const dur = ((Date.now() - started) / 1000).toFixed(1);
  const ok = r.status === 0;
  process.stderr.write(`[run-all] ${ok ? 'PASS' : 'FAIL'} ${f} (${dur}s)\n`);
  if (!ok) {
    process.stderr.write(`[run-all] STOP — ${f} failed; fix before running Job 2\n`);
    process.exit(1);
  }
}

const total = ((Date.now() - suiteStart) / 1000).toFixed(1);
process.stderr.write(`[run-all] all tests passed (${total}s)\n`);

// ---------- exit: stamp sentinel ----------
if (process.env.STAMP === '0') {
  process.stderr.write(`[run-all] STAMP=0 — skipping sentinel stamp\n`);
} else {
  stampSentinel();
}

process.exit(0);
