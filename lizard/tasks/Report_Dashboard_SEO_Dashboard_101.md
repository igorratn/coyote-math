# Review: Report_Dashboard_SEO_Dashboard_101.json

## Task Info
- **SA Task Filename:** `Report_Dashboard_SEO_Dashboard_101.json`
- **SA Internal Task ID:** 187111181
- **Image:** SEO dashboard — two panels: "Top Channels" pie chart (Direct 86.3%, Paid Search 8.5%, Display 5%, Affiliates unlabeled thin sliver) and "Users" line graph (7 blue data points, x-axis Mar 15–Mar 20 plus one unlabeled dot at "...")
- **Date:** 2026-04-17
- **Review Cycle:** 1st

## Annotations

### Annotation 1
- **Shadow Task:** ✅ submitted (cycle 1) — [e8daaabd](shadows/e8daaabd.md)
- **Rating:** thumbs-down
- **Question:** Divide largest pie slice % by smallest pie slice %, then divide by total letters in entire image; answer to 4 decimal places
- **Skills Tagged:** Enumeration, Attribute Perception, Math Reasoning, Table/Chart/Graph Understanding
- **Question Type:** SAQ
- **Model Generated Answer:** 0.2615

#### Two-Part Check
1. **Question Check:**
   - Guidelines violated: G2 (single verifiable answer at risk)
   - Error types found: Type 1 — "smallest slice" is ambiguous. Affiliates slice has no visible % label. Two defensible interpretations: (a) smallest labeled slice = Display at 5%; (b) Affiliates = 100−86.3−8.5−5 = 0.2% (computed, not labeled). Gives answers 0.2397 vs. ~5.99 (0.863/0.002/72) — not a minor difference. Fix: "smallest labeled slice" or name it explicitly.
2. **Answer Check:**
   - Math verified: yes — largest = Direct = 86.3% = 0.863; smallest labeled = Display = 5% = 0.05; ratio = 0.863/0.05 = 17.26. Letters: Top Channels(11) + Direct(6) + Paid Search(10) + Display(7) + Affiliates(10) + Users×2(10) + Mar×6(18) = 72. 17.26/72 = 0.23972 → 0.2397 ✓
   - Answer correct: yes — 0.2397 is correct given smallest labeled slice = 5%, letter count = 72. But question has Type 1 violation.

#### Full Prompt
Divide the percentage of the largest slice in the "Top Channels" pie chart by the percentage of the smallest slice (treat the percentages as decimals). Divide that division by the total number of letters in the entire image (including axis labels, abbreviations every letter). Give your answer rounded to 4 decimal places (e.g., 1.2345).

#### Rewrite Answer
0.2397

#### Edits Made (if any)
None

#### Feedback
4/17: Type 1 — "smallest slice" is ambiguous. The Affiliates slice has no visible percentage label. A solver could use 5% (Display, smallest labeled) or compute ~0.2% (Affiliates, 100−86.3−8.5−5). These produce completely different answers (~0.2397 vs. ~5.99). Fix: specify "smallest labeled slice" or name the slice explicitly (e.g., "the Display slice (5%)").

---

### Annotation 2
- **Shadow Task:** ✅ submitted (cycle 1, manual) — [bbd584f1](shadows/bbd584f1.md)
- **Rating:** thumbs-up
- **Question:** Count blue data points in line graph; divide by mean of x-axis numeric values; answer to 3 decimal places
- **Skills Tagged:** Enumeration, Attribute Perception, Math Reasoning, Table/Chart/Graph Understanding
- **Question Type:** SAQ
- **Model Generated Answer:** 0.343

#### Two-Part Check
1. **Question Check:**
   - Guidelines violated: none
   - Error types found: none — "blue data points" unambiguous (single color). "Values written on the x axis (e.g., 15 in Mar 15)" clearly specifies numeric portion. Rounding explicit. G1 met (Enumeration + Math + Attribute Perception + TCG). Model missed dot at "..." position — that is the stump mechanism, not a question defect.
2. **Answer Check:**
   - Math verified: yes — x-axis values: {15, 16, 17, 18, 19, 20}, mean = 105/6 = 17.5. Blue dots: 7 (one at "..." + six at Mar 15–20). 7/17.5 = 0.400 ✓. Model counted 6 (missed first): 6/17.5 = 0.343 — model stumped.
   - Answer correct: yes — 0.400

#### Full Prompt
Count the total number of blue data points in the line graph. Take that number and divide it by the mean of the values written on the x axis (e.g., 15 in Mar 15). What is the result? Give your answer rounded to 3 decimal places (e.g., 1.223).

#### Rewrite Answer
0.400

#### Edits Made (if any)
None

#### Feedback
N/A

---

## Task Status
- **Status:** QC_Return
- **Reason:** A1 thumbs-down
- **SA Applied (Cycle 1):** ✅
- **SA Status Set By Human:** QC_Return (2026-04-17)
- **Derivation match:** yes — Type 1 violation ("smallest slice" ambiguous; Affiliates has no visible % label). A2 clean thumbs-up.

---

## Form-Fill Payload

```yaml
task_id: 187111181
annotations:
  - n: 1
    sa:
      rating: thumbs-down
      skills_check: []
      skills_uncheck: []
      prompt_edits: null
      answer_final: null
      feedback: "4/17: Type 1 — \"smallest slice\" is ambiguous. The Affiliates slice has no visible percentage label. A solver could use 5% (Display, smallest labeled) or compute ~0.2% (Affiliates, 100−86.3−8.5−5). These produce completely different answers (~0.2397 vs. ~5.99). Fix: specify \"smallest labeled slice\" or name the slice explicitly (e.g., \"the Display slice (5%)\")."
    hai:
      task_id_field: Report_Dashboard_SEO_Dashboard_101.json
      role: Reviewing
      annotation_n: 1
      prompt: |
        Divide the percentage of the largest slice in the "Top Channels" pie chart by the percentage of the smallest slice (treat the percentages as decimals). Divide that division by the total number of letters in the entire image (including axis labels, abbreviations every letter). Give your answer rounded to 4 decimal places (e.g., 1.2345).
      answer: "0.2397"

  - n: 2
    sa:
      rating: thumbs-up
      skills_check: []
      skills_uncheck: []
      prompt_edits: null
      answer_final: null
      feedback: null
    hai:
      task_id_field: Report_Dashboard_SEO_Dashboard_101.json
      role: Reviewing
      annotation_n: 2
      prompt: |
        Count the total number of blue data points in the line graph. Take that number and divide it by the mean of the values written on the x axis (e.g., 15 in Mar 15). What is the result? Give your answer rounded to 3 decimal places (e.g., 1.223).
      answer: "0.400"
```
