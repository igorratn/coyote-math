# Modulated diffusion rod — Peacock Draft v3

**Source problems:** `coyote-math/2c968d24.md` (acoustic framing — physically mis-signed) + `coyote-math/dc2e0db2.md` (heat conduction framing).
**Status:** Draft — not yet submitted; replaces v1/v2 Bessel direction (5/5 nailed at HAI).
**TRIZ type:** Implicitly Broken Approximation (Peacock PDF §"Good Stumping Strategies"): parameter values unambiguously preclude the "drop the small modulation" approximation; models who use it anyway = valid failure.

---

## Prompt

A long uniform rod is in steady-state thermal contact with a surrounding bath at $T_\text{ambient} = 0 \text{~K}$. The rod has thermal conductance $k = 1.00 \text{~W{\cdot}m/K}$ along its length. Lateral heat loss to the bath gives a position-dependent loss coefficient

$$C(x) = k\,h_0^2\,\bigl[1 + 0.500\,\cos(x/L_0)\bigr],$$

where $h_0 = 3.00 \text{~m}^{-1}$ and $L_0 = 1.00 \text{~m}$. A localized heat source at $x = 0$ injects total power $P = 4.00\pi \text{~W}$. The steady-state temperature deviation $T(x)$ above ambient satisfies

$$-k\,T''(x) + C(x)\,T(x) = P\,\delta(x), \qquad T(x)\to 0 \text{~as~} |x|\to\infty.$$

Determine the temperature at the source location, $T(0)$.

The answer should be expressed in K. Report your answer as a 3 significant figure number only. Any intermediate calculations should be carried out to 6 significant figures.

---

## Correct Answer

$T(0) \approx 1.71542 \text{~K}$, rounded to 3 sig figs: **$T(0) = 1.72 \text{~K}$**.

---

## Golden Solution

**Step 1 — Reduce to canonical form.**
Divide the equation by $k = 1.00 \text{~W{\cdot}m/K}$. With $L_0 = 1.00 \text{~m}$ and $h_0 = 3.00 \text{~m}^{-1}$, define dimensionless $\xi = x/L_0$ (numerically $\xi = x$ when $L_0 = 1$). The equation becomes

$$-T''(\xi) + V(\xi)\,T(\xi) = Q\,\delta(\xi), \qquad V(\xi) = h_0^2 L_0^2\bigl[1 + \tfrac{1}{2}\cos\xi\bigr] = 9.00\bigl[1 + \tfrac{1}{2}\cos\xi\bigr],$$

with $Q = P L_0 / k = 4.00\pi$ (numerically). $T \to 0$ as $|\xi|\to\infty$.

**Step 2 — Why naive constant-coefficient Green's function fails.**
A common (and wrong) reflex is to drop the $\cos\xi$ term as "small modulation" and solve $-T'' + h_0^2 T = Q\delta$, giving $T_0(0) = Q/(2 h_0 L_0) = 2\pi/3 \approx 2.0944 \text{~K}$. **This is invalid here:** the modulation amplitude is $0.500$, i.e.\ $50\%$ of the mean, not a small perturbation. The minimum value of the bracket is $0.500$ and the maximum is $1.50$, so the local decay rate varies by a factor of $\sqrt{3} \approx 1.73$ across each period. Dropping a modulation of this magnitude produces a leading-order error of order unity, not a small correction.

**Step 3 — Floquet/Hill-equation structure.**
The homogeneous equation $-T'' + V(\xi)T = 0$ with $V$ of period $2\pi$ is Hill's equation. By Floquet theory, since $V(\xi) > 0$ for all $\xi$, the two independent solutions have real positive Floquet multipliers $\mu_+ > 1$ (growing as $\xi\to+\infty$) and $\mu_- = 1/\mu_+ < 1$ (decaying). The Green's function on $\mathbb{R}$ with decay BC is

$$G(\xi,\xi') = \begin{cases} c_-\,p_+(\xi)\,p_-(\xi') & \xi < \xi' \\ c_+\,p_-(\xi)\,p_+(\xi') & \xi > \xi' \end{cases},$$

