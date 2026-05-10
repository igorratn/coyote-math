# Radiating fin (nonlinear T⁴ BVP) — Peacock Draft v5

**Lineage:** v3/v4 (modulated diffusion) failed because Hill/Floquet methods are cached recall in frontier models. v5 pivots to a problem with a **fundamentally nonlinear** governing equation (Stefan–Boltzmann $T^4$ heat loss) that has no closed-form solution and where the natural "linearize about a reference temperature" shortcut produces clean wrong numbers >47% off truth at every plausible reference.

**TRIZ type:** Implicitly Broken Approximation (Peacock PDF §"Good Stumping Strategies") — the Newton's-law-of-cooling linearization $T^4 - T_\infty^4 \approx 4T_{\rm ref}^3(T-T_\infty)$ is a textbook approximation that fails unambiguously when $T_h/T_\infty \gtrsim 3$ and the rod spans both regimes.

**Defense format:** Soil-problem (`peacock/submitted/c9e3f4fe.md`) anchor + multi-method + mesh-convergence protocol.

---

## Problem statement

A thin straight rod of uniform cross-section is in steady state with one end held at a high temperature, the other end thermalized to ambient, and lateral surfaces losing heat to surroundings only by thermal radiation in vacuum, treating the surroundings as a large gray-diffuse enclosure at temperature $T_\infty$. Per unit length of the rod, the radiative heat loss is $\epsilon\sigma P\,(T^4 - T_\infty^4)$, where $P$ is the rod perimeter, $\epsilon$ the surface emissivity, and $\sigma$ the Stefan–Boltzmann constant; equivalently, per unit volume the loss is $(\epsilon\sigma P/A)\,(T^4 - T_\infty^4)$ where $A$ is the cross-sectional area.

The temperature $T(x)$ along the rod satisfies

$$-k\,T''(x) + \frac{\epsilon \sigma P}{A}\bigl(T(x)^4 - T_\infty^4\bigr) = 0, \qquad 0 \le x \le L,$$

with boundary conditions $T(0) = T_h$ and $T(L) = T_\infty$. Numerical values:

- $k = 100 \text{ W}/(\text{m}\cdot\text{K})$ (thermal conductivity)
- $\epsilon = 0.900$ (surface emissivity)
- $\sigma$: Stefan–Boltzmann constant
- $P/A = 400 \text{ m}^{-1}$ (perimeter-to-area ratio; e.g. square cross-section $1.00 \text{ cm} \times 1.00 \text{ cm}$)
- $T_\infty = 300 \text{ K}$ (ambient temperature)
- $L = 0.200 \text{ m}$ (rod length)
- $T_h = 2000 \text{ K}$ (heated-end temperature)

Determine $T(L/2)$, the temperature at the midpoint of the rod.

The answer should be expressed in K. Report your answer as a 3 significant figure number only. Any intermediate calculations should be carried out to 6 significant figures.

---

## Step-by-Step Solution

**Step 1 — Setup, evaluation point, regime check.**

Define the lumped coefficient $\beta = \epsilon\sigma P/A = 0.900 \times 5.67042 \times 10^{-8} \times 400 = 2.04135 \times 10^{-5}$ W/(m³·K⁴). The ODE in canonical form is

$$T''(x) = \frac{\beta}{k}\bigl(T^4 - T_\infty^4\bigr) = a\,(T^4 - T_\infty^4),\qquad a = \beta/k = 2.04135 \times 10^{-7} \text{ m}^{-2}\,\text{K}^{-3}.$$

The local "fin parameter" $m(T) = \sqrt{a\,(\partial/\partial T)(T^4 - T_\infty^4)} = \sqrt{4 a T^3}$ varies dramatically along the rod:
- $m(T_h) = m(2000) = \sqrt{4 \cdot 2.041 \times 10^{-7} \cdot 8 \times 10^9} = 80.8$ m⁻¹ (decay length $\sim 1.24$ cm)
- $m(T_\infty) = m(300) = \sqrt{4 \cdot 2.041 \times 10^{-7} \cdot 2.7 \times 10^7} = 4.69$ m⁻¹ (decay length $\sim 21.3$ cm)

The 17× variation in local decay rate across the rod's length signals a **fundamentally nonlinear regime** — no single linearization point is uniformly accurate.

**Step 2 — Closed-form anchor (linearized limit).**

