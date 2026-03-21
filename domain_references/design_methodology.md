# Problem Design Methodology: Gaussian Noise → TRIZ → Complexity → Q1-Q4

## Date: 2026-03-20 (Updated)

## The Cardinal Rule

**TRIZ works 100% of the time. If you can't find a problem in a domain, you haven't generated enough noise.**

---

## The Design Formula (Updated 2026-03-20)

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

---

## Complexity Theory Principle (New, 2026-03-20)

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

**Example — CG Moment (WIP):**
- Component 1: CG completeness (correct)
- Component 2: CG symmetry $\mathcal{M}(M) = -\mathcal{M}(-M)$ (correct)
- Component 3: "For all $M$" quantifier
- Interaction: Symmetry only forces $\mathcal{M} = 0$ when $M = 0$, not for all $M$

---

## Reasoning Traps, Not Recall Traps (New, 2026-03-20)

**Never assume models can't memorize.** A trap that relies on models NOT recalling a formula is a recall trap, not a reasoning trap. Models know everything. The trap must be in the REASONING.

A good problem is one where even a model that knows everything still gets fooled because:
- The natural reasoning path leads to the wrong answer (premature confidence)
- The correct reasoning requires noticing a subtle interaction between components (complexity)
- There is no easy alternative path to the correct answer (no bypass)

**What failed today (recall traps):**
- Clausen ($1/2 \to 1$): models recalled exact parameter condition → 0/4
- SL perturbation: models derived exact eigenvalue equation → 0/4

**What worked today (reasoning trap):**
- Gegenbauer linearization: models did the factor-by-factor analysis (correct reasoning technique) but missed the sign flip at $\lambda > 1$ → 2/4

---

## Patterns in Successful Problems (New, 2026-03-20)

From reviewing ALL problems in the repo:

1. **"For all $n$" but fails at specific $n$** — most common pattern
2. **Small perturbation of known identity** — one sign, one factor, one parameter
3. **Concise** — readable in 2 minutes, solution in 5 lines
4. **Mix of True and False** — roughly 50/50
5. **Claim is TRUE for most parameter values, FALSE for specific ones** — spot-checking usually confirms the claim

---

## The Full Pipeline

```
Gaussian Noise (random perturbations of known identities)
    ↓ filter: which perturbations produce subtle breaks?
"Where does math fool you?" (the subtle break)
    ↓ classify: which contradiction type?
TRIZ Contradiction (Framework A vs Framework B)
    ↓ apply complexity principle
Complexity Check (does the error live in an interaction?)
    ↓ build: embed the false argument
Problem Design (Q1-Q4, short-circuit check, bypass check)
    ↓ test
Phoenix Submission
```

---

## Level 0: Gaussian Noise — The True Starting Point

**Don't try to generate one perfect idea. Generate many bad ideas fast.**

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

---

## Level 1: "Where Does Math Fool You?"

Name the confusion. What went wrong? Why does the perturbed identity look plausible?

---

## Level 2: TRIZ Contradiction — Classify and Structure

| Type | What it exploits | Stumble rate | Best for |
|---|---|---|---|
| **RECALL** | Models retrieve closest formula without checking | 4/4 | Measure/weight/argument perturbations |
| **ANALOGY** | Models extend patterns from simpler functions | 4/4 | Index/analogy perturbations |
| **INDUCTION** | Models trust finite patterns | 3/4 | Order perturbations |
| **FRAMING** | Models follow problem framing as ground truth | 2-3/4 | Framing perturbations |
| **GAP** | Models hand-wave past unclosable derivation gaps | 2/4 | Index range/conditional convergence |
| **INTERACTION** | Models reduce multi-component problem to single component | 2/4 | Bound/quantifier perturbations (NEW) |

---

## Level 3: Problem Design

### Apply Complexity Principle

Before writing the problem, identify:
- What are the interacting components?
- What does each component look like in isolation? (Must look correct)
- Where does the interaction create the error?
- Will models simplify away the interaction? (Must be YES)

### Apply Q1-Q4

- **Q1:** What will a model try FIRST?
- **Q2:** Does that reveal the falsity? → Must be NO
- **Q3:** Does the natural path confirm the false claim? → Must be YES
- **Q4:** What non-obvious step reveals the truth?

### Short-circuit check

- **Mode A:** Can models check at small values? → DISCARD
- **Mode B:** Can models recall the correct formula? → DISCARD
- **Mode C:** One-step disproof? → DISCARD
- **Mode D:** Can models bypass the trap entirely? (e.g., derive exact solution) → DISCARD

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

---

## What NOT to Design

1. **Recall traps** — models recall too well (Clausen: 0/4, SL: 0/4)
2. **Easy bypass problems** — alternative disproof path shorter than engaging with trap (SL: implicit differentiation)
3. **Ill-posed problems** — integral doesn't exist, ambiguous claim (Fubini)
4. **Well-known counterexamples** — QC will flag them (Fubini: 5+ sources)
5. **Low-order coefficient mismatches** — models compute $z^2$ easily (Clausen: 0/4)

---

## References

- **Complexity principle:** `domain_references/reasoning_pattern_analysis.md`
- **Contradiction types:** `domain_references/reverse_triz_analysis.md`
- **Session lessons:** `domain_references/self_reflection_20260320.md`
- **Pipeline rules:** `phoenix/cli_phoenix_rules.md`
- **Playbook:** `domain_guides/playbook.md`
