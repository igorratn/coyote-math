In a cylindrically symmetric scattering model, the radial overlap between two neighboring angular-momentum channels is defined by

$$\mathcal C_\nu(a,b)=\int_0^\infty J_\nu(at) J_{\nu+1}(bt) \, dt, \qquad \nu > -1, \quad 0 < a \le b,$$

where $J_\nu$ is the Bessel function of the first kind.

For separated radii $0 < a < b$, a standard Weber-Schafheitlin evaluation gives

$$\mathcal C_\nu(a,b)=\frac{a^\nu}{b^{\nu+1}}.$$

A naive continuity heuristic suggests that this formula should extend continuously to the coincident-radius case $a=b$, yielding

$$\mathcal C_\nu(b,b)=\frac{1}{b}.$$

Determine whether this claim is True or False, and give a rigorous proof of your conclusion.


The claim is False.

It is enough to test the case $\nu=0$. Then

$$\mathcal C_0(b,b)=\int_0^\infty J_0(bt) J_1(bt) \, dt.$$

With the change of variable $x=bt$, this becomes

$$\mathcal C_0(b,b)=\frac{1}{b}\int_0^\infty J_0(x) J_1(x) \, dx.$$

Now use the standard derivative identity

$$J_0^\prime(x)=-J_1(x).$$

Hence

$$\int_0^\infty J_0(x) J_1(x) \, dx = -\int_0^\infty J_0(x) J_0^\prime(x) \, dx = -\frac{1}{2}\int_0^\infty \frac{d}{dx}\bigl(J_0(x)^2\bigr) \, dx.$$

Therefore

$$\int_0^\infty J_0(x) J_1(x) \, dx = -\frac{1}{2}\Bigl[J_0(x)^2\Bigr]_{0}^{\infty}.$$

Since $J_0(0)=1$ and $J_0(x) \to 0$ as $x \to \infty$, we get

$$\int_0^\infty J_0(x) J_1(x) \, dx = \frac{1}{2}.$$

So

$$\mathcal C_0(b,b)=\frac{1}{2b}.$$

But the claimed continuation predicts

$$\mathcal C_0(b,b)=\frac{1}{b},$$

which is different. The continuity extension fails at the boundary $a=b$.

Thus the claim is False, since already for $\nu=0$ one has

$$\mathcal C_0(b,b)=\frac{1}{2b}.$$
