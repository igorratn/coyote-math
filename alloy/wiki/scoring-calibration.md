# Scoring Calibration

## Lessons Learned

### Task d6b6b1dd — Instantons (2026-04-06)
- **Score given:** 5 (slightly prefer Response 1)
- **Score should have been:** 2 (moderately prefer Response 1)
- **Why:** Response 2 had a factual error — spurious $\nu$ factor in tunneling amplitude formula. This is a physics mistake in a key result, not a minor style difference.
- **Lesson:** Factual error in a key result = strong score (1/7 or 2/6). Score of 5 was too soft. The CLI under-scored because both responses were "largely correct" — but one wrong formula in a crucial result is a meaningful error, not a close call.

## Calibration Rules
- Factual error in key result → 1/7 or 2/6, never 3/5 — **only when one response errs and the other doesn't**
- **Both responses have major issues → NEVER extreme (1/7). Stay in 3/5 range.** Slight preference to whichever is better on other dimensions. (Nick, onboarding meeting 2026-04-09)
- Both correct, one adds useful extras (e.g., explicit solution) → 2/6 if extras are significant
- Both correct, minor clarity/style difference → 3/5
- One completely wrong or off-topic → 1/7
- Score 4 ('Equally Prefer') ONLY for exact-match identical responses. Very rare. Use "both responses" language in justification (not chosen/rejected). (Re-enabled 2026-04-10; was previously banned.)

## Bias Warnings (from onboarding meeting 2026-04-09)
- Don't bias preference by which response needs more rewrites — rewrite triggers ≠ preference dimensions
- Don't bias toward longer responses — length ≠ quality
- Don't default to slight preferences on everything — be opinionated, use full range
- Ambiguous/ill-posed prompts → accept reasonable model interpretations; don't penalize for prompt's ambiguity

### Task 7e00f967 — Monomial Orders (2026-04-07)
- **Score given:** 5 (slightly prefer Response 1)
- **Rationale:** Both correct. R1 had more detailed Dickson's Lemma proof (explicit case analysis). R2 compressed inductive step to one sentence. For proof verification, detail matters.
- **Category:** Both correct, minor completeness difference → 3/5 range. Correct application of calibration rules.

### Task 0f44e912 — Cooper Pair Box (2026-04-07)
- **Score initially:** 5 (slightly prefer R1) — before catching the error
- **Score corrected to:** 2 (moderately prefer R1)
- **Why:** R2 had factor-of-2 error in second-order perturbation coefficient ($E_J/8E_C$ instead of $E_J/4E_C$). Not the key result, but a verifiable quantitative mistake in a formula R2 chose to present.
- **Lesson:** Errors in supplementary calculations still warrant moderate scores (2/6). Only pure style/presentation differences get 3/5. Human physics review caught this — always verify perturbation theory coefficients independently.

### Task 189da35a — Competition Inequality (2026-04-07)
- **Score given:** 5 (slightly prefer R2)
- **Rationale:** Both correct, identical SOS decompositions. R2 more concise — directly factors $(b,c)$ part without discriminant detour. For competition math, elegance matters.
- **Category:** Both correct, style/conciseness difference → 3/5 range. Correct application.
- **Rewrite:** N/A. ~~Earlier claimed double `$$` around `\begin{aligned}`~~ — phantom trigger, not present in saved verbatim text. Corrected 2026-04-10.

### Task 1f890578 — SoS Power-Mean Lemma (2026-04-10, corrected)
- **Score initially:** 6 (moderately prefer chosen)
- **Score corrected to:** 5 (slightly prefer chosen)
- **Why:** Rejected response has clear errors ($\lambda$-exponent slip, SoS Hölder misapplication). Chosen response targets the correct certificate but its Cauchy–Schwarz induction does not actually close — a real gap in a key proof step. Both responses have real issues in key steps.
- **Lesson:** "Both broken → never extreme" applies at the 5/6 boundary too. When the justification has to reach for hedging words ("minor," "small gap") to describe chosen's flaw while giving rejected's flaw full detail, the score is probably one notch too strong. Drop to slight preference (5) and describe both flaws at equal resolution.
- **Rewrite:** Yes — `$$\begin{equation*}...\end{equation*}$$` on all 16 display blocks (see rewrite-patterns.md reversal entry).

### Score Gate (run before finalizing)
Answer explicitly before locking score:
- Is the difference **correctness**? (factual error in one, not other → strong 1/2 or 6/7)
- Or only **completeness/clarity**? (→ 3/5 range)
- Are responses **exact-match identical**? (only then → 4)
- Would I defend the chosen side if asked "specifically, where does it win?"
Prevents drift to soft 3/5 when correctness asymmetry exists, and prevents spurious 2/6 when only style differs.

### Mechanical-Task Flag
For calculator / operator-reduction / symbolic-evaluation prompts where correctness = one numeric answer: if responses don't show derivation, correctness credit is limited to shown/checkable steps. Don't award correctness on unverified assertions — penalize completeness instead.

### Prompt Well-Posedness Check (BEFORE hard preference claims)
Ask whether the prompt itself fixes the mathematical convention, definition, branch choice, or interpretation tightly enough for a unique answer. If under-specified and BOTH responses lean on the same ambiguity, record in Systematic Issues first. Do not manufacture a strong correctness split from messy algebra/sign handling when the deeper issue is prompt ambiguity.
- **Boundary rule for ambiguous prompts:** prompt ambiguity does not erase an earlier objective error. If one response mis-sets the geometry/definition/setup before the ambiguity-dependent counting or interpretation step even begins, treat that as a real correctness asymmetry; then let the ambiguity soften 1↔2 or 6↔7, not collapse everything automatically to 3/5.

## Score Compression Warning
Don't default to 3/5 for everything. If you see a real physics/math error, go to 1/2 or 6/7. Compressing to the middle destroys the signal that reward models need.

## Task-Type Specific Rules (from official guidance, 2026-04-13)

### Code Tasks
- Correctness bugs are decisive, not stylistic. Wrong thresholds, off-by-ones, and TLE risks determine pass/fail — treat accordingly with strong scores.
- Test code against provided sample inputs. Don't accept a response that fails the problem's own examples.

### Enumeration / Counting Problems
- Check completeness carefully. One response may miss valid cases the other catches. Count manually.
- When both responses are wrong, keep preference mild. Strong preference between two broken answers is almost always an overstatement.

### Constraint-Satisfaction Problems (Sudoku, grids, etc.)
- Verify mechanically. Don't eyeball — check every row, column, box systematically.

## Equally Prefer = Score 4 (Slack is authoritative)
Nicolas's Slack (2026-04-10): explicitly "score of 4 ('Equally prefer')" for exact-match identical responses.
Playbook (2026-04-13): says "Likert 3" — **this is a typo/error in the doc**. Score 4 is correct; it is the 1–7 scale midpoint. Use Score 4, ignore the playbook's "Likert 3."
