For $\lambda > 0$, let $C_n^{(\lambda)}(x)$ denote the Gegenbauer (ultraspherical) polynomials, orthogonal on $[-1,1]$ with respect to the weight $(1-x^2)^{\lambda - 1/2}$. The linearization formula expresses the product of two Gegenbauer polynomials as

$$C_m^{(\lambda)}(x)\, C_n^{(\lambda)}(x) = \sum_{k=|m-n|}^{m+n} g_k(m,n;\lambda)\, C_k^{(\lambda)}(x),$$

where the sum runs in steps of 2 (i.e., $k$ has the same parity as $m+n$), and $g_k(m,n;\lambda) \geq 0$ for all admissible $k$.

Since $C_n^{(\lambda)}(x) = \frac{2^n(\lambda)_n}{n!}\,x^n + \text{lower-degree terms}$, comparing leading coefficients on both sides gives the top linearization coefficient

$$g_{m+n}(m,n;\lambda) = \binom{m+n}{m}\frac{(\lambda)_m\,(\lambda)_n}{(\lambda)_{m+n}},$$

where $(a)_k = a(a+1)\cdots(a+k-1)$ is the Pochhammer symbol.

Claim: For all $\lambda > 0$ and all $m, n \geq 1$,

$$g_{m+n}(m,n;\lambda) \leq 1.$$

Determine whether this claim is True or False, and give a rigorous proof of your conclusion.



The claim is False

Set $m = n = 1$. Then $(\lambda)_1 = \lambda$ and $(\lambda)_2 = \lambda(\lambda+1)$, so

$$g_2(1,1;\lambda) = \binom{2}{1}\frac{\lambda \cdot \lambda}{\lambda(\lambda+1)} = \frac{2\lambda}{\lambda+1}.$$

This exceeds 1 iff $2\lambda > \lambda + 1$, i.e., $\lambda > 1$. Counterexample: $\lambda = 2$ gives $g_2(1,1;2) = 4/3 > 1$.

Verified by direct polynomial computation: $C_1^{(2)}(x) = 4x$, $C_2^{(2)}(x) = 12x^2 - 2$, $C_0^{(2)}(x) = 1$. Then $(4x)^2 = 16x^2 = g_0 + g_2(12x^2 - 2)$ gives $g_2 = 4/3$, $g_0 = 8/3$. $\blacksquare$