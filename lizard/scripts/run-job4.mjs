#!/usr/bin/env node
// run-job4.mjs — Job 4: HAI shadow fire (per-stem actor).
//
// Pipeline order (post-2026-05-02 swap): 0 → 1 → 2 → 3a → 3b → 4 (this) →
// resolution gate → 5 (SA push, terminal).
//
// Reads payloads/<S>.yaml (3b output, write-once). Fires one HAI shadow per
// annotation via Chrome MCP + scripts/fill-hai-shadow.js. Captures HAI's
// post-submit LLM verdict per annotation (capture-don't-stop). On finalize,
// atomically moves payload + sidecar to payloads/shadow_applied/. Queue file
// stays — Job 5 (SA push) is responsible for queue removal.
//
// Modes:
//   --precheck (default): validate filesystem precondition, parse payload,
//     emit per-annot fire plan + sidecar state. Skip-disposition shortcut:
//     refuse here so caller knows to invoke --skip-finalize directly.
//   --skip-finalize: for stems with task.qc_disposition in skip-set: atomic
//     mv payload payloads/<S>.yaml → done/ AND rm queue (full pipeline exit).
//     No shadows fired, no SA push needed.
//   --record-shadow: append a single shadow entry to the sidecar after the
//     agent confirms the shadow URL + time + HAI LLM verdict. Idempotent on
//     duplicate {stem, n}.
//   --finalize: after all annots covered, atomic mv payload from
//     payloads/<S>.yaml → payloads/shadow_applied/<S>.yaml. Sidecar is
//     already in shadow_applied/. NO queue removal (that's Job 5).
//
// Sidecar fields per annot (codified 2026-05-02):
//   n, uuid, fired_at, rating, time_logged, verdict_source (auto|igor —
//   mirrors payload), hai_llm_eval (clean|warning|reject — captured from
//   HAI post-submit modal; default 'clean' until DOM probe lands),
//   hai_llm_comment (text), reclaimed (bool — set true post /reclaim),
//   reclaim_diff (text — pre/post answer diff).
//
// Resolution gate (read by Job 5 precondition):
//   Job 5 refuses to fire if any annot has:
//     verdict_source == 'auto' AND hai_llm_eval != 'clean' AND
//     sidecar top-level igor_resolved != true.
//   Igor resolves via mark-resolved.mjs (no-flip) or run-reclaim.mjs (flip).
//
// Usage:
//   STEM=<stem> node scripts/run-job4.mjs --precheck
//   STEM=<stem> node scripts/run-job4.mjs --skip-finalize
//   STEM=<stem> ANNOT_N=<n> SHADOW_UUID=<8> SHADOW_FULL_UUID=<full-uuid> \
//     RATING=<Approve|Reject> TIME_LOGGED=<HH:MM:SS> \
//     [HAI_LLM_EVAL=<clean|warning|reject> HAI_LLM_COMMENT=<text>] \
//     node scripts/run-job4.mjs --record-shadow
//   STEM=<stem> node scripts/run-job4.mjs --finalize
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
  console.error('[run-job4] ERROR: STEM env var required');
  process.exit(1);
}

const MODE = process.argv.includes('--finalize')      ? 'finalize'
           : process.argv.includes('--skip-finalize') ? 'skip-finalize'
           : process.argv.includes('--record-shadow') ? 'record-shadow'
           : 'precheck';

const SHADOWS_DIR           = join(LIZARD_DIR, 'tasks', 'shadows');
const PAYLOAD_LIVE          = join(LIZARD_DIR, 'payloads', `${STEM}.yaml`);
const SHADOW_APPLIED_DIR    = join(LIZARD_DIR, 'payloads', 'shadow_applied');
const PAYLOAD_SHADOW_APPLIED= join(SHADOW_APPLIED_DIR, `${STEM}.yaml`);
const SIDECAR_LIVE          = join(SHADOW_APPLIED_DIR, `${STEM}.shadows.yaml`);
const PAYLOAD_DONE_DIR      = join(LIZARD_DIR, 'payloads', 'done');
const PAYLOAD_DONE          = join(PAYLOAD_DONE_DIR, `${STEM}.yaml`);
const QUEUE_FILE            = join(LIZARD_DIR, 'queue', `${STEM}.json`);

