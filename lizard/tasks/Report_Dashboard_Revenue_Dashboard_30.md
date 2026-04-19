# Review: Report_Dashboard_Revenue_Dashboard_30.json

## Task Info
- **SA Task Filename:** `Report_Dashboard_Revenue_Dashboard_30.json`
- **SA Internal Task ID:** 186802940
- **Image:** `screenshots/Report_Dashboard_Revenue_Dashboard_30.png` — Retail Analytics dashboard (xeomatrix): KPI row, Sales by State bubble map, Profit vs Sales scatter, Sales by Region bar chart, Top 10 Products by Revenue table, Profit Ratio by Region table
- **Date:** 2026-04-14
- **Review Cycle:** 1st

## Annotations

### Annotation 1
- **Shadow Task:** ✅ submitted — [93b0ccf2](shadows/93b0ccf2.md)
- **Rating:** thumbs-up
- **Question:** Which Eastern State has the largest grey circle in the Sales by State graph? (MCQ: A=Ohio B=Florida C=New York D=California)
- **Skills Tagged (original):** Attribute Perception, Spatial Reasoning, Table/Chart/Graph Understanding, World Knowledge
- **Skills Tagged (corrected):** Attribute Perception, Table/Chart/Graph Understanding, World Knowledge
- **Question Type:** MCQ
- **Model Generated Answer:** A
- **Rewrite Answer:** C

#### Two-Part Check
1. **Question Check:**
   - Guidelines violated: none
   - Error types found: none.
2. **Answer Check:**
   - Math verified: N/A (MCQ). Correct answer is C (New York). ✓
   - Model-stump: MODEL=A ≠ ANSWER=C ✓

#### Full Prompt
Which of the following Eastern States has the largest grey circle in the Sales by State map?
A. Ohio
B. Florida
C. New York
D. California

#### Rewrite Answer
C

#### Edits Made
Removed Spatial Reasoning tag — circle size comparison is Attribute Perception, not spatial reasoning.

#### Feedback
4/14: Removed Spatial Reasoning tag — circle size comparison is Attribute Perception, not spatial reasoning.

---

### Annotation 2
- **Shadow Task:** ✅ submitted — [c8f77dff](shadows/c8f77dff.md)
- **Rating:** thumbs-up
- **Question:** Sum of all numbers with green font in the Top 10 Products by Revenue table
- **Skills Tagged:** Attribute Perception, Math Reasoning, Table/Chart/Graph Understanding
- **Question Type:** SAQ
- **Model Generated Answer:** 5400
- **Rewrite Answer:** 107893

#### Two-Part Check
1. **Question Check:**
   - Guidelines violated: none
   - Error types found: none. "Green font" is an observable visual property; format spec present ("whole number without commas"). G1: Attribute Perception + Math Reasoning + TCG Understanding = 3 skills. PASS.
2. **Answer Check:**
   - Math verified: CANNOT VERIFY — screenshot resolution insufficient for table values. Annotator answer 107893 is internally consistent as a subset sum. Model's 5400 is wildly different — confirms task is non-trivial.
   - Model-stump: MODEL=5400 ≠ ANSWER=107893 ✓

#### Full Prompt
In the 'Top 10 Products by Revenue' table, what is the sum of all the numbers that are displayed in green font? Answer with a whole number without commas (e.g., 12345).

#### Rewrite Answer
107893

#### Edits Made
None.

#### Feedback
N/A

---

### Annotation 3
- **Shadow Task:** ✅ submitted — [f8c7bf08](shadows/f8c7bf08.md)
- **Rating:** thumbs-up
- **Question:** Approximate Profit Margin for the Central region? (MCQ: A=5% B=10% C=15% D=20%)
- **Skills Tagged (original):** Spatial Reasoning, Table/Chart/Graph Understanding
- **Skills Tagged (corrected):** Attribute Perception, Table/Chart/Graph Understanding
- **Question Type:** MCQ
- **Model Generated Answer:** A
- **Rewrite Answer:** B

#### Two-Part Check
1. **Question Check:**
   - Guidelines violated: none in structure
   - Error types found: none in prompt. MCQ format is clean.
   - Spatial Reasoning incorrectly tagged — reading a bar value is TCG Understanding + Attribute Perception; no spatial reasoning.
2. **Answer Check:**
   - Math verified: yes — full-res review confirms the Central region's Profit Margin is closer to 10% than 5%, so B is correct. ✓
   - Model-stump: MODEL=A ≠ ANSWER=B ✓

#### Full Prompt
Using the 'Profit Margin' bars in the 'Sales by Region' chart, what is the approximate profit margin for the 'Central' region?
A. 5%
B. 10%
C. 15%
D. 20%

#### Rewrite Answer
B

#### Edits Made
Removed Spatial Reasoning; added Attribute Perception — reading a bar value is TCG Understanding + Attribute Perception.

#### Feedback
4/14: Removed Spatial Reasoning tag; added Attribute Perception — reading a bar chart value is Table/Chart/Graph Understanding + Attribute Perception, not spatial reasoning.

---

### Annotation 4
- **Shadow Task:** ✅ submitted — [e521a0ab](shadows/e521a0ab.md)
- **Rating:** thumbs-up
- **Question:** Mean of all numerical values in the second row of the image
- **Skills Tagged (original):** Spatial Reasoning, Math Reasoning
- **Skills Tagged (corrected):** Math Reasoning, Table/Chart/Graph Understanding
- **Question Type:** SAQ
- **Model Generated Answer:** 2584.5
- **Rewrite Answer:** 380271.8

