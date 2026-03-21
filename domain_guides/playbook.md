# Stumble Problem Playbook
# Living document — update after every successful run

This playbook is not a rulebook. It captures what has worked so far. The best new problems will come from approaches not yet written here. Try new things, cross-pollinate between domains, and update this document when something works.

---

## Format

Every problem must be self-contained and end with:

```
Determine whether this claim is True or False, and give a rigorous proof of your conclusion.
```

No bold text. No citations in the problem statement (citations go in solutions only). Define all notation.

## Philosophy

Reasoning first, traps second. The trap prevents lazy approaches but rewards genuine understanding. A good problem teaches something even after you know the answer.

**Three tiers:**
- **Tier 1 (preferred):** Requires deep reasoning — multiple connected insights, creative techniques, genuine "aha!" moment. Trap emerges naturally from the math.
- **Tier 2 (acceptable):** Trap-first — mainly tests whether you catch the trap. Mechanical once identified.
- **Tier 3 (never):** Pure calculation.

**The core design principle (from session 2026-03-19 self-reflection):**

DON'T design problems where the false claim is easily disprovable. DO design problems where the natural verification path CONFIRMS the false claim.

The trap must be ON the verification path, not hidden from it. When models check their answer, the check itself should lead them astray. The disproof should require a non-obvious step that models won't spontaneously perform.

Before generating, answer these four questions:
- Q1: What will a model try FIRST? (small values? formula recall? recurrence?)
- Q2: Does that first attempt reveal the falsity? If YES → REDESIGN.
- Q3: Does the natural verification path CONFIRM the false claim? If NO → the trap isn't working.
- Q4: What non-obvious step is needed to find the truth? If trivial (one substitution, one recurrence step) → REDESIGN.

See `domain_references/self_reflection_20260319.md` for full analysis.

## Techniques (open-ended — add new ones)

Known techniques that produce stumbles:

1. **NU Auxiliary Function** — monotonicity via v(x) = y² + (σ/λ)y'²
2. **Asymptotic Analysis** — NU §7 bounds, Szegő oscillatory formulas
3. **Representation Changes** — Jacobi connection, basis changes
4. **Dimension Counting** — dim(space) - dim(constraints)
5. **Subsequence Construction** — phase alignment in oscillatory sums
6. **North Pole Evaluation** — at θ=0 only m=0 survives
7. **Pole Decomposition** — q(x) = q(β) + (x-β)r(x)
8. **Weyl Equidistribution** — oscillatory sums average to zero
9. **Parity Analysis** — P_ℓ^m(-x) = (-1)^{ℓ+m} P_ℓ^m(x) kills cross-degree integrals
10. **Taylor Coefficient Comparison** — expand both sides, compare low-order terms to disprove false identities
11. **Framing Misdirection** — problem statement steers models toward elaborate machinery while the answer is a simple symmetry/parity argument they overlook.
12. **Measure/Weight Confusion** — problem uses a different measure than the standard formula (dt vs t dt, a^n/n! vs e^{-a}a^n/n!). Models recall the standard formula and apply it without checking the measure.

This list is not closed. Use techniques from any area of mathematics. If it produces a stumble, add it here.

## Traps (open-ended — add new letters)

| Code | Name | Exploits |
|------|------|----------|
| A | Boundary Singularity | Limits at domain boundaries |
| B | Index-Dependent | Claim fails at specific index |
| C | Basis Mismatch | Different representations |
| D | Pointwise vs Global | L² vs pointwise confusion |
| E | Oscillatory Cancellation | Asymptotic sum behavior |
| F | Scaling Error | Wrong constants |
| G | Weight Perturbation | Modified orthogonality |
| H | Index Shift Obstruction | Recurrence at boundary |
| I | Operator Domain | Operator at singular point |
| J | Non-Commutative | Operation order matters |
| K | Factorial Ratio | Complex normalization |
| L | Parity-Dependent | Alternating sums |
| M | Asymptotic Boundary | Interior formula at boundary |
| N | Measure Symmetry | Weight breaks symmetry |
| O | Dimension Counting | Solution space structure |
| P | Rodrigues Boundary | Competing factors |
| Q | Subsequence | Oscillatory alignment |
| R | Wigner Non-Vanishing | Rotation matrix structure |
| S | Index Boundary | Recurrence coefficient vanishing |
| T | Measure Confusion | Standard formula for wrong measure/weight |

Discover a new mechanism? Assign the next letter and use it.

## Uniqueness & Separation

Each problem must differ from existing ones in **2-3 of these 4 dimensions:**

1. **Object** — what: function values, integrals, sums, zeros, bounds, transforms
2. **Region** — where: interior, boundary, complex plane, asymptotic regime
3. **Insight** — why: cancellation, singularity, representation, symmetry breaking
4. **Technique** — how: which combination of methods

Check the cluster file before creating. Same everything = reject.

**Separation rule:** Two problems using the same technique+insight can coexist if they are in different domains AND separated by at least 5 other problems in submission order. Do NOT submit back-to-back problems with the same core mechanism. Track recent usage below.

## Recent Technique Usage (update after each submission)

