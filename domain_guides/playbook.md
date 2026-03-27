# Phoenix Master Playbook
# Living document — update after every successful run

This playbook is the single reference for designing stumble problems. Top half: methodology (stable). Bottom half: field notes (grows every session). The best new problems will come from approaches not yet written here. Try new things, cross-pollinate, update this document when something works.

---

# PART I — METHODOLOGY

## The Design Formula

**Premature confidence × No easy bypass = Stumble**

NOT "hard computation." Models CAN compute. The barrier is that models believe they already have the answer and don't check. Arithmetic errors don't count as stumbles.

**Premature confidence** comes from:
- A plausible structural argument that ALMOST works (Gegenbauer: $x=1$ bound)
- A recalled formula that ALMOST applies (8ac6e061: $dt$ vs $t\,dt$)
- An analogy that ALMOST transfers (77edf9d1: geometric → Kapteyn)
- A pattern that ALMOST continues (c23294e1: Rayleigh sums)

**No easy bypass** means:
- No simple substitution disproves the claim immediately
- No alternative computation path avoids the trap
- The problem must not have an exact closed-form solution accessible in one step (SL failure: models derived eigenvalue equation and bypassed the trap entirely)

## The Cardinal Rule

**TRIZ works 100% of the time. If you can't find a problem in a domain, you haven't generated enough noise.**

## Complexity Principle

**The error must live in the INTERACTION of multiple components, not in any single component alone.**

Simple problems = one component = models solve instantly.
Complex problems = multiple interacting components = models simplify away the interaction = stumble.

Each component must be correct in isolation. The falsity only appears when you put them together.

**Example — Gegenbauer (2/4 success):**
- Component 1: $g_k \geq 0$ (correct)
- Component 2: $x=1$ evaluation gives valid bound (correct)
- Component 3: The bound involves $(2\lambda)_m$ while actual formula has $(\lambda)_m$ (subtle difference)
- Interaction: The factor-by-factor comparison gives $m(\lambda-1) \leq 0$, which holds for $\lambda \leq 1$ but REVERSES for $\lambda > 1$

R1 and R4 each reduced to a single-component analysis and missed the interaction.

## Reasoning Traps, Not Recall Traps

**Never assume models can't memorize.** A trap that relies on models NOT recalling a formula is a recall trap, not a reasoning trap. Models know everything. The trap must be in the REASONING.

A good problem is one where even a model that knows everything still gets fooled because:
- The natural reasoning path leads to the wrong answer (premature confidence)
- The correct reasoning requires noticing a subtle interaction between components (complexity)
- There is no easy alternative path to the correct answer (no bypass)

**What failed (recall traps):**
- Clausen ($1/2 \to 1$): models recalled exact parameter condition → 0/4
- SL perturbation: models derived exact eigenvalue equation → 0/4

**What worked (reasoning trap):**
- Gegenbauer linearization: models did the factor-by-factor analysis (correct reasoning technique) but missed the sign flip at $\lambda > 1$ → 2/4

## Patterns in Successful Problems

1. **"For all $n$" but fails at specific $n$** — most common pattern
2. **Small perturbation of known identity** — one sign, one factor, one parameter
3. **Concise** — readable in 2 minutes, solution in 5 lines
4. **Mix of True and False** — roughly 50/50
5. **Claim is TRUE for most parameter values, FALSE for specific ones** — spot-checking usually confirms the claim

---

## The Pipeline: Complexity First

**Start from complexity, not noise.** Ask: "What two or three correct things, when combined, produce a wrong conclusion?" The interaction IS the problem. The perturbation, TRIZ classification, and Q1-Q4 all follow naturally.

Gaussian noise is a secondary method — useful when you're stuck, but complexity-first is the primary design approach.

```
Complexity (what interacting components create confusion?)
    ↓ the perturbation/claim emerges naturally from the interaction
TRIZ Classification (what type of contradiction?)
    ↓ classify for stumble rate prediction
Q1-Q4 Validation + Short-circuit + Bypass checks
    ↓ self-critique
Problem Design (write concise claim + solution)
    ↓ GPT verification + test on Phoenix
Submission
```

**Alternate path (when stuck):** Gaussian noise — generate many random perturbations of known identities, filter for subtle breaks, then check for complexity.

---

## Starting from Complexity

