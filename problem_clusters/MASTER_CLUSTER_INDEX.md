# Master Cluster Index - All Mathematical Problems

**Total files: 105**  
**Date: January 31, 2026**  
**Organization: By Nikiforov-Uvarov book chapter structure**

This master index organizes all 105 mathematical problems into focused cluster documents, organized by the chapter structure of **Nikiforov & Uvarov: Special Functions of Mathematical Physics (1988)**.

---

## Document Structure

Each major topic has its own detailed cluster document following the bessel_functions_cluster.md methodology:
- **Typical Example** format for first file in each method
- One-line descriptions for remaining files
- Total file counts at every level
- Cross-references to N-U book sections

---

## Cluster Documents by N-U Chapter

### Chapter I: Foundations (Hypergeometric Type Functions)
**Document:** `cluster_01_foundations.md`  
**N-U Reference:** Chapter I, §1-4  
**File count:** ~5 files  
**Topics:**
- Differential equations for special functions
- Rodrigues formulas
- Recursion relations
- Generating functions

---

### Chapter II: Classical Orthogonal Polynomials
**Document:** `cluster_02_orthogonal_polynomials.md` ✓ (already partially done in clusters.md)  
**N-U Reference:** Chapter II, §5-13  
**File count:** ~40 files

#### Sub-clusters:

**§5-7: Basic Properties (Jacobi, Laguerre, Hermite)**
- Modified weight functions (8 files)
- Functions of second kind (9 files)
- Asymptotic behavior & bounds (6 files)
- Extremal problems (2 files)
- Generating functions (3 files)

**§8: Series Expansions**
- Expansion representation (1 file)

**§10: Spherical Harmonics**
- See separate document: `cluster_10_spherical_harmonics.md`
- (19 files - already clustered separately)

**§11: Functions of the Second Kind**
- Covered above in §5-7 section

**§12-13: Discrete Variable Polynomials**
- Difference equations (2 files)
- Hahn, Meixner, Krawtchouk, Charlier polynomials
- Connection to angular momentum (see Cluster for Chapter V §26)

---

### Chapter III: Bessel Functions
**Document:** `cluster_03_bessel_functions.md` ✓ (already done)  
**N-U Reference:** Chapter III, §14-19  
**File count:** 7 files

**§14-15: Basic Properties**
- 1cfc14a7.md: Lommel's equation
- 300a11f2.md: Modified Bessel functions
- 005a9124.md: Orthogonality
- 4db0af8d.md: Wronskian relations

**§17: Special Classes**
- 89e30655.md: Large parameter asymptotics
- 6e8de21e.md: Hankel uniqueness
- af454602.md: Branch cut behavior

**§18: Addition Theorems**
- (No files yet)

**§19: WKB/Semiclassical**
- 87879ef3.md: Mehler-Heine formula (Legendre→Bessel connection)

---

### Chapter IV: Hypergeometric Functions
**Document:** `cluster_04_hypergeometric.md`  
**N-U Reference:** Chapter IV, §20-23  
**File count:** ~3 files  
**Topics:**
- Equations of hypergeometric type
- Recursion relations
- Functional equations
- Connections to other special functions

---

### Chapter V: Applications to Physics & Quantum Mechanics
**Document:** `cluster_05_quantum_applications.md`  
**N-U Reference:** Chapter V, §24-27  
**File count:** ~15 files

**§24-25: Boundary Value Problems**
- Helmholtz equation (2 files)
- Elliptic PDEs (1 file)
- Sturm-Liouville problems

**§26: Quantum Mechanics**
- Angular momentum coupling (10 files)
  - Clebsch-Gordan coefficients (7 files)
  - 6j symbols / Racah coefficients (2 files)
  - Asymptotic analysis (1 file)
- Schrödinger equation solutions
- Central field problems

**§27: Numerical Analysis**
- Gaussian quadrature
- Information compression

---

### Additional Topics (Not in N-U structure)

**Document:** `cluster_06_pdes_nonlinear.md`  
**File count:** 12 files  
**Topics:**
- Sine-Gordon equation
- Energy methods
- Kink solutions
- Soliton interactions

**Document:** `cluster_07_differential_geometry.md`  
**File count:** 9 files  
**Topics:**
- Frenet-Serret curvature (3 files)
- Flat tori & geodesics (3 files)
- Hyperbolic geometry (3 files)

**Document:** `cluster_08_integrals.md`  
**File count:** 8 files  
**Topics:**
- Laguerre polynomial integrals (5 files)
- Asymptotic limits via Laplace method (2 files)
- Expansion problems (1 file)

**Document:** `cluster_09_zero_distribution.md`  
**File count:** 4 files  
**Topics:**
- Monotonicity of zeros with parameters
- Interlacing properties
- Hellmann-Feynman theorem applications

---

## File Count Summary

| Cluster Document | N-U Chapter | File Count | Status |
|-----------------|-------------|------------|---------|
| cluster_01_foundations.md | Ch I (§1-4) | ~5 | To create |
| cluster_02_orthogonal_polynomials.md | Ch II (§5-9,11) | ~28 | Partial ✓ |
| cluster_03_bessel_functions.md | Ch III (§14-19) | 7 | Complete ✓ |
| cluster_04_hypergeometric.md | Ch IV (§20-23) | ~3 | To create |
| cluster_05_quantum_applications.md | Ch V (§24-27) | ~15 | To create |
| cluster_06_pdes_nonlinear.md | (Sine-Gordon) | 12 | To create |
| cluster_07_differential_geometry.md | (Geometry) | 9 | To create |
| cluster_08_integrals.md | (Integrals) | 8 | To create |
| cluster_09_zero_distribution.md | (Zeros) | 4 | To create |
| cluster_10_spherical_harmonics.md | Ch II §10 | 19 | To create |
| **TOTAL** | | **~110** | |

**Note:** Some files appear in multiple contexts (e.g., spherical harmonics connect to both Ch II and quantum mechanics), so total may exceed 105 unique files.

---

## Next Steps

1. ✓ Master index created (this document)
2. Create each individual cluster document with full methodology
3. Use bessel_functions_cluster.md as template for all
4. Ensure every file from all.md appears exactly once
5. Cross-reference between related clusters

---

## Usage Instructions

**To find a specific file:**
1. Search for filename in this master index
2. Navigate to the appropriate cluster document
3. Find detailed methodology and solution approach

**To explore a topic:**
1. Choose relevant cluster document from list above
2. Review hierarchical organization within that document
3. Follow cross-references to related clusters

**To verify completeness:**
1. Check file count summary table
2. Sum should equal 105 total files
3. Each cluster document lists all files it contains

---

**End of Master Index**
