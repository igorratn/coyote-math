// reviewer-adapters/opus-cli.mjs
// Adapter for Opus 4.7 via the local `claude` CLI subprocess (stream-json).
// Not an HTTP API — uses the Anthropic stream-json content shape:
//   { type: 'user', message: { role, content: [{type, source|text}, ...] } }
//   Sent via stdin to: claude -p --model claude-opus-4-7 --input-format=stream-json
//                                                       --output-format=stream-json --verbose
//                                                       --dangerously-skip-permissions
//   Output: line-delimited JSON; final line with type=='result' has the response text.
//
// Image content uses Anthropic's shape:
//   { type: 'image', source: { type: 'base64', media_type, data } }

import { writeFileSync, unlinkSync } from 'fs';
import { execSync } from 'child_process';
import { join } from 'path';
import { tmpdir } from 'os';

const TIMEOUT_MS = 900_000;  // 15 min — Opus can chain a lot of reasoning

export const profile = {
  name: 'opus',
  envKey: null,  // no API key — uses claude CLI auth
  defaultModel: 'claude-opus-4-7',
  modelEnv: 'OPUS_MODEL',
};

function buildContent({ mainImageBase64, mediaType, quadCrops, promptText }) {
  return [
    { type: 'image', source: { type: 'base64', media_type: mediaType, data: mainImageBase64 } },
    { type: 'text', text: 'The image above is the full screenshot. Below are 4 quadrant crops (top-left, top-right, bottom-left, bottom-right) at 2x effective zoom. Use these for fine-grained element reads.' },
    ...quadCrops.flatMap(q => [
      { type: 'text', text: `Quadrant: ${q.label}` },
      { type: 'image', source: { type: 'base64', media_type: mediaType, data: q.data } },
    ]),
    { type: 'text', text: promptText },
  ];
}

export async function review({ STEM, mainImageBase64, mediaType, quadCrops, promptText }) {
  const model = process.env[profile.modelEnv] ?? profile.defaultModel;
  const content = buildContent({ mainImageBase64, mediaType, quadCrops, promptText });
  const streamMsg = JSON.stringify({
    type: 'user',
    message: { role: 'user', content },
  });

  console.error(`[opus] model: ${model}`);
  console.error(`[opus] image size: ${Math.round(mainImageBase64.length/1024)}KB base64`);
  console.error(`[opus] prompt length: ${promptText.length} chars`);

  const tmpInput = join(tmpdir(), `opus-review-${STEM}-${Date.now()}.json`);
  writeFileSync(tmpInput, streamMsg, 'utf8');
  console.error(`[opus] stream-json written to: ${tmpInput}`);

  let raw;
  try {
    raw = execSync(
      `claude -p --model ${model} --input-format=stream-json --output-format=stream-json --verbose --dangerously-skip-permissions < ${JSON.stringify(tmpInput)}`,
      { encoding: 'utf8', maxBuffer: 50 * 1024 * 1024, timeout: TIMEOUT_MS, killSignal: 'SIGKILL' }
    );
  } finally {
    try { unlinkSync(tmpInput); } catch {}
  }

  // Parse line-delimited JSON, extract the type=='result' message
  let reviewText = '';
  for (const line of raw.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    try {
      const obj = JSON.parse(trimmed);
      if (obj.type === 'result') {
        reviewText = obj.result ?? '';
        break;
      }
    } catch { /* skip non-JSON lines */ }
  }
  if (!reviewText) {
    console.error('[opus] ERROR: no type=result line in stream-json output');
    console.error('raw tail:', raw.slice(-500));
    process.exit(1);
  }
  return reviewText;
}
