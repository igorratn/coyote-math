# Review: Report_Dashboard_Stakeholder_Dashboard_90

## Task Info
- **task_id:** 185556110
- **SA_TASK_FILENAME:** Report_Dashboard_Stakeholder_Dashboard_90.json
- **Image:** screenshots/Report_Dashboard_Stakeholder_Dashboard_90.png — (description)
- **Date:** 2026-04-26
- **Review Cycle:** 1st
- **Task QC Status:** QC_Return

## Task Status
- **Status:** ALL-AUTO-RESOLVED
- **Reviewers fired:** gpt, opus
- **Summary:** 0 pending Igor, 1 auto-resolved, 0 no-reviewer-output, 0 unchanged-carry-forward (of 1 total)
- **SA Applied (Cycle 1):** ✅

---

## Annotation 1

- **Shadow Task:** ✅ submitted (cycle 1) — [0b395fff](shadows/0b395fff.md)
- **Reviewer:** gpt
- **Rating:** thumbs-down
- **All Verdicts:** gpt: 👎 (picked), opus: 👎
- **Flags:** [G1, Type 7]
- **Final Answer (reviewer):** N/A — prompt invalid
- **Skills Tagged:** Enumeration, Attribute Perception, Table/Chart/Graph Understanding
- **Question Type:** SAQ
- **Model Answer:** 3
- **Annotator Answer:** 4

#### Full Prompt
How many red-filled circles are used in this picture? Answer in an integer.

#### Rewrite Answer (annotator)
4

#### Reviewer Body (gpt) (picked)
- **Rating:** thumbs-down
- **Final Rewrite Answer:** N/A — prompt invalid
- **Flags:** [G1, Type 7]
- **Two-Part Check:**
  1. Question: G1 fail (Complexity/anchor skill). The task is pure enumeration/attribute perception (“How many red-filled circles…”) with no Logical Reasoning, Table/Chart/Graph Understanding, or World Knowledge required. It violates the V6 anchor-skill rule. Also Type 7 (unclear counting boundaries): “red-filled circles” could include (a) only the three red map location dots, or (b) those plus the red-highlighted point in the EMEA sparkline. Both interpretations are reasonable from the same image, so multiple answers are defensible.
  2. Answer: Counting all red-filled circles in the image yields at least 4: three red location dots on the world map (San Francisco, Paris, Melbourne) + one red-highlighted point in the EMEA Revenue Trend sparkline = 4 [pixel-verified; see Read-First “Additional visual facts”]. The model answer 3 corresponds to counting only the three map markers, which is also plausible under the ambiguous prompt.
- **Edits Made:** None
- **Feedback:** The prompt needs clearer scope and an anchor skill. Specify exactly which objects to count to remove ambiguity, e.g., “On the world map only, how many red circular location markers are shown?” (answer: 3). Alternatively, if you intend all panels: “Across the entire dashboard, how many red-filled circular markers (including map pins and highlighted chart points) are visible?” (answer: 4). Also consider adding a reasoning element (e.g., compare counts across regions) to meet V6.

#### Reviewer Body (opus)
- **Rating:** thumbs-down
- **Final Rewrite Answer:** N/A — prompt invalid
- **Flags:** [G1, Type 7, Type 12]
- **Two-Part Check:**
  1. Question: **G1 V6 fail** — prompt is pure counting / extraction ("how many red-filled circles"). Even with TCG tagged, the task does not engage chart semantics — it treats the dashboard as a collection of shapes to count. No Logical Reasoning, no genuine chart understanding, no World Knowledge. V6 non-extraction ban applies. **Type 7** — "red-filled circles" has unclear boundaries: do the 3 map pin dots count? The 3 peak highlight dots on the revenue line charts? Highlighted regions in the sidebar mini-map? Reasonable counters could land on 3, 6, or more. **Type 12** — the "red" color in this dark-themed dashboard is actually coral/salmon (the same hue is used for both pins and chart peaks); a strict reader could argue these are not "red". No precise color anchor (legend entry) defines what counts. Combination = ambiguous, non-stump-worthy counting task.
  2. Answer: cannot answer deterministically [pixel-verified — colors ambiguous]. Possible counts: 3 (map pins only) [pixel-verified], 6 (map pins + chart peak dots) [pixel-verified]. Annotator's answer not stated in skeleton; model said 3 (counting only map pins). The fact that 3 is a defensible answer means the prompt is solvable for the model under the most natural reading — Type 2 risk.
- **Edits Made:** None — recommend rewrite from scratch with explicit boundaries (e.g., "How many cities are marked with red pins on the world map?" — but that's a giveaway extraction; better: replace with a chart-reading question on one of the revenue trend lines that requires anchor-skill reasoning).
- **Feedback:** 2026-04-27 — Prompt fails V6 anchor-skill rule (G1): pure counting without meaningful chart-content reasoning. Also fails Type 7 (boundaries unclear — do peak-marker dots on the trend charts count? sidebar mini-map highlights?) and Type 12 (the markers are coral, not unambiguously "red"). Rewrite to engage chart semantics — e.g., comparison of the 3 regional revenue trends, or a derived metric across the dashboard panels — rather than counting shape instances.

**Auto-resolved at Job 2 (👎).** All 2 reviewers 👎 with G1 (V6 anchor-skill fail). SA action at Job 3b: **QC_Return** (cycle 1). Skipped at Job 3a.

#### Edits Made
(to be filled at Job 3a if needed)

#### Feedback
2026-04-26: thumbs-down (gpt) — auto-resolved

---
## Form-Fill Payload

```yaml
task:
  stem: Report_Dashboard_Stakeholder_Dashboard_90
  sa_task_filename: Report_Dashboard_Stakeholder_Dashboard_90.json
  cycle: 1
  qc_status: QC_Return  # cycle-1 only; set in SA task list after per-annot push

annotations:

  - n: 1
    resolution: auto-resolved
    sa:
      rating: thumbs-down
      answer_final: "N/A — prompt invalid"
      flags: [G1, Type 7]
    hai:
      task_id_field: Report_Dashboard_Stakeholder_Dashboard_90.json
      role: Reviewing
      annotation_n: 1
      prompt: |
        How many red-filled circles are used in this picture? Answer in an integer.
      answer: "4"
```
