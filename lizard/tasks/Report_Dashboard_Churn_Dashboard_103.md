# Review: Report_Dashboard_Churn_Dashboard_103

## Task Info
- **SA Task Filename:** `Report_Dashboard_Churn_Dashboard_103.json` (HAI shadow task "Task ID" field)
- **SA Internal Task ID:** 187110230 (numeric — from editor URL, cross-ref only)
- **Image:** `screenshots/Report_Dashboard_Churn_Dashboard_103.png` — Customer churn dashboard with gender share: includes Churn vs Not Churn donut (30% churn), Churn by Age Range grouped bar chart, Churn by Country, Credit Score to Churn, and other breakdowns.
- **Date:** 2026-04-15
- **Review Cycle:** 1st (status log: Xinyi Liu 2026-04-15 Submit_to_QC)

## Annotations

### Annotation 1
- **Shadow Task:** ✅ submitted — [e7a907d3](shadows/e7a907d3.md)
- **Rating:** thumbs-up
- **Question:** SAQ — absolute difference in churn count between age 35 and age 45 groups in "Churn by Age Range" chart
- **Skills Tagged (original):** Math Reasoning, Table/Chart/Graph Understanding, Short answer question
- **Skills Tagged (revised):** Math Reasoning, Table/Chart/Graph Understanding, Short answer question
- **Question Type:** SAQ
- **Model Generated Answer:** 60
- **Rewrite Answer:** 40

#### Two-Part Check
1. **Question Check:**
   - Guidelines violated: none
   - Error types found: none
2. **Answer Check:**
   - Math verified: Churn by Age Range chart — age 35 bar = 410, age 45 bar = 370 (values labeled on chart). |410 − 370| = 40 ✓. Model answered 60 (wrong — may have read adjacent bars or confused age groups). Stumped ✓.

#### Full Prompt
According to the "Churn by Age Range" plot, what is the absolute difference in churn between the 35 and 45 age groups? Provide your answer as a whole number. (e.g. 10)

#### Rewrite Answer
40

#### Edits Made (if any)
None.

#### Feedback
N/A

---

## Task Status
- **Status:** QC_Complete
- **Reason:** A1 thumbs-up — stumped (MODEL=60 ≠ ANSWER=40). No issues.
- **SA Applied (Cycle 1):** ✅ (legacy backfill 2026-04-18)

---

## Form-Fill Payload
Canonical payload for host jobs 2 (SA apply-review) and 3 (HAI shadow task). Host parses this section verbatim — do not reinterpret. Dumb executor.

```yaml
sa_task_filename: "Report_Dashboard_Churn_Dashboard_103.json"
sa_internal_task_id: "187110230"
sa_status_proposed: QC_Complete   # host STOPS before setting; human confirms

annotations:
  - n: 1
    sa:
      rating: approve
      skills_check:   []
      skills_uncheck: []
      prompt_edits: null
      answer_final: "40"
      feedback: null
    hai:
      task_id_field: "Report_Dashboard_Churn_Dashboard_103.json"
      role: Reviewing
      annotation_n: 1
      prompt: "According to the \"Churn by Age Range\" plot, what is the absolute difference in churn between the 35 and 45 age groups? Provide your answer as a whole number. (e.g. 10)"
      image_ref: "screenshots/Report_Dashboard_Churn_Dashboard_103.png"
      answer: "40"
```

**Host contract:**
- Job 2 (SA apply-review) → parse `annotations[].sa`. STOP before `sa_status_proposed`.
- Job 3 (HAI shadow) → one shadow task per `annotations[].hai` entry. STOP before Submit + Confirm time.
- Image upload = `upload_file` MCP tool. All other fields = `form_input` / checkbox toggles.
