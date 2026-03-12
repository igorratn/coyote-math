You are selecting and adapting an existing problem for Project Proctor.

## Workspace Rule

**One draft at a time.** The `proctor_tasks/drafts/` directory holds exactly ONE file: `wip.md` — the current work-in-progress. When a task is submitted, rename/move it to `proctor_tasks/submitted/{hash}.md`. When a task is abandoned, delete `wip.md`. The drafts directory is either empty (no active task) or contains only `wip.md`.

## Lean Workflow

**Phase 1: Prompt only**
1. Scan the repository for a candidate problem
2. Convert it to Proctor format (no True/False — ask for a specific answer)
3. Output ONLY the problem statement — nothing else
4. Save to `proctor_tasks/drafts/wip.md`
5. Submit to the platform and generate model responses

**Phase 2: Check stumbles**
6. Review model responses — do at least 1 from Model A AND 1 from Model B get the final answer wrong?
7. If NO → refine the prompt or pick a different problem, go back to Phase 1
8. If YES → proceed to Phase 3

**Phase 3: Complete the task**
9. Write failure rationale (where, what, why, what should have been done)
10. Write step-by-step solution + final answer
11. Write 3 progressive hints (no formulas)
12. Set metadata (subdomain, education level, difficulty)
13. Write rubric (2-7 items, total = 7 points)
14. Move `proctor_tasks/drafts/wip.md` to `proctor_tasks/submitted/{hash}.md`
15. Drafts directory should be empty after submission

Do NOT write solutions, hints, or rubrics until models have been tested and stumbled.

---

## Repository

109 submitted problems at /Users/iratnere/dev/coyote-math (hash-named .md files in root). Clustering info in problem_clusters/.

Available problem types:
- Orthogonal polynomials (43): Jacobi, Laguerre, Hermite
- Spherical harmonics (20): Legendre, addition theorems
- Sine-Gordon / BVP (12): Damped equilibria, Helmholtz, kink solutions
- Angular momentum (15): Clebsch-Gordan, 3j/6j symbols
- Bessel functions (12): Modified Bessel, Hankel, Wronskians, asymptotics
- Differential geometry (9): Hyperbolic geometry, holonomy, flat tori
- Miscellaneous (5): Helmholtz BVP, asymptotic expansions

---

## Proctor Conversion Rules

**NOT ALLOWED:**
- True/False
- Prove/Disprove
- "Determine whether"
- "Is it true that"
- Any implicit binary choice

**ALLOWED answer formats:**
- Integer
- Decimal (2-3 sig figs)
- Fraction
- Equation / symbolic expression (in KaTeX)
- Text (case sensitive or insensitive)
- Ordered or unordered list

**Conversion strategies:**

From True/False claims → ask for a specific value:
- "Claim: sequence is decreasing" → "Find the angle where the decreasing property breaks down"
- "Claim: integral converges" → "Determine the leading asymptotic behavior as R→∞"
- "Claim: limit equals zero" → "Compute the exact value of the limit"
- "Claim: operator is bounded" → "Compute the operator norm"

From computation problems → keep the computation, ensure the trap causes a wrong answer:
- Add precision requirements
- Frame so the natural mistake gives a specific wrong number

From BVP / asymptotic problems → ask for a specific solution value or expression:
- "Find the solution at x = ..." 
- "Determine the leading coefficient in the expansion"

**Key rule:** The trap from the original problem must cause models to get the FINAL ANSWER wrong, not just the reasoning.

---

## Prompt Quality Rules

- Self-contained — no external references needed
- No hints about the solution method in the prompt
- Specify answer format and precision
- Prompt values match answer precision
- State units where applicable
- Novel in APPROACH (not just changed parameters)
- Keep it clean and concise
