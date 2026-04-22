# Workflow Lessons

## Reviewer Workflow (confirmed Apr 7, 2026)

### First Pass
- Spend ~3 min per prompt (soft guideline, not strict — quality > quantity)
- For each annotation: check guidelines compliance, verify skill tags, verify answer correctness
- Fix small stuff yourself: trim wordy prompts, correct skill tags, fix answer formatting
- Rate each prompt thumbs up or thumbs down
- If thumbs down: explain what you changed AND what remaining issues the annotator needs to fix
- If ANY prompt gets thumbs down → send entire task back to annotator
- If ALL prompts thumbs up → approve the task
- Date feedback: "4/7 (1)" format. If second interaction same day: "4/7 (2)"

### Second Pass
- Triggered when annotator returns a task you previously sent back
- You'll see your previous feedback and QC rating in the task
- How to confirm it's second pass: check status change logs at bottom of task in SuperAnnotate
- Approve or delete ONLY — no sending back again
- You have more time (~10-20 min) to try to save a prompt
- If you can't fix it in ~10 min of editing, delete it
- After NV audit agrees with your QC feedback and it comes back from annotator, treat as second pass (confirmed by Angie Z.)

### Shadow Tasks (Reviewer)
- On Handshake AI, select **"Reviewing"** (not "Annotating") when starting a shadow task
- **1 shadow task per annotation** reviewed (not per task — per annotation)
- Start the shadow task when you start working on the annotation in SA
- Submit the shadow task when you finish working on the annotation in SA
- HAI shadow task LLM feedback can be wrong — always follow playbook, not LLM opinion
- Shadow tasks are how you get paid — must submit for each annotation you review

#### Shadow Task Form Steps (Reviewer)
1. **Task ID:** Paste the .json filename exactly from SuperAnnotate (e.g., `Report_Dashboard_DevOps_Dashboard_159.json`)
2. **Annotation number (1-5):** Which annotation from the top this shadow task corresponds to
3. **Annotator Prompt:** Copy the full prompt text from SuperAnnotate (after any changes you made). Also upload the task image (right-click image in SA → save → upload via + button)
4. **[Follow remaining form fields as they appear]**

#### Important
- Copy the task ID exactly as it appears in SA — payment depends on accurate task ID
- For a task with 5 annotations, you submit 5 separate shadow tasks with the same task ID but different annotation numbers (1, 2, 3, 4, 5)
- Full prompt text must be copied from SuperAnnotate, not from review notes (review notes have summaries only)
- **HAI rewrite answer is locked after clicking Continue** — verify the answer before Continue, cannot edit afterwards
- **"Great job! Ready for another task?" dialog** = HAI confirmed shadow task submission. Appears after Continue → Submit task → Confirm time. Safe to close and proceed.
- **HAI image upload** — use `upload_file(uid=<+ button uid>, filePath=<abs path>)` MCP tool directly; native picker not needed. Order doesn't matter — can fill prompt first then upload image; field is not cleared (confirmed 2026-04-18).
- **HAI textarea fill: `fill` MCP silently fails** (4/14) — use JS native setter + events. `fill` sets DOM value but doesn't fire React onChange; value is lost on submit. Working: `const setter = Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, 'value').set; setter.call(ta, val); ta.dispatchEvent(new Event('input',{bubbles:true})); ta.dispatchEvent(new Event('change',{bubbles:true}));` Applies to both prompt and answer fields.
- **Editing HAI step 4 (prompt/image) resets step 5 (answer)** — re-fill answer after any edit to the prompt step.
- **Never leave rewrite answer as "needs verification"** — pin it from the image before the shadow task form; ambiguity at review time = flag the annotation, don't defer

### Quality Metrics
- Reviewer scores come from internal audit (NV Audit)
- First pass score target: above 0.75
- Second pass score target: at or near 1.0
- Scores visible in same place as annotator scores
- Below thresholds → fewer tasks or potential offboarding

