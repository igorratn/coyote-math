# Review: Report_Dashboard_Resource_Dashboard_35

## Task Info
- **task_id:** 185555894
- **SA_TASK_FILENAME:** Report_Dashboard_Resource_Dashboard_35.json
- **Image:** screenshots/Report_Dashboard_Resource_Dashboard_35.png — (description)
- **Date:** 2026-04-26
- **Review Cycle:** 1st
- **Task QC Status:** QC_Complete

## Task Status
- **Status:** ALL-AUTO-RESOLVED
- **Reviewers fired:** gpt
- **Summary:** 0 pending Igor, 5 auto-resolved, 0 no-reviewer-output, 0 unchanged-carry-forward (of 5 total)
- **SA Applied (Cycle 1):** ✅

---

## Annotation 1

- **Shadow Task:** ✅ submitted (cycle 1) — [fec0531d](shadows/fec0531d.md)
- **Reviewer:** gpt
- **Rating:** thumbs-up
- **All Verdicts:** gpt: 👍 (picked)
- **Flags:** []
- **Final Answer (reviewer):** C
- **Skills Tagged:** Attribute Perception, Spatial Reasoning, Table/Chart/Graph Understanding
- **Question Type:** MCQ
- **Model Answer:** B
- **Annotator Answer:** C

#### Full Prompt
Which project has the second lowest allocation percentage?

A. Henry's holdings Li...
B. OML Trans
C. Vessa Agro
D. Aviva Core

#### Rewrite Answer (annotator)
C

#### Reviewer Body (gpt) (picked)
- **Rating:** thumbs-up
- **Final Rewrite Answer:** C
- **Flags:** []
- **Two-Part Check:**
  1. Question: Valid MCQ. Requires reading four allocation percentages and ranking to find the second lowest (Table/Chart/Graph Understanding present). Single deterministic answer; self-contained.
  2. Answer: Allocations [Read-First]: 77%, 69%, 61%, 55% [pixel-verified]. Sorted ascending → 55 (Aviva Core), 61 (Vessa Agro), 69 (OML Trans), 77 (Henry’s). Second lowest = Vessa Agro → option C. [pixel-verified]
- **Edits Made:** Corrected answer from B to C.
- **Feedback:** Good question; relies on comparing the project cards’ percentages.

**Auto-resolved at Job 2 (👍).** gpt 👍 (matches annotator). SA action at Job 3b: approve annotator's answer `C` (cycle 1). Skipped at Job 3a.

#### Edits Made
(to be filled at Job 3a if needed)

#### Feedback
2026-04-26: thumbs-up (gpt) — auto-resolved

---
## Annotation 2

- **Shadow Task:** ✅ submitted (cycle 1) — [007f7907](shadows/007f7907.md)
- **Reviewer:** gpt
- **Rating:** thumbs-up
- **All Verdicts:** gpt: 👍 (picked)
- **Flags:** []
- **Final Answer (reviewer):** A
- **Skills Tagged:** Attribute Perception, Spatial Reasoning, Math Reasoning
- **Question Type:** MCQ
- **Model Answer:** D
- **Annotator Answer:** A

#### Full Prompt
What is the approximate difference between the mean of the projects' allocation percentage and the mean of the projects' months remaining?

A. 43
B. 44
C. 39
D. 41

#### Rewrite Answer (annotator)
A

#### Reviewer Body (gpt) (picked)
- **Rating:** thumbs-up
- **Final Rewrite Answer:** A
- **Flags:** []
- **Two-Part Check:**
  1. Question: Valid MCQ with an “approximate difference,” comparing two means (Table/Chart/Graph Understanding + Math). Self-contained.
  2. Answer: Allocation mean = (77 + 69 + 61 + 55)/4 = 262/4 = 65.5 [pixel-verified via Read-First]. Months mean = (23 + 19 + 15 + 34)/4 = 91/4 = 22.75 [pixel-verified via Read-First]. Difference (absolute) = 65.5 − 22.75 = 42.75 ≈ 43 → option A. [pixel-verified]
- **Edits Made:** None
- **Feedback:** Consider saying “absolute difference” to remove any sign ambiguity.

**Auto-resolved at Job 2 (👍).** gpt 👍 (matches annotator). SA action at Job 3b: approve annotator's answer `A` (cycle 1). Skipped at Job 3a.

