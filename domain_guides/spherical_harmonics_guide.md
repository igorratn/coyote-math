# Spherical Harmonics Domain Guide

**Based on NU Chapter II (§8, §10) and Varshalovich et al. (1988)**

---

## Core Mathematical Objects

1. **Spherical Harmonics**: $Y_{\ell m}(\theta,\phi)$ on $S^2$
   - Normalized: $\int_{S^2} |Y_{\ell m}|^2 d\Omega = 1$
   - Orthogonality: $(Y_{\ell m}, Y_{\ell'm'}) = \delta_{\ell\ell'}\delta_{mm'}$
   - Connection: $Y_{\ell m}(\theta,\phi) = \sqrt{(2\ell+1)/(4\pi)} \sqrt{(\ell-m)!/(\ell+m)!} P_\ell^m(\cos \theta) e^{im\phi}$

2. **Associated Legendre Functions**: $P_\ell^m(x)$ on $[-1,1]$
   - Rodrigues: $P_\ell^m(x) = \frac{(-1)^m}{2^\ell \ell!} (1-x^2)^{m/2} \frac{d^{\ell+m}}{dx^{\ell+m}}[(x^2-1)^\ell]$
   - Jacobi connection: $P_\ell^{|m|}(x) \sim (1-x^2)^{|m|/2} P_{n}^{(|m|,|m|)}(x)$ where $n=\ell-|m|$
   - Three-term recurrence for fixed $m$
   - Normalized form: $\Theta_{\ell m}(x) = \sqrt{(2\ell+1)(\ell-m)!/(\ell+m)!} P_\ell^m(x)$

