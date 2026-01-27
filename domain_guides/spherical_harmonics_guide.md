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