// ---------- precondition (all modes except skip-finalize) ----------
if (existsSync(PAYLOAD_DONE) && !existsSync(PAYLOAD_SHADOW_APPLIED) && !existsSync(PAYLOAD_LIVE)) {
  console.error(`[run-job4] REFUSE: ${PAYLOAD_DONE} already exists. Stem is past Job 5 (terminal).`);
  process.exit(2);
}
if (existsSync(PAYLOAD_SHADOW_APPLIED) && MODE !== 'record-shadow' && MODE !== 'finalize') {
  console.error(`[run-job4] REFUSE: ${PAYLOAD_SHADOW_APPLIED} already exists. Stem is past Job 4 (shadow_applied gate).`);
  process.exit(2);
}
if (!existsSync(QUEUE_FILE)) {
  console.error(`[run-job4] REFUSE: ${QUEUE_FILE} missing. Stem is not in the active-work queue.`);
  process.exit(2);
}

// For skip-finalize: payload may live in payloads/ (normal case at this point)
// For other modes: payload must be in payloads/ (shadow not yet finalized) OR
//   for record-shadow during in-flight work, may already be in shadow_applied/
//   (multi-annot stem mid-fire — shouldn't happen but tolerate)
let activePayloadPath = null;
if (existsSync(PAYLOAD_LIVE)) activePayloadPath = PAYLOAD_LIVE;
else if (existsSync(PAYLOAD_SHADOW_APPLIED)) activePayloadPath = PAYLOAD_SHADOW_APPLIED;
else {
  console.error(`[run-job4] ERROR: payload missing in both payloads/ and payloads/shadow_applied/. Job 3b not done?`);
  process.exit(1);
}

// ---------- read payload ----------
const yaml = readFileSync(activePayloadPath, 'utf8');
const stem    = /^\s*stem:\s*(\S+)/m.exec(yaml)?.[1];
const taskId  = /^\s*task_id:\s*(\d+)/m.exec(yaml)?.[1];
const saFile  = /^\s*sa_task_filename:\s*(\S+)/m.exec(yaml)?.[1];
const qcDisp  = /^\s*qc_disposition:\s*"?([^"\n]+?)"?\s*$/m.exec(yaml)?.[1];
if (!stem || stem !== STEM) {
  console.error(`[run-job4] ERROR: payload stem '${stem}' != env STEM '${STEM}'`);
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
    const verdictSource = get(/^      verdict_source:\s*(\S+)/m) ?? 'auto';
    // Capture multi-line YAML `|` block scalar — terminate at next 6-space
    // field (`\n      <word>:`) or next annot (`\n  - n:`). Don't use `$`
    // anchor with /m — that matches end-of-line, truncating to first line.
    const promptM = /^      prompt:\s*\|\s*\n([\s\S]+?)(?=\n      \w|\n  - n:|\n*$(?![\s\S]))/m.exec(blk);
    const prompt = promptM ? promptM[1].split('\n').map(l => l.replace(/^        /, '')).join('\n').trim() : '';
    const answer = /^      answer:\s*"([^"]*)"/m.exec(blk)?.[1] ?? get(/^      answer:\s*(\S.*)/m) ?? '';
    annots.push({ n, action, rating, verdictSource, prompt, answer });
  }
  return annots;
}

const annots = parseAnnots(yaml);