## Host Execution Lessons (Apr 13, 2026)

- **QC feedback rule:** Leave feedback only when something changed (skills corrected, prompt edited, answer updated) OR thumbs-down. No feedback on clean thumbs-up with nothing changed.
- **SA section order per annotation:** Rewrite Answer → Work validation → Metric Log → QC (blue) → Audit (purple) → NV Audit (purple). QC comes first. Audit and NV Audit are internal review tiers — never touch them.
- **Find QC section by header, not label:** `p.title` with text `"QC"` → walk up → `querySelector('button[ng-reflect-svg-icon="approve-action"]')` for rating; `querySelector('textarea')` for feedback. Label-based approaches hit the wrong section.
- **Angular active state:** button inline `style` contains `rgb(0, 205, 108)` when approved. `ng-reflect-color` stays `"gray"` even when active — misleading, ignore it.
- **Angular checkboxes need native setter:** `.click()` reverts after Angular re-render. Use `Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'checked').set` + `change` event.

## Process Lessons

### From Practice Tasks (Apr 2-4, 2026)
- **Spatial Reasoning is consistently over-tagged.** Location descriptions ("bottom-right," "far right panel," "center of dashboard") are navigational, not spatial reasoning. Spatial Reasoning = reasoning about relative positions ("which is closest to," "what lies between"). Removed on 11 of 12 annotations across 3 tasks.
- **Verify math independently every time.** Don't trust annotator's answer. Example: Documentation was 20:00 not 28:08 — changes the entire calculation.
- **"Main" is ambiguous, "all" is not.** "Main numeric values" caused Type 1 error. "All numeric values" fixed it. Word choice matters.
- **Counting boundaries need explicit definitions.** "Colored square icons" failed Type 7. "Non-face icons" passed. The more specific the counting target, the better.
- **Don't invent rejection reasons.** If it doesn't violate a specific error type or guideline, it passes. "Three central panels" is clear enough when context shows 3 top + 2 bottom.
- **Second pass feedback format:** Keep original feedback, add new dated entry below. Shows the revision trail.
- **QualityCheck status in SA:** Selecting a status removes the task from your queue. This is expected behavior — task moves to next stage.
- **Tighten to pixels, not vibes.** When deciding whether an *answer* is correct, use the actual rendered image as source of truth. Do not inherit ambiguity from prior notes unless the pixels support it. If a peak/value is visibly above a labeled line, do not invent a stricter threshold.
- **Count all visible gridlines unless prompt says otherwise.** If a prompt says "gridlines," include minor/unlabeled gridlines, not just major labeled ones. Do not silently assume "major gridlines" unless the prompt explicitly says so.
- **Lock visual facts before judging ontology or complexity.** First pin the literal chart/image facts (which lines exist, where the mark sits, what is nearest). Only after that evaluate skill tags, complexity, or prompt quality. Do not let a weak-prompt impression distort answer verification.
- **Subjective qualifiers in prompts are always Type 1 / G2 — no exceptions.** "Clearly noticeable," "prominent," "obvious," "significant" in a prompt = Type 1 violation, even if you think every reader would agree. The test is: does the prompt supply an objective criterion? If not, thumbs-down. Fix: replace with a threshold ("peaks exceeding y=100"), a count-based criterion, or "a local maximum." This is separate from "tighten to pixels" — that rule applies to *answer* verification, not prompt quality.
- **Interval/boundary language needs explicit endpoint spec.** "Intervals 1–2, 2–3..." is ambiguous when data points sit exactly on the boundary values. Specify "including" or "strictly between." Type 7.
- **HAI LLM feedback is often wrong but worth reading.** SOP says follow playbook, not LLM opinion — but the LLM correctly identified Type 1 + Type 7 on A1 of Plot_Spectral_analysis_charts_80. Treat it as a second opinion: read it, check against playbook, override if it contradicts guidelines.

