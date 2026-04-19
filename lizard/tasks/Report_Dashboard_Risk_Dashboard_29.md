# Review: Report_Dashboard_Risk_Dashboard_29.json

## Task Info
- **SA Task Filename:** `Report_Dashboard_Risk_Dashboard_29.json`
- **SA Internal Task ID:** 187111170
- **Image:** Financial risk dashboard with "CCC Q3 2022 and Historical" bar/line chart showing Cash Conversion Cycle data across multiple years
- **Date:** 2026-04-17
- **Review Cycle:** 1st

## Annotations

### Annotation 1
- **Shadow Task:** ✅ submitted (cycle 1) — [3c53e080](shadows/3c53e080.md)
- **Rating:** thumbs-up
- **Question:** In what year did the orange CCC line peak in the "CCC Q3 2022 and Historical" chart?
- **Skills Tagged:** Attribute Perception, Table/Chart/Graph Understanding
- **Question Type:** SAQ
- **Model Generated Answer:** 2022
- **Rewrite Answer:** 2020

#### Two-Part Check
1. **Question Check:**
   - Guidelines violated: none
   - Error types found: none
2. **Answer Check:**
   - Pixel-verified from screenshot: orange CCC line values across years — 2019≈45, 2020≈65 (highest point), 2021≈52, Q1 2022≈44, Q2 2022≈42, Q3 2022≈48. 2020 is the clear visual peak of the orange line.
   - Answer correct: yes — 2020. Model answered 2022 (likely anchored on chart title year) → stumped.

#### Full Prompt
In the bar graph titled "CCC Q3 2022 and Historical", during what year did the orange line CCC peak (e.g., 2021)?

#### Rewrite Answer
2020

#### Edits Made (if any)
None

#### Feedback
N/A

---

## Task Status
- **Status:** QC_Complete
- **Reason:** 1 annotation, thumbs-up. Model stumped (answered 2022 = chart title year; correct answer 2020 = actual orange-line peak, pixel-verified). Guidelines clean. Skill tags appropriate.
- **SA Applied (Cycle 1):** ✅
- **SA Status Set By Human:** QC_Complete (2026-04-17)
- **Derivation match:** yes

---

## Form-Fill Payload

```yaml
task_id: 187111170
annotations:
  - n: 1
    sa:
      rating: thumbs-up
      skills_check: []
      skills_uncheck: []
      prompt_edits: null
      answer_final: null
      feedback: null
    hai:
      task_id_field: Report_Dashboard_Risk_Dashboard_29.json
      role: Reviewing
      annotation_n: 1
      prompt: |
        In the bar graph titled "CCC Q3 2022 and Historical", during what year did the orange line CCC peak (e.g., 2021)?
      answer: "2020"
```
