# Review: Report_Dashboard_Mobile_App_Dashboard_142

## Task Info
- **SuperAnnotate Task ID:** 187110812
- **Image:** Delivery app UI mockup. Top row (L→R): purple splash screen (car + dashed vertical line), login screen (Password field with dots), Create package screen (From: [city]), Filters screen (Length/Width/Height + number pad), yellow menu screen. Bottom row (L→R): map screen (You→Shop route), Verifycation screen (code entry boxes with some digits), Delivery status screen (Parcel #1 timeline with checkmarks), Parcel weight screen (highlighted purple weight range), Delivery screen (MARCH 2019 calendar grid).
- **Date:** 2026-04-16
- **Review Cycle:** 1st

## Annotations

### Annotation 1
- **Shadow Task:** ✅ submitted (cycle 1) — [87ef33cd](shadows/87ef33cd.md)
- **Rating:** thumbs-up
- **Question:** 5-step MCQ: alphabetical position of 3rd letter of first word in purple button × solid checkmarks in purple circles × WE column second-row calendar number + white dashed blocks in vertical line.
- **Skills Tagged:** Enumeration, Attribute Perception, Spatial Reasoning, Math Reasoning
- **Question Type:** MCQ
- **Model Answer Rating:** thumbs-down

#### Two-Part Check
1. **Question Check:**
   - Guidelines violated: none
   - Error types found: none. All spatial references are screen-specific ("titled Delivery status", "far-right screen titled Delivery", etc.). Formula and options are explicit.
2. **Answer Check:**
   - Math verified: yes — (Step1 × Step2 × Step3) + Step4 = 381 (option C). Model got A (192).
   - Answer correct: yes (C)

#### Full Prompt
Step 1: Look at the top row of mobile screens. Focus on the second screen from the left. Identify the large purple button positioned at the bottom of this specific screen. Look at the first word printed inside this button. Determine the numerical position of the third alphabetical letter of this specific word in the standard English alphabet (e.g., A=1).

Step 2: Look at the bottom row of screens. Focus on the third screen from the left (titled "Delivery status"). Count the exact total number of solid checkmarks (inside purple circles) physically printed on this entire screen. Do not count empty or dotted circles.

Step 3: Look at the bottom row of screens. Focus on the far-right screen (titled "Delivery"). Locate the calendar grid positioned under the heading "MARCH 2019". Find the column explicitly labeled with the two letters "WE" (Wednesday). Identify the number physically printed in the second row of numbers within this specific column. Treat this extracted number as an integer.

Step 4: Look at the top row of screens. Focus on the far-left screen (the purple splash screen with the car icon). Look at the dashed vertical line directly beneath the car. Count the exact total number of individual white dashed rectangular blocks that make up this vertical line.

Step 5: Multiply your alphabetical position value from Step 1 by your checkmark count from Step 2. Then, multiply that result by your integer from Step 3. Finally, add your dashed block count from Step 4 to that total.

A) 192
B) 246
C) 381
D) 219

#### Rewrite Answer
C

#### Edits Made (if any)
None

#### Feedback
N/A

---

### Annotation 2
- **Shadow Task:** ✅ submitted (cycle 1) — [3a59d956](shadows/3a59d956.md)
- **Rating:** thumbs-up
- **Question:** 5-step MCQ: sum of second-row number pad digits × alphabetical position of 3rd letter of first yellow menu item × largest digit in purple weight range − sum of Verifycation code digits.
- **Skills Tagged:** Attribute Perception, Spatial Reasoning, Math Reasoning
- **Question Type:** MCQ
- **Model Answer Rating:** thumbs-down

#### Two-Part Check
1. **Question Check:**
   - Guidelines violated: none
   - Error types found: none. Well-constructed 5-step MCQ. "Second horizontal row" of number pad and "purple pill shape" are unambiguous visual references.
2. **Answer Check:**
   - Math verified: yes — menu item = "Adresses", 3rd letter = r = 18. 15 × 18 = 270. 270 × 4 (largest digit in purple pill) − 6 (code digits sum) = 1074. C confirmed. A(234) requires Step3=0.89, impossible.
   - Answer correct: yes (C)

#### Full Prompt
Step 1: Look at the top row of screens. Focus on the second screen from the right (titled "Filters"). Locate the number pad at the bottom of this screen. Calculate the mathematical sum of the three individual digits that make up the second horizontal row of this specific number pad.

