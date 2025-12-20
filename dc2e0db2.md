In a steady one-dimensional heat-conduction problem, a thin rod with uniform thermal conductivity $k = 1$ is exposed to ambient air at zero temperature.  
The rod loses heat to the surroundings according to Newton’s law of cooling, with a periodically modulated cooling coefficient  
$C(x) = h^2 \left[1 + \frac{1}{2} \cos x\right]$,  
which has period $2\pi$.  
At position $x = 0$, a localized heater injects heat at a constant rate of $4\pi$.  
The temperature field $T(x)$ satisfies periodic boundary conditions  
$T(x + 2\pi) = T(x)$,  
and is governed by the equation  
$-\,T''(x) + C(x)\,T(x) = 4\pi\,\delta(x)$.
Using a first-order perturbation approximation with respect to the small modulation amplitude of \cos x, determine the temperature at the heater location T(0) for h = 3.


In a steady one-dimensional heat-conduction problem, a thin rod with uniform thermal conductivity $k=1$ is exposed to ambient air at zero temperature. The rod loses heat to the surroundings according to Newton’s law of cooling, with a spatial decay rate $h>0$ that varies along the rod as $h(x) = h \left[1 + \frac{1}{2} \cos x\right]$. At position $x=0$, a localized heater injects heat at a constant rate of $4\pi$. The temperature $T(x)$ tends to zero as $|x| \to \infty$. Determine the exact temperature at the heater location $T(0)$, and report your final numerical result to four decimal places, for $h=3$.

Step 1. Decay $T(x) \to 0$ as $|x| \to \infty \Rightarrow$ the envelope solves the modified Helmholtz equation $T'' - h^2 T = -4\pi \delta(x)$, with $h = 3$, $a = 0$.

Step 2. Fourier transform in $x$: with $\hat{T}(k) = \int T(x) e^{-i k x} \, dx$, $(k^2 + h^2) \hat{T}(k) = 4\pi \Rightarrow \hat{T}(k) = \frac{4\pi}{k^2 + h^2}$.

Step 3. Invert and use the standard integral: $T(x) = \frac{1}{2\pi} \int \hat{T}(k) e^{i k x} \, dk = \frac{2}{\pi} \int \frac{e^{i k x}}{k^2 + h^2} \, dk = \frac{2\pi}{h} e^{-h |x|}$.

Step 4. Evaluate on-axis at the source: $T(0) = \frac{2\pi}{h} = \frac{2\pi}{3}$.


Final Answer. $T(0) = 2.0944$.