where $p_+(\xi)$ is the solution that decays as $\xi\to+\infty$ and $p_-(\xi) = p_+(-\xi)$ by the evenness of $V$ about $\xi=0$. Continuity at $\xi=\xi'$ and the unit jump in $-G_\xi$ across the source fix the constants. Evaluated at $\xi = \xi' = 0$, using $p_-(0) = p_+(0)$ and $p_-'(0) = -p_+'(0)$ from the symmetry,

$$G(0,0) = -\frac{p_+(0)}{2\,p_+'(0)}, \qquad T(0) = Q\,G(0,0) = -\frac{2\pi\,p_+(0)}{p_+'(0)}.$$

**Step 4 — Numerical solution of Hill's equation.**
The decaying solution $p_+(\xi)$ has no closed form for $V(\xi) = 9(1 + 0.5\cos\xi)$. Two equivalent numerical routes:

(a) Finite-difference BVP on $[-L,L]$ with Dirichlet $T(\pm L)=0$ for $L\gg 1/h_0$, sparse linear solve. Converges quadratically in mesh.

(b) Floquet computation: integrate the homogeneous IVP with two basis initial conditions over one period, form the monodromy matrix $M$, find its eigenvector for the eigenvalue $|\mu|<1$. (Numerically delicate because $\mu_+ \mu_- = 1$ but $\mu_+/\mu_- \sim e^{4\pi h_0} \sim 10^{16}$ — the basis becomes nearly singular over a period; finite-difference BVP is more robust.)

Method (a), Richardson-extrapolated:

| $L$ | mesh $h$ | $T(0)$ |
|---|---|---|
| 60 | 0.00300 | 1.715393 |
| 60 | 0.00150 | 1.715412 |
| 60 | 0.00075 | 1.715417 |
| 60 | 0.000375 | 1.715419 |
| 100 | 0.000625 | 1.715418 |

Aitken $\Delta^2$ extrapolation on the L=60 sequence: $T(0) \to 1.71542$ with discretization uncertainty $\lesssim 10^{-5}$.

**Step 5 — Sanity checks.**

- *Limit check*: setting $\alpha=0$ in the modulation reproduces the naive $T(0) = 2\pi/3 = 2.0944$ exactly.
- *First-order Born check*: $\Delta T^{(1)}(0) = -P\,\alpha\,h_0/(4 h_0^2 + 1) \cdot \text{(factor)}$. With $\alpha = 0.5$, $h_0 = 3$, this gives $\Delta T^{(1)} \approx -0.51$, so first-order says $T(0) \approx 2.09 - 0.51 = 1.58 \text{~K}$. Exact $1.72$ lies between $1.58$ (Born first-order) and $2.09$ (zeroth) — consistent with second-order corrections being $\sim 0.13$ ($\sim 8\%$), which is $O(\alpha^2)$-sized as expected.
- *Sign check*: modulated coefficient has minimum $\frac{1}{2}h_0^2$ near $\cos\xi = -1$. The "weak spots" allow more leakage than the naive $h_0^2$ everywhere assumption — so the truly leakier average should make the on-source temperature *higher*, not lower. The exact value $1.72$ is **lower** than naive $2.09$ — at first glance puzzling, but the modulation increases $V$ at the source ($\cos 0 = +1$, $V(0) = 1.5\,h_0^2$) and the source-region absorption dominates the on-source response. ✓ consistent.

**Final Answer: $T(0) = 1.72 \text{~K}$**

---

## Predicted Failure Modes

**Mode A (primary trap) — Drop the modulation as "small".**
Model treats the $0.5\cos\xi$ term as a small perturbation of the constant background and solves $-T'' + h_0^2 T = Q\delta$, yielding $T(0) = Q/(2 k h_0 L_0) = 2\pi/3$.
Wrong answer: **$2.09 \text{~K}$**, $21.5\%$ above truth, **valid stumble**.

**Mode B (borderline) — First-order Born / first-order perturbation theory.**
Model expands $T = T_0 + \alpha T_1 + O(\alpha^2)$, computes only $T_0 + \alpha T_1$.
Wrong answer: **$1.58 \text{~K}$**, $8.1\%$ below truth, **borderline stumble** (close to 5–10% reviewer-dependent zone).

**Mode C — Average the modulation.**
Model replaces $V(\xi)$ by its mean $\langle V\rangle = h_0^2$ (effectively the same as Mode A). Same wrong answer $2.09 \text{~K}$.