**The primary design question:** "What two or three correct things, when combined, produce a wrong conclusion?"

Identify the components first:
- What are the interacting components?
- What does each component look like in isolation? (Must look correct)
- Where does the interaction create the error?
- Will models simplify away the interaction? (Must be YES)

The claim and the perturbation emerge from the interaction — you don't need to start with a known identity.

## Alternate Path: Gaussian Noise

When complexity-first doesn't yield ideas, generate many perturbations fast.

Take a known identity from N-U or any reference. Perturb it along one or more of these dimensions:

| Dimension | Perturbation | Example |
|---|---|---|
| **Measure** | Change $t\,dt \to dt$, or $e^{-x}x^\alpha \to e^{-x}x^{\alpha+1}$ | 8ac6e061: $t\,dt \to dt$ in triple Bessel integral |
| **Weight/factor** | Add or remove a factor of $n$, $t$, $(-1)^n$ | 7edc37eb: divide by $n$ in squared Kapteyn sum |
| **Argument** | Rotate $z \to ze^{i\pi/4}$, or substitute $z \to z^2$ | f09a765d: Kelvin functions = Bessel at $xe^{i\pi/4}$ |
| **Parameter** | Shift $\nu \to \nu+1$, or $c \to c+1$ in ${}_2F_1$ | Could apply to any parametric identity |
| **Index range** | Change $\sum_{-\infty}^{\infty}$ to $\sum_0^{\infty}$, or truncate | SL problem: semi-infinite sum looks symmetric |
| **Order** | Extend a formula from $s=1,2,3$ to $s=4$ | c23294e1: Rayleigh sum pattern breaks at $s=4$ |
| **Analogy** | Apply a rule from simpler functions to special functions | 77edf9d1: geometric series $\to$ Kapteyn series |
| **Domain** | Extend from $|z|<1$ to $z=2$, or from $a>b$ to $a<b$ | Weber-Schafheitlin (failed — restriction too well-known) |
| **Sign** | Flip a sign in a recurrence or Wronskian | f09a765d: $1/x \to -1/x$ |
| **Framing** | Add misleading context to a trivial fact | fc18bf67: "must be evaluated by other means" for a zero integral |
| **Bound** | Claim a quantity satisfies an inequality it doesn't | 7edc37eb-v2: $g_{m+n} \leq 1$ fails for $\lambda > 1$ |
| **Quantifier** | Claim "for all $\lambda$" when it holds only for $\lambda \leq 1$ | Gegenbauer: factor inequality reverses at $\lambda = 1$ |

**If nothing survives: generate more noise, not less.** TRIZ works 100%.

**Critical filter:** For each perturbation that produces a break, ask:
- Is the break detectable at $n=0$? → discard
- Is the break detectable by recalling the correct formula? → discard
- Does the break require multi-step reasoning to detect? → KEEP
- Does the error live in an INTERACTION of components? → STRONG KEEP

## TRIZ Contradiction — Classify and Structure

| Type | What it exploits | Stumble rate | Best for |
|---|---|---|---|
| **RECALL** | Models retrieve closest formula without checking | 4/4 | Measure/weight/argument perturbations |
| **ANALOGY** | Models extend patterns from simpler functions | 4/4 | Index/analogy perturbations |
| **INDUCTION** | Models trust finite patterns | 3/4 | Order perturbations |
| **FRAMING** | Models follow problem framing as ground truth | 2-3/4 | Framing perturbations |
| **GAP** | Models hand-wave past unclosable derivation gaps | 2/4 | Index range/conditional convergence |
| **INTERACTION** | Models reduce multi-component problem to single component | 2/4 | Bound/quantifier perturbations |
| **SINGULARITY** | Models apply principle globally without checking boundary/singular case | 3-4/4 | Classical principle at singular endpoint — **strongest pattern in dataset** |

## Q1-Q4 Validation

- **Q1:** What will a model try FIRST?
- **Q2:** Does that reveal the falsity? → Must be NO
- **Q3:** Does the natural path confirm the false claim? → Must be YES
- **Q4:** What non-obvious step reveals the truth?

If Q2=YES or Q3=NO → REDESIGN.

## Short-circuit check

