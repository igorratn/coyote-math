# Review: Plot_Gene_expression_heatmap_133

## Task Info
- **task_id:** 185556818
- **SA_TASK_FILENAME:** Plot_Gene_expression_heatmap_133.json
- **Image:** Plot_Gene_expression_heatmap_133.png — gene expression dot plot (rows = cell clusters 0-12, cols = gene labels, dot size = fraction of cells, dot color = mean expression)
- **Date:** 2026-04-19
- **Review Cycle:** 1st

## Task Status
- **Status:** QC_Complete
- **SA Applied (Cycle 1):** ✅

---

## Annotation 1

- **Shadow Task:** ✅ submitted (cycle 1) — [dccf7387](shadows/dccf7387.md)
- **Rating:** thumbs-up
- **Skills Tagged:** Enumeration, Math Reasoning, Table/Chart/Graph Understanding
- **Question Type:** SAQ
- **Model Answer:** 2591.2
- **Annotator Answer:** 2219.1

#### Two-Part Check
1. **Question Check:** Guidelines violated: none. Error types: none.
2. **Answer Check:** 5-char labels: PTPRC, CD79A, MS4A1, MKI67, TOP2A = 5. Odd y-labels = 6. CD-starting = 7. Total y-labels = 13. 5^6/7−13 = 15625/7−13 = 2219.1 ✓. Model 2591.2 incorrect. Stump confirmed.

#### Full Prompt
How many gene labels on the x-axis contain exactly 5 characters? Raise this to the power of the number of y-axis labels that are odd numbers, then divide by the number of gene labels that start with "CD" case-sensitively, then subtract the total number of y-axis labels. Answer as a single number rounded to one decimal place (e.g., 20.0).

#### Rewrite Answer
2219.1

#### Edits Made
Skills: removed Spatial Reasoning, Attribute Perception; added Enumeration.

#### Feedback
4/19: Removed SR and AP (over-tagged). Added Enumeration (primary operation).

#### Merge Log
R1 👎 (miscounted 5-char labels as 12). R2 👍 2219.1. UNRESOLVED → human resolved: R2. Correct: 5-char=5, CD=7, formula verified.

---

## Annotation 2

- **Shadow Task:** ✅ submitted (cycle 1) — [cf641b83](shadows/cf641b83.md)
- **Rating:** thumbs-up
- **Skills Tagged:** Enumeration, Math Reasoning, Table/Chart/Graph Understanding
- **Question Type:** SAQ
- **Model Answer:** 0.0
- **Annotator Answer:** 1.6

#### Two-Part Check
1. **Question Check:** Guidelines violated: none. Error types: none.
2. **Answer Check:** Contains "A": CD8A, CD79A, MS4A1, JCHAIN, FCER1A, CLEC10A, TOP2A = 7. Ends with "A": CD8A, CD79A, FCER1A, CLEC10A, TOP2A = 5. Diff = 7−5 = 2. Longest label = CLEC10A = 7 chars. Sum y-labels = 78. 2^7 / 78 = 128/78 = 1.6 ✓. Model 0.0 incorrect. Stump confirmed.

#### Full Prompt
How many gene labels on the x-axis contain the letter "A" case-sensitively? Subtract from this the number of gene labels that end with the letter "A" case-sensitively, then raise the result to the power of the number of characters in the longest gene label on the x-axis, then divide by the sum of all y-axis labels. Answer as a single number rounded to one decimal place (e.g., 20.0).

#### Rewrite Answer
1.6

#### Edits Made
Skills: removed Logical Reasoning.

#### Feedback
4/19: Removed Logical Reasoning (character-membership/suffix checks are Enumeration per framework).

#### Merge Log
R1 👎 (got diff=1→0.0, matched model). R2 👍 1.6. UNRESOLVED → human resolved: R2. Answer 1.6 correct.

---

## Annotation 3

- **Shadow Task:** ✅ submitted (cycle 1) — [cdeba5c7](shadows/cdeba5c7.md)
- **Rating:** thumbs-up
- **Skills Tagged:** Enumeration, Math Reasoning, Table/Chart/Graph Understanding
- **Question Type:** SAQ
- **Model Answer:** 14.4
- **Annotator Answer:** 21.6

