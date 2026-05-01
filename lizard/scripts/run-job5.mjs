#!/usr/bin/env node
// run-job5.mjs — Job 5: Shadow sweep (per-stem actor).
//
// Like run-job4.mjs, this is the deterministic Node-side wrapper. The actual
// HAI form-fill flow is agent-driven via Chrome MCP using
// `scripts/fill-hai-shadow.js` blobs. This script handles:
//   --precheck (default): validate filesystem precondition, parse payload,
//     emit per-annot fire plan + sidecar state. Skip-disposition path: refuse
//     here so caller knows to invoke --skip-finalize directly.
//   --skip-finalize: for stems with task.qc_disposition in {Valid Skipped to
//     Hold, Valid Skipped to Skipped, Valid Skip to Unusable}: atomic mv
//     payload sa_applied/ → done/ without firing shadows.
//   --record-shadow: append a single shadow entry to the sidecar after the
//     agent confirms the shadow URL + time. Idempotent on duplicate {stem, n}.
//   --finalize: after all annots covered (sidecar count == payload annot count),
//     atomic mv payload + sidecar from sa_applied/ → done/.
//
// Usage:
//   STEM=<stem> node scripts/run-job5.mjs --precheck
//   STEM=<stem> node scripts/run-job5.mjs --skip-finalize
//   STEM=<stem> ANNOT_N=<n> SHADOW_UUID=<8> SHADOW_FULL_UUID=<full-uuid> RATING=<Approve|Reject> TIME_LOGGED=<HH:MM:SS> \
//     node scripts/run-job5.mjs --record-shadow
//   STEM=<stem> node scripts/run-job5.mjs --finalize
//
// Exit codes:
//   0 = OK
//   1 = IO / parse error
//   2 = precondition violated
//   3 = state inconsistency

import { readFileSync, writeFileSync, existsSync, renameSync, mkdirSync, unlinkSync } from 'fs';
import { join, resolve, dirname as pathDirname, basename } from 'path';
import { fileURLToPath } from 'url';

const __dir = pathDirname(fileURLToPath(import.meta.url));
const LIZARD_DIR = process.env.LIZARD_DIR ?? resolve(__dir, '..');
const STEM = process.env.STEM;
if (!STEM) {
  console.error('[run-job5] ERROR: STEM env var required');
  process.exit(1);
}

const MODE = process.argv.includes('--finalize')      ? 'finalize'
           : process.argv.includes('--skip-finalize') ? 'skip-finalize'
           : process.argv.includes('--record-shadow') ? 'record-shadow'
           : 'precheck';

const SHADOWS_DIR       = join(LIZARD_DIR, 'tasks', 'shadows');
const PAYLOAD_LIVE      = join(LIZARD_DIR, 'payloads', 'sa_applied', `${STEM}.yaml`);
const PAYLOAD_DONE_DIR  = join(LIZARD_DIR, 'payloads', 'done');
const PAYLOAD_DONE      = join(PAYLOAD_DONE_DIR, `${STEM}.yaml`);
const SIDECAR_LIVE      = join(LIZARD_DIR, 'payloads', 'sa_applied', `${STEM}.shadows.yaml`);
const SIDECAR_DONE      = join(PAYLOAD_DONE_DIR, `${STEM}.shadows.yaml`);
const QUEUE_FILE        = join(LIZARD_DIR, 'queue', `${STEM}.json`);

// ---------- per-stem orphan self-heal ----------
// If queue entry exists alongside an already-finalized done payload, this is
// an orphan from a crash between the atomic mv and rm queue/<S>.json. Clean
// up and exit; idempotent self-heal (codified 2026-04-29).
if (existsSync(QUEUE_FILE) && existsSync(PAYLOAD_DONE)) {
  unlinkSync(QUEUE_FILE);
  console.error(`[run-job5] ${STEM}: orphan queue entry detected (done/ already present) — cleaned up`);
  process.exit(0);
}

// ---------- precondition (all modes) ----------
if (existsSync(PAYLOAD_DONE)) {
  console.error(`[run-job5] REFUSE: ${PAYLOAD_DONE} already exists. Stem is past Job 5 (binary write-once gate).`);
  process.exit(2);
}
if (!existsSync(QUEUE_FILE)) {
  console.error(`[run-job5] REFUSE: ${QUEUE_FILE} missing. Stem is not in the active-work queue.`);
  process.exit(2);
}
if (!existsSync(PAYLOAD_LIVE)) {
  console.error(`[run-job5] ERROR: ${PAYLOAD_LIVE} missing. Job 4 not done (payload not in sa_applied/).`);
  process.exit(1);
}

