# 13 New Bessel Function Problems

**Problems 1.9 through 1.13 (+ 8 more TBD)**
**Extends existing 13-problem Bessel cluster toward 20 total**
**Date: February 28, 2026**

These problems cover identified gaps in NU Chapter III (sections 14-19): integral representations (Poisson), WKB/Langer asymptotics, spherical Bessel functions, and turning-point analysis. Problems that were too straightforward to trip up models have been pruned (old 1.13–1.17: forward recurrence, Weber-Schafheitlin, Fourier-Bessel orthogonality, Kelvin functions, Turán inequality; old 1.14–1.16: Kapteyn series, cross-product Wronskian, Sommerfeld contour integral).

**Score (1.9–1.13): 3 True, 2 False** *(Problems 1.9–1.12 submitted; 1.13 drafted)*

---

## 1.9 Integral Representation Domain of Validity ✅ SUBMITTED (f33dd204.md)

### 1.9.1 Poisson Integral Parameter Extension

For $\nu > -1/2$, the Bessel function of the first kind $J_\nu(z)$ admits the Poisson integral representation

$$J_\nu(z) = \frac{(z/2)^\nu}{\sqrt{\pi}\,\Gamma(\nu + 1/2)} \int_0^\pi \cos(z\cos\theta)\,\sin^{2\nu}\theta\,d\theta.$$

This formula connects $J_\nu$ to a weighted Fourier-type integral over the angular variable $\theta$, and is valid for $\operatorname{Re}(\nu) > -1/2$ by convergence of the integral.

Separately, $J_\nu(z)$ is defined for all $\nu \in \mathbb{C}$ via the power series

$$J_\nu(z) = \sum_{k=0}^{\infty} \frac{(-1)^k}{k!\,\Gamma(k+\nu+1)}\left(\frac{z}{2}\right)^{2k+\nu}.$$

Claim: The Poisson integral representation extends by analytic continuation of the parameter $\nu$ to all $\nu$ with $\operatorname{Re}(\nu) > -1$, yielding $J_\nu(z)$ on this larger half-plane.

Determine whether this claim is True or False, and give a rigorous proof of your conclusion.

**~~Original draft conclusion: False~~ → Corrected to True after working out the problem.**

**Solution Methodology (as submitted in f33dd204.md):** The proof confirms the claim. For $\operatorname{Re}(\nu) > -1/2$, expand $\cos(z\cos\theta) = \sum_{k=0}^\infty \frac{(-1)^k}{(2k)!}z^{2k}\cos^{2k}\theta$ uniformly on $[0,\pi]$ and justify termwise integration by dominated convergence. Each term evaluates via the beta integral: $\int_0^\pi \cos^{2k}\theta\sin^{2\nu}\theta\,d\theta = \frac{\Gamma(\nu+1/2)\Gamma(k+1/2)}{\Gamma(k+\nu+1)}$. After canceling $\Gamma(\nu+1/2)$ with the prefactor and applying $\Gamma(k+1/2) = \frac{\sqrt{\pi}(2k)!}{4^k k!}$, the result is exactly the power series $J_\nu(z)$. Since $J_\nu(z)$ is entire in $\nu$, it is the unique analytic continuation of the Poisson representation to all $\nu \in \mathbb{C}$, including $\operatorname{Re}(\nu) > -1$.

The original draft argued False because the raw integral $\int_0^\pi \sin^{2\nu}\theta\,d\theta$ diverges for $\operatorname{Re}(\nu) \in (-1,-1/2]$. This is true, but the claim is about analytic continuation of the full expression $F(\nu)$ (prefactor $\times$ integral), not pointwise convergence of the integral alone. On $\operatorname{Re}(\nu) > -1/2$, $F(\nu) = J_\nu(z)$ as an identity of analytic functions, so continuation is immediate.

**Conclusion:** True

---

## 1.10 Product Integrals of Bessel Functions with Order Separation ✅ SUBMITTED (5c3333ea.md)

### 1.10.1 Convergence of $\int_0^\infty J_\nu\,J_{\nu+2}$

**Problem statement (as submitted in 5c3333ea.md):**

For $\nu > 0$, the Bessel function $J_\nu(z)$ has the large-argument asymptotic behavior:

