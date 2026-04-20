#!/usr/bin/env node
// build-openclaw-msg.mjs
// Assembles the openclaw reviewer prompt with file contents inlined directly.
// openclaw workspace (~/.openclaw/workspace/) is not the lizard repo — it cannot
// read lizard files by path. All referenced content must be inlined in the prompt.
//
// Inlined:  wiki/guideline-patterns.md, CLAUDE.md, tasks/skeleton/<stem>.md
// Path-only: references/playbook_reviewer.md (537KB — too large to inline),
//            screenshots/<stem>.<ext> (binary image — absolute path provided)
//
// Usage:
//   STEM=<stem> [LIZARD_DIR=<path>] node scripts/build-openclaw-msg.mjs
// Output: assembled message on stdout, sanity-check lines on stderr.

import { readFileSync, existsSync, copyFileSync, mkdirSync } from 'fs';
import { resolve, dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { homedir } from 'os';

const __dir = dirname(fileURLToPath(import.meta.url));
const LIZARD_DIR = process.env.LIZARD_DIR ?? resolve(__dir, '..');
const STEM = process.env.STEM;
if (!STEM) { console.error('ERROR: STEM env var required'); process.exit(1); }

const PATHS = {
  prompt:    join(LIZARD_DIR, 'templates', 'review-prompt.md'),
  skeleton:  join(LIZARD_DIR, 'tasks', 'skeleton', `${STEM}.md`),
  framework: join(LIZARD_DIR, 'wiki', 'guideline-patterns.md'),
  claude_md: join(LIZARD_DIR, 'CLAUDE.md'),
  playbook:  join(LIZARD_DIR, 'references', 'playbook_reviewer.md'),
};

// Resolve screenshot (try extensions in order)
for (const ext of ['png', 'jpg', 'jpeg', 'webp']) {
  const p = join(LIZARD_DIR, 'screenshots', `${STEM}.${ext}`);
  if (existsSync(p)) { PATHS.screenshot = p; break; }
}
PATHS.screenshot ??= join(LIZARD_DIR, 'screenshots', `${STEM}.png`);

// Copy screenshot into openclaw workspace (only allowed image dir)
const OPENCLAW_IMG_DIR = join(homedir(), '.openclaw', 'workspace', 'lizard-screenshots');
mkdirSync(OPENCLAW_IMG_DIR, { recursive: true });
const ext = PATHS.screenshot.split('.').pop();
const workspaceImg = join(OPENCLAW_IMG_DIR, `${STEM}.${ext}`);
if (existsSync(PATHS.screenshot)) {
  copyFileSync(PATHS.screenshot, workspaceImg);
  console.error(`[build-openclaw-msg] screenshot copied to: ${workspaceImg}`);
  PATHS.screenshot_workspace = workspaceImg;
} else {
  console.error(`[build-openclaw-msg] WARN: screenshot not found, image check will fail`);
  PATHS.screenshot_workspace = workspaceImg;
}

// Sanity check
console.error('[build-openclaw-msg] path check:');
let anyMissing = false;
for (const [key, p] of Object.entries(PATHS)) {
  const ok = existsSync(p);
  console.error(`  [${ok ? 'OK' : 'MISSING'}] ${key}: ${p}`);
  if (['prompt', 'skeleton', 'framework', 'claude_md'].includes(key) && !ok) anyMissing = true;
}
if (anyMissing) { console.error('[build-openclaw-msg] ERROR: required paths missing'); process.exit(1); }

// Read files to inline
const frameworkContent = readFileSync(PATHS.framework, 'utf8');
const claudeContent    = readFileSync(PATHS.claude_md, 'utf8');
const skeletonRaw      = readFileSync(PATHS.skeleton,  'utf8');
// Strip saved answers so reviewer cannot reverse-algebra from skeleton
const skeletonContent  = skeletonRaw.replace(
  /^#### Rewrite Answer\n.+$/gm,
  '#### Rewrite Answer\n(redacted — verify independently from image)'
);

// Replace the sandbox sources block with an inline-content block
let prompt = readFileSync(PATHS.prompt, 'utf8');
const sourcesBlock = `**Sources — all content inlined below. Do not attempt relative reads (openclaw workspace ≠ lizard repo).**
- Screenshot (image): \`${PATHS.screenshot_workspace}\` — **primary source of truth**; read this image before any annotation work. This path is under your allowed directory.
- Playbook (reference only, not inlined — too large): \`${PATHS.playbook}\`
- Framework, project rules, and task skeleton are inlined in full at the end of this prompt.`;

prompt = prompt.replace(
  /\*\*Sources available in your sandbox\*\*[\s\S]*?6\. `CLAUDE\.md` — project rules\./,
  sourcesBlock
);

const assembled = `${prompt}

---

## Inlined: Framework (wiki/guideline-patterns.md)

${frameworkContent}

---

## Inlined: Project Rules (CLAUDE.md)

${claudeContent}

---

## Inlined: Task Skeleton (tasks/skeleton/${STEM}.md)

${skeletonContent}

---

## Image

The task image is at: \`${PATHS.screenshot_workspace}\`
Read it directly — it is the primary source of truth for all answer verification.
(Original lizard path: \`${PATHS.screenshot}\`)
`;

process.stdout.write(assembled);
