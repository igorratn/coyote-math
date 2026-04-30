#!/usr/bin/env node
// One-shot migration: convert pre-2026-04-28 task files to current format.
// - Narrative `**Auto-resolved at Job 2 (👍).** ...` → formal `#### Auto Verdict` block (idempotent — skips annots that already have one)
// - Strip trailing `## Form-Fill Payload` block (now lives in payloads/<S>.yaml)
// Idempotent: re-running on a migrated file is a no-op.
//
// Usage: STEMS="a,b,c" node scripts/migrate-auto-verdict.mjs
// Or:    node scripts/migrate-auto-verdict.mjs   (then pass --all to walk every tasks/*.md)

import fs from 'node:fs';
import path from 'node:path';

const STEMS = (process.env.STEMS || '').split(',').map(s => s.trim()).filter(Boolean);
const ALL = process.argv.includes('--all');

if (!STEMS.length && !ALL) {
  console.error('usage: STEMS="stem1,stem2" node scripts/migrate-auto-verdict.mjs   |   --all');
  process.exit(2);
}

const targets = ALL
  ? fs.readdirSync('tasks').filter(f => f.endsWith('.md') && !f.endsWith('.cycle1.md')).map(f => f.replace(/\.md$/, ''))
  : STEMS;

let totalAdded = 0;
let totalStripped = 0;

for (const stem of targets) {
  const fp = path.join('tasks', `${stem}.md`);
  if (!fs.existsSync(fp)) {
    console.error(`[skip] ${stem}: no task file`);
    continue;
  }
  const orig = fs.readFileSync(fp, 'utf8');
  let txt = orig;

  // 1. Strip `## Form-Fill Payload` block (everything from that header to EOF)
  const stripIdx = txt.indexOf('\n## Form-Fill Payload');
  let stripped = false;
  if (stripIdx !== -1) {
    txt = txt.slice(0, stripIdx).replace(/\n+$/, '') + '\n';
    stripped = true;
  }

  // 2. Per-annot: insert `#### Auto Verdict` block after narrative line if missing
  const blocks = txt.split(/(?=^## Annotation \d+\s*$)/m);
  const out = [blocks[0]];
  let added = 0;

  for (let i = 1; i < blocks.length; i++) {
    let blk = blocks[i];
    const hm = /^## Annotation (\d+)/.exec(blk);
    if (!hm) { out.push(blk); continue; }

    // Already has Auto Verdict? Skip.
    if (/#### Auto Verdict/.test(blk)) { out.push(blk); continue; }

    // 👍-close narrative
    const upMatch = /\*\*Auto-resolved at Job 2 \(👍\)\.\*\* (\S+) 👍 \((matches annotator|reviewer's own answer was [^)]+)\)\. SA action at Job 3b?: approve annotator's answer `([^`]+)` \((cycle [12])\)\. Skipped at Job 3a?\./.exec(blk);
    // 👎-unanimous-G1 narrative
    const downMatch = /\*\*Auto-resolved at Job 2 \(👎\)\.\*\* All (\d+) reviewers 👎 with G1 \(V6 anchor-skill fail\)\. SA action at Job 3b?: \*\*(QC_Return|delete)\*\* \((cycle [12])\)\./.exec(blk);

    let av = null;
    if (upMatch) {
      const [, source, matchNote, finalAnswer, cycleLabel] = upMatch;
      av = [
        '#### Auto Verdict',
        'carve_out: 👍-close',
        'rating: thumbs-up',
        `final_answer: ${finalAnswer}`,
        `source: ${source}`,
        'sa_action: approve',
        `notes: ${source} 👍 ${matchNote.startsWith('matches') ? 'close to annotator' : matchNote}; SA approves annotator's answer.`,
        ''
      ].join('\n');
    } else if (downMatch) {
      const [, nRev, downAction, cycleLabel] = downMatch;
      // Need to extract pick's finalAnswer + name from the block; pick is the first listed reviewer.
      const pickMatch = /^- \*\*Reviewer:\*\* (\S+)/m.exec(blk);
      const finalAnsMatch = /^- \*\*Final Answer \(reviewer\):\*\* (.+)$/m.exec(blk);
      const source = pickMatch ? pickMatch[1] : 'unknown';
      const finalAnswer = finalAnsMatch ? finalAnsMatch[1].trim() : 'N/A';
      av = [
        '#### Auto Verdict',
        'carve_out: 👎-unanimous-G1',
        'rating: thumbs-down',
        `final_answer: ${finalAnswer}`,
        `source: ${source}`,
        `sa_action: ${downAction}`,
        `notes: All ${nRev} reviewers 👎 with G1 (V6 anchor-skill fail). ${cycleLabel}.`,
        ''
      ].join('\n');
    }

    if (av) {
      // Insert AV block right after the narrative paragraph (which ends at blank line before #### Edits Made or similar)
      // Strategy: place AV block immediately before the first `#### Edits Made` after the narrative.
      blk = blk.replace(/(\n)(#### Edits Made\b)/, `\n${av}\n$2`);
      added++;
    }

    out.push(blk);
  }

  const newTxt = out.join('');
  if (newTxt !== orig) {
    fs.writeFileSync(fp, newTxt);
    console.log(`[migrate] ${stem}: ${added} Auto Verdict block(s) added${stripped ? ', payload block stripped' : ''}`);
    totalAdded += added;
    if (stripped) totalStripped++;
  } else {
    console.log(`[ok] ${stem}: already migrated, no changes`);
  }
}

console.error(`\n[done] ${totalAdded} Auto Verdict blocks added across ${targets.length} stems; ${totalStripped} payload blocks stripped.`);
