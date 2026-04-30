#!/usr/bin/env node
// backfill-skill-deltas.mjs
// One-shot migration: for tasks/<S>.md files whose Auto Verdict blocks were
// emitted before the 2026-04-29 skill-delta refactor (no `skills_check:` /
// `skills_uncheck:` lines), parse the picked reviewer's `**Edits Made:**`
// text from the embedded `#### Reviewer Body (...) (picked)` section and
// inject the delta lines into the Auto Verdict block.
//
// Idempotent: skips Auto Verdict blocks that already carry skills_check.
//
// Usage:
//   STEMS="a,b,c" node scripts/backfill-skill-deltas.mjs
//   node scripts/backfill-skill-deltas.mjs --all

import fs from 'node:fs';
import path from 'node:path';
import { parseEditsMade } from './parse-edits-made.mjs';

const STEMS = (process.env.STEMS || '').split(',').map(s => s.trim()).filter(Boolean);
const ALL = process.argv.includes('--all');

if (!STEMS.length && !ALL) {
  console.error('usage: STEMS="stem1,stem2" node scripts/backfill-skill-deltas.mjs   |   --all');
  process.exit(2);
}

const targets = ALL
  ? fs.readdirSync('tasks').filter(f => f.endsWith('.md') && !f.endsWith('.cycle1.md')).map(f => f.replace(/\.md$/, ''))
  : STEMS;

let totalUpdated = 0;
let totalAnnotsTouched = 0;

for (const stem of targets) {
  const fp = path.join('tasks', `${stem}.md`);
  if (!fs.existsSync(fp)) {
    console.error(`[skip] ${stem}: no task file`);
    continue;
  }
  const orig = fs.readFileSync(fp, 'utf8');
  const blocks = orig.split(/(?=^## Annotation \d+\s*$)/m);
  const out = [blocks[0]];
  let touched = 0;

  for (let i = 1; i < blocks.length; i++) {
    let blk = blocks[i];
    const hm = /^## Annotation (\d+)/.exec(blk);
    if (!hm) { out.push(blk); continue; }

    // Skip if no Auto Verdict.
    const avMatch = /(#### Auto Verdict\n)([\s\S]+?)(?=\n#### |\n---|(?![\s\S]))/.exec(blk);
    if (!avMatch) { out.push(blk); continue; }

    // Find picked reviewer's Edits Made text within the same annot block.
    // The picked reviewer is identified by `#### Reviewer Body (<name>) (picked)`.
    const pickedBody = /#### Reviewer Body \(([^)]+)\) \(picked\)\n([\s\S]+?)(?=\n#### Reviewer Body|\n#### |\n---|(?![\s\S]))/.exec(blk);
    if (!pickedBody) { out.push(blk); continue; }
    const pickedName = pickedBody[1].trim();
    const editsM = /^\s*-?\s*\*\*Edits Made:\*\*\s*([\s\S]*?)(?=^\s*-?\s*\*\*[A-Z]|^####|^---|(?![\s\S]))/mi.exec(pickedBody[2]);
    const editsText = editsM ? editsM[1].trim() : '';
    const delta = parseEditsMade(editsText);
    const checkStr   = `[${delta.skills_check.join(', ')}]`;
    const uncheckStr = `[${delta.skills_uncheck.join(', ')}]`;
    const hasEdit = delta.skills_check.length || delta.skills_uncheck.length;

    // Two phases — handle each idempotently:
    //   Phase A: insert skills_check/skills_uncheck lines into Auto Verdict if absent.
    //   Phase B: rewrite the bottom #### Feedback block to a dated edit-rationale
    //     IF the annot has any edit AND the current feedback matches the stale
    //     Job-2 placeholder pattern.
    let phaseAdone = false;
    if (!/^skills_check:\s*\[/m.test(avMatch[2])) {
      const newAvBody = avMatch[2].replace(
        /^(notes:\s)/m,
        `skills_check: ${checkStr}\nskills_uncheck: ${uncheckStr}\n$1`
      );
      blk = blk.replace(avMatch[0], avMatch[1] + newAvBody);
      phaseAdone = true;
    }
    if (phaseAdone) touched++;
    if (hasEdit) {
      console.error(`  ${stem} A${hm[1]}: picked=${pickedName}, check=${checkStr}, uncheck=${uncheckStr}`);
      // Phase B: rewrite the bottom #### Feedback block IF it matches the
      // stale Job-2 placeholder pattern. Idempotent: a feedback already
      // rewritten to "M/D: Skill tag corrected per <name>:..." is left alone.
      const mdToday = `${new Date().getMonth() + 1}/${new Date().getDate()}`;
      // Legacy format: embed the reviewer's reasoning text but NEVER name the
      // reviewer model. RLHF integrity — annotator reads QC feedback; LLM
      // identity must not leak. See CLAUDE.md §Hard rules.
      const newFeedback = editsText
        ? `${mdToday}: Skill tag corrected: ${editsText}`
        : `${mdToday}: Skill tag corrected (no rationale captured).`;
      // Find the LAST `#### Feedback` block (Job 2's placeholder).
      const fbRe = /(#### Feedback\n)([\s\S]*?)(?=\n#### |\n---|(?![\s\S]))/g;
      let lastMatch = null, m2;
      while ((m2 = fbRe.exec(blk)) !== null) lastMatch = m2;
      // Only rewrite if the current body is one of:
      //  (a) the stale Job-2 placeholder
      //      "YYYY-MM-DD: thumbs-up (...) — auto-resolved"
      //  (b) the prior-backfill terse form
      //      "M/D: Skill tag corrected per <name>: drop `X`."
      // Don't touch hand-curated text (Igor's manual rewrites at 3a).
      const stalePlaceholderRe = /^(?:\d{4}-\d{2}-\d{2}:\s+(?:thumbs-up|thumbs-down)\s+\([^)]+\)\s+—\s+(?:auto-resolved|pending Igor verdict)\s*|\d{1,2}\/\d{1,2}:\s+Skill tag corrected per \w+:\s+(?:drop|add)\s+`[^`]+`\.?)$/s;
      if (lastMatch && stalePlaceholderRe.test(lastMatch[2].trim())) {
        blk = blk.slice(0, lastMatch.index) + lastMatch[1] + newFeedback + blk.slice(lastMatch.index + lastMatch[0].length);
        if (!phaseAdone) touched++;
      }
    }
    out.push(blk);
  }

  const newTxt = out.join('');
  if (newTxt !== orig) {
    fs.writeFileSync(fp, newTxt);
    console.log(`[backfill] ${stem}: ${touched} Auto Verdict block(s) augmented with skill deltas`);
    totalUpdated++;
    totalAnnotsTouched += touched;
  } else {
    console.log(`[ok] ${stem}: already migrated, no changes`);
  }
}

console.error(`\n[done] ${totalAnnotsTouched} annot(s) augmented across ${totalUpdated} stems.`);
