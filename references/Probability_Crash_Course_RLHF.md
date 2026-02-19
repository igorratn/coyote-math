# Probability Theory — Complete Reference for RLHF Evaluation

## 1. Modes of Convergence

There are four main ways a sequence of random variables $X_n$ can converge to $X$:

### Definitions

- **Almost sure (a.s.):** $P(\{\omega : X_n(\omega) \to X(\omega)\}) = 1$
  - **Meaning:** For almost every outcome $\omega$, the numerical sequence $X_1(\omega), X_2(\omega), X_3(\omega), \ldots$ converges to $X(\omega)$
  - **Pathwise convergence:** Individual sample paths stabilize at the limit
  - **Strongest pointwise notion**

- **In probability:** For every $\varepsilon > 0$, $P(|X_n - X| > \varepsilon) \to 0$
  - **Meaning:** The probability that $X_n$ deviates from $X$ by more than $\varepsilon$ vanishes
  - **Cross-sectional:** At each time $n$, bad outcomes become rare
  - **Does NOT require individual paths to converge**

- **In $L^p$:** $E[|X_n - X|^p] \to 0$
  - **Meaning:** The $p$-th moment of the difference vanishes
  - **Convergence of moments**

- **In distribution:** $P(X_n \leq x) \to P(X \leq x)$ at continuity points of $F_X$
  - **Meaning:** CDFs converge pointwise
  - **Weakest mode:** doesn't require $X_n$ and $X$ to be close on same probability space

### Hierarchy

$$\boxed{L^p \Rightarrow \text{in probability} \Rightarrow \text{in distribution}}$$

$$\boxed{\text{a.s.} \Rightarrow \text{in probability} \Rightarrow \text{in distribution}}$$

**Critical non-implications:**
- a.s. does NOT imply $L^p$
- $L^p$ does NOT imply a.s.

### Key Distinction: a.s. vs. in probability

**Order of quantifiers (the crucial difference):**

- **Almost sure:** $P\left(\omega : \lim_{n \to \infty} X_n(\omega) = X(\omega)\right) = 1$
  - Probability **outside** the limit
  - Fix $\omega$, then take $\lim_{n \to \infty}$

- **In probability:** $\lim_{n \to \infty} P(|X_n - X| > \varepsilon) = 0$
  - Probability **inside** the limit
  - Fix $n$, compute probability, then take $\lim_{n \to \infty}$

**Counterexample (convergence in probability but NOT a.s.):**

The "moving bump" sequence on $[0,1]$:
- Round 1: $X_1 = \mathbf{1}_{[0,1]}$
- Round 2: $X_2 = \mathbf{1}_{[0,1/2]}$, $X_3 = \mathbf{1}_{[1/2,1]}$
- Round 3: $X_4 = \mathbf{1}_{[0,1/3]}$, $X_5 = \mathbf{1}_{[1/3,2/3]}$, $X_6 = \mathbf{1}_{[2/3,1]}$
- Continue: partition into $k$ pieces in round $k$

**Result:** $X_n \to 0$ in probability (each bump has shrinking width), but for every $\omega \in [0,1]$, the sequence $X_n(\omega)$ oscillates $0,1,0,1,\ldots$ infinitely often, so does NOT converge a.s.

---

## 2. Uniform Integrability (UI)

### Definition

A family $\{X_n\}$ is **uniformly integrable** if:
$$\sup_n E\big[|X_n| \mathbf{1}_{|X_n| > M}\big] \to 0 \quad \text{as } M \to \infty$$

**Intuition:** The tail probabilities are uniformly small across all $n$.

### Key Theorem (Vitali Convergence)

$$\boxed{X_n \to X \text{ in } L^1 \iff X_n \to X \text{ in probability AND } \{X_n\} \text{ is uniformly integrable}}$$

This is the probabilistic analogue of Vitali's convergence theorem from measure theory.

---

## 3. Convergence of Expectations

### The Fundamental Problem

$$\boxed{X_n \to X \text{ a.s. does NOT imply } E[X_n] \to E[X]}$$

**Classic counterexample:** $X_n = n \cdot \mathbf{1}_{[0, 1/n]}$ on $[0,1]$
- $X_n(\omega) \to 0$ for all $\omega > 0$ (a.s. convergence ✓)
- But $E[X_n] = n \cdot \frac{1}{n} = 1$ for all $n$ (does NOT converge to 0 ✗)

### When Can We Interchange Limit and Expectation?

