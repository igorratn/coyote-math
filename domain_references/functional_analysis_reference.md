# Functional Analysis — Complete Reference for RLHF Evaluation

## 1. Normed Spaces

### Definition

A **normed space** is a vector space $X$ with a norm $\|\cdot\|: X \to [0, \infty)$ satisfying:
1. $\|x\| = 0 \iff x = 0$ (positive definiteness)
2. $\|\alpha x\| = |\alpha| \|x\|$ for all $\alpha \in \mathbb{F}$, $x \in X$ (homogeneity)
3. $\|x + y\| \leq \|x\| + \|y\|$ (triangle inequality)

Every normed space is a metric space with $d(x, y) = \|x - y\|$.

### Common Norms

**On $\mathbb{R}^n$ or $\mathbb{C}^n$:**
- $\|x\|_1 = \sum_{i=1}^n |x_i|$
- $\|x\|_2 = \sqrt{\sum_{i=1}^n |x_i|^2}$ (Euclidean norm)
- $\|x\|_p = \left(\sum_{i=1}^n |x_i|^p\right)^{1/p}$ for $1 \leq p < \infty$
- $\|x\|_\infty = \max_{1 \leq i \leq n} |x_i|$

**On $C[a, b]$ (continuous functions on $[a,b]$):**
- $\|f\|_\infty = \max_{x \in [a,b]} |f(x)|$ (supremum norm)
- $\|f\|_1 = \int_a^b |f(x)|\,dx$
- $\|f\|_2 = \sqrt{\int_a^b |f(x)|^2\,dx}$

### Convergence in Normed Spaces

$x_n \to x$ in $X$ means $\|x_n - x\| \to 0$.

This is **stronger** than pointwise convergence for function spaces.

**Example:** In $C[0,1]$ with $\|\cdot\|_\infty$:
- $\|f_n - f\|_\infty \to 0$ means $f_n \to f$ uniformly
- NOT just pointwise

---

## 2. Banach Spaces

### Definition

A **Banach space** is a normed space that is **complete**: every Cauchy sequence converges.

**Cauchy sequence:** $\forall \varepsilon > 0, \exists N : m, n > N \implies \|x_n - x_m\| < \varepsilon$

### Examples of Banach Spaces

1. $\mathbb{R}^n$ and $\mathbb{C}^n$ with any $p$-norm
2. $C[a, b]$ with $\|\cdot\|_\infty$ (continuous functions with supremum norm)
3. $\ell^p = \{(x_n) : \sum |x_n|^p < \infty\}$ with $\|x\|_p = \left(\sum |x_n|^p\right)^{1/p}$
4. $L^p(\Omega)$ spaces (Lebesgue integrable functions)

### Non-Example

$C[a, b]$ with $\|\cdot\|_1$ is NOT complete (not a Banach space).

**Counterexample:** Can construct Cauchy sequence of continuous functions that converges to discontinuous function.

### Completion

Every normed space has a **completion**: a Banach space containing it as a dense subspace.

**Example:** $L^p$ is the completion of continuous functions under the $L^p$ norm.

---

## 3. Bounded Linear Operators

### Definition

Let $X, Y$ be normed spaces. $T: X \to Y$ is a **bounded linear operator** if:
1. $T$ is linear: $T(\alpha x + \beta y) = \alpha T(x) + \beta T(y)$
2. There exists $M \geq 0$ such that $\|T(x)\| \leq M\|x\|$ for all $x \in X$

**Operator norm:**
$$\|T\| = \sup_{\|x\| \leq 1} \|T(x)\| = \sup_{x \neq 0} \frac{\|T(x)\|}{\|x\|}$$

**Notation:** $\mathcal{B}(X, Y)$ denotes the space of bounded linear operators from $X$ to $Y$.

### Key Theorem: Bounded ↔ Continuous

For linear operators between normed spaces:
$$\boxed{T \text{ bounded} \iff T \text{ continuous}}$$

**Proof sketch:**
- Bounded $\Rightarrow$ continuous: $\|T(x) - T(y)\| = \|T(x - y)\| \leq M\|x - y\|$
- Continuous $\Rightarrow$ bounded: Continuity at 0 gives $\delta$ such that $\|x\| < \delta \implies \|T(x)\| < 1$

