# Review: Plot_T-test_graph_visualization_30

## Task Info
- **SA Task Filename:** `Plot_T-test_graph_visualization_30.json` (HAI shadow task "Task ID" field)
- **SA Internal Task ID:** 187109854 (numeric — from editor URL, cross-ref only)
- **Image:** `screenshots/Plot_T-test_graph_visualization_30.png` — Welch's t-test boxplot with jittered scatter. Two groups: female (green, left) and male (orange, right). Y-axis: bill_length_mm (~30–60). X-axis: sex. Title stats: t_Welch(329.29)=-6.67, p=1.07e-10, g_Hedges=-0.73, CI95%[-0.95,-0.51], n_obs=333.
- **Date:** 2026-04-13
- **Review Cycle:** 1st

## Annotations

### Annotation 1
- **Shadow Task:** ✅ submitted — [36729f87](shadows/36729f87.md)
- **Rating:** thumbs-up
- **Question:** MCQ — which group has lower minimum scatter value and at approximately what y-value
- **Skills Tagged (original):** Attribute Perception, Spatial Reasoning, Table/Chart/Graph Understanding, MCQ
- **Skills Tagged (revised):** Attribute Perception, Table/Chart/Graph Understanding, MCQ
- **Question Type:** MCQ
- **Model Generated Answer:** A
- **Rewrite Answer:** C

#### Two-Part Check
1. **Question Check:**
   - Guidelines violated: none
   - Error types found: none
2. **Answer Check:**
   - Math verified: Female lowest scatter ≈32 mm, male lowest ≈37 mm → female has lower minimum at ~32 mm → C. Model chose A (female ~27 mm, too low).
   - Model-stump: MODEL=A ≠ ANSWER=C ✓

#### Full Prompt
Look at the lowest scatter points for each group. Compare the lowest data point in the female group to the lowest data point in the male group. Which group has a lower minimum value, and at approximately what y-value does it sit?
A. Female, at approximately 27 mm
B. Male, at approximately 27 mm
C. Female, at approximately 32 mm
D. Male, at approximately 32 mm

#### Rewrite Answer
C

#### Edits Made (if any)
Skill tags: removed `Spatial Reasoning`.

#### Feedback
4/13: Skill tag corrected: dropped Spatial Reasoning (prompt is chart-reading/comparison, not relational layout reasoning).

---

### Annotation 2
- **Shadow Task:** ✅ submitted — [363703fc](shadows/363703fc.md)
- **Rating:** thumbs-up
- **Question:** MCQ — compare female upper whisker length to male lower whisker length
- **Skills Tagged (original):** Attribute Perception, Spatial Reasoning, Math Reasoning, MCQ
- **Skills Tagged (revised):** Attribute Perception, Math Reasoning, Table/Chart/Graph Understanding, MCQ
- **Question Type:** MCQ
- **Model Generated Answer:** D
- **Rewrite Answer:** A

#### Two-Part Check
1. **Question Check:**
   - Guidelines violated: none
   - Error types found: none
2. **Answer Check:**
   - Math verified: Female upper whisker (Q3→tip) ≈5–6mm; male lower whisker (Q1→tip) ≈2–3mm → female upper ~twice male lower → A. Stump confirmed.
   - Model-stump: MODEL=D ≠ ANSWER=A ✓

#### Full Prompt
Examine the vertical whiskers extending from each box. The whiskers show the range of non-outlier data. Compare the length of the upper whisker (from Q3 to the whisker tip) for the female group to the length of the lower whisker (from Q1 to the whisker tip) for the male group. Which of the following best describes their relationship?
A. The female upper whisker is approximately twice as long as the male lower whisker
B. The male lower whisker is approximately twice as long as the female upper whisker
C. They are approximately the same length
D. The female upper whisker is only slightly larger, less than 1.2 times as long as the male lower whisker

#### Rewrite Answer
A

#### Edits Made (if any)
Skill tags: removed `Spatial Reasoning`, added `Table/Chart/Graph Understanding`.

