# Review: Report_Dashboard_Efficiency_Dashboard_34

## Task Info
- **SuperAnnotate Task ID:** 186802224
- **SA Task Filename:** Report_Dashboard_Efficiency_Dashboard_34.json
- **Image:** Phone screen showing "Dashboard Office" efficiency dashboard — two sections: top shows 258 MWh with ↓13% vs yesterday; bottom shows 20 New with ↑3% vs yesterday. Each section has text with small superscript symbols after "London" and "today".
- **Date:** 2026-04-14
- **Review Cycle:** 1st

---

## Source Checkpoint
- Annotations present: 2 ✓
- Each has prompt: ✓
- Skills tagged: ✓
- Question type: ✓
- Model answer + rewrite answer: ✓
- STUMPED both: ✓ (model ≠ rewrite on both)

## Wiki Scan Notes
- Relevant: model-stump rule (rewrite ≠ model answer → both pass that check)
- Relevant: verify math independently
- Relevant: counting boundary clarity — Type 7 concern (superscript pins)
- Relevant: "absolute difference" — annotator corrected wording in A2 revision; final prompt uses it

---

## Annotations

### Annotation 1
- **Shadow Task:** ✅ submitted — [96fe3457](shadows/96fe3457.md)
- **Rating:** thumbs-up
- **Question:** Compare % change magnitudes; from larger-magnitude section take primary value, sum digits; from other section sum digits then add 1; multiply the two results.
- **Skills Tagged:** Attribute Perception, Math Reasoning, Short answer question
- **Question Type:** SAQ
- **Model Answer Rating:** thumbs-down (model said 16; correct is 45)

#### Two-Part Check
1. **Question Check:**
   - G1 Complexity: ✓ — Attribute Perception (read % changes, compare magnitudes) + Math Reasoning (digit sum, multiply). 2+ skills.
   - G2 Single Verifiable Answer: ✓ — format specified "Answer with a single integer (e.g., 3)". Steps deterministic.
   - G3 Self-Contained: ✓ — all data visible in image.
   - G4 Independence: ✓
   - G5 No Giveaways: ✓
   - "Primary numeric value" — potential Type 1 concern. Each section has one dominant numeric (258 and 20), unambiguous in context. PASS.
   - Error types: none found.

2. **Answer Check:**
   - % changes: top = ↓13%, bottom = ↑3%. Larger magnitude = 13% → top section (258 MWh).
   - 258 digit sum: 2+5+8 = 15.
   - Other section (20 New): 2+0 = 2, plus 1 = 3.
   - Product: 15 × 3 = **45**. ✓
   - Rewrite answer 45 is correct.
   - Model answered 16 — stumped. ✓

#### Full Prompt
On the phone screen, compare the magnitudes of the two percentage changes relative to yesterday and select the section with the larger magnitude change. From that section, take the primary numeric value and compute the sum of its digits. From the other section, take the primary numeric value and compute the sum of its digits, then add 1. Multiply these two results together. What is the final value? Answer with a single integer (e.g., 3).

#### Rewrite Answer
45

#### Edits Made
None

#### Feedback
N/A

---

### Annotation 2
- **Shadow Task:** ✅ submitted — [072cce39](shadows/072cce39.md)
- **Rating:** thumbs-up
- **Question:** Identify decrease section (primary value, reverse digits); identify increase section (primary value, absolute diff of digits); multiply; divide by absolute diff of % magnitudes; add count of superscript pin icons.
- **Skills Tagged:** Attribute Perception, Math Reasoning, Short answer question
- **Question Type:** SAQ
- **Model Answer Rating:** thumbs-down (model said 2.0; correct is 175.4)

