# Peacock Playbook — Numerical-Answer Problems with FEA / Solver Defense

Local supplement to the canonical Lovable guidance (`references/lovable_content.md`). Focuses on
problems whose ground-truth answer is defended by a numerical solver (FEA, Fourier transform,
quadrature) rather than a closed-form derivation. Distilled from `layered_centerline_threshold_problem`
(Apr–May 2026).

The Lovable docs cover *what* a Peacock submission must contain. This file covers *how to defend
the number* against a domain-expert reviewer and a frontier-model auditor.

---

## Part I — Pre-submission checklist

### 1. Prompt hygiene

- Define the target quantity **neutrally** (`Let X = …` / `define Y = f(X)`). Do not label
  formulas with physical names that imply a derivation context inconsistent with your numerical
  setup. Example: do not call `σ_zo = (σ_z − σ_x)/2` an "undrained plane-strain relation" if you
  are using ν = 0.3 (drained); a reviewer can argue ν_u should be 0.5. Same formula, no rhetorical
  handle.
- Append the standard intermediate-precision instruction
  (Matt O., 2026-04-17 in `#peacock-physics`):
  > "The answer is [units / dimensionless]. Report your answer as a [N]-decimal / [N]-significant-figure
  > number only. Any intermediate calculations should be carried out to at least [M] significant figures."
- State the medium extent explicitly if it is unbounded ("infinite half-plane z > 0, x ∈ ℝ").
- For spline / piecewise loads: verify the formula passes through every node and respect the
  smoothness conditions (e.g. not-a-knot reduces to a single polynomial across the second knot).
  Hand-check at every node.

### 2. Closed-form anchor (mandatory)

For any layered / perturbed problem where the answer comes from a numerical solver, compute the
unperturbed homogeneous limit closed-form. This is the anchor.

- Cross-check the homogeneous answer **at least three ways**: direct kernel integration, an
  alternative kernel form, closed-form per-monomial. All three agreeing to 4+ decimals means the
  anchor is fixed and you can detect bugs in the layered solver.
- **Identity-confusion trap:** `(σ_z − σ_x)/2` and `(z/π) ∫ q(ξ)[z² − (x−ξ)²]/((x−ξ)² + z²)² dξ`
  are the *same integral* in the homogeneous half-plane, not two different observables. If hand-
  evaluations disagree, it is an arithmetic bug, not a physical insight. (This trapped a rebuttal
  pass with `σ_zo^hom ≈ 0.2471` when the true value was 0.3954.)

### 3. FEA verification protocol

- **Three refinements minimum, four is better.** Two points = no extrapolation possible.
- **Surface-BC sanity check:** σ_z at z = 0⁺ inside the loaded zone should equal q(x) to within
  ~1% (CST stress-recovery tolerance). If not, the bug is upstream of stress recovery — fix
  before proceeding.
- **Stress-sum sanity check:** σ_z + σ_x at the evaluation point within a plausible band of the
  homogeneous reference (homogeneous: σ_z + σ_x = 2 P₀ where P₀ is the harmonic extension of q).
  For moderate stiffness contrast at z/h far from the interface, expect ~10–20% deviation, not
  50%. (A 45% drop in σ_z + σ_x at z/h = 0.35 is a swapped-material-zones bug, not a real layered
  effect.)
- **Material assignment:** explicitly verify which elements get E₁ vs E₂. A subtle off-by-one in
  the layer-interface coordinate produces stresses that look catastrophically wrong but with no
  loud error.

### 4. Error-bar derivation

The single most common mistake: **the gap between two refinements is NOT the discretization error
of either solve.** It is the error of the Richardson-extrapolated answer.

For first-order convergence with refinement ratio r = h_fine / h_coarse:

```
error(σ_h_coarse)  ≈  |σ_h_fine − σ_h_coarse| × r / (1 − r)

  r = 3/4  →  error = 3 × gap
  r = 2/3  →  error = 2 × gap
  r = 1/2  →  error = 1 × gap

σ_∞  ≈  (σ_h_fine − r·σ_h_coarse) / (1 − r)
```

For multi-step refinement where convergence rate is unclear, **Aitken Δ²** is the safe non-
parametric extrapolation (just assumes geometric convergence; no assumed rate):

```
σ_∞  ≈  x_n  −  (x_{n+1} − x_n)²  /  (x_{n+2} − 2·x_{n+1} + x_n)
```

If gaps don't shrink as first-order predicts, document the sub-first-order behavior and trust
Aitken or the slowest-rate extrapolation, not the optimistic one.

Quote the final answer with the *derived* error bar, not an asserted one.

