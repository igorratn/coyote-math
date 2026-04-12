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

### Quality Metrics
- Reviewer scores come from internal audit (NV Audit)
- First pass score target: above 0.75
- Second pass score target: at or near 1.0
- Scores visible in same place as annotator scores
- Below thresholds → fewer tasks or potential offboarding

## Process Lessons

### From Practice Tasks (Apr 2-4, 2026)
- **Spatial Reasoning is consistently over-tagged.** Location descriptions ("bottom-right," "far right panel," "center of dashboard") are navigational, not spatial reasoning. Spatial Reasoning = reasoning about relative positions ("which is closest to," "what lies between"). Removed on 11 of 12 annotations across 3 tasks.
- **Verify math independently every time.** Don't trust annotator's answer. Example: Documentation was 20:00 not 28:08 — changes the entire calculation.
- **"Main" is ambiguous, "all" is not.** "Main numeric values" caused Type 1 error. "All numeric values" fixed it. Word choice matters.
- **Counting boundaries need explicit definitions.** "Colored square icons" failed Type 7. "Non-face icons" passed. The more specific the counting target, the better.
- **Don't invent rejection reasons.** If it doesn't violate a specific error type or guideline, it passes. "Three central panels" is clear enough when context shows 3 top + 2 bottom.
- **Second pass feedback format:** Keep original feedback, add new dated entry below. Shows the revision trail.
- **QualityCheck status in SA:** Selecting a status removes the task from your queue. This is expected behavior — task moves to next stage.