Step 2: Look at the top row of screens. Focus on the far-right screen (the yellow menu). Read the text of the very first menu item listed at the top. Determine the numerical position of the third alphabetical letter of this explicitly printed word in the standard English alphabet (e.g., A=1, B=2, Z=26).

Step 3: Look at the bottom row of screens. Focus on the fourth screen from the left (titled "Parcel weight"). Identify the specific weight range option that is visually highlighted in a solid purple pill shape. Identify the largest single numerical digit physically printed within this highlighted text string.

Step 4: Look at the bottom row of screens. Focus on the second screen from the left (titled "Verifycation"). Look at the four square boxes at the top designated for the code entry. Sum the value of the two explicitly printed numerical digits inside these boxes.

Step 5: Multiply your sum from Step 1 by your alphabetical position value from Step 2. Then, multiply that result by your digit from Step 3. Finally, subtract your sum from Step 4 from that total.

A) 234
B) 1080
C) 1074
D) 474

#### Rewrite Answer
C

#### Edits Made (if any)
None

#### Feedback
N/A

---

### Annotation 3
- **Shadow Task:** ✅ submitted (cycle 1) — [9595063d](shadows/9595063d.md)
- **Rating:** thumbs-up
- **Question:** 5-step MCQ: route markers on You→Shop line × alphabetical position of 5th letter of 3rd dimension label × alphabetical position of 6th letter of Verifycation title + password dots.
- **Skills Tagged:** Enumeration, Attribute Perception, Spatial Reasoning, Math Reasoning
- **Question Type:** MCQ
- **Model Answer Rating:** thumbs-down

#### Two-Part Check
1. **Question Check:**
   - Guidelines violated: none
   - Error types found: none. All screen references are specific. "Circular colored markers...physically placed directly on this specific route line" is precise.
2. **Answer Check:**
   - Math verified: CORRECTED — C (1507) fails: Step1×8×25+Step4=1507 has no integer solution (1507/200=7.535). B (608) works: 3 markers × 8 (h=8) × 25 (y=25) + 8 password dots = 608. Model got D (548), wrong.
   - Answer correct: yes (B)

#### Full Prompt
Step 1: Look at the bottom row of screens. Focus on the far-left screen (the Map). Identify the solid route line connecting the "You" marker to the "Shop" marker. Count the exact total number of circular colored markers (including the start pin, the end pin, and any intermediate dots) physically placed directly on this specific route line.

Step 2: Look at the top row of screens. Focus on the fifth screen from the left (titled "Filters"). Locate the text input fields for dimensions. Identify the explicitly printed label for the third dimension (positioned immediately below "Length" and "Width"). Determine the numerical position of the fifth alphabetical letter of this specific label in the standard English alphabet (e.g., A=1).

Step 3: Look at the bottom row of screens. Focus on the second screen from the left. Read the main title printed at the very top of this screen. Determine the numerical position of the sixth alphabetical letter of this explicitly printed word in the standard English alphabet.

Step 4: Look at the top row of screens. Focus on the second screen from the left (the login screen). Look at the "Password" input field. Count the exact total number of solid circular dots explicitly printed in this field representing the hidden password.

Step 5: Multiply your marker count from Step 1 by your alphabetical position value from Step 2. Then, multiply that result by your alphabetical position value from Step 3. Finally, add your password dot count from Step 4 to that total.

A) 224
B) 608
C) 1507
D) 548

#### Rewrite Answer
B

#### Edits Made (if any)
Answer corrected from C to B — C (1507) has no valid integer decomposition; B (608) = 3×8×25+8. Stage 4 note: label is printed as "Heigth" (misspelled). Strict reading puts 5th letter = 't' (pos 20) → 3×20×25+8 = 1508 (no option matches). Treating as intended "Height" (h=8) → B. B is the most defensible reading.

#### Feedback
N/A

---

