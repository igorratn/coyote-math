### Refined Clustering of Analytical Problems from the Repository

Based on the theorems and reasoning used in their solutions (e.g., Nikiforov–Uvarov auxiliary functions for monotonicity, Laplace-type substitutions for asymptotics, energy monotonicity for PDE relaxation, Hahn/Racah recurrences for angular momentum, etc.), I've clustered the ~61 purely analytical problems (skipping ~15 image-dependent geometry ones). Each cluster has:

- **Description**: Key theorems/reasoning.
- **Typical Problem**: One representative with full statement.
- **Other Problems**: Brief list with IDs, short descriptions, and links.

Clusters are focused on special functions/math physics as per your emphasis.

#### Cluster 1: Functions of the Second Kind – Asymptotics and Identities (Nikiforov–Uvarov & Szegő Asymptotics; Leading Coefficients, Gamma Functions, Christoffel-Darboux Combinations)

Typical reasoning: Contour integration or differentiation under integral for independence; large-z expansion using leading coefficients and norms.

**Typical Problem: [67128ca2.md](https://github.com/igorratn/coyote-math/blob/main/67128ca2.md)** (Hermite large-z limit; reasoning: expand integral or use generating functions with Gamma identities)  
For \( n \ge 1 \), define the Hermite function of the second kind as:  
\[ Q_n(z) = \int_{-\infty}^\infty \frac{e^{-t^2} H_n(t)}{z-t} \, dt. \]  
Claim:  
\[ \lim_{z\to\infty} z^{n+1} Q_n(z) = \sqrt{\pi} \, n!. \]  
Determine whether this claim is True or False, and give a rigorous proof of your conclusion.

**Other Problems**:  
- [b8db5f5e.md](https://github.com/igorratn/coyote-math/blob/main/b8db5f5e.md): Jacobi large-z limit with Gamma.  
- [9c127187.md](https://github.com/igorratn/coyote-math/blob/main/9c127187.md): Laguerre differential relation for scaled w_n(z).  
- [b4d59303.md](https://github.com/igorratn/coyote-math/blob/main/b4d59303.md): Laguerre large-z with (-1)^n Gamma.  
- [6c1ed21d.md](https://github.com/igorratn/coyote-math/blob/main/6c1ed21d.md): Laguerre second-kind derivative + shift identity = 0.  
- [53de3231.md](https://github.com/igorratn/coyote-math/blob/main/53de3231.md): Laguerre combination constant -Gamma(n+α)/n!.  
- [5c7587a5.md](https://github.com/igorratn/coyote-math/blob/main/5c7587a5.md): Hermite combination asymptotic limit.  
- [3bde7860.md](https://github.com/igorratn/coyote-math/blob/main/3bde7860.md): Monic Laguerre squared-denominator combination independent of z.  
- [147341f7.md](https://github.com/igorratn/coyote-math/blob/main/147341f7.md): Modified Legendre second-kind combination at pole a>1.  
- [2d61fb16.md](https://github.com/igorratn/coyote-math/blob/main/2d61fb16.md): Modified Legendre orthogonal to 1/(a-x); value at x=1.

#### Cluster 2: Monotonicity of Local Maxima for Classical Orthogonal Polynomials (Nikiforov–Uvarov Auxiliary Function v(x) = y^2 + λ^{-1} σ y'^2; Sign of σ' - 2τ)

Typical reasoning: v'(x) sign determined by (σ' - 2τ)/λ; strict monotonicity if y' ≠ 0.

**Typical Problem: [18942427.md](https://github.com/igorratn/coyote-math/blob/main/18942427.md)** (Hermite maxima increase away from x*=0; reasoning: v' = (4x)/(2n) >0 for x>0)  
Consider the physicists' Hermite polynomials $H_n(x)$ on $(-\infty, \infty)$ with $n \ge 1$, and let $x^* = 0$.  
Order the local maxima of $|H_n(x)|$ separately on each half-line $(-\infty, 0)$ and $(0, \infty)$ by increasing $|x|$ (equivalently, by moving away from the origin).  
Question: Determine whether the following claim is true or false, and justify your answer with a rigorous proof.  
Claim: As $|x|$ increases along either half-line away from $x^* = 0$, the successive local maxima of $|H_n(x)|$ strictly increase.

**Other Problems**:  
- [6c96b851.md](https://github.com/igorratn/coyote-math/blob/main/6c96b851.md): Laguerre α=3 maxima decrease then increase around x*=3.5.  
- [69425b5f.md](https://github.com/igorratn/coyote-math/blob/main/69425b5f.md): Jacobi α=1 β=0 maxima behavior around x* = -1/2.

#### Cluster 3: Modified Orthogonality under Rationally Altered Weights (Three-Term Recurrence, Inner Product Computations, Contradictions for Higher Degrees)

Typical reasoning: Assume span of two/three consecutive; use orthogonality to lower degrees to derive contradiction via recurrence.

**Typical Problem: [027f10a7.md](https://github.com/igorratn/coyote-math/blob/main/027f10a7.md)** (Jacobi modified by / (x - β1); sufficiency of orthogonality to 1; reasoning: decompose q = q(β1) + (x - β1) r)  
Let $P_n^{(\alpha,\beta)}(x)$ denote the Jacobi polynomials, orthogonal on $[-1,1]$ with respect to $p(x)=(1-x)^\alpha(1+x)^\beta$, where $\alpha,\beta>-1$.  
Fix $\beta_1\in\mathbb R$ with $|\beta_1|>1$ and define the modified weight  
$$\tilde p(x)=\frac{p(x)}{x-\beta_1}.$$  
For functions $f$ and $g$, define the inner product  
$$(f,g)_{\tilde p}=\int_{-1}^1 f(x)g(x)\tilde p(x)\,dx.$$  
For $n\ge1$, define a sequence of polynomials $\tilde P_n^{(\alpha,\beta)}(x)$ by the ansatz  
$$\tilde P_n^{(\alpha,\beta)}(x)=P_n^{(\alpha,\beta)}(x)+\gamma_n P_{n-1}^{(\alpha,\beta)}(x),$$  
so that $\deg(\tilde P_n^{(\alpha,\beta)})=n$ for every $\gamma_n\in\mathbb R$.  
Claim: The condition $(\tilde P_n^{(\alpha,\beta)},1)_{\tilde p}=0$ is necessary and sufficient for  
$$(\tilde P_n^{(\alpha,\beta)},q)_{\tilde p}=0 \quad \text{for every polynomial } q \text{ with } \deg(q)<n.$$  
Determine whether this claim is True or False, and give a rigorous proof of your conclusion.

**Other Problems**:  
- [9c2e2dec.md](https://github.com/igorratn/coyote-math/blob/main/9c2e2dec.md): Jacobi modified by / (x - β1); two-term span sufficiency.  
- [85d6da54.md](https://github.com/igorratn/coyote-math/blob/main/85d6da54.md): Jacobi multiplied by (x+2); two-term span.  
- [b013b487.md](https://github.com/igorratn/coyote-math/blob/main/b013b487.md): General orthonormal with rational (x-α1)/(x-β1); three-term span orthogonality.  
- [076ef56b.md](https://github.com/igorratn/coyote-math/blob/main/076ef56b.md): Hermite with (x²+1)e^{-x²}; sufficiency of orthogonality to H_{n-2}.  
- [3fc90f09.md](https://github.com/igorratn/coyote-math/blob/main/3fc90f09.md): Hermite with (x²+1)e^{-x²}; three-term ansatz α_n = -(2n+1).  
- [25d6839e.md](https://github.com/igorratn/coyote-math/blob/main/25d6839e.md): (x²+1)e^{-x²} expansion in Hermite basis terminates at n<4.  
- [5dd03fbd.md](https://github.com/igorratn/coyote-math/blob/main/5dd03fbd.md): Laguerre parameter shift; orthogonality to L_{n-1}^{(α+1)} sufficient.

#### Cluster 4: Explicit Laguerre Integral Evaluations (Parameter Shifts, Orthogonality, Recurrence)

Typical reasoning: Use x L_n = (2n+1) L_n - (n+1) L_{n+1} - n L_{n-1}; expand x^k L_m and apply orthogonality.

**Typical Problem: [0526785f.md](https://github.com/igorratn/coyote-math/blob/main/0526785f.md)** (Product with parameter shift; reasoning: L_3^{(0)} = L_3^{(1)} - L_2^{(1)}; orthogonality w.r.t. x e^{-x})  
Evaluate the integral  
$$  
I = \int_{0}^{\infty} e^{-x}\ x\ L_3(x)\ L_2^{(1)}(x)\ dx  
$$  
where $L_n(x)$ denotes the Laguerre polynomial with $\alpha = 0$ and $L_n^{(1)}(x)$ denotes the Laguerre polynomial with $\alpha = 1$.

**Other Problems**:  
- [7c563c4e.md](https://github.com/igorratn/coyote-math/blob/main/7c563c4e.md): ∫ x^5 e^{-x} L_6 L_2 dx.  
- [e724070a.md](https://github.com/igorratn/coyote-math/blob/main/e724070a.md): ∫ e^{-x} x² L_3 L_5 dx.  
- [dd5e2fc5.md](https://github.com/igorratn/coyote-math/blob/main/dd5e2fc5.md): Ratio of ∫ x² L_3² and ∫ x L_2².

#### Cluster 5: Asymptotic Integrals (Laplace-Type Methods; Substitution x = e^{-t/n}, Taylor Expansion, Moment Integrals)

Typical reasoning: Boundary concentration near x=1; substitute to get ∫ e^{-t} / denominator expansion; compute moments.

**Typical Problem: [eea363eb.md](https://github.com/igorratn/coyote-math/blob/main/eea363eb.md)** (Refined limit; reasoning: expand to O(1/n); integrate t^k e^{-t})  
Determine with rigorous proof whether the following statement is true or false:  
Let  
\[ I_n = n^2 \int_{0}^{1} \frac{x^{n}}{1 + 2x + \frac{2}{n}} \, dx. \]  
The limit  
\[ L = \lim_{n\to\infty} \left( I_n - \frac{n}{3} \right) \]  
exists and is equal to \( -\frac{4}{9} \).

**Other Problems**:  
- [bd4a59ea.md](https://github.com/igorratn/coyote-math/blob/main/bd4a59ea.md): Compute same limit L.  
- [b378c08c.md](https://github.com/igorratn/coyote-math/blob/main/b378c08c.md): Refined n ( ∫ x^n / (1+x) dx - 1/2 ).

#### Cluster 6: Generating Functions & Polynomial ODEs (Bochner Classification, Recurrence Transfer)

Typical reasoning: Identify as rescaled Hermite or generalized Laguerre; transfer ODE via substitution.

**Typical Problem: [07a8cfcf.md](https://github.com/igorratn/coyote-math/blob/main/07a8cfcf.md)** (Exp generating function; reasoning: rescale to Hermite, transfer ODE)  
Let $\{P_n(x)\}_{n \ge 0}$ be a sequence of polynomials defined by the exponential generating function  
$$G(x,t) = \sum_{n=0}^\infty P_n(x) \frac{t^n}{n!} = \exp\left( \frac{\lambda t^2}{2} - \lambda xt \right)$$  
where $\lambda \in \mathbb{R} \setminus \{0\}$ is fixed.  
Determine whether there exist polynomials $\alpha(x)$ and $\beta(x)$, independent of n, satisfying  
$$\deg \alpha \le 2, \qquad \deg \beta \le 1$$  
and a sequence of real constants $\{\gamma_n\}_{n \ge 0}$ such that, for every $n \ge 0$, the polynomial $P_n(x)$ satisfies the second-order linear differential equation  
$$\alpha(x)P_n''(x) + \beta(x)P_n'(x) + \gamma_n P_n(x) = 0$$  

**Other Problems**:  
- [4dc6fb67.md](https://github.com/igorratn/coyote-math/blob/main/4dc6fb67.md): Generating function e^{xt}/(1-t)^{5/2}; true/false ODE.  
- [e75e5639.md](https://github.com/igorratn/coyote-math/blob/main/e75e5639.md): Pearson-type DE implies Jacobi (counterexample with negative parameters).

#### Cluster 7: Bounds & Asymptotics for Scaled Polynomials (Darboux Interior Oscillatory Asymptotics; Envelope Bounds from Nikiforov-Uvarov)

Typical reasoning: Darboux cos phase unbounded; envelope bounds from auxiliary v(x).

**Typical Problem: [dd13f374.md](https://github.com/igorratn/coyote-math/blob/main/dd13f374.md)** (Hermite interior bound; reasoning: NU bound O(n^{-1/4}) ≤ constant)  
Let $H_n(x)$ be the Hermite polynomials, orthogonal on $(-\infty, \infty)$ with respect to the weight $e^{-x^2}$. Let  
$$d_n^2 = \int_{-\infty}^\infty e^{-x^2} \bigl(H_n(x)\bigr)^2 \, dx$$  
denote the $L^2$-normalization constant.  
Determine, with rigorous proof, whether for any fixed $A > 0$ there exists a constant $C_A > 0$ such that for all $n \ge 1$,  
$$\sup_{x \in [-A, A]} \left| \frac{H_n(x)}{d_n} \right| \le C_A.$$

**Other Problems**:  
- [ca5a3f25.md](https://github.com/igorratn/coyote-math/blob/main/ca5a3f25.md): Jacobi interior (1-x²) P_n bound.  
- [d416c4c4.md](https://github.com/igorratn/coyote-math/blob/main/d416c4c4.md): Global enveloped Laguerre bound.  
- [e89ce469.md](https://github.com/igorratn/coyote-math/blob/main/e89ce469.md): Scaled √n (1-x²) Jacobi interior.  
- [ec15106e.md](https://github.com/igorratn/coyote-math/blob/main/ec15106e.md): Global Jacobi envelope with extra δ.

#### Cluster 8: Angular Momentum – CG/6j as Hahn/Racah (Recurrences, Zeros, Asymptotics, Lattice Conditions)

Typical reasoning: Map to Hahn/Racah recurrence; zeros from orthogonal polynomial theory; phase from Jacobi asymptotics.

**Typical Problem: [3c1c8b15.md](https://github.com/igorratn/coyote-math/blob/main/3c1c8b15.md)** (Phase shift in large-j CG; reasoning: Hahn to Jacobi mapping, Szegő phase)  
Let the Clebsch–Gordan coefficient $\langle j_1,m_1,j_2,m_2\mid j_3,m_3\rangle$ satisfy the constraints $j_1=j$, $j_2=1$, $j_3=j$, $m_1=j/2$, $m_2=1$, $m_3=j/2+1$. For $j\to\infty$ the coefficient acquires an oscillatory asymptotic form as a trigonometric function of a phase $\Phi$.  
Prove or disprove, with rigorous justification, that the fixed phase shift component $\Phi_{\text{fixed}}$ in the argument of this trigonometric function has the value $\Phi_{\text{fixed}}=-\tfrac{3\pi}{4}$.

**Other Problems**:  
- [2f5da8d9.md](https://github.com/igorratn/coyote-math/blob/main/2f5da8d9.md): Specific CG zero as Hahn root.  
- [a050c5dc.md](https://github.com/igorratn/coyote-math/blob/main/a050c5dc.md): Zero in CG for j3=j+1.  
- [4a8d987a.md](https://github.com/igorratn/coyote-math/blob/main/4a8d987a.md): Similar zero existence.  
- [f94b00ef.md](https://github.com/igorratn/coyote-math/blob/main/f94b00ef.md): Interior zero in m=0 CG as dual Hahn.  
- [fe4dc745.md](https://github.com/igorratn/coyote-math/blob/main/fe4dc745.md): Number of interior zeros in specific 6j.  
- [e81395f5.md](https://github.com/igorratn/coyote-math/blob/main/e81395f5.md): Zero in stretched CG for j3=j-1.  
- [de74e827.md](https://github.com/igorratn/coyote-math/blob/main/de74e827.md): Three-term difference for CG in x=j1+j2-j3.  
- [31001068.md](https://github.com/igorratn/coyote-math/blob/main/31001068.md): Racah discrete to Jacobi continuous argument.  
- [c617c526.md](https://github.com/igorratn/coyote-math/blob/main/c617c526.md): Degree conditions for Racah on quadratic lattice.  
- [bd24c6fc.md](https://github.com/igorratn/coyote-math/blob/main/bd24c6fc.md): Racah TTRR Jacobi matrix hermiticity.

#### Cluster 9: Damped Sine-Gordon Relaxation (Energy Monotonicity, Barrier Heights, Initial Acceleration)

Typical reasoning: Reduce to uniform ODE; E' = - damping term ≤0; initial E < barrier, direction from \ddot\vartheta(0).

**Typical Problem: [34b8ebad.md](https://github.com/igorratn/coyote-math/blob/main/34b8ebad.md)** (Uniform 3π+ε; reasoning: E(0)<2, \ddot\vartheta(0)>0 to 4π)  
In a torsional DNA model (Yakushevich-type) without external torque, the base-pair twist angle $\Theta(x,t)$ satisfies the damped sine–Gordon equation $\Theta_{tt}+\gamma\Theta_t-c^2\Theta_{xx}+\sin\Theta=0$ for $x\in\mathbb{R}$, where $\gamma>0$ models viscous drag from the solvent and $c>0$ is the torsional wave speed. Assume zero topological (winding) number, so $\Theta(+\infty,t)=\Theta(-\infty,t)\in2\pi\mathbb{Z}$ for all $t$. The chain is prepared at rest with a uniform overtwist: $\Theta_t(x,0)=0$, $\Theta(x,0)=3\pi+\varepsilon$, where $\varepsilon>0$ is small and spatially uniform. Determine whether $\lim_{t\to+\infty}\Theta(x,t)=2\pi$ holds, or whether the twist relaxes to a different asymptotic state.

**Other Problems**:  
- [98a2ead0.md](https://github.com/igorratn/coyote-math/blob/main/98a2ead0.md): Uniform 7π/8 to 2π.  
- [d75ab6e0.md](https://github.com/igorratn/coyote-math/blob/main/d75ab6e0.md): Uniform 3π-ε to 4π.  
- [8fac80e9.md](https://github.com/igorratn/coyote-math/blob/main/8fac80e9.md): Uniform 3π-ε to 2π.  
- [c9135c09.md](https://github.com/igorratn/coyote-math/blob/main/c9135c09.md): Uniform 3π/4 to 2π.  
- [de514810.md](https://github.com/igorratn/coyote-math/blob/main/de514810.md): Uniform π+ε to 2π.  
- [ee4bc277.md](https://github.com/igorratn/coyote-math/blob/main/ee4bc277.md): Uniform 7π/4 to 2π.  
- [edbc87d5.md](https://github.com/igorratn/coyote-math/blob/main/edbc87d5.md): Uniform π+ε to 2π.  
- [989a8a47.md](https://github.com/igorratn/coyote-math/blob/main/989a8a47.md): Uniform 3π-ε to 2π.  
- [7132b649.md](https://github.com/igorratn/coyote-math/blob/main/7132b649.md): Sine-Gordon \Theta(0)=5π/2 to \Theta(∞) multiple of π.

#### Cluster 10: Steady-State Physical PDEs (Fourier Transform, Helmholtz Solutions, Perturbation)

Typical reasoning: Modulated Helmholtz; Fourier for exact or perturbation.

**Typical Problem: [2c968d24.md](https://github.com/igorratn/coyote-math/blob/main/2c968d24.md)** (Modulated acoustic; reasoning: Fourier, standard integral)  
In an infinitely long, lossless, anechoic 1D acoustic duct with sound speed $c=1$ and density $\rho=1$, a time-harmonic point monopole source is located at $x=a$ and oscillates at angular frequency $\omega=3$ with a complex volume-velocity amplitude of $4\pi$. Along the duct, a weak harmonic modulation of the acoustic stiffness causes the local restoring coefficient to vary as $1 + \frac{1}{2} \cos x$. The steady acoustic pressure field $p(x)$ decays to zero as $|x| \to \infty$. Determine the exact on-axis pressure amplitude $p(a)$, expressed as a fraction of $\pi$.

**Other Problems**:  
- [2538fcdd.md](https://github.com/igorratn/coyote-math/blob/main/2538fcdd.md): Non-uniform membrane in half-plane with e^{-|y|} boundary.  
- [dc2e0db2.md](https://github.com/igorratn/coyote-math/blob/main/dc2e0db2.md): Modulated Newton's cooling heat conduction T(0) for h=3.

#### Cluster 11: Christoffel Functions & Extremal Infima (Cauchy-Schwarz, Christoffel-Darboux, Interlacing Zeros)

**Typical Problem: [f6e16472.md](https://github.com/igorratn/coyote-math/blob/main/f6e16472.md)** (Equality of two infima; reasoning: Christoffel-Darboux kernel, counterexample with Legendre at x0=0)  
Let $\{p_n(x)\}_{n=0}^\infty$ be orthonormal polynomials with respect to a positive weight $w(x)$ on $[a,b]$, satisfying the recurrence  
\[x p_n(x) = a_{n+1} p_{n+1}(x) + b_n p_n(x) + a_n p_{n-1}(x) \quad (a_{n+1} > 0, \, b_n \in \mathbb{R}).\]  
For fixed $x_0 \in (a,b)$ and $N \ge 1$, consider the polynomial  
\[\pi_t(x) = p_{N+1}(x) - t p_N(x).\]  
Determine (with proof) whether the following two quantities are equal:  
\[\inf_{t \in \mathbb{R} } \frac{\|\pi_t\|_w^2}{\pi_t(x_0)^2} \quad \text{and} \quad \inf_{\substack{Q \in \mathbb P_N \\ Q(x_0) \ne 0} } \frac{\|Q\|_w^2}{Q(x_0)^2}.\]

**Other Problems**:  
- [91608bdd.md](https://github.com/igorratn/coyote-math/blob/main/91608bdd.md): Strict inequality between infima.  
- [d72d16d6.md](https://github.com/igorratn/coyote-math/blob/main/d72d16d6.md): Discrete measure roots positivity outside support.

#### Cluster 12: Miscellaneous Pure Analysis (Continuity, Expansions, Sets)

- [25fec83d.md](https://github.com/igorratn/coyote-math/blob/main/25fec83d.md): Legendre second-kind combination is constant 1/2.  
- [45c7ef0e.md](https://github.com/igorratn/coyote-math/blob/main/45c7ef0e.md): Infimum of set {x : x - sin(1/x) > 0}.