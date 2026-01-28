# Domain-Agnostic "Stumble" Problem Generator: Complete Instructions
# Version 3.2 - Empirical Enhancements Edition
# Updated: 2026-01-26 based on analysis of 95 high-quality problems

## Updates in v3.2:
- **5 new trap types** (O-S): Dimension Counting, Rodrigues Boundary, Subsequence Construction, Wigner Non-Vanishing, Index Boundary
- **4 new creative techniques** (7-10): Dimension counting, Subsequence construction, North pole evaluation, Pole decomposition
- **Enhanced spherical harmonics domain**: Detailed guide with 8 problem patterns, Varshalovich reference integration## Problem Statement Format Requirements (All Domains)

All problems across all domains must follow this standardized format:

### Structure

1. Problem statement: Self-contained mathematical setup
   - Define all mathematical objects used
   - Provide necessary context and motivation
   - State the claim clearly with precise mathematical notation
   - NO citations in the problem statement (unless explicitly testing a theorem from a source)

2. Ending: Every problem must conclude with exactly:
```
   Determine whether this claim is True or False, and give a rigorous proof of your conclusion.
```

3. Formatting: 
   - No bold text anywhere in the problem
   - Use standard mathematical notation with LaTeX
   - Keep language clear and professional

### Example of Correct Format
```markdown
For integer $\ell \geq 1$, let $P_\ell(x)$ denote the Legendre polynomial 
of degree $\ell$ on the interval $[-1,1]$.

[Additional context and definitions...]

Claim: [Precise mathematical statement]

Determine whether this claim is True or False, and give a rigorous proof 
of your conclusion.
```

### What NOT to Do

❌ Don't cite references in problem statement (e.g., "NU (1988), Chapter II, §7")  
❌ Don't use bold text: ~~**Claim:**~~, ~~**Problem:**~~  
❌ Don't end with variations like "Prove or disprove", "Is this true?", etc.  
❌ Don't assume knowledge beyond what's stated in the problem  

### Where Citations Belong

✅ Citations belong in the SOLUTION, not the problem statement  
✅ Use full citation format: "By Nikiforov-Uvarov (1988), Chapter II, §7, Eq. (19)..."  
✅ Reference domain-specific sources as appropriate (Watson for Bessel, Szegő for polynomials, etc.)
- **Mandatory citation standards**: Specific format requirements with examples

---

## Core Philosophy
Create problems that **require deep mathematical reasoning** to solve, where traps serve as gatekeepers that prevent shortcuts and force engagement with the underlying structure. The best problems combine:
1. **Genuine mathematical depth** - multiple connected insights required
2. **Creative techniques** - novel combinations or unexpected applications
3. **Natural traps** - emerge organically from the mathematics
4. **Educational value** - teach important distinctions that generalize

**Key principle:** Reasoning first, traps second. The trap prevents lazy approaches but rewards genuine understanding.

## Primary Reference

All problems are based on **Nikiforov, A.F. and Uvarov, V.B., *Special Functions of Mathematical Physics: A Unified Introduction with Applications*, Birkhäuser, 1988.**

We follow the NU book's unified treatment of special functions via differential equations, asymptotic methods, and representation formulas.

**Domain-specific guides:**
- Spherical harmonics → See `spherical_harmonics_guide.md`
- Bessel functions → See `bessel_functions_guide.md`


## Problem Quality Hierarchy

### Tier 1: Reasoning-First Problems
**Primary goal:** Require deep mathematical reasoning and creative insight  
**Secondary goal:** Use traps to create stumbling point that guides deeper understanding

**Characteristics:**
- Needs genuine understanding of structure, not just formula checking
- Requires connecting multiple concepts or techniques (e.g., asymptotics + representation theory + oscillatory sums)
- Solution has an "aha!" moment of insight
- Trap serves the reasoning, not vice versa
- Natural problem that mathematicians would actually encounter
- Worth studying even after you've solved it

