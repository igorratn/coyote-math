# Review: Report_Dashboard_Metrics_Dashboard_5

## Task Info
- **SuperAnnotate Task ID:** 187110799
- **Image:** Customer support dashboard. Customer Retention line chart (monthly, Feb-22 through Dec-22). Data facts at top: total requests 2022 and % answered. Additional charts/metrics present.
- **Date:** 2026-04-16
- **Review Cycle:** 1st

## Annotations

### Annotation 1
- **Shadow Task:** ✅ submitted (cycle 1) — [18dc6388](shadows/18dc6388.md)
- **Rating:** thumbs-up
- **Question:** During which two months was customer retention lowest? SAQ with month+year format.
- **Skills Tagged:** Logical Reasoning, Table/Chart/Graph Understanding
- **Question Type:** Short Answer
- **Model Answer Rating:** thumbs-down

#### Two-Part Check
1. **Question Check:**
   - Guidelines violated: none
   - Error types found: none. Format example shows single month but two are asked — minor, not a true Type 1 since the answer format is still clear enough (month-year pairs). Stage 3 manual review confirmed ambiguity call was too harsh.
2. **Answer Check:**
   - Math verified: yes — two lowest points on retention chart are Feb-22 and Jul-22. Model got Jun-22 wrong for second month.
   - Answer correct: yes (Feb-22 and Jul-22)

#### Full Prompt
During which two months was the customer retention the lowest in the 'Customer Retention' chart?  Respond with month and 2 digit year. (eg: Jan-22)

#### Rewrite Answer
Feb-22 and Jul-22

#### Edits Made (if any)
None

#### Feedback
N/A

---

### Annotation 2
- **Shadow Task:** ✅ submitted (cycle 1) — [17f91c88](shadows/17f91c88.md)
- **Rating:** thumbs-up
- **Question:** Total requests answered in 2022 from data facts; express to nearest tenth of a million.
- **Skills Tagged:** Math Reasoning, Table/Chart/Graph Understanding
- **Question Type:** Short Answer
- **Model Answer Rating:** thumbs-down

#### Two-Part Check
1. **Question Check:**
   - Guidelines violated: none
   - Error types found: none. Format "nearest tenth of a million (ex 8.5M)" is unambiguous.
2. **Answer Check:**
   - Math verified: yes — 84% of 1.03M total requests = 0.8652M ≈ 0.9M. Model answered 1.03M (just read total, missed the % calculation).
   - Answer correct: yes (.9M)

#### Full Prompt
According to the data facts at the top of the chart, what are the total number of requests answered in 2022?  Express value to the nearest tenth of a million. (ex 8.5M)

#### Rewrite Answer
.9M

#### Edits Made (if any)
None

#### Feedback
N/A

## Task Status
- **Status:** QC_Complete
- **SA Applied:** ✅
- **Reason:** Both annotations thumbs-up. A1 ambiguity call overridden by Stage 3 manual review — format is clear enough. A2 correct (0.9M).

## Form-Fill Payload

```yaml
task_id: 187110799
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
      task_id_field: 187110799
      role: Reviewing
      annotation_n: 1
      prompt: |
        During which two months was the customer retention the lowest in the 'Customer Retention' chart?  Respond with month and 2 digit year. (eg: Jan-22)
      answer: "Feb-22 and Jul-22"
  - n: 2
    sa:
      rating: thumbs-up
      skills_check: []
      skills_uncheck: []
      prompt_edits: null
      answer_final: null
      feedback: null
    hai:
      task_id_field: 187110799
      role: Reviewing
      annotation_n: 2
      prompt: |
        According to the data facts at the top of the chart, what are the total number of requests answered in 2022?  Express value to the nearest tenth of a million. (ex 8.5M)
      answer: ".9M"
```
