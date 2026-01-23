# Updated Cluster 1: Spherical Harmonics on the Unit Sphere

**Total files: 13** (Previously 10, added 3 new files)

This cluster contains all problems involving spherical harmonics $Y_{\ell m}(\theta,\phi)$, associated Legendre functions $P_\ell^m(x)$, or axisymmetric harmonics on the sphere. These are separated from general Legendre polynomial problems because they involve the angular part of Laplace's equation in spherical coordinates.

---

## 1.1 Monotonicity via Auxiliary Function Method

**Total files: 1**

### 1.1.1 Nikiforov-Uvarov Auxiliary Function for Local Maxima

**Total files: 1**

[16ab09af.md](https://github.com/igorratn/coyote-math/blob/main/16ab09af.md) - A spherical harmonic of order $\ell$, denoted by $Y_{\ell m}(\theta, \phi)$, is defined as a bounded single-valued solution to the angular part of the Laplace equation. These functions take the form $Y_{\ell m}(\theta, \phi) = \Phi_m(\phi) \Theta_{\ell m}(\cos \theta)$ where $\Phi_m(\phi) = \frac{1}{\sqrt{2\pi}} e^{im\phi}$ and $\Theta_{\ell m}(\cos \theta)$ is the normalized solution to the polar equation. A zonal spherical harmonic corresponds to the case $m = 0$, where the function is independent of the azimuthal angle $\phi$ and is proportional to the Legendre polynomial $P_\ell(\cos \theta)$: $Y_{\ell 0}(\theta, \phi) = \sqrt{\frac{2\ell+1}{4\pi}} P_\ell(\cos \theta)$. For $\ell \ge 1$ and $\theta \in (0, \pi/2]$, consider the function $g(\theta) = |Y_{\ell 0}(\theta, \phi)|$.

**Claim:** As $\theta$ increases from 0 toward $\pi/2$, the values of the successive local maxima of $g(\theta)$ form a strictly decreasing sequence.

**Solution Methodology:** The proof uses the Nikiforov-Uvarov auxiliary function method from Chapter 2, Section 7. Setting $x = \cos\theta$ and $y(x) = P_\ell(x)$, the key insight is to construct the auxiliary function $v(x) = [y(x)]^2 + \frac{\sigma(x)}{\lambda} [y'(x)]^2$ where $\sigma(x) = 1-x^2$ and $\lambda = \ell(\ell+1)$. By differentiating and using the Legendre differential equation, one obtains $v'(x) = \frac{2x}{\lambda}[y'(x)]^2$, which is strictly positive for $x \in (0,1)$ whenever $y'(x) \neq 0$. This proves $v$ is strictly increasing. Between consecutive zeros of $P_\ell$, the local maxima of $|y|$ occur at critical points where $y' = 0$, at which points $v = y^2 = |y|^2$. The monotonicity of $v$ then forces the heights of successive maxima to strictly decrease as $x$ decreases (equivalently, as $\theta$ increases). This method transforms a question about oscillatory behavior into a monotonicity property of an auxiliary energy-like function.

**Conclusion:** True

---

## 1.2 Addition Theorem and Modified Sums

**Total files: 1**

### 1.2.1 Point Evaluation Strategy (North Pole Test)

**Total files: 1**

[27ff7bd2.md](https://github.com/igorratn/coyote-math/blob/main/27ff7bd2.md) - Tests whether the modified sum $S_\ell(\theta_1,\phi_1,\theta_2,\phi_2) = \sum_{m=-\ell}^{\ell} (-1)^m Y_{\ell m}(\theta_1,\phi_1) \overline{Y_{\ell m}(\theta_2,\phi_2)}$ equals $\frac{2\ell+1}{4\pi} P_\ell(-\cos\omega)$ where $\omega$ is the angle between the two points on the sphere (False - proven by evaluating at north pole where only $m=0$ term survives, showing the formula holds only for even $\ell$)

---

## 1.3 Modified Weight Orthogonality on the Sphere

**Total files: 3**

### 1.3.1 Axisymmetric Harmonics with Recurrence Analysis

**Total files: 1**

[1180dd83.md](https://github.com/igorratn/coyote-math/blob/main/1180dd83.md) - Tests whether for axisymmetric harmonic function $\tilde{u}(r,\theta) = r^n P_n(\cos\theta) + \alpha_n r^{n-1} P_{n-1}(\cos\theta)$ there exists nonzero $\alpha_n$ such that $\tilde{u}$ is orthogonal to constants on the unit sphere with weight $\cos\theta$ for all $n \geq 2$ (False - using recurrence $xP_k = \frac{k+1}{2k+1}P_{k+1} + \frac{k}{2k+1}P_{k-1}$ shows obstruction at $n=2$)

### 1.3.2 Cauchy Principal Value Weight

**Total files: 1**

[2002a358.md](https://github.com/igorratn/coyote-math/blob/main/2002a358.md) - Tests whether for zonal harmonic $Y_{\ell 0}(x) = C_\ell P_\ell(x)$ and modified polynomial $\tilde{P}_\ell(x) = P_\ell(x) + \gamma P_{\ell-1}(x)$, the condition $(\tilde{P}_\ell, q)_\beta = 0$ for all $q$ with $\deg(q) < \ell$ using Cauchy principal value weight $\frac{1}{x-\beta}$ is equivalent to a single integral condition (True - proven by polynomial decomposition $q(x) = (x-\beta)r(x) + q(\beta)$)

### 1.3.3 Wigner D-function Weighted Average

**Total files: 1**

[339da8e1.md](https://github.com/igorratn/coyote-math/blob/main/339da8e1.md) - Tests whether weighted average $\bar{S}_\ell = \frac{1}{2}\int_0^\pi [\sum_{m=-\ell}^\ell d_{m,0}^\ell(\beta)d_{0,m}^\ell(\beta)]\sin\beta\,d\beta$ equals $\frac{1}{2\ell+1}$ for Wigner D-functions (False - shown using composition law and weighted integration)

---

## 1.4 Cauchy Transform Theory for Spherical Harmonics

**Total files: 1**

### 1.4.1 Wronskian-Type Identity via Recurrence Relations

**Total files: 1**

[93f8b201.md](https://github.com/igorratn/coyote-math/blob/main/93f8b201.md) - Angular functions for spherical harmonics $\Theta_{lm}(x) = \sqrt{\frac{2l+1}{2}\frac{(l-m)!}{(l+m)!}} P_l^m(x)$ with Cauchy transform $Q_{lm}(z) = \int_{-1}^1 \frac{\Theta_{lm}(t)}{z-t}dt$ form a Wronskian-type function $\Phi_l^m(z) = \Theta_{lm}(z)Q_{l-1,m}(z) - \Theta_{l-1,m}(z)Q_{lm}(z)$. Claim tests whether $\Phi_l^m$ is constant with a specific value. Uses three-term recurrence for $\Theta_{lm}$ derived from spherical harmonic recurrence $\cos\theta Y_{\ell m} = \sqrt{\frac{(\ell+1)^2-m^2}{(2\ell+1)(2\ell+3)}}Y_{\ell+1,m} + \sqrt{\frac{\ell^2-m^2}{(2\ell-1)(2\ell+1)}}Y_{\ell-1,m}$, then establishes that Cauchy transforms satisfy the same recurrence by integrating $\frac{t\Theta_{\ell-1,m}(t)}{z-t}$ and using orthogonality to constants. (False - specific constant formula incorrect)

---

## 1.5 Zero Distribution Properties

**Total files: 1**

### 1.5.1 Interlacing Zeros for Different Azimuthal Modes

**Total files: 1**

[d4dd1d63.md](https://github.com/igorratn/coyote-math/blob/main/d4dd1d63.md) - Tests whether zeros of polar components $\Theta_{l,m+1}(x)$ and $\Theta_{lm}(x)$ strictly interlace on $(-1,1)$ for fixed degree $l$ and consecutive azimuthal modes $m$ and $m+1$ (True - proven using Sturm theory for associated Legendre differential equation)

---

## 1.6 Uniform Bounds

**Total files: 2**

### 1.6.1 Power Weight Bounds on Spherical Harmonics

**Total files: 1**

[eea363eb.md](https://github.com/igorratn/coyote-math/blob/main/eea363eb.md) - Let $Y_{\ell}^{m}(\theta, \phi)$ be the standard spherical harmonics on $\mathbb{S}^{2}$, normalized in $L^{2}(\mathbb{S}^{2})$, with integers $\ell \ge 0$ and $|m| \le \ell$. The spherical harmonics are defined by $Y_{\ell}^{m}(\theta, \phi) = \sqrt{\frac{2\ell+1}{4\pi}\frac{(\ell-m)!}{(\ell+m)!}} P_{\ell}^{m}(\cos\theta) e^{im\phi}$ where $P_{\ell}^{m}$ denotes the associated Legendre function and $(\theta, \phi) \in [0, \pi] \times [0, 2\pi)$.

**Claim:** Fix $m \in \mathbb{Z}$. There exist constants $C > 0$ and $\delta \in (0, 1)$, independent of $\ell$, such that for all integers $\ell \ge |m|$, $\sup_{\theta \in [0, \pi]} |(\sin\theta)^{|m|+\delta} Y_{\ell}^{m}(\theta, \phi)| \le C$.

**Solution Methodology:** The proof uses a combination of the Jacobi polynomial representation of associated Legendre functions and asymptotic analysis. First, the spherical harmonic is expressed using the identity $P_\ell^{|m|}(x) = (-1)^{|m|} (1-x^2)^{|m|/2} \frac{(\ell+|m|)!}{2^{|m|}\ell!} P_{n}^{(|m|, |m|)}(x)$ where $n = \ell - |m|$. The normalization constant $B_{\ell, m} = \sqrt{\frac{2\ell+1}{4\pi}} \frac{\sqrt{(\ell+|m|)! (\ell-|m|)!}}{2^{|m|} \ell!}$ is shown to be $O(\sqrt{\ell})$ via Stirling's formula. The key bound comes from Nikiforov–Uvarov's Jacobi envelope estimate (Special Functions of Mathematical Physics, 1988, Chapter II, Section 7, Equation 19): for $\alpha, \beta > -1/2$, there exists $C_{|m|} > 0$ such that $|(1-x)^{\alpha/2+1/4} (1+x)^{\beta/2+1/4} P_n^{(\alpha, \beta)}(x)| \le \frac{C_{|m|}}{\sqrt{n}}$ uniformly in $n$ and $x \in [-1,1]$. Setting $\alpha = \beta = |m|$ and multiplying by the weight $(\sin\theta)^{|m|+\delta} = (1-x^2)^{(|m|+\delta)/2}$ yields boundedness provided $\frac{|m|}{2} + \frac{\delta}{2} - \frac{1}{4} \ge 0$, i.e., $\delta \ge \frac{1}{2} - |m|$. For $|m| \ge 1$, this holds for all $\delta \in (0,1)$. For $m=0$, choosing $\delta \in [1/2, 1)$ satisfies the condition.

**Conclusion:** True

### 1.6.2 Christoffel-Darboux Asymptotic Growth for Associated Legendre Kernels

**Total files: 1**

[85ca892d.md](https://github.com/igorratn/coyote-math/blob/main/85ca892d.md) - Let $\Theta_{\ell m}(x)$ denote the normalized associated Legendre functions on $x\in[-1,1]$ for integers $\ell\ge m\ge0$, defined by $\Theta_{\ell m}(x)=\sqrt{\frac{2\ell+1}{2}\frac{(\ell-m)!}{(\ell+m)!}}P_\ell^m(x)$, where $P_\ell^m(x)$ are the standard associated Legendre functions. For fixed $m\ge0$ and any $x_0\in(-1,1)$, define the diagonal kernel value $K_N^{(m)}(x_0,x_0)=\sum_{\ell=m}^N\Theta_{\ell m}^2(x_0)$.

**Claim:** There exists a constant $C(x_0,m)>0$ such that $\liminf_{N\to\infty}\frac{K_N^{(m)}(x_0,x_0)}{N}\ge C(x_0,m)$.

**Solution Methodology:** The proof uses a sophisticated combination of representation theory, asymptotic analysis, and oscillatory sum techniques. First, the associated Legendre functions are converted to Jacobi polynomials using the identity $P_\ell^m(x) = (-1)^m 2^{-m} (1-x^2)^{m/2} \frac{(\ell+m)!}{\ell!} P_{\ell-m}^{(m, m)}(x)$. The normalization constant is shown to satisfy $\sqrt{\frac{2\ell+1}{2}} \frac{\sqrt{(\ell-m)!}}{\ell!} \frac{(\ell+m)!}{2^m \sqrt{(\ell+m)!}} = c_m \sqrt{\ell}(1 + O(\ell^{-1}))$ via Stirling's formula. Next, Szegő's interior oscillatory asymptotic for Jacobi polynomials (Orthogonal Polynomials, Chapter VIII, Theorem 8.21.8, formula (8.21.10)) is applied: for $x_0 = \cos\theta_0$ with $\theta_0 \in (0,\pi)$, $P_{\ell-m}^{(m, m)}(\cos \theta_0) = (\ell-m)^{-1/2} k(\theta_0) \cos((\ell + \tfrac{1}{2})\theta_0 + \gamma) + O(\ell^{-3/2})$. Combining these gives the sharp asymptotic $\Theta_{\ell m}(x_0)^2 = \frac{2}{\pi \sqrt{1-x_0^2}} \cos^2(\ell \theta_0 + \varphi) + o(1)$. Averaging over $\ell = m, \dots, N$ and using $\cos^2 t = \frac{1}{2} + \frac{1}{2}\cos(2t)$, the oscillatory sum's contribution vanishes asymptotically (by Riemann-Lebesgue or Weyl equidistribution), leaving the constant term to dominate. This proves the kernel grows linearly with $N$ with positive constant $C(x_0,m) = \frac{1}{\pi\sqrt{1-x_0^2}}$.

**Conclusion:** True

---

## 1.7 Addition Theorem as Projection Operator

**Total files: 1**

### 1.7.1 Integral Operators and Reproducing Kernels

**Total files: 1**

[842d9e3e.md](https://github.com/igorratn/coyote-math/blob/main/842d9e3e.md) - Tests whether operator $T_\ell$ defined by $(T_\ell f)(\mathbf{n}_1) = \int_{S^2} P_\ell(\mathbf{n}_1 \cdot \mathbf{n}_2)f(\mathbf{n}_2)d\Omega_2$ is a projection operator onto subspace spanned by spherical harmonics of order $\ell$ with scaling factor $\frac{4\pi}{2\ell+1}$ (False - the operator is actually the scaled projection $T_\ell = \frac{4\pi}{2\ell+1}P_\ell$, not an idempotent projection)

---

## 1.8 Angular Momentum Operator Limits and Singularities

**Total files: 1** ⭐ NEW

### 1.8.1 Raising Operator Derivative with Polar Singularity

**Total files: 1** ⭐ NEW

[07d41e49.md](https://github.com/igorratn/coyote-math/blob/main/07d41e49.md) - Let $Y_{\ell m}(\theta,\phi)$ denote standard spherical harmonics with the angular momentum raising operator $L_+ Y_{\ell m} = \sqrt{(\ell-m)(\ell+m+1)} Y_{\ell,m+1}$. For fixed degree $\ell \geq 1$ and $-\ell \leq m < \ell$, consider $R_{\ell m}(\theta) = \frac{1}{\sin\theta} \frac{\partial Y_{\ell m}(\theta,0)}{\partial\theta}$.

**Claim:** For all integers $\ell \geq 1$ and $-\ell \leq m < \ell$, the limit $\lim_{\theta \to 0} \frac{R_{\ell m}(\theta)}{Y_{\ell,m+1}(\theta,0)} = \sqrt{(\ell-m)(\ell+m+1)}$ exists and equals the raising operator coefficient.

**Solution Methodology:** The proof examines the raising operator $L_+ = e^{i\phi}(\frac{\partial}{\partial\theta} + i\cot\theta\frac{\partial}{\partial\phi})$ at $\phi=0$. Using $\frac{\partial Y_{\ell m}}{\partial\phi} = im Y_{\ell m}$, the derivative relation becomes $\frac{\partial Y_{\ell m}(\theta,0)}{\partial\theta} = \sqrt{(\ell-m)(\ell+m+1)} Y_{\ell,m+1}(\theta,0) + m\cot\theta Y_{\ell m}(\theta,0)$. The key counterexample uses $\ell=1, m=0$: Here $Y_{10}(\theta,0) = \sqrt{\frac{3}{4\pi}}\cos\theta$ and $Y_{11}(\theta,0) = -\sqrt{\frac{3}{8\pi}}\sin\theta$, giving $R_{10}(\theta) = -\sqrt{\frac{3}{4\pi}}$ (constant). The ratio $\frac{R_{10}(\theta)}{Y_{11}(\theta,0)} = \frac{\sqrt{2}}{\sin\theta} \to +\infty$ as $\theta \to 0$. The divergence arises from the $1/\sin\theta$ factor in $R_{\ell m}$'s definition, not from the $\cot\theta$ term (which vanishes when $m=0$). This demonstrates a common error in identifying singularity sources: the problematic factor is the explicit $1/\sin\theta$ in the definition, independent of operator structure.

**Conclusion:** False

---

## 1.9 Rotation and Pole Behavior

**Total files: 2** ⭐ NEW (section)

### 1.9.1 Wigner D-function Rotation to North Pole

**Total files: 1** ⭐ NEW

[9bee8030.md](https://github.com/igorratn/coyote-math/blob/main/9bee8030.md) - Consider a rotation of the sphere about the $y$-axis by angle $\beta \in (0,\pi)$. The rotated spherical harmonic is $\tilde{Y}_{\ell m}(\theta,\phi;\beta) = \sum_{m'=-\ell}^{\ell} d_{m'm}^{\ell}(\beta) Y_{\ell m'}(\theta,\phi)$ where $d_{m'm}^{\ell}(\beta)$ are reduced Wigner d-functions. Define the pole evaluation $F_{\ell m}(\beta) = \lim_{\theta \to 0^+} \tilde{Y}_{\ell m}(\theta,0;\beta)$.

**Claim:** For all $\ell \geq 1$ with $|m| \leq \ell$, the pole evaluation satisfies $F_{\ell m}(\beta) = \sqrt{\frac{2\ell+1}{4\pi}} P_{\ell}(\cos\beta) \cdot \delta_{m,0}$.

**Solution Methodology:** At the north pole $\theta=0$, associated Legendre functions satisfy $P_\ell^{m'}(1)=0$ for $m' \neq 0$ (from the $(1-x^2)^{m'/2}$ factor) and $P_\ell^0(1)=1$. Therefore $Y_{\ell m'}(0,\phi) = \sqrt{\frac{2\ell+1}{4\pi}} \delta_{m',0}$. Substituting into the rotation formula gives $F_{\ell m}(\beta) = d_{0m}^{\ell}(\beta) \sqrt{\frac{2\ell+1}{4\pi}}$. The counterexample uses $\ell=1, m=1$: The standard convention gives $d^{1}_{01}(\beta)=-\frac{\sin\beta}{\sqrt{2}}$, hence $F_{11}(\beta) = -\sqrt{\frac{3}{4\pi}}\frac{\sin\beta}{\sqrt{2}} \neq 0$ for all $\beta \in (0,\pi)$, contradicting the claim's requirement $F_{11}(\beta) = 0$ (from $\delta_{1,0}=0$). The error is assuming all rotations preserve the $m=0$ selection rule at poles, when in fact only $m'=0$ survives at the pole after evaluation, but the rotation mixes different $m$ components before evaluation.

**Conclusion:** False

### 1.9.2 Weighted Moment Integrals with Addition Theorem

**Total files: 1** ⭐ NEW

[216d864a.md](https://github.com/igorratn/coyote-math/blob/main/216d864a.md) - For integers $\ell \geq 1$ and $k \geq 0$, define the weighted moment integral $M_{\ell,k} = \int_0^\pi \sin^{2k+1}\theta \sum_{m=-\ell}^{\ell} |Y_{\ell m}(\theta,0)|^2 d\theta$.

**Claim:** For all $\ell \geq 1$ and $k \geq 0$, $M_{\ell,k} = \frac{2\ell+1}{4\pi} \cdot \frac{2^{2k+1} k! (k+1)!}{(2k+2)!}$.

**Solution Methodology:** The addition theorem for spherical harmonics evaluated at the same point gives $\sum_{m=-\ell}^{\ell} |Y_{\ell m}(\theta,0)|^2 = \frac{2\ell+1}{4\pi}$ (independent of $\theta$). Therefore $M_{\ell,k} = \frac{2\ell+1}{4\pi} \int_0^\pi \sin^{2k+1}\theta d\theta$. For $k=0$: The integral evaluates to $\int_0^\pi \sin\theta d\theta = 2$, giving $M_{\ell,0} = \frac{2\ell+1}{2\pi}$. The claimed formula for $k=0$ gives $\frac{2\ell+1}{4\pi} \cdot \frac{2 \cdot 0! \cdot 1!}{2!} = \frac{2\ell+1}{4\pi}$. Since $\frac{2\ell+1}{2\pi} \neq \frac{2\ell+1}{4\pi}$, the claim is false. The error is in the claimed formula for the power of 2 or factorial ratio—the correct moment formula involves beta functions $B(\frac{1}{2}, k+1) = \frac{\Gamma(\frac{1}{2})\Gamma(k+1)}{\Gamma(k+\frac{3}{2})}$, not the simpler expression claimed.

**Conclusion:** False

---

## Summary of Changes

**Previous Total:** 10 files  
**New Total:** 13 files  
**Added:** 3 files

**New files added:**
- [07d41e49.md](https://github.com/igorratn/coyote-math/blob/main/07d41e49.md) - Added to new section 1.8.1 "Raising Operator Derivative with Polar Singularity"
- [9bee8030.md](https://github.com/igorratn/coyote-math/blob/main/9bee8030.md) - Added to new section 1.9.1 "Wigner D-function Rotation to North Pole"
- [216d864a.md](https://github.com/igorratn/coyote-math/blob/main/216d864a.md) - Added to new section 1.9.2 "Weighted Moment Integrals with Addition Theorem"

**New sections created:**
- Section 1.8 "Angular Momentum Operator Limits and Singularities" (1 file)
- Section 1.9 "Rotation and Pole Behavior" (2 files)

**Key insights from the new files:**

1. **07d41e49.md (Raising Operator):** Demonstrates a common error pattern in identifying sources of singularities—the divergence comes from the $1/\sin\theta$ factor in the definition of $R_{\ell m}$, not from the $\cot\theta$ term in the raising operator (which can vanish). This is methodologically similar to problem 339da8e1.md where the error source is misidentified.

2. **9bee8030.md (Rotation to Pole):** Shows that rotation mixing occurs before pole evaluation, so the claim that rotations preserve the $m=0$ selection at poles fails. Only the $m'=0$ component survives after evaluation at the pole, but the Wigner d-function $d_{0m}^{\ell}(\beta)$ can be nonzero for $m \neq 0$, creating the counterexample.

3. **216d864a.md (Weighted Moments):** Uses the addition theorem to reduce the sum over $m$ to a constant, converting the problem to a standard trigonometric integral. The claimed formula has an incorrect coefficient—the true formula involves beta functions with half-integer arguments rather than the simpler factorial expression claimed.

**Methodological patterns:**
- Problems 07d41e49 and 339da8e1 both involve misidentifying the source of mathematical behavior (singularity vs. integral value)
- Problems 9bee8030 and 27ff7bd2 both use north pole evaluation as a testing strategy
- Problem 216d864a uses the addition theorem similarly to problems in section 1.2 and 1.7