### Properties of Operator Norm

- $\|T(x)\| \leq \|T\| \|x\|$ for all $x$
- $\|ST\| \leq \|S\| \|T\|$ (submultiplicativity)
- $\mathcal{B}(X, Y)$ is a normed space
- If $Y$ is Banach, then $\mathcal{B}(X, Y)$ is Banach

---

## 4. Hilbert Spaces

### Definition

A **Hilbert space** is a complete inner product space.

**Inner product** on complex vector space $H$:
$$\langle \cdot, \cdot \rangle: H \times H \to \mathbb{C}$$
satisfying:
1. Linearity in first argument: $\langle \alpha x + \beta y, z \rangle = \alpha \langle x, z \rangle + \beta \langle y, z \rangle$
2. Conjugate symmetry: $\langle x, y \rangle = \overline{\langle y, x \rangle}$
3. Positive definiteness: $\langle x, x \rangle \geq 0$ with equality iff $x = 0$

**Induced norm:** $\|x\| = \sqrt{\langle x, x \rangle}$

### Examples

1. $\mathbb{C}^n$ with $\langle x, y \rangle = \sum_{i=1}^n x_i \overline{y_i}$
2. $\ell^2 = \{(x_n) : \sum |x_n|^2 < \infty\}$ with $\langle x, y \rangle = \sum_{n=1}^\infty x_n \overline{y_n}$
3. $L^2(\Omega)$ with $\langle f, g \rangle = \int_\Omega f(x)\overline{g(x)}\,dx$

### Cauchy-Schwarz Inequality

$$\boxed{|\langle x, y \rangle| \leq \|x\| \|y\|}$$

Equality holds iff $x$ and $y$ are linearly dependent.

### Parallelogram Law

$$\|x + y\|^2 + \|x - y\|^2 = 2(\|x\|^2 + \|y\|^2)$$

**Important:** A norm comes from an inner product iff it satisfies the parallelogram law.

**Example:** $\|\cdot\|_1$ and $\|\cdot\|_\infty$ on $\mathbb{R}^n$ do NOT satisfy parallelogram law, so don't come from inner product.

### Orthogonality and Projections

- $x \perp y$ means $\langle x, y \rangle = 0$
- For closed subspace $M \subseteq H$: every $x \in H$ has unique decomposition $x = y + z$ where $y \in M$, $z \in M^\perp$
- $P_M(x) = y$ is the **orthogonal projection** onto $M$

**Properties of $P_M$:**
- Linear
- $P_M^2 = P_M$ (idempotent)
- $\|P_M\| = 1$ (if $M \neq \{0\}$)
- Self-adjoint: $\langle P_M x, y \rangle = \langle x, P_M y \rangle$

### Orthonormal Bases

A set $\{e_\alpha\}_{\alpha \in A}$ is an **orthonormal basis** if:
1. $\langle e_\alpha, e_\beta \rangle = \delta_{\alpha\beta}$ (orthonormal)
2. Span is dense in $H$

**For separable Hilbert spaces** (countable orthonormal basis $\{e_n\}$):
$$x = \sum_{n=1}^\infty \langle x, e_n \rangle e_n$$

**Parseval's identity:**
$$\|x\|^2 = \sum_{n=1}^\infty |\langle x, e_n \rangle|^2$$

---

## 5. Three Fundamental Theorems

### 1. Hahn-Banach Theorem

**Version 1 (Extension):** Let $X$ be a normed space, $M$ a subspace, and $\varphi: M \to \mathbb{F}$ a bounded linear functional. Then there exists $\Phi: X \to \mathbb{F}$ extending $\varphi$ with $\|\Phi\| = \|\varphi\|$.

**Consequence:** Every bounded linear functional on a subspace can be extended to the whole space without increasing its norm.

**Version 2 (Separation):** Let $A, B$ be disjoint convex sets in a normed space with $A$ open. Then there exists a continuous linear functional separating them.

**Application:** Shows dual spaces are "large enough."

### 2. Uniform Boundedness Principle (Banach-Steinhaus)