#### Two-Part Check
1. **Question Check:**
   - G1 Complexity: ✓ — Attribute Perception (identify sections, read % values, count icons) + Math Reasoning (reverse digits, absolute diff, multiply, divide). 2+ skills.
   - G2 Single Verifiable Answer: ✓ — format specified "Answer with a single number rounded to one decimal place (e.g., 1.2)". Steps deterministic.
   - G3 Self-Contained: ✓
   - G4 Independence: ✓
   - G5 No Giveaways: ✓
   - Error types found: none. Full-res human verification confirms the superscript symbols are identifiable as pin/thumbtack icons, with 3 on the top panel and 2 on the bottom panel.

2. **Answer Check:**
   - Decrease section: top (258 MWh, ↓13%). Reverse digits of 258: 852.
   - Increase section: bottom (20 New, ↑3%). Absolute diff of digits: |2-0| = 2.
   - Product: 852 × 2 = 1704.
   - Absolute diff of % magnitudes: |13 - 3| = 10.
   - Division: 1704 / 10 = 170.4.
   - Pin count verified in full-res: 5 total (3 top panel, 2 bottom panel).
   - Final answer: 170.4 + 5 = 175.4. ✓
   - Model answered 2.0 — stumped. ✓

#### Full Prompt
On the phone screen, identify the section that shows a decrease compared to yesterday and take its primary numeric value. Reverse the digits of this number. Next, identify the section that shows an increase and take its primary numeric value. Compute the absolute difference between its digits. Multiply these two results together. Then, divide this product by the absolute difference between the two percentage magnitudes. Finally, count the total number of small superscript pin (thumbtack) icons that appear next to words within the text on the screen, and add this count to your result. What is the final value? Answer with a single number rounded to one decimal place (e.g., 1.2).

#### Rewrite Answer
175.4

#### Edits Made
None

#### Feedback
N/A

---

## Task Status
- **Status:** QC_Complete
- **Reason:** Both annotations pass. Annotation 2 answer verified correct after full-res confirmation that the superscript symbols are pin/thumbtack icons, 5 total.
- **SA Applied (Cycle 1):** ✅ (legacy backfill 2026-04-18)

---

## Form-Fill Payload

```yaml
sa_task_filename: "Report_Dashboard_Efficiency_Dashboard_34.json"
sa_internal_task_id: "186802224"
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
      task_id_field: "Report_Dashboard_Efficiency_Dashboard_34.json"
      role: Reviewing
      annotation_n: 1
      prompt: "On the phone screen, compare the magnitudes of the two percentage changes relative to yesterday and select the section with the larger magnitude change. From that section, take the primary numeric value and compute the sum of its digits. From the other section, take the primary numeric value and compute the sum of its digits, then add 1. Multiply these two results together. What is the final value? Answer with a single integer (e.g., 3)."
      image_ref: "screenshots/Report_Dashboard_Efficiency_Dashboard_34.png"
      answer: "45"

  - n: 2
    sa:
      rating: thumbs_up
      skills_check:   []
      skills_uncheck: []
      prompt_edits: null
      answer_final: null
      feedback: null
    hai:
      task_id_field: "Report_Dashboard_Efficiency_Dashboard_34.json"
      role: Reviewing
      annotation_n: 2
      prompt: "On the phone screen, identify the section that shows a decrease compared to yesterday and take its primary numeric value. Reverse the digits of this number. Next, identify the section that shows an increase and take its primary numeric value. Compute the absolute difference between its digits. Multiply these two results together. Then, divide this product by the absolute difference between the two percentage magnitudes. Finally, count the total number of small superscript pin (thumbtack) icons that appear next to words within the text on the screen, and add this count to your result. What is the final value? Answer with a single number rounded to one decimal place (e.g., 1.2)."
      image_ref: "screenshots/Report_Dashboard_Efficiency_Dashboard_34.png"
      answer: "175.4"
```

**Host contract:**
- Job 2 (SA apply-review) → parse `annotations[].sa`. STOP before `sa_status_proposed`.
- Job 3 (HAI shadow) → one shadow task per `annotations[].hai` entry. STOP before Submit + Confirm time.
- Image upload = manual (native picker). All other fields = `form_input` / checkbox toggles.
