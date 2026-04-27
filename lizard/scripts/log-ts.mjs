// log-ts.mjs
// Side-effect import: prefixes every console.error line with [HH:MM:SS].
// Import once at the top of long-running scripts (reviewers, test-helpers)
// so the live stderr stream is easier to scan when a step is slow.
//
// Usage:  import './log-ts.mjs';   // no named exports; purely monkey-patches console.error

const origError = console.error.bind(console);

function ts() {
  const d = new Date();
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  const ss = String(d.getSeconds()).padStart(2, '0');
  return `[${hh}:${mm}:${ss}]`;
}

console.error = (...args) => origError(ts(), ...args);
