# Review: Report_Dashboard_Business_Intelligence_Dashboard_96

## Task Info
- **SA Task Filename:** `Report_Dashboard_Business_Intelligence_Dashboard_96.json` (HAI shadow task "Task ID" field)
- **SA Internal Task ID:** 187110115 (numeric — from editor URL, cross-ref only)
- **Image:** `screenshots/Report_Dashboard_Business_Intelligence_Dashboard_96.png` — Purchasing Dashboard with YTD Spends bar chart (4 periods), Top 10 Suppliers with Outstanding Value horizontal bar chart, Top 10 Supplier Returns pie chart, and YTD Spends by Buyer pie chart.
- **Date:** 2026-04-15
- **Review Cycle:** 1st (status log: Prosper Dzanwa 2026-04-15 Submit_to_QC)

## Annotations

### Annotation 1
- **Shadow Task:** ✅ submitted — [ace08e48](shadows/ace08e48.md)
- **Rating:** thumbs-up
- **Question:** SAQ — (top y-axis supplier value − bottom y-axis supplier value) × second-highest YTD Spends period number
- **Skills Tagged (original):** Spatial Reasoning, Math Reasoning, Table/Chart/Graph Understanding, Short answer question
- **Skills Tagged (revised):** Spatial Reasoning, Math Reasoning, Table/Chart/Graph Understanding, Short answer question
- **Question Type:** SAQ
- **Model Generated Answer:** 736
- **Rewrite Answer:** 816

#### Two-Part Check
1. **Question Check:**
   - Guidelines violated: none
   - Error types found: none. "Very top/bottom of y-axis" refers to discrete list positions, not visual estimation — CMW confirmed.
2. **Answer Check:**
   - Math verified: Top supplier (TYCO ELECTRONICS) = $3,878; bottom supplier (3M CDM1441) = $4,082. |3,878 − 4,082| = 204. YTD Spends: Period 1 = $1,182 (highest), Period 4 = $799 (second-highest) → period label = 4. 204 × 4 = 816 ✓. Model got 736 (wrong). Stumped ✓.

#### Full Prompt
In the "Top 10 Suppliers with Outstanding Value" chart, find the absolute difference between the value of the supplier listed at the very top of the y-axis and the value of the supplier listed at the very bottom. Multiply this difference by the numerical label of the Period that has the second-highest spend in the "YTD Spends" chart. Please answer with a single integer (e.g., 150).

#### Rewrite Answer
816

#### Edits Made (if any)
None.

#### Feedback
N/A

---

### Annotation 2
- **Shadow Task:** ✅ submitted — [b567f049](shadows/b567f049.md)
- **Rating:** thumbs-up
- **Question:** SAQ — JCJ Company pie % as decimal × period number of lowest YTD bar
- **Skills Tagged (original):** Attribute Perception, Math Reasoning, Table/Chart/Graph Understanding, Short answer question
- **Skills Tagged (revised):** Attribute Perception, Math Reasoning, Table/Chart/Graph Understanding, Short answer question
- **Question Type:** SAQ
- **Model Generated Answer:** 0.3696
- **Rewrite Answer:** 0.5709

#### Two-Part Check
1. **Question Check:**
   - Guidelines violated: none
   - Error types found: none. Color matching to pie legend is unambiguous; explicit decimal conversion and rounding instructions.
2. **Answer Check:**
   - Math verified: JCJ Company (orange-red segment) = 5.19% → decimal = 0.0519. YTD Spends lowest bar: Period 11 = $62 → period number = 11. 0.0519 × 11 = 0.5709 ✓. Model got 0.3696 (wrong). Stumped ✓.

#### Full Prompt
In the "Top 10 Supplier Returns" chart, identify the percentage value associated with the supplier "JCJ Company" by matching its color in the legend to the pie chart. Treat this percentage as a decimal (e.g., 6.29% as 0.0629). Then, locate the bar with the lowest dollar value in the "YTD Spends" chart and note its corresponding period number on the x-axis. Multiply the decimal percentage by this period number. Please answer with a single number rounded to four decimal places (e.g., 0.1234).

#### Rewrite Answer
0.5709

#### Edits Made (if any)
None.

#### Feedback
N/A

---

## Task Status
- **Status:** QC_Complete
- **Reason:** A1 and A2 both thumbs-up — both stumped. Math verified for both.
- **SA Applied (Cycle 1):** ✅ (legacy backfill 2026-04-18)

---

## Form-Fill Payload
Canonical payload for host jobs 2 (SA apply-review) and 3 (HAI shadow task). Host parses this section verbatim — do not reinterpret. Dumb executor.

```yaml
sa_task_filename: "Report_Dashboard_Business_Intelligence_Dashboard_96.json"
sa_internal_task_id: "187110115"
sa_status_proposed: QC_Complete   # host STOPS before setting; human confirms

annotations:
  - n: 1
    sa:
      rating: approve
      skills_check:   []
      skills_uncheck: []
      prompt_edits: null
      answer_final: "816"
      feedback: null
    hai:
      task_id_field: "Report_Dashboard_Business_Intelligence_Dashboard_96.json"
      role: Reviewing
      annotation_n: 1
      prompt: "In the \"Top 10 Suppliers with Outstanding Value\" chart, find the absolute difference between the value of the supplier listed at the very top of the y-axis and the value of the supplier listed at the very bottom. Multiply this difference by the numerical label of the Period that has the second-highest spend in the \"YTD Spends\" chart. Please answer with a single integer (e.g., 150)."
      image_ref: "screenshots/Report_Dashboard_Business_Intelligence_Dashboard_96.png"
      answer: "816"
  - n: 2
    sa:
      rating: approve
      skills_check:   []
      skills_uncheck: []
      prompt_edits: null
      answer_final: "0.5709"
      feedback: null
    hai:
      task_id_field: "Report_Dashboard_Business_Intelligence_Dashboard_96.json"
      role: Reviewing
      annotation_n: 2
      prompt: "In the \"Top 10 Supplier Returns\" chart, identify the percentage value associated with the supplier \"JCJ Company\" by matching its color in the legend to the pie chart. Treat this percentage as a decimal (e.g., 6.29% as 0.0629). Then, locate the bar with the lowest dollar value in the \"YTD Spends\" chart and note its corresponding period number on the x-axis. Multiply the decimal percentage by this period number. Please answer with a single number rounded to four decimal places (e.g., 0.1234)."
      image_ref: "screenshots/Report_Dashboard_Business_Intelligence_Dashboard_96.png"
      answer: "0.5709"
```

**Host contract:**
- Job 2 (SA apply-review) → parse `annotations[].sa`. STOP before `sa_status_proposed`.
- Job 3 (HAI shadow) → one shadow task per `annotations[].hai` entry. STOP before Submit + Confirm time.
- Image upload = `upload_file` MCP tool. All other fields = `form_input` / checkbox toggles.