- **Mode A:** Can models check at small values? → DISCARD
- **Mode B:** Can models recall the correct formula? → DISCARD
- **Mode C:** One-step disproof? → DISCARD
- **Mode D:** Can models bypass the trap entirely? (e.g., derive exact solution) → DISCARD

## Originality Score (before GPT verification)

**Originality = rarity of the audit pattern required to catch the error.**

Not "is the math exotic?" but "will the model know where to look for the mistake?"

Rate each axis Low / Medium / High. **If any axis is Low → REDESIGN.**

### Axis 1: Audit Novelty
How nonstandard is the exact check needed to catch the flaw?
- **Low:** flaw caught by standard checks (small values, endpoint, normalization, parity)
- **Medium:** flaw requires checking something textbooks mention but don't emphasize
- **High:** flaw lives in something textbooks leave implicit (measure, admissibility regime, branch choice, basis-inherited normalization)

### Axis 2: Disproof Resistance
How many standard verification attacks does the claim survive?
- **Low:** first standard check kills it (plug in $n=1$, recall formula)
- **Medium:** survives 1-2 standard checks, dies on the 3rd
- **High:** survives small-value check, endpoint check, normalization check, parity check — disproof requires importing a check from a different regime

### Axis 3: Camouflage Strength
How strongly does the surface math lure the model into the wrong verification routine?
- **Low:** surface presentation doesn't suggest a specific verification path
- **Medium:** surface suggests a standard path that partially confirms the claim
- **High:** surface strongly invites a familiar verification script that looks locally legitimate and fully confirms the false claim

### Scoring against data:

| Problem | Audit | Resistance | Camouflage | Result |
|---|---|---|---|---|
| 8ac6e061 (Bessel measure) | High | High | High | **4/4** |
| 7edc37eb-v4 (Gegenbauer) | Medium | Medium | High | **2/4** |
| 7edc37eb (Kapteyn) | Medium | Medium | Medium | **2/4** |
| SL perturbation | Low | Low | Low | **0/4** |
| CG moment | Low | Low | Low | **0/4** |

### The key principle:

> A problem is highly original when the visible mathematics suggests one verification script, but the true defect lives in a different script.

This is why cross-domain interactions often work — not because the combination is rare, but because the model anchors on one domain's verification routine and neglects the other domain's audit.

### Full-dataset analysis (122 submitted problems, all 2+/4)

**Score distribution:**
- 18 problems at score 8-9 (top tier, High on 2-3 axes)
- 31 problems at score 7+ (excellent)
- ~50 at score 5-6 (solid)

**Dominant winning pattern: Singularity/Boundary traps (11 problems at perfect 9/9)**

Template: "By [CLASSICAL PRINCIPLE], [CLAIM AT SINGULAR/BOUNDARY POINT]"

The principle (S-L orthogonality, raising operators, standard identities) is correct everywhere except the singular case. Models apply mechanically without checking admissibility at the singularity.

Why it scores 9/9:
- **Audit High:** singular/boundary behavior is implicit in textbooks — models lack frameworks for analyzing it
- **Resistance High:** interior checks all pass; small-value tests don't reveal boundary divergence
- **Camouflage High:** classical principle invoked correctly within its domain of validity; models accept as complete proof

Example (005a9124): "By S-L orthogonality on $(0,1)$, $I_k = 0$" — but integral involves $J_\nu(\alpha x)$ near $x=0$ where boundary term requires $O(x^\nu)$ asymptotic analysis. Models apply orthogonality globally without checking singular endpoint.

**Second-best pattern: Asymptotic miscount (12 problems at score 7-8)**

Claim wrong growth rate ($N^2$ instead of $N$). Models guess from "sum of $N$ squared terms" heuristic but miss oscillatory cancellation requiring Christoffel-Darboux kernel or Hilbert asymptotics.

**Third pattern: Boundary behavior (8 problems at score 8)**

Interior formula applied globally; fails at domain boundary. Correct in bulk, wrong at the edge.

### Trap type effectiveness ranking (from 122-problem dataset)

| Trap Pattern | Count at 8+ | Avg Score | Design Priority |
|---|---|---|---|
| Singularity/divergence at endpoint | 11 | 9.0 | **PRIMARY** |
| Asymptotic growth miscount | 12 | 7.5 | HIGH |
| Boundary behavior mismatch | 8 | 8.0 | HIGH |
| Measure/weight confusion | 3 | 8.0 | HIGH |
| Pattern extrapolation (induction) | 5 | 7.5 | MEDIUM |
| Orthogonality insufficiency | 40+ | 5.8 | LOW — too many, models may learn |
| Derivative/operator structure | 19 | 6.0 | LOW |

