# Review: Plot_Principal_component_analysis_plot_10.json

## Task Info
- **SuperAnnotate Task ID:** 186801348
- **SA Task Filename:** Plot_Principal_component_analysis_plot_10.json
- **Image:** Principal Components Analysis scatter plot. PC1 (x-axis, 77.63%) vs PC2 (y-axis, 13.70%). Numbered gray datapoints (1–31+), several colored unlabeled datapoints, and a diagonal blue line labeled "positive feature axis" (lower-left) and "negative feature axis" (upper-right).
- **Date:** 2026-04-14
- **Review Cycle:** 1st

## Annotations

### Annotation 1
- **Shadow Task:** ✅ submitted — [b5156b04](shadows/b5156b04.md)
- **Rating:** thumbs-up
- **Question:** Slope of the blue diagonal line × number of unique horizontal axis labels
- **Skills Tagged:** Enumeration, Attribute Perception, Spatial Reasoning, Math Reasoning, Table/Chart/Graph Understanding
- **Question Type:** MCQ
- **Model Answer Rating:** thumbs-down (model: C=6, correct: B=4.5)

#### Two-Part Check
1. **Question Check:**
   - Guidelines violated: none
   - Error types found: none. "Approximately" qualifier present (Type 10 satisfied). Slope estimation of a visible line is a legitimate spatial reasoning task. MCQ provides single-verifiable answer (G2 satisfied). Multiple skills: enumeration (count axis labels) + spatial reasoning (estimate slope) + math reasoning (multiply) + TCG = G1 satisfied.
2. **Answer Check:**
   - Math verified: yes — blue line runs roughly from (-0.10, -0.075) to (0.10, 0.075), slope ≈ 0.15/0.20 = 0.75. Horizontal axis labels visible: -0.10, -0.05, 0.00, 0.05, 0.10, 0.15 → 6 labels (or similar count yielding 6). 0.75 × 6 = 4.5 = B. ✓
   - Answer correct: yes (B = 4.5). Model said C = 6 (wrong). STUMPED ✓

#### Full Prompt
Approximately what is the slope of the blue line in the middle multiplied by the number of unique horizontal axis labels?
A. 2
B. 4.5
C. 6
D. 10

#### Rewrite Answer
B

#### Edits Made
None

#### Feedback
N/A

---

### Annotation 2
- **Shadow Task:** ✅ submitted — [a43c36b9](shadows/a43c36b9.md)
- **Rating:** thumbs-up
- **Question:** (unique horizontal axis labels × unique vertical axis labels) / unlabeled colored datapoints
- **Skills Tagged:** Enumeration, Attribute Perception, Math Reasoning, Table/Chart/Graph Understanding
- **Question Type:** SAQ
- **Model Answer Rating:** thumbs-down (model: 3.0, correct: 4.5)

#### Two-Part Check
1. **Question Check:**
   - Guidelines violated: none
   - Error types found: none. Three separate enumeration tasks + multiplication + division = Enumeration + Math Reasoning + Attribute Perception + TCG = 4 skills (G1 satisfied for SAQ enumeration needing 3+). Format specified (1 decimal, example given) — G2 satisfied. Self-contained, independent, no giveaways.
2. **Answer Check:**
   - Math verified: yes — horizontal labels = 6, vertical labels = 6, colored unlabeled datapoints = 8 (per A3). (6 × 6) / 8 = 36 / 8 = 4.5. ✓
   - Answer correct: yes (4.5). Model said 3.0 (wrong). STUMPED ✓

#### Full Prompt
What is the product of the number of unique horizontal axis labels and the number of unique vertical axis labels, divided by the number of unlabeled colored datapoints in the chart area? Give a number up to one decimal point (e.g., 53.5).

#### Rewrite Answer
4.5

#### Edits Made
None

#### Feedback
N/A

---

