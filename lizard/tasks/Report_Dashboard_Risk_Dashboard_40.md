# Review: Report_Dashboard_Risk_Dashboard_40

## Task Info
- **SuperAnnotate Task ID:** Report_Dashboard_Risk_Dashboard_40.json
- **Image:** Current Student Data dashboard (Active Students Only) — student risk metrics, GPA distribution, NWEA %ile bars, Daily Attendance bars, student table with 5 rows (409 total students)
- **Date:** 2026-04-17
- **Review Cycle:** 1st
- **Annotator:** Brandon Davis (bradavis2011@gmail.com)
- **Status log:** InProgress → Submit_to_QC (Apr 17, 01:21:30)

## Wiki Scan
- Spatial Reasoning over-tagging: none tagged on any annotation — correct.
- A5 skill tags empty: fix needed.
- A4 missing Enumeration: add.

---

## Annotations

### Annotation 1
- **Shadow Task:** ✅ submitted (cycle 1) — [b8faf95d](shadows/b8faf95d.md)
- **Rating:** thumbs-up
- **Question:** Count dropdown controls in filter panel × count large KPI cards + 3 legend categories.
- **Skills Tagged:** Enumeration, Attribute Perception, Math Reasoning, Logical Reasoning
- **Question Type:** Short answer question
- **Model Answer Rating:** thumbs-down (model: 80, correct: 87)

#### Two-Part Check
1. **Question Check:**
   - Guidelines violated: none
   - Error types found: none
   - G1: Enumeration + Attribute Perception + Math Reasoning = 3 skills ✓
   - G2: deterministic arithmetic, format specified ✓
   - G5: specifies location but does not give away counts ✓
   - Type 7 check: "dropdown filter controls" — Group By section uses radio buttons (visually distinct in image), not dropdowns. 12 dropdown controls unambiguous. ✓

2. **Answer Check:**
   - Math verified: yes
   - Dropdown controls: School, Reporting Term, NWEA Test Term, Grade Level, Special Program, Student Name, Sort By (row 1 = 7); Final Grade, Ethnicity, Home Room, ELL, Sorting Order (row 2 = 5); total = 12. Group By = radio buttons, excluded.
   - KPI cards: 8%, 28%, 23%, 20%, 39%, 0%, 4% = 7
   - Legend: On Track, Off Track, Red Flag = 3
   - 12 × 7 + 3 = 87 ✓
   - Answer correct: yes

#### Full Prompt
Count the total number of dropdown filter controls visible in the filter panel at the top of the dashboard. Then count the total number of large percentage KPI cards displayed below the filter panel. Multiply these two counts together and add the number of distinct status categories shown in the legend in the upper right (On Track, Off Track, Red Flag). Answer as a single whole number (e.g., 75).

#### Rewrite Answer
87

#### Edits Made
None

#### Feedback
N/A

---

### Annotation 2
- **Shadow Task:** ✅ submitted (cycle 1) — [514522c0](shadows/514522c0.md)
- **Rating:** thumbs-up
- **Question:** Population std dev of 4 numeric GPAs × absolute diff between highest/lowest Daily Attendance panel bar percentages.
- **Skills Tagged:** Attribute Perception, Math Reasoning, Logical Reasoning, Table/Chart/Graph Understanding
- **Question Type:** Short answer question
- **Model Answer Rating:** thumbs-down (model: 10.4054, correct: 14.4669)

#### Two-Part Check
1. **Question Check:**
   - Guidelines violated: none
   - Error types found: none
   - G1: 4 skills ✓
   - G2: "four decimal places" specified ✓; "four visible students who have a numeric GPA (skip N/A)" unambiguous — exactly 4 of 5 students have numeric GPAs ✓
   - "Daily Attendance panel bars" = the horizontal bar chart in Daily Attendance KPI panel (distinct from student table column) ✓