### 5. Stumble accounting under the 5 % rule

Per Lovable / Matt O. (2026-04-17): "If model responses are close to the correct answer, that is
not a valid failure. Within 1–2 % usually not significant; generally want 5 %+ difference."

For each of the 5 model responses, compute `|model − reference| / |reference| × 100`:

| % off | Validity |
|---|---|
| < 1–2 % | Definitely not a valid failure |
| 3–5 % | Probably not a valid failure |
| 5–10 % | Borderline; reviewer-dependent |
| > 10 % | Clearly valid |

Threshold to clear: **≥ 2 of 5 valid failures**.

### 6. Failure-justification pick

Rank candidate failures by, in order:

1. **% off** — strictly above tolerance. Prefer > 10 % to be safe. Borderline picks are reviewer-
   dependent and risky.
2. **Mapping to a documented FM1–4** (see `references/lovable_content.md`). Cleanest mappings:
    - **FM2** — framework applied outside its regime (e.g., reflection-coefficient analogy used
      where it doesn't carry over)
    - **FM3** — premature dismissal of a load-bearing computation step (e.g., model "solves" a
      4×4 boundary-value system in words but never writes it down)
3. **Visibility of the specific reasoning step.** Model must show work you can point at. A model
   that just states a wrong number with no derivation gives you a weaker justification than one
   that shows a wrong reasoning step.
4. **Distance from "computational slip" framing.** Peacock prefers reasoning errors. A model
   that adds two correct numbers wrong is a computational slip; a model that applies the wrong
   framework is a reasoning failure.

Use the Lovable Step 5 template (Where / What / Why / Impact). Name the FM explicitly.

---

## Part II — Worked example: `layered_centerline_threshold_problem`

**Problem:** σ_zo / p₀ at (x = 0, z = a/4 = 10.5 cm) under spline surface pressure on two-layer
plane-strain elastic half-plane, E₂ / E₁ = 30, ν = 0.3 in both layers.

### Closed-form anchor (homogeneous limit)

Three independent methods at the evaluation point:

| Method | σ_z / p₀ | σ_x / p₀ | σ_zo / p₀ |
|---|---|---|---|
| Direct Flamant kernels (scipy.quad) | 1.43815 | 0.64734 | 0.39541 |
| Poisson-kernel form (z/π) ∫ q(ξ)[z²−ξ²]/(ξ²+z²)² dξ | — | — | 0.39541 |
| Closed-form per-monomial (analytical J_k integrals) | 1.43815 | 0.64734 | 0.39541 |

All three agree to 5 decimals. Anchor fixed.

### FEA mesh-convergence sequence (CST P₁ plane strain)

| N (cells) | σ_zo / p₀ | Δ | Note |
|---|---|---|---|
| 480 × 240 | 0.56418 | — | |
| 640 × 320 | 0.56824 | +0.00406 | first-order prediction Δ ≈ +0.00406 ✓ |
| 960 × 480 | 0.57282 | +0.00458 | gap grew → sub-first-order |
| 1280 × 640 | 0.57371 | +0.00090 | series stabilizing |

**Aitken Δ² on the last three points:**
σ_∞ ≈ 0.56824 − (0.00458)² / (0.00090 − 0.00458) = **0.57393**

The 1280 value (0.57371) is essentially on top of the Aitken estimate → converged.

### Sanity checks at finest mesh

- Surface BC: σ_z(0, 0⁺) ≈ 1.58 vs imposed q(0) = 1.6 → 1.3 % deviation, within CST tolerance. ✓
- Stress sum: σ_z + σ_x ≈ 1.81 vs homogeneous 2.09 → 13 % deviation, plausible layered effect. ✓
- σ_zo direction: layered (0.574) > homogeneous (0.395), upward correction of +0.18 — consistent
  with stiff lower layer providing lateral release ("toothpaste effect" reducing σ_x). ✓

**Final answer: 0.57.** Error bar ≤ 0.001 from 1280 → Aitken consistency.

### Stumble accounting (reference = 0.57)

| Rep | Final | Abs error | % error | Valid? |
|---|---|---|---|---|
| 1 | 0.46 | 0.11 | 19.3 % | ✓ clear |
| 2 | 0.59 | 0.02 | 3.5 % | ✗ within tolerance |
| 3 | 0.57 | 0 | 0 % | exact match |
| 4 | 0.60 | 0.03 | 5.3 % | borderline |
| 5 | 0.17 | 0.40 | 70 % | ✓ clear |

**2 clear + 1 borderline ≥ 2/5 gate met.**

### Failure-justification pick: Rep 5 (FM3)

Why this pick:
- 70 % off — well above any tolerance; no reviewer-dependence risk.
- Maps cleanly to **FM3 (premature dismissal of load-bearing computation)** — same shape as the
  Lindblad-dimer example in the Lovable failure-modes catalog.
- Specific named omission: the 4×4 boundary-value system that defines the layered transfer
  function `I(H)`. The model claims `I(H)` is "obtained directly by substituting E₂/E₁ = 30 and
  ν = 0.3 into the boundary value matrix system" but never writes the matrix or solves it.
  Substitutes three asserted sample values and a heuristic "bell-curve area ≈ 0.543."

**Where:** Section 2 → 3 transition where I(H) should be computed.
**What:** 4×4 boundary-value system never solved; transfer function never derived.
**Why:** I(H) is the only piece of the analytical chain that distinguishes the layered problem
from the homogeneous half-space; skipping it is a structural omission, not a computational slip.
**Impact:** Heuristic gives 0.543/π ≈ 0.17. Correct: homogeneous 0.395 + layered correction 0.179
= 0.574. The 70 % deficit traces entirely to the un-computed transfer function.

---

## Part III — Pitfalls observed (don't repeat)

1. **Quoting the two-mesh gap as the error bar.** The 0.00406 gap between 480 and 640 is not the
   error of 480; for first-order convergence with r = 3/4 it's roughly *one quarter* of that error.
   Misquoting this pushed the original answer to 0.56 when the truth was 0.57.

2. **"Two formulas, two observables" fallacy.** When `(σ_z − σ_x)/2` and the Poisson-kernel form
   for σ_zo disagree in hand-evaluation, it's an arithmetic bug, not a different physical
   quantity. They are algebraically identical in the homogeneous half-plane.

3. **Stress recovery that fails the surface BC.** σ_z = 0.917 at z = 10.5 cm directly under a
   peak load of 1.6 p₀ is physically impossible at this depth — σ_z is bounded above by the
   surface BC for elastic moduli unchanged through that 10.5 cm. If your FEA gives this kind of
   value, the bug is upstream of stress recovery; don't attempt error-bar analysis on a broken
   solve.

4. **Non-monotone convergence quietly.** When the gap *grows* between two refinements (Δ_23 >
   Δ_12 in our sequence), at least one of the points is not in the asymptotic regime. Don't
   extrapolate; refine further.

5. **Borderline-tolerance failure picks (5–6 % off).** Reviewer-dependent. Skip them when
   safer picks above 10 % exist.

6. **"Undrained" labeling with drained Poisson.** Reviewer model picks at this. Use neutral
   definitional language ("Define" / "Let") for post-processing operations.

7. **Two refinements masquerading as a convergence study.** Two points fit any line; you cannot
   detect sub-first-order convergence or non-monotone behavior with two points. Three is the
   minimum, four is honest.

---

## Part IV — Templates

### Closed-form sanity-check script (Python skeleton)

```python
from scipy.integrate import quad
import math

# Problem-specific
a, z = ..., ...
def q(xi): ...

# σ_zo via Poisson-kernel form
def f_zo(xi):
    return q(xi) * (z**2 - xi**2) / (xi**2 + z**2)**2
zo, _ = quad(f_zo, -a, a, limit=400)
sigma_zo_A = (z/math.pi) * zo

# σ_zo via Flamant components
def f_sz(xi): return q(xi) * z**3 / (xi**2 + z**2)**2
def f_sx(xi): return q(xi) * xi**2 * z / (xi**2 + z**2)**2
sz, _ = quad(f_sz, -a, a, limit=400)
sx, _ = quad(f_sx, -a, a, limit=400)
sigma_zo_B = (1/math.pi) * (sz - sx)

assert abs(sigma_zo_A - sigma_zo_B) < 1e-6  # must agree
```

### Failure-justification template (Step 5)

```
**Where:** [exact section / step where the error occurs]
**What:** [specific named error — name the framework / quantity / step]
**Why:** [why this is a reasoning failure, not a computational slip;
          map to FM1, FM2, FM3, or FM4 and cite the analogous Lovable example]
**Impact:** [propagation to wrong final answer with specific values:
            "model: X, correct: Y, deficit: Z%, traceable to <named omission>"]
```

---

## Part V — Cross-references

- Canonical Lovable content: `references/lovable_content.md`
- Project context: `README.md`
- Phoenix master playbook (different format, T/F problems): `../domain_guides/playbook.md`
- Slack channel: `#peacock-physics` (`C0AT4D0J32A`)
- Domain lead: Matt O. (`U0ANBMMDC81`)
