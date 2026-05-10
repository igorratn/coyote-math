# Bessel turning-point — Peacock Draft v1

**Source problem:** 915f73d1 (coyote-math Phoenix library — Debye vs Langer agreement)
**Status:** Draft — not yet submitted; intended as quasiclassical-class candidate
**TRIZ type:** REGIME (Debye/WKB applied at the turning point where it diverges) + RECALL (Watson constant frequently misremembered with $\Gamma(1/3) \leftrightarrow \Gamma(2/3)$ swap)

---

## Prompt

For each positive integer $\nu$, let $J_\nu$ denote the Bessel function of the first kind of order $\nu$. Define

$$f(\nu) = \nu^{1/3}\, J_\nu(\nu).$$

The sequence $f(\nu)$ converges as $\nu\to\infty$. Compute the exact value of

$$L = \lim_{\nu\to\infty} f(\nu).$$

Report $L$ as a number rounded to $2$ significant figures. Any intermediate calculations should be carried out to at least $5$ significant figures.

---

## Correct Answer

$$L = \frac{2^{1/3}}{3^{2/3}\,\Gamma(2/3)} \approx 0.44731$$

To 2 sig figs: **$L \approx 0.45$**.

---

## Golden Solution

**Step 1 — Why the Debye/WKB form fails at $z=1$.**
The Debye leading asymptotic for $J_\nu(\nu z)$ valid in the classically forbidden region $0<z<1$ is
$$J_\nu(\nu z) \sim \frac{1}{\sqrt{2\pi\nu}}\,(1-z^2)^{-1/4}\,\exp(-\nu\Phi(z)),\qquad \Phi(z)=\int_z^1\frac{\sqrt{1-t^2}}{t}\,dt.$$
At the classical turning point $z=1$ both factors fail: $(1-z^2)^{-1/4}\to\infty$ and $\Phi(1)=0$, so the formula gives $\infty\cdot 1$. This divergence is the standard Stokes-line caustic of WKB and signals that a uniform (Langer) treatment is required.

**Step 2 — Langer uniform asymptotic.**
Define $\zeta(z)$ by
$$\tfrac{2}{3}\zeta^{3/2}=\Phi(z)\quad(0<z\le 1),\qquad \tfrac{2}{3}(-\zeta)^{3/2}=\int_1^z\frac{\sqrt{t^2-1}}{t}\,dt\quad(z\ge 1).$$
The Langer–Olver expansion (DLMF 10.20.4) is uniform in compact subsets of $(0,\infty)$:
$$J_\nu(\nu z) = \nu^{-1/3}\left(\frac{4\zeta}{1-z^2}\right)^{1/4}\!\operatorname{Ai}(\nu^{2/3}\zeta) + O(\nu^{-1}).$$

**Step 3 — Evaluate the prefactor at $z=1$.**
Near $z=1$, expand $\sqrt{1-t^2}/t \sim \sqrt{2(1-t)}$, giving
$$\Phi(z) \sim \tfrac{2\sqrt{2}}{3}(1-z)^{3/2},\qquad \zeta \sim 2^{1/3}(1-z).$$
Hence
$$\frac{4\zeta}{1-z^2}=\frac{4\cdot 2^{1/3}(1-z)}{(1-z)(1+z)} \xrightarrow[z\to 1]{} \frac{4\cdot 2^{1/3}}{2}=2^{4/3},$$
so the prefactor limit is $(2^{4/3})^{1/4}=2^{1/3}$.

**Step 4 — Airy value at the turning point.**
At $z=1$, $\zeta=0$, so $\nu^{2/3}\zeta=0$ for every $\nu$, and
$$\operatorname{Ai}(0)=\frac{1}{3^{2/3}\,\Gamma(2/3)}.$$

**Step 5 — Assemble the limit.**
Combining Steps 2–4:
$$J_\nu(\nu) = \nu^{-1/3}\cdot 2^{1/3}\cdot\frac{1}{3^{2/3}\Gamma(2/3)} + O(\nu^{-1}),$$
hence
$$L=\lim_{\nu\to\infty}\nu^{1/3}J_\nu(\nu)=\frac{2^{1/3}}{3^{2/3}\Gamma(2/3)}.$$

