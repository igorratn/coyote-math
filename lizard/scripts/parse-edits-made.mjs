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

  // Pattern 2: per-token verbs. For each known token, scan ALL occurrences;
  // the LAST occurrence with a clear preceding verb determines the final
  // action for that token (so contradictory phrasing — "considered drop X,
  // but actually add X" — resolves correctly).
  //
  // Word-boundary verb patterns. Tight enough to NOT match common nouns:
  //   - "tag(s)" alone is the noun in "skill tags" — exclude.
  //   - "tagged with" / "tag X" as a verb is too colloquial; skip the bare
  //     "tag" form. Reviewers express adds as "Add X" canonically.
  const removeWords = /\b(?:drop(?:s|ped|ping)?|remove(?:s|d|ing)?|delete(?:s|d|ing)?|kill(?:s|ed)?)\b/gi;
  const addWords    = /\b(?:add(?:s|ed|ing)?|include(?:s|d|ing)?|append(?:s|ed|ing)?)\b/gi;

  for (const token of ALL_TOKENS) {
    const tokenRe = new RegExp(`(?:^|\\b|[\`"'(])${escapeRe(token)}(?:\\b|[\`"',.;:)]|$)`, 'gi');
    let lastAction = null;       // null | 'check' | 'uncheck'
    let m;
    while ((m = tokenRe.exec(trimmed)) !== null) {
      // Look at up to 80 chars BEFORE the match — find the closest verb of
      // either kind. The verb whose match position is HIGHEST (closest to
      // the token) wins for this occurrence.
      const start = Math.max(0, m.index - 80);
      const ctx = trimmed.slice(start, m.index);
      let removeIdx = -1, addIdx = -1;
      removeWords.lastIndex = 0;
      addWords.lastIndex = 0;
      let r;
      while ((r = removeWords.exec(ctx)) !== null) removeIdx = r.index;
      while ((r = addWords.exec(ctx))    !== null) addIdx    = r.index;
      if (removeIdx > addIdx && removeIdx >= 0) lastAction = 'uncheck';
      else if (addIdx > removeIdx && addIdx >= 0) lastAction = 'check';
      // (no verb in window) leaves lastAction unchanged
    }
    if (lastAction === 'uncheck') addTo(result.skills_uncheck, token);
    else if (lastAction === 'check') addTo(result.skills_check, token);
  }

  return result;
}