## V6 + Submission Changes (Apr 15, 2026)

### 2026-04-15 — V6 Launched + New Submission Blockers (Nikhil, #lizard-announcements)
- V6 live in SuperAnnotate. Updated Fellow Playbook coming (not published yet as of 2026-04-15).
- **Submission blockers** — task cannot be submitted without:
  - ≥2 ontologies selected
  - Model answers rated thumbs down before sending to QC
  - All CMW validations marked agree or disagree
- **Required CMW criteria** (all must be reviewed): `QUESTION_UNCLEAR`, `ANSWER_INCORRECT`, `AMBIGUOUS_ANSWER_FORMAT`, `FINE_GRAINED_PRECISION`, `MCQ_FORMAT`, `ROUNDING_NOT_EXPLICIT`
- New "Verify Submission" button — run before submitting to catch blockers early
- "Automated Check Results" section shows exactly what needs fixing

### 2026-04-15 — Shadow Task Changes (Nikhil, #lizard-reviewers)
- Updated internal system prompt — flag hallucinated/incorrect model responses
- New shadow task flow: at end of task, asked if you're a reviewer → if yes, indicate approve or reject
- **Format strictness confirmed by client**: if model answer doesn't match exact format specified by annotator (e.g. "1,000" vs "1000") → mark **incorrect**. Intent is not to make annotators hyper-focus on formatting, but rule stands.

## Second Pass Lessons (Apr 14, 2026)

- **Near-duplicate = deleted annotation, not thumbs-down.** If annotator cycle 2 resubmit is a near-duplicate of another annotation (same criterion, same answer, surface reword), treat as deleted — no SA rating, HAI shadow filed with "deleted annotation" in both fields. Task advances to QC_Complete with remaining valid annotations. Example: A1 cycle 2 "x-values less than 5" was identical in meaning to A3 "orders less than 5" → deleted.
- **All-deleted cycle 2 ≠ Skipped.** If the sole (or all) cycle 2 annotation(s) get deleted, task status is **QC_Complete**, not Skipped. Skipped is reserved for outside-domain/blocked tasks. Reviewer completed the job — deletion is a valid terminal outcome. Still file a cycle 2 HAI shadow with "deleted annotation" in both fields (new time log, distinct from cycle 1 shadow). Example: Plot_Standard_deviation_charts_35 — cycle 1 thumbs-down (shadow 7021c9f7 filed), cycle 2 model still not stumped → delete → QC_Complete + new cycle 2 shadow.
- **Re-scrape before cycle 2 review.** Status log in the fresh scrape confirms it's a second pass and shows what the annotator changed. Don't rely on session memory for what the revised annotation says.
- **Stale Downloads file trap.** If scrape script runs twice without deleting the old file first, new download lands as `sa-scrape-<task_id> (2).txt`. HOST_SOP already requires `rm -f` before scrape — enforce it.

## Job 3 Silent-Fail Lessons (Apr 15, 2026)
*(Originally logged as "Job 2" under the old 10-job naming; under the current 5-job pipeline, SA application is Job 3.)*

- **QC feedback textarea fails silently.** Job 3 write to QC Feedback can succeed-looking but leave field empty on save. Always read the textarea back after write; retry until value matches payload. Example: Churn_96 A1 — payload had feedback, web showed empty after Job 3. Readback-and-retry now mandatory (HOST_SOP step 3).
- **Skill checkboxes fail silently too.** Same failure mode as QC textarea — toggle appears to fire but state doesn't change. Readback all `skills_check`/`skills_uncheck` after write; retry on mismatch. Question type (MCQ vs Short answer question) lives in this same checkbox group, not a dropdown — skill-tag toggle IS the question-type change.
- **Question type must be set, never empty.** Exactly one of {MCQ, Short answer question} must be checked per annotation. If a skill-tag SAQ↔MCQ flip leaves both unchecked mid-toggle, the annotation is invalid. Post-toggle invariant check: exactly one of the two is checked. Fail loud on violation.
- **Task md always records question type; payload only if change required.** Per-annotation section in `tasks/<stem>.md` must include a `Question Type:` line (MCQ or Short answer question) as ground-truth human-readable record. In `## Form-Fill Payload`, question type is represented as `skills_check`/`skills_uncheck` entries — include only when changing (e.g. SAQ→MCQ = uncheck SAQ, check MCQ). If no change, payload keeps those fields empty.
- **Task-level Save required after all annotations.** Per-annotation writes in SA editor are not persisted until the task-level Save button fires. Job 3 must click Save once after completing all annotations in the task (not per annotation). Forgetting this = all Job 3 work lost on tab close.

