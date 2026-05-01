// reviewer-adapters/openai-compat.mjs
// Adapter for OpenAI-compatible REST APIs. Used by:
//   - gpt    → https://api.openai.com/v1/chat/completions     (OPENAI_API_KEY)
//   - grok   → https://api.x.ai/v1/chat/completions           (XAI_API_KEY)
//
// Same request/response shape:
//   POST {base_url}/v1/chat/completions
//   { model, messages: [{role, content: [{type, ...}]}], reasoning_effort? }
//   → { choices: [{ message: { content: <text> }}], usage: {...} }
//
// Image content: { type: 'image_url', image_url: { url: 'data:<mediaType>;base64,...' } }
// Text content : { type: 'text', text: '...' }

const TIMEOUT_MS = 600_000;  // 10 min per request (gpt-5 with images can take 5-8 min)
const MAX_RETRIES = 3;

// Undici's default headersTimeout is 300s — grok-4 can exceed that on large prompts.
// Use undici's own fetch + Agent (same package) — Node's built-in fetch rejects cross-version dispatchers.
import { fetch as undiciFetch, Agent } from 'undici';
const dispatcher = new Agent({ headersTimeout: TIMEOUT_MS, bodyTimeout: TIMEOUT_MS });

export const profiles = {
  gpt: {
    name: 'gpt',
    envKey: 'OPENAI_API_KEY',
    baseUrl: 'https://api.openai.com',
    defaultModel: 'gpt-5',
    modelEnv: 'GPT_MODEL',
    reasoningEnv: 'GPT_REASONING',
  },
  grok: {
    name: 'grok',
    envKey: 'XAI_API_KEY',
    baseUrl: 'https://api.x.ai',
    defaultModel: 'grok-4',
    modelEnv: 'GROK_MODEL',
    reasoningEnv: 'GROK_REASONING',
  },
};

// Build the API content array (image + text blocks). Same for all OpenAI-compat.
function buildContent({ mainImageBase64, mediaType, quadCrops, promptText }) {
  const content = [
    { type: 'image_url', image_url: { url: `data:${mediaType};base64,${mainImageBase64}` } },
    { type: 'text', text: 'The image above is the full screenshot. Below are 4 quadrant crops (top-left, top-right, bottom-left, bottom-right) at 2x effective zoom. Use these for fine-grained element reads.' },
  ];
  for (const q of quadCrops) {
    content.push({ type: 'text', text: `Quadrant: ${q.label}` });
    content.push({ type: 'image_url', image_url: { url: `data:${mediaType};base64,${q.data}` } });
  }
  content.push({ type: 'text', text: promptText });
  return content;
}

export async function review({ profile, mainImageBase64, mediaType, quadCrops, promptText }) {
  const apiKey = process.env[profile.envKey];
  if (!apiKey) {
    console.error(`ERROR: ${profile.envKey} not set (check .env or shell env)`);
    process.exit(1);
  }
  const model = process.env[profile.modelEnv] ?? profile.defaultModel;
  const reasoning = process.env[profile.reasoningEnv]; // optional

  const content = buildContent({ mainImageBase64, mediaType, quadCrops, promptText });
  const payload = { model, messages: [{ role: 'user', content }] };
  if (reasoning) payload.reasoning_effort = reasoning;

  console.error(`[${profile.name}] model: ${model}${reasoning ? ` (reasoning=${reasoning})` : ''}`);
  console.error(`[${profile.name}] image size: ${Math.round(mainImageBase64.length/1024)}KB base64`);
  console.error(`[${profile.name}] prompt length: ${promptText.length} chars`);

  const result = await callWithRetry(profile, payload, apiKey, 1);
  const reviewText = result?.choices?.[0]?.message?.content ?? '';
  if (!reviewText) {
    console.error(`[${profile.name}] ERROR: empty response`);
    console.error('raw:', JSON.stringify(result).slice(0, 500));
    process.exit(1);
  }
  if (result.usage) {
    const u = result.usage;
    const reasoningTokens = u.completion_tokens_details?.reasoning_tokens ?? 'n/a';
    console.error(`[${profile.name}] tokens: in=${u.prompt_tokens} out=${u.completion_tokens} reasoning=${reasoningTokens} total=${u.total_tokens}`);
  }
  return reviewText;
}

async function callWithRetry(profile, payload, apiKey, attempt) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  try {
    const resp = await undiciFetch(`${profile.baseUrl}/v1/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      signal: ctrl.signal,
      dispatcher,
    });
    clearTimeout(t);
    if (resp.status >= 500 && attempt < MAX_RETRIES) {
      console.error(`[${profile.name}] ${resp.status} from ${profile.baseUrl}, retrying (${attempt+1}/${MAX_RETRIES})...`);
      await new Promise(r => setTimeout(r, 2000 * attempt));
      return callWithRetry(profile, payload, apiKey, attempt + 1);
    }
    if (resp.status === 429 && attempt < MAX_RETRIES) {
      console.error(`[${profile.name}] 429 rate limit, retrying (${attempt+1}/${MAX_RETRIES})...`);
      await new Promise(r => setTimeout(r, 5000 * attempt));
      return callWithRetry(profile, payload, apiKey, attempt + 1);
    }
    const text = await resp.text();
    if (!resp.ok) {
      console.error(`[${profile.name}] HTTP ${resp.status}: ${text.slice(0, 500)}`);
      process.exit(1);
    }
    return JSON.parse(text);
  } finally {
    clearTimeout(t);
  }
}
