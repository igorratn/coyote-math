# Project Lizard

## What This Is
Visual reasoning Q&A pairs that challenge frontier AI models' multimodal capabilities. Fellows create challenging image+question pairs where models struggle. $30/hr generalist project on Handshake AI.

## Goal
Create multimodal Q&A pairs that stump models — same principle as Phoenix (math stumble problems) but applied to visual reasoning.

## Repository Structure
- `CLAUDE.md` — this file
- `references/playbook_onboarding.md` — full playbook with 5 Guidelines, 12 Error Types, Skills Ontology, golden examples, pre-submission checklist
- `tasks/` — WIP and completed Q&A pairs
- `tasks/archive/` — abandoned attempts
- `references/` — guides, examples, onboarding materials

## Design Formula (adapted from Phoenix)
**Premature confidence × No easy bypass = Stumble**

For visual reasoning:
- **Premature confidence:** image LOOKS like it shows X, model trusts first impression
- **No easy bypass:** no simple textual/logical shortcut to the right answer without careful visual inspection

## Originality Score (3 axes, any Low = REDESIGN)
- **Audit Novelty:** How non-standard is the visual inspection needed to catch the flaw?
- **Disproof Resistance:** How many quick visual checks (count objects, read text, check colors) does it survive?
- **Camouflage Strength:** How strongly does the image's surface appearance lure into the wrong answer?

## Evaluation Framework (from Lizard Assessment, 2026-03-26)

### Two-Part Check
1. **Check QUESTION** against 5 Guidelines + 12 Common Error Types
2. **Check REWRITE ANSWER** for correctness only
- ALL 12 error types are QUESTION issues, not answer issues
- Type 2 (model correct) = question was too easy — still a question problem

### 5 Question Prompt Guidelines
1. **Complexity:** 2+ skills required. Enumeration needs 3+ skills (Feb 10 update). Bad examples: "How many instances of letter k?", "How many triangles?"
2. **Single verifiable answer**
3. **Self-contained in image**
4. **Independence**
5. **No giveaways**

### 7 Skills Ontology
Enumeration, Attribute Perception, Spatial Reasoning, Math Reasoning, Logical Reasoning, Table/Chart/Graph Understanding, World Knowledge

### 12 Common Error Types (all QUESTION issues)
1. Non-verifiable answer format
2. Model was actually correct (question too easy)
3. Fine-grained precision
4. Magnitude/unit confusion
5. Case sensitivity
6. Ambiguous "difference"
7. Unclear counting boundaries
8. Decimal ambiguity
9. Incorrect MCQ format (must use "A." not "A)", no "None/All of the above", 4 options preferred)
10. Missing "approximation" specification
11. Ambiguous "average"
12. Indistinguishable colors

### MCQ Rules
- Must use "A." not "A)"
- No "All of the above" or "None of the above"
- 4 options preferred

### Short Answer Rules
- Must include example answer (e.g., 2)

### True/False questions NOT allowed

### Key Lessons Learned (from Assessment)
- Always check axis labels — missing labels = Type 1 (non-verifiable)
- Stacked charts without value labels = Type 3 (precision)
- Charts with grid lines or labeled values = NOT Type 3
- Ambiguous wording ("across both", "stagnant") without definition = Type 1
- MCQ format errors are easy to miss — check A. vs A) every time
- Read question LITERALLY — don't paraphrase or infer
- Verify math — actually compute, don't assume
- Distinguish axis tick marks from data points in dot plots
- If model wrong and rewrite correct = expected, no issue
- Shadow Tasks: source of truth for time-tracking, 1 per annotation, new one per revision

### Key Lessons Learned (from Onboarding Video)

#### Workflow
- 10 minutes per annotation (paid up to 10 min per shadow task)
- Up to 5 annotations per image/task
- Each annotation = 1 shadow task
- Revisions also require new shadow tasks
- Prioritize QUALITY over speed — don't rush
- All annotations must result in model getting thumbs down (model must be wrong)
- Toxicity flags: NOT relevant on this project, disregard
- Use Chrome or Safari — other browsers may have issues with SuperAnnotate
- No minimum weekly hours required
- Quality scores determine task volume — high quality = more tasks, reviewer eligibility, STAR fellow team

#### Annotation Best Practices (from live demo)
- Understand the image first before writing prompts
- Tag Table/Chart/Graph Understanding anytime a table, chart, or graph is in the context of your prompt
- If prompt uses purely Enumeration, tag Enumeration. If Enumeration + other math, tag Math Reasoning instead
- Always regenerate model answer after editing the prompt
- MCQ rewrite answer: only include the capitalized letter (e.g., "B"), NOT "B. the value"
- Self-check: "If I asked this question to someone else, would they get the exact same answer?"

#### Ambiguity (Biggest Issue on Project — Two Forms)
1. **Ambiguity in the answer itself:** Multiple valid answers possible (e.g., "approximate value of coffee in January" — could be 110 or 115). Fix: restructure as MCQ with sufficiently distinct options.
2. **Ambiguity in the answer format:** Unclear HOW to provide the answer (e.g., "give both the item and the month" — but in what format?). Fix: specify format explicitly + include example answer.

#### Fine-Grained Spatial Reasoning
- Avoid comparing values that look nearly equal (e.g., two bars at similar heights)
- Focus on areas where differences are obvious
- Constrain questions to regions of the image where answers are unambiguous (e.g., the candlestick demo: narrowed from all months to just July to remove borderline cases)
- Avoid ambiguous spatial terms like "touching" — use "crossing" or constrain to clear cases

#### Counting Boundaries
- When counting steps/items, be explicit about start and stop (inclusive vs exclusive)
- "Reach" is ambiguous — does it include the endpoint or not?

#### Differences
- Always specify what is subtracted from what (X-Y or Y-X)
- If absolute value intended, explicitly say "absolute difference"

#### Decimals
- Always specify rounding rules (nearest hundredth, nearest whole number, etc.)

#### Approximations
- Anytime the model must map a value to an axis and the precise value is unknown, explicitly state you want an approximation
- Even in MCQ prompts where approximation is implied, still state it explicitly
- Consider using MCQ for approximation questions since multiple short-answer values could be valid

#### QC Process
- Submit to QC after all annotations complete
- Reviewer thumbs up = approved, thumbs down = revision needed with feedback
- If you disagree with QC feedback, attend office hours to discuss
- Quality scores have some buffer for disagreements

## Communication
Igor is terse and direct. Show thinking process always. If process takes long, direction is wrong — pick randomly, move.

# currentDate
Today's date is 2026-03-26.