// ---------- skip-disposition: short-circuit straight to done ----------
if (MODE === 'skip-finalize') {
  if (!isSkipDisposition) {
    console.error(`[run-job4] ERROR: --skip-finalize requires task.qc_disposition in {${SKIP_DISPOSITIONS.join(', ')}}; got '${qcDisp ?? '(unset)'}'`);
    process.exit(2);
  }
  // Skip-disposition stems exit the pipeline entirely (no shadows, no SA push).
  // Direct mv: payloads/<S>.yaml → payloads/done/<S>.yaml + rm queue.
  if (activePayloadPath !== PAYLOAD_LIVE) {
    console.error(`[run-job4] ERROR: skip-finalize requires payload at ${PAYLOAD_LIVE}; found at ${activePayloadPath}`);
    process.exit(2);
  }
  mkdirSync(PAYLOAD_DONE_DIR, { recursive: true });
  renameSync(PAYLOAD_LIVE, PAYLOAD_DONE);
  // No sidecar (no shadows fired).
  unlinkSync(QUEUE_FILE);
  console.error(`[run-job4] ✓ ${STEM}: skip-disposition (${qcDisp}) — payload archived → ${PAYLOAD_DONE}, queue entry cleared, zero shadows fired (per Slack ruling)`);
  process.exit(0);
}

// ---------- record-shadow: append to sidecar ----------
if (MODE === 'record-shadow') {
  const annotN = parseInt(process.env.ANNOT_N ?? '0', 10);
  const uuid = process.env.SHADOW_UUID;
  const rating = process.env.RATING;
  const timeLogged = process.env.TIME_LOGGED;
  // Capture-don't-stop fields (default 'clean' / '' until DOM probe lands).
  const haiLlmEval = process.env.HAI_LLM_EVAL ?? 'clean';
  const haiLlmComment = process.env.HAI_LLM_COMMENT ?? '';
  if (!annotN || !uuid || !rating || !timeLogged) {
    console.error('[run-job4] ERROR: --record-shadow requires ANNOT_N, SHADOW_UUID, RATING, TIME_LOGGED env vars');
    process.exit(1);
  }
  if (!/^[Aa]pprove|[Rr]eject$/.test(rating)) {
    console.error(`[run-job4] ERROR: RATING must be Approve|Reject, got '${rating}'`);
    process.exit(1);
  }
  if (!/^(clean|warning|reject)$/.test(haiLlmEval)) {
    console.error(`[run-job4] ERROR: HAI_LLM_EVAL must be clean|warning|reject, got '${haiLlmEval}'`);
    process.exit(1);
  }

  // Read sidecar (or initialize). Sidecar lives in shadow_applied/ from the
  // first record (we mkdir on demand).
  mkdirSync(SHADOW_APPLIED_DIR, { recursive: true });
  let sidecar = { stem: STEM, igor_resolved: false, shadows: [] };
  if (existsSync(SIDECAR_LIVE)) {
    const sctxt = readFileSync(SIDECAR_LIVE, 'utf8');
    sidecar = parseSidecar(sctxt);
  }
  // Idempotency: skip if {stem, n} already recorded.
  if (sidecar.shadows.some(s => s.n === annotN)) {
    console.error(`[run-job4] A${annotN}: shadow already recorded in sidecar — skip`);
    process.exit(0);
  }
  // Look up verdict_source from the payload (auto|igor — drives Job 5 gate).
  const annotData = annots.find(a => a.n === annotN);
  const verdictSource = annotData?.verdictSource ?? 'auto';
  sidecar.shadows.push({
    n: annotN,
    uuid,
    fired_at: new Date().toISOString(),
    rating,
    time_logged: timeLogged,
    verdict_source: verdictSource,
    hai_llm_eval: haiLlmEval,
    hai_llm_comment: haiLlmComment,
    reclaimed: false,
    reclaim_diff: null,
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
    const saFilename = saFile ?? `${STEM}.json`;
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
      `- **Verdict source:** ${verdictSource}`,
      `- **HAI LLM eval:** ${haiLlmEval}`,
      ...(haiLlmComment ? [`- **HAI LLM comment:** ${haiLlmComment}`] : []),
      `- **Review file:** [${STEM}.md](../${STEM}.md) → Annotation ${annotN}`,
      '',
      '## Prompt',
      prompt,
      '',
      '## Rewrite Answer',
      answer,
      '',
    ].join('\n');
    writeFileSync(proofPath, proofContent, 'utf8');
    console.error(`[run-job4] ✓ proof file written: tasks/shadows/${uuid}.md`);
  }

  console.error(`[run-job4] ✓ ${STEM} A${annotN}: shadow ${uuid} recorded (${rating}, ${timeLogged}, eval=${haiLlmEval}). ${sidecar.shadows.length}/${annots.length} annots covered.`);
  process.exit(0);
}