#### Feedback
4/13: Skill tags corrected: dropped Spatial Reasoning (prompt is chart-reading/comparison, not relational layout reasoning) and added Table/Chart/Graph Understanding.

---

### Annotation 3
- **Shadow Task:** ✅ submitted — [37ef62d1](shadows/37ef62d1.md)
- **Rating:** thumbs-up
- **Question:** MCQ — compare male upper whisker tip vs highest female scatter point: which is higher and by how much
- **Skills Tagged (original):** Attribute Perception, Spatial Reasoning, Table/Chart/Graph Understanding, MCQ
- **Skills Tagged (revised):** Attribute Perception, Table/Chart/Graph Understanding, MCQ
- **Question Type:** MCQ
- **Model Generated Answer:** A
- **Rewrite Answer:** C

#### Two-Part Check
1. **Question Check:**
   - Guidelines violated: none
   - Error types found: none
2. **Answer Check:**
   - Math verified: Male upper whisker tip ≈57 mm; female highest scatter ≈56 mm → male tip is higher by ~1 mm → C. Model chose A (male higher by 3–4 mm).
   - Model-stump: MODEL=A ≠ ANSWER=C ✓

#### Full Prompt
Compare the upper whisker tip of the male box plot to the highest scatter point in the female group. Which sits higher on the y-axis, and approximately what is the vertical distance between them?
A. The male upper whisker tip is higher, by approximately 3-4 mm
B. The female's highest scatter point is higher, by approximately 3-4 mm
C. The male upper whisker tip is higher, by approximately 1 mm
D. They sit at approximately the same y-value

#### Rewrite Answer
C

#### Edits Made (if any)
Skill tags: removed `Spatial Reasoning`.

#### Feedback
4/13: Skill tag corrected: dropped Spatial Reasoning (prompt is chart-reading/comparison, not relational layout reasoning).

---

### Annotation 4
- **Shadow Task:** ✅ submitted — [36a9e52a](shadows/36a9e52a.md)
- **Rating:** thumbs-up
- **Question:** MCQ — compare upper-half-IQR (median to Q3) for female vs male
- **Skills Tagged (original):** Attribute Perception, Spatial Reasoning, Logical Reasoning, Table/Chart/Graph Understanding, MCQ
- **Skills Tagged (revised):** Attribute Perception, Logical Reasoning, Table/Chart/Graph Understanding, MCQ
- **Question Type:** MCQ
- **Model Generated Answer:** B
- **Rewrite Answer:** C

#### Two-Part Check
1. **Question Check:**
   - Guidelines violated: none
   - Error types found: none
