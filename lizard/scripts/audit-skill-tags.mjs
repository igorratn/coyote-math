#!/usr/bin/env node
// audit-skill-tags.mjs — Stage-3 skill audit via opus (free on Max plan).
//
// Replaces the legacy Phase C "Stage 3 intelligent merge" that was lost during
// the dumb-merger refactor. Legacy 5/5 skill-edit consistency came from a
// model synthesizing reviewer outputs and auditing skills against the prompt;
// our current job2-merge.mjs only passes through the picked reviewer's
// `**Edits Made:**`, so when a reviewer says "None" we lose the audit.
//
// This actor runs AFTER Job 2 merge, BEFORE Job 3a / 3b. For each 👍 annot
// in tasks/<S>.md, it asks opus to audit skill tags vs the prompt and emit
// drop/add deltas. Deltas (and a dated rationale feedback) are injected into
// the existing Auto Verdict / Igor Verdict block.
//
// Choreography:
//   Precondition: tasks/<S>.md exists with verdict blocks (Auto or Igor).
//   For each 👍 annot whose verdict block lacks `skills_check:` line OR whose
//   `skills_check`/`skills_uncheck` are both empty AND rating==thumbs-up,
//   call opus, inject deltas if non-empty.
//   Postcondition: Verdict blocks of audited annots carry `skills_check:` /
//   `skills_uncheck:` lines (possibly empty if opus declined edits).
//
// Usage:
//   STEM=<stem> [LIZARD_DIR=<path>] node scripts/audit-skill-tags.mjs
//   STEMS="a,b,c" node scripts/audit-skill-tags.mjs
//
// Cost: opus is free on Max plan per project_reviewer_cost_model.md. One
// `claude -p` subprocess per 👍 annot. Skip 👎 (annotator fixes those).

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { execSync } from 'child_process';
import path from 'node:path';
import { parseEditsMade, VALID_SKILLS, VALID_QTYPES } from './parse-edits-made.mjs';

const STEM = process.env.STEM;
const STEMS = (process.env.STEMS || '').split(',').map(s => s.trim()).filter(Boolean);

let targets;
if (STEM) targets = [STEM];
else if (STEMS.length) targets = STEMS;
else { console.error('usage: STEM=<stem> | STEMS="a,b,c" node scripts/audit-skill-tags.mjs'); process.exit(2); }

const OPUS_MODEL = process.env.OPUS_MODEL ?? 'claude-opus-4-7';

// ---------- audit prompt ----------
const SKILL_RULES = `
V6 skill-tag rules (from wiki/review-calibration.md + templates/review-prompt.md):
- "Spatial Reasoning" is for RELATIONAL position reasoning ("between X and Y", "above", "closer to", "leftmost"). NOT for chart-reading, value-extraction, or quadrant-locating-then-counting. Drop it if the task is to read values or count elements in a region.
- "Logical Reasoning" requires chained inference / conditional branching across multiple data points. NOT for simple counting, single-step exclusion, or apply-then-compare. Drop if the task is one filter + one count.
- "World Knowledge" requires external facts cited in the prompt (e.g., "US presidents", "classical elements", "legal drinking age"). Drop if no outside fact is referenced.
- "Table/Chart/Graph Understanding" — tag whenever the task requires reading a chart's structure (axis, gridlines, bars, labeled regions). Add if missing on chart-reading prompts.
- "Enumeration" — counting. Already universally tagged when needed.
- "Attribute Perception" — recognizing colors, shapes, descriptive attributes. Drop if the task is value-reading or counting (extraction, not perception).
- "Math Reasoning" — arithmetic / comparison. Tag when math is performed.
- V6 G1 anchor: ≥1 of Logical Reasoning / Table/Chart/Graph Understanding / World Knowledge MUST be tagged. Add the most appropriate anchor if missing.
- QType: prompt with "A./B./C./D." pattern → MCQ. Otherwise → "Short answer question". Add the missing qtype to skills_check if not currently checked (qtype is encoded in the same checkbox group).
`;

function buildAuditPrompt({ skills, qtype, prompt }) {
  return `You are auditing the skill tags on a visual reasoning Q&A annotation.

Tagged skills (existing): ${skills.join(', ') || '(none)'}
QType (existing): ${qtype || '(unset)'}

Prompt:
${prompt}
${SKILL_RULES}

Decide which tagged skills are over-tagged (drop) and which required skills are missing (add). Be decisive — do not return "borderline" or "leave as-is" if a clear rule applies.

Output ONLY a single YAML block, no prose around it:

\`\`\`yaml
drop: [<skill or skill list>]    # tagged skills to remove
add:  [<skill or skill list>]    # missing skills to add (incl. qtype if needed)
reason: "<one sentence explaining the change>"
\`\`\`

If no edits are needed, emit \`drop: []\` and \`add: []\` with reason "Skills correct as tagged."`;
}

