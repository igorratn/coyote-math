# Real Analysis — Complete Reference for RLHF Evaluation

## 1. Sequences and Series

### Convergence of Sequences

A sequence $(a_n)$ **converges** to $L$ if:
$$\forall \varepsilon > 0, \exists N \in \mathbb{N} : n > N \implies |a_n - L| < \varepsilon$$

**Notation:** $\lim_{n \to \infty} a_n = L$ or $a_n \to L$.

### Properties of Limits

- **Uniqueness:** Limits are unique (if they exist)
- **Algebra of limits:** If $a_n \to L$ and $b_n \to M$:
  - $a_n + b_n \to L + M$
  - $a_n \cdot b_n \to L \cdot M$
  - $a_n / b_n \to L/M$ (if $M \neq 0$ and $b_n \neq 0$ eventually)
- **Squeeze theorem:** If $a_n \leq b_n \leq c_n$ and $a_n, c_n \to L$, then $b_n \to L$

### Cauchy Sequences

$(a_n)$ is **Cauchy** if:
$$\forall \varepsilon > 0, \exists N : m, n > N \implies |a_n - a_m| < \varepsilon$$

**Theorem:** $\mathbb{R}$ is complete: every Cauchy sequence converges.

### Monotone Convergence

**Monotone Convergence Theorem:** Every bounded monotone sequence converges.

- If $(a_n)$ is increasing and bounded above, then $a_n \to \sup\{a_n\}$
- If $(a_n)$ is decreasing and bounded below, then $a_n \to \inf\{a_n\}$

### Subsequences

**Bolzano-Weierstrass Theorem:** Every bounded sequence has a convergent subsequence.

**lim sup and lim inf:**
$$\limsup_{n \to \infty} a_n = \lim_{n \to \infty} \sup_{k \geq n} a_k$$
$$\liminf_{n \to \infty} a_n = \lim_{n \to \infty} \inf_{k \geq n} a_k$$

**Theorem:** $a_n \to L$ iff $\limsup a_n = \liminf a_n = L$.

---

## 2. Series

### Convergence of Series

The series $\sum_{n=1}^\infty a_n$ **converges** if the sequence of partial sums $S_N = \sum_{n=1}^N a_n$ converges.

### Necessary Condition

**Theorem:** If $\sum a_n$ converges, then $a_n \to 0$.

**Contrapositive:** If $a_n \not\to 0$, then $\sum a_n$ diverges (divergence test).

**Warning:** $a_n \to 0$ does NOT imply $\sum a_n$ converges (e.g., harmonic series).

### Comparison Tests

**Direct Comparison:** If $0 \leq a_n \leq b_n$ for all $n$:
- $\sum b_n$ converges $\Rightarrow$ $\sum a_n$ converges
- $\sum a_n$ diverges $\Rightarrow$ $\sum b_n$ diverges

**Limit Comparison:** If $a_n, b_n > 0$ and $\lim_{n \to \infty} \frac{a_n}{b_n} = L \in (0, \infty)$:
- $\sum a_n$ and $\sum b_n$ either both converge or both diverge

### Ratio and Root Tests

**Ratio Test:** Let $L = \lim_{n \to \infty} \left|\frac{a_{n+1}}{a_n}\right|$.
- $L < 1 \Rightarrow$ series converges absolutely
- $L > 1 \Rightarrow$ series diverges
- $L = 1 \Rightarrow$ test inconclusive

**Root Test:** Let $L = \lim_{n \to \infty} \sqrt[n]{|a_n|}$.
- $L < 1 \Rightarrow$ series converges absolutely
- $L > 1 \Rightarrow$ series diverges
- $L = 1 \Rightarrow$ test inconclusive

### Absolute vs. Conditional Convergence

- $\sum a_n$ converges **absolutely** if $\sum |a_n|$ converges
- $\sum a_n$ converges **conditionally** if $\sum a_n$ converges but $\sum |a_n|$ diverges

