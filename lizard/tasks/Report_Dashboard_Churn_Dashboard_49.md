# Review: Report_Dashboard_Churn_Dashboard_49

## Task Info
- **SA Task Filename:** `Report_Dashboard_Churn_Dashboard_49.json` (HAI shadow task "Task ID" field)
- **SA Internal Task ID:** 187110250 (numeric — from editor URL, cross-ref only)
- **Image:** `screenshots/Report_Dashboard_Churn_Dashboard_49.png` — Customer Churn Dashboard with KPI tiles (23423 Risky Customers, $120.12k Monthly Income, 86.8% Retention Rate, $11.25M MRR), Customers By Status stacked bar chart by month, Churn Risk by Income scatter chart, Churn Risk by Location US map, and customer table.
- **Date:** 2026-04-15
- **Review Cycle:** 1st (status log: Thejas Gudur 2026-04-15 Submit_to_QC)

## Annotations

### Annotation 1
- **Shadow Task:** ✅ submitted — [a7eb54b3](shadows/a7eb54b3.md)
- **Rating:** thumbs-up
- **Question:** SAQ — which US state is highlighted in red for "Churn Risk" in the Churn Risk by Location map
- **Skills Tagged (original):** Attribute Perception, Table/Chart/Graph Understanding, World Knowledge, Short answer question
- **Skills Tagged (revised):** Attribute Perception, Table/Chart/Graph Understanding, World Knowledge, Short answer question
- **Question Type:** SAQ
- **Model Generated Answer:** Ohio
- **Rewrite Answer:** West Virginia

#### Two-Part Check
1. **Question Check:**
   - Guidelines violated: none
   - Error types found: none. Single visually distinct state highlighted in red; unambiguous format instruction.
2. **Answer Check:**
   - Math verified: N/A. The Churn Risk by Location map shows a single state highlighted in red/dark in the mid-Atlantic/Appalachian region — position and shape match West Virginia, not Ohio ✓. Model answered Ohio (misidentified neighboring state). Stumped ✓.

#### Full Prompt
What state is highlighted in red for "Churn Risk"? Answer as the name of the state (e.g. Texas).

#### Rewrite Answer
West Virginia

#### Edits Made (if any)
None.

#### Feedback
N/A

---

### Annotation 2
- **Shadow Task:** ✅ submitted — [da8033b0](shadows/da8033b0.md)
- **Rating:** thumbs-up
- **Question:** SAQ — which month has the most "Active" users in the Customers By Status bar chart
- **Skills Tagged (original):** Attribute Perception, Table/Chart/Graph Understanding, Short answer question
- **Skills Tagged (revised):** Attribute Perception, Table/Chart/Graph Understanding, Short answer question
- **Question Type:** SAQ
- **Model Generated Answer:** Apr
- **Rewrite Answer:** May

#### Two-Part Check
1. **Question Check:**
   - Guidelines violated: none
   - Error types found: none. Single clearly highest bar segment; explicit format example.
2. **Answer Check:**
   - Math verified: N/A. Customers By Status chart shows Active (blue) bars by month Jan–Dec. May has the highest Active bar, visually distinct from April ✓. Model answered Apr (wrong). Stumped ✓.

#### Full Prompt
In the bar chart, which month has the most "Active" users? Keep your answer as the month (e.g. Jan).

#### Rewrite Answer
May

#### Edits Made (if any)
None.

#### Feedback
N/A

---

## Task Status
- **Status:** QC_Complete
- **Reason:** A1 and A2 both thumbs-up — both stumped. No issues.
- **SA Applied (Cycle 1):** ✅ (legacy backfill 2026-04-18)

---

## Form-Fill Payload
Canonical payload for host jobs 2 (SA apply-review) and 3 (HAI shadow task). Host parses this section verbatim — do not reinterpret. Dumb executor.

```yaml
sa_task_filename: "Report_Dashboard_Churn_Dashboard_49.json"
sa_internal_task_id: "187110250"
sa_status_proposed: QC_Complete   # host STOPS before setting; human confirms

annotations:
  - n: 1
    sa:
      rating: approve
      skills_check:   []
      skills_uncheck: []
      prompt_edits: null
      answer_final: "West Virginia"
      feedback: null
    hai:
      task_id_field: "Report_Dashboard_Churn_Dashboard_49.json"
      role: Reviewing
      annotation_n: 1
      prompt: "What state is highlighted in red for \"Churn Risk\"? Answer as the name of the state (e.g. Texas)."
      image_ref: "screenshots/Report_Dashboard_Churn_Dashboard_49.png"
      answer: "West Virginia"
  - n: 2
    sa:
      rating: approve
      skills_check:   []
      skills_uncheck: []
      prompt_edits: null
      answer_final: "May"
      feedback: null
    hai:
      task_id_field: "Report_Dashboard_Churn_Dashboard_49.json"
      role: Reviewing
      annotation_n: 2
      prompt: "In the bar chart, which month has the most \"Active\" users? Keep your answer as the month (e.g. Jan)."
      image_ref: "screenshots/Report_Dashboard_Churn_Dashboard_49.png"
      answer: "May"
```

**Host contract:**
- Job 2 (SA apply-review) → parse `annotations[].sa`. STOP before `sa_status_proposed`.
- Job 3 (HAI shadow) → one shadow task per `annotations[].hai` entry. STOP before Submit + Confirm time.
- Image upload = `upload_file` MCP tool. All other fields = `form_input` / checkbox toggles.