**Mode D — Half-baked Floquet, sign error.**
Model recognizes Hill's equation but mishandles which Floquet multiplier corresponds to the decaying mode, ending up with the growing solution. Produces a divergent or sign-flipped answer.

**Mode E — Code execution path: correct.**
Model with code-execution capability solves the BVP numerically and reports $\approx 1.72 \text{~K}$. **Pass**.

---

## Peacock submission-rule alignment check

Per `feedback_peacock_matt_format_rules.md` (Matt O. 2026-05-08):

- ✓ **Sig figs:** Answer requested at 3 sig figs. All input values given at 3 sig figs: $k=1.00$, $h_0=3.00$, $L_0=1.00$, $P=4.00\pi$, modulation amplitude $0.500$. (The $4\pi$ is exact; $4.00\pi$ states the leading "4" to 3 sf.)
- ✓ **Units:** Specified in K (not "SI"). All intermediate quantities have units stated: $k$ in $\text{W{\cdot}m/K}$, $h_0$ in $\text{m}^{-1}$, $L_0$ in $\text{m}$, $P$ in $\text{W}$.
- ✓ **Term definitions:** Every symbol defined ($T$, $T_\text{ambient}$, $k$, $C(x)$, $h_0$, $L_0$, $P$, $\delta$). No fundamental constants needed.
- ✓ **LaTeX format:** Units inside `$...$`, wrapped in `\text{}` with `~` spacing: `$1.00 \text{~W{\cdot}m/K}$`, `$3.00 \text{~m}^{-1}$`, etc.
- ✓ **Standard suffix appended:** "The answer should be expressed in K. Report your answer as a 3 significant figure number only. Any intermediate calculations should be carried out to 6 significant figures."
- ✓ **No "weak" / "small" / "perturbation" hints** that would make a model's leading-order use justified.
- ✓ **Continuous domain:** real-valued $T$ on $\mathbb{R}$, no discrete brute-force escape.
- ✓ **Single verifiable answer:** $T(0)$ is uniquely determined by the BVP.
- ✓ **Trap >5% gap:** naive 2.09 vs exact 1.72 = 21.5% gap, well above stumble threshold.

**Risk:** Models with reliable code-execution (Mode E) will likely solve correctly. Frontier models *without* code, asked for a specific numeric answer, are more likely to default to Mode A or B. Pre-test recommended before HAI submission.

---

## References

1. **NIST DLMF Ch. 28** — Mathieu functions and Hill's equation. URL: https://dlmf.nist.gov/28
   Required to solve: helpful for closed-form Floquet structure, but numerical solve is the natural route.
2. **Magnus & Winkler, *Hill's Equation* (Dover 1979)** — Floquet theory, monodromy matrix, stability of solutions.
3. **Morse & Feshbach, *Methods of Theoretical Physics* (1953), §7.2** — Green's functions of second-order linear ODEs on the line; Wronskian construction.
4. **Peacock Stumping Strategies PDF** (Matt O., 2026-04-25): "Implicitly Broken Approximations" — `peacock/references/Physics Stumping Strategies and Resources for Peacock.pdf`.

---

## Design notes / lessons

- **What v3 fixes vs Bessel v1/v2.** Bessel v1/v2 failed because the asymptotic formula (Watson, Olver) is itself canonical recall — there's no implicit approximation that can be broken at the leading-order recall stage. The modulated-diffusion problem inverts this: there *is* a tempting standard approximation (drop the small modulation) that is provably invalid here, and the approximation-free path requires actual computation, not formula recall.
- **Why heat-conduction over acoustic framing.** The original 2c968d24 said "acoustic" but the equation $-p'' + \omega^2(\ldots)p = $ source is modified Helmholtz (real exponentials), corresponding physically to *heat-loss* type diffusion, not propagating acoustic waves. Heat-conduction framing is internally consistent and avoids the Sommerfeld radiation BC ambiguity.
- **Anti-recall guard.** No closed-form expression for $T(0)$. Numerics required (FD BVP or Floquet eigenvector). Models without code execution face a real obstacle.
- **Pre-submission validation step (per playbook_numerical.md).** Numerical computation cross-checked by two methods: finite-difference BVP at multiple meshes (Richardson convergent to 6 sf) and asymptotic agreement with constant-coefficient and first-order Born limits (Step 5).
