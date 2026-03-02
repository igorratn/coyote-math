# Sine-Gordon & Nonlinear Waves: Comprehensive Clustering by Solution Methodology

**Total files: 12**
**Date: March 2, 2026**

This document clusters all sine-Gordon and nonlinear wave problems based on their **solution methodology**. All problems involve the damped or undamped sine-Gordon equation in physical contexts (Josephson junctions, DNA torsional dynamics, ferromagnets, charge density waves, etc.).

---

## Overview

The problems share a common structure: the sine-Gordon equation $\Theta_{tt} + \alpha\Theta_t - \Theta_{xx} + \sin\Theta = 0$ (damped, $\alpha > 0$) or $\Theta_{tt} - \Theta_{xx} + \sin\Theta = 0$ (undamped), with spatially uniform initial data $\Theta(x,0) = \Theta_0$, $\Theta_t(x,0) = 0$. The key question is always: what is $\lim_{t\to\infty}\Theta(x,t)$?

---

## Cluster 1: Damped Sine-Gordon Equilibrium Analysis

**Total files: 8**

These problems reduce the PDE to a single-pendulum ODE via spatial uniformity, then use energy dissipation arguments to determine which stable equilibrium ($2n\pi$) the system relaxes to.

---

### 1.1 Spatially Uniform Reduction to ODE with Energy Dissipation

**Total files: 8**

#### 1.1.1 Energy Landscape and Barrier Analysis

**Total files: 8**