// ---------- opus subprocess ----------
function callOpusAudit(promptText) {
  // Pipe the prompt through stdin to avoid shell-interpretation of <>/`
  // characters embedded in the audit template.
  const cmd = `claude -p --model ${OPUS_MODEL} --dangerously-skip-permissions`;
  try {
    const out = execSync(cmd, {
      input: promptText,
      encoding: 'utf8',
      maxBuffer: 4 * 1024 * 1024,
      timeout: 120_000,
    });
    return out;
  } catch (e) {
    console.error(`[audit] opus call failed: ${e.message}`);
    return null;
  }
}

// ---------- yaml-in-fenced-block parser ----------
function parseAuditYaml(text) {
  if (!text) return null;
  const m = /```ya?ml\s*\n([\s\S]*?)\n```/i.exec(text) || /```\s*\n(drop:[\s\S]*?)\n```/i.exec(text);
  const body = m ? m[1] : text;
  const dropM = /drop:\s*\[([^\]]*)\]/i.exec(body);
  const addM  = /add:\s*\[([^\]]*)\]/i.exec(body);
  const reasonM = /reason:\s*"([^"]*)"|reason:\s*(.+)/i.exec(body);
  if (!dropM || !addM) return null;
  const cleanList = (s) => s.split(',').map(x => x.trim().replace(/^["'`]+|["'`]+$/g, '')).filter(Boolean);
  const validSet = new Set([...VALID_SKILLS, ...VALID_QTYPES]);
  const drop = cleanList(dropM[1]).filter(s => validSet.has(s));
  const add  = cleanList(addM[1]).filter(s => validSet.has(s));
  const reason = reasonM ? (reasonM[1] ?? reasonM[2] ?? '').trim() : '';
  return { drop, add, reason };
}

// ---------- per-annot audit + inject ----------
function processAnnot(blk) {
  const hm = /^## Annotation (\d+)/.exec(blk);
  if (!hm) return { blk, touched: false };
  const n = hm[1];

  // Need rating + prompt + skills + qtype.
  const skillsM = /^- \*\*Skills Tagged:\*\*\s*(.+)$/m.exec(blk);
  const qtypeM  = /^- \*\*Question Type:\*\*\s*(\S+)/m.exec(blk);
  const promptM = /^#### Full Prompt\n([\s\S]+?)(?=\n#### |\n---|(?![\s\S]))/m.exec(blk);
  if (!skillsM || !promptM) return { blk, touched: false };

  // Find the verdict block we'd be modifying (Auto first, else Igor).
  const avRe = /(#### Auto Verdict\n)([\s\S]+?)(?=\n#### |\n---|(?![\s\S]))/;
  const ivRe = /(#### Igor Verdict\n)([\s\S]+?)(?=\n#### |\n---|(?![\s\S]))/;
  const avMatch = avRe.exec(blk);
  const ivMatch = ivRe.exec(blk);
  const verdictMatch = ivMatch || avMatch;
  if (!verdictMatch) return { blk, touched: false };

  // Only audit 👍 cases.
  const ratingM = /rating:\s*(thumbs-up|thumbs-down)/.exec(verdictMatch[2]);
  if (!ratingM || ratingM[1] !== 'thumbs-up') return { blk, touched: false };

  // Idempotent: skip if Verdict already carries non-empty skills_check OR uncheck.
  const existingCheckM   = /^skills_check:\s*\[([^\]]*)\]/m.exec(verdictMatch[2]);
  const existingUncheckM = /^skills_uncheck:\s*\[([^\]]*)\]/m.exec(verdictMatch[2]);
  const existingCheck   = existingCheckM   ? existingCheckM[1].split(',').map(s => s.trim()).filter(Boolean)   : [];
  const existingUncheck = existingUncheckM ? existingUncheckM[1].split(',').map(s => s.trim()).filter(Boolean) : [];
  if (existingCheck.length || existingUncheck.length) return { blk, touched: false };

  const skills = skillsM[1].split(',').map(s => s.trim()).filter(Boolean);
  const qtype  = qtypeM ? qtypeM[1].trim() : '';
  const promptText = promptM[1].trim();

  // Call opus.
  const audit = parseAuditYaml(callOpusAudit(buildAuditPrompt({ skills, qtype, prompt: promptText })));
  if (!audit) {
    console.error(`  A${n}: audit parse failed, leaving as-is`);
    return { blk, touched: false };
  }
  const drop = audit.drop;
  const add  = audit.add;
  if (!drop.length && !add.length) {
    console.error(`  A${n}: opus → no edits`);
    // Still write empty arrays into Verdict block so we don't re-audit on rerun.
  } else {
    console.error(`  A${n}: opus → drop=${JSON.stringify(drop)} add=${JSON.stringify(add)} (${audit.reason})`);
  }

  const checkStr   = `[${add.join(', ')}]`;
  const uncheckStr = `[${drop.join(', ')}]`;

  // Inject lines into the Verdict block. If existing skills_check line is
  // present (even empty), replace it; else insert before notes:.
  let newVerdict = verdictMatch[2];
  if (/^skills_check:\s*\[/m.test(newVerdict)) {
    newVerdict = newVerdict.replace(/^skills_check:.*$/m, `skills_check: ${checkStr}`);
    newVerdict = newVerdict.replace(/^skills_uncheck:.*$/m, `skills_uncheck: ${uncheckStr}`);
  } else {
    newVerdict = newVerdict.replace(
      /^(notes:\s)/m,
      `skills_check: ${checkStr}\nskills_uncheck: ${uncheckStr}\n$1`
    );
  }
  let updated = blk.replace(verdictMatch[0], verdictMatch[1] + newVerdict);

  // Update bottom #### Feedback block when non-empty edit (legacy V6 rule).
  if (drop.length || add.length) {
    const md = `${new Date().getMonth() + 1}/${new Date().getDate()}`;
    const parts = [];
    if (drop.length) parts.push(`drop ${drop.map(s => `\`${s}\``).join(', ')}`);
    if (add.length)  parts.push(`add ${add.map(s => `\`${s}\``).join(', ')}`);
    // Hard rule: NEVER mention reviewer model names in feedback (RLHF integrity —
    // annotator reads QC box; LLM identity must not leak). See CLAUDE.md §Hard rules.
    const newFeedback = `${md}: Skill tag corrected: ${parts.join('; ')}. ${audit.reason}`.trim();

    // Rewrite LAST #### Feedback block ONLY if its body matches the stale
    // Job-2 placeholder OR the prior backfill terse form.
    const fbRe = /(#### Feedback\n)([\s\S]*?)(?=\n#### |\n---|(?![\s\S]))/g;
    let lastMatch = null, m2;
    while ((m2 = fbRe.exec(updated)) !== null) lastMatch = m2;
    if (lastMatch) {
      const stale = /^(?:\d{4}-\d{2}-\d{2}:\s+(?:thumbs-up|thumbs-down)\s+\([^)]+\)\s+—\s+(?:auto-resolved|pending Igor verdict)\s*|\d{1,2}\/\d{1,2}:\s+Skill tag corrected per [\w\s]+ ?(?:—|:)?[^\n]*|\(none — thumbs-up\))$/s;
      if (stale.test(lastMatch[2].trim())) {
        updated = updated.slice(0, lastMatch.index) + lastMatch[1] + newFeedback + updated.slice(lastMatch.index + lastMatch[0].length);
      }
    }
  }

  return { blk: updated, touched: true };
}

// ---------- main loop ----------
let totalUpdated = 0;
for (const stem of targets) {
  const fp = path.join('tasks', `${stem}.md`);
  if (!existsSync(fp)) {
    console.error(`[skip] ${stem}: no task file`);
    continue;
  }
  console.error(`\n[audit] ${stem}`);
  const orig = readFileSync(fp, 'utf8');
  const blocks = orig.split(/(?=^## Annotation \d+\s*$)/m);
  const out = [blocks[0]];
  let stemTouched = 0;
  for (let i = 1; i < blocks.length; i++) {
    const { blk, touched } = processAnnot(blocks[i]);
    out.push(blk);
    if (touched) stemTouched++;
  }
  const newTxt = out.join('');
  if (newTxt !== orig) {
    writeFileSync(fp, newTxt);
    console.error(`[audit] ${stem}: ${stemTouched} annot(s) audited and updated`);
    totalUpdated++;
  } else {
    console.error(`[audit] ${stem}: no changes (already audited or no 👍 annots)`);
  }
}
console.error(`\n[done] ${totalUpdated} stem(s) updated.`);