## Review Rigor Lessons (Apr 15, 2026)

- **Pixel-verify chart reads; don't write "trusting annotator's reading".** That phrase fails literal-claim audit and produces wrong Two-Part Check reasoning even when the final answer happens to be correct. Workflow: crop chart region → upscale 3-5x → Read image → optionally scipy (binary_erosion + connected-components) for dot/segment counts. Example: Churn_96 A1 md shipped with wildly wrong percentages (29%/74%) that still rounded to answer A; pixel scan corrected to ~55.7%/~13.3% — answer unchanged, reasoning fixed.
- **Gantt-chart segment counts need explicit gridline rule.** Month gridlines visually crossing same-color bars create ambiguity: count breaks or not. G2/Type 1 violation if prompt doesn't disambiguate. Example: Capacity_174 A2 — 11 vs 13 both defensible → thumbs-down, QC_Return. Fix template: "Month-boundary gridlines do NOT split segments — only color changes define boundaries."

## Two-Stage Review Lessons (Apr 16, 2026)

- **Independent second-model review catches math-broken answers.** Mobile_App_142 A3 shipped with answer C (1507) — no valid integer decomposition exists (1507/200=7.535). Second model caught it; B (608)=3×8×25+8 is correct. First-pass model (Sonnet) accepted it without checking decomposability.
- **Second model best at: broken math, over-tagged skills.** Three real catches in one batch: one math-broken answer, two Logical Reasoning over-tags, two Spatial Reasoning + World Knowledge over-tags. Pattern: mechanical errors the first pass missed.
- **Second model weakest at: pixel reads and ambiguity judgment.** Couldn't verify answers dependent on small UI text (Mobile_142 A2 menu text, weight range). Flagged Total Followers trend as ambiguous despite clear red ↓ indicator. Don't trust second model for pixel-dependent or subjective calls.
- **Always run independent second-model review.** Not just math-heavy — every task gets a thorough independent review by a separate model. Different models make different mistakes; the value is in the non-overlapping error coverage, not just arithmetic. Igor runs the second model independently, then compares against CLI output.
- **Pipeline: CLI Sonnet first-pass → independent second model (human-run) → Opus comparison/merge.** Sonnet catches ~80% correctly and fast. Second model catches what Sonnet missed (and vice versa). Opus reconciles disagreements — accepts fixes with proof, rejects unverifiable or wrong calls.

## Calibration Lessons (Apr 16, 2026)

