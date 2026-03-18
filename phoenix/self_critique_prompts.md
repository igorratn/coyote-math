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

### Round 1: Check correctness of problem statement
System: "You are a mathematics reviewer. Check the mathematical correctness of the following problem statement. Are there any errors in the setup, definitions, or stated facts? Do not solve the problem — only verify that the problem as stated is mathematically well-posed and that all given information is correct."
User: [problem text]
Action: If GPT finds errors in the SETUP → fix them. If GPT says setup is correct → proceed.

### Round 2: Ask GPT to solve it
System: "You are a mathematician. Solve the following problem completely. Determine whether the claim is True or False and give a rigorous proof."
User: [problem text]
Action: Read GPT's verdict and reasoning.
- If GPT gets the WRONG answer → strong signal the trap works
- If GPT gets the RIGHT answer with WRONG reasoning → good Tier 2 stumble potential
- If GPT gets the RIGHT answer with VALID proof → use judgment:
  * Trivial one-line solution (e.g., "plug in n=1") → problem is too easy, redesign.
  * Long careful derivation → proceed to Phoenix. GPT ≠ Phoenix models.

### Round 3: Argue if you disagree
If GPT's answer or reasoning contains errors, send a follow-up:
System: "You are a mathematician engaged in a peer review discussion."
User: "Your previous analysis of this problem concluded [X]. However, I believe this is incorrect because [specific mathematical objection]. Please reconsider your answer."
Action: Read GPT's revised response.
- If GPT corrects itself → it was a weak error, the argument helped
- If GPT doubles down with valid reasoning → you may be wrong, recheck your own math
- If GPT doubles down with invalid reasoning → strong confirmation the trap works

Repeat Round 3 until agreement is reached or the disagreement is clearly identified.

### Round 0 (NEW — run FIRST): Consolidate model responses
Before analyzing responses yourself, send them to GPT for independent consolidation.
1. Save all 4 Phoenix model responses to a temp file (~/dev/coyote-math/phoenix/temp_responses.md)
2. Call GPT-5.4 with:
   System: "You are a mathematics reviewer. You are given 4 model responses to the same proof problem. For each response: (1) state the final verdict (True/False), (2) summarize the proof method in one sentence, (3) identify the first mathematical error if any. Then provide a consolidated correct solution in 5-10 lines."
   User: [contents of temp_responses.md]
3. Save GPT's consolidation to ~/dev/coyote-math/phoenix/gpt_consolidation.md
4. THEN run your own analysis (per analysis_prompt.md) and compare with GPT's consolidation
5. If you and GPT disagree on any response's correctness, run Round 3 (debate) to resolve

This gives you two independent analyses to cross-check before reporting results.

### Recording results
Save all GPT responses to ~/dev/coyote-math/phoenix/gpt_feedback.md with round labels.
Format:
```
# GPT Cross-Check: [problem filename]
## Round 0: Response Consolidation
[GPT's summary of all 4 responses + consolidated solution]
## Round 1: Setup Check
[GPT response]
## Round 2: Solution Attempt
[GPT response]
## Round 3+: Debate
[exchange]
## Conclusion
[agreed/disagreed, final assessment]
```
