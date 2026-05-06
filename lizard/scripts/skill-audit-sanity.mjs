#!/usr/bin/env node
// skill-audit-sanity.mjs — post-batch consistency check for Job 2 auto-resolve gaps.
//
// Codified 2026-05-06. Fix for: when Job 2 auto-resolves annots without applying
// the skill-audit heuristics uniformly, prompts that warrant Enumeration / Math
// Reasoning / TCG can ship to SA without those tags, while other annots in the
// same stem (that hit different reviewers' picks) get the corrections. End-of-
// batch sanity check surfaces the inconsistency.
//
// Usage:
//   node scripts/skill-audit-sanity.mjs              # scan all payloads/done/
//   node scripts/skill-audit-sanity.mjs <stem>       # one stem only
//
// Output: per-stem mismatches (annot's prompt requires skill X, but X is not in
// the post-edit final skill set). Read-only — does not modify any payloads.

import { readFileSync, readdirSync, existsSync } from 'fs';
import { join, resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const LIZARD_DIR = resolve(dirname(fileURLToPath(import.meta.url)), '..');

// Heuristics — mirror CLAUDE.md §"Skill audit (CLI, before presenting to Igor)".
const RULES = [
  { name: 'Enumeration',                    regex: /\b(count|counts|counting|how many|number of|identify all)\b/i },
  { name: 'Math Reasoning',                 regex: /\b(sum|mean|average|difference|subtract|subtraction|divide|division|multiply|multiplication|add(ed|ing)?|total|computing)\b/i },
  { name: 'Table/Chart/Graph Understanding', regex: /\b(chart|graph|table|gauge|axis|axes|bar|panel|dashboard|plot|histogram|tile|column|legend)\b/i },
];

function loadOriginalSkills(stem) {
  // Always read the CURRENT cycle's task file. For cycle 2 stems the cycle-1
  // archive (tasks/<S>.cycle1.md) holds the OLD skills — annotator may have
  // re-tagged during cycle-2 rework, so SA's actual current state lives in
  // tasks/<S>.md (freshly written by Job 2 from the cycle-2 scrape).
  const path = join(LIZARD_DIR, 'tasks', `${stem}.md`);
  if (!existsSync(path)) return null;
  const md = readFileSync(path, 'utf8');
  // Per-annot ## Annotation N blocks
  const blocks = md.split(/(?=^## Annotation \d+\s*$)/m).slice(1);
  const skillsByN = {};
  for (const blk of blocks) {
    const n = parseInt(blk.match(/^## Annotation (\d+)/)?.[1], 10);
    const m = blk.match(/^- \*\*Skills Tagged:\*\* (.+)$/m);
    if (n && m) {
      skillsByN[n] = m[1].split(',').map(s => s.trim()).filter(Boolean);
    }
  }
  return skillsByN;
}

function auditOne(prompt, finalSkills) {
  const required = [];
  for (const r of RULES) {
    if (r.regex.test(prompt) && !finalSkills.has(r.name)) {
      required.push(r.name);
    }
  }
  return required;
}

function parsePayload(yamlText) {
  // Same regex-based approach as run-job4.mjs / run-job5.mjs
  const annots = [];
  const blocks = yamlText.split(/(?=^  - n: \d+\s*$)/m).slice(1);
  for (const blk of blocks) {
    const n = parseInt(/^  - n:\s*(\d+)/m.exec(blk)?.[1], 10);
    if (!n) continue;
    const action = /^      action:\s*(\S+)/m.exec(blk)?.[1];
    const verdictSource = /^      verdict_source:\s*(\S+)/m.exec(blk)?.[1] ?? 'auto';
    const skillsCheck   = (/^      skills_check:\s*\[([^\]]*)\]/m.exec(blk)?.[1] ?? '').split(',').map(s => s.trim()).filter(Boolean);
    const skillsUncheck = (/^      skills_uncheck:\s*\[([^\]]*)\]/m.exec(blk)?.[1] ?? '').split(',').map(s => s.trim()).filter(Boolean);
    // Multi-line `prompt: |` block scalar (same parser as run-job4.mjs)
    const promptM = /^      prompt:\s*\|\s*\n([\s\S]+?)(?=\n      \w|\n  - n:|\n*$(?![\s\S]))/m.exec(blk);
    const prompt = promptM ? promptM[1].split('\n').map(l => l.replace(/^        /, '')).join('\n').trim() : '';
    annots.push({ n, action, verdictSource, prompt, skillsCheck, skillsUncheck });
  }
  return annots;
}

function checkStem(stem) {
  // Check shadow_applied/ first (pre-Save Job 5 gate use), fall back to done/.
  let payloadPath = join(LIZARD_DIR, 'payloads', 'shadow_applied', `${stem}.yaml`);
  if (!existsSync(payloadPath)) {
    payloadPath = join(LIZARD_DIR, 'payloads', 'done', `${stem}.yaml`);
  }
  if (!existsSync(payloadPath)) return { stem, error: 'payload not found in shadow_applied/ or done/' };
  const annots = parsePayload(readFileSync(payloadPath, 'utf8'));
  const orig = loadOriginalSkills(stem);
  if (!orig) return { stem, error: 'tasks/<S>.md not found' };
  const mismatches = [];
  for (const a of annots) {
    const origSkills = new Set(orig[a.n] ?? []);
    const check = new Set(a.skillsCheck);
    const uncheck = new Set(a.skillsUncheck);
    const finalSkills = new Set([...origSkills, ...check].filter(s => !uncheck.has(s)));
    const missing = auditOne(a.prompt, finalSkills);
    if (missing.length) {
      mismatches.push({ n: a.n, missing, finalSkills: [...finalSkills], action: a.action, verdict_source: a.verdictSource });
    }
  }
  return { stem, mismatches };
}

function main() {
  const arg = process.argv[2];
  let stems;
  if (arg) {
    stems = [arg];
  } else {
    const doneDir = join(LIZARD_DIR, 'payloads', 'done');
    stems = readdirSync(doneDir)
      .filter(f => f.endsWith('.yaml') && !f.endsWith('.shadows.yaml') && !f.includes('.cycle1.'))
      .map(f => f.replace(/\.yaml$/, ''));
  }
  let totalMismatches = 0;
  let stemsWithIssues = 0;
  for (const stem of stems) {
    const r = checkStem(stem);
    if (r.error) { console.error(`[skill-audit] ${stem}: ${r.error}`); continue; }
    if (!r.mismatches.length) continue;
    stemsWithIssues++;
    totalMismatches += r.mismatches.length;
    console.log(`\n[skill-audit] ${stem}: ${r.mismatches.length} mismatch(es)`);
    for (const m of r.mismatches) {
      console.log(`  A${m.n} (${m.action}, ${m.verdict_source}): missing ${JSON.stringify(m.missing)} — final skills = ${JSON.stringify(m.finalSkills)}`);
    }
  }
  console.log(`\n[skill-audit] scanned ${stems.length} stem(s); ${stemsWithIssues} with issues; ${totalMismatches} total mismatches.`);
  // Exit non-zero when called as a gate (single-stem invocation with mismatches).
  if (arg && stemsWithIssues > 0) process.exit(2);
}

main();