### Design implications

1. **Prioritize singularity/boundary traps** — highest score, hardest for models to audit
2. **Classical principles at singular points** are the strongest camouflage — models trust them absolutely
3. **Avoid orthogonality-only traps** — 40+ in the dataset, models may start checking these
4. **Cross-domain = camouflage amplifier** — not inherently strong, but hides which audit script is needed
5. **Two Highs needed for 3+/4** — Medium/Medium/High gives 2/4, need at least two Highs for reliable 3+

---

## Self-critique (before GPT verification)

Run these 4 checks from `phoenix/self_critique_prompts.md`:
1. **Weakness Hunt** — "List the 3 biggest weaknesses. Is the trap too obvious? Too obscure? Too computational?"
2. **Expert Panel** — "A domain specialist, a Phoenix reviewer, and a frontier LLM — what would each push back on?"
3. **Assumption Audit** — "List every assumption. Flag which ones a model could easily verify."
4. **Contradiction Check** — "Is the claimed formula consistent with known special cases?"

---

## How Every Successful Problem Was Born

| Problem | Noise | Contradiction | Complexity |
|---|---|---|---|
| 8ac6e061 | Measure: $t\,dt \to dt$ | RECALL | Scaling argument × measure confusion |
| 77edf9d1 | Analogy: geometric → Kapteyn | ANALOGY | Series structure × coefficient algebra |
| 416a3c0f | Same, wrapped in integral | ANALOGY | Same |
| f09a765d | Argument: $z \to xe^{i\pi/4}$ | RECALL | Wronskian formula × rotated ODE |
| c23294e1 | Order: extend $s=3$ to $s=4$ | INDUCTION | Pattern × Newton identity recurrence |
| fc18bf67 | Framing: "by other means" | FRAMING | Framing × parity |
| adaaffa2 | Same, Hermite domain | FRAMING | Same |
| 7edc37eb-v2 | Bound: $g_{m+n} \leq 1$ | INTERACTION | $x=1$ bound × Pochhammer ratio × parameter range |

## What NOT to Design

1. **Recall traps** — models recall too well (Clausen: 0/4, SL: 0/4)
2. **Easy bypass problems** — alternative disproof path shorter than engaging with trap (SL: implicit differentiation)
3. **Ill-posed problems** — integral doesn't exist, ambiguous claim (Fubini)
4. **Well-known counterexamples** — QC will flag them (Fubini: 5+ sources)
5. **Low-order coefficient mismatches** — models compute $z^2$ easily (Clausen: 0/4)

---

# PART II — FIELD NOTES

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
13. **Singularity/Boundary Trap** — invoke a classical principle (S-L orthogonality, raising operators) that's correct in the interior but breaks at a singular endpoint. Models apply mechanically without checking admissibility. **Strongest pattern in 122-problem dataset (11 at 9/9 score).**
14. **Asymptotic Growth Miscount** — claim wrong growth rate for a sum/sequence. Models guess from term-counting heuristic but miss oscillatory cancellation requiring deeper analysis (Christoffel-Darboux, Hilbert asymptotics).

This list is not closed. Use techniques from any area of mathematics. If it produces a stumble, add it here.

## Trap Codes (open-ended — add new letters)

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
| U | Singular Endpoint | Classical principle fails at singular/boundary point |
| V | Growth Miscount | Wrong asymptotic rate from missing oscillatory cancellation |

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
| 7edc37eb-v4 | 2026-03-20 | Gegenbauer (orthogonal polynomials) | $x=1$ evaluation bound + INTERACTION | Linearization leading coefficient: factor-by-factor gives $m(\lambda-1) \leq 0$, reverses for $\lambda > 1$. R1 algebra error, R4 sign reversal. | **2/4** |

## Cross-Pollination

