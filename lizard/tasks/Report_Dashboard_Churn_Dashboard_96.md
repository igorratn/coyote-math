# Review: Report_Dashboard_Churn_Dashboard_96

## Task Info
- **SA Task Filename:** `Report_Dashboard_Churn_Dashboard_96.json` (HAI shadow task "Task ID" field)
- **SA Internal Task ID:** 187110260 (numeric — from editor URL, cross-ref only)
- **Image:** `screenshots/Report_Dashboard_Churn_Dashboard_96.png` — Telecom Customer Churn Analysis dashboard with Internet Type and Payment Method stacked bar charts, Customers Demographics, Extra Services Frequency, and Customer Status by Ad Campaign panels.
- **Date:** 2026-04-15
- **Review Cycle:** 1st (status log: Truman Yuan 2026-04-15 Submit_to_QC)

## Annotations

### Annotation 1
- **Shadow Task:** ✅ submitted — [d5828c1b](shadows/d5828c1b.md)
- **Rating:** thumbs-up
- **Question:** MCQ — absolute difference between % Fiber Optic Stayed (Internet Type) and % Credit Card Churned (Payment Method); "closest to" format
- **Skills Tagged (original):** Math Reasoning, Logical Reasoning, Table/Chart/Graph Understanding, Short answer question
- **Skills Tagged (revised):** Math Reasoning, Logical Reasoning, Table/Chart/Graph Understanding, MCQ
- **Question Type:** MCQ
- **Model Generated Answer:** B
- **Rewrite Answer:** A

#### Two-Part Check
1. **Question Check:**
   - Guidelines violated: none
   - Error types found: Type 9 — question uses MCQ format (A/B/C/D options with letter answer) but was tagged "Short answer question"/SAQ. Corrected to MCQ.
2. **Answer Check:**
   - Math verified (corrected 2026-04-15): Fiber Optic Stayed ≈ 55% (Internet Type chart, blue/Stayed segment of Fiber Optic bar). Credit Card Churned ≈ 14% (Payment Method chart, red/Churned segment of Credit Card bar, ~78%→~92%). |55 − 14| ≈ 41. Closest option = A (45) ✓. Model answered B=28 — likely misread chart segments. Stumped ✓. (Prior reasoning had percentages wrong; final answer A unchanged.)

#### Full Prompt
Which of the following is closest to the absolute difference between the percentage of Fiber Optic customers who Stayed in the Internet Type chart and the percentage of Credit Card customers who Churned in the Payment Method chart?

A. 45
B. 28
C. 60
D. 74

#### Rewrite Answer
A

#### Edits Made (if any)
Skill type corrected: "Short answer question" unchecked → "MCQ" checked.

#### Feedback
4/15: Skill type corrected — question uses MCQ format (A/B/C/D options) but was tagged SAQ. Updated to MCQ. No content changes.

---

## Task Status
- **Status:** QC_Complete
- **Reason:** A1 thumbs-up — stumped (MODEL=B ≠ ANSWER=A). Skill correction applied (SAQ→MCQ).
- **SA Applied (Cycle 1):** ✅ (legacy backfill 2026-04-18)

---

## Form-Fill Payload
Canonical payload for host jobs 2 (SA apply-review) and 3 (HAI shadow task). Host parses this section verbatim — do not reinterpret. Dumb executor.

```yaml
sa_task_filename: "Report_Dashboard_Churn_Dashboard_96.json"
sa_internal_task_id: "187110260"
sa_status_proposed: QC_Complete   # host STOPS before setting; human confirms

annotations:
  - n: 1
    sa:
      rating: approve
      skills_check:   ["MCQ"]
      skills_uncheck: ["Short answer question"]
      prompt_edits: null
      answer_final: "A"
      feedback: "4/15: Skill type corrected — question uses MCQ format (A/B/C/D options) but was tagged SAQ. Updated to MCQ. No content changes."
    hai:
      task_id_field: "Report_Dashboard_Churn_Dashboard_96.json"
      role: Reviewing
      annotation_n: 1
      prompt: "Which of the following is closest to the absolute difference between the percentage of Fiber Optic customers who Stayed in the Internet Type chart and the percentage of Credit Card customers who Churned in the Payment Method chart?\n\nA. 45\nB. 28\nC. 60\nD. 74"
      image_ref: "screenshots/Report_Dashboard_Churn_Dashboard_96.png"
      answer: "A"
```

**Host contract:**
- Job 2 (SA apply-review) → parse `annotations[].sa`. STOP before `sa_status_proposed`.
- Job 3 (HAI shadow) → one shadow task per `annotations[].hai` entry. STOP before Submit + Confirm time.
- Image upload = `upload_file` MCP tool. All other fields = `form_input` / checkbox toggles.