#### Edits Made
(to be filled at Job 3a if needed)

#### Feedback
2026-04-26: thumbs-up (gpt) — auto-resolved

---
## Annotation 3

- **Shadow Task:** ✅ submitted (cycle 1) — [05e9c1c4](shadows/05e9c1c4.md)
- **Reviewer:** gpt
- **Rating:** thumbs-up
- **All Verdicts:** gpt: 👍 (picked)
- **Flags:** []
- **Final Answer (reviewer):** C
- **Skills Tagged:** Spatial Reasoning, Math Reasoning, Table/Chart/Graph Understanding
- **Question Type:** MCQ
- **Model Answer:** B
- **Annotator Answer:** C

#### Full Prompt
Which project has the lowest value when adding its allocation percentage to its months remaining/months until start value?

A. Henry's holdings Li...
B. OML Trans
C. Vessa Agro
D. Aviva Core

#### Rewrite Answer (annotator)
C

#### Reviewer Body (gpt) (picked)
- **Rating:** thumbs-up
- **Final Rewrite Answer:** C
- **Flags:** []
- **Two-Part Check:**
  1. Question: Valid MCQ; requires summing each project’s allocation % with its months value and comparing (TCG Understanding + Math).
  2. Answer: Sums using Read-First values:
     - Henry’s: 77 + 23 = 100
     - OML Trans: 69 + 19 = 88
     - Vessa Agro: 61 + 15 = 76
     - Aviva Core: 55 + 34 = 89
     Lowest = 76 (Vessa Agro) → option C. [pixel-verified]
- **Edits Made:** None
- **Feedback:** Clear and well-grounded in the visible numbers.

**Auto-resolved at Job 2 (👍).** gpt 👍 (matches annotator). SA action at Job 3b: approve annotator's answer `C` (cycle 1). Skipped at Job 3a.

#### Edits Made
(to be filled at Job 3a if needed)

#### Feedback
2026-04-26: thumbs-up (gpt) — auto-resolved

---
## Annotation 4

- **Shadow Task:** ✅ submitted (cycle 1) — [09d26053](shadows/09d26053.md)
- **Reviewer:** gpt
- **Rating:** thumbs-up
- **All Verdicts:** gpt: 👍 (picked)
- **Flags:** []
- **Final Answer (reviewer):** 4
- **Skills Tagged:** Enumeration, Attribute Perception, Spatial Reasoning, Table/Chart/Graph Understanding
- **Question Type:** SAQ
- **Model Answer:** 5
- **Annotator Answer:** 9

#### Full Prompt
Analyze the horizontal chart of "Dev. Matt Waslog" under "Resource Planning." How many discrete rectangles to the right of F 19 (not including the box under F 19) are colored in with a striped blue pattern in Dev. Matt Waslog's row? Answer with a single integer (e.g., 12).

#### Rewrite Answer (annotator)
9

#### Reviewer Body (gpt) (picked)
- **Rating:** thumbs-up
- **Final Rewrite Answer:** 4
- **Flags:** []
- **Two-Part Check:**
  1. Question: Valid SAQ; requires locating “F 19” on the calendar grid and counting striped blue rectangles in the “Dev. Matt Waslog” row to the right of that column (TCG Understanding + Enumeration).
  2. Answer: From the grid, in Matt Waslog’s row, to the right of F 19 (excluding the box under 19), there are 4 distinct striped blue rectangles [Read-First “Additional observed counts”]. [pixel-verified]
- **Edits Made:** None
- **Feedback:** Referencing “F 19” makes the counting boundary clear.

**Auto-resolved at Job 2 (👍).** gpt 👍 (reviewer's own answer was `4`, but rule = accept annotator's answer). SA action at Job 3b: approve annotator's answer `9` (cycle 1). Skipped at Job 3a.

#### Edits Made
(to be filled at Job 3a if needed)

#### Feedback
2026-04-26: thumbs-up (gpt) — auto-resolved

---
## Annotation 5

- **Shadow Task:** ✅ submitted (cycle 1) — [0a225feb](shadows/0a225feb.md)
- **Reviewer:** gpt
- **Rating:** thumbs-up
- **All Verdicts:** gpt: 👍 (picked)
- **Flags:** []
- **Final Answer (reviewer):** 24.10.2025
- **Skills Tagged:** Attribute Perception, Spatial Reasoning, Logical Reasoning, Table/Chart/Graph Understanding
- **Question Type:** SAQ
- **Model Answer:** 26.03.2024
- **Annotator Answer:** 24.10.2025

