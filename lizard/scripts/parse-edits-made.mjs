// parse-edits-made.mjs
// Parser for the picked reviewer's `**Edits Made:**` field in tasks/<S>.md.
// Returns the {skills_check, skills_uncheck} delta lists that go into payload.
//
// Source: HOST_SOP.legacy.md line 560 — `sa.skills_check` / `sa.skills_uncheck`
// ← skill edits from `Edits Made`. Legacy implementation not preserved in
// repo; this parser is reverse-engineered from observed reviewer phrasings
// and the closed enum of skills + qtypes.
//
// V6 closed enum (per templates/review-prompt.md line 79 + scripts/job2-prefilter-rules.mjs):
//   Skills: Enumeration, Attribute Perception, Spatial Reasoning, Math Reasoning,
//           Logical Reasoning, Table/Chart/Graph Understanding, World Knowledge
//   QTypes: MCQ, Short answer question
//
// QTYPE flips land in skills_check / skills_uncheck (HOST line 589) — they share
// the per-annot 9-checkbox group at SA push.
//
// Choreography note: this parser is pure (no fs, no env). Job 2 merger calls it
// on the picked reviewer's Edits Made; Job 3b reads the Auto Verdict's emitted
// skills lists. No central parser owner — each caller imports.

export const VALID_SKILLS = [
  'Enumeration',
  'Attribute Perception',
  'Spatial Reasoning',
  'Math Reasoning',
  'Logical Reasoning',
  'Table/Chart/Graph Understanding',
  'World Knowledge',
];

export const VALID_QTYPES = ['MCQ', 'Short answer question'];

const ALL_TOKENS = [...VALID_SKILLS, ...VALID_QTYPES];

