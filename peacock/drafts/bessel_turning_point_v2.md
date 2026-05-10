# Bessel turning-point (transition-region) — Peacock Draft v2

**Source problem:** 915f73d1 (coyote-math Phoenix library — Debye vs Langer agreement)
**v1 status:** Abandoned 2026-05-08 at HAI — in-line plagiarism checker independently solved the v1 prompt and produced the correct constant ($L=0.45$), citing Math.SE and DLMF. Confirmed pre-submission concern that Watson's $J_\nu(\nu)\sim 2^{1/3}/(3^{2/3}\Gamma(2/3)\nu^{1/3})$ is too tabulated.
**v2 fix:** Shift evaluation off the turning point into the Airy transition layer at $kr=\nu+\nu^{1/3}$; answer becomes $2^{1/3}\operatorname{Ai}(-2^{1/3})\nu^{-1/3}$, an Airy value at a non-tabulated argument.
**TRIZ type:** REGIME (Debye/WKB applied inside the Airy transition layer where it gives the wrong sinusoidal value) + COMPUTATION (must execute Olver's connection rather than recall a constant).

---

## Prompt

In two-dimensional quantum scattering, the partial-wave radial wavefunction of angular momentum $\nu$ is $J_\nu(kr)$, where $J_\nu$ is the Bessel function of the first kind. The centrifugal barrier produces a classical turning point at $kr=\nu$.

For each positive integer $\nu$, define

$$f(\nu) = \nu^{1/3}\,J_\nu\!\left(\nu + \nu^{1/3}\right).$$

The sequence $f(\nu)$ converges as $\nu\to\infty$. Compute the exact value of

$$L = \lim_{\nu\to\infty} f(\nu).$$

Report $L$ as a number rounded to $2$ significant figures. Any intermediate calculations should be carried out to at least $5$ significant figures.

---

## Correct Answer

$$L = 2^{1/3}\,\operatorname{Ai}(-2^{1/3}) \approx 0.65347$$

To 2 sig figs: **$L\approx 0.65$**.

---

## Golden Solution

**Step 1 — Identify the regime.**
Set $z=1+\alpha\nu^{-2/3}$ with $\alpha=1$, so the argument is $\nu z=\nu+\nu^{1/3}$. As $\nu\to\infty$, $z\to 1^+$ — i.e.\ the argument sits inside the Airy transition layer of width $\nu^{-2/3}$ around the classical turning point $z=1$. Both the Debye expansion (oscillatory, valid bounded away from $z=1$) and the Bessel-Airy uniform Langer–Olver expansion are candidates; only the latter holds in this scaling.

**Step 2 — Langer–Olver uniform asymptotic (DLMF 10.20.4).**
With $\zeta(z)$ defined by
$$\tfrac{2}{3}(-\zeta)^{3/2}=\Psi(z):=\int_1^z\frac{\sqrt{t^2-1}}{t}\,dt\quad (z\ge 1),$$
the uniform expansion is
$$J_\nu(\nu z)=\nu^{-1/3}\!\left(\frac{4\zeta}{1-z^2}\right)^{1/4}\!\operatorname{Ai}(\nu^{2/3}\zeta)+O(\nu^{-1}),$$
valid uniformly for $z$ in compact subsets of $(0,\infty)$ including across the turning point $z=1$.

**Step 3 — Expand $\zeta$ near $z=1$.**
Writing $u=t-1$ and $\sqrt{t^2-1}/t\sim\sqrt{2u}$ as $t\to 1^+$:
$$\Psi(z)\sim \tfrac{2\sqrt{2}}{3}(z-1)^{3/2}.$$
Solving $\tfrac{2}{3}(-\zeta)^{3/2}=\tfrac{2\sqrt{2}}{3}(z-1)^{3/2}$ gives $-\zeta=2^{1/3}(z-1)$, hence
$$\zeta = -2^{1/3}(z-1) = -2^{1/3}\alpha\,\nu^{-2/3},\qquad \nu^{2/3}\zeta = -2^{1/3}\alpha.$$
With $\alpha=1$: $\nu^{2/3}\zeta = -2^{1/3}$.

**Step 4 — Limit of the prefactor.**
$$\frac{4\zeta}{1-z^2}=\frac{-4\cdot 2^{1/3}(z-1)}{(1-z)(1+z)}=\frac{4\cdot 2^{1/3}}{1+z}\xrightarrow[z\to 1]{}2^{4/3},$$
so $\bigl(4\zeta/(1-z^2)\bigr)^{1/4}\to 2^{1/3}$.

**Step 5 — Assemble the limit.**
$$J_\nu\!\left(\nu+\nu^{1/3}\right)=\nu^{-1/3}\cdot 2^{1/3}\cdot\operatorname{Ai}(-2^{1/3})+O(\nu^{-1}),$$
hence
$$L=\lim_{\nu\to\infty}\nu^{1/3}J_\nu\!\left(\nu+\nu^{1/3}\right)=2^{1/3}\,\operatorname{Ai}\!\left(-2^{1/3}\right).$$

**Step 6 — Numerical evaluation.**
Use the convergent power series for the Airy function: $\operatorname{Ai}(z)=c_1\,f(z)-c_2\,g(z)$ with
$$c_1=\frac{1}{3^{2/3}\Gamma(2/3)}=0.355028,\qquad c_2=\frac{1}{3^{1/3}\Gamma(1/3)}=0.258819,$$
and $f(z)=\sum_{k\ge 0}\frac{z^{3k}}{(3k)!!_3}$, $g(z)=\sum_{k\ge 0}\frac{z^{3k+1}}{(3k+1)!!_3}$ (the standard Airy power series).
At $z=-2^{1/3}=-1.25992$, $z^3=-2$ exactly, so the series telescope:
$$f(-2^{1/3})=1-\tfrac{2}{6}+\tfrac{4}{180}-\tfrac{8}{12960}+\tfrac{16}{1{,}710{,}720}-\cdots = 0.688281,$$
$$g(-2^{1/3})=-2^{1/3}+\tfrac{2.51984}{12}-\tfrac{5.03968}{504}+\tfrac{10.07936}{45360}-\cdots = -1.05971.$$
Hence
$$\operatorname{Ai}(-2^{1/3})=0.355028\cdot 0.688281-0.258819\cdot(-1.05971)=0.244373+0.274286=0.51866.$$
Therefore
$$L=2^{1/3}\cdot 0.51866=1.25992\cdot 0.51866=0.65347.$$
Rounded to 2 sig figs: $L\approx 0.65$.

**Final Answer: $0.65$**

---

## Predicted Failure Modes

**Mode A (primary trap) — Debye/WKB applied inside the transition layer.**
A model uses the Debye oscillatory formula for $z>1$:
$$J_\nu(\nu z)\sim\frac{1}{\sqrt{2\pi\nu}}(z^2-1)^{-1/4}\sin\!\left(\nu\Psi(z)+\tfrac{\pi}{4}\right).$$
At $z=1+\nu^{-2/3}$: $z^2-1\sim 2\nu^{-2/3}$, $\nu\Psi\sim\tfrac{2\sqrt{2}}{3}\approx 0.9428$, so
$$\nu^{1/3}J_\nu(\nu+\nu^{1/3})\sim\frac{2^{-1/4}}{\sqrt{2\pi}}\sin\!\left(\tfrac{2\sqrt{2}}{3}+\tfrac{\pi}{4}\right)=0.33126\to \mathbf{0.33}.$$
This is a coherent-but-wrong derivation: the formula is correctly recalled, the algebra is correctly executed, the answer is wrong by a factor of 2 because Debye has lost validity inside the Airy boundary layer.

**Mode B — Recall Watson at the turning point, ignore the $\nu^{1/3}$ shift.**
Model assumes $\nu+\nu^{1/3}\approx\nu$ for large $\nu$ (true for the leading number, false for the leading asymptotic), and applies $J_\nu(\nu)\sim 2^{1/3}\operatorname{Ai}(0)\nu^{-1/3}$. Wrong constant: $2^{1/3}\operatorname{Ai}(0)=2^{1/3}/(3^{2/3}\Gamma(2/3))=0.44731\to\mathbf{0.45}$.

**Mode C — Sign error on $\nu^{2/3}\zeta$.**
Model correctly sets up Langer but writes $\nu^{2/3}\zeta=+2^{1/3}$ (wrong sign for $z>1$ regime). Wrong answer: $2^{1/3}\operatorname{Ai}(+2^{1/3})\approx 1.26\cdot 0.106=\mathbf{0.13}$.

**Mode D — Right form, wrong $\alpha$ extraction.**
Model writes the answer as $2^{1/3}\operatorname{Ai}(-c\,\alpha)$ with $c\ne 2^{1/3}$ (e.g. $c=1$ or $c=2$), giving $2^{1/3}\operatorname{Ai}(-1)$ or $2^{1/3}\operatorname{Ai}(-2)$. Values: $2^{1/3}\cdot 0.5356=\mathbf{0.67}$ or $2^{1/3}\cdot 0.2274=\mathbf{0.29}$.

---

## References

1. **DLMF 10.20** — Bessel functions of large order; uniform asymptotic expansion in terms of Airy functions. URL: https://dlmf.nist.gov/10.20
   Equations 10.20.4 (Langer–Olver expansion), 10.20.10 (transition-region scaling).
   Required to solve: True.

2. **DLMF 9.4** — Airy function power series.
   URL: https://dlmf.nist.gov/9.4
   Required to solve: True (or equivalent series/quadrature for $\operatorname{Ai}(-2^{1/3})$).

3. **Olver, *Asymptotics and Special Functions* (1974), Ch. 11** — Uniform asymptotic expansions, derivation of the Bessel-Airy connection.
   Required to solve: False (DLMF suffices).

4. **Watson, *Theory of Bessel Functions* (1944), §8.43** — Transition formulas for $J_\nu$ near $\nu$.
   Required to solve: False.

---

## Design Notes

- **What v2 fixes vs v1.** v1's answer $0.45$ is Watson's classical constant — recallable from DLMF/A&S/Wikipedia/Math.SE. v2's answer $0.65=2^{1/3}\operatorname{Ai}(-2^{1/3})$ is a transition-region value at a non-canonical Airy argument; no standard table lists it. Recall path is blocked, computation path is required.
- **Trap separation.** Debye prediction $0.33$ vs Langer truth $0.65$ — $49\%$ relative error, well above the Peacock 5–10% threshold for a valid stumble.
- **Continuous-domain ✓.** Limit over integer $\nu\to\infty$, real-valued argument $\nu+\nu^{1/3}$, no small-$\nu$ brute-force escape (asymptotic limit, not a value).
- **Quasiclassical archetype ✓.** Trap is precisely the WKB-vs-uniform-WKB distinction inside the Airy boundary layer at the classical turning point — the canonical Olver/Langer scenario.
- **Specificity tactic (Fedor's principle).** "Two-dimensional quantum scattering" + "centrifugal barrier" + "transition-region $\nu+\nu^{1/3}$" diverts model bandwidth toward physics-recall about scattering rather than abstract Bessel asymptotics.
- **Anti-recall guard.** No closed-form constant in any standard reference matches $2^{1/3}\operatorname{Ai}(-2^{1/3})$. Numerical evaluation requires either the convergent Airy series (Step 6) or a numerical Airy routine; either path forces the model to commit to the Langer connection.
- **Pre-submission AI sanity check.** Before HAI submit: paste the prompt to a frontier model in isolation. If the model answers $0.65$ in one shot via direct Langer, the trap is too weak — pivot to a sharper $\alpha$ (e.g.\ $\alpha=2^{-1/3}\cdot 1.5$ giving $\operatorname{Ai}(-1.5)$, even less standard). If model answers $0.45$ (Mode B), $0.33$ (Mode A), or $\infty$/undefined, the trap is live.
- **LaTeX format:** all variables/numbers in $...$; no raw unicode math; explicit $\to\infty$ direction.