#### Full Prompt
According to the image, find the date that the "OML Trans" project ends. Add three years only to the years part of the date, and add seven days to the days part of this date. What is the final date after this calculation? Answer with Day.Month.Year in this format __.__.____ (e.g., 22.11.2023).

#### Rewrite Answer (annotator)
24.10.2025

#### Reviewer Body (gpt) (picked)
- **Rating:** thumbs-up
- **Final Rewrite Answer:** 24.10.2025
- **Flags:** []
- **Two-Part Check:**
  1. Question: Valid SAQ; uses tooltip date for OML Trans and applies simple date arithmetic (Logical/Math reasoning).
  2. Answer: Tooltip shows “Ends: 17.10.2022” [Read-First]. Add 3 years → 17.10.2025. Add 7 days to the day → 24.10.2025. Final: 24.10.2025. [pixel-verified]
- **Edits Made:** None
- **Feedback:** Clear instructions; arithmetic unambiguous.

**Auto-resolved at Job 2 (👍).** gpt 👍 (matches annotator). SA action at Job 3b: approve annotator's answer `24.10.2025` (cycle 1). Skipped at Job 3a.

#### Edits Made
(to be filled at Job 3a if needed)

#### Feedback
2026-04-26: thumbs-up (gpt) — auto-resolved

---
## Form-Fill Payload

```yaml
task:
  stem: Report_Dashboard_Resource_Dashboard_35
  sa_task_filename: Report_Dashboard_Resource_Dashboard_35.json
  cycle: 1
  qc_status: QC_Complete  # cycle-1 only; set in SA task list after per-annot push

annotations:

  - n: 1
    resolution: auto-resolved
    sa:
      rating: thumbs-up
      answer_final: "C"
      flags: []
    hai:
      task_id_field: Report_Dashboard_Resource_Dashboard_35.json
      role: Reviewing
      annotation_n: 1
      prompt: |
        Which project has the second lowest allocation percentage?
        
        A. Henry's holdings Li...
        B. OML Trans
        C. Vessa Agro
        D. Aviva Core
      answer: "C"

  - n: 2
    resolution: auto-resolved
    sa:
      rating: thumbs-up
      answer_final: "A"
      flags: []
    hai:
      task_id_field: Report_Dashboard_Resource_Dashboard_35.json
      role: Reviewing
      annotation_n: 2
      prompt: |
        What is the approximate difference between the mean of the projects' allocation percentage and the mean of the projects' months remaining?
        
        A. 43
        B. 44
        C. 39
        D. 41
      answer: "A"

  - n: 3
    resolution: auto-resolved
    sa:
      rating: thumbs-up
      answer_final: "C"
      flags: []
    hai:
      task_id_field: Report_Dashboard_Resource_Dashboard_35.json
      role: Reviewing
      annotation_n: 3
      prompt: |
        Which project has the lowest value when adding its allocation percentage to its months remaining/months until start value?
        
        A. Henry's holdings Li...
        B. OML Trans
        C. Vessa Agro
        D. Aviva Core
      answer: "C"

  - n: 4
    resolution: auto-resolved
    sa:
      rating: thumbs-up
      answer_final: "4"
      flags: []
    hai:
      task_id_field: Report_Dashboard_Resource_Dashboard_35.json
      role: Reviewing
      annotation_n: 4
      prompt: |
        Analyze the horizontal chart of "Dev. Matt Waslog" under "Resource Planning." How many discrete rectangles to the right of F 19 (not including the box under F 19) are colored in with a striped blue pattern in Dev. Matt Waslog's row? Answer with a single integer (e.g., 12).
      answer: "9"

  - n: 5
    resolution: auto-resolved
    sa:
      rating: thumbs-up
      answer_final: "24.10.2025"
      flags: []
    hai:
      task_id_field: Report_Dashboard_Resource_Dashboard_35.json
      role: Reviewing
      annotation_n: 5
      prompt: |
        According to the image, find the date that the "OML Trans" project ends. Add three years only to the years part of the date, and add seven days to the days part of this date. What is the final date after this calculation? Answer with Day.Month.Year in this format __.__.____ (e.g., 22.11.2023).
      answer: "24.10.2025"
```
