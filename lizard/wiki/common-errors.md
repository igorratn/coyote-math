# Common Errors in Annotations

## Error Patterns from Slack (Apr 5–7, 2026)

### LLM-Generated Annotations
- Copy-paste style with step-by-step formatting ("Step 1 — Identify...", "Step 2 — Extract...", variable definitions, conditional logic)
- Overly structured, formulaic prompts that no human would write naturally
- Flag to project leads immediately — this is task abuse
- Example: Report_Dashboard_Retail_Dashboard_2.json (flagged by Alexander D., confirmed by Achsah)

### Overly Wordy Prompts
- Annotators pad simple questions with excessive specificity
- Example: "Examine the blue line (B) and the thick horizontal black line forming the x-axis at the absolute bottom of the graph (which represents a mathematical value of 0)..." = just asking "How many times does line B intersect the x-axis?"
- Fix on first pass by trimming to the core question
- Watch out: over-trimming can make the question trivially easy for the model

### Math Precision Exploitation
- Using ln(), sin(), huge exponents (e.g., 60^5.55) to force rounding errors at 6th+ decimal place
- Not the type of model error the project is targeting
- Hard to verify without Wolfram Alpha-level tools
- Rounding must be specified BEFORE operations (e.g., how to round sin(4) before computing 2^sin(4))
- Consensus: consider thumbs down, awaiting formal ruling

### Inflated Skill Tags
- Annotators check skills that don't apply (e.g., TCG Understanding and Spatial on a simple enumeration task)
- Uncheck wrong tags and send back with feedback to make questions more complex per playbook

### Zero-Answer Counting
- Asking "how many times does X intersect Y" when it never does → answer is 0
- Counting things that don't exist = bad
- Exception: doing math with non-zero numbers that results in 0 = fine

### Duplicate/Similar Prompts
- Multiple prompts on same image with same ontology and similar "flavor"
- Common pattern: multiple vowel-counting prompts on the same image
- Thumbs up one, thumbs down the rest

### MCQ Formatting Errors
- Rewrite answers with periods ("A." instead of "A")
- Adding unnecessary format instructions ("answer with a letter")
- Both should be corrected during review

## V6 Standard (Apr 20, 2026) — Step Change

Project leads announced V6 as a quality step change. Every annotation must clear the bar below or thumbs-down on review.

### V6 prompt requirements (all must hold)
1. **Contextually driven** — no simple letter/character/vowel counting on arbitrary text. Prompt must engage with meaningful image content.
2. **Multi-skill** — ≥2 skills correctly tagged. Enumeration prompts need ≥3 skills.
3. **Anchor skill** — every prompt must include ≥1 of {Logical Reasoning, TCG Understanding, World Knowledge}. (NEW in V6.) Anchor skill must be **genuine**, not stapled on:
   - WK = topically relevant external fact, not a random constant. Multiplying by π on a non-circle image = NOT WK (peer consensus, 2026-04-19, see slack-rulings).
   - TCG = operating on chart values / proportions / structure. Pure axis-label read-off may not qualify; unlabeled bar-height comparison = Attribute, not TCG (peer consensus, 2026-04-20).
   - LR = chained inference beyond a single filter. Threshold counts and "if A>B" comparisons are Math, not LR (see review-calibration "Logical Reasoning Over-Tagging" lesson).
4. **Reasoning, not extraction** — direct-read / single-lookup / OCR-transcription prompts fail. Must require an inference step.
5. **Image-dependent + standalone** — fully answerable from image alone, no external context, no reference to other annotations.
6. **Accurate skill tags** — tags must match the actual reasoning required. Inflated tags = uncheck + send back (pre-existing rule, now strict).
7. **Format compliance** — answer formatting, MCQ format, rounding rules followed exactly. See Type 8/9.
8. **Clear images** — readable resolution, no clutter ambiguity.
9. **No giveaways, no over-precise / subjective spatial asks** — see G5, Type 3.
10. **Targets a real model error** — annotator's REWRITE_ANSWER ≠ MODEL_GENERATED_ANSWER (see review-calibration model-stump rule).
11. **Fully correct, well-formatted final answer** — verify math yourself; correct rewrite if wrong (review-calibration rule).

### Reviewer application
- V6 anchor-skill failure (no LR/TCG/WK) = thumbs-down with feedback citing missing anchor skill.
- Letter-counting / vowel-counting on text content = thumbs-down (non-contextual).
  - **Visual-qualifier exception (2026-04-25, ratified on Server_132 A2):** if the prompt restricts the count by a visual qualifier the model must first detect from the image (color, position, font, size, region), the prompt IS contextually driven and the V6 ban does NOT apply. E.g. "vowels in the *blue* portion of the logo" requires color-region detection before counting → PASS. Plain "vowels in the logo" = FAIL. The qualifier must demand actual visual reasoning, not be a meaningless decoration.
- Pure extraction prompts = thumbs-down (no reasoning step).
- Existing 5 Guidelines + 12 Error Types still primary; V6 adds the anchor-skill + non-contextual + non-extraction filters on top.

## Error Patterns Encountered
(Auto-populated after each review task)
