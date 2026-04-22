#!/usr/bin/env node
// run-opus-reviewer.mjs
// Runs Opus 4.7 reviewer on a task with image base64-inlined (stream-json via claude -p).
// Image inlining is required because claude -p non-interactive mode does not open files via tool use.
//
// Usage:
//   STEM=<stem> [LIZARD_DIR=<path>] [OUT=<path>] node scripts/run-opus-reviewer.mjs
// Output: review written to OUT (default: /tmp/lizard/<stem>/r2-opus-review.md)
//         also prints to stdout for capture

import { readFileSync, existsSync, writeFileSync, mkdirSync, unlinkSync } from 'fs';
import { resolve, join } from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';
import { tmpdir } from 'os';

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

for (const ext of ['png', 'jpg', 'jpeg', 'webp']) {
  const p = join(LIZARD_DIR, 'screenshots', `${STEM}.${ext}`);
  if (existsSync(p)) { PATHS.screenshot = p; PATHS.screenshot_ext = ext; break; }
}
if (!PATHS.screenshot) { console.error(`ERROR: screenshot not found for ${STEM}`); process.exit(1); }

const OUT = process.env.OUT ?? join('/tmp/lizard', STEM, 'r2-opus-review.md');

// Sanity check
let anyMissing = false;
console.error('[run-opus-reviewer] path check:');
for (const [key, p] of Object.entries(PATHS)) {
  const ok = existsSync(p);
  console.error(`  [${ok ? 'OK' : 'MISSING'}] ${key}: ${p}`);
  if (['prompt', 'skeleton', 'framework', 'claude_md', 'screenshot'].includes(key) && !ok) anyMissing = true;
}
if (anyMissing) { console.error('ERROR: required paths missing'); process.exit(1); }

// Read and strip Rewrite Answer from skeleton
const skeletonRaw   = readFileSync(PATHS.skeleton, 'utf8');
const skeletonBlind = skeletonRaw.replace(
  /^#### Rewrite Answer\n.+$/gm,
  '#### Rewrite Answer\n(redacted — verify independently from image)'
);

const frameworkContent = readFileSync(PATHS.framework, 'utf8');
const claudeContent    = readFileSync(PATHS.claude_md,  'utf8');

// Build prompt text
let promptText = readFileSync(PATHS.prompt, 'utf8');
const sourcesBlock = `**Sources — image is embedded in this message. Do not attempt to read lizard repo paths.**
- Screenshot (image): embedded as base64 in this message — **primary source of truth**; read this image before any annotation work.
- Playbook (reference only, not embedded — too large): \`${PATHS.playbook}\`
- Framework, project rules, and task skeleton are inlined in full at the end of this prompt.`;
promptText = promptText.replace(
  /\*\*Sources available in your sandbox\*\*[\s\S]*?6\. `CLAUDE\.md` — project rules\./,
  sourcesBlock
);
// Output instruction override: non-interactive mode has no sandbox filesystem — output full review to stdout
promptText = promptText.replace(
  /Write your verdict to `review\.md` in your sandbox[^.]*\./,
  'Output your full review directly in your response (there is no sandbox filesystem in this mode — your text response IS the review).'
);

const fullText = `${promptText}

---

## Inlined: Framework (wiki/guideline-patterns.md)

${frameworkContent}

---

## Inlined: Project Rules (CLAUDE.md)

${claudeContent}

---

## Inlined: Task Skeleton (tasks/skeleton/${STEM}.md)

${skeletonBlind}
`;

// Build stream-json message with image + text
const imgData = readFileSync(PATHS.screenshot).toString('base64');
const mediaType = PATHS.screenshot_ext === 'jpg' || PATHS.screenshot_ext === 'jpeg'
  ? 'image/jpeg' : `image/${PATHS.screenshot_ext}`;