2. **Answer Check:**
   - Math verified: yes
   - GPAs (4 numeric): Jade=1.4444, Christopher=3.5000, Cordarious=3.1667, Abigail=3.8617
   - Mean = 2.9932; Var = 0.8597; Std = 0.92737
   - Daily Attendance panel bars: >95%=38.4%, 90-95%=23.0%, <90%=38.6% → diff = 38.6 - 23.0 = 15.6
   - 0.92737 × 15.6 = 14.4669 ✓
   - Model used student table attendance column (diff=11.22) → 10.4054. Stumped ✓
   - Answer correct: yes

#### Full Prompt
Calculate the population standard deviation of the Current GPA values for the four visible students who have a numeric GPA (skip N/A). Then multiply by the absolute difference between the highest and lowest Daily Attendance percentages shown in the Daily Attendance panel bars. Round to four decimal places (e.g., 10.0000).

#### Rewrite Answer
14.4669

#### Edits Made
None

#### Feedback
N/A

---

### Annotation 3
- **Shadow Task:** ✅ submitted (cycle 1) — [a820864c](shadows/a820864c.md)
- **Rating:** thumbs-up
- **Question:** Harmonic mean of three rounded student counts from three KPI percentages × 409 total students.
- **Skills Tagged:** Attribute Perception, Math Reasoning, Table/Chart/Graph Understanding
- **Question Type:** Short answer question
- **Model Answer Rating:** thumbs-down (model: 95.16, correct: 95.15)

#### Two-Part Check
1. **Question Check:**
   - Guidelines violated: none
   - Error types found: none
   - G1: 3 skills ✓
   - G2: rounding rules explicit for both intermediate (nearest whole) and final (two decimal places) ✓; formula given explicitly ✓
   - Prompt bakes in percentages and total — no misread risk ✓

2. **Answer Check:**
   - Math verified: yes
   - v1 = round(409×0.28) = round(114.52) = 115
   - v2 = round(409×0.23) = round(94.07) = 94
   - v3 = round(409×0.20) = round(81.80) = 82
   - HM = 3 / (1/115 + 1/94 + 1/82) = 3 / 0.031529 = 95.1503 → 95.15 ✓
   - Model likely rounded intermediates differently → 95.16. Stumped ✓
   - Answer correct: yes

#### Full Prompt
Using the total of 409 students, calculate the implied student count for each of these three KPI percentages: Students below 2.6 Current GPA (28%), Students below 15th Percentile in NWEA Mathematics (23%), Students below 15th Percentile in NWEA Reading (20%). Round each count to the nearest whole number. Then calculate the harmonic mean of those three rounded counts using the formula 3 / (1/v1 + 1/v2 + 1/v3). Round to two decimal places (e.g., 100.00).

#### Rewrite Answer
95.15

#### Edits Made
None

#### Feedback
N/A

---

### Annotation 4
- **Shadow Task:** ✅ submitted (cycle 1) — [71a2f2bd](shadows/71a2f2bd.md)
- **Rating:** thumbs-up
- **Question:** Cube root of total student count × (red KPI count / green KPI count).
- **Skills Tagged:** Attribute Perception, Math Reasoning, Table/Chart/Graph Understanding
- **Question Type:** Short answer question
- **Model Answer Rating:** thumbs-down (model: 9.8907, correct: 9.8972)

#### Two-Part Check
1. **Question Check:**
   - Guidelines violated: none
   - Error types found: none
   - G1: question requires counting red/green cards (Enumeration) + identifying card colors (Attribute Perception) + cube root/division (Math Reasoning) + reading total from dashboard (TCG) — Enumeration missing from tags.
   - G2: deterministic, rounding specified ✓
   - G3: all values visible ✓

2. **Answer Check:**
   - Math verified: yes
   - Total = 409
   - ∛409 = 7.42291
   - Red KPIs (percent color red): 28%, 23%, 20%, 39% = 4 cards
   - Green KPIs: 8%, 0%, 4% = 3 cards
   - 7.42291 × (4/3) = 9.89722 → 9.8972 (4 dp)
   - Annotator wrote 9.8973 — off by 0.0001 in last digit; corrected to 9.8972.
   - Model got 9.8907 — likely wrong card color count. Stumped ✓ (regardless of 9.8972 vs 9.8973)
   - Answer corrected: 9.8973 → 9.8972