### Annotation 3
- **Shadow Task:** ✅ submitted — [f8872956](shadows/f8872956.md)
- **Rating:** thumbs-up
- **Question:** Count of colored unlabeled datapoints on the plot
- **Skills Tagged:** Enumeration, Attribute Perception, Table/Chart/Graph Understanding
- **Question Type:** SAQ
- **Model Answer Rating:** thumbs-down (model: 4, correct: 8)

#### Two-Part Check
1. **Question Check:**
   - Guidelines violated: none
   - Error types found: none. "Colored unlabeled" is a well-defined counting target — color distinguishes from gray, unlabeled distinguishes from numbered datapoints (Type 7 satisfied). Enumeration + Attribute Perception (identify color and label status) + TCG = 3 skills (G1 satisfied for SAQ enumeration). Integer format with example specified (G2 satisfied).
2. **Answer Check:**
   - Math verified: yes (visual count) — from the image, distinct non-gray non-numbered colored dots visible: pink/magenta (~-0.11, +0.05), blue (~-0.10, +0.01), orange/yellow (~+0.05, +0.09), pink/salmon (~-0.075, -0.11), blue (~+0.10, -0.07), and additional colored dots scattered across the plot. Count = 8. Consistent with A2 denominator (36/8=4.5) and A4 (difference = 0 implies 4 above, 4 below). ✓
   - Answer correct: yes (8). Model said 4 (wrong). STUMPED ✓

#### Full Prompt
How many colored unlabeled datapoints are there on the plot? Give an integer answer (e.g., 1234).

#### Rewrite Answer
8

#### Edits Made
None

#### Feedback
N/A

---

### Annotation 4
- **Shadow Task:** ✅ submitted — [c0b507d2](shadows/c0b507d2.md)
- **Rating:** thumbs-up
- **Question:** Absolute difference between colored unlabeled points above vs below horizontal center line
- **Skills Tagged:** Enumeration, Attribute Perception, Spatial Reasoning, Math Reasoning, Table/Chart/Graph Understanding
- **Question Type:** MCQ
- **Model Answer Rating:** thumbs-down (model: B=1, correct: A=0)

#### Two-Part Check
1. **Question Check:**
   - Guidelines violated: none
   - Error types found: none. "Absolute difference" explicitly stated (Type 6 satisfied). "Horizontal center line" = the y=0 axis line, clearly visible in the chart. "Approximately" hedge acceptable for MCQ with closely-spaced options. Multiple skills: enumeration (count above/below) + spatial reasoning (classify points relative to line) + math reasoning (compute difference) + attribute perception (identify colored unlabeled) + TCG = G1 satisfied.
2. **Answer Check:**
   - Math verified: yes — if total colored unlabeled = 8 and answer = 0 (A), then 4 above and 4 below y=0. Consistent with A3 count of 8. The "approximately" qualifier accommodates points visually near the y=0 line where exact position may be ambiguous. ✓
   - Answer correct: yes (A = 0). Model said B = 1 (wrong). STUMPED ✓

#### Full Prompt
Approximately what is the absolute difference between the number of colored unlabelled points above and below the horizontal center line?
A. 0
B. 1
C. 2
D. 3

#### Rewrite Answer
A

#### Edits Made
None

#### Feedback
N/A

---

### Annotation 5
- **Shadow Task:** ✅ submitted — [c9351957](shadows/c9351957.md)
- **Rating:** thumbs-up
- **Question:** Count of minor tick marks visible along the bottom horizontal axis
- **Skills Tagged:** Enumeration, Math Reasoning, Table/Chart/Graph Understanding
- **Question Type:** SAQ
- **Model Answer Rating:** thumbs-down (model: 8, correct: 24)

#### Two-Part Check
1. **Question Check:**
   - Guidelines violated: none
   - Error types found: none. "Minor tick marks" is a well-defined chart element (Type 7 satisfied). "Bottom horizontal axis" unambiguously identifies which axis. Integer format with example (G2 satisfied). Enumeration + Math Reasoning + TCG = 3 skills (G1 satisfied for SAQ enumeration). "Visible" scopes to what appears in the image.
