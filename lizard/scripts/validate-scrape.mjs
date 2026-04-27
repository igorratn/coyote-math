#!/usr/bin/env node
// validate-scrape.mjs
// Validates that a scrapes/<stem>.txt file is complete enough for downstream
// processing. Catches the 2026-04-25 silent-broken-scrape failure mode where
// 5 of 6 Scrum cycle-2 scrapes had empty STATUS_LOG_TEXT or missed cycle-2
// submission events; reviewers ran on stale prompts; verdicts were invalid.
//
// Checks (all must pass):
//   1. TASK_ID line present + non-empty.
//   2. N_ANNOTATIONS ≥ 1.
//   3. Every === ANNOTATION N === block has PROMPT (≥30 chars), ANSWER, SKILLS.
//   4. STATUS_LOG_LEN line present and value > 0 (the bottom-of-file
//      `=== STATUS_LOG_TEXT ===` section was actually populated).
//   5. If --cycle 2: STATUS_LOG_TEXT must contain ≥ 2 distinct
//      "to: Submit_to_QC" or "to: QC_Complete" transitions (cycle-1 + cycle-2
//      submissions). 1 transition = annotator never resubmitted = stale.
//
// Exit codes:
//   0 = scrape passes
//   1 = file missing or unreadable
//   2 = scrape incomplete (specific reason printed to stderr)
//
// Usage:
//   node scripts/validate-scrape.mjs <path-to-scrape> [--cycle 1|2]
//   node scripts/validate-scrape.mjs scrapes/Report_Dashboard_Server_22.txt --cycle 1
//
// Importable as a function for run-job2.mjs Guard E.

import { readFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';

export function validateScrape(path, { cycle = null } = {}) {
  if (!existsSync(path)) {
    return { ok: false, code: 1, reason: `scrape file does not exist: ${path}` };
  }
  let txt;
  try { txt = readFileSync(path, 'utf8'); }
  catch (e) { return { ok: false, code: 1, reason: `read failed: ${e.message}` }; }

  // Check 1: TASK_ID
  const taskIdM = /^TASK_ID:\s*(\S+)/m.exec(txt);
  if (!taskIdM) return { ok: false, code: 2, reason: 'missing TASK_ID line' };

  // Check 2: N_ANNOTATIONS
  const nM = /^N_ANNOTATIONS:\s*(\d+)/m.exec(txt);
  if (!nM) return { ok: false, code: 2, reason: 'missing N_ANNOTATIONS line' };
  const nAnnots = parseInt(nM[1], 10);
  if (nAnnots < 1) return { ok: false, code: 2, reason: `N_ANNOTATIONS=${nAnnots} (must be ≥1)` };

  // Check 3: per-annotation completeness
  const annotBlocks = [...txt.matchAll(/^=== ANNOTATION (\d+) ===([\s\S]*?)(?=^=== |\Z)/gm)];
  if (annotBlocks.length !== nAnnots) {
    return { ok: false, code: 2,
      reason: `N_ANNOTATIONS=${nAnnots} but found ${annotBlocks.length} === ANNOTATION === blocks` };
  }
  for (const m of annotBlocks) {
    const n = m[1];
    const blk = m[2];
    const promptM = /^--- PROMPT ---\s*\n([\s\S]*?)(?=\n---|\n===)/m.exec(blk);
    const answerM = /^ANSWER:\s*(.*)$/m.exec(blk);
    const skillsM = /^SKILLS:\s*(.+)$/m.exec(blk);
    if (!promptM || promptM[1].trim().length < 30) {
      return { ok: false, code: 2, reason: `annotation ${n}: PROMPT missing or < 30 chars` };
    }
    if (!answerM) return { ok: false, code: 2, reason: `annotation ${n}: ANSWER missing` };
    if (!skillsM) return { ok: false, code: 2, reason: `annotation ${n}: SKILLS missing` };
  }

  // Check 4: STATUS_LOG_LEN populated (catches the 57/59/74 silent-empty case)
  const lenM = /^STATUS_LOG_LEN:\s*(\d*)/m.exec(txt);
  if (!lenM) return { ok: false, code: 2, reason: 'missing STATUS_LOG_LEN line' };
  if (lenM[1] === '' || parseInt(lenM[1], 10) === 0) {
    return { ok: false, code: 2,
      reason: 'STATUS_LOG_LEN is empty/zero — scraper failed to capture status log' };
  }

  // Check 5: cycle-2 stems must show ≥2 submission events (cycle-1 + cycle-2)
  // Accepted submission transitions:
  //   to: Submit_to_QC   — first submission (annotator → QC queue)
  //   to: QC_Complete    — QC pass
  //   to: QualityCheck   — cycle-2 re-submission after QC_Return (annotator → QC queue again)
  // Note: \Z is not valid JS regex; capture to end of file with [\s\S]* (greedy, no lookahead).
  if (cycle === 2) {
    const statusBlock = /=== STATUS_LOG_TEXT ===\s*([\s\S]*)$/m.exec(txt);
    const submissions = (statusBlock?.[1] || '').match(/to:\s*(Submit_to_QC|QC_Complete|QualityCheck)/g) || [];
    if (submissions.length < 2) {
      return { ok: false, code: 2,
        reason: `cycle-2 stem but only ${submissions.length} submission event(s) in status_log; ` +
                `expected ≥2 (cycle-1 + cycle-2 submission). Likely stale scrape — re-scrape from SA.` };
    }
  }

  return { ok: true, code: 0, reason: null,
    summary: `task_id=${taskIdM[1]}, n_annotations=${nAnnots}, status_log_len=${lenM[1]}` };
}

// CLI entry point
const isEntry = import.meta.url === `file://${process.argv[1]}`;
if (isEntry) {
  const args = process.argv.slice(2);
  const path = args[0];
  if (!path) {
    console.error('Usage: validate-scrape.mjs <path-to-scrape> [--cycle 1|2]');
    process.exit(2);
  }
  let cycle = null;
  const cycleIdx = args.indexOf('--cycle');
  if (cycleIdx !== -1 && args[cycleIdx + 1]) cycle = parseInt(args[cycleIdx + 1], 10);

  const r = validateScrape(path, { cycle });
  if (!r.ok) {
    console.error(`[validate-scrape] FAIL: ${r.reason}`);
    process.exit(r.code);
  }
  console.error(`[validate-scrape] OK: ${r.summary}`);
  process.exit(0);
}
