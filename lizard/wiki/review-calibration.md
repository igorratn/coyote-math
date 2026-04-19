# Review Calibration

## Decision Log
(Track review decisions and audit feedback to calibrate future reviews)

## Calibration Rules
- Strict on the 12 error types and 5 guidelines — don't invent new rejection reasons
- If it doesn't violate a specific rule, it's probably fine
- Reviewer over-strictness is a real problem (per Slack)
- Audit disagrees with your QC decision → impacts YOUR scores
- **Model-stump rule**: annotator's task objective is to write a prompt that makes the model answer incorrectly. MODEL_GENERATED_ANSWER must differ from REWRITE_ANSWER. If they match → prompt failed to stump → thumbs-down (annotator didn't meet task objective). Differing answers alone is not sufficient for thumbs-up — still verify rewrite is correct.
- **Wrong rewrite answer → fix, don't thumbs-down.** If annotator's rewrite answer is incorrect but the question itself is valid, reviewer corrects `answer_final` (payload) and `Rewrite Answer:` (md). Still thumbs-up if model was stumped by the question. Add dated feedback noting the answer correction (triggers "changed" feedback rule). Thumbs-down only if (a) fixing the answer exposes a guideline violation, or (b) model answer matches the *corrected* answer (no longer stumped).

## Score Targets (from Slack, Apr 3–7 2026)
- First pass (FP) score: above 0.75 is fine (per Joshua C., confirmed by leads)
- Second pass (SP) score: should never be below 1.0
- Being much lower than 0.75 FP could mean offboarding
- Scores visible in same place as annotator scores in SuperAnnotate
- Quality > quantity is the project philosophy (per Nikhil D., Apr 7)

## Lesson: Ambiguity Caught Too Late (Apr 12, 2026)
- Task 36 annot 2: "tool tabs" was ambiguous (9 top-level vs 15 total items) — HAI QC flagged it, too late to fix in SA
- **At review time**: if the rewrite answer cannot be pinned to a single unambiguous value, the prompt fails the single-verifiable guideline — thumbs down and flag the specific ambiguity
- UI terms like "tool tabs", "panel", "section" can be imprecise — check that the count is unambiguous given the actual image
- "Needs verification" on a rewrite answer = unresolved ambiguity = should be a thumbs-down, not a pass
- **Ambiguity threshold**: single-verifiable fails if any reasonable alternative reading has ~15%+ probability — doesn't need to be 50/50. "Tool tabs listed in this menu" had ~70% chance of 15-item reading, ~30% chance of 9-item reading — clear fail even though one reading dominates
- **Tighten to pixels, not vibes**: applies to *answer* verification — ambiguity claims must be supported by the rendered image. If pixels support one reading and the alternate is speculative, do not thumbs-down.
- **Visible chart furniture counts unless excluded**: when a prompt says "gridline," "tick," or similar chart element, count all visible instances that match, including minor/unlabeled ones, unless the prompt explicitly limits to major/labeled elements.
- **Sequence rule**: settle literal visual facts first, then correctness, then guidelines/ontology. Never let an early "this prompt is weak" impression drive the visual read.
- **Subjective qualifiers in prompts = automatic Type 1 (Apr 13, 2026)**: "clearly noticeable," "prominent," "obvious" in the prompt body always fail G2 regardless of whether most readers would agree. Objective criterion required. "Tighten to pixels" does NOT override this — that rule governs answer verification, not prompt wording. A1 of Plot_Spectral_analysis_charts_80 was initially thumbs-up then corrected to thumbs-down after HAI LLM correctly flagged it.
- **Qualifier + labeled reference = OK (Apr 13, 2026)**: "clearly rise above the y-axis tick labeled 100" passes — the qualifier is anchored to a specific, labeled, pixel-verifiable threshold. Contrast with "clearly noticeable peak" (no anchor) → Type 1. Rule: qualifier alone = fail; qualifier + objective reference point = OK.
- **HAI LLM feedback as second opinion**: treat LLM feedback as a checklist sanity check. It confirmed Type 1 + Type 7 on A1 despite SOP saying "ignore LLM opinion." When LLM flags a *specific* error type and cites a specific phrase, verify against playbook before dismissing.

## Stage 3 Merge Override Discipline (Apr 17, 2026) — CRITICAL
*(Under the 3-stage naming: Stage 1 = Opus review, Stage 2 = external model, Stage 3 = Opus merge. Discipline applies to Stage 3 reconciling Stage 1 vs Stage 2.)*

Incident: SaaS_11 A1. Stage 1 (Opus review) got 13 right. Stage 2 (external model) said 8 (wrong, undercount). Stage 3 (merge) re-cropped sidebar with truncated box (x=0–260, cut off right edge where 3 chevrons lived), counted 4 chevrons + 6 zeros = 10, and silently overrode Stage 1's 13 in the task file. Igor caught it.

**Rules — every Stage 3 merge must follow:**

