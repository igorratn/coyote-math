# Slack Rulings & Office Hours Decisions

> **Primary channel for Lizard rulings:** `#lizard-reviewers` — Slack channel ID `C0ANPTSDQ81` in the `handshakeaicommunity` workspace. Search this channel first for any policy / workflow / edge-case question. Thread URLs follow the pattern `https://handshakeaicommunity.slack.com/archives/C0ANPTSDQ81/p<timestamp>`.

## May 1, 2026 Rulings

### TCG Understanding — litmus test (Nikhil D. [HAI], Apr 30 thread)
**Pretend the image isn't a graph. Can you still answer the question?** If yes → not TCG. If no → TCG. Borderline cases (e.g. "count candlesticks between leftmost and highest wick" on a candlestick chart) lean TCG but are on the line. ([thread](https://handshakeaicommunity.slack.com/archives/C0ANPTSDQ81/p1777611522008989))

### Misspelled-word prompts are fair (Nikhil D. [HAI], May 1)
A prompt asking the model to find a misspelled word in a table or labeled element is fair game. Example accepted: "What is the sum of the percentages for last year's and this year's values of the only ratio type in the Income Statement Breakdown ratios table that is misspelled?" ([thread](https://handshakeaicommunity.slack.com/archives/C0ANPTSDQ81/p1777657526204049))

### Annotator-skipped image with 1 failed-model annotation (Nikhil D. [HAI], May 1)
If the annotator skipped the image but left 1 annotation that failed the model: **if the image is suitable, delete the annotation and move the task to Skipped.** Reviewer judgment on image suitability comes first; the lone failed annot doesn't keep the task alive. ([thread](https://handshakeaicommunity.slack.com/archives/C0ANPTSDQ81/p1777667034341339))

**Implication for our pipeline:** this is a partial-skip path — task ends up in a Skipped disposition (no shadows per Apr 28 ruling), but only after the partial annotation is explicitly deleted in SA. Igor handles deletion manually (CLI never clicks SA Delete).

### Multi-annot image with all-bad prompts → Unusable (Angie Z., Apr 30)
Confirms existing pattern: skim the prompts; if none are good, send to Unusable. No per-annot thumbs-down required, no shadows. ([thread](https://handshakeaicommunity.slack.com/archives/C0ANPTSDQ81/p1777579051525659))

### NV-touched annotations stay un-deletable on cycle 2 (Angie Z., Apr 30)
Re-confirms existing rule (line 65 below): "we can't delete prompts once they have NV Audit feedback. You would need to try your best to come up with new prompts to replace the bad ones." Even if the cycle-2 revision is *worse* than the original and unsalvageable, deletion is not allowed — replace the prompt instead. ([thread](https://handshakeaicommunity.slack.com/archives/C0ANPTSDQ81/p1777591157630099))

---

## Unusable / Skipped tasks → no shadow tasks (Apr 28, 2026)

Confirmed by Angie Z. ([thread](https://handshakeaicommunity.slack.com/archives/C0ANPTSDQ81/p1777422361003609)): for Unusable (and by extension Skipped — same "image is the problem, not the prompts" disposition):
- **Do not record any shadow tasks** for the annotations.
- Skip individual thumbs-down on annots — task-level dropdown alone is sufficient.
- Optional: skim prompts + leave feedback per `references/playbook_reviewer.md` ("please ensure to review annotations attempted on this image prior to marking Unusable") — but no shadow firing.

**Implication for our pipeline:** when a task's `Task-level Disposition` is `Skipped` / `Unusable`, Job 5 (shadow sweep) MUST skip that stem entirely. No HAI shadows fire.

## V6 Launch — lizard-announcements (Apr 17–21, 2026)

### V6 Quality Rules (mandatory, all tasks)
- **≥2 skill tags required**, correctly matched to the actual reasoning in the prompt.
- **Enumeration tasks: ≥3 skills required** (Enumeration alone is not enough complexity).
- **Mandatory skill**: every prompt must include ≥1 of: Logical Reasoning, TCG Understanding (Table/Chart/Graph Understanding), World Knowledge. Prompts without any of these fail V6 even if they have 2+ skill tags.
- **Meaningful reasoning required**: prompt must require multi-step inference, not just reading off a value (extraction is not a model error target).
- **Fully image-dependent and standalone**: prompt must not require external knowledge beyond what's visible (or world knowledge if tagged).
- **Avoid giveaways and overly precise/subjective spatial asks** (unchanged from V5, re-emphasized).
- **Target a real model error**: annotator's goal is a prompt the model gets wrong. If model gets it right consistently, it's too easy.
- **Correct, well-formatted final answer required**.
- **V6 applies to ALL tasks**, including V5 tasks still in queue.

### SA Submission Blockers (V6 SA UI)
- **≥2 ontologies selected** — blocked if missing.
- **All model answers rated thumbs down** — blocked if any unrated.
- **All 6 CMW criteria marked agree/disagree**: `QUESTION_UNCLEAR`, `ANSWER_INCORRECT`, `AMBIGUOUS_ANSWER_FORMAT`, `FINE_GRAINED_PRECISION`, `MCQ_FORMAT`, `ROUNDING_NOT_EXPLICIT`.
- Use **"Verify Submission"** button to surface blockers before submitting.

### Office Hours Change (Apr 21, 2026)
- Office hours moved from 6PM PST → **3PM PST, Mon–Thurs**.
- This week (Apr 21–24): walkthrough of new V6 playbook, not normal format.

### Open Questions (no firm ruling yet as of Apr 21, 2026)
- Approximations in short answer (previously MCQ-only) — asked in #lizard-reviewers, no lead response yet.
- Applying V6 to old backlogged tasks: community frustrated but no explicit exception granted.

---

## From lizard-tasking Channel

### Annotation Rules
- **"Exclusive"/"Inclusive" only needed for ranges.** If prompt already says "below" or "above", no need to add "(Exclusive)". Over-specifying can trivialize the question (Guideline 5: no giveaways).
- **Model fails once = valid failure.** If model gets wrong answer even once across regenerations, the annotation is valid. Don't reject because model sometimes gets it right.
- **Don't over-specify to the point of giving away the answer.** Adding too much direction (e.g., "look at the x-axis of chart 3") can point the model straight to the answer. Balance clarity with challenge.
- **Colors in prompts are OK.** Referring to colors in the prompt (e.g., "the blue line") is allowed and not a giveaway, as long as the color is unambiguous in the image (Type 12).
- **Aim for multiple annotations on rich images.** Information-rich images (complex charts, dense tables) should have more than 1 annotation.

### Feedback Rules
- **Be specific in feedback — never use generic "too blurry."** State exactly which values can't be read and why the prompt is invalid. Lazy feedback = bad reviewing.
- **Don't reject for exact rounding disputes.** If prompt says "rounded to 5 decimal places" and the math is deterministic (no visual ambiguity), don't flag 0.01886 vs 0.01887. Lead ruling: not a valid rejection.

### Audit Dispute Routing
- **NV Audit disagreement → fill out the rebuttal form.** Do not bring to office hours or the channel. Form: https://docs.google.com/forms/d/e/1FAIpQLSfwv4KFZp2eEaPQ_sfg8BAyjFhvAG2o5jwi6N3CpWJuxHAJEA/viewform
- **After filing rebuttal: leave task in SA untouched.** Do NOT return to annotator. Wait for Achsah to reach out (1–2 weeks — client has to respond).
- **Internal audit disagreement → office hours or lizard-reviewers channel.** Do not use rebuttal form.

### NV Audit — Concede Path (NV is correct)
- **Concede = copy NV feedback to QC box → send back to annotator (Returned_to_Annotator). Do NOT edit prompt or Rewrite Answer yourself.** Confirmed by Angie Z. (Mar 24: Claire B. thread; Mar 25: Jason S. "comma" thread). [Claire](https://handshakeaicommunity.slack.com/archives/C0ANPTSDQ81/p1774373224673579) · [Jason](https://handshakeaicommunity.slack.com/archives/C0ANPTSDQ81/p1774495812150749)
- **Even if the reviewer already rewrote the prompt on first pass, NV return still goes back to the annotator — don't re-edit yourself.** Noah N. (Apr 18) relaying Daniel's reviewer-sync ruling: "it should still be returned to the annotator in this case. I would give the annotator detailed feedback on exactly what to change." [thread](https://handshakeaicommunity.slack.com/archives/C0ANPTSDQ81/p1776568920281199)
- **Cycle 2 (after annotator's NV revision returns) = treat as second pass.** Reviewer now may edit anything to make annotations pass (≤20 min/annotation budget). Non-NV-touched annotations can be deleted if unsalvageable. Angie Z. (Mar 24, Mar 29). [Mia](https://handshakeaicommunity.slack.com/archives/C0ANPTSDQ81/p1774381082039009) · [William](https://handshakeaicommunity.slack.com/archives/C0ANPTSDQ81/p1774807803283799)
- **NV-touched annotations cannot be deleted — ever.** If annotator's revision is worse, revert to the original annotation and edit from there. Achsah W. (Apr 17, Jason S. thread). [thread](https://handshakeaicommunity.slack.com/archives/C0ANPTSDQ81/p1776443834669079)

### Reviewer Process
- **Reviewer metrics based on audit.** If audit disagrees with your QC decision, it impacts YOUR scores. Be careful and correct.
- **Shadow tasks for reviewing:** Same process as annotating on Handshake AI — select "reviewing" instead of "annotating." Task ID = .json filename from SuperAnnotate. 1 shadow task per annotation reviewed.
- **Local peaks on continuous lines = ambiguous.** Asking "which month has the local peak" on a smooth line chart is Type 3 (fine-grained precision). Use MCQ or add "approximate" qualifier.
- **HAI shadow task LLM feedback != ground truth.** The automated LLM feedback on Handshake shadow tasks can be wrong. Always follow the playbook rules, not the LLM's opinion.
- **Annotators CAN fully rewrite on revision.** When returned for revision, annotators aren't limited to small fixes — they can completely rewrite the prompt. Judge the new version on its own merits.
- **Reviewer over-strictness is a real problem.** Be strict on the 12 error types and 5 guidelines. Don't invent new rejection reasons beyond those. If it doesn't violate a specific rule, it's probably fine.
- **"They are all equal" as MCQ option — debated.** No firm ruling yet. If you encounter it, flag for office hours rather than auto-rejecting.

## From lizard-reviewers Channel (Apr 5–7, 2026)

### Annotation Quality
- **MCQ rewrite answers must be just a capital letter, NO period.** e.g. "A" not "A." — confirmed in feedback from leads.
- **You do NOT need to ask the model to answer with a letter for MCQs.** The format instruction is unnecessary.
- **Similar prompts = same ontology + similar flavor of question.** Thumbs up one, thumbs down the others. Exception: same ontology but pointing to different visual components and/or using different math operations may be passable (use best judgment).
- **Vowel-counting prompts on good images** — if they're all basically the same trick, thumbs up one and thumbs down duplicates.
- **Prompts where the answer is 0 from counting things that don't exist** — generally bad. Exception: if you're doing math with at least one non-zero number and the result happens to be 0, that's fine.
- **Math precision exploitation (ln(), huge exponents, sin() to 6th+ decimal)** — debated, not yet formally banned. Consensus: this isn't the type of model error the project is looking for. The model is meant to reason about images, not compete with Wolfram Alpha. Flag these and consider thumbs down.
- **LLM-generated / copy-paste annotations** — flag to project leads immediately. This is considered task abuse.
- **Inflated skill tags** (e.g., TCG Understanding and Spatial checked but don't apply) — uncheck the wrong ones and send back asking annotator to make questions more complex per playbook.

### Reviewer Process (Apr 7 confirmations)
- **First pass ~3 min per prompt** — not a strict timer, use best judgment. Quality > quantity (per Nikhil D.).
- **Second pass: approve or delete only.** ~10-20 min allowed to try to save a prompt. If you can't fix it in ~10 min, delete it.
- **Date your feedback:** format like "4/7 (1)" for first pass, "4/7 (2)" for second pass same day.
- **How to tell first vs second pass:** check the status change logs at the bottom of the task in SuperAnnotate.
- **Reviewer handbook overhaul coming soon** (per Mia S., Apr 7).

### Operational Notes (Apr 7)
- **Achsah W. [HAI] is OOO.** All questions go to Nikhil D. [HAI].
- **SuperAnnotate model outage (Apr 7)** — model not generating answers. SA team aware and working on it. Harsha S. [HAI] will update #lizard-tasking when resolved.
- **Incentives (Mar 30–Apr 5):** QA: $100 at 14+/21+/28+ hrs. Audit: $200 at 14+ hrs, $100 at 21+/28+ hrs.

## V6 Rollout Rulings (Apr 19–20, 2026)

### Retroactive Application (HAI ruling)
- **V6 applies to ALL new QCs, including V5 queue.** Per Achsah W. (relayed by Kassandra R., 2026-04-19): new playbook rules apply to all QCs going forward, regardless of when task was originally annotated. Expect audit returns on month-old work.
- **Playbook v1→v2 transition**: peer discussion of sending back pre-v2 prompts without rating; no formal HAI ruling yet. Joshua C. raised, 5 thumbs-up, not resolved.
- **Metrics impact**: large backlog hit expected (Kassandra: "Metrics don't really matter for us. Not like that at least"). Peer reassurance only, not official.

### V6 Anchor-Skill Rulings (peer consensus, pending lead confirmation)
- **Arbitrary WK additions fail V6.** Multiplying by π on an image unrelated to circles = anchor-skill requirement NOT met (Jason S., confirmed by Kassandra R., 2026-04-19). Exception: "if the calculation is for a circle." → WK must be topically relevant to the image, not a stapled-on constant.
- **Punctuation count × π = still trivial.** Core task is extraction/counting; π doesn't rescue it. Fails V6 anchor-skill (Jason S., 2026-04-19).
- **"Esoteric WK" no longer counts.** Non-contextual world-knowledge hooks (random constants, tangential facts) don't satisfy the anchor-skill requirement.
- **Axis-label read-off ≠ TCG.** Reading only axis labels without interacting with chart values may not qualify as TCG Understanding (Jason S., 2026-04-19, debated). Contrast: operating on chart values / segment proportions = TCG.
- **Unlabeled bar-height comparison = Attribute, not TCG.** "Which bar is highest" on unlabeled bars is Attribute Perception per Kassandra R., 2026-04-20. TCG requires label/axis interaction.
- **Pie chart "absolute diff of segment % and center number" = trivial.** No meaningful relationship between operated values → fails (Kassandra R., 2026-04-20). Contrast: "20% of center number" where the two quantities have a real relationship = OK.
- **Word-soup prompts fail.** Long chains of AP operations with contrived WK framing ("complexity score") still fail V6 — giveaways + non-reasoning. "Forms of speech" / adjective / action-word counting isn't real WK (Kassandra R. feedback template, 2026-04-19).

### Hard-to-Distinguish Colors (V6 status)
- Old "indistinguishable colors" common-error section missing from V2 playbook. Peer interpretation (Jason S., Ayush A., 2026-04-19): still fails under ambiguity / single-verifiable-answer if gradients are genuinely indistinguishable. V6 hasn't loosened this — just didn't restate it. Modifiable (e.g., swap to clearly-different columns) rather than auto-fail.

### Ontology Sameness (peer discussion, 2026-04-19)
- **Different questions, same ontology**: may be OK if the questions are substantively different (not just the same trick restated). No firm lead ruling. Use best judgment.
- **Adding prompts on 2nd pass**: annotators going from 1 → 5 prompts during revision — policy unclear, thread inconclusive.

### Procedural (2026-04-19/20)
- **Reviewer playbook V2 link**: pending; annotator playbook published in #announcements; reviewer version referenced but not yet formally released at time of channel sweep.
- **Verify Submission on V6**: unresolved — Philippe L. asked whether reviewer or annotator presses it on V6 (2026-04-19). No reply captured.