- **Zero in year makes product = 0 — don't flag as Type 1 without checking.** If year (e.g. 2025) contains a 0 digit, the product of all digits is 0 regardless of interpretation. Any ambiguity in "time digits" is irrelevant — the answer is deterministic. Example: Metrics_85 A1 — "product of digits of time and year" initially flagged Type 1, but 0 in 2025 killed the first term → −7.50 is the only possible answer. Flip to thumbs-up. Verify: compute product under worst-case interpretation before flagging.
- **"Projections" without signal spec = Type 1.** When a prompt counts "upward/downward projections," it must specify which signal — % indicator, sparkline direction, or indicator color. These can disagree. Example: Metrics_2 A2 — Engagement Rate showed green ▲6% (UP by %) but was misclassified as DOWN; Total Followers had no % indicator at all, only a sparkline. Three plausible answers (0, 1, 2). Fix: "Count how many metrics show a negative percentage change."
- **Pixel-hallucination is worse than admitting uncertainty.** Claiming to see values that aren't there (e.g., "red ▼5% (23,545)" for Total Followers which had NO indicator) corrupts the review. Rule: if you can't read it, say so. Upscale first. Never fabricate pixel reads to fill gaps.
- **Upscale-and-crop before reading table values.** Small dashboard text (timestamps, targets, current values) requires 5x crop to read reliably. Example: Churn Rate target read as 20 (wrong) → pixel scan showed 90. Math changed: 20/20=1 → 90/20=4.5. Always crop + upscale before claiming a table value.
- **Separator omission in multi-value SAQ ≠ auto-Type-1.** If the prompt asks for two values and the format is obvious (month-year pairs), missing an explicit separator is minor — not a blocker. Example: Metrics_5 A1 thumbs-down was too harsh; "Feb-22 and Jul-22" is the clear answer even without "separated by 'and'" instruction. Apply judgment — flag only if the format genuinely creates ambiguity in the answer.
- **Stacked area chart ≠ line chart.** "Higher y-axis values" in a stacked chart is ambiguous — top layer has highest cumulative position, but bottom layer often has the largest individual area. If prompt says "line chart" for a stacked area chart, that's Type 1 (mislabeled chart type + ambiguous criterion). Example: Marketing_59 A1.
- **Time-interval prompts need explicit boundary rules.** "09:00-12:00" — is the 12:00 bar in interval A or B? Without "includes lower bound, excludes upper" or similar, counts at boundaries are ambiguous. Can create ties that make the answer non-unique. Example: Marketing_46 A2 — A/B tie due to 12:00 boundary ambiguity. Fix: add explicit rule ("bars at the start of each interval are included in that interval").
- **Payload must be synced before Job 3.** Ratings, skill edits, feedback, and HAI answers can drift from task file decisions during review. Job 3 pre-flight check (9 points) catches this before any form-fill. Example: Metrics_2 A2 HAI answer was still "4" after we corrected to "2"; A4 feedback was null despite Logical Reasoning removal.

## Shadow Task Lessons (Apr 15, 2026)

- **Deleted annotation shadow = "deleted annotation" in both prompt + answer, reviewer action = approve.** Task is QC_Complete (reviewer finished), not rejected. Don't copy the original prompt/answer into a deleted-annotation shadow.
- **Re-editing a submitted shadow = `/reclaim` endpoint, not `/run`.** `/run` is for first-time submission. If shadow already submitted and needs correction, use `https://ai.joinhandshake.com/annotations/fellow/task/{uuid}/reclaim`. Update HOST_SOP and shadow md links accordingly.

## Bad Image Capture Lesson (Apr 17, 2026)

- **SA scrape can capture the editor view, not just the task image.** When the scraper grabs the whole SA editor (question panel, ontology panel, rating UI, etc.), the task image itself gets squeezed into the editor's left panel. Pixel inspection on that squashed image is unreliable — small features (chart peaks, dense bars, numeric labels) blur or merge. Review built on the wrong capture leads to false Type 3 / miscount calls. Example: SaaS_106 A2 initial capture was 1650×738 SA-editor screenshot (green chart on far-left looked red/pink and peak count ambiguous); re-capture at native 433×288 showed green chart with 2 clear peaks, flipping 👎 → 👍 (6th Type 7 over-call of the day).
- **Detection (Job 0, OCR-based).** After capture, OCR-scan for SA UI text markers: "Annotation Question", "Ontology", "Question Type", "Answer Rating", "Skills", "Comment". Any hit = editor view, not task image. Auto-flag `image_capture: invalid` in Task Info.
- **Enforcement (Job 2).** Job 2 refuses to start review on any task with `image_capture: invalid` in Task Info. Output: "Bad capture on <stem>, re-scrape required." Human re-captures; Job 0 re-runs OCR; flag clears. Only then does Job 2 proceed.
- **Action item carried forward:** audit the other 10 queue tasks' screenshots before Job 3 submission. Earlier pixel-verified counts (SaaS_11 "13", Risk_90 peak counts, etc.) may have been read off squeezed editor captures.

