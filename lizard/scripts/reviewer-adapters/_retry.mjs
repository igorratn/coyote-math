// reviewer-adapters/_retry.mjs
// Shared retry helper for handling output-cap truncation across reviewer adapters.
//
// Each provider's API can return a finish reason indicating the response was
// truncated because it hit `max_output_tokens` (gemini: 'MAX_TOKENS', openai/xai:
// 'length'). Truncated output is incomplete (missing closing annotation blocks)
// and the validator drops the reviewer — but it's not a real failure, just a
// knob mismatch. CLI doubles the cap and retries; only fails after the bound.
//
// Usage in adapter:
//   const text = await withCapRetry(
//     async (cap) => {
//       // single-shot call; return { text, hitCap: boolean }
//     },
//     { initial: defaultMaxOut, maxRetries: 2, label: '[gemini]' },
//   );
//
// Choreography note: this is a stamp-pattern helper, not an orchestrator. Each
// adapter is still its own actor — it owns its retry decision; this just
// removes the duplicated doubling/bookkeeping.

export async function withCapRetry(once, { initial, maxRetries = 2, label = '[adapter]' }) {
  let cap = initial;
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    const { text, hitCap } = await once(cap);
    if (!hitCap) return text;
    if (attempt < maxRetries) {
      const next = cap * 2;
      console.error(`${label} hit output cap at ${cap} tokens — doubling to ${next} and retrying (attempt ${attempt + 2}/${maxRetries + 1})`);
      cap = next;
    }
  }
  console.error(`${label} ERROR: output cap still hit at ${cap} tokens after ${maxRetries + 1} attempts`);
  process.exit(1);
}
