# Review: Plot_Standard_deviation_charts_35

## Task Info
- **SA Task Filename:** `Plot_Standard_deviation_charts_35.json` (HAI shadow task "Task ID" field)
- **SA Internal Task ID:** 187109791 (numeric — from editor URL, cross-ref only)
- **Image:** `screenshots/Plot_Standard_deviation_charts_35.png` — Normal distribution curve with labeled cumulative regions: P(|Z|<1)=0.6826, P(|Z|<2)=0.9544, P(|Z|<3)=0.9974.
- **Date:** 2026-04-13
- **Review Cycle:** 2nd (status log: Tolulope 2026-04-13 Submit_to_QC; Igor 2026-04-14 QC_Return; Tolulope 2026-04-15 QualityCheck)

## Annotations

### Annotation 1
- **Shadow Task:** ✅ submitted — [7021c9f7](shadows/7021c9f7.md)
- **Rating:** thumbs-down
- **Question:** MCQ — conditional probability: proportion of values outside ±1σ that lie between ±1σ and ±2σ
- **Skills Tagged (original):** Math Reasoning, Logical Reasoning, Table/Chart/Graph Understanding, MCQ
- **Skills Tagged (revised):** Math Reasoning, Logical Reasoning, Table/Chart/Graph Understanding, MCQ
- **Question Type:** MCQ
- **Model Generated Answer:** C
- **Rewrite Answer:** C

#### Two-Part Check
1. **Question Check:**
   - Guidelines violated: none
   - Error types found: none
2. **Answer Check:**
   - Math verified: P(1<|Z|<2) = 0.9544 − 0.6826 = 0.2718. P(|Z|>1) = 1 − 0.6826 = 0.3174. Conditional = 0.2718 / 0.3174 = 0.856 = C. Annotator's answer correct.
   - Model-stump: MODEL=C = ANSWER=C → prompt failed to stump model → **thumbs-down**.

#### Full Prompt
The figure shows a normal distribution with labeled cumulative regions:

P(∣Z∣<1)=0.6826
P(∣Z∣<2)=0.9544
P(∣Z∣<3)=0.9974

Question

Given that a value lies outside ±1 standard deviation, what proportion of those values lie between ±1 and ±2 standard deviations?

Options

A. 0.272
B. 0.317
C. 0.856
D. 0.954

Answer with the correct option letter only (e.g., A)

#### Rewrite Answer
C

#### Edits Made (if any)
None.

#### Feedback
4/13: Model answered correctly (C = 0.856). Prompt did not stump the model. Revise the question so the model answers incorrectly — e.g., ask something that requires a less obvious conditional probability setup or a different reading of the chart.

---

## Task Status
- **Status:** QC_Return
- **Reason:** A1 failed stump rule — MODEL=C=ANSWER=C. Single annotation, thumbs-down → return to annotator.
- **SA Applied (Cycle 1):** ✅ (legacy backfill 2026-04-18)

---

## Cycle 2 Review (2026-04-15)

### Annotation 1 — Cycle 2
- **Shadow Task (cycle 2):** ✅ submitted — [30c2244c](shadows/30c2244c.md)
- **New prompt:** "A value is known to lie within ±3 standard deviations but outside ±1 standard deviation. What proportion of such values lie between ±2 and ±3 standard deviations?" (options A=0.043, B=0.135, C=0.137, D=0.315)
- **Model answer:** C
- **Rewrite answer:** C
- **Stumped:** false (still)
- **Math verified:** P(2<|Z|<3)/P(1<|Z|<3) = 0.0430/0.3148 = 0.1366 → 0.137 = C ✓. Model correct again.
- **Decision:** DELETE. 2nd pass = approve or delete only. Annotator changed question but model nails conditional probability from labeled chart values regardless. No fix that would stump this model without creating a fundamentally different question. Chart visually shows 68.26%/95.44%/99.74% — model reads these even if not given in text.
- **SA action:** No rating, no feedback. Human deletes manually.

## Task Status (Cycle 2)
- **Status:** QC_Complete
- **Reason:** Only annotation deleted (cycle 2 = approve-or-delete; annotator failed to stump model on both cycles). Deleted annotation doesn't block completion — reviewer's work is done. Skipped reserved for outside-domain/blocked tasks.

---

## Form-Fill Payload
Canonical payload for host jobs 2 (SA apply-review) and 3 (HAI shadow task). Host parses this section verbatim — do not reinterpret. Dumb executor.

```yaml
sa_task_filename: "Plot_Standard_deviation_charts_35.json"
sa_internal_task_id: "187109791"
sa_status_proposed: QC_Complete   # host STOPS before setting; human confirms

annotations:
  - n: 1
    sa:
      rating: deleted   # cycle 2: no SA rating — human deletes annotation manually
      skills_check:   []
      skills_uncheck: []
      prompt_edits: null
      answer_final: null
      feedback: null   # no feedback on deleted annotation
    hai:
      task_id_field: "Plot_Standard_deviation_charts_35.json"
      role: Reviewing
      annotation_n: 1
      prompt: "deleted annotation"
      image_ref: "screenshots/Plot_Standard_deviation_charts_35.png"
      answer: "deleted annotation"
      reviewer_action: approve   # deleted annotation but task QC_Complete
```

**Host contract:**
- Job 2 (SA apply-review) → parse `annotations[].sa`. STOP before `sa_status_proposed`.
- Job 3 (HAI shadow) → one shadow task per `annotations[].hai` entry. STOP before Submit + Confirm time.
- Image upload = `upload_file` MCP tool. All other fields = `form_input` / checkbox toggles.