#### Two-Part Check
1. **Question Check:** Guidelines violated: none. Error types: none.
2. **Answer Check:** 2-digit labels: CD68(6,8), CD19(1,9), CD79A(7,9), MS4A1(4,1), CLEC10A(1,0), MKI67(6,7) = 6. Sum odd y-labels=36. Legend sections=2. Fraction legend values=5. 36×6/(2×5)=21.6 ✓. Model 14.4 incorrect. Stump confirmed.

#### Full Prompt
How many gene labels on the x-axis contain exactly 2 numeric digits? Multiply the sum of all odd y-axis labels by this count, then divide by the product of the number of distinct legend sections and the number of labeled values in the fraction of cells legend. Answer as a single number rounded to one decimal place (e.g., 20.0).

#### Rewrite Answer
21.6

#### Edits Made
Skills: removed Spatial Reasoning, Logical Reasoning; added Table/Chart/Graph Understanding.

#### Feedback
4/19: Removed SR and LR (over-tagged). Added TCG (was missing).

#### Merge Log
R1 👎 (2-digit count=4, wrong; answer=14.4=model). R2 👍 21.6. UNRESOLVED → human resolved: R2. 2-digit count=6 verified.

---

## Annotation 4

- **Shadow Task:** ✅ submitted (cycle 1) — [e9536590](shadows/e9536590.md)
- **Rating:** thumbs-up
- **Skills Tagged:** Enumeration, Math Reasoning, World Knowledge, Table/Chart/Graph Understanding
- **Question Type:** SAQ
- **Model Answer:** 2034
- **Annotator Answer:** 2022

#### Two-Part Check
1. **Question Check:** Guidelines violated: none. Error types: none.
2. **Answer Check:** A=9, B=50, C=12, D=5. N=(12×9)−50−5=53. 1969+53=2022 ✓. Model 2034 incorrect. Stump confirmed.

#### Full Prompt
Let A be the number of gene labels on the x-axis whose name ends with a number, let B be the sum of all y-axis labels strictly greater than 7, let C be the number of gene labels containing the letter "C" case-sensitively, and let D be the number of labeled values in the fraction of cells legend. Calculate N = (C x A) - B - D. What year did the first human land on the moon? Add N to that year. Answer as a single number (e.g., 1970).

#### Rewrite Answer
2022

#### Edits Made
Skills: removed Logical Reasoning; added Enumeration, World Knowledge.

#### Feedback
4/19: Added World Knowledge (moon landing year — was missing, critical). Added Enumeration. Removed Logical Reasoning (filter conditions are Enumeration per framework).

#### Merge Log
R1 👍 2022 / R2 👍 2022. AGREEMENT.

---

## Annotation 5

- **Shadow Task:** ✅ submitted (cycle 1) — [0125f922](shadows/0125f922.md)
- **Rating:** thumbs-up
- **Skills Tagged:** Enumeration, Math Reasoning, Table/Chart/Graph Understanding
- **Question Type:** SAQ
- **Model Answer:** 605.9
- **Annotator Answer:** 412.5

#### Two-Part Check
1. **Question Check:** Guidelines violated: none. Error types: none.
2. **Answer Check:** 1-digit labels: CD3D, CD8A, CD4, MZB1, XBP1, CD1C, FCER1A, XCL2, NKG7, TOP2A = 10. B=10. Perfect-square y-labels=4. 10^4−10^2=10000−100=9900h. 9900/24=412.5 ✓. Model 605.9 incorrect. Stump confirmed.

#### Full Prompt
Let A be the number of gene labels containing exactly one numeric digit. Let B be the sum of all y-axis labels strictly less than 5. Raise A to the power of the number of y-axis labels that are perfect squares, then subtract B squared. How many days are in this many hours? Answer as a single number rounded to one decimal place (e.g., 100.0).

#### Rewrite Answer
412.5

#### Edits Made
Skills: removed Attribute Perception, Logical Reasoning, World Knowledge; added Enumeration, Table/Chart/Graph Understanding.

#### Feedback
4/19: Removed AP, LR, WK (over-tagged). Added Enumeration and TCG (both missing).

#### Merge Log
R1 👍 2105.2 (A=15, overcounted). R2 👍 412.5 (A=10). UNRESOLVED → human resolved: R2. A=10 verified.

