# Self-Critique Prompts for Phoenix Problem Generation
# Source: Self-Refine paper (MIT), adapted for Phoenix
# Use these in Stage 1 AFTER generating a problem, BEFORE GPT verification.

## Prompt 1: Weakness Hunt

"List the 3 biggest weaknesses in this problem as a stumble problem. Is the trap too obvious? Too obscure? Too computational? Rewrite fixing those weaknesses."

## Prompt 2: Expert Panel

"Imagine a domain specialist, a Phoenix reviewer, and a frontier LLM reviewed this problem. What would each push back on? Revise to pass all 3 reviews."

## Prompt 3: Assumption Audit

"List every assumption this problem relies on. Flag which ones a model could easily verify (making the trap fail). Rewrite to hide those assumptions better."

## Prompt 4: Contradiction Check

"Is the claimed formula consistent with known special cases? Does the problem accidentally claim something true? Verify and fix."
