# Bessel Functions Domain Guide

**Based on NU Chapter III (§14-19)**

---

## Core Mathematical Objects

1. **Bessel Functions**: $J_\nu(z)$, $Y_\nu(z)$ (standard)
   - Differential equation: $z^2u'' + zu' + (z^2 - \nu^2)u = 0$
   - Asymptotics (large $z$): $J_\nu(z) \sim \sqrt{2/(\pi z)}\cos(z - \pi\nu/2 - \pi/4)$
   - Origin: $J_\nu(z) \sim (z/2)^\nu/\Gamma(\nu+1)$, $Y_\nu(z) \sim -2^{\nu-1}\Gamma(\nu)/(\pi z^\nu)$ as $z \to 0$

2. **Modified Bessel**: $I_\nu(z)$, $K_\nu(z)$ (exponential growth/decay)
   - Modified equation: $z^2v'' + zv' - (z^2 + \nu^2)v = 0$
   - Asymptotics: $I_\nu(z) \sim e^z/\sqrt{2\pi z}$, $K_\nu(z) \sim \sqrt{\pi/(2z)}e^{-z}$

3. **Hankel Functions**: $H_\nu^{(1)}$, $H_\nu^{(2)}$ (outgoing/incoming waves)

4. **Spherical Bessel**: $j_n(z)$, $y_n(z)$ (half-integer order, elementary functions)

5. **Lommel Functions**: $s_{\mu,\nu}(z)$ (inhomogeneous: $z^2u'' + zu' + (z^2 - \nu^2)u = z^{\mu+1}$)

---

## Key Mathematical Phenomena

### 1. Origin Singularity
- Regular singular point at $z=0$ with Frobenius exponents $\pm\nu$
- $Y_\nu$ diverges at origin; $J_\nu$ bounded for $\nu > -1$

### 2. Zeros and Orthogonality
- Simple zeros: $0 < j_{\nu,1} < j_{\nu,2} < \cdots$
- Interlacing: $j_{\nu,k} < j_{\nu+1,k} < j_{\nu,k+1}$
- Orthogonality: $\int_0^a xJ_\nu(\alpha_m x)J_\nu(\alpha_n x)dx \propto \delta_{mn}$

### 3. Asymptotic Regimes
- Small $z$: Power series, Frobenius
- Large $z$: Oscillatory (valid for $z \gg \nu$)
- Transition $z \approx \nu$: Langer's uniform asymptotics

### 4. Wronskian Relations
- $W[J_\nu, Y_\nu] = 2/(\pi z)$ (standard)
- $W[I_\nu, I_{-\nu}] = -2\sin(\pi\nu)/(\pi z)$ (modified)
- Key: $K_\nu = \frac{\pi}{2\sin(\pi\nu)}[I_{-\nu} - I_\nu]$ is NOT independent

### 5. Inter-Function Connections
- Mehler-Heine: Legendre $P_\ell^m$ → Bessel $J_m$ in high-degree limit
- Coordinate transformation: spherical → cylindrical harmonics

---

## NU Chapter III Reference Map

- **§14**: Bessel equation, Hankel functions, power series
- **§15**: Asymptotic formulas, recursion relations, zeros
- **§16**: Sommerfeld integral representations
- **§17**: Modified Bessel ($I_\nu$, $K_\nu$), spherical Bessel, Neumann functions
- **§18**: Addition theorems (Graf, Gegenbauer)
- **§19**: Semiclassical (WKB), Langer's formulas for large order

**Additional:** Watson, *Theory of Bessel Functions* (1944) for Lommel functions, detailed zero theory

---

## Bessel-Specific Notes

**Order dependencies:**
- Integer $n$: $J_{-n}(z) = (-1)^n J_n(z)$
- Half-integer: Reduce to elementary functions
- Non-integer: $K_\nu$ well-defined via $I_\pm\nu$

**Singular endpoints:**
- At $z=0$: Need careful asymptotic analysis for Sturm-Liouville problems
- Boundary term $x(u'v - uv') = O(x^{2\nu}) \to 0$ for $\nu > 0$

**Phase behavior:**
- Near zeros: Wronskian-normalized quantities can diverge as $1/\varepsilon$
- Large argument: Phase advances by $\approx \pi$ between consecutive zeros

---

## Current Problem Coverage (5 problems)

See `bessel_functions_cluster.md` for detailed methodology clustering:
1. Lommel equation (inhomogeneous)
2. Modified Bessel basis (Frobenius + Wronskian)
3. Mehler-Heine limit (Legendre → Bessel)
4. Sturm-Liouville orthogonality (singular endpoint)
5. Phase synchronization (Wronskian divergence near zeros)

**Uncovered NU sections:** §16 (integrals), §18 (addition theorems), §19 (WKB/large order)
