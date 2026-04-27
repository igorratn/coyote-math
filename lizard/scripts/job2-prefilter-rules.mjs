// job2-prefilter-rules.mjs
// Pure rules + helpers for the Job 2 prefilter. Importable from tests
// without triggering CLI side-effects.
//
// The CLI entrypoint (job2-prefilter.mjs) imports from this module.
// Unit tests in scripts/tests/test-prefilter-*.mjs also import from here.
//
// Keep this module side-effect free: no fs, no process.exit, no env reads.

export const VALID_SKILLS = new Set([
  'Enumeration', 'Attribute Perception', 'Spatial Reasoning',
  'Math Reasoning', 'Logical Reasoning',
  'Table/Chart/Graph Understanding', 'World Knowledge',
]);

export const ANCHOR_SKILLS = new Set([
  'Logical Reasoning', 'Table/Chart/Graph Understanding', 'World Knowledge',
]);

// V6 letter/vowel/consonant/character counting ban
export const V6_LETTER_BAN = /count\s+(?:the\s+)?(?:total\s+)?(?:number\s+of\s+)?(?:letters|vowels|consonants|characters)/i;

// Cross-annotation reference (G4)
export const G4_CROSS_REF = /\b(previous|prior|next|preceding|above|earlier)\s+(annotation|question|prompt|task)\b/i;

// Subjectivity red flags (G2)
export const G2_SUBJECTIVE = /\b(best|worst|most\s+(?:beautiful|attractive|pleasing|interesting)|your\s+opinion|in\s+your\s+view)\b/i;

// Split a skeleton into per-annotation entries. Cycle-2 sections override
// cycle-1 sections for the same N. Returns [{ n, status, block }, ...].
export function parseAnnotations(src) {
  const cycle2Re = /^### Cycle 2 — Annotation (\d+)(.*)$/gm;
  const cycle1Re = /^## Annotation (\d+)\s*$/gm;

  const annots = new Map();

  // Cycle-1 blocks
  const c1Locs = [];
  let m;
  while ((m = cycle1Re.exec(src)) !== null) c1Locs.push({ n: parseInt(m[1], 10), start: m.index });
  for (let i = 0; i < c1Locs.length; i++) {
    const end = (i + 1 < c1Locs.length) ? c1Locs[i + 1].start : src.length;
    const block = src.slice(c1Locs[i].start, end);
    const c2Start = block.indexOf('\n## Cycle 2 Review');
    const trimmed = c2Start !== -1 ? block.slice(0, c2Start) : block;
    annots.set(c1Locs[i].n, { status: 'cycle1', block: trimmed });
  }

  // Cycle-2 blocks override
  const c2Locs = [];
  while ((m = cycle2Re.exec(src)) !== null) {
    const header = m[0];
    const status = /\[UNCHANGED\]/.test(header) ? 'unchanged'
                 : /\[CHANGED/.test(header)   ? 'changed'
                 : 'unknown';
    c2Locs.push({ n: parseInt(m[1], 10), start: m.index, status });
  }
  for (let i = 0; i < c2Locs.length; i++) {
    const end = (i + 1 < c2Locs.length) ? c2Locs[i + 1].start : src.length;
    const block = src.slice(c2Locs[i].start, end);
    annots.set(c2Locs[i].n, { status: c2Locs[i].status, block });
  }

  return [...annots.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([n, v]) => ({ n, ...v }));
}

export function extractField(block, label) {
  const re = new RegExp(`\\*\\*${label}:\\*\\*\\s*(.+?)$`, 'm');
  const m = re.exec(block);
  return m ? m[1].trim() : null;
}

export function extractPrompt(block) {
  const re = /#### Full Prompt\n([\s\S]*?)(?=\n####|\n---|\n###|\n## |$)/;
  const m = re.exec(block);
  return m ? m[1].trim() : '';
}

export function extractRewriteAnswer(block) {
  const re = /#### Rewrite Answer\n([\s\S]*?)(?=\n####|\n---|\n###|\n## |$)/;
  const m = re.exec(block);
  return m ? m[1].trim() : '';
}

// Run all flag checks on a single annotation entry.
// Returns { n, status, skills_tagged, qtype, flags, skip_review }.
export function flagAnnotation(ann) {
  const flags = [];
  const skillsField = extractField(ann.block, 'Skills Tagged') ?? '';
  const qtype       = extractField(ann.block, 'Question Type') ?? '';
  const prompt      = extractPrompt(ann.block);

  const skills = skillsField
    .split(',')
    .map(s => s.trim())
    .filter(Boolean);

  if (V6_LETTER_BAN.test(prompt)) {
    flags.push({ code: 'V6_LETTER_COUNT', severity: 'hard', note: 'Prompt counts letters/vowels/consonants/characters (V6 ban)' });
  }
  if (G4_CROSS_REF.test(prompt)) {
    flags.push({ code: 'G4_CROSS_REF', severity: 'soft', note: 'Prompt references previous/next/above annotation' });
  }
  if (G2_SUBJECTIVE.test(prompt)) {
    flags.push({ code: 'G2_SUBJECTIVE', severity: 'soft', note: 'Prompt contains subjective wording (best/worst/opinion)' });
  }
  if (skills.length > 0 && skills.length < 2) {
    flags.push({ code: 'G1_SINGLE_SKILL', severity: 'hard', note: `Only ${skills.length} skill tagged (G1 requires 2+)` });
  }
  if (skills.length > 0 && !skills.some(s => ANCHOR_SKILLS.has(s))) {
    flags.push({ code: 'G1_NO_ANCHOR', severity: 'hard', note: 'No V6 anchor skill (Logical Reasoning / TCG Understanding / World Knowledge)' });
  }
  if (skills.length === 2 && skills.includes('Enumeration') && !skills.some(s => ANCHOR_SKILLS.has(s))) {
    flags.push({ code: 'G1_ENUM_ALONE', severity: 'hard', note: 'Enumeration-alone style needs 3+ skills with an anchor' });
  }
  const bad = skills.filter(s => !VALID_SKILLS.has(s));
  if (bad.length) {
    flags.push({ code: 'SKILL_UNKNOWN', severity: 'soft', note: `Unrecognised skill tag(s): ${bad.join(', ')}` });
  }
  const looksMCQ = /\n[A-D]\.\s+\S/.test(prompt);
  if (qtype === 'MCQ' && !looksMCQ) {
    flags.push({ code: 'QTYPE_MISMATCH', severity: 'soft', note: 'Tagged MCQ but no A/B/C/D options detected in prompt' });
  }
  if (qtype === 'SAQ' && looksMCQ) {
    flags.push({ code: 'QTYPE_MISMATCH', severity: 'soft', note: 'Tagged SAQ but A/B/C/D options detected in prompt' });
  }

  return {
    n: ann.n,
    status: ann.status,
    skills_tagged: skills,
    qtype,
    flags,
    skip_review: ann.status === 'unchanged',
  };
}

// Convenience: parse skeleton text + run flagAnnotation on each entry.
export function prefilterSkeleton(skeletonText) {
  return parseAnnotations(skeletonText).map(flagAnnotation);
}
