# Comprehensive Fine-Grained Clustering of Mathematical Problems

## Overview
Total files discovered: **80 files** (79 with content + 1 empty)

---

## Cluster 1: Orthogonal Polynomial Theory & Modifications (28 files)

### Sub-cluster 1.1: Modified Weight Functions & Two-Term Recombinations - True/False Problems (8 files)

#### Method 1.1.A: Decomposition & Orthogonality Dimension Counting (3 files)

**Typical Example ([027f10a7.md](https://github.com/igorratn/coyote-math/blob/main/027f10a7.md)):**
Studies Jacobi polynomials $P_n^{(\alpha,\beta)}(x)$ with modified weight $\tilde{p}(x) = p(x)/(x-\beta_1)$ where $|\beta_1|>1$. Defines modified polynomials $\tilde{P}_n(x) = P_n(x) + \gamma_n P_{n-1}(x)$ and proves that the condition $(\tilde{P}_n, 1)_{\tilde{p}} = 0$ is necessary and sufficient for full orthogonality. **Method:** Uses decomposition $q(x) = q(\beta_1) + (x-\beta_1)r(x)$ to separate orthogonality conditions into (i) orthogonality to $\mathbb{P}_{n-2}$ with respect to $p(x)$, which gives 2-dimensional solution space, and (ii) single condition at pole $\beta_1$. Dimension counting shows two-term ansatz spans solution space. **Conclusion: True.**

**Other files:**
- [2002a358.md](https://github.com/igorratn/coyote-math/blob/main/2002a358.md): Legendre polynomials with Cauchy principal value; uses same decomposition method at pole $\beta$. **True.**
- [9c2e2dec.md](https://github.com/igorratn/coyote-math/blob/main/9c2e2dec.md): Jacobi polynomials; proves via dimension counting that $(n+1)-(n-1)=2$ dimensional space spanned by two Jacobi polynomials. **True.**

#### Method 1.1.B: Recurrence Relations & Direct Computation (5 files)

**Typical Example ([076ef56b.md](https://github.com/igorratn/coyote-math/blob/main/076ef56b.md)):**
Studies Hermite polynomials with modified weight $(x^2+1)e^{-x^2}$ and ansatz $\tilde{H}_n(x) = H_n(x) + \delta_n H_{n-2}(x)$. **Method:** Uses three-term Hermite recurrence $xH_k = \frac{1}{2}H_{k+1} + kH_{k-1}$ to derive $x^2H_k = \frac{1}{4}H_{k+2} + \frac{2k+1}{2}H_k + k(k-1)H_{k-2}$. Checks orthogonality to $H_{n-4}$ which forces $\delta_n=0$, then shows this contradicts orthogonality to $H_{n-2}$ for $n\geq 4$. **Conclusion: False.**

**Other files:**
- [3fc90f09.md](https://github.com/igorratn/coyote-math/blob/main/3fc90f09.md): Hermite polynomials; uses direct computation for $n=0$ case, computes integrals explicitly. **False.**
- [85d6da54.md](https://github.com/igorratn/coyote-math/blob/main/85d6da54.md): Jacobi polynomials; uses three-term recurrence $xp_n = a_{n+1}p_{n+1} + b_np_n + a_np_{n-1}$ to show orthogonality to $p_{n-2}$ forces contradiction. **False.**
- [5dd03fbd.md](https://github.com/igorratn/coyote-math/blob/main/5dd03fbd.md): Laguerre polynomials; uses degree argument that orthogonal polynomial of degree $n$ must be orthogonal to all degree $<n$. **True.**
- [b013b487.md](https://github.com/igorratn/coyote-math/blob/main/b013b487.md): General polynomials; uses Cauchy transform and shows two independent conditions (interpolation at $\alpha_1$ and pole at $\beta_1$) are needed. **False.**

### Sub-cluster 1.2: Functions of the Second Kind & Christoffel-Darboux - True/False Problems (9 files)

#### Method 1.2.A: Christoffel-Darboux Formula & Integration (4 files)

**Typical Example ([25fec83d.md](https://github.com/igorratn/coyote-math/blob/main/25fec83d.md)):**
Studies Legendre functions of the second kind $Q_n(z) = \frac{1}{2}\int_{-1}^1 \frac{P_n(t)}{z-t}dt$ and defines $f_n(z) = Q_n(z)P_{n+1}(z) - Q_{n+1}(z)P_n(z)$. **Method:** Writes $f_n(z)$ as integral using Christoffel-Darboux formula $K_n(z,t) = \frac{P_{n+1}(z)P_n(t) - P_n(z)P_{n+1}(t)}{z-t} = \frac{1}{n+1}\sum_{k=0}^n (2k+1)P_k(z)P_k(t)$. Integrates over $[-1,1]$ in $t$; only $k=0$ survives by orthogonality, yielding constant $1/(n+1)$. **Conclusion: True.**

**Other files:**
- [53de3231.md](https://github.com/igorratn/coyote-math/blob/main/53de3231.md): Laguerre second-kind; uses monic Christoffel-Darboux and integrates, result is $h_{n-1}$. **True.**
- [5c7587a5.md](https://github.com/igorratn/coyote-math/blob/main/5c7587a5.md): Hermite second-kind; uses monic Christoffel-Darboux, integrates to get constant $h_{n-1}$, then scales back. **True.**
- [93f8b201.md](https://github.com/igorratn/coyote-math/blob/main/93f8b201.md): Spherical harmonics; uses recurrence-based Christoffel-Darboux formula for fixed $m$. **False.**

#### Method 1.2.B: Asymptotic Expansion as $|z|\to\infty$ (3 files)

**Typical Example ([147341f7.md](https://github.com/igorratn/coyote-math/blob/main/147341f7.md)):**
Studies Legendre second-kind Wronskian $W_n(z) = q_n(z)p_{n-1}(z) - q_{n-1}(z)p_n(z)$. **Method:** Expands Cauchy integral using $\frac{1}{z-t} = \sum_{k\geq 0}\frac{t^k}{z^{k+1}}$ for $|z|>1$. Uses orthogonality $\int_{-1}^1 t^k p_n(t)dt = 0$ for $k<n$ and $= h_n$ for $k=n$. Obtains $q_n(z) = h_n/z^{n+1} + O(z^{-n-2})$. Substitutes into Wronskian and shows leading term is constant $-h_{n-1}$. Since polynomial with finite limit must be constant, $W_n(z) \equiv -h_{n-1}$. **Conclusion: False.**

**Other files:**
- [2d61fb16.md](https://github.com/igorratn/coyote-math/blob/main/2d61fb16.md): Legendre second-kind; uses same asymptotic method, evaluates at specific $a=2$. **False.**
- [3bde7860.md](https://github.com/igorratn/coyote-math/blob/main/3bde7860.md): Laguerre second-order transform; uses differentiation and asymptotic analysis showing degree mismatch. **False.**

#### Method 1.2.C: Orthogonality-Based Series Expansion (2 files)

**Typical Example ([de28a871.md](https://github.com/igorratn/coyote-math/blob/main/de28a871.md)):**
Studies Hermite second-kind ratio limit $\lim_{|z|\to\infty} zQ_n(z)/Q_{n-1}(z) = n$. **Method:** Uses algebraic identity $\frac{1}{z-t} = \sum_{k=0}^N \frac{t^k}{z^{k+1}} + \frac{t^{N+1}}{z^{N+1}(z-t)}$ to expand $Q_n(z)$. Applies orthogonality: $\int_{-\infty}^\infty e^{-t^2}H_n(t)t^k dt = 0$ for $k<n$ and $= \sqrt{\pi}n!$ for $k=n$. Leading term is $Q_n(z) \sim \sqrt{\pi}n!/z^{n+1}$. Forms ratio and obtains limit. **Conclusion: True.**

**Other files:**
- [67128ca2.md](https://github.com/igorratn/coyote-math/blob/main/67128ca2.md): Hermite second-kind; uses same series expansion method based on orthogonality. **True.**

### Sub-cluster 1.3: Asymptotic Behavior & Uniform Bounds - True/False Problems (6 files)

#### Method 1.3.A: Nikiforov-Uvarov Interior Estimates (4 files)

**Typical Example ([ca5a3f25.md](https://github.com/igorratn/coyote-math/blob/main/ca5a3f25.md)):**
Studies Jacobi polynomials $P_n^{(\alpha,\beta)}(x)$ with normalization $d_n$. Claims uniform bound on $|(1-x^2)P_n/d_n|$ for $x\in[-1+\epsilon,1-\epsilon]$. **Method:** Cites Nikiforov-Uvarov Special Functions of Mathematical Physics (1988), Chapter II, §7, interior estimate (inequality 19a): $|P_n^{(\alpha,\beta)}(x)| \leq K_{\epsilon,\alpha,\beta}n^{-1/2}$ for $x$ in interior. Combines with normalization $d_n \sim cn^{-1/2}$ and bound $(1-x^2)\leq M_\epsilon$ on compact interior. Ratio $K_{\epsilon}n^{-1/2}/(cn^{-1/2}) = K_{\epsilon}/c$ is bounded. **Conclusion: True.**

**Other files:**
- [dd13f374.md](https://github.com/igorratn/coyote-math/blob/main/dd13f374.md): Hermite polynomials; cites Nikiforov-Uvarov bound $|H_n(x)/d_n| \leq C_3/n^{1/4}$, uses $n^{-1/4}\leq 1$. **True.**
- [d416c4c4.md](https://github.com/igorratn/coyote-math/blob/main/d416c4c4.md): Laguerre polynomials; cites Nikiforov-Uvarov Eq.(27) with decay factors. **True.**
- [ec15106e.md](https://github.com/igorratn/coyote-math/blob/main/ec15106e.md): Jacobi polynomials; cites Nikiforov-Uvarov Eq.(20) and uses $(1-x^2)^\delta\leq 1$. **True.**

#### Method 1.3.B: Szegő Darboux Asymptotics (2 files)

**Typical Example ([e89ce469.md](https://github.com/igorratn/coyote-math/blob/main/e89ce469.md)):**
Studies Jacobi polynomials with $\sqrt{n}$ factor. Claims uniform bound. **Method:** Uses Szegő Orthogonal Polynomials (4th ed., 1975), Theorem 8.21.8 Darboux asymptotic: $P_n^{(\alpha,\beta)}(\cos\theta) = A(\theta)n^{-1/2}\cos((n+\kappa)\theta+\phi) + O(n^{-3/2})$ uniformly on interior. Shows phase $(n+\kappa)\theta$ advances linearly, so oscillations persist. Constructs subsequence $n_k$ where $|\cos(\cdot)|\geq 1/2$. With $\sqrt{n}$ factor and $d_n\sim cn^{-1/2}$, expression grows as $\sqrt{n_k}\to\infty$. **Conclusion: False.**

**Other files:**
- [b8db5f5e.md](https://github.com/igorratn/coyote-math/blob/main/b8db5f5e.md): Jacobi second-kind asymptotics; uses Nikiforov-Uvarov asymptotic formula for second-kind functions. **True.**

### Sub-cluster 1.4: Extremal Problems & Christoffel Functions - True/False Problems (2 files)

#### Method 1.4.A: Calculus of Variations & Christoffel-Darboux Kernel (2 files)

**Typical Example ([91608bdd.md](https://github.com/igorratn/coyote-math/blob/main/91608bdd.md)):**
Studies one-parameter family $\pi_t(x) = p_{N+1}(x) - tp_N(x)$ and compares $\inf_t \|\pi_t\|^2/\pi_t(x_0)^2$ with full space infimum. **Method:** Computes $\|\pi_t\|^2 = 1+t^2$ by orthonormality. Writes $F(t) = (1+t^2)/(B-tA)^2$ where $A=p_N(x_0)$, $B=p_{N+1}(x_0)$. Minimizes via calculus: $F'(t)=0$ gives $t^*=-A/B$, yielding $\inf F = 1/(A^2+B^2)$. For full space, uses Cauchy-Schwarz: $Q(x_0)^2 \leq \|Q\|^2 \sum_{k=0}^{N+1}p_k(x_0)^2$ with equality for $Q = \sum c_kp_k$ where $c_k\propto p_k(x_0)$. This gives Christoffel function $\inf = 1/\sum_{k=0}^{N+1}p_k(x_0)^2$. Since $p_0(x_0)\neq 0$, denominators satisfy $A^2+B^2 < \sum_{k=0}^{N+1}p_k(x_0)^2$, so infima have reversed inequality. **Conclusion: False.**

**Other files:**
- [f6e16472.md](https://github.com/igorratn/coyote-math/blob/main/f6e16472.md): Similar extremal problem; same calculus optimization and Christoffel-Darboux analysis. **False.**

### Sub-cluster 1.5: Generating Functions & Differential Equations - True/False Problems (3 files)

#### Method 1.5.A: Change of Variables & Known ODE Transfer (2 files)

**Typical Example ([07a8cfcf.md](https://github.com/igorratn/coyote-math/blob/main/07a8cfcf.md)):**
Studies polynomials from generating function $G(x,t) = \exp(\lambda t^2/2 - \lambda xt)$. Claims they satisfy second-order ODE with $\deg\alpha\leq 2$, $\deg\beta\leq 1$. **Method:** Identifies generating function with probabilist's Hermite: $\exp(zs - s^2/2) = \sum He_n(z)s^n/n!$. Sets $c^2=-\lambda$, $s=ct$, $z=cx$ to match forms. Obtains $P_n(x) = c^nHe_n(cx)$. Differentiates: $P_n'(x) = c^{n+1}He_n'(cx)$, $P_n''(x) = c^{n+2}He_n''(cx)$. Substitutes into known Hermite ODE $He_n'' - zHe_n' + nHe_n = 0$, multiplies by $c^{n+2}$, uses $z=cx$ and $c^2=-\lambda$ to get $P_n'' + \lambda xP_n' - \lambda nP_n = 0$. **Conclusion: True.**

**Other files:**
- [4dc6fb67.md](https://github.com/igorratn/coyote-math/blob/main/4dc6fb67.md): Generating function $e^{xt}/(1-t)^{5/2}$; invokes Bochner's theorem directly without explicit transformation. **True.**

#### Method 1.5.B: Parameter Matching & Counterexample (1 file)

**Typical Example ([e75e5639.md](https://github.com/igorratn/coyote-math/blob/main/e75e5639.md)):**
Studies ODE $(1-x^2)p_n'' + \tau(x)p_n' + \lambda_np_n = 0$ with $\deg\tau\leq 1$. Claims this forces Jacobi form. **Method:** Writes $\tau(x) = c_1x + c_0$ and matches with Jacobi ODE: $\tau(x) = (\beta-\alpha) - (\alpha+\beta+2)x$. Matching requires $c_1 = -(\alpha+\beta+2)$, $c_0 = \beta-\alpha$. Constraints $\alpha,\beta>-1$ imply $\alpha+\beta>-2$. Constructs counterexample: $\tau(x)=5x+3$ gives $\alpha+\beta=-7$, violating constraint, yet ODE still has polynomial solutions. **Conclusion: False.**

---

## Cluster 2: Special Function Integrals & Orthogonality Relations (8 files)

### Sub-cluster 2.1: Laguerre Polynomial Integrals - Computational (5 files)

#### Method 2.1.A: Parameter-Shift Identity (1 file)

**Typical Example ([0526785f.md](https://github.com/igorratn/coyote-math/blob/main/0526785f.md)):**
Evaluates $I = \int_0^\infty e^{-x}xL_3(x)L_2^{(1)}(x)dx$. **Method:** Uses parameter-shift identity $L_n^{(\alpha-1)}(x) = L_n^{(\alpha)}(x) - L_{n-1}^{(\alpha)}(x)$ with $n=3$, $\alpha=1$: $L_3^{(0)}(x) = L_3^{(1)}(x) - L_2^{(1)}(x)$. Substitutes to split integral into two terms. Cross term $\int xe^{-x}L_3^{(1)}L_2^{(1)}dx = 0$ by orthogonality ($m\neq n$). Norm term $\int xe^{-x}[L_2^{(1)}]^2dx = \Gamma(4)/2! = 3$ by standard formula. **Result: $I=-3$.**

#### Method 2.1.B: Repeated Recurrence Application (4 files)

**Typical Example ([7c563c4e.md](https://github.com/igorratn/coyote-math/blob/main/7c563c4e.md)):**
Evaluates $I = \int_0^\infty x^5e^{-x}L_6(x)L_2(x)dx$. **Method:** Recalls Laguerre recurrence for $\alpha=0$: $xL_n = (2n+1)L_n - (n+1)L_{n+1} - nL_{n-1}$. Applies five times to expand $x^5L_6$ as linear combination of $L_1, L_2, \ldots, L_{11}$. Uses orthogonality $\langle L_m, L_n\rangle = \delta_{mn}$; only $L_2$ term survives when paired with $L_2$. Coefficient of $L_2$ in expansion is 16200. **Result: $I=16200$.**

**Other files:**
- [dd5e2fc5.md](https://github.com/igorratn/coyote-math/blob/main/dd5e2fc5.md): Ratio of integrals; expands $xL_2$ and $x^2L_3 = x(xL_3)$ via double application of recurrence. Result is 74/5.
- [e724070a.md](https://github.com/igorratn/coyote-math/blob/main/e724070a.md): Expands $x^2L_3$ by applying recurrence twice; only $L_5$ term survives. Result is 20.
- [b378c08c.md](https://github.com/igorratn/coyote-math/blob/main/b378c08c.md): Refined limit via substitution $x=e^{-t/n}$ and asymptotic expansion. Result is $-1/4$.

### Sub-cluster 2.2: Asymptotic Limits of Integrals - Computational (2 files)

#### Method 2.2.A: Laplace Method & Substitution (2 files)

**Typical Example ([bd4a59ea.md](https://github.com/igorratn/coyote-math/blob/main/bd4a59ea.md)):**
Computes $L = \lim_{n\to\infty}(I_n - n/3)$ where $I_n = n^2\int_0^1 x^n/(1+2x+2/n)dx$. **Method:** Substitutes $x=e^{-t/n}$ so $x^n=e^{-t}$, $dx = -\frac{1}{n}e^{-t/n}dt$. Limits transform: $x:0\to 1$ becomes $t:\infty\to 0$. Integral becomes $I_n = n\int_0^\infty e^{-t}\frac{e^{-t/n}}{1+2e^{-t/n}+2/n}dt$. Expands denominator: $e^{-t/n} = 1 - t/n + O(t^2/n^2)$, denominator $= 3 + (2-2t)/n + O(n^{-2})$. Rational function: $\frac{1-t/n}{3(1+(2-2t)/(3n))} = \frac{1}{3} - \frac{t+2}{9n} + O(n^{-2})$. Integrates against $e^{-t}$ using moments $\int_0^\infty e^{-t}dt=1$, $\int_0^\infty te^{-t}dt=1$. **Result: $L=-1/3$.**

**Other files:**
- [b378c08c.md](https://github.com/igorratn/coyote-math/blob/main/b378c08c.md): Similar substitution method for $I_n = n\int_0^1 x^n/(1+x)dx$.

### Sub-cluster 2.3: Expansion Validation - True/False Problems (1 file)

#### Method 2.3.A: Polynomial Test via Auxiliary Function (1 file)

**Typical Example ([25d6839e.md](https://github.com/igorratn/coyote-math/blob/main/25d6839e.md)):**
Tests whether $g(x) = (x^2+1)e^{-x^2}$ has finite expansion $\sum_{n=0}^\infty a_n\psi_n(x)$ with $a_n=0$ for $n\geq 4$, where $\psi_n(x) = C_ne^{-x^2/2}H_n(x)$. **Method:** If expansion terminates, $g(x) = e^{-x^2/2}P_N(x)$ for some polynomial $P_N$ of degree $\leq N$. Tests by multiplying: $g(x)e^{x^2/2} = (x^2+1)e^{-x^2/2}$. Right side is bounded on $\mathbb{R}$ but nonzero. Since any nonzero polynomial is unbounded on $\mathbb{R}$, this function cannot be a polynomial. Uses parity argument: $g$ is even, so $a_n=0$ for odd $n$. **Conclusion: False.**

---

## Cluster 3: Angular Momentum & Quantum Coupling (10 files)

### Sub-cluster 3.1: Clebsch-Gordan Coefficients & Hahn Polynomials (7 files)

#### Method 3.1.A: Wigner 3j Symbol & Parity Rules (3 files)

**Typical Example ([2f5da8d9.md](https://github.com/igorratn/coyote-math/blob/main/2f5da8d9.md)):**
Studies Clebsch-Gordan coefficient $\langle 1,0;2,0|2,0\rangle$ and determines if it's a Hahn polynomial root. **Method:** Uses Wigner 3j symbol relation: $\langle j_1,m_1,j_2,m_2|j_3,m_3\rangle = (-1)^{j_1-j_2+m_3}\sqrt{2j_3+1}\begin{pmatrix}j_1&j_2&j_3\\m_1&m_2&-m_3\end{pmatrix}$. Applies parity rule: for integer $j_1,j_2,j_3$ with all $m_i=0$, 3j symbol vanishes when $j_1+j_2+j_3$ is odd. Here $1+2+2=5$ is odd, so coefficient is zero. In Hahn representation, zero coefficient means $x=j_1-m_1=1$ is a root.

**Other files:**
- [4a8d987a.md](https://github.com/igorratn/coyote-math/blob/main/4a8d987a.md): Uses parity rule to show $\langle 1,0;2,0|2,0\rangle=0$ for explicit example.
- [e81395f5.md](https://github.com/igorratn/coyote-math/blob/main/e81395f5.md): Uses first-degree Hahn polynomial formula $h_1(x)=2j(x)-(j_2-j_1+j)(j_1+j_2-j+1)$, sets to zero.

#### Method 3.1.B: Hahn-Jacobi Asymptotic Correspondence (2 files)

**Typical Example ([3c1c8b15.md](https://github.com/igorratn/coyote-math/blob/main/3c1c8b15.md)):**
Studies asymptotic phase shift in Clebsch-Gordan for $j\to\infty$. Claims fixed phase $\Phi_{\text{fixed}} = -3\pi/4$. **Method:** Uses Hahn-Jacobi asymptotic correspondence: large-order Hahn polynomial approaches Jacobi polynomial. Cites Szegő Orthogonal Polynomials, Ch. VIII, Eq.(8.21.10) uniform asymptotic $P_n^{(\alpha,\beta)}(\cos\theta) \sim \ldots$ with phase $\Phi = (n+\frac{\alpha+\beta+1}{2})\theta - \frac{\alpha\pi}{2} - \frac{\pi}{4}$. Fixed part is $\Phi_{\text{fixed}} = -(\frac{\alpha\pi}{2}+\frac{\pi}{4})$. Uses SU(2)→Hahn mapping $\alpha = j_3-j_1+j_2$ from Koornwinder (1981). With $j_1=j$, $j_2=1$, $j_3=j$: $\alpha=1$. Substitutes: $\Phi_{\text{fixed}} = -(\pi/2+\pi/4) = -3\pi/4$.

**Other files:**
- [a050c5dc.md](https://github.com/igorratn/coyote-math/blob/main/a050c5dc.md): Uses quadratic Hahn form and Rolle's theorem on consecutive zeros.

#### Method 3.1.C: Dual-Hahn Recurrence & Orthogonal Polynomial Theory (2 files)

**Typical Example ([de74e827.md](https://github.com/igorratn/coyote-math/blob/main/de74e827.md)):**
Derives three-term difference equation for Clebsch-Gordan in variable $x=j_1+j_2-j_3$ with $m_1=0$. **Method:** Uses standard Clebsch-Gordan recurrence in $j_3$ from Varshalovich-Moskalev-Khersonskii (1988), Eq.(8.3.1.8). Changes variable to $x=j_1+j_2-j_3$, substitutes $j_3=j_1+j_2-x$ into recurrence. Clears denominators to obtain quadratic dual-Hahn form with explicit coefficients $A(x)=(x+2j_1)(x+2j_1-2m)$, $C(x)=x(x-2m)$, $B(x)$ derived from recurrence structure. Cites Biedenharn-Louck (1981), Ch.9, Eqs.(9.131)-(9.133).

**Other files:**
- [f94b00ef.md](https://github.com/igorratn/coyote-math/blob/main/f94b00ef.md): Uses dual-Hahn polynomial zero distribution theorem: degree-$N$ polynomial has exactly $N$ simple interior zeros.

### Sub-cluster 3.2: Wigner 6j Symbols & Racah Polynomials (2 files)

#### Method 3.2.A: Triangle Inequalities & Racah Formula (1 file)

**Typical Example ([fe4dc745.md](https://github.com/igorratn/coyote-
math/blob/main/fe4dc745.md)):**
Studies Wigner 6j symbol $F(x) = \{\begin{smallmatrix}2&2&x\\2&2&1\end{smallmatrix}\}$ and counts interior zeros. **Method:** Applies triangle inequalities to four triples $(2,2,x)$, $(2,2,1)$, $(2,2,1)$, $(2,2,x)$. Only $(2,2,x)$ restricts: $|2-2|\leq x\leq 2+2$ gives $0\leq x\leq 4$. Interior integers are $x\in\{1,2,3\}$. Uses Racah formula or standard tables (Varshalovich-Moskalev-Khersonskii, Table 10.2) to compute: $F(1)=1/6$, $F(2)=-1/10$, $F(3)=1/(6\sqrt{10})$, all nonzero. **Result: 0 zeros.**

#### Method 3.2.B: Spectral Theory & Self-Adjoint Operators (1 file)

**Typical Example ([bd24c6fc.md](https://github.com/igorratn/coyote-math/blob/main/bd24c6fc.md)):**
Studies Jacobi matrix for Racah polynomials. Claims matrix is Hermitian because eigenvalues are real and distinct. **Method:** Identifies logical flaw: real distinct eigenvalues are necessary but not sufficient for symmetry. Correct reasoning: Jacobi matrix represents self-adjoint multiplication operator $M_\lambda$ in orthonormal basis $\{\hat{R}_n\}$. Self-adjoint operator has symmetric matrix representation in orthonormal basis. Real eigenvalues are consequence, not cause, of symmetry. **Conclusion: False (claim's justification is invalid).**

### Sub-cluster 3.3: Racah Polynomial Asymptotics - True/False Problems (1 file)

#### Method 3.3.A: Asymptotic Mapping Formula (1 file)

**Typical Example ([31001068.md](https://github.com/igorratn/coyote-math/blob/main/31001068.md)):**
Tests whether $t_0=-99/200$ corresponds to $x_0=5025$ for Racah polynomial with $a=100$, $b=10000$. **Method:** Uses asymptotic mapping from Nikiforov-Suslov-Uvarov (1991), Ch.3, §3.8, p.111: $x = \frac{b}{2} - \frac{a}{2}t + \frac{1}{4}$. Solves for $t_0$: $\frac{a}{2}t_0 = \frac{b}{2} + \frac{1}{4} - x_0$, so $t_0 = \frac{2}{a}(\frac{b}{2}+\frac{1}{4}-x_0)$. Substitutes values: $t_0 = \frac{2}{100}(5000+0.25-5025) = \frac{1}{50}(-24.75) = \frac{1}{50}(-\frac{99}{4}) = -\frac{99}{200}$. **Conclusion: True.**

---

## Cluster 4: Damped Sine-Gordon Equations & Topological Dynamics (12 files)

### Sub-cluster 4.1: Uniform Initial Data Near Unstable Equilibria (9 files)

#### Method 4.1.A: Energy Monotonicity & Barrier Analysis (9 files)

**Typical Example ([34b8ebad.md](https://github.com/igorratn/coyote-math/blob/main/34b8ebad.md)):**
Studies $\Theta_{tt}+\gamma\Theta_t-c^2\Theta_{xx}+\sin\Theta=0$ with $\Theta(x,0)=3\pi+\varepsilon$, $\Theta_t(x,0)=0$, $\varepsilon>0$ small. **Method:** Spatial uniformity reduces to ODE: $\vartheta_{tt}+\gamma\vartheta_t+\sin\vartheta=0$. Defines energy $E(t)=\frac{1}{2}\vartheta_t^2+V(\vartheta)$ where $V=1-\cos\vartheta$. Computes $\dot{E}=-\gamma\vartheta_t^2\leq 0$, so $E$ is nonincreasing (Lyapunov function). Motion approaches equilibria $\sin\vartheta=0$ (i.e., $\vartheta=n\pi$). Determines direction: $\vartheta_{tt}(0)=-\sin(3\pi+\varepsilon)=+\sin\varepsilon>0$, so initially moves toward $4\pi$. Checks energy barrier: $E(0)=1-\cos(3\pi+\varepsilon)=1+\cos\varepsilon<2$. Barrier at $5\pi$ has height $V(5\pi)-V(4\pi)=2$, so insufficient energy to cross. Damping prevents energy gain. Concludes relaxation to $4\pi$. **All 9 files use identical method structure; differ only in initial condition and resulting target equilibrium.**

**Other files:**
- [7132b649.md](https://github.com/igorratn/coyote-math/blob/main/7132b649.md): $\Theta(0)=5\pi/2$ → relaxes to $3\pi$.
- [989a8a47.md](https://github.com/igorratn/coyote-math/blob/main/989a8a47.md): $\Theta(0)=3\pi-\varepsilon$ → relaxes to $2\pi$.
- [98a2ead0.md](https://github.com/igorratn/coyote-math/blob/main/98a2ead0.md): $\Theta(0)=7\pi/8$ → relaxes to $0$.
- [b1b7ad37.md](https://github.com/igorratn/coyote-math/blob/main/b1b7ad37.md): $\Theta(0)=5\pi+\pi/4$ → relaxes to $6\pi$.
- [c9135c09.md](https://github.com/igorratn/coyote-math/blob/main/c9135c09.md): $\Theta(0)=3\pi/4$ → relaxes to $0$.
- [de514810.md](https://github.com/igorratn/coyote-math/blob/main/de514810.md): $\Theta(0)=\pi+\varepsilon$ → relaxes to $2\pi$.
- [edbc87d5.md](https://github.com/igorratn/coyote-math/blob/main/edbc87d5.md): Superfluid ring, $\Theta(0)=\pi+\varepsilon$ → relaxes to $2\pi$.
- [ee4bc277.md](https://github.com/igorratn/coyote-math/blob/main/ee4bc277.md): Pendulum chain, $\Theta(0)=7\pi/4$ → relaxes to $2\pi$.

### Sub-cluster 4.2: Topological Kink Analysis & Energy Barriers (2 files)

#### Method 4.2.A: Kink Energy Calculation & Topological Charge (2 files)

**Typical Example ([8fac80e9.md](https://github.com/igorratn/coyote-math/blob/main/8fac80e9.md)):**
Studies $\Theta_{tt}-\Theta_{xx}+\sin\Theta=0$ with $\Theta(x,0)=3\pi+\varepsilon(x)$, $\Theta_t(x,0)=0$, where $\varepsilon(x)>0$ small, smooth, spatially varying but $\varepsilon\to 0$ as $|x|\to\infty$. Zero winding number. **Method:** Linearizes around $\Theta=3\pi$: $u_{tt}-u_{xx}-u=0$ has exponentially growing modes, so $3\pi$ is unstable. Potential $V(\Theta)=1-\cos\Theta$ has minima at $2m\pi$ (stable) and maxima at $(2m+1)\pi$ (unstable). To reach $2\pi$ from $3\pi$ requires crossing barrier, which needs nucleating kink-antikink pair. Static sine-Gordon kink $\Theta_K(x)=4\arctan e^{x-x_0}$ connects $0\to 2\pi$ with rest mass $M_K=\int(\frac{1}{2}(\Theta_K')^2+V(\Theta_K))dx=8$. Kink+antikink requires total energy $2M_K=16$, far exceeding small perturbation energy. Zero winding conserved, so field relaxes to nearby stable vacuum $4\pi$. Cites Rajaraman, Solitons and Instantons (1982), Ch.2. **Conclusion: Relaxes to $4\pi$, not $2\pi$.**

**Other files:**
- [d75ab6e0.md](https://github.com/igorratn/coyote-math/blob/main/d75ab6e0.md): $\Theta(x,0)=3\pi-\varepsilon$; kink formation energetically forbidden, relaxes to $2\pi$ via topological conservation.

### Sub-cluster 4.3: Spatially Inhomogeneous Initial Data (1 file)

**Typical Example ([16ab09af.md](https://github.com/igorratn/coyote-math/blob/main/16ab09af.md)):**
**(Empty file—no content provided)**

---

## Cluster 5: Differential Geometry & Surface Theory (9 files)

### Sub-cluster 5.1: Geodesic Curvature, Normal Curvature & Geodesic Torsion - Computational (3 files)

#### Method 5.1.A: Frenet-Serret & Darboux Formulas (3 files)

**Typical Example ([616131bf.md](https://github.com/igorratn/coyote-math/blob/main/616131bf.md)):**
Computes geodesic curvature $k_g$, normal curvature $\kappa_n$, and geodesic torsion $\tau_g$ for curve $\gamma(t)=(1,t,t)$ on surface $z=xy$ at $P=(1,1,1)$. **Method:** (1) Computes tangent $T=\gamma'/|\gamma'|$, finds $\gamma''=0$ so space curvature $\kappa=0$, implying $k_g=0$ and $\kappa_n=0$. (2) Computes surface parametrization $r(u,v)=(u,v,uv)$, finds normal $N=r_u\times r_v/|r_u\times r_v|$. (3) Computes surface binormal $U=N\times T$. (4) Differentiates $N$ along curve: $N(t)$ at parameter $t$, computes $N'(t)$ and converts to arclength derivative $N_s=N'/|\gamma'|$. (5) Applies Darboux formula $N_s=-\kappa_nT-\tau_gU$, so $\tau_g=-\langle N_s,U\rangle$. Computes dot product. **Result: $(k_g,\kappa_n,\tau_g)=(0,0,-1/3)$.**

**Other files:**
- [9129831b.md](https://github.com/igorratn/coyote-math/blob/main/9129831b.md): Uses geodesic curvature formula for coordinate curves in orthogonal coordinates: $k_g = \pm\frac{1}{\sqrt{EG}}\partial_u(\sqrt{G})$ for $v$-curve. Result $-5/4$.
- [aad144ac.md](https://github.com/igorratn/coyote-math/blob/main/aad144ac.md): Uses Frenet-Serret and Darboux; computes $\tau_g$ via $N_s$ projection. Result $8/45$.

### Sub-cluster 5.2: Geodesics on Flat Tori - Computational (3 files)

#### Method 5.2.A: Universal Cover & Straight Line Lifting (3 files)

**Typical Example ([6587534d.md](https://github.com/igorratn/coyote-math/blob/main/6587534d.md)):**
Identifies geodesic among paths $A,B,C,D$ from $P$ to $Q$ on flat torus (unit square with opposite edges identified). **Method:** Flat torus has universal cover $\mathbb{R}^2$ (Euclidean plane) with covering map given by quotient. Levi-Civita connection on flat torus is Euclidean (curvature 0). Geodesics lift to straight lines in universal cover. Path length on torus equals Euclidean distance to closest lift: $\|P-(Q+L)\|$ where $L$ is lattice vector. Path $A$ is straight to nearest $Q'$ image. Paths $B,C,D$ are curved, broken, or wrap around longer. **Answer: A.**

**Other files:**
- [a64df3e0.md](https://github.com/igorratn/coyote-math/blob/main/a64df3e0.md): Rhombic torus with $60°$ basis; uses Voronoi diagram to identify second-shell lift as farthest. Answer: E.
- [c7441c68.md](https://github.com/igorratn/coyote-math/blob/main/c7441c68.md): Parallel transport on flat torus; uses triviality of flat connection (holonomy=0), vector returns unchanged. Answer: D.

### Sub-cluster 5.3: Hyperbolic Geometry - Computational (3 files)

#### Method 5.3.A: Poincaré Disk Model & Gauss-Bonnet (2 files)

**Typical Example ([2deb9b93.md](https://github.com/igorratn/coyote-math/blob/main/2deb9b93.md)):**
Computes hyperbolic area of triangle with orthogonal sides in Poincaré disk. **Method:** (1) Uses fact that Euclidean and hyperbolic angles coincide in Poincaré disk. Diameters $OP$, $OQ$ meet orthogonally: $\angle O=\pi/2$. (2) Symmetry across $y=x$ gives $\angle P=\angle Q=\theta$. (3) Orthogonality condition for geodesic arc $PQ$ (perpendicular to unit circle at intersection) determines $P=(a,0)$, $Q=(0,a)$ with $a^2=2-\sqrt{3}$ from constraint. (4) Computes angle at $P$ using hyperbolic distance/angle formula: $\cos\theta=(a^2+1)/(2\sqrt{a^4+1})=\sqrt{3}/2$, so $\theta=\pi/6$. (5) Applies Gauss-Bonnet for surface with curvature $K=-1$: Area $= \pi - (\pi/2+\pi/6+\pi/6) = \pi/6$. **Result: $\pi/6$.**

**Other files:**
- [bca2a699.md](https://github.com/igorratn/coyote-math/blob/main/bca2a699.md): Holonomy formula for constant positive curvature $K=2$: $\Delta\theta=-K\cdot\text{Area}$ where Area $= \frac{2\pi}{K}(1-\cos(\sqrt{K}r))$. Result $-0.685$.

#### Method 5.3.B: Poincaré Disk Distance Formula (1 file)

**Typical Example ([f14b7ce3.md](https://github.com/igorratn/coyote-math/blob/main/f14b7ce3.md)):**
Computes hyperbolic distance $d(A,B)$ in Poincaré disk. **Method:** Uses distance formula $d(z_1,z_2) = \operatorname{arcosh}(1+\frac{2|z_1-z_2|^2}{(1-|z_1|^2)(1-|z_2|^2)})$. Treats points as complex numbers $z_1=\frac{2}{5}+i\frac{1}{5}$, $z_2=-\frac{1}{5}+i\frac{3}{5}$. Computes $|z_1|^2=\frac{1}{5}$, $|z_2|^2=\frac{2}{5}$, $|z_1-z_2|^2=\frac{13}{25}$. Substitutes: $\cosh d = 1+\frac{2\cdot\frac{13}{25}}{(\frac{4}{5})(\frac{3}{5})} = 1+\frac{13}{6} = \frac{19}{6}$. Inverts: $d=\ln(\frac{19}{6}+\sqrt{(\frac{19}{6})^2-1})\approx 1.82$. **Result: 1.82.**

---

## Cluster 6: Classical Orthogonal Polynomial Zero Distribution & Monotonicity (4 files)

### Sub-cluster 6.1: Local Maxima Monotonicity - True/False Problems (4 files)

#### Method 6.1.A: Nikiforov-Uvarov Auxiliary Function (3 files)

**Typical Example ([18942427.md](https://github.com/igorratn/coyote-math/blob/main/18942427.md)):**
Proves successive local maxima of $|H_n(x)|$ strictly increase as $|x|$ increases away from origin. **Method:** Uses Nikiforov-Uvarov Special Functions of Mathematical Physics (1988), Ch.2, §7 auxiliary function $v(x)=y(x)^2+\lambda_n^{-1}\sigma(x)y'(x)^2$ for solutions of hypergeometric-type equations. Differentiates: $v'(x)=\frac{\sigma'(x)-2\tau(x)}{\lambda_n}y'(x)^2$. At local maxima, $y'=0$ so $v=y^2=|y|^2$; monotonicity of $v$ transfers to maxima of $|y|$. For Hermite: $\sigma(x)=1$, $\tau(x)=-2x$, $\lambda_n=2n$, so $\sigma'-2\tau=4x$. Sign changes at $x^*=0$: negative on $(-\infty,0)$, positive on $(0,\infty)$. Since $y'\not\equiv 0$ on any interval (polynomial), $v$ is strictly decreasing/increasing. **Conclusion: True.**

**Other files:**
- [69425b5f.md](https://github.com/igorratn/coyote-math/blob/main/69425b5f.md): Jacobi $P_n^{(1,0)}$; uses $\sigma'-2\tau=\alpha-\beta+(\alpha+\beta+1)x$, critical point $x^*=(\beta-\alpha)/(\alpha+\beta+1)=-1/2$. **True.**
- [6c96b851.md](https://github.com/igorratn/coyote-math/blob/main/6c96b851.md): Laguerre $L_n^{(3)}$; uses $\sigma'-2\tau=1-2(\alpha+1-x)=2x-2\alpha-1=2x-7$, critical point $x^*=3.5$. **True.**

#### Method 6.1.B: Rolle's Theorem on Derivatives (1 file)

**Typical Example ([d4dd1d63.md](https://github.com/igorratn/coyote-math/blob/main/d4dd1d63.md)):**
Proves zeros of $\Theta_{l,m+1}$ interlace zeros of $\Theta_{lm}$ on $(-1,1)$ for spherical harmonics. **Method:** Uses definition $P_l^m(x)=(1-x^2)^{m/2}\frac{d^m}{dx^m}P_l(x)$. On $(-1,1)$, factor $(1-x^2)^{m/2}>0$, so zeros of $\Theta_{lm}$ coincide with zeros of $f_m(x)=\frac{d^m}{dx^m}P_l(x)$. Since $f_{m+1}=f_m'$, let $x_1<\cdots<x_{l-m}$ be simple zeros of $f_m$. By Rolle's theorem, $f_{m+1}$ has at least one zero in each interval $(x_j,x_{j+1})$. Since $f_{m+1}$ is polynomial of degree $l-m-1$, it has exactly $l-m-1$ real zeros, so exactly one in each interval and no others. **Conclusion: True.**

---

## Cluster 7: Difference Equations & Discrete Orthogonal Polynomials (2 files)

### Sub-cluster 7.1: Classification & Characterization - True/False Problems (2 files)

#### Method 7.1.A: Nikiforov-Suslov-Uvarov Classification Theorem (1 file)

**Typical Example ([c617c526.md](https://github.com/igorratn/coyote-math/blob/main/c617c526.md)):**
Determines if Racah polynomial solutions on lattice $x(k)=k(k+\gamma+\delta+1)$ require $\deg\sigma\leq 2$, $\deg\tau\leq 1$. **Method:** Cites Nikiforov, Suslov & Uvarov, Classical Orthogonal Polynomials of a Discrete Variable (Springer, 1991) classification theorem: necessary and sufficient condition for polynomial solutions $P_n(x)$ of degree $n$ to second-order difference equation $\sigma(x)\Delta\nabla P_n+\tau(x)\Delta P_n+\lambda_n P_n=0$ with coefficients independent of $n$ is $\deg\sigma\leq 2$ and $\deg\tau\leq 1$. For quadratic lattice, these bounds are exact. **Conclusion: True.**

#### Method 7.1.B: Degree Analysis & Counterexample (1 file)

**Typical Example ([d72d16d6.md](https://github.com/igorratn/coyote-math/blob/main/d72d16d6.md)):**
Tests if truncated Christoffel-Darboux kernel equation $\sum_{n=0}^{N-1}\frac{p_n(z)p_n(y)}{d_n^2}=0$ has exactly $N$ real roots for $y$ outside support. **Method:** Fixes $y$ and views $F_N(z;y)=\sum_{n=0}^{N-1}\frac{p_n(z)p_n(y)}{d_n^2}$ as polynomial in $z$. Identifies leading term from $n=N-1$: $p_{N-1}(z)=a_{N-1}z^{N-1}+\cdots$, so coefficient of $z^{N-1}$ is $\frac{a_{N-1}p_{N-1}(y)}{d_{N-1}^2}$. For $y$ outside support, $p_{N-1}(y)\neq 0$ by zero distribution, so $\deg_z F_N=N-1$, not $N$. Polynomial of degree $N-1$ cannot have $N$ distinct roots. Constructs Legendre counterexample: $N=2$, $y=2$, $F_2(z;2)=\frac{1}{2}+3z$ is degree 1 with 1 root, not 2. **Conclusion: False.**

---

## Cluster 8: Boundary Value Problems & Green's Functions (3 files)

### Sub-cluster 8.1: Modified Helmholtz Equations - Computational (2 files)

#### Method 8.1.A: Fourier Transform & Residue Integration (2 files)

**Typical Example ([2c968d24.md](https://github.com/igorratn/coyote-math/blob/main/2c968d24.md)):**
Solves acoustic duct problem with localized source and decay at infinity. **Method:** (1) Boundary condition $p(x)\to 0$ as $|x|\to\infty$ reduces to modified Helmholtz equation $p''-\omega^2p=-4\pi\delta(x-a)$ with $\omega=3$. (2) Fourier transforms: $\hat{p}(k)=\int p(x)e^{-ikx}dx$. Applying to equation: $(k^2+\omega^2)\hat{p}(k)=4\pi e^{-ika}$, so $\hat{p}(k)=\frac{4\pi e^{-ika}}{k^2+\omega^2}$. (3) Inverts via residue theorem or standard integral: $p(x)=\frac{1}{2\pi}\int\frac{4\pi e^{ik(x-a)}}{k^2+\omega^2}dk=\frac{2\pi}{\omega}e^{-\omega|x-a|}$. (4) Evaluates at source: $p(a)=\frac{2\pi}{\omega}=\frac{2\pi}{3}$. (5) Verifies jump condition $p'(a^+)-p'(a^-)=-4\pi$ from $\delta$-forcing. **Result: $2\pi/3$.**

**Other files:**
- [dc2e0db2.md](https://github.com/igorratn/coyote-math/blob/main/dc2e0db2.md): Heat conduction with modulated cooling coefficient; same Fourier method for modified Helmholtz. Result 2.0944.

### Sub-cluster 8.2: Elliptic PDEs with Variable Coefficients - Computational (1 file)

**Typical Example ([2538fcdd.md](https://github.com/igorratn/coyote-math/blob/main/2538fcdd.md)):**
Studies $x^2u_{xx}+2xyu_{xy}+x^2u_{yy}=0$ in half-plane $x>1$ with boundary data. **(Note: File appears incomplete or contains multiple unrelated problems. No clear solution method presented.)**

---

## Cluster 9: Miscellaneous Analysis (1 file)

### Sub-cluster 9.1: Set Theory & Infima - Computational (1 file)

#### Method 9.1.A: Oscillation Analysis & Fixed-Point Equation (1 file)

**Typical Example ([45c7ef0e.md](https://github.com/igorratn/coyote-math/blob/main/45c7ef0e.md)):**
Determines greatest lower bound of set $A=\{x\in\mathbb{R}: x\neq 0, x-\sin(1/x)>0\}$. **Method:** (1) Asymptotic analysis: for large $|x|$, $\sin(1/x)\approx 1/x$ so $x-\sin(1/x)\approx x-1/x$. Large positive $x$ satisfy condition; large negative $x$ do not. (2) Oscillation near 0: $\sin(1/x)$ oscillates between $-1$ and $+1$. Constructs sequence $x_k=-1/(\pi/2+2\pi k)$ satisfying $x_k-\sin(1/x_k)=x_k-(-1)=x_k+1>0$ with $x_k\to 0^-$. So $A$ contains negative numbers arbitrarily close to 0. (3) Boundary analysis: $A$ boundary determined by $x=\sin(1/x)$. On $(-1,0)$ this equation has smallest root $\alpha$ by intermediate value theorem: $(-1)-\sin(-1)<0$ and $(-2/\pi)-\sin(-\pi/2)>0$, so $\alpha\in(-1,-2/\pi)$. Numerical evaluation: $\alpha\approx -0.89754$. **Result: $\inf A=\alpha\approx -0.89754$.**

---

## Cluster 10: Spherical Harmonics (2 files)

### Sub-cluster 10.1: Spherical Harmonic Functions - True/False Problems (2 files)

#### Method 10.1.A: Jacobi Polynomial Representation & Nikiforov-Uvarov Bounds (2 files)

**Typical Example ([eea363eb.md](https://github.com/igorratn/coyote-math/blob/main/eea363eb.md)):**
Tests uniform bound $\sup_{\theta\in[0,\pi]} |(\sin\theta)^{|m|+\delta}Y_\ell^m(\theta,\phi)| \leq C$ for fixed $m$. **Method:** (1) Uses $|e^{im\phi}|=1$, so bound reduces to polar component. (2) Changes variable $x=\cos\theta$ and sets $n=\ell-|m|$. Uses Jacobi representation: $P_\ell^{|m|}(x) = (-1)^{|m|}(1-x^2)^{|m|/2}\frac{(\ell+|m|)!}{2^{|m|}\ell!}P_n^{(|m|,|m|)}(x)$. (3) Normalization: $|Y_\ell^m| = B_{\ell,m}(1-x^2)^{|m|/2}|P_n^{(|m|,|m|)}(x)|$ where $B_{\ell,m}=O(\sqrt{\ell})$ satisfies $B_{\ell,m}/\sqrt{n}\leq C_m$. (4) Applies Nikiforov-Uvarov envelope estimate (Ch.II, §7, Eq.19): $|(1-x)^{\alpha/2+1/4}(1+x)^{\beta/2+1/4}P_n^{(\alpha,\beta)}(x)| \leq C_\alpha n^{-1/2}$. With $\alpha=\beta=|m|$: $|P_n^{(|m|,|m|)}(x)| \leq C_{|m|}n^{-1/2}(1-x^2)^{-|m|/2-1/4}$. (5) Multiplies by $(\sin\theta)^{|m|+\delta}=(1-x^2)^{(|m|+\delta)/2}$: exponent of $(1-x^2)$ becomes $\frac{|m|+\delta}{2}-\frac{|m|}{2}-\frac{1}{4}=\frac{\delta-1/2}{2}$. Boundedness requires $\delta\geq 1/2$. For $m=0$ need $\delta\geq 1/2$
; for $|m|\geq 1$ any $\delta>0$ works. **Conclusion: True.**

**Other files:**
- [93f8b201.md](https://github.com/igorratn/coyote-math/blob/main/93f8b201.md): Spherical harmonic second-kind; uses recurrence and Christoffel-Darboux but proves claim false via normalization mismatch. **False.**

---

## Summary Statistics

- **Cluster 1 (Orthogonal Polynomials)**: 28 files
  - Sub-cluster 1.1 (Modified Weights - T/F): 8 files
    - Method 1.1.A (Decomposition): 3 files
    - Method 1.1.B (Recurrence): 5 files
  - Sub-cluster 1.2 (Second Kind - T/F): 9 files
    - Method 1.2.A (C-D Formula): 4 files
    - Method 1.2.B (Asymptotics): 3 files
    - Method 1.2.C (Series Expansion): 2 files
  - Sub-cluster 1.3 (Bounds - T/F): 6 files
    - Method 1.3.A (N-U Estimates): 4 files
    - Method 1.3.B (Darboux): 2 files
  - Sub-cluster 1.4 (Extremal - T/F): 2 files
    - Method 1.4.A (Variational): 2 files
  - Sub-cluster 1.5 (Generating Functions - T/F): 3 files
    - Method 1.5.A (Variable Change): 2 files
    - Method 1.5.B (Counterexample): 1 file

- **Cluster 2 (Integrals)**: 8 files
  - Sub-cluster 2.1 (Laguerre): 5 files
    - Method 2.1.A (Parameter-Shift): 1 file
    - Method 2.1.B (Recurrence): 4 files
  - Sub-cluster 2.2 (Asymptotic Limits): 2 files
    - Method 2.2.A (Laplace Method): 2 files
  - Sub-cluster 2.3 (Expansion - T/F): 1 file
    - Method 2.3.A (Polynomial Test): 1 file

- **Cluster 3 (Angular Momentum)**: 10 files
  - Sub-cluster 3.1 (Clebsch-Gordan): 7 files
    - Method 3.1.A (3j Parity): 3 files
    - Method 3.1.B (Hahn-Jacobi): 2 files
    - Method 3.1.C (Dual-Hahn): 2 files
  - Sub-cluster 3.2 (6j Symbols): 2 files
    - Method 3.2.A (Racah Formula): 1 file
    - Method 3.2.B (Spectral Theory): 1 file
  - Sub-cluster 3.3 (Racah Asymptotics - T/F): 1 file
    - Method 3.3.A (Mapping Formula): 1 file

- **Cluster 4 (Sine-Gordon)**: 12 files
  - Sub-cluster 4.1 (Uniform Data): 9 files
    - Method 4.1.A (Energy Monotonicity): 9 files
  - Sub-cluster 4.2 (Kinks): 2 files
    - Method 4.2.A (Kink Energy): 2 files
  - Sub-cluster 4.3 (Inhomogeneous): 1 file (empty)

- **Cluster 5 (Geometry)**: 9 files
  - Sub-cluster 5.1 (Curvatures): 3 files
    - Method 5.1.A (Frenet-Darboux): 3 files
  - Sub-cluster 5.2 (Flat Tori): 3 files
    - Method 5.2.A (Universal Cover): 3 files
  - Sub-cluster 5.3 (Hyperbolic): 3 files
    - Method 5.3.A (Gauss-Bonnet): 2 files
    - Method 5.3.B (Distance Formula): 1 file

- **Cluster 6 (Zero Distribution)**: 4 files
  - Sub-cluster 6.1 (Monotonicity - T/F): 4 files
    - Method 6.1.A (N-U Auxiliary): 3 files
    - Method 6.1.B (Rolle's Theorem): 1 file

- **Cluster 7 (Difference Equations)**: 2 files
  - Sub-cluster 7.1 (Classification - T/F): 2 files
    - Method 7.1.A (N-S-U Theorem): 1 file
    - Method 7.1.B (Degree Analysis): 1 file

- **Cluster 8 (BVPs)**: 3 files
  - Sub-cluster 8.1 (Modified Helmholtz): 2 files
    - Method 8.1.A (Fourier Transform): 2 files
  - Sub-cluster 8.2 (Elliptic PDEs): 1 file

- **Cluster 9 (Miscellaneous)**: 1 file
  - Sub-cluster 9.1 (Set Theory): 1 file
    - Method 9.1.A (Oscillation Analysis): 1 file

- **Cluster 10 (Spherical Harmonics)**: 2 files
  - Sub-cluster 10.1 (Bounds - T/F): 2 files
    - Method 10.1.A (Jacobi-N-U): 2 files

**Total: 80 files** (79 with content + 1 empty)