Replace $T^4 - T_\infty^4$ by $4 T_{\rm ref}^3 (T - T_\infty)$ for a chosen reference $T_{\rm ref}$. The ODE becomes the standard fin equation
$$T''(x) - m_{\rm ref}^2\,(T - T_\infty) = 0,\qquad m_{\rm ref} = \sqrt{4 a T_{\rm ref}^3}.$$
With Dirichlet BCs at both ends, the solution is
$$T_{\rm lin}(x) - T_\infty = (T_h - T_\infty)\,\frac{\sinh\bigl(m_{\rm ref}(L-x)\bigr)}{\sinh(m_{\rm ref} L)},$$
giving the centerpoint value
$$T_{\rm lin}(L/2) = T_\infty + (T_h - T_\infty)\,\frac{\sinh(m_{\rm ref} L/2)}{\sinh(m_{\rm ref} L)}.$$

Three plausible references and the corresponding predictions:

| $T_{\rm ref}$ (K) | $m_{\rm ref}$ (m⁻¹) | $m_{\rm ref} L$ | $T_{\rm lin}(L/2)$ (K) |
|---|---|---|---|
| $T_h = 2000$ | 80.83 | 16.17 | $\approx 300.5$ (decoupled, $\sinh(8)/\sinh(16.17) \to 0$) |
| $T_\infty = 300$ | 4.694 | 0.939 | 1064.2 |
| $(T_h+T_\infty)/2 = 1150$ | 35.43 | 7.085 | 350.1 |

These three answers — 300, 350, 1064 — span a factor of 3.5 and bracket the truth from both sides, but **none agrees with the truth at the 5% level**. This is the principal trap: no choice of single reference temperature linearizes the radiation term consistently across the rod.

**Step 3 — Energy first integral (autonomous-ODE structure).**

