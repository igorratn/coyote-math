# Review: Report_Dashboard_Mobile_App_Dashboard_130

## Task Info
- **SuperAnnotate Task ID:** 187110811
- **Image:** Mobile app analytics dashboard. Dark blue left sidebar (Overview through Issues, with white icons). Four white data cards, some with funnel icon + "1" filter buttons top-right. "Dashboards" menu item highlighted in light blue with small green badge. Pie charts: Top previous screens (left), Top next screens (right), with colored slices and leader-lines. Floating white tooltip on one slice.
- **Date:** 2026-04-16
- **Review Cycle:** 1st

## Annotations

### Annotation 1
- **Shadow Task:** ✅ submitted (cycle 1) — [8a0c8159](shadows/8a0c8159.md)
- **Rating:** thumbs-up
- **Question:** 5-step SAQ: letters in green badge × funnel buttons × tooltip Count: value + uppercase letters in bottom-left card title.
- **Skills Tagged:** Enumeration, Attribute Perception, Spatial Reasoning, Math Reasoning, Table/Chart/Graph Understanding
- **Question Type:** Short Answer
- **Model Answer Rating:** thumbs-down

#### Two-Part Check
1. **Question Check:**
   - Guidelines violated: none
   - Error types found: none. All spatial references are precise (specific sidebar item, specific card positions, specific tooltip element). "Alphabetical letters" is unambiguous. Formula in Step 5 is explicit.
2. **Answer Check:**
   - Math verified: yes — (Step1 × Step2 × Step3) + Step4 = 435. Model got 579 (wrong values in one or more steps).
   - Answer correct: yes (435)

#### Full Prompt
Step 1: Look at the dark blue sidebar on the left. Identify the menu item "Dashboards" which is highlighted in light blue. Locate the small green badge overlapping the top right corner of this highlight. Count the exact total number of alphabetical letters physically printed inside this green badge.

Step 2: Scan the top right corner of the four main white data cards in the dashboard. Look for a specific small rectangular button containing a funnel (filter) icon and the number "1". Count the exact total number of times this specific funnel icon button physically appears across all four cards combined.

Step 3: Look at the bottom right data card. Identify the small white floating tooltip box pointing to the light blue pie slice. Identify the two-digit numerical value printed immediately to the right of the word "Count:". Treat these two digits as a single integer.

Step 4: Look at the title of the bottom left data card. Count the exact total number of uppercase (capital) letters physically printed within this specific title.

Step 5: Multiply your letter count from Step 1 by your funnel icon count from Step 2. Then, multiply that result by your integer from Step 3. Finally, add your uppercase letter count from Step 4 to that total. Answer with a single integer (e.g., 1).

#### Rewrite Answer
435

#### Edits Made (if any)
None

#### Feedback
N/A

---

### Annotation 2
- **Shadow Task:** ✅ submitted (cycle 1) — [69990e4f](shadows/69990e4f.md)
- **Rating:** thumbs-up
- **Question:** 5-step MCQ: uppercase letters in green pie label × uppercase in grey pie label × "Activity" count + sidebar icon count.
- **Skills Tagged:** Enumeration, Spatial Reasoning, Math Reasoning, Table/Chart/Graph Understanding
- **Question Type:** MCQ
- **Model Answer Rating:** thumbs-down

#### Two-Part Check
1. **Question Check:**
   - Guidelines violated: none
   - Error types found: none. Leader-line specification ("thin grey leader-line", "positioned on the bottom-left") is precise. "Activity" case-sensitive count is objective. Sidebar icon count bounded by "Overview...Issues".
2. **Answer Check:**
   - Math verified: yes — (Step1 × Step2 × Step3) + Step4 = 90 (option C). Model got D (81).
   - Answer correct: yes (C)

#### Full Prompt
Step 1: Look at the "Top previous screens" pie chart on the left. Identify the specific text label that has a thin leader-line connecting it directly to the green slice of the pie. Count the exact number of uppercase (capital) letters in this specific label.

