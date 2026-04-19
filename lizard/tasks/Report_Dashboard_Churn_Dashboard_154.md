# Review: Report_Dashboard_Churn_Dashboard_154

## Task Info
- **SA Task Filename:** `Report_Dashboard_Churn_Dashboard_154.json` (HAI shadow task "Task ID" field)
- **SA Internal Task ID:** 187110240 (numeric — from editor URL, cross-ref only)
- **Image:** `screenshots/Report_Dashboard_Churn_Dashboard_154.png` — Bank Churners Dashboard for 2018: KPI tiles (Most Used Card=Blue, Existing Customer=8.5K, Attributed Customer=1.52K, Highest Qualification=Doctorate), Attrition Flag pie chart, Marital Status by Customer Age line chart (Divorced/Married/Single/Unknown), Income Category bar chart, Education Level bar chart, and Card Category bar chart.
- **Date:** 2026-04-15
- **Review Cycle:** 1st (status log: Laura Cekot 2026-04-15 Submit_to_QC)

## Annotations

### Annotation 1
- **Shadow Task:** ✅ submitted — [93c67901](shadows/93c67901.md)
- **Rating:** thumbs-up
- **Question:** SAQ — second most common customer type by (marital status, education level, income category)
- **Skills Tagged (original):** Enumeration, Attribute Perception, Spatial Reasoning, Logical Reasoning, Table/Chart/Graph Understanding, MCQ
- **Skills Tagged (revised):** Enumeration, Attribute Perception, Spatial Reasoning, Logical Reasoning, Table/Chart/Graph Understanding, Short answer question
- **Question Type:** SAQ
- **Model Generated Answer:** High School
- **Rewrite Answer:** Single, High School, $40K-$60K

#### Two-Part Check
1. **Question Check:**
   - Guidelines violated: none
   - Error types found: Type 9 — question tagged MCQ but uses free-form text answer format (no A/B/C/D options). Corrected to Short answer question.
2. **Answer Check:**
   - Math verified: Income chart from most to least common: Less than $40K > $40K-$60K > $80K-$120K > $60K-$80K > Unknown > $120K+. Second most common income = $40K-$60K ✓. Education chart: Graduate > High School > Unknown > Uneducated > College > Post-Graduate > Doctorate. Second most common education = High School ✓. Marital Status line chart: Married is most common (highest line), Single is second most common. Second most common = Single ✓. Answer = Single, High School, $40K-$60K ✓. Model gave only "High School" (incomplete). Stumped ✓.

#### Full Prompt
What is the second most common type of customer at Bank Churners? Please answer with marital status, education level, and income category (e.g. Divorced, Doctorate, $120K+)

#### Rewrite Answer
Single, High School, $40K-$60K

#### Edits Made (if any)
Skill type corrected: "MCQ" unchecked → "Short answer question" checked.

#### Feedback
4/15: Skill type corrected — question uses free-form text answer format (no A/B/C/D options). Tagged as SAQ.

---

### Annotation 2
- **Shadow Task:** ✅ submitted — [0953008e](shadows/0953008e.md)
- **Rating:** thumbs-up
- **Question:** SAQ — third least common education level and third least common income category
- **Skills Tagged (original):** Enumeration, Spatial Reasoning, Logical Reasoning, Table/Chart/Graph Understanding, Short answer question
- **Skills Tagged (revised):** Enumeration, Spatial Reasoning, Logical Reasoning, Table/Chart/Graph Understanding, Short answer question
- **Question Type:** SAQ
- **Model Generated Answer:** College, $80K - $120K
- **Rewrite Answer:** College, $60K-$80K

#### Two-Part Check
1. **Question Check:**
   - Guidelines violated: none
   - Error types found: none. Ranking is clearly readable from bar charts.
2. **Answer Check:**
   - Math verified: Education from least to most common: Doctorate < Post-Graduate < College < Uneducated < Unknown < High School < Graduate. Third least = College ✓. Income from least to most common: $120K+ < Unknown < $60K-$80K < $80K-$120K < $40K-$60K < Less than $40K. Third least = $60K-$80K ✓. Model got $80K-$120K (one rank off — got 4th least instead of 3rd least). Stumped ✓.

#### Full Prompt
What are the third least common education level and the third least common income category at Bank Churners? Please answer with education level, and income category (e.g., Doctorate, $120K+)

#### Rewrite Answer
College, $60K-$80K

#### Edits Made (if any)
None.

#### Feedback
N/A

---

### Annotation 3
- **Shadow Task:** ✅ submitted — [d2a2768f](shadows/d2a2768f.md)
- **Rating:** thumbs-up
- **Question:** MCQ — after approximately what age is the only marital status remaining Married
- **Skills Tagged (original):** Enumeration, Spatial Reasoning, Logical Reasoning, Table/Chart/Graph Understanding, MCQ
- **Skills Tagged (revised):** Enumeration, Spatial Reasoning, Logical Reasoning, Table/Chart/Graph Understanding, MCQ
- **Question Type:** MCQ
- **Model Generated Answer:** D
- **Rewrite Answer:** C

#### Two-Part Check
1. **Question Check:**
   - Guidelines violated: none
   - Error types found: none. "Approximately" + MCQ handles chart reading precision. CMW passed.
2. **Answer Check:**
   - Math verified: Marital Status by Age line chart — Divorced and Single lines converge to 0 around age 65. After ~65 only Married line remains. C=65 ✓. Model got D=50 (far too early — all statuses present at age 50). Stumped ✓.

#### Full Prompt
After approximately what age is the customer's only marital status Married? Please choose one of the following:

A. 60
B. 62
C. 65
D. 50

#### Rewrite Answer
C

#### Edits Made (if any)
None.

#### Feedback
N/A

---

### Annotation 4
- **Shadow Task:** ✅ submitted — [15e9b5c4](shadows/15e9b5c4.md)
- **Rating:** thumbs-up
- **Question:** MCQ — which of four named values is the highest (Unknown Income, High School Education, $40K-$60K Income, Sum of Attributed Customer)
- **Skills Tagged (original):** Enumeration, Spatial Reasoning, Logical Reasoning, Table/Chart/Graph Understanding, MCQ
- **Skills Tagged (revised):** Enumeration, Spatial Reasoning, Logical Reasoning, Table/Chart/Graph Understanding, MCQ
- **Question Type:** MCQ
- **Model Generated Answer:** (empty — API failure)
- **Rewrite Answer:** B

#### Two-Part Check
1. **Question Check:**
   - Guidelines violated: none
   - Error types found: none. All four options reference specific readable values. "Atributed" in option D matches the image label (not a question error). CMW passed.
2. **Answer Check:**
   - Math verified: Unknown Income ≈ 1K (Income bar chart). High School Education ≈ 2.5K (Education bar chart, second bar). $40K-$60K Income ≈ 2K (Income chart). Sum of Attributed Customer = 1.52K (KPI tile). Highest = High School Education (~2.5K) = B ✓. Model gave empty answer (API error — HTTP 400 on multiple attempts); STUMPED=true because "" ≠ "B". Note: stumping is from API failure, not cognitive failure, but question is valid. Stumped ✓.

#### Full Prompt
Which of the following values is the highest? Please choose one of the following:

A. Unknown Income Category
B. High School Education Level
C. $40K-$60K Income Category
D. Sum of Atributed Customer

#### Rewrite Answer
B

#### Edits Made (if any)
None.

#### Feedback
N/A

---

## Task Status
- **Status:** QC_Complete
- **Reason:** A1–A4 all thumbs-up — all stumped. A1 skill type corrected (MCQ→SAQ). A4 note: model failed via API error; question is valid.
- **SA Applied (Cycle 1):** ✅ (legacy backfill 2026-04-18)

---

## Form-Fill Payload
Canonical payload for host jobs 2 (SA apply-review) and 3 (HAI shadow task). Host parses this section verbatim — do not reinterpret. Dumb executor.

```yaml
sa_task_filename: "Report_Dashboard_Churn_Dashboard_154.json"
sa_internal_task_id: "187110240"
sa_status_proposed: QC_Complete   # host STOPS before setting; human confirms

annotations:
  - n: 1
    sa:
      rating: approve
      skills_check:   ["Short answer question"]
      skills_uncheck: ["MCQ"]
      prompt_edits: null
      answer_final: "Single, High School, $40K-$60K"
      feedback: "4/15: Skill type corrected — question uses free-form text answer format (no A/B/C/D options). Updated from MCQ to Short answer question."
    hai:
      task_id_field: "Report_Dashboard_Churn_Dashboard_154.json"
      role: Reviewing
      annotation_n: 1
      prompt: "What is the second most common type of customer at Bank Churners? Please answer with marital status, education level, and income category (e.g. Divorced, Doctorate, $120K+)\n "
      image_ref: "screenshots/Report_Dashboard_Churn_Dashboard_154.png"
      answer: "Single, High School, $40K-$60K"
  - n: 2
    sa:
      rating: approve
      skills_check:   []
      skills_uncheck: []
      prompt_edits: null
      answer_final: "College, $60K-$80K"
      feedback: null
    hai:
      task_id_field: "Report_Dashboard_Churn_Dashboard_154.json"
      role: Reviewing
      annotation_n: 2
      prompt: "What are the third least common education level and the third least common income category at Bank Churners? Please answer with education level, and income category (e.g., Doctorate, $120K+)"
      image_ref: "screenshots/Report_Dashboard_Churn_Dashboard_154.png"
      answer: "College, $60K-$80K"
  - n: 3
    sa:
      rating: approve
      skills_check:   []
      skills_uncheck: []
      prompt_edits: null
      answer_final: "C"
      feedback: null
    hai:
      task_id_field: "Report_Dashboard_Churn_Dashboard_154.json"
      role: Reviewing
      annotation_n: 3
      prompt: "After approximately what age is the customer's only marital status Married? Please choose one of the following:\n\nA. 60\nB. 62\nC. 65\nD. 50"
      image_ref: "screenshots/Report_Dashboard_Churn_Dashboard_154.png"
      answer: "C"
  - n: 4
    sa:
      rating: approve
      skills_check:   []
      skills_uncheck: []
      prompt_edits: null
      answer_final: "B"
      feedback: null
    hai:
      task_id_field: "Report_Dashboard_Churn_Dashboard_154.json"
      role: Reviewing
      annotation_n: 4
      prompt: "Which of the following values is the highest? Please choose one of the following:\n\nA. Unknown Income Category\nB. High School Education Level\nC. $40K-$60K Income Category\nD. Sum of Atributed Customer"
      image_ref: "screenshots/Report_Dashboard_Churn_Dashboard_154.png"
      answer: "B"
```

**Host contract:**
- Job 2 (SA apply-review) → parse `annotations[].sa`. STOP before `sa_status_proposed`.
- Job 3 (HAI shadow) → one shadow task per `annotations[].hai` entry. STOP before Submit + Confirm time.
- Image upload = `upload_file` MCP tool. All other fields = `form_input` / checkbox toggles.
