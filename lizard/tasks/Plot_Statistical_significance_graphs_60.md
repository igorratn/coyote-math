# Review: Plot_Statistical_significance_graphs_60

## Task Info
- **SA Task Filename:** `Plot_Statistical_significance_graphs_60.json` (HAI shadow task "Task ID" field)
- **SA Internal Task ID:** 187109810 (numeric — from editor URL, cross-ref only)
- **Image:** `screenshots/Plot_Statistical_significance_graphs_60.png` — Bayes factor vs P value log-scale plot. 4 curves: Power (red), Likelihood ratio bound (black), UMPBT (dark blue), Local-H₁ bound (green). Dashed reference lines at P=0.005 (Bayes factor ≈25.7 and 13.9 labeled in red on left axis) and P=0.05 (≈3.4 and 2.4 labeled in red on right axis). X-axis: 0.0010–0.1000. Y-axis: Bayes factor 0.3–100 (both sides).
- **Date:** 2026-04-13
- **Review Cycle:** 1st

## Annotations

### Annotation 1
- **Shadow Task:** ✅ submitted — [4b4a7940](shadows/4b4a7940.md)
- **Rating:** thumbs-up
- **Question:** SAQ — count curves (not dotted, not key), divide by 98.713, multiply by 57.43, 5 decimal places
- **Skills Tagged (original):** Enumeration, Attribute Perception, Math Reasoning, Table/Chart/Graph Understanding, Short answer question
- **Skills Tagged (revised):** Enumeration, Attribute Perception, Math Reasoning, Table/Chart/Graph Understanding, Short answer question
- **Question Type:** SAQ
- **Model Generated Answer:** 2.32666
- **Rewrite Answer:** 2.32715

#### Two-Part Check
1. **Question Check:**
   - Guidelines violated: none
   - Error types found: none
2. **Answer Check:**
   - Math verified: 4 curves inside graph (Power, Likelihood ratio bound, UMPBT, Local-H₁ bound). 4/98.713×57.43 = 229.72/98.713 = 2.32715. Annotator correct.
   - Model-stump: MODEL=2.32666 ≠ ANSWER=2.32715 ✓

#### Full Prompt
Count the total number of lines/curves shown inside the graph (Ignore dotted lines and the lines in the key area). Divide that number by 98.713 and multiply by 57.43. Give your answer rounded to 5 decimal places (e.g., 1.22345).

#### Rewrite Answer
2.32715

#### Edits Made (if any)
None.

#### Feedback
N/A

---

### Annotation 2
- **Shadow Task:** ✅ submitted — [4c21f2c6](shadows/4c21f2c6.md)
- **Rating:** thumbs-up
- **Question:** SAQ — sum of individual digits in all y-axis values (both sides, including red), divided by letter count of y-axis label, 4 decimal places
- **Skills Tagged (original):** Enumeration, Attribute Perception, Math Reasoning, Table/Chart/Graph Understanding, Short answer question
- **Skills Tagged (revised):** Enumeration, Attribute Perception, Math Reasoning, Table/Chart/Graph Understanding, Short answer question
- **Question Type:** SAQ
- **Model Generated Answer:** 3.4545
- **Rewrite Answer:** 8.1818

#### Two-Part Check
1. **Question Check:**
   - Guidelines violated: none
   - Error types found: none
2. **Answer Check:**
   - Math verified: Left axis values (100,50,20,10,5,2,1,0.5,0.3) digit sum=25; right axis same=25; red left (25.7→14, 13.9→13)=27; red right (3.4→7, 2.4→6)=13. Total=90. "Bayes factor"=11 letters. 90/11=8.1818. Annotator correct.
   - Model-stump: MODEL=3.4545 ≠ ANSWER=8.1818 ✓

#### Full Prompt
Find the sum of every individual digit used in the written values on the y axis of the graph on both sides (including the ones in red). Divide the sum by the total number of letters in the y axis label. Give your answer rounded to 4 decimal places (e.g., 1.2233).

#### Rewrite Answer
8.1818

#### Edits Made (if any)
None.

#### Feedback
N/A

---