// ---------- read payload ----------
const yaml = readFileSync(PAYLOAD_LIVE, 'utf8');
const stem    = /^\s*stem:\s*(\S+)/m.exec(yaml)?.[1];
const taskId  = /^\s*task_id:\s*(\d+)/m.exec(yaml)?.[1];
const saFile  = /^\s*sa_task_filename:\s*(\S+)/m.exec(yaml)?.[1];
const qcDisp  = /^\s*qc_disposition:\s*"?([^"\n]+?)"?\s*$/m.exec(yaml)?.[1];
if (!stem || stem !== STEM) {
  console.error(`[run-job5] ERROR: payload stem '${stem}' != env STEM '${STEM}'`);
  process.exit(1);
}
// V6 dropdown strings per Nikhil pinned 2026-04-29 in #lizard-reviewers.
const SKIP_DISPOSITIONS = ['Valid Skipped to Hold', 'Valid Skipped to Skipped', 'Valid Skip to Unusable'];
const isSkipDisposition = SKIP_DISPOSITIONS.includes(qcDisp);

// ---------- parse annotations ----------
function parseAnnots(yamlText) {
  const annots = [];
  const blocks = yamlText.split(/(?=^  - n: \d+\s*$)/m).slice(1);
  for (const blk of blocks) {
    const get = (re) => re.exec(blk)?.[1]?.trim();
    const n = parseInt(get(/^  - n:\s*(\d+)/m) ?? 0, 10);
    if (!n) continue;
    const action = get(/^      action:\s*(\S+)/m);
    const rating = get(/^      rating:\s*(\S+)/m);
    // Capture multi-line YAML `|` block scalar — terminate at next 6-space
    // field (`\n      <word>:`) or next annot (`\n  - n:`). Don't use `$`
    // anchor with /m — that matches end-of-line, truncating to first line.
    const promptM = /^      prompt:\s*\|\s*\n([\s\S]+?)(?=\n      \w|\n  - n:|\n*$(?![\s\S]))/m.exec(blk);
    const prompt = promptM ? promptM[1].split('\n').map(l => l.replace(/^        /, '')).join('\n').trim() : '';
    const answer = /^      answer:\s*"([^"]*)"/m.exec(blk)?.[1] ?? get(/^      answer:\s*(\S.*)/m) ?? '';
    annots.push({ n, action, rating, prompt, answer });
  }
  return annots;
}

const annots = parseAnnots(yaml);

// ---------- skip-disposition: short-circuit to done ----------
if (MODE === 'skip-finalize') {
  if (!isSkipDisposition) {
    console.error(`[run-job5] ERROR: --skip-finalize requires task.qc_disposition in {${SKIP_DISPOSITIONS.join(', ')}}; got '${qcDisp ?? '(unset)'}'`);
    process.exit(2);
  }
  mkdirSync(PAYLOAD_DONE_DIR, { recursive: true });
  renameSync(PAYLOAD_LIVE, PAYLOAD_DONE);
  // No sidecar; no shadows fired.
  // Pipeline exit gate: rm queue/<S>.json — stem leaves active-work set.
  unlinkSync(QUEUE_FILE);
  console.error(`[run-job5] ✓ ${STEM}: skip-disposition (${qcDisp}) — payload archived → ${PAYLOAD_DONE}, queue entry cleared, zero shadows fired (per Slack ruling)`);
  process.exit(0);
}