$$J_\nu(z) \sim \sqrt{\frac{2}{\pi z}} \cos \left( z - \frac{\nu\pi}{2} - \frac{\pi}{4} \right), \qquad z \to \infty.$$

Now consider:

$$I_\nu = \int_0^\infty J_\nu(t)J_{\nu+2}(t) \, dt.$$

Claim: $I_\nu$ converges for all $\nu > 0$.

Determine whether this claim is True or False, and give a rigorous proof of your conclusion.

**Solution (as submitted):** The claim is False. Near $t = 0$: $J_\nu(t)J_{\nu+2}(t) = O(t^{2\nu+2})$, integrable for $\nu > 0$. For $t \to \infty$: using first-order Hankel asymptotics with remainder, $\cos(t-\alpha-\pi) = -\cos(t-\alpha)$, so $J_\nu(t)J_{\nu+2}(t) = -\frac{2}{\pi t}\cos^2(t-\alpha) + O(t^{-2}) = -\frac{1}{\pi t}(1 + \cos(2(t-\alpha))) + O(t^{-2})$. The oscillatory term converges conditionally by integration by parts; the $-1/(\pi t)$ term causes $\int_T^R J_\nu J_{\nu+2}\,dt = -\frac{1}{\pi}\log(R/T) + O(1) \to -\infty$.

**Conclusion:** False

---

## 1.11 Spherical Bessel Function Structure ✅ SUBMITTED (91a25388.md)

### 1.11.1 Polynomial Representation of Spherical Bessel Functions

**Problem statement (as submitted in 91a25388.md):**

For integer $n\ge0$, the spherical Bessel functions $j_n(z)$ are defined recursively by

$$j_0(z)=\frac{\sin z}{z}, \qquad j_1(z)=\frac{\sin z}{z^2}-\frac{\cos z}{z},$$

and for $n\ge1$,

$$j_{n+1}(z)=\frac{2n+1}{z}j_n(z)-j_{n-1}(z).$$

Claim: For every integer $n\ge0$, there exist unique polynomials $p_n$ and $q_n$ with real coefficients such that $q_0\equiv0$, $\deg p_n=n$, $\deg q_n=n-1$ for $n\ge1$, and

$$j_n(z)=\frac{p_n(1/z)\sin z+q_n(1/z)\cos z}{z}$$

for all $z\ne0$.

Determine whether this claim is true or false, and give a rigorous proof of your conclusion.

**~~Original draft included Rayleigh's formula, leading coefficient $(2n-1)!!/n!$, and parity claims — all dropped in submitted version.~~**

**Solution (as submitted):** The claim is true. Existence by induction: substituting the representation into the recurrence gives $p_{n+1}(x) = (2n+1)xp_n(x) - p_{n-1}(x)$ and similarly for $q_{n+1}$. Degrees: $\deg p_{n+1} = n+1$ since $\deg(xp_n) = n+1 > n-1 = \deg p_{n-1}$; for $q$, base case $q_2 = -3x$ checked explicitly; for $n \ge 2$, $\deg q_{n+1} = n$. Uniqueness: if $P(1/z)\sin z + Q(1/z)\cos z \equiv 0$, evaluate at $z = k\pi$ to get infinitely many zeros of $Q$, forcing $Q \equiv 0$; then at $z = (m+\frac{1}{2})\pi$ to force $P \equiv 0$.

**Conclusion:** True

---

## 1.12 Large-Order Uniform Asymptotics ✅ SUBMITTED (915f73d1.md)

### 1.12.1 Langer Turning Point Analysis

**Problem statement (as submitted in 915f73d1.md):**

Consider the Bessel function of the first kind $J_\nu(\nu z)$ for large order $\nu>0$ and $z>0$. Define the parameter $\zeta(z)$ as:

$$\zeta(z)=\begin{cases}\left(\frac32\int_z^1\frac{\sqrt{1-t^2}}{t}dt\right)^{2/3},&0<z\le1\\[6pt]-\left(\frac32\int_1^z\frac{\sqrt{t^2-1}}{t}dt\right)^{2/3},&z\ge1.\end{cases}$$

Claim: For fixed $z>0$ with $z\ne1$, the standard Debye leading asymptotics for $J_\nu(\nu z)$ and the Langer uniform asymptotics based on the Airy function $\operatorname{Ai}(\nu^{2/3}\zeta(z))$ agree to leading order as $\nu\to\infty$ in the sense that their ratio tends to $1$. Determine whether this claim is true or false and give a rigorous proof.

