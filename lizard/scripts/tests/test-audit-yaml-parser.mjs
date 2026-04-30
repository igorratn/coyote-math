#!/usr/bin/env node
// test-audit-yaml-parser.mjs
// Coverage for the YAML-in-fenced-block parser used by audit-skill-tags.mjs
// to extract opus's audit deltas. Inputs modeled after legacy task-file
// patterns (e.g. tasks/Plot_T-test_graph_visualization_30.md, where Spatial
// Reasoning was dropped consistently across all 5 annots).

import { execSync } from 'node:child_process';

// Import the parser by extracting via a tiny eval shim. The function is not
// exported from audit-skill-tags.mjs (top-level script), so we re-import the
// definition by reading the file. Cleaner: refactor parseAuditYaml into its
// own module if these tests stay. For now, keep self-contained.
import fs from 'node:fs';
const src = fs.readFileSync(new URL('../audit-skill-tags.mjs', import.meta.url), 'utf8');
const fn = src.match(/function parseAuditYaml\([\s\S]*?\n\}/)[0];
const parseAuditYaml = new Function(
  'VALID_SKILLS', 'VALID_QTYPES',
  `${fn}\nreturn parseAuditYaml;`
)(
  ['Enumeration','Attribute Perception','Spatial Reasoning','Math Reasoning','Logical Reasoning','Table/Chart/Graph Understanding','World Knowledge'],
  ['MCQ','Short answer question'],
);

let failed = 0;
const fail = (msg) => { console.error(`  FAIL: ${msg}`); failed++; };
const pass = (msg) => { console.error(`  ok:   ${msg}`); };
function assertEq(label, got, expect) {
  if (JSON.stringify(got) === JSON.stringify(expect)) pass(label);
  else fail(`${label} → got ${JSON.stringify(got)}; expected ${JSON.stringify(expect)}`);
}

// ---------- legacy-shape: single drop (Plot_T-test 5/5 case) ----------
{
  const r = parseAuditYaml('```yaml\ndrop: [Spatial Reasoning]\nadd: []\nreason: "Chart-reading task, not relational layout reasoning."\n```');
  assertEq('legacy: single drop SR', r, { drop: ['Spatial Reasoning'], add: [], reason: 'Chart-reading task, not relational layout reasoning.' });
}

// ---------- drop + add (Plot_T-test multi-edit case) ----------
{
  const r = parseAuditYaml('```yaml\ndrop: [Spatial Reasoning]\nadd: [Table/Chart/Graph Understanding]\nreason: "Anchor missing; SR over-tagged on chart-reading."\n```');
  assertEq('legacy: drop SR + add TCG', r, { drop: ['Spatial Reasoning'], add: ['Table/Chart/Graph Understanding'], reason: 'Anchor missing; SR over-tagged on chart-reading.' });
}

// ---------- qtype-only add (Plot_Structural_84 case) ----------
{
  const r = parseAuditYaml('```yaml\ndrop: []\nadd: [Short answer question]\nreason: "SAQ qtype not checked."\n```');
  assertEq('legacy: add Short answer question (qtype)', r, { drop: [], add: ['Short answer question'], reason: 'SAQ qtype not checked.' });
}

// ---------- multiple drops (Plot_Gene_expression_133 style) ----------
{
  const r = parseAuditYaml('```yaml\ndrop: [Spatial Reasoning, Attribute Perception]\nadd: [Enumeration]\nreason: "Removed SR and AP (over-tagged); Enumeration is the primary operation."\n```');
  assertEq('legacy: multi-drop + add', r, { drop: ['Spatial Reasoning', 'Attribute Perception'], add: ['Enumeration'], reason: 'Removed SR and AP (over-tagged); Enumeration is the primary operation.' });
}

// ---------- empty (skills correct as tagged) ----------
{
  const r = parseAuditYaml('```yaml\ndrop: []\nadd: []\nreason: "Skills correct as tagged."\n```');
  assertEq('legacy: empty edits', r, { drop: [], add: [], reason: 'Skills correct as tagged.' });
}