// ---------- record-shadow: append to sidecar ----------
if (MODE === 'record-shadow') {
  const annotN = parseInt(process.env.ANNOT_N ?? '0', 10);
  const uuid = process.env.SHADOW_UUID;
  const rating = process.env.RATING;
  const timeLogged = process.env.TIME_LOGGED;
  if (!annotN || !uuid || !rating || !timeLogged) {
    console.error('[run-job5] ERROR: --record-shadow requires ANNOT_N, SHADOW_UUID, RATING, TIME_LOGGED env vars');
    process.exit(1);
  }
  if (!/^[Aa]pprove|[Rr]eject$/.test(rating)) {
    console.error(`[run-job5] ERROR: RATING must be Approve|Reject, got '${rating}'`);
    process.exit(1);
  }

  // Read sidecar (or initialize).
  let sidecar = { stem: STEM, shadows: [] };
  if (existsSync(SIDECAR_LIVE)) {
    const sctxt = readFileSync(SIDECAR_LIVE, 'utf8');
    sidecar = parseSidecar(sctxt);
  }
  // Idempotency: skip if {stem, n} already recorded.
  if (sidecar.shadows.some(s => s.n === annotN)) {
    console.error(`[run-job5] A${annotN}: shadow already recorded in sidecar — skip`);
    process.exit(0);
  }
  sidecar.shadows.push({
    n: annotN,
    uuid,
    fired_at: new Date().toISOString(),
    rating,
    time_logged: timeLogged,
  });
  // Sort by n for stable ordering.
  sidecar.shadows.sort((a, b) => a.n - b.n);
  // Atomic write.
  const tmp = SIDECAR_LIVE + '.tmp';
  writeFileSync(tmp, serializeSidecar(sidecar), 'utf8');
  renameSync(tmp, SIDECAR_LIVE);

  // Write proof file tasks/shadows/<uuid>.md (idempotent).
  mkdirSync(SHADOWS_DIR, { recursive: true });
  const proofPath = join(SHADOWS_DIR, `${uuid}.md`);
  if (!existsSync(proofPath)) {
    const saFilename = /^\s*sa_task_filename:\s*(\S+)/m.exec(yaml)?.[1] ?? `${STEM}.json`;
    const annotData = annots.find(a => a.n === annotN);
    const prompt = annotData?.prompt ?? '(prompt not found in payload)';
    const answer = annotData?.answer ?? '(answer not found in payload)';
    const fullUuid = process.env.SHADOW_FULL_UUID ?? '';
    const haiLink = fullUuid
      ? `https://ai.joinhandshake.com/annotations/fellow/task/${fullUuid}/run`
      : `(full UUID not captured — prefix: ${uuid} — retrieve from HAI submission history)`;
    const proofContent = [
      `# Shadow Task: ${uuid}`,
      '',
      `- **SA Task ID:** ${saFilename}`,
      `- **Annotation:** ${annotN}`,
      `- **Cycle:** 1`,
      `- **Rating:** ${rating}`,
      `- **Fired at:** ${new Date().toISOString()}`,
      `- **HAI Link:** ${haiLink}`,
      `- **Status:** ✅ submitted`,
      `- **Review file:** [${STEM}.md](../${STEM}.md) → Annotation ${annotN} (cycle 1)`,
      '',
      '## Prompt',
      prompt,
      '',
      '## Rewrite Answer',
      answer,
      '',
    ].join('\n');
    writeFileSync(proofPath, proofContent, 'utf8');
    console.error(`[run-job5] ✓ proof file written: tasks/shadows/${uuid}.md`);
  }

  console.error(`[run-job5] ✓ ${STEM} A${annotN}: shadow ${uuid} recorded (${rating}, ${timeLogged}). ${sidecar.shadows.length}/${annots.length} annots covered.`);
  process.exit(0);
}

// ---------- finalize: atomic mv both files to done/ ----------
if (MODE === 'finalize') {
  if (!existsSync(SIDECAR_LIVE)) {
    console.error(`[run-job5] ERROR: ${SIDECAR_LIVE} missing — no shadows recorded yet. Run --record-shadow per annot first.`);
    process.exit(2);
  }
  const sidecar = parseSidecar(readFileSync(SIDECAR_LIVE, 'utf8'));
  if (sidecar.shadows.length !== annots.length) {
    console.error(`[run-job5] ERROR: sidecar has ${sidecar.shadows.length} shadows but payload has ${annots.length} annots. Fire missing shadows + record first.`);
    process.exit(3);
  }
  // Verify each annot covered.
  const missing = annots.map(a => a.n).filter(n => !sidecar.shadows.some(s => s.n === n));
  if (missing.length) {
    console.error(`[run-job5] ERROR: missing shadows for annots: ${JSON.stringify(missing)}`);
    process.exit(3);
  }
  // Verify every shadow has a proof file (catches proof-write regressions).
  const missingProof = sidecar.shadows.filter(s => !existsSync(join(SHADOWS_DIR, `${s.uuid}.md`)));
  if (missingProof.length) {
    console.error(`[run-job5] ERROR: missing proof files for shadows: ${JSON.stringify(missingProof.map(s => s.uuid))}`);
    console.error(`[run-job5] Run backfill or re-run --record-shadow with correct env vars to produce proof files.`);
    process.exit(3);
  }
  mkdirSync(PAYLOAD_DONE_DIR, { recursive: true });
  renameSync(PAYLOAD_LIVE, PAYLOAD_DONE);
  renameSync(SIDECAR_LIVE, SIDECAR_DONE);
  // Pipeline exit gate: rm queue/<S>.json — stem leaves active-work set.
  // Crash between the renames and this rm leaves an orphan queue file; the
  // per-stem self-heal at the top of this script (or the session-start bash
  // sweep) will clean it up on the next invocation.
  unlinkSync(QUEUE_FILE);
  console.error(`[run-job5] ✓ ${STEM}: ${sidecar.shadows.length} shadows fired, payload + sidecar archived → ${PAYLOAD_DONE_DIR}/, queue entry cleared`);
  process.exit(0);
}

