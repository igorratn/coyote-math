# Differential Geometry: Comprehensive Clustering by Solution Methodology

**Total files: 9**
**Date: March 2, 2026**

This document clusters all differential geometry problems: hyperbolic geometry, surface curves, and flat tori.

**Note:** 7 of these problems have associated figure files (`{id}-i.jpg`, `{id}-i.pdf`, `{id}-i.tex`).

---

## Overview

This cluster contains problems from:
- **Hyperbolic & Constant Curvature Geometry** (3 files): Gauss-Bonnet theorem, Poincare disk, holonomy
- **Surface Curves & Differential Invariants** (3 files): Darboux frame, geodesic curvature/torsion, Weingarten map
- **Flat Tori & Geodesics** (3 files): quotient spaces, parallel transport, geodesic optimization

---

## Cluster 1: Hyperbolic & Constant Curvature Geometry

**Total files: 3**

Problems involving the Gauss-Bonnet theorem, Poincare disk metric, and curvature computations on surfaces of constant curvature.

---

### 1.1 Gauss-Bonnet and Metric Computations

**Total files: 3**

#### 1.1.1 Angle Deficit and Distance Formulas

**Total files: 3**

**Typical Example: [2deb9b93.md](https://github.com/igorratn/coyote-math/blob/main/2deb9b93.md)** | Figure: [2deb9b93-i.jpg](https://github.com/igorratn/coyote-math/blob/main/2deb9b93-i.jpg)

What is the hyperbolic area of the figure bounded by $OP$, $OQ$, and the curve $PQ$, inside the unit disk with the hyperbolic metric? Give your final answer as a rational multiple of $\pi$.

**Solution Methodology:** Work in the Poincare disk where Euclidean and hyperbolic angles coincide. Identify the orthogonal geometry: the diameters $OP$ and $OQ$ meet at right angle, so $\angle O = \pi/2$. Use symmetry across $y=x$ to establish equal base angles $\angle P = \angle Q = \theta$. Apply the orthogonality condition for the geodesic arc $PQ$ to determine point locations (e.g., $a^2 = 2-\sqrt{3}$). Compute the angle via $\cos\theta = \frac{a^2+1}{2\sqrt{a^4+1}}$, yielding $\theta = \pi/6$. Apply the Gauss-Bonnet formula for constant curvature $-1$: $\text{Area} = \pi - (\angle O + \angle P + \angle Q)$.

**Conclusion:** Area $= \pi - (\pi/2 + \pi/6 + \pi/6) = \pi/6$.

**Other files:**
- [f14b7ce3.md](https://github.com/igorratn/coyote-math/blob/main/f14b7ce3.md) | Figure: [poincare_AB_asymmetric-i.tex](https://github.com/igorratn/coyote-math/blob/main/poincare_AB_asymmetric-i.tex): Hyperbolic distance between $A=(2/5,1/5)$ and $B=(-1/5,3/5)$ in Poincaré disk. **Answer: 1.82**
- [bca2a699.md](https://github.com/igorratn/coyote-math/blob/main/bca2a699.md) | Figure: [bca2a699-i.jpg](https://github.com/igorratn/coyote-math/blob/main/bca2a699-i.jpg): Holonomy on surface with $K=2$. **Answer: $-0.685$**

---

## Cluster 2: Surface Curves & Differential Invariants

**Total files: 3**

Problems computing geodesic curvature, normal curvature, and geodesic torsion of curves on surfaces using the Darboux frame and Weingarten map.

---

### 2.1 Darboux Frame and Geodesic Torsion-Curvature Computation

**Total files: 3**

#### 2.1.1 Intersection Curve Invariants

**Total files: 3**

**Typical Example: [aad144ac.md](https://github.com/igorratn/coyote-math/blob/main/aad144ac.md)**

Compute the geodesic torsion of the intersection curve $\gamma(t) = (1, t, 1+t^2)$ at point $P = (1,1,2)$ on the surface $z = x^2 + y^2$ (intersected with the plane $x=1$).

**Solution Methodology:** Construct the Darboux frame: unit tangent $T$, unit surface normal $N$, and surface binormal $U = T \times N$ along the curve. Differentiate the normal field along the curve and apply the Darboux equations $N_s = -k_n T - \tau_g U$ to extract the geodesic torsion component. This requires computing the shape operator (Weingarten map) of the surface at $P$ and projecting onto the appropriate frame vectors.

**Conclusion:** $\tau_g(P) = 8/45$.

**Other files:**
- [9129831b.md](https://github.com/igorratn/coyote-math/blob/main/9129831b.md) | Figure: [9129831b-i.jpg](https://github.com/igorratn/coyote-math/blob/main/9129831b-i.jpg): Signed geodesic curvature of intersection curve. **Answer: $-5/4$**
- [616131bf.md](https://github.com/igorratn/coyote-math/blob/main/616131bf.md) | Figure: [616131bf-i.jpg](https://github.com/igorratn/coyote-math/blob/main/616131bf-i.jpg): Geodesic curvature, normal curvature, and geodesic torsion of intersection curve between two surfaces via Darboux frame differentiation.

---

## Cluster 3: Flat Tori & Geodesics

**Total files: 3**

Problems involving geodesic identification, parallel transport, and path optimization on flat tori constructed as quotient spaces $\mathbb{R}^2/\Lambda$.

---

### 3.1 Geodesic Identification and Parallel Transport on Quotient Spaces

**Total files: 3**

#### 3.1.1 Lattice Geometry and Holonomy

**Total files: 3**

**Typical Example: [6587534d.md](https://github.com/igorratn/coyote-math/blob/main/6587534d.md)** | Figure: [6587534d-i.jpg](https://github.com/igorratn/coyote-math/blob/main/6587534d-i.jpg)

Geodesic identification on flat torus from quotient geometry.

**Solution Methodology:** Lifts geodesics to the universal cover $\mathbb{R}^2$, where they become straight lines (zero Gaussian curvature). Closed geodesics correspond to straight lines connecting lattice-equivalent points. The identification pattern depends on the lattice generators and the direction of travel. For parallel transport, flatness implies trivial holonomy around contractible loops, but nontrivial topology can produce holonomy for non-contractible paths depending on the lattice structure.

**Other files:**
- [a64df3e0.md](https://github.com/igorratn/coyote-math/blob/main/a64df3e0.md) | Figure: [a64df3e0-i.jpg](https://github.com/igorratn/coyote-math/blob/main/a64df3e0-i.jpg): Longest path on rhombic torus via geodesic length optimization. **Answer: E**
- [c7441c68.md](https://github.com/igorratn/coyote-math/blob/main/c7441c68.md) | Figure: [c7441c68-i.jpg](https://github.com/igorratn/coyote-math/blob/main/c7441c68-i.jpg): Parallel transport and holonomy on flat torus (trivial, zero angle).

---

## Associated Figure Files

| Problem | Image | TeX Source |
|---------|-------|-----------|
| 2deb9b93 | `2deb9b93-i.jpg` | `2deb9b93-i.tex` |
| bca2a699 | `bca2a699-i.jpg` | `bca2a699-i.tex` |
| 9129831b | `9129831b-i.jpg` | `9129831b-i.tex` |
| 616131bf | `616131bf-i.jpg` | `616131bf-i.tex` |
| 6587534d | `6587534d-i.jpg` | `6587534d-i.tex` |
| a64df3e0 | `a64df3e0-i.jpg` | `a64df3e0-i.tex` |
| c7441c68 | `c7441c68-i.jpg` | `c7441c68-i.tex` |

| f14b7ce3 | `poincare_AB_asymmetric-i.tex`* | *(non-standard naming)* |

\* `f14b7ce3` uses a descriptive filename instead of the `{id}-i.*` convention.

---

## Summary Table

| Problem | Cluster | Method | Image | Answer |
|---------|---------|--------|-------|--------|
| 2deb9b93 | 1. Hyperbolic | Gauss-Bonnet, Poincare disk | Yes | $\pi/6$ |
| f14b7ce3 | 1. Hyperbolic | Hyperbolic distance | Yes* | 1.82 |
| bca2a699 | 1. Hyperbolic | Holonomy, constant $K$ | Yes | $-0.685$ |
| aad144ac | 2. Surface curves | Darboux frame, geodesic torsion | No | $8/45$ |
| 9129831b | 2. Surface curves | Signed geodesic curvature | Yes | $-5/4$ |
| 616131bf | 2. Surface curves | Weingarten map, intersection | Yes | — |
| 6587534d | 3. Flat tori | Quotient geodesics | Yes | — |
| a64df3e0 | 3. Flat tori | Geodesic length optimization | Yes | E |
| c7441c68 | 3. Flat tori | Parallel transport, holonomy | Yes | 0 |

---

## Quality Control Checklist

- [x] All 9 files identified and categorized
- [x] All file IDs verified as existing in repository
- [x] Methodology-based clustering (not keyword-based)
- [x] "Typical Example" format for first file in each #### method section
- [x] One-line descriptions for remaining files
- [x] File counts at every level sum to 9
- [x] Figure files documented
- [x] Each file appears exactly once
- [x] No phantom/hallucinated file IDs

---

**End of Differential Geometry Clustering Document**
