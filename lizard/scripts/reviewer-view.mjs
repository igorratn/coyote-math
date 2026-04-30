// reviewer-view.mjs
// Build a per-reviewer skeleton view from the canonical tasks/skeleton/<stem>.md.
//
// Two transformations:
//   1. SUBSET — include only the annotation numbers in opts.annots. Used by
//      sequential filtering: after reviewer A auto-resolves some annots, B
//      receives a view containing only the still-pending ones.
//   2. BLIND — strip the **Annotator Answer:** field and the #### Rewrite
//      Answer block from each kept annot. Reviewer evaluates without anchoring
//      on the annotator's number (compute fresh, merger compares downstream).
//
// Cycle-2 handling:
//   - Cycle-1 annot blocks (`## Annotation N`) included if N in opts.annots.
//   - Cycle-2 [CHANGED] blocks (`### Cycle 2 — Annotation N [CHANGED ...]`)
//     included if N in opts.annots. Annotator-answer fields stripped same as
//     cycle-1 blocks.
//   - Cycle-2 [UNCHANGED] blocks ALWAYS dropped — carry-forwards never need
//     review.
//   - The `## Cycle 2 Review` section header is preserved if any cycle-2
//     [CHANGED] block survives the filter.
//
// Header (task_id, SA_TASK_FILENAME, Image, Date, Review Cycle) preserved
// verbatim — reviewer needs context.
//
// Pure function — no fs, no env.
//
// Companion: `defaultReviewAnnots(skeletonText)` returns the canonical
// annot-number list a reviewer should review when ANNOTS env isn't set.
//   - cycle 1 (no `## Cycle 2 Review` section) → all `## Annotation N` numbers
//   - cycle 2 (has `## Cycle 2 Review` section) → only [CHANGED] cycle-2 annot numbers
//                                                 (carry-forward [UNCHANGED] are not re-reviewed)

const ANNOT_HEADER_RE = /^## Annotation (\d+)\s*$/;
const CYCLE2_HEADER_RE = /^### Cycle 2 — Annotation (\d+)\s*\[(CHANGED[^\]]*|UNCHANGED)\]/;
const CYCLE2_SECTION_RE = /^## Cycle 2 Review\s*$/;

function isAnnotHeader(line) { return ANNOT_HEADER_RE.test(line); }
function isCycle2Header(line) { return CYCLE2_HEADER_RE.test(line); }
function isCycle2Section(line) { return CYCLE2_SECTION_RE.test(line); }
function isAnyTopHeader(line) {
  return isAnnotHeader(line) || isCycle2Header(line) || isCycle2Section(line);
}

// Strip annotator-anchored fields from a single annot block (already isolated).
// Drops:
//   - any line matching `- **Annotator Answer:** ...`
//   - any block starting with `#### Rewrite Answer` (header + body until next #### or ---)
function stripAnnotatorAnswer(blockLines) {
  const out = [];
  let inRewriteAnswer = false;
  for (const line of blockLines) {
    if (inRewriteAnswer) {
      // End rewrite-answer block on next #### or --- or blank-line-then-end-of-block
      if (/^####\s+/.test(line) || /^---\s*$/.test(line)) {
        inRewriteAnswer = false;
        out.push(line);
        continue;
      }
      // Otherwise drop the line
      continue;
    }
    if (/^####\s+Rewrite Answer\b/.test(line)) {
      inRewriteAnswer = true;
      continue;  // drop the header line too
    }
    if (/^-?\s*\*\*Annotator Answer:\*\*/.test(line)) {
      continue;  // drop annotator answer line
    }
    out.push(line);
  }
  return out;
}

