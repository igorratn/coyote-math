# Domain-Agnostic "Stumble" Problem Generator: Complete Instructions
# Version 3.2 - Empirical Enhancements Edition
# Updated: 2026-01-26 based on analysis of 95 high-quality problems

## Updates in v3.2:
- **5 new trap types** (O-S): Dimension Counting, Rodrigues Boundary, Subsequence Construction, Wigner Non-Vanishing, Index Boundary
- **4 new creative techniques** (7-10): Dimension counting, Subsequence construction, North pole evaluation, Pole decomposition
- **Enhanced spherical harmonics domain**: Detailed guide with 8 problem patterns, Varshalovich reference integration
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

### Enhanced Citation Guidelines

## Enhanced Citation Guidelines

### Mandatory Citation Format

**Your problems demonstrate excellent citation practices. Codify this standard:**

#### Format Requirements

**❌ BAD - Vague:**
```
"Use Nikiforov-Uvarov asymptotics"
"Apply the standard bound"
"By known theorem"
"From the reference"
```

**✅ GOOD - Specific:**
```
"By Nikiforov-Uvarov (1988), Chapter II, §7, inequality (19a)..."
"Apply Szegő, Orthogonal Polynomials (4th ed., 1975), Theorem 8.21.8..."
"Using Varshalovich et al. (1988), Chapter 4, Equation 4.3.2..."
"By the Nikiforov-Uvarov auxiliary function method (NU II.7, p. 87)..."
```

**Required components:**
1. ✅ Author(s) and publication year
2. ✅ Chapter or section number
3. ✅ Equation/Theorem/Inequality number
4. ✅ Page number (when possible)

#### Citation Levels by Content Type

**Level 1: Core Results (ALWAYS cite with full details)**
- Asymptotic formulas (Szegő Theorem 8.21.8, NU Chapter II, §7, Eq. 19)
- Bounds and estimates (NU inequality 19a, 20, 27)
- Auxiliary function constructions (NU II.7, p. 87)
- Wigner function formulas (Varshalovich Ch. 4, Eq. 4.3.2)
- Connection formulas (NU representation sections)

**Example:**
```
"By the Nikiforov-Uvarov interior estimate (NU 1988, Chapter II, §7, 
inequality 19a, p. 87), for Jacobi polynomials P_n^{(α,β)}(x) with 
α,β > -1 and x in the interior interval [-1+ε, 1-ε], there exists a 
constant K_{ε,α,β} such that..."
```

**Level 2: Standard Properties (Cite source, may omit page)**
- Orthogonality relations
- Three-term recurrences
- Rodrigues formulas
- Basic definitions

**Example:**
```
"By the three-term recurrence for Hermite polynomials (NU Chapter III, §13),
we have xH_k(x) = (1/2)H_{k+1}(x) + kH_{k-1}(x)."
```

**Level 3: Well-Known Facts (Can cite domain-standard sources)**
- Basic trigonometric identities
- Elementary calculus results
- Standard integral evaluations

**Example:**
```
"By integration by parts..."
"Using the substitution x = cos θ..."
```

### Multiple Source Coordination

**When problem requires multiple references:**

**Template:**
```
Solution combines three techniques:
1. [Technique A] - Reference: [Author, Year, Chapter X, Eq. Y]
2. [Technique B] - Reference: [Author, Year, Theorem Z]
3. [Technique C] - Reference: [Author, Year, §W, p. P]
```

**Example from actual problem:**
```
Solution requires multiple steps:
1. Normalization constant: NU (1988) Chapter II, §8, Eq. 8.21 with 
   Stirling approximation for Γ((2ℓ+1)/(ℓ-m)!)
2. Interior asymptotic formula: Szegő (1975), Theorem 8.21.8, 
   Darboux formula for P_n^{(α,β)}(cos θ)
3. Oscillatory cancellation: Weyl equidistribution theorem 
   (Stein & Shakarchi, Fourier Analysis, Ch. 6)
```

### Domain-Specific Citation Patterns

#### For Jacobi/Legendre Problems

**Primary: NU**
```
"By NU Chapter II, §8, the Jacobi polynomials satisfy..."
"Using NU inequality (19a) for interior estimates..."
"The Rodrigues formula (NU Chapter II, §7) gives..."
```

**Secondary: Szegő** (for asymptotics)
```
"By Szegő, Orthogonal Polynomials (4th ed., 1975), Theorem 8.21.8,
the Darboux asymptotic formula for large n is..."
```

#### For Spherical Harmonics Problems

**Primary: NU** (for Legendre connection)
```
"Associated Legendre functions satisfy (NU Chapter II, §8)..."
"By NU interior estimate inequality (20)..."
```

**Primary: Varshalovich** (for rotation/Wigner)
```
"The Wigner small d-function (Varshalovich et al. 1988, Ch. 5, 
Eq. 4.3.2) for ℓ=1 is d_{01}^1(β) = -sin(β)/√2"
"By the rotation matrix properties (Varshalovich Ch. 4)..."
```

**Tertiary: Standard texts** (for basic definitions)
```
"Spherical harmonics are defined as (Jackson, Classical Electrodynamics)..."
```

#### For Hermite/Laguerre Problems

**Primary: NU**
```
"By NU Chapter III, §13 (Hermite polynomials)..."
"The envelope estimate (NU Eq. 27) for Laguerre polynomials..."
```

#### For Bessel Functions

**Primary: NU Chapter III** (when available)
```
"By NU Chapter III (Bessel functions)..."
```

**Alternative: Watson** (for specialized results)
```
"By Watson, Theory of Bessel Functions (1944), Chapter X..."
```

### Page Number Guidelines

**When to include page numbers:**

✅ **ALWAYS for:**
- Auxiliary function constructions (method description spans pages)
- Theorem proofs (want reader to see proof)
- Specialized formulas (hard to find without page)
- Example applications (specific instance)

✅ **OPTIONAL for:**
- Well-known formulas (easy to find via equation number)
- Chapter-level citations (if chapter is short)

✅ **NOT NEEDED for:**
- Entire books/chapters cited generally
- Standard formulas with equation numbers

**Example with pages:**
```
"The Nikiforov-Uvarov auxiliary function method (NU 1988, Chapter II, 
§7, pp. 85-88) constructs v(x) = [y(x)]² + (σ(x)/λ)[y'(x)]² where..."
```

**Example without pages:**
```
"By the recurrence relation (NU Eq. 13.4)..."
```

### Citation Verification Checklist

Before finalizing a problem solution, verify:

- [ ] Every asymptotic formula cited with Theorem/Eq number
- [ ] Every bound cited with inequality number
- [ ] NU used for special function properties
- [ ] Varshalovich used for Wigner/rotation (if applicable)
- [ ] Multiple sources coordinated with explicit technique mapping
- [ ] Page numbers included for method descriptions
- [ ] No vague "by standard theory" statements
- [ ] References match actual content (no hallucinated theorems!)

### Common Citation Errors to Avoid

