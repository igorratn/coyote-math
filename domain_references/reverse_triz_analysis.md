# Reverse TRIZ Analysis of Successful Problems

## Date: 2026-03-20

## Purpose
Apply the TRIZ contradiction framework BACKWARDS to our most successful problems. The goal: discover patterns in what contradictions naturally produce stumbles, and use those patterns to generate new problems.

---

## Problem 1: fc18bf67 — SH Parity (3/4 stumbled)

**What models did:** Applied heavy Wigner 3j / Gaunt integral machinery to evaluate $I(\ell,1)$.
**What the answer actually was:** $I(\ell,1) = 0$ by parity ($f(-x) = -f(x)$, odd integrand on symmetric interval).

**TRIZ Contradiction:**
- Framework A: Gaunt integral / Clebsch-Gordan coefficient computation → produces a nonzero numerical result
- Framework B: Parity check → integral vanishes identically
- **Resolving detail:** The integrand is odd. But the problem says "cannot be directly reduced using standard Legendre orthogonality, so $I(\ell, m)$ must be evaluated by other means" — this framing STEERS models toward Framework A.

**Where does the confusion arise?** The framing creates a false premise: "this integral must be hard." Models believe the premise and launch into heavy computation. The parity argument is so simple it feels like it can't be the answer.

**Contradiction type:** FRAMING CONTRADICTION — the problem statement's framing contradicts the mathematical reality. The problem says "must be evaluated by other means" when the answer is actually trivial.

---

## Problem 2: adaaffa2 — Hermite Parity (2/4 stumbled)

**Same mechanism as fc18bf67 but in Hermite domain.** Cross-pollination success.

**TRIZ Contradiction:**
- Framework A: Hermite recurrence / generating function computation → nonzero result
- Framework B: Parity check → integral vanishes
- **Resolving detail:** Same as above — odd integrand on symmetric interval.

**Contradiction type:** FRAMING CONTRADICTION (identical mechanism, different domain)

---

## Problem 3: 8ac6e061 — Triple Bessel Measure (4/4 stumbled)

**What models did:** Recalled Watson's formula $\int J_0(at)J_0(bt)J_0(ct) \cdot t\,dt = 1/(2\pi A)$ and applied it.
**What the answer actually was:** The integral uses $dt$, not $t\,dt$. The recalled formula is for the wrong measure.

**TRIZ Contradiction:**
- Framework A: Watson's formula (for $t\,dt$ measure) → $\mathcal{B} = 1$
- Framework B: Scaling analysis (for $dt$ measure) → $\mathcal{B}$ is homogeneous degree 1, not constant
- **Resolving detail:** The extra factor of $t$ in the measure. Models recall the formula but don't check the measure.

**Where does the confusion arise?** The RECALLED FORMULA is for a different integral than the one stated. The problem looks like a standard triple Bessel integral, and models pattern-match to Watson's result without verifying the measure.

**Contradiction type:** RECALL CONTRADICTION — the recalled formula applies to a subtly different problem than the one stated. The problem looks like it fits the recalled formula, but doesn't.

---

## Problem 4: 7edc37eb — Weighted Squared Kapteyn (2/4 stumbled)

**What models did:** Tried to differentiate $\mathcal{K}(x) = \sum [J_n(nx)]^2/n$ and relate to the known squared Kapteyn identity $\sum [J_n(nx)]^2$.
**What happened:** Differentiation gives $\sum 2J_n J_n'$ but the squared identity gives $\sum 2n J_n J_n'$. The factor of $n$ is missing. Models couldn't close the gap and asserted Taylor coefficients match.

**TRIZ Contradiction:**
- Framework A: Differentiation + known identity → closes cleanly → $\mathcal{K} = x^2/(4-x^2)$
- Framework B: Direct Taylor expansion to $x^6$ → coefficient $11/384 \neq 6/384$
- **Resolving detail:** The $1/n$ weight means differentiation produces $\sum J_n J_n'$ not $\sum n J_n J_n'$. This gap is impassable.

