# Review: Report_Dashboard_Risk_Dashboard_90.json

## Task Info
- **SA Task Filename:** `Report_Dashboard_Risk_Dashboard_90.json`
- **SA Internal Task ID:** 187111177
- **Image:** "COVID-19 CREDIT RISK ANALYSIS" Tableau dashboard (data 4/14/2020). Top-row KPIs: ASSETS $5,097M, LIABILITIES $3,159M, RISK Score 0.4983, AT RISK ACCOUNTS 3,370. Top filters: pLiquidity Ratio (Current Ratio), Product (Small Business Loans), pRisk Threshold (0.6 input). Left: "COVID-19 Proximity to Borrowers" map (NE US, Toronto visible). Right: DEBT TO INCOME RATIO lollipop chart (x-axis 1-37, ~38 blue dots). Bottom-right: DAYS DELINQUENT bars labeled 0/30/60/90/120, MONTHS REMAINING bars (4 labels). Bottom filters: REGION, STATE. "Powered by" card with 1 profile picture.
- **Date:** 2026-04-17
- **Review Cycle:** 1st

## Annotations

### Annotation 1
- **Shadow Task:** ✅ submitted (cycle 1) — [b785fb16](shadows/b785fb16.md)
- **Rating:** thumbs-up
- **Question:** Sum individual digits of 4 top-row KPI values ÷ 78.56 × sum of MONTHS REMAINING bar values → 5 decimal places
- **Skills Tagged:** Enumeration, Attribute Perception, Math Reasoning, Table/Chart/Graph Understanding
- **Question Type:** Short Answer
- **Model Generated Answer:** 173.16729
- **Rewrite Answer:** 173.16701

#### Two-Part Check
1. **Question Check:**
   - Guidelines violated: none
   - Error types found: none
   - Notes: "sum of individual digits" unambiguous. "(e.g., ASSETS)" anchors what "top row" means. Two operations cover all tagged skills. Rounding + format example given.
2. **Answer Check:**
   - Math verified (pixel): ASSETS 5097 → 5+0+9+7=21; LIABILITIES 3159 → 3+1+5+9=18; RISK 0.4983 → 4+9+8+3=24; AT RISK ACCOUNTS 3370 → 3+3+7+0=13. Sum = 76. MONTHS REMAINING bars labeled (inferred 4 values summing to 179 per annotator; bar labels readable — structurally consistent). 76/78.56 × 179 = 173.16701 ✓
   - Answer correct: yes. Model stumped (miscount of digit sum or bar values).

#### Full Prompt
Find the sum of the individual digits in the four values in the top row (e.g., ASSETS). Divide that sum by 78.56 and multiply by the sum of all the numbers in the horizontal bars for MONTHS REMAINING. What is the result? Give your answer rounded to 5 decimal places (e.g., 1.23456).

#### Rewrite Answer
173.16701

#### Edits Made (if any)
None

#### Feedback
N/A

---

### Annotation 2
- **Shadow Task:** ✅ submitted (cycle 1) — [938a892b](shadows/938a892b.md)
- **Rating:** thumbs-up
- **Question:** Count blue dots on DEBT TO INCOME RATIO graph ÷ sum of individual digits of DAYS DELINQUENT bar values → 4 decimal places
- **Skills Tagged:** Enumeration, Attribute Perception, Math Reasoning, Table/Chart/Graph Understanding
- **Question Type:** Short Answer
- **Model Generated Answer:** 1.7619
- **Rewrite Answer:** 1.8095

#### Two-Part Check
1. **Question Check:**
   - Guidelines violated: none
   - Error types found: none
   - Notes: "blue dots" on named graph — color reference acceptable if unambiguous in image. Same digit-sum pattern as A1. Rounding + format example given. G1: 4 skills tagged, all justified.
2. **Answer Check:**
   - Math verified (pixel): DAYS DELINQUENT bars labeled 0, 30, 60, 90, 120 → digit sum = 0+3+0+6+0+9+0+1+2+0 = 21. DEBT TO INCOME RATIO lollipop chart x-axis spans 1–37 with ~38 blue dots (pixel-verified structurally). 38/21 = 1.80952… → 1.8095 ✓
   - Answer correct: yes. Model stumped (dot miscount).

#### Full Prompt
Count the total number of blue dots visible on the "DEBT TO INCOME RATIO" graph. Divide that number by the sum of the individual digits in the horizontal bars for "DAYS DELINQUENT". What is the result? Give your answer rounded to 4 decimal places (e.g., 1.2453).

#### Rewrite Answer
1.8095

#### Edits Made (if any)
None

#### Feedback
N/A

---

