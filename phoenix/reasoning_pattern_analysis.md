# Analysis of Reasoning Patterns in Existing Problems

## Date: 2026-03-20

## Goal
Identify which problems use GENUINE reasoning traps (not recall/memorization) and extract patterns for new problem design.

## Classification of All Problems Reviewed

### Type 1: COMPUTATION TRAPS (disproof requires hard computation)
These problems are False, and the disproof requires computing something that's genuinely difficult.

- **77edf9d1 (4/4):** Taylor coefficients of $J_n(nx)/n$ at $x^3$. Hard because $J_n(nx)$ has $n$ in the argument. Models must expand to $x^3$ and collect from $n=1$ and $n=3$.
- **416a3c0f (4/4):** Same mechanism wrapped in integral. $a^4$ coefficient mismatch.
- **7edc37eb (2/4):** Taylor coefficients of $[J_n(nx)]^2/n$ at $x^6$. Even harder computation.
- **c23294e1 (3/4):** Rayleigh sum $\sigma_4(\nu)$ via Hadamard product. Requires the $n=4$ Newton identity relation. Pattern from $\sigma_1,\sigma_2,\sigma_3$ breaks.

**What makes these work:** The computation required to disprove is HARD — it involves multiple terms, Pochhammer algebra, or recurrence relations. Models take shortcuts (assume the pattern continues, assert without computing, hand-wave past gaps) instead of doing the full computation.

**Reasoning error:** INDUCTION — trusting a pattern from small cases. "It works for $k=1,2$, so it works for all $k$."

### Type 2: WRONG-OBJECT TRAPS (correct technique applied to wrong case)
The model applies a valid technique but to the wrong mathematical object.

- **8ac6e061 (4/4):** Models recall $\int J_0^3 \cdot t\,dt = 1/(2\pi A)$ and apply it. The problem has $\int J_0^3 \cdot dt$ (no $t$ weight). The recalled formula is for a DIFFERENT integral.
- **f09a765d (4/4):** Models recall $W[J_0, K_0] = 1/z$ and apply it. Kelvin functions satisfy a DIFFERENT ODE (rotated argument), so the Wronskian has a different sign.
- **91a25388 (?):** Models apply Neumann addition theorem for $J_m$ directly to $I_m$. The correct $I_m$ formula has extra $(-1)^m$ factors from $I_m = i^{-m}J_m(iz)$.

**What makes these work:** The problem LOOKS like a standard case but ISN'T. The difference is subtle (a sign, a weight factor, a rotated argument). Models pattern-match to the standard case without checking.

**Reasoning error:** ANALOGY — applying a formula from one context in a slightly different context without verifying the conditions.

### Type 3: FRAMING TRAPS (problem statement steers away from simple answer)
The problem says "this can't be done simply" when it actually can.

- **fc18bf67 (3/4):** Problem says "cannot be directly reduced using standard Legendre orthogonality, so $I(\ell,m)$ must be evaluated by other means." Actually the integral is zero by parity.
- **adaaffa2 (2/4):** Same mechanism for Hermite. "Since $|x|$ is not a polynomial... $\Omega(n)$ must be evaluated by other means." Actually zero by parity.

**What makes these work:** The problem creates a false premise. Models follow instructions and launch into complex computation instead of checking the simple property first.

**Reasoning error:** FRAMING — accepting the problem's framing as mathematically necessary when it's misleading.

### Type 4: DOMAIN/CONVERGENCE TRAPS (technique fails at boundary)
A valid technique breaks down at a specific point.

- **af454602 (?):** Uniform asymptotic bound for $H_\nu^{(1)}$ claimed on $(-\pi,\pi)$. Fails near $\theta = -\pi$ (branch cut) where monodromy gives a different leading term.
- **0af97337 (?):** Graf addition theorem series analytically continued across $r=p$. The series diverges for $r>p$ — function continuation ≠ series continuation.

**What makes these work:** The technique is valid in a region but fails at the boundary. The problem asks about the boundary case.

**Reasoning error:** EXTRAPOLATION — assuming a technique valid in the interior extends to the boundary.

### Type 5: SMALL-VALUE COUNTEREXAMPLE (trivial disproof)
These are problems where models CHECK and find the answer. Not really "reasoning traps."

- **e878374b (?):** Bound on $I_\nu K_\nu$. Disproved at $\nu=1/2, x=2$ using exact formulas. Models just compute.
- **016629d1 (?):** Order-derivative identity. Disproved at $\nu=1, z\to 0$ by comparing divergence rates.

**These are NOT reasoning traps** — they test computation, not reasoning. Models that compute correctly get the right answer.

---

## KEY INSIGHT: The Best Problems Combine Types

The 4/4 successes combine TWO types:

- **8ac6e061:** Type 2 (wrong-object: $dt$ vs $t\,dt$) + Type 1 (hard computation: scaling argument)
- **77edf9d1:** Type 2 (analogy: geometric series → Kapteyn) + Type 1 (hard computation: Taylor coefficients)
- **f09a765d:** Type 2 (wrong-object: Bessel vs Kelvin ODE) + Type 1 (hard computation: asymptotic expansion)

The stumble happens because:
1. The wrong-object/analogy trap makes models CONFIDENT they know the answer (Type 2)
2. The hard computation means they don't CHECK (Type 1)

If the computation were easy, models would check and catch the error (Type 5). The hard computation is what PROTECTS the trap.

---

## RECIPE FOR A GENUINE REASONING PROBLEM

1. **Start with Type 2 (wrong-object):** Find a situation where a valid technique/formula ALMOST applies but doesn't. The difference must be subtle — a sign, a weight, a parameter shift.

2. **Protect with Type 1 (hard computation):** Make sure the computation required to disprove is genuinely difficult. Models should be unable to verify in one step.

3. **Optional: Add Type 3 (framing):** Frame the problem so the false answer seems natural. Provide "evidence" (matching at low orders, structural similarity, physical motivation).

The key equation:
**Confidence (Type 2) × Difficulty of checking (Type 1) = Stumble probability**

If confidence is high but checking is easy → models check → 0/4
If confidence is low but checking is hard → models are cautious → they work harder → might still catch it
If confidence is HIGH and checking is HARD → models trust their first answer → 4/4

---

## WHAT I SHOULD LOOK FOR IN all.md

Problems that combine:
- A formula/technique that ALMOST applies (Type 2)
- A computation that's HARD to do correctly (Type 1)

And avoid:
- Problems where the disproof is one small-value check (Type 5)
- Problems where the reasoning error is "not knowing a formula" (recall trap)
- Problems where the alternative disproof path is easy (like the SL problem)