3. **Wigner D-functions**: $D_{mm'}^{\ell}(\alpha,\beta,\gamma) = e^{-im\alpha} d_{mm'}^\ell(\beta) e^{-im'\gamma}$
   - Rotation matrices: $d_{mm'}^\ell(\beta)$ for rotation by $\beta$ about y-axis
   - **Key:** $d_{0m}^\ell(\beta) \neq 0$ for $m\neq 0$ (common misconception!)
   - Orthogonality: $\int d_{mm'}^\ell d_{m''m'''}^{\ell'} \sin \beta d\beta = \frac{2}{2\ell+1} \delta_{\ell\ell'} \delta_{mm''} \delta_{m'm'''}$

4. **Angular Momentum Operators**:
   - Raising: $L_+ Y_{\ell m} = \sqrt{(\ell-m)(\ell+m+1)} Y_{\ell,m+1}$
   - Lowering: $L_- Y_{\ell m} = \sqrt{(\ell+m)(\ell-m+1)} Y_{\ell,m-1}$
   - Singularities: $(1/\sin \theta)$ factor in operator representation

5. **Ferrers Functions**: $P_\ell^m(z)$ for $z \in \mathbb{C} \setminus ((-\infty,-1] \cup [1,\infty))$
   - Analytic continuation of associated Legendre
   - Branch cuts and argument behavior

---

## Key Mathematical Phenomena

### 1. Pole Singularities
- Weight $\sin \theta \to 0$ as $\theta\to 0,\pi$
- Operators $L_\pm$ contain $1/\sin \theta$ factors
- **Critical distinction:** Singularity in representation vs. domain restriction
- Example: $L_+ Y_{\ell m}$ well-defined at poles despite $1/\sin \theta$ in formula

### 2. Rotation Group Structure
- At north pole ($\theta=0$): Only $Y_{\ell 0}$ component survives
- **But:** $d_{0m}^\ell(\beta) \neq 0$ for $m\neq 0$ → counterintuitive results
- Non-commutativity: Rotation order matters
- Basis changes: Quantization axis selection

### 3. Addition Theorems
- Standard: $\sum_m Y_{\ell m}(\theta_1,\phi_1) \bar{Y}_{\ell m}(\theta_2,\phi_2) = \frac{2\ell+1}{4\pi} P_\ell(\cos \omega)$
- Modified sums with $(-1)^m$ factors break symmetry for odd $\ell$
- Reproducing kernel: $K_N(\theta,\theta') = \sum_{\ell=0}^N \sum_m Y_{\ell m}(\theta,\phi)\bar{Y}_{\ell m}(\theta',\phi')$
- Growth: $K_N \sim N$ (linear) at interior points

### 4. Christoffel-Darboux for Fixed $m$
- Sum $\sum_{\ell=m}^N \Theta_{\ell m}^2(x_0)$ grows linearly: $\sim cN$
- Requires: Jacobi connection + Szegő asymptotics + Weyl equidistribution
- Multi-step reasoning connecting several areas

### 5. Index Boundaries and Recurrences
- Recurrence coefficients vanish at $\ell=m$
- Two-term ansatz breaks at boundary indices
- System becomes overdetermined

### 6. Cauchy Transform and Principal Values
- Principal value integrals: $\text{p.v.}\int_{-1}^1 \frac{P_\ell(x)}{x-\beta}dx$
- Pole decomposition: $q(x) = q(\beta) + (x-\beta)r(x)$
- Orthogonality reduces to single condition at pole

---

## Reference Map

**NU Chapter II:**
- **§7**: Interior asymptotics (Eq. 19), boundary behavior, envelope estimates, auxiliary function method
- **§8**: Associated Legendre via Jacobi polynomials, normalization, Rodrigues formula
- **§10**: Spherical harmonics, Laplace equation, addition theorem, generating functions

**Varshalovich et al. (1988):**
- **Chapter 2**: Spherical harmonics $Y_{\ell m}$ properties
- **Chapter 4**: Wigner D-functions $D_{mm'}^\ell(\alpha,\beta,\gamma)$
- **Chapter 5**: Rotation matrices $d_{mm'}^\ell(\beta)$, Eq. 4.3.2 (explicit formulas)
- **Chapter 8**: Clebsch-Gordan coefficients

**When to cite:**
- NU for Legendre/Jacobi properties, asymptotics, normalization, auxiliary functions
- Varshalovich for Wigner functions, rotation matrices, angular momentum coupling
- Szegő for oscillatory asymptotics (Theorem 8.21.8)

---

## Spherical Harmonics-Specific Notes

**North pole evaluation technique:**
- At $\theta=0$: $Y_{\ell m}(0,\phi) = \sqrt{(2\ell+1)/(4\pi)} \delta_{m,0}$
- Simplifies sums: $\sum_m f(m) Y_{\ell m}(0,0) = f(0)\sqrt{(2\ell+1)/(4\pi)}$
- Reduces 2D problem to 0D evaluation
- Frequently used for counterexamples and testing identities

**Pole vs. interior behavior:**
- Must distinguish operator singularities from function singularities
- Source of divergence matters: $1/\sin\theta$ in definition vs. cot $\theta$ in operator
- Example: $L_+$ is well-defined at poles even though formula contains $1/\sin\theta$

**Rodrigues at boundaries:**
- At $x=1-\varepsilon$: Weight $(1-x)^{m/2}$ vanishes but derivatives grow
- Cancellation analysis required for boundary behavior
- NU envelope estimates handle competing growth rates

**Rotation matrix properties:**
- $d_{mm'}^\ell(\beta)$ is real and non-zero for most values
- "Only $m'=0$ survives at pole" $\neq$ "only $m=0$ contributes"
- Explicit formulas needed for small $\ell$ (Varshalovich Ch. 5, Eq. 4.3.2)

**Christoffel-Darboux structure:**
- For fixed $m$: Linear growth in $N$ via oscillatory cancellation
- Requires Jacobi → Szegő → Weyl chain
- Differential operators: Similar analysis with $(1-x^2)$ factors

---

## Current Problem Coverage (19 problems)

See `spherical_harmonics_cluster.md` for detailed methodology clustering.

**Main clusters:**
1. Monotonicity via auxiliary function (1 problem)
2. Addition theorem modifications (1 problem)
3. Modified weight orthogonality (2 problems)
4. Cauchy transform theory (1 problem)
5. Zero distribution (1 problem)
6. Operator domains at poles (3 problems)
7. Rotation matrices (3 problems)
8. Christoffel-Darboux growth (4 problems)
9. Weighted integrals (1 problem)
10. Index boundaries (1 problem)
11. Differential operators (1 problem)
12. Ferrers functions (1 problem)

**Key methodologies in use:**
- NU auxiliary function method
- North pole evaluation strategy
- Jacobi-Szegő-Weyl chain for asymptotics
- Pole decomposition for principal values
- Rodrigues boundary analysis
- Rotation matrix evaluation
- Recurrence obstruction at boundaries

**Potential gaps:**
- Clebsch-Gordan coupling
- Higher-order differential operators
- Non-standard addition theorems (Graf-type)
- Complex plane behavior beyond Ferrers
