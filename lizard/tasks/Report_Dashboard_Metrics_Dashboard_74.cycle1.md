# Review: Report_Dashboard_Metrics_Dashboard_74

## Task Info
- **SuperAnnotate Task ID:** 187110801
- **Image:** Healthcare AR metrics dashboard. Two rows of 4 charts each. Row 1: Insurance AR Balance by Month (bar), Daily trend for Insurance AR Balance (bar or line — see A1 flag), Insurance AR Balance by CPT Code (pie), Insurance AR Balance by Aging Days (donut, $143K). Row 2: Patient AR Balance by Month (bar), Daily trend for Patient AR Balance (bar or line), Patient AR Balance by CPT Code (pie), Patient AR Balance by Aging Days (donut, $24K). Pagination circles visible.
- **Date:** 2026-04-16
- **Review Cycle:** 1st

## Annotations

### Annotation 1
- **Shadow Task:** ✅ submitted (cycle 1) — [146b1edf](shadows/146b1edf.md)
- **Rating:** thumbs-up
- **Question:** Count all distinct chart types; determine which appears most frequently across both rows.
- **Skills Tagged:** Enumeration, Attribute Perception
- **Question Type:** Short Answer
- **Model Answer Rating:** thumbs-down

#### Two-Part Check
1. **Question Check:**
   - Guidelines violated: none
   - Error types found: none. Format "exact format (e. g all chart types [number] times)" constrains the answer. Tie scenario (all types appear equally) is handled by the answer format. Went through 7 CMW iterations to reach clean final version. Tags fixed: removed Spatial Reasoning (no spatial layout reasoning needed — just identifying chart types) and World Knowledge (prompt names all chart types explicitly — no external knowledge required). Added Attribute Perception (visual type identification).
2. **Answer Check:**
   - Math verified: FLAGGED — image shows 8 charts (not 4). If Daily trend charts = line: bar=2, line=2, pie=2, donut=2 → "All chart types appear 2 times" ✓. If Daily trend charts = bar: bar=4, pie=2, donut=2 → "bar charts 4 times" (annotator wrong). Daily trends appear to be dense bar charts at review resolution but annotator with full-res classified as lines. **Needs full-res verification before confirming.** Model answered "bar charts" which aligns with bar classification.
   - Answer correct: conditional — correct only if Daily trend = line chart

#### Full Prompt
Count all the distinct chart types (bar charts, line charts, pie charts, donut charts) shown in the dashboard, and determine which type appears the most frequently across both rows. Answer using the exact format (e. g all chart types [number] times)

#### Rewrite Answer
All chart types appear 2 times

#### Edits Made (if any)
None

#### Feedback
N/A

---

### Annotation 2
- **Shadow Task:** ✅ submitted (cycle 1) — [0561ec6e](shadows/0561ec6e.md)
- **Rating:** thumbs-up
- **Question:** Ratio of Insurance to Patient AR Balance (rounded), plus bar count in first-row bar chart.
- **Skills Tagged:** Enumeration, Attribute Perception, Math Reasoning
- **Question Type:** Short Answer
- **Model Answer Rating:** thumbs-down

#### Two-Part Check
1. **Question Check:**
   - Guidelines violated: none
   - Error types found: none. Dollar values provided inline ($143K, $24K) eliminates reading ambiguity. Rounding instruction clear.
2. **Answer Check:**
   - Math verified: yes — $143K/$24K = 5.958 → rounds to 6. First-row bar chart bars = 8. 6+8 = 14. Model got 18 (used wrong ratio or wrong bar count).
   - Answer correct: yes (14)

#### Full Prompt
Based on the displayed totals ($143K for Insurance and $24K for Patient), estimate how many times larger Insurance AR Balance is compared to Patient AR Balance and round off the ratio to the nearest whole number? Add that to the number of bars in the bar chart in the first row. (e. g 40)

#### Rewrite Answer
14

#### Edits Made (if any)
None

#### Feedback
N/A

---

### Annotation 3
- **Shadow Task:** ✅ submitted (cycle 1) — [0bdfd9ce](shadows/0bdfd9ce.md)
- **Rating:** thumbs-up
- **Question:** Count green bars across both row bar charts.
- **Skills Tagged:** Enumeration, Attribute Perception
- **Question Type:** Short Answer
- **Model Answer Rating:** thumbs-down

#### Two-Part Check
1. **Question Check:**
   - Guidelines violated: none
   - Error types found: none. Simple color-counting task. G1 met (2 skills).
2. **Answer Check:**
   - Math verified: yes — 16 green bars total (8 per bar chart × 2 rows, or a subset if not all are green). Model got 24 (wrong).
   - Answer correct: yes (16 bars)

#### Full Prompt
How many green bars are there in the bar charts in both the first and second row in the image shown? (e. g 20 bars)

#### Rewrite Answer
16 bars

#### Edits Made (if any)
None

#### Feedback
N/A

---

### Annotation 4
- **Shadow Task:** ✅ submitted (cycle 1) — [16b269ab](shadows/16b269ab.md)
- **Rating:** thumbs-up
- **Question:** Yellow + red + blue sections in Patient AR donut + bars in Patient AR Month chart; answer in words.
- **Skills Tagged:** Enumeration, Attribute Perception, Math Reasoning
- **Question Type:** Short Answer
- **Model Answer Rating:** thumbs-down