$$\boxed{\text{Absolute convergence} \Rightarrow \text{Convergence}}$$

**But NOT vice versa!**

**Example:** $\sum_{n=1}^\infty \frac{(-1)^n}{n}$ converges conditionally.

### Alternating Series Test

If $(a_n)$ is decreasing with $a_n \to 0$, then $\sum_{n=1}^\infty (-1)^n a_n$ converges.

### Rearrangements

**Riemann Rearrangement Theorem:** If $\sum a_n$ converges conditionally, then for any $L \in \mathbb{R} \cup \{\pm\infty\}$, there exists a rearrangement that converges to $L$ (or diverges to $\pm\infty$).

**But:** If $\sum a_n$ converges absolutely, then every rearrangement converges to the same sum.

---

## 3. Continuity

### Definition

$f: D \to \mathbb{R}$ is **continuous at $c \in D$** if:
$$\forall \varepsilon > 0, \exists \delta > 0 : |x - c| < \delta \implies |f(x) - f(c)| < \varepsilon$$

**Sequential characterization:** $f$ is continuous at $c$ iff for every sequence $x_n \to c$, we have $f(x_n) \to f(c)$.

### Properties

- **Algebra:** Sums, products, quotients, compositions of continuous functions are continuous
- **Extreme Value Theorem:** If $f: [a,b] \to \mathbb{R}$ is continuous, then $f$ attains its maximum and minimum
- **Intermediate Value Theorem:** If $f: [a,b] \to \mathbb{R}$ is continuous and $f(a) < y < f(b)$, then there exists $c \in (a,b)$ with $f(c) = y$

### Uniform Continuity

$f: D \to \mathbb{R}$ is **uniformly continuous** if:
$$\forall \varepsilon > 0, \exists \delta > 0 : \forall x, y \in D, |x - y| < \delta \implies |f(x) - f(y)| < \varepsilon$$

**Key difference from continuity:** $\delta$ depends only on $\varepsilon$, not on the point.

**Theorem:** If $f: [a,b] \to \mathbb{R}$ is continuous, then $f$ is uniformly continuous.

**Counterexample on unbounded domain:** $f(x) = x^2$ on $\mathbb{R}$ is continuous but not uniformly continuous.

---

## 4. Differentiation

### Definition

$f$ is **differentiable at $c$** if the limit exists:
$$f'(c) = \lim_{h \to 0} \frac{f(c+h) - f(c)}{h}$$

**Theorem:** Differentiable $\Rightarrow$ Continuous (but NOT vice versa).

**Counterexample:** $f(x) = |x|$ is continuous at $0$ but not differentiable.

### Mean Value Theorem (MVT)

If $f: [a,b] \to \mathbb{R}$ is continuous on $[a,b]$ and differentiable on $(a,b)$, then there exists $c \in (a,b)$ such that:
$$f'(c) = \frac{f(b) - f(a)}{b - a}$$

**Rolle's Theorem:** Special case when $f(a) = f(b)$: there exists $c$ with $f'(c) = 0$.

### Applications of MVT

1. **Constant function criterion:** If $f'(x) = 0$ for all $x \in (a,b)$, then $f$ is constant on $[a,b]$
2. **Monotonicity:** 
   - $f' > 0$ on $(a,b) \Rightarrow f$ strictly increasing
   - $f' < 0$ on $(a,b) \Rightarrow f$ strictly decreasing
3. **Lipschitz continuity:** If $|f'(x)| \leq M$ on $(a,b)$, then $|f(x) - f(y)| \leq M|x - y|$

### L'Hôpital's Rule

If $\lim_{x \to c} f(x) = \lim_{x \to c} g(x) = 0$ (or both $\pm\infty$) and $\lim_{x \to c} \frac{f'(x)}{g'(x)}$ exists, then:
$$\lim_{x \to c} \frac{f(x)}{g(x)} = \lim_{x \to c} \frac{f'(x)}{g'(x)}$$

**Common mistake:** Applying when conditions aren't met (e.g., not $0/0$ or $\infty/\infty$ form).

### Taylor's Theorem

If $f$ is $n+1$ times differentiable on an interval containing $a$ and $x$:
$$f(x) = \sum_{k=0}^n \frac{f^{(k)}(a)}{k!}(x-a)^k + R_n(x)$$

where the remainder satisfies (Lagrange form):
$$R_n(x) = \frac{f^{(n+1)}(c)}{(n+1)!}(x-a)^{n+1}$$
for some $c$ between $a$ and $x$.

---

## 5. Riemann Integration

### Definition

$f: [a,b] \to \mathbb{R}$ is **Riemann integrable** if upper and lower Riemann sums converge to the same value:
$$\underline{\int_a^b} f = \overline{\int_a^b} f$$

**Notation:** $\int_a^b f(x)\,dx$ or $\int_a^b f$.

### Riemann Integrability Criteria

**Theorem:** The following are equivalent:
1. $f$ is Riemann integrable on $[a,b]$
2. $f$ is bounded and the set of discontinuities has measure zero
3. For every $\varepsilon > 0$, there exists a partition with upper sum - lower sum $< \varepsilon$

**Consequences:**
- Continuous functions are integrable
- Monotone functions are integrable
- Functions with finitely many discontinuities are integrable

### Properties of the Integral

- **Linearity:** $\int (af + bg) = a\int f + b\int g$
- **Monotonicity:** If $f \leq g$, then $\int_a^b f \leq \int_a^b g$
- **Additivity:** $\int_a^b f + \int_b^c f = \int_a^c f$
- **Triangle inequality:** $\left|\int_a^b f\right| \leq \int_a^b |f|$

### Fundamental Theorem of Calculus (FTC)

**Part 1:** If $f$ is integrable on $[a,b]$ and $F(x) = \int_a^x f(t)\,dt$, then:
- $F$ is continuous on $[a,b]$
- If $f$ is continuous at $c \in (a,b)$, then $F'(c) = f(c)$

**Part 2:** If $F$ is differentiable with $F' = f$ continuous on $[a,b]$, then:
$$\int_a^b f(x)\,dx = F(b) - F(a)$$

### Integration by Parts

$$\int_a^b u\,dv = [uv]_a^b - \int_a^b v\,du$$

### Substitution Rule

If $g: [c,d] \to [a,b]$ is continuously differentiable with $g(c) = a$, $g(d) = b$:
$$\int_a^b f(x)\,dx = \int_c^d f(g(t))g'(t)\,dt$$

---

## 6. Sequences and Series of Functions

### Pointwise Convergence

$(f_n)$ converges **pointwise** to $f$ on $E$ if:
$$\forall x \in E, \forall \varepsilon > 0, \exists N : n > N \implies |f_n(x) - f(x)| < \varepsilon$$

**Note:** $N$ can depend on both $\varepsilon$ and $x$.

### Uniform Convergence

$(f_n)$ converges **uniformly** to $f$ on $E$ if:
$$\forall \varepsilon > 0, \exists N : \forall x \in E, n > N \implies |f_n(x) - f(x)| < \varepsilon$$

**Key difference:** $N$ depends only on $\varepsilon$, not on $x$.

**Equivalent:** $\sup_{x \in E} |f_n(x) - f(x)| \to 0$.

$$\boxed{\text{Uniform convergence} \Rightarrow \text{Pointwise convergence}}$$

**But NOT vice versa!**

### Why Uniform Convergence Matters

**Theorem 1 (Continuity):** If $f_n$ are continuous and $f_n \to f$ uniformly, then $f$ is continuous.

**Counterexample for pointwise:** $f_n(x) = x^n$ on $[0,1]$ converges pointwise to discontinuous function.

**Theorem 2 (Integration):** If $f_n$ are integrable on $[a,b]$ and $f_n \to f$ uniformly, then:
$$\lim_{n \to \infty} \int_a^b f_n = \int_a^b f$$

**Theorem 3 (Differentiation - requires more):** If $f_n$ are differentiable, $f_n \to f$ pointwise, and $f_n' \to g$ uniformly, then $f$ is differentiable with $f' = g$.

### Weierstrass M-Test

If $|f_n(x)| \leq M_n$ for all $x \in E$ and $\sum M_n < \infty$, then $\sum f_n$ converges uniformly on $E$.

### Power Series

A power series $\sum_{n=0}^\infty a_n(x - c)^n$ has a **radius of convergence** $R$ where:
$$\frac{1}{R} = \limsup_{n \to \infty} \sqrt[n]{|a_n|}$$

**Behavior:**
- Converges absolutely for $|x - c| < R$
- Diverges for $|x - c| > R$
- May converge or diverge at $|x - c| = R$ (must check endpoints)

**Theorem:** Power series converge uniformly on $[c - r, c + r]$ for any $r < R$.

**Consequence:** Within radius of convergence, power series are:
- Continuous
- Differentiable (term-by-term)
- Integrable (term-by-term)

---

## 7. Metric Spaces (Brief Introduction)

### Definition

A **metric space** $(X, d)$ is a set $X$ with a distance function $d: X \times X \to [0, \infty)$ satisfying:
1. $d(x, y) = 0 \iff x = y$
2. $d(x, y) = d(y, x)$ (symmetry)
3. $d(x, z) \leq d(x, y) + d(y, z)$ (triangle inequality)

### Open and Closed Sets

- **Open ball:** $B_r(x) = \{y \in X : d(x, y) < r\}$
- $U \subseteq X$ is **open** if for every $x \in U$, there exists $r > 0$ with $B_r(x) \subseteq U$
- $F \subseteq X$ is **closed** if $X \setminus F$ is open

**Properties:**
- Arbitrary unions of open sets are open
- Finite intersections of open sets are open
- Arbitrary intersections of closed sets are closed
- Finite unions of closed sets are closed

### Compactness

$K \subseteq X$ is **compact** if every open cover has a finite subcover.

**Heine-Borel Theorem:** In $\mathbb{R}^n$, $K$ is compact iff $K$ is closed and bounded.

**Properties of compact sets:**
- Closed subsets of compact sets are compact
- Continuous images of compact sets are compact
- Continuous functions on compact sets are bounded and attain their bounds

---

## 8. Key Inequalities

### Triangle Inequality

$$|a + b| \leq |a| + |b|$$

**Reverse triangle inequality:** $||a| - |b|| \leq |a - b|$

### Bernoulli's Inequality

For $x \geq -1$ and $n \in \mathbb{N}$:
$$(1 + x)^n \geq 1 + nx$$

### AM-GM Inequality

For non-negative $a_1, \ldots, a_n$:
$$\frac{a_1 + \cdots + a_n}{n} \geq \sqrt[n]{a_1 \cdots a_n}$$

Equality holds iff all $a_i$ are equal.

### Cauchy-Schwarz Inequality (for sums)

$$\left(\sum_{i=1}^n a_i b_i\right)^2 \leq \left(\sum_{i=1}^n a_i^2\right)\left(\sum_{i=1}^n b_i^2\right)$$

---

## 9. Key Traps for AI Models

### Convergence Errors
1. ✗ Confusing pointwise and uniform convergence
2. ✗ Assuming $a_n \to 0$ implies $\sum a_n$ converges
3. ✗ Claiming convergence implies absolute convergence
4. ✗ Applying ratio/root test when $L = 1$ (inconclusive!)

### Continuity vs. Differentiability
5. ✗ Assuming continuous implies differentiable
6. ✗ Claiming differentiable doesn't imply continuous

### MVT Errors
7. ✗ Applying MVT when function not continuous on $[a,b]$ or not differentiable on $(a,b)$
8. ✗ Claiming $c$ is unique (it may not be)

