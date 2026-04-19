# Review: Report_Dashboard_Capacity_Dashboard_174

## Task Info
- **SA Task Filename:** `Report_Dashboard_Capacity_Dashboard_174.json` (HAI shadow task "Task ID" field)
- **SA Internal Task ID:** 187110203 (numeric — from editor URL, cross-ref only)
- **Image:** `screenshots/Report_Dashboard_Capacity_Dashboard_174.png` — Planning Gantt chart (Sep 2023–Feb 2024) with team rows: Customer Success, Game Design (GD-11, GD-12 labeled tasks), Luna Dev Team, Learning; plus a sidebar showing "+40%/+45% (3 months)" and "+80%/+75% (6 months)" adoption metrics.
- **Date:** 2026-04-16
- **Review Cycle:** 2nd (annotator revised A2 prompt 2026-04-16; model re-ran same day)

## Annotations

### Annotation 1
- **Shadow Task:** ✅ submitted — [d7a06847](shadows/d7a06847.md)
- **Rating:** thumbs-up
- **Question:** SAQ — count of unique colors in Luna Dev Team Gantt track task blocks
- **Skills Tagged (original):** Enumeration, Attribute Perception, Table/Chart/Graph Understanding, Short answer question
- **Skills Tagged (revised):** Enumeration, Attribute Perception, Table/Chart/Graph Understanding, Short answer question
- **Question Type:** SAQ
- **Model Generated Answer:** 3
- **Rewrite Answer:** 2

#### Two-Part Check
1. **Question Check:**
   - Guidelines violated: none
   - Error types found: none. Single track with distinct color blocks. CMW passed.
2. **Answer Check:**
   - Math verified: Luna Dev Team track shows orange blocks (September area) and pink/salmon blocks (October–December). Two distinct colors ✓. Model got 3 (likely counted an additional shade). Stumped ✓.

#### Full Prompt
Examine the scheduled timeline for the "Luna Dev Team" in the Gantt chart. Count the number of unique colors used to fill the task blocks within its single horizontal track. Answer in a single number (e.g., 2).

#### Rewrite Answer
2

#### Edits Made (if any)
None.

#### Feedback
N/A

---

### Annotation 2
- **Shadow Task:** ✅ submitted — [a89603cd](shadows/a89603cd.md)
- **Rating:** thumbs-up
- **Question:** SAQ — count of all distinctly colored contiguous segments in Customer Success and Game Design Gantt tracks combined (thick bars only, not thin progress lines)
- **Skills Tagged (original):** Enumeration, Attribute Perception, Spatial Reasoning, Table/Chart/Graph Understanding, Short answer question
- **Skills Tagged (revised):** Enumeration, Attribute Perception, Spatial Reasoning, Table/Chart/Graph Understanding, Short answer question
- **Question Type:** SAQ
- **Model Generated Answer:** 2 (re-run 2026-04-16)
- **Rewrite Answer:** 11

#### Two-Part Check
1. **Question Check:**
   - Guidelines violated: none
   - Error types found: none. Annotator revised prompt on 2026-04-16, adding explicit rule: "A month-boundary gridline visually crossing a same-color bar does NOT split it — only color changes define segment boundaries." Also explicitly excludes GD-11 and GD-12 purple sub-task blocks. Ambiguity from 1st cycle fully resolved.
2. **Answer Check:**
   - Math verified: color-only counting (explicit rule now in prompt): GD = 4 segments (gray, dark orange, pale orange, dark orange run → stops at Nov-ish), CS = 7 segments. Total = **11** ✓. Model got 2 — stumped ✓.

#### Full Prompt
Examine the Gantt chart and locate the horizontal tracks for both the 'Customer Success' team and the 'Game Design' team (the team immediately below Customer Success). Focus strictly on the main, thick horizontal task blocks within these two tracks. Count every distinctly colored, contiguous segment that makes up these main thick bars. You must include all segments (including the pale orange ones), but you must strictly adhere to the following rules: A month-boundary gridline visually crossing a same-color bar does NOT split it—only color changes define segment boundaries. Explicitly exclude the smaller GD-11 and GD-12 purple sub-task blocks from your count. Do not count any of the thin progress lines located underneath the main bars. What is the total combined number of these distinct colored segments across both the Customer Success and Game Design main rows? Provide your answer strictly as a single integer with no additional text or punctuation (ex. 5).

#### Rewrite Answer
11

#### Edits Made (if any)
None (annotator revised prompt; our 1st-cycle feedback was addressed).

#### Feedback
N/A

---

## Task Status
- **Status:** QC_Complete
- **Reason:** Both thumbs-up. A2 prompt revised by annotator on 2nd cycle — ambiguity resolved, model stumped (got 2, correct is 11).
- **SA Applied (Cycle 1):** ✅ (legacy backfill 2026-04-18)

---

## Form-Fill Payload
Canonical payload for host jobs 2 (SA apply-review) and 3 (HAI shadow task). Host parses this section verbatim — do not reinterpret. Dumb executor.

```yaml
sa_task_filename: "Report_Dashboard_Capacity_Dashboard_174.json"
sa_internal_task_id: "187110203"
sa_status_proposed: QC_Complete   # host STOPS before setting; human confirms

annotations:
  - n: 1
    sa:
      rating: thumbs-up
      skills_check:   []
      skills_uncheck: []
      prompt_edits: null
      answer_final: "2"
      feedback: null
    hai:
      task_id_field: "Report_Dashboard_Capacity_Dashboard_174.json"
      role: Reviewing
      annotation_n: 1
      prompt: "Examine the scheduled timeline for the \"Luna Dev Team\" in the Gantt chart. Count the number of unique colors used to fill the task blocks within its single horizontal track. Answer in a single number (e.g., 2)."
      image_ref: "screenshots/Report_Dashboard_Capacity_Dashboard_174.png"
      answer: "2"
  - n: 2
    sa:
      rating: thumbs-up
      skills_check:   []
      skills_uncheck: []
      prompt_edits: null
      answer_final: "11"
      feedback: "4/16 (2): Prompt revised — explicit gridline rule added (month-boundary does not split same-color bar) and GD-11/GD-12 exclusion specified. Ambiguity from 1st cycle resolved. Approved."
    hai:
      task_id_field: "Report_Dashboard_Capacity_Dashboard_174.json"
      role: Reviewing
      annotation_n: 2
      prompt: "Examine the Gantt chart and locate the horizontal tracks for both the 'Customer Success' team and the 'Game Design' team (the team immediately below Customer Success). Focus strictly on the main, thick horizontal task blocks within these two tracks. Count every distinctly colored, contiguous segment that makes up these main thick bars. You must include all segments (including the pale orange ones), but you must strictly adhere to the following rules: A month-boundary gridline visually crossing a same-color bar does NOT split it—only color changes define segment boundaries. Explicitly exclude the smaller GD-11 and GD-12 purple sub-task blocks from your count. Do not count any of the thin progress lines located underneath the main bars. What is the total combined number of these distinct colored segments across both the Customer Success and Game Design main rows? Provide your answer strictly as a single integer with no additional text or punctuation (ex. 5)."
      image_ref: "screenshots/Report_Dashboard_Capacity_Dashboard_174.png"
      answer: "11"
```

**Host contract:**
- Job 2 (SA apply-review) → parse `annotations[].sa`. STOP before `sa_status_proposed`.
- Job 3 (HAI shadow) → one shadow task per `annotations[].hai` entry. STOP before Submit + Confirm time.
- Image upload = `upload_file` MCP tool. All other fields = `form_input` / checkbox toggles.