#### Two-Part Check
1. **Question Check:**
   - Guidelines violated: none
   - Error types found: none. "In words" format is unambiguous. Specific chart titles referenced.
2. **Answer Check:**
   - Math verified: yes — yellow+red+blue sections in Patient AR Aging Days donut = 3 sections + 8 bars in Patient AR by Month = 11. Answer: "Eleven". Model got "sixteen" (wrong).
   - Answer correct: yes (Eleven)

#### Full Prompt
What is the total number of yellow, red, and blue sections in "Patient AR Balance by Aging Days" and the number of bars in "Patient AR Balance by Month" added together? Give your answer in words. (e. g twenty)

#### Rewrite Answer
Eleven

#### Edits Made (if any)
None

#### Feedback
N/A

---

### Annotation 5
- **Shadow Task:** ✅ submitted (cycle 1) — [11c35780](shadows/11c35780.md)
- **Rating:** thumbs-up
- **Question:** Sum of colored and uncolored circles in the image.
- **Skills Tagged:** Enumeration, Attribute Perception, Math Reasoning
- **Question Type:** Short Answer
- **Model Answer Rating:** thumbs-down

#### Two-Part Check
1. **Question Check:**
   - Guidelines violated: none
   - Error types found: none. "Circles" in context of this dashboard = pie/donut chart circular elements. Colored circles = pie/donut charts with colored sections. Uncolored circles = hollow/white-centered donut circles. Convention is clear enough in context. Stage 3 initially flagged as ambiguous, overridden on re-review.
2. **Answer Check:**
   - Math verified: yes — 6 circles total (pie + donut chart circles, colored and uncolored). Model got 4 (wrong).
   - Answer correct: yes (6)

#### Full Prompt
What is the sum of colored and uncolored circles in the image? Give your answer as an integer.(e. g 3)

#### Rewrite Answer
6

#### Edits Made (if any)
None

#### Feedback
N/A

## Task Status
- **Status:** QC_Complete
- **SA Applied:** ✅
- **Reason:** All 5 annotations thumbs-up. A1 tags fixed (SR+WK removed, AP added). A5 initially flagged by Stage 3 as ambiguous circles — overridden: pie/donut chart circles are clear enough in context.

## Form-Fill Payload

```yaml
task_id: 187110801
annotations:
  - n: 1
    sa:
      rating: thumbs-up
      skills_check: ["Attribute Perception"]
      skills_uncheck: ["Spatial Reasoning", "World Knowledge"]
      prompt_edits: null
      answer_final: null
      feedback: "4/16: Removed Spatial Reasoning and World Knowledge — prompt names all chart types explicitly, no external knowledge or spatial layout reasoning needed. Added Attribute Perception (visual type identification)."
    hai:
      task_id_field: Report_Dashboard_Metrics_Dashboard_74.json
      role: Reviewing
      annotation_n: 1
      prompt: |
        Count all the distinct chart types (bar charts, line charts, pie charts, donut charts) shown in the dashboard, and determine which type appears the most frequently across both rows. Answer using the exact format (e. g all chart types [number] times)
      answer: "All chart types appear 2 times"
  - n: 2
    sa:
      rating: thumbs-up
      skills_check: []
      skills_uncheck: []
      prompt_edits: null
      answer_final: null
      feedback: null
    hai:
      task_id_field: Report_Dashboard_Metrics_Dashboard_74.json
      role: Reviewing
      annotation_n: 2
      prompt: |
        Based on the displayed totals ($143K for Insurance and $24K for Patient), estimate how many times larger Insurance AR Balance is compared to Patient AR Balance and round off the ratio to the nearest whole number? Add that to the number of bars in the bar chart in the first row. (e. g 40)
      answer: "14"
  - n: 3
    sa:
      rating: thumbs-up
      skills_check: []
      skills_uncheck: []
      prompt_edits: null
      answer_final: null
      feedback: null
    hai:
      task_id_field: Report_Dashboard_Metrics_Dashboard_74.json
      role: Reviewing
      annotation_n: 3
      prompt: |
        How many green bars are there in the bar charts in both the first and second row in the image shown? (e. g 20 bars)
      answer: "16 bars"
  - n: 4
    sa:
      rating: thumbs-up
      skills_check: []
      skills_uncheck: []
      prompt_edits: null
      answer_final: null
      feedback: null
    hai:
      task_id_field: Report_Dashboard_Metrics_Dashboard_74.json
      role: Reviewing
      annotation_n: 4
      prompt: |
        What is the total number of yellow, red, and blue sections in "Patient AR Balance by Aging Days" and the number of bars in "Patient AR Balance by Month" added together? Give your answer in words. (e. g twenty)
      answer: "Eleven"
  - n: 5
    sa:
      rating: thumbs-up
      skills_check: []
      skills_uncheck: []
      prompt_edits: null
      answer_final: null
      feedback: null
    hai:
      task_id_field: Report_Dashboard_Metrics_Dashboard_74.json
      role: Reviewing
      annotation_n: 5
      prompt: |
        What is the sum of colored and uncolored circles in the image? Give your answer as an integer.(e. g 3)
      answer: "6"
```
