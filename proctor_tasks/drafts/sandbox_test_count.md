# Sandbox Test — Bound State Count (KG + Hulthén)

## Prompt for CLI sandbox test

Read ~/dev/coyote-math/proctor_tasks/prompts/cli_speed_rules.md and follow those rules. Then:

Navigate to the Handshake sandbox. Paste the prompt below and run against Model A. Report the final answers.

---

A spinless particle of rest mass $m = 938.3$ MeV/$c^2$ is described by the Klein-Gordon equation with equal Lorentz scalar and vector potentials, $S(r) = V(r)$, where

$$V(r) = -V_0\,(\hbar c)\alpha\,\frac{e^{-\alpha r}}{1 - e^{-\alpha r}}$$

with dimensionless depth $V_0 = 2.0$ and range parameter $\alpha = 0.500$ fm$^{-1}$. Use $\hbar c = 197.327$ MeV$\cdot$fm.

Under equal scalar-vector coupling, the radial Klein-Gordon equation for $s$-wave ($\ell = 0$) reduces to a Schrödinger-like equation with an energy-dependent effective potential proportional to $(E + mc^2)V(r)$.

Determine the total number of particle-branch ($0 < E < mc^2$) bound states for this system. Report your answer as a single integer.

---

## Correct answer: 7

Bound states at n=2 through n=8 (n=1 is supercritical, no particle-branch solution).

## Trap answers:
- 5 (treating coupling as energy-independent, replacing E+m with 2m)
- 6 (simple formula n_max = floor(sqrt(2*V0*m/(hca))))
- 8 (counting n=1 through n=8, including the supercritical n=1)
