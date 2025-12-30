For n ≥ 1, define the Jacobi function of the second kind as

$$Q_n^{(\alpha,\beta)}(z) = \int_{-1}^1 \frac{(1-t)^\alpha (1+t)^\beta P_n^{(\alpha,\beta)}(t)}{z-t} dt.$$

Claim:

$$\lim_{z\to\infty} z^{n+1}Q_n^{(\alpha,\beta)}(z) = \frac{2^{n+\alpha+\beta+1}\Gamma(n+\alpha+1)\Gamma(n+\beta+1)}{\Gamma(2n+\alpha+\beta+2)}.$$

Determine whether this claim is True or False, and give a rigorous proof of your conclusion.

----------

Conclusion: True.

Fix $\text{Re}(\alpha) > -1$, $\text{Re}(\beta) > -1$, and $n \ge 1$. For $z \in \mathbb{C} \setminus [-1, 1]$, let $y_n(t) = P_n^{(\alpha,\beta)}(t)$ and $\rho(t) = (1-t)^\alpha (1+t)^\beta$.

Nikiforov and Uvarov define the function of the second kind (A. F. Nikiforov and V. B. Uvarov, Special Functions of Mathematical Physics, Birkhäuser, 1988, Chapter II, §11) by

$$Q_n^{NU}(z)=\frac{1}{\rho(z)}\int_a^b\frac{\rho(t)y_n(t)}{t-z}dt$$

and prove the asymptotic expansion (Eq. 7)

$$Q_n^{NU}(z)\sim-\frac{d_n^2}{a_n \rho(z) z^{n+1}} (1 + O(z^{-1})), \quad z \to \infty, z \notin [a,b]$$

where $a_n$ is the leading coefficient of $y_n$ and $d_n^2 = \int_a^b \rho(t)y_n(t)^2 dt$.

In the Jacobi case $(a,b) = (-1, 1)$, so the domain condition $z \notin [a,b]$ means $z \in \mathbb{C} \setminus [-1, 1]$. Since $1/(z-t) = -1/(t-z)$, the integral $Q_n^{(\alpha,\beta)}(z)$ satisfies the exact identity:

$$Q_n^{(\alpha,\beta)}(z) = -\rho(z) Q_n^{NU}(z).$$

Substituting the expansion for $Q_n^{NU}(z)$ into this identity allows us to rescale the asymptotic by the non-zero factor $-\rho(z)$:

$$Q_n^{(\alpha,\beta)}(z) \sim \frac{d_n^2}{a_n} z^{-(n+1)} (1 + O(z^{-1}))$$

hence $\lim_{z \to \infty} z^{n+1} Q_n^{(\alpha,\beta)}(z) = d_n^2/a_n$.

For Jacobi polynomials, the leading coefficient is

$$a_n = 2^{-n} \binom{2n+\alpha+\beta}{n} = \frac{\Gamma(2n+\alpha+\beta+1)}{2^n n! \Gamma(n+\alpha+\beta+1)}$$

and the square norm is

$$d_n^2 = \frac{2^{\alpha+\beta+1}}{2n+\alpha+\beta+1} \frac{\Gamma(n+\alpha+1)\Gamma(n+\beta+1)}{n!\Gamma(n+\alpha+\beta+1)}.$$

Forming the ratio $d_n^2/a_n$:

$$\frac{d_n^2}{a_n} = \frac{2^{\alpha+\beta+1} \Gamma(n+\alpha+1)\Gamma(n+\beta+1)}{(2n+\alpha+\beta+1) n! \Gamma(n+\alpha+\beta+1)} \cdot \frac{2^n n! \Gamma(n+\alpha+\beta+1)}{\Gamma(2n+\alpha+\beta+1)}$$

The factors $n!$ and $\Gamma(n+\alpha+\beta+1)$ cancel out, giving:

$$\frac{d_n^2}{a_n} = \frac{2^{n+\alpha+\beta+1} \Gamma(n+\alpha+1)\Gamma(n+\beta+1)}{(2n+\alpha+\beta+1) \Gamma(2n+\alpha+\beta+1)}.$$

Using $(2n+\alpha+\beta+1)\Gamma(2n+\alpha+\beta+1) = \Gamma(2n+\alpha+\beta+2)$, we obtain:

$$\frac{d_n^2}{a_n} = \frac{2^{n+\alpha+\beta+1}\Gamma(n+\alpha+1)\Gamma(n+\beta+1)}{\Gamma(2n+\alpha+\beta+2)}.$$

Thus the claim holds.