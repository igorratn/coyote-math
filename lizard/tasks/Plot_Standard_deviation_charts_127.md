# Review: Plot_Standard_deviation_charts_127

## Task Info
- **SA Task Filename:** `Plot_Standard_deviation_charts_127.json` (HAI shadow task "Task ID" field)
- **SA Internal Task ID:** 187109788 (numeric — from editor URL, cross-ref only)
- **Image:** `screenshots/Plot_Standard_deviation_charts_127.png` — Normal distribution (probability density) curve. Y-axis: Probability density 0.0–0.4 with major labeled gridlines at 0.0, 0.1, 0.2, 0.3, 0.4 and visible minor horizontal gridlines between them (including 0.05, 0.15, 0.25, etc.). X-axis: Standard deviation -4σ to 4σ. Three dashed horizontal lines: 68.3% (~y=0.24, just below 0.25), 95.4% (~y=0.06, just above 0.05), 99.7% (~y=0.01, just above 0.0).
- **Date:** 2026-04-13
- **Review Cycle:** 1st (status log empty)

## Annotations

### Annotation 1
- **Shadow Task:** ✅ submitted — [5b4fdbd0](shadows/5b4fdbd0.md)
- **Rating:** thumbs-up
- **Question:** MCQ — count of horizontal gridlines strictly between the 68.3% and 95.4% dashed lines
- **Skills Tagged (revised):** Enumeration, Table/Chart/Graph Understanding, MCQ
- **Skills Tagged (original):** Enumeration, Spatial Reasoning, Table/Chart/Graph Understanding, MCQ
- **Question Type:** MCQ
- **Model Generated Answer:** C
- **Rewrite Answer:** D

#### Two-Part Check
1. **Question Check:**
   - Guidelines violated: none
   - Error types found: none
2. **Answer Check:**
   - Math verified: visible horizontal gridlines strictly between the 95.4% line (~y=0.06) and the 68.3% line (~y=0.24) are at y=0.10, y=0.15, and y=0.20. Count = 3 = D. Annotator's answer is correct.
   - Model-stump: MODEL=C ≠ ANSWER=D ✓

#### Full Prompt
How many horizontal gridlines lie strictly between the 68.3% dashed line and the 95.4% dashed line?
A. 0
B. 1
C. 2
D. 3

#### Rewrite Answer
D

#### Edits Made (if any)
Skill tags: removed `Spatial Reasoning` (chart-value reading is Table/Chart/Graph Understanding, not spatial layout reasoning).

#### Feedback
4/13: Skill tag corrected: dropped Spatial Reasoning (chart-value reading is Table/Chart/Graph Understanding, not spatial layout reasoning). Answer D is correct because the chart shows three visible horizontal gridlines strictly between the dashed lines (0.10, 0.15, 0.20).

---

### Annotation 2
- **Shadow Task:** ✅ submitted — [72d76f15](shadows/72d76f15.md)
- **Rating:** thumbs-up
- **Question:** MCQ — relationship between 95.4% dashed line and nearest horizontal gridline
- **Skills Tagged (revised):** Logical Reasoning, Table/Chart/Graph Understanding, MCQ
- **Skills Tagged (original):** Spatial Reasoning, Logical Reasoning, Table/Chart/Graph Understanding, MCQ
- **Question Type:** MCQ
- **Model Generated Answer:** D
- **Rewrite Answer:** B

#### Two-Part Check
1. **Question Check:**
   - Guidelines violated: none
   - Error types found: none
2. **Answer Check:**
   - Math verified: 95.4% line at ~y=0.06. Nearest visible horizontal gridline is the minor gridline at y=0.05 (distance ~0.01), not y=0.10 (distance ~0.04). The dashed line sits just above the 0.05 gridline → B. ✓
   - Model-stump: MODEL=D ≠ ANSWER=B ✓

#### Full Prompt
Which of the following correctly describes the relationship between the 95.4% dashed line and the nearest horizontal gridline?
A. It coincides exactly with the 0.10 gridline
B. It sits just above the 0.05 gridline
C. It sits just below the 0.10 gridline
D. It coincides exactly with the 0.05 gridline

#### Rewrite Answer
B

#### Edits Made (if any)
Skill tags: removed `Spatial Reasoning`.

#### Feedback
4/13: Skill tag corrected: dropped Spatial Reasoning (position-reading from chart is Table/Chart/Graph Understanding, not spatial layout reasoning). Answer B is correct because the nearest visible horizontal gridline is the minor 0.05 gridline, and the 95.4% dashed line sits just above it.

---

## Task Status
- **Status:** QC_Complete
- **Reason:** Both annotations pass. A1 correctly counts all visible horizontal gridlines (including minor gridlines) strictly between the dashed lines, giving D=3. A2 correctly identifies the nearest visible horizontal gridline as the minor 0.05 line, so B is correct.
- **SA Applied (Cycle 1):** ✅ (legacy backfill 2026-04-18)

---

## Form-Fill Payload
Canonical payload for host jobs 2 (SA apply-review) and 3 (HAI shadow task). Host parses this section verbatim — do not reinterpret. Dumb executor.

```yaml
sa_task_filename: "Plot_Standard_deviation_charts_127.json"   # HAI Task ID field
sa_internal_task_id: "187109788"                               # SA URL numeric id (cross-ref)
sa_status_proposed: QC_Complete   # host STOPS before setting; human confirms

annotations:
  - n: 1
    sa:
      rating: thumbs_up
      skills_check:   []
      skills_uncheck: [Spatial Reasoning]
      prompt_edits: null
      answer_final: "D"
      feedback: "4/13: Skill tag corrected: dropped Spatial Reasoning (chart-value reading is Table/Chart/Graph Understanding, not spatial layout reasoning). Answer D is correct because the chart shows three visible horizontal gridlines strictly between the dashed lines (0.10, 0.15, 0.20)."
    hai:
      task_id_field: "Plot_Standard_deviation_charts_127.json"
      role: Reviewing
      annotation_n: 1
      prompt: "How many horizontal gridlines lie strictly between the 68.3% dashed line and the 95.4% dashed line?\nA. 0\nB. 1\nC. 2\nD. 3"
      image_ref: "screenshots/Plot_Standard_deviation_charts_127.png"
      answer: "D"

  - n: 2
    sa:
      rating: thumbs_up
      skills_check:   []
      skills_uncheck: [Spatial Reasoning]
      prompt_edits: null
      answer_final: "B"
      feedback: "4/13: Skill tag corrected: dropped Spatial Reasoning (position-reading from chart is Table/Chart/Graph Understanding, not spatial layout reasoning). Answer B is correct because the nearest visible horizontal gridline is the minor 0.05 gridline, and the 95.4% dashed line sits just above it."
    hai:
      task_id_field: "Plot_Standard_deviation_charts_127.json"
      role: Reviewing
      annotation_n: 2
      prompt: "Which of the following correctly describes the relationship between the 95.4% dashed line and the nearest horizontal gridline?\nA. It coincides exactly with the 0.10 gridline\nB. It sits just above the 0.05 gridline\nC. It sits just below the 0.10 gridline\nD. It coincides exactly with the 0.05 gridline"
      image_ref: "screenshots/Plot_Standard_deviation_charts_127.png"
      answer: "B"
```

**Host contract:**
- Job 2 (SA apply-review) → parse `annotations[].sa`. STOP before `sa_status_proposed`.
- Job 3 (HAI shadow) → one shadow task per `annotations[].hai` entry. STOP before Submit + Confirm time.
- Image upload = `upload_file` MCP tool. All other fields = `form_input` / checkbox toggles.
