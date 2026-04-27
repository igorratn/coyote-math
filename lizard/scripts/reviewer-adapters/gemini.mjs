// reviewer-adapters/gemini.mjs
// Adapter for Google Generative Language API (Gemini).
// Different request shape than OpenAI-compat:
//   POST https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key=...
//   { contents: [{ role, parts: [{ inline_data | text }, ...] }],
//     generationConfig: { maxOutputTokens } }
//   → { candidates: [{ content: { parts: [{text}] }, finishReason }], usageMetadata: {...} }

const TIMEOUT_MS = 300_000;
const MAX_RETRIES = 3;

export const profile = {
  name: 'gemini',
  envKey: 'GEMINI_API_KEY',
  defaultModel: 'gemini-2.5-pro',
  modelEnv: 'GEMINI_MODEL',
  maxOutEnv: 'GEMINI_MAX_OUT',
  defaultMaxOut: 8192,
};

function buildParts({ mainImageBase64, mediaType, quadCrops, promptText }) {
  const parts = [
    { inline_data: { mime_type: mediaType, data: mainImageBase64 } },
    { text: 'The image above is the full screenshot. Below are 4 quadrant crops (top-left, top-right, bottom-left, bottom-right) at 2x effective zoom. Use these for fine-grained element reads.' },
  ];
  for (const q of quadCrops) {
    parts.push({ text: `Quadrant: ${q.label}` });
    parts.push({ inline_data: { mime_type: mediaType, data: q.data } });
  }
  parts.push({ text: promptText });
  return parts;
}

export async function review({ mainImageBase64, mediaType, quadCrops, promptText }) {
  const apiKey = process.env[profile.envKey];
  if (!apiKey) {
    console.error(`ERROR: ${profile.envKey} not set (check .env or shell env)`);
    process.exit(1);
  }
  const model = process.env[profile.modelEnv] ?? profile.defaultModel;
  const maxOut = parseInt(process.env[profile.maxOutEnv] ?? profile.defaultMaxOut, 10);

  const parts = buildParts({ mainImageBase64, mediaType, quadCrops, promptText });
  const payload = {
    contents: [{ role: 'user', parts }],
    generationConfig: { maxOutputTokens: maxOut },
  };

  console.error(`[gemini] model: ${model} (maxOut=${maxOut})`);
  console.error(`[gemini] image size: ${Math.round(mainImageBase64.length/1024)}KB base64`);
  console.error(`[gemini] prompt length: ${promptText.length} chars`);

  const result = await callWithRetry(model, apiKey, payload, 1);
  const partsOut = result?.candidates?.[0]?.content?.parts ?? [];
  const reviewText = partsOut.map(p => p.text ?? '').join('');
  const finish = result?.candidates?.[0]?.finishReason;
  if (!reviewText) {
    console.error(`[gemini] ERROR: empty response (finishReason=${finish})`);
    console.error('raw:', JSON.stringify(result).slice(0, 800));
    process.exit(1);
  }
  if (finish === 'MAX_TOKENS') {
    console.error(`[gemini] WARNING: hit MAX_TOKENS — increase GEMINI_MAX_OUT (current ${maxOut})`);
  }
  if (result.usageMetadata) {
    const u = result.usageMetadata;
    console.error(`[gemini] tokens: in=${u.promptTokenCount} out=${u.candidatesTokenCount} thoughts=${u.thoughtsTokenCount ?? 'n/a'} total=${u.totalTokenCount}`);
  }
  return reviewText;
}

async function callWithRetry(model, apiKey, payload, attempt) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  try {
    const resp = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: ctrl.signal,
    });
    clearTimeout(t);
    if (resp.status >= 500 && attempt < MAX_RETRIES) {
      console.error(`[gemini] ${resp.status} from Gemini, retrying (${attempt+1}/${MAX_RETRIES})...`);
      await new Promise(r => setTimeout(r, 2000 * attempt));
      return callWithRetry(model, apiKey, payload, attempt + 1);
    }
    if (resp.status === 429 && attempt < MAX_RETRIES) {
      console.error(`[gemini] 429 rate limit, retrying (${attempt+1}/${MAX_RETRIES})...`);
      await new Promise(r => setTimeout(r, 5000 * attempt));
      return callWithRetry(model, apiKey, payload, attempt + 1);
    }
    const text = await resp.text();
    if (!resp.ok) {
      console.error(`[gemini] HTTP ${resp.status}: ${text.slice(0, 500)}`);
      process.exit(1);
    }
    return JSON.parse(text);
  } finally {
    clearTimeout(t);
  }
}