// Generate quadrant crops via sips so Opus gets zoom-level detail on each region
function makeQuadrantCrops(srcPath, ext) {
  const dimsRaw = execSync(`sips -g pixelWidth -g pixelHeight ${JSON.stringify(srcPath)}`, { encoding: 'utf8' });
  const w = parseInt(dimsRaw.match(/pixelWidth:\s*(\d+)/)[1]);
  const h = parseInt(dimsRaw.match(/pixelHeight:\s*(\d+)/)[1]);
  const hw = Math.floor(w / 2);
  const hh = Math.floor(h / 2);
  const quadrants = [
    { label: 'top-left',     offY: 0,  offX: 0,  cropH: hh, cropW: hw },
    { label: 'top-right',    offY: 0,  offX: hw, cropH: hh, cropW: hw },
    { label: 'bottom-left',  offY: hh, offX: 0,  cropH: hh, cropW: hw },
    { label: 'bottom-right', offY: hh, offX: hw, cropH: hh, cropW: hw },
  ];
  const crops = [];
  for (const q of quadrants) {
    const tmp = join(tmpdir(), `opus-crop-${STEM}-${q.label}-${Date.now()}.${ext}`);
    try {
      execSync(
        `sips --cropOffset ${q.offY} ${q.offX} -c ${q.cropH} ${q.cropW} ${JSON.stringify(srcPath)} --out ${JSON.stringify(tmp)}`,
        { encoding: 'utf8' }
      );
      crops.push({ label: q.label, data: readFileSync(tmp).toString('base64') });
      try { unlinkSync(tmp); } catch {}
    } catch (e) {
      console.error(`[run-opus-reviewer] crop failed for ${q.label}: ${e.message}`);
    }
  }
  console.error(`[run-opus-reviewer] generated ${crops.length} quadrant crops (${w}x${h} → 4x ${hw}x${hh})`);
  return crops;
}

const quadCrops = makeQuadrantCrops(PATHS.screenshot, PATHS.screenshot_ext);

// Assemble content: full image first, then quadrant crops with labels, then text
const imageBlocks = [
  { type: 'image', source: { type: 'base64', media_type: mediaType, data: imgData } },
  { type: 'text', text: 'The image above is the full screenshot. Below are 4 quadrant crops (top-left, top-right, bottom-left, bottom-right) at 2x effective zoom. Use these for fine-grained element reads.' },
  ...quadCrops.flatMap(q => [
    { type: 'text', text: `Quadrant: ${q.label}` },
    { type: 'image', source: { type: 'base64', media_type: mediaType, data: q.data } },
  ]),
];

const streamMsg = JSON.stringify({
  type: 'user',
  message: {
    role: 'user',
    content: [
      ...imageBlocks,
      { type: 'text', text: fullText },
    ],
  },
});

console.error(`[run-opus-reviewer] image size: ${Math.round(imgData.length/1024)}KB base64`);
console.error(`[run-opus-reviewer] prompt length: ${fullText.length} chars`);
console.error(`[run-opus-reviewer] writing output to: ${OUT}`);

// Write stream-json to temp file to avoid shell escaping issues
const tmpInput = join(tmpdir(), `opus-review-${STEM}-${Date.now()}.json`);
writeFileSync(tmpInput, streamMsg, 'utf8');
console.error(`[run-opus-reviewer] stream-json written to: ${tmpInput}`);

// Run claude -p with stream-json
const result = execSync(
  `claude -p --model claude-opus-4-7 --input-format=stream-json --output-format=stream-json --verbose --dangerously-skip-permissions < ${JSON.stringify(tmpInput)}`,
  { encoding: 'utf8', maxBuffer: 50 * 1024 * 1024, timeout: 300000 }
);

// Cleanup temp file
try { unlinkSync(tmpInput); } catch { }

// Extract result text
let reviewText = '';
for (const line of result.split('\n')) {
  const trimmed = line.trim();
  if (!trimmed) continue;
  try {
    const obj = JSON.parse(trimmed);
    if (obj.type === 'result') {
      reviewText = obj.result ?? '';
      break;
    }
  } catch { /* skip */ }
}

if (!reviewText) {
  console.error('[run-opus-reviewer] ERROR: no result in output');
  console.error('raw tail:', result.slice(-500));
  process.exit(1);
}

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, reviewText, 'utf8');
console.error(`[run-opus-reviewer] done — ${reviewText.length} chars`);
process.stdout.write(reviewText);

function dirname(p) {
  return p.split('/').slice(0, -1).join('/') || '.';
}
