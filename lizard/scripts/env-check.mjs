#!/usr/bin/env node
// env-check.mjs
// Smoke-test the execution environment BEFORE trusting a Job 2 rerun.
// Runs in ~1s, catches the four known failure modes that silently produce
// stub reviews / missing reviewer files.
//
// Usage:
//   node scripts/env-check.mjs
//   exits 0 if environment can run Job 2, nonzero otherwise.

import { existsSync, statSync, mkdirSync, writeFileSync, unlinkSync, readFileSync } from 'fs';
import { execSync, spawnSync } from 'child_process';
import { join, dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const __dir = dirname(fileURLToPath(import.meta.url));
const LIZARD_DIR = process.env.LIZARD_DIR ?? resolve(__dir, '..');
const checks = [];

// Resolve fire order the same way run-job2.mjs does (REVIEWERS env override,
// else parse DEFAULT_ORDER from run-job2.mjs source). Env-check only validates
// the reviewers we actually plan to fire — checking grok/gemini keys when
// the run is gpt+opus only is just noise.
function resolveFireOrder() {
  if (process.env.REVIEWERS) {
    return process.env.REVIEWERS.split(',').map(s => s.trim()).filter(Boolean);
  }
  try {
    const src = readFileSync(join(LIZARD_DIR, 'scripts', 'run-job2.mjs'), 'utf8');
    const m = /const DEFAULT_ORDER\s*=\s*\[([^\]]+)\]/.exec(src);
    if (m) return m[1].split(',').map(s => s.trim().replace(/['"]/g, '')).filter(Boolean);
  } catch {}
  return ['gpt', 'opus'];
}
const FIRE_ORDER = resolveFireOrder();

function check(name, fn) {
  try {
    const detail = fn();
    checks.push({ name, ok: true, detail: detail ?? '' });
  } catch (e) {
    checks.push({ name, ok: false, detail: e.message });
  }
}

// 1. sips (macOS image-crop tool) — all 4 reviewers call it via execSync.
//    Linux sandboxes will have `convert`/`identify` from ImageMagick instead.
check('sips (reviewer image-crop tool)', () => {
  execSync('sips --version', { stdio: 'pipe' });
  return 'present';
});

// 2. API keys — only for reviewers in the active fire order. Avoids spurious
// failures when running 2-reviewer mode (gpt+opus) without grok/gemini keys.
const KEY_MAP = [
  ['OPENAI_API_KEY', 'gpt'],
  ['XAI_API_KEY',    'grok'],
  ['GEMINI_API_KEY', 'gemini'],
];
for (const [envvar, reviewer] of KEY_MAP.filter(([, r]) => FIRE_ORDER.includes(r))) {
  check(`${envvar} for ${reviewer}`, () => {
    // Load .env if present (same logic as reviewer scripts)
    if (!process.env[envvar]) {
      const dotenv = join(LIZARD_DIR, '.env');
      if (existsSync(dotenv)) {
        for (const line of readFileSync(dotenv, 'utf8').split('\n')) {
          const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
          if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
        }
      }
    }
    if (!process.env[envvar]) throw new Error('not set');
    return `set (${process.env[envvar].length} chars)`;
  });
}

// 3. claude CLI — only when opus is firing.
if (FIRE_ORDER.includes('opus')) {
  check('claude CLI (opus reviewer)', () => {
    const r = spawnSync('claude', ['--version'], { encoding: 'utf8' });
    if (r.status !== 0) throw new Error('not on PATH or errored');
    return (r.stdout || '').trim() || 'ok';
  });
}

// 4. /tmp/lizard writable by current user.
//    Prior Cowork sessions leave artifacts owned by different UIDs; if so,
//    reviewer writes will fail with EACCES and produce no output.
check('/tmp/lizard writable', () => {
  const probeDir = '/tmp/lizard/_envcheck_probe';
  mkdirSync(probeDir, { recursive: true });
  const probeFile = join(probeDir, 'write.tmp');
  writeFileSync(probeFile, 'ok');
  unlinkSync(probeFile);
  // also check for leftover stem dirs owned by another uid
  const leftover = [];
  try {
    for (const d of require('fs').readdirSync('/tmp/lizard')) {
      const p = join('/tmp/lizard', d);
      const s = statSync(p);
      if (s.uid !== process.getuid()) leftover.push(`${d} (uid=${s.uid})`);
    }
  } catch {}
  return leftover.length ? `writable; but foreign-uid leftovers: ${leftover.slice(0,3).join(', ')}${leftover.length>3?'…':''}` : 'writable';
});

// 5. (removed 2026-04-24) background-process survival.
//    Was relevant when reviewers were launched detached and polled. Current
//    pipeline uses spawnSync / awaited spawn, so child survival across shell
//    exit is irrelevant. Check fails spuriously on some Macs (setsid behavior)
//    and gates the whole env-check on a non-issue. Kept as comment for history.

// 6. Node version (run-*.mjs use modern features).
check('node >= 20', () => {
  const v = process.versions.node.split('.').map(Number);
  if (v[0] < 20) throw new Error(`have ${process.versions.node}`);
  return `v${process.versions.node}`;
});

// 7. LIZARD_DIR looks right.
check('LIZARD_DIR layout', () => {
  for (const p of ['scripts/run-job2.mjs', 'config/reviewers.yaml', 'tasks', 'scrapes']) {
    if (!existsSync(join(LIZARD_DIR, p))) throw new Error(`missing ${p}`);
  }
  return LIZARD_DIR;
});

// ---- report ----
const pass = checks.filter(c => c.ok).length;
const fail = checks.filter(c => !c.ok).length;
console.log('');
console.log('Environment check — Job 2 rerun readiness');
console.log(`Active fire order: ${FIRE_ORDER.join(' → ')}`);
console.log('─'.repeat(60));
for (const c of checks) {
  const icon = c.ok ? '✓' : '✗';
  const detail = c.detail ? `  ${c.detail}` : '';
  console.log(`${icon} ${c.name.padEnd(40)}${detail}`);
}
console.log('─'.repeat(60));
console.log(`${pass} pass / ${fail} fail`);
if (fail) {
  console.log('');
  console.log('RESULT: environment cannot run Job 2 cleanly.');
  console.log('Fix failures above, or run the pipeline from a host where all checks pass.');
  process.exit(1);
}
console.log('');
console.log('RESULT: environment ready for Job 2.');
