# Review: Report_Dashboard_SEO_Dashboard_111.json

## Task Info
- **SA Task Filename:** `Report_Dashboard_SEO_Dashboard_111.json`
- **SA Internal Task ID:** 187111182
- **Image:** SEO/Analytics dashboard. Top row: Users 71.2K (↑0.4%), Conversions 373.5K (↓32.5%), Conversion Rate 89.0% (↓2.0%), Sessions 84.7K (↓14.8%). Line graph (May 27–Jun 24) with dark solid blue (Users) and lighter blue (Sessions) lines. Traffic Channel stacked bar chart (y-axis: 0–5K). Sessions by country (United States, Canada, India, China, Japan). Users by time of day heatmap. 7-day active users panel (75,786).
- **Date:** 2026-04-17
- **Review Cycle:** 1st

## Annotations

### Annotation 1
- **Shadow Task:** ✅ submitted (cycle 1) — [95af3896](shadows/95af3896.md)
- **Rating:** thumbs-up
- **Question:** Divide Users KPI by Sessions KPI; multiply by total letters in x-axis labels of the line graph; round to 4dp.
- **Skills Tagged:** Enumeration, Attribute Perception, Math Reasoning, Table/Chart/Graph Understanding
- **Question Type:** SAQ
- **Model Generated Answer:** 20.1744
- **Rewrite Answer:** 20.1747

#### Two-Part Check
1. **Question Check:**
   - Guidelines violated: none
   - Error types found: none
2. **Answer Check:**
   - Math verified: yes — Users=71.2K, Sessions=84.7K; 71.2/84.7=0.84061393; x-axis labels: May 27, May 31, Jun 4, Jun 8, Jun 12, Jun 16, Jun 20, Jun 24 → letters only (no digits/spaces): 3+3+3+3+3+3+3+3=24; 0.84061393×24=20.1747 ✓
   - Answer correct: yes

#### Full Prompt
Divide the Users value by the Sessions value. Multiply that division answer by the total number of letters in the x axis labels of the line graph. Give your answer rounded to 4 decimal places (e.g., 1.2345).

#### Rewrite Answer
20.1747

#### Edits Made (if any)
None

#### Feedback
N/A

---

### Annotation 2
- **Shadow Task:** ✅ submitted (cycle 1) — [cf6736a2](shadows/cf6736a2.md)
- **Rating:** thumbs-up
- **Question:** Count peaks in solid dark blue line in the line graph; divide by total countries mentioned; round to 2dp.
- **Skills Tagged:** Enumeration, Attribute Perception, Math Reasoning, Table/Chart/Graph Understanding
- **Question Type:** SAQ
- **Model Generated Answer:** 0.80
- **Rewrite Answer:** 1.60

#### Two-Part Check
1. **Question Check:**
   - Guidelines violated: none. Line is piecewise-connected — peaks (local maxima where line reverses from rising to falling) are well-defined, not ambiguous.
   - Error types found: none.
2. **Answer Check:**
   - Math verified: Countries in image: United States, Canada, India, China, Japan = 5. Peak count via pixel analysis (strict piecewise rising→falling reversals): 8. 8/5 = 1.60 ✓
   - Answer correct: yes. Model's 0.80 came from undercounting peaks (4 instead of 8).

#### Full Prompt
Count the total number of peaks for the solid dark blue line in the line graph. Divide that number by the total number of countries mentioned in the image. What is the result? Give your answer rounded to 2 decimal places (e.g., 1.22).

#### Rewrite Answer
1.60

#### Edits Made (if any)
Skills: removed World Knowledge (countries are text-labeled in image; no world knowledge needed — they are listed as "United States," "Canada," etc.).

#### Feedback
4/17: Approved. Removed World Knowledge skill tag — countries are named as text labels in the chart, no external knowledge required.

---

### Annotation 3
- **Shadow Task:** ✅ submitted (cycle 1) — [3d7b3649](shadows/3d7b3649.md)
- **Rating:** thumbs-up
- **Question:** Mean of four absolute % change values (Users, Conversions, Conversion Rate, Sessions) divided by mean of Traffic Channel y-axis values (ignore units); round to 6dp.
- **Skills Tagged:** Enumeration, Attribute Perception, Math Reasoning, Table/Chart/Graph Understanding
- **Question Type:** SAQ
- **Model Generated Answer:** 0.004970
- **Rewrite Answer:** 4.970000

#### Two-Part Check
1. **Question Check:**
   - Guidelines violated: none
   - Error types found: none
2. **Answer Check:**
   - Math verified: yes — Absolute % values: 0.4, 32.5, 2.0, 14.8; mean=(0.4+32.5+2.0+14.8)/4=49.7/4=12.425. Traffic Channel y-axis: 0,1K,2K,3K,4K,5K → ignore units: 0,1,2,3,4,5; mean=15/6=2.5. Result=12.425/2.5=4.97→4.970000 ✓. Model used 2500 instead of 2.5 (failed to ignore units) → 0.004970 — stumped correctly.
   - Answer correct: yes

#### Full Prompt
Find the mean of the four percentage values below Users, Conversions, Conversion Rates and Sessions (use the absolute values). Take that mean and divide it by the mean of the values written on the y axis for Traffic Channel (ignore the units and use the numbers as is). Give your answer rounded to 6 decimal places (e.g., 1.234567).

#### Rewrite Answer
4.970000

#### Edits Made (if any)
None

#### Feedback
N/A

---

## Task Status
- **Status:** QC_Complete
- **Reason:** All 3 annotations thumbs-up.
- **SA Applied (Cycle 1):** ✅
- **SA Status Set By Human:** QC_Complete (2026-04-17)
- **Derivation match:** yes A2 skill-tag edit: removed World Knowledge.

---

## Form-Fill Payload

```yaml
task_id: 187111182
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
      task_id_field: Report_Dashboard_SEO_Dashboard_111.json
      role: Reviewing
      annotation_n: 1
      prompt: |
        Divide the Users value by the Sessions value. Multiply that division answer by the total number of letters in the x axis labels of the line graph. Give your answer rounded to 4 decimal places (e.g., 1.2345).
      answer: "20.1747"

  - n: 2
    sa:
      rating: thumbs-up
      skills_check: []
      skills_uncheck: ["World Knowledge"]
      prompt_edits: null
      answer_final: null
      feedback: "4/17: Approved. Removed World Knowledge skill tag — countries are named as text labels in the chart, no external knowledge required."
    hai:
      task_id_field: Report_Dashboard_SEO_Dashboard_111.json
      role: Reviewing
      annotation_n: 2
      prompt: |
        Count the total number of peaks for the solid dark blue line in the line graph. Divide that number by the total number of countries mentioned in the image. What is the result? Give your answer rounded to 2 decimal places (e.g., 1.22).
      answer: "1.60"

  - n: 3
    sa:
      rating: thumbs-up
      skills_check: []
      skills_uncheck: []
      prompt_edits: null
      answer_final: null
      feedback: null
    hai:
      task_id_field: Report_Dashboard_SEO_Dashboard_111.json
      role: Reviewing
      annotation_n: 3
      prompt: |
        Find the mean of the four percentage values below Users, Conversions, Conversion Rates and Sessions (use the absolute values). Take that mean and divide it by the mean of the values written on the y axis for Traffic Channel (ignore the units and use the numbers as is). Give your answer rounded to 6 decimal places (e.g., 1.234567).
      answer: "4.970000"
```
