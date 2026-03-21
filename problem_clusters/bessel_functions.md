# Bessel Functions: Comprehensive Clustering by Solution Methodology

**Total files discovered: 22**
**Total files verified: 22**
**Date: March 2, 2026**
**Last update: March 19, 2026 — Added 7edc37eb.md (weighted squared Kapteyn sum)**

This document clusters all Bessel function problems based on their **solution methodology**, not topic keywords.

---

## Update Notes

**March 11, 2026:**
- **0af97337.md** — Added. Graf's addition theorem: analytic continuation of a function does not preserve a divergent series representation. Cluster 1.9.2.
- **91a25388.md** — Problem updated. Now covers the Neumann addition theorem and its incorrect analogue for modified Bessel functions. Cluster 1.9.1.

**March 4, 2026:**
- **915f73d1.md** — Langer uniform vs Debye pointwise asymptotics for $J_\nu(\nu z)$ (Cluster 1.6.2)

**January 30, 2026:**
- **6e8de21e.md** — Hankel function uniqueness from asymptotic behavior (Cluster 1.7)
- **af454602.md** — Uniform asymptotic bounds near branch cut (Cluster 1.8)
- **5c3333ea.md** — Bessel product integral convergence (Cluster 1.10)
- **57cd7bd6.md** — Poisson integral vs Bessel function comparison (Cluster 1.11)
- **f33dd204.md** — Analytic continuation of Poisson integral (Cluster 1.11)

**Original files:**
- 005a9124.md, 1cfc14a7.md, 300a11f2.md, 4db0af8d.md, 89e30655.md, 87879ef3.md, 91a25388.md

**March 15, 2026:**
- **016629d1.md** — Order-derivative identity: ∂J_ν/∂ν|_{ν=n} = (π/2)Y_n(z) (Cluster 1.12)

- **e878374b.md** — Modified Bessel product bound: I_ν(x)K_ν(x) ≤ 1/(2√(ν²+x²)) (Cluster 1.13)

**March 16, 2026:**
- **f09a765d.md** — Kelvin function Wronskian combination: W₁(x) - W₂(x) claimed = 1/x (False, = -1/x). 4/4 models stumbled. Cluster 1.14.

- **c23294e1.md** — Rayleigh sum σ₄(ν): claimed simple pattern from σ₁,σ₂,σ₃ breaks at s=4 (False, correct formula has numerator 5ν+11). 3/4 models stumbled (wrong formulas despite correct verdict). Cluster 1.15.

- **77edf9d1.md** — Kapteyn exponential Φ_K(x): claimed exp(2∑J_n(nx)/n) = 1/(1-x) (False, x³ coefficient mismatch 1/8≠1/6). 4/4 models stumbled (all said True). Cluster 1.16.

- **416a3c0f.md** — Kapteyn-Bessel antiderivative: claimed ∑F_n(a) = ½[(1-a)ln(1-a)+a] (False, reduces to ∑J_n(nt)/n ≠ -½ln(1-t) via x³ coefficient 1/8≠1/6). 4/4 models stumbled (all said True). Cluster 1.17.

- **8ac6e061.md** — Bessel triangle functional: B(a,b,c) = 2πA·∫J₀³dt claimed = 1 (False, homogeneous degree 1; models confuse dt with t dt measure). 4/4 stumbled. Cluster 1.18.

**March 19, 2026:**
- **7edc37eb.md** — Weighted squared Kapteyn sum $\mathcal{K}(x) = \sum [J_n(nx)]^2/n$: claimed $= x^2/(4-x^2)$ (False, $x^6$ coefficient mismatch $11/384 \neq 1/64$). 2/4 models stumbled (both said True via unverified Taylor assertions). Cluster 1.16.3.

**Total count: 23 Bessel function problems.**

---

## Cluster 1: Bessel Functions and Modified Bessel Functions

**Total files: 21**

This cluster contains all problems involving Bessel functions $J_\nu(z)$, modified Bessel functions $I_\nu(z)$, $K_\nu(z)$, Neumann functions $Y_\nu(z)$, Hankel functions $H_\nu^{(1)}(z)$, $H_\nu^{(2)}(z)$, and related inhomogeneous equations (Lommel). These arise from separation of variables in cylindrical coordinates, asymptotic limits of special functions, and analytic continuation.