Step 2: Look at the "Top next screens" pie chart on the right. Identify the specific text label that has a thin grey leader-line connecting it directly to the grey slice of the pie (positioned on the bottom-left of that pie). Count the exact number of uppercase (capital) letters in this specific label.

Step 3: Scan the entire dashboard for the exact string "Activity" (case-sensitive). Count the exact total number of times this specific string is physically printed anywhere on the screen (including inside longer camelCase words, titles, and tooltips).

Step 4: Look at the dark blue sidebar on the left. Count the exact total number of small white icons (pictograms) printed to the left of the menu items, starting from "Overview" at the top down to "Issues" at the bottom.

Step 5: Multiply your uppercase count from Step 1 by your uppercase count from Step 2. Then, multiply that result by your total "Activity" string count from Step 3. Finally, add your sidebar icon count from Step 4 to that total.

A) 117
B) 72
C) 90
D) 81

#### Rewrite Answer
C

#### Edits Made (if any)
None

#### Feedback
N/A

## Task Status
- **Status:** QC_Complete
- **SA Applied:** ✅
- **Reason:** Both annotations thumbs-up, both stumped.

## Form-Fill Payload

```yaml
task_id: 187110811
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
      task_id_field: 187110811
      role: Reviewing
      annotation_n: 1
      prompt: |
        Step 1: Look at the dark blue sidebar on the left. Identify the menu item "Dashboards" which is highlighted in light blue. Locate the small green badge overlapping the top right corner of this highlight. Count the exact total number of alphabetical letters physically printed inside this green badge.

        Step 2: Scan the top right corner of the four main white data cards in the dashboard. Look for a specific small rectangular button containing a funnel (filter) icon and the number "1". Count the exact total number of times this specific funnel icon button physically appears across all four cards combined.

        Step 3: Look at the bottom right data card. Identify the small white floating tooltip box pointing to the light blue pie slice. Identify the two-digit numerical value printed immediately to the right of the word "Count:". Treat these two digits as a single integer.

        Step 4: Look at the title of the bottom left data card. Count the exact total number of uppercase (capital) letters physically printed within this specific title.

        Step 5: Multiply your letter count from Step 1 by your funnel icon count from Step 2. Then, multiply that result by your integer from Step 3. Finally, add your uppercase letter count from Step 4 to that total. Answer with a single integer (e.g., 1).
      answer: "435"
  - n: 2
    sa:
      rating: thumbs-up
      skills_check: []
      skills_uncheck: []
      prompt_edits: null
      answer_final: null
      feedback: null
    hai:
      task_id_field: 187110811
      role: Reviewing
      annotation_n: 2
      prompt: |
        Step 1: Look at the "Top previous screens" pie chart on the left. Identify the specific text label that has a thin leader-line connecting it directly to the green slice of the pie. Count the exact number of uppercase (capital) letters in this specific label.

        Step 2: Look at the "Top next screens" pie chart on the right. Identify the specific text label that has a thin grey leader-line connecting it directly to the grey slice of the pie (positioned on the bottom-left of that pie). Count the exact number of uppercase (capital) letters in this specific label.

        Step 3: Scan the entire dashboard for the exact string "Activity" (case-sensitive). Count the exact total number of times this specific string is physically printed anywhere on the screen (including inside longer camelCase words, titles, and tooltips).

        Step 4: Look at the dark blue sidebar on the left. Count the exact total number of small white icons (pictograms) printed to the left of the menu items, starting from "Overview" at the top down to "Issues" at the bottom.

        Step 5: Multiply your uppercase count from Step 1 by your uppercase count from Step 2. Then, multiply that result by your total "Activity" string count from Step 3. Finally, add your sidebar icon count from Step 4 to that total.

        A) 117
        B) 72
        C) 90
        D) 81
      answer: "C"
```
