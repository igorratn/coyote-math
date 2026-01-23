# Domain-Agnostic "Stumble" Problem Generator: Complete Instructions

## Core Philosophy
Create problems that **look simple but hide a trap** - they should appear to yield to standard techniques but require a crucial insight to avoid error. The framework is **fully customizable** across mathematical domains.

## Quick Start Usage

### Command Format
Create new problem for <DOMAIN> using traps <TRAP_CODES>

### Examples
Create new problem for bessel using traps B and H
Create new problem for hermite using traps G and N
Create new problem for spherical_harmonics using traps A and M
Create new problem for laguerre using trap H

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

### Overview Table

| Code | Name | What It Exploits | Best Domains |
|------|------|------------------|--------------|
| A | Boundary/Pole Singularity | Limits at domain boundaries | spherical_harmonics, bessel, chebyshev |
| B | Parity/Index-Dependent | Global claim fails at specific indices | All polynomial domains |
| C | Basis/Quantization Mismatch | Different representations | spherical_harmonics, wigner, hypergeometric |
| D | Pointwise vs Global | L² vs pointwise equality | All domains with orthogonality |
| E | Oscillatory Cancellation | Asymptotic sum cancellations | bessel, spherical_harmonics, fourier |
| F | Scaling/Normalization | Wrong constants | All domains |
| G | Weight Perturbation | Modified orthogonality weight | All orthogonal polynomial domains |
| H | Index Shift Obstruction | Recurrence fails at boundary | All domains with recurrences |
| I | Operator Domain Singularity | Differential operator at boundary | spherical_harmonics, bessel, laguerre |
| J | Non-Commutative Composition | Operation order matters | spherical_harmonics, wigner, transforms |
| K | Factorial Ratio Error | Complex normalization | All domains with Γ functions |
| L | Parity-Dependent Telescoping | Alternating sums depend on parity | All domains with (-1)^n factors |
| M | Asymptotic Boundary Violation | Interior formula at boundary | bessel, spherical_harmonics, hypergeometric |
| N | Measure-Broken Symmetry | Weight breaks algebraic symmetry | All domains with weights |

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

#### Trap B: Parity/Index-Dependent Validity
**Concept**: Claim "for all n≥k" fails at exactly n=k or n=k+1

**Domain Adaptations**:
- spherical_harmonics: Even/odd ℓ, failure at ℓ=m+1
- bessel: Integer vs half-integer ν
- hermite: Even/odd n
- laguerre: α=-1/2, α=-1 boundaries
- jacobi: α=β=0 boundary (Legendre case)

**Pattern**: "For all n≥2..." (check n=2 explicitly)

#### Trap C: Basis/Quantization Axis Mismatch
**Concept**: Different coordinate systems or representations