**Where does the confusion arise?** The natural approach (differentiate, relate to known identity) ALMOST works. The gap between $\sum J_n J_n'$ and $\sum n J_n J_n'$ is small enough that models hand-wave past it.

**Contradiction type:** GAP CONTRADICTION — the natural approach has a gap that looks closable but isn't. Models bridge the gap by assertion rather than proof.

---

## Problem 5: 77edf9d1 — Kapteyn Exponential (4/4 stumbled)

**What models did:** Recalled Kapteyn's identity $\sum J_n(nx) = x/(2(1-x))$ and tried to extend to $\sum J_n(nx)/n$ via integration/logarithm.
**What happened:** The extension doesn't work — integrating $\sum J_n(nx)$ term by term doesn't give $\sum J_n(nx)/n$ because the integral of $J_n(nx)$ w.r.t. $x$ is not $J_n(nx)/n$.

**TRIZ Contradiction:**
- Framework A: "Integrate the Kapteyn identity" → $\sum J_n(nx)/n = -\frac{1}{2}\ln(1-x)$ → $\Phi_K = 1/(1-x)$
- Framework B: Direct Taylor coefficient comparison → $x^3$ coefficient $1/8 \neq 1/6$
- **Resolving detail:** Integration w.r.t. $x$ doesn't produce the $1/n$ factor (because $\int J_n(nx)dx \neq J_n(nx)/n$). The analogy with $\sum x^n → \sum x^n/n = -\ln(1-x)$ is false for Bessel functions.

**Where does the confusion arise?** The ANALOGY with geometric series is seductive. For $\sum x^n$, dividing by $n$ gives $-\ln(1-x)$. Models assume the same pattern holds for Kapteyn series.

**Contradiction type:** ANALOGY CONTRADICTION — a pattern that works for simpler functions (geometric series) fails for the actual functions (Bessel-Kapteyn). Models extend the analogy without checking.

---

## Problem 6: 416a3c0f — Kapteyn-Bessel Antiderivative (4/4 stumbled)

**Same core contradiction as 77edf9d1, wrapped in an integral layer.** The false identity $\sum J_n(nx)/n = -\frac{1}{2}\ln(1-x)$ is hidden behind $\mathcal{K}(a) = \int_0^a S(t)dt$.

**Contradiction type:** ANALOGY CONTRADICTION (same as 77edf9d1, with obfuscation layer)

---

## Problem 7: f09a765d — Kelvin Wronskian (4/4 stumbled)

**What models did:** Tried to use standard Bessel Wronskian $W[J_0, K_0] = 1/z$ and substitute Kelvin function definitions.
**What happened:** The substitution introduces a sign error because Kelvin functions satisfy a DIFFERENT ODE from $J_0, K_0$ (rotated argument $xe^{i\pi/4}$ changes the ODE structure).

**TRIZ Contradiction:**
- Framework A: Standard Wronskian $W[J_0, K_0] = 1/z$ → $W_1 - W_2 = 1/x$
- Framework B: Careful ODE analysis with rotated argument → $W_1 - W_2 = -1/x$
- **Resolving detail:** The sign flips because the Kelvin ODE has different structure from the standard Bessel ODE. The rotation $z = xe^{i\pi/4}$ introduces $i$ factors.

**Where does the confusion arise?** Models recall "Wronskian = 1/z" and apply it. The rotation to Kelvin functions seems like it should preserve the sign, but it doesn't.

**Contradiction type:** RECALL CONTRADICTION (similar to 8ac6e061 — recalled formula for wrong case)

---

## Problem 8: c23294e1 — Rayleigh Sum Pattern (3/4 stumbled)

**What models did:** Computed $\sigma_1, \sigma_2, \sigma_3$ and extrapolated the pattern to $\sigma_4$.
**What happened:** The pattern (numerator = 1) breaks at $s=4$ where the correct numerator is $5\nu+11$.

