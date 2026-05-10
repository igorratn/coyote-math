# Elliptical hole in finite plate (2D plane stress) — Peacock Draft v6

**Lineage:** v3/v4 (modulated diffusion, 1D Hill operator) and v5 (1D nonlinear T⁴ BVP) failed because frontier models have powerful 1D ODE reduction toolkits cached (Floquet/Mathieu, autonomous-ODE first integrals). v6 pivots to a **2D PDE on non-trivial geometry** (rectangular plate minus elliptical hole) where no separation of variables, no autonomous reduction, and no closed-form for the finite-plate stress concentration. Trap: models reach for the Inglis (1913) infinite-plate $K_t$ and either apply it directly or multiply by Howland-style finite-plate correction factors calibrated for *circular* holes — neither captures the actual finite-plate amplification at $a_y/a_x = 6$, $a_y/H = 0.5$.

**TRIZ type:** FM2 — framework correctly recalled (Inglis $K_t = 1 + 2 a_y/a_x = 13$) but applied outside its regime of validity (infinite plate ⇒ infinite plate; finite plate at $a_y/H = O(1)$ requires actual numerical solve).

**HAI submission:** Task `7dbbf285-fc4f-47da-87a1-5ab632cee110` — submitted 2026-05-09. Subdomain: Physics — Mechanics. 5/5 panel responses stumbled (1300, 1500, 1550, 1600, 1730 MPa vs.\ truth 2030 MPa, gaps 14.8% – 36.0%). Justification submitted on R4 (pure Inglis, 36% gap). Awaiting reviewer verdict.

**Defense format:** Soil-problem (`peacock/submitted/c9e3f4fe.md`) closed-form-anchor + multi-method + mesh-convergence protocol, extended to 2D plane-stress elasticity with curved-edge $P_2$ isoparametric elements.

---

## Prompt (final, as submitted)

A thin rectangular plate occupies the region $-W \le x \le W$, $-H \le y \le H$ with $W = 50.0 \text{ mm}$ and $H = 60.0 \text{ mm}$. The plate has a centered elliptical through-thickness hole with boundary

$$\left(\frac{x}{a_x}\right)^2 + \left(\frac{y}{a_y}\right)^2 = 1,$$

where $a_x = 5.00 \text{ mm}$ and $a_y = 30.0 \text{ mm}$.

The plate is in 2D plane stress (with $\sigma_{zz} = \sigma_{xz} = \sigma_{yz} = 0$) under isotropic linear elasticity:
- Young's modulus $E = 200 \text{ GPa}$
- Poisson's ratio $\nu = 0.300$

Boundary tractions $\mathbf{t} = \boldsymbol{\sigma}\,\mathbf{n}$ (with $\mathbf{n}$ the outward unit normal):
- On $x = +W$: $\mathbf{t} = (\sigma_\infty,\, 0)$ with $\sigma_\infty = 100 \text{ MPa}$
- On $x = -W$: $\mathbf{t} = (-\sigma_\infty,\, 0)$
- On $y = \pm H$: $\mathbf{t} = (0,\, 0)$ (traction-free)
- On the elliptical hole boundary: $\mathbf{t} = (0,\, 0)$ (traction-free)

Body forces are zero. The applied tractions are self-equilibrating (zero net force and moment), so the stress field is uniquely determined even though displacements admit rigid-body modes. At the four outer corners $(\pm W, \pm H)$ the loaded-edge and traction-free-edge boundary conditions are kinematically compatible (uniform uniaxial stress $\sigma_{xx} = \sigma_\infty$, $\sigma_{yy} = 0$, $\sigma_{xy} = 0$ satisfies both edges), so no boundary-condition discontinuity is introduced at those points.

Determine the maximum value of the von Mises stress on the elliptical hole boundary, $\sigma_{\rm vM}^{\max}$, with the plane-stress definition

$$\sigma_{\rm vM} = \sqrt{\sigma_{xx}^2 + \sigma_{yy}^2 - \sigma_{xx}\,\sigma_{yy} + 3\,\sigma_{xy}^2}.$$