| Error | Fix |
|-------|-----|
| ❌ "Use NU asymptotics" | ✅ "By NU Chapter II, §7, Eq. 19a..." |
| ❌ "Apply known result" | ✅ "By Szegő Theorem 8.21.8..." |
| ❌ "From the book" | ✅ "By Varshalovich et al. Ch. 4, Eq. 4.3.2..." |
| ❌ "Standard formula gives" | ✅ "The recurrence relation (NU Eq. 13.4) gives..." |
| ❌ "By page 87" (no context) | ✅ "By the auxiliary function method (NU II.7, p. 87)..." |
| ❌ Citing Szegő for NU content | ✅ Check which book actually contains the result |
| ❌ Missing year/edition | ✅ "Szegő (4th ed., 1975)" not just "Szegő" |

### Examples of Excellent Citations from Problem Collection

**Example 1: Multiple techniques with full citations**
```
Solution: 
Step 1 - Convert to Jacobi. Associated Legendre P_ℓ^{|m|}(x) can be 
expressed using Jacobi polynomials (NU Chapter II, §8): 
P_ℓ^{|m|}(x) = C_{ℓm}(1-x²)^{|m|/2} P_n^{(|m|,|m|)}(x) where n=ℓ-|m|.

Step 2 - Apply Stirling. The normalization constant involves 
Γ((ℓ+|m|+1))/Γ((ℓ-|m|+1)). By Stirling approximation (e.g., 
Whittaker & Watson, Modern Analysis, §12.33), this behaves as 
ℓ^{2|m|} for large ℓ.

Step 3 - Use Szegő asymptotics. By Szegő, Orthogonal Polynomials 
(4th ed., 1975), Theorem 8.21.8, the Darboux formula gives 
P_n^{(α,β)}(cos θ) = A(θ)n^{-1/2}cos((n+κ)θ + φ) + O(n^{-3/2})
uniformly for θ ∈ [ε, π-ε].

Step 4 - Apply Weyl. The oscillatory sum ∑cos((n+κ)θ) averages to 
zero by Weyl's equidistribution theorem (Stein & Shakarchi, 
Fourier Analysis, Chapter 6, Theorem 6.1).
```

**Example 2: Auxiliary function with page number**
```
We use the Nikiforov-Uvarov auxiliary function method 
(NU 1988, Chapter II, §7, pp. 85-88). For Legendre equation 
(1-x²)y'' - 2xy' + ℓ(ℓ+1)y = 0, construct auxiliary function
v(x) = [y(x)]² + ((1-x²)/(ℓ(ℓ+1)))[y'(x)]².

Taking derivative: v'(x) = (2x/(ℓ(ℓ+1)))[y'(x)]² which is positive 
for x ∈ (0,1), proving monotonicity.
```

**Example 3: Wigner function with equation number**
```
For the Wigner small d-function, we need the explicit formula for ℓ=1. 
By Varshalovich, Moskalev, and Khersonskii, Quantum Theory of Angular 
Momentum (1988), Chapter 4, Equation 4.3.2:

d_{01}^1(β) = -sin(β)/√2

This is explicitly non-zero for β ≠ 0,π, providing a counterexample 
to the claim.
```

### Why This Level of Citation Matters

1. **Prevents hallucination**: Specific eq/theorem numbers prevent inventing results
2. **Enables verification**: Readers can check details
3. **Shows mastery**: Deep knowledge of references, not superficial
4. **Helps learning**: Others know exactly where to look
5. **Professional standard**: Matches research paper quality
6. **Problem quality**: Forces creator to actually understand references

### Summary: Citation Requirements

**For every problem solution:**

✅ **Must have:**
- Full NU citations with Chapter, Section, Equation number
- Varshalovich citations for Wigner/rotation (when applicable)
- Multiple sources coordinated when techniques combined
- No vague "use standard theory" statements

✅ **Should have:**
- Page numbers for method descriptions
- Edition specification for multi-edition books (Szegő 4th ed.)
- Year for all references

✅ **May omit:**
- Page numbers for well-indexed equations
- Citations for elementary calculus

**The problems in your collection set the gold standard. This update codifies that standard explicitly.**

---

## Quick Reference: Common Citations

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

### Enhanced Creative Methods List

**The solution should involve at least one of:**

**From existing list:**
- Novel combination of standard techniques (e.g., Stirling + Szegő + Weyl equidistribution)
- Unexpected application of a theorem (e.g., Sturm theory for interlacing)
- Construction of auxiliary objects (energy functions, transforms, test functions)
- Geometric or physical intuition (rotation groups, quantum mechanics)
- Asymptotic analysis with careful error tracking (multiple scales, boundary layers)
- Representation changes (Jacobi polynomials, different bases)

**NEW - Add these creative techniques:**

**Technique 7: Dimension Counting & Linear Algebra Arguments**
- Using dimension of solution spaces to prove existence/uniqueness without explicit construction
- Counting: dim(polynomial space) - dim(constraints) = dim(solutions)
- Showing ansatz has correct dimension to span solutions
- Particularly powerful for modified weight orthogonality problems
- **Example**: For modified weight with pole, (n+1) dimensions minus (n-1) effective constraints equals 2D solution space spanned by {P_n, P_{n-1}}
- **References**: Linear algebra (dimension theorem), approximation theory (Chebyshev systems)
- **When to use**: Modified weight problems, proving sufficiency without construction, ansatz validation

**Technique 8: Subsequence Construction for Oscillatory Asymptotics**  
- When oscillatory asymptotics prevent uniform bounds, construct subsequence where oscillatory term aligns
- Identify phase: f_n(x) ~ A_n cos((n+κ)x + φ)
- Use density/Weyl: find subsequence {n_k} where phase ≈ 0 mod 2π
- Show amplitude doesn't decay fast enough on subsequence
- **Key insight**: L² averaging (Weyl) vs pointwise bounds (subsequence construction) are different!
- **Example**: Szegő asymptotics gives P_n ~ n^{-1/2}cos(...); with √n factor, can find subsequence where |P_n| ~ const → unbounded
- **References**: Weyl equidistribution, Hardy & Wright (number theory), Szegő (oscillatory asymptotics)
- **When to use**: Proving pointwise unboundedness despite L² convergence, oscillatory sum analysis

**Technique 9: North Pole Evaluation Strategy (Spherical Harmonics)**
- At north pole θ=0: Y_{ℓm}(0,φ) = √[(2ℓ+1)/(4π)] δ_{m,0}
- Sums over m collapse: ∑_m f(m)Y_{ℓm}(0,0) = f(0)√[(2ℓ+1)/(4π)]
- Provides immediate test of claimed identities
- Often reveals counterexamples quickly
- **Key insight**: Exploits maximal symmetry to reduce dimensionality
- **Example**: Modified sum ∑(-1)^m Y_{ℓm}Y̅_{ℓm} tested at poles reveals (-1)^ℓ factor for odd ℓ
- **References**: Standard spherical harmonics texts, Varshalovich (rotation matrices)
- **When to use**: Addition theorem variants, rotation problems, testing operator actions, finding counterexamples

