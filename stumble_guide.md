# Domain-Agnostic "Stumble" Problem Generator: Core Guide
# Version 3.3 - Modular Organization Edition
# Updated: 2026-01-27

## Updates in v3.3:
- **Modular structure:** Domain guides separated into [`domain_guides/`](domain_guides/)
- **Problem clustering:** Methodology analysis in [`problem_clusters/`](problem_clusters/)
- **Streamlined core:** Main guide focuses on philosophy, traps, and workflow
- **Better navigation:** Clear links between all documents

---

## Quick Navigation

- **Creating problems?** → Read this file (core philosophy, traps, workflow)
- **Need domain specifics?** → See [`domain_guides/`](domain_guides/) (mathematical references)
- **Analyzing problems?** → See [`problem_clusters/`](problem_clusters/) (methodology clustering)
- **View all problems?** → See [`all.md`](all.md) (master list)

---

## Core Philosophy

Create problems that **require deep mathematical reasoning** to solve, where traps serve as gatekeepers that prevent shortcuts and force engagement with the underlying structure. The best problems combine:

1. **Genuine mathematical depth** - multiple connected insights required
2. **Creative techniques** - novel combinations or unexpected applications
3. **Natural traps** - emerge organically from the mathematics
4. **Educational value** - teach important distinctions that generalize

**Key principle:** Reasoning first, traps second. The trap prevents lazy approaches but rewards genuine understanding.

---

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
1. **Direct citation:** Reference specific theorems, equations, and page numbers
2. **Technique application:** Use NU methods as the "creative technique" in reasoning-first problems
3. **Verification:** Check claims against NU formulas to design trap mechanisms
4. **Solution style:** Follow NU's rigorous style - clear notation, explicit steps, theorem citations

