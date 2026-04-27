#!/usr/bin/env node
// run-job2.mjs
// Orchestrates the 4-model review pipeline for a single task (Job 2).
// Steps:
//   1. Prefilter skeleton → /tmp/lizard/<stem>/prefilter.json
//   2. Fire reviewers in order from scripts/reviewer-stats.json (best agree-rate first).
//      Supports: opus, grok, gemini  (openclaw wrapper TBD).
//      Mode = sequential by default (PARALLEL=1 runs them in parallel).
//      Early stop: after each reviewer, if merger can resolve all annotations, stop.
//   3. Merge → writes tasks/<stem>.md + merge-summary.json
//   4. Update scripts/reviewer-stats.json (fires, agree, escalate counters)
//
// Usage:
//   STEM=<stem> [LIZARD_DIR=<path>] [PARALLEL=1] [REVIEWERS=opus,grok,gemini] \
//     node scripts/run-job2.mjs
//
// Env:
//   STEM        — required
//   REVIEWERS   — override fire order (comma-separated). Default: from stats file, or opus,grok,gemini
//   PARALLEL    — 1 = fire all reviewers concurrently (skip early-stop). Default: 0 = sequential.
//   SKIP_EARLY_STOP — 1 = fire all even if sequential. Default: 0 = stop early when resolved.

import { readFileSync, writeFileSync, mkdirSync, existsSync, statSync } from 'fs';
import { resolve, join, dirname as pathDirname } from 'path';
import { validateScrape } from './validate-scrape.mjs';
import { defaultReviewAnnots } from './reviewer-view.mjs';
import { fileURLToPath } from 'url';
import { spawnSync } from 'child_process';

const __dir = pathDirname(fileURLToPath(import.meta.url));
const LIZARD_DIR = process.env.LIZARD_DIR ?? resolve(__dir, '..');
const STEM = process.env.STEM;
if (!STEM) { console.error('ERROR: STEM env var required'); process.exit(1); }

const PARALLEL = process.env.PARALLEL === '1';
const SKIP_EARLY_STOP = process.env.SKIP_EARLY_STOP === '1';

const STATS_PATH = join(LIZARD_DIR, 'scripts', 'reviewer-stats.json');
const TMP_DIR = join('/tmp/lizard', STEM);
mkdirSync(TMP_DIR, { recursive: true });

// Reviewer registry: name -> runner path + output filename
const REGISTRY = {
  opus:   { script: 'run-opus-reviewer.mjs',   out: 'opus-review.md'   },
  gpt:    { script: 'run-gpt-reviewer.mjs',    out: 'gpt-review.md'    },
  grok:   { script: 'run-grok-reviewer.mjs',   out: 'grok-review.md'   },
  gemini: { script: 'run-gemini-reviewer.mjs', out: 'gemini-review.md' },
};

// 4-reviewer sequential mode (2026-04-27): gpt fires first (FN-dominant, drops most
// thumbs-downs early). Remaining annots flow to opus → gemini → grok. Any 👍 along
// the way auto-resolves (first-👍-wins). All-4-👎-G1 auto-resolves down. Residual
// (mixed 👎 or non-G1) escalates to Igor at Job 3a.
const DEFAULT_ORDER = ['gpt', 'opus', 'gemini', 'grok'];

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
console.error(`[run-job2] fire order: ${FIRE_ORDER.join(' → ')}${PARALLEL ? ' (PARALLEL)' : ''}`);

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

// ---------- Cycle integrity / freshness guards (2026-04-24) ----------
// Why this exists: on 2026-04-24 a 16-stem batch silently produced wrong-cycle
// output. 6 cycle-2 Scrum stems were re-scraped on 2026-04-23 (overwriting the
// scrape) but Job 1 was never re-run, so skeletons stayed at their 2026-04-20
// cycle-1 form. run-job2.mjs ran against stale skeletons and produced
// cycle-1-style task files — losing the cycle-2 unchanged-carry-forward logic.
// Per HOST_SOP.md §"Cycle detection (Job 1)": when tasks/<stem>.md already
// exists, skeleton MUST contain a `## Cycle 2 Review` section. We enforce that
// here as a defensive guard so a re-run-Job-2-only invocation can't bypass it.
//
// Override: SKIP_FRESHNESS_CHECK=1 (only for code-path tests / known-good rerun).
if (process.env.SKIP_FRESHNESS_CHECK !== '1') {
  const SCRAPE_PATH    = join(LIZARD_DIR, 'scrapes', `${STEM}.txt`);
  const PRIOR_TASK     = join(LIZARD_DIR, 'tasks', `${STEM}.md`);
  // MANIFEST_PATH overridable for tests (avoids mutating the real manifest)
  const MANIFEST_PATH  = process.env.MANIFEST_PATH ?? join(LIZARD_DIR, 'scrapes', '_manifest.json');
  const skelText       = readFileSync(SKELETON_PATH, 'utf8');
  const skelHasCycle2  = /^##\s+Cycle\s*2\s+Review\b/m.test(skelText);

  // Resolve manifest cycle for this stem (load once, used by Guards B + C).
  let manifestCycle = null;
  if (existsSync(MANIFEST_PATH)) {
    try {
      const manifest = JSON.parse(readFileSync(MANIFEST_PATH, 'utf8'));
      const entry = (manifest.tasks || []).find(t => t.stem === STEM);
      if (entry && typeof entry.cycle === 'number') manifestCycle = entry.cycle;
    } catch (e) {
      console.error(`[run-job2] WARN: could not parse manifest at ${MANIFEST_PATH}: ${e.message}`);
    }
  }

  // Guard A: if scrape is newer than skeleton, Job 1 wasn't re-run after the scrape.
  if (existsSync(SCRAPE_PATH)) {
    const scrapeMtime = statSync(SCRAPE_PATH).mtimeMs;
    const skelMtime   = statSync(SKELETON_PATH).mtimeMs;
    if (scrapeMtime > skelMtime + 1000) {  // 1s grace for clock skew
      console.error(`[run-job2] ERROR: skeleton is stale — scrape is newer than skeleton`);
      console.error(`  scrape:   ${SCRAPE_PATH} (${new Date(scrapeMtime).toISOString()})`);
      console.error(`  skeleton: ${SKELETON_PATH} (${new Date(skelMtime).toISOString()})`);
      console.error(`  fix: re-run Job 1 (skeleton generator) before Job 2`);
      console.error(`  bypass: SKIP_FRESHNESS_CHECK=1 (only if you know skeleton is correct)`);
      process.exit(4);
    }
  }

  // Guard B: cycle-2 detection — only fires when manifest doesn't already
  // tell us the cycle. False-positive case (2026-04-25): re-running Job 2 on
  // a cycle-1 stem within the same batch finds a task file from the earlier
  // run and would (wrongly) demand cycle-2 markers. If manifest says cycle 1,
  // we skip B entirely and let Guard C carry the load. If no manifest entry
  // exists, fall back to file-presence inference (original 2026-04-24 logic).
  if (manifestCycle !== 1 && existsSync(PRIOR_TASK) && !skelHasCycle2) {
    console.error(`[run-job2] ERROR: cycle-2 mismatch — prior task file exists but skeleton has no '## Cycle 2 Review' section`);
    console.error(`  prior task:  ${PRIOR_TASK}`);
    console.error(`  skeleton:    ${SKELETON_PATH}`);
    console.error(`  per HOST_SOP.md §'Cycle detection': cycle 2 requires Job 1 to append a '## Cycle 2 Review' section`);
    console.error(`  fix: re-run Job 1 to regenerate cycle-2 skeleton`);
    console.error(`  bypass: SKIP_FRESHNESS_CHECK=1 (only if you intentionally want cycle-1 logic on a returned task)`);
    process.exit(4);
  }

  // Guard C: manifest cycle field must match skeleton-detected cycle.
  if (manifestCycle === 2 && !skelHasCycle2) {
    console.error(`[run-job2] ERROR: cycle-2 mismatch — manifest declares cycle 2 but skeleton has no '## Cycle 2 Review' section`);
    console.error(`  manifest cycle: 2`);
    console.error(`  skeleton:       ${SKELETON_PATH}`);
    console.error(`  fix: re-run Job 1 to regenerate cycle-2 skeleton`);
    console.error(`  bypass: SKIP_FRESHNESS_CHECK=1 (override at your own risk)`);
    process.exit(4);
  }
  if (manifestCycle === 1 && skelHasCycle2) {
    console.error(`[run-job2] WARN: manifest says cycle 1 but skeleton has '## Cycle 2 Review' section — proceeding, but check manifest`);
  }

  // Guard D: cycle-2 [CHANGED] annotations MUST have a different prompt than
  // their cycle-1 counterpart. If skeleton marks an annot [CHANGED] but the
  // cycle-2 Full Prompt is byte-identical to the cycle-1 Full Prompt, the
  // scraper grabbed stale content (didn't capture the annotator's rewrite).
  // Don't let reviewers waste API calls on stale prompts.
  //
  // Background (2026-04-25): all 6 Scrum cycle-2 stems' status_logs only
  // showed cycle-1 submissions; scraper never captured cycle-2 prompts;
  // 10 [CHANGED] annots were silently reviewed against cycle-1 text. Igor
  // caught it manually on Scrum_53 A3 by spot-checking SA. Codify the check.
  if (skelHasCycle2) {
    const promptRe = /^####\s+Full Prompt\s*\n([\s\S]*?)(?=\n####|\n---)/m;

    // Collect cycle-1 prompts by annotation number (slice at next ## header).
    const c1Headers = [...skelText.matchAll(/^## Annotation (\d+)\s*$/gm)]
      .map(m => ({ n: parseInt(m[1], 10), start: m.index }));
    const c1Prompts = new Map();
    for (let i = 0; i < c1Headers.length; i++) {
      const end = i + 1 < c1Headers.length ? c1Headers[i + 1].start : skelText.length;
      const block = skelText.slice(c1Headers[i].start, end);
      const pm = promptRe.exec(block);
      if (pm) c1Prompts.set(c1Headers[i].n, pm[1].trim());
    }

    // Collect cycle-2 block positions, then slice to extract each block.
    const c2Headers = [...skelText.matchAll(/^### Cycle 2 — Annotation (\d+)\s*\[(CHANGED[^\]]*|UNCHANGED)\]/gm)]
      .map(m => ({ n: parseInt(m[1], 10), tag: m[2], start: m.index }));
    const stale = [];
    for (let i = 0; i < c2Headers.length; i++) {
      if (!/^CHANGED/.test(c2Headers[i].tag)) continue;
      const blockEnd = i + 1 < c2Headers.length ? c2Headers[i + 1].start : skelText.length;
      const block = skelText.slice(c2Headers[i].start, blockEnd);
      const pm = promptRe.exec(block);
      if (!pm) continue;
      const c1 = c1Prompts.get(c2Headers[i].n);
      const c2 = pm[1].trim();
      if (c1 && c1 === c2) stale.push(c2Headers[i].n);
    }
    if (stale.length) {
      console.error(`[run-job2] ERROR: cycle-2 [CHANGED] annotations have prompt identical to cycle-1 — likely stale scrape`);
      console.error(`  stale annotations: ${stale.map(n => `A${n}`).join(', ')}`);
      console.error(`  per HOST_SOP.md: cycle-2 [CHANGED] requires annotator's rewrite. Identical prompt = scraper missed the rewrite.`);
      console.error(`  fix: re-scrape from SA (or 'cp ~/Downloads/sa-scrape-<task_id>.txt scrapes/${STEM}.txt' if a fresh download exists), then re-run Job 1.`);
      console.error(`  bypass: SKIP_FRESHNESS_CHECK=1 (only if you've manually verified the cycle-2 prompts are correct)`);
      process.exit(4);
    }
  }

  // Guard E: scrape-completeness check. Refuses to proceed if scrape file is
  // broken in any way (missing fields, empty status_log, missing cycle-2
  // submission events). Catches the 2026-04-25 silent-broken-scrape failure
  // mode where 5 of 6 Scrum cycle-2 scrapes had empty STATUS_LOG_TEXT or
  // missed cycle-2 events; reviewers ran on stale prompts; verdicts invalid.
  if (existsSync(SCRAPE_PATH)) {
    const expectedCycle = manifestCycle ?? (skelHasCycle2 ? 2 : 1);
    const v = validateScrape(SCRAPE_PATH, { cycle: expectedCycle });
    if (!v.ok) {
      console.error(`[run-job2] ERROR: scrape file failed validation`);
      console.error(`  scrape: ${SCRAPE_PATH}`);
      console.error(`  reason: ${v.reason}`);
      console.error(`  fix: re-scrape from SA. If a fresh sa-scrape-<task_id>.txt is in ~/Downloads, cp it to ${SCRAPE_PATH}.`);
      console.error(`  bypass: SKIP_FRESHNESS_CHECK=1 (only if you've manually verified the scrape is correct)`);
      process.exit(4);
    }
    console.error(`[run-job2] scrape OK: ${v.summary}`);
  }

  console.error(`[run-job2] freshness OK: skeleton up-to-date${skelHasCycle2 ? ' (cycle 2)' : ' (cycle 1)'}${manifestCycle ? ` [manifest cycle ${manifestCycle}]` : ''}`);
}

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
// Sequential filtering (2026-04-25, Igor): each reviewer fires on a SUBSET of
// annots — only the ones still needing review (pending list). After each fire,
// dry-merge, and drop annots the merger now classifies as 'auto-resolved' from
// the pending list. Stop firing when pending list is empty.
//
// In PARALLEL mode, all reviewers fire on the same initial pending list (no
// filtering between) — useful for `SKIP_EARLY_STOP` debug runs and full coverage.
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

function dryMerge(reviewersRan) {
  // Run merger and return summary JSON only
  const envReviewers = reviewersRan.join(',');
  const r = spawnSync('node', [join(LIZARD_DIR, 'scripts', 'job2-merge.mjs')], {
    env: { ...process.env, STEM, LIZARD_DIR, REVIEWERS: envReviewers },
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

const runResults = [];
let lastSummary = null;

if (PARALLEL) {
  // PARALLEL: fire all reviewers concurrently on the initial pending list.
  // No filtering between reviewers — useful for SKIP_EARLY_STOP debug runs.
  console.error(`\n[run-job2] === firing ${FIRE_ORDER.length} reviewers in parallel ===`);
  const { spawn } = await import('child_process');
  const annotsEnv = pending.length ? pending.join(',') : '';
  const promises = FIRE_ORDER.map(name => new Promise(done => {
    const entry = REGISTRY[name];
    if (!entry) { done({ name, ok: false, err: 'unknown' }); return; }
    const outPath = join(TMP_DIR, entry.out);
    const started = Date.now();
    const env = { ...process.env, STEM, LIZARD_DIR, OUT: outPath };
    if (annotsEnv) env.ANNOTS = annotsEnv;
    const ch = spawn('node', [join(LIZARD_DIR, 'scripts', entry.script)], {
      env,
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    ch.stderr.on('data', d => process.stderr.write(`[${name}] ${d}`));
    ch.stdout.on('data', () => {}); // drop
    ch.on('close', (code, signal) => {
      const dur = ((Date.now() - started) / 1000).toFixed(1);
      if (code !== 0 || signal) {
        process.stderr.write(`[${name}] exit code=${code} signal=${signal} (${dur}s)\n`);
        done({ name, ok: false, err: signal ? `killed_${signal}` : 'exit_nonzero', dur }); return;
      }
      if (!existsSync(outPath)) { done({ name, ok: false, err: 'no_output', dur }); return; }
      const v = validateReviewerOutput(outPath, pending.length || EXPECTED_ANNOTS);
      if (!v.ok) {
        process.stderr.write(`[${name}] BAD OUTPUT (${dur}s): ${v.reason}\n`);
        done({ name, ok: false, err: `bad_output: ${v.reason}`, dur });
      } else {
        done({ name, ok: true, dur, parsed: v.found });
      }
    });
  }));
  const results = await Promise.all(promises);
  runResults.push(...results);
  const ran = results.filter(r => r.ok).map(r => r.name);
  lastSummary = dryMerge(ran);
} else {
  // SEQUENTIAL with per-annot filtering: each reviewer fires only on the
  // annots still in `pending`. After each, dry-merge and drop annots the
  // merger now classifies as `auto-resolved` from `pending`.
  for (const name of FIRE_ORDER) {
    if (pending.length === 0) {
      console.error(`[run-job2] ✓ pending list empty — stopping early before firing '${name}'`);
      break;
    }
    const res = runReviewer(name, pending);
    runResults.push(res);
    if (!res.ok) continue;
    const ran = runResults.filter(r => r.ok).map(r => r.name);
    lastSummary = dryMerge(ran);
    if (!SKIP_EARLY_STOP && lastSummary) {
      const stillPending = lastSummary.per_annotation
        .filter(a => a.decision === 'pending-igor' || a.decision === 'no_reviewer_output')
        .map(a => a.n);
      const dropped = pending.filter(n => !stillPending.includes(n));
      if (dropped.length) {
        console.error(`[run-job2] ${name} auto-resolved A${dropped.join(',A')} — dropping from pending`);
      }
      pending = stillPending;
      console.error(`[run-job2] pending after ${name}: ${pending.join(',') || '(none)'}`);
    }
  }
}

if (!lastSummary) {
  console.error('[run-job2] ERROR: no merge summary produced');
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