**Statement:** Let $X$ be Banach, $Y$ normed, and $\{T_\alpha\}_{\alpha \in A} \subseteq \mathcal{B}(X, Y)$. If:
$$\sup_{\alpha} \|T_\alpha(x)\| < \infty \quad \text{for each } x \in X$$
then:
$$\sup_{\alpha} \|T_\alpha\| < \infty$$

**In words:** Pointwise boundedness implies uniform boundedness (for family of operators from Banach space).

**Key requirement:** Domain must be **complete** (Banach space).

**Contrapositive:** If $\sup_\alpha \|T_\alpha\| = \infty$, then there exists $x$ with $\sup_\alpha \|T_\alpha(x)\| = \infty$.

### 3. Open Mapping Theorem

**Statement:** Let $X, Y$ be Banach spaces and $T: X \to Y$ be a surjective bounded linear operator. Then $T$ is an open map (maps open sets to open sets).

**Consequence 1 (Bounded Inverse Theorem):** If $T: X \to Y$ is a bijective bounded linear operator between Banach spaces, then $T^{-1}$ is also bounded.

**Consequence 2 (Closed Graph Theorem):** If $X, Y$ are Banach and $T: X \to Y$ is linear with closed graph, then $T$ is bounded.

**Key requirement:** Both spaces must be **complete** (Banach).

---

## 6. Dual Spaces

### Definition

The **dual space** $X^*$ of a normed space $X$ is:
$$X^* = \mathcal{B}(X, \mathbb{F}) = \{\varphi: X \to \mathbb{F} : \varphi \text{ bounded linear functional}\}$$

$X^*$ is always a Banach space (even if $X$ is not).

### Riesz Representation Theorem

**For Hilbert spaces:** Every $\varphi \in H^*$ has the form $\varphi(x) = \langle x, y \rangle$ for unique $y \in H$.

Moreover, $\|\varphi\| = \|y\|$.

**Consequence:** Hilbert spaces are "self-dual" via the map $y \mapsto \langle \cdot, y \rangle$.

### Examples of Dual Spaces

1. $(\mathbb{R}^n)^* \cong \mathbb{R}^n$
2. $(C[a,b])^* \cong M[a,b]$ (finite signed Borel measures)
3. $(\ell^p)^* \cong \ell^q$ where $\frac{1}{p} + \frac{1}{q} = 1$ for $1 < p < \infty$
4. $(\ell^1)^* \cong \ell^\infty$
5. $(L^p)^* \cong L^q$ where $\frac{1}{p} + \frac{1}{q} = 1$ for $1 < p < \infty$

**Special cases:**
- $(\ell^\infty)^*$ is strictly larger than $\ell^1$
- $c_0^* \cong \ell^1$ where $c_0 = \{(x_n) : x_n \to 0\}$

### Reflexive Spaces

$X$ is **reflexive** if the natural embedding $X \to X^{**}$ is surjective.

**Examples:**
- All Hilbert spaces are reflexive
- $\ell^p$ and $L^p$ are reflexive for $1 < p < \infty$
- $\ell^1$, $\ell^\infty$, $L^1$, $L^\infty$ are NOT reflexive
- $C[a,b]$ is NOT reflexive

---

## 7. Compact Operators

### Definition

$T: X \to Y$ is **compact** if it maps bounded sets to relatively compact sets (closure is compact).

**Equivalent:** $T$ maps bounded sequences to sequences with convergent subsequences.

### Examples

1. Finite rank operators: $T(x) = \sum_{i=1}^n \varphi_i(x) y_i$ for $\varphi_i \in X^*$, $y_i \in Y$
2. Integral operators with continuous kernel: $(Tf)(x) = \int_a^b K(x, y)f(y)\,dy$
3. Multiplication by sequence going to 0 in $\ell^2$: $T(x_1, x_2, \ldots) = (a_1 x_1, a_2 x_2, \ldots)$ where $a_n \to 0$

### Properties

- Compact operators form a closed subspace of $\mathcal{B}(X, Y)$
- Composition of compact with bounded is compact
- Finite rank operators are compact
- Compact operators are approximable by finite rank operators (in operator norm)

### Compact Operators on Hilbert Spaces

If $T: H \to H$ is compact and self-adjoint, then:
- $H$ has an orthonormal basis of eigenvectors of $T$
- Eigenvalues form a sequence converging to 0 (if $\dim H = \infty$)
- $T$ has at most countably many nonzero eigenvalues

