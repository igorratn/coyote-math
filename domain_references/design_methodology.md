# Problem Design Methodology: Gaussian Noise → TRIZ → Q1-Q4

## Date: 2026-03-20

## The Cardinal Rule

**TRIZ works 100% of the time. If you can't find a problem in a domain, you haven't generated enough noise.** Don't conclude "this domain doesn't work" — conclude "I haven't tried enough perturbations." Every domain in mathematics has contradictions waiting to be found. Every known identity can be perturbed into a subtle break. If 30 perturbations all fail, try 30 more. The method is sound; the only failure mode is giving up too early.

---

## The Full Pipeline

```
Gaussian Noise (random perturbations of known identities)
    ↓ filter: which perturbations produce subtle breaks?
"Where does math fool you?" (the subtle break)
    ↓ classify: which contradiction type?
TRIZ Contradiction (Framework A vs Framework B)
    ↓ build: embed the false argument
Problem Design (Q1-Q4, short-circuit check)
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
| **Composition** | Apply two transformations and claim the composite simplifies | Euler+Pfaff composition in ${}_2F_1$ |
| **Symmetry** | Claim a function is symmetric when it's not, or vice versa | Could apply to connection formulas, addition theorems |

**The process:** Take 10-15 known identities. Apply 2-3 random perturbations to each. That gives 30-40 candidates in minutes. Most are garbage. A few have subtle breaks. Those are your signal.

**If nothing survives: generate more noise, not less.** The problem is never the domain — it's insufficient exploration. Try different perturbation dimensions. Combine two perturbations. The contradiction is there; you just haven't found it yet.

**Critical filter:** For each perturbation that produces a break, immediately ask:
- Is the break detectable at $n=0$? → discard
- Is the break detectable by recalling the correct formula? → discard (unless the recall itself is the trap)
- Does the break require multi-step reasoning to detect? → KEEP

---

## Level 1: "Where Does Math Fool You?"

The perturbation that survived the filter IS the answer to this question. The subtle break is where mathematics creates genuine confusion.

Name the confusion. What went wrong? Why does the perturbed identity look plausible?

---

## Level 2: TRIZ Contradiction — Classify and Structure

Map the confusion to one of the five contradiction types (from reverse_triz_analysis.md):

| Type | What it exploits | Stumble rate | Best for |
|---|---|---|---|
| **RECALL** | Models retrieve closest formula without checking | 4/4 | Measure/weight/argument perturbations |
| **ANALOGY** | Models extend patterns from simpler functions | 4/4 | Index/analogy perturbations |
| **INDUCTION** | Models trust finite patterns | 3/4 | Order perturbations |
| **FRAMING** | Models follow problem framing as ground truth | 2-3/4 | Framing perturbations |
| **GAP** | Models hand-wave past unclosable derivation gaps | 2/4 | Index range/conditional convergence |

Name the two frameworks:
- **Framework A (wrong but plausible):** What models will do
- **Framework B (correct):** What the math actually requires
- **Resolving detail:** The subtle perturbation that separates them

---

## Level 3: Problem Design

### The "Embedded False Proof" pattern (most effective)

Instead of hoping models fall into the trap naturally, GIVE them the false argument:

> Here's a derivation: [uses Framework A] → [reaches wrong conclusion].
> Claim: [wrong conclusion]. True or False?

This is the meta-type that wraps any contradiction. It controls models' reasoning path and is the most reliable approach.

### Apply Q1-Q4

- **Q1:** What will a model try FIRST? → Ideally follow the provided argument
- **Q2:** Does that reveal the falsity? → Must be NO
- **Q3:** Does the natural path confirm the false claim? → Must be YES
- **Q4:** What non-obvious step reveals the truth? → Must require real work

### Short-circuit check

- **Mode A:** Can models check at $n=0$, $x=0$, small values? → DISCARD
- **Mode B:** Can models recall the correct formula directly? → DISCARD
- **Mode C:** One-step disproof? → DISCARD

---

## How Every Successful Problem Was Actually Born (Honest Account)

| Problem | Gaussian Noise | Subtle Break | Contradiction Type |
|---|---|---|---|
| 8ac6e061 | Perturb measure: $t\,dt \to dt$ | Scaling changes from $\lambda^{-2}$ to $\lambda^{-1}$ | RECALL |
| 77edf9d1 | Perturb by analogy: $\sum x^n/n = -\ln(1-x)$ applied to Kapteyn | $x^3$ coefficient $1/8 \neq 1/6$ | ANALOGY |
| 416a3c0f | Same as above, wrapped in integral | $a^4$ coefficient $1/32 \neq 1/24$ | ANALOGY |
| f09a765d | Perturb argument: $z \to xe^{i\pi/4}$ (Kelvin) | Wronskian sign flips | RECALL |
| c23294e1 | Perturb order: extend $s=1,2,3$ pattern to $s=4$ | Numerator becomes $5\nu+11$ not $1$ | INDUCTION |
| fc18bf67 | Perturb framing: "must be evaluated by other means" | Integral is zero by parity | FRAMING |
| adaaffa2 | Same framing perturbation, Hermite domain | Same parity argument | FRAMING |
| 7edc37eb | Perturb weight: $[J_n(nx)]^2 \to [J_n(nx)]^2/n$ | Differentiation gap: $\sum J_nJ_n'$ vs $\sum nJ_nJ_n'$ | GAP |
| SL draft | Perturb index range: $\sum_{-\infty}^{\infty} \to \sum_0^{\infty}$ | Asymmetric cancellation | GAP + EMBEDDED FALSE PROOF |

**Every single success started with a perturbation of something known.** The noise came first. TRIZ came after.

---

## For CLI: Practical Workflow

1. **Read this document + reverse_triz_analysis.md + self_reflection_20260319.md**
2. **Pick 10-15 known identities** from the N-U book or cluster files
3. **Apply random perturbations** from the table above (2-3 per identity = 30-40 candidates)
4. **Filter fast:** Is the break subtle? Not detectable at small values? Not killed by formula recall? → Keep only 2-3 survivors
5. **Classify** each survivor by contradiction type
6. **Build the problem** using the "embedded false proof" pattern if possible
7. **Apply Q1-Q4** and short-circuit checks
8. **Test on Phoenix** only if all checks pass

**Speed target:** Steps 1-5 should take 15-20 minutes (brainstorming). Steps 6-7 should take 10-15 minutes (writing). Don't spend hours on one idea — generate many, filter hard.

**NEVER give up on a domain.** If 30 perturbations fail, try 30 more. TRIZ works 100%. The contradiction is always there.

---

## References

- **Contradiction types:** `domain_references/reverse_triz_analysis.md`
- **TRIZ framework:** `proctor_tasks/prompts/triz_framework.md`
- **Q1-Q4 design test:** `domain_references/self_reflection_20260319.md`
- **Failure modes:** `domain_references/self_reflection_20260319.md`
- **Pipeline rules:** `phoenix/cli_phoenix_rules.md`
- **Playbook:** `domain_guides/playbook.md`