**Example patterns:**
- "To solve this, you must understand [deep structural property], which requires [creative technique]. The trap [mechanism] prevents shortcuts but guides you toward the key insight."
- Problems like: Christoffel-Darboux kernel growth (Szegő + Weyl), Nikiforov-Uvarov auxiliary function (energy method), operator domain analysis at singularities

### Tier 2: Trap-First Problems
**Primary goal:** Create a stumbling point via trap mechanism  
**Secondary goal:** Require some reasoning to resolve

**Characteristics:**
- Mainly tests whether you catch the trap
- Less emphasis on creative problem-solving
- More about careful verification and boundary checking
- Mechanical once you identify the trap
- Still requires mathematical maturity

**When to use:** Fill out trap coverage, provide easier warm-up problems, target specific trap combinations

### Tier 3: Pure Calculation
**Characteristics:**
- Direct application of formulas
- No insight required
- No stumbling point
- Could be done by calculator or computer algebra system
- Boring for both humans and models

**Never create these**

---

## Design Principles for Reasoning-First Problems

### 1. Depth Over Cleverness
❌ **Bad:** "For all n≥2..." (just checking n=2 is trivial)  
✅ **Good:** Requires understanding why a structure behaves differently at boundaries, demanding synthesis of asymptotic analysis, representation theory, and careful error tracking

### 2. Creative Methods Required
The solution should involve at least one of:
- Novel combination of standard techniques (e.g., Stirling + Szegő + Weyl equidistribution)
- Unexpected application of a theorem (e.g., Sturm theory for interlacing)
- Construction of auxiliary objects (energy functions, transforms, test functions)
- Geometric or physical intuition (rotation groups, quantum mechanics)
- Asymptotic analysis with careful error tracking (multiple scales, boundary layers)
- Representation changes (Jacobi polynomials, different bases)

### Creative Methods Required

**The solution should use at least one creative technique:**

**Core Techniques:**
1. **NU Auxiliary Function** - Transform problem via v(x) = y² + (σ/λ)y'²; prove monotonicity
2. **Asymptotic Analysis** - NU Chapter II §7 bounds, Szegő oscillatory formulas, error tracking
3. **Representation Changes** - Convert to Jacobi, change basis, connection formulas
4. **Dimension Counting** - dim(space) - dim(constraints) = dim(solutions); avoid explicit construction
5. **Subsequence Construction** - For oscillatory f_n ~ cos((n+κ)x), find {n_k} where phase aligns → unbounded
6. **North Pole Evaluation** - At θ=0, only m=0 survives; reduces 2D to 0D
7. **Pole Decomposition** - q(x) = q(β) + (x-β)r(x); separate singular from regular
8. **Weyl Equidistribution** - Oscillatory sums average to zero via uniform distribution mod 2π

**Technique Selection:**
- Bounds/estimates → NU envelope or subsequence (if unbounded)
- Modified orthogonality → Pole decomposition or dimension counting
- Oscillatory sums → Weyl equidistribution or subsequence construction
- Operator at singularity → NU auxiliary function or direct analysis
- Rotation/basis → Representation change or north pole evaluation

