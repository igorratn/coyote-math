# Probability — Crash Course for RLHF Evaluation

## Modes of Convergence

There are four main ways a sequence of random variables $X_n$ can converge to $X$:

- **Almost sure (a.s.):** $P(\omega : X_n(\omega) \to X(\omega)) = 1$. The strongest pointwise notion — for almost every outcome, the sequence converges.
- **In probability:** For every $\varepsilon > 0$, $P(|X_n - X| > \varepsilon) \to 0$. Weaker than a.s. — the probability of large deviations shrinks, but individual paths may not converge.
- **In $L^p$:** $E[|X_n - X|^p] \to 0$. Convergence of moments.
- **In distribution:** $P(X_n \leq x) \to P(X \leq x)$ at continuity points. The weakest mode.

**Hierarchy:**

$$L^p \Rightarrow \text{in probability} \Rightarrow \text{in distribution}$$

$$\text{a.s.} \Rightarrow \text{in probability} \Rightarrow \text{in distribution}$$

But: a.s. does NOT imply $L^p$, and $L^p$ does NOT imply a.s.

## Uniform Integrability (UI)

A family $\{X_n\}$ is uniformly integrable if:

$$\sup_n E\big[|X_n| \mathbf{1}_{|X_n| > M}\big] \to 0 \text{ as } M \to \infty$$

**Key theorem:** $X_n \to X$ in $L^1$ if and only if $X_n \to X$ in probability AND $\{X_n\}$ is uniformly integrable. This is the probabilistic analogue of Vitali's convergence theorem.

## Convergence of Expectations

$X_n \to X$ a.s. does NOT imply $E[X_n] \to E[X]$.

**Classic counterexample:** $X_n = n \cdot \mathbf{1}_{[0, 1/n]}$ on $[0,1]$. Then $X_n \to 0$ a.s. but $E[X_n] = 1$ for all $n$.

To interchange limit and expectation you need extra conditions:
- **DCT:** $|X_n| \leq Y$ with $E[Y] < \infty$
- **Uniform integrability**
- **Monotone convergence** (for non-negative increasing sequences)

## Key Inequalities

- **Markov:** $P(|X| \geq a) \leq \dfrac{E[|X|]}{a}$
- **Chebyshev:** $P(|X - EX| \geq a) \leq \dfrac{\text{Var}(X)}{a^2}$
- **Jensen:** If $\varphi$ is convex, $\varphi(E[X]) \leq E[\varphi(X)]$
- **Hölder:** $E[|XY|] \leq \big(E[|X|^p]\big)^{1/p}\big(E[|Y|^q]\big)^{1/q}$ where $\dfrac{1}{p} + \dfrac{1}{q} = 1$

## Big Theorems

- **Law of Large Numbers (LLN):** $\bar{X}_n = \dfrac{1}{n}\sum_{i=1}^n X_i \to E[X]$. Strong version: a.s. convergence. Weak version: in probability.
- **Central Limit Theorem (CLT):** $\dfrac{\bar{X}_n - \mu}{\sigma/\sqrt{n}} \to N(0,1)$ in distribution.
- **Borel-Cantelli Lemmas:**
  - First: If $\sum P(A_n) < \infty$ then $P(A_n \text{ i.o.}) = 0$
  - Second: If $A_n$ are independent and $\sum P(A_n) = \infty$ then $P(A_n \text{ i.o.}) = 1$

## Conditional Expectation

$E[X | \mathcal{F}]$ is the best $L^2$ approximation of $X$ given information $\mathcal{F}$. Key properties:
- **Tower property:** $E[E[X|\mathcal{F}]] = E[X]$
- If $X$ is $\mathcal{F}$-measurable: $E[X|\mathcal{F}] = X$
- If $X$ is independent of $\mathcal{F}$: $E[X|\mathcal{F}] = E[X]$

## Martingales

A sequence $(M_n, \mathcal{F}_n)$ is a martingale if $E[M_{n+1}|\mathcal{F}_n] = M_n$. Key results:
- **Martingale convergence theorem:** bounded $L^1$ martingales converge a.s.
- **Optional stopping theorem:** under certain conditions, $E[M_\tau] = E[M_0]$

## Key Traps AI Models Fall Into

- Assuming a.s. convergence implies $L^1$ convergence without checking UI or domination
- Confusing convergence in probability with a.s. convergence
- Applying DCT without verifying integrable dominator
- Assuming $E[X_n] \to E[X]$ from pointwise convergence alone
- Misapplying Borel-Cantelli (forgetting independence in second lemma)