---

### 1.1 Inhomogeneous Differential Equations with Forcing Terms

**Total files: 1**

#### 1.1.1 Asymptotic Expansion Analysis with Growth Comparison

[1cfc14a7.md](https://github.com/igorratn/coyote-math/blob/main/1cfc14a7.md) — Lommel's equation $z^2 u'' + zu' + (z^2-\nu^2)u = z^{s+1}$ with $s = \nu+2n$. The particular solution satisfies $u_p(z) \sim z^{\nu+2n-1}\sum a_k z^{-2k}$.

**Claim:** $|u_p(z)| \le C z^{\nu+2n-1}$ for large $z$.

**Solution Methodology:** Set $\alpha = \nu+2n-1 > 0$. The $k=0$ truncation gives $u_p = z^\alpha(a_0+o(1))$, establishing the bound. Any other particular solution adds $AJ_\nu + BY_\nu = O(z^{-1/2})$, which is dominated by $z^\alpha$ for large $z$.

**Conclusion:** True

---

### 1.2 Analytic Theory of Modified Differential Equations

**Total files: 1**

#### 1.2.1 Frobenius Method with Wronskian Verification

[300a11f2.md](https://github.com/igorratn/coyote-math/blob/main/300a11f2.md) — Modified Bessel equation $z^2v''+zv'-(z^2+\nu^2)v=0$ with $I_\nu(z)=e^{-i\pi\nu/2}J_\nu(iz)$, $K_\nu(z) = \frac{\pi}{2\sin(\pi\nu)}[I_{-\nu}-I_\nu]$.

**Claim:** For non-integer $\nu>0$, $\{I_\nu, I_{-\nu}\}$ is a complete basis and $K_\nu$ is their linear combination.

**Solution Methodology:** Frobenius theory at $z=0$ gives indicial exponents $\pm\nu$; for non-integer $\nu$ these differ by a non-integer, guaranteeing two independent solutions. Wronskian $W[I_\nu,I_{-\nu}] = -2\sin(\pi\nu)/(\pi z) \neq 0$ confirms the basis.

**Conclusion:** True

---

### 1.3 Asymptotic Connections Between Function Classes

**Total files: 1**

#### 1.3.1 High-Degree Limit with Coordinate System Transformation

[87879ef3.md](https://github.com/igorratn/coyote-math/blob/main/87879ef3.md) — Define $M_\ell^m(\theta) = \ell^{-m}P_\ell^m(\cos(\theta/\ell))$.

**Claim:** $\lim_{\ell\to\infty} M_\ell^m(\theta) = \theta^m/(2^m m!)$.

**Solution Methodology:** Mehler-Heine formula gives $\lim_{\ell\to\infty}\ell^{-m}P_\ell^m(\cos(\theta/\ell)) = (\theta/2)^m J_m(\theta)$. At $m=0$, $\theta=\pi/2$: claim gives $1$, correct answer is $J_0(\pi/2)\approx 0.472$.

**Conclusion:** False

---

### 1.4 Orthogonality and Sturm-Liouville Theory

**Total files: 1**

#### 1.4.1 Singular Endpoint Analysis with Lagrange Identity

[005a9124.md](https://github.com/igorratn/coyote-math/blob/main/005a9124.md) — Define $I_k = \int_0^1 x J_\nu(j_{\nu,k}x)J_\nu(j_{\nu,k+1}x)\,dx$.

**Claim:** Sturm-Liouville orthogonality gives $I_k = 0$.

**Solution Methodology:** $J_\nu(j_{\nu,k}x)$ and $J_\nu(j_{\nu,k+1}x)$ are eigenfunctions of different operators (different eigenvalue scalings), so orthogonality does not apply. Explicit counterexample with $\nu=1/2$ confirms $I_k\neq 0$.

**Conclusion:** False

---

### 1.5 Zero Distribution and Phase Analysis

**Total files: 1**

#### 1.5.1 Wronskian-Based Local Analysis Near Zeros

[4db0af8d.md](https://github.com/igorratn/coyote-math/blob/main/4db0af8d.md) — Define $\psi_k(z) = J_\nu(z)/(z-j_{\nu,k})$.

**Claim:** $\psi_k$ has exactly one zero in $(j_{\nu,k}, j_{\nu,k+1})$.

**Solution Methodology:** Removable singularity resolved by L'Hôpital; $\psi_k(j_{\nu,k}) = J_\nu'(j_{\nu,k})\neq 0$. Wronskian $W[J_\nu,Y_\nu]=2/(\pi z)$ and asymptotic zero spacing $j_{\nu,k+1}-j_{\nu,k}\to\pi$ confirm exactly one sign change per interval.

**Conclusion:** True

---

### 1.6 Large Parameter Asymptotics and Exponential Growth

**Total files: 2**

#### 1.6.1 Series Analysis with Stirling's Formula

[89e30655.md](https://github.com/igorratn/coyote-math/blob/main/89e30655.md) — For $\beta>1$ fixed and $n\to\infty$: $I_n(n\beta) = O(e^{n(\beta-\sqrt{\beta^2-1})})$.

**Solution Methodology:** Identity $I_n(z)=i^{-n}J_n(iz)$, Debye large-order approximation, and Hankel asymptotic expansion for $I_n(n\beta)$ with $\beta>1$. Hyperbolic phase $\eta=\sqrt{\beta^2-1}-\operatorname{arcosh}(\beta)$ matches the claimed bound via Stirling.

**Conclusion:** True

---

#### 1.6.2 Uniform vs Pointwise Asymptotic Agreement

[915f73d1.md](https://github.com/igorratn/coyote-math/blob/main/915f73d1.md) — For fixed $z>0$, $z\ne 1$: do Debye and Langer uniform asymptotics for $J_\nu(\nu z)$ agree to leading order as $\nu\to\infty$?

**Solution Methodology:** Large-argument Airy asymptotics substituted into the Langer–Olver expansion recover the Debye evanescent formula ($z<1$) and oscillatory formula ($z>1$). Ratio tends to 1 in both regions.

**Conclusion:** True

---

### 1.7 Uniqueness from Asymptotic Behavior

**Total files: 1**

#### 1.7.1 Linear Independence via Sectoral Growth Analysis

[6e8de21e.md](https://github.com/igorratn/coyote-math/blob/main/6e8de21e.md) — $u(z)$ solves Bessel's equation on $\mathbb{C}\setminus(-\infty,0]$ with $u(z)\sim C\sqrt{2/(\pi z)}\,e^{i(z-\pi\nu/2-\pi/4)}$ uniformly on closed subsectors $\delta\le\arg z\le\pi-\delta$.

**Claim:** $u(z) = CH_\nu^{(1)}(z)$.

**Solution Methodology:** Write $u=c_1H_\nu^{(1)}+c_2H_\nu^{(2)}$. In the upper half-plane, $|H_\nu^{(2)}/H_\nu^{(1)}|=e^{2\Im z}(1+o(1))\to\infty$, so $c_2\neq 0$ contradicts the given asymptotic. Hence $c_2=0$, $c_1=C$.

**Conclusion:** True

---

### 1.8 Uniform Bounds and Branch Cut Behavior

**Total files: 1**

#### 1.8.1 Analytic Continuation Analysis Near Branch Cut

[af454602.md](https://github.com/igorratn/coyote-math/blob/main/af454602.md) — Define $w(r,\theta) = H_\nu^{(1)}(re^{i\theta})\sqrt{\pi re^{i\theta}/2}\exp(-i(re^{i\theta}-\nu\pi/2-\pi/4))$ for $\theta\in(-\pi,\pi)$.

**Claim:** $|w(r,\theta)-1|\le C/r$ uniformly in $\theta$.

**Solution Methodology:** Monodromy relation $H_\nu^{(1)}(ze^{-i\pi})=-e^{i\pi\nu}H_\nu^{(2)}(z)$ along $\theta_r=-\pi+1/r$ gives $w(r,\theta_r)\to -e^{i2\pi\nu}$, so $|w-1|\to 2|\cos(\pi\nu)|>0$. No uniform $O(1/r)$ bound is possible.

**Conclusion:** False

---

### 1.9 Addition Theorems and Convergence Domain

**Total files: 2**

#### 1.9.1 Neumann Addition Theorem — Modified Bessel Analogue and Sign Convention

[91a25388.md](https://github.com/igorratn/coyote-math/blob/main/91a25388.md) — The Neumann addition theorem gives $J_0(\sqrt{r^2+s^2-2rs\cos\phi}) = J_0(r)J_0(s)+2\sum_{m=1}^\infty J_m(r)J_m(s)\cos(m\phi)$.

**Claim:** The same formula holds with $J_m\to I_m$ throughout.

**Solution Methodology:** At $\phi=0$: left side is $I_0(r-s)$; right side via Fourier series $e^{t\cos\theta}=I_0(t)+2\sum I_m(t)\cos(m\theta)$ and orthogonality equals $I_0(r+s)$. Since $I_0$ is strictly increasing and $r+s>r-s$, the identity fails. The correct formula carries $(-1)^m$ factors from the substitution $r\mapsto ir$, $s\mapsto is$.

**Conclusion:** False

---

#### 1.9.2 Graf Addition Theorem — Series Continuation Across Convergence Boundary

[0af97337.md](https://github.com/igorratn/coyote-math/blob/main/0af97337.md) — Graf's addition theorem: $H_\nu^{(1)}(kR)e^{i\nu\psi} = \sum_{n=-\infty}^\infty J_n(kr)H_{\nu+n}^{(1)}(kp)e^{in\theta}$ for $r<p$, where $R=\sqrt{r^2+p^2-2rp\cos\theta}$.

**Claim:** The symmetric formula with $r\leftrightarrow p$ (valid for $p<r$) follows from the original by analytic continuation of the series across $r=p$.

**Solution Methodology:** The Graf series converges only for $r<p$; general terms scale as $(r/p)^{|n|}$, so the series diverges for $r>p$. Analytic continuation of the underlying function $H_\nu^{(1)}(kR)e^{i\nu\psi}$ across $r=p$ is valid, but continuation of a function does not preserve a divergent series representation. The $p<r$ formula is a separate local expansion, not a term-by-term continuation of the first.

**Conclusion:** False

---

### 1.10 Bessel Product Integral Convergence

**Total files: 1**

#### 1.10.1 Hankel Asymptotics and Phase Arithmetic

[5c3333ea.md](https://github.com/igorratn/coyote-math/blob/main/5c3333ea.md) — Convergence of $\int_0^\infty J_\nu(t)J_{\nu+2}(t)\,dt$ for $\nu>0$.

**Solution Methodology:** Phase relation $\cos(t-\alpha-\pi)=-\cos(t-\alpha)$ gives $J_\nu J_{\nu+2}\sim -\frac{1}{\pi t}(1+\cos(2(t-\alpha)))+O(t^{-2})$. The $-1/(\pi t)$ term causes logarithmic divergence.

**Conclusion:** False

---

### 1.11 Poisson Integral Representation

**Total files: 2**

#### 1.11.1 Analytic Continuation and Domain Comparison

[57cd7bd6.md](https://github.com/igorratn/coyote-math/blob/main/57cd7bd6.md) — Poisson integral $F_\nu(z)$ versus $J_\nu(z)$ for non-integer $\nu$. At $z=0$: $F_\nu(0)\neq 0$ but $J_\nu(0)=0$, so the representations are distinct on the extended domain.

**Conclusion:** False

[f33dd204.md](https://github.com/igorratn/coyote-math/blob/main/f33dd204.md) — Analytic continuation of the Poisson integral from $\operatorname{Re}(\nu)>-1/2$ to $\operatorname{Re}(\nu)>-1$ via beta integral regularization and dominated convergence.

**Conclusion:** True

---

### 1.12 Order-Derivative Identity

**Total files: 1**

#### 1.12.1 Differentiation with Respect to Order at Integer Values

[016629d1.md](https://github.com/igorratn/coyote-math/blob/main/016629d1.md) — Claim: $\partial J_\nu / \partial\nu |_{\nu=n} = (\pi/2) Y_n(z)$ for all $n \in \mathbb{Z}_{\ge 0}$ and $z > 0$.

**Solution Methodology:** At $\nu = 1$, $z \to 0^+$: the order-derivative of $J_\nu$ vanishes as $O(z)$, while $(\pi/2)Y_1(z) \sim -1/z \to -\infty$. The correct identity has additional digamma-dependent correction terms.

**Conclusion:** False

---

### 1.13 Modified Bessel Product Bounds

**Total files: 1**

#### 1.13.1 Pointwise Upper Bound for $I_\nu K_\nu$

[e878374b.md](https://github.com/igorratn/coyote-math/blob/main/e878374b.md) — Claim: $I_\nu(x) K_\nu(x) \le 1/(2\sqrt{\nu^2 + x^2})$ for all $\nu > 0$, $x > 0$.

**Solution Methodology:** At $\nu = 1/2$, explicit formulas give $I_{1/2}(x) K_{1/2}(x) = (1 - e^{-2x})/(2x)$. At $x = 2$: LHS $\approx 0.2454 > 0.2425 \approx$ RHS.

**Conclusion:** False

---

## Summary Statistics (Original 16)

✓ **Total files in original clustering:** 16
✓ **Every file appears exactly once:** Yes
✓ **All counts sum correctly:** Yes (1+1+1+1+1+2+1+1+2+1+2+1+1 = 16, across sub-clusters 1.1–1.13)
✓ **Methodology-based clustering (not topic-based):** Yes

*See Updated Summary Statistics after section 1.16 for the full 21-problem count.*

---

## Dimensional Analysis of Problems

| **Problem** | **Math Object** | **Domain/Region** | **Core Insight** | **Technique Combo** |
|-------------|----------------|-------------------|------------------|---------------------|
| 1cfc14a7 | Lommel $s_{\mu,\nu}$ | $z \to \infty$ | Particular vs homogeneous growth | Asymptotics + growth comparison |
| 300a11f2 | $I_\nu$, $K_\nu$ | Near $z=0$ | Linear independence | Frobenius + Wronskian |
| 87879ef3 | $P_\ell^m \to J_m$ | $\ell \to \infty$ | Spherical→cylindrical | Mehler-Heine + coordinate transform |
| 005a9124 | $J_\nu$ zeros | $(0,1)$ boundary | Singular endpoint | Lagrange identity + asymptotics |
| 4db0af8d | $J_\nu$ near zeros | Near $j_{\nu,k}$ | Wronskian divergence | Taylor expansion + zero spacing |
| 89e30655 | $I_n(n\beta)$ | $n \to \infty$, $\beta>1$ | Exponential growth | Series + Stirling + imaginary arg |
| 915f73d1 | $J_\nu(\nu z)$ | $\nu \to \infty$, $z \ne 1$ | Uniform↔pointwise agreement | Langer–Olver + Airy asymptotics |
| 6e8de21e | $H_\nu^{(1)}$ uniqueness | Cut plane sectors | Exponential selection | Sectoral growth + basis analysis |
| af454602 | $H_\nu^{(1)}$ near cut | $\theta \to -\pi$ | Branch discontinuity | Monodromy + continuation |
| 91a25388 | $J_m$, $I_m$ addition | $\phi=0$ specialization | Sign flip under $r\mapsto ir$ | Fourier orthogonality + monotonicity |
| 0af97337 | Graf $H_\nu^{(1)}$ series | $r=p$ boundary | Series ≠ function continuation | Convergence domain + asymptotic scaling |
| 5c3333ea | $J_\nu J_{\nu+2}$ product | $t \to \infty$ | Log divergence | Hankel asymptotics + phase |
| 57cd7bd6 | Poisson vs $J_\nu$ | $z = 0$ | Domain mismatch | Analytic continuation |
| f33dd204 | Poisson integral | $\operatorname{Re}(\nu) > -1$ | Beta regularization | Dominated convergence |
| f09a765d | Kelvin ber/bei/ker/kei | $x > 0$ | Wrong sign from ODE mismatch | Wronskian + ODE identification |
| c23294e1 | Rayleigh sums $\sigma_s(\nu)$ | $s = 4$, $\nu > -1$ | Pattern breaks at higher order | Hadamard product + Newton's identity |
| 77edf9d1 | Kapteyn series $\sum J_n(nx)/n$ | $0 < x < 1$ | $\div n$ doesn't transform Kapteyn like geometric | Taylor coefficient comparison |
| 416a3c0f | Kapteyn-Bessel antiderivative | $0 < a < 1$ | Integral inherits coefficient mismatch | Integration + Taylor coefficient comparison |
| 7edc37eb | Weighted squared Kapteyn sum | $0 < x < 1$ | Subleading corrections break pattern at $x^6$ | Taylor coefficient comparison + differentiation gap |

---

## Unique Aspects

- **1cfc14a7** — only inhomogeneous (Lommel) equation
- **300a11f2** — only Frobenius method at regular singular point
- **87879ef3** — only inter-function-class connection (Legendre → Bessel)
- **005a9124** — only Lagrange identity and Sturm-Liouville orthogonality
- **4db0af8d** — only Wronskian-normalized quantity and phase behavior near zeros
- **89e30655** — only exponential growth regime via imaginary argument and Stirling
- **915f73d1** — only equivalence of two asymptotic methods (Langer vs Debye) via Airy asymptotics
- **6e8de21e** — only uniqueness from asymptotic data
- **af454602** — only failure of uniform bounds due to branch cut
- **91a25388** — only sign convention error under imaginary substitution in addition theorem
- **0af97337** — only series convergence domain failure at addition theorem boundary
- **5c3333ea** — only product integral divergence via phase arithmetic
- **57cd7bd6 / f33dd204** — only Poisson integral representation problems
- **f09a765d** — only Kelvin function problem; Wronskian sign from ODE structure
- **c23294e1** — only Rayleigh sum / spectral zeta function; pattern extrapolation failure
- **77edf9d1 / 416a3c0f / 7edc37eb** — Kapteyn series problems; Taylor coefficient mismatch trap (7edc37eb uses squared Kapteyn with $1/n$ weight, creating differentiation gap)

---

### 1.14 Kelvin Function Wronskian Relations

**Total files: 1**

#### 1.14.1 Wronskian Sign Error via ODE Mismatch

[f09a765d.md](https://github.com/igorratn/coyote-math/blob/main/f09a765d.md) — Kelvin function Wronskian combination: $W_1(x) - W_2(x)$ claimed $= 1/x$.

**Solution Methodology:** The Kelvin functions ber, bei, ker, kei satisfy a different ODE from $J_0, K_0$. The claimed Wronskian has the wrong sign; the correct value is $-1/x$.

**Conclusion:** False (4/4 stumbled)

---

### 1.15 Rayleigh Sums and Spectral Zeta Functions

**Total files: 1**

#### 1.15.1 Pattern Extrapolation Failure at Higher Order

[c23294e1.md](https://github.com/igorratn/coyote-math/blob/main/c23294e1.md) — Rayleigh sum $\sigma_4(\nu)$: claimed simple numerator-1 pattern from $\sigma_1,\sigma_2,\sigma_3$ continues to $s=4$.

**Solution Methodology:** Hadamard product for $J_\nu$ gives Newton's identity recurrence. Computing the $n=4$ relation yields $\sigma_4(\nu) = (5\nu+11)/[256(\nu+1)^4(\nu+2)^2(\nu+3)(\nu+4)]$, which has nontrivial numerator $5\nu+11$, disproving the pattern.

**Conclusion:** False (3/4 stumbled)

---

### 1.16 Kapteyn Series and Generating Functions

**Total files: 3**

#### 1.16.1 Kapteyn Exponential — False Closed Form via Coefficient Mismatch

[77edf9d1.md](https://github.com/igorratn/coyote-math/blob/main/77edf9d1.md) — Define $\Phi_K(x) = \exp(2\sum J_n(nx)/n)$. Claimed $\Phi_K(x) = 1/(1-x)$.

**Solution Methodology:** The claim reduces to $\sum J_n(nx)/n = -\frac{1}{2}\ln(1-x)$. Small-$x$ expansion: $\sum J_n(nx)/n$ has $x^3$ coefficient $1/8$, while $-\frac{1}{2}\ln(1-x)$ has $1/6$. Since $1/8 \neq 1/6$, the identity fails.

**Conclusion:** False (4/4 stumbled)

---

#### 1.16.2 Kapteyn-Bessel Antiderivative — Integral Wrapper of Same Coefficient Mismatch

[416a3c0f.md](https://github.com/igorratn/coyote-math/blob/main/416a3c0f.md) — Define $F_n(a) = \frac{1}{n^2}\int_0^{na} J_n(u)\,du$. Claimed $\sum F_n(a) = \frac{1}{2}[(1-a)\ln(1-a)+a]$.

**Solution Methodology:** Substitution reduces to $\mathcal{K}(a) = \int_0^a S(t)\,dt$ where $S(t) = \sum J_n(nt)/n$. The claim requires $S(t) = -\frac{1}{2}\ln(1-t)$, which fails at $t^3$ coefficient ($1/8 \neq 1/6$). After integration, the $a^4$ coefficients differ: $1/32 \neq 1/24$.

**Conclusion:** False (4/4 stumbled)

---

#### 1.16.3 Weighted Squared Kapteyn Sum — Subleading Correction Mismatch

[7edc37eb.md](https://github.com/igorratn/coyote-math/blob/main/7edc37eb.md) — Define $\mathcal{K}(x) = \sum_{n=1}^{\infty} [J_n(nx)]^2/n$. Claimed $\mathcal{K}(x) = x^2/(4-x^2)$.

**Solution Methodology:** The $1/n$ weight makes $\mathcal{K}'(x) = 2\sum J_n(nx)J_n'(nx)$, while differentiating the squared Kapteyn identity gives $\sum 2n J_n J_n'$ (with the factor $n$). These are different sums, so the derivative approach cannot close. Direct Taylor expansion to $x^6$ reveals the coefficient is $11/384$, while $x^2/(4-x^2)$ gives $1/64 = 6/384$. The mismatch arises from subleading corrections in $[J_1(x)]^2$ and $[J_2(2x)]^2/2$ contributing at order $x^6$ alongside the leading $n=3$ term.

**Trap mechanism:** The problem provides matching at $x^2$ and $x^4$ (which are automatic — only the leading term from each $n$ contributes at those orders). Models that attempt a differentiation approach encounter the $\sum J_n J_n'$ vs $\sum n J_n J_n'$ gap but cannot resolve it, and fall back to asserting all Taylor coefficients match without verification.

**Conclusion:** False (2/4 stumbled)

---

## Summary Statistics (Updated)

\u2713 **Total files in clustering:** 22
\u2713 **Every file appears exactly once:** Yes
\u2713 **Methodology-based clustering (not topic-based):** Yes

---

## Gaps and Future Directions

Based on NU Chapter III (§14-19), potential areas for new problems:

1. **Addition theorems** (§18): Gegenbauer's theorem — *(Neumann and Graf now covered)*
2. **Hankel functions**: Contour integral representations, Sommerfeld contours
3. **Recursion relations** (§15): Three-term recurrences, differentiation formulas
4. **Spherical Bessel functions** (§17): Half-integer orders, reduction to elementary functions
5. **Semiclassical/WKB methods** (§19): Connection formulas, turning points — *(partially addressed by 915f73d1)*
6. **Cross-product relations**: $J_\nu Y_{\nu'} - J_{\nu'} Y_\nu$ identities
7. **Second kind Bessel functions $Y_\nu$**: Explicit problems on Neumann functions
8. **Kelvin functions**: $\text{ber}$, $\text{bei}$, $\text{ker}$, $\text{kei}$ functions — *(now covered by f09a765d)*
9. **Kapteyn series**: Higher-order Kapteyn identities, convergence at boundary $x=1$ — *(partially covered by 77edf9d1, 416a3c0f)*

---

## Connections to N-U Book (Chapters 14-19)

| **Problem** | **N-U Book Reference** | **Connection** |
|-------------|------------------------|----------------|
| 1cfc14a7 | §14, §15 | Lommel inhomogeneous Bessel; asymptotic formulas for $J_\nu$, $Y_\nu$ |
| 300a11f2 | §17, §14 | Modified Bessel $I_\nu$, $K_\nu$; Wronskian formula |
| 87879ef3 | §19, §14 | Mehler-Heine WKB-type asymptotic; spherical→cylindrical |
| 005a9124 | §14, §15 | Sturm-Liouville form; small-argument asymptotics and zeros |
| 4db0af8d | §14, §15 | Wronskian structure; asymptotic zero spacing |
| 89e30655 | §17, §19 | $J_n(ix)=i^nI_n(x)$; large $n$ asymptotics via Stirling |
| 915f73d1 | §19, §15 | Langer–Olver uniform Airy expansion; Debye formulas; turning point |
| 6e8de21e | §15 | $H_\nu^{(1)}$, $H_\nu^{(2)}$ basis; uniqueness from radiation condition |
| af454602 | §15 | Monodromy relations; uniform bound failure near branch cut |
| 91a25388 | §18 | Neumann addition theorem; sign convention under $J_m\to I_m$ |
| 0af97337 | §18 | Graf addition theorem; series convergence domain vs analytic continuation |
| 5c3333ea | §16 | Product integral; Hankel asymptotics and phase |
| 57cd7bd6 | §16 | Poisson integral; analytic continuation domain |
| f33dd204 | §16 | Poisson integral extension via beta regularization |
| f09a765d | §14 | Kelvin functions; Wronskian sign from ODE structure |
| c23294e1 | §15 | Rayleigh sums; Hadamard product; Newton's identity |
| 77edf9d1 | §14 | Kapteyn series; generating functions; Taylor coefficients |
| 416a3c0f | §14, §16 | Kapteyn series integration; coefficient comparison |
| 8ac6e061 | §16 | Triple Bessel product integral; measure confusion (dt vs t dt) |

---

### 1.18 Triple Bessel Product Integrals

**Total files: 1**

#### 1.18.1 Measure Confusion in Triple $J_0$ Product Integral

**Total files: 1**

**Typical Example: [8ac6e061.md](https://github.com/igorratn/coyote-math/blob/main/8ac6e061.md)**

For $a, b, c > 0$ satisfying the strict triangle inequality, define the Bessel triangle functional

$$\mathcal{B}(a, b, c) = 2\pi\, A(a,b,c) \int_0^{\infty} J_0(at)\, J_0(bt)\, J_0(ct)\, dt,$$

where $J_0$ is the Bessel function of the first kind of order zero and $A(a,b,c)$ is the area of the triangle with side lengths $a, b, c$ (Heron's formula).

**Claim:** $\mathcal{B}(a, b, c) = 1$ for all valid triangles.

**Solution Methodology:** The key insight is a scaling/homogeneity argument. Under $(a,b,c) \to \lambda(a,b,c)$, the area scales as $\lambda^2 A$ and the unweighted integral $\int J_0^3\, dt$ scales as $\lambda^{-1}$ (by substitution $u = \lambda t$). Therefore $\mathcal{B} \to \lambda \cdot \mathcal{B}$, showing $\mathcal{B}$ is homogeneous of degree 1 and cannot equal a constant. The classical identity $\int J_0(at) J_0(bt) J_0(ct)\, t\, dt = 1/(2\pi A)$ (Watson §13.46) uses the **weighted** measure $t\, dt$, where the integral scales as $\lambda^{-2}$, exactly cancelling $\lambda^2$ from $A$. The problem's **unweighted** measure $dt$ scales differently ($\lambda^{-1}$), breaking this cancellation. All 4 models recalled the $t\, dt$ formula and applied it to the $dt$ integral without checking the measure — a "false recalled fact" error where the recalled formula is correct for a different integral.

**Conclusion:** False ($\mathcal{B}$ is not a constant; it is homogeneous of degree 1). 4/4 models stumbled.

---

**End of Clustering Document**