**Technique 10: Decomposition at Poles for Principal Value Integrals**
- For integrals with poles: q(x) = q(β) + (x-β)r(x)
- Note: deg(r) = deg(q) - 1
- Integral splits: pole contribution + regular part
- ∫[f(x)q(x)/(x-β)]dx = q(β)∫[f/(x-β)]dx + ∫f(x)r(x)dx
- First term: principal value or residue
- Second term: regular (standard orthogonality applies)
- **Key insight**: Separates singular behavior from smooth behavior
- **Example**: Modified weight p̃(x) = p(x)/(x-β₁) with |β₁|>1; orthogonality to q reduces to one condition at pole plus automatic orthogonality to r
- **References**: Complex analysis (residue theory), distribution theory (principal value)
- **When to use**: Modified weights with rational singularities, Cauchy principal value problems, dimension counting with poles

---

### Technique Selection Guide

**When choosing creative techniques, consider:**

**For bounds/estimates:**
- NU envelope (Technique from existing: asymptotic analysis)
- Subsequence construction (NEW Technique 8) if proving unboundedness

**For modified orthogonality:**
- Dimension counting (NEW Technique 7) for solution space structure
- Pole decomposition (NEW Technique 10) for singularities outside domain

**For spherical harmonics:**
- North pole evaluation (NEW Technique 9) for quick tests
- Wigner functions (from existing: representation changes)
- Operator domain analysis (from existing: auxiliary objects)

**For growth rates:**
- Christoffel-Darboux + asymptotics (from existing: combinations)
- Weyl equidistribution (from existing: novel combinations)
- Subsequence construction (NEW Technique 8) if pointwise unbounded

**For recurrences:**
- Coefficient matching (standard)
- Index boundary analysis (relates to NEW Technique 7)
- Dimension counting for ansatz validation (NEW Technique 7)

---

### Detailed Technique Descriptions

#### NEW Technique 7: Dimension Counting & Linear Algebra Arguments

**Description**: Using linear algebra to prove existence and uniqueness without explicit construction

**Core Idea**:
```
Polynomial space:       dim(𝐏_n) = n+1
Orthogonality constraints:  n conditions
But some automatic from structure
Effective constraints:   n-1 (one absorbed by pole/structure)
Solution space:         (n+1) - (n-1) = 2 dimensions
Two-term ansatz:       {P_n, P_{n-1}} has dimension 2
Conclusion:            Ansatz spans solution space!
```

**When to use**:
- Modified weight orthogonality problems
- Proving sufficiency of conditions
- Showing ansatz spans solution space
- Avoiding explicit construction

**Method**:
1. Count dimensions of relevant polynomial spaces
2. Count number of orthogonality constraints
3. Identify automatic constraints (from standard orthogonality)
4. Compute: dim(solutions) = dim(space) - dim(effective constraints)
5. Show ansatz has matching dimension

**Example Application**:
```
Problem: Modified weight p̃(x) = p(x)/(x-β₁), |β₁|>1
Claim: (P̃_n, 1)_p̃ = 0 necessary and sufficient for full orthogonality

Solution via dimension counting:
- Space: deg ≤ n → dimension n+1
- Constraints: orthogonal to deg < n → need n constraints
- Decomposition: q = q(β₁) + (x-β₁)r where deg(r) ≤ n-2
- Orthogonality to r automatic (standard orthogonality, deg(r) < n-1)
- Only need: orthogonality at pole (q(β₁) term) → 1 constraint
- Effective constraints: n-1 (not n!)
- Solution space: (n+1) - (n-1) = 2 dimensions
- Two-term {P_n, P_{n-1}}: dimension 2
- Conclusion: Spans solution space → one condition suffices!
```

**Why creative**: 
- Avoids explicit computation
- Uses pure structure (dimension theorem)
- Proves existence without construction
- Not standard in special functions texts

**Educational value**: 
- Teaches linear algebra applies to analysis
- Dimension arguments powerful
- Understanding vs. computation

**References**:
- Linear algebra: dimension theorem, solution space structure
- Approximation theory: Chebyshev systems, Haar condition
- Functional analysis: kernel and image dimensions

---

#### NEW Technique 8: Subsequence Construction for Oscillatory Asymptotics

**Description**: Constructing subsequences where oscillatory terms align to prove pointwise unboundedness

**Core Idea**:
```
Asymptotic formula:    f_n(x) ~ A_n cos((n+κ)x + φ)
Phase advances:        (n+κ)x takes all values mod 2π
By Weyl/density:       can find n_k where phase ≈ 0 mod π
On subsequence:        |cos(·)| ≥ 1/2 uniformly
If A_n doesn't decay:  expression unbounded on {n_k}
```

**Contrast with L² behavior**:
- **L² (integral)**: Weyl → oscillations average to zero → convergence
- **Pointwise (sup)**: Subsequence → oscillations align → unbounded

**When to use**:
- Proving pointwise bounds don't hold
- Showing sup_{n} expression = ∞
- Oscillatory asymptotics (Szegő, NU interior)
- Distinguishing L² from pointwise behavior

**Method**:
1. Apply asymptotic formula (Szegő Theorem 8.21.8 or NU Chapter II, §7)
2. Identify oscillatory structure: cos((n+κ)θ + φ) or similar
3. Note phase advances linearly in n
4. Construct subsequence {n_k}:
   - Want: (n_k+κ)θ + φ ≡ 0 mod π
   - By density: such n_k exist (spaced roughly π/θ apart)
   - Or use: n_k = floor(mπ/θ - κ - φ/θ) for integer m
5. On subsequence: |cos(·)| ≥ c > 0 uniformly
6. Check amplitude: if A_{n_k} doesn't decay fast enough → unbounded

**Example Application**:
```
Problem: Is √n |P_n^{(α,β)}(cos θ)/d_n| uniformly bounded for θ∈[ε,π-ε]?

Solution via subsequence construction:
1. Szegő (Theorem 8.21.8): 
   P_n(cos θ) = A(θ)n^{-1/2}cos((n+1/2)θ - π/4) + O(n^{-3/2})
   
2. With normalization d_n ~ cn^{-1/2}, get:
   P_n/d_n ~ Cn^{-1/2}cos((n+1/2)θ - π/4) / n^{-1/2}
          = C cos((n+1/2)θ - π/4)
   
3. Factor √n gives:
   √n |P_n/d_n| ~ C√n |cos((n+1/2)θ - π/4)|
   
4. Phase: (n+1/2)θ - π/4 advances by θ each step
   
5. Construct subsequence:
   Want: (n_k+1/2)θ - π/4 ≈ 0 mod π
   Choose: n_k ≈ (mπ + π/4)/θ - 1/2 for integers m
   
6. On subsequence: |cos(·)| ≥ 1/√2
   
7. Therefore: √n_k |P_{n_k}/d_n| ≥ C√n_k/√2 → ∞
   
Conclusion: NOT uniformly bounded!
```

**Why creative**:
- Combines: asymptotics + number theory + harmonic analysis
- Non-obvious: "n^{-1/2} → 0" suggests convergence, but √n factor changes everything
- Requires understanding phase behavior (equidistribution)

**Educational value**:
- L² vs pointwise distinction fundamental
- Oscillatory behavior non-intuitive
- Weyl theorem both helps (L²) and hurts (can find bad subsequence)
- Connection: special functions + number theory

**References**:
- Szegő, *Orthogonal Polynomials*, Theorem 8.21.8 (Darboux)
- NU Chapter II, §7 (interior oscillatory formulas)
- Weyl equidistribution theorem
- Hardy & Wright, *Theory of Numbers* (equidistribution)
- Stein & Shakarchi, *Fourier Analysis* (oscillatory integrals)

