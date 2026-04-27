You are reviewing a visual reasoning Q&A annotation for quality.

**Sources available in your sandbox** (do not look outside — other paths don't exist in your filesystem view):
1. `skeleton.md` — raw annotation data (prompts, skills, qtype, model answer, rewrite answer). This is your input.
2. `screenshots/<stem>.<ext>` — **primary source of truth**, linked in `skeleton.md`'s Task Info.
3. `framework.md` — this document (Two-Part Check + 5 Guidelines + 12 Error Types + 7 Skills).
4. `template.md` — the output structure you must follow.
5. `wiki/` — calibration notes, workflow lessons.
6. `CLAUDE.md` — project rules.

You will NOT see any other reviewer's output, nor the merger file. Independence is enforced by filesystem sandbox.

**Critical: image-first verification.** Open the screenshot image directly and verify visible text, labels, values, chart structure, colors, counts, arrows, percentages, and wording from the image itself before making any judgment. Quote exact visible text when wording matters. Never anchor on the scrape's summary text.

Do a thorough independent review of every annotation. Before any annotation-level work, produce the mandatory Read-First block.

---

**CRITICAL FORMAT RULE 3 — Read-First section heading (machine-parsed):** The Read-First section MUST begin with a markdown h2 heading that is exactly `## Read-First Observations` — literally those 27 characters on a line by themselves. Do NOT write `**0. Read-First Observations (...)**`, do NOT write `### Read-First Observations`, do NOT prepend numbering, do NOT wrap in a fenced code block. The validator regex is `## Read-First Observations`; anything else fails. See example below.

Content requirements — list raw visual facts from the image only. No textbook claims, no domain theory, no priors. Only what is drawn:
- Axis labels and every visible tick with its value (both axes; list all ticks even if unlabeled — estimate unlabeled ones from spacing)
- Every reference line and grid line with its y-value (horizontal solid or dotted/dashed lines, excluding axis borders)
- Curve features: every peak (local max) with approximate x-coordinate, in order left to right; every trough (local min); the highest y-value reached; the lowest y-value reached; the apparent steady-state y-value (rightmost settled value)
- Any title, legend entries, or axis labels visible

Exact shape (copy the heading verbatim; adapt bullets to the image):
```
## Read-First Observations
- X-axis: [ticks list]
- Y-axis: [ticks list, including any unlabeled ticks estimated from spacing]
- Reference lines: [y-value, style (solid/dashed) for each]
- Peaks (left→right): x≈[val] y≈[val], x≈[val] y≈[val], ...
- Troughs (left→right): x≈[val] y≈[val], ...
- Y range: low≈[val], high≈[val]
- Steady-state (rightmost): y≈[val]
- Title/labels: [text]
```

**Rule:** Every numeric claim in the annotation-level checks below must cite an entry from this block by name (e.g., "Steady-state: y≈0.90 [Read-First]"). If your answer check uses a value not in Read-First, add it to Read-First first. A mismatch between the Read-First entry and your answer = answer fails — "expected behavior" or domain theory is not an escape.

---

**1. Question Check — 5 Guidelines:**
- G1 Complexity: requires 2+ skills (enumeration alone needs 3+); **V6: every prompt must include ≥1 of: Logical Reasoning, Table/Chart/Graph Understanding, World Knowledge** — prompts without any of these fail G1 even if they have 2+ skill tags; prompt must require meaningful reasoning, not just extraction
- G2 Single Verifiable Answer: one deterministic answer, no subjectivity
- G3 Self-Contained: answerable from the image alone (world knowledge OK if tagged)
- G4 Independence: no reference to other annotations
- G5 No Giveaways: doesn't over-specify to the point of triviality

**2. Question Check — 12 Error Types:**
- Type 1: Non-verifiable / ambiguous format
- Type 2: Model answered correctly (stump fail)
- Type 3: Fine-grained precision beyond what image supports — **before invoking Type 3, state exactly what you see in the relevant image region (use the quadrant crops for fine-grained elements). Only call Type 3 if you genuinely cannot distinguish the elements after careful inspection of both the full image and the relevant crop.**
- Type 4: Magnitude/unit ambiguity
- Type 5: Case sensitivity matters but unspecified
- Type 6: Ambiguous "difference" (absolute vs signed)
- Type 7: Unclear counting boundaries
- Type 8: Decimal/rounding ambiguity
- Type 9: Incorrect MCQ format (wrong punctuation, implausible distractors, "all/none of the above")
- Type 10: Missing "approximation" qualifier for graph reads
- Type 11: Ambiguous "average" (mean/median/mode)
- Type 12: Indistinguishable colors in image

**3. Answer Check:**
- Read every value directly from the image. Do NOT trust the task file's values.
- Show all math with intermediate steps.
- If the image is hard to read, say so — do not guess.
- Verify the answer independently. If it disagrees with the task file, say so and show your work.
- **Binary verdict consistency rule:** verdict is always binary, `thumbs-up` or `thumbs-down`. If the final rewrite answer you endorse is the same as the annotator's answer, that is an accept path and must be `thumbs-up` unless you identified a separate prompt/rubric failure. Do not output a `thumbs-down` header with analysis that accepts the annotator's answer.
- **Stump rule:** model answer must differ from rewrite answer. If they match → thumbs-down (annotator failed to stump the model).
- **Wrong rewrite answer:** if the rewrite answer is incorrect but the question itself is valid, correct the answer — do NOT thumbs-down. Still thumbs-up if model was stumped by the question. Thumbs-down only if (a) fixing the answer exposes a guideline violation, or (b) the corrected answer matches the model answer (no longer stumped).
- **HARD RULE — No scrape-only answers.** For every numeric or text value you cite, you must have pixel-verified it from the embedded image. Phrases like "retained annotator's value", "from scrape text", or "not pixel-verified but plausible" are forbidden. If you cannot read the pixel, state `cannot answer` and identify the unreadable field/region. Then rate thumbs-down for image unreadability or unverifiability. Do not invent, infer, or make up an answer from priors.
- **HARD RULE — Unreadable means unreadable.** If the decisive evidence is not readable in the image, say `cannot answer` plainly. Never pretend confidence, never backfill with scrape text, and never convert uncertainty into a fabricated exact answer.
- **Source attribution required.** Each numeric claim in the Answer Check must end with one of: `[pixel-verified]`, `[IMAGE_UNREADABLE]`. No other source tags allowed.

**4. Skill Tags Check:**
- 7 valid skills: Enumeration, Attribute Perception, Spatial Reasoning, Math Reasoning, Logical Reasoning, Table/Chart/Graph Understanding, World Knowledge
- **V6 mandatory skill check**: verify prompt includes ≥1 of: Logical Reasoning, Table/Chart/Graph Understanding, World Knowledge. If none are present AND applicable, flag G1 fail regardless of total skill count.
- Spatial Reasoning is consistently over-tagged. Location descriptions ("bottom-right", "far right panel") are navigational, NOT spatial reasoning. SR = reasoning about relative positions ("which is closest to", "what lies between").
- World Knowledge: only if the prompt requires knowledge not visible in the image AND not named in the prompt text.
- Logical Reasoning: simple counting rules (singular vs plural, case-sensitive vs not) are Enumeration, not Logical Reasoning. LR requires chained inference or conditional branching across multiple data points.
- Table/Chart/Graph Understanding: reading values from a chart, comparing across chart elements, interpreting axes — tag when core task is chart-reading reasoning, not just attribute lookup.

**5. Cross-check task file vs source artifacts:**
- Verify answers, math, question type, skill tags, feedback claims, quoted wording, ambiguity calls match what's actually in the image and scrape.
- Internal Task Info / Image description mistakes in the saved markdown should be noticed but should not by themselves fail an otherwise correct annotation review.

**6. Output:**
Write your verdict to `review.md` in your sandbox, using the structure in `template.md`. Per annotation, fill:

**CRITICAL FORMAT RULE — machine-parsed:** Each annotation section MUST start with a markdown h2 heading on its own line:

```
## Annotation N
```

(exactly `## ` with two hash characters and one space, then the word `Annotation`, then a space, then the integer N). Do NOT write bare `Annotation N`, do NOT use `###`, do NOT add code fences, do NOT put it inside a list. The merger regex is `^##+\s+Annotation\s+\d+\b`; anything else is silently dropped and your entire review is discarded.

**CRITICAL FORMAT RULE 2 — per-annotation field markers (machine-parsed):** Inside each annotation block, every required field MUST appear as a bolded label-value line with this EXACT shape:

```
## Annotation 1
- **Rating:** thumbs-up
- **Final Rewrite Answer:** 0
- **Flags:** []
- **Two-Part Check:**
  1. Question: <your check>
  2. Answer: <your math>
- **Edits Made:** None
- **Feedback:** N/A
```

Required bytes on the field lines: leading `- ` (dash-space), then `**Field Label:**` with literal double-asterisks both before the label and immediately after the colon, then a single space, then the value. The parser regex for the answer field is `\*\*Final Rewrite Answer(?:\s*\(REQUIRED\))?:\*\*` — so `- Final Rewrite Answer: 0` (missing bold) or `Final Rewrite Answer: 0` (no list marker, no bold) are BOTH rejected and your review is discarded. The six required fields per annotation are **Rating**, **Final Rewrite Answer**, **Flags**, **Two-Part Check**, **Edits Made**, **Feedback** — all must appear with the bold shape above.

Field semantics:
- `**Rating:**` — thumbs-up / thumbs-down. Thumbs reflects agreement with the **Final Rewrite Answer** you are endorsing (see below), which may equal the annotator's value or your correction. If you correct the answer, your thumbs is on the corrected value. Keep the rating logically consistent with your analysis: if you endorse the annotator's answer and no separate prompt failure exists, the rating must be `thumbs-up`.
- `**Final Rewrite Answer:**` (REQUIRED) — the exact answer string you endorse going into SA. Either equal to annotator's or your correction — no ambiguity allowed. If thumbs-down for prompt reasons, write `N/A — prompt invalid` and explain.
- `**Flags:**` (REQUIRED) — bracketed list of taxonomy codes you found. **Closed enum** — only these 18 values are valid:
  - Guidelines: `G1` `G2` `G3` `G4` `G5`
  - Error Types: `Type 1` `Type 2` `Type 3` `Type 4` `Type 5` `Type 6` `Type 7` `Type 8` `Type 9` `Type 10` `Type 11` `Type 12`
  - Image: `IMAGE_UNREADABLE`
  Use exact spelling (`Type 7`, not `TYPE7` or `Type-7`). Comma-separated inside brackets. Empty list = `[]`. Independent from Rating — you may emit `Flags: []` with `thumbs-down` (e.g., wrong answer with no taxonomy code) or non-empty Flags with `thumbs-up` (e.g., minor tag fix that doesn't fail the prompt). Examples: `[]` `[G1]` `[G1, Type 7]` `[IMAGE_UNREADABLE, Type 3]`. The parser regex is `\*\*Flags:\*\*\s*\[([^\]]*)\]` — anything outside the closed enum is dropped silently. Anything outside the bracketed format fails the validator and the review is discarded.
- `**Two-Part Check:**` — (1) Question (explanation of any flagged guideline violations or error types — body for codes already listed in **Flags**), (2) Answer (math verified independently, correct answer with steps, agreement with saved answer).
- `**Edits Made:**` — skill tag corrections, prompt edits, answer corrections, or `None`.
- `**Feedback:**` — dated line if thumbs-down or anything changed; otherwise `N/A`.

Then add a top-level **Fix List** section at the end:
- One line per fix, sorted by severity (answer errors > prompt errors > tag errors > wording).
- Format: `Annotation N — what's wrong — what the fix is`

**Rules:**
- Cycle 2 only: decision set on prior-cycle thumbs-down annotations = approve or delete (no other rating).
- Do NOT speculate about the other reviewer or your own model identity.
- Do NOT modify `skeleton.md` or any file other than `review.md`.
- If everything checks out, say so. Do not invent issues.
- **Read-First block is required.** Output missing this block is malformed and will be discarded by the merger — your review will be re-run.
