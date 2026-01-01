### Finer Clustering of Analytical Problems from the Repository

I have now applied **finer sub-clustering** to the larger clusters (especially Cluster 1 and Cluster 8) while keeping all other clusters as before. This gives a more granular view without losing the overall structure.

#### Cluster 1: Functions of the Second Kind – Asymptotics and Identities

##### Sub-Cluster 1.1: Large-z Asymptotics (Leading Coefficients, Gamma Expressions)

**Typical Problem (full original statement): [67128ca2.md](https://github.com/igorratn/coyote-math/blob/main/67128ca2.md)**  
For $n \ge 1$, define the Hermite function of the second kind as:  

$$Q_n(z) = \int_{-\infty}^\infty \frac{e^{-t^2} H_n(t)}{z-t} dt.$$  

Claim:  

$$\lim_{z\to\infty} z^{n+1} Q_n(z) = \sqrt{\pi} \, n!.$$  

Determine whether this claim is True or False, and give a rigorous proof of your conclusion.

**Other Problems** (brief):  
- [b8db5f5e.md](https://github.com/igorratn/coyote-math/blob/main/b8db5f5e.md): Jacobi large-z limit with Gamma expression.  
- [b4d59303.md](https://github.com/igorratn/coyote-math/blob/main/b4d59303.md): Laguerre large-z limit with (-1)^n Γ(n+α+1).  
- [5c7587a5.md](https://github.com/igorratn/coyote-math/blob/main/5c7587a5.md): Hermite combination asymptotic limit.

##### Sub-Cluster 1.2: Identities and Christoffel-Darboux Type Combinations (Independence of z, Differential Relations)

**Typical Problem (full original statement): [53de3231.md](https://github.com/igorratn/coyote-math/blob/main/53de3231.md)**  
Laguerre second-kind combination Φ_n^{(α)}(z) is independent of z and equals −Γ(n+α)/n!.

**Other Problems** (brief):  
- [9c127187.md](https://github.com/igorratn/coyote-math/blob/main/9c127187.md): Laguerre scaled second-kind differential relation.  
- [6c1ed21d.md](https://github.com/igorratn/coyote-math/blob/main/6c1ed21d.md): Laguerre second-kind derivative-shift identity = 0.  
- [3bde7860.md](https://github.com/igorratn/coyote-math/blob/main/3bde7860.md): Monic Laguerre squared-denominator combination independent of z.  
- [147341f7.md](https://github.com/igorratn/coyote-math/blob/main/147341f7.md): Modified Legendre second-kind combination at pole a>1.  
- [2d61fb16.md](https://github.com/igorratn/coyote-math/blob/main/2d61fb16.md): Modified Legendre orthogonal to 1/(a-x); value at x=1.

#### Cluster 2: Monotonicity of Local Maxima (Nikiforov–Uvarov Auxiliary Function v(x))

**Typical Problem (full original statement): [18942427.md](https://github.com/igorratn/coyote-math/blob/main/18942427.md)**  
Consider the physicists' Hermite polynomials $H_n(x)$ on $(-\infty, \infty)$ with $n \ge 1$, and let $x^* = 0$.  

Order the local maxima of $|H_n(x)|$ separately on each half-line $(-\infty, 0)$ and $(0, \infty)$ by increasing $|x|$ (equivalently, by moving away from the origin).  

Question: Determine whether the following claim is true or false, and justify your answer with a rigorous proof.  

Claim: As $|x|$ increases along either half-line away from $x^* = 0$, the successive local maxima of $|H_n(x)|$ strictly increase.

**Other Problems** (brief):  
- [6c96b851.md](https://github.com/igorratn/coyote-math/blob/main/6c96b851.md): Laguerre (α=3) maxima decrease then increase around x*=3.5.  
- [69425b5f.md](https://github.com/igorratn/coyote-math/blob/main/69425b5f.md): Jacobi (α=1, β=0) maxima behavior around x*=−1/2.

#### Cluster 3: Modified/Rationally Perturbed Orthogonality (Three-Term Recurrence, Inner Product Decomposition)

**Typical Problem (full original statement): [027f10a7.md](https://github.com/igorratn/coyote-math/blob/main/027f10a7.md)**  
Let $P_n^{(\alpha,\beta)}(x)$ denote the Jacobi polynomials, orthogonal on $[-1,1]$ with respect to $p(x)=(1-x)^\alpha(1+x)^\beta$, where $\alpha,\beta>-1$.  

Fix $\beta_1\in\mathbb R$ with $|\beta_1|>1$ and define the modified weight  

$$\tilde p(x)=\frac{p(x)}{x-\beta_1}.$$  

For functions $f$ and $g$, define the inner product  

$$(f,g)_{\tilde p}=\int_{-1}^1 f(x)g(x)\tilde p(x)dx.$$  

For $n\ge1$, define a sequence of polynomials $\tilde P_n^{(\alpha,\beta)}(x)$ by the ansatz  

$$\tilde P_n^{(\alpha,\beta)}(x)=P_n^{(\alpha,\beta)}(x)+\gamma_n P_{n-1}^{(\alpha,\beta)}(x),$$  

so that $\deg(\tilde P_n^{(\alpha,\beta)})=n$ for every $\gamma_n\in\mathbb R$.  

Claim: The condition $(\tilde P_n^{(\alpha,\beta)},1)_{\tilde p}=0$ is necessary and sufficient for  

$$(\tilde P_n^{(\alpha,\beta)},q)_{\tilde p}=0 \quad \text{for every polynomial } q \text{ with } \deg(q)<n.$$  

Determine whether this claim is True or False, and give a rigorous proof of your conclusion.

**Other Problems** (brief):  
- [9c2e2dec.md](https://github.com/igorratn/coyote-math/blob/main/9c2e2dec.md), [85d6da54.md](https://github.com/igorratn/coyote-math/blob/main/85d6da54.md), [b013b487.md](https://github.com/igorratn/coyote-math/blob/main/b013b487.md): Similar rational modifications for Jacobi/general.  
- [076ef56b.md](https://github.com/igorratn/coyote-math/blob/main/076ef56b.md), [3fc90f09.md](https://github.com/igorratn/coyote-math/blob/main/3fc90f09.md), [25d6839e.md](https://github.com/igorratn/coyote-math/blob/main/25d6839e.md), [5dd03fbd.md](https://github.com/igorratn/coyote-math/blob/main/5dd03fbd.md): Hermite/Laguerre modified weights; span sufficiency/counterexamples.

#### Cluster 4: Laguerre Integral Evaluations (Parameter Shifts, Recurrence, Orthogonality)

**Typical Problem (full original statement): [0526785f.md](https://github.com/igorratn/coyote-math/blob/main/0526785f.md)**  
Evaluate the integral  

$$I = \int_{0}^{\infty} e^{-x}\ x\ L_3(x)\ L_2^{(1)}(x)\ dx$$  

where $L_n(x)$ denotes the Laguerre polynomial with $\alpha = 0$ and $L_n^{(1)}(x)$ denotes the Laguerre polynomial with $\alpha = 1$.

**Other Problems** (brief):  
- [7c563c4e.md](https://github.com/igorratn/coyote-math/blob/main/7c563c4e.md): ∫ x^5 e^{-x} L_6 L_2 dx.  
- [e724070a.md](https://github.com/igorratn/coyote-math/blob/main/e724070a.md): ∫ e^{-x} x² L_3 L_5 dx.  
- [dd5e2fc5.md](https://github.com/igorratn/coyote-math/blob/main/dd5e2fc5.md): Ratio of quadratic norms L_3 and L_2.

#### Cluster 5: Asymptotic Integrals (Laplace-Type Substitution, Taylor Expansion)

**Typical Problem (full original statement): [eea363eb.md](https://github.com/igorratn/coyote-math/blob/main/eea363eb.md)**  
Determine with rigorous proof whether the following statement is true or false:  

Let  

$$I_n = n^2 \int_{0}^{1}\frac{x^{n}}{1+2x+\frac{2}{n}}\,dx.$$  

The limit  

$$L = \lim_{n\to\infty}\left( I_n - \frac{n}{3} \right)$$  

exists and is equal to $$-\frac{4}{9}$$.

**Other Problems** (brief):  
- [bd4a59ea.md](https://github.com/igorratn/coyote-math/blob/main/bd4a59ea.md): Compute the same refined limit.  
- [b378c08c.md](https://github.com/igorratn/coyote-math/blob/main/b378c08c.md): Refined limit for denominator 1+x.

#### Cluster 6: Generating Functions & Polynomial ODEs (Bochner Classification)

**Typical Problem (full original statement): [07a8cfcf.md](https://github.com/igorratn/coyote-math/blob/main/07a8cfcf.md)**  
Let $\{P_n(x)\}_{n \ge 0}$ be a sequence of polynomials defined by the exponential generating function  

$$G(x,t) = \sum_{n=0}^\infty P_n(x) \frac{t^n}{n!} = \exp\left( \frac{\lambda t^2}{2} - \lambda xt \right)$$  

where $\lambda \in \mathbb{R} \setminus \{0\}$ is fixed.  

Determine whether there exist polynomials $\alpha(x)$ and $\beta(x)$, independent of $n$, satisfying  

$$\deg \alpha \le 2, \qquad \deg \beta \le 1$$  

and a sequence of real constants $\{\gamma_n\}_{n \ge 0}$ such that, for every $n \ge 0$, the polynomial $P_n(x)$ satisfies the second-order linear differential equation  

$$\alpha(x)P_n''(x) + \beta(x)P_n'(x) + \gamma_n P_n(x) = 0$$

**Other Problems** (brief):  
- [4dc6fb67.md](https://github.com/igorratn/coyote-math/blob/main/4dc6fb67.md): Generating function e^{xt}/(1-t)^{5/2}.  
- [e75e5639.md](https://github.com/igorratn/coyote-math/blob/main/e75e5639.md): Pearson-type DE necessity for Jacobi.

#### Cluster 7: Bounds for Scaled Polynomials (Darboux Asymptotics, NU Envelopes)

**Typical Problem (full original statement): [dd13f374.md](https://github.com/igorratn/coyote-math/blob/main/dd13f374.md)**  
Let $H_n(x)$ be the Hermite polynomials, orthogonal on $(-\infty, \infty)$ with respect to the weight $e^{-x^2}$. Let  

$$d_n^2 = \int_{-\infty}^\infty e^{-x^2} \bigl(H_n(x)\bigr)^2 \, dx$$  

denote the $L^2$-normalization constant.  

Determine, with rigorous proof, whether for any fixed $A > 0$ there exists a constant $C_A > 0$ such that for all $n \ge 1$,  

$$\sup_{x \in [-A, A]} \left| \frac{H_n(x)}{d_n} \right| \le C_A.$$

**Other Problems** (brief):  
- [ca5a3f25.md](https://github.com/igorratn/coyote-math/blob/main/ca5a3f25.md): Jacobi interior (1-x²) bound.  
- [d416c4c4.md](https://github.com/igorratn/coyote-math/blob/main/d416c4c4.md): Global Laguerre envelope.  
- [e89ce469.md](https://github.com/igorratn/coyote-math/blob/main/e89ce469.md): Scaled √n (1-x²) Jacobi interior.  
- [ec15106e.md](https://github.com/igorratn/coyote-math/blob/main/ec15106e.md): Global Jacobi envelope with δ.

#### Cluster 8: CG/6j Symbols as Hahn/Racah

##### Sub-Cluster 8.1: Zeros and Existence (Orthogonal Polynomial Zero Distribution)

**Typical Problem (full original statement): [f94b00ef.md](https://github.com/igorratn/coyote-math/blob/main/f94b00ef.md)**  
Fix two (half-)integer angular momenta $j_1,j_2\ge2$ and consider the Clebsch–Gordan coefficient $f(j_3)=\langle j_1,0;j_2,0\mid j_3,0\rangle$ for all allowed $j_3$. Introduce the discrete variable $x=j_1+j_2-j_3$. Determine, with proof, whether there exists at least one integer $x$ with $0<x<2\min(j_1,j_2)$ such that $f(x)=0$.

**Other Problems** (brief):  
- [2f5da8d9.md](https://github.com/igorratn/coyote-math/blob/main/2f5da8d9.md), [a050c5dc.md](https://github.com/igorratn/coyote-math/blob/main/a050c5dc.md), [4a8d987a.md](https://github.com/igorratn/coyote-math/blob/main/4a8d987a.md), [fe4dc745.md](https://github.com/igorratn/coyote-math/blob/main/fe4dc745.md), [e81395f5.md](https://github.com/igorratn/coyote-math/blob/main/e81395f5.md): Specific CG/6j zeros.

##### Sub-Cluster 8.2: Recurrences, Phases, and Lattice Conditions

**Typical Problem (full original statement): [3c1c8b15.md](https://github.com/igorratn/coyote-math/blob/main/3c1c8b15.md)**  
Let the Clebsch–Gordan coefficient $\langle j_1,m_1,j_2,m_2\mid j_3,m_3\rangle$ satisfy the constraints $j_1=j$, $j_2=1$, $j_3=j$, $m_1=j/2$, $m_2=1$, $m_3=j/2+1$. For $j\to\infty$ the coefficient acquires an oscillatory asymptotic form as a trigonometric function of a phase $\Phi$. Prove or disprove, with rigorous justification, that the fixed phase shift component $\Phi_{\text{fixed}}$ in the argument of this trigonometric function has the value $\Phi_{\text{fixed}}=-\tfrac{3\pi}{4}$.

**Other Problems** (brief):  
- [de74e827.md](https://github.com/igorratn/coyote-math/blob/main/de74e827.md): Three-term difference for CG.  
- [31001068.md](https://github.com/igorratn/coyote-math/blob/main/31001068.md), [c617c526.md](https://github.com/igorratn/coyote-math/blob/main/c617c526.md), [bd24c6fc.md](https://github.com/igorratn/coyote-math/blob/main/bd24c6fc.md): Racah lattice/argument conditions.

#### Cluster 9: Damped Sine-Gordon Relaxation (Energy Monotonicity)

**Typical Problem (full original statement): [34b8ebad.md](https://github.com/igorratn/coyote-math/blob/main/34b8ebad.md)**  
In a torsional DNA model (Yakushevich-type) without external torque, the base-pair twist angle $\Theta(x,t)$ satisfies the damped sine–Gordon equation $\Theta_{tt}+\gamma\Theta_t-c^2\Theta_{xx}+\sin\Theta=0$ for $x\in\mathbb{R}$, where $\gamma>0$ models viscous drag from the solvent and $c>0$ is the torsional wave speed. Assume zero topological (winding) number, so $\Theta(+\infty,t)=\Theta(-\infty,t)\in2\pi\mathbb{Z}$ for all $t$. The chain is prepared at rest with a uniform overtwist: $\Theta_t(x,0)=0$, $\Theta(x,0)=3\pi+\varepsilon$, where $\varepsilon>0$ is small and spatially uniform. Determine whether $\lim_{t\to+\infty}\Theta(x,t)=2\pi$ holds, or whether the twist relaxes to a different asymptotic state.

**Other Problems** (brief): All similar uniform initial data cases (different starting angles, same energy/acceleration reasoning).

#### Cluster 10: Steady-State Physical PDEs (Fourier/Helmholtz)

**Typical Problem (full original statement): [2c968d24.md](https://github.com/igorratn/coyote-math/blob/main/2c968d24.md)**  
In an infinitely long, lossless, anechoic 1D acoustic duct with sound speed $c=1$ and density $\rho=1$, a time-harmonic point monopole source is located at $x=a$ and oscillates at angular frequency $\omega=3$ with a complex volume-velocity amplitude of $4\pi$. Along the duct, a weak harmonic modulation of the acoustic stiffness causes the local restoring coefficient to vary as $1 + \frac{1}{2} \cos x$. The steady acoustic pressure field $p(x)$ decays to zero as $|x| \to \infty$. Determine the exact on-axis pressure amplitude $p(a)$, expressed as a fraction of $\pi$.

**Other Problems** (brief):  
- [2538fcdd.md](https://github.com/igorratn/coyote-math/blob/main/2538fcdd.md) (membrane),  
- [dc2e0db2.md](https://github.com/igorratn/coyote-math/blob/main/dc2e0db2.md) (modulated cooling).

#### Cluster 11: Christoffel & Extremal Infima

**Typical Problem (full original statement): [f6e16472.md](https://github.com/igorratn/coyote-math/blob/main/f6e16472.md)**  
Let $\{p_n(x)\}_{n=0}^\infty$ be orthonormal polynomials with respect to a positive weight $w(x)$ on $[a,b]$, satisfying the recurrence  

$$x p_n(x)=a_{n+1}p_{n+1}(x)+b_n p_n(x)+a_n p_{n-1}(x)\quad(a_{n+1}>0, b_n\in\mathbb R).$$  

For fixed $x_0\in(a,b)$ and $N\ge1$, consider the polynomial  

$$\pi_t(x)=p_{N+1}(x)-t p_N(x).$$  

Determine (with proof) whether the following two quantities are equal:  

$$\inf_{t\in\mathbb R}\frac{\|\pi_t\|_w^2}{\pi_t(x_0)^2} \quad\text{and}\quad \inf_{\substack{Q\in\mathbb P_N\\Q(x_0)\ne0}}\frac{\|Q\|_w^2}{Q(x_0)^2}.$$

**Other Problems** (brief):  
- [91608bdd.md](https://github.com/igorratn/coyote-math/blob/main/91608bdd.md),  
- [d72d16d6.md](https://github.com/igorratn/coyote-math/blob/main/d72d16d6.md).

#### Cluster 12: Miscellaneous

**Typical Problem (full original statement): [25fec83d.md](https://github.com/igorratn/coyote-math/blob/main/25fec83d.md)**  
Let $P_n^{(\alpha,\beta)}(x)$ denote the Jacobi polynomials, orthogonal on $[-1,1]$ with respect to $p(x)=(1-x)^\alpha(1+x)^\beta$. Let $Q_n^{(\alpha,\beta)}(z)$ be the corresponding functions of the second kind defined for $z \in \mathbb{C} \setminus [-1,1]$ by:  

$$Q_n^{(\alpha,\beta)}(z) = \frac{1}{2} \int_{-1}^1 \frac{P_n^{(\alpha,\beta)}(t)(1-t)^\alpha(1+t)^\beta}{z-t} dt$$  

Consider the specific case $\alpha = \beta = 0$ (Legendre case), so $p(x)=1$. Define the sequence of functions:  

$$f_n(z) = Q_n(z) P_{n+1}(z) - Q_{n+1}(z) P_n(z)$$  

Claim: For all $n \ge 0$, the function $f_n(z)$ is a polynomial in $z$ of degree exactly $0$.  
Determine whether this claim is True or False, and provide a rigorous proof.

**Other Problems** (brief):  
- [45c7ef0e.md](https://github.com/igorratn/coyote-math/blob/main/45c7ef0e.md) (set infimum).