| Problem | Date | Domain | Technique | Insight |
|---------|------|--------|-----------|---------|
| fc18bf67 | 2026-03-18 | Spherical harmonics | Parity + Framing misdirection | Odd integrand, integral vanishes |
| adaaffa2 | 2026-03-18 | Orthogonal polynomials (Hermite) | Parity + Framing misdirection | Odd integrand, integral vanishes |
| 8ac6e061 | 2026-03-18 | Bessel functions | Measure confusion (T) + Scaling error (F) | Triple Bessel integral: models confuse dt with t dt measure, recall wrong normalization | **4/4** |
| 7edc37eb | 2026-03-19 | Bessel functions (Kapteyn) | Taylor coefficient mismatch + differentiation gap | Weighted squared Kapteyn sum: $1/n$ weight creates $\sum J_n J_n'$ vs $\sum n J_n J_n'$ gap; models assert Taylor matching without checking $x^6$ | **2/4** |

| 7edc37eb-v2 | 2026-03-20 | Sturm-Liouville (ODE eigenvalue) | Conditional convergence / asymmetric cancellation | Second-order perturbation: partial-fraction "symmetric cancellation" is actually asymmetric. Models bypassed via implicit differentiation of exact eigenvalue equation | **0/4** |
| 7edc37eb-v4 | 2026-03-20 | Gegenbauer (orthogonal polynomials) | $x=1$ evaluation bound + ANALOGY | Linearization leading coefficient: $x=1$ bound confirms $\leq 1$ but actual $g_{m+n}$ has $(\lambda)_m$ not $(2\lambda)_m$ plus $(m+n+\lambda)/\lambda$ factor | **2/4** |

**Next problem: The $x=1$ evaluation trap works because it's ON the verification path and CONFIRMS the false claim. Models that check $x=1$ get a valid-looking proof and stop. The disproof requires checking specific parameter values ($m=n=1$, $\lambda < 1$), which models skip when they have a "proof."**

## Cross-Pollination

A trap that works in one domain often transfers to another:
- Bessel's "seductive shortcut" (false closed form via differentiation) → try with Laguerre, Hermite, Jacobi sums
- Spherical harmonics parity trick → try with Hermite (even/odd), Chebyshev — DONE (fc18bf67 → adaaffa2). Now pause parity and try other techniques.
- Kapteyn series coefficient mismatch → try with any generating function claim
- Wigner non-vanishing → try with any representation-theoretic identity
- Framing misdirection ("must be evaluated by other means") → try with any integral where a simple symmetry argument kills the claim
- Kapteyn-Bessel antiderivative (hiding false identity behind an integral layer) → try wrapping any false identity inside an integral/derivative
- Measure confusion (dt vs t dt from 8ac6e061) → try with any domain where a standard formula uses a weighted sum/integral but the problem uses unweighted

Always ask: could this idea work somewhere else?

## Operational Lessons

See `domain_references/operational_lessons.md` for full details. Key points:

**How models fail:** ~75% fabricate identities ("false recalled fact"), ~15% hand-wave key steps, ~10% misapply theorems. Models invent shortcuts rather than compute.

**What works:** Claims where the natural verification path confirms the false claim. Models recall a formula for a subtly different case, or the framing steers them past the simple disproof.

**What fails:** Elementary counterexamples (small N check), transparent algebra (B=0 obvious), convention-dependent claims, pure selection rule checks, pattern extrapolation from recurrences (the recurrence IS the disproof), cross-domain formulas that are standard textbook results.

**Discrete domains are harder but not impossible:** Claims about discrete objects are easier for models to brute-force at small parameter values. To make discrete domains work, the trap must be on the verification path — e.g., the completeness relation models reach for uses a different weight than the problem.

**GPT calibration:** GPT cross-check validates trap quality but doesn't predict Phoenix stumble rate. If GPT catches it easily with an elementary method, Phoenix will too.

## Workflow

1. Read this playbook + the domain cluster file + self_reflection_20260319.md
2. Pick a gap or try something new — check Recent Technique Usage to avoid repeating
3. Generate problem (Tier 1 preferred). Answer Q1-Q4 from the Philosophy section BEFORE proceeding. If Q2=YES or Q3=NO, REDESIGN.
4. Self-critique: Weakness Hunt, Expert Panel, Assumption Audit, Contradiction Check
5. GPT cross-check (see `phoenix/cli_phoenix_rules.md`)
6. Test on Phoenix
7. Analyze results
8. If successful: update cluster file, update Recent Technique Usage table. If novel technique: update this playbook.

## References

- **Primary:** Nikiforov & Uvarov, *Special Functions of Mathematical Physics* (1988)
- **Secondary:** Varshalovich et al., *Quantum Theory of Angular Momentum* (1988); Szegő, *Orthogonal Polynomials* (1975); Watson, *Theory of Bessel Functions* (1944)
- **Domain clusters:** `problem_clusters/bessel_functions.md`, `problem_clusters/spherical_harmonics.md`, and others
- **Pipeline:** `phoenix/cli_phoenix_rules.md`
- **Operational data:** `domain_references/operational_lessons.md`
- **Self-reflection:** `domain_references/self_reflection_20260319.md`

## Domains

Based on NU (1988): Jacobi (§5-7), Laguerre (§5-7), Hermite (§5-7), Chebyshev, Legendre, Spherical Harmonics (§10), Functions of 2nd kind (§11), Bessel (§14-19), Hypergeometric (§20-23). Not limited to these — any special function domain is fair game.

## Citation Style (for solutions)

First use: "By Nikiforov-Uvarov (1988), Chapter II, §7, Eq. (19)..."
Subsequent: "By NU §7..." or "By the NU envelope estimate..."
Always include chapter/section/equation when citing formulas.
