#!/usr/bin/env node
// run-grok-reviewer.mjs (thin wrapper, 2026-04-25)
// Backward-compat shim — delegates to scripts/run-reviewer.mjs with REVIEWER=grok.
// Same env interface preserved: STEM, OUT, XAI_API_KEY, GROK_MODEL.
// New: ANNOTS env (comma-separated annot numbers; default = all per cycle).

process.env.REVIEWER = 'grok';
await import('./run-reviewer.mjs');