#### Full Prompt
Calculate the cube root of the total student count shown on the dashboard. Then count the number of large KPI percentage cards displayed in red and the number displayed in green. Divide the red count by the green count. Multiply the cube root by this ratio. Round to four decimal places (e.g., 10.0000).

#### Rewrite Answer
9.8972

#### Edits Made
Add Enumeration skill tag — question requires counting KPI cards by color. Answer corrected 9.8973 → 9.8972.

#### Feedback
4/17: Added Enumeration skill tag — question requires counting red and green KPI cards by color. Answer corrected from 9.8973 to 9.8972 (∛409 = 7.42291, × 4/3 = 9.89722, rounds to 9.8972 at 4 decimal places).

---

### Annotation 5
- **Shadow Task:** ✅ submitted (cycle 1) — [fc1fff8c](shadows/fc1fff8c.md)
- **Rating:** thumbs-up
- **Question:** Population std dev of 5 students' NWEA Reading %ile × sum of 4 red KPI percentages.
- **Skills Tagged:** (none — all missing)
- **Question Type:** Short answer question
- **Model Answer Rating:** thumbs-down (model: 1959.10, correct: 1958.62)

#### Two-Part Check
1. **Question Check:**
   - Guidelines violated: none (content sound)
   - Error types found: none
   - G1: question requires Enumeration (identify/sum 4 red KPIs), Attribute Perception (read table %ile values and KPI panel colors), Math Reasoning (std dev + multiplication), Table/Chart/Graph Understanding (read student table). 4 skills — meets G1 when properly tagged.
   - G2: "two decimal places" ✓; "five visible students" = all 5 rows ✓; "four large KPI percentages displayed in red" = 28+23+20+39 = 4 ✓
   - G3: all values visible ✓
   - Tags: all missing — edit needed.