---

#### NEW Technique 9: North Pole Evaluation Strategy

**Description**: Exploiting maximal symmetry at poles to simplify spherical harmonic expressions

**Core Idea**:
```
At north pole θ=0:
  Y_{ℓm}(0,φ) = √[(2ℓ+1)/(4π)] δ_{m,0}
  
For any sum over m:
  ∑_{m=-ℓ}^{ℓ} f(m) Y_{ℓm}(0,0) = f(0) √[(2ℓ+1)/(4π)]
  
Reduces 2D problem (θ,φ) to 0D evaluation!
```

**When to use**:
- Testing addition theorem variants
- Finding counterexamples quickly
- Proving operator identities
- Rotation problems
- Modified sum formulas

**Method**:
1. Write expression involving ∑_m ... Y_{ℓm}(θ,φ) ...
2. Evaluate at north pole: θ=0
3. Use: Y_{ℓm}(0,φ) = √[(2ℓ+1)/(4π)] δ_{m,0}
4. Sum collapses to single term (m=0)
5. Compare with claimed formula
6. If mismatch → claim is FALSE

**Example Application**:
```
Problem: Does modified sum S_ℓ = ∑_m (-1)^m Y_{ℓm}(θ₁,φ₁)Ȳ_{ℓm}(θ₂,φ₂)
         equal (2ℓ+1)/(4π) P_ℓ(-cos ω) for all ℓ≥1?

Solution via north pole:
1. Test at θ₁=θ₂=0:
   
2. Left side: 
   S_ℓ(0,0,0,0) = ∑_m (-1)^m Y_{ℓm}(0,0) Ȳ_{ℓm}(0,0)
                = ∑_m (-1)^m |Y_{ℓm}(0,0)|²
                = (-1)^0 |Y_{ℓ0}(0,0)|²  (only m=0 survives)
                = (2ℓ+1)/(4π)
   
3. Right side with ω=0:
   (2ℓ+1)/(4π) P_ℓ(-1) = (2ℓ+1)/(4π) (-1)^ℓ
   
4. Match requires: 1 = (-1)^ℓ
   
5. Fails for odd ℓ!

Conclusion: FALSE for odd ℓ
```

**Why creative**:
- Exploits geometry/symmetry maximally
- Immediate test without computation
- Reduces dimensionality dramatically
- Not standard approach in texts

**Educational value**:
- Learning to identify special points
- Exploiting symmetry
- Quick testing strategy
- Geometric intuition

**References**:
- Standard spherical harmonics texts
- Varshalovich (pole evaluations for Wigner functions)
- Representation theory (highest weight states)

---

#### NEW Technique 10: Pole Decomposition for Principal Value Integrals

**Description**: Decomposing integrand into pole residue plus regular part

**Core Idea**:
```
For pole at x=β:
  q(x) = q(β) + (x-β)r(x)
where:
  r(x) = [q(x) - q(β)]/(x-β)
  deg(r) = deg(q) - 1  (degree drops!)
  
Integral splits:
  ∫[f(x)q(x)/(x-β)]dx = q(β)∫[f/(x-β)]dx + ∫f(x)r(x)dx
                        ↑ principal value     ↑ regular!
```

**When to use**:
- Modified weights with rational singularities
- Cauchy principal value problems
- Dimension counting arguments
- Orthogonality under singular measures

**Method**:
1. Write: q(x) = q(β) + (x-β)r(x)
2. Check: deg(r) ≤ deg(q) - 1
3. Split integral into two parts
4. First part (q(β) term): principal value calculation
5. Second part (r term): regular integral, use standard orthogonality
6. Combine results

**Example Application**:
```
Problem: For modified weight p̃(x) = p(x)/(x-β₁) with |β₁|>1,
         is (P̃_n, 1)_p̃ = 0 sufficient for (P̃_n, q)_p̃ = 0 for all deg(q)<n?

Solution via pole decomposition:
1. Decompose: q(x) = q(β₁) + (x-β₁)r(x) where deg(r) ≤ n-2
   
2. Compute:
   (P̃_n, q)_p̃ = ∫P̃_n(x)q(x) p(x)/(x-β₁) dx
              = ∫P̃_n(x)[q(β₁) + (x-β₁)r(x)] p(x)/(x-β₁) dx
              = q(β₁)∫P̃_n(x)p(x)/(x-β₁) dx + ∫P̃_n(x)r(x)p(x) dx
              = q(β₁)(P̃_n, 1)_p̃ + (P̃_n, r)_p
   
3. First term: zero by assumption (P̃_n, 1)_p̃ = 0
   
4. Second term: r has deg ≤ n-2, and P̃_n = P_n + γP_{n-1}
   - (P_n, r)_p = 0 (standard orthogonality, deg(r) < n)
   - (P_{n-1}, r)_p = 0 (standard orthogonality, deg(r) ≤ n-2)
   - Therefore: (P̃_n, r)_p = 0
   
5. Result: (P̃_n, q)_p̃ = 0 for all deg(q) < n

Conclusion: Sufficient! (Dimension counting shows this is also necessary)
```

**Why creative**:
- Transforms singular → regular
- Separates contributions clearly  
- Makes dimension counting transparent
- Not standard in special functions

**Educational value**:
- Understanding how singularities affect integrals
- Connection: complex analysis (residues) + real analysis (principal value)
- Orthogonality under singular measures
- Pole contribution vs. smooth contribution

**References**:
- Complex analysis: residue theory
- Distribution theory: principal value definition
- Modified orthogonal polynomials: Szegő, Chapter 2
- Functional analysis: measures with singularities

---

### Summary of New Techniques

| Technique | When to Use | Key Insight | References |
|-----------|------------|-------------|------------|
| 7. Dimension Counting | Modified weights, ansatz validation | Solution space dimension = space - constraints | Linear algebra, approximation theory |
| 8. Subsequence Construction | Pointwise unboundedness, oscillatory | Can find subsequence where phase aligns | Weyl, Szegő, Hardy & Wright |
| 9. North Pole Evaluation | Spherical harmonics, testing claims | Maximal symmetry reduces dimension | Varshalovich, representation theory |
| 10. Pole Decomposition | Singular measures, principal value | Separate singular from regular | Complex analysis, distributions |

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


## Detailed Spherical Harmonics Domain Guide

Insert this new subsection after the domain tables and before "## 2. The Trap System":

### Detailed Domain: Spherical Harmonics & Angular Momentum Theory

**Why This Is Tier 1:**
The spherical harmonics domain has proven exceptionally rich for creating reasoning-first problems, with **19 high-quality problems** in current collection demonstrating viability. The domain naturally combines:
- **Representation theory** (rotation groups, basis changes)
- **Special functions** (associated Legendre, Ferrers functions)
- **Operator theory** (differential operators with singularities)
- **Geometric intuition** (poles, rotation, symmetry)

This multi-faceted structure creates abundant opportunities for problems requiring multiple connected insights.

**Core Mathematical Objects:**

