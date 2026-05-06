# Homogeneous isotropic saturated half-plane — sign-count prompt

## Final problem statement

Consider the vertical $(x,z)$ plane through the soil, taken perpendicular to the direction of motion of the vehicle. In this cross-section, the moving contact patch is represented at one instant by a distributed normal load on the surface $z=0$. The soil is a homogeneous, isotropic, fully saturated half-plane occupying $z>0$.

The load distribution is

$$q(\xi)=p_0\left(1-\frac{\xi^2}{a^2}\right),\qquad |\xi|\le a,\qquad q(\xi)=0,\quad |\xi|>a.$$

At the instant $t=0^+$, before any drainage occurs, let $\sigma_{zo}(x,z)$ be the vertical effective stress carried by the soil skeleton.

Determine the number $N$ of the following four points at which $\sigma_{zo}>0$:

$$P_1=(0,a/2),\qquad P_2=(0.95a,a/4),\qquad P_3=(0,3a/2),\qquad P_4=(3a/2,a/2).$$

Here $x, z, \xi$, and $a$ have units of length, while $q$, $p_0$, and $\sigma_{zo}$ have units of stress. You may work with the dimensionless ratio $\sigma_{zo}/p_0$ if convenient. The final answer $N$ is a unitless integer.

Report one integer only from the set $\{0,1,2,3,4\}$. Do not include units or explanatory text in the final answer.

---

## Golden solution / derivation notes

At $t=0^+$, before drainage, the initial pore pressure $P_0(x,z)$ is harmonic in the half-plane and satisfies:

$$\Delta P_0=0,\qquad P_0(x,0)=q(x),\qquad P_0(x,z)\to 0\ \text{as}\ x^2+z^2\to\infty.$$

Therefore, by the Poisson formula for the upper half-plane:

$$P_0(x,z)=\frac{1}{\pi}\int_{-a}^{a} q(\xi)\,\frac{z}{(x-\xi)^2+z^2}\,d\xi$$

For the instantaneous undrained plane problem, the initial skeleton stresses are obtained from $P_0$ by:

$$\sigma_{xo}=z\frac{\partial P_0}{\partial z}, \qquad \sigma_{zo}=-z\frac{\partial P_0}{\partial z}, \qquad \tau_{xzo}=-z\frac{\partial P_0}{\partial x}.$$

Differentiate the Poisson kernel under the integral sign:

$$\frac{\partial}{\partial z}\left(\frac{z}{(x-\xi)^2+z^2}\right) = \frac{(x-\xi)^2-z^2}{((x-\xi)^2+z^2)^2},$$

$$\frac{\partial}{\partial x}\left(\frac{z}{(x-\xi)^2+z^2}\right) = -\frac{2z(x-\xi)}{((x-\xi)^2+z^2)^2}.$$

Hence:

$$\sigma_{xo}(x,z)=\frac{z}{\pi}\int_{-a}^{a} q(\xi) \frac{(x-\xi)^2-z^2}{((x-\xi)^2+z^2)^2}\,d\xi$$

$$\sigma_{zo}(x,z)=\frac{z}{\pi}\int_{-a}^{a} q(\xi) \frac{z^2-(x-\xi)^2}{((x-\xi)^2+z^2)^2}\,d\xi$$

$$\tau_{xzo}(x,z)=\frac{2z^2}{\pi}\int_{-a}^{a} q(\xi) \frac{x-\xi}{((x-\xi)^2+z^2)^2}\,d\xi$$

----------

### Pointwise Evaluation

For the four homogeneous-case check points:

$$P_1=(0,a/2),\quad P_2=(0.95a,a/4),\quad P_3=(0,3a/2),\quad P_4=(3a/2,a/2),$$

numerical evaluation of the exact integral for $\sigma_{zo}/p_0$ gives:

$$P_1: +0.28420,\qquad P_2: -0.05582,\qquad P_3: +0.22536,\qquad P_4: -0.06930.$$

So the homogeneous sign pattern is $(+,-,+,-)$, and therefore:

$$N_{\mathrm{hom}}=2.$$

----------

### References

- **Evans, L. C. (2010).** _Partial Differential Equations_ (2nd ed.), §2.2.1: Poisson kernel for the upper half-plane.

- **Timoshenko, S. P., & Goodier, J. N. (1970).** _Theory of Elasticity_ (3rd ed.), §36–37: Flamant half-plane line-load solution and principle of superposition.

- **Wang, H. F. (2000).** _Theory of Linear Poroelasticity_, Chapter 3: Undrained response and initial pore-pressure distribution in saturated media.