2. **Answer Check:**
   - Math verified: yes (approximately)
   - NWEA Reading %ile: Jade=48, Aaleah=26, Christopher=74, Cordarious=41, Abigail=69
   - Mean = 258/5 = 51.6
   - Var = [(48-51.6)²+(26-51.6)²+(74-51.6)²+(41-51.6)²+(69-51.6)²]/5 = [12.96+655.36+501.76+112.36+302.76]/5 = 317.04
   - Std = √317.04 ≈ 17.8056
   - Red KPI sum = 28+23+20+39 = 110
   - Result = 17.80562 × 110 = 1958.62 ✓ (annotator's 1958.65 was off by 0.03 — corrected)
   - Model got 1959.10 (stumped ✓)
   - Answer correct: yes

#### Full Prompt
Calculate the population standard deviation of the five visible students' NWEA Reading %ile values. Then sum the four large KPI percentages displayed in red on the dashboard. Multiply the standard deviation by that sum. Round to two decimal places (e.g., 1000.00).

#### Rewrite Answer
1958.62

#### Edits Made
Add skill tags: Enumeration, Attribute Perception, Math Reasoning, Table/Chart/Graph Understanding.

#### Feedback
4/17: Added skill tags — question was missing all ontology. Requires Enumeration (sum four red KPI percentages), Attribute Perception (read student table %ile values and identify red KPI colors), Math Reasoning (population std dev + multiplication), Table/Chart/Graph Understanding (read student table and KPI panel values).

---

## Task Status
- **Status:** QC_Complete
- **Reason:** All 5 thumbs-up.
- **SA Applied (Cycle 1):** ✅
- **SA Status Set By Human:** QC_Complete (2026-04-17)
- **Derivation match:** yes Reviewer edits (A4 Enumeration tag added + 9.8973→9.8972 rounding; A5 full ontology added + 1958.65→1958.62) are within "fix small stuff yourself" scope per workflow-lessons. No prompt-quality failures → approve.

---

## Form-Fill Payload

```yaml
task_id: 187111171
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
      role: Reviewing
      annotation_n: 1
      task_id_field: Report_Dashboard_Risk_Dashboard_40.json
      prompt: "Count the total number of dropdown filter controls visible in the filter panel at the top of the dashboard. Then count the total number of large percentage KPI cards displayed below the filter panel. Multiply these two counts together and add the number of distinct status categories shown in the legend in the upper right (On Track, Off Track, Red Flag). Answer as a single whole number (e.g., 75)."
      answer: "87"

  - n: 2
    sa:
      rating: thumbs-up
      skills_check: []
      skills_uncheck: []
      prompt_edits: null
      answer_final: null
      feedback: null
    hai:
      role: Reviewing
      annotation_n: 2
      task_id_field: Report_Dashboard_Risk_Dashboard_40.json
      prompt: "Calculate the population standard deviation of the Current GPA values for the four visible students who have a numeric GPA (skip N/A). Then multiply by the absolute difference between the highest and lowest Daily Attendance percentages shown in the Daily Attendance panel bars. Round to four decimal places (e.g., 10.0000)."
      answer: "14.4669"

  - n: 3
    sa:
      rating: thumbs-up
      skills_check: []
      skills_uncheck: []
      prompt_edits: null
      answer_final: null
      feedback: null
    hai:
      role: Reviewing
      annotation_n: 3
      task_id_field: Report_Dashboard_Risk_Dashboard_40.json
      prompt: "Using the total of 409 students, calculate the implied student count for each of these three KPI percentages: Students below 2.6 Current GPA (28%), Students below 15th Percentile in NWEA Mathematics (23%), Students below 15th Percentile in NWEA Reading (20%). Round each count to the nearest whole number. Then calculate the harmonic mean of those three rounded counts using the formula 3 / (1/v1 + 1/v2 + 1/v3). Round to two decimal places (e.g., 100.00)."
      answer: "95.15"

  - n: 4
    sa:
      rating: thumbs-up
      skills_check:
        - Enumeration
      skills_uncheck: []
      prompt_edits: null
      answer_final: "9.8972"
      feedback: "4/17: Added Enumeration skill tag — question requires counting red and green KPI cards by color. Answer corrected from 9.8973 to 9.8972 (∛409 = 7.42291, × 4/3 = 9.89722, rounds to 9.8972 at 4 decimal places)."
    hai:
      role: Reviewing
      annotation_n: 4
      task_id_field: Report_Dashboard_Risk_Dashboard_40.json
      prompt: "Calculate the cube root of the total student count shown on the dashboard. Then count the number of large KPI percentage cards displayed in red and the number displayed in green. Divide the red count by the green count. Multiply the cube root by this ratio. Round to four decimal places (e.g., 10.0000)."
      answer: "9.8972"

  - n: 5
    sa:
      rating: thumbs-up
      skills_check:
        - Enumeration
        - Attribute Perception
        - Math Reasoning
        - Table/Chart/Graph Understanding
      skills_uncheck: []
      prompt_edits: null
      answer_final: "1958.62"
      feedback: "4/17: Added skill tags — question was missing all ontology. Requires Enumeration (sum four red KPI percentages), Attribute Perception (read student table %ile values and identify red KPI colors), Math Reasoning (population std dev + multiplication), Table/Chart/Graph Understanding (read student table and KPI panel values). Answer corrected from 1958.65 → 1958.62 (√317.04 = 17.80562, × 110 = 1958.618, rounds to 1958.62)."
    hai:
      role: Reviewing
      annotation_n: 5
      task_id_field: Report_Dashboard_Risk_Dashboard_40.json
      prompt: "Calculate the population standard deviation of the five visible students' NWEA Reading %ile values. Then sum the four large KPI percentages displayed in red on the dashboard. Multiply the standard deviation by that sum. Round to two decimal places (e.g., 1000.00)."
      answer: "1958.62"
```
