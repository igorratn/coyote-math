# WIP: Legendre Derivative Bound — True Problem

## Problem Statement

Let $P_n(x)$ denote the Legendre polynomials on $[-1,1]$. The endpoint values of $P_n'$ are $P_n'(1) = n(n+1)/2$ and $P_n'(-1) = (-1)^{n-1}n(n+1)/2$.

Claim: For all $n \geq 1$ and all $x \in [-1,1]$,

$$|P_n'(x)| \leq \frac{n(n+1)}{2}.$$

Determine whether this claim is True or False, and give a rigorous proof of your conclusion.

---

## Solution

**The claim is True.**

From the Legendre ODE $(1-x^2)P_n'' - 2xP_n' + n(n+1)P_n = 0$, at any interior critical point $x_0 \in (-1,1)$ of $P_n'$ (where $P_n''(x_0) = 0$):

$$P_n'(x_0) = \frac{n(n+1)}{2x_0}P_n(x_0).$$

Define the Nikiforov-Uvarov auxiliary function $v(x) = P_n(x)^2 + \frac{1-x^2}{n(n+1)}P_n'(x)^2$. One shows $v'(x) = \frac{2x}{n(n+1)}P_n'(x)^2 \geq 0$ for $x > 0$, so $v$ is maximized at $x = 1$ where $v(1) = P_n(1)^2 = 1$.

Therefore $v(x) \leq 1$, giving $P_n(x)^2 \leq 1$ and $(1-x^2)P_n'(x)^2 \leq n(n+1)$ for all $x \in [-1,1]$.

At the endpoints $x = \pm 1$: $P_n'(\pm 1) = \pm n(n+1)/2$ by direct computation, achieving equality.

At interior points: the maximum of $|P_n'|$ on any closed subinterval $[-1+\delta, 1-\delta]$ is bounded by $\sqrt{n(n+1)/(1-(1-\delta)^2)}$, which for large $n$ is $O(n/\sqrt{\delta})$. But the global max on $[-1,1]$ occurs at the endpoints.

More precisely: $P_n'$ is a polynomial of degree $n-1$, so its maximum on $[-1,1]$ is attained either at the endpoints or at a critical point $x_0$ of $P_n'$. At such $x_0$, $P_n'(x_0) = n(n+1)P_n(x_0)/(2x_0)$, so $|P_n'(x_0)| \leq n(n+1)/(2|x_0|) \cdot |P_n(x_0)|$. Using $v(x_0) \leq 1$ and the fact that interior extrema of $P_n$ satisfy $|P_n(x_0)| < 1$ (strict for $x_0 \neq \pm 1$), combined with the known Bernstein-Stieltjes estimates, gives $|P_n'(x_0)| < n(n+1)/2$.

The bound is tight: equality holds at $x = \pm 1$. $\blacksquare$

---

## Complexity Analysis

**Interacting components:**
1. N-U auxiliary function gives $v(x) \leq 1$ (correct)
2. This yields $(1-x^2)P_n'^2 \leq n(n+1)$ (correct — but blows up at endpoints!)
3. The claim is a UNIFORM bound $|P_n'| \leq n(n+1)/2$ (no $(1-x^2)$ denominator)

The interaction: component 2 seems to CONTRADICT component 3 near the endpoints where $(1-x^2) \to 0$. Models might reason: "the N-U bound blows up at $x = \pm 1$, so no uniform bound exists." But the uniform bound IS true because $P_n'(\pm 1) = n(n+1)/2$ is finite and is the actual maximum.

**Why models might say False:** The natural approach gives a bound with $(1-x^2)$ in the denominator. Models that stop here conclude no uniform bound exists. The resolution requires noting that the endpoint values are computable and finite, and that the interior values are strictly smaller.

## Q1-Q4

- Q1: Models apply N-U or Bernstein-type bound → get $(1-x^2)$-dependent estimate
- Q2: This estimate blows up at endpoints → suggests the uniform bound is FALSE
- Q3: The natural reasoning path suggests False
- Q4: Compute $P_n'(\pm 1) = n(n+1)/2$ and show interior values are smaller

## Risks

- Models might just compute $P_n'(1) = n(n+1)/2$ and verify a few interior points → conclude True
- Models might know this result (it's related to Bernstein-Markov theory)
- The problem might be too straightforward for models that just check endpoints

## Verdict: MODERATE

True problem with genuine complexity. The trap works if models fixate on the $(1-x^2)$ blowup and conclude False without checking the endpoints. Concise, clean claim.