**Alternative references** (when NU doesn't cover topic):
- Szegő, *Orthogonal Polynomials* (asymptotics, Jacobi/Legendre specific results)
- Varshalovich, Moskalev, Khersonskii, *Quantum Theory of Angular Momentum* (Wigner functions, Clebsch-Gordan)
- Watson, *Theory of Bessel Functions* (Bessel-specific results)
- Abramowitz & Stegun / NIST DLMF (formula verification)

---

## Enhanced Citation Guidelines

### Mandatory Citation Format

**❌ BAD - Vague:**
```
"Use Nikiforov-Uvarov asymptotics"
"Apply the standard bound"
"By known theorem"
```

**✅ GOOD - Specific:**
```
"By Nikiforov-Uvarov (1988), Chapter II, §7, inequality (19a)..."
"Apply Szegő, Orthogonal Polynomials (4th ed., 1975), Theorem 8.21.8..."
"Using Varshalovich et al. (1988), Chapter 4, Equation 4.3.2..."
```

**Required components:**
1. ✅ Author(s) and publication year
2. ✅ Chapter or section number
3. ✅ Equation/Theorem/Inequality number
4. ✅ Page number (when possible)

### Citation Levels by Content Type

**Level 1: Core Results (ALWAYS cite with full details)**
- Asymptotic formulas (Szegő Theorem 8.21.8, NU Chapter II, §7, Eq. 19)
- Bounds and estimates (NU inequality 19a, 20, 27)
- Auxiliary function constructions (NU II.7, p. 87)
- Wigner function formulas (Varshalovich Ch. 4, Eq. 4.3.2)
- Connection formulas (NU representation sections)

**Level 2: Standard Properties (Cite source, may omit page)**
- Orthogonality relations
- Three-term recurrences
- Rodrigues formulas
- Basic definitions

**Level 3: Well-Known Facts (Can cite domain-standard sources)**
- Basic trigonometric identities
- Elementary calculus results
- Standard integral evaluations

---

## Supported Domains

### Tier 1: Fully Supported (⭐⭐⭐)
Comprehensive guides with proven problem patterns

| Domain | Problems | Guide | Key Features |
|--------|----------|-------|--------------|
| **Spherical Harmonics** | 19 | [📖](domain_guides/spherical_harmonics_guide.md) | Y_ℓm, poles, rotation, addition theorem |
| **Bessel Functions** | 3 | [📖](domain_guides/bessel_functions_guide.md) | J_ν, zeros, oscillations, asymptotics |
| **Hermite Polynomials** | TBD | 🚧 Coming | H_n, Gaussian weight, quantum oscillator |
| **Laguerre Polynomials** | TBD | 🚧 Coming | L_n^α, exponential weight, semi-infinite |
| **Chebyshev Polynomials** | TBD | 🚧 Coming | T_n/U_n, endpoint singularities |
| **Jacobi Polynomials** | TBD | 🚧 Coming | P_n^(α,β), most general classical |

### Tier 2: Partially Supported (⭐⭐)
Core traps implemented, guides in development

| Domain | Code | Notes |
|--------|------|-------|
| Hypergeometric | hypergeometric | ₂F₁, connection formulas, singularities 0,1,∞ |
| Wigner Functions | wigner | D-functions, rotation group, quantum angular momentum |
| Elliptic Integrals | elliptic | K,E,Π, modulus parameter, complementary forms |

**For detailed mathematical coverage, see:**
- [`domain_guides/README.md`](domain_guides/README.md) - Index of all domain guides
- [`domain_guides/spherical_harmonics_guide.md`](domain_guides/spherical_harmonics_guide.md) - Complete SH guide (100+ lines)
- [`domain_guides/bessel_functions_guide.md`](domain_guides/bessel_functions_guide.md) - Complete Bessel guide (400+ lines)

---

## The Trap System

**19 Traps (A-S)** that test understanding and prevent shortcuts.

### High-Impact Traps (⭐⭐⭐) - Require Deep Understanding

| Code | Name | Description | Domains | Difficulty |
|------|------|-------------|---------|------------|
| **A** | Boundary/Pole Singularity | Limits at domain boundaries | SH, Bessel, Chebyshev | ⭐⭐⭐ |
| **E** | Oscillatory Cancellation | Asymptotic sum cancellations | Bessel, SH, Fourier | ⭐⭐⭐ |
| **I** | Operator Domain Singularity | Differential operator at boundary | SH, Bessel, Laguerre | ⭐⭐⭐ |
| **M** | Asymptotic Boundary Violation | Interior formula at boundary | Bessel, SH, Hypergeometric | ⭐⭐⭐ |

### Structural Traps (⭐⭐) - Require Careful Analysis

| Code | Name | Description | Domains | Difficulty |
|------|------|-------------|---------|------------|
| **B** | Recurrence Obstruction | Recurrence at boundary index | SH, Jacobi, Bessel | ⭐⭐ |
| **C** | Basis Function Confusion | Wrong basis choice | Hermite, Bessel, Fourier | ⭐⭐ |
| **H** | Index Boundary Obstruction | Formula breaks at index limit | SH, Laguerre, Hermite | ⭐⭐ |
| **S** | Index Boundary (Recurrence) | Two-term ansatz at ℓ=m | SH, Bessel | ⭐⭐ |

### Technical Traps (⭐) - Require Attention to Detail

| Code | Name | Description | Domains | Difficulty |
|------|------|-------------|---------|------------|
| **D** | Weight Function Violation | Using wrong weight | Jacobi, Hermite, SH | ⭐ |
| **F** | Normalization Factor Error | Wrong constant | All domains | ⭐ |
| **G** | Hidden Parameter | Measure depends on parameter | Hermite, Laguerre | ⭐ |
| **J** | Operation Ordering | Non-commutative operations | SH, Wigner | ⭐ |
| **K** | Factorial Ratio Error | Combinatorial factor wrong | SH, Wigner | ⭐ |
| **L** | Parity-Dependent Sum | Alternating sum breaks symmetry | SH, Fourier | ⭐ |
| **N** | Representation Confusion | Wrong form used | Jacobi, SH, Bessel | ⭐ |

### New Traps in v3.2 (🆕)

| Code | Name | Description | Domains | Difficulty |
|------|------|-------------|---------|------------|
| **O** | Dimension Counting | Dimension/degree confusion | SH, Wigner | ⭐⭐ |
| **P** | Rodrigues Boundary | Rodrigues formula at boundary | Jacobi, Legendre | ⭐⭐ |
| **Q** | Subsequence Construction | Oscillatory alignment | Jacobi, SH, Bessel | ⭐⭐⭐ |
| **R** | Wigner Non-Vanishing | d-function pole misconception | Wigner, SH | ⭐⭐⭐ |

**For detailed trap examples and domain-specific applications, see the domain guides.**

---

## Creative Techniques (10 Total)

Problems can use these creative techniques to require genuine insight:

### Core Techniques (1-6)

1. **NU Auxiliary Function Method** - Construct energy-like v(x) = y² + σy'²/λ to prove monotonicity
2. **Christoffel-Darboux + Asymptotics** - Apply CD formula + Szegő interior + Weyl equidistribution
3. **Pole Evaluation Strategy** - Evaluate at special point (e.g., north pole) to simplify
4. **Operator Domain Analysis** - Track singularities through operator composition
5. **Cauchy Transform + Recurrence** - Derive recurrence via integration of transform
6. **Representation Conversion** - Change basis (Legendre ↔ Jacobi, Bessel ↔ Legendre)

### New Techniques in v3.2 (7-10)

7. **Dimension Counting** - Track degrees of freedom in rotation/coupling
8. **Subsequence Construction** - Extract oscillatorily aligned subsequence
9. **North Pole Evaluation** - Special case where only m=0 survives
10. **Pole Decomposition** - Split q(x) = (x-β)r(x) + q(β) for Cauchy PV

---

## 2. Creation Workflows

### Reasoning-First Workflow (⭐⭐⭐ PREFERRED for Tier 1)

**Step 1: Identify Interesting Mathematical Question**
Ask: What's a natural question in this domain that requires deep understanding?

Examples:
- "What happens when you rotate spherical harmonics to the pole?"
- "How fast does the Christoffel-Darboux kernel grow?"
- "How do Lommel particular solutions compare to homogeneous solutions?"

**Step 2: Determine Required Reasoning/Techniques**

**From Nikiforov-Uvarov (PRIMARY):**
- Asymptotic analysis (NU Ch. II, §7)
- Auxiliary function methods (NU Ch. II, §7)
- Cauchy transform theory (NU Ch. II, §11)
- Normalization constants (throughout)
- Recurrence relations (throughout)

**From domain guides:**
- See [`domain_guides/`](domain_guides/) for domain-specific techniques
- Each guide documents proven problem patterns
- Citation guidelines for domain-specific references

**Step 3: Design Claim That Requires This Reasoning**
Make it non-obvious, natural, and deep (requires connecting multiple ideas)

**Step 4: Identify Which Traps Naturally Arise**
Traps should emerge from the mathematics - don't force them artificially!

**Step 5: Write Solution Showcasing the Reasoning**
Structure:
1. Set up notation and context
2. Explain naive approach and why it's tempting
3. Apply the creative technique / deep theorem
4. Show the key insight that resolves the problem
5. Mention trap briefly (how it guides understanding)
6. State conclusion

Focus: Mathematical insight > trap mechanism

### Trap-First Workflow (⭐⭐ ACCEPTABLE for Tier 2)

**Step 1:** Pick trap combination (1-2 traps from A-S)  
**Step 2:** Design claim that trap mechanism defeats  
**Step 3:** Add domain-specific notation  
**Step 4:** Write solution showing trap  

**Use this workflow for:** Filling coverage gaps, simpler problems, pedagogical purposes

---

## 3. Quality Tiers

### Tier 1: Excellent (⭐⭐⭐)

**Characteristics:**
- Requires 2-3 connected insights
- Creative technique or unexpected theorem use
- Understanding of structure, not just formulas
- Teaches generalizable principle

**Examples:**
- **85ca892d** (SH): Christoffel-Darboux kernel growth via Szegő + Weyl
- **16ab09af** (SH): NU auxiliary function for monotonicity
- **1cfc14a7** (Bessel): Lommel asymptotic growth comparison

### Tier 2: Good (⭐⭐)

**Characteristics:**
- Requires 1-2 insights
- Standard technique application
- Careful computation needed
- Teaches specific domain knowledge

### Tier 3: Acceptable (⭐)

**Characteristics:**
- Single insight or computation
- Straightforward once approach is clear
- Checks understanding of specific property

---

## 4. Quick Start Commands

### Reasoning-First (PREFERRED)

```
Create reasoning-focused problem for [DOMAIN] about [QUESTION] 
using techniques [METHODS]
```

**Examples:**
```
Create reasoning-focused problem for spherical_harmonics about 
operator domains at poles using NU auxiliary function methods 
and asymptotic analysis

Create reasoning-focused problem for bessel about oscillatory 
sum cancellation using Weyl equidistribution

Create reasoning-focused problem for hermite about energy flow 
in oscillations using NU auxiliary function method
```

### Trap-First (ACCEPTABLE)

```
Create new problem for [DOMAIN] using traps [TRAP_CODES]
```

**Examples:**
```
Create new problem for bessel using traps B and H
Create new problem for hermite using traps G and N
```

---

## 5. Problem Analysis

All problems are analyzed using methodology-based clustering.

**See:** [`problem_clusters/README.md`](problem_clusters/README.md)

### Current Clusters

- [**Spherical Harmonics**](problem_clusters/spherical_harmonics_cluster.md) - 19 problems, 13 sub-clusters
- [**Bessel Functions**](problem_clusters/bessel_functions_cluster.md) - 3 problems, 3 sub-clusters

### Clustering Principles

✅ **Group by solution methodology** (not topic)  
✅ **Specific descriptions** (not generic)  
✅ **Complete problem statements** for first file in each cluster  
✅ **Verify counts** at every hierarchy level  

---

## 6. Anti-Patterns to Avoid

| Don't Do This | Do This Instead | Why |
|---------------|-----------------|-----|
| "Evaluate ∫f(x)g(x)w(x)dx" | "Show kernel K(x,y) grows like N using Szegő asymptotics" | Pure calculation → requires deep technique |
| "Simplify [expression]" | "Does operator O preserve structure P at boundary?" | No insight → tests understanding |
| Generic "for all n≥2" | Natural question needing boundary analysis | Artificial → emerges from mathematics |
| Obvious trap checking | Requires multiple connected insights | Trivial → genuinely deep |

---

## 7. Quality Control Checklist

Before finalizing a problem:

### Mathematical Depth
- [ ] Requires 2+ connected insights (Tier 1) or 1+ insight (Tier 2)
- [ ] Uses creative technique or unexpected theorem application
- [ ] Tests understanding of structure, not just formulas
- [ ] Solution is enlightening to read

### Citations
- [ ] All core results cited with author, year, chapter, equation
- [ ] NU references include section and page numbers
- [ ] Domain-specific references properly formatted
- [ ] Citation level appropriate to content type

### Trap Integration
- [ ] Traps emerge naturally from mathematics
- [ ] Prevent shortcuts without obscuring beauty
- [ ] Guide toward deeper understanding
- [ ] Not artificially forced

### Educational Value
- [ ] Teaches important mathematical distinction
- [ ] Technique generalizes to other problems
- [ ] Worth studying even after solving
- [ ] Connects different areas of mathematics

### Uniqueness
- [ ] Problem statement is novel (not minor variation)
- [ ] Methodology is distinct from existing problems
- [ ] Adds to coverage, doesn't repeat

---

## 8. Success Metrics

A problem is **excellent** (Tier 1) if:

1. **Reasoning depth** ⭐⭐⭐ (multiple connected insights, creative technique)
2. **Educational value** ⭐⭐⭐ (teaches generalizable principle, connects areas)
3. **Natural trap integration** ⭐⭐⭐ (emerges organically, guides understanding)
4. **Solver satisfaction** ⭐⭐⭐ ("Aha!" moment, want to share insight)
5. **Model stumble quality** ⭐⭐ (fail for right reason, rewards reasoning)

**Failure modes to avoid:**
- Too obvious (stumble rate < 33%)
- Too obscure (unsolvable without specialized knowledge)
- Artificial/contrived problem statement
- Trick question (not genuine mathematical trap)
- Pure calculation with no insight required
- Trap dominates over mathematical content

---

## 9. Version History & Document Map

### Current Version: 3.3 (2026-01-27)

**Changes in v3.3:**
- Reorganized into modular structure
- Domain guides separated to `domain_guides/`
- Problem clusters in `problem_clusters/`
- Streamlined core guide (this file)
- Better cross-linking between documents

### Document Map

```
Repository Structure:
├── README.md                           # Project overview (START HERE)
├── stumble_guide.md                    # This file (core guide)
├── domain_guides/
│   ├── README.md                       # Domain index
│   ├── spherical_harmonics_guide.md   # SH mathematical details
│   └── bessel_functions_guide.md      # Bessel mathematical details
├── problem_clusters/
│   ├── README.md                       # Clustering index
│   ├── spherical_harmonics_cluster.md # SH methodology analysis
│   └── bessel_functions_cluster.md    # Bessel methodology analysis
└── all.md                              # Master problem list
```

**Navigation Tips:**
- **Creating problems?** Read this file + relevant domain guide
- **Understanding traps?** See trap catalog in this file
- **Need mathematical formulas?** See domain guides
- **Analyzing problems?** See problem clusters
- **Finding problems?** See all.md

### Previous Versions

- **v3.2** (2026-01-26): Added 5 new traps (O-S), 4 new techniques, enhanced SH coverage
- **v3.1** (2026-01-23): Reasoning-first emphasis, uniqueness requirements
- **v3.0** (2026-01-20): Enhanced citation standards, NU integration

---

**Document Version**: 3.3 - Modular Organization Edition  
**Last Updated**: 2026-01-27  
**Primary Reference**: Nikiforov & Uvarov, *Special Functions of Mathematical Physics* (1988)  
**Domains Supported**: 9 (Tier 1: 6, Tier 2: 3)  
**Total Traps**: 19 (A-S)  
**Problem Quality Tiers**: 3 (Focus on Tier 1)  
**Philosophy**: Reasoning first, traps as tools for depth, NU methods as foundation, modular organization

---

## Quick Reference Card

**Creating a Problem:**
1. Read core philosophy (this file)
2. Choose domain → read guide in [`domain_guides/`](domain_guides/)
3. Identify mathematical question (reasoning-first)
4. Determine required techniques
5. Design claim requiring those techniques
6. Identify natural traps
7. Write solution with proper citations
8. Check quality control checklist

**Analyzing a Problem:**
1. Identify domain
2. Read domain guide
3. Determine solution methodology
4. Match to problem patterns
5. Verify citations
6. Document in problem cluster

**Finding Information:**
- **Trap details** → This file, section 2
- **Mathematical formulas** → Domain guides
- **Problem patterns** → Domain guides
- **Citation examples** → Domain guides
- **Existing problems** → Problem clusters
- **Master list** → all.md
