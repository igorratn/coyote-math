#!/usr/bin/env node
// test-reviewer-grok.mjs — thin wrapper; delegates to test-reviewer.mjs
import('./test-reviewer.mjs').then(m => m.run('grok'));
