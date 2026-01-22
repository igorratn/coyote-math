# **Updated Requirements: Creating Successful "Stumble" Problems**

## **Core Philosophy**
Create problems that **look simple but hide a trap** - they should appear to yield to standard techniques but require a crucial insight to avoid error.

---

## **1. Problem Creation Goals**

### **Source & Uniqueness**
* **Source**: Chapter 10 (Spherical Harmonics) from Nikiforov-Uvarov
* **Uniqueness**: Check against all.md and the Spherical Harmonics cluster to avoid duplication
* **Type**: Reasoning-heavy (insight-based), NOT "knowledge retrieval" or "plug-and-play"

### **The Analytical Bridge Requirement**
Problems must require connecting **two or more distinct properties** across different mathematical domains:
- Geometric symmetry ↔ algebraic representation
- Local behavior (pointwise) ↔ global behavior (L² or integral)
- One basis/coordinate system ↔ another basis/coordinate system
- Asymptotic behavior ↔ finite sum/integral behavior

**Anti-pattern**: Direct substitution into a known identity

---

## **2. The "Stumble Layer" - Six Trap Mechanisms**

Every problem must exploit **at least one** (preferably 2-3 combined) of these cognitive traps:

### **Trap A: Boundary/Pole Singularity**
**What it exploits**: Models mishandle limits at θ=0, π where differential operators degenerate

**Implementation patterns**:
- Force analysis at poles where sin θ → 0 or cos θ → ±1
- Use operators containing 1/sin θ, ∂/∂θ, or weighted norms with (sin θ)^α
- Require careful L'Hôpital or asymptotic expansion near singularities
- Make the claim's validity **depend on pole behavior**

**Example from cluster**: 
- 16ab09af: Monotonicity as θ→0 (pole approach)
- eea363eb: Bound with (sin θ)^|m|+δ - singular at poles

---

### **Trap B: Parity/Index-Dependent Validity**
**What it exploits**: Models assume global validity when truth depends on discrete index properties

**Implementation patterns**:
- Claim holds for **even ℓ** but fails for **odd ℓ** (or vice versa)
- Claim holds for "all n ≥ k" but fails **exactly at n=k** or k+1
- Depends on whether m is even/odd, or on |m| vs ℓ relationships
- Use (-1)^m, (-1)^ℓ, or (-1)^(ℓ+m) factors that create parity sensitivity

**Example from cluster**:
- 27ff7bd2: (-1)^m sum - true only for even ℓ
- 1180dd83: Fails at n=2 specifically, works for n≥3

**Key**: The "failure case" must be **isolated** and require explicit verification

---

### **Trap C: Basis/Quantization Axis Mismatch**
**What it exploits**: Models fail to properly transform between different angular momentum bases

**Implementation patterns**:
- Mix eigenstates from different quantization axes (z-axis vs tilted axis)
- Use Wigner D-functions with swapped indices: d_{m,m'}^ℓ vs d_{m',m}^ℓ
- Rotate coordinates: θ,φ → θ',φ' and ask about invariance
- Combine operators diagonal in different bases
- Use addition theorem with non-standard angle arguments

**Example from cluster**:
- 339da8e1: d_{m,0}^ℓ(β)d_{0,m}^ℓ(β) weighted sum
- 93f8b201: Recurrence connecting (ℓ,m) ↔ (ℓ-1,m)

**Key**: Force explicit basis transformation, don't let symmetry arguments shortcut

---

### **Trap D: Pointwise vs Global/Integral Validity**
**What it exploits**: Models confuse pointwise equality with L², integral, or measure-theoretic equality

**Implementation patterns**:
- Claim holds in L²(S²) but fails pointwise at specific angles
- Identity true "almost everywhere" but false on a discrete set
- Integral formula appears true but pointwise values differ
- Convergence in norm vs pointwise convergence mismatch

**Example construction**:
"The sum $\sum_{m=-\ell}^{\ell} |Y_{\ell m}(\theta,\phi)|^2$ equals a constant for all (θ,φ) ∈ S²"
(True in L² sense after integration, but pointwise it varies)

**Key**: Make the claim **ambiguous** about which notion of equality applies

---

### **Trap E: Oscillatory Cancellation in Sums/Integrals**
**What it exploits**: Models miss asymptotic cancellations that require Riemann-Lebesgue, Weyl equidistribution, or stationary phase

**Implementation patterns**:
- Sum ∑_{ℓ=m}^N f(ℓ) where f(ℓ) oscillates like cos(ℓθ₀ + φ)
- Integral appears to diverge but oscillations cause cancellation
- Claim about growth rate: "grows like N²" when actually O(N) or O(√N)
- Requires recognizing trigonometric sum identities

**Example from cluster**:
- 85ca892d: K_N ~ N (linear) requires proving ∑cos²(ℓθ) has oscillatory terms that vanish

**Key**: Make the "naive" estimate seem correct; the cancellation must be **non-obvious**

---

### **Trap F: Scaling/Normalization Factor Errors**
**What it exploits**: Models get the structure right but miss constant factors