**Step 6 — Numerical evaluation.**
$2^{1/3}=1.25992$, $3^{2/3}=2.08008$, $\Gamma(2/3)=1.35412$. Hence
$$L=\frac{1.25992}{2.08008\times 1.35412}=\frac{1.25992}{2.81668}=0.44731.$$
Rounded to 2 sig figs: $L\approx 0.45$.

**Final Answer: $0.45$**

---

## Predicted Failure Modes

**Mode A — Debye/WKB premature application.**
A model proceeds with the Debye expansion and reports "diverges" or "undefined" because $(1-z^2)^{-1/4}\to\infty$ at $z=1$. Likely wrong answers: $\infty$, $0$ (from the $e^{-\nu\Phi}$ factor with $\Phi(1)=0$, then mishandling), or "limit does not exist".

**Mode B — Wrong gamma ($\Gamma(1/3)\leftrightarrow\Gamma(2/3)$).**
Watson's leading constant pairs with $\Gamma(2/3)$; the *derivative* constant for $J'_\nu(\nu)$ pairs with $\Gamma(1/3)$. Models conflate the two. Wrong constant: $2^{1/3}/(3^{2/3}\Gamma(1/3))=1.25992/(2.08008\times 2.67894)=0.22617\to$ **0.23**.

**Mode C — Wrong power of $2$.**
Some references state the result with $2^{-1/3}$ in the numerator (different convention chain). Wrong constant: $2^{-1/3}/(3^{2/3}\Gamma(2/3))=0.79370/2.81668=0.28178\to$ **0.28**.

**Mode D — Wrong exponent in $\nu^{1/3}$ scaling.**
Models that fudge the Langer/Debye crossover sometimes get $J_\nu(\nu)\sim \nu^{-1/2}$ (using Stirling or naive saddle-point at coalescing critical points). Then $\nu^{1/3}J_\nu(\nu)\to 0$. Wrong answer: **0**.

---

## References

1. **DLMF 10.19.3** — $J_\nu(\nu) \sim 2^{1/3}/[3^{2/3}\Gamma(2/3)\,\nu^{1/3}]$.
   URL: https://dlmf.nist.gov/10.19#E3
   Required to solve: True (or equivalent derivation).

2. **DLMF 10.20.4** — Langer–Olver uniform asymptotic for $J_\nu(\nu z)$.
   URL: https://dlmf.nist.gov/10.20#E4
   Required to solve: True.

3. **DLMF 9.2.6** — $\operatorname{Ai}(0)=1/[3^{2/3}\Gamma(2/3)]$.
   URL: https://dlmf.nist.gov/9.2#E6
   Required to solve: True.

4. **Watson, *Theory of Bessel Functions* (1944), §8.21** — original derivation.
   Required to solve: False (DLMF suffices).

---

## Design Notes

- **Continuous-domain ✓.** Limit $\nu\to\infty$ with no small-$\nu$ brute-force escape.
- **Quasiclassical archetype ✓.** Trap is exactly the Stokes-line/turning-point failure of WKB → forces Langer (uniform WKB).
- **Specific number, 2 sig figs ✓.** Plausible wrong answers $\{0,\,0.23,\,0.28,\,0.45,\,\infty\}$ are spread by >1 sig fig — clean discrimination.
- **CONCERN — recall risk.** $J_\nu(\nu)$ at large $\nu$ is Watson's classical formula, in DLMF/A&S/Wikipedia. Frontier models with strong recall may bypass the trap. **Test priority:** submit and see if the constant is recalled correctly; if all 5 models pass, fall back to a less-tabulated target (next-order correction, derivative $J'_\nu(\nu)$, or asymptotic spacing of Bessel zeros near $\nu$).
- **Backup target if recall bypass dominates:** $\lim_{\nu\to\infty}\nu^{5/3}J'_\nu(\nu)=-2^{2/3}/[3^{1/3}\Gamma(1/3)]\approx -0.41$. Same trap mechanism, less-known constant, sign-flip subtrap.
- **LaTeX format:** all variables/numbers in $...$; $\Gamma(2/3)$ etc. consistently in math mode.
