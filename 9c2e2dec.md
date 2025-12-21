Let $P_n^{(\alpha,\beta)}(x)$ denote the Jacobi polynomials, orthogonal on $[-1,1]$ with respect to $p(x)=(1-x)^\alpha(1+x)^\beta$, where $\alpha,\beta>-1$.

Fix $\beta_1 \in \mathbb{R}$ such that $|\beta_1| > 1$. Define a modified weight $\tilde{p}(x)$ by dividing the original weight by a linear factor:

$$\tilde{p}(x) = \frac{p(x)}{x - \beta_1}$$

Note that since $|\beta_1| > 1$, the denominator does not vanish on the interval $[-1, 1]$, though the sign of $\tilde{p}(x)$ will depend on the choice of $\beta_1$. To ensure $\tilde{p}(x)$ is a positive weight, assume $\beta_1 < -1$.

Claim:

The polynomials $\tilde{P}_n(x)$ orthogonal with respect to $\tilde{p}(x)$ can be expressed as a linear combination of exactly two consecutive original Jacobi polynomials in the form:

$$\tilde{P}_n(x) = P_n^{(\alpha,\beta)}(x) + \gamma_n P_{n-1}^{(\alpha,\beta)}(x)$$

for some constant $\gamma_n \in \mathbb{R}$.

Determine whether this claim is True or False, and provide a rigorous proof.

----------
Conclusion: True

Step 1. Define Orthogonality

The polynomial $\tilde{P}_n(x)$ of degree $n$ is orthogonal to all polynomials of degree less than $n$ with respect to $\tilde{p}(x)$ if:

$\int_{-1}^1 \tilde{P}_n(x) q(x) \frac{p(x)}{x - \beta_1} dx = 0$ for every $q \in \mathbb{P}_{n-1}$.

Step 2. Use the Polynomial Identity

Any polynomial $q(x)$ of degree at most $n-1$ can be written using the identity:

$q(x) = (x - \beta_1)s(x) + q(\beta_1)$

where $s(x)$ is a polynomial of degree at most $n-2$.

Step 3. Substitute into the Inner Product

Substituting this identity into the orthogonality condition yields:

$\int_{-1}^1 \tilde{P}_n(x) s(x) p(x) dx + q(\beta_1) \int_{-1}^1 \frac{\tilde{P}_n(x)}{x - \beta_1} p(x) dx = 0$.

Step 4. The Basis Argument

For the first integral to vanish for all $s \in \mathbb{P}_{n-2}$, $\tilde{P}_n$ must be orthogonal to all polynomials of degree $\le n-2$ with respect to the original weight $p(x)$. In the $(n+1)$-dimensional space $\mathbb{P}_n$, these $n-1$ linear constraints define a 2-dimensional subspace. Since $P_n$ and $P_{n-1}$ are linearly independent and both are orthogonal to $\mathbb{P}_{n-2}$ with respect to $p(x)$, they form a basis for this subspace. Therefore, any such $\tilde{P}_n$ must be a linear combination:

$\tilde{P}_n(x) = c_1 P_n(x) + c_2 P_{n-1}(x)$.

Setting $c_1 = 1$ for a monic normalization yields the ansatz $\tilde{P}_n = P_n + \gamma_n P_{n-1}$.

Step 5. Solve for $\gamma_n$ and Justify Existence

We require the second integral from Step 3 to vanish:

$\int_{-1}^1 \frac{P_n(x) + \gamma_n P_{n-1}(x)}{x - \beta_1} p(x) dx = 0$.

Define $Q_n(\beta_1) = \int_{-1}^1 \frac{P_n(x)}{x - \beta_1} p(x) dx$, which is the Jacobi function of the second kind. The equation becomes $Q_n(\beta_1) + \gamma_n Q_{n-1}(\beta_1) = 0$, or $\gamma_n = -Q_n(\beta_1)/Q_{n-1}(\beta_1)$.

The existence of $\gamma_n$ is guaranteed because $Q_{n-1}(\beta_1) \neq 0$ for $\beta_1 < -1$. This is a standard result in the theory of orthogonal polynomials (e.g., Szegő, "Orthogonal Polynomials"): for a weight $p(x)$ with support on $[a,b]$, the functions of the second kind $Q_n(z)$ are analytic and non-vanishing in the cut plane $\mathbb{C} \setminus [a,b]$. Since $\beta_1$ lies outside the interval of orthogonality $[-1, 1]$, the denominator is strictly non-zero and $\gamma_n$ is uniquely determined.

Step 6. Final Conclusion

The $P_n, P_{n-1}$ ansatz satisfies all orthogonality requirements for the divided weight, confirming the claim is True.