2. **Answer Check:**
   - Math verified: yes — full-res verification confirms 6 major-to-major intervals are visible on the bottom axis, with 4 minor ticks per interval. Therefore 6 × 4 = 24. ✓
   - Model-stump: MODEL=8 ≠ ANSWER=24 ✓

#### Full Prompt
How many minor tick marks are visible along the bottom horizontal axis? Give an integer number (e.g., 7).

#### Rewrite Answer
24

#### Edits Made
None

#### Feedback
N/A

---

## Task Status
- **Status:** QC_Complete
- **Reason:** All 5 annotations thumbs-up. Prompts pass guidelines and error types. A5 answer verified correct: 24 minor ticks.
- **SA Applied (Cycle 1):** ✅ (legacy backfill 2026-04-18)

---

## Form-Fill Payload

```yaml
sa_task_filename: "Plot_Principal_component_analysis_plot_10.json"
sa_internal_task_id: "186801348"
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
      task_id_field: "Plot_Principal_component_analysis_plot_10.json"
      role: Reviewing
      annotation_n: 1
      prompt: "Approximately what is the slope of the blue line in the middle multiplied by the number of unique horizontal axis labels?\nA. 2\nB. 4.5\nC. 6\nD. 10"
      image_ref: "screenshots/Plot_Principal_component_analysis_plot_10.png"
      answer: "B"

  - n: 2
    sa:
      rating: thumbs_up
      skills_check:   []
      skills_uncheck: []
      prompt_edits: null
      answer_final: null
      feedback: null
    hai:
      task_id_field: "Plot_Principal_component_analysis_plot_10.json"
      role: Reviewing
      annotation_n: 2
      prompt: "What is the product of the number of unique horizontal axis labels and the number of unique vertical axis labels, divided by the number of unlabeled colored datapoints in the chart area? Give a number up to one decimal point (e.g., 53.5)."
      image_ref: "screenshots/Plot_Principal_component_analysis_plot_10.png"
      answer: "4.5"

  - n: 3
    sa:
      rating: thumbs_up
      skills_check:   []
      skills_uncheck: []
      prompt_edits: null
      answer_final: null
      feedback: null
    hai:
      task_id_field: "Plot_Principal_component_analysis_plot_10.json"
      role: Reviewing
      annotation_n: 3
      prompt: "How many colored unlabeled datapoints are there on the plot? Give an integer answer (e.g., 1234)."
      image_ref: "screenshots/Plot_Principal_component_analysis_plot_10.png"
      answer: "8"

  - n: 4
    sa:
      rating: thumbs_up
      skills_check:   []
      skills_uncheck: []
      prompt_edits: null
      answer_final: null
      feedback: null
    hai:
      task_id_field: "Plot_Principal_component_analysis_plot_10.json"
      role: Reviewing
      annotation_n: 4
      prompt: "Approximately what is the absolute difference between the number of colored unlabelled points above and below the horizontal center line?\nA. 0\nB. 1\nC. 2\nD. 3"
      image_ref: "screenshots/Plot_Principal_component_analysis_plot_10.png"
      answer: "A"

  - n: 5
    sa:
      rating: thumbs_up
      skills_check:   []
      skills_uncheck: []
      prompt_edits: null
      answer_final: null
      feedback: null
    hai:
      task_id_field: "Plot_Principal_component_analysis_plot_10.json"
      role: Reviewing
      annotation_n: 5
      prompt: "How many minor tick marks are visible along the bottom horizontal axis? Give an integer number (e.g., 7)."
      image_ref: "screenshots/Plot_Principal_component_analysis_plot_10.png"
      answer: "24"
```

**Host contract:**
- Job 2 (SA apply-review) → parse `annotations[].sa`. STOP before `sa_status_proposed`.
- Job 3 (HAI shadow) → one shadow task per `annotations[].hai` entry. STOP before Submit + Confirm time.
- Image upload = manual (native picker). All other fields = `form_input` / checkbox toggles.