// ---------- finalize: atomic mv payload to shadow_applied/ ----------
if (MODE === 'finalize') {
  if (!existsSync(SIDECAR_LIVE)) {
    console.error(`[run-job4] ERROR: ${SIDECAR_LIVE} missing — no shadows recorded yet. Run --record-shadow per annot first.`);
    process.exit(2);
  }
  const sidecar = parseSidecar(readFileSync(SIDECAR_LIVE, 'utf8'));
  if (sidecar.shadows.length !== annots.length) {
    console.error(`[run-job4] ERROR: sidecar has ${sidecar.shadows.length} shadows but payload has ${annots.length} annots. Fire missing shadows + record first.`);
    process.exit(3);
  }
  // Verify each annot covered.
  const missing = annots.map(a => a.n).filter(n => !sidecar.shadows.some(s => s.n === n));
  if (missing.length) {
    console.error(`[run-job4] ERROR: missing shadows for annots: ${JSON.stringify(missing)}`);
    process.exit(3);
  }
  // Verify every shadow has a proof file (catches proof-write regressions).
  const missingProof = sidecar.shadows.filter(s => !existsSync(join(SHADOWS_DIR, `${s.uuid}.md`)));
  if (missingProof.length) {
    console.error(`[run-job4] ERROR: missing proof files for shadows: ${JSON.stringify(missingProof.map(s => s.uuid))}`);
    process.exit(3);
  }
  // Atomic mv payload → shadow_applied/. Sidecar already lives there.
  mkdirSync(SHADOW_APPLIED_DIR, { recursive: true });
  if (existsSync(PAYLOAD_LIVE)) {
    renameSync(PAYLOAD_LIVE, PAYLOAD_SHADOW_APPLIED);
  }
  // NO queue removal — Job 5 (SA push) is the pipeline exit gate.
  // Print gate-state advisory: tell caller whether Job 5 is auto-eligible
  // or gated on Igor's resolution.
  const gatedAnnots = sidecar.shadows.filter(s =>
    s.verdict_source === 'auto' && s.hai_llm_eval !== 'clean'
  );
  if (gatedAnnots.length === 0) {
    console.error(`[run-job4] ✓ ${STEM}: ${sidecar.shadows.length} shadows fired, payload archived → ${PAYLOAD_SHADOW_APPLIED}. Gate clean — Job 5 auto-eligible.`);
  } else {
    console.error(`[run-job4] ✓ ${STEM}: ${sidecar.shadows.length} shadows fired, payload archived → ${PAYLOAD_SHADOW_APPLIED}.`);
    console.error(`[run-job4] ⚠  Resolution gate ENGAGED: ${gatedAnnots.length} auto-verdict annot(s) with non-clean HAI LLM eval — Job 5 will refuse until resolved.`);
    for (const a of gatedAnnots) {
      console.error(`[run-job4]    A${a.n}: eval=${a.hai_llm_eval}${a.hai_llm_comment ? ' — ' + a.hai_llm_comment.slice(0, 80) : ''}`);
    }
    console.error(`[run-job4] Resolve via:  STEM=${STEM} node scripts/mark-resolved.mjs   (no flip)`);
    console.error(`[run-job4] Or flip via:  STEM=${STEM} ANNOT=<n> NEW_ANSWER=<text> node scripts/run-reclaim.mjs   (then mark-resolved)`);
  }
  process.exit(0);
}

// ---------- precheck (default): emit fire plan ----------
if (isSkipDisposition) {
  console.error(`\n[run-job4] ${STEM}: task.qc_disposition='${qcDisp}' — skip-disposition path.`);
  console.error(`[run-job4] Run: STEM=${STEM} node scripts/run-job4.mjs --skip-finalize`);
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
    verdict_source: a.verdictSource,
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
  finalize_when_done: PAYLOAD_SHADOW_APPLIED,
}, null, 2));

