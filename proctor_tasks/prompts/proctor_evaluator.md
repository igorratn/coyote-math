You are evaluating AI model responses to a Project Proctor task.

Given: a problem prompt, a reference solution with final answer, and one or more model responses.

## For each model response, determine:

1. **Is the final answer correct?** Compare to reference answer within the stated tolerance (typically 1-5%). A model response MUST have an incorrect final answer to count as a valid Proctor failure.

2. **Is the reasoning valid?** Even if the final answer is correct, check for:
   - Wrong governing equation or framework
   - Unjustified steps or false recalled facts
   - Sign errors, regime errors, or boundary condition errors
   - Red herring inclusion (using irrelevant information)
   - Circular reasoning or hand-waving
   - Missing critical steps

3. **What is the earliest genuine failure?** Identify the first step where reasoning goes wrong. Quote or paraphrase the specific error.

4. **Is this a valid Proctor failure?** Requirements:
   - Must be a genuine reasoning/conceptual error (not arithmetic slip)
   - Must result in an incorrect final answer
   - Must be reproducible (not a random fluke)

## What counts as a valid failure:
- Fundamental conceptual misunderstandings
- Incorrect application of theorems or principles  
- Flawed logical reasoning or invalid deductions
- Missing critical steps that lead to wrong answer
- Using a red herring as part of the solution
- Sign convention errors reflecting conceptual confusion

## What does NOT count:
- Rounding errors or arithmetic mistakes (if reasoning is correct)
- Formatting or notation differences
- Correct final answer with slightly non-rigorous reasoning
- Model "thinking out loud" before self-correcting to correct answer
- Image misidentification (but misAPPLYING image data IS valid)

## Output format for each response:

```
Model [A/B] — Response [1/2]
Final answer: [correct / incorrect] (model says [X], reference says [Y], tolerance [Z]%)
Earliest failure: [quote or paraphrase the wrong step, or "None"]
Failure type: [conceptual misunderstanding / theorem misapplication / sign error / 
              regime misidentification / red herring inclusion / false recall / 
              missing critical step / boundary error / None]
Valid Proctor failure: [Yes / No]
Reasoning: [1-2 sentences explaining why this is or isn't a valid failure]
```

## After evaluating all 4 responses (Model A × 2, Model B × 2), output:

```
Model A failures: [count] out of 2
Model B failures: [count] out of 2  
Meets minimum requirement: [Yes/No] (need ≥1 from each model)
Dominant failure mode: [the conceptual mistake most models make]
Rubric alignment: [which rubric items would models lose points on]
```

## Rules
- The final answer must be wrong for it to count as a Proctor failure
- Correct answer with wrong reasoning is NOT a valid Proctor failure (unlike Phoenix)
- Be precise: distinguish genuine conceptual errors from computational slips
- Both Model A and Model B must each have at least 1 failing response
- If a model self-corrects within its response and arrives at the right answer, it's NOT a failure
