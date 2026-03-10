# Complex Analysis — Complete Reference for RLHF Evaluation

## 1. Complex Numbers and Functions

### Complex Numbers

$z = x + iy$ where $x, y \in \mathbb{R}$ and $i^2 = -1$.

**Basic operations:**
- Addition: $(x_1 + iy_1) + (x_2 + iy_2) = (x_1 + x_2) + i(y_1 + y_2)$
- Multiplication: $(x_1 + iy_1)(x_2 + iy_2) = (x_1 x_2 - y_1 y_2) + i(x_1 y_2 + x_2 y_1)$
- Conjugate: $\overline{z} = x - iy$
- Modulus: $|z| = \sqrt{x^2 + y^2} = \sqrt{z\overline{z}}$
- Argument: $\arg(z) = \theta$ where $z = |z|e^{i\theta}$

**Polar form:** $z = re^{i\theta} = r(\cos\theta + i\sin\theta)$ where $r = |z|$, $\theta = \arg(z)$.

### Complex Functions

$f: D \subseteq \mathbb{C} \to \mathbb{C}$ can be written as:
$$f(x + iy) = u(x, y) + iv(x, y)$$
where $u, v: \mathbb{R}^2 \to \mathbb{R}$ are real-valued.

**Elementary functions:**
- $e^z = e^x(\cos y + i\sin y)$
- $\sin z = \frac{e^{iz} - e^{-iz}}{2i}$
- $\cos z = \frac{e^{iz} + e^{-iz}}{2}$
- $\log z = \ln|z| + i\arg(z)$ (multivalued)

---

## 2. Analyticity and Holomorphic Functions

### Complex Differentiability

$f$ is **complex differentiable** at $z_0$ if:
$$f'(z_0) = \lim_{h \to 0} \frac{f(z_0 + h) - f(z_0)}{h}$$
exists, where $h \in \mathbb{C}$.

**Key difference from real case:** Limit must be same from all directions in $\mathbb{C}$.

### Holomorphic Functions

$f$ is **holomorphic** (or **analytic**) on open set $D$ if $f$ is complex differentiable at every point in $D$.

**Notation:** $f \in H(D)$ or $f$ is analytic in $D$.

### Cauchy-Riemann Equations

$f = u + iv$ is holomorphic at $z_0 = x_0 + iy_0$ if and only if:
1. Partial derivatives $u_x, u_y, v_x, v_y$ exist and are continuous at $(x_0, y_0)$
2. **Cauchy-Riemann equations** hold:
$$\boxed{\frac{\partial u}{\partial x} = \frac{\partial v}{\partial y}, \quad \frac{\partial u}{\partial y} = -\frac{\partial v}{\partial x}}$$

**Consequence:** If $f$ is holomorphic, then:
$$f'(z) = \frac{\partial u}{\partial x} + i\frac{\partial v}{\partial x} = \frac{\partial v}{\partial y} - i\frac{\partial u}{\partial y}$$

### Harmonic Functions

$u: D \to \mathbb{R}$ is **harmonic** if $\Delta u = u_{xx} + u_{yy} = 0$ (Laplace equation).

**Theorem:** If $f = u + iv$ is holomorphic, then both $u$ and $v$ are harmonic.

**Conversely:** If $u$ is harmonic on simply connected $D$, there exists harmonic $v$ (unique up to constant) such that $f = u + iv$ is holomorphic. We call $v$ a **harmonic conjugate** of $u$.

---

## 3. Complex Integration

### Contour Integrals

For a smooth curve $\gamma: [a, b] \to \mathbb{C}$ and continuous $f: \text{Im}(\gamma) \to \mathbb{C}$:
$$\int_\gamma f(z)\,dz = \int_a^b f(\gamma(t))\gamma'(t)\,dt$$

**Properties:**
- Linear: $\int_\gamma (\alpha f + \beta g) = \alpha\int_\gamma f + \beta\int_\gamma g$
- Reverse orientation: $\int_{-\gamma} f = -\int_\gamma f$
- Path additivity: $\int_{\gamma_1 + \gamma_2} f = \int_{\gamma_1} f + \int_{\gamma_2} f$

**ML-inequality:**
$$\left|\int_\gamma f(z)\,dz\right| \leq \max_{z \in \gamma} |f(z)| \cdot \text{length}(\gamma)$$

### Cauchy's Theorem

**Cauchy's Theorem (basic version):** If $f$ is holomorphic on and inside a simple closed curve $\gamma$, then:
$$\boxed{\oint_\gamma f(z)\,dz = 0}$$

**Cauchy's Theorem (general version):** If $f$ is holomorphic on simply connected domain $D$, then for any closed curve $\gamma$ in $D$:
$$\oint_\gamma f(z)\,dz = 0$$

**Consequence:** Integral depends only on endpoints for holomorphic functions in simply connected domains.

### Cauchy's Integral Formula

If $f$ is holomorphic on and inside a simple closed curve $\gamma$ (oriented counterclockwise), and $z_0$ is inside $\gamma$:
$$\boxed{f(z_0) = \frac{1}{2\pi i}\oint_\gamma \frac{f(z)}{z - z_0}\,dz}$$

**Generalized (for derivatives):**
$$\boxed{f^{(n)}(z_0) = \frac{n!}{2\pi i}\oint_\gamma \frac{f(z)}{(z - z_0)^{n+1}}\,dz}$$

**Consequence:** Holomorphic functions are **infinitely differentiable** (unlike real analysis!).

---

## 4. Power Series and Taylor Series

### Power Series

$$\sum_{n=0}^\infty a_n(z - z_0)^n$$

**Radius of convergence:**
$$R = \frac{1}{\limsup_{n \to \infty} \sqrt[n]{|a_n|}}$$

**Convergence behavior:**
- Converges absolutely for $|z - z_0| < R$
- Diverges for $|z - z_0| > R$
- May converge or diverge on $|z - z_0| = R$

**Key theorem:** Power series represents a holomorphic function inside its disk of convergence.

**Term-by-term differentiation:** If $f(z) = \sum a_n(z - z_0)^n$ for $|z - z_0| < R$, then:
$$f'(z) = \sum_{n=1}^\infty na_n(z - z_0)^{n-1}$$
with the same radius of convergence.

### Taylor Series

**Theorem:** If $f$ is holomorphic in $|z - z_0| < R$, then:
$$f(z) = \sum_{n=0}^\infty \frac{f^{(n)}(z_0)}{n!}(z - z_0)^n$$
for all $|z - z_0| < R$.

**Key point:** Every holomorphic function is analytic (has a convergent power series expansion).

This is **much stronger** than in real analysis, where smooth $\not\Rightarrow$ analytic.

---

## 5. Laurent Series and Singularities

### Laurent Series

If $f$ is holomorphic in annulus $r < |z - z_0| < R$, then:
$$f(z) = \sum_{n=-\infty}^\infty a_n(z - z_0)^n$$

where:
$$a_n = \frac{1}{2\pi i}\oint_\gamma \frac{f(z)}{(z - z_0)^{n+1}}\,dz$$

**Principal part:** $\sum_{n=-\infty}^{-1} a_n(z - z_0)^n$ (negative powers)

**Regular part:** $\sum_{n=0}^\infty a_n(z - z_0)^n$ (non-negative powers)

### Classification of Singularities

$z_0$ is an **isolated singularity** of $f$ if $f$ is holomorphic in $0 < |z - z_0| < r$ but not at $z_0$.

**Three types:**

1. **Removable singularity:** Principal part is zero
   - Equivalently: $\lim_{z \to z_0} f(z)$ exists
   - Equivalently: $\lim_{z \to z_0} (z - z_0)f(z) = 0$
   - Can extend $f$ to be holomorphic at $z_0$

2. **Pole of order $m$:** Principal part has finitely many terms, highest is $(z - z_0)^{-m}$
   - Equivalently: $\lim_{z \to z_0} |f(z)| = \infty$
   - Equivalently: $\lim_{z \to z_0} (z - z_0)^m f(z) \neq 0, \infty$
   - If $m = 1$, called a **simple pole**

3. **Essential singularity:** Principal part has infinitely many nonzero terms
   - By Casorati-Weierstrass: image of any punctured neighborhood is dense in $\mathbb{C}$
   - By Picard: $f$ takes every complex value infinitely often (with at most one exception)

### Residues

The **residue** of $f$ at isolated singularity $z_0$ is:
$$\text{Res}(f, z_0) = a_{-1} = \frac{1}{2\pi i}\oint_\gamma f(z)\,dz$$

where $\gamma$ is a small circle around $z_0$.

**For simple pole:** If $f(z) = \frac{g(z)}{h(z)}$ where $g(z_0) \neq 0$ and $h$ has simple zero at $z_0$:
$$\text{Res}(f, z_0) = \frac{g(z_0)}{h'(z_0)}$$

**For pole of order $m$:**
$$\text{Res}(f, z_0) = \frac{1}{(m-1)!}\lim_{z \to z_0} \frac{d^{m-1}}{dz^{m-1}}[(z - z_0)^m f(z)]$$

---

## 6. Residue Theorem and Applications

### Residue Theorem

If $f$ is holomorphic inside and on a simple closed curve $\gamma$ except for isolated singularities $z_1, \ldots, z_n$ inside $\gamma$:
$$\boxed{\oint_\gamma f(z)\,dz = 2\pi i \sum_{k=1}^n \text{Res}(f, z_k)}$$

### Applications to Real Integrals

**Type 1: $\int_0^{2\pi} R(\cos\theta, \sin\theta)\,d\theta$**

Substitute $z = e^{i\theta}$, so $\cos\theta = \frac{z + z^{-1}}{2}$, $\sin\theta = \frac{z - z^{-1}}{2i}$, $d\theta = \frac{dz}{iz}$.

Result: integral over unit circle $|z| = 1$.

**Type 2: $\int_{-\infty}^\infty f(x)\,dx$ (rational functions)**

Use semicircular contour in upper half-plane. Requires:
- $f(z) \to 0$ as $|z| \to \infty$ fast enough
- No poles on real axis (or handle carefully)

**Type 3: $\int_{-\infty}^\infty f(x)e^{iax}\,dx$ (Fourier-type integrals)**

Use Jordan's lemma: if $|f(z)| \to 0$ uniformly on semicircle, contribution from arc vanishes.

---

## 7. Conformal Mappings

### Definition

$f$ is **conformal** at $z_0$ if $f$ is holomorphic at $z_0$ and $f'(z_0) \neq 0$.

**Property:** Preserves angles (magnitude and orientation).

### Möbius Transformations

$$f(z) = \frac{az + b}{cz + d}, \quad ad - bc \neq 0$$

**Properties:**
- Maps circles and lines to circles and lines
- Bijection from $\hat{\mathbb{C}} \to \hat{\mathbb{C}}$ (extended complex plane)
- Conformal everywhere except at poles
- Determined by three points

**Special cases:**
- Translation: $f(z) = z + b$
- Rotation/dilation: $f(z) = az$
- Inversion: $f(z) = 1/z$

### Riemann Mapping Theorem

**Statement:** Any simply connected domain $D \subsetneq \mathbb{C}$ is conformally equivalent to the unit disk $\mathbb{D} = \{z : |z| < 1\}$.

**In words:** There exists a bijective conformal map $f: D \to \mathbb{D}$.

**Important:** Map is NOT unique (can compose with Möbius transformations of disk).

**Does NOT hold for:** Multiply connected domains, or $\mathbb{C}$ itself (Liouville's theorem).

---

## 8. Maximum Modulus Principle

### Statement

**Maximum Modulus Principle:** If $f$ is holomorphic and non-constant on a domain $D$, then $|f|$ has no local maximum in $D$.

**Consequence:** If $D$ is bounded and $f$ is continuous on $\overline{D}$ and holomorphic on $D$, then:
$$\max_{z \in \overline{D}} |f(z)| = \max_{z \in \partial D} |f(z)|$$

**In words:** Maximum occurs on the boundary.

### Minimum Modulus Principle

If $f$ is holomorphic and non-constant on domain $D$, and $f(z) \neq 0$ for all $z \in D$, then $|f|$ has no local minimum in $D$.

**Proof idea:** Apply maximum modulus principle to $1/f$.

### Schwarz Lemma

If $f: \mathbb{D} \to \mathbb{D}$ is holomorphic with $f(0) = 0$, then:
1. $|f(z)| \leq |z|$ for all $z \in \mathbb{D}$
2. $|f'(0)| \leq 1$

If equality holds in (1) for some $z \neq 0$, or in (2), then $f(z) = e^{i\theta}z$ for some $\theta \in \mathbb{R}$.

---

## 9. Entire Functions

### Definition

$f$ is **entire** if $f$ is holomorphic on all of $\mathbb{C}$.

**Examples:** Polynomials, $e^z$, $\sin z$, $\cos z$.

### Liouville's Theorem

**Statement:** Every bounded entire function is constant.

$$\boxed{f \text{ entire and } |f(z)| \leq M \text{ for all } z \implies f \text{ is constant}}$$

**Application:** Fundamental Theorem of Algebra — every non-constant polynomial has a root.

### Growth of Entire Functions

**Order of entire function:**
$$\rho = \limsup_{r \to \infty} \frac{\log\log M(r)}{\log r}$$
where $M(r) = \max_{|z| = r} |f(z)|$.

**Examples:**
- Polynomial of degree $n$: order 0
- $e^z$: order 1
- $e^{z^2}$: order 2
- $e^{e^z}$: order $\infty$

### Hadamard's Factorization Theorem

Entire function of finite order can be represented as infinite product involving its zeros.

---

## 10. Key Traps for AI Models

### Analyticity Errors
1. ✗ Claiming differentiable (from one direction) implies holomorphic
2. ✗ Forgetting to verify Cauchy-Riemann equations
3. ✗ Assuming smooth implies analytic (confusing with real analysis)
4. ✗ Claiming $f = \bar{z}$ is holomorphic (it's NOT — fails C-R equations)

### Cauchy Theorem Errors
5. ✗ Applying Cauchy's theorem when function has singularities inside contour
6. ✗ Forgetting domain must be simply connected
7. ✗ Misapplying Cauchy integral formula at points outside contour

### Singularity Classification Errors
8. ✗ Confusing removable singularities with poles
9. ✗ Claiming $\lim_{z \to z_0} f(z)$ exists implies removable (need boundedness too)
10. ✗ Incorrectly computing order of pole

### Residue Calculation Errors
11. ✗ Using simple pole formula for higher-order poles
12. ✗ Forgetting factor of $2\pi i$ in residue theorem
13. ✗ Computing residues at wrong singularities (outside contour)
14. ✗ Missing contribution from singularity at infinity

### Series Convergence Errors
15. ✗ Confusing radius of convergence with region of analyticity
16. ✗ Claiming Laurent series is unique (it is, for given annulus)
17. ✗ Using wrong formula for radius of convergence

### Maximum Modulus Errors
18. ✗ Applying maximum modulus when function not holomorphic
19. ✗ Claiming maximum occurs in interior (violates MMP)
20. ✗ Misapplying Schwarz lemma when conditions not met

### Conformal Mapping Errors
21. ✗ Claiming conformal at points where $f'(z) = 0$
22. ✗ Assuming Riemann mapping theorem works for multiply connected domains
23. ✗ Forgetting uniqueness issues in Riemann mapping

### Liouville's Theorem Errors
24. ✗ Applying when function not entire
25. ✗ Claiming unbounded implies non-constant (reverse is true)
26. ✗ Misusing to prove non-existence of certain entire functions

---

## 11. Template Problems

### Problem 1: Cauchy-Riemann Trap

**Problem:** Is $f(z) = |z|^2$ holomorphic?

**Solution:** Write $f(z) = f(x + iy) = x^2 + y^2$, so $u(x,y) = x^2 + y^2$, $v(x,y) = 0$.

Check Cauchy-Riemann:
- $u_x = 2x$, $v_y = 0$ → Need $2x = 0$
- $u_y = 2y$, $v_x = 0$ → Need $-2y = 0$

C-R equations hold only at $(0, 0)$.

**Answer:** $f$ is NOT holomorphic anywhere (except trivially at origin where it's differentiable but not in a neighborhood).

### Problem 2: Residue Calculation

**Problem:** Compute $\oint_{|z|=2} \frac{e^z}{z^2(z-1)}\,dz$.

**Solution:** Find singularities inside $|z| = 2$:
- $z = 0$ (pole of order 2)
- $z = 1$ (simple pole)

**Residue at $z = 0$:**
$$\text{Res}(f, 0) = \lim_{z \to 0} \frac{d}{dz}\left[z^2 \cdot \frac{e^z}{z^2(z-1)}\right] = \lim_{z \to 0} \frac{d}{dz}\left[\frac{e^z}{z-1}\right]$$
$$= \lim_{z \to 0} \frac{e^z(z-1) - e^z}{(z-1)^2} = \frac{-1 - 1}{1} = -2$$

**Residue at $z = 1$:**
$$\text{Res}(f, 1) = \lim_{z \to 1} (z-1) \cdot \frac{e^z}{z^2(z-1)} = \frac{e^1}{1^2} = e$$

**By residue theorem:**
$$\oint_{|z|=2} \frac{e^z}{z^2(z-1)}\,dz = 2\pi i(-2 + e) = 2\pi i(e - 2)$$

### Problem 3: Maximum Modulus

**Problem:** Let $f$ be entire with $|f(z)| \leq 1 + |z|^2$ for all $z$. What can we say about $f$?

**Solution:** For $|z| = R$:
$$|f(z)| \leq 1 + R^2$$

By Cauchy's estimate for derivatives:
$$|f'(0)| \leq \frac{\max_{|z|=R} |f(z)|}{R} \leq \frac{1 + R^2}{R} = \frac{1}{R} + R$$

This must hold for all $R$, but right side $\to \infty$ as $R \to \infty$.

Actually, for $f''(0)$:
$$|f''(0)| \leq \frac{2\max_{|z|=R} |f(z)|}{R^2} \leq \frac{2(1 + R^2)}{R^2} = \frac{2}{R^2} + 2$$

As $R \to \infty$, this gives $|f''(0)| \leq 2$.

By similar argument, $f^{(n)}(0) = 0$ for $n \geq 3$.

**Conclusion:** $f$ is a polynomial of degree at most 2: $f(z) = a + bz + cz^2$.

---

## 12. RLHF Evaluation Strategy

When evaluating AI-generated complex analysis proofs:

1. **Verify Cauchy-Riemann:** Are both equations checked? Are partial derivatives continuous?

2. **Check analyticity claims:** Is holomorphicity verified in a neighborhood, not just at a point?

3. **Verify Cauchy theorem conditions:** Is function holomorphic throughout region? Is domain simply connected?

4. **Check singularity classification:** Is the type correctly identified? Is order computed correctly?

5. **Verify residue calculations:** Is correct formula used for pole order? Is $2\pi i$ factor included?

6. **Check contour orientation:** Are contours oriented correctly (usually counterclockwise)?

7. **Verify maximum modulus applications:** Is function holomorphic and non-constant?

8. **Check conformal mapping claims:** Is $f'(z) \neq 0$ at relevant points?

---

**End of Complex Analysis Reference Document**
