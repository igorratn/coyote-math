#!/usr/bin/env node
// run-opus-reviewer.mjs (thin wrapper, 2026-04-25)
// Backward-compat shim — delegates to scripts/run-reviewer.mjs with REVIEWER=opus.
// Same env interface preserved: STEM, OUT, OPUS_MODEL.
// (Uses local `claude` CLI auth; no API key env required.)
// New: ANNOTS env (comma-separated annot numbers; default = all per cycle).

process.env.REVIEWER = 'opus';
await import('./run-reviewer.mjs');
