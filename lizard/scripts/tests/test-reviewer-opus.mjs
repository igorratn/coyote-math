#!/usr/bin/env node
// test-reviewer-opus.mjs — thin wrapper; delegates to test-reviewer.mjs
import('./test-reviewer.mjs').then(m => m.run('opus'));