### Integration Errors
9. ✗ Assuming all bounded functions are Riemann integrable
10. ✗ Interchanging limit and integral without uniform convergence
11. ✗ Misapplying FTC when function not continuous

### L'Hôpital Errors
12. ✗ Applying L'Hôpital when not in indeterminate form
13. ✗ Applying repeatedly without checking conditions each time
14. ✗ Claiming if $\lim f'/g'$ doesn't exist, then $\lim f/g$ doesn't exist (FALSE!)

### Uniform Convergence Errors
15. ✗ Claiming pointwise convergence preserves continuity
16. ✗ Assuming differentiability is preserved by pointwise convergence
17. ✗ Forgetting to verify uniform convergence when interchanging operations

### Series Convergence Tests
18. ✗ Using comparison test with wrong inequality direction
19. ✗ Applying limit comparison when limit is 0 or $\infty$ (need careful handling)
20. ✗ Claiming alternating series converges just because terms decrease (need $a_n \to 0$ too)

### Compactness Errors
21. ✗ Assuming closed and bounded in metric spaces implies compact (only true in $\mathbb{R}^n$)
22. ✗ Confusing compact with closed or bounded individually

### Taylor Series Errors
23. ✗ Assuming Taylor series converges to the function (need to show remainder $\to 0$)
24. ✗ Using wrong form of remainder

---

## 10. Template Problems

### Problem 1: Pointwise vs. Uniform Convergence

**Problem:** Let $f_n(x) = \frac{nx}{1 + nx^2}$ on $[0, 1]$. Does $f_n$ converge uniformly?

**Solution:**
- **Pointwise limit:** For $x = 0$, $f_n(0) = 0$. For $x > 0$, $f_n(x) = \frac{n}{1/x + nx} \to \frac{1}{x}$ as $n \to \infty$.
- So $f_n \to f$ pointwise where $f(x) = \begin{cases} 0 & x = 0 \\ 1/x & x > 0 \end{cases}$

**Uniform convergence?** No! Because:
- Each $f_n$ is continuous
- The limit $f$ is unbounded (discontinuous at 0)
- By continuity preservation theorem, cannot have uniform convergence

**Alternative check:** $\sup_{x \in [0,1]} |f_n(x) - f(x)|$ does not go to 0.

### Problem 2: Conditional Convergence

**Problem:** Does $\sum_{n=1}^\infty \frac{(-1)^n}{n}$ converge? Absolutely?

**Solution:**
- **Convergence:** By alternating series test (terms decrease to 0), series converges ✓
- **Absolute convergence:** $\sum \frac{1}{n}$ is the harmonic series, which diverges ✗

**Conclusion:** Series converges **conditionally**.

**Consequence:** By Riemann rearrangement, can rearrange to converge to any real number!

### Problem 3: MVT Application Trap

**Problem:** Let $f(x) = |x|$ on $[-1, 1]$. Does MVT guarantee existence of $c \in (-1, 1)$ with $f'(c) = \frac{f(1) - f(-1)}{2}$?

**Answer:** **No!** MVT requires differentiability on $(a, b)$, but $f$ is not differentiable at $0$.

---

## 11. RLHF Evaluation Strategy

When evaluating AI-generated real analysis proofs:

1. **Check convergence mode:** Is it pointwise or uniform? Does the conclusion require uniform?

2. **Verify series convergence test conditions:** Are hypotheses of ratio/root/comparison test met?

3. **Watch for continuity → differentiability error:** This is a one-way implication only.

4. **Check MVT/FTC prerequisites:** Are continuity and differentiability conditions verified?

5. **Verify uniform convergence claims:** Is $\sup$ norm used correctly? Is pointwise → uniform claimed?

6. **Look for limit interchange:** When limits are swapped, is uniform convergence or DCT invoked?

7. **Check absolute vs. conditional convergence:** Are these distinguished properly?

8. **Verify L'Hôpital conditions:** Is the form indeterminate? Are derivatives checked to exist?

---

**End of Real Analysis Reference Document**
