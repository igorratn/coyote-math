# Domain-Agnostic "Stumble" Problem Generator: Complete Instructions

## Core Philosophy
Create problems that **require deep mathematical reasoning** to solve, where traps serve as gatekeepers that prevent shortcuts and force engagement with the underlying structure. The best problems combine:
1. **Genuine mathematical depth** - multiple connected insights required
2. **Creative techniques** - novel combinations or unexpected applications
3. **Natural traps** - emerge organically from the mathematics
4. **Educational value** - teach important distinctions that generalize

**Key principle:** Reasoning first, traps second. The trap prevents lazy approaches but rewards genuine understanding.

## Primary Reference

**Nikiforov, A.F. and Uvarov, V.B., *Special Functions of Mathematical Physics: A Unified Introduction with Applications*, Birkhäuser, 1988.**

This is the **canonical reference** for problem creation and solutions in this framework. The book provides:

- **Unified treatment** of classical orthogonal polynomials via differential equations
- **Asymptotic methods** (Chapter II, Section 7) - envelope estimates, interior asymptotics, boundary behavior
- **Auxiliary function techniques** (Chapter II, Section 7) - energy methods, monotonicity proofs
- **Cauchy transform theory** (Chapter II, Section 11) - second kind functions, Wronskian identities
- **Representation formulas** - Jacobi/Rodrigues forms, connection formulas
- **Normalization constants** - precise formulas with gamma functions

**How to use in problems:**
1. **Direct citation:** Reference specific theorems, equations, and page numbers (e.g., "Theorem 8.21.8, Eq. (8.21.10)" for Szegő asymptotics)
2. **Technique application:** Use NU methods as the "creative technique" in reasoning-first problems
3. **Verification:** Check claims against NU formulas to design trap mechanisms
4. **Solution style:** Follow NU's rigorous style - clear notation, explicit steps, theorem citations

**Key NU theorems frequently used:**
- **Chapter II, §7, Eq. 19:** Jacobi envelope estimate (uniform bounds)
- **Chapter II, §7:** Nikiforov-Uvarov auxiliary function method
- **Chapter II, §11, Eqs. 4-7:** Cauchy transform asymptotics
- **Throughout:** Precise normalization constants, connection formulas, recurrence relations

**When to cite NU:**
- ✅ Always for asymptotic estimates and bounds
- ✅ For auxiliary function constructions
- ✅ For normalization constants and Gamma function identities
- ✅ When using non-standard representations
- ⚠️ Not needed for basic definitions (can cite domain-standard sources)