The answer should be expressed in MPa. Report your answer as a 3 significant figure number only. Any intermediate calculations should be carried out to 6 significant figures.

---

## Correct Answer

$\sigma_{\rm vM}^{\max} = 2030 \text{ MPa}$ (3 sig figs), corresponding to $K_t = 20.3$.

Aitken Δ²-extrapolated value from $P_2$ isoparametric curved-edge FEM with mesh refinement: $K_t = 20.27$, $\sigma_{\rm vM}^{\max} = 2027$ MPa.

---

## Step-by-Step Solution (final, GPT-audited 4× passes)

Step 1
Plate $[-W,W]\times[-H,H]$ with $W=50.0$ mm, $H=60.0$ mm; centered elliptical hole semi-axes $a_x=5.00$ mm (parallel to load) and $a_y=30.0$ mm (perpendicular). Plane stress, $E=200$ GPa, $\nu=0.300$, giving the plane-stress effective Lamé parameters $\lambda=E\nu/(1-\nu^2)=6.59\times 10^{10}$ Pa and $\mu=E/[2(1+\nu)]=7.69\times 10^{10}$ Pa. Geometric ratios $a_y/a_x=6$ (high-aspect ellipse, major axis perpendicular to load) and $a_y/H=0.5$ (significant finite-plate confinement). At the four outer corners $(\pm W,\pm H)$ the loaded-edge and traction-free-edge tractions are mutually consistent (the uniform uniaxial state $\sigma_{xx}=\sigma_\infty$, $\sigma_{yy}=\sigma_{xy}=0$ satisfies both adjacent edges), so no boundary-condition discontinuity is introduced there. The applied tractions are self-equilibrating, hence the stress field is unique.

Step 2
For an elliptical hole in an infinite plate under uniaxial tension $\sigma_\infty$ along $x$, Inglis (1913) gives the exact stress concentration factor at $(0,\pm a_y)$: $K_t^{\rm Inglis}=1+2 a_y/a_x = 1+2\cdot 30/5 = 13.0$, hence $\sigma_{\rm vM}^{\max} = K_t\sigma_\infty = 1300$ MPa. This anchors the trivial limit and is the value any solver arrives at if the finite-plate amplification is dropped. Verification: a single FEM solve on a near-infinite plate $W=H=200$ mm with the same hole returns $\sigma_{\rm vM}^{\max}\approx 1326$ MPa, within $2\%$ of Inglis (residual is finite-domain truncation since 200 mm is large but not strictly infinite). Anchor confirmed.

Step 3
The Galerkin weak form: find $\mathbf u\in[H^1(\Omega)]^2$ such that $\int_\Omega \boldsymbol\sigma(\mathbf u):\boldsymbol\varepsilon(\mathbf v)\,d\Omega = \int_{\Gamma_t}\mathbf t\cdot\mathbf v\,d\Gamma$ for all admissible $\mathbf v$, with $\boldsymbol\sigma(\mathbf u) = \lambda(\nabla\cdot\mathbf u)\mathbf I + 2\mu\boldsymbol\varepsilon(\mathbf u)$ and $\boldsymbol\varepsilon = \tfrac12(\nabla\mathbf u + \nabla\mathbf u^\top)$. Stability and quasi-optimality follow from Lax–Milgram with Korn's inequality [Ciarlet, 2002]. The three in-plane rigid-body modes are removed by fixing both displacement components at one outer corner and one additional component at a second corner — a statically determinate constraint that does not alter the stress field.

Step 4
Discretization is curved-edge $P_2$ isoparametric triangles with mid-edge nodes projected onto the exact ellipse arc, giving $O(h^3)$ geometric error. Graded unstructured Delaunay mesh with characteristic length $h_{\rm near}$ at the hole and $h_{\rm far} = 10\,h_{\rm near}$ at the outer rectangle. Stress is recovered as the displacement-basis gradient evaluated at element-level quadrature points (the peak point $(0,\pm a_y)$ is itself a node where the $P_2$ stress is multi-valued across adjacent elements; Aitken extrapolation in Step 6 accounts for the small under-sampling that quadrature-point evaluation incurs relative to the true boundary peak).

