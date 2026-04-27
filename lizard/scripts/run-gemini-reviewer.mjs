#!/usr/bin/env node
// run-gemini-reviewer.mjs (thin wrapper, 2026-04-25)
// Backward-compat shim — delegates to scripts/run-reviewer.mjs with REVIEWER=gemini.
// Same env interface preserved: STEM, OUT, GEMINI_API_KEY, GEMINI_MODEL, GEMINI_MAX_OUT.
// New: ANNOTS env (comma-separated annot numbers; default = all per cycle).

process.env.REVIEWER = 'gemini';
await import('./run-reviewer.mjs');
