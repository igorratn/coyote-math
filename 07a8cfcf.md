Let $\{P_n(x)\}_{n \ge 0}$ be a sequence of polynomials defined by the exponential generating function

$$G(x,t) = \sum_{n=0}^\infty P_n(x) \frac{t^n}{n!} = \exp\left( \frac{\lambda t^2}{2} - \lambda xt \right)$$

where $\lambda \in \mathbb{R} \setminus \{0\}$ is fixed.

Question.

Determine whether there exist polynomials $\alpha(x)$ and $\beta(x)$, independent of $n$, satisfying

$$\deg \alpha \le 2, \qquad \deg \beta \le 1$$

and a sequence of real constants $\{\gamma_n\}_{n \ge 0}$ such that, for every $n \ge 0$, the polynomial $P_n(x)$ satisfies the second-order linear differential equation

$$\alpha(x)P_n''(x) + \beta(x)P_n'(x) + \gamma_n P_n(x) = 0$$

Give a rigorous proof of your conclusion.


The statement is TRUE.

Proof using Bochner's theorem:

Step 1. Identify $P_n$ as a rescaled probabilists' Hermite family.

Let $He_n(z)$ be defined by

$$\exp\left(zs - \frac{s^2}{2}\right) = \sum_{n=0}^\infty He_n(z) \frac{s^n}{n!}$$

Given

$$G(x,t) = \exp\left(\frac{\lambda t^2}{2} - \lambda xt\right)$$

Choose $c$ such that $c^2 = -\lambda$ and set $s = ct$ and $z = cx$. Then

$$zs - \frac{s^2}{2} = (cx)(ct) - \frac{(ct)^2}{2} = c^2 xt - \frac{c^2 t^2}{2} = -\lambda xt + \frac{\lambda t^2}{2}$$

so

$$G(x,t) = \exp\left(zs - \frac{s^2}{2}\right) \text{ with } z = cx \text{ and } s = ct$$

Therefore,

$$G(x,t) = \sum_{n=0}^\infty He_n(cx) \frac{(ct)^n}{n!} = \sum_{n=0}^\infty \left(c^n He_n(cx)\right) \frac{t^n}{n!}$$

hence

$$P_n(x) = c^n He_n(cx)$$

This identity is valid for all real $\lambda\neq0$. Choose any complex number $c$ such that $c^2=-\lambda$. Then
$$P_n(x)=c^nHe_n(cx),$$
and the differential equation satisfied by $He_n$ transfers to an equation for $P_n$ with real polynomial coefficients, independent of $n$.

Step 2. Invoke Bochner and the Hermite ODE.

The Hermite family is one of the Bochner-classical families, so each $He_n$ satisfies a second order ODE with $\deg \alpha \le 2$ and $\deg \beta \le 1$, namely

$$He_n''(z) - z He_n'(z) + n He_n(z) = 0$$

Step 3. Transfer the ODE to $P_n$.

With $P_n(x) = c^n He_n(cx)$, we have:

$$P_n'(x) = c^{n+1} He_n'(cx)$$

$$P_n''(x) = c^{n+2} He_n''(cx)$$

Multiply the Hermite ODE by $c^{n+2}$ and substitute $z = cx$:

$$c^{n+2}He_n''(cx)-(cx)c^{n+2}He_n'(cx)+nc^{n+2}He_n(cx)=0.$$

Rewrite in terms of $P_n$:

$$P_n''(x) - c^2 x P_n'(x) + n c^2 P_n(x) = 0$$

Since $c^2 = -\lambda$, we obtain:

$$P_n''(x) + \lambda x P_n'(x) - \lambda n P_n(x) = 0$$

Thus one can take

$\alpha(x) = 1$

$\beta(x) = \lambda x$

$\gamma_n = -\lambda n$

which meets the conditions $\deg \alpha \le 2$ and $\deg \beta \le 1$.

Final Answer: TRUE.