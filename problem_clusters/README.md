# Problem Clusters Index

Comprehensive methodology-based clustering of all problems. Each cluster document analyzes problems by their **solution methodology**, not by topic or keywords.

---

## Clustering Philosophy

**Key Principle:** Group by HOW problems are solved, not WHAT they're about.

### Clustering Methodology

Problems are organized in a **three-level hierarchy**:

1. **Main Cluster:** Broad methodological approach  
   *Example:* "Inhomogeneous Differential Equations with Forcing Terms"

2. **Sub-Cluster:** Specific problem type within methodology  
   *Example:* "Asymptotic Expansion Analysis"

3. **Method Sub-Sub-Cluster:** Precise solving technique  
   *Example:* "Growth Comparison with Oscillatory Decay"

### Why Methodology-Based?

✅ **Reveals patterns:** Similar techniques across different domains  
✅ **Teaches transferable skills:** Recognize when to apply each method  
✅ **Prevents repetition:** Easy to see if methodology is covered  
✅ **Enables discovery:** Find problems using similar reasoning

---

## Available Clusters

### [Spherical Harmonics Cluster](spherical_harmonics_cluster.md)
**Total Files:** 19  
**Status:** ✅ Complete

**Main Clusters:**
1. Monotonicity via Auxiliary Function Method (1 file)
2. Addition Theorem and Modified Sums (1 file)
3. Modified Weight Orthogonality on the Sphere (2 files)
4. Cauchy Transform Theory for Spherical Harmonics (1 file)
5. Zero Distribution Properties (1 file)
6. Uniform Bounds and Asymptotic Growth (5 files)
7. Addition Theorem as Projection Operator (1 file)
8. Angular Momentum Operator Limits (1 file)
9. Rotation and Pole Behavior (2 files)
10. Boundary Behavior and Rodrigues Formulas (1 file)
11. Recurrence Relations at Index Boundaries (1 file)
12. Differential Operators on Associated Legendre (1 file)
13. Analytic Continuation of Ferrers Functions (1 file)

**Methodological Highlights:**
- **Nikiforov-Uvarov auxiliary function method** (16ab09af)
- **Christoffel-Darboux + Weyl equidistribution** (85ca892d)
- **Operator domain + singularity analysis** (07d41e49)
- **Cauchy transform + recurrence relations** (93f8b201)

---

### [Bessel Functions Cluster](bessel_functions_cluster.md)
**Total Files:** 3  
**Status:** ✅ Complete

**Main Clusters:**
1. Inhomogeneous Differential Equations (1 file)
   - 1.1.1 Asymptotic Expansion Analysis with Growth Comparison
2. Analytic Theory of Modified Differential Equations (1 file)
   - 1.2.1 Frobenius Method with Wronskian Verification
3. Asymptotic Connections Between Function Classes (1 file)
   - 1.3.1 High-Degree Limit with Coordinate Transformation

**Methodological Highlights:**
- **Asymptotic expansion + growth comparison** (1cfc14a7)
- **Frobenius method + Wronskian analysis** (300a11f2)
- **Mehler-Heine formula application** (87879ef3)

**Key Insight:** All three problems involve asymptotic analysis but apply it in fundamentally different ways:
- Lommel: Large argument asymptotics
- Modified Bessel: Near singular point asymptotics
- Mehler-Heine: High-degree limit

---

## Cluster Document Format

Each cluster document contains:

### 1. Complete File Inventory
- Total files discovered and verified
- Cross-check against master list

### 2. Main Cluster Overview
- Total files in cluster
- Broad description of methodological approach

### 3. Sub-Cluster Breakdown
- Each sub-cluster with file count
- Specific problem types

### 4. Method Sub-Sub-Clusters
- Precise solving techniques
- First file: FULL problem statement + detailed methodology (4-6 sentences)
- Other files: One-sentence specific descriptions + conclusion

### 5. Summary Statistics
- Main cluster breakdown table
- Sub-cluster breakdown table
- Methodology breakdown table
- Verification that all counts sum correctly

### 6. Methodological Patterns
- Common techniques across problems
- Unique aspects of each problem
- Connections between problems

### 7. Physical/Mathematical Context
- Applications
- Coordinate systems
- Real-world motivation

### 8. Connections to References
- NU book chapters
- Domain-specific references
- Equation and page numbers

---

## Clustering Guidelines

### What Makes a Good Cluster?

**✅ DO:**
- Group by solution methodology
- Provide specific problem descriptions
- Include complete problem statements for first file
- Show connections between problems
- Reference specific equations/theorems

