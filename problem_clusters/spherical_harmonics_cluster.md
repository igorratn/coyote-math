# Cluster 1: Spherical Harmonics on the Unit Sphere

**Total files: 19**

This cluster contains all problems involving spherical harmonics $Y_{\ell m}(\theta,\phi)$, associated Legendre functions $P_\ell^m(x)$, or axisymmetric harmonics on the sphere. These are separated from general orthogonal polynomial problems because they involve the angular part of Laplace's equation in spherical coordinates.

---

## 1.1 Monotonicity via Auxiliary Function Method

**Total files: 1**

### 1.1.1 Nikiforov-Uvarov Auxiliary Function for Local Maxima

**Total files: 1**

[16ab09af.md](https://github.com/igorratn/coyote-math/blob/main/16ab09af.md) - A spherical harmonic of order $\ell$, denoted by $Y_{\ell m}(\theta, \phi)$, is defined as a bounded single-valued solution to the angular part of the Laplace equation. For zonal spherical harmonics $Y_{\ell 0}(\theta, \phi) = \sqrt{\frac{2\ell+1}{4\pi}} P_\ell(\cos \theta)$ with $\ell \ge 1$ and $\theta \in (0, \pi/2]$, consider the function $g(\theta) = |Y_{\ell 0}(\theta, \phi)|$.

**Claim:** As $\theta$ increases from 0 toward $\pi/2$, the values of the successive local maxima of $g(\theta)$ form a strictly decreasing sequence.

**Solution Methodology:** Uses the Nikiforov-Uvarov auxiliary function method. Constructs $v(x) = [y(x)]^2 + \frac{\sigma(x)}{\lambda} [y'(x)]^2$ where $\sigma(x) = 1-x^2$ and $\lambda = \ell(\ell+1)$. Shows $v'(x) = \frac{2x}{\lambda}[y'(x)]^2 > 0$ for $x \in (0,1)$, proving monotonicity.

**Conclusion:** True

---

## 1.2 Addition Theorem and Modified Sums

**Total files: 1**

### 1.2.1 Point Evaluation Strategy (North Pole Test)

**Total files: 1**

[27ff7bd2.md](https://github.com/igorratn/coyote-math/blob/main/27ff7bd2.md) - Let $Y_{\ell m}(\theta,\phi)$ denote the standard spherical harmonics on $\mathbb{S}^2$, normalized in $L^2(\mathbb{S}^2)$. For fixed $\ell \geq 1$, define the modified sum $S_\ell(\theta_1,\phi_1,\theta_2,\phi_2) = \sum_{m=-\ell}^{\ell} (-1)^m Y_{\ell m}(\theta_1,\phi_1) \overline{Y_{\ell m}(\theta_2,\phi_2)}$.

**Claim:** For all $\ell \geq 1$, $S_\ell(\theta_1,\phi_1,\theta_2,\phi_2) = \frac{2\ell+1}{4\pi} P_\ell(-\cos\omega)$ where $\omega$ is the angle between the two points.

**Solution Methodology:** Evaluates at north pole where only $m=0$ term survives. Shows the $(-1)^m$ factor breaks the standard addition theorem for odd $\ell$.

**Conclusion:** False

---

## 1.3 Modified Weight Orthogonality on the Sphere

**Total files: 2**

### 1.3.1 Axisymmetric Harmonics with Recurrence Analysis

**Total files: 1**

[1180dd83.md](https://github.com/igorratn/coyote-math/blob/main/1180dd83.md) - Let $u(r, \theta)$ be an axisymmetric harmonic function in $\mathbb{R}^3$. Consider the ansatz $\tilde{u}(r, \theta) = r^n P_n(\cos \theta) + \alpha_n r^{n-1} P_{n-1}(\cos \theta)$ for $n \geq 2$.

**Claim:** There exists nonzero $\alpha_n$ such that $\int_0^\pi \tilde{u}(1,\theta) \sin\theta \cos\theta \, d\theta = 0$ for all $n \geq 2$.

**Solution Methodology:** Uses three-term recurrence $xP_k = \frac{k+1}{2k+1}P_{k+1} + \frac{k}{2k+1}P_{k-1}$ to compute the integral. Shows obstruction at $n=2$ where coefficient system has no nonzero solution.

**Conclusion:** False

### 1.3.2 Cauchy Principal Value Weight

**Total files: 1**

[2002a358.md](https://github.com/igorratn/coyote-math/blob/main/2002a358.md) - Let $Y_{\ell m}(\theta,\phi)$ be the standard spherical harmonics on $S^{2}$. Let $\beta \in (-1, 1)$ and define the inner product using the Cauchy principal value: $(f,g)_\beta = \operatorname{p.v.}\int_{-1}^1 \frac{f(x)g(x)}{x-\beta}dx$.

**Claim:** For fixed $\ell \ge 1$ and $m=0$, set $\tilde P_\ell(x)=P_\ell(x)+\gamma P_{\ell-1}(x)$. Then $(\tilde P_\ell,q)_\beta=0$ for all polynomials $q$ with $\deg(q)<\ell$ if and only if a single condition at the pole $\beta$ is satisfied.

**Solution Methodology:** Decomposes $q(x) = (x-\beta)r(x) + q(\beta)$. Uses principal value property to show orthogonality to $r$ is automatic, leaving only one condition from the residue at $\beta$.

**Conclusion:** True

---

## 1.4 Cauchy Transform Theory for Spherical Harmonics

**Total files: 1**

### 1.4.1 Cauchy Transform and Integration Contours

**Total files: 1**

[339da8e1.md](https://github.com/igorratn/coyote-math/blob/main/339da8e1.md) - For Legendre polynomial $P_\ell(x)$ and $\beta \in (-1,1)$, define the integral $I(\beta) = \int_0^\pi P_\ell(\cos\theta) \sin\theta \frac{\sin\theta}{\cos\theta - \beta} d\theta$.

**Claim:** $I(\beta) = -\frac{2\pi}{\sqrt{1-\beta^2}}P_\ell(\beta)$.

**Solution Methodology:** Substitutes $x=\cos\theta$ to get $I(\beta) = \int_{-1}^1 P_\ell(x)\frac{dx}{x-\beta}$. This is a principal value integral equal to $\pi P_\ell(\beta)/\sqrt{1-\beta^2}$ by known Cauchy formula.

**Conclusion:** False (factor of 2 error)

---

## 1.5 Zero Distribution Properties

**Total files: 1**

### 1.5.1 Associated Legendre Zero Interlacing

**Total files: 1**

[d4dd1d63.md](https://github.com/igorratn/coyote-math/blob/main/d4dd1d63.md) - Let $\Theta_{lm}(x)$ denote the polar components of spherical harmonics (normalized associated Legendre functions).

**Claim:** For fixed degree $l$, the zeros of $\Theta_{l,m+1}$ strictly interlace the zeros of $\Theta_{lm}$ on $(-1,1)$.

**Solution Methodology:** Uses definition $P_l^m(x)=(1-x^2)^{m/2}\frac{d^m}{dx^m}P_l(x)$. On interior $(1-x^2)>0$, so zeros coincide with zeros of $f_m(x)=\frac{d^m}{dx^m}P_l(x)$. Since $f_{m+1}=f_m'$, applies Rolle's theorem between consecutive zeros.

**Conclusion:** True

---

## 1.6 Uniform Bounds and Asymptotic Growth

**Total files: 5**

### 1.6.1 Envelope Estimates for Jacobi Polynomials

**Total files: 1**

[eea363eb.md](https://github.com/igorratn/coyote-math/blob/main/eea363eb.md) - Studies spherical harmonics $Y_{\ell}^{m}(\theta,\phi)$ on $\mathbb{S}^2$.

**Claim:** For fixed $m$, there exists $C$ such that $\sup_{\theta\in[0,\pi]} |(\sin\theta)^{|m|+\delta}Y_\ell^m(\theta,\phi)| \leq C$ for all $\ell \geq |m|$.

**Solution Methodology:** Uses Jacobi polynomial representation $P_\ell^{|m|}(x) = (-1)^{|m|}(1-x^2)^{|m|/2}\frac{(\ell+|m|)!}{2^{|m|}\ell!}P_n^{(|m|,|m|)}(x)$ where $n=\ell-|m|$. Applies Nikiforov-Uvarov envelope estimate. Shows boundedness requires $\delta\geq 1/2$ for $m=0$; any $\delta>0$ works for $|m|\geq 1$.

**Conclusion:** True

### 1.6.2 Christoffel-Darboux Asymptotic Growth for Associated Legendre Kernels

**Total files: 2**

[85ca892d.md](https://github.com/igorratn/coyote-math/blob/main/85ca892d.md) - Let $\Theta_{\ell m}(x)$ denote the normalized associated Legendre functions on $x\in[-1,1]$. For fixed $m\ge0$ and $x_0\in(-1,1)$, define $K_N^{(m)}(x_0,x_0)=\sum_{\ell=m}^N\Theta_{\ell m}^2(x_0)$.

**Claim:** There exists $C(x_0,m)>0$ such that $\liminf_{N\to\infty}\frac{K_N^{(m)}(x_0,x_0)}{N}\ge C(x_0,m)$.

**Solution Methodology:** Converts to Jacobi polynomials, applies Stirling formula for normalization constant, uses Szegő oscillatory asymptotic (Theorem 8.21.8). Oscillatory term averages to constant via Weyl equidistribution, proving linear growth with positive constant.

**Conclusion:** True

---

[059d1844.md](https://github.com/igorratn/coyote-math/blob/main/059d1844.md) - Let $P_\ell^m(x)$ denote the associated Legendre functions on $[-1,1]$. For fixed $x_0 \in (-1,1)$ and $m \geq 0$, consider the normalized weighted sum $S_N^{(m)}(x_0) = \sum_{\ell=m}^{N} \frac{(2\ell+1)(\ell-m)!}{(\ell+m)!} \cdot P_\ell^m(x_0) \cdot P_\ell^m(x_0)$.

**Claim:** For all $m \geq 0$ and $x_0 \in (-1,1)$, the sum satisfies $S_N^{(m)}(x_0) = \frac{N^2}{2(1-x_0^2)} + O(N)$ as $N \to \infty$.

**Solution Methodology:** Uses Christoffel-Darboux formula with factorial normalization. Shows that factorial weight $\frac{(\ell-m)!}{(\ell+m)!}$ changes asymptotic behavior—for $m=0$ gives linear $O(N)$ growth, not quadratic.

**Conclusion:** False

### 1.6.3 Christoffel-Darboux Second-Kind Functions

**Total files: 1**

[93f8b201.md](https://github.com/igorratn/coyote-math/blob/main/93f8b201.md) - For normalized associated Legendre functions with fixed $m$, considers second-kind Wronskian formula using recurrence-based Christoffel-Darboux.

**Claim:** The Wronskian satisfies a specific closed-form identity.

**Solution Methodology:** Uses recurrence-based Christoffel-Darboux formula for fixed $m$ to analyze the Wronskian structure.

**Conclusion:** False

### 1.6.4 Zonal Kernel Partial Sums at North Pole

**Total files: 1**

[2170af0b.md](https://github.com/igorratn/coyote-math/blob/main/2170af0b.md) - Let $Y_{\ell m}(\theta, \phi)$ be the standard orthonormal spherical harmonics. Define the kernel $K_N(\theta_0) = \sum_{\ell=0}^{N} \sum_{m=-\ell}^{\ell} Y_{\ell m}(0,0) Y_{\ell m}^*(\theta_0, 0)$ and normalized sum $S_N(\theta_0) = \frac{1}{\sqrt{N}} K_N(\theta_0)$.

**Claim:** For any fixed $\theta_0 \in (0, \pi)$, the sequence $\{S_N(\theta_0)\}_{N=1}^{\infty}$ is bounded as $N \to \infty$.

**Solution Methodology:** At north pole, only $m=0$ terms survive, reducing to zonal sum. Uses Legendre polynomial asymptotics and oscillatory cancellation to show boundedness.

**Conclusion:** True

---

## 1.7 Addition Theorem as Projection Operator

**Total files: 1**

### 1.7.1 Integral Operators and Reproducing Kernels

**Total files: 1**

[842d9e3e.md](https://github.com/igorratn/coyote-math/blob/main/842d9e3e.md) - Define operator $T_\ell$ by $(T_\ell f)(\mathbf{n}_1) = \int_{S^2} P_\ell(\mathbf{n}_1 \cdot \mathbf{n}_2)f(\mathbf{n}_2)d\Omega_2$.

**Claim:** $T_\ell$ is a projection operator onto the subspace of spherical harmonics of order $\ell$ with scaling factor $\frac{4\pi}{2\ell+1}$.

**Solution Methodology:** Uses addition theorem to show $T_\ell Y_{\ell' m} = \frac{4\pi}{2\ell+1}\delta_{\ell\ell'}Y_{\ell' m}$. This is scaled projection $T_\ell = \frac{4\pi}{2\ell+1}P_\ell$, not idempotent.

**Conclusion:** False

---

## 1.8 Angular Momentum Operator Limits and Singularities

**Total files: 1**

### 1.8.1 Raising Operator Derivative with Polar Singularity

**Total files: 1**

[07d41e49.md](https://github.com/igorratn/coyote-math/blob/main/07d41e49.md) - Let $Y_{\ell m}(\theta,\phi)$ denote standard spherical harmonics with raising operator $L_+ Y_{\ell m} = \sqrt{(\ell-m)(\ell+m+1)} Y_{\ell,m+1}$. For fixed $\ell \geq 1$ and $-\ell \leq m < \ell$, consider $R_{\ell m}(\theta) = \frac{1}{\sin\theta} \frac{\partial Y_{\ell m}(\theta,0)}{\partial\theta}$.

**Claim:** For all $\ell \geq 1$ and $-\ell \leq m < \ell$, the limit $\lim_{\theta \to 0} \frac{R_{\ell m}(\theta)}{Y_{\ell,m+1}(\theta,0)} = \sqrt{(\ell-m)(\ell+m+1)}$ exists and equals the raising operator coefficient.

**Solution Methodology:** Examines raising operator $L_+ = e^{i\phi}(\frac{\partial}{\partial\theta} + i\cot\theta\frac{\partial}{\partial\phi})$ at $\phi=0$. Counterexample with $\ell=1, m=0$ shows divergence from $1/\sin\theta$ factor in $R_{\ell m}$'s definition, not from $\cot\theta$ term.

**Conclusion:** False

---

## 1.9 Rotation and Pole Behavior

**Total files: 2**

### 1.9.1 Wigner D-function Rotation to North Pole

**Total files: 1**

[9bee8030.md](https://github.com/igorratn/coyote-math/blob/main/9bee8030.md) - Consider rotation of sphere about $y$-axis by angle $\beta \in (0,\pi)$. The rotated spherical harmonic is $\tilde{Y}_{\ell m}(\theta,\phi;\beta) = \sum_{m'=-\ell}^{\ell} d_{m'm}^{\ell}(\beta) Y_{\ell m'}(\theta,\phi)$.

**Claim:** For all $\ell \geq 1$ with $|m| \leq \ell$, the pole evaluation $F_{\ell m}(\beta) = \lim_{\theta \to 0^+} \tilde{Y}_{\ell m}(\theta,0;\beta)$ satisfies $F_{\ell m}(\beta) = \sqrt{\frac{2\ell+1}{4\pi}} P_{\ell}(\cos\beta) \cdot \delta_{m,0}$.

**Solution Methodology:** At north pole, only $m'=0$ component survives giving $F_{\ell m}(\beta) = d_{0m}^{\ell}(\beta)\sqrt{\frac{2\ell+1}{4\pi}}$. Counterexample $\ell=1,m=1$ gives $d_{01}^1(\beta)=-\sin\beta/\sqrt{2} \neq 0$, contradicting claim.

**Conclusion:** False

### 1.9.2 Weighted Moment Integrals with Addition Theorem

**Total files: 1**

[216d864a.md](https://github.com/igorratn/coyote-math/blob/main/216d864a.md) - For integers $\ell \geq 1$ and $k \geq 0$, define $M_{\ell,k} = \int_0^\pi \sin^{2k+1}\theta \sum_{m=-\ell}^{\ell} |Y_{\ell m}(\theta,0)|^2 d\theta$.

**Claim:** For all $\ell \geq 1$ and $k \geq 0$, $M_{\ell,k} = \frac{2\ell+1}{4\pi} \cdot \frac{2^{2k+1} k! (k+1)!}{(2k+2)!}$.

**Solution Methodology:** Uses addition theorem to reduce sum over $m$ to constant $\frac{2\ell+1}{4\pi}$, converts to standard trigonometric integral. Claimed formula has incorrect coefficient—true result involves beta functions with half-integer arguments.

**Conclusion:** False

---

## 1.10 Boundary Behavior and Rodrigues Formulas

**Total files: 1**

### 1.10.1 Rodrigues Formula at Boundary with Normalization

**Total files: 1**

[382346cb.md](https://github.com/igorratn/coyote-math/blob/main/382346cb.md) - The associated Legendre functions satisfy Rodrigues formula $P_\ell^m(x) = \frac{(-1)^m}{2^\ell \ell!} (1-x^2)^{m/2} \frac{d^{\ell+m}}{dx^{\ell+m}}[(x^2-1)^\ell]$. Consider points $x_\epsilon = 1 - \epsilon$ and define $Q_\ell^m(\epsilon) = \epsilon^{m/2} \cdot |P_\ell^m(x_\epsilon)|$.

**Claim:** For all $\ell \geq 1$, $m \geq 1$ with $m \leq \ell$, and all $\epsilon \in (0,1/2)$, the normalized quantity satisfies a uniform bound.

**Solution Methodology:** Direct application of Rodrigues formula with boundary analysis. Expands $(x_\epsilon^2-1)$ and uses $x_\epsilon - 1 = -\epsilon$ to analyze $(1-x_\epsilon)^{m/2} = \epsilon^{m/2}$ factor behavior.

**Conclusion:** True

---

## 1.11 Recurrence Relations at Index Boundaries

**Total files: 1**

### 1.11.1 Three-Term Recurrence at Index Boundary

**Total files: 1**

[655ca5ef.md](https://github.com/igorratn/coyote-math/blob/main/655ca5ef.md) - Let $\Theta_{\ell m}(x)$ denote the normalized associated Legendre functions satisfying three-term recurrence $x \Theta_{\ell m}(x) = A_{\ell m} \Theta_{\ell+1,m}(x) + B_{\ell m} \Theta_{\ell-1,m}(x)$.

**Claim:** Define $F_\ell^m = \Theta_{\ell m} - \alpha_{\ell m}\Theta_{\ell-2,m}$ for $\ell \geq m+2$. Then $xF_\ell^m = C_{\ell m}F_{\ell+1}^m + D_{\ell m}F_{\ell-1}^m$ (two-term recurrence) exists for all $\ell \geq m+3$ and $m \geq 1$.

**Solution Methodology:** Uses recurrence theory with coefficient matching. Expands $xF_\ell^m$ using three-term recurrence, matches coefficients to create overdetermined system. Tests at boundary $\ell=m+3$ where $B_{\ell-2,m}$ approaches $B_{m,m}=0$, revealing structural obstruction.

**Conclusion:** False

---

## 1.12 Differential Operators on Associated Legendre Functions

**Total files: 1**

### 1.12.1 First-Order Differential Operator with Asymptotic Analysis

**Total files: 1**

[413f70e4.md](https://github.com/igorratn/coyote-math/blob/main/413f70e4.md) - Let $\Theta_{\ell m}(x)$ denote normalized associated Legendre functions. Define first-order differential operator $(\mathcal{L} f)(x) = (1-x^2) \frac{df}{dx}(x)$. For fixed $m \geq 1$ and $x_0 \in (-1,1)$, define $S_N^{(m)}(x_0) = \sum_{\ell=m}^N \frac{1}{\ell^2} \left| (\mathcal{L} \Theta_{\ell m})(x_0) \right|^2$.

**Claim:** $\lim_{N \to \infty} \frac{S_N^{(m)}(x_0)}{N} = \frac{\sqrt{1-x_0^2}}{\pi}$.

**Solution Methodology:** Applies NU bounds and asymptotic analysis to the differential operator. Uses properties of $(1-x^2)$ factor and derivative of normalized functions.

**Conclusion:** True

---

## 1.13 Analytic Continuation of Ferrers Functions

**Total files: 1**

### 1.13.1 Branch Cut Analysis and Argument Behavior

**Total files: 1**

[1293e1cf.md](https://github.com/igorratn/coyote-math/blob/main/1293e1cf.md) - Let $P_\ell^m(z)$ denote Ferrers associated Legendre functions, analytically continued from $(-1,1)$ to slit plane $\mathbb{C} \setminus ((-\infty,-1] \cup [1,\infty))$.

**Claim:** For fixed compact set $K \subset (-1,1)$ and $x \in K$ with $P_\ell^m(x) \ne 0$, define $\Phi_\ell^m(x,y) = \arg\left( \frac{P_\ell^m(x+iy)}{P_\ell^m(x-iy)} \right)$ for small $y > 0$. Tests behavior of argument function under analytic continuation.

**Solution Methodology:** Uses branch cut analysis and continuity arguments for Ferrers functions in complex plane. Analyzes how argument changes as function is evaluated above and below real axis.

**Conclusion:** True

---

## Summary

**Total:** 19 files

**Methodological patterns:**
- Problems 07d41e49 and 339da8e1 both involve misidentifying the source of mathematical behavior (singularity vs. integral value)
- Problems 9bee8030 and 27ff7bd2 both use north pole evaluation as a testing strategy
- Problems 16ab09af and eea363eb use Nikiforov-Uvarov bounds and estimates
- Problems 85ca892d, 059d1844, 2170af0b, and 93f8b201 involve Christoffel-Darboux formulas
- Problems 842d9e3e, 27ff7bd2, and 216d864a apply the addition theorem in different contexts
- Problems 382346cb and 655ca5ef test boundary behavior and index limits