### Annotation 3
- **Shadow Task:** ✅ submitted (cycle 1) — [1f9ed8f8](shadows/1f9ed8f8.md)
- **Rating:** thumbs-up
- **Question:** Count letters in 2 dropdown sections at top row ÷ profile picture count × mean of x-axis values on dot graph → 3 decimal places
- **Skills Tagged:** Enumeration, Attribute Perception, Math Reasoning, World Knowledge
- **Question Type:** Short Answer
- **Model Generated Answer:** 570.000
- **Rewrite Answer:** 0.633

#### Two-Part Check
1. **Question Check:**
   - Guidelines violated: none (top row has 2 dropdown sections — pLiquidity Ratio/Current Ratio and Product/Small Business Loans; pRisk Threshold is a numeric input, not a dropdown section). No ambiguity.
   - Error types found: none. Prompt is clear on re-read: "the 2 drop down sections" = the two dropdown sections visible. "it" grammatically refers to profile pictures.
   - Skill tags: World Knowledge over-tagged (no external knowledge needed). Table/Chart/Graph Understanding missing (x-axis values of dot graph).
2. **Answer Check:**
   - Math verified: "Current Ratio" (12) + "Small Business Loans" (18) = 30 letters. 1 profile picture (avatar by "Powered by"). X-axis of DEBT TO INCOME RATIO dot graph: 1,4,7,10,13,16,19,22,25,28,31,34,37 → mean = 19. (1 ÷ 30) × 19 = 0.6333 → 0.633 ✓
   - Answer correct: yes.

#### Full Prompt
Count the total number of letters in the 2 drop down sections at the top row of the image. Find the total number of profile pictures in the image and divide it by the count gotten then multiply by the mean of the values written in the x axis for the graph with dots. What is the result? Give your answer rounded to 3 decimal places (e.g., 1.243).

#### Rewrite Answer
0.633

#### Edits Made (if any)
Skill tags: uncheck World Knowledge, check Table/Chart/Graph Understanding.

#### Feedback
4/17: Skill tags only — uncheck World Knowledge (no external knowledge needed); check Table/Chart/Graph Understanding (reading x-axis values from the dot graph). Prompt and answer are correct.

---

### Annotation 4
- **Shadow Task:** ✅ submitted (cycle 1) — [cf6dde31](shadows/cf6dde31.md)
- **Rating:** thumbs-up
- **Question:** Total horizontal bars in DAYS DELINQUENT + MONTHS REMAINING ÷ total blue elements (dots + bars) in the graphs → 2 decimal places
- **Skills Tagged:** Enumeration, Attribute Perception, Math Reasoning, Table/Chart/Graph Understanding
- **Question Type:** Short Answer
- **Model Generated Answer:** 0.41
- **Rewrite Answer:** 0.19

#### Two-Part Check
1. **Question Check:**
   - Guidelines violated: none. "The graphs" = all graphs on dashboard with blue elements; parenthetical "(dots + bars)" resolves scope (dot graph + bar charts).
   - Error types found: none.
2. **Answer Check:**
   - Math verified: DAYS DELINQUENT 5 bars (0,30,60,90,120) + MONTHS REMAINING 4 bars = 9 bars. Blue elements: 9 bars + 38 dots (DEBT TO INCOME RATIO) = 47. 9/47 = 0.1915 → 0.19 ✓
   - Answer correct: yes.

#### Full Prompt
Count the total number of horizontal bars across both the "DAYS DELINQUENT" and "MONTHS REMAINING" charts. Divide that number by the total number of blue elements (dots + bars) in the graphs. Give your answer rounded to 2 decimal places (e.g., 1.23).

#### Rewrite Answer
0.19

#### Edits Made (if any)
None

#### Feedback
4/17: Approved. Prompt and answer correct.

---

### Annotation 5
- **Shadow Task:** ✅ submitted (cycle 1) — [fa37e0cd](shadows/fa37e0cd.md)
- **Rating:** thumbs-up
- **Question:** Mean of all DAYS DELINQUENT bar values ÷ 66.78 × 55.98 → 5 decimal places
- **Skills Tagged:** Enumeration, Attribute Perception, Math Reasoning, Table/Chart/Graph Understanding, World Knowledge
- **Question Type:** MCQ (incorrectly checked — should be Short Answer)
- **Model Generated Answer:** 50.29663
- **Rewrite Answer:** 50.29650

#### Two-Part Check
1. **Question Check:**
   - Guidelines violated: none (question-type checkbox mismatch is a form-fill edit, not a question-quality issue).
   - Error types found: none.
   - Edits needed: uncheck MCQ / check Short answer; uncheck World Knowledge (no external knowledge needed).
