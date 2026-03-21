# Operational Lessons from Phoenix Testing

**Last updated: 2026-03-18**
**Source: Phoenix CLI pipeline runs, March 2026**

This document captures cross-domain lessons learned from testing problems on Phoenix models. Domain-specific trap details remain in each domain guide (`bessel_functions_guide.md`, `spherical_harmonics_guide.md`). The playbook (`domain_guides/playbook.md`, Section 11) contains the full design-pattern discussion.

---

## Model Failure Mode Distribution

Based on 12+ model responses across recent problems (Bessel and Spherical Harmonics):

| Failure Mode | Frequency | Description |
|-------------|-----------|-------------|
| False recalled fact | ~75% | Model fabricates identities, cites nonexistent references |
| Unjustified implication | ~15% | Sophisticated-looking machinery with hand-waved key step |
| Theorem misapplication | ~10% | Correct theorem applied in wrong context |

Models don't fail at computation — they fail by **inventing shortcuts**. They fabricate "known results" to avoid doing the actual work.

---

## The "Seductive Shortcut" Design Pattern

The most effective trap design discovered so far:

1. Define a quantity $Q(x)$ via transformation (integral, exponential, product) of a sum $S(x)$
2. The natural approach: differentiate/simplify $Q$ to reduce to $S(x)$
3. $S(x)$ looks like it should have a clean closed form (but doesn't)
4. Models "recall" the false closed form and proceed confidently
5. Disproof: compare low-order Taylor coefficients

**Why it works:** Models are trained on vast mathematical literature. When they encounter a sum that "looks like" a known identity, they pattern-match and fabricate a reference. The Taylor coefficient check is simple but models never do it because they believe the identity.

**Proven in:** Bessel/Kapteyn domain (8/8 stumbles across two problems). Likely transferable to other domains where false closed forms are plausible.

**Transfer targets:**
- Laguerre: $\sum L_n^\alpha(x)/n!$ with false closed form
- Hermite: $\sum H_n(x)/n!!$ with false generating function
- Jacobi: $\sum P_n^{(\alpha,\beta)}(x)/(n+1)$ with false integral

---

## Problem Designs That Fail on Phoenix

| Design | Why It Fails | Domain Example |
|--------|-------------|----------------|
| Elementary counterexample available | Models check small cases ($N=1$, $\nu=1$) | Bessel: spherical Hankel partial-wave |
| Algebraically transparent structure | Models see $B=0$ from $A^2+B^2=A^2$ | Bessel: cross-product modulus |
| Convention-dependent claim | Answer depends on phase convention choice | SH: Condon-Shortley sign |
| Pure selection rule check | Models know the standard rules | SH: CG/Gaunt integral vanishing |
| Solvable by single evaluation | North pole or $x=0$ check suffices | SH: problems solvable at $\theta=0$ alone |
| Exact eigenvalue equation is elementary | Models derive it and use implicit differentiation, bypassing the perturbation sum entirely | SL: $\mu\cos(\mu\pi)+\alpha\sin(\mu\pi)=0$ (0/4, 2026-03-20) |

**Design principles to avoid these failures:**
- The falsity must require a computation models won't spontaneously perform (e.g., Taylor expansion to order 3+)
- No single small-case check should disprove the claim (need $n \geq 3$ or multiple terms)
- The "obvious" approach should lead to a plausible but wrong answer
- The claim should be wrapped in enough structure that pattern-matching fails

---

## GPT vs Phoenix Calibration

GPT-5.4 cross-check is a useful but imperfect predictor of Phoenix performance:

| Scenario | What It Means |
|----------|---------------|
| GPT catches it easily AND method is elementary | Phoenix will likely catch it too — redesign |
| GPT fabricates same false identity as Phoenix | Strong validation of trap — proceed |
| GPT falls for it but Phoenix doesn't | Problem may be too easy for Phoenix despite fooling GPT |
| Both GPT and Phoenix fail | High-quality stumble — proceed to submission |

**Rule of thumb:** GPT cross-check validates trap quality but doesn't predict stumble rate. Use it as a filter, not a guarantee.

---

## Effective Problem Complexity Sweet Spot

Problems that achieve 3/4 or 4/4 stumbles share these properties:
- Falsity requires a computation models won't spontaneously perform
- The "obvious" approach leads to a plausible but wrong answer
- The claim is wrapped in enough structure that pattern-matching fails
- No single small-case check disproves it

---

## Stumble Rate Benchmarks

| Rate | Interpretation | Action |
|------|---------------|--------|
| 4/4 | Excellent trap | Submit — problem is ready |
| 3/4 | Strong trap | Submit — acceptable |
| 2/4 | Marginal | Consider strengthening the trap or redesigning |
| 1/4 | Weak | Redesign — trap is too transparent |
| 0/4 | Failed | Problem is too easy — do not submit, redesign from scratch |
