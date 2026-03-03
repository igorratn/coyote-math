# Project Proctor Task — Physics Domain
**Source problem:** `34b8ebad.md` (Sine-Gordon / DNA torsional dynamics)

---

## STEP 0 — Domain

**Domain:** Physics
**Subdomain:** Condensed Matter Physics

---

## STEP 1 — Prompt

In a torsional DNA model (Yakushevich-type) without external torque, the base-pair twist angle $\Theta(x,t)$ satisfies the damped sine–Gordon equation

$$\Theta_{tt} + \gamma\Theta_t - c^2\Theta_{xx} + \sin\Theta = 0, \quad x \in \mathbb{R},$$

where $\gamma > 0$ models viscous drag from the solvent and $c > 0$ is the torsional wave speed. Assume zero topological (winding) number, so that $\Theta(+\infty, t) = \Theta(-\infty, t) \in 2\pi\mathbb{Z}$ for all $t$.

The chain is prepared at rest with a spatially uniform overtwist:

$$\Theta(x, 0) = 3\pi + \varepsilon, \qquad \Theta_t(x, 0) = 0,$$

where $\varepsilon > 0$ is small. What is $\displaystyle\lim_{t \to +\infty} \Theta(x,t)$? Express your answer as a multiple of $\pi$.

---

## STEP 4 — Model Failure Rationale

**Predicted failure (both models):** Models are expected to answer $2\pi$ by reasoning that $3\pi + \varepsilon$ lies just above the saddle at $3\pi$, and the "nearest equilibrium going down" is $2\pi$. The critical error is failing to compute the sign of the initial angular acceleration: $\ddot\vartheta(0) = -\sin(3\pi + \varepsilon) = +\sin\varepsilon > 0$, meaning the angle *increases* initially, rolling into the $4\pi$ basin rather than the $2\pi$ basin. A secondary failure is not applying an energy barrier argument to confirm the system cannot escape past $5\pi$.

---

## STEP 6 — Step-by-Step Solution + Final Answer

**Step 1: Reduce the PDE to an ODE**

Because the initial data are spatially uniform — $\Theta(x,0) = 3\pi + \varepsilon$ and $\Theta_t(x,0) = 0$ for all $x$ — the spatial Laplacian term $c^2\Theta_{xx}$ vanishes identically at $t = 0$ and, by uniqueness, for all $t > 0$. The PDE therefore reduces to the autonomous second-order ODE for $\vartheta(t) \equiv \Theta(x,t)$:

$$\ddot\vartheta + \gamma\dot\vartheta + \sin\vartheta = 0, \qquad \vartheta(0) = 3\pi + \varepsilon, \quad \dot\vartheta(0) = 0.$$

This is a damped nonlinear pendulum equation.

**Step 2: Lyapunov energy function**

Define the mechanical energy

$$E(t) = \tfrac{1}{2}\dot\vartheta^2 + V(\vartheta), \qquad V(\vartheta) = 1 - \cos\vartheta.$$

Differentiating along solutions and substituting the ODE:

$$\dot E = \dot\vartheta\ddot\vartheta + \dot\vartheta\sin\vartheta = \dot\vartheta(\ddot\vartheta + \sin\vartheta) = -\gamma\dot\vartheta^2 \leq 0.$$

So $E(t)$ is strictly non-increasing. Since $E(t) \geq 0$ and is bounded below, it converges to some $E_\infty \geq 0$. Any $\omega$-limit point satisfies $\dot E = 0$, hence $\dot\vartheta = 0$, and the ODE then forces $\sin\vartheta = 0$. Therefore, the trajectory asymptotes to one of the equilibria $\vartheta \in \{\ldots, 0, \pi, 2\pi, 3\pi, 4\pi, 5\pi, \ldots\}$. Among these, $V = 0$ at even multiples of $\pi$ (stable minima) and $V = 2$ at odd multiples (unstable saddles). The system must approach a stable minimum.

**Step 3: Sign of initial acceleration determines the basin**

Compute the initial restoring force:

$$\ddot\vartheta(0) = -\gamma\underbrace{\dot\vartheta(0)}_{=0} - \sin(3\pi + \varepsilon) = -\sin(3\pi + \varepsilon) = +\sin\varepsilon > 0.$$

Since $\varepsilon > 0$, we have $\ddot\vartheta(0) > 0$: the angle *increases* at $t = 0$. The initial position $3\pi + \varepsilon$ lies just past the saddle at $3\pi$ on the side facing the $4\pi$ well. The restoring force therefore pushes the system upward into the $4\pi$ basin, not downward toward $2\pi$.

**Step 4: Energy bound rules out escape past $5\pi$**

Compute the initial energy:

$$E(0) = \tfrac{1}{2}(0)^2 + 1 - \cos(3\pi + \varepsilon) = 1 + \cos\varepsilon.$$

