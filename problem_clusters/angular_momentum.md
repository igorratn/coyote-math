# Angular Momentum & Quantum Coupling: Comprehensive Clustering by Solution Methodology

**Total files: 15**
**Date: March 2, 2026**
**N-U Reference:** Chapter V, §26.5-26.6

This document clusters all angular momentum coupling problems based on their **solution methodology**, not topic keywords.

---

## Overview

This cluster contains problems from quantum angular momentum theory, including:
- Wigner d-matrix elements and rotation group representations
- Clebsch-Gordan coefficients and their polynomial representations
- Wigner 3j symbols and selection rules
- Wigner 6j symbols (Racah coefficients)
- Connections to discrete orthogonal polynomials (Hahn, dual Hahn, Racah)
- Spherical harmonic operator identities

All problems involve coupling of angular momenta in quantum mechanics and their representation through special polynomials.

---

## Cluster 1: Wigner d-Matrix & Rotation Group

**Total files: 2**

These problems analyze the small Wigner d-matrix elements $d_{m'm}^\ell(\beta)$ and their properties under finite rotations.

---

### 1.1 Explicit d-Matrix Evaluation

**Total files: 2**

#### 1.1.1 Selection Rules at Special Angles

**Total files: 2**

**Typical Example: [0b5cd3f3.md](https://github.com/igorratn/coyote-math/blob/main/0b5cd3f3.md)**

Let the small d-matrix elements $d_{m'm}^\ell(\beta)$ represent a rotation by angle $\beta$ about the $y$-axis. Let $\psi = |1,1\rangle$ be a normalized eigenstate with $\hat{L}_z\psi = 1\cdot\psi$. Consider the rotated state $\psi_\pi = \hat{R}_y(\pi)\psi$.

**Claim:** $\hat{L}_z\psi_\pi = 1\cdot\psi_\pi$.

**Solution Methodology:** Uses the explicit d-matrix selection rule at $\beta = \pi$. In the Condon-Shortley convention, $d_{m'm}^\ell(\pi) = (-1)^{\ell+m}\delta_{m',-m}$. For $\ell=1$, $m=1$: the Kronecker delta restricts to $m'=-1$ with phase $(-1)^{1+1}=1$, giving $\psi_\pi = |1,-1\rangle$. Since $\hat{L}_z|1,-1\rangle = -1\cdot|1,-1\rangle$, the eigenvalue is $-1$, not $1$.

**Conclusion: False**

**Other files:**
- [fe4dc745.md](https://github.com/igorratn/coyote-math/blob/main/fe4dc745.md): Parity claim for d-function integral $\int d_{m'm}^\ell(\beta)\sin\beta\,d\beta$; refuted by explicit counterexample at $\ell=1$, $m=1$, $m'=0$. **False**

---

## Cluster 2: Spherical Harmonic Operator Identities

**Total files: 2**

These problems study differential operators and orthogonality conditions involving spherical harmonics and associated Legendre functions.

---

### 2.1 Raising/Lowering Operators & Boundary Behavior

**Total files: 2**

#### 2.1.1 Singular Limits at Poles

**Total files: 2**

**Typical Example: [07d41e49.md](https://github.com/igorratn/coyote-math/blob/main/07d41e49.md)**

For spherical harmonics $Y_{\ell m}(\theta,\phi)$ and the angular momentum raising operator $L_+$, define $R_{\ell m}(\theta) = \frac{1}{\sin\theta}\frac{\partial Y_{\ell m}(\theta,0)}{\partial\theta}$.

**Claim:** $\lim_{\theta\to 0}\frac{R_{\ell m}(\theta)}{Y_{\ell,m+1}(\theta,0)} = \sqrt{(\ell-m)(\ell+m+1)}$.

**Solution Methodology:** Uses the raising operator in spherical coordinates $L_+ = e^{i\phi}(\partial_\theta + i\cot\theta\,\partial_\phi)$ and the ladder relation $L_+Y_{\ell m} = \sqrt{(\ell-m)(\ell+m+1)}Y_{\ell,m+1}$. The ratio $R_{\ell m}/Y_{\ell,m+1}$ acquires an extra $1/\sin\theta$ factor that introduces a non-removable singularity at $\theta=0$. Explicit verification at $\ell=1$, $m=0$ gives $R_{10}/Y_{11} = \sqrt{2}/\sin\theta \to \infty$.

**Conclusion: False**

**Other files:**
- [1180dd83.md](https://github.com/igorratn/coyote-math/blob/main/1180dd83.md): Modified orthogonality of Legendre polynomials with weight $w(\theta)=\cos\theta$; uses three-term recurrence $xP_k(x) = \frac{k+1}{2k+1}P_{k+1} + \frac{k}{2k+1}P_{k-1}$ to show obstruction at $n=2$. **False**

---

## Cluster 3: Wigner 3j Symbol Selection Rules

**Total files: 2**

These problems use parity selection rules of Wigner 3j symbols to determine when Clebsch-Gordan coefficients vanish, connecting to zeros of Hahn polynomials.

---

### 3.1 Parity Rule & Orthogonality Constraints

**Total files: 2**

#### 3.1.1 Vanishing via Odd Parity Sum

**Total files: 2**

**Typical Example: [2f5da8d9.md](https://github.com/igorratn/coyote-math/blob/main/2f5da8d9.md)**

Let the Clebsch-Gordan coefficient $\langle 1,0;2,0\mid 2,0\rangle$ be given. Determine whether this value corresponds to a root of the associated Hahn polynomial in the discrete variable $x = j_1 - m_1$.

**Solution Methodology:** Converts the CG coefficient to a Wigner 3j symbol using $\langle j_1,m_1,j_2,m_2\mid j_3,m_3\rangle \propto (-1)^{j_1-j_2+m_3}\sqrt{2j_3+1}\begin{pmatrix}j_1&j_2&j_3\\m_1&m_2&-m_3\end{pmatrix}$. Applies the parity rule: for integer $j_1,j_2,j_3$ with all $m_i=0$, the symbol vanishes if $j_1+j_2+j_3$ is odd. Since $1+2+2=5$ is odd, the 3j symbol vanishes. In the Hahn-polynomial representation, zeros of CG coefficients correspond to roots of the associated Hahn polynomial.

**Conclusion: True**

**Other files:**
- [4a8d987a.md](https://github.com/igorratn/coyote-math/blob/main/4a8d987a.md): Half-integer case with same parity selection rule. **True**

---

## Cluster 4: Hahn & Dual-Hahn Polynomial Structure

**Total files: 4**

These problems analyze the polynomial structure of Clebsch-Gordan coefficients, exploiting their representation as Hahn and dual-Hahn polynomials satisfying three-term recurrence relations.

---

### 4.1 Hahn Polynomial Zeros & Recurrences

**Total files: 4**

#### 4.1.1 First-Degree Polynomial Analysis

**Total files: 4**

**Typical Example: [e81395f5.md](https://github.com/igorratn/coyote-math/blob/main/e81395f5.md)**

Let $\langle j_1,m_1,j_2,m_2\mid j-1,j-1\rangle$ with $m_3 = m_1+m_2 = j-1$. Determine whether there exist allowed quantum numbers for which the dependence on $x = j_1-m_1$ vanishes.

**Solution Methodology:** Expresses the CG coefficient as $C(j_1,j_2,j)\,h_1(x)$ where $h_1(x)$ is a first-degree Hahn polynomial. CG coefficients as functions of quantum numbers satisfy three-term recurrence relations identical to discrete orthogonal Hahn polynomials. The zero-crossing condition $h_1(j_1-m_1)=0$ yields an explicit constraint. For $j_1=j_2=j=1$: $h_1(x)=2x-2$, so $x=1 \Rightarrow m_1=0$. The quantum numbers $(1,1,1,0,0)$ satisfy all coupling rules, and $\langle 1,0,1,0\mid 0,0\rangle = 0$.

**Conclusion: True**

**Other files:**
- [de74e827.md](https://github.com/igorratn/coyote-math/blob/main/de74e827.md): Dual-Hahn three-term difference equation with explicit coefficients. **True**
- [e44537ea.md](https://github.com/igorratn/coyote-math/blob/main/e44537ea.md): First-degree Hahn polynomial in stretched sector. **True**
- [a050c5dc.md](https://github.com/igorratn/coyote-math/blob/main/a050c5dc.md): Extended analysis with integer and half-integer cases. **True**

---

## Cluster 5: Asymptotic Correspondence Hahn → Jacobi

**Total files: 1**

### 5.1 Large-$j$ Asymptotics

**Total files: 1**

#### 5.1.1 Hahn-Jacobi Correspondence via Szego Formula

**Total files: 1**

**Typical Example: [3c1c8b15.md](https://github.com/igorratn/coyote-math/blob/main/3c1c8b15.md)**

Studies large-$j$ asymptotic expansion of CG coefficients via the Hahn-Jacobi correspondence.

**Solution Methodology:** Uses the Askey-Wilson scheme mapping: as $N\to\infty$, Hahn polynomials $Q_n^{(\alpha,\beta)}(x;N)$ converge to Jacobi polynomials $P_n^{(\alpha,\beta)}(t)$ under appropriate scaling $x = N(1-t)/2$. The Szego formula provides the asymptotic phase shift $-3\pi/4$. This reflects the quantum-to-classical transition where discrete angular momentum coupling approaches continuous rotation group behavior.

**Conclusion: True**

---

## Cluster 6: 6j Symbols & Racah Polynomials

**Total files: 2**

These problems analyze Wigner 6j symbols through triangle inequalities, the Racah formula, and connections to Racah polynomials.

---

### 6.1 Triangle Inequalities & Racah Formula

**Total files: 2**

#### 6.1.1 Enumeration & Argument Transformation

**Total files: 2**

**Typical Example: [f94b00ef.md](https://github.com/igorratn/coyote-math/blob/main/f94b00ef.md)**

Studies the Wigner 6j symbol $\{2,2,x;2,2,1\}$; enumerates allowed values of $x$ and counts interior zeros.

**Solution Methodology:** Applies triangle inequalities to the four triangles formed by the six angular momenta: $(j_1,j_2,j_3)$, $(j_1,j_5,j_6)$, $(j_4,j_2,j_6)$, $(j_4,j_5,j_3)$. For each allowed $x$, evaluates the Racah formula (a single sum over products of factorials expressible as ${}_4F_3(1)$ hypergeometric function). Determines which values yield zero from the polynomial structure.

**Conclusion: Answer is 0 (zero interior zeros)**

**Other files:**
- [31001068.md](https://github.com/igorratn/coyote-math/blob/main/31001068.md): Racah-to-Jacobi argument transformation via Nikiforov-Suslov-Uvarov (NSU) formula. **True**

---

## Cluster 7: Discrete Polynomial Structural Properties

**Total files: 2**

These problems study structural properties of discrete orthogonal polynomial systems (Jacobi matrices, difference equation classifications) underlying angular momentum coupling.

---

### 7.1 Jacobi Matrix & Difference Equation Analysis

**Total files: 2**

#### 7.1.1 Symmetry & Degree Conditions

**Total files: 2**

**Typical Example: [bd24c6fc.md](https://github.com/igorratn/coyote-math/blob/main/bd24c6fc.md)**

Studies a symmetry claim for the Jacobi (tridiagonal) matrix associated with discrete orthogonal polynomials in angular momentum coupling.

**Solution Methodology:** Examines the tridiagonal matrix $\mathcal{J}$ whose eigenvalue equation encodes the three-term recurrence relation for coupling coefficients. The claim asserts a specific symmetry property. Analysis reveals a logical flaw in the sufficiency argument: the necessary condition holds but the converse direction fails.

**Conclusion: False**

**Other files:**
- [c617c526.md](https://github.com/igorratn/coyote-math/blob/main/c617c526.md): Degree conditions for Racah polynomial difference equations; classifies when the difference equation admits polynomial solutions. **True**

---

## Summary Table

| Problem | Cluster | Method | Conclusion |
|---------|---------|--------|------------|
| 0b5cd3f3 | 1. d-Matrix | Selection rule at $\beta=\pi$ | False |
| fe4dc745 | 1. d-Matrix | Parity counterexample | False |
| 07d41e49 | 2. Operators | Raising operator singular limit | False |
| 1180dd83 | 2. Operators | Modified orthogonality via recurrence | False |
| 2f5da8d9 | 3. 3j Rules | Parity rule (integer) | True |
| 4a8d987a | 3. 3j Rules | Parity rule (half-integer) | True |
| e81395f5 | 4. Hahn/Dual-Hahn | First-degree Hahn zero | True |
| de74e827 | 4. Hahn/Dual-Hahn | Dual-Hahn recurrence | True |
| e44537ea | 4. Hahn/Dual-Hahn | Stretched sector Hahn | True |
| a050c5dc | 4. Hahn/Dual-Hahn | Integer/half-integer cases | True |
| 3c1c8b15 | 5. Asymptotics | Hahn→Jacobi, Szego formula | True |
| f94b00ef | 6. 6j Symbols | Triangle inequalities, Racah formula | 0 |
| 31001068 | 6. 6j Symbols | Racah→Jacobi mapping (NSU) | True |
| bd24c6fc | 7. Structural | Jacobi matrix symmetry | False |
| c617c526 | 7. Structural | Difference equation degree | True |

---

## Connections to N-U Book (Chapter V, §26)

| Section | Topic | Related Files |
|---------|-------|---------------|
| §26.5 | Clebsch-Gordan coefficients, 3j symbols | 2f5da8d9, 4a8d987a, e81395f5, a050c5dc |
| §26.6 | Racah formula for 6j symbols | f94b00ef, 31001068 |
| §12.4 | Hahn polynomials | e81395f5, de74e827, e44537ea, 3c1c8b15 |
| §12 | Racah polynomials, orthogonality | bd24c6fc, c617c526 |
| §10 | Spherical harmonics, angular momentum operators | 07d41e49, 1180dd83, 0b5cd3f3 |
| §19.2 | Asymptotic formulas | 3c1c8b15 |

Cross-references to other clusters:
- **Spherical Harmonics:** 07d41e49, 1180dd83 (operator identities overlap)
- **Orthogonal Polynomials:** 3c1c8b15 (Hahn→Jacobi limit)
- **Racah/Discrete Polynomials:** bd24c6fc, c617c526, 31001068

---

## Quality Control Checklist

- [x] All 15 files identified and categorized (3 original + 12 addendum)
- [x] All file IDs verified as existing in repository
- [x] Methodology-based clustering (not keyword-based)
- [x] "Typical Example" format for first file in each #### method section
- [x] One-line descriptions for remaining files
- [x] File counts at every level sum to 15
- [x] Cross-references to N-U book sections
- [x] Summary statistics table included
- [x] Each file appears exactly once
- [x] No phantom/hallucinated file IDs

---

**End of Angular Momentum Clustering Document**
