# Self-Reflection: Why Problems Fail (Session 2026-03-19)

## The Data

13 attempts this session. 4 successes (31% hit rate).

Successes: fc18bf67 (3/4), adaaffa2 (2/4), 8ac6e061 (4/4), 7edc37eb attempt 7 (2/4).
Failures: 9 attempts, all 0/4 or 1/4.

## Two Failure Modes

### A. Small-value short-circuit (5 of 9 failures)
Models plug in n=0, x=0, N=2, p=1/3, etc. and immediately disprove the claim.

### B. Formula recall short-circuit (3 of 9 failures)
Models recall the correct formula and it directly disproves the claim.

### C. One-step recurrence disproof (1 of 9 failures)
Models derive the recurrence and catch the error in one step.

## What Makes Successful Problems Work

All 4 successes share one property: the natural approach models take leads to the WRONG answer.

- fc18bf67 and adaaffa2: models follow the framing and miss parity
- 8ac6e061: models recall formula for wrong measure
- 7edc37eb: models try differentiation approach that hits an impassable gap

The trap is ON the verification path, not hidden from it.

## The Q1-Q4 Design Test

- Q1: What will a model try FIRST?
- Q2: Does that first attempt reveal the falsity? If YES → REDESIGN.
- Q3: Does the natural verification path CONFIRM the false claim? If NO → trap isn't working.
- Q4: What non-obvious step is needed to find the truth? If trivial → REDESIGN.

## Critical Gap: We Keep Recycling the Same Mechanisms

All 4 successes use variations of just 2 mechanisms:
1. Parity misdirection (fc18bf67, adaaffa2) — framing hides simple symmetry argument
2. Coefficient/measure confusion (8ac6e061, 7edc37eb) — models recall/apply formula for wrong case

We have NOT discovered a genuinely new trap mechanism this session. The 7edc37eb success (Kapteyn squared) is a variant of the Kapteyn approach from 416a3c0f. The separation rule requires 5+ problems between same-technique submissions.

## Unexplored Mechanisms (for next session)

These are genuinely NEW approaches, not variations of existing ones:

### 1. Domain-of-validity error
An identity is true for |z|<1 but claimed for z=2. Models recall the identity and apply it without checking convergence. The disproof requires understanding analytic continuation or branch cuts. No existing problem uses this mechanism.

### 2. Asymptotic regime mismatch
A formula is valid for large n but claimed for all n. Models recall the asymptotic and don't check finite n. Or vice versa — a finite-n formula claimed to hold asymptotically.

### 3. Stokes phenomenon (f15e9522 draft)
Hankel function asymptotic is valid in a sector but claimed globally. Models don't check Stokes lines. This is Tier 1 — genuinely requires understanding of complex analysis.

### 4. Conditional convergence manipulation
Rearranging a conditionally convergent series changes its sum. Claim the rearranged sum equals the original. Models may not check absolute convergence.

### 5. Interchanging limits
Claim that lim_n lim_x = lim_x lim_n for a double limit where the interchange is invalid. Models often assume limits commute.

### 6. Operator domain error
A self-adjoint operator identity that holds on the domain of the operator but is claimed on a larger space. Models apply the identity without checking domain conditions.

### 7. Hidden branch cut
A function defined via integral representation has a branch cut that isn't obvious. Claim the function is analytic where it isn't. Models evaluate the integral without checking analyticity.

Each of these is a genuinely different mechanism from parity misdirection or coefficient confusion. They test different mathematical reasoning skills. Next session should explore at least one of these.
