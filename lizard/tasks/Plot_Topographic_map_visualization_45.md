# Review: Plot_Topographic_map_visualization_45

## Task Info
- **task_id:** 187833741
- **SA_TASK_FILENAME:** Plot_Topographic_map_visualization_45.json
- **Image:** screenshots/Plot_Topographic_map_visualization_45.png — (description)
- **Date:** 2026-05-01
- **Review Cycle:** 1st
- **Task QC Status:** TBD

## Task Status
- **Status:** ALL-PENDING-IGOR
- **Reviewers fired:** opus, gpt, grok
- **Summary:** 1 pending Igor, 0 auto-resolved, 0 no-reviewer-output, 0 unchanged-carry-forward (of 1 total)

---

## Annotation 1

- **Reviewer:** gpt
- **Rating:** thumbs-up
- **All Verdicts:** opus: 👎, gpt: 👍 (picked), grok: 👎
- **Flags:** [Type 6]
- **Final Answer (reviewer):** 1200
- **Skills Tagged:** Spatial Reasoning, Logical Reasoning, Table/Chart/Graph Understanding
- **Question Type:** SAQ
- **Model Answer:** 1400
- **Annotator Answer:** -1600

#### Full Prompt
According to all of the elevation marking point values, subtract the highest elevation from the lowest elevation, what is the solution value? Answer with a numerical value (e.g., 1200).

#### Rewrite Answer (annotator)
-1600

#### Reviewer Body (opus)
- **Rating:** thumbs-down
- **Final Rewrite Answer:** N/A — prompt invalid (G5)
- **Flags:** [G5]
- **Two-Part Check:**
  1. Question: G5 fail — the format hint `(e.g., 1200)` is itself the correct answer to the question. With labeled markings 1600'…2800', the prompt resolves to 2800 − 1600 = 1200; the example placeholder leaks the solution to the model. Pattern matches the format-leakage rule (codified 2026-04-28). The example should use a clearly-not-the-answer placeholder.
  2. Answer: Highest labeled = 2800' [pixel-verified]; lowest labeled = 1600' [pixel-verified]. 2800 − 1600 = 1200. Model answered 1400 (stump holds — model differs from correct 1200), but stump alone does not save a G5 prompt. Note Type 11-style risk also worth flagging in revision: "elevation marking point values" is unambiguous (= labeled contour values) only because the map has no spot-elevation triangles; if redesigned, keep that distinction explicit.
- **Edits Made:** None (prompt requires placeholder swap; not a per-skill / per-answer edit. Skill tags also off — Spatial Reasoning is just label reading here, Math Reasoning + Enumeration better fit — but moot under QC_Return.)
- **Feedback:** 5/1: Format example `(e.g., 1200)` equals the correct answer (2800 − 1600 = 1200) — the placeholder telegraphs the solution. Replace with a clearly-non-answer placeholder such as `(e.g., 850)`.

#### Reviewer Body (gpt) (picked)
- **Rating:** thumbs-up
- **Final Rewrite Answer:** 1200
- **Flags:** [Type 6]
- **Two-Part Check:**
  1. Question: Self-contained and solvable by reading the elevation labels. However, wording is direction-ambiguous: “subtract the highest elevation from the lowest elevation” could mean lowest − highest (negative) or the absolute range. Flagging Type 6 (difference direction ambiguity).
  2. Answer: From the map, highest labeled elevation = 2800 [pixel-verified; Read-First]. Lowest labeled elevation = 1600 [pixel-verified; Read-First]. Absolute difference (range) = 2800 − 1600 = 1200. [pixel-verified]
- **Edits Made:** None
- **Feedback:** N/A

Fix List
- Annotation 1 — Direction of subtraction is ambiguous (“subtract the highest from the lowest”) — clarify to “compute the absolute difference between the highest and lowest elevations (range).”

#### Reviewer Body (grok)
- **Rating:** thumbs-down
- **Final Rewrite Answer:** N/A — prompt invalid
- **Flags:** [G5]
- **Two-Part Check:**
  1. Question: Fails G5 (giveaway) — the format example "(e.g., 1200)" directly leaks the correct numerical answer (2800 - 1600 = 1200), telegraphing the solution as part of the prompt body. Passes other guidelines: G1 (requires spatial scanning of map to locate elevations [Spatial Reasoning], identification of max/min [Logical Reasoning], interpretation of topographic visualization [Table/Chart/Graph Understanding] — includes ≥1 anchor skill and 3 skills total). G2 (single deterministic numerical answer with explicit closing instruction). G3 (self-contained; "elevation marking point values" are directly readable as labeled numbers on contours, no specialized topo expertise needed beyond general world knowledge of maps). G4 (independent). No error types beyond the G5 issue (e.g., no Type 2 as model answered incorrectly with 1400 vs correct 1200; no Type 3 as labels are clearly readable in quadrant crops, e.g., 2800' in top-right, 1600' in bottom-left and bottom-right).
  2. Answer: Highest visible elevation label = 2800' (top-right quadrant, on contour line) [pixel-verified]. Lowest visible elevation labels = 1600' (bottom-left quadrant near road, and bottom-right quadrant near 733) [pixel-verified]. Difference: 2800 - 1600 = 1200 [math: subtraction]. Matches expected value from Read-First (Y range: low≈1600', high≈2800'). Model answered 1400 (differs, so stumped). Annotator's answer not provided in skeleton, but independent verification confirms 1200 as correct (prompt invalidates the annotation regardless).
- **Edits Made:** None
- **Feedback:** 5/1: Prompt fails G5 — format example "(e.g., 1200)" leaks the correct answer (highest 2800' minus lowest 1600' = 1200). Rewrite prompt to remove or change the example value.

**Pending Igor at Job 3.** Reviewer verdicts above are advisory; Igor decides 👍/👎. (cycle 1: 👎 → QC_Return; 👍 → approve)

#### Edits Made
(to be filled at Job 3 if needed)

#### Igor Verdict
rating: thumbs-up
final_answer: -1600
source: custom
skills_check: [Math Reasoning]
skills_uncheck: [Spatial Reasoning, Logical Reasoning]
notes: Annotator's -1600 is correct. Prompt says "subtract the highest from the lowest" = lowest − highest; with lowest 1200' and highest 2800', 1200 − 2800 = -1600. Model stumped (answered 1400). Reviewer GPT read absolute range (1200) — wrong direction. Skill corrections retained: dropped Spatial Reasoning (label reading, not relational spatial) and Logical Reasoning (arithmetic is Math); added Math Reasoning.

#### Feedback
5/1: Skill tags corrected: dropped Spatial Reasoning (label reading is navigational, not relational) and Logical Reasoning (subtraction is Math, not chained inference); added Math Reasoning.

---
