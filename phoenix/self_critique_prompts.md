# Self-Critique Prompts for Problem Refinement
# Source: Self-Refine paper (MIT), adapted for Phoenix problem generation
# Use these AFTER generating a problem to improve it before testing.

## Prompt 1: The Weakness Hunt

"List the 3 biggest weaknesses in the response you just gave me. Be specific and brutal. Then rewrite it fixing those weaknesses."

## Prompt 2: The Devil's Advocate

"Play devil's advocate against your own answer. What would the strongest critic say? Now revise your response to address those criticisms."

## Prompt 3: The Expert Panel

"Imagine 3 domain experts reviewed your answer. What would each of them push back on? What would they add? Now give me a version that passes all 3 expert reviews."

## Prompt 4: The Assumption Audit

"List every assumption baked into your previous response. Flag which ones are weak or unverified. Now rewrite with those assumptions either defended or removed."

## Prompt 5: The 10x Version

"That answer was a 6/10. What would a 10/10 answer look like? What's missing? Now write the 10/10 version."

## Prompt 6: The Contradiction Check

"Read your response and find any internal contradictions, vague claims, or unsupported assertions. Mark them. Then give me a version that eliminates all of them."

## Prompt 7: The Audience Filter

"My audience is [X]. Would they find gaps, confusion, or missing context in your answer? What specifically? Rewrite for that exact audience."

## Prompt 8: The One More Pass

"Before we move on is there anything you'd change about your last response if you had one more minute? Do it."

---

## Adapted for Phoenix Problem Generation

After CLI generates a Bessel problem, apply these in sequence:

1. **Weakness Hunt** — "List the 3 biggest weaknesses in this problem as a stumble problem. Is the trap too obvious? Too obscure? Too computational? Rewrite fixing those weaknesses."

2. **Expert Panel** — "Imagine a Bessel function specialist, a Phoenix reviewer, and a frontier LLM reviewed this problem. What would each push back on? Revise to pass all 3 reviews."

3. **Assumption Audit** — "List every assumption this problem relies on. Flag which ones a model could easily verify (making the trap fail). Rewrite to hide those assumptions better."

4. **Contradiction Check** — "Is the claimed formula consistent with known special cases (nu=0, x=1, etc.)? Does the problem accidentally claim something true? Verify and fix."

## GPT Cross-Check Workflow

After generating and self-critiquing a problem, run it through GPT for independent verification.
Requires: $OPENAI_API_KEY set in environment. Use model gpt-5.4.

### Round 1: Verify & Solve (SINGLE CALL — replaces old Rounds 1+2)
System: "You are a mathematician. First, verify that the following problem is mathematically well-posed: check that all definitions, stated facts, and setup conditions are correct. Flag any errors in the problem statement itself. Then solve the problem completely — determine whether the claim is True or False and give a rigorous proof."
User: [problem text]
Action:
- If GPT finds setup errors → fix them, re-run
- GPT gets WRONG answer → strong signal the trap works
- GPT gets RIGHT answer with WRONG reasoning → good Tier 2 stumble potential
- GPT gets RIGHT answer with VALID proof → use judgment:
  * Trivial one-line solution → problem is too easy, redesign
  * Long careful derivation → proceed to Phoenix. GPT ≠ Phoenix models.

### Round 2: Debate (only if you disagree — MAX 1 EXCHANGE)
System: "You are a mathematician engaged in a peer review discussion."
User: "Your previous analysis concluded [X]. However, I believe this is incorrect because [specific mathematical objection]. Please reconsider your answer."
Action:
- GPT corrects itself → weak error, the argument helped
- GPT doubles down with valid reasoning → you may be wrong, recheck
- GPT doubles down with invalid reasoning → strong confirmation the trap works
One exchange only. Do not repeat.

### Round A: Analyze Phoenix Responses (SINGLE CALL — replaces old Round 0 + debate)
Run AFTER getting Phoenix model responses.
System: "You are a mathematics reviewer evaluating model responses to a proof problem. You are given the original problem and 4 model responses.

For each response:
1. State the model's final verdict (True/False).
2. State whether the final answer is correct or incorrect.
3. If incorrect OR if reasoning is invalid despite a correct answer: identify the earliest major mathematical error, quote or paraphrase the specific step, explain why it fails mathematically, and classify the failure type.
4. If the response is correct with sound reasoning: state 'No major errors.'

Only flag major mathematical errors. Ignore: style differences, minor arithmetic that doesn't affect the proof, abandoned exploratory lines later corrected, provisional claims later revised.

After analyzing all 4, provide a consolidated correct solution in 5-10 lines."
User: "## Problem\n[problem text]\n\n## Responses\n[contents of temp_responses.md]"

### Recording results
Save all GPT responses to ~/dev/coyote-math/phoenix/gpt_feedback.md with round labels.
Format:
```
# GPT Cross-Check: [problem filename]
## Round 1: Verify & Solve
[GPT response]
## Round 2: Debate (if run)
[exchange]
## Round A: Response Analysis
[GPT analysis of all 4 Phoenix responses]
## Solution Review (if run)
[GPT review of proposed solution]
## Conclusion
[agreed/disagreed, final assessment]
```