**Alternative references** (when NU doesn't cover topic):
- Szegő, *Orthogonal Polynomials* (asymptotics, Jacobi/Legendre specific results)
- Varshalovich, Moskalev, Khersonskii, *Quantum Theory of Angular Momentum* (Wigner functions, Clebsch-Gordan)
- Watson, *Theory of Bessel Functions* (Bessel-specific results)
- Abramowitz & Stegun / DLMF (formula verification)

## Problem Quality Hierarchy

### Tier 1: Reasoning-First Problems (⭐⭐⭐ TARGET)
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

### Tier 2: Trap-First Problems (⭐⭐ ACCEPTABLE)
**Primary goal:** Create a stumbling point via trap mechanism  
**Secondary goal:** Require some reasoning to resolve

**Characteristics:**
- Mainly tests whether you catch the trap
- Less emphasis on creative problem-solving
- More about careful verification and boundary checking
- Mechanical once you identify the trap
- Still requires mathematical maturity

**When to use:** Fill out trap coverage, provide easier warm-up problems, target specific trap combinations

### Tier 3: Pure Calculation (⭐ AVOID)
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

### The Core Tension

**Templates/patterns** help ensure quality, coverage, and systematic approach, BUT they can lead to repetitive, formulaic problems if misused.

**Resolution:** Use templates for **structure** (quality standards, format), but require **uniqueness** in mathematical content (question, insight, techniques).

Think of it like jazz: shared chord progressions (templates), but every solo is unique (content).

### What Should Be Template-Based (STRUCTURE) ✅
- **Quality criteria** - reasoning depth, NU citation, solution rigor
- **Problem format** - "Let... Claim... Determine True/False"
- **Solution structure** - setup → insight → stumble point → resolution
- **Citation style** - how to reference NU book
- **Verification checklist** - quality standards to meet

### What Must Be Unique (CONTENT) ❌
- **Mathematical question** - never repeat the same type of question
- **Key insight** - each problem teaches different principle
- **Technique combination** - never use same method combo twice
- **Trap mechanism** - even same trap should manifest differently
- **Domain/regime** - vary where the mathematical action occurs

### The 4D Uniqueness Matrix

Each problem must differ from all existing problems in **at least 2-3 dimensions**:

#### Dimension 1: Mathematical Object
Each problem should focus on different aspect:
- Function values (e.g., maxima behavior)
- Derivatives (e.g., operator singularity)
- Integrals (e.g., kernel growth)
- Sums (e.g., alternating sum)
- Transforms (e.g., Cauchy transform)
- Zeros (e.g., interlacing)
- Bounds (e.g., uniform estimates)
- Recurrences (e.g., boundary obstruction)

**Rule:** No two problems should study the same mathematical object in the same way.

#### Dimension 2: Domain/Region
Vary where the action happens:
- Interior points (x₀ ∈ (-1,1))
- Boundary/poles (θ→0, x→±1)
- Complex plane (z ∉ [-1,1])
- Entire domain (sup over [0,π])
- Special points (north pole, equator)
- Asymptotic regime (large N, large ℓ)
- Small parameter limit (ℓ→m)

**Rule:** If using same technique, apply it in different regime.

#### Dimension 3: Core Insight Type
Each problem teaches different mathematical principle:
- **Structural transformation** (oscillation → monotonicity via auxiliary function)
- **Cancellation mechanism** (Weyl equidistribution in oscillatory sums)
- **Singularity analysis** (identifying divergence source)
- **Representation theory** (Jacobi conversion, basis changes)
- **Operator domains** (L₊ at boundary)
- **Order of operations** (rotate then evaluate vs evaluate then rotate)
- **Symmetry breaking** (weight destroys orthogonality)
- **Perturbation effects** (how small changes propagate)
- **Connection formulas** (relating different representations)
- **Generating functions** (closed-form sum evaluation)

**Rule:** Never repeat the same type of insight. Each problem should have its own "aha!" moment.

#### Dimension 4: Technique Combination
Even if reusing NU methods, combine differently.

**Example existing combinations:**
- NU auxiliary function alone
- NU envelope + Stirling
- NU Cauchy + recurrence
- Jacobi representation + Szegő + Stirling + Weyl

**Example new unique combinations:**
- NU generating function + factorial analysis
- NU connection formula + basis transformation
- NU Rodrigues + boundary operator theory
- NU weight theory + perturbation + symmetry
- NU recurrence + index boundary + parity
- NU asymptotic infinity + complex analysis
- NU envelope + operator composition

**Rule:** Each technique combination should appear at most once.

### Anti-Pattern: Repetitive Problems (NEVER DO THIS)

❌ **BAD Example - Repetition:**

**Problem A:** "For associated Legendre P_ℓ^m at x=0, does the envelope estimate give bound C/√ℓ?"

**Problem B:** "For associated Legendre P_ℓ^m at x=1/2, does the envelope estimate give bound C/√ℓ?"

**Why bad:** Same question, just different evaluation point. No new insight. Just parameter variation.

---

✅ **GOOD Example - Diversity:**

**Problem A (existing):** "Does weighted Y_ℓ^m satisfy uniform bound when weight is (sin θ)^{|m|+δ}?"
- **Insight:** Balancing weight powers with envelope exponents
- **Technique:** NU envelope Eq. 19 + Stirling
- **Teaches:** How to apply envelope estimates to weighted functions

**Problem B (new):** "When differential operator L=(1-x²)d²/dx² is applied to weighted P_ℓ^m, does result still satisfy envelope bound at boundary x→±1?"
- **Insight:** Operators change weight structure; envelope breaks at boundary
- **Technique:** NU envelope + operator calculus
- **Teaches:** How operators interact with asymptotics

**Why good:** Both use NU envelope, but:
- Different questions (static bound vs operator action)
- Different insights (weight balance vs operator effect)
- Different domains (interior vs boundary)
- Complementary teachings (second extends first to new context)

### Problem Design Workflow with Uniqueness

#### Step 1: Check Uniqueness FIRST (Before Designing)

**Uniqueness Checklist:**
- [ ] Is this mathematical question fundamentally different from all existing problems?
- [ ] Does this teach a genuinely new insight not covered elsewhere?
- [ ] Is the technique combination novel (not used before)?
- [ ] Does this explore a different domain/regime than existing problems?
- [ ] Would an expert say "this is interesting and different"?

**If ANY answer is NO → redesign the problem before proceeding**

#### Step 2: Define the Unique Core

Write in one sentence what makes THIS problem special:

**Template:** "This problem is the only one that [unique aspect]"

**Examples:**
- "...studies how OPERATORS change asymptotic behavior at boundaries"
- "...uses GENERATING FUNCTIONS for closed-form sum evaluation"
- "...explores CONNECTION FORMULAS between different representations"
- "...analyzes RODRIGUES FORMULA at domain boundaries"
- "...tests WEIGHT PERTURBATION + measure symmetry interaction"
- "...applies STURM THEORY to prove zero interlacing"
- "...uses WEYL EQUIDISTRIBUTION for oscillatory cancellation"

#### Step 3: Design Around the Unique Core

Let the unique mathematical question drive everything:
- **Claim** follows naturally from the unique question
- **Trap** emerges organically from the unique insight
- **Technique** is what's needed for this unique problem
- **Solution** showcases the unique reasoning

**Don't force:** "I need to use trap H, so let me find something..."  
**Do ask:** "What's a unique question about X that no one has asked? What trap naturally arises from exploring this?"

#### Step 4: Verify Differentiation from ALL Existing Problems

For each existing problem that seems related, explicitly state the difference:

**Comparison Template:**
- **Proposed:** [new problem concept]
- **Similar existing:** [which problem seems related]
- **Key difference:** [how they differ in question/insight/technique/domain]
- **Verdict:** ✅ Sufficiently different OR ⚠️ Too similar, redesign needed

**Example:**
- **Proposed:** NU generating function for sum ∑ P_ℓ^m(x)t^ℓ
- **Similar existing:** 85ca892d (kernel sum growth ∑ Θ_ℓm²)
- **Key difference:** 85ca892d uses Szegő asymptotics + Weyl for oscillatory cancellation; new problem uses closed-form generating function + factorial analysis. Completely different techniques and insights.
- **Verdict:** ✅ Sufficiently different

### The "Expert Test"

Imagine showing all problems to an expert in special functions. For each pair, ask:

**"Are these basically the same problem?"**

- **If expert says YES** → redesign one of them immediately
- **If expert says "related but different"** → ✅ OK, complementary is good
- **If expert says "completely different"** → ✅ Excellent, ideal

**Example Expert Reactions:**

**Expert reviews NU auxiliary function vs NU Rodrigues:**
> "One uses auxiliary function method for monotonicity, the other uses Rodrigues formula for boundary growth. Both involve differential operators but completely different questions and insights. Not repetitive at all."

**Verdict:** ✅ Unique

**Expert reviews kernel sum vs generating function sum:**
> "Both evaluate sums, but completely different techniques. One uses asymptotics + Weyl, other uses closed-form g.f. Different mathematical machinery entirely."

**Verdict:** ✅ Unique

**Expert reviews static envelope bound vs envelope with operator:**
> "Related problems, but second extends the first by asking how operators affect bounds. Complementary rather than repetitive. Second assumes understanding of first."

**Verdict:** ✅ Unique (complementary)

### Red Flags: When You're Being Repetitive

**Warning Signs - STOP if you see these:**

🚩 "This is like problem X but at a different point"  
🚩 "I'm using the same technique as problem Y, just with different parameter"  
🚩 "The insight is basically what problem Z teaches"  
🚩 "Let me just change m to k and call it new"  
🚩 "This is problem W with Jacobi instead of Legendre"  
🚩 "I'll test the same property on a related function"

**If You See These → STOP and Redesign**

**Ask instead:**
- "What mathematical question has NO similar problem in the cluster?"
- "What NU method have I not used at all yet?"
- "What insight would genuinely surprise me if I didn't know it?"
- "What combination of techniques seems powerful but completely unexplored?"
- "What domain/regime haven't I visited yet?"

### Success Metrics for Uniqueness

A problem achieves uniqueness if:

1. ✅ **Novel question** - no existing problem asks anything similar
2. ✅ **New insight** - teaches principle not covered elsewhere in cluster
3. ✅ **Fresh technique combo** - uses methods in new combination or applies existing technique to new context
4. ✅ **Different regime** - explores part of domain/parameter space not yet studied
5. ✅ **Complementary** - adds to cluster without overlapping existing problems
6. ✅ **Expert-approved** - specialist would say "this is different and interesting"
7. ✅ **Self-interesting** - problem worth solving for its own mathematical sake

**Minimum to proceed:** 5/7 criteria met  
**Target for excellence:** 6-7/7 criteria met

### Practical Checklist Before Creating Problem

**Run through this checklist for EVERY new problem:**

#### Uniqueness Verification
- [ ] Checked against ALL existing problems in cluster
- [ ] Differs in at least 2-3 dimensions (object, domain, insight, technique)
- [ ] Defines unique core in one sentence
- [ ] Would pass "expert test" (not seen as repetitive)
- [ ] No red flags detected

#### Quality Standards (from templates)
- [ ] Tier 1 reasoning depth
- [ ] Direct NU citation
- [ ] Natural trap emergence
- [ ] Clear educational value
- [ ] Proper solution structure

#### Final Verification
- [ ] Would I want to solve this problem?
- [ ] Does it teach something I'd remember?
- [ ] Is it genuinely different from what I've seen?

**Only proceed if ALL boxes checked.**

### Summary: Templates for Structure, Creativity for Content

**Use Templates For:**
- ✅ Formatting (LaTeX, structure, citations)
- ✅ Quality criteria (Tier 1 requirements, NU citation)
- ✅ Solution style (rigorous, clear, theorem-cited)
- ✅ Verification checklist (meeting standards)

**Use Creativity For:**
- ✨ **Mathematical question** - must be genuinely unique
- ✨ **Key insight** - must teach something new
- ✨ **Technique mashup** - novel combinations or applications
- ✨ **Problem narrative** - how question naturally arises from mathematics

**The art:** Use templates as scaffolding for quality, pour unique mathematical content into that structure.

**Result:** High-quality, systematic coverage WITHOUT repetition.

---

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

## Examples from Spherical Harmonics Cluster

### Tier 1: Reasoning-First ⭐⭐⭐

**85ca892d (Christoffel-Darboux kernel growth)**
- **Deep insight:** Kernel grows linearly because oscillations cancel via Weyl equidistribution after Szegő asymptotics reveal cos² structure
- **Creative methods:** Convert associated Legendre → Jacobi polynomials, apply Szegő interior asymptotic (non-trivial specialization), use Stirling for normalization, invoke Weyl equidistribution for oscillatory sum
- **Traps:** Asymptotic boundary (M) + oscillatory cancellation (E) guide the analysis naturally
- **NU reference:** Uses Szegő Theorem 8.21.8 (formula 8.21.10) specialized to α=β=m, combined with NU techniques for normalization via Stirling
- **Why excellent:** Research-level reasoning connecting representation theory, asymptotic analysis, and ergodic theory. Solution is enlightening and technique generalizes.

**07d41e49 (Raising operator singularity source)**
- **Deep insight:** Must distinguish 1/sin θ in definition from cot θ in L₊ operator—divergence source matters
- **Creative methods:** Analyze operator structure, construct specific counterexample (ℓ=1, m=0), track each singularity term carefully
- **Traps:** Singularity source misidentification (A + I)—common error is blaming cot θ
- **NU reference:** Operator domain analysis follows NU Chapter II principles for singular points of differential equations
- **Why excellent:** Tests genuine understanding of operator domains and singularity analysis. Teaches important lesson about identifying error sources.

**16ab09af (Nikiforov-Uvarov auxiliary function for monotonicity)**
- **Deep insight:** Transform oscillation question into monotonicity via energy-like auxiliary function
- **Creative methods:** Construct v(x) = y² + σy'²/λ, use differential equation to prove v' > 0, apply at critical points
- **Traps:** None (pure reasoning problem)—no trap needed because method itself is non-obvious
- **NU reference:** **Direct application of NU Chapter II, Section 7** - this is THE canonical example of NU auxiliary function method
- **Why excellent:** Requires creative problem transformation. Teaches powerful general technique directly from NU book.

**93f8b201 (Cauchy transform Wronskian identity)**
- **Deep insight:** Cauchy transforms inherit recurrence relations from original functions via integration technique
- **Creative methods:** Derive three-term recurrence from spherical harmonic addition, integrate (t·Θ)/(z-t) carefully, use orthogonality
- **Traps:** Factorial ratio error (K) + normalization (F) in claimed constant
- **NU reference:** Uses NU Chapter II, Section 11 Cauchy transform theory (Eqs. 4-7) for second kind functions and asymptotics
- **Why good:** Connects Cauchy transform theory to recurrence relations. Requires careful algebraic manipulation and understanding of orthogonality.

### Tier 2: Trap-First ⭐⭐

**27ff7bd2 (Modified sum at north pole)**
- **Insight:** Evaluate at special point (north pole) where only m=0 term survives
- **Trap:** Parity-dependent alternating sum (L) + pole behavior (A)
- **Why acceptable:** Some cleverness in choosing test point, but mainly about catching parity dependence. Less deep reasoning required.

**842d9e3e (Projection operator scaling)**
- **Insight:** Check if T² = T (idempotency) vs T² = cT (scaled projection)
- **Trap:** Missing scaling factor 4π/(2ℓ+1) (F)
- **Why acceptable:** Straightforward verification once you know to check idempotency. More about careful computation than deep insight.

**216d864a (Weighted moment formula error)**
- **Insight:** Use addition theorem to reduce sum, evaluate integral
- **Trap:** Wrong factorial formula in claimed constant (F)
- **Why acceptable:** Standard technique application (addition theorem), mainly catches formula error rather than requiring creative reasoning.

---

## 1. Supported Domains

### Tier 1: Fully Supported (⭐⭐⭐)
All 14 traps implemented, ready to use:

| Domain | Code | Key Features |
|--------|------|--------------|
| Spherical Harmonics | spherical_harmonics | Y_ℓm, poles, rotation, addition theorem |
| Bessel Functions | bessel | J_ν, origin singularity, zeros, oscillations |
| Hermite Polynomials | hermite | H_n, Gaussian weight, quantum oscillator |
| Laguerre Polynomials | laguerre | L_n^α, exponential weight, semi-infinite |
| Chebyshev Polynomials | chebyshev | T_n/U_n, endpoint singularities, trigonometric |
| Jacobi Polynomials | jacobi | P_n^(α,β), most general classical polynomial |

### Tier 2: Partially Supported (⭐⭐)
Core traps implemented, some require adaptation:

| Domain | Code | Notes |
|--------|------|-------|
| Hypergeometric | hypergeometric | ₂F₁, connection formulas, singularities 0,1,∞ |
| Wigner Functions | wigner | D-functions, rotation group, quantum angular momentum |
| Elliptic Integrals | elliptic | K,E,Π, modulus parameter, complementary forms |

### Tier 3: Experimental (⭐)
Basic support, custom templates needed:

| Domain | Code | Notes |
|--------|------|-------|
| Mathieu Functions | mathieu | ce_n, se_n, characteristic values |
| q-Orthogonal | q_orthogonal | q-analogues, classical limit q→1 |

## 2. The Trap System (A-N)

**Important:** Traps are tools to create depth, not goals in themselves. Use them to prevent shortcuts and guide toward genuine insights.

### Overview Table

| Code | Name | What It Exploits | Best Domains | Reasoning Depth |
|------|------|------------------|--------------|-----------------|
| A | Boundary/Pole Singularity | Limits at domain boundaries | spherical_harmonics, bessel, chebyshev | ⭐⭐⭐ (requires singularity analysis) |
| B | Parity/Index-Dependent | Global claim fails at specific indices | All polynomial domains | ⭐⭐ (requires careful checking) |
| C | Basis/Quantization Mismatch | Different representations | spherical_harmonics, wigner, hypergeometric | ⭐⭐⭐ (requires representation theory) |
| D | Pointwise vs Global | L² vs pointwise equality | All domains with orthogonality | ⭐⭐⭐ (requires measure theory) |
| E | Oscillatory Cancellation | Asymptotic sum cancellations | bessel, spherical_harmonics, fourier | ⭐⭐⭐ (requires Weyl/stationary phase) |
| F | Scaling/Normalization | Wrong constants | All domains | ⭐ (mainly computation) |
| G | Weight Perturbation | Modified orthogonality weight | All orthogonal polynomial domains | ⭐⭐ (requires perturbation theory) |
| H | Index Shift Obstruction | Recurrence fails at boundary | All domains with recurrences | ⭐⭐ (requires boundary analysis) |
| I | Operator Domain Singularity | Differential operator at boundary | spherical_harmonics, bessel, laguerre | ⭐⭐⭐ (requires operator theory) |
| J | Non-Commutative Composition | Operation order matters | spherical_harmonics, wigner, transforms | ⭐⭐⭐ (requires understanding structure) |
| K | Factorial Ratio Error | Complex normalization | All domains with Γ functions | ⭐⭐ (requires Stirling/careful algebra) |
| L | Parity-Dependent Telescoping | Alternating sums depend on parity | All domains with (-1)^n factors | ⭐ (mainly checking) |
| M | Asymptotic Boundary Violation | Interior formula at boundary | bessel, spherical_harmonics, hypergeometric | ⭐⭐⭐ (requires asymptotic analysis) |
| N | Measure-Broken Symmetry | Weight breaks algebraic symmetry | All domains with weights | ⭐⭐⭐ (requires measure theory) |

### Detailed Trap Descriptions

#### Trap A: Boundary/Pole Singularity
**Concept**: Apply operations at points where functions/operators degenerate

**Domain Adaptations**:
- spherical_harmonics: θ=0,π where sin θ → 0
- bessel: r=0 where J_ν ~ r^ν
- chebyshev: x=±1 where weight (1-x²)^{-1/2} → ∞
- laguerre: x=0 or x→∞
- hermite: |x|→∞ where H_n ~ x^n

**Pattern**: "The limit as [variable]→[boundary] of [expression] equals..."

**Reasoning-first usage**: Requires understanding singularity structure, Laurent expansions, operator domains, careful limit analysis

#### Trap B: Parity/Index-Dependent Validity
**Concept**: Claim "for all n≥k" fails at exactly n=k or n=k+1

**Domain Adaptations**:
- spherical_harmonics: Even/odd ℓ, failure at ℓ=m+1
- bessel: Integer vs half-integer ν
- hermite: Even/odd n
- laguerre: α=-1/2, α=-1 boundaries
- jacobi: α=β=0 boundary (Legendre case)

**Pattern**: "For all n≥2..." (check n=2 explicitly)

**Reasoning-first usage**: Best when parity dependence is deeply connected to structure (e.g., symmetry breaking, representation theory), not just a simple check

#### Trap C: Basis/Quantization Axis Mismatch
**Concept**: Different coordinate systems or representations

**Domain Adaptations**:
- spherical_harmonics: z-axis vs tilted axis, rotation
- wigner: D_{mm'}^ℓ vs different quantization
- bessel: J_ν, Y_ν vs Hankel H_ν^(1), H_ν^(2)
- hypergeometric: Different branch choices

**Pattern**: "After transformation, [function] equals..."

**Reasoning-first usage**: Requires understanding representation theory, how basis changes affect computations, non-commutativity

#### Trap D: Pointwise vs Global/Integral Validity
**Concept**: Confusion between different notions of equality

**Domain Adaptations**:
- All orthogonal systems: ⟨f,g⟩=0 vs f(x)g(x)=0
- spherical_harmonics: Integral over S² vs specific (θ,φ)
- bessel: ∫₀^∞ vs specific r values

**Pattern**: "The function equals [constant]" (ambiguous: everywhere or in average?)

**Reasoning-first usage**: Tests understanding of L² theory, measure theory, different function spaces

#### Trap E: Oscillatory Cancellation in Sums/Integrals
**Concept**: Oscillations cause unexpected cancellation

**Domain Adaptations**:
- bessel: ∑ J_ν(j_{ν,k}r) with zeros j_{ν,k}
- spherical_harmonics: ∑ Y_ℓm with large ℓ
- fourier: ∑ cos(nθ) or ∑ sin(nθ)

**Pattern**: "The sum grows like N²" (actually grows like N due to cancellation)

**Reasoning-first usage**: Requires Weyl equidistribution, stationary phase, Riemann-Lebesgue lemma—deep harmonic analysis

#### Trap F: Scaling/Normalization Factor Errors
**Concept**: Structure correct but constant wrong

**Domain Adaptations**:
- All domains: Missing factors of 2, π, √2
- Projection operators: T² = cT instead of T²=T
- Orthogonality: Wrong normalization constant

**Pattern**: Formula matches except for factor

**Reasoning-first usage**: Lower reasoning depth; best combined with other traps to add depth

#### Trap G: Almost-Orthogonality / Weight Perturbation
**Concept**: Small weight change breaks orthogonality

**Domain Adaptations**:
- hermite: e^{-x²} → e^{-x²(1+εx²)}
- laguerre: x^α e^{-x} → x^{α+δ} e^{-x}
- bessel: r → r^{1+ε}
- jacobi: (1-x)^α(1+x)^β → (1-x)^α(1+x)^β(1-x²)^ε

**Pattern**: "Orthogonality persists under weight w̃(x) = w(x)[1+ε...]"

**Reasoning-first usage**: Requires perturbation theory, careful expansion, understanding how structure depends on weight

#### Trap H: Index Shift Obstruction
**Concept**: Recurrence/formula breaks at boundary index

**Domain Adaptations**:
- All with recurrences: Check P_n and P_{n-k} at n=k
- bessel: J_{ν-1} undefined at ν=0
- spherical_harmonics: Y_{ℓ,m-1} at m=-ℓ
- laguerre: Coefficient (n+α) at α=-n

**Pattern**: "For all n≥k, [involving n-k term]..." (fails at n=k)

**Reasoning-first usage**: Best when boundary behavior reveals deep structure (e.g., representation theory, operator domains)

#### Trap I: Operator Domain Singularity
**Concept**: Apply differential/ladder operator where undefined

**Domain Adaptations**:
- spherical_harmonics: (1/sin θ)(∂/∂θ) at θ=0,π
- spherical_harmonics: L₊ at m=ℓ, L₋ at m=-ℓ
- bessel: (1/r)(d/dr) at r=0
- laguerre: Rodrigues D^n at x=0

**Pattern**: "The operator [O] applied at [boundary] gives..."

**Reasoning-first usage**: Requires understanding operator theory, domains of definition, functional analysis—high depth

#### Trap J: Non-Commutative Composition
**Concept**: Operations don't commute

**Domain Adaptations**:
- spherical_harmonics: Rotate then integrate vs integrate then rotate
- wigner: Product order d_{m,m'}^ℓ d_{m',m''}^ℓ
- Transforms: Integrate then transform vs transform then integrate

**Pattern**: "∫[Tf] g = ∫f [Tg] for operator T"

**Reasoning-first usage**: Tests understanding of algebraic structure, group theory, why commutativity fails—high depth

#### Trap K: Factorial Ratio Miscalculation
**Concept**: Complex Γ ratios computed wrong

**Domain Adaptations**:
- All domains: Γ(ν+n)/Γ(ν) ≠ n!
- bessel: Γ(ν+1/2)/Γ(ν) confusion
- Double factorials: (2n)!! vs (2n-1)!!
- Pochhammer: (a)_n definition ambiguity

**Common errors**:
- (2ℓ)!/(2^ℓ ℓ!) vs (2ℓ)!/(2^ℓ (ℓ!)²)
- √[(ℓ-m)!/(ℓ+m)!] vs [(ℓ-m)!/(ℓ+m)!]

**Pattern**: Normalization involves complex factorial ratio

**Reasoning-first usage**: Combine with other traps; requires Stirling approximation for depth

#### Trap L: Parity-Dependent Telescoping
**Concept**: Alternating sum cancellation depends on parity

**Domain Adaptations**:
- All domains: ∑_{k=0}^n (-1)^k depends on n mod 2
- spherical_harmonics: ∑_{m=-ℓ}^ℓ (-1)^m depends on ℓ mod 2
- Binomial sums: ∑ (-1)^k C(n,k) f_k

**Pattern**: "∑(-1)^k ... = 0 for all n" (check even vs odd n)

**Reasoning-first usage**: Lower depth alone; best when parity connects to deeper structure (representation theory, symmetry)

#### Trap M: Asymptotic Boundary Violation
**Concept**: Use large-parameter formula at small parameter

**Domain Adaptations**:
- bessel: J_ν(r) ~ √(2/πr)cos(...) used at r=1,2
- spherical_harmonics: Interior Szegő formula at poles
- WKB approximation at ℓ=1,2
- "For large n" applied to n=3

**Pattern**: "For all n≥k, the asymptotic formula..." (fails at n=k,k+1)

**Reasoning-first usage**: Requires understanding asymptotic analysis, error terms, regime of validity—high depth

#### Trap N: Measure-Broken Symmetry
**Concept**: Function symmetry ≠ integral symmetry

**Domain Adaptations**:
- Even f(x)=f(-x) but ∫f(x)w(x)dx ≠ 0 if w asymmetric
- spherical_harmonics: Rotation-invariant sum, non-invariant measure
- Parity selection broken by weight

**Pattern**: "Since f is even/odd, ∫f w dx = 0" (not if w breaks parity)

**Reasoning-first usage**: Tests understanding of measure theory, how symmetry and integration interact—high depth

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
