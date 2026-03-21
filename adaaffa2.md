For $n \geq 0$, let $H_n(x)$ denote the physicist's Hermite polynomials, satisfying the orthogonality relation

$$\int_{-\infty}^{\infty} H_n(x) H_m(x) e^{-x^2} dx = \sqrt{\pi}\, 2^n\, n!\, \delta_{nm}.$$

These polynomials satisfy the three-term recurrence $H_{n+1}(x) = 2x H_n(x) - 2n H_{n-1}(x)$.

For $n \geq 0$, define the absolute-value weighted Hermite overlap

$$\Omega(n) = \int_{-\infty}^{\infty} |x|\, H_n(x)\, H_{n+1}(x)\, e^{-x^2}\, dx.$$

The factor $|x|$ is nonneg on $\mathbb{R}$, and $e^{-x^2}$ ensures convergence for all $n$. Since $|x|$ is not a polynomial and not smooth at $x = 0$, the product $H_n(x) H_{n+1}(x)$ cannot be directly reduced using standard Hermite orthogonality, so $\Omega(n)$ must be evaluated by other means.

Claim: For all $n \geq 0$, $\Omega(n)$ is strictly positive.

Determine whether this claim is True or False, and give a rigorous proof of your conclusion.

---

## Solution

The claim is False. In fact, $\Omega(n) = 0$ for all $n \geq 0$.

The physicist's Hermite polynomials satisfy $H_n(-x) = (-1)^n H_n(x)$. The product of consecutive Hermite polynomials therefore has parity

$$H_n(-x) H_{n+1}(-x) = (-1)^n (-1)^{n+1} H_n(x) H_{n+1}(x) = (-1)^{2n+1} H_n(x) H_{n+1}(x) = -H_n(x) H_{n+1}(x),$$

so $H_n(x) H_{n+1}(x)$ is an odd function of $x$. The factors $|x|$ and $e^{-x^2}$ are both even. The full integrand is therefore

$$f(x) = |x|\, H_n(x)\, H_{n+1}(x)\, e^{-x^2}, \qquad f(-x) = -f(x).$$

Since $f$ is odd and absolutely integrable (the Gaussian $e^{-x^2}$ dominates the polynomial growth), the integral over the symmetric domain $(-\infty, \infty)$ vanishes:

$$\Omega(n) = \int_{-\infty}^{\infty} f(x)\, dx = 0 \quad \text{for all } n \geq 0. \qquad \blacksquare$$