### Annotation 3
- **Shadow Task:** ✅ submitted — [2d626849](shadows/2d626849.md)
- **Rating:** thumbs-up
- **Question:** SAQ — count horizontal dotted lines, divide by mean of x-axis values, 2 decimal places
- **Skills Tagged (original):** Enumeration, Spatial Reasoning, Math Reasoning, Table/Chart/Graph Understanding, Short answer question
- **Skills Tagged (revised):** Enumeration, Math Reasoning, Table/Chart/Graph Understanding, Short answer question
- **Question Type:** SAQ
- **Model Generated Answer:** 217.07
- **Rewrite Answer:** 144.70

#### Two-Part Check
1. **Question Check:**
   - Guidelines violated: none
   - Error types found: none
2. **Answer Check:**
   - Math verified: 4 horizontal dotted lines (at ~25.7, ~13.9, ~3.4, ~2.4). X-axis values: 0.001, 0.0025, 0.005, 0.01, 0.025, 0.05, 0.1. Mean=0.1935/7=0.027643. 4/0.027643=144.70. Annotator correct.
   - Model-stump: MODEL=217.07 ≠ ANSWER=144.70 ✓

#### Full Prompt
Count the total number of horizontal dotted lines visible on the graph. Divide that number by the mean of the values written on the x axis of the graph. Give your answer rounded to 2 decimal places (e.g., 1.22).

#### Rewrite Answer
144.70

#### Edits Made (if any)
None.

#### Feedback
N/A

---

### Annotation 4
- **Shadow Task:** ✅ submitted — [4a27dc95](shadows/4a27dc95.md)
- **Rating:** thumbs-up
- **Question:** SAQ — mean number of letters per legend label, 2 decimal places
- **Skills Tagged (original):** Enumeration, Attribute Perception, Math Reasoning, Table/Chart/Graph Understanding, Short answer question
- **Skills Tagged (revised):** Enumeration, Attribute Perception, Math Reasoning, Table/Chart/Graph Understanding, Short answer question
- **Question Type:** SAQ
- **Model Generated Answer:** 10.00
- **Rewrite Answer:** 10.25

#### Two-Part Check
1. **Question Check:**
   - Guidelines violated: none
   - Error types found: none
2. **Answer Check:**
   - Math verified: Power=5, Likelihood ratio bound=20, UMPBT=5, Local-H₁ bound=11 (L-o-c-a-l-H-b-o-u-n-d, subscript 1 is a digit). Mean=41/4=10.25. Annotator correct.
   - Model-stump: MODEL=10.00 ≠ ANSWER=10.25 ✓

#### Full Prompt
Count the number of letters in each of the legend labels. Find the mean number of letters per label. Give your answer rounded to 2 decimal places (e.g., 1.22).

#### Rewrite Answer
10.25

#### Edits Made (if any)
None.

#### Feedback
N/A

---

### Annotation 5
- **Shadow Task:** ✅ submitted — [42fe6508](shadows/42fe6508.md)
- **Rating:** thumbs-up
- **Question:** SAQ — red y-axis values: ratio of highest to lowest, divided by their mean, multiplied by letter count of x-axis label, 3 decimal places
- **Skills Tagged (original):** Enumeration, Attribute Perception, Spatial Reasoning, Math Reasoning, Table/Chart/Graph Understanding, Short answer question
- **Skills Tagged (revised):** Enumeration, Attribute Perception, Math Reasoning, Table/Chart/Graph Understanding, Short answer question
- **Question Type:** SAQ
- **Model Generated Answer:** 4.990
- **Rewrite Answer:** 5.661

#### Two-Part Check
1. **Question Check:**
   - Guidelines violated: none
   - Error types found: none
2. **Answer Check:**
   - Math verified: Red values: 25.7, 13.9, 3.4, 2.4. Ratio=25.7/2.4=10.7083. Mean=45.4/4=11.35. 10.7083/11.35=0.94347. X-axis label "P value"=6 letters. 0.94347×6=5.661. Annotator correct.
   - Model-stump: MODEL=4.990 ≠ ANSWER=5.661 ✓

#### Full Prompt
From the 4 highlighted values in red on the y axis on both sides find the ratio of the highest value to the lowest value. Take the ratio and divide it by the mean of the 4 values then multiply by the number of letters in the x axis of the graph. Give your answer rounded to 3 decimal places (e.g., 1.223).

#### Rewrite Answer
5.661

#### Edits Made (if any)
None.

#### Feedback
N/A

---

## Task Status
- **Status:** QC_Complete
- **Reason:** All 5 annotations pass. Each stumps the model (MODEL ≠ ANSWER). Math verified for all 5. Skill tags corrected: removed inflated Spatial Reasoning where prompts were chart-reading/counting rather than relational layout reasoning.
- **SA Applied (Cycle 1):** ✅ (legacy backfill 2026-04-18)