1. **Crop-boundary proof first.** Before any pixel count, save the crop PNG and visually confirm it covers the entire target region on all 4 edges. If the crop could truncate the feature, the count is invalid. Document the crop box coordinates in the Stage 3 merge note.
2. **Three-way disagreement = STOP, ask Igor.** If Stage 1, Stage 2, and my Stage 3 pixel count all give different numbers, do NOT pick the middle. Present all three with crops. Never auto-resolve.
3. **Never silently override Stage 1.** Any Stage 3 change to a rewrite answer must be flagged in the walk-through BEFORE editing the task file. Human confirms the edit, not reads it after.
4. **Stage 2 is a signal, not a verdict.** Stage 2 dispute triggers *re-examination*, not *revision*. Default is Stage 1 stands unless pixel evidence is rock-solid (crop verified, count reproducible, no truncation risk).
5. **Compromise-value red flag.** If a new Stage 3 count lands *between* Stage 1 and Stage 2 values, that's almost always a partial crop or split-the-difference bias — reverify crop bounds first.
6. **Show enumeration, not just totals.** When disputing a count, list the items counted (chevron 1 = Features, chevron 2 = Users, ...). Makes truncation errors visible immediately.
7. **Solid reason required — high bar for any change.** Stage 3 changes a Stage 1 answer ONLY when the evidence is demonstrable and reproducible: (a) labeled crop image Igor can open, (b) item-by-item enumeration, (c) math that forces the change (e.g., no integer decomposition), or (d) explicit Stage 2 evidence Stage 1 visibly missed. "My count disagrees" is NOT a solid reason. "Stage 2 says so" is NOT a solid reason. Default to Stage 1; the burden of proof is on the proposed change.
8. **FILTER SA_Applied FIRST — before any Stage 3 merge walk-through.** Grep `SA Applied: ✅` across all candidate task files and drop any that match. SA_Applied = locked = no action possible. Walking through locked annotations wastes human time on decisions that cannot be executed. The list of "outstanding Stage 3 merge changes needing review" must only contain tasks where `SA Applied: ⬜` or not set. Apply this filter BEFORE presenting the list, not after.

## Lesson: Systematic Type 7 Over-Call (Apr 17, 2026)
During walk-through of all queued thumbs-down annotations, **5 of 5 Type 7 calls flipped to thumbs-up** after human re-read:

- **SaaS_11 A5**: Stages 1/2/3 all called Type 7 ambiguity on "data markers"; Igor's enumeration (2 solid + 4 legend = 4) resolved cleanly. Piecewise count was well-defined.
- **Metrics_2 Cycle 2 A2**: Called DELETE on Type 7 integer-count scope; Igor spotted "Google Analytics 4" adds 3 more integer 4s (26 + 3 = 29 × 2 = 58). Scope was clear once text was read fully.
- **Risk_90 A3**: Called Type 7 on "2 drop down sections at top row" + Type 1 on "it" referent; Igor read it literally as two dropdown sections (Current Ratio + Small Business Loans) and "it" is grammatically clear. Math: (1 × 19) / 30 = 0.633 ✓
- **Risk_90 A4**: Called Type 7 on "blue elements in the graphs"; Igor: "bar chart is a graph" — "the graphs" unambiguously means all graphs on dashboard. 9 bars + 38 dots = 47; 9/47 = 0.19 ✓
- **SEO_111 A2**: Called Type 7 on "peaks" (undefined threshold); Igor: piecewise-connected line has well-defined peaks (every rising→falling reversal). Pixel-verified 8 peaks → 8/5 = 1.60 ✓

**Pattern — Type 7 over-call sources:**
1. **Treating natural language as if it were a spec.** "The graphs," "the 2 dropdown sections," "peaks" — these are clear to a human reader of the image even without a formal definition. LLM review invents hypothetical alternate readings that no actual reader would consider.
2. **Ignoring the rendered image as disambiguator.** Most "which X?" questions are resolved trivially by looking at the image. If there's only one sensible referent visible, the prompt is not ambiguous.
3. **Continuous-line peak bias.** A piecewise-linear line graph (lollipops, connected-dot time series) has exactly the peaks the geometry shows. "Undefined threshold" only applies to smoothed/noisy signals.
4. **Parenthetical clarifications read as ambiguity.** "(dots + bars)" was read as introducing ambiguity when it actually resolved scope.

**Apply:**
- Before calling Type 7, state the specific alternate reading and assess: would an image-aware human actually read it that way? If no concrete alternate reading survives contact with the image, Type 7 does not hold.
- For piecewise lines: peaks = local maxima = well-defined. Do not claim "undefined threshold" unless the signal is a smoothed curve with visible noise.
- Parentheticals inside a prompt usually *resolve* scope, not introduce it. Read them as disambiguators first.
- "The X" with a single visible referent in the image is unambiguous. Alternate readings need visible support, not imagination.
- Ambiguity threshold (from Apr 12 lesson) still applies: alternate reading must have ~15%+ real-world probability, not just theoretical possibility.