1. **Spherical Harmonics**: Y_{ℓm}(θ,φ) on S²
   - Normalized: ∫_{S²} |Y_{ℓm}|² dΩ = 1
   - Orthogonality: (Y_{ℓm}, Y_{ℓ'm'}) = δ_{ℓℓ'}δ_{mm'}
   - Connection: Y_{ℓm}(θ,φ) = √[(2ℓ+1)/(4π)] √[(ℓ-m)!/(ℓ+m)!] P_ℓ^m(cos θ) e^{imφ}

2. **Associated Legendre Functions**: P_ℓ^m(x) on [-1,1]
   - Rodrigues formula: P_ℓ^m(x) = ((-1)^m)/(2^ℓ ℓ!) (1-x²)^{m/2} d^{ℓ+m}/dx^{ℓ+m}[(x²-1)^ℓ]
   - Relation to Jacobi: P_ℓ^{|m|}(x) ~ (1-x²)^{|m|/2} P_{n}^{(|m|,|m|)}(x) where n=ℓ-|m|
   - Three-term recurrence for fixed m

3. **Wigner D-functions**: D_{mm'}^{ℓ}(α,β,γ) = e^{-imα} d_{mm'}^ℓ(β) e^{-im'γ}
   - Rotation matrices: d_{mm'}^ℓ(β) for rotation by β about y-axis
   - At poles: d_{0m}^ℓ(β) ≠ 0 for m≠0 (common misconception!)
   - Orthogonality: ∫d_{mm'}^ℓ d_{m''m'''}^{ℓ'} sin β dβ = (2/(2ℓ+1)) δ_{ℓℓ'} δ_{mm''} δ_{m'm'''}

4. **Angular Momentum Operators**:
   - Raising: L₊ Y_{ℓm} = √[(ℓ-m)(ℓ+m+1)] Y_{ℓ,m+1}
   - Lowering: L₋ Y_{ℓm} = √[(ℓ+m)(ℓ-m+1)] Y_{ℓ,m-1}
   - Singularities at poles: (1/sin θ) factor in operator representation

5. **Ferrers Functions**: P_ℓ^m(z) for z ∈ ℂ \ ((-∞,-1] ∪ [1,∞))
   - Analytic continuation of associated Legendre
   - Branch cuts and argument behavior

**Key Mathematical Phenomena:**

1. **Pole Singularities** (Trap A + Trap I):
   - Weight sin θ → 0 as θ→0,π
   - Operators L_± contain 1/sin θ factors
   - Must distinguish: singularity in representation vs. domain restriction
   - Example: L₊ Y_{ℓm} well-defined at poles despite 1/sin θ in formula

2. **Rotation Group Structure** (Trap R + Trap C):
   - Rotating to pole: only Y_{ℓ0} component at θ=0
   - But d_{0m}^ℓ(β) ≠ 0 for m≠0 → counterintuitive results
   - Non-commutativity: rotation order matters
   - Basis changes: quantization axis selection

3. **Addition Theorems**:
   - Standard: ∑_m Y_{ℓm}(θ₁,φ₁) Ȳ_{ℓm}(θ₂,φ₂) = (2ℓ+1)/(4π) P_ℓ(cos ω)
   - Modified sums with (-1)^m factors break symmetry
   - Reproducing kernel: K_N(θ,θ') = ∑_{ℓ=0}^N ∑_m Y_{ℓm}(θ,φ)Ȳ_{ℓm}(θ',φ')
   - Growth behavior: K_N ~ N (linear) at interior points

4. **Christoffel-Darboux for Fixed m**:
   - Sum ∑_{ℓ=m}^N Θ_{ℓm}²(x₀) grows linearly: ~ cN
   - Requires: Jacobi connection + Szegő asymptotics + Weyl equidistribution
   - Multi-step reasoning connecting several areas

5. **Index Boundaries** (Trap S):
   - Recurrence coefficients vanish at ℓ=m
   - Two-term ansatz breaks at boundary indices
   - System becomes overdetermined

**Primary NU Coverage:**
- Associated Legendre via Jacobi polynomials (NU Chapter II, §8)
- Normalization constants with Γ functions
- Interior asymptotics (NU Chapter II, §7, Eq. 19)
- Boundary behavior and envelope estimates

**Additional Essential Reference:**
**Varshalovich, D.A., Moskalev, A.N., and Khersonskii, V.K., *Quantum Theory of Angular Momentum*, World Scientific, 1988.**

This is the **authoritative reference** for rotation matrices, Wigner functions, and angular momentum theory.

**Key sections:**
- **Chapter 4**: Wigner D-functions D_{mm'}^{ℓ}(α,β,γ)
- **Chapter 5**: Rotation matrices d_{mm'}^ℓ(β) 
  - Eq. 4.3.2: Explicit formulas for small ℓ
  - Tables: Numerical values for common angles
- **Chapter 8**: Clebsch-Gordan coefficients
- **Chapter 2**: Spherical harmonics Y_{ℓm} properties

**When to cite Varshalovich:**
- ✅ Wigner D-function or d-function problems
- ✅ Rotation matrix evaluations
- ✅ Angular momentum coupling
- ✅ Addition theorems with rotations
- ✅ Clebsch-Gordan coefficients

**Typical Problem Patterns:**

**Pattern SH-1: Operator Singularities at Poles**
```
Setup: L₊ operator = e^{iφ}(∂/∂θ + i cot θ ∂/∂φ)
Question: At θ=0, does lim_{θ→0} [(1/sin θ)(∂Y_{ℓm}/∂θ)]/Y_{ℓ,m+1} equal √[(ℓ-m)(ℓ+m+1)]?
Trap: I (operator domain) + A (pole singularity)
Technique: Distinguish 1/sin θ in definition vs. cot θ in operator
Insight: Source of singularity matters; operator domain vs. representation
```

**Pattern SH-2: Rotation to Pole**
```
Setup: Rotate Y_{ℓm} by angle β about y-axis
Question: Does F_{ℓm}(β) = lim_{θ→0} Ỹ_{ℓm}(θ,0;β) equal const·P_ℓ(cos β)·δ_{m,0}?
Trap: R (Wigner non-vanishing) + C (basis change)
Technique: d_{0m}^ℓ(β) evaluation, counterexample ℓ=1, m=1
Insight: "Only m'=0 survives" ≠ "only m=0 is non-zero"
References: Varshalovich Ch. 4, Eq. 4.3.2
```

**Pattern SH-3: Christoffel-Darboux Growth**
```
Setup: Sum K_N^{(m)}(x₀,x₀) = ∑_{ℓ=m}^N Θ_{ℓm}²(x₀)
Question: Does K_N grow like N²? Like N? Bounded?
Trap: E (oscillatory) + Q (subsequence)
Technique: Convert to Jacobi → Stirling → Szegő → Weyl equidistribution
Insight: Oscillatory asymptotics average to constant via Weyl → linear growth
References: NU II.7, Szegő Theorem 8.21.8, Weyl theorem
```

**Pattern SH-4: Addition Theorem Modifications**
```
Setup: Modified sum S_ℓ = ∑_m (-1)^m Y_{ℓm}(θ₁,φ₁) Ȳ_{ℓm}(θ₂,φ₂)
Question: Does S_ℓ = (2ℓ+1)/(4π) P_ℓ(-cos ω)?
Trap: L (parity) + technique (north pole evaluation)
Technique: Evaluate at θ₁=θ₂=0 where only m=0 survives
Insight: (-1)^m factor breaks even for odd ℓ: (-1)^ℓ ≠ 1 generally
```

**Pattern SH-5: Index Boundary in Recurrences**
```
Setup: Three-term recurrence for Θ_{ℓm}, two-term ansatz F_ℓ^m = Θ_{ℓm} - αΘ_{ℓ-2,m}
Question: Does two-term recurrence exist for all ℓ≥m+3?
Trap: S (index boundary) + H (recurrence obstruction)
Technique: Coefficient matching, test at ℓ=m+3 boundary
Insight: B_{m+1,m} → 0 makes system overdetermined
```

**Pattern SH-6: North Pole Evaluation Strategy**
```
Technique: At θ=0, Y_{ℓm}(0,φ) = √[(2ℓ+1)/(4π)] δ_{m,0}
Use: Simplifies any sum ∑_m f(m) Y_{ℓm}(0,0) = f(0)√[(2ℓ+1)/(4π)]
Application: Testing claimed identities, finding counterexamples
Strategy: Reduces 2D problem to 0D evaluation
```

**Pattern SH-7: Weighted Moment Integrals**
```
Setup: M_{ℓ,k} = ∫_0^π sin^{2k+1}θ ∑_m |Y_{ℓm}(θ,0)|² dθ
Question: Does M_{ℓ,k} = (2ℓ+1)/(4π) × [simple formula]?
Trap: F (normalization) + technique (addition theorem)
Technique: Use addition theorem to collapse sum, evaluate integral
Insight: Beta functions with half-integers, not simple factorials
```

**Pattern SH-8: Rodrigues at Boundary**
```
Setup: P_ℓ^m(x_ε) where x_ε = 1-ε, normalize by Q_ℓ^m(ε) = ε^{m/2}|P_ℓ^m(x_ε)|
Question: Is Q_ℓ^m(ε) uniformly bounded for ε∈(0,1/2)?
Trap: P (Rodrigues boundary) + A (boundary behavior)
Technique: Rodrigues formula, track (1-x)^{m/2} factor cancellation
Insight: Weight vanishing balanced by derivative growth
```

**Why Spherical Harmonics Enable Tier 1 Problems:**

1. **Natural Multi-Area Connections**:
   - Representation theory (rotations, basis changes)
   - Special functions (Legendre, Jacobi connections)
   - Operator theory (L_±, singularities)
   - Harmonic analysis (addition theorem, Weyl)
   - Geometry (poles, symmetry)

2. **Rich Trap Combinations**:
   - A+I: Poles + operators
   - R+C: Rotation matrices + basis changes
   - E+Q: Oscillatory + subsequences
   - S+H: Index boundary + recurrence
   - P+A: Rodrigues + boundary

3. **Deep Reasoning Required**:
   - Can't solve by formula lookup
   - Must understand WHY formulas apply
   - Multiple insights needed
   - Connections not obvious

4. **Educational Value**:
   - Appears in physics (quantum mechanics)
   - Appears in geophysics (Earth's field)
   - Appears in numerical analysis (sphere)
   - Generalizes to other Lie groups

**Spherical Harmonics Workflow:**

**Step 1**: Choose mathematical question:
- Operator action at singularities?
- Rotation behavior?
- Sum growth rates?
- Addition theorem variants?
- Recurrence at boundaries?

**Step 2**: Determine techniques needed:
- From NU: Jacobi connection, asymptotics, bounds
- From Varshalovich: Wigner functions, rotation matrices
- From harmonic analysis: Weyl, oscillatory sums
- From operator theory: domains, functional analysis

**Step 3**: Identify natural traps:
- Poles (A), operators (I), rotation (R), index boundary (S), etc.

**Step 4**: Cite appropriately:
- NU for Legendre/Jacobi properties
- Varshalovich for Wigner/rotation
- Szegő for asymptotics
- Standard references for basic definitions

**Spherical Harmonics Success Metrics:**

A spherical harmonics problem is excellent if:
- ✅ Requires 3+ connected insights
- ✅ Uses both NU and Varshalovich (or equivalents)
- ✅ Involves pole/singularity analysis
- ✅ Tests understanding of rotation/representation theory
- ✅ Natural trap emergence
- ✅ Generalizable insights

**Common Pitfalls to Avoid:**

❌ Pure calculation: "Evaluate ∫Y_{32}Y_{31}dΩ"
❌ Trivial north pole: "Does Y_{ℓm}(0,0) = 0 for m≠0?" (too obvious)
❌ Just checking values: "Compute d_{01}^1(π/2)"
✅ Deep question: "Why does operator L₊ remain bounded at poles despite 1/sin θ?"
✅ Representation theory: "After rotation, does pole evaluation vanish for m≠0?"
✅ Multi-step: "Prove kernel growth is linear using Jacobi→Szegő→Weyl"

---

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


#### Trap O: Dimension Counting & Solution Space Structure
**Concept**: Solution space dimension arguments force specific ansatz structures

**Mechanism**: 
- For modified weight ṗ(x) = p(x)/(x-β₁) with |β₁|>1, orthogonality to polynomials of degree <n creates (n-1) conditions
- Two-term ansatz P̃ₙ = Pₙ + γPₙ₋₁ with standard weight p(x) automatically satisfies orthogonality to degree ≤(n-2)
- Dimension counting: (n+1) dimensions minus (n-1) constraints equals 2 degrees of freedom
- Therefore two-term ansatz spans the solution space

**Domain Adaptations**:
- jacobi: Modified weights (1-x)^α(1+x)^β/(x-β₁)
- legendre: Cauchy principal value weights
- laguerre: Rational weight modifications x^α e^{-x}/(x-γ)
- hermite: Polynomial × Gaussian modifications

**Pattern**: "Condition C is necessary and sufficient for full orthogonality"

**When it emerges**:
- Modified weight problems with rational modifications
- Ansatz constructions for orthogonal systems
- Proving necessity and sufficiency conditions
- Two-term vs three-term ansatz questions

**Solution technique**:
1. Decomposition: Write q(x) = q(β₁) + (x-β₁)r(x) where deg(r) ≤ n-2
2. Show orthogonality to r is automatic from standard orthogonality  
3. Dimension analysis: (n+1) - (n-1) = 2 dimensional solution space
4. Conclude two-term ansatz {Pₙ, Pₙ₋₁} spans this space

**Why it's a trap**: Naive approach tries to verify all (n-1) conditions separately. The insight is recognizing that most conditions are automatic and dimension counting proves sufficiency.

**Educational value**: Teaches linear algebra perspective on orthogonal polynomial theory—not just analysis! Shows how dimensional arguments can prove existence without explicit construction.

**Reasoning depth**: ⭐⭐⭐ (requires linear algebra + analysis + understanding of orthogonality structure)

**Related traps**: 
- Different from Trap B (parameter edge cases): This is about solution space dimension, not boundary values
- Different from Trap H (index shift): This is about dimension matching, not recurrence boundary

**References**:
- Linear algebra textbooks (dimension theorem)
- Approximation theory (Chebyshev systems)
- Modified orthogonal polynomial theory

**Example problems**:
- "For modified weight ṗ(x)=p(x)/(x-β₁), prove (P̃ₙ,1)_ṗ=0 is necessary and sufficient for (P̃ₙ,q)_ṗ=0 for all deg(q)<n"
- "Does two-term ansatz span all polynomials orthogonal to 𝐏_{n-2} under modified weight?"

---

#### Trap P: Rodrigues Formula Boundary Behavior
**Concept**: Understanding how Rodrigues formulas behave as variables approach boundary values

**Mechanism**:
- Rodrigues formula: P_ℓ^m(x) = ((-1)^m)/(2^ℓ ℓ!) (1-x²)^{m/2} d^{ℓ+m}/dx^{ℓ+m}[(x²-1)^ℓ]
- Near boundary x→1: factor (1-x²)^{m/2} → 0 but derivatives may blow up
- Competing behaviors: weight factor vanishing vs derivative growth
- Correct normalization by (1-x)^{m/2} reveals whether function stays bounded

**Domain Adaptations**:
- Associated Legendre: P_ℓ^m(x) near x=±1
- Hermite: e^{x²/2} d^n/dx^n[e^{-x²}] as |x|→∞
- Laguerre: e^x x^{-α} d^n/dx^n[x^{n+α}e^{-x}] at x=0 or x→∞
- Chebyshev: Rodrigues form near x=±1

**Pattern**: "For x_ε = 1-ε, the normalized quantity Q_ℓ^m(ε) = ε^{m/2}|P_ℓ^m(x_ε)| is bounded"

**When it emerges**:
- Boundary behavior of special functions
- Normalization questions near singularities
- Understanding weight factors in representations
- Boundary conditions for PDEs

**Solution technique**:
1. Write Rodrigues formula explicitly
2. Expand (x_ε²-1) = (x_ε-1)(x_ε+1) ≈ -ε(2) near boundary
3. Count powers: (1-x_ε)^{m/2} = ε^{m/2} cancels leading singularity from derivatives
4. Track remaining terms carefully

**Why it's a trap**: Naive approach sees (1-x²)^{m/2}→0 and thinks function vanishes at boundary. Must track competing factors in Rodrigues formula—weight vanishes but derivatives grow.

**Educational value**: Understanding Rodrigues representations isn't just about existence—must understand boundary behavior for applications (boundary conditions in PDEs, regularity theory). Teaches how to track competing singularities.

**Reasoning depth**: ⭐⭐⭐ (requires asymptotic analysis + careful tracking of derivative orders + boundary layer analysis)

**Related traps**:
- Related to Trap A (boundary singularity): But focuses specifically on Rodrigues formula structure
- Different from Trap M (asymptotic boundary): This is about exact formula behavior, not asymptotic approximation

**References**:
- Nikiforov-Uvarov (Rodrigues formulas throughout)
- Szegő, *Orthogonal Polynomials* (Chapter 4, boundary behavior)

**Example problems**:
- "For P_ℓ^m near x=1, does normalization ε^{m/2}|P_ℓ^m(1-ε)| remain bounded for all ℓ≥1, m≤ℓ?"
- "At what rate does Hermite polynomial H_n(x) grow as x→∞?"

---

#### Trap Q: Subsequence Construction for Unboundedness
**Concept**: Constructing subsequences where oscillatory terms align to prove unboundedness

**Mechanism**:
- Asymptotic formula has oscillatory term: f_n(x) ~ A_n cos((n+κ)θ + φ)
- Phase (n+κ)θ advances linearly in n
- Can find subsequence {n_k} where |(n_k+κ)θ + φ - 2πm| < δ for some integer m
- On this subsequence, |cos(·)| ≥ 1/2 uniformly
- If amplitude A_n doesn't decay fast enough, expression unbounded on subsequence

**Domain Adaptations**:
- Jacobi: Szegő-Darboux asymptotics P_n^{(α,β)}(cos θ) = An^{-1/2}cos((n+κ)θ+φ) + O(n^{-3/2})
- Legendre: Interior oscillatory formula
- Spherical harmonics: Associated Legendre with large ℓ
- Bessel: J_ν(νx) with oscillatory behavior

**Pattern**: "The quantity √n |P_n(cos θ)/d_n| is uniformly bounded for θ∈[ε,π-ε]"

**When it emerges**:
- Proving bounds are NOT uniform
- Pointwise vs L² distinction
- Oscillatory asymptotics (Szegő, NU interior formulas)
- When naive substitution suggests boundedness but oscillations prevent it

**Solution technique**:
1. Apply asymptotic formula (e.g., Szegő Theorem 8.21.8 or NU Chapter II, §7)
2. Identify oscillatory structure: cos((n+κ)θ + φ) or sin(...)
3. Note phase advances linearly: (n+κ)θ takes all values mod 2π as n varies
4. By density (or Weyl equidistribution): find n_k where (n_k+κ)θ + φ ≡ 0 mod π
5. On subsequence: |cos(·)| ≥ 1/√2 (or similar bound)
6. Check if A_n decay compensates: √n · n^{-1/2} = const → UNBOUNDED

**Why it's a trap**: Naive approach sees "n^{-1/2} → 0" and concludes boundedness. Must recognize oscillations don't average out for pointwise bounds—can always find subsequence where oscillations align constructively.

**Educational value**: Teaches crucial distinction between:
- L² convergence (oscillations average to zero in integral—Weyl applies)
- Pointwise bounds (oscillations can keep function large on subsequences)
- Uniform vs. non-uniform asymptotics
- When equidistribution helps vs. when it creates problems

**Reasoning depth**: ⭐⭐⭐ (requires asymptotics + number theory (phase equidistribution) + harmonic analysis + careful amplitude tracking)

**Related traps**:
- Different from Trap E (oscillatory cancellation): Trap E is about sums/integrals where oscillations cancel. Trap Q is about pointwise bounds where oscillations don't average
- Different from Trap M (multiple regimes): Trap M is about formula validity. Trap Q uses valid formula but constructs subsequence within valid regime

**References**:
- Szegő, *Orthogonal Polynomials* (4th ed., 1975), Theorem 8.21.8 (Darboux asymptotics)
- Nikiforov-Uvarov, Chapter II, §7 (interior oscillatory formulas)
- Weyl equidistribution theorem
- Hardy & Wright, *Introduction to the Theory of Numbers* (equidistribution)

**Example problems**:
- "For Jacobi P_n^{(α,β)}(cos θ) with θ∈[ε,π-ε], prove or disprove: √n|P_n/d_n| uniformly bounded"
- "Does sup_{n≥1} √n|Y_{n0}(θ,0)| < ∞ for fixed θ∈(0,π)?"

---

#### Trap R: Wigner d-function / Rotation Matrix Non-Vanishing
**Concept**: Common misconception about which spherical harmonic components survive under rotation

**Mechanism**:
- Rotating spherical harmonic: Ỹ_{ℓm}(θ,φ;β) = ∑_{m'=-ℓ}^{ℓ} d_{m'm}^{ℓ}(β) Y_{ℓm'}(θ,φ)
- At north pole (θ=0): Y_{ℓm'}(0,φ) = √[(2ℓ+1)/(4π)] δ_{m',0}
- Therefore: Ỹ_{ℓm}(0,0;β) = d_{0m}^{ℓ}(β) √[(2ℓ+1)/(4π)]
- **KEY INSIGHT**: d_{0m}^{ℓ}(β) ≠ 0 for m≠0 in general!
- Common error: "Only m'=0 component survives at pole, so result should be δ_{m,0}"

**Domain Adaptations**:
- Spherical harmonics: Rotation to poles
- Wigner D-functions: D_{m'm}^{ℓ}(α,β,γ) evaluation
- Clebsch-Gordan coefficients: Angular momentum coupling
- Addition theorems with rotation

**Pattern**: "After rotation by β, evaluation at north pole F_{ℓm}(β) = [expression with δ_{m,0}]"

**When it emerges**:
- Rotation problems for spherical harmonics
- Wigner D-function evaluations
- Addition theorems with modified sums ((-1)^m factors)
- Angular momentum coupling at special geometries

**Common misconception**: "Only m'=0 component survives at pole" is correct, but this doesn't mean "only m=0 is non-zero" in the final result. The sum over m' collapses, but the original m index remains in d_{0m}^{ℓ}(β).

**Solution technique**:
1. Write rotation formula with Wigner d-functions
2. Evaluate at north pole: only m'=0 term survives
3. Result contains d_{0m}^{ℓ}(β)
4. Counterexample: For ℓ=1, m=1: d_{01}^{1}(β) = -sin(β)/√2 ≠ 0
5. Formula with δ_{m,0} factor is FALSE

**Why it's a trap**: Notation and indices are confusing. Understanding which index is summed over (m') vs. which remains free (m) is subtle. The claim "only m'=0 survives" is about the summation index, not about which values of m give non-zero results.

**Educational value**: 
- Understanding rotation group representation theory
- Careful tracking of indices in sums (summation index vs. free index)
- Wigner d-functions are non-diagonal matrices
- Group theory: rotations mix components non-trivially

**Reasoning depth**: ⭐⭐⭐ (requires representation theory + group theory + careful index tracking + understanding of Wigner functions)

**Related traps**:
- Related to Trap C (basis mismatch): Both involve coordinate/basis changes, but Trap R specifically about rotation matrices
- Different from Trap I (operator domain): This is about representation theory, not operator singularities

**References**:
- Varshalovich, Moskalev, Khersonskii, *Quantum Theory of Angular Momentum* (1988)
  - Chapter 4: Wigner D-functions
  - Chapter 5: Rotation matrices d_{mm'}^{ℓ}
  - Equation 4.3.2: Explicit formulas for small ℓ
- Edmonds, *Angular Momentum in Quantum Mechanics*

**Example problems**:
- "After y-axis rotation by β, does F_{ℓm}(β) = lim_{θ→0} Ỹ_{ℓm}(θ,0;β) equal √[(2ℓ+1)/(4π)]P_ℓ(cos β)·δ_{m,0}?"
- "For addition theorem ∑_m (-1)^m Y_{ℓm}(θ₁,φ₁)Ȳ_{ℓm}(θ₂,φ₂), does north pole evaluation give (2ℓ+1)/(4π)·P_ℓ(-cos ω)?"

---

#### Trap S: Index Boundary in Recurrence Relations
**Concept**: Recurrence relation coefficients vanish or become singular at index boundaries, breaking the recursion

**Mechanism**:
- Three-term recurrence: x Θ_{ℓm}(x) = A_{ℓm} Θ_{ℓ+1,m}(x) + B_{ℓm} Θ_{ℓ-1,m}(x)
- Coefficients depend on (ℓ,m): often A_{ℓm} ~ √[(ℓ-m)(ℓ+m)], B_{ℓm} ~ √[(ℓ-m+1)(ℓ+m+1)]
- At boundary ℓ=m: coefficient B_{m,m} → 0
- Two-term ansatz F_ℓ^m = Θ_{ℓm} - α_{ℓm} Θ_{ℓ-2,m} requires coefficient matching
- At ℓ=m+3 boundary, coefficient B_{ℓ-2,m} = B_{m+1,m} approaches zero
- System becomes overdetermined (3 equations, 2 unknowns) due to vanishing coefficients

**Domain Adaptations**:
- Associated Legendre: Index ℓ approaching m
- Spherical harmonics: Y_{ℓm} with ℓ→m
- General orthogonal polynomials: Recurrence at boundary indices
- Bessel: J_{ν+n} with ν approaching special values

**Pattern**: "For all ℓ≥m+k, the two-term recurrence xF_ℓ^m = C_{ℓm}F_{ℓ+1}^m + D_{ℓm}F_{ℓ-1}^m exists"

**When it emerges**:
- Modified recurrence relations with two-term ansatz
- Index boundary effects in orthogonal systems
- Trying to eliminate terms in recurrences
- Coefficient analysis near boundaries

**Solution technique**:
1. Write two-term ansatz: F_ℓ^m = Θ_{ℓm} - α_{ℓm} Θ_{ℓ-2,m}
2. Expand xF_ℓ^m using three-term recurrence
3. Match coefficients to eliminate Θ_{ℓ-2,m} terms
4. System: A_{ℓm} = C_{ℓm}A_{ℓ+1,m} and B_{ℓm} = D_{ℓm}B_{ℓ-1,m} + C_{ℓm}B_{ℓ+1,m}α_{ℓ+1}
5. Test at boundary ℓ=m+3 where B_{ℓ-2,m} = B_{m+1,m} → 0
6. Show system overdetermined: more constraints than unknowns

**Why it's a trap**: The claim "for all ℓ≥m+k" suggests uniformity. The boundary case ℓ=m+k is special because lower-index coefficients vanish. The recurrence structure changes fundamentally at the boundary, not just quantitatively.

**Educational value**:
- Understanding recurrence relations have validity domains
- Index boundaries create structural changes, not just special values
- Coefficient analysis reveals when systems become singular
- Distinguishing uniform validity from almost-everywhere validity

**Reasoning depth**: ⭐⭐⭐ (requires recurrence relation theory + linear algebra (overdetermined systems) + boundary analysis + coefficient structure understanding)

**Related traps**:
- Different from Trap B (parameter edge cases): Trap B is about parameter values (ν=0) where formula undefined. Trap S is about index boundaries (ℓ→m) where recurrence structure breaks
- Different from Trap H (index shift obstruction): Trap H is about n-k term undefined at n=k. Trap S is about coefficient vanishing creating overdetermined system
- Related to Trap A (boundary): But specifically about recurrence coefficient structure

**References**:
- Recurrence relation theory for orthogonal polynomials
- Nikiforov-Uvarov (recurrence relations throughout)
- Gautschi, *Orthogonal Polynomials: Computation and Approximation*

**Example problems**:
- "For Θ_{ℓm} with three-term recurrence, define F_ℓ^m = Θ_{ℓm} - α_{ℓm}Θ_{ℓ-2,m}. Does two-term recurrence xF_ℓ^m = CF_{ℓ+1}^m + DF_{ℓ-1}^m exist for all ℓ≥m+3?"
- "At what minimum index ℓ can two-term recurrence for F_ℓ^m be established for associated Legendre functions?"

---

## Updated Overview Table

Add these rows to the trap overview table:

| Code | Name | What It Exploits | Best Domains | Reasoning Depth |
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
