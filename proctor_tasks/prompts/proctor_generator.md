You are creating one original Project Proctor task for the Handshake AI platform.

A Proctor task is a STEM problem with a complete evaluation apparatus: prompt, solution, failure analysis, hints, and weighted rubric. The goal is to identify specific, predictable reasoning failures in frontier AI models.

## Task Structure (follow this exact order)

### STEP 0 — Domain
State the domain and subdomain. Accurately assess the difficulty level:
- High School Olympiad (minimum)
- Undergraduate
- Upper Undergraduate
- Graduate / PhD-level (target)
Be honest — don't label an upper-undergrad problem as PhD-level.

### STEP 1 — Prompt
Write a self-contained problem that:
- Has a definite, exact answer (numerical, symbolic, or structural)
- Contains a deliberate reasoning trap that models predictably fall for
- Is self-contained with all definitions and assumptions stated
- Uses proper KaTeX formatting
- Cannot be an explicit or implicit multiple choice question
- Specifies the required answer format and precision (e.g., "rounded to three significant figures")
- Provides all numerical values in the prompt to at least the same precision as the final answer
- Explicitly states units where applicable

Originality requirements (CRITICAL — this is the #1 rejection reason):
- Must be 100% original — not found in textbooks, papers, competitions, or forums
- Changing only numerical values or variable names in a known problem is NOT original
- The problem APPROACH must be novel, not just the parameters
- Consider: complex paths, non-trivial configurations, multi-step reasoning chains, unconventional setups
- Ask yourself: "Could a reviewer Google this problem type and find the same structure?" If yes, redesign.

Precision requirements:
- Request final answer to 2-3 significant figures (not more — calculation errors are not valid failures)
- Constrain intermediate rounding to 5 decimal places (7 for log/exp/exponential functions)
- Ensure your Step-by-Step solution also follows this precision

### STEP 2-3 — Model Responses
Generate responses from Model A (2 responses) and Model B (2 responses).
At least 1 response from EACH model must contain a critical error AND give an incorrect final answer.
If Model A doesn't fail, refine the prompt before testing Model B.

### STEP 4 — Identify Model Failures
Valid failures:
- Fundamental conceptual misunderstandings
- Incorrect application of theorems or principles
- Flawed logical reasoning or invalid deductions
- Missing critical steps
- Incorrect final answer due to reasoning error

NOT valid failures:
- Rounding errors or arithmetic mistakes
- Formatting issues
- Otherwise correct reasoning with small computational slips
- Image misidentification (misAPPLYING image data IS valid)

### STEP 5 — Failure Rationale
Write separate rationales for Model A and Model B. Each must:
- Identify the specific reasoning error (not just "the answer is wrong")
- Explain why it is a genuine conceptual failure
- Be detailed enough that a reviewer can verify without re-reading the full model response

### STEP 6 — Step-by-Step Solution + Final Answer
Complete worked solution. Must:
- Proceed step-by-step with no missing logic
- Show all intermediate calculations (to 5 decimal places; 7 for log/exp)
- Justify every non-trivial claim
- Define variables and assumptions clearly
- State units explicitly throughout
- Be independently verifiable by a reviewer
- Include references/URLs if any external source inspired the problem

Final answer must:
- Be clearly labeled
- Match the prompt's requested format and precision
- Include units/conditions if relevant

Final answer format: specify one of Integer, Decimal, Fraction, Text (case sensitive/insensitive), Ordered list, Unordered list.

### STEP 7 — Hints
Provide exactly 3 progressive hints designed to assist a qualified expert in solving the problem within approximately one hour.

- **Hint 1:** Provides a productive starting point.
- **Hint 2:** Advances meaningfully toward the solution.
- **Hint 3:** Gets close to the final answer.

Each hint must:
- Be useful on its own
- Be a brief directional nudge (1-2 sentences)
- NOT contain formulas, equations, or derivation steps
- NOT be a mini-solution or restatement of the solution
- Use correct grammar, punctuation, full sentences
- Be just the hint text — no "Hint #1:" prefix

Good hint example: "Use the Gauss-Bonnet theorem for a geodesic disk to determine the rotation angle."
Bad hint example: "The area is $A = \frac{2\pi}{K}(1 - \cos(\sqrt{K}r))$, so substitute $K=2$ and $r=1/3$."

### STEP 8 — Metadata
- Subdomain (specific field)
- Education level (be accurate: upper undergraduate vs graduate vs PhD)
- Difficulty level

### STEP 9 — Rubrics
Create 2-7 rubric items. Total weight must equal exactly 7 points. Individual weights can be 1-4 points each.

Each rubric item has these fields:
- **Key:** The criterion number (e.g., "1", "2")
- **Weight:** Points assigned (1-4)
- **Criterion:** Name or high-level title — must start with an action VERB (Determine, Calculate, Identify, Evaluate, Apply...)
- **Description:** Summary of what is being evaluated and why it matters
- **Grading Guidance:** Instructions for awarding points and penalizing errors

Four mandatory design principles:

1. **Atomic:** One criterion = one evaluable requirement. No "AND" bundling, no stacking multiple checks.
   - BAD: "Recognizes that Pd sites are isolated and there are no Cu bound CO, leading to no lateral interactions"
   - GOOD: "Determines that there are no lateral interactions between adsorbed CO molecules."

2. **Self-Contained:** A reviewer can grade it without referring back to the solution. Include the specific correct value/answer in the criterion.
   - BAD: "The response is focused on addressing what the question is asking"
   - GOOD: "Determines one explicit parental genotype pair of unaffected parents that can produce the specified child genotype."

3. **Explicit Grading:** Map each score to explicit, testable conditions. No vague language.
   - BAD: "Award 1 point if most of this information is included but there is a minor error"
   - GOOD: "Award 2 points if both genotype classes are listed. Award 1 point if exactly one is listed. Award 0 points if neither is listed."
   - Partial credit of 0.5 points is allowed where appropriate.
   - For numerical answers: allow 1-5% tolerance to avoid punishing arithmetic.

4. **Verb-Led:** Every criterion must begin with a clear action verb.
   - BAD: "Assessment of the functional state of T cells"
   - GOOD: "Determines the functional state of T cells at 60 hours in a tolerogenic host environment."

## Design Principles

The trap should be:
- A genuine conceptual error models make (sign conventions, red herrings, regime misidentification, boundary condition errors)
- Predictable and reproducible across multiple models
- Not a trick question — the problem should be fair and well-posed

The problem APPROACH must be original:
- Changing numbers in a textbook problem is NOT enough
- Consider: unusual geometries, non-standard configurations, multi-concept integration, hidden assumptions
- The reviewer should not be able to find the same problem structure online

Good trap types:
- Red herring terms that models include but should be ignored
- Sign convention errors (orientation, direction, phase)
- Regime misidentification (which equation governs the problem)
- Boundary condition or endpoint errors
- Confusing similar but distinct mathematical objects
- Multi-step reasoning where an error in step 2 propagates

Data diversity:
- Don't repeatedly submit tasks with the same structure or concept
- Vary question formats, reasoning types, and domains

## Pre-Submission Checklist
- [ ] Prompt is truly original (approach, not just parameters)
- [ ] Prompt specifies answer format and precision
- [ ] Prompt values match final answer precision
- [ ] At least 1 Model A response AND 1 Model B response failed with incorrect final answer
- [ ] Failures are genuine reasoning errors, not arithmetic slips
- [ ] Solution shows all steps with proper precision (5 dp; 7 for log/exp)
- [ ] Units stated explicitly throughout
- [ ] Exactly 3 hints, brief, no formulas, each useful alone
- [ ] Difficulty level honestly assessed
- [ ] 2-7 rubric items, verb-led, atomic, self-contained
- [ ] Rubric weights sum to exactly 7
- [ ] Grading guidance uses "Award X points if..." format
- [ ] Numerical tolerances are 1-5% (not tighter)
- [ ] No bundled/stacked rubric criteria

## Reference Examples
See existing completed Proctor tasks:
- proctor_tasks/submitted/2c968d24.md (modified Helmholtz / red herring — approved)
- proctor_tasks/submitted/713bbe64.md (holonomy / sign convention — returned for revisions, see lessons learned below)

### Lessons from 713bbe64 (holonomy task — returned):
- REJECTED for not being novel enough (common textbook problem with changed parameters)
- Hints were too verbose and contained formulas — should be brief nudges only
- Rubric weights summed to 8 instead of required 7
- Rubric bundled formula + calculation — should be split into atomic items
- Numerical tolerance was too tight — need 1-5%
- Difficulty was mislabeled (was upper-undergrad, not PhD)
- Precision in prompt didn't match precision in answer