console.error(`\n[run-job4] ${STEM}: ${remaining.length} shadows to fire (of ${annots.length} total; ${alreadyFired.length} already covered).`);
console.error(`[run-job4] Agent: follow CLAUDE.md §Job 4 to fire each via Chrome MCP + scripts/fill-hai-shadow.js.`);
console.error(`[run-job4] Per fire, run: STEM=${STEM} ANNOT_N=<n> SHADOW_UUID=<8> SHADOW_FULL_UUID=<full-uuid> RATING=<Approve|Reject> TIME_LOGGED=<HH:MM:SS> [HAI_LLM_EVAL=<clean|warning|reject> HAI_LLM_COMMENT=<text>] node scripts/run-job4.mjs --record-shadow`);
console.error(`[run-job4] When all annots covered: STEM=${STEM} node scripts/run-job4.mjs --finalize`);

// ---------- helpers ----------
function parseSidecar(txt) {
  const stem = /^\s*stem:\s*(\S+)/m.exec(txt)?.[1];
  const igorResolvedRaw = /^\s*igor_resolved:\s*(true|false)\s*$/m.exec(txt)?.[1];
  const igorResolved = igorResolvedRaw === 'true';
  const shadows = [];
  const blocks = txt.split(/(?=^  - n: \d+\s*$)/m).slice(1);
  for (const blk of blocks) {
    const get = (re) => re.exec(blk)?.[1]?.trim();
    const n = parseInt(get(/^  - n:\s*(\d+)/m) ?? 0, 10);
    if (!n) continue;
    const reclaimedRaw = /^    reclaimed:\s*(true|false)\s*$/m.exec(blk)?.[1];
    const reclaimDiff = /^    reclaim_diff:\s*"([^"]*)"\s*$/m.exec(blk)?.[1] ?? null;
    shadows.push({
      n,
      uuid:            get(/^    uuid:\s*(\S+)/m),
      fired_at:        get(/^    fired_at:\s*(\S+)/m),
      rating:          get(/^    rating:\s*(\S+)/m),
      time_logged:     get(/^    time_logged:\s*"([^"]*)"/m) ?? get(/^    time_logged:\s*(\S+)/m),
      verdict_source:  get(/^    verdict_source:\s*(\S+)/m) ?? 'auto',
      hai_llm_eval:    get(/^    hai_llm_eval:\s*(\S+)/m) ?? 'clean',
      hai_llm_comment: /^    hai_llm_comment:\s*"([^"]*)"\s*$/m.exec(blk)?.[1] ?? '',
      reclaimed:       reclaimedRaw === 'true',
      reclaim_diff:    reclaimDiff,
    });
  }
  return { stem, igor_resolved: igorResolved, shadows };
}

function serializeSidecar(sidecar) {
  const lines = [
    `stem: ${sidecar.stem}`,
    `igor_resolved: ${sidecar.igor_resolved ? 'true' : 'false'}`,
    'shadows:',
  ];
  for (const s of sidecar.shadows) {
    lines.push(`  - n: ${s.n}`);
    lines.push(`    uuid: ${s.uuid}`);
    lines.push(`    fired_at: ${s.fired_at}`);
    lines.push(`    rating: ${s.rating}`);
    lines.push(`    time_logged: "${s.time_logged}"`);
    lines.push(`    verdict_source: ${s.verdict_source}`);
    lines.push(`    hai_llm_eval: ${s.hai_llm_eval}`);
    lines.push(`    hai_llm_comment: "${(s.hai_llm_comment ?? '').replace(/"/g, '\\"')}"`);
    lines.push(`    reclaimed: ${s.reclaimed ? 'true' : 'false'}`);
    lines.push(`    reclaim_diff: ${s.reclaim_diff ? `"${s.reclaim_diff.replace(/"/g, '\\"')}"` : 'null'}`);
  }
  return lines.join('\n') + '\n';
}
