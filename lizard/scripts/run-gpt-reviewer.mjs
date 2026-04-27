#!/usr/bin/env node
// run-gpt-reviewer.mjs (thin wrapper, 2026-04-25)
// Backward-compat shim — delegates to scripts/run-reviewer.mjs with REVIEWER=gpt.
// Original ~240 LOC moved into scripts/run-reviewer.mjs + scripts/reviewer-shared.mjs
// + scripts/reviewer-adapters/openai-compat.mjs.
//
// Same env interface preserved: STEM, OUT, OPENAI_API_KEY, GPT_MODEL, GPT_REASONING.
// New: ANNOTS env (comma-separated annot numbers; default = all per cycle).

process.env.REVIEWER = 'gpt';
await import('./run-reviewer.mjs');