// ---------- backtick-quoted skill names (model variation) ----------
{
  const r = parseAuditYaml('```yaml\ndrop: [`Spatial Reasoning`]\nadd: []\nreason: "Drop SR."\n```');
  assertEq('quoted with backticks', r, { drop: ['Spatial Reasoning'], add: [], reason: 'Drop SR.' });
}

// ---------- single-quoted (model variation) ----------
{
  const r = parseAuditYaml(`\`\`\`yaml\ndrop: ['Spatial Reasoning']\nadd: []\nreason: "Drop SR."\n\`\`\``);
  assertEq('single-quoted skills', r, { drop: ['Spatial Reasoning'], add: [], reason: 'Drop SR.' });
}

// ---------- double-quoted (model variation) ----------
{
  const r = parseAuditYaml('```yaml\ndrop: ["Spatial Reasoning"]\nadd: []\nreason: "Drop SR."\n```');
  assertEq('double-quoted skills', r, { drop: ['Spatial Reasoning'], add: [], reason: 'Drop SR.' });
}

// ---------- unfenced output (no triple backticks) ----------
{
  const r = parseAuditYaml('drop: [Spatial Reasoning]\nadd: []\nreason: "Drop SR."');
  assertEq('unfenced', r, { drop: ['Spatial Reasoning'], add: [], reason: 'Drop SR.' });
}

// ---------- prose around the YAML block (model adds explanation) ----------
{
  const r = parseAuditYaml('Here is the audit:\n\n```yaml\ndrop: [Spatial Reasoning]\nadd: []\nreason: "Drop SR; chart-reading."\n```\n\nLet me know if you need more details.');
  assertEq('prose wrapper around fenced block', r, { drop: ['Spatial Reasoning'], add: [], reason: 'Drop SR; chart-reading.' });
}

// ---------- invalid skill name ignored ----------
{
  const r = parseAuditYaml('```yaml\ndrop: [Quantum Reasoning, Spatial Reasoning]\nadd: []\nreason: "Drop SR; ignore typo."\n```');
  assertEq('invalid skill filtered out', r, { drop: ['Spatial Reasoning'], add: [], reason: 'Drop SR; ignore typo.' });
}

// ---------- unquoted reason (no quotes around reason text) ----------
{
  const r = parseAuditYaml('```yaml\ndrop: [Spatial Reasoning]\nadd: []\nreason: Drop SR per chart-reading rule\n```');
  assertEq('unquoted reason', r, { drop: ['Spatial Reasoning'], add: [], reason: 'Drop SR per chart-reading rule' });
}

// ---------- whitespace tolerance ----------
{
  const r = parseAuditYaml('```yaml\n  drop:  [ Spatial Reasoning ]  \n  add:  [ ]  \n  reason:  "Drop SR."  \n```');
  assertEq('whitespace tolerance', r, { drop: ['Spatial Reasoning'], add: [], reason: 'Drop SR.' });
}

// ---------- malformed (missing add) returns null ----------
{
  const r = parseAuditYaml('```yaml\ndrop: [Spatial Reasoning]\n```');
  assertEq('malformed (missing add) → null', r, null);
}

// ---------- empty input returns null ----------
{
  const r = parseAuditYaml('');
  assertEq('empty input → null', r, null);
  const r2 = parseAuditYaml(null);
  assertEq('null input → null', r2, null);
}

// ---------- legacy-real: full opus-style prose+yaml combo ----------
{
  const opusOutput = `Looking at this annotation, the prompt asks the model to read values from chart contour labels, which is purely chart-reading.

\`\`\`yaml
drop: [Spatial Reasoning]
add: []
reason: "Counting labels in a quadrant is chart-reading + enumeration, not relational position reasoning."
\`\`\``;
  const r = parseAuditYaml(opusOutput);
  assertEq('realistic opus prose+yaml', r, { drop: ['Spatial Reasoning'], add: [], reason: 'Counting labels in a quadrant is chart-reading + enumeration, not relational position reasoning.' });
}

// ---------- Result ----------
if (failed) {
  console.error(`\n[test-audit-yaml-parser] ${failed} FAIL`);
  process.exit(1);
}
console.error(`\n[test-audit-yaml-parser] all PASS`);