A trap that works in one domain often transfers to another:
- Bessel's "seductive shortcut" (false closed form via differentiation) → try with Laguerre, Hermite, Jacobi sums
- Spherical harmonics parity trick → try with Hermite (even/odd), Chebyshev — DONE (fc18bf67 → adaaffa2). Now pause parity and try other techniques.
- Kapteyn series coefficient mismatch → try with any generating function claim
- Wigner non-vanishing → try with any representation-theoretic identity
- Framing misdirection ("must be evaluated by other means") → try with any integral where a simple symmetry argument kills the claim
- Kapteyn-Bessel antiderivative (hiding false identity behind an integral layer) → try wrapping any false identity inside an integral/derivative
- Measure confusion (dt vs t dt from 8ac6e061) → try with any domain where a standard formula uses a weighted sum/integral but the problem uses unweighted

- Singularity/boundary trap (S-L orthogonality at x=0) → try with ANY classical principle at its boundary of validity: Rodrigues formula at endpoints, recurrence relations at n=0, generating functions at radius of convergence, integral representations at branch points
- Asymptotic growth miscount → try with any sum where term-by-term estimation gives wrong order due to cancellation

Always ask: could this idea work somewhere else?

## Operational Lessons

See `domain_references/operational_lessons.md` for full details. Key points:

**How models fail:** ~75% fabricate identities ("false recalled fact"), ~15% hand-wave key steps, ~10% misapply theorems. Models invent shortcuts rather than compute.

**What works:** Claims where the natural verification path confirms the false claim. Models recall a formula for a subtly different case, or the framing steers them past the simple disproof.

**What fails:** Elementary counterexamples (small N check), transparent algebra (B=0 obvious), convention-dependent claims, pure selection rule checks, pattern extrapolation from recurrences (the recurrence IS the disproof), cross-domain formulas that are standard textbook results.

**Discrete domains are harder but not impossible:** Claims about discrete objects are easier for models to brute-force at small parameter values. To make discrete domains work, the trap must be on the verification path — e.g., the completeness relation models reach for uses a different weight than the problem.

**GPT calibration:** GPT cross-check validates trap quality but doesn't predict Phoenix stumble rate. If GPT catches it easily with an elementary method, Phoenix will too.

## Workflow

1. Read this playbook + the domain cluster file
2. **Start from complexity:** "What two correct things produce a wrong conclusion?" Or use Gaussian noise if stuck.
3. Generate problem (Tier 1 preferred). Answer Q1-Q4 BEFORE proceeding. If Q2=YES or Q3=NO, REDESIGN.
4. **Score originality:** rate Audit Novelty, Disproof Resistance, Camouflage Strength. If any axis is Low → REDESIGN.
5. Self-critique: Weakness Hunt, Expert Panel, Assumption Audit, Contradiction Check
6. GPT cross-check (see `phoenix/cli_phoenix_rules.md`)
7. Test on Phoenix
8. Analyze results
9. If successful: update cluster file, update Recent Technique Usage table, update originality scoring table. If novel technique: update this playbook.

## Domains

Based on NU (1988): Jacobi (§5-7), Laguerre (§5-7), Hermite (§5-7), Chebyshev, Legendre, Spherical Harmonics (§10), Functions of 2nd kind (§11), Bessel (§14-19), Hypergeometric (§20-23). Not limited to these — any special function domain is fair game.

## References

- **Primary:** Nikiforov & Uvarov, *Special Functions of Mathematical Physics* (1988)
- **Secondary:** Varshalovich et al., *Quantum Theory of Angular Momentum* (1988); Szegő, *Orthogonal Polynomials* (1975); Watson, *Theory of Bessel Functions* (1944)
- **Domain clusters:** `problem_clusters/` (see `problem_clusters/guide.md`)
- **Pipeline:** `phoenix/cli_phoenix_rules.md`
- **Master plan:** `phoenix/master_plan.md`
- **Operational data:** `domain_references/operational_lessons.md`
- **Self-reflection:** `phoenix/self_reflection_20260319.md`, `phoenix/self_reflection_20260320.md`
- **Complexity principle:** `phoenix/reasoning_pattern_analysis.md`
- **Contradiction types:** `phoenix/reverse_triz_analysis.md`

## Citation Style (for solutions)

First use: "By Nikiforov-Uvarov (1988), Chapter II, §7, Eq. (19)..."
Subsequent: "By NU §7..." or "By the NU envelope estimate..."
Always include chapter/section/equation when citing formulas.