This is the **spectral theorem for compact self-adjoint operators**.

---

## 8. Weak Convergence

### Definition

In a normed space $X$:
- $x_n \to x$ **strongly** (or in norm) if $\|x_n - x\| \to 0$
- $x_n \to x$ **weakly** if $\varphi(x_n) \to \varphi(x)$ for all $\varphi \in X^*$

**Notation:** $x_n \rightharpoonup x$ for weak convergence.

$$\boxed{\text{Strong convergence} \Rightarrow \text{Weak convergence}}$$

**But NOT vice versa in infinite dimensions!**

### Example

In $\ell^2$, let $e_n = (0, \ldots, 0, 1, 0, \ldots)$ (1 in $n$-th position).

- $e_n \rightharpoonup 0$ weakly: for any $\varphi \in (\ell^2)^*$, $\varphi(e_n) \to 0$
- But $\|e_n\| = 1$ for all $n$, so $e_n \not\to 0$ strongly

### Properties

- Weakly convergent sequences are bounded
- In Hilbert spaces: $x_n \rightharpoonup x$ iff $\langle x_n, y \rangle \to \langle x, y \rangle$ for all $y \in H$
- Weak limit is unique
- In finite dimensions: weak and strong convergence are equivalent

### Weak* Convergence

In the dual space $X^*$:
- $\varphi_n \to \varphi$ **weak*** if $\varphi_n(x) \to \varphi(x)$ for all $x \in X$

**Banach-Alaoglu Theorem:** The closed unit ball in $X^*$ is weak* compact.

---

## 9. Spectral Theory (Brief)

### Spectrum

For $T: X \to X$ bounded linear operator on Banach space:

**Spectrum:** $\sigma(T) = \{\lambda \in \mathbb{C} : T - \lambda I \text{ not invertible}\}$

**Resolvent set:** $\rho(T) = \mathbb{C} \setminus \sigma(T)$

**Point spectrum (eigenvalues):** $\sigma_p(T) = \{\lambda : \exists v \neq 0, Tv = \lambda v\}$

**Properties:**
- $\sigma(T)$ is always compact and nonempty (in complex Banach spaces)
- $\sigma(T) \subseteq \{\lambda : |\lambda| \leq \|T\|\}$
- For self-adjoint $T$ on Hilbert space: $\sigma(T) \subseteq \mathbb{R}$

### Spectral Radius

$$r(T) = \sup\{|\lambda| : \lambda \in \sigma(T)\}$$

**Spectral radius formula:**
$$r(T) = \lim_{n \to \infty} \|T^n\|^{1/n}$$

**Key fact:** $r(T) \leq \|T\|$ always, with equality for self-adjoint operators on Hilbert spaces.

---

## 10. Key Traps for AI Models

