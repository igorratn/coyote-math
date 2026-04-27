# Review: Report_Dashboard_Marketing_Dashboard_129

## Task Info
- **task_id:** 185555578
- **SA_TASK_FILENAME:** Report_Dashboard_Marketing_Dashboard_129.json
- **Image:** screenshots/Report_Dashboard_Marketing_Dashboard_129.png — (description)
- **Date:** 2026-04-26
- **Review Cycle:** 1st
- **Task QC Status:** QC_Complete

## Task Status
- **Status:** ALL-AUTO-RESOLVED
- **Reviewers fired:** gpt
- **Summary:** 0 pending Igor, 2 auto-resolved, 0 no-reviewer-output, 0 unchanged-carry-forward (of 2 total)
- **SA Applied (Cycle 1):** ✅

---

## Annotation 1

- **Shadow Task:** ✅ submitted (cycle 1) — [ef9816f7](shadows/ef9816f7.md)
- **Reviewer:** gpt
- **Rating:** thumbs-up
- **All Verdicts:** gpt: 👍 (picked)
- **Flags:** []
- **Final Answer (reviewer):** 0.571
- **Skills Tagged:** Enumeration, Math Reasoning, Table/Chart/Graph Understanding
- **Question Type:** SAQ
- **Model Answer:** 0.444
- **Annotator Answer:** 0.571

#### Full Prompt
Identify how many experiments were 20% off. Divide this by the number of characters in the highest pipeline category. 

Provide your answer in decimal format to the nearest thousandth (e.g., 1.592).

#### Rewrite Answer (annotator)
0.571

#### Reviewer Body (gpt) (picked)
- **Rating:** thumbs-up
- **Final Rewrite Answer:** 0.571
- **Flags:** []
- **Two-Part Check:**
  1. Question: Valid. Requires counting specific rows in the table (TCG Understanding + Enumeration) and dividing by a character count from the Pipeline category label. Single deterministic answer; no ambiguity.
  2. Answer:
     - Count of “20% offer” experiments = 4 [Read-First; pixel-verified].
     - Highest pipeline category is “Planned” with name length = 7 characters (“Planned”) [Read-First; pixel-verified].
     - Compute 4 ÷ 7 = 0.571428… → nearest thousandth = 0.571.
- **Edits Made:** None
- **Feedback:** N/A

**Auto-resolved at Job 2 (👍).** gpt 👍 (matches annotator). SA action at Job 3b: approve annotator's answer `0.571` (cycle 1). Skipped at Job 3a.

#### Edits Made
(to be filled at Job 3a if needed)

#### Feedback
2026-04-26: thumbs-up (gpt) — auto-resolved

---
## Annotation 2

- **Shadow Task:** ✅ submitted (cycle 1) — [f17b0d60](shadows/f17b0d60.md)
- **Reviewer:** gpt
- **Rating:** thumbs-up
- **All Verdicts:** gpt: 👍 (picked)
- **Flags:** []
- **Final Answer (reviewer):** 4464.706
- **Skills Tagged:** Enumeration, Math Reasoning, Table/Chart/Graph Understanding
- **Question Type:** SAQ
- **Model Answer:** 34.017
- **Annotator Answer:** 4464.706

#### Full Prompt
What percent of the experiments is owned by Sarah based on the table? Divide by the number of results won this month and multiply by the year.

Provide your answer in decimal format to the nearest thousandth (e.g., 1.592).

#### Rewrite Answer (annotator)
4464.706

#### Reviewer Body (gpt) (picked)
- **Rating:** thumbs-up
- **Final Rewrite Answer:** 4464.706
- **Flags:** []
- **Two-Part Check:**
  1. Question: Valid and self-contained. Requires reading owner counts from the table (TCG Understanding), computing a percent, then applying multi-step arithmetic using “Won” and the visible year. Single deterministic result.
  2. Answer:
     - Total experiments in table = 8 [Read-First; pixel-verified].
     - Sarah owns 3 of them [Read-First; pixel-verified].
     - Percent owned by Sarah = (3/8) × 100 = 37.5% [pixel-verified].
     - Results won this month = 17 [Read-First; pixel-verified].
     - Year shown on the dashboard = 2024 [Read-First; pixel-verified].
     - Calculation: 37.5 ÷ 17 = 2.205882353; then × 2024 = 4464.705882353 → nearest thousandth = 4464.706.
- **Edits Made:** None
- **Feedback:** N/A

**Auto-resolved at Job 2 (👍).** gpt 👍 (matches annotator). SA action at Job 3b: approve annotator's answer `4464.706` (cycle 1). Skipped at Job 3a.

#### Edits Made
(to be filled at Job 3a if needed)

#### Feedback
2026-04-26: thumbs-up (gpt) — auto-resolved

---
## Form-Fill Payload

```yaml
task:
  stem: Report_Dashboard_Marketing_Dashboard_129
  sa_task_filename: Report_Dashboard_Marketing_Dashboard_129.json
  cycle: 1
  qc_status: QC_Complete  # cycle-1 only; set in SA task list after per-annot push

annotations:

  - n: 1
    resolution: auto-resolved
    sa:
      rating: thumbs-up
      answer_final: "0.571"
      flags: []
    hai:
      task_id_field: Report_Dashboard_Marketing_Dashboard_129.json
      role: Reviewing
      annotation_n: 1
      prompt: |
        Identify how many experiments were 20% off. Divide this by the number of characters in the highest pipeline category. 
        
        Provide your answer in decimal format to the nearest thousandth (e.g., 1.592).
      answer: "0.571"

  - n: 2
    resolution: auto-resolved
    sa:
      rating: thumbs-up
      answer_final: "4464.706"
      flags: []
    hai:
      task_id_field: Report_Dashboard_Marketing_Dashboard_129.json
      role: Reviewing
      annotation_n: 2
      prompt: |
        What percent of the experiments is owned by Sarah based on the table? Divide by the number of results won this month and multiply by the year.
        
        Provide your answer in decimal format to the nearest thousandth (e.g., 1.592).
      answer: "4464.706"
```
