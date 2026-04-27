// reviewer-shared.mjs
// Shared logic across all reviewer subprocesses. Owns the model-agnostic
// pieces: skeleton load + filter + blind, framework/CLAUDE.md inlining,
// sips quadrant cropping, prompt assembly, output writing.
//
// Model-specific pieces (API call, response parsing) live in
// scripts/reviewer-adapters/<reviewer>.mjs and are dispatched by
// scripts/run-reviewer.mjs.
//
// Pure module — no top-level side effects. Called as functions.

import { readFileSync, existsSync, writeFileSync, mkdirSync, unlinkSync } from 'fs';
import { resolve, join, dirname } from 'path';
import { execSync } from 'child_process';
import { tmpdir } from 'os';
import { buildReviewerView, defaultReviewAnnots } from './reviewer-view.mjs';

// Resolve paths + load all source files needed for the reviewer prompt.
// Returns { paths, skeletonView, framework, claudeMd, mediaType, mainImageBase64, quadCrops, OUT }
export function prepareReview({ STEM, LIZARD_DIR, OUT }) {
  if (!STEM) throw new Error('STEM env var required');
  if (!LIZARD_DIR) throw new Error('LIZARD_DIR required');

  const paths = {
    prompt:    join(LIZARD_DIR, 'templates', 'review-prompt.md'),
    skeleton:  join(LIZARD_DIR, 'tasks', 'skeleton', `${STEM}.md`),
    framework: join(LIZARD_DIR, 'wiki', 'guideline-patterns.md'),
    claude_md: join(LIZARD_DIR, 'CLAUDE.md'),
    playbook:  join(LIZARD_DIR, 'references', 'playbook_reviewer.md'),
  };
  for (const ext of ['png', 'jpg', 'jpeg', 'webp']) {
    const p = join(LIZARD_DIR, 'screenshots', `${STEM}.${ext}`);
    if (existsSync(p)) { paths.screenshot = p; paths.screenshot_ext = ext; break; }
  }
  if (!paths.screenshot) throw new Error(`screenshot not found for ${STEM}`);

  // Required-paths sanity check
  for (const key of ['prompt', 'skeleton', 'framework', 'claude_md', 'screenshot']) {
    if (!existsSync(paths[key])) throw new Error(`required path missing: ${key} = ${paths[key]}`);
  }

  // Load + filter skeleton
  const skeletonRaw = readFileSync(paths.skeleton, 'utf8');
  const annotsList = process.env.ANNOTS
    ? process.env.ANNOTS.split(',').map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n))
    : defaultReviewAnnots(skeletonRaw);
  const skeletonView = buildReviewerView(skeletonRaw, { annots: annotsList });

  const framework = readFileSync(paths.framework, 'utf8');
  const claudeMd  = readFileSync(paths.claude_md,  'utf8');

  // Image data
  const mainImageBase64 = readFileSync(paths.screenshot).toString('base64');
  const mediaType = paths.screenshot_ext === 'jpg' || paths.screenshot_ext === 'jpeg'
    ? 'image/jpeg' : `image/${paths.screenshot_ext}`;

  // Quadrant crops (sips, macOS)
  const quadCrops = makeQuadrantCrops(paths.screenshot, paths.screenshot_ext, STEM);

  const outPath = OUT;  // caller-supplied (e.g. /tmp/lizard/<stem>/<reviewer>-review.md)

  return {
    paths, annotsList, skeletonView, framework, claudeMd,
    mediaType, mainImageBase64, quadCrops,
    OUT: outPath,
  };
}

function makeQuadrantCrops(srcPath, ext, STEM) {
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
    const tmp = join(tmpdir(), `reviewer-crop-${STEM}-${q.label}-${Date.now()}.${ext}`);
    try {
      execSync(
        `sips --cropOffset ${q.offY} ${q.offX} -c ${q.cropH} ${q.cropW} ${JSON.stringify(srcPath)} --out ${JSON.stringify(tmp)}`,
        { encoding: 'utf8' }
      );
      crops.push({ label: q.label, data: readFileSync(tmp).toString('base64') });
      try { unlinkSync(tmp); } catch {}
    } catch (e) {
      console.error(`[reviewer-shared] crop failed for ${q.label}: ${e.message}`);
    }
  }
  console.error(`[reviewer-shared] generated ${crops.length} quadrant crops (${w}x${h} → 4x ${hw}x${hh})`);
  return crops;
}

// Build the inlined prompt text shown to the model. Same template across all
// reviewers — model-specific assembly (image + content blocks + API payload)
// is the adapter's job.
export function buildPromptText({ STEM, paths, skeletonView, framework, claudeMd }) {
  let promptText = readFileSync(paths.prompt, 'utf8');
  const sourcesBlock = `**Sources — image is embedded in this message. Do not attempt to read lizard repo paths.**
- Screenshot (image): embedded as base64 in this message — **primary source of truth**; read this image before any annotation work.
- Playbook (reference only, not embedded — too large): \`${paths.playbook}\`
- Framework, project rules, and task skeleton are inlined in full at the end of this prompt.`;
  promptText = promptText.replace(
    /\*\*Sources available in your sandbox\*\*[\s\S]*?6\. `CLAUDE\.md` — project rules\./,
    sourcesBlock
  );
  promptText = promptText.replace(
    /Write your verdict to `review\.md` in your sandbox[^.]*\./,
    'Output your full review directly in your response (there is no sandbox filesystem in this mode — your text response IS the review).'
  );
  return `${promptText}

---

## Inlined: Framework (wiki/guideline-patterns.md)

${framework}

---

## Inlined: Project Rules (CLAUDE.md)

${claudeMd}

---

## Inlined: Task Skeleton (tasks/skeleton/${STEM}.md, filtered to ANNOTS, blinded)

${skeletonView}
`;
}

// Write the reviewer's response to disk + echo to stdout.
export function writeReviewOutput(OUT, reviewText) {
  if (!reviewText || reviewText.length === 0) {
    console.error('[reviewer-shared] ERROR: empty review text — refusing to write');
    process.exit(1);
  }
  mkdirSync(dirname(OUT), { recursive: true });
  writeFileSync(OUT, reviewText, 'utf8');
  console.error(`[reviewer-shared] wrote review to ${OUT} (${reviewText.length} chars)`);
  process.stdout.write(reviewText);
}

// Load .env entries into process.env if not already set.
export function loadDotEnv(LIZARD_DIR) {
  const envPath = join(LIZARD_DIR, '.env');
  if (!existsSync(envPath)) return;
  const envText = readFileSync(envPath, 'utf8');
  for (const line of envText.split('\n')) {
    const m = line.match(/^\s*([A-Z_][A-Z0-9_]*)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
}
