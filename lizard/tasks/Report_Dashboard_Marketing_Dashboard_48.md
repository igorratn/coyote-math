# Review: Report_Dashboard_Marketing_Dashboard_48

## Task Info
- **SuperAnnotate Task ID:** 187110789
- **Image:** Sales/Marketing dashboard. Lead Generation dual-axis chart (orange bars=Visitors, blue dots=Conversion Rate, x-axis 1–30). Sales bar chart (40–60 range). KPI boxes: VISITORS, CUSTOMERS, NEW LEADS, TOTAL DEALS, MQL, OPEN DEALS, SQL=1,233, CLOSED/WON DEALS.
- **Date:** 2026-04-16
- **Review Cycle:** 1st

## Annotations

### Annotation 1
- **Shadow Task:** ✅ submitted — [c075d75d](shadows/c075d75d.md)
- **Rating:** thumbs-up
- **Question:** Lead Generation chart — between which two consecutive x-axis values does blue dot show largest decrease?
- **Skills Tagged:** Attribute Perception, Spatial Reasoning, Math Reasoning, Table/Chart/Graph Understanding
- **Question Type:** MCQ
- **Model Answer Rating:** thumbs-down

#### Two-Part Check
1. **Question Check:**
   - Guidelines violated: none
   - Error types found: none
2. **Answer Check:**
   - Math verified: yes — identify largest drop in blue conversion-rate line between consecutive x values. Answer=B (27,28). Model got C (1,2), wrong.
   - Answer correct: yes (B)

#### Full Prompt
Looking at the Lead Generation chart in this image, between which two consecutive x-axis values does the blue circular data point (representing the conversion rate) show the largest decrease in y-axis value? A. 19, 20 B. 27, 28 C. 1, 2 D. 10, 11

#### Rewrite Answer
B

#### Edits Made (if any)
None

#### Feedback
N/A

---

### Annotation 2
- **Shadow Task:** ✅ submitted — [bcc5c339](shadows/bcc5c339.md)
- **Rating:** thumbs-up
- **Question:** Count Sales chart bars between 40–50 inclusive, add total US states.
- **Skills Tagged:** Enumeration, Spatial Reasoning, Math Reasoning, Table/Chart/Graph Understanding, World Knowledge
- **Question Type:** Short Answer
- **Model Answer Rating:** thumbs-down

#### Two-Part Check
1. **Question Check:**
   - Guidelines violated: none
   - Error types found: none. World Knowledge exception (US states=50) is valid per guidelines.
2. **Answer Check:**
   - Math verified: yes — 3 bars in 40–50 range + 50 states = 53. Model got 57 (7 bars + 50 = 57, wrong bar count).
   - Answer correct: yes (53)

#### Full Prompt
Looking at the Sales chart in this image, count the number of bars whose y-axis values fall between 40 and 50, inclusive. Then add this count to the total number of states in the United States of America. What is the resulting sum? Answer with an integer (e.g., 9).

#### Rewrite Answer
53

#### Edits Made (if any)
None

#### Feedback
N/A

---

### Annotation 3
- **Shadow Task:** ✅ submitted — [bfd2dad7](shadows/bfd2dad7.md)
- **Rating:** thumbs-up
- **Question:** Count white % symbols + count blue uppercase R letters; sum.
- **Skills Tagged:** Enumeration, Attribute Perception, Math Reasoning
- **Question Type:** Short Answer
- **Model Answer Rating:** thumbs-down

#### Two-Part Check
1. **Question Check:**
   - Guidelines violated: none
   - Error types found: none. Earlier CMW draft had spatial qualifier flagged; final version is clean.
2. **Answer Check:**
   - Math verified: yes — answer=24. Model got 21 (wrong count).
   - Answer correct: yes (24)

#### Full Prompt
Count the number of white percentage symbols in this image. Then count the number of blue uppercase 'R' letters in this image. What is the sum of these two counts? Answer with an integer (e.g., 9).

#### Rewrite Answer
24

#### Edits Made (if any)
None

#### Feedback
N/A

---

### Annotation 4
- **Shadow Task:** ✅ submitted (cycle 1) — [d937ab0e](shadows/d937ab0e.md)
- **Rating:** thumbs-up
- **Question:** SQL box — sum all individual digits of all numbers shown.
- **Skills Tagged:** Enumeration, Attribute Perception, Spatial Reasoning, Math Reasoning
- **Question Type:** Short Answer
- **Model Answer Rating:** thumbs-down

#### Two-Part Check
1. **Question Check:**
   - Guidelines violated: none
   - Error types found: none. Example "treat 23 as 2+3" makes the digit-sum rule unambiguous.
2. **Answer Check:**
   - Math verified: yes — SQL box shows 1,233 (digits: 1+2+3+3=9) plus additional numeric values in box summing to 44 total. Model got 25 (wrong).
   - Answer correct: yes (44)

#### Full Prompt
Look at the box containing the white word 'SQL'. Take all numbers shown in that box and sum each individual digit (for example, treat 23 as 2 + 3). What is the total? Answer with an integer (e.g., 9).

#### Rewrite Answer
44

#### Edits Made (if any)
None

#### Feedback
N/A

## Task Status
- **Status:** QC_Complete
- **SA Applied:** ✅
- **Reason:** All 4 annotations thumbs-up, all stumped.

## Form-Fill Payload

```yaml
task_id: 187110789
annotations:
  - n: 1
    sa:
      rating: thumbs-up
      skills_check: []
      skills_uncheck: []
      prompt_edits: null
      answer_final: null
      feedback: null
    hai:
      task_id_field: 187110789
      role: Reviewing
      annotation_n: 1
      prompt: |
        Looking at the Lead Generation chart in this image, between which two consecutive x-axis values does the blue circular data point (representing the conversion rate) show the largest decrease in y-axis value? A. 19, 20 B. 27, 28 C. 1, 2 D. 10, 11
      answer: "B"
  - n: 2
    sa:
      rating: thumbs-up
      skills_check: []
      skills_uncheck: []
      prompt_edits: null
      answer_final: null
      feedback: null
    hai:
      task_id_field: 187110789
      role: Reviewing
      annotation_n: 2
      prompt: |
        Looking at the Sales chart in this image, count the number of bars whose y-axis values fall between 40 and 50, inclusive. Then add this count to the total number of states in the United States of America. What is the resulting sum? Answer with an integer (e.g., 9).
      answer: "53"
  - n: 3
    sa:
      rating: thumbs-up
      skills_check: []
      skills_uncheck: []
      prompt_edits: null
      answer_final: null
      feedback: null
    hai:
      task_id_field: 187110789
      role: Reviewing
      annotation_n: 3
      prompt: |
        Count the number of white percentage symbols in this image. Then count the number of blue uppercase 'R' letters in this image. What is the sum of these two counts? Answer with an integer (e.g., 9).
      answer: "24"
  - n: 4
    sa:
      rating: thumbs-up
      skills_check: []
      skills_uncheck: []
      prompt_edits: null
      answer_final: null
      feedback: null
    hai:
      task_id_field: 187110789
      role: Reviewing
      annotation_n: 4
      prompt: |
        Look at the box containing the white word 'SQL'. Take all numbers shown in that box and sum each individual digit (for example, treat 23 as 2 + 3). What is the total? Answer with an integer (e.g., 9).
      answer: "44"
```