You need one of these conditions:

1. **Dominated Convergence Theorem (DCT):**
   - $|X_n| \leq Y$ for all $n$ with $E[Y] < \infty$
   - Then $X_n \to X$ a.s. (or in probability) implies $E[X_n] \to E[X]$

2. **Uniform Integrability:**
   - $X_n \to X$ in probability AND $\{X_n\}$ uniformly integrable
   - Then $E[X_n] \to E[X]$

3. **Monotone Convergence Theorem (MCT):**
   - $0 \leq X_1 \leq X_2 \leq \cdots$ (non-negative, increasing)
   - $X_n \to X$ a.s.
   - Then $E[X_n] \uparrow E[X]$

---

## 4. Key Inequalities

- **Markov:** $P(|X| \geq a) \leq \dfrac{E[|X|]}{a}$

- **Chebyshev:** $P(|X - E[X]| \geq a) \leq \dfrac{\text{Var}(X)}{a^2}$

- **Jensen:** If $\varphi$ is convex, $\varphi(E[X]) \leq E[\varphi(X)]$

- **Hölder:** $E[|XY|] \leq \big(E[|X|^p]\big)^{1/p}\big(E[|Y|^q]\big)^{1/q}$ where $\dfrac{1}{p} + \dfrac{1}{q} = 1$

---

## 5. Law of Large Numbers (LLN)

### Setup

Let $X_1, X_2, X_3, \ldots$ be i.i.d. random variables with $E[X_i] = \mu$.

Define the **sample mean:** $\bar{X}_n = \dfrac{1}{n}\sum_{i=1}^n X_i$

### Strong Law (Kolmogorov's SLLN)

**Statement:** If $E[|X_1|] < \infty$, then:
$$\boxed{\bar{X}_n \to \mu \quad \text{almost surely}}$$

**Meaning:** For almost every outcome $\omega$, the running average $\bar{X}_n(\omega)$ converges to $\mu$.

### Weak Law (Khinchin's WLLN)

**Statement:** If $E[|X_1|] < \infty$, then:
$$\boxed{\bar{X}_n \to \mu \quad \text{in probability}}$$

**Meaning:** For every $\varepsilon > 0$, $P(|\bar{X}_n - \mu| > \varepsilon) \to 0$.

### Alternative WLLN (Chebyshev Proof)

**Statement:** If $E[X_1] = \mu$ and $\text{Var}(X_1) = \sigma^2 < \infty$, then $\bar{X}_n \to \mu$ in probability.

**Note:** The variance requirement is an **artifact of the Chebyshev proof method**, not a necessity for the theorem itself.

### Why Strong is Stronger

- **Minimal conditions are the same:** Both require only $E[|X_1|] < \infty$ for i.i.d. sequences
- **Stronger conclusion:** a.s. convergence $\Rightarrow$ convergence in probability (but not vice versa)
- **More information:** Tells you individual sample paths converge, not just that probabilities vanish
- **Harder to prove:** Requires sophisticated tools (Borel-Cantelli, martingales, maximal inequalities)

### Proof Sketch of WLLN (Chebyshev)

$$\text{Var}(\bar{X}_n) = \text{Var}\left(\frac{1}{n}\sum_{i=1}^n X_i\right) = \frac{\sigma^2}{n}$$

By Chebyshev:
$$P(|\bar{X}_n - \mu| > \varepsilon) \leq \frac{\text{Var}(\bar{X}_n)}{\varepsilon^2} = \frac{\sigma^2}{n\varepsilon^2} \to 0$$

---

## 6. Central Limit Theorem (CLT)

**Statement:** If $X_1, X_2, \ldots$ are i.i.d. with $E[X_i] = \mu$ and $\text{Var}(X_i) = \sigma^2 < \infty$, then:
$$\boxed{\frac{\bar{X}_n - \mu}{\sigma/\sqrt{n}} \to N(0,1) \quad \text{in distribution}}$$

**Meaning:** The standardized sample mean converges to a standard normal distribution.

**What CLT adds beyond LLN:**
- LLN: $\bar{X}_n \approx \mu$ (point estimate)
- CLT: $\bar{X}_n \approx N\left(\mu, \frac{\sigma^2}{n}\right)$ (distributional approximation with quantified uncertainty)

---

## 7. Borel-Cantelli Lemmas

### Setup

Let $A_1, A_2, A_3, \ldots$ be a sequence of **events** (measurable sets).

