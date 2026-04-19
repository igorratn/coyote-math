# Guideline & Error Type Decision Patterns

## 5 Guidelines — Decision Patterns

### G1: Complexity (2+ skills, enumeration needs 3+)
- Simple enumeration ("how many bars") with no other reasoning = FAIL
- Enumeration + math ("count X then divide by Y") = 2 skills, PASS
- Enumeration + attribute perception + math = 3 skills, PASS
- "Which color has the highest value?" = attribute perception + table/chart reading = PASS
- When in doubt: if model could answer without reasoning about the image, too easy

### G2: Single Verifiable Answer
- "What is the main takeaway?" = FAIL (subjective)
- "What is the value of X in row 3?" = PASS (deterministic)
- MCQ makes borderline cases verifiable — convert if answer is ambiguous as short answer
- Math results: specify rounding rules + format to remove ambiguity

### G3: Self-Contained in Image
- Prompt must not require external knowledge beyond what's visible
- Exception: world knowledge skill tag covers cases where common knowledge is needed
- "What country does this flag represent?" = world knowledge, OK if tagged
- "What was the GDP in 2023?" when image only shows 2020 data = FAIL

### G4: Independence
- Each annotation must stand alone — no "referring to the previous question"
- Shared image is fine; shared reasoning chain is not

### G5: No Giveaways
- "Look at the x-axis of chart 3 and find the value at position 5" = giveaway (points model to answer)
- Colors in prompts OK if unambiguous in image (not a giveaway)
- Over-specifying location to the point of triviality = FAIL
- Balance: enough clarity for human understanding, not so much that model gets a free pass

## 12 Error Types — Decision Patterns

### Type 1: Non-verifiable format
- "What is the main numeric value?" → ambiguous, multiple valid answers
- Fix: specify exactly which value, or convert to MCQ
- "Main" is ambiguous, "all" is not

### Type 2: Model correct
- Model gets it right = question too easy for complexity requirement
- Remember: model fails once across regenerations = valid failure. Don't reject just because model sometimes gets it right.

### Type 3: Fine-grained precision
- Local peaks on continuous lines = classic Type 3
- Asking for exact pixel-level values from graphs
- Fix: MCQ or add "approximate" qualifier

### Type 4: Magnitude/unit
- "What is the value?" without specifying unit when multiple are possible
- Fix: specify unit in prompt or accept any reasonable unit in answer

### Type 5: Case sensitivity
- Rare. Only flag if answer correctness depends on capitalization

### Type 6: Ambiguous "difference"
- "What is the difference between X and Y?" — absolute? signed? which direction?
- Fix: always specify "absolute difference" or give direction ("how much more is X than Y")

### Type 7: Unclear counting boundaries
- "Colored square icons" failed — what counts as "colored"? "square"?
- "Non-face icons" passed — clear boundary
- Fix: make counting target unambiguous with specific descriptors

### Type 8: Decimal ambiguity
- How many decimal places? Round or truncate?
- Fix: specify rounding rules + example format in prompt

### Type 9: Incorrect MCQ format
- "A." not "A)" — period not parenthesis
- No "All of the above" / "None of the above"
- 4 options preferred
- Pure MCQ phrasing (don't say "answer with a letter")
- Plausible distractors required

### Type 10: Missing "approximation"
- Graph/chart values read by eye need "approximately" qualifier
- Fix: add "approximate" or convert to MCQ

### Type 11: Ambiguous "average"
- Mean? Median? Mode? Weighted?
- Fix: specify which average

### Type 12: Indistinguishable colors
- Colors in prompt must be clearly distinguishable in image
- "The blue line" when there are two similar blue lines = FAIL
- Colors as prompt references are fine when unambiguous