Step 5
Mesh refinement at the stated finite-plate geometry, peak $\sigma_{\rm vM}$ over hole-adjacent quadrature points: $K_t \approx 19.28$ ($N_{\rm tri}=9{,}854$), $19.68$ ($37{,}296$), $19.91$ ($147{,}236$), $20.05$ ($578{,}708$). Corresponding $\sigma_{\rm vM}^{\max}$ values $1928$, $1968$, $1991$, $2005$ MPa. Successive differences shrink as $\{40.3, 22.9, 13.6\}$ MPa with geometric ratio $\sim 0.6$, characteristic of slow convergence at the high-curvature elliptical tip (tip radius $\rho = a_x^2/a_y \approx 0.833$ mm). Cross-check 1: the same FEM with $W=H=200$ mm and $h_{\rm near}=0.10$ mm returns $K_t = 13.26$ vs analytic Inglis $13.0$ (residual 2% from finite-domain truncation), confirming the anchor in Step 2. Cross-check 2: the same meshes with linear $P_1$ elements give $K_t = 17.13, 18.89, 19.73, 19.96$, uniformly below the $P_2$ values and consistent with $P_1$ stress-recovery underestimation; $P_2$ curved-edge is the more reliable estimator. Cross-check 3: the FEM solution is symmetric in both $x$ and $y$ as required by the problem symmetries; the maximum stress is located at $(0,\pm a_y)$ as expected analytically.

Step 6
Aitken $\Delta^2$ extrapolation on the last three values: $K_t^\infty \approx K_t^{0.2} - (K_t^{0.1} - K_t^{0.2})^2/(K_t^{0.05} - 2 K_t^{0.1} + K_t^{0.2}) = 19.68 - (0.23)^2/(-0.09) = 20.27$, giving $\sigma_{\rm vM}^{\max}\approx 2027$ MPa, which rounds to $2030$ to three significant figures. The correction from the finest raw value ($K_t = 20.05$) is about $0.22$ in $K_t$, far smaller than the finite-plate amplification relative to Inglis. The Inglis-only value is off the converged truth by $|1300-2030|/2030 = 36.0\%$, far outside the 5% close-to-correct tolerance; the finite-plate amplification factor $K_t^{\rm finite}/K_t^{\rm Inglis} \approx 1.56$ is the load-bearing physics that the trap omits.

Final Answer: 2030

---

## Predicted (and observed) Failure Modes

Submitted task `7dbbf285` panel responses:

| Response | Answer (MPa) | $K_t$ | % off truth | Method |
|---|---|---|---|---|
| R1 | 1550 | 15.5 | 23.6% | Inglis × handbook factors |
| R2 | 1500 | 15.0 | 26.1% | Inglis + heuristic correction |
| R3 | 1730 | 17.3 | 14.8% | Sharp-crack K_I/T-stress framework |
| **R4** | **1300** | **13.0** | **36.0%** | **Pure Inglis (no finite-plate correction)** ← justified |
| R5 | 1600 | 16.0 | 21.2% | Inglis + heuristic correction |

All five **>14% off truth**, well above the 5% "close to correct" tolerance. R4 (pure Inglis) chosen for the failure-justification step: cleanest narrative, simplest FM2 mapping.

---

## Failure justification (R4, as submitted)

See `peacock/drafts/v6-justification-r4.md` (also at `/tmp/peacock-pretest/v6-justification-r4.md`).

Key claim: R4 correctly recalled Inglis $K_t = 13$ but applied it directly to the stated finite plate where $a_y/H = 0.5$ — a regime well outside Inglis's domain of validity ($a_y/H \to 0$). The omitted reasoning step (whether the surrounding plate is "infinite enough") is the load-bearing physics of the problem. **FM2** mapping: framework correctly recalled, applied outside its regime, with no acknowledgment of the regime mismatch. Impact: 36.0% off truth; deficit traces directly to the un-applied finite-plate amplification factor $\approx 1.56$.

---

## Peacock submission-rule alignment check

Per `feedback_peacock_matt_format_rules.md`:

- ✓ **Sig figs:** Answer at 3 sf. Inputs at 3+ sf: $W=50.0$, $H=60.0$, $a_x=5.00$, $a_y=30.0$, $E=200$, $\nu=0.300$, $\sigma_\infty=100$.
- ✓ **Units:** mm, GPa, MPa — explicit, not "SI".
- ✓ **All terms defined:** $W$, $H$, $a_x$, $a_y$, $E$, $\nu$, $\sigma_\infty$, $\boldsymbol{\sigma}$, $\mathbf{t}$, $\mathbf{n}$, $\sigma_{\rm vM}$.
- ✓ **LaTeX:** `\text{ unit}` style; clean rendering.
- ✓ **Standard suffix appended.**
- ✓ **No "weak" / "small" hints** that would license a model's leading-order shortcut.
- ✓ **No technique-leaking sentences** ("use FEM" wording removed in v6-revised after first submission attempt — see lessons below).
- ✓ **Continuous domain.**
- ✓ **Single verifiable answer** $\sigma_{\rm vM}^{\max}$.
- ✓ **Trap >> 5% gap:** 14.8%–36.0% across the panel, robustly above tolerance.

---

## Lessons / design notes

- **First v6 submission (task `b7ef3c09`) had a technique-leaking sentence** in the prompt: *"the answer is the converged value of the 2D plane-stress linear elasticity stress field, to be computed by any consistent numerical method (e.g., finite element analysis with mesh refinement, ...)"*. This violates Matt's rule "if you tell the model to use a technique and it uses that technique, that cannot be a failure." It also primes models to fake FEM convergence (R3 in the first run literally asserted "highly-refined FEA converges to exactly this benchmark value" without performing one). The sentence was removed in v6-revised before the second submission. Lesson saved at `feedback_peacock_no_technique_leak.md` (TBD).
- **Why this v6 worked when v3/v4/v5 didn't.** The 1D problems gave models access to autonomous-ODE first integrals or Hill/Floquet/Mathieu reductions — the reductions ARE recall, not derivation. v6 has no such reduction available: 2D PDE on rectangle-minus-ellipse is genuinely intractable in closed form, and the only "shortcut" available is Inglis (infinite plate), which is the trap.
- **P2 isoparametric was load-bearing.** First-pass $P_1$ Delaunay FEM (chord ellipse) gave $K_t \approx 20$ but with slow convergence and noisy 3rd sig fig at high mesh. Switching to $P_2$ curved-edge cut convergence iterations by ~4× and gave clean Aitken extrapolation to $K_t = 20.27 \pm 0.05$.
- **Mesh-truth uncertainty (~1%) is dwarfed by trap separation (~30%).** The 5% Peacock tolerance band ($K_t \in [19.3, 21.3]$ on the high side, far above Inglis 13) gives wide margin for any reasonable FEM solve. Inglis 13 is unambiguously outside.
- **Future tightening (not implemented here):** singular-extraction technique (subtract analytic Inglis stress field from FEM solve, leave smooth remainder) would give 4th-order convergence and 0.05% precision. Not necessary for this submission given the trap separation but valuable tooling for future Peacock elasticity submissions where the trap might be tighter.

---

## References

1. Inglis, C. E. (1913). *Stresses in a plate due to the presence of cracks and sharp corners.* Trans.\ Inst.\ Naval Arch. — closed-form $K_t$ for elliptical hole in infinite plate.
2. Ciarlet, P. G. (2002). *The Finite Element Method for Elliptic Problems*. SIAM. — Lax–Milgram, Korn, $P_k$ FEM convergence.
3. Quarteroni, A., Sacco, R., & Saleri, F. (2007). *Numerical Mathematics* (2nd ed.). Springer. — Aitken Δ² extrapolation, §1.5.
4. Peterson, R. E. (1974). *Stress Concentration Factors*. Wiley. — handbook reference for finite-plate corrections (used only for sanity, not as the load-bearing solution method).
5. scikit-fem documentation, `ElementTriP2`, `MeshTri2`, `ElementVector`. Gmsh `Mesh.HighOrderOptimize` for curved-edge meshes.