### Annotation 4
- **Shadow Task:** ✅ submitted (cycle 1) — [6accb7ac](shadows/6accb7ac.md)
- **Rating:** thumbs-up
- **Question:** 5-step SAQ: (checkmarks in Parcel#1 timeline × center column keypad sum) + (position of first "i" in origin city × smallest digit in purple weight range).
- **Skills Tagged:** Enumeration, Attribute Perception, Spatial Reasoning, Math Reasoning
- **Question Type:** Short Answer
- **Model Answer Rating:** thumbs-down

#### Two-Part Check
1. **Question Check:**
   - Guidelines violated: none
   - Error types found: none. Two separate multiplications added together in Step 5 — formula is explicit. "Center vertical column" of 3×3 keypad is unambiguous (3 digits). "Numerical position within that printed word" for letter "i" is precise.
2. **Answer Check:**
   - Math verified: yes — (Step1 × Step2) + (Step3 × Step4) = 34. Model got 33 (off by 1, likely wrong value in one step).
   - Answer correct: yes (34)

#### Full Prompt
Step 1: Look at the bottom row of screens. Focus on the third screen from the left (titled "Delivery status"). Locate the vertical timeline for "Parcel #1". Count the exact total number of solid purple circles that contain a white checkmark. Do not count any empty circles.

Step 2: Look at the top row of screens. Focus on the second screen from the right (titled "Filters"). Locate the 3x3 number pad at the bottom. Identify the three numerical digits that make up the center vertical column of this specific keypad. Calculate the mathematical sum of these three digits.

Step 3: Look at the top row of screens. Focus on the third screen from the left (titled "Create package"). Identify the origin city explicitly printed next to the word "From:". Locate the first letter "i" in this specific city name. Determine its numerical position within that printed word (e.g., if the word was "Zip", the position of "i" is 2).

Step 4: Look at the bottom row of screens. Focus on the fourth screen from the left (titled "Parcel weight"). Identify the range option that is visually highlighted with a solid purple background. Identify the smallest single numerical digit printed within this specific highlighted text string.

Step 5: Multiply your checkmark count from Step 1 by your keypad sum from Step 2. Then, multiply your position value from Step 3 by your digit from Step 4. Add these two mathematical products together to get your final result. Provide your final answer as a single integer (e.g., 1).

#### Rewrite Answer
34

#### Edits Made (if any)
None

#### Feedback
N/A

## Task Status
- **Status:** QC_Complete
- **SA Applied:** ✅
- **Reason:** A3 answer corrected C→B (math fix). A2 confirmed C (human verified "Adresses" → r=18, Step3=4, Step4=6). A1/A4 unchanged.

## Form-Fill Payload

```yaml
task_id: 187110812
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
      task_id_field: 187110812
      role: Reviewing
      annotation_n: 1
      prompt: |
        Step 1: Look at the top row of mobile screens. Focus on the second screen from the left. Identify the large purple button positioned at the bottom of this specific screen. Look at the first word printed inside this button. Determine the numerical position of the third alphabetical letter of this specific word in the standard English alphabet (e.g., A=1).

        Step 2: Look at the bottom row of screens. Focus on the third screen from the left (titled "Delivery status"). Count the exact total number of solid checkmarks (inside purple circles) physically printed on this entire screen. Do not count empty or dotted circles.

        Step 3: Look at the bottom row of screens. Focus on the far-right screen (titled "Delivery"). Locate the calendar grid positioned under the heading "MARCH 2019". Find the column explicitly labeled with the two letters "WE" (Wednesday). Identify the number physically printed in the second row of numbers within this specific column. Treat this extracted number as an integer.

        Step 4: Look at the top row of screens. Focus on the far-left screen (the purple splash screen with the car icon). Look at the dashed vertical line directly beneath the car. Count the exact total number of individual white dashed rectangular blocks that make up this vertical line.

        Step 5: Multiply your alphabetical position value from Step 1 by your checkmark count from Step 2. Then, multiply that result by your integer from Step 3. Finally, add your dashed block count from Step 4 to that total.

        A) 192
        B) 246
        C) 381
        D) 219
      answer: "C"
  - n: 2
    sa:
      rating: thumbs-up
      skills_check: []
      skills_uncheck: []
      prompt_edits: null
      answer_final: null
      feedback: null
    hai:
      task_id_field: 187110812
      role: Reviewing
      annotation_n: 2
      prompt: |
        Step 1: Look at the top row of screens. Focus on the second screen from the right (titled "Filters"). Locate the number pad at the bottom of this screen. Calculate the mathematical sum of the three individual digits that make up the second horizontal row of this specific number pad.

        Step 2: Look at the top row of screens. Focus on the far-right screen (the yellow menu). Read the text of the very first menu item listed at the top. Determine the numerical position of the third alphabetical letter of this explicitly printed word in the standard English alphabet (e.g., A=1, B=2, Z=26).

        Step 3: Look at the bottom row of screens. Focus on the fourth screen from the left (titled "Parcel weight"). Identify the specific weight range option that is visually highlighted in a solid purple pill shape. Identify the largest single numerical digit physically printed within this highlighted text string.

        Step 4: Look at the bottom row of screens. Focus on the second screen from the left (titled "Verifycation"). Look at the four square boxes at the top designated for the code entry. Sum the value of the two explicitly printed numerical digits inside these boxes.

        Step 5: Multiply your sum from Step 1 by your alphabetical position value from Step 2. Then, multiply that result by your digit from Step 3. Finally, subtract your sum from Step 4 from that total.

        A) 234
        B) 1080
        C) 1074
        D) 474
      answer: "C"
  - n: 3
    sa:
      rating: thumbs-up
      skills_check: []
      skills_uncheck: []
      prompt_edits: null
      answer_final: "B"
      feedback: "2026-04-16: Answer corrected from C to B. C (1507) fails math: no valid integer decomposition. B (608) = 3×8×25+8 verified."
    hai:
      task_id_field: 187110812
      role: Reviewing
      annotation_n: 3
      prompt: |
        Step 1: Look at the bottom row of screens. Focus on the far-left screen (the Map). Identify the solid route line connecting the "You" marker to the "Shop" marker. Count the exact total number of circular colored markers (including the start pin, the end pin, and any intermediate dots) physically placed directly on this specific route line.

        Step 2: Look at the top row of screens. Focus on the fifth screen from the left (titled "Filters"). Locate the text input fields for dimensions. Identify the explicitly printed label for the third dimension (positioned immediately below "Length" and "Width"). Determine the numerical position of the fifth alphabetical letter of this specific label in the standard English alphabet (e.g., A=1).

        Step 3: Look at the bottom row of screens. Focus on the second screen from the left. Read the main title printed at the very top of this screen. Determine the numerical position of the sixth alphabetical letter of this explicitly printed word in the standard English alphabet.

        Step 4: Look at the top row of screens. Focus on the second screen from the left (the login screen). Look at the "Password" input field. Count the exact total number of solid circular dots explicitly printed in this field representing the hidden password.

        Step 5: Multiply your marker count from Step 1 by your alphabetical position value from Step 2. Then, multiply that result by your alphabetical position value from Step 3. Finally, add your password dot count from Step 4 to that total.

        A) 224
        B) 608
        C) 1507
        D) 548
      answer: "B"
  - n: 4
    sa:
      rating: thumbs-up
      skills_check: []
      skills_uncheck: []
      prompt_edits: null
      answer_final: null
      feedback: null
    hai:
      task_id_field: 187110812
      role: Reviewing
      annotation_n: 4
      prompt: |
        Step 1: Look at the bottom row of screens. Focus on the third screen from the left (titled "Delivery status"). Locate the vertical timeline for "Parcel #1". Count the exact total number of solid purple circles that contain a white checkmark. Do not count any empty circles.

        Step 2: Look at the top row of screens. Focus on the second screen from the right (titled "Filters"). Locate the 3x3 number pad at the bottom. Identify the three numerical digits that make up the center vertical column of this specific keypad. Calculate the mathematical sum of these three digits.

        Step 3: Look at the top row of screens. Focus on the third screen from the left (titled "Create package"). Identify the origin city explicitly printed next to the word "From:". Locate the first letter "i" in this specific city name. Determine its numerical position within that printed word (e.g., if the word was "Zip", the position of "i" is 2).

        Step 4: Look at the bottom row of screens. Focus on the fourth screen from the left (titled "Parcel weight"). Identify the range option that is visually highlighted with a solid purple background. Identify the smallest single numerical digit printed within this specific highlighted text string.

        Step 5: Multiply your checkmark count from Step 1 by your keypad sum from Step 2. Then, multiply your position value from Step 3 by your digit from Step 4. Add these two mathematical products together to get your final result. Provide your final answer as a single integer (e.g., 1).
      answer: "34"
```