**Solution Methodology:** The proof confirms the claim by matching the Langer and Debye formulas away from the turning point. The Langer uniform approximation (NU Chapter III, section 19; also Olver, *Asymptotics and Special Functions*, Chapter 11) states:

$$J_\nu(\nu z) \sim \frac{2}{\nu^{1/3}}\left(\frac{4\zeta}{1-z^2}\right)^{1/4}\left[\operatorname{Ai}(\nu^{2/3}\zeta) + O(\nu^{-2})\right].$$

For $z < 1$ (so $\zeta > 0$), and $\nu^{2/3}\zeta \to +\infty$: the Airy function satisfies $\operatorname{Ai}(x) \sim \frac{1}{2\sqrt{\pi}}x^{-1/4}e^{-2x^{3/2}/3}$ as $x \to +\infty$. Substituting $x = \nu^{2/3}\zeta$ gives $e^{-\nu \cdot 2\zeta^{3/2}/3}$. By the definition of $\zeta$, $\frac{2}{3}\zeta^{3/2} = \int_z^1\frac{\sqrt{1-t^2}}{t}dt$. This is exactly the exponent in Debye's formula for the evanescent region $z < 1$: $J_\nu(\nu z) \sim \frac{1}{\sqrt{2\pi\nu}}\frac{e^{-\nu\eta}}{(1-z^2)^{1/4}}$ where $\eta = \sqrt{1-z^2} - \cos^{-1}z$ (using the substitution $t = \sin\alpha$). Matching the prefactors confirms agreement to leading order.

For $z > 1$ (so $\zeta < 0$), $\nu^{2/3}\zeta \to -\infty$: $\operatorname{Ai}(-|x|) \sim \frac{1}{\sqrt{\pi}}|x|^{-1/4}\cos\left(\frac{2}{3}|x|^{3/2} - \frac{\pi}{4}\right)$. This produces the oscillatory Debye formula $J_\nu(\nu z) \sim \sqrt{\frac{2}{\pi\nu}}\frac{1}{(z^2-1)^{1/4}}\cos\left(\nu\sqrt{z^2-1} - \nu\cos^{-1}(1/z) - \pi/4\right)$.

The Langer formula smoothly interpolates between these regimes through the Airy function, and at any fixed $z \neq 1$, the Airy asymptotics reduce to the Debye formulas. The ratio of the two tends to $1$.

**Conclusion:** True

---

## 1.13 Transition Asymptotics at the Turning Point

### 1.13.1 Debye Approximation Validity at $z = \nu$

For large $\nu > 0$, the Debye asymptotic approximation for $J_\nu(\nu z)$ in the oscillatory region $z > 1$ is

$$J_\nu(\nu z) \sim \sqrt{\frac{2}{\pi\nu}}\frac{1}{(z^2-1)^{1/4}}\cos\left(\nu\sqrt{z^2-1} - \nu\arccos(1/z) - \frac{\pi}{4}\right).$$

At $z = 1$ (the turning point), this formula has an apparent $(z^2-1)^{-1/4}$ singularity.

Claim: The Debye approximation remains valid at $z = 1$ in the sense that setting $z = 1$ directly in the formula and interpreting the limit $z \to 1^+$ gives the correct leading-order value

$$J_\nu(\nu) \sim \frac{c_0}{\nu^{1/3}}$$

where $c_0 = \frac{\operatorname{Ai}(0)}{(2/3)^{1/3}} = \frac{1}{3^{2/3}\Gamma(2/3)}$ is determined by the Debye formula.

Determine whether this claim is True or False, and give a rigorous proof of your conclusion.

**Solution Methodology:** The proof disproves the claim by showing that the Debye formula gives the wrong leading power of $\nu$ at the turning point.