## Opus Reviewer Over-Conservatism (Apr 20, 2026)

- **Opus rejects visually readable annotations as Type 3 / Type 7 when a human can clearly see them.** Root cause: two compounding factors — (1) the reviewer prompt is massive (image + full framework + CLAUDE.md + skeleton), diluting image attention; (2) framework text primes Opus to apply Type 3/7 skepticism, so it hedges ("can't verify") rather than committing to a count. Same model reading the image cold (no reviewer context) gets it right.
- **Pattern:** Opus calls Type 3 on small icons, tiny avatars, or fine-grained UI elements that are actually readable at native resolution. openclaw is more willing to attempt the read and is correct more often on these cases.
- **Fix options to explore:** (a) trim the reviewer prompt — remove or summarize framework sections that prime over-rejection; (b) add explicit instruction: "attempt the read before defaulting to Type 3 — only call Type 3 if genuinely ambiguous after careful inspection"; (c) pass a cropped/upscaled version of relevant image regions alongside the full image for fine-grained reads.
- **Job 3 implication:** when R1 (Opus) rejects on Type 3 and R2 (openclaw) approves, lean toward openclaw unless the image genuinely can't be read at native resolution. Always open the screenshot at Job 3 and verify yourself.

## Feedback Field Rule (Apr 21, 2026)

- **Feedback is for thumbs-down annotations ONLY.** Thumbs-up annotations get `feedback: null`. Never write explanatory text in the feedback field for approved annotations.

## Feedback Language Rule (Apr 21, 2026)

- **Never use internal review codes (Type 1–12, G1–G5) in annotator-facing SA feedback.** These are reviewer-internal shorthand. Annotators know "single verifiable answer" from their playbook but not "G2". Codes belong in the MD file (Two-Part Check section, Igor notes) only — never in the `feedback:` payload field.
- **Feedback must be plain English** — describe what's wrong and what to fix, without jargon.
- Example: instead of "Type 3/G2" write "the arrow position cannot be precisely read at this image resolution, so multiple answers are plausible — there is no single verifiable answer."

## Igor-Only Delete Rule (Apr 20, 2026)

- **ONLY Igor can delete an annotation in SA. CLI never deletes.** Reviewer models (Opus, openclaw) can recommend delete in their review, but that recommendation MUST go to Igor at Job 3 before anything is written to SA. No automated delete, ever.
- **Escalation trigger #1 is absolute:** ANY thumbs-down on ANY annotation — even when R1 and R2 both agree — must be surfaced to Igor at Job 3. Unanimous reviewer agreement does NOT bypass human review.
- **Why this matters:** reviewers made wrong delete calls on Scrum_16 A3 (three-dot icons) and A5 (hexagonal icons) — both were correct annotations that Igor overrode to approve. Automated delete would have lost valid paid work.
- **Pipeline enforcement:** Job 2 merge marks agreed-thumbs-down as `rating: deleted` in payload as a recommendation only. Job 3b CLI must not push `deleted` rating to SA without Igor confirmation at Job 3a. If a task reaches Job 3b with any `rating: deleted` that has no Igor sign-off stamp in the task MD, CLI must halt and surface it.
- **`deleted` is CYCLE 2 ONLY.** Cycle 1 thumbs-down = QC_Return (send back to annotator to fix). Delete is only for cycle 2 when the annotation comes back and is still broken. Reviewers recommending "delete" on cycle 1 annotations are wrong — CLI must convert those to thumbs-down (QC_Return) automatically.