**❌ DON'T:**
- Group by topic keywords alone
- Write generic descriptions
- Skip problem statements
- Forget to verify counts
- Use vague references

### Example: Good vs Bad Clustering

**❌ BAD Clustering:**
```
Cluster 1: Bessel Function Problems
- 1cfc14a7.md - Problem about Bessel functions (True)
- 300a11f2.md - Another Bessel problem (True)
- 87879ef3.md - Bessel function problem (False)
```

**✅ GOOD Clustering:**
```
Cluster 1.1.1: Asymptotic Expansion Analysis with Growth Comparison
- 1cfc14a7.md - Lommel's equation particular solution satisfies 
  |u_p(z)| ≤ Cz^{ν+2n-1} by comparing polynomial growth z^α 
  against oscillatory decay z^{-1/2} of homogeneous solutions 
  J_ν, Y_ν (True)
```

---

## Statistics Across All Clusters

| Domain | Total Files | Clusters | Sub-Clusters | Methodologies |
|--------|-------------|----------|--------------|---------------|
| Spherical Harmonics | 19 | 1 | 13 | 19 |
| Bessel Functions | 3 | 1 | 3 | 3 |
| **TOTAL** | **22** | **2** | **16** | **22** |

---

## Methodological Cross-Domain Patterns

Some techniques appear across multiple domains:

### 1. Asymptotic Analysis
- **Spherical Harmonics:** Szegő interior asymptotics for Jacobi polynomials
- **Bessel Functions:** Large argument asymptotics, Mehler-Heine limit
- **Common theme:** Converting to standard asymptotic formulas

### 2. Boundary/Singularity Analysis
- **Spherical Harmonics:** Pole singularities at θ=0,π
- **Bessel Functions:** Origin singularity at z=0
- **Common theme:** Regular vs irregular solutions, Frobenius exponents

### 3. Operator Theory
- **Spherical Harmonics:** Angular momentum operators L₊, L₋
- **Bessel Functions:** Wronskian computation, linear independence
- **Common theme:** Domain restrictions, operator composition

### 4. Orthogonality + Weight Modifications
- **Spherical Harmonics:** Modified weight with pole at β ∈ (-1,1)
- **Bessel Functions:** (Not yet, but potential with modified weight)
- **Common theme:** Cauchy principal value, pole decomposition

### 5. Recurrence Relations
- **Spherical Harmonics:** Three-term recurrence at index boundaries
- **Bessel Functions:** Recurrence obstruction at ν=0,1,2
- **Common theme:** Coefficient vanishing, system overdetermination

---

## Adding New Clusters

### Prerequisites
1. Have at least 3 problems in domain
2. Identify solution methodologies
3. Read similar cluster documents

### Process
1. Extract ALL files from `all.md` for the domain
2. Read each problem completely
3. Identify methodology (not topic)
4. Group by methodology into 3-level hierarchy
5. Write detailed first-file descriptions
6. Write one-sentence descriptions for others
7. Verify counts at every level
8. Create summary tables
9. Document methodological patterns

### Template
Use [`bessel_functions_cluster.md`](bessel_functions_cluster.md) as template for new clusters.

---

## Quality Control Checklist

Before finalizing a cluster document:

- [ ] Read entire source file (`all.md`)
- [ ] Extracted all problem texts
- [ ] Verified file count manually
- [ ] Identified solution methodology (not topic)
- [ ] Grouped by methodology, not keywords
- [ ] First file has full problem statement
- [ ] First file has 4-6 sentence methodology
- [ ] Other files have specific descriptions
- [ ] All counts verified at every level
- [ ] Summary tables included
- [ ] Methodological patterns documented
- [ ] Connections to references included
- [ ] Every file appears exactly once

---

## Citation for Cluster Documents

When referencing cluster analysis in papers or documentation:

```
See [Domain Name] Cluster (problem_clusters/[domain]_cluster.md) 
for complete methodology-based analysis of [N] problems organized 
into [M] sub-clusters by solution technique.
```

**Example:**
```
See Bessel Functions Cluster (problem_clusters/bessel_functions_cluster.md)
for complete methodology-based analysis of 3 problems organized into 
3 sub-clusters by solution technique: asymptotic expansion analysis, 
Frobenius method with Wronskian verification, and high-degree limit 
with coordinate transformation.
```

---

**Last Updated:** 2026-01-27  
**Clustering Standard:** mk_cl.md v1.0  
**Maintained by:** Problem Analysis Team