#### Two-Part Check
1. **Question Check:**
   - Guidelines violated: none
   - Error types found: none. Full-res review supports that the dashboard has a clear top row and a clear second row, making the intended KPI row identifiable.
2. **Answer Check:**
   - Math verified: (1,985,577 + 257,911 + 32,961 + 13.0 + 4,376 + 793) / 6 = 2,281,631 / 6 = **380,271.8** ✓
   - Model-stump: MODEL=2584.5 ≠ ANSWER=380271.8 ✓

#### Full Prompt
Calculate the mean of all the numerical values present in the second row of the image. Treat percentage values as their numerical values (e.g., 13% = 13). Round to one decimal place. Answer with a single number (e.g., 1234.5).

#### Rewrite Answer
380271.8

#### Edits Made
Removed Spatial Reasoning; added Table/Chart/Graph Understanding — reading KPI row values is TCG Understanding + Math Reasoning.

#### Feedback
4/14: Removed Spatial Reasoning tag; added Table/Chart/Graph Understanding — reading a row of dashboard values is Table/Chart/Graph Understanding + Math Reasoning, not spatial reasoning.

---

## Task Status
- **Status:** QC_Complete
- **Reason:** All 4 annotations are accepted. Answers verified under the agreed full-resolution interpretation.
- **SA Applied (Cycle 1):** ✅ (legacy backfill 2026-04-18)

---

## Form-Fill Payload
Canonical payload for host jobs 2 (SA apply-review) and 3 (HAI shadow task). Host parses this section verbatim — do not reinterpret. Dumb executor.

```yaml
sa_task_filename: "Report_Dashboard_Revenue_Dashboard_30.json"
sa_internal_task_id: "186802940"
sa_status_proposed: QC_Complete   # host STOPS before setting; human confirms

annotations:
  - n: 1
    sa:
      rating: thumbs_up
      skills_check:   []
      skills_uncheck: ["Spatial Reasoning"]
      prompt_edits: null
      answer_final: null
      feedback: "4/14: Removed Spatial Reasoning tag — circle size comparison is Attribute Perception, not spatial reasoning."
    hai:
      task_id_field: "Report_Dashboard_Revenue_Dashboard_30.json"
      role: Reviewing
      annotation_n: 1
      prompt: "Which of the following Eastern States has the largest grey circle in the Sales by State map?\nA. Ohio\nB. Florida\nC. New York\nD. California"
      image_ref: "screenshots/Report_Dashboard_Revenue_Dashboard_30.png"
      answer: "C"

  - n: 2
    sa:
      rating: thumbs_up
      skills_check:   []
      skills_uncheck: []
      prompt_edits: null
      answer_final: null
      feedback: null
    hai:
      task_id_field: "Report_Dashboard_Revenue_Dashboard_30.json"
      role: Reviewing
      annotation_n: 2
      prompt: "In the 'Top 10 Products by Revenue' table, what is the sum of all the numbers that are displayed in green font? Answer with a whole number without commas (e.g., 12345)."
      image_ref: "screenshots/Report_Dashboard_Revenue_Dashboard_30.png"
      answer: "107893"

  - n: 3
    sa:
      rating: thumbs_up
      skills_check:   ["Attribute Perception"]
      skills_uncheck: ["Spatial Reasoning"]
      prompt_edits: null
      answer_final: null
      feedback: "4/14: Removed Spatial Reasoning tag; added Attribute Perception — reading a bar chart value is Table/Chart/Graph Understanding + Attribute Perception, not spatial reasoning."
    hai:
      task_id_field: "Report_Dashboard_Revenue_Dashboard_30.json"
      role: Reviewing
      annotation_n: 3
      prompt: "Using the 'Profit Margin' bars in the 'Sales by Region' chart, what is the approximate profit margin for the 'Central' region?\nA. 5%\nB. 10%\nC. 15%\nD. 20%"
      image_ref: "screenshots/Report_Dashboard_Revenue_Dashboard_30.png"
      answer: "B"

  - n: 4
    sa:
      rating: thumbs_up
      skills_check:   ["Table/Chart/Graph Understanding"]
      skills_uncheck: ["Spatial Reasoning"]
      prompt_edits: null
      answer_final: null
      feedback: "4/14: Removed Spatial Reasoning tag; added Table/Chart/Graph Understanding — reading a row of dashboard values is Table/Chart/Graph Understanding + Math Reasoning, not spatial reasoning."
    hai:
      task_id_field: "Report_Dashboard_Revenue_Dashboard_30.json"
      role: Reviewing
      annotation_n: 4
      prompt: "Calculate the mean of all the numerical values present in the second row of the image. Treat percentage values as their numerical values (e.g., 13% = 13). Round to one decimal place. Answer with a single number (e.g., 1234.5)."
      image_ref: "screenshots/Report_Dashboard_Revenue_Dashboard_30.png"
      answer: "380271.8"
```

**Host contract:**
- Job 2 (SA apply-review) → parse `annotations[].sa`. STOP before `sa_status_proposed`.
- Job 3 (HAI shadow) → one shadow task per `annotations[].hai` entry. STOP before Submit + Confirm time.
- Image upload = manual (native picker). All other fields = `form_input` / checkbox toggles.
