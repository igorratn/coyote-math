#!/usr/bin/env node
// extract-prompts.mjs — given STEM (or all live payloads), write each annot's
// hai.prompt to /tmp/lizard-prompts/<stem>_A<n>.txt verbatim from YAML.
//
// Handles YAML `|` block scalars correctly: blank lines (no indent) are kept
// as part of the prompt. The previous regex-based extractor stopped at first
// blank line, truncating multi-paragraph prompts to their first line — caused
// 5 broken HAI shadows in the 2026-05-06 V6 batch (codified 2026-05-06).
//
// Usage:
//   STEM=<stem> node scripts/extract-prompts.mjs       # one stem
//   node scripts/extract-prompts.mjs                   # all payloads/*.yaml + payloads/shadow_applied/*.yaml

import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync } from 'fs';
import { join, resolve, dirname as pathDirname, basename } from 'path';
import { fileURLToPath } from 'url';

const __dir = pathDirname(fileURLToPath(import.meta.url));
const LIZARD_DIR = process.env.LIZARD_DIR ?? resolve(__dir, '..');
const OUT_DIR = '/tmp/lizard-prompts';
mkdirSync(OUT_DIR, { recursive: true });

const STEM = process.env.STEM;

function extractPromptBlocks(txt) {
  // Returns Map<n, prompt> for the given YAML payload text.
  const lines = txt.split('\n');
  const out = new Map();
  let curN = null;
  let inPrompt = false;
  let promptIndent = null;
  let promptLines = [];
  const flush = () => {
    if (curN !== null && promptLines.length) {
      out.set(curN, promptLines.join('\n').replace(/\n+$/, '\n'));
    }
    promptLines = [];
    inPrompt = false;
    promptIndent = null;
  };
  for (const l of lines) {
    const nMatch = /^\s+- n:\s*(\d+)/.exec(l);
    if (nMatch) {
      flush();
      curN = parseInt(nMatch[1], 10);
      continue;
    }
    if (/^\s+prompt:\s*\|/.test(l)) {
      flush();
      inPrompt = true;
      promptIndent = null;
      continue;
    }
    if (inPrompt) {
      const blank = /^\s*$/.test(l);
      if (blank) {
        promptLines.push('');
        continue;
      }
      // Detect indent on first non-blank line.
      const indentM = /^( +)/.exec(l);
      const indent = indentM ? indentM[1].length : 0;
      if (promptIndent === null) {
        promptIndent = indent;
      }
      // If indent dropped below prompt indent → end of block.
      if (indent < promptIndent) {
        flush();
        // Re-process this line as it might be the next field.
        continue;
      }
      promptLines.push(l.slice(promptIndent));
    }
  }
  flush();
  return out;
}

function findPayloadPath(stem) {
  const live = join(LIZARD_DIR, 'payloads', `${stem}.yaml`);
  if (existsSync(live)) return live;
  const sa = join(LIZARD_DIR, 'payloads', 'shadow_applied', `${stem}.yaml`);
  if (existsSync(sa)) return sa;
  const done = join(LIZARD_DIR, 'payloads', 'done', `${stem}.yaml`);
  if (existsSync(done)) return done;
  return null;
}

function processFile(path) {
  const text = readFileSync(path, 'utf8');
  const stemM = /^\s+stem:\s*(.+)$/m.exec(text);
  if (!stemM) { console.error(`[extract] no stem in ${path}`); return; }
  const stem = stemM[1].trim();
  const prompts = extractPromptBlocks(text);
  for (const [n, prompt] of prompts) {
    const outPath = join(OUT_DIR, `${stem}_A${n}.txt`);
    writeFileSync(outPath, prompt);
    console.log(`${stem}_A${n}\t${prompt.length} chars\t→ ${outPath}`);
  }
}

if (STEM) {
  const path = findPayloadPath(STEM);
  if (!path) { console.error(`[extract] no payload found for ${STEM}`); process.exit(1); }
  processFile(path);
} else {
  // Walk live + shadow_applied
  for (const subdir of ['', 'shadow_applied']) {
    const dir = join(LIZARD_DIR, 'payloads', subdir);
    if (!existsSync(dir)) continue;
    for (const f of readdirSync(dir)) {
      if (!f.endsWith('.yaml') || f.endsWith('.shadows.yaml')) continue;
      processFile(join(dir, f));
    }
  }
}