export function defaultReviewAnnots(skeletonText) {
  const hasCycle2 = /^##\s+Cycle\s*2\s+Review\b/m.test(skeletonText);
  if (hasCycle2) {
    // Cycle 2: only [CHANGED] cycle-2 annot numbers
    const re = /^### Cycle 2 — Annotation (\d+)\s*\[CHANGED/gm;
    const out = [];
    let m;
    while ((m = re.exec(skeletonText)) !== null) out.push(parseInt(m[1], 10));
    return [...new Set(out)];
  }
  // Cycle 1: all `## Annotation N`
  const re = /^## Annotation (\d+)\s*$/gm;
  const out = [];
  let m;
  while ((m = re.exec(skeletonText)) !== null) out.push(parseInt(m[1], 10));
  return [...new Set(out)];
}

export function buildReviewerView(skeletonText, { annots = [] } = {}) {
  const wanted = new Set(annots.map(n => parseInt(n, 10)).filter(n => !isNaN(n)));
  const lines = skeletonText.split('\n');

  // Pass 1: identify section boundaries.
  // We split into:
  //   - pre-annots (header) — everything before first `## Annotation N`
  //   - cycle-1 blocks — `## Annotation N` ... up to next top header
  //   - cycle-2 section header — `## Cycle 2 Review`
  //   - cycle-2 blocks — `### Cycle 2 — Annotation N [...]` ... up to next top header
  //
  // We identify block START positions, then slice.

  const blocks = [];  // {kind: 'header'|'cycle1'|'cycle2section'|'cycle2', n, start, end}
  let firstAnnotIdx = lines.length;
  for (let i = 0; i < lines.length; i++) {
    if (isAnyTopHeader(lines[i])) { firstAnnotIdx = i; break; }
  }
  blocks.push({ kind: 'header', start: 0, end: firstAnnotIdx });

  let i = firstAnnotIdx;
  while (i < lines.length) {
    const line = lines[i];
    if (isAnnotHeader(line)) {
      const n = parseInt(line.match(ANNOT_HEADER_RE)[1], 10);
      const start = i;
      i++;
      while (i < lines.length && !isAnyTopHeader(lines[i])) i++;
      blocks.push({ kind: 'cycle1', n, start, end: i });
    } else if (isCycle2Section(line)) {
      blocks.push({ kind: 'cycle2section', start: i, end: i + 1 });
      i++;
    } else if (isCycle2Header(line)) {
      const m = line.match(CYCLE2_HEADER_RE);
      const n = parseInt(m[1], 10);
      const tag = m[2];  // CHANGED... or UNCHANGED
      const start = i;
      i++;
      while (i < lines.length && !isAnyTopHeader(lines[i])) i++;
      blocks.push({ kind: 'cycle2', n, tag, start, end: i });
    } else {
      // Should not hit — but advance defensively
      i++;
    }
  }

  // Pass 2: assemble filtered output.
  const out = [];
  // Always include header verbatim
  const headerBlock = blocks.find(b => b.kind === 'header');
  out.push(...lines.slice(headerBlock.start, headerBlock.end));

  // Cycle-1 annot blocks (filtered + blinded)
  for (const b of blocks.filter(b => b.kind === 'cycle1')) {
    if (!wanted.has(b.n)) continue;
    const blockLines = lines.slice(b.start, b.end);
    out.push(...stripAnnotatorAnswer(blockLines));
  }

  // Cycle-2 section: only emit the `## Cycle 2 Review` header + any
  // [CHANGED] block whose N is in wanted. [UNCHANGED] always dropped.
  const cycle2Wanted = blocks.filter(
    b => b.kind === 'cycle2' && /^CHANGED/.test(b.tag) && wanted.has(b.n)
  );
  if (cycle2Wanted.length > 0) {
    const sectionHeader = blocks.find(b => b.kind === 'cycle2section');
    if (sectionHeader) out.push(...lines.slice(sectionHeader.start, sectionHeader.end));
    out.push('');  // blank line after section header for readability
    for (const b of cycle2Wanted) {
      const blockLines = lines.slice(b.start, b.end);
      out.push(...stripAnnotatorAnswer(blockLines));
    }
  }

  return out.join('\n');
}