**TRIZ Contradiction:**
- Framework A: Pattern extrapolation from $\sigma_1, \sigma_2, \sigma_3$ → simple formula
- Framework B: Full computation via Hadamard product + Newton's identity → nontrivial numerator
- **Resolving detail:** The first three Rayleigh sums happen to have numerator 1 by coincidence. The general formula has a polynomial numerator.

**Where does the confusion arise?** Three consecutive examples with the same pattern creates strong inductive evidence. Models trust the pattern.

**Contradiction type:** INDUCTION CONTRADICTION — a finite pattern is trusted as infinite. The regularity is coincidental.

---

## Summary: Five Contradiction Types

| Type | Description | Examples | Models' Error |
|------|-------------|----------|---------------|
| **FRAMING** | Problem statement steers toward wrong approach | fc18bf67, adaaffa2 | Follow the framing instead of checking simple properties |
| **RECALL** | Recalled formula is for a subtly different case | 8ac6e061, f09a765d | Apply recalled formula without checking it matches the problem |
| **ANALOGY** | Pattern from simpler functions fails for actual functions | 77edf9d1, 416a3c0f | Extend analogy (geometric series → Kapteyn) without verification |
| **GAP** | Natural approach has an unclosable gap | 7edc37eb | Hand-wave past the gap, assert the result |
| **INDUCTION** | Finite pattern trusted as infinite | c23294e1 | Extrapolate from $n=1,2,3$ without checking $n=4$ |

---

## Key Insight: The Best Problems Exploit HOW Models Think

Each contradiction type targets a specific reasoning shortcut:

1. **FRAMING** → targets "follow instructions" behavior. Models treat problem framing as ground truth.
2. **RECALL** → targets pattern-matching to training data. Models retrieve the closest formula and apply it.
3. **ANALOGY** → targets generalization. Models assume patterns transfer between function classes.
4. **GAP** → targets completeness checking. Models skip gaps in derivations.
5. **INDUCTION** → targets finite-evidence reasoning. Models trust small-$n$ patterns.

**The SL problem (wip_sturm_liouville.md) introduces a 6th type:**

6. **EMBEDDED FALSE PROOF** → targets proof verification. Models are given a plausible argument and must find the bug. This combines FRAMING (the argument steers toward the wrong conclusion) with GAP (the argument has a specific error — asymmetric sum limits).

---

## Design Implications

### To create a FRAMING problem:
Start with a trivially true/false claim. Then write the problem statement so the framing makes it seem like the answer should be the opposite. Use phrases like "must be evaluated by other means" or "cannot be reduced using standard techniques."

### To create a RECALL problem:
Find two similar formulas that differ by a subtle factor (sign, measure, argument). State the problem using one formula's setup but claim the other formula's result. Models recall the wrong formula.

### To create an ANALOGY problem:
Find a pattern that works for elementary functions but fails for special functions. Frame the problem so the elementary analogy is seductive.

### To create a GAP problem:
Design a derivation that ALMOST closes but has one impassable step. The gap should be small enough that models hand-wave past it.

### To create an INDUCTION problem:
Find a quantity where the first $k$ values follow a simple pattern but the $(k+1)$-th breaks it. Present the pattern as established.

### To create an EMBEDDED FALSE PROOF problem:
Write a plausible-looking derivation with a specific subtle error. Present it in the problem statement. Models must find the bug.

---

## Cross-Reference with Mechanism Catalog

| Contradiction Type | Related Mechanisms |
|---|---|
| FRAMING | Parity misdirection, operator domain |
| RECALL | Measure confusion, domain-of-validity, wrong formula |
| ANALOGY | Pattern extrapolation, series manipulation |
| GAP | Conditional convergence, interchanging limits |
| INDUCTION | Asymptotic regime mismatch |
| EMBEDDED FALSE PROOF | Any of the above, packaged as a given argument |

**The EMBEDDED FALSE PROOF is a meta-type** — it can wrap ANY of the other five contradiction types. Instead of hoping models make the error naturally, you GIVE them the error and ask them to find it. This is the most reliable approach because it controls the models' reasoning path.