// ---------- precheck (default): emit fire plan ----------
if (isSkipDisposition) {
  console.error(`\n[run-job5] ${STEM}: task.qc_disposition='${qcDisp}' — skip-disposition path.`);
  console.error(`[run-job5] Run: STEM=${STEM} node scripts/run-job5.mjs --skip-finalize`);
  console.log(JSON.stringify({
    stem: STEM,
    qc_disposition: qcDisp,
    skip: true,
    annot_count: annots.length,
    plan: 'mv payload to done/ without firing shadows',
  }, null, 2));
  process.exit(0);
}

// Read existing sidecar to identify already-fired annots (resumable runs).
let alreadyFired = [];
if (existsSync(SIDECAR_LIVE)) {
  const sidecar = parseSidecar(readFileSync(SIDECAR_LIVE, 'utf8'));
  alreadyFired = sidecar.shadows.map(s => s.n);
}

const fireQueue = annots.map(a => {
  const isDelete = a.action === 'delete';
  const isApprove = a.rating === 'thumbs-up';
  const haiRating = isApprove ? 'Approve' : 'Reject';
  return {
    n: a.n,
    task_id_field: saFile,
    annotation_n: a.n,
    prompt: isDelete ? 'annotation deleted' : a.prompt,
    answer: isDelete ? 'annotation deleted' : a.answer,
    hai_rating: haiRating,
    is_delete: isDelete,
    already_fired: alreadyFired.includes(a.n),
  };
});

const remaining = fireQueue.filter(f => !f.already_fired);

console.log(JSON.stringify({
  stem: STEM,
  task_id: taskId,
  qc_disposition: qcDisp ?? '(unset — derive from per-annot)',
  annot_count: annots.length,
  already_fired: alreadyFired,
  remaining_count: remaining.length,
  fire_queue: remaining,
  finalize_when_done: PAYLOAD_DONE,
}, null, 2));

console.error(`\n[run-job5] ${STEM}: ${remaining.length} shadows to fire (of ${annots.length} total; ${alreadyFired.length} already covered).`);
console.error(`[run-job5] Agent: follow CLAUDE.md §Job 5 to fire each via Chrome MCP + scripts/fill-hai-shadow.js.`);
console.error(`[run-job5] Per fire, run: STEM=${STEM} ANNOT_N=<n> SHADOW_UUID=<8> SHADOW_FULL_UUID=<full-uuid> RATING=<Approve|Reject> TIME_LOGGED=<HH:MM:SS> node scripts/run-job5.mjs --record-shadow`);
console.error(`[run-job5] When all annots covered: STEM=${STEM} node scripts/run-job5.mjs --finalize`);

// ---------- helpers ----------
function parseSidecar(txt) {
  const stem = /^\s*stem:\s*(\S+)/m.exec(txt)?.[1];
  const shadows = [];
  const blocks = txt.split(/(?=^  - n: \d+\s*$)/m).slice(1);
  for (const blk of blocks) {
    const get = (re) => re.exec(blk)?.[1]?.trim();
    const n = parseInt(get(/^  - n:\s*(\d+)/m) ?? 0, 10);
    if (!n) continue;
    shadows.push({
      n,
      uuid:        get(/^    uuid:\s*(\S+)/m),
      fired_at:    get(/^    fired_at:\s*(\S+)/m),
      rating:      get(/^    rating:\s*(\S+)/m),
      time_logged: get(/^    time_logged:\s*"([^"]*)"/m) ?? get(/^    time_logged:\s*(\S+)/m),
    });
  }
  return { stem, shadows };
}

function serializeSidecar(sidecar) {
  const lines = [`stem: ${sidecar.stem}`, 'shadows:'];
  for (const s of sidecar.shadows) {
    lines.push(`  - n: ${s.n}`);
    lines.push(`    uuid: ${s.uuid}`);
    lines.push(`    fired_at: ${s.fired_at}`);
    lines.push(`    rating: ${s.rating}`);
    lines.push(`    time_logged: "${s.time_logged}"`);
  }
  return lines.join('\n') + '\n';
}