---

## Form-Fill Payload
Canonical payload for host jobs 2 (SA apply-review) and 3 (HAI shadow task). Host parses this section verbatim — do not reinterpret. Dumb executor.

```yaml
sa_task_filename: "Plot_Statistical_significance_graphs_60.json"
sa_internal_task_id: "187109810"
sa_status_proposed: QC_Complete   # host STOPS before setting; human confirms

annotations:
  - n: 1
    sa:
      rating: thumbs_up
      skills_check:   []
      skills_uncheck: []
      prompt_edits: null
      answer_final: null
      feedback: null
    hai:
      task_id_field: "Plot_Statistical_significance_graphs_60.json"
      role: Reviewing
      annotation_n: 1
      prompt: "Count the total number of lines/curves shown inside the graph (Ignore dotted lines and the lines in the key area). Divide that number by 98.713 and multiply by 57.43. Give your answer rounded to 5 decimal places (e.g., 1.22345)."
      image_ref: "screenshots/Plot_Statistical_significance_graphs_60.png"
      answer: "2.32715"

  - n: 2
    sa:
      rating: thumbs_up
      skills_check:   []
      skills_uncheck: []
      prompt_edits: null
      answer_final: null
      feedback: null
    hai:
      task_id_field: "Plot_Statistical_significance_graphs_60.json"
      role: Reviewing
      annotation_n: 2
      prompt: "Find the sum of every individual digit used in the written values on the y axis of the graph on both sides (including the ones in red). Divide the sum by the total number of letters in the y axis label. Give your answer rounded to 4 decimal places (e.g., 1.2233)."
      image_ref: "screenshots/Plot_Statistical_significance_graphs_60.png"
      answer: "8.1818"

  - n: 3
    sa:
      rating: thumbs_up
      skills_check:   []
      skills_uncheck: [Spatial Reasoning]
      prompt_edits: null
      answer_final: null
      feedback: "4/13: Skill tag corrected: dropped Spatial Reasoning (prompt is chart-reading/counting, not relational layout reasoning)."
    hai:
      task_id_field: "Plot_Statistical_significance_graphs_60.json"
      role: Reviewing
      annotation_n: 3
      prompt: "Count the total number of horizontal dotted lines visible on the graph. Divide that number by the mean of the values written on the x axis of the graph. Give your answer rounded to 2 decimal places (e.g., 1.22)."
      image_ref: "screenshots/Plot_Statistical_significance_graphs_60.png"
      answer: "144.70"

  - n: 4
    sa:
      rating: thumbs_up
      skills_check:   []
      skills_uncheck: []
      prompt_edits: null
      answer_final: null
      feedback: null
    hai:
      task_id_field: "Plot_Statistical_significance_graphs_60.json"
      role: Reviewing
      annotation_n: 4
      prompt: "Count the number of letters in each of the legend labels. Find the mean number of letters per label. Give your answer rounded to 2 decimal places (e.g., 1.22)."
      image_ref: "screenshots/Plot_Statistical_significance_graphs_60.png"
      answer: "10.25"

  - n: 5
    sa:
      rating: thumbs_up
      skills_check:   []
      skills_uncheck: [Spatial Reasoning]
      prompt_edits: null
      answer_final: null
      feedback: "4/13: Skill tag corrected: dropped Spatial Reasoning (prompt is chart-reading/comparison, not relational layout reasoning)."
    hai:
      task_id_field: "Plot_Statistical_significance_graphs_60.json"
      role: Reviewing
      annotation_n: 5
      prompt: "From the 4 highlighted values in red on the y axis on both sides find the ratio of the highest value to the lowest value. Take the ratio and divide it by the mean of the 4 values then multiply by the number of letters in the x axis of the graph. Give your answer rounded to 3 decimal places (e.g., 1.223)."
      image_ref: "screenshots/Plot_Statistical_significance_graphs_60.png"
      answer: "5.661"
```

**Host contract:**
- Job 2 (SA apply-review) → parse `annotations[].sa`. STOP before `sa_status_proposed`.
- Job 3 (HAI shadow) → one shadow task per `annotations[].hai` entry. STOP before Submit + Confirm time.
- Image upload = `upload_file` MCP tool. All other fields = `form_input` / checkbox toggles.