// Regex-escape a token so we can build dynamic patterns.
function escapeRe(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Strip surrounding ``"' quote chars, trim whitespace.
function unquote(s) {
  return s.trim().replace(/^[`"']+|[`"']+$/g, '').trim();
}

// Split a comma-separated skill list (handles "A, B, C" / "A,B" / quoted variants).
function splitSkills(text) {
  return text
    .split(',')
    .map(s => unquote(s))
    .filter(Boolean);
}

// Match a known token in `text`, allowing surrounding ``"' or no quotes.
// Returns the canonical token (from ALL_TOKENS) if matched, else null.
function findToken(text) {
  for (const t of ALL_TOKENS) {
    const re = new RegExp(`(?:^|\\b|[\`"'])${escapeRe(t)}(?:\\b|[\`"']|$)`, 'i');
    if (re.test(text)) return t;
  }
  return null;
}

// Parse a comma-separated list of skill/qtype names (any may be quoted),
// keeping only the ones in the closed enum (canonicalized).
function parseSkillList(listText) {
  const items = splitSkills(listText);
  const out = [];
  for (const item of items) {
    const canonical = ALL_TOKENS.find(t => t.toLowerCase() === item.toLowerCase());
    if (canonical && !out.includes(canonical)) out.push(canonical);
  }
  return out;
}

// Main entry. Returns { skills_check: [], skills_uncheck: [] }.
// Returns empty arrays if `text` is null/undefined/empty/"None"/"none".
export function parseEditsMade(text) {
  const result = { skills_check: [], skills_uncheck: [] };
  if (!text) return result;
  const trimmed = text.trim();
  if (!trimmed || /^none\.?$/i.test(trimmed)) return result;

  // Helper: add token to a list once.
  const addTo = (list, token) => {
    if (token && !list.includes(token)) list.push(token);
  };

  // Pattern 1: "Changed skill tags from \"A, B, C\" to \"D, E\"" (or backticks/single quotes)
  // Diff = uncheck (before \ after); check (after \ before).
  const changedRe = /Changed\s+skill\s+tags?\s+from\s+["`']([^"`']+)["`']\s+to\s+["`']([^"`']+)["`']/i;
  const changed = changedRe.exec(trimmed);
  if (changed) {
    const before = parseSkillList(changed[1]);
    const after  = parseSkillList(changed[2]);
    for (const s of before) if (!after.includes(s))  addTo(result.skills_uncheck, s);
    for (const s of after)  if (!before.includes(s)) addTo(result.skills_check, s);
    return result;
  }

  // Pattern 2: verb-forward scoping with comma-list inheritance.
  //
  // Find each verb (add/drop/etc), assign it a forward scope that runs from
  // verb.end to the next sentence boundary (`.;:`) OR the next verb position
  // (whichever comes first). All known tokens within a verb's scope inherit
  // that verb. Token's final action = verb of the LAST scope containing it
  // (preserves "considered drop X, but actually add X" semantics).
  //
  // Replaces a backward 80-char-window scan that dropped tokens at the tail
  // of long comma-separated lists (codified 2026-05-06 — CE_55 incident:
  // "add A (paren), B (paren), C (paren)" missed C because verb→C gap > 80).
  //
  // Word-boundary verb patterns. Tight enough to NOT match common nouns.
  const REMOVE_VERB_RE = /\b(?:drop(?:s|ped|ping)?|remove(?:s|d|ing)?|delete(?:s|d|ing)?|kill(?:s|ed)?)\b/gi;
  const ADD_VERB_RE    = /\b(?:add(?:s|ed|ing)?|include(?:s|d|ing)?|append(?:s|ed|ing)?)\b/gi;
  const BOUNDARY_RE    = /[.;]/g;  // `:` excluded — reviewers use "Removed:" / "Added:" as labels, not boundaries

  // Collect all verb matches in document order with their action + position.
  const verbs = [];
  for (const [re, action] of [[REMOVE_VERB_RE, 'uncheck'], [ADD_VERB_RE, 'check']]) {
    re.lastIndex = 0;
    let vm;
    while ((vm = re.exec(trimmed)) !== null) {
      verbs.push({ pos: vm.index, end: vm.index + vm[0].length, action });
    }
  }
  verbs.sort((a, b) => a.pos - b.pos);

  // Each verb's scope: end at next verb OR next sentence boundary (`.;`), whichever first.
  for (let i = 0; i < verbs.length; i++) {
    const v = verbs[i];
    const nextVerbPos = verbs[i + 1]?.pos ?? Infinity;
    BOUNDARY_RE.lastIndex = v.end;
    const bm = BOUNDARY_RE.exec(trimmed);
    const boundaryPos = bm ? bm.index : Infinity;
    v.scopeEnd = Math.min(nextVerbPos, boundaryPos, trimmed.length);
  }

  // Paren-depth check: tokens inside a deeper paren than the verb are JUSTIFICATIONS,
  // not action targets. "Dropped LR (computing a mean is Math Reasoning, not LR)"
  // → Math Reasoning is justification, not a target. (codified 2026-05-06 —
  // Data_Analytics_4 A1 incident: parser dropped Math Reasoning along with LR
  // because both were within the same verb scope; reviewer only meant LR.)
  function parenDepthAt(pos) {
    let d = 0;
    for (let i = 0; i < pos; i++) {
      if (trimmed[i] === '(') d++;
      else if (trimmed[i] === ')') d = Math.max(0, d - 1);
    }
    return d;
  }
  for (const v of verbs) v.parenDepth = parenDepthAt(v.pos);

  // Per token: latest containing scope wins.
  for (const token of ALL_TOKENS) {
    const tokenRe = new RegExp(`(?:^|\\b|[\`"'(])${escapeRe(token)}(?:\\b|[\`"',.;:)]|$)`, 'gi');
    let lastAction = null;
    let m;
    while ((m = tokenRe.exec(trimmed)) !== null) {
      const tokenPos = m.index;
      const tokenDepth = parenDepthAt(tokenPos);
      // Verbs are sorted by position; iterate in order so later containing scope wins.
      for (const v of verbs) {
        if (v.end <= tokenPos && tokenPos < v.scopeEnd && tokenDepth <= v.parenDepth) {
          lastAction = v.action;
        }
      }
    }
    if (lastAction === 'uncheck') addTo(result.skills_uncheck, token);
    else if (lastAction === 'check') addTo(result.skills_check, token);
  }

  return result;
}
