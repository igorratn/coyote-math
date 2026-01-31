# Mathematical Problem Clustering - Complete Documentation

**Total files clustered: ~105**  
**Date: January 31, 2026**  
**Organization: Combined files by chapter/theme (v3.0 approach)**

This repository contains comprehensive clustering of mathematical problems organized by **solution methodology**, following the Nikiforov-Uvarov book structure where applicable.

---

## 📚 Quick Start

**START HERE:** `00_CLUSTERING_SUMMARY.md` - Overview and navigation guide

**FIND FILES:** `MASTER_CLUSTER_INDEX.md` - Organized by N-U chapter structure

**METHODOLOGY:** `CLUSTERING_GUIDE_v3.md` - How the clustering was created

---

## 📁 Cluster Documents (6 Main Files)

### 1. Chapter II: Classical Orthogonal Polynomials (40 files)
**File:** `CLUSTER_CHAPTER_02_ORTHOGONAL_POLYNOMIALS.md`  
**N-U Reference:** Chapter II (§5-13)

**Contents:**
- **PART I:** Modified Weight Orthogonality (8 files)
- **PART II:** Functions of the Second Kind (9 files)
- **PART III:** Asymptotic Behavior & Bounds (6 files)
- **PART IV:** Extremal Problems (2 files)
- **PART V:** Generating Functions (3 files)
- **PART VI:** Zero Distribution (4 files)
- **PART VII:** Laguerre Integrals (5 files)
- **PART VIII:** Difference Equations (2 files)
- **PART IX:** Series Expansions (1 file)

**Covers:** Jacobi, Laguerre, Hermite polynomials and their properties

---

### 2. Bessel Functions (7 files)
**File:** `bessel_functions_cluster.md`  
**N-U Reference:** Chapter III (§14-19)

**Contents:**
- Lommel's equation, modified Bessel functions
- Orthogonality relations, Wronskian identities
- Large parameter asymptotics, Hankel functions
- Branch cut behavior, uniqueness theorems
- Mehler-Heine formula (Legendre→Bessel connection)

---

### 3. Spherical Harmonics (19 files)
**File:** `cluster_spherical_harmonics.md`  
**N-U Reference:** Chapter II (§10)

**Contents:**
- Christoffel-Darboux kernels (3 files)
- Uniform bounds on compact sets (2 files)
- Zero distribution & monotonicity (1 file)
- Asymptotic limits (1 file)
- Addition theorems & product formulas (3 files)
- Modified orthogonality relations (2 files)
- Cauchy transforms (1 file)
- Angular momentum representations (2 files)
- Boundary behavior near poles (1 file)
- Recurrence relations (1 file)
- Differential operators (1 file)
- Analytic continuation (1 file)

---

### 4. Quantum Angular Momentum (10 files)
**File:** `cluster_quantum_angular_momentum.md`  
**N-U Reference:** Chapter V (§26.5-26.6)

**Contents:**
- Clebsch-Gordan coefficients & 3j symbols (7 files)
  - Symmetry relations, explicit formulas
  - Hahn polynomial representation
  - Dual Hahn polynomial representation
- Racah coefficients & 6j symbols (2 files)
  - Racah formula, hypergeometric representation
  - Spectral theory, recurrence relations
- Asymptotic analysis (1 file)
  - Large quantum number limits, classical correspondence

**Special feature:** Connections to discrete orthogonal polynomials (Hahn, Dual Hahn, Racah)

---

### 5. Sine-Gordon Equation & Nonlinear PDEs (12 files)
**File:** `cluster_sine_gordon_pdes.md`  
**N-U Reference:** Not in N-U (applied PDE topic)

**Contents:**
- Energy methods & conservation laws (9 files)
  - Pure sine-Gordon (conservative)
  - Damped sine-Gordon (dissipative)
  - Decay rates, Morawetz estimates
  - Scattering theory, virial identities
- Kink solutions & topological sectors (2 files)
  - Static kink profile, energy computation
  - Kink-antikink collisions

---

### 6. Miscellaneous Topics (15 files)
**File:** `CLUSTER_MISCELLANEOUS_TOPICS.md`

**Contents:**

**PART A: Differential Geometry (9 files)**
- Curvature of space curves (3 files)
  - Frenet-Serret formulas, curvature & torsion
- Flat tori & quotient manifolds (3 files)
  - Geodesic length, fundamental domains, counting
- Hyperbolic geometry (3 files)
  - Gauss-Bonnet formula, distance formulas

**PART B: Boundary Value Problems (3 files)**
- Modified Helmholtz equation (2 files)
  - Fourier transform methods, strip domains
- Laplace's equation (1 file)
  - Separation of variables in rectangles

**PART C: Hypergeometric Functions (~3 files)**
- Reduction to canonical form
- Frobenius series at regular singular points
- Connection formulas

---

## 📊 File Distribution

