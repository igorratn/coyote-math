# Ordinary and Partial Differential Equations — Complete Reference for RLHF Evaluation

## Part I: Ordinary Differential Equations (ODEs)

## 1. Basic Definitions and Concepts

### Classification

An **ordinary differential equation** involves functions of one variable and their derivatives.

**Order:** Highest derivative that appears.

**Linear vs. Nonlinear:**
- **Linear:** $a_n(x)y^{(n)} + a_{n-1}(x)y^{(n-1)} + \cdots + a_1(x)y' + a_0(x)y = f(x)$
- **Nonlinear:** Any equation not of above form (e.g., $y' = y^2$, $(y')^2 + y = 0$)

**Homogeneous vs. Inhomogeneous:**
- **Homogeneous:** Right side is zero: $L[y] = 0$
- **Inhomogeneous:** Right side nonzero: $L[y] = f(x)$

### Initial Value Problems (IVP)

Find $y(x)$ satisfying:
$$y^{(n)} = f(x, y, y', \ldots, y^{(n-1)})$$
with initial conditions: $y(x_0) = y_0$, $y'(x_0) = y_1$, ..., $y^{(n-1)}(x_0) = y_{n-1}$.

### Boundary Value Problems (BVP)

Conditions specified at multiple points (e.g., $y(a) = \alpha$, $y(b) = \beta$).

---

## 2. First-Order ODEs

### Separable Equations

Form: $\frac{dy}{dx} = g(x)h(y)$

**Solution method:** Separate variables:
$$\frac{dy}{h(y)} = g(x)dx$$
Then integrate both sides.

### Linear First-Order

Form: $y' + p(x)y = q(x)$

**Solution method (integrating factor):**
$$\mu(x) = e^{\int p(x)dx}$$
Multiply equation by $\mu(x)$:
$$\mu(x)y' + \mu(x)p(x)y = \mu(x)q(x)$$
$$\frac{d}{dx}[\mu(x)y] = \mu(x)q(x)$$
$$y = \frac{1}{\mu(x)}\left(\int \mu(x)q(x)dx + C\right)$$

### Exact Equations

Form: $M(x,y)dx + N(x,y)dy = 0$

**Exactness condition:** $\frac{\partial M}{\partial y} = \frac{\partial N}{\partial x}$

If exact, there exists $F(x,y)$ such that:
$$\frac{\partial F}{\partial x} = M, \quad \frac{\partial F}{\partial y} = N$$

Solution: $F(x,y) = C$

**Finding $F$:**
$$F(x,y) = \int M(x,y)dx + g(y)$$
where $g(y)$ is determined by $\frac{\partial F}{\partial y} = N$.

### Integrating Factors for Non-Exact

If $\frac{1}{N}\left(\frac{\partial M}{\partial y} - \frac{\partial N}{\partial x}\right) = h(x)$ (function of $x$ only):
$$\mu(x) = e^{\int h(x)dx}$$

If $\frac{1}{M}\left(\frac{\partial N}{\partial x} - \frac{\partial M}{\partial y}\right) = k(y)$ (function of $y$ only):
$$\mu(y) = e^{\int k(y)dy}$$

---

## 3. Second-Order Linear ODEs

### General Form

$$a(x)y'' + b(x)y' + c(x)y = f(x)$$

### Homogeneous with Constant Coefficients

$$ay'' + by' + cy = 0$$

**Characteristic equation:** $ar^2 + br + c = 0$

**Solutions based on roots:**

1. **Two distinct real roots $r_1, r_2$:**
   $$y = c_1 e^{r_1 x} + c_2 e^{r_2 x}$$

2. **Repeated real root $r$:**
   $$y = (c_1 + c_2 x)e^{rx}$$

3. **Complex conjugate roots $r = \alpha \pm i\beta$:**
   $$y = e^{\alpha x}(c_1\cos\beta x + c_2\sin\beta x)$$

### Reduction of Order

If $y_1$ is a known solution of $y'' + p(x)y' + q(x)y = 0$, find second solution via:
$$y_2 = y_1 \int \frac{e^{-\int p(x)dx}}{y_1^2}dx$$

### Variation of Parameters

For $y'' + p(x)y' + q(x)y = f(x)$ with known homogeneous solutions $y_1, y_2$:

Particular solution:
$$y_p = -y_1\int \frac{y_2 f}{W}dx + y_2\int \frac{y_1 f}{W}dx$$

where **Wronskian** $W = y_1 y_2' - y_1' y_2$.

### Method of Undetermined Coefficients

For constant coefficient equations $ay'' + by' + cy = f(x)$ where $f(x)$ is:
- Polynomial
- Exponential $e^{\alpha x}$
- Sine/cosine $\sin\beta x$, $\cos\beta x$
- Products/sums of above

**Guess form of particular solution** based on $f(x)$ and check if it's a solution to homogeneous equation (if so, multiply by $x$).

---

## 4. Systems of ODEs

### Linear Systems

$$\mathbf{x}' = A\mathbf{x} + \mathbf{f}(t)$$

where $\mathbf{x} = (x_1, \ldots, x_n)^T$, $A$ is $n \times n$ matrix.

### Homogeneous Constant Coefficient

$$\mathbf{x}' = A\mathbf{x}$$

**Solution method:** Find eigenvalues $\lambda$ and eigenvectors $\mathbf{v}$ of $A$.

**For each real eigenvalue $\lambda$ with eigenvector $\mathbf{v}$:**
$$\mathbf{x} = e^{\lambda t}\mathbf{v}$$

**For complex eigenvalue $\lambda = \alpha + i\beta$ with eigenvector $\mathbf{v} = \mathbf{a} + i\mathbf{b}$:**
$$\mathbf{x}_1 = e^{\alpha t}(\mathbf{a}\cos\beta t - \mathbf{b}\sin\beta t)$$
$$\mathbf{x}_2 = e^{\alpha t}(\mathbf{a}\sin\beta t + \mathbf{b}\cos\beta t)$$

**For repeated eigenvalue:** Need generalized eigenvectors.

### Phase Plane Analysis

For 2D system $\mathbf{x}' = A\mathbf{x}$:

**Classification of equilibrium at origin:**
- **Eigenvalues both negative real:** Stable node (sink)
- **Eigenvalues both positive real:** Unstable node (source)
- **Eigenvalues opposite sign:** Saddle point
- **Complex with negative real part:** Stable spiral (sink)
- **Complex with positive real part:** Unstable spiral (source)
- **Pure imaginary:** Center (neutrally stable)

---

## 5. Existence and Uniqueness

### Picard-Lindelöf Theorem (Existence and Uniqueness)

For IVP: $y' = f(x, y)$, $y(x_0) = y_0$

**If:**
1. $f$ is continuous in rectangle $R = \{(x,y) : |x - x_0| \leq a, |y - y_0| \leq b\}$
2. $f$ satisfies Lipschitz condition in $y$: $|f(x, y_1) - f(x, y_2)| \leq L|y_1 - y_2|$

**Then:** Unique solution exists on some interval $|x - x_0| \leq h$.

**Sufficient for Lipschitz:** $\frac{\partial f}{\partial y}$ exists and is bounded on $R$.

### Peano Existence Theorem

If $f$ is continuous on $R$, then solution exists (but may not be unique).

**Example of non-uniqueness:** $y' = \sqrt{|y|}$, $y(0) = 0$ has infinitely many solutions.

---

## 6. Sturm-Liouville Problems

### Regular Sturm-Liouville Problem

$$\frac{d}{dx}\left[p(x)\frac{dy}{dx}\right] + q(x)y + \lambda w(x)y = 0$$

on $[a, b]$ with boundary conditions.

**Properties:**
1. Eigenvalues $\lambda_n$ are real
2. Eigenfunctions corresponding to different eigenvalues are orthogonal with weight $w(x)$
3. Eigenvalues can be ordered: $\lambda_1 < \lambda_2 < \lambda_3 < \cdots$
4. Eigenfunctions form complete orthogonal set

**Example (Fourier series):** $y'' + \lambda y = 0$ on $[0, L]$ with $y(0) = y(L) = 0$.

Eigenvalues: $\lambda_n = \left(\frac{n\pi}{L}\right)^2$, eigenfunctions: $\sin\frac{n\pi x}{L}$.

---

## Part II: Partial Differential Equations (PDEs)

## 7. Classification of Second-Order PDEs

### General Form

$$A\frac{\partial^2 u}{\partial x^2} + 2B\frac{\partial^2 u}{\partial x\partial y} + C\frac{\partial^2 u}{\partial y^2} + D\frac{\partial u}{\partial x} + E\frac{\partial u}{\partial y} + Fu = G$$

### Classification (based on discriminant $\Delta = B^2 - AC$)

- **Elliptic:** $\Delta < 0$ (e.g., Laplace's equation: $u_{xx} + u_{yy} = 0$)
- **Parabolic:** $\Delta = 0$ (e.g., Heat equation: $u_t = k u_{xx}$)
- **Hyperbolic:** $\Delta > 0$ (e.g., Wave equation: $u_{tt} = c^2 u_{xx}$)

**Physical meaning:**
- Elliptic: Steady-state problems (equilibrium)
- Parabolic: Diffusion processes (irreversible)
- Hyperbolic: Wave propagation (reversible)

---

## 8. Separation of Variables

### Method

For PDE with appropriate boundary/initial conditions, assume solution of form:
$$u(x, t) = X(x)T(t)$$

Substitute into PDE and separate:
$$\frac{1}{T}\frac{dT}{dt} = \frac{1}{X}\frac{d^2X}{dx^2} = -\lambda$$

This yields two ODEs:
$$\frac{d^2X}{dx^2} + \lambda X = 0$$
$$\frac{dT}{dt} + \lambda T = 0$$

Solve each ODE subject to boundary/initial conditions.

### Example: Heat Equation

$$u_t = k u_{xx}, \quad 0 < x < L, \quad t > 0$$
$$u(0, t) = u(L, t) = 0, \quad u(x, 0) = f(x)$$

**Separation:** $u(x,t) = X(x)T(t)$ gives:
$$\frac{T'}{kT} = \frac{X''}{X} = -\lambda$$

**Eigenvalue problem:** $X'' + \lambda X = 0$, $X(0) = X(L) = 0$

**Solution:** $\lambda_n = \left(\frac{n\pi}{L}\right)^2$, $X_n(x) = \sin\frac{n\pi x}{L}$

**Time part:** $T_n(t) = e^{-k\lambda_n t}$

**General solution:**
$$u(x,t) = \sum_{n=1}^\infty b_n e^{-k(n\pi/L)^2 t}\sin\frac{n\pi x}{L}$$

where $b_n$ determined by initial condition: $b_n = \frac{2}{L}\int_0^L f(x)\sin\frac{n\pi x}{L}dx$

---

## 9. The Three Classical PDEs

### 1. Laplace's Equation (Elliptic)

$$\nabla^2 u = u_{xx} + u_{yy} = 0 \quad \text{(2D)}$$
$$\nabla^2 u = u_{xx} + u_{yy} + u_{zz} = 0 \quad \text{(3D)}$$

**Physical applications:** Steady-state heat, electrostatics, fluid flow.

**Properties:**
- **Maximum principle:** Maximum and minimum on boundary (if non-constant)
- Solutions are **harmonic functions**
- Mean value property: $u(x_0, y_0) = \frac{1}{2\pi r}\int_0^{2\pi} u(x_0 + r\cos\theta, y_0 + r\sin\theta)d\theta$

**Boundary conditions:**
- **Dirichlet:** $u$ specified on boundary
- **Neumann:** $\frac{\partial u}{\partial n}$ (normal derivative) specified on boundary
- **Robin (mixed):** Linear combination of $u$ and $\frac{\partial u}{\partial n}$

### 2. Heat Equation (Parabolic)

$$u_t = k\nabla^2 u$$

**Physical meaning:** Temperature distribution, diffusion.

**Properties:**
- **Irreversible:** Information propagates at infinite speed (mathematically)
- **Smoothing:** Solutions become infinitely differentiable for $t > 0$
- **Maximum principle:** Maximum occurs at $t = 0$ or on boundary

**Solution methods:**
- Separation of variables
- Fourier transform
- Green's functions

### 3. Wave Equation (Hyperbolic)

$$u_{tt} = c^2\nabla^2 u$$

**Physical meaning:** Vibrating string, sound waves, electromagnetic waves.

**Properties:**
- **Reversible:** Can solve backwards in time
- **Finite propagation speed:** Disturbances travel at speed $c$
- **d'Alembert solution (1D):** $u(x,t) = f(x - ct) + g(x + ct)$

**Initial conditions:** Specify both $u(x, 0)$ and $u_t(x, 0)$.

---

## 10. Method of Characteristics

### First-Order Linear PDEs

$$a(x, y)u_x + b(x, y)u_y = c(x, y, u)$$

**Characteristic equations:**
$$\frac{dx}{a} = \frac{dy}{b} = \frac{du}{c}$$

Solve these ODEs to find characteristics, then use them to construct solution.

### First-Order Quasilinear

$$a(x, y, u)u_x + b(x, y, u)u_y = c(x, y, u)$$

Same approach, but characteristics may depend on $u$.

### Quasi-linear First-Order System (Hyperbolic)

For $\mathbf{u}_t + A(\mathbf{u})\mathbf{u}_x = 0$:

**Characteristics:** Curves in $(x, t)$ plane along which $\frac{dx}{dt} = \lambda_i$ where $\lambda_i$ are eigenvalues of $A$.

Along characteristics, solution satisfies ODE in characteristic variables.

---

## 11. Fourier Transform Methods

### Fourier Transform

$$\hat{u}(\omega) = \mathcal{F}[u](ω) = \int_{-\infty}^\infty u(x)e^{-i\omega x}dx$$

$$u(x) = \mathcal{F}^{-1}[\hat{u}](x) = \frac{1}{2\pi}\int_{-\infty}^\infty \hat{u}(\omega)e^{i\omega x}d\omega$$

**Key property:** $\mathcal{F}[u_{xx}] = -\omega^2\hat{u}(\omega)$

### Application to Heat Equation on $\mathbb{R}$

$$u_t = ku_{xx}, \quad u(x, 0) = f(x)$$

Transform in $x$: $\hat{u}_t = -k\omega^2\hat{u}$

Solve ODE: $\hat{u}(\omega, t) = \hat{f}(\omega)e^{-k\omega^2 t}$

Inverse transform: $u(x, t) = \frac{1}{\sqrt{4\pi kt}}\int_{-\infty}^\infty f(\xi)e^{-(x-\xi)^2/(4kt)}d\xi$

This is convolution with **heat kernel** $G(x, t) = \frac{1}{\sqrt{4\pi kt}}e^{-x^2/(4kt)}$.

---

## 12. Green's Functions

### Definition

For operator $L$ and domain $D$, **Green's function** $G(x, \xi)$ satisfies:
$$L_x G(x, \xi) = \delta(x - \xi)$$
plus appropriate boundary conditions.

**Solution to inhomogeneous problem:**
$$Lu = f \implies u(x) = \int_D G(x, \xi)f(\xi)d\xi$$

### Example: 1D Poisson Equation

$$-u'' = f(x), \quad 0 < x < L, \quad u(0) = u(L) = 0$$

**Green's function:**
$$G(x, \xi) = \begin{cases}
\frac{x(L - \xi)}{L} & x < \xi \\
\frac{\xi(L - x)}{L} & x > \xi
\end{cases}$$

**Solution:**
$$u(x) = \int_0^L G(x, \xi)f(\xi)d\xi$$

---

## 13. Weak Solutions and Distributions

### Motivation

Classical solutions may not exist for:
- Discontinuous initial/boundary data
- Nonlinear conservation laws (shocks)
- Singular sources

### Weak Formulation

Multiply PDE by test function $\phi$, integrate, use integration by parts to move derivatives onto $\phi$.

**Example (1D Poisson):** $-u'' = f$

**Weak form:** Find $u$ such that for all test functions $\phi$:
$$\int_0^L u'\phi' dx = \int_0^L f\phi dx$$

### Distributions

$u$ is a **distribution** if it's a continuous linear functional on test functions.

**Derivative:** $\langle u', \phi \rangle = -\langle u, \phi' \rangle$

**Example:** Dirac delta $\delta(x - x_0)$ defined by $\langle \delta, \phi \rangle = \phi(x_0)$.

---

## 14. Key Traps for AI Models

### ODE Errors

1. ✗ Forgetting to check if equation is exact before using exact method
2. ✗ Using variation of parameters formula incorrectly (wrong Wronskian)
3. ✗ Claiming uniqueness without Lipschitz condition
4. ✗ Misclassifying equilibrium points in phase plane
5. ✗ Forgetting initial conditions when solving IVP
6. ✗ Using undetermined coefficients when $f(x)$ not in correct form

### PDE Classification Errors

7. ✗ Miscomputing discriminant $B^2 - AC$
8. ✗ Confusing classification (calling heat equation elliptic, etc.)
9. ✗ Forgetting classification can change at different points for variable coefficients

### Separation of Variables Errors

10. ✗ Assuming separation works without checking boundary conditions
11. ✗ Getting sign wrong on separation constant
12. ✗ Not checking that separated solutions satisfy boundary conditions
13. ✗ Forgetting to form general solution as infinite series

### Boundary/Initial Condition Errors

14. ✗ Applying Dirichlet conditions when problem specifies Neumann
15. ✗ For wave equation, forgetting to specify both $u(x,0)$ and $u_t(x,0)$
16. ✗ Claiming BVP always has unique solution (unlike IVP)

### Maximum Principle Errors

17. ✗ Applying maximum principle to hyperbolic equations (only for elliptic/parabolic)
18. ✗ Claiming interior maximum exists for non-constant harmonic function

### Fourier Transform Errors

19. ✗ Forgetting factor of $1/(2\pi)$ in inverse transform
20. ✗ Misapplying transform of derivative: $\mathcal{F}[u'] = i\omega\hat{u}$ (not $-i\omega$)
21. ✗ Using Fourier transform on bounded domain (need Fourier series)

### Green's Function Errors

22. ✗ Not satisfying boundary conditions in Green's function
23. ✗ Missing delta function in defining equation
24. ✗ Getting symmetry wrong: $G(x, \xi) = G(\xi, x)$ for self-adjoint operators

### Characteristics Errors

25. ✗ Using method of characteristics on elliptic equations
26. ✗ Getting characteristic directions wrong (using $\frac{dt}{dx}$ instead of $\frac{dx}{dt}$)
27. ✗ Not recognizing shock formation in nonlinear problems

---

## 15. Template Problems

### Problem 1: Existence/Uniqueness Trap

**Problem:** Does $y' = y^{2/3}$, $y(0) = 0$ have a unique solution?

**Solution:**
- $f(x, y) = y^{2/3}$ is continuous
- But $\frac{\partial f}{\partial y} = \frac{2}{3}y^{-1/3}$ is unbounded near $y = 0$
- Lipschitz condition fails

**Check:** $y = 0$ is a solution. So is $y = \left(\frac{x}{3}\right)^3$ for $x \geq 0$.

**Answer:** Solution exists but is **NOT unique**.

### Problem 2: PDE Classification

**Problem:** Classify $u_{xx} - 2u_{xy} + u_{yy} = 0$.

**Solution:** $A = 1$, $B = -1$, $C = 1$.

Discriminant: $\Delta = B^2 - AC = 1 - 1 = 0$.

**Answer:** **Parabolic**.

### Problem 3: Separation of Variables

**Problem:** Solve $u_t = u_{xx}$ on $0 < x < \pi$, $t > 0$ with $u(0,t) = u(\pi, t) = 0$ and $u(x, 0) = \sin x + 3\sin 2x$.

**Solution:**
Eigenvalue problem: $X'' + \lambda X = 0$, $X(0) = X(\pi) = 0$

Eigenvalues: $\lambda_n = n^2$, eigenfunctions: $X_n = \sin nx$

Time part: $T_n(t) = e^{-n^2 t}$

General solution: $u(x,t) = \sum_{n=1}^\infty b_n e^{-n^2 t}\sin nx$

From initial condition: $b_1 = 1$, $b_2 = 3$, $b_n = 0$ for $n \geq 3$.

**Answer:** $u(x,t) = e^{-t}\sin x + 3e^{-4t}\sin 2x$

---

## 16. RLHF Evaluation Strategy

When evaluating AI-generated ODE/PDE proofs:

1. **Check equation type:** Is it correctly classified as linear/nonlinear, homogeneous/inhomogeneous?

2. **Verify existence/uniqueness claims:** Are Picard-Lindelöf conditions checked?

3. **Check PDE classification:** Is discriminant computed correctly?

4. **Verify separation of variables:** Do separated solutions satisfy boundary conditions? Is series properly formed?

5. **Check boundary/initial conditions:** Are correct number and type specified?

6. **Verify maximum principle applications:** Is equation type correct (elliptic/parabolic)?

7. **Check transform methods:** Are transform properties used correctly? Correct factors?

8. **Verify Green's function:** Does it satisfy defining equation and boundary conditions?

9. **Check characteristics:** Is method applicable (hyperbolic/first-order)? Are directions correct?

---

**End of ODE/PDE Reference Document**