**"Infinitely often" (i.o.):** 
$$A_n \text{ i.o.} = \limsup_{n \to \infty} A_n = \bigcap_{n=1}^\infty \bigcup_{k=n}^\infty A_k$$

**Meaning:** An outcome $\omega$ is in $\limsup A_n$ iff $\omega \in A_n$ for **infinitely many** values of $n$.

### First Borel-Cantelli Lemma (No Independence Needed)

**Statement:** If $\sum_{n=1}^\infty P(A_n) < \infty$, then:
$$\boxed{P(A_n \text{ i.o.}) = 0}$$

**In words:** If the sum of probabilities converges, then with probability 1, only **finitely many** of the events $A_n$ occur.

### Second Borel-Cantelli Lemma (Independence Required!)

**Statement:** If $A_n$ are **independent** and $\sum_{n=1}^\infty P(A_n) = \infty$, then:
$$\boxed{P(A_n \text{ i.o.}) = 1}$$

**In words:** If the events are independent and the sum of probabilities diverges, then with probability 1, **infinitely many** of the events $A_n$ occur.

### Mnemonics

- **"BC First: Convergent sum → finite occurrences (no independence needed)"**
- **"BC Second: Divergent sum + independence → infinite occurrences"**

### Critical Asymmetry

The independence requirement in the second lemma is **essential** and often forgotten by AI models!

**Counterexample:** Let $A_n = A$ for all $n$ with $P(A) = 1/2$.
- $\sum P(A_n) = \infty$ ✓
- But events are NOT independent (perfectly dependent)
- $P(A_n \text{ i.o.}) = P(A) = 1/2 \neq 1$ ✗

### Examples

**Example 1:** Coin flips with $A_n = \{\text{heads on flip } n\}$, $P(A_n) = 1/2$
- $\sum P(A_n) = \infty$ and events independent
- By Second BC: $P(\text{infinitely many heads}) = 1$ ✓

**Example 2:** Lottery with $A_n = \{\text{win on day } n\}$, $P(A_n) = 1/n^2$
- $\sum P(A_n) = \pi^2/6 < \infty$
- By First BC: $P(\text{win infinitely often}) = 0$ ✓

---

## 8. Conditional Expectation

### Definition

$E[X | \mathcal{F}]$ is the best $L^2$ approximation of $X$ given information $\mathcal{F}$ (a $\sigma$-algebra).

### Key Properties

- **Tower property:** $E[E[X|\mathcal{F}]] = E[X]$
- **If $X$ is $\mathcal{F}$-measurable:** $E[X|\mathcal{F}] = X$
- **If $X$ is independent of $\mathcal{F}$:** $E[X|\mathcal{F}] = E[X]$
- **Linearity:** $E[aX + bY|\mathcal{F}] = aE[X|\mathcal{F}] + bE[Y|\mathcal{F}]$
- **Taking out what's known:** If $Y$ is $\mathcal{F}$-measurable, $E[XY|\mathcal{F}] = Y \cdot E[X|\mathcal{F}]$

### Important: $E[X|Y]$ is a Function of $Y$, Not $X$

$E[X|Y]$ is a random variable that is a function of $Y$ (i.e., $\sigma(Y)$-measurable).

---

## 9. Martingales

### Definition

A sequence $(M_n, \mathcal{F}_n)$ is a **martingale** if:
1. $M_n$ is $\mathcal{F}_n$-measurable
2. $E[|M_n|] < \infty$
3. $E[M_{n+1}|\mathcal{F}_n] = M_n$

**Intuition:** A fair game — the expected future value equals the current value.

### Key Results

- **Martingale Convergence Theorem:** If $(M_n)$ is a martingale with $\sup_n E[|M_n|] < \infty$, then $M_n$ converges almost surely to some $M_\infty$ with $E[|M_\infty|] < \infty$.

- **Optional Stopping Theorem:** Under certain conditions (bounded stopping time, uniformly bounded increments, or $E[\tau] < \infty$ with bounded increments), $E[M_\tau] = E[M_0]$.

**Warning:** Optional stopping fails without proper conditions! Always verify:
- Is $\tau$ bounded?
- Are the increments bounded?
- Is $E[\tau] < \infty$ and some integrability condition met?

---

## 10. Template Problem: Testing Convergence Modes

**Problem:** Let $X_n = n^\alpha \cdot \mathbf{1}_{[0,1/n^\beta]}$ on $[0,1]$ with uniform measure, where $\alpha, \beta > 0$. Determine for which $(\alpha,\beta)$ we have:
- (a) $X_n \to 0$ a.s.
- (b) $X_n \to 0$ in $L^1$
- (c) $E[X_n] \to 0$