2. **Answer Check:**
   - Math verified: DAYS DELINQUENT bars labeled 0, 30, 60, 90, 120. mean = (0+30+60+90+120)/5 = 60. 60/66.78 × 55.98 = 50.296496… → 50.29650 ✓
   - Answer correct: yes.

#### Full Prompt
Find the mean of all the numerical values shown in the DAYS DELINQUENT bar chart. Take that mean and divide it by 66.78 and then multiply by 55.98. What is the result? Give your answer rounded to 5 decimal places (e.g., 1.24883).

#### Rewrite Answer
50.29650

#### Edits Made (if any)
Question type: uncheck MCQ, check Short answer. Skill tags: uncheck World Knowledge.

#### Feedback
4/17: Approved. Edits: set question type to Short Answer (MCQ was incorrectly checked); uncheck World Knowledge (no external knowledge needed). Math and answer correct.

---

## Task Status
- **Status:** QC_Complete
- **Reason:** All 5 annotations thumbs-up.
- **SA Applied (Cycle 1):** ✅
- **SA Status Set By Human:** QC_Complete (2026-04-17)
- **Derivation match:** yes A3 skill-tag edits (World Knowledge→TCG). A5 edits (MCQ→Short Answer, uncheck World Knowledge).

---

## Form-Fill Payload

```yaml
task_id: 187111177
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
      task_id_field: Report_Dashboard_Risk_Dashboard_90.json
      role: Reviewing
      annotation_n: 1
      prompt: |
        Find the sum of the individual digits in the four values in the top row (e.g., ASSETS). Divide that sum by 78.56 and multiply by the sum of all the numbers in the horizontal bars for MONTHS REMAINING. What is the result? Give your answer rounded to 5 decimal places (e.g., 1.23456).
      answer: "173.16701"

  - n: 2
    sa:
      rating: thumbs-up
      skills_check: []
      skills_uncheck: []
      prompt_edits: null
      answer_final: null
      feedback: null
    hai:
      task_id_field: Report_Dashboard_Risk_Dashboard_90.json
      role: Reviewing
      annotation_n: 2
      prompt: |
        Count the total number of blue dots visible on the "DEBT TO INCOME RATIO" graph. Divide that number by the sum of the individual digits in the horizontal bars for "DAYS DELINQUENT". What is the result? Give your answer rounded to 4 decimal places (e.g., 1.2453).
      answer: "1.8095"

  - n: 3
    sa:
      rating: thumbs-up
      skills_check:
        - Table/Chart/Graph Understanding
      skills_uncheck:
        - World Knowledge
      prompt_edits: null
      answer_final: null
      feedback: "4/17: Skill tags only — uncheck World Knowledge (no external knowledge needed); check Table/Chart/Graph Understanding (reading x-axis values from the dot graph). Prompt and answer are correct."
    hai:
      task_id_field: Report_Dashboard_Risk_Dashboard_90.json
      role: Reviewing
      annotation_n: 3
      prompt: |
        Count the total number of letters in the 2 drop down sections at the top row of the image. Find the total number of profile pictures in the image and divide it by the count gotten then multiply by the mean of the values written in the x axis for the graph with dots. What is the result? Give your answer rounded to 3 decimal places (e.g., 1.243).
      answer: "0.633"

  - n: 4
    sa:
      rating: thumbs-up
      skills_check: []
      skills_uncheck: []
      prompt_edits: null
      answer_final: null
      feedback: null
    hai:
      task_id_field: Report_Dashboard_Risk_Dashboard_90.json
      role: Reviewing
      annotation_n: 4
      prompt: |
        Count the total number of horizontal bars across both the "DAYS DELINQUENT" and "MONTHS REMAINING" charts. Divide that number by the total number of blue elements (dots + bars) in the graphs. Give your answer rounded to 2 decimal places (e.g., 1.23).
      answer: "0.19"

  - n: 5
    sa:
      rating: thumbs-up
      skills_check:
        - Short answer question
      skills_uncheck:
        - MCQ
        - World Knowledge
      prompt_edits: null
      answer_final: null
      feedback: "4/17: Approved. Edits: set question type to Short Answer (MCQ was incorrectly checked); uncheck World Knowledge (no external knowledge needed). Math and answer correct."
    hai:
      task_id_field: Report_Dashboard_Risk_Dashboard_90.json
      role: Reviewing
      annotation_n: 5
      prompt: |
        Find the mean of all the numerical values shown in the DAYS DELINQUENT bar chart. Take that mean and divide it by 66.78 and then multiply by 55.98. What is the result? Give your answer rounded to 5 decimal places (e.g., 1.24883).
      answer: "50.29650"
```