---

## Form-Fill Payload

```yaml
task_id: 185556818
annotations:
  - n: 1
    sa:
      rating: thumbs-up
      skills_check: [Enumeration]
      skills_uncheck: [Spatial Reasoning, Attribute Perception]
      prompt_edits: null
      answer_final: null
      feedback: "4/19: Removed SR and AP (over-tagged). Added Enumeration (primary operation)."
    hai:
      task_id_field: Plot_Gene_expression_heatmap_133.json
      role: Reviewing
      annotation_n: 1
      prompt: |
        How many gene labels on the x-axis contain exactly 5 characters? Raise this to the power of the number of y-axis labels that are odd numbers, then divide by the number of gene labels that start with "CD" case-sensitively, then subtract the total number of y-axis labels. Answer as a single number rounded to one decimal place (e.g., 20.0).
      answer: 2219.1

  - n: 2
    sa:
      rating: thumbs-up
      skills_check: []
      skills_uncheck: [Logical Reasoning]
      prompt_edits: null
      answer_final: null
      feedback: "4/19: Removed Logical Reasoning (character-membership/suffix checks are Enumeration per framework)."
    hai:
      task_id_field: Plot_Gene_expression_heatmap_133.json
      role: Reviewing
      annotation_n: 2
      prompt: |
        How many gene labels on the x-axis contain the letter "A" case-sensitively? Subtract from this the number of gene labels that end with the letter "A" case-sensitively, then raise the result to the power of the number of characters in the longest gene label on the x-axis, then divide by the sum of all y-axis labels. Answer as a single number rounded to one decimal place (e.g., 20.0).
      answer: 1.6

  - n: 3
    sa:
      rating: thumbs-up
      skills_check: [Table/Chart/Graph Understanding]
      skills_uncheck: [Spatial Reasoning, Logical Reasoning]
      prompt_edits: null
      answer_final: null
      feedback: "4/19: Removed SR and LR (over-tagged). Added TCG (was missing)."
    hai:
      task_id_field: Plot_Gene_expression_heatmap_133.json
      role: Reviewing
      annotation_n: 3
      prompt: |
        How many gene labels on the x-axis contain exactly 2 numeric digits? Multiply the sum of all odd y-axis labels by this count, then divide by the product of the number of distinct legend sections and the number of labeled values in the fraction of cells legend. Answer as a single number rounded to one decimal place (e.g., 20.0).
      answer: 21.6

  - n: 4
    sa:
      rating: thumbs-up
      skills_check: [Enumeration, World Knowledge]
      skills_uncheck: [Logical Reasoning]
      prompt_edits: null
      answer_final: null
      feedback: "4/19: Added World Knowledge (moon landing year — was missing, critical). Added Enumeration. Removed Logical Reasoning (filter conditions are Enumeration per framework)."
    hai:
      task_id_field: Plot_Gene_expression_heatmap_133.json
      role: Reviewing
      annotation_n: 4
      prompt: |
        Let A be the number of gene labels on the x-axis whose name ends with a number, let B be the sum of all y-axis labels strictly greater than 7, let C be the number of gene labels containing the letter "C" case-sensitively, and let D be the number of labeled values in the fraction of cells legend. Calculate N = (C x A) - B - D. What year did the first human land on the moon? Add N to that year. Answer as a single number (e.g., 1970).
      answer: 2022

  - n: 5
    sa:
      rating: thumbs-up
      skills_check: [Enumeration, Table/Chart/Graph Understanding]
      skills_uncheck: [Attribute Perception, Logical Reasoning, World Knowledge]
      prompt_edits: null
      answer_final: null
      feedback: "4/19: Removed AP, LR, WK (over-tagged). Added Enumeration and TCG (both missing)."
    hai:
      task_id_field: Plot_Gene_expression_heatmap_133.json
      role: Reviewing
      annotation_n: 5
      prompt: |
        Let A be the number of gene labels containing exactly one numeric digit. Let B be the sum of all y-axis labels strictly less than 5. Raise A to the power of the number of y-axis labels that are perfect squares, then subtract B squared. How many days are in this many hours? Answer as a single number rounded to one decimal place (e.g., 100.0).
      answer: 412.5
```
