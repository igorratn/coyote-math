# Slack Rulings & Office Hours Decisions

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