**Solution:**

**(a) Almost sure convergence:** For any $\omega > 0$, once $n > \omega^{-1/\beta}$, we have $\omega > 1/n^\beta$, so $X_n(\omega) = 0$.
$$\boxed{\text{Answer: ALL } \alpha, \beta > 0}$$

**(b) $L^1$ convergence:** 
$$E[X_n] = n^\alpha \cdot \frac{1}{n^\beta} = n^{\alpha - \beta}$$
This goes to 0 iff $\alpha < \beta$.
$$\boxed{\text{Answer: } \alpha < \beta}$$

**(c) Convergence of expectations:** Same as (b) since $X_n \geq 0$ and converges to 0.
$$\boxed{\text{Answer: } \alpha < \beta}$$

### Why This is the Perfect Stumble Problem

**The trap:** $X_n \to 0$ a.s. for ALL $\alpha, \beta > 0$, but $E[X_n] \to 0$ only when $\alpha < \beta$.

**Counterexample when $\alpha = \beta = 1$:**
- $X_n = n \cdot \mathbf{1}_{[0,1/n]}$
- $X_n \to 0$ a.s. ✓
- $E[X_n] = 1$ (constant, does NOT converge to 0) ✗

**Why interchange fails:**
- No integrable dominating function (DCT inapplicable)
- Family is NOT uniformly integrable when $\alpha \geq \beta$
- Monotone convergence doesn't apply (not monotone)

**Geometric intuition:**
- Height: $n^\alpha$ (grows)
- Width: $1/n^\beta$ (shrinks)
- Area: $n^{\alpha-\beta}$ (vanishes only if width shrinks faster than height grows)

---

## 11. Key Traps for AI Models

### Convergence Errors
1. ✗ Claiming a.s. $\Rightarrow$ $L^p$ or $L^p \Rightarrow$ a.s. (both FALSE)
2. ✗ Confusing convergence in probability with a.s. convergence
3. ✗ Assuming $X_n \to X$ a.s. implies $E[X_n] \to E[X]$ without verification

### Expectation Interchange Errors
4. ✗ Applying DCT without stating the dominating function $Y$ with $E[Y] < \infty$
5. ✗ Assuming pointwise convergence alone is enough to interchange limit and expectation

### Borel-Cantelli Errors
6. ✗ Using Second BC Lemma without verifying **independence** (most common trap!)
7. ✗ Confusing "infinitely often" with "eventually" (all $n \geq N$)

### Conditional Expectation Errors
8. ✗ Claiming $E[X|\mathcal{F}]$ is not $\mathcal{F}$-measurable
9. ✗ Treating $E[X|Y]$ as a function of $X$ instead of $Y$
10. ✗ Misapplying tower property (wrong order of conditioning)

### Martingale Errors
11. ✗ Applying optional stopping without checking conditions (bounded $\tau$, bounded increments, integrability)
12. ✗ Assuming $E[M_\tau] = E[M_0]$ for unbounded stopping times without verification

### LLN Errors
13. ✗ Claiming WLLN requires finite variance (confusing proof method with theorem statement)
14. ✗ Invoking CLT when variance is infinite

### General Pattern Matching Errors
15. ✗ "Pattern matching" to theorems without verifying hypotheses
16. ✗ Circular reasoning (using what needs to be proved as justification)

---

## 12. RLHF Evaluation Strategy

When evaluating AI-generated probability proofs:

1. **Check convergence mode carefully:** Is it claiming a.s., in probability, $L^1$, or in distribution? Are the implications correct?

2. **Verify interchange conditions:** If limit and expectation are swapped, is DCT, MCT, or UI explicitly invoked and verified?

3. **Watch for Borel-Cantelli:** If independence is needed, is it stated and justified?

4. **Check measurability:** Is $E[X|\mathcal{F}]$ correctly identified as $\mathcal{F}$-measurable?

5. **Verify martingale conditions:** For optional stopping, are the hypotheses explicitly checked?

6. **Look for the dominating function:** In DCT applications, is $Y$ with $E[Y] < \infty$ and $|X_n| \leq Y$ clearly identified?

7. **Test with counterexamples:** Would the argument break for $X_n = n \cdot \mathbf{1}_{[0,1/n]}$?

---

**End of Reference Document**