The ODE $T'' = a(T^4 - T_\infty^4)$ is autonomous (no explicit $x$). Multiply by $T'$ and integrate:
$$\frac{1}{2}(T')^2 = a\!\left(\frac{T^5}{5} - T_\infty^4 T\right) + E,$$
with $E$ a constant of motion. This is a *first integral* but does not yield a closed-form $T(x)$ because the integrand
$$\int \frac{dT}{\sqrt{2 a (T^5/5 - T_\infty^4 T) + 2E}}$$
is hyperelliptic in general (5th-degree polynomial under the square root, non-elementary). The first integral reduces the BVP to one nonlinear quadrature equation
$$L = \int_{T_\infty}^{T_h}\frac{dT}{\sqrt{2 a (T^5/5 - T_\infty^4 T) + 2E}}$$
that fixes $E$, followed by another numerical quadrature
$$L/2 = \int_{T(L/2)}^{T_h}\frac{dT}{\sqrt{2 a (T^5/5 - T_\infty^4 T) + 2E}}$$
that yields $T(L/2)$. Numerical solve required.

**Step 4 — Centered finite-difference discretization of the nonlinear BVP.**

Discretize $[0, L]$ with $N+1$ uniform nodes $x_i = i\,h$, $h = L/N$. Use second-order centered differences for $T''$:
$$\frac{T_{i-1} - 2 T_i + T_{i+1}}{h^2} = a\,(T_i^4 - T_\infty^4),\qquad i = 1,\ldots,N-1,$$
with $T_0 = T_h$, $T_N = T_\infty$. Newton iteration on the residual vector
$$R_i(\mathbf{T}) = T_{i-1} - 2 T_i + T_{i+1} - a h^2\,(T_i^4 - T_\infty^4)$$
with Jacobian $\partial R_i/\partial T_j$ tridiagonal: off-diagonals $+1$, diagonal $-2 - 4 a h^2 T_i^3$. For $T > 0$ the diagonal is strictly negative and the Jacobian is irreducibly diagonally dominant (equivalently, $-J$ is an irreducibly diagonally dominant M-matrix in the standard sign convention), so each Newton step is uniquely invertible. From the linear interpolant initial guess $T_i^{(0)} = T_h + (T_\infty - T_h)\,x_i/L$, Newton converges in $\approx 7$ iterations to $\|\Delta T\|_\infty < 10^{-10}$ (verified numerically). The discretization is consistent at order $h^2$ at smooth interior points [LeVeque, 2007].

**Step 5 — Mesh-resolved values + cross-checks.**

Refinement table for $T(L/2)$:

| $N$ | $h$ (m) | $T(L/2)$ (K) | gap to next |
|---|---|---|---|
| 1 000 | $2.000\times 10^{-4}$ | 663.681772 | $-1.06\times 10^{-3}$ |
| 4 000 | $5.000\times 10^{-5}$ | 663.680708 | $-6.7\times 10^{-5}$ |
| 16 000 | $1.250\times 10^{-5}$ | 663.680641 | $-4\times 10^{-6}$ |
| 64 000 | $3.125\times 10^{-6}$ | 663.680637 | — |

Successive gaps shrink by factor $\sim 16$ per $4\times$ mesh refinement, consistent with **second-order convergence at nodes** ($h \to h/4$, error $\to$ error$/4^2 = $ error$/16$). Aitken $\Delta^2$ extrapolation: $T(L/2)_\infty = 663.6806$ K. For clean $h^2$ convergence under $4\times$ refinement, the $N = 16\,000$ error is estimated by $(16/15)|T_{16k} - T_{64k}| \approx 4.3 \times 10^{-6}$ K. The distance from the converged value to the 3-sig-fig rounding boundary at $T = 663.5$ K is $\approx 0.18$ K, more than four orders of magnitude larger than the discretization uncertainty — the rounded answer at 3 sig figs is robust.

**Independent sanity check 1 — Small-contrast linear limit.**
Set $T_h = 305$ K, $T_\infty = 300$ K. The Newton's-law-of-cooling replacement (matching equilibrium at $T_\infty$, $T^4 - T_\infty^4 \to 4 T_{\rm ref}^3 (T-T_\infty)$) becomes increasingly accurate as $T_h - T_\infty \to 0$. FD computation gives $T(L/2) = 302.244$ K; the replacement-linearized formula at $T_{\rm ref} = 302.5$ K gives $302.242$ K. The $\sim 0.002$ K residual matches the expected size of the second-order correction $\sim (T_h - T_\infty)^2/T_\infty \sim 0.08$ K modulated by the small profile-amplitude factor — confirming the FD solver and the replacement-linearized formula agree to leading order in their common small-contrast limit.

**Independent sanity check 2 — Energy first integral.**
At the FD solution, evaluate
$$E_i \equiv \tfrac{1}{2}(T'_i)^2 - a\bigl(T_i^5/5 - T_\infty^4 T_i\bigr),\qquad T'_i = \frac{T_{i+1} - T_{i-1}}{2h},$$
at each interior node $i = 1, \ldots, N-1$ at $N = 16\,000$. The relative variation $\max_i|E_i - \overline{E}|/|\overline{E}| \le 8 \times 10^{-5}$, consistent with discretization-order conservation of the continuous first integral. (A discrete solution does not conserve the continuous invariant exactly; small variation is a useful diagnostic of solver quality, not a proof of conservation.)

**Independent sanity check 3 — Monotonicity of the discrete profile.**
The discrete temperatures $T_0 \ge T_1 \ge \cdots \ge T_N$ throughout (no spurious oscillations or overshoots), as expected physically since heat flows down the temperature gradient and the only loss is monotone in $T$.

**Step 6 — Convergence summary and final uncertainty.**

Aitken $\Delta^2$ extrapolation on the $N \in \{1000, 4000, 16000\}$ sequence (using the second-order rate identified in Step 5):
$$T(L/2)_\infty \approx T_{4000} - \frac{(T_{4000} - T_{1000})^2}{T_{16000} - 2 T_{4000} + T_{1000}} = 663.6806 \text{ K},$$
which agrees with the $N = 64\,000$ value to within $4\times 10^{-6}$ K. Discretization uncertainty $\sim 4 \times 10^{-6}$ K, more than four orders of magnitude below the rounding boundary at $663.5$ K.

**Comparison to naive linearizations.**
Truth: $T(L/2) = 663.68$ K. Newton's-law-of-cooling replacement at $T_{\rm ref} \in \{T_h,\ (T_h+T_\infty)/2,\ T_\infty\}$ gives $\{300.5,\ 350.1,\ 1064.2\}$ K — relative errors $\{54.7\%,\ 47.3\%,\ 60.3\%\}$. No single-reference linearization is within an order of magnitude of the standard 5% tolerance for "close to correct"; the linearization shortcut is uncontrolled across the three natural reference choices.

**Final Answer: $T(L/2) = 664 \text{ K}$.**

---

## References

1. Ciarlet, P. G. (2002). *The Finite Element Method for Elliptic Problems*. SIAM. — Galerkin stability for monotone nonlinearities.
2. Strang, G., & Fix, G. J. (1973). *An Analysis of the Finite Element Method*. Prentice-Hall.
3. Quarteroni, A., Sacco, R., & Saleri, F. (2007). *Numerical Mathematics* (2nd ed.). Springer. — Aitken Δ², Newton iteration for nonlinear systems.
4. Kreith, F., & Bohn, M. S. (2010). *Principles of Heat Transfer* (7th ed.). Cengage. — Fin equations, radiative boundary conditions.
5. Modest, M. F. (2013). *Radiative Heat Transfer* (3rd ed.). Academic Press. — Stefan–Boltzmann radiation.
6. LeVeque, R. J. (2007). *Finite Difference Methods for Ordinary and Partial Differential Equations*. SIAM. — Centered FD on uniform grids; tridiagonal Newton step; M-matrix property.

---

## Predicted Failure Modes

**Mode A (primary trap) — Linearize $T^4$ at the heated end ($T_{\rm ref} = T_h$).**
Yields $T(L/2) = 300$ K. Off by 54.7%. **Clear stumble.**

**Mode B — Linearize $T^4$ at ambient ($T_{\rm ref} = T_\infty$).**
Yields $T(L/2) = 1064$ K. Off by 60.3%. **Clear stumble.**

**Mode C — Linearize $T^4$ at the mean reference temperature.**
Yields $T(L/2) = 350$ K. Off by 47.3%. **Clear stumble.**

**Mode D — Iterate linearization (lagged-coefficient method without convergence to nonlinear solution).**
Use $T_{\rm ref} = T(L/2)_{\rm previous}$, repeat. After ~5 iterations may converge to within 5% of truth, but only if the iteration is accelerated (Anderson, etc.); plain successive-substitution often diverges or oscillates. Borderline, depends on iteration scheme.

**Mode E — Direct nonlinear BVP solve (FD + Newton, FEM + Newton, shooting).**
**Pass.**

**Mode F — Energy first integral + numerical quadrature.**
**Pass** (multi-step but valid; rare since it requires recognizing the autonomous structure).

---

## Peacock submission-rule alignment check

Per `feedback_peacock_matt_format_rules.md`:

- ✓ **Sig figs:** Answer at 3 sf. All input values at 3+ sf: $k=100$ (interpreted as 3 sf — formally specify $1.00\times 10^2$ if reviewer flags), $\epsilon=0.900$, $P/A=400$ (formally $4.00\times 10^2$), $T_\infty=300$ (formally $3.00\times 10^2$), $L=0.200$, $T_h=2000$ (formally $2.00\times 10^3$).
- ✓ **Units:** K, $\text{W/(m}\cdot\text{K)}$, $\text{m}^{-1}$, m — explicit.
- ✓ **All terms defined:** $T$, $k$, $\epsilon$, $\sigma$ (Stefan–Boltzmann constant, named), $P$, $A$ (with $P/A$ given numerically), $T_\infty$, $T_h$, $L$.
- ✓ **LaTeX format:** units inside `$...$`, wrapped in `\text{}`, `\cdot` between unit components, no spurious `~` issues. (To be verified in HAI rendering.)
- ✓ **Standard suffix appended.**
- ✓ **No "weak" / "small" / "perturbation" / "linearize" hints.** The prompt does NOT mention linearization or any approximation; the model must independently decide whether $T^4$ can be linearized.
- ✓ **Continuous domain.** Single verifiable answer.
- ✓ **Trap >>5% gap:** 47–60% on every linearization choice.

---

## Design notes

- **Why parameters $T_h=2000, T_\infty=300, L=0.200, k=100, P/A=400$.** Chosen to make $m_{\rm ref} L$ vary from $\sim 1$ at $T_\infty$ to $\sim 16$ at $T_h$ — a 16× range in fin-Biot-number across the rod. Linearization at any single reference is dramatically wrong somewhere along the rod, and the midpoint sits in a regime where all three natural references miss badly.
- **Why this design might still fail.** Models with code execution solve this trivially (1D nonlinear BVP with $\sim 1000$ nodes is seconds-fast). Frontier models without code may either (a) recognize the autonomous-ODE first integral and reduce to a quadrature root-find (correct), or (b) fall into one of the linearization modes (stumble). The trap depends on whether HAI panel models default to "Newton's law of cooling" thinking or recognize the regime where it fails.
- **Pre-test plan.** Run prompt against GPT-5.5 + Opus 4.7 fresh-context API. If both pass via Mode E or F: submit anyway, since panel composition includes weaker models that may still stumble. If either falls into A/B/C: trap is live, submit confidently.