The correct behavior at $z = 1$ is $J_\nu(\nu) \sim c_0 \nu^{-1/3}$ where $c_0 = \frac{\operatorname{Ai}(0)}{(2/3)^{1/3}} \approx 0.4473$ (from the Langer/Olver uniform asymptotic, NU Chapter III, section 19). But the Debye formula cannot produce this: as $z \to 1^+$, $\sqrt{z^2-1} \to 0$ and the Debye prefactor $(z^2-1)^{-1/4} \to \infty$, while $\cos(\nu\sqrt{z^2-1} - \ldots) \to \cos(-\pi/4) = 1/\sqrt{2}$. Thus the Debye formula gives $J_\nu(\nu z) \sim C_\nu/(z^2-1)^{1/4}$ with no finite limit at $z = 1$.

More precisely, setting $z = 1 + \delta$ with $\delta \to 0^+$: $(z^2-1)^{1/4} \approx (2\delta)^{1/4}$. For the Debye formula to approximate $J_\nu(\nu(1+\delta)) \sim \nu^{-1/3}$, we would need $\delta \sim \nu^{-2/3}$, placing us in the "transition region" $|z - 1| = O(\nu^{-2/3})$ where the Debye approximation breaks down. In this region, $\nu(z^2-1) = O(\nu^{1/3})$, and the cosine varies on the scale of the Airy function argument $\nu^{2/3}\zeta \sim \nu^{2/3}(z-1)$.

The Debye approximation is a WKB-type approximation valid away from the turning point ($|z-1| \gg \nu^{-2/3}$). Its failure at $z = 1$ is fundamental: the underlying differential equation transitions from oscillatory to evanescent behavior, and the WKB connection formulas are singular there. Only the uniform Langer/Airy asymptotic (Problem 1.12) handles the turning point correctly. The claim is false because the Debye formula does not determine $c_0$; rather, $c_0$ comes from the Airy function value $\operatorname{Ai}(0)$, which is an independent piece of information not contained in the Debye expansion.

**Conclusion:** False

---

## Summary

### Problem Index

| # | Title | NU Section | Core Object | Conclusion | Status |
|---|-------|-----------|-------------|------------|--------|
| 1.9 | Poisson Integral Extension | §16 | $J_\nu$, integral representation | **True** | ✅ Submitted |
| 1.10 | Product Integral Convergence | §16 | $J_\nu J_{\nu+2}$, phase arithmetic | **False** | ✅ Submitted |
| 1.11 | Spherical Bessel Polynomial Rep | §17 | $j_n(z)$, recurrence + uniqueness | **True** | ✅ Submitted |
| 1.12 | Langer Uniform Asymptotics | §19 | $J_\nu(\nu z)$, Airy matching | **True** | ✅ Submitted |
| 1.13 | Debye at Turning Point | §19 | $J_\nu(\nu)$, WKB breakdown | **False** | Drafted |
| 1.14–1.20 | *(7 new problems TBD)* | | | | |

**Current totals: 3 True, 2 False** *(need 8 more problems to reach 20 total)*

### NU Chapter III Coverage (this document)

| Section | Topic | Problems |
|---------|-------|----------|
| §16 | Integral representations | 1.9, 1.10 |
| §17 | Modified Bessel, spherical Bessel | 1.11 |
| §18 | Addition theorems | (gap) |
| §19 | WKB, large order | 1.12, 1.13 |

### Technique Coverage (Current Problems)

- **Integral convergence analysis**: 1.9
- **Phase arithmetic / product asymptotics**: 1.10
- **Induction via recurrence + uniqueness**: 1.11
- **Uniform asymptotic matching**: 1.12
- **WKB breakdown at turning points**: 1.13

### 4D Uniqueness Check Against Existing 13 Repo Problems

Each new problem differs from all existing problems in at least 2 dimensions:

| New | Math Object | Domain/Region | Core Insight | Differs from existing? |
|-----|-------------|---------------|--------------|----------------------|
| 1.9 | $J_\nu$ Poisson integral | $\nu$ parameter space | Representation vs function | Yes (new object + domain) |
| 1.10 | $J_\nu J_{\nu+2}$ product | $t \to \infty$ | Phase cancellation failure | Yes (new insight) |
| 1.11 | $j_n(z)$ spherical | Elementary decomposition | Finite sum structure | Yes (new object + insight) |
| 1.12 | $J_\nu(\nu z)$ uniform | Turning point $z = 1$ | Airy matching | Yes (new domain + technique) |
| 1.13 | $J_\nu(\nu)$ Debye | $z = 1$ turning point | WKB breakdown | Yes (contrasts with 1.12) |

---

**End of New Problems Document**