For any $\varepsilon > 0$, we have $\cos\varepsilon < 1$, so $E(0) = 1 + \cos\varepsilon < 2$. The next potential barrier is at the saddle $\vartheta = 5\pi$, where $V(5\pi) = 1 - \cos(5\pi) = 2$. Since $E(t)$ is non-increasing and $E(0) < 2$, the trajectory can never reach $\vartheta = 5\pi$. The system is permanently trapped in the potential well centered at $4\pi$.

**Step 5: Conclusion**

The angle starts just past the saddle at $3\pi$ on the $4\pi$ side, moves toward $4\pi$ due to the positive initial acceleration, and is prevented from escaping by the energy bound $E(0) < 2$. Since the zero-winding-number constraint requires the asymptotic state to lie in $2\pi\mathbb{Z}$, and the only admissible minimum in the accessible region is $4\pi$, we conclude:

$$\lim_{t \to +\infty} \Theta(x, t) = 4\pi.$$

**Final Answer:** $4\pi$

**Final Answer Format:** $4\pi$

---

## STEP 7 — Hints

**Hint 1:** Because the initial condition is spatially uniform, the partial differential equation reduces immediately to an ordinary differential equation — there is no need to work with the full PDE.

**Hint 2:** The energy $E(t) = \frac{1}{2}\dot\vartheta^2 + 1 - \cos\vartheta$ is monotonically non-increasing along solutions. Its long-time behavior pins down which equilibrium the system approaches.

**Hint 3:** Before deciding between $2\pi$ and $4\pi$, compute the sign of $\ddot\vartheta(0)$ explicitly — it determines which side of the saddle at $3\pi$ the trajectory moves toward first.

---

## STEP 9 — Rubric

**Rubric Item 1**
- **Criterion:** Reduces the PDE to the ODE $\ddot\vartheta + \gamma\dot\vartheta + \sin\vartheta = 0$ by invoking spatial uniformity ($\Theta_{xx} = 0$).
- **Weight:** 2
- **Description:** This foundational reduction makes all subsequent analysis tractable. Without it, the problem cannot be solved rigorously.
- **Grading Guidance:** Award 2 points if the reduction to the ODE is stated with justification that $\Theta_{xx} = 0$ for uniform initial data, or equivalent. Award 1 point if the correct ODE is written but the $\Theta_{xx} = 0$ argument is absent. Award 0 points if the spatial structure is mishandled or ignored.

**Rubric Item 2**
- **Criterion:** Defines $E(t) = \frac{1}{2}\dot\vartheta^2 + 1 - \cos\vartheta$ and derives $\dot E = -\gamma\dot\vartheta^2 \leq 0$.
- **Weight:** 2
- **Description:** Establishes that $E$ is a Lyapunov function, which guarantees convergence to equilibrium and restricts the possible asymptotic states to $\vartheta \in \pi\mathbb{Z}$.
- **Grading Guidance:** Award 2 points if both the energy definition and the computation $\dot E = -\gamma\dot\vartheta^2 \leq 0$ are shown, or equivalent. Award 1 point if the energy is defined but the sign of $\dot E$ is not derived. Award 0 points if the energy method is not used.

**Rubric Item 3**
- **Criterion:** Computes $\ddot\vartheta(0) = -\sin(3\pi + \varepsilon) = +\sin\varepsilon > 0$ and concludes the angle initially moves toward $4\pi$.
- **Weight:** 2
- **Description:** This is the decisive step. The sign of the initial acceleration determines which potential well the system enters. Most model failures occur here.
- **Grading Guidance:** Award 2 points if the computation is correct and the direction toward $4\pi$ is explicitly stated, or equivalent. Award 1 point if the computation is shown but the directional interpretation is absent or incorrect. Award 0 points if this analysis is missing.

**Rubric Item 4**
- **Criterion:** Shows $E(0) = 1 + \cos\varepsilon < 2 = V(5\pi)$, ruling out escape from the $4\pi$ well.
- **Weight:** 2
- **Description:** Confirms the system is permanently trapped between the saddles at $3\pi$ and $5\pi$, and must converge to the $4\pi$ minimum.
- **Grading Guidance:** Award 2 points if the initial energy $E(0) = 1 + \cos\varepsilon$ is computed and compared to the barrier height $V(5\pi) = 2$, or equivalent. Award 1 point if a qualitative energy barrier argument is given without explicit computation. Award 0 points if this step is absent.

**Rubric Item 5**
- **Criterion:** States the final answer as $\lim_{t \to +\infty}\Theta(x,t) = 4\pi$.
- **Weight:** 1
- **Description:** The correct asymptotic state.
- **Grading Guidance:** Award 1 point if the answer is $4\pi$ (i.e., $4.000\pi$). Award 0 points if the answer is $2\pi$ or any other multiple of $\pi$.

**Total points: 9**

---

## Notes for Submission

- LaTeX: All expressions already use `$$` blocks and `\text{}` for units — no bare numbers outside math mode.
- No numerical sig-fig precision is needed here (the answer is the exact value $4\pi$).
- The problem is 100% original and self-contained; no external references required.
- References field: self-generated (inspired by Yakushevich DNA torsion model, a standard text in biophysics/nonlinear dynamics).