**Implementation patterns**:
- Operator is projection **up to a constant** (not idempotent)
- Normalization constant depends on ℓ, m in non-obvious way
- Formula correct except for factor like (2ℓ+1)/4π
- Orthogonality holds with wrong weight constant

**Example from cluster**:
- 842d9e3e: T_ℓ = (4π/(2ℓ+1))·P_ℓ is scaled projection, not true projection

**Key**: The structural form must be **correct enough** to pass shallow inspection

---

## **3. Combining Traps (Most Potent)**

The strongest problems combine **2-3 traps simultaneously**:

### **Combination Examples**:

**A + B**: Singularity at pole + parity dependence
- "Limit as θ→0 of [expression] equals [value] for all ℓ"
- Actually depends on whether ℓ is even/odd

**B + C**: Parity dependence + basis mismatch  
- Rotation formula with (-1)^m factor
- True for specific rotation angles, false for others

**C + D**: Basis mismatch + pointwise vs global
- "After rotation, Y_ℓm(θ',φ') = [formula]"
- True in L² but pointwise equality requires extra phase

**D + E**: Global vs local + oscillatory cancellation
- "Average of |Y_ℓm|² over S² equals ..."
- Integral is constant but pointwise oscillates

**E + F**: Cancellation + normalization
- Sum has correct growth rate but wrong constant
- ∑ ~ C·N where naive calculation gives wrong C

---

## **4. Problem Structure Template**

### **Setup (Spacy Layout)**
```
Let [define spherical harmonics with specific normalization]

Let [define auxiliary object: operator, kernel, modified weight, etc.]

For [specify parameter ranges, including boundary cases]
```

### **The Claim (Strategic Ambiguity)**
```
Claim

[State assertion that:]
- Sounds plausible
- Has a "trap" hidden in one of the 6 mechanisms
- Requires distinguishing between similar concepts
- Cannot be verified by direct substitution

Determine with rigorous proof whether the claim is True or False.
```

### **Trap Indicators to Include**:
- "for all ℓ ≥ 1" or "for all n ≥ 2" (test boundary)
- "equals" without specifying pointwise vs L² (ambiguity)
- Limits as θ→0 or θ→π (poles)
- Sums or integrals over angular momenta (oscillations)
- Rotation/transformation formulas (basis mismatch)
- Normalization constants involving factorials (scaling traps)

---

## **5. Solution Structure**

### **Natural Flow Requirements**:
- No section headers ("Proof:", "Step 1:", etc.)
- Start with establishing context/setup
- Build toward the key insight through logical steps
- **The trap should be addressed explicitly** (this is where models fail)
- Conclude with the result

### **Critical Element - The "Stumble Point"**:
The proof must have a **turning point** where the naive approach fails:

**Bad (no stumble)**:
"Substituting the recurrence relation gives ... Therefore the claim is true."

**Good (has stumble)**:
"At first glance, the formula appears valid by symmetry. However, evaluating at the north pole θ=0 reveals that the sum reduces to only the m=0 term. For this term, the factor (-1)^m equals 1, but the claim requires ... This discrepancy occurs precisely when ℓ is odd, as..."

---

## **6. Verification Checklist**

Before finalizing a problem, verify:

- [ ] Uses at least ONE trap mechanism (A-F)
- [ ] Preferably combines 2-3 traps
- [ ] Cannot be solved by direct substitution into known identities
- [ ] Requires connecting two different mathematical domains
- [ ] The "failure point" is isolated and non-obvious
- [ ] Claim has strategic ambiguity or boundary case dependence
- [ ] Solution explicitly addresses the stumble point
- [ ] No duplication with existing problems in cluster
- [ ] Follows publication-style formatting
- [ ] Uses proper KaTeX, grammar, and spacing

---

## **7. Anti-Patterns (What NOT to Do)**

❌ **Plug-and-play**: "Evaluate ∫₀^π P_ℓ(cos θ)P_k(cos θ)sin θ dθ"
✓ **Better**: Make orthogonality depend on a modified weight that breaks standard formulas

❌ **Pure calculation**: "Show that [long expression] simplifies to [result]"
✓ **Better**: "Does [long expression] equal [result] for all ℓ?" with parity trap

❌ **Obvious boundary case**: "The limit as θ→0 of sin θ equals 0"
✓ **Better**: "The limit as θ→0 of [ratio with sin θ in denominator] equals..."

❌ **Unmotivated complexity**: Random combination of special functions
✓ **Better**: Each element serves the trap mechanism

---

## **8. Target Difficulty**

The problem should:
- Be **solvable** by a careful mathematician in 15-30 minutes
- **Appear simpler** than it is on first reading
- Cause an AI model to either:
  - Make a confident wrong answer (fallen into trap)
  - Require multiple attempts/corrections
  - Need explicit boundary case checking
  - Miss the crucial distinction (pointwise vs global, etc.)

**Success metric**: "Would this fool at least 1 out of 3 capable models?"