### 3. Trap as Gatekeeper, Not Goal
The trap should:
- **Prevent naive approaches** from working (can't just substitute)
- **Force engagement** with deep structure (must understand domains, singularities, asymptotics)
- **Reward genuine understanding** (correct insight leads naturally to solution)
- **Be natural**, not artificial (emerges from the mathematics itself)

❌ **Bad trap usage:** "Claim fails because (-1)^ℓ depends on parity" (checking parity is trivial)  
✅ **Good trap usage:** "Asymptotic formula breaks at boundary, forcing you to understand why operator domain structure matters at singularities" (requires deep analysis)

### 4. Connection Quality
Best problems connect:
- Different areas (analysis + algebra + representation theory)
- Multiple representations (coordinate systems, bases, different function families)
- Theory + explicit calculation (general theorems + specific counterexamples)
- Local behavior + global properties (pointwise vs integral, boundary vs interior)
- Abstract structure + concrete examples (general principles + explicit computation)

### 5. Natural Problem Statement
The problem should:
- Feel like real mathematics, not artificial puzzle
- Be a question someone might naturally ask
- Have relevance beyond catching a single trap
- Generalize to interesting variations
- Connect to broader mathematical themes

---

## Ensuring Problem Uniqueness

**Core Principle:** Each problem must differ from all existing problems in **at least 2-3 dimensions**:

### The 4D Uniqueness Matrix

1. **Mathematical Object:** Function values, derivatives, integrals, sums, transforms, zeros, bounds, recurrences
2. **Domain/Region:** Interior, boundary/poles, complex plane, asymptotic regime, special points
3. **Core Insight:** Structural transformation, cancellation, singularity analysis, representation theory, operator domains, symmetry breaking
4. **Technique Combination:** NU methods, Weyl, Stirling, Rodrigues, etc. (never repeat same combo)

### Verification Before Creating

**Check against existing problems:**
- Different mathematical object? (e.g., not another "kernel growth" if one exists)
- Different domain? (e.g., not another "at pole" if one exists there)
- Different insight? (e.g., not another "Weyl cancellation" alone)
- Different technique combo? (e.g., not another "Jacobi→Szegő→Weyl")

**Rule:** Must differ in 2-3 dimensions. Same domain + different object is OK. Same technique + different domain is OK. Same everything = NOT OK.

## Quick Start Usage

### Command Format (Reasoning-First - PREFERRED)
Create reasoning-focused problem for <DOMAIN> about <MATHEMATICAL_QUESTION> using techniques <METHODS>

### Examples (Reasoning-First)
- Create reasoning-focused problem for spherical_harmonics about operator domains at poles using NU auxiliary function methods and asymptotic analysis
- Create reasoning-focused problem for jacobi about envelope bounds using NU Chapter II Section 7 Equation 19
- Create reasoning-focused problem for laguerre about Cauchy transforms using NU Chapter II Section 11
- Create reasoning-focused problem for bessel about oscillatory sum behavior using NU interior asymptotics and Weyl equidistribution
- Create reasoning-focused problem for hermite about energy flow in oscillations using NU auxiliary function method

### Legacy Command Format (Trap-First - STILL SUPPORTED)
Create new problem for <DOMAIN> using traps <TRAP_CODES>

### Examples (Trap-First)
- Create new problem for bessel using traps B and H
- Create new problem for hermite using traps G and N
- Create new problem for spherical_harmonics using traps A and M

**When to use legacy format:** Filling out trap coverage gaps, creating simpler problems, targeting specific trap combinations for pedagogical reasons

---

## Supported Domains

Based on **Nikiforov-Uvarov (1988)** structure:

**Chapter I - Foundations** (General theory)
- Hypergeometric type differential equations
- Rodrigues formulas
- Recursion relations

**Chapter II - Classical Orthogonal Polynomials**
- Jacobi polynomials (§5-7)
- Laguerre polynomials (§5-7)
- Hermite polynomials (§5-7)
- Chebyshev polynomials (subcase of Jacobi)
- Legendre polynomials (subcase of Jacobi)
- Spherical harmonics (§10) → See `spherical_harmonics_guide.md`
- Functions of the second kind (§11)
- Discrete variable polynomials (§12-13)

**Chapter III - Bessel Functions** (§14-19) → See `bessel_functions_guide.md`

**Chapter IV - Hypergeometric Functions** (§20-23)


## The Trap System (A-S)

**Purpose:** Traps prevent shortcuts and guide toward genuine insights. Not goals in themselves.

### Trap Quick Reference

| Code | Name | What It Exploits |
|------|------|------------------|-------|
| A | Boundary/Pole Singularity | Limits at domain boundaries 
| B | Parity/Index-Dependent | Claim fails at specific index 
| C | Basis Mismatch | Different representations 
| D | Pointwise vs Global | L² vs pointwise 
| E | Oscillatory Cancellation | Asymptotic sum cancellations 
| F | Scaling/Normalization | Wrong constants 
| G | Weight Perturbation | Modified orthogonality 
| H | Index Shift Obstruction | Recurrence at boundary 
| I | Operator Domain Singularity | Operator at boundary 
| J | Non-Commutative | Operation order matters 
| K | Factorial Ratio Error | Complex normalization 
| L | Parity-Dependent | Alternating sums 
| M | Asymptotic Boundary | Interior formula at boundary 
| N | Measure-Broken Symmetry | Weight breaks symmetry 
| O | Dimension Counting | Solution space structure 
| P | Rodrigues Boundary | Competing factors at boundary 
| Q | Subsequence Construction | Oscillatory alignment 
| R | Wigner Non-Vanishing | Rotation matrix structure 
| S | Index Boundary | Recurrence coefficient vanishing 

### High-Impact Trap Pairs (for Reasoning-First)

| Combination | Why Deep | Best For |
|-------------|----------|----------|
| A + I | Singularity + operator theory | spherical_harmonics, bessel |
| E + M | Oscillatory + asymptotic misuse | bessel, spherical_harmonics |
| C + J | Basis + non-commutativity | spherical_harmonics, wigner |
| D + N | Pointwise vs global + measure | All orthogonal systems |

**Usage:** Choose traps that emerge naturally from mathematics. Don't force them.

## Updated Overview Table

Add these rows to the trap overview table:

| Code | Name | What It Exploits | Best Domains |
|------|------|------------------|--------------|-----------------|
| O | Dimension Counting | Solution space structure | jacobi, legendre, laguerre, hermite | ⭐⭐⭐ (requires linear algebra + analysis) |
| P | Rodrigues Boundary | Competing factors at boundaries | Associated Legendre, hermite, laguerre | ⭐⭐⭐ (requires asymptotic analysis + tracking) |
| Q | Subsequence Construction | Oscillatory alignment | jacobi, spherical_harmonics, bessel | ⭐⭐⭐ (requires asymptotics + number theory) |
| R | Wigner Non-Vanishing | Rotation matrix structure | spherical_harmonics, wigner | ⭐⭐⭐ (requires representation theory) |
| S | Index Boundary | Recurrence coefficient vanishing | Associated Legendre, spherical_harmonics | ⭐⭐⭐ (requires recurrence theory + linear algebra) |

---

## Total Trap Count: Now 19 (A-S)

## 3. Trap Combination Strategies

### High-Impact Pairs for Reasoning-First Problems

| Combination | Description | Why Deep | Best For |
|-------------|-------------|----------|----------|
| A + I | Singularity + Operator domain | Requires operator theory + boundary analysis | spherical_harmonics, bessel |
| A + M | Singularity + Asymptotic misuse | Requires asymptotic theory + Laurent expansion | bessel, spherical_harmonics |
| C + J | Basis mismatch + Non-commutativity | Requires representation theory + group theory | spherical_harmonics, wigner |
| D + N | Pointwise vs global + Measure | Requires L² theory + measure theory | All orthogonal systems |
| E + M | Oscillation + Asymptotic | Requires Weyl/stationary phase + careful error tracking | bessel, spherical_harmonics |
| G + N | Weight perturbation + Symmetry breaking | Requires perturbation + measure theory | All orthogonal polynomials |
| H + I | Index obstruction + Operator singularity | Requires boundary analysis + operator theory | spherical_harmonics, bessel |
| I + J | Operator domain + Non-commutativity | Requires functional analysis + algebraic structure | spherical_harmonics, wigner |

### Acceptable Pairs for Trap-First Problems

| Combination | Description | Best For |
|-------------|-------------|----------|
| B + H | Parity + Index boundary | All polynomials |
| B + L | Two types of parity | spherical_harmonics, hermite |
| F + K | Two normalization errors | All domains |
| H + L | Index + Alternating sum | All with recurrences |

### Triple Combinations (Highest Difficulty - Research Level)

| Combination | Example | Reasoning Required |
|-------------|---------|-------------------|
| A + H + M | Singularity at boundary index with asymptotic formula | Boundary analysis + index theory + asymptotics |
| A + I + M | Pole + operator domain + asymptotic | Operator theory + singularity + asymptotics |
| C + J + K | Basis transformation + non-commute + factorial error | Representation theory + algebra + careful computation |
| D + E + M | Global vs local + oscillations + asymptotic | Measure theory + harmonic analysis + asymptotics |
| E + I + J | Oscillation + operator + non-commute | Harmonic analysis + operator theory + group theory |
| G + N + D | Weight perturbation + measure symmetry + pointwise/global | Perturbation + measure theory + functional analysis |

## 4. Problem Template Structure

### Standard Format
Let [DOMAIN_FUNCTIONS] denote [standard definition with normalization]  
[Define DOMAIN_PARAMETER ranges including boundary cases]  
[Define AUXILIARY_OBJECT using domain operations]  
For [PARAMETER_RANGE including critical boundaries]

**Claim**  
[State assertion with TRAP_INDICATORS and REASONING_HOOKS]  
Determine with rigorous proof whether the claim is True or False.

### Trap Indicators to Include

| Trap | Indicator Phrase | Reasoning Hook |
|------|------------------|----------------|
| A | "as x→[boundary]", "at the pole", "limit" | Requires Laurent expansion / singularity analysis |
| B | "for all ℓ≥1", "for all n≥k" | Requires checking boundary case + understanding why |
| C | "after rotation", "in the transformed basis" | Requires representation theory |
| D | "equals" (ambiguous: pointwise or integral?) | Requires understanding function spaces |
| E | "grows like N^α", "behaves as" | Requires Weyl/stationary phase |
| F | "projection operator", "normalized such that" | Requires checking algebraic properties |
| G | "under modified weight w̃(x) = w(x)[...]" | Requires perturbation theory |
| H | "for all n≥k" with n-k term in formula | Requires understanding recurrence domain |
| I | "the operator O at [boundary]" | Requires operator theory / functional analysis |
| J | "∫[Tf]g = ∫f[Tg]", "commutes" | Requires understanding algebraic structure |
| K | normalization with Γ, factorials, ratios | Requires Stirling / careful algebra |
| L | "∑(-1)^m" or "alternating sum" | Requires checking even/odd cases |
| M | "for sufficiently large", "asymptotically" | Requires asymptotic analysis / error bounds |
| N | "symmetric function implies ∫=0" | Requires measure theory |

## 5. Solution Structure Requirements

### Natural Flow (No Headers)
[Opening: Establish context and notation]  
[Body: Build toward key insight through logical steps]  
[Stumble Point: Where naive approach fails - CRITICAL]  
[Resolution: Address the trap explicitly AND explain the deeper mathematics]  
[Conclusion: State result clearly]

### The Stumble Point (Most Important)

Every solution must have a **turning point** where models fail:

**Template:**  
[Naive reasoning that seems correct]  
However, [examining specific case / boundary / explicit calculation / applying deeper theory] reveals...  
[Show contradiction or unexpected behavior]  
[Explain why this occurs - the trap mechanism AND the underlying mathematical reason]  
Therefore, [conclusion]

**For Reasoning-First Problems (Tier 1):**

Focus on the **mathematical insight**, with trap as supporting detail:

"The naive approach [describe] fails to account for [deep structural property]. To see why, we must [apply creative technique / invoke non-obvious theorem / construct auxiliary object]. This reveals that [key insight]. The trap [mechanism] prevents shortcuts but guides us toward this understanding."

**Citation style with Nikiforov-Uvarov:**
- **Full citation first use:** "By Nikiforov and Uvarov, *Special Functions of Mathematical Physics*, Birkhäuser, 1988, Chapter II, §7, Equation 19..."
- **Subsequent references:** "By the NU envelope estimate..." or "Using NU Chapter II, §7..."
- **For well-known results:** "By the Jacobi envelope estimate (Nikiforov-Uvarov, 1988, Chapter II, §7, Eq. 19)..."
- **Always include:** Chapter/Section number, specific equation when citing formulas

**Example (Tier 1 - Reasoning-First with NU):**
"One might expect the sum to grow quadratically in N. However, applying Szegő's oscillatory asymptotic theorem (Orthogonal Polynomials, Chapter VIII, Theorem 8.21.8, formula 8.21.10), specialized to α=β=m following the representation in Nikiforov-Uvarov (1988, Chapter II), reveals that each term has the form cos²(ℓθ₀+φ). The key insight is that these phases are uniformly distributed mod 2π, so Weyl's equidistribution theorem implies the oscillatory contributions cancel asymptotically. The normalization constant is computed using Stirling's formula as given in NU. The trap (asymptotic boundary violation) prevents using crude bounds, forcing engagement with the deep connection between asymptotics and ergodic theory."

**Example (Tier 2 - Trap-First):**
"The recurrence relation appears to establish the claim for all n≥2. However, examining the boundary case n=2 reveals that P₀ enters the formula. Since orthogonality requires ⟨P₂, P₀⟩ = 0 but weight perturbation breaks this, the claim fails exactly at n=2."

## 6. Quality Verification Checklist

### Reasoning Depth (Tier 1 Priority)
- [ ] Requires understanding of underlying structure (not just formulas)
- [ ] Needs creative combination of techniques (at least 2-3 different methods)
- [ ] Has genuine "aha!" insight moment that's enlightening
- [ ] Would teach something valuable to a mathematician
- [ ] Solution is interesting/enlightening to read
- [ ] Generalizes to broader mathematical principles

### Trap Quality (Tool for Depth)
- [ ] Trap prevents shortcuts but doesn't obscure real mathematics
- [ ] Trap is natural consequence of mathematical structure (not artificial)
- [ ] Identifying trap alone isn't enough; must understand why
- [ ] Trap guides toward deeper understanding rather than just catching error
- [ ] Trap emerges organically from the problem

### Problem Naturalness
- [ ] Feels like real mathematics, not artificial puzzle
- [ ] Could appear in research or advanced coursework
- [ ] Tests understanding that matters beyond this problem
- [ ] Question someone might naturally ask
- [ ] Connects to broader mathematical themes

### Difficulty Balance
- [ ] Solvable by expert in 15-30 minutes with focused thought
- [ ] Requires multiple insights, not just one trick
- [ ] Models stumble for right reason (missing insight, not lucky guess)
- [ ] Cannot be solved by pattern matching alone
- [ ] Rewards genuine mathematical maturity

### Educational Value
- [ ] Teaches important mathematical distinction
- [ ] Technique generalizes to other problems
- [ ] Worth studying even after solving
- [ ] Builds understanding of domain
- [ ] Connects different areas of mathematics

## 7. Creation Workflow

### Reasoning-First Workflow (PREFERRED for Tier 1)

**Step 1: Identify Interesting Mathematical Question**
Ask: What's a natural question in this domain that requires deep understanding?

Examples:
- "What happens when you rotate spherical harmonics to the pole?"
- "How fast does the Christoffel-Darboux kernel grow?"
- "Can we track energy flow in oscillating Legendre functions?"
- "Why do zeros of consecutive modes interlace?"
- "How do operator domains behave at singularities?"

**Step 2: Determine Required Reasoning/Techniques**
What understanding/methods are needed?

**From Nikiforov-Uvarov (PRIMARY):**
- Asymptotic analysis (NU Chapter II, §7: envelope estimates, interior formulas)
- Auxiliary function methods (NU Chapter II, §7: energy functions, monotonicity)
- Cauchy transform theory (NU Chapter II, §11: second kind functions, Wronskian identities)
- Normalization constants (NU throughout: precise Γ function formulas)
- Representation formulas (NU: Jacobi forms, connection formulas, Rodrigues)
- Recurrence relations (NU: three-term recurrences, differential-difference equations)

**From other sources (SECONDARY):**
- Representation theory (basis changes, rotation groups - Varshalovich et al.)
- Operator theory (domains, functional analysis - standard texts)
- Harmonic analysis (Weyl, Fourier, oscillatory sums - Szegő, Stein-Shakarchi)
- Geometric intuition (symmetry, group actions)
- Measure theory (L² vs pointwise, weights)
- Perturbation theory (small parameter expansion)

**How to choose NU techniques:**
1. **Bounds/estimates needed?** → NU Chapter II, §7, Eq. 19 (Jacobi envelope)
2. **Monotonicity/oscillation?** → NU auxiliary function method
3. **Asymptotics at interior?** → NU interior formulas (cite specific equation)
4. **Cauchy integrals?** → NU Chapter II, §11
5. **Normalization?** → NU precise formulas with Γ functions
6. **Connection formulas?** → NU representation theory sections

**Step 3: Design Claim That Requires This Reasoning**
Make it:
- Non-obvious (can't see answer immediately)
- Natural (question someone might ask)
- Deep (requires connecting multiple ideas)

**Step 4: Identify Which Traps Naturally Arise**
Traps should emerge from the mathematics:
- Boundary behavior → Trap A
- Operator application → Trap I
- Asymptotic regime → Trap M
- Oscillatory sums → Trap E
- Basis changes → Trap C
- Operation order → Trap J

Don't force traps artificially!

**Step 5: Write Solution Showcasing the Reasoning**
Structure:
1. Set up notation and context
2. Explain the naive approach and why it's tempting
3. Apply the creative technique / deep theorem
4. Show the key insight that resolves the problem
5. Mention trap briefly (how it guides understanding)
6. State conclusion

Focus: Mathematical insight > trap mechanism

### Trap-First Workflow (ACCEPTABLE for Tier 2)

**Step 1: Pick Trap Combination**
Choose 1-2 traps from A-N based on coverage needs

**Step 2: Design Claim That Fails via Trap**
Create assertion that trap mechanism defeats

**Step 3: Add Domain-Specific Notation**
Use appropriate special functions and parameters

**Step 4: Write Solution Showing Trap**
Focus on trap mechanism and how to catch it

**Use this workflow for:** Filling coverage gaps, simpler problems, pedagogical purposes

## 8. Anti-Patterns to Avoid

| Don't Do This | Do This Instead | Why |
|---------------|-----------------|-----|
| "Evaluate ∫f(x)g(x)w(x)dx" | "Show kernel K(x,y) grows like N using Szegő asymptotics" | Pure calculation → requires deep technique |
| "Simplify [expression]" | "Does operator O preserve structure P at boundary?" | No insight → tests understanding |
| "Find the limit as x→0" | "Does lim involve hidden cancellation from representation theory?" | Direct → requires connecting ideas |
| Generic "for all n≥2" | Natural question needing boundary analysis | Artificial → emerges from mathematics |
| Obvious trap checking | Requires multiple connected insights | Trivial → genuinely deep |
| Formula verification | Creative technique application | Mechanical → insightful |

## 9. Example Commands with Expected Output

### Example 1: Reasoning-First (PREFERRED)
**Command:** Create reasoning-focused problem for spherical_harmonics about operator domains at poles using asymptotic analysis and operator theory

**Output:** Problem requiring understanding of how L₊ operator behaves at θ=0, needs analysis of 1/sin θ singularity vs cot θ term, demands operator domain theory + careful singularity tracking. Trap A+I emerges naturally.

### Example 2: Reasoning-First (PREFERRED)
**Command:** Create reasoning-focused problem for bessel about oscillatory sum cancellation using Weyl equidistribution

**Output:** Problem about sum of J_ν at zeros, requires Szegő asymptotics to reveal oscillatory structure, then Weyl theorem for cancellation. Trap E+M guides analysis.

### Example 3: Trap-First (ACCEPTABLE)
**Command:** Create new problem for hermite using traps G and N

**Output:** Problem about orthogonality under perturbed Gaussian weight e^{-x²(1+αx²)}, symmetry appears preserved but measure breaks it.

### Example 4: Trap-First (ACCEPTABLE)
**Command:** Create new problem for bessel using traps B and H

**Output:** Problem about J_ν with modified function involving J_{ν-2}, claimed true for ν≥2 but fails at ν=2 due to recurrence boundary.

## 10. Success Metrics

A problem is **excellent** (Tier 1) if:

1. **Reasoning depth** ⭐⭐⭐
   - Requires multiple connected insights (at least 2-3)
   - Creative technique application or unexpected theorem use
   - Understanding of structure, not just formulas
   - Teaches generalizable mathematical principle

2. **Educational value** ⭐⭐⭐
   - Teaches important mathematical distinction
   - Technique or insight generalizes to other problems
   - Worth studying even after solving
   - Connects different areas of mathematics
   - Builds genuine understanding of domain

3. **Natural trap integration** ⭐⭐⭐
   - Traps emerge organically from mathematics
   - Prevent shortcuts without obscuring beauty
   - Guide toward deeper understanding
   - Natural consequence of mathematical structure

4. **Solver satisfaction** ⭐⭐⭐
   - "Aha!" moment when insight clicks
   - Feel like learned something valuable
   - Elegant solution that's satisfying to discover
   - Want to share/explain the insight

5. **Model stumble quality** ⭐⭐
   - Models fail for right reason (missing insight, not luck)
   - Can't be solved by pattern matching alone
   - Rewards genuine mathematical reasoning

**Failure modes to avoid**:
- Too obvious (stumble rate < 33%)
- Too obscure (unsolvable without specialized knowledge)
- Artificial/contrived problem statement
- Trick question (not genuine mathematical trap)
- Pure calculation with no insight required
- Trap dominates over mathematical content

---

**Document Version**: 3.1 - Reasoning-First + Uniqueness Edition  
**Last Updated**: 2026-01-23  
**Primary Reference**: Nikiforov & Uvarov, *Special Functions of Mathematical Physics* (1988)  
**Domains Supported**: 9 (Tier 1: 6, Tier 2: 3)  
**Total Traps**: 14 (A-N)  
**Problem Quality Tiers**: 3 (Focus on Tier 1)  
**Philosophy**: Reasoning first, traps as tools for depth, NU methods as foundation, uniqueness mandatory

---

**Document Version**: 3.2 - Empirical Enhancements Edition  
**Last Updated**: 2026-01-26  
**Primary Reference**: Nikiforov & Uvarov, *Special Functions of Mathematical Physics* (1988)  
**Secondary Reference**: Varshalovich et al., *Quantum Theory of Angular Momentum* (1988)  
**Domains Supported**: 9 (Tier 1: 6, Tier 2: 3)  
**Total Traps**: 19 (A-S) - **New in v3.2: O, P, Q, R, S**  
**Total Creative Techniques**: 10 - **New in v3.2: 7, 8, 9, 10**  
**Problem Quality Tiers**: 3 (Focus on Tier 1)  
**Philosophy**: Reasoning first, traps as tools for depth, NU methods as foundation, uniqueness mandatory
