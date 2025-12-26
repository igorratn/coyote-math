
Let $P_n^{(\alpha,\beta)}(x)$ denote the Jacobi polynomials, orthogonal on $[-1,1]$ with respect to $p(x)=(1-x)^\alpha(1+x)^\beta$, where $\alpha,\beta>-1$.

Fix $\beta_1 \in \mathbb{R}$ such that $|\beta_1| > 1$. Define a modified weight $\tilde{p}(x)$ by dividing the original weight by a linear factor:

$$\tilde{p}(x) = \frac{p(x)}{x - \beta_1}$$

Note that since $|\beta_1| > 1$, the denominator does not vanish on the interval $[-1, 1]$, though the sign of $\tilde{p}(x)$ will depend on the choice of $\beta_1$. To ensure $\tilde{p}(x)$ is a positive weight, assume $\beta_1 < -1$.

Claim:

The polynomials $\tilde{P}_n(x)$ orthogonal with respect to $\tilde{p}(x)$ can be expressed as a linear combination of exactly two consecutive original Jacobi polynomials in the form:

$$\tilde{P}_n(x) = P_n^{(\alpha,\beta)}(x) + \gamma_n P_{n-1}^{(\alpha,\beta)}(x)$$

for some constant $\gamma_n \in \mathbb{R}$.

Determine whether this claim is True or False, and provide a rigorous proof.

Conclusion: True

Step 1. The polynomial $\tilde P_n(x)$ of degree $n$ is orthogonal to all polynomials of degree less than $n$ with respect to $\tilde p(x)=\frac{p(x)}{x-\beta_1}$ if

$$\int_{-1}^1 \tilde P_n(x)q(x)\frac{p(x)}{x-\beta_1}dx=0$$

for every $q\in\mathbb P_{n-1}$.

Step 2. Any polynomial $q(x)$ of degree at most $n-1$ can be written as

$$q(x)=(x-\beta_1)s(x)+q(\beta_1),$$

where $s\in\mathbb P_{n-2}$.

Step 3. Substitute the decomposition from Step 2 into the orthogonality condition:

$$\int_{-1}^1 \tilde P_n(x)s(x)p(x)dx + q(\beta_1)\int_{-1}^1\frac{\tilde P_n(x)}{x-\beta_1}p(x)dx = 0.$$

Choosing first $q(x)=(x-\beta_1)s(x)$, so $q(\beta_1)=0$, yields

$$\int_{-1}^1 \tilde P_n(x)s(x)p(x)dx=0$$

for all $s\in\mathbb P_{n-2}$. Choosing next $q(x)=1$, so $s(x)=0$, gives

$$\int_{-1}^1\frac{\tilde P_n(x)}{x-\beta_1}p(x)dx=0.$$

Thus the conditions split into:

(i) $\tilde P_n\perp\mathbb P_{n-2}$ with respect to $p(x)$,

(ii) $\int_{-1}^1\frac{\tilde P_n(x)}{x-\beta_1}p(x)dx=0$.

Step 4. Condition (i) imposes $n-1$ independent linear constraints on the $n+1$ coefficients of a general polynomial in $\mathbb P_n$. Therefore, the space of solutions within $\mathbb P_n$ has dimension $(n+1)-(n-1)=2$.

The Jacobi polynomials $P_n^{(\alpha,\beta)}$ and $P_{n-1}^{(\alpha,\beta)}$ are linearly independent and both satisfy condition (i). Hence they form a basis for this two-dimensional subspace, and every $\tilde P_n$ satisfying (i) has the form

$$\tilde P_n(x)=c_1P_n^{(\alpha,\beta)}(x)+c_2P_{n-1}^{(\alpha,\beta)}(x)$$

with $c_1\neq0$. Normalizing $\tilde P_n$ to be monic yields

$$\tilde P_n(x)=P_n^{(\alpha,\beta)}(x)+\gamma_nP_{n-1}^{(\alpha,\beta)}(x).$$

Step 5. Condition (ii) becomes

$$\int_{-1}^1\frac{P_n^{(\alpha,\beta)}(x)+\gamma_nP_{n-1}^{(\alpha,\beta)}(x)}{x-\beta_1}p(x)dx=0.$$

Define

$$A_n(\beta_1)=\int_{-1}^1\frac{P_n^{(\alpha,\beta)}(x)}{x-\beta_1}p(x)dx,\qquad B_n(\beta_1)=\int_{-1}^1\frac{P_{n-1}^{(\alpha,\beta)}(x)}{x-\beta_1}p(x)dx.$$

Then

$$A_n(\beta_1)+\gamma_nB_n(\beta_1)=0,\quad\text{so}\quad \gamma_n=-\frac{A_n(\beta_1)}{B_n(\beta_1)},$$

provided $B_n(\beta_1)\neq0$. If $B_n(\beta_1)=0$, then the equation forces $A_n(\beta_1)=0$ as well, and condition (ii) would impose no restriction on $\gamma_n$. In that case every monic polynomial $P_n^{(\alpha,\beta)}+\gamma P_{n-1}^{(\alpha,\beta)}$ would satisfy both (i) and (ii), contradicting the uniqueness of the monic orthogonal polynomial of degree $n$ for the positive weight $\tilde p(x)$. Positivity holds since $\beta_1<-1$ implies $x-\beta_1>0$ on $[-1,1]$. Therefore $B_n(\beta_1)\neq0$, and $\gamma_n$ exists uniquely.

Final conclusion: For $\beta_1<-1$, the orthogonal polynomials with respect to

$$\tilde p(x)=\frac{p(x)}{x-\beta_1}$$

are exactly of the form

$$\tilde P_n(x)=P_n^{(\alpha,\beta)}(x)+\gamma_nP_{n-1}^{(\alpha,\beta)}(x).$$

Hence the claim is True.