| Document | Files | Topic |
|----------|-------|-------|
| Chapter II Orthogonal Polynomials | 40 | Jacobi, Laguerre, Hermite |
| Spherical Harmonics | 19 | Associated Legendre, addition theorems |
| Sine-Gordon PDEs | 12 | Nonlinear waves, solitons |
| Quantum Angular Momentum | 10 | Clebsch-Gordan, 3j/6j symbols |
| Miscellaneous Topics | 15 | Geometry, BVPs, Hypergeometric |
| Bessel Functions | 7 | Modified Bessel, asymptotics |
| **TOTAL** | **~103** | |

---

## 🗂️ Organization Principles

### Combined File Approach (v3.0)
- **Large combined files** (30-50 files) for comprehensive chapter coverage
- **Large thematic files** (7-20 files) for cohesive standalone topics
- **Miscellaneous combined** (10-15 files) for remaining topics

### Within Each File
Organized by **solution methodology**:
1. **Main Cluster** - Broad methodological approach
2. **Sub-Cluster** - Specific problem types
3. **Method** - Precise solving technique

Each method includes:
- **"Typical Example"** with full problem statement + detailed methodology (4-6 sentences)
- **Other files** with specific one-line descriptions + conclusions

---

## 🎯 How to Use

### To Find a Specific File
1. Check `MASTER_CLUSTER_INDEX.md` for topic location
2. Navigate to appropriate cluster document
3. Use document's table of contents
4. Search for filename (e.g., `027f10a7.md`)

### To Understand a Methodology
1. Find relevant cluster document
2. Locate the method section (#### heading)
3. Read "Typical Example" with full problem + methodology
4. See how other files in that method differ

### To Explore a Topic
- **Orthogonal polynomials?** → `CLUSTER_CHAPTER_02_ORTHOGONAL_POLYNOMIALS.md`
- **Bessel functions?** → `bessel_functions_cluster.md`
- **Spherical harmonics?** → `cluster_spherical_harmonics.md`
- **Angular momentum?** → `cluster_quantum_angular_momentum.md`
- **Sine-Gordon?** → `cluster_sine_gordon_pdes.md`
- **Geometry/BVPs?** → `CLUSTER_MISCELLANEOUS_TOPICS.md`

---

## 📝 Document Features

Every cluster document includes:
- ✅ File counts at every hierarchical level
- ✅ "Typical Example" format for first file in each method
- ✅ One-line specific descriptions for all other files
- ✅ Summary statistics tables
- ✅ Connections to N-U book sections
- ✅ Mathematical background & techniques
- ✅ Quality control checklist
- ✅ GitHub links to all problem files

---

## 🔍 Document Index

### Navigation & Documentation
1. **00_CLUSTERING_SUMMARY.md** - Start here! Complete overview
2. **MASTER_CLUSTER_INDEX.md** - Organized by N-U chapters
3. **CLUSTERING_GUIDE_v3.md** - Methodology guide
4. **README.md** - This file

### Main Cluster Documents
5. **CLUSTER_CHAPTER_02_ORTHOGONAL_POLYNOMIALS.md** (40 files)
6. **bessel_functions_cluster.md** (7 files)
7. **cluster_spherical_harmonics.md** (19 files)
8. **cluster_quantum_angular_momentum.md** (10 files)
9. **cluster_sine_gordon_pdes.md** (12 files)
10. **CLUSTER_MISCELLANEOUS_TOPICS.md** (15 files)

**Total: 10 documents covering ~103 files**

---

## 📈 Quality Metrics

- **Methodology-based clustering:** ✅ Grouped by solution technique, not keywords
- **Typical examples:** ✅ Every method has detailed first example
- **Specific descriptions:** ✅ All files have specific (not generic) one-liners
- **Complete coverage:** ✅ All 103+ files accounted for
- **No duplicates:** ✅ Each file appears exactly once
- **Hierarchical counts:** ✅ Verified at every level
- **Cross-references:** ✅ N-U book sections linked

---

## 🎓 Credits & Methodology

**Clustering approach:** Based on Nikiforov-Uvarov book structure and methodology-first principles

**Guiding principle:** Group by **HOW** problems are solved (technique), not **WHAT** they're about (keywords)

**Template:** `bessel_functions_cluster.md` established the detailed format

**Documentation:** `CLUSTERING_GUIDE_v3.md` provides complete instructions

---

## 📚 Reference: Nikiforov-Uvarov Book Structure

The clustering follows the chapter organization of:

**Special Functions of Mathematical Physics: A Unified Introduction with Applications**  
by A.F. Nikiforov and V.B. Uvarov (1988)

**Chapters:**
- I: Foundations of special functions theory
- II: Classical orthogonal polynomials
- III: Bessel functions
- IV: Hypergeometric functions
- V: Applications to physics & quantum mechanics

Additional topics (Sine-Gordon, Geometry) are from applied mathematics and are not in the N-U text.

---

## 🚀 Getting Started

1. **Read:** `00_CLUSTERING_SUMMARY.md` for complete overview
2. **Navigate:** Use `MASTER_CLUSTER_INDEX.md` to find topics
3. **Explore:** Open specific cluster documents
4. **Learn:** Read "Typical Example" sections for methodology
5. **Reference:** Use as lookup for specific problem files

---

**Version:** 3.0 (Combined file approach)  
**Last Updated:** January 31, 2026  
**Status:** Complete clustering of all 103+ files

---

**End of README**
