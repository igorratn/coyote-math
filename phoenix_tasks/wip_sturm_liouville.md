# WIP: Sturm-Liouville Second-Order Perturbation Problem

## Status: DRAFT — needs testing on Phoenix

## Problem Statement

Consider the Sturm-Liouville eigenvalue problem

$$-y'' = \lambda\,y, \qquad y(0) = 0,\quad y'(\pi) + \alpha\,y(\pi) = 0,$$

with real parameter $\alpha$. When $\alpha = 0$, the boundary condition at $x = \pi$ reduces to the Neumann condition $y'(\pi) = 0$, and the eigenvalues are $\lambda_n^{(0)} = (n + \tfrac{1}{2})^2$ for $n = 0, 1, 2, \ldots$ with eigenfunctions $\phi_n(x) = \sin\!\bigl((n+\tfrac{1}{2})x\bigr)$.

Treating $\alpha$ as a small perturbation, standard Sturm-Liouville perturbation theory yields the first-order correction

$$\lambda_n(\alpha) = \lambda_n^{(0)} + \alpha\,\frac{\phi_n(\pi)^2}{\|\phi_n\|^2} + O(\alpha^2).$$

Since $\phi_n(\pi) = \sin\!\bigl((n+\tfrac{1}{2})\pi\bigr) = (-1)^n$ and $\|\phi_n\|^2 = \int_0^{\pi}\sin^2\!\bigl((n+\tfrac{1}{2})x\bigr)\,dx = \frac{\pi}{2}$, the first-order sensitivity is

$$\frac{d\lambda_n}{d\alpha}\bigg|_{\alpha=0} = \frac{2}{\pi}$$

uniformly in $n$. That is, all eigenvalues shift at the same rate to first order.

The second-order perturbation formula involves the sum over all other eigenstates:

$$\frac{d^2\lambda_n}{d\alpha^2}\bigg|_{\alpha=0} = -2\sum_{\substack{m=0 \\ m \neq n}}^{\infty} \frac{\phi_m(\pi)^2\,\phi_n(\pi)^2}{\|\phi_m\|^2\,\|\phi_n\|^2\,\bigl(\lambda_m^{(0)} - \lambda_n^{(0)}\bigr)} = -\frac{8}{\pi^2}\sum_{\substack{m=0 \\ m \neq n}}^{\infty} \frac{1}{(m+\tfrac{1}{2})^2 - (n+\tfrac{1}{2})^2}.$$

Decomposing via partial fractions and grouping terms:

$$\sum_{\substack{m=0 \\ m \neq n}}^{\infty} \frac{1}{(m+\tfrac{1}{2})^2 - (n+\tfrac{1}{2})^2} = \frac{1}{2n+1}\sum_{\substack{m=0 \\ m \neq n}}^{\infty}\left(\frac{1}{m-n} + \frac{1}{m+n+1}\right).$$

Setting $j = m - n$ in the first sub-sum produces terms $\sum_{j \neq 0} 1/j$, which cancel in symmetric pairs ($j$ and $-j$ for $j \geq 1$, accounting for the semi-infinite range $m \geq 0$), while the second sub-sum contributes a convergent tail.

Claim: The symmetric cancellation in the partial-fraction decomposition yields

$$\frac{d^2\lambda_n}{d\alpha^2}\bigg|_{\alpha=0} = 0$$

for all $n \geq 0$. That is, the eigenvalue expansion in $\alpha$ has no quadratic term, and $\lambda_n(\alpha) = (n + \tfrac{1}{2})^2 + \frac{2\alpha}{\pi} + O(\alpha^3)$.

Determine whether this claim is True or False, and give a rigorous proof of your conclusion.

---

## Solution (for internal reference)

**The claim is False.**

The correct value of $d^2\lambda_n/d\alpha^2|_{\alpha=0}$ is $-2/(\pi^2(n+1/2)^2)$, not 0.

**Method: Implicit differentiation of the eigenvalue equation.**

The eigenvalues $\lambda_n(\alpha)$ satisfy the transcendental equation

$$f(\lambda, \alpha) = \sqrt{\lambda}\cos(\sqrt{\lambda}\pi) + \alpha\sin(\sqrt{\lambda}\pi) = 0.$$

At $\alpha = 0$: $\sqrt{\lambda_n} = n + 1/2$, so $\cos(\sqrt{\lambda_n}\pi) = 0$ and $\sin(\sqrt{\lambda_n}\pi) = (-1)^n$.

**First derivative:** By implicit differentiation, $d\lambda/d\alpha = -f_\alpha / f_\lambda$.

$f_\alpha = \sin(\sqrt{\lambda}\pi) = (-1)^n$ at $\alpha=0$.

$f_\lambda = \frac{\cos(\sqrt{\lambda}\pi)}{2\sqrt{\lambda}} - \frac{\pi\sin(\sqrt{\lambda}\pi)}{2} = 0 - \frac{\pi(-1)^n}{2} = -\frac{\pi(-1)^n}{2}$ at $\alpha=0$.

So $d\lambda_n/d\alpha|_{\alpha=0} = -\frac{(-1)^n}{-\pi(-1)^n/2} = \frac{2}{\pi}$. ✓

**Second derivative:** Differentiating $f_\lambda \cdot \lambda' + f_\alpha = 0$ again with respect to $\alpha$:

$f_{\lambda\lambda}(\lambda')^2 + f_\lambda \lambda'' + 2f_{\lambda\alpha}\lambda' + f_{\alpha\alpha} = 0$

At $\alpha = 0$: $f_{\alpha\alpha} = 0$ (f is linear in $\alpha$), $f_{\lambda\alpha} = \frac{\pi\cos(\sqrt{\lambda}\pi)}{2\sqrt{\lambda}} = 0$ (since $\cos = 0$).

$f_{\lambda\lambda}|_{\alpha=0} = -\frac{\pi(-1)^n}{4(n+1/2)^2}$

So $\lambda'' = -\frac{f_{\lambda\lambda}(\lambda')^2}{f_\lambda} = -\frac{-\frac{\pi(-1)^n}{4(n+1/2)^2} \cdot \frac{4}{\pi^2}}{-\frac{\pi(-1)^n}{2}} = -\frac{\frac{(-1)^n}{\pi(n+1/2)^2}}{\frac{\pi(-1)^n}{2}} = -\frac{2}{\pi^2(n+1/2)^2}$.

Therefore $\frac{d^2\lambda_n}{d\alpha^2}\big|_{\alpha=0} = -\frac{2}{\pi^2(n+1/2)^2} \neq 0$. ∎

**Where the claimed argument goes wrong:** The "symmetric cancellation" in the partial-fraction decomposition is incorrect. The first sub-sum $\sum_{j \neq 0, j \geq -n} 1/j$ is NOT a symmetric sum over all integers — it starts at $j = -n$ (since $m \geq 0$ implies $j = m-n \geq -n$), so the negative terms only go down to $j = -n$ while the positive terms extend to $+\infty$. The asymmetry between the finite lower range and infinite upper range means the "cancellation in symmetric pairs" leaves a finite residual. Specifically, the terms $j = -n, \ldots, -1$ pair with $j = 1, \ldots, n$, but the remaining terms $j = n+1, n+2, \ldots$ have no partners.

## Trap Mechanism

- **Type:** Conditional convergence / asymmetric cancellation
- **Q1:** Models encounter the partial-fraction sum and try to evaluate it
- **Q2:** The problem's own framing presents a plausible (but wrong) argument for symmetric cancellation → models may accept it without checking
- **Q3:** The framing steers models toward the false conclusion (= 0)
- **Q4:** The disproof requires either (a) carefully tracking the asymmetric sum limits, or (b) deriving and differentiating the transcendental eigenvalue equation

## Risks

- Models may derive the eigenvalue equation from the ODE + boundary conditions and do implicit differentiation, bypassing the perturbation sum entirely
- Models familiar with Sturm-Liouville theory may know the second-order correction is generically nonzero
- The problem is long — models might focus on the framing rather than checking the math
