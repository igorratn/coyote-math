Let $Y_{\ell}^{m}(\theta, \phi)$ be the standard spherical harmonics on $\mathbb{S}^{2}$, normalized in $L^{2}(\mathbb{S}^{2})$, with integers $\ell \ge 0$ and $|m| \le \ell$.

The spherical harmonics are defined by

$$Y_{\ell}^{m}(\theta, \phi) = \sqrt{\frac{2\ell+1}{4\pi}\frac{(\ell-m)!}{(\ell+m)!}} P_{\ell}^{m}(\cos\theta) e^{im\phi}$$

where $P_{\ell}^{m}$ denotes the associated Legendre function and $(\theta, \phi) \in [0, \pi] \times [0, 2\pi)$.

Claim: 
Fix $m \in \mathbb{Z}$. There exist constants $C > 0$ and $\delta \in (0, 1)$, independent of $\ell$, such that for all integers $\ell \ge |m|$,

$$\sup_{\theta \in [0, \pi]} \Bigl| (\sin\theta)^{|m|+\delta} Y_{\ell}^{m}(\theta, \phi) \Bigr| \le C$$

Determine, with rigorous justification, whether the statement is true or false.

Answer. True. 

For $m = 0$ one must choose $\delta \in [1/2, 1)$, which is compatible with the existential quantifier $\delta \in (0, 1)$. For $|m| \ge 1$, any $\delta \in (0, 1)$ satisfies the claim.

Proof. Since $|e^{im\phi}| = 1$, the expression is independent of $\phi$. Let $x = \cos\theta$ and $n = \ell - |m|$. For the case $n = 0$ ($\ell = |m|$), the expression $(\sin\theta)^{|m|+\delta} Y_{|m|}^m$ is a single continuous function on the compact set $[0, \pi]$, which is necessarily bounded. We assume the final constant $C$ is chosen to dominate this $n=0$ supremum.

We now consider $n \ge 1$. We use the identity relating associated Legendre functions to Jacobi polynomials $P_n^{(\alpha, \beta)}$:

$$P_\ell^{|m|}(x) = (-1)^{|m|} (1-x^2)^{|m|/2} \frac{(\ell+|m|)!}{2^{|m|}\ell!} P_{n}^{(|m|, |m|)}(x).$$

The normalized spherical harmonic is

$$|Y_{\ell}^{m}(\theta, \phi)| = B_{\ell, m} (1-x^2)^{|m|/2} |P_{n}^{(|m|, |m|)}(x)|,$$

where the normalization constant is

$$B_{\ell, m} = \sqrt{\frac{2\ell+1}{4\pi}} \frac{\sqrt{(\ell+|m|)! (\ell-|m|)!}}{2^{|m|} \ell!}.$$

Using factorial product bounds or Stirling's formula, $B_{\ell, m} = O(\sqrt{\ell})$ for fixed $m$. Moreover, there exists $C_m > 0$ such that for all $\ell \ge |m|+1$ (i.e., $n \ge 1$), the ratio $B_{\ell, m} / \sqrt{n} \le C_m$.

To bound the polynomial part, we apply the Jacobi envelope estimate from Nikiforov–Uvarov (Special Functions of Mathematical Physics, Birkhäuser Basel, 1988, Chapter II, Section 7, Equation 19). For $\alpha, \beta > -1/2$, there exists a constant $C_{|m|} > 0$, depending only on $|m|$, and independent of $n$ and $x$, such that for all $n \ge 1$ and $x \in [-1, 1]$:

$$\Bigl| (1-x)^{\alpha/2+1/4} (1+x)^{\beta/2+1/4} P_n^{(\alpha, \beta)}(x) \Bigr| \le \frac{C_{|m|}}{\sqrt{n}}.$$

Setting $\alpha = \beta = |m| \ge 0$, we have $|P_n^{(|m|, |m|)}(x)| \le C_{|m|} n^{-1/2} (1-x^2)^{-|m|/2 - 1/4}$. Multiplying by the weight $(\sin\theta)^{|m|+\delta} = (1-x^2)^{(|m|+\delta)/2}$ yields:

$$(\sin\theta)^{|m|+\delta} |Y_{\ell}^m| \le C_{|m|} \frac{B_{\ell, m}}{\sqrt{n}} (1-x^2)^{|m|/2 + \delta/2 - 1/4}.$$

As established, the prefactor $C_{|m|} B_{\ell, m} / \sqrt{n}$ is bounded by $C_{|m|} C_m$. Boundedness on $[-1,1]$ holds provided the exponent of $(1-x^2)$ is non-negative:

$$\frac{|m|}{2} + \frac{\delta}{2} - \frac{1}{4} \ge 0 \iff \delta \ge \frac{1}{2} - |m|.$$

If this condition holds, then $(1-x^2)^{|m|/2 + \delta/2 - 1/4} \le 1$ on $[-1, 1]$, and the supremum is controlled by the prefactor. For $|m| \ge 1$, the condition $\delta \ge 1/2 - |m|$ is satisfied for all $\delta \in (0, 1)$. For $m = 0$, the condition requires $\delta \ge 1/2$, which is compatible with the existence of $\delta \in (0, 1)$. This establishes the existence of a constant $C$ independent of $\ell$.