### Banach Space Errors
1. ✗ Claiming all normed spaces are complete
2. ✗ Assuming $C[a,b]$ with $\|\cdot\|_1$ is Banach (it's NOT)
3. ✗ Confusing convergence in different norms on same space

### Bounded Operator Errors
4. ✗ Claiming linear implies continuous in infinite dimensions (need boundedness!)
5. ✗ Assuming continuity at one point implies boundedness for linear operators (need continuity + linearity)
6. ✗ Forgetting $\|ST\| \leq \|S\|\|T\|$ (submultiplicativity)

### Fundamental Theorem Errors
7. ✗ Applying Uniform Boundedness Principle when domain is not Banach
8. ✗ Using Open Mapping Theorem when spaces not complete
9. ✗ Claiming Bounded Inverse Theorem works for non-surjective operators

### Hilbert Space Errors
10. ✗ Assuming all normed spaces are inner product spaces
11. ✗ Forgetting conjugate in complex inner product: $\langle x, y \rangle = \overline{\langle y, x \rangle}$
12. ✗ Claiming orthogonal projection exists on non-closed subspace

### Dual Space Errors
13. ✗ Claiming $(\ell^\infty)^* = \ell^1$ (it's strictly larger)
14. ✗ Assuming all Banach spaces are reflexive
15. ✗ Misapplying Riesz Representation to non-Hilbert spaces

### Compact Operator Errors
16. ✗ Assuming all bounded operators are compact (only in finite dimensions)
17. ✗ Claiming identity operator is compact in infinite dimensions (FALSE!)
18. ✗ Forgetting that compact + invertible implies finite dimensional

### Weak Convergence Errors
19. ✗ Assuming weak convergence implies strong convergence
20. ✗ Claiming weakly convergent sequences are convergent in norm
21. ✗ Confusing weak and weak* convergence

### Spectral Theory Errors
22. ✗ Assuming spectrum consists only of eigenvalues (only true for compact operators)
23. ✗ Claiming $r(T) = \|T\|$ always (only for self-adjoint)
24. ✗ Assuming spectrum is always discrete

---

## 11. Template Problems

### Problem 1: Completeness Trap

**Problem:** Is $C[0,1]$ with $\|f\|_1 = \int_0^1 |f(x)|\,dx$ a Banach space?

**Answer:** **No!**

**Proof:** Consider $f_n(x) = \begin{cases} 0 & 0 \leq x \leq 1/2 - 1/n \\ n(x - 1/2 + 1/n) & 1/2 - 1/n \leq x \leq 1/2 \\ 1 & 1/2 \leq x \leq 1 \end{cases}$

- $(f_n)$ is Cauchy in $\|\cdot\|_1$ norm
- But limit would be discontinuous step function $f(x) = \begin{cases} 0 & x < 1/2 \\ 1 & x \geq 1/2 \end{cases}$
- So $(f_n)$ has no limit in $C[0,1]$

**Conclusion:** Not complete, so not Banach.

### Problem 2: Uniform Boundedness Application

**Problem:** Let $X$ be Banach, $(x_n)$ a sequence in $X$, and suppose $|\varphi(x_n)| \leq M$ for all $\varphi \in X^*$ with $\|\varphi\| \leq 1$. Show $(x_n)$ is bounded in $X$.

**Solution:** For each $\varphi \in X^*$ with $\|\varphi\| \leq 1$:
$$\sup_n |\varphi(x_n)| \leq M < \infty$$

Define $T_n: X^* \to \mathbb{F}$ by $T_n(\varphi) = \varphi(x_n)$.

- Each $T_n$ is bounded: $|T_n(\varphi)| = |\varphi(x_n)| \leq \|\varphi\| \|x_n\|$, so $\|T_n\| \leq \|x_n\|$
- Pointwise bounded: $\sup_n |T_n(\varphi)| \leq M$ for all $\|\varphi\| \leq 1$
- By Uniform Boundedness Principle: $\sup_n \|T_n\| < \infty$
- Therefore $\sup_n \|x_n\| < \infty$

### Problem 3: Weak vs. Strong Convergence

**Problem:** In $\ell^2$, does $e_n = (0, \ldots, 0, 1, 0, \ldots)$ converge to 0?

**Answer:** Depends on convergence type!

- **Weakly:** Yes. For any $y = (y_1, y_2, \ldots) \in \ell^2$, $\langle e_n, y \rangle = y_n \to 0$.
- **Strongly:** No. $\|e_n - 0\| = \|e_n\| = 1$ for all $n$.

**Lesson:** Weak convergence ≠ strong convergence in infinite dimensions.

---

## 12. RLHF Evaluation Strategy

When evaluating AI-generated functional analysis proofs:

1. **Check completeness claims:** Is the space actually Banach? Verify norm and completeness separately.

2. **Verify operator boundedness:** Is linearity + continuity established? Or linearity + boundedness?

3. **Watch for fundamental theorem conditions:** Are Banach hypotheses verified before applying UBP, OMT, or HBT?

4. **Check dual space identifications:** Are the correct conjugate exponents used? Is reflexivity claimed correctly?

5. **Verify inner product existence:** Does the norm satisfy parallelogram law?

6. **Look for weak/strong confusion:** Are convergence modes properly distinguished?

7. **Check compactness claims:** Is the operator actually compact? (Identity is not in infinite dimensions!)

8. **Verify spectral theory claims:** Is the spectrum computed correctly? Are eigenvalues vs. spectrum distinguished?

---

**End of Functional Analysis Reference Document**
