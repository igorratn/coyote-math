# Domain Guides Index

Detailed mathematical guides for each supported domain, including core objects, key phenomena, problem patterns, and citation guidelines.

---

## Tier 1: Fully Supported Domains (⭐⭐⭐)

### [Spherical Harmonics](spherical_harmonics_guide.md)
**Status:** ✅ Complete (19 problems)

**Coverage:**
- Spherical harmonics Y_ℓm(θ,φ) on S²
- Associated Legendre functions P_ℓ^m(x)
- Wigner D-functions and rotation matrices
- Angular momentum operators (L₊, L₋)
- Ferrers functions (analytic continuation)

**Key Phenomena:**
- Pole singularities (θ → 0, π)
- Rotation group structure
- Addition theorems
- Christoffel-Darboux kernels
- Index boundaries

**References:**
- Primary: Nikiforov-Uvarov, Chapter II, §8
- Secondary: Varshalovich et al., *Quantum Theory of Angular Momentum* (1988)
- Tertiary: Szegő for asymptotics

**Problem Patterns:** 8 documented patterns with examples

---

### [Bessel Functions](bessel_functions_guide.md)
**Status:** ✅ Complete (3 problems)

**Coverage:**
- Standard Bessel functions (J_ν, Y_ν)
- Modified Bessel functions (I_ν, K_ν)
- Hankel functions (H_ν^(1), H_ν^(2))
- Spherical Bessel functions (j_n, y_n)
- Lommel functions (s_μ,ν)

**Key Phenomena:**
- Origin singularity (regular singular point)
- Oscillatory behavior and zeros
- Asymptotic regime boundaries
- Order-dependent behavior
- Wronskian analysis
- Inhomogeneous equations

**References:**
- Primary: Nikiforov-Uvarov, Chapter III, §14-17
- Secondary: Watson, *Theory of Bessel Functions* (1944)
- Tertiary: NIST DLMF (https://dlmf.nist.gov/10)

**Problem Patterns:** 8 patterns (3 proven, 5 suggested)

---

### Hermite Polynomials
**Status:** 🚧 In Development

**Planned Coverage:**
- Hermite polynomials H_n(x)
- Gaussian weight e^(-x²)
- Quantum harmonic oscillator
- Recurrence relations
- Rodrigues formula

**References:**
- Primary: Nikiforov-Uvarov, Chapter III, §13
- Secondary: Szegő, Chapter V

---

### Laguerre Polynomials
**Status:** 🚧 In Development

**Planned Coverage:**
- Laguerre polynomials L_n(x), L_n^(α)(x)
- Exponential weight x^α e^(-x)
- Semi-infinite domain [0,∞)
- Hydrogen atom radial functions
- Connection to confluent hypergeometric

**References:**
- Primary: Nikiforov-Uvarov, Chapter III, §12
- Secondary: Szegő, Chapter V

---

### Chebyshev Polynomials
**Status:** 🚧 In Development

**Planned Coverage:**
- First kind T_n(x) = cos(n arccos x)
- Second kind U_n(x)
- Endpoint singularities at ±1
- Trigonometric representation
- Approximation theory

**References:**
- Primary: Nikiforov-Uvarov, Chapter II, §9
- Secondary: Szegő, Chapter IV

---

### Jacobi Polynomials
**Status:** 🚧 In Development

**Planned Coverage:**
- Jacobi polynomials P_n^(α,β)(x)
- Weight (1-x)^α(1+x)^β
- Most general classical polynomial
- Envelope estimates
- Connection formulas

**References:**
- Primary: Nikiforov-Uvarov, Chapter II, §8
- Secondary: Szegő, Chapter IV

---

## Tier 2: Partially Supported Domains (⭐⭐)

### Hypergeometric Functions
**Status:** 🔶 Basic Support

**Coverage:**
- ₂F₁(a,b;c;z)
- Connection formulas
- Singularities at 0, 1, ∞
- Monodromy

**References:**
- Nikiforov-Uvarov throughout
- Abramowitz & Stegun, Chapter 15

---

### Wigner Functions
**Status:** 🔶 Basic Support

**Coverage:**
- 3j, 6j, 9j symbols
- Clebsch-Gordan coefficients
- Racah polynomials

**References:**
- Varshalovich et al. (primary)
- Nikiforov-Uvarov-Suslov, *Classical Orthogonal Polynomials of a Discrete Variable*

---

### Elliptic Integrals
**Status:** 🔶 Basic Support

**Coverage:**
- Complete elliptic integrals K, E, Π
- Modulus parameter
- Complementary forms

**References:**
- Abramowitz & Stegun, Chapter 17
- NIST DLMF (https://dlmf.nist.gov/19)

---

## Domain Guide Template

Each domain guide follows this structure:

### 1. Why This Is Tier 1
- Mathematical richness
- Connection to multiple areas
- Natural trap opportunities

### 2. Core Mathematical Objects
- Definitions with formulas
- Differential equations
- Normalization
- Key identities

### 3. Key Mathematical Phenomena
- With trap associations
- Examples of each
- Why they're important

### 4. Primary NU Coverage
- Chapter and section references
- Key equations and theorems
- Page numbers

### 5. Additional Essential References
- Domain-specific books
- When to use each reference
- Citation examples

### 6. Problem Patterns
- Proven patterns (from existing problems)
- Suggested patterns (for expansion)
- Structure, insight, technique for each

### 7. Trap Examples
- Domain-specific illustrations
- "Why it fails" explanations
- Connection to general trap catalog

### 8. Citation Examples
- Formatted examples for common scenarios
- Multiple source coordination
- Level-appropriate citations

---

## How to Use These Guides

### For Problem Creation
1. Read core philosophy in main [`stumble_guide.md`](../stumble_guide.md)
2. Choose domain and read its guide
3. Identify interesting mathematical question
4. Use problem patterns as templates
5. Apply citation standards

### For Problem Analysis
1. Identify domain of existing problem
2. Read corresponding guide
3. Match to problem patterns
4. Verify citations against guide
5. Document in problem cluster

### For Adding New Domains
1. Study existing guides (especially Spherical Harmonics and Bessel)
2. Follow template structure
3. Document 5-10 core phenomena with traps
4. Create 3-5 seed problems
5. Submit for review

---

## Status Summary

| Domain | Status | Problems | Guide Completion | Next Steps |
|--------|--------|----------|------------------|------------|
| Spherical Harmonics | ✅ Complete | 19 | 100% | Maintain, add advanced patterns |
| Bessel Functions | ✅ Complete | 3 | 100% | Create 5-10 new problems |
| Hermite | 🚧 In Progress | TBD | 0% | Create guide, seed problems |
| Laguerre | 🚧 In Progress | TBD | 0% | Create guide, seed problems |
| Chebyshev | 🚧 In Progress | TBD | 0% | Create guide, seed problems |
| Jacobi | 🚧 In Progress | TBD | 0% | Create guide, seed problems |
| Hypergeometric | 🔶 Basic | TBD | 20% | Expand coverage |
| Wigner | 🔶 Basic | TBD | 20% | Expand coverage |
| Elliptic | 🔶 Basic | TBD | 20% | Expand coverage |

---

**Last Updated:** 2026-01-27  
**Maintained by:** Problem Generation Team