**Domain Adaptations**:
- spherical_harmonics: z-axis vs tilted axis, rotation
- wigner: D_{mm'}^ℓ vs different quantization
- bessel: J_ν, Y_ν vs Hankel H_ν^(1), H_ν^(2)
- hypergeometric: Different branch choices

**Pattern**: "After transformation, [function] equals..."

#### Trap D: Pointwise vs Global/Integral Validity
**Concept**: Confusion between different notions of equality

**Domain Adaptations**:
- All orthogonal systems: ⟨f,g⟩=0 vs f(x)g(x)=0
- spherical_harmonics: Integral over S² vs specific (θ,φ)
- bessel: ∫₀^∞ vs specific r values

**Pattern**: "The function equals [constant]" (ambiguous: everywhere or in average?)

#### Trap E: Oscillatory Cancellation in Sums/Integrals
**Concept**: Oscillations cause unexpected cancellation

**Domain Adaptations**:
- bessel: ∑ J_ν(j_{ν,k}r) with zeros j_{ν,k}
- spherical_harmonics: ∑ Y_ℓm with large ℓ
- fourier: ∑ cos(nθ) or ∑ sin(nθ)

**Pattern**: "The sum grows like N²" (actually grows like N due to cancellation)

#### Trap F: Scaling/Normalization Factor Errors
**Concept**: Structure correct but constant wrong

**Domain Adaptations**:
- All domains: Missing factors of 2, π, √2
- Projection operators: T² = cT instead of T²=T
- Orthogonality: Wrong normalization constant

**Pattern**: Formula matches except for factor

#### Trap G: Almost-Orthogonality / Weight Perturbation
**Concept**: Small weight change breaks orthogonality

**Domain Adaptations**:
- hermite: e^{-x²} → e^{-x²(1+εx²)}
- laguerre: x^α e^{-x} → x^{α+δ} e^{-x}
- bessel: r → r^{1+ε}
- jacobi: (1-x)^α(1+x)^β → (1-x)^α(1+x)^β(1-x²)^ε

**Pattern**: "Orthogonality persists under weight w̃(x) = w(x)[1+ε...]"

#### Trap H: Index Shift Obstruction
**Concept**: Recurrence/formula breaks at boundary index

**Domain Adaptations**:
- All with recurrences: Check P_n and P_{n-k} at n=k
- bessel: J_{ν-1} undefined at ν=0
- spherical_harmonics: Y_{ℓ,m-1} at m=-ℓ
- laguerre: Coefficient (n+α) at α=-n

**Pattern**: "For all n≥k, [involving n-k term]..." (fails at n=k)

#### Trap I: Operator Domain Singularity
**Concept**: Apply differential/ladder operator where undefined

**Domain Adaptations**:
- spherical_harmonics: (1/sin θ)(∂/∂θ) at θ=0,π
- spherical_harmonics: L₊ at m=ℓ, L₋ at m=-ℓ
- bessel: (1/r)(d/dr) at r=0
- laguerre: Rodrigues D^n at x=0

**Pattern**: "The operator [O] applied at [boundary] gives..."

#### Trap J: Non-Commutative Composition
**Concept**: Operations don't commute

**Domain Adaptations**:
- spherical_harmonics: Rotate then integrate vs integrate then rotate
- wigner: Product order d_{m,m'}^ℓ d_{m',m''}^ℓ
- Transforms: Integrate then transform vs transform then integrate

**Pattern**: "∫[Tf] g = ∫f [Tg] for operator T"

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

#### Trap L: Parity-Dependent Telescoping
**Concept**: Alternating sum cancellation depends on parity

**Domain Adaptations**:
- All domains: ∑_{k=0}^n (-1)^k depends on n mod 2
- spherical_harmonics: ∑_{m=-ℓ}^ℓ (-1)^m depends on ℓ mod 2
- Binomial sums: ∑ (-1)^k C(n,k) f_k

**Pattern**: "∑(-1)^k ... = 0 for all n" (check even vs odd n)

#### Trap M: Asymptotic Boundary Violation
**Concept**: Use large-parameter formula at small parameter

**Domain Adaptations**:
- bessel: J_ν(r) ~ √(2/πr)cos(...) used at r=1,2
- spherical_harmonics: Interior Szegő formula at poles
- WKB approximation at ℓ=1,2
- "For large n" applied to n=3

**Pattern**: "For all n≥k, the asymptotic formula..." (fails at n=k,k+1)

#### Trap N: Measure-Broken Symmetry
**Concept**: Function symmetry ≠ integral symmetry

**Domain Adaptations**:
- Even f(x)=f(-x) but ∫f(x)w(x)dx ≠ 0 if w asymmetric
- spherical_harmonics: Rotation-invariant sum, non-invariant measure
- Parity selection broken by weight

**Pattern**: "Since f is even/odd, ∫f w dx = 0" (not if w breaks parity)

## 3. Trap Combination Strategies

### High-Impact Pairs

| Combination | Description | Best For |
|-------------|-------------|----------|
| A + H | Singularity + Index boundary | spherical_harmonics, bessel |
| A + M | Singularity + Asymptotic misuse | bessel, spherical_harmonics |
| B + H | Parity + Index obstruction | All polynomials |
| B + L | Two types of parity dependence | spherical_harmonics, hermite |
| C + J | Basis mismatch + Non-commutativity | spherical_harmonics, wigner |
| D + N | Pointwise vs global + Measure | All orthogonal systems |
| E + M | Oscillation + Asymptotic | bessel, spherical_harmonics |
| F + K | Two normalization errors | All domains |
| G + N | Weight perturbation + Symmetry breaking | All orthogonal polynomials |
| H + I | Index obstruction + Operator singularity | spherical_harmonics, bessel |

### Triple Combinations (Most Difficult)

| Combination | Example |
|-------------|---------|
| A + H + M | Singularity at boundary index with asymptotic formula |
| B + G + N | Parity-dependent with perturbed weight breaking symmetry |
| C + J + K | Basis transformation non-commutative with factorial error |
| D + E + M | Global vs local with oscillations and asymptotic boundary |

## 4. Problem Template Structure

### Standard Format
Let [DOMAIN_FUNCTIONS] denote [standard definition with normalization]
[Define DOMAIN_PARAMETER ranges including boundary cases]
[Define AUXILIARY_OBJECT using domain operations]
For [PARAMETER_RANGE including critical boundaries]

Claim
[State assertion with TRAP_INDICATORS]
Determine with rigorous proof whether the claim is True or False.

### Trap Indicators to Include

| Trap | Indicator Phrase |
|------|------------------|
| A | "as x→[boundary]", "at the pole", "limit" |
| B | "for all ℓ≥1", "for all n≥k" |
| C | "after rotation", "in the transformed basis" |
| D | "equals" (ambiguous: pointwise or integral?) |
| E | "grows like N^α", "behaves as" |
| F | "projection operator", "normalized such that" |
| G | "under modified weight w̃(x) = w(x)[...]" |
| H | "for all n≥k" with n-k term in formula |
| I | "the operator O at [boundary]" |
| J | "∫[Tf]g = ∫f[Tg]", "commutes" |
| K | normalization with Γ, factorials, ratios |
| L | "∑(-1)^m" or "alternating sum" |
| M | "for sufficiently large", "asymptotically" |
| N | "symmetric function implies ∫=0" |

## 5. Solution Structure Requirements

### Natural Flow (No Headers)
[Opening: Establish context and notation]
[Body: Build toward key insight through logical steps]
[Stumble Point: Where naive approach fails - CRITICAL]
[Resolution: Address the trap explicitly]
[Conclusion: State result clearly]

### The Stumble Point (Most Important)

Every solution must have a **turning point** where models fail:

Template:
[Naive reasoning that seems correct]
However, [examining specific case / boundary / explicit calculation] reveals...
[Show contradiction or unexpected behavior]
[Explain why this occurs - the trap mechanism]
Therefore, [conclusion]

Examples by Trap:

**Trap H Example**:
"The recurrence relation appears to establish the claim for all n≥2. However, examining the boundary case n=2 reveals that P_0 enters the formula. Since [orthogonality requires contradiction], the claim fails exactly at n=2."

**Trap N Example**:
"Since the function has parity (-1)^ℓ, one might expect the weighted integral to respect this symmetry. However, the measure w(θ)=|sin θ|^γ itself breaks reflection symmetry. Evaluating explicitly for ℓ=1 gives [nonzero result]."

**Trap K Example**:
"The normalization constant C_{ℓ,m} = √[(2ℓ+1)!/(ℓ!)²]·[(ℓ-m)!/(ℓ+m)!] is often simplified incorrectly. The correct simplification requires [proper factorial identities], showing the claim is missing a factor of 2^ℓ."

## 6. Quality Verification Checklist

Before finalizing any problem:

- Uses at least ONE trap (A-N), preferably 2-3
- Cannot be solved by direct substitution
- Requires connecting two different mathematical domains/properties
- Failure point is isolated and non-obvious
- Claim has strategic ambiguity or boundary dependence
- Solution explicitly addresses the stumble point
- No duplication with existing problems
- Proper formatting (use \, not , in LaTeX)
- Grammar and spelling correct
- Would fool 2/3 of capable models

## 7. Anti-Patterns to Avoid

| Don't Do This | Do This Instead |
|---------------|-----------------|
| "Evaluate ∫f(x)g(x)w(x)dx" | "Does ∫f(x)g(x)w̃(x)dx = 0 for w̃ = w(1+εh)?" |
| "Simplify [expression]" | "Does [expression] = [simpler form] for all n≥2?" |
| "Find the limit as x→0" | "Does lim_{x→0} [ratio] = [value] for all ν≥1?" |
| Generic descriptions | Specific boundary case testing |
| Obvious calculations | Hidden trap requiring insight |

## 8. Example Commands with Expected Output

### Example 1: Bessel with B+H
Create new problem for bessel using traps B and H

**Output**: Problem about J_ν with modified function involving J_{ν-2}, claimed true for ν≥2 but fails at ν=2 due to recurrence boundary.

### Example 2: Hermite with G+N
Create new problem for hermite using traps G and N

**Output**: Problem about orthogonality under perturbed Gaussian weight e^{-x²(1+αx²)}, symmetry appears preserved but measure breaks it.

### Example 3: Spherical Harmonics with C+J
Create new problem for spherical_harmonics using traps C and J

**Output**: Problem about rotation and inner product, operations don't commute as expected.

## 9. Quick Reference Card

### Command Syntax
Create new problem for <domain> using traps <trap_codes>

### Available Domains
spherical_harmonics, bessel, hermite, laguerre, chebyshev, jacobi, hypergeometric, wigner, elliptic

### Trap Codes
A (singularity), B (parity), C (basis), D (pointwise vs global), E (oscillation), F (normalization), G (weight), H (index), I (operator), J (non-commute), K (factorial), L (telescoping), M (asymptotic), N (measure)

### Common Combinations
- Easy: Single trap (A, B, F, G)
- Medium: Pairs (A+M, B+H, G+N)
- Hard: Triples (A+H+M, B+G+N)

## 10. Success Metrics

A problem is **successful** if:

1. **Solvability**: A careful mathematician can solve it in 15-30 minutes
2. **Apparent simplicity**: Looks easier than it actually is
3. **Model stumble rate**: Fools at least 2 out of 3 capable AI models
4. **Clear trap**: The mechanism is identifiable after solution
5. **Educational value**: Teaches an important mathematical distinction

**Failure modes to avoid**:
- Too obvious (stumble rate < 33%)
- Too obscure (unsolvable without specialized knowledge)
- Ambiguous problem statement
- Trick question (not a genuine mathematical trap)

---

**Document Version**: 2.0
**Last Updated**: 2026-01-22
**Domains Supported**: 9 (Tier 1: 6, Tier 2: 3)
**Total Traps**: 14 (A-N)
**Problem Templates**: 45+