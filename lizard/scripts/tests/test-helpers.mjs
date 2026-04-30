// test-helpers.mjs
// Shared helpers for Lizard pipeline tests. Each test file imports these.
//
// Design goals:
//   - Tests exit 0 on pass, 1 on fail. Run directly: `node scripts/tests/<file>.mjs`
//   - Tests use /tmp/lizard-tests/ to avoid contaminating real /tmp/lizard/<stem>/
//   - Fixture = Report_Dashboard_Scrum_Dashboard_6 (has skeleton + screenshot in repo)

import '../log-ts.mjs'; // timestamps all console.error output
import { existsSync, readFileSync, mkdirSync, rmSync, statSync } from 'fs';
import { join, dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import { spawnSync } from 'child_process';

const __dir = dirname(fileURLToPath(import.meta.url));
export const LIZARD_DIR = resolve(__dir, '..', '..');
// Server_Dashboard_43: 2 annots (faster tests) + chart-type image (more
// representative of the dataset than kanban). Swapped 2026-04-24 after full
// 4-reviewer validation on Scrum_6 passed.
export const FIXTURE_STEM = 'Report_Dashboard_Server_Dashboard_43';

export const PIPELINE_FIXTURE_STEM = 'Report_Dashboard_Server_Dashboard_38';

export const TESTS_TMP = '/tmp/lizard-tests';

const GREEN = '\x1b[32m';
const RED = '\x1b[31m';
const YEL = '\x1b[33m';
const DIM = '\x1b[2m';
const RST = '\x1b[0m';

let currentTest = null;
let stepCount = 0;
let failCount = 0;

export function startTest(name) {
  currentTest = { name, started: Date.now() };
  stepCount = 0;
  failCount = 0;
  console.error(`\n[TEST] ${name}`);
}

export function step(description, fn) {
  stepCount++;
  const label = `  - ${description}`;
  try {
    const detail = fn();
    console.error(`${label} ... ${GREEN}OK${RST}${detail ? ` ${DIM}${detail}${RST}` : ''}`);
    return true;
  } catch (e) {
    failCount++;
    console.error(`${label} ... ${RED}FAIL${RST} ${e.message}`);
    return false;
  }
}

export function endTest() {
  const dur = ((Date.now() - currentTest.started) / 1000).toFixed(1);
  const ok = failCount === 0;
  const status = ok ? `${GREEN}PASS${RST}` : `${RED}FAIL${RST} (${failCount}/${stepCount})`;
  console.error(`[TEST] ${currentTest.name}: ${status} ${DIM}(${dur}s)${RST}`);
  process.exit(ok ? 0 : 1);
}

// Per-test tmp dir — clean and recreate.
export function freshTmpDir(subname) {
  const d = join(TESTS_TMP, subname);
  try { rmSync(d, { recursive: true, force: true }); } catch {}
  mkdirSync(d, { recursive: true });
  return d;
}

// Same STRICT regex as job2-merge.mjs + run-job2.mjs validateReviewerOutput.
// Reviewer must emit `## Annotation N` (markdown h2+). Keep all three in sync.
export function parseAnnotations(text) {
  const annRe = /^##+\s+(?:Cycle\s*2\s*—\s*)?Annotation\s+(\d+)\b/gm;
  const ns = new Set();
  let m;
  while ((m = annRe.exec(text)) !== null) ns.add(parseInt(m[1], 10));
  return [...ns].sort((a, b) => a - b);
}

// Parse rating from a per-annotation block (same laxity as merger).
export function parseRating(block) {
  const m = /\bRating\b[^\n]{0,80}?\b(thumbs[- ]?up|thumbs[- ]?down|N\/A)\b/i.exec(block);
  return m ? m[1].toLowerCase().replace(' ', '-') : null;
}

export function parseFinalAnswer(block) {
  const m = /\*\*Final Rewrite Answer(?:\s*\(REQUIRED\))?:\*\*\s*(.+?)(?=\n\s*\n|\n\*\*|\n####|\n##|\n---|$)/is.exec(block);
  return m ? m[1].trim() : null;
}

// Same regex as run-job2.validateReviewerOutput per-block check + job2-merge parser.
// Returns the raw bracketed flag string (e.g. "G1, Type 7") or null if absent.
export function parseFlagsField(block) {
  const m = /^\s*-?\s*\*\*Flags:\*\*\s*\[([^\]]*)\]/mi.exec(block);
  return m ? m[1] : null;
}

// Split reviewer text into per-annotation blocks by STRICT `## Annotation N` / `### Annotation N`.
export function splitAnnotationBlocks(text) {
  const re = /^##+\s+(?:Cycle\s*2\s*—\s*)?Annotation\s+(\d+)\b.*$/gm;
  const locs = [];
  let m;
  while ((m = re.exec(text)) !== null) locs.push({ n: parseInt(m[1], 10), start: m.index });
  const blocks = new Map();
  for (let i = 0; i < locs.length; i++) {
    const end = (i + 1 < locs.length) ? locs[i + 1].start : text.length;
    blocks.set(locs[i].n, text.slice(locs[i].start, end));
  }
  return blocks;
}

export function countSkeletonAnnotations(stem = FIXTURE_STEM) {
  const p = join(LIZARD_DIR, 'tasks', 'skeleton', `${stem}.md`);
  if (!existsSync(p)) throw new Error(`skeleton not found: ${p}`);
  const t = readFileSync(p, 'utf8');
  return parseAnnotations(t).length;
}

// Run a reviewer script as a child process. Returns {ok, outPath, text, exitCode, stderr, dur}.
// Timeout is enforced (default 5min) — gpt-5.5 reasoning can take a while.
export function runReviewerScript({ reviewer, stem = FIXTURE_STEM, outDir, timeoutMs = 300_000 }) {
  const REGISTRY = {
    opus:   'run-opus-reviewer.mjs',
    gpt:    'run-gpt-reviewer.mjs',
    grok:   'run-grok-reviewer.mjs',
    gemini: 'run-gemini-reviewer.mjs',
  };
  const script = REGISTRY[reviewer];
  if (!script) throw new Error(`unknown reviewer: ${reviewer}`);
  const outPath = join(outDir, `${reviewer}-review.md`);
  const started = Date.now();
  // stdio: child stderr is INHERITED so user sees reviewer progress live
  // (model id, token counts, retries) instead of waiting 5min in silence.
  // Trade-off: child stderr isn't captured into memory. On failure the live
  // stream above IS the diagnostic — scroll up.
  console.error(`[runReviewerScript] launching ${script} (stem=${stem}) — child stderr streamed live below:`);
  const r = spawnSync('node', [join(LIZARD_DIR, 'scripts', script)], {
    env: { ...process.env, STEM: stem, LIZARD_DIR, OUT: outPath },
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'inherit'],
    timeout: timeoutMs,
    maxBuffer: 50 * 1024 * 1024,
  });
  const dur = ((Date.now() - started) / 1000).toFixed(1);
  const text = existsSync(outPath) ? readFileSync(outPath, 'utf8') : '';
  return {
    ok: r.status === 0 && existsSync(outPath),
    outPath,
    text,
    exitCode: r.status,
    stderr: '(streamed live to parent — not captured)',
    dur,
    sizeBytes: existsSync(outPath) ? statSync(outPath).size : 0,
  };
}

// Invariant assertions — throw if violated.
export function assert(cond, msg) { if (!cond) throw new Error(msg); }

export function assertReviewerOutputShape(text, expectedAnnotCount, ctx = '') {
  const ns = parseAnnotations(text);
  assert(ns.length >= expectedAnnotCount,
    `${ctx}parsed ${ns.length}/${expectedAnnotCount} annotations (need ≥${expectedAnnotCount})`);
  const blocks = splitAnnotationBlocks(text);
  for (const n of ns.slice(0, expectedAnnotCount)) {
    const block = blocks.get(n) ?? '';
    const rating = parseRating(block);
    assert(rating, `${ctx}annotation ${n}: no Rating line found`);
    const finalAns = parseFinalAnswer(block);
    assert(finalAns, `${ctx}annotation ${n}: no Final Rewrite Answer found`);
    // Flags is required by run-job2.validateReviewerOutput as of 2026-04-24.
    // Empty list ([]) is fine; missing field is not.
    const flagsRaw = parseFlagsField(block);
    assert(flagsRaw !== null, `${ctx}annotation ${n}: no **Flags:** [...] line found`);
  }
  return { parsed: ns.length, blocks: blocks.size };
}