2. **Answer Check:**
   - Math verified: Female median→Q3 ≈44–46 = ~2–3mm; male median→Q3 ≈47–50 = ~3mm → approximately equal → C. Model chose B (male double female's), which is incorrect.
   - Model-stump: MODEL=B ≠ ANSWER=C ✓

#### Full Prompt
Look at the vertical space between the median line and the top edge of the box (Q3) for each group. This represents the upper half of the IQR. Compare this upper-half-IQR distance for the female group to the same distance for the male group. Which best describes the comparison?
A. The female upper-half-IQR is noticeably larger than the male's, but less than double its size
B. The male upper-half-IQR is approximately double the female's
C. Both upper-half-IQRs are approximately equal
D. The male upper-half-IQR is approximately triple the female's

#### Rewrite Answer
C

#### Edits Made (if any)
Skill tags: removed `Spatial Reasoning`.

#### Feedback
4/13: Skill tag corrected: dropped Spatial Reasoning (prompt is chart-reading/comparison, not relational layout reasoning).

---

### Annotation 5
- **Shadow Task:** ✅ submitted — [30f2f98b](shadows/30f2f98b.md)
- **Rating:** thumbs-up
- **Question:** MCQ — highest scatter point across entire chart: which group, and how far above that group's upper whisker tip
- **Skills Tagged (original):** Attribute Perception, Spatial Reasoning, Table/Chart/Graph Understanding, MCQ
- **Skills Tagged (revised):** Attribute Perception, Table/Chart/Graph Understanding, MCQ
- **Question Type:** MCQ
- **Model Generated Answer:** C
- **Rewrite Answer:** A

#### Two-Part Check
1. **Question Check:**
   - Guidelines violated: none
   - Error types found: none
2. **Answer Check:**
   - Math verified: Highest overall point is male (orange) at ≈59–60mm. Male IQR≈7, upper fence≈50+10.5=60.5 → whisker tip ≈59–60 (at last non-outlier). Scatter point sits ~0–1mm above whisker tip → A. Model chose C (male, 5–6mm), which would require whisker at ~54mm — inconsistent with Q3≈50 + IQR≈7.
   - Model-stump: MODEL=C ≠ ANSWER=A ✓

#### Full Prompt
Look at the scatter points above the upper whisker tip for each group. These are potential upper outliers. The highest scatter point across the entire chart belongs to which group, and approximately how far above that group's upper whisker tip does it sit?
A. Male group, approximately 0-1 mm above the whisker tip
B. Female group, approximately 3-4 mm above the whisker tip
C. Male group, approximately 5-6 mm above the whisker tip
D. Female group, approximately 0-1 mm above the whisker tip

#### Rewrite Answer
A

#### Edits Made (if any)
Skill tags: removed `Spatial Reasoning`.

#### Feedback
4/13: Skill tag corrected: dropped Spatial Reasoning (prompt is chart-reading/comparison, not relational layout reasoning).

---

## Task Status
- **Status:** QC_Complete
- **Reason:** All 5 annotations pass. Each stumps the model (MODEL ≠ ANSWER). Math/visual verified for all 5. Skill tags corrected: removed inflated Spatial Reasoning where prompts were chart-reading/comparison rather than relational layout reasoning; ensured Table/Chart/Graph Understanding is present where needed.
- **SA Applied (Cycle 1):** ✅ (legacy backfill 2026-04-18)

---

## Form-Fill Payload
Canonical payload for host jobs 2 (SA apply-review) and 3 (HAI shadow task). Host parses this section verbatim — do not reinterpret. Dumb executor.

```yaml
sa_task_filename: "Plot_T-test_graph_visualization_30.json"
sa_internal_task_id: "187109854"
sa_status_proposed: QC_Complete   # host STOPS before setting; human confirms

annotations:
  - n: 1
    sa:
      rating: thumbs_up
      skills_check:   []
      skills_uncheck: [Spatial Reasoning]
      prompt_edits: null
      answer_final: null
      feedback: "4/13: Skill tag corrected: dropped Spatial Reasoning (prompt is chart-reading/comparison, not relational layout reasoning)."
    hai:
      task_id_field: "Plot_T-test_graph_visualization_30.json"
      role: Reviewing
      annotation_n: 1
      prompt: "Look at the lowest scatter points for each group. Compare the lowest data point in the female group to the lowest data point in the male group. Which group has a lower minimum value, and at approximately what y-value does it sit?\nA. Female, at approximately 27 mm\nB. Male, at approximately 27 mm\nC. Female, at approximately 32 mm\nD. Male, at approximately 32 mm"
      image_ref: "screenshots/Plot_T-test_graph_visualization_30.png"
      answer: "C"

  - n: 2
    sa:
      rating: thumbs_up
      skills_check:   [Table/Chart/Graph Understanding]
      skills_uncheck: [Spatial Reasoning]
      prompt_edits: null
      answer_final: null
      feedback: "4/13: Skill tags corrected: dropped Spatial Reasoning (prompt is chart-reading/comparison, not relational layout reasoning) and added Table/Chart/Graph Understanding."
    hai:
      task_id_field: "Plot_T-test_graph_visualization_30.json"
      role: Reviewing
      annotation_n: 2
      prompt: "Examine the vertical whiskers extending from each box. The whiskers show the range of non-outlier data. Compare the length of the upper whisker (from Q3 to the whisker tip) for the female group to the length of the lower whisker (from Q1 to the whisker tip) for the male group. Which of the following best describes their relationship?\nA. The female upper whisker is approximately twice as long as the male lower whisker\nB. The male lower whisker is approximately twice as long as the female upper whisker\nC. They are approximately the same length\nD. The female upper whisker is only slightly larger, less than 1.2 times as long as the male lower whisker"
      image_ref: "screenshots/Plot_T-test_graph_visualization_30.png"
      answer: "A"

  - n: 3
    sa:
      rating: thumbs_up
      skills_check:   []
      skills_uncheck: [Spatial Reasoning]
      prompt_edits: null
      answer_final: null
      feedback: "4/13: Skill tag corrected: dropped Spatial Reasoning (prompt is chart-reading/comparison, not relational layout reasoning)."
    hai:
      task_id_field: "Plot_T-test_graph_visualization_30.json"
      role: Reviewing
      annotation_n: 3
      prompt: "Compare the upper whisker tip of the male box plot to the highest scatter point in the female group. Which sits higher on the y-axis, and approximately what is the vertical distance between them?\nA. The male upper whisker tip is higher, by approximately 3-4 mm\nB. The female's highest scatter point is higher, by approximately 3-4 mm\nC. The male upper whisker tip is higher, by approximately 1 mm\nD. They sit at approximately the same y-value"
      image_ref: "screenshots/Plot_T-test_graph_visualization_30.png"
      answer: "C"

  - n: 4
    sa:
      rating: thumbs_up
      skills_check:   []
      skills_uncheck: [Spatial Reasoning]
      prompt_edits: null
      answer_final: null
      feedback: "4/13: Skill tag corrected: dropped Spatial Reasoning (prompt is chart-reading/comparison, not relational layout reasoning)."
    hai:
      task_id_field: "Plot_T-test_graph_visualization_30.json"
      role: Reviewing
      annotation_n: 4
      prompt: "Look at the vertical space between the median line and the top edge of the box (Q3) for each group. This represents the upper half of the IQR. Compare this upper-half-IQR distance for the female group to the same distance for the male group. Which best describes the comparison?\nA. The female upper-half-IQR is noticeably larger than the male's, but less than double its size\nB. The male upper-half-IQR is approximately double the female's\nC. Both upper-half-IQRs are approximately equal\nD. The male upper-half-IQR is approximately triple the female's"
      image_ref: "screenshots/Plot_T-test_graph_visualization_30.png"
      answer: "C"

  - n: 5
    sa:
      rating: thumbs_up
      skills_check:   []
      skills_uncheck: [Spatial Reasoning]
      prompt_edits: null
      answer_final: null
      feedback: "4/13: Skill tag corrected: dropped Spatial Reasoning (prompt is chart-reading/comparison, not relational layout reasoning)."
    hai:
      task_id_field: "Plot_T-test_graph_visualization_30.json"
      role: Reviewing
      annotation_n: 5
      prompt: "Look at the scatter points above the upper whisker tip for each group. These are potential upper outliers. The highest scatter point across the entire chart belongs to which group, and approximately how far above that group's upper whisker tip does it sit?\nA. Male group, approximately 0-1 mm above the whisker tip\nB. Female group, approximately 3-4 mm above the whisker tip\nC. Male group, approximately 5-6 mm above the whisker tip\nD. Female group, approximately 0-1 mm above the whisker tip"
      image_ref: "screenshots/Plot_T-test_graph_visualization_30.png"
      answer: "A"
```

**Host contract:**
- Job 2 (SA apply-review) → parse `annotations[].sa`. STOP before `sa_status_proposed`.
- Job 3 (HAI shadow) → one shadow task per `annotations[].hai` entry. STOP before Submit + Confirm time.
- Image upload = `upload_file` MCP tool. All other fields = `form_input` / checkbox toggles.