**Typical Example: [989a8a47.md](https://github.com/igorratn/coyote-math/blob/main/989a8a47.md)**

In a long Josephson junction, the gauge-invariant phase $\Theta(x,t)$ obeys the damped sine-Gordon equation $\Theta_{tt}+\alpha\Theta_t-\Theta_{xx}+\sin\Theta=0$ on $x\in\mathbb{R}$, where $\alpha>0$ represents weak dissipation. The system is prepared at rest with a uniform near-hilltop bias $\Theta_t(x,0)=0$ and $\Theta(x,0)=3\pi-\varepsilon$, where $\varepsilon>0$ is arbitrarily small and spatially uniform. Determine whether $\lim_{t\to+\infty}\Theta(x,t)=2\pi$ holds.

**Solution Methodology:** For spatially uniform initial data, the field is invariant in $x$ and reduces to the single-pendulum ODE $\vartheta_{tt}+\alpha\vartheta_t+\sin\vartheta=0$. Since $\vartheta(0)=3\pi-\varepsilon$ lies slightly below the unstable equilibrium at $3\pi$, the restoring torque $\sin\vartheta<0$ drives the field downward. Dissipation removes kinetic energy monotonically via $\dot{E}=-\alpha\vartheta_t^2\le0$, preventing the system from crossing the next barrier at $4\pi$. The field must relax to the nearest stable minimum, which is $2\pi$. Total energy decay combined with spatial uniformity ensures asymptotic approach to this minimum.

**Conclusion: True**

**Other files:**
- [34b8ebad.md](https://github.com/igorratn/coyote-math/blob/main/34b8ebad.md): DNA torsional dynamics, $\Theta(x,0)=3\pi+\varepsilon$; initial condition above the unstable peak, overshoots to $4\pi$. **True**
- [98a2ead0.md](https://github.com/igorratn/coyote-math/blob/main/98a2ead0.md): Ferroelectric system, $\Theta(x,0)=7\pi/8$; insufficient energy to clear $\pi$ barrier, relaxes to $0$. **True**
- [b1b7ad37.md](https://github.com/igorratn/coyote-math/blob/main/b1b7ad37.md): Charge density wave, $\Theta(x,0)=5\pi+\pi/4$; enough upward energy to reach $6\pi$. **True**
- [c9135c09.md](https://github.com/igorratn/coyote-math/blob/main/c9135c09.md): Ferromagnetic system, $\Theta(x,0)=3\pi/4$; cannot clear $\pi$ barrier, relaxes to $0$. **True**
- [de514810.md](https://github.com/igorratn/coyote-math/blob/main/de514810.md): Frenkel-Kontorova model, $\Theta(x,0)=\pi+\varepsilon$; trapped in $(\pi,3\pi)$ well, relaxes to $2\pi$. **True**
- [edbc87d5.md](https://github.com/igorratn/coyote-math/blob/main/edbc87d5.md): Superfluid ring, $\Theta(x,0)=\pi+\varepsilon$; upward motion insufficient to backtrack over $\pi$. **True**
- [ee4bc277.md](https://github.com/igorratn/coyote-math/blob/main/ee4bc277.md): Coupled pendula, $\Theta(x,0)=7\pi/4$; upward toward $2\pi$ well. **True**

---

## Cluster 2: Undamped Sine-Gordon with Energy Conservation & Kink Analysis

**Total files: 2**

These problems analyze the undamped case ($\alpha=0$) where energy is strictly conserved, using linearization for instability analysis and topological conservation (winding number) to constrain the dynamics.

---

### 2.1 Linearization, Topological Conservation, and Winding Number

**Total files: 2**

#### 2.1.1 Conserved Energy Near Unstable Equilibria

**Total files: 2**

**Typical Example: [8fac80e9.md](https://github.com/igorratn/coyote-math/blob/main/8fac80e9.md)**

For undamped sine-Gordon near an unstable peak $\Theta(x,0)=3\pi+\varepsilon$ with conserved energy, determine the asymptotic state, considering linearization for instability and topological conservation via winding number $N$.

**Solution Methodology:** Without damping, energy is strictly conserved. Linearization about the unstable equilibrium $3\pi$ reveals exponentially growing modes, confirming dynamical instability. The winding number $N=0$ (initial uniform winding) is topologically protected, preventing kink-pair formation (which would cost energy $2M_K=16$ with kink mass $M_K=8$). The field cannot relax to a true vacuum but instead radiates excess energy and settles to the nearest accessible equilibrium consistent with $N=0$.

**Conclusion: False** (the field relaxes to $4\pi$ with intermediate radiation dynamics)

**Other files:**
- [d75ab6e0.md](https://github.com/igorratn/coyote-math/blob/main/d75ab6e0.md): Similar analysis with $\Theta(x,0)=3\pi-\varepsilon$; relaxes to $2\pi$. **False**

---

## Cluster 3: Acoustic Wave / Helmholtz Green's Function

**Total files: 1**

### 3.1 Fourier Transform Methods

**Total files: 1**

#### 3.1.1 Modified Helmholtz Green's Function

**Total files: 1**

**Typical Example: [2c968d24.md](https://github.com/igorratn/coyote-math/blob/main/2c968d24.md)**

Modified Helmholtz equation $p'' - \omega^2 p = -4\pi\delta(x-a)$.

**Solution Methodology:** Applies Fourier transform to reduce to algebraic equation, yielding the Green's function $p(x) = \frac{2\pi}{\omega}e^{-\omega|x-a|}$. Evaluates at the source point to obtain the final answer.

**Conclusion:** $p(a) = 2\pi/\omega$

---

## Cluster 4: Static ODE & Phase Plane Analysis

**Total files: 1**

### 4.1 Phase Portrait Methods

**Total files: 1**

#### 4.1.1 Separatrix Structure for Static Solutions

**Total files: 1**

**Typical Example: [7132b649.md](https://github.com/igorratn/coyote-math/blob/main/7132b649.md)**

Static sine-Gordon ODE with $\Theta(0)=5\pi/2$; determine $\Theta(+\infty)$.

**Solution Methodology:** For static solutions ($\Theta_t = 0$), the PDE reduces to $\Theta_{xx} = \sin\Theta$, a conservative ODE. Analyze the phase portrait $(\Theta, \Theta')$ which has the structure of a pendulum. The separatrix curves connect unstable equilibria at odd multiples of $\pi$. From the initial condition $\Theta(0)=5\pi/2$ (between $2\pi$ and $3\pi$), the phase portrait determines which equilibrium the trajectory approaches as $x\to+\infty$.

**Conclusion:** $\Theta(+\infty) = 3\pi$

---

## Summary Table

| Problem | Cluster | Physical System | Initial $\Theta_0$ | Damped? | Limit |
|---------|---------|----------------|-------------------|---------|-------|
| 989a8a47 | 1. Damped | Josephson junction | $3\pi-\varepsilon$ | Yes | $2\pi$ (True) |
| 34b8ebad | 1. Damped | DNA torsion | $3\pi+\varepsilon$ | Yes | $4\pi$ (True) |
| 98a2ead0 | 1. Damped | Ferroelectric | $7\pi/8$ | Yes | $0$ (True) |
| b1b7ad37 | 1. Damped | Charge density wave | $5\pi+\pi/4$ | Yes | $6\pi$ (True) |
| c9135c09 | 1. Damped | Ferromagnet | $3\pi/4$ | Yes | $0$ (True) |
| de514810 | 1. Damped | Frenkel-Kontorova | $\pi+\varepsilon$ | Yes | $2\pi$ (True) |
| edbc87d5 | 1. Damped | Superfluid ring | $\pi+\varepsilon$ | Yes | $2\pi$ (True) |
| ee4bc277 | 1. Damped | Coupled pendula | $7\pi/4$ | Yes | $2\pi$ (True) |
| 8fac80e9 | 2. Undamped | Generic | $3\pi+\varepsilon$ | No | $4\pi$ (False) |
| d75ab6e0 | 2. Undamped | Generic | $3\pi-\varepsilon$ | No | $2\pi$ (False) |
| 2c968d24 | 3. Helmholtz | Acoustic wave | — | — | $2\pi/\omega$ |
| 7132b649 | 4. Static | Phase plane | $5\pi/2$ | — | $3\pi$ |

---

## Quality Control Checklist

- [x] All 12 files identified and categorized
- [x] All file IDs verified as existing in repository
- [x] Methodology-based clustering (not keyword-based)
- [x] "Typical Example" format for first file in each #### method section
- [x] One-line descriptions for remaining files
- [x] File counts at every level sum to 12
- [x] Summary statistics table included
- [x] Each file appears exactly once
- [x] No phantom/hallucinated file IDs

---

**End of Sine-Gordon Clustering Document**
