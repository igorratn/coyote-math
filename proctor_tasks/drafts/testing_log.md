# Proctor Problem Testing Log
# Append results here for every problem tested

---

## PROBLEM 1: Morse potential — number of bound states + highest energy
**Prompt:** Morse potential with De=0.750 eV, a=1.50e10 m⁻¹, μ=1.00 u. Ask for total bound states and energy of highest bound state.
**Trap answer:** N/A — straightforward Morse, no bend applied
**R1:** 13 states, 0.750 eV | **R2:** 13 states, 0.750 eV
**STATUS:** AGREE — problem too easy, no trap. Move on.

---

## PROBLEM 2: BenDaniel-Duke finite well with position-dependent mass
**Prompt:** Finite square well V₀=50 eV, a=0.1 nm, with m₁=0.067mₑ inside, m₂=0.150mₑ outside. BenDaniel-Duke BCs explicitly stated.
**Trap answer:** Standard BC result (ignoring mass ratio in derivative matching) — would give different E₀
**R1:** 1 bound state, E₀ = 22.7 eV | **R2:** 1 bound state, E₀ = 22.7 eV
**STATUS:** AGREE — Both correctly applied BenDaniel-Duke BCs. Problem stated the BC too explicitly. Need to NOT name the boundary condition type next time.

---

## PROBLEM 3: Half-line Pöschl-Teller (hard wall parity filter)
**Prompt:** Particle on x>0 with wall at x=0 (ψ(0)=0), V = -12 sech²(αx) in natural units. Ask for number of bound states and ground-state energy.
**Trap answer:** Full-line PT gives 3 states (n=0,1,2) with E₀=-9. TRAP = ignoring the wall and reporting 3 states, E₀=-9.
**Correct answer:** Only odd-parity states survive → 1 bound state, E = -4.00
**R1:** 1 bound state, E = -4.00 | **R2:** 1 bound state, E = -4.00
**STATUS:** BOTH PASS — Models correctly identified parity filtering. Not tripped.

---

## PROBLEM 4: Woods-Saxon potential (1D neutron)
**Prompt:** Neutron in 1D Woods-Saxon V₀=50 MeV, R=4 fm, a=0.5 fm. Ask for bound states and ground-state energy.
**Trap answer:** Square well approx gives different E₀ than diffuse WS. No closed-form solution exists.
**R1:** FAILED | **R2:** FAILED
**STATUS:** PLATFORM ERROR — "Failed to submit block" after 20+ min. Retried twice, same error. Problem too computationally heavy — models likely timed out in extended reasoning. Skip.

---

## PROBLEM 5: Coupled oscillator with perpendicular spring (red herring trap)
**Prompt:** Two masses on springs wall-mass-spring-mass-wall, with k_w=40, k_c=10, plus a perpendicular ground spring k_g=5 on mass 1, and b=0 dashpot (red herring). Ask for lower normal-mode frequency of longitudinal oscillations.
**Trap answer:** Including k_g in longitudinal stiffness → K = [[55, -10], [-10, 50]] → λ² - 105λ + 2650 = 0 → ω₋ = 6.50 rad/s
**Correct answer:** k_g is perpendicular, should NOT contribute to longitudinal motion at first order → K = [[50, -10], [-10, 50]] → ω₋ = √(40) = 6.32 rad/s
**R1:** 6.50 rad/s (included k_g) | **R2:** 6.50 rad/s (included k_g)
**STATUS:** ★ BOTH MATCH TRAP ★ — Both models incorrectly included the perpendicular spring in the longitudinal stiffness matrix. PROMISING CANDIDATE. However, the prompt says "providing an additional restoring force only on mass 1" which explicitly tells them to include it. The trap is in the prompt wording, not the physics. Need to make the perpendicular nature more implicit and remove the phrase "providing an additional restoring force."

---

## PROBLEM 6: Bead on rotating hoop (supercritical bifurcation)
**Prompt:** Bead on circular hoop R=0.5m rotating at Ω=10 rad/s. Ask for frequency of small oscillations about stable equilibrium.
**Trap answer:** Using ω = √(g/R) = 4.43 rad/s → f = 0.705 Hz (bottom-of-hoop formula, valid only for Ω < ω_c)
**Correct answer:** Ω > ω_c so equilibrium at cosθ₀=0.196 → ω = Ω·sinθ₀ = 9.806 → f = 1.56 Hz
**R1:** 1.56 Hz | **R2:** 1.56 Hz
**STATUS:** BOTH PASS — Models correctly handled the bifurcation. Well-known Goldstein problem.

---

## PROBLEM 7: Crossed E×B drift (near-relativistic regime)
**Prompt:** Proton in crossed E=5×10⁸ V/m and B=2 T fields. Ask for drift speed. E/B = 2.5×10⁸ m/s ≈ 0.83c.
**Trap answer:** None — v_d = E/B is correct even relativistically when E < cB. Mass and charge are distractors.
**R1:** 2.50×10⁸ m/s | **R2:** 2.50×10⁸ m/s
**STATUS:** AGREE — Both correctly applied E×B drift and noted the relativistic validity. Not tripped.

---

## PROBLEM 8: Overdamped rod pendulum in viscous fluid
**Prompt:** Rod pendulum L=2m, M=3kg, distributed drag β=60 kg/(m·s). Ask for oscillation frequency, or τ if overdamped.
**Trap answer:** Blindly computing ω_d = √(ω₀²-γ²) gives imaginary result → model might report |ω_d| as real frequency
**Correct answer:** System is heavily overdamped (γ=20 >> ω₀=2.71), τ = 5.42 s
**R1:** τ = 5.42 s (overdamped) | **R2:** τ = 5.42 s (overdamped)
**STATUS:** BOTH PASS — Models correctly identified overdamping. Giving them the escape clause ("if not oscillating, report τ") was too helpful. Next time: just ask for the frequency without alternatives.

---

## PROBLEM 9: Buoyant balloon in accelerating elevator
**Prompt:** He balloon V=0.01 m³ tied to scale in elevator accelerating up at 5 m/s². Ask for scale reading.
**Trap answer:** Treating balloon as normal object: F = m(g+a) = 0.054 N (ignoring buoyancy direction)
**Correct answer:** T = (ρ_air - ρ_He)V·g_eff - m_r·g_eff = 0.124 N (net buoyancy with g_eff = 14.8)
**R1:** 0.124 N | **R2:** 0.124 N
**STATUS:** BOTH PASS — Models correctly handled buoyancy in non-inertial frame. Not tripped.

---

## PROBLEM 10: Rolling cylinder on steep incline (slipping regime)
**Prompt:** Solid cylinder on 60° incline, μ_s=0.120, μ_k=0.100. Ask for linear acceleration of CM.
**Trap answer:** a = (2/3)g·sin60° = 5.66 m/s² (rolling without slipping — WRONG, μ_s too low)
**Correct answer:** Cylinder slips. a = g(sinθ - μ_k·cosθ) = 9.8(0.816) = 8.00 m/s²
**R1:** 8.00 m/s² (correctly identified slipping) | **R2:** 8.00 m/s² (correctly identified slipping)
**STATUS:** BOTH PASS — Models correctly checked rolling condition, found μ_s insufficient, used kinetic friction. Not tripped.

---

## SESSION SUMMARY (10 problems tested)
| # | Problem | R1 | R2 | Status |
|---|---------|----|----|--------|
| 1 | Morse bound states | 13, 0.750 | 13, 0.750 | AGREE (easy) |
| 2 | BenDaniel-Duke well | 1, 22.7 | 1, 22.7 | AGREE |
| 3 | Half-line PT parity | 1, -4.00 | 1, -4.00 | BOTH PASS |
| 4 | Woods-Saxon | — | — | PLATFORM ERROR |
| 5 | Coupled osc + perp spring | 6.50 | 6.50 | ★ BOTH MATCH TRAP ★ |
| 6 | Rotating hoop bifurcation | 1.56 | 1.56 | BOTH PASS |
| 7 | Crossed E×B drift | 2.50e8 | 2.50e8 | AGREE |
| 8 | Overdamped rod pendulum | τ=5.42 | τ=5.42 | BOTH PASS |
| 9 | Buoyant balloon in elevator | 0.124 | 0.124 | BOTH PASS |
| 10 | Slipping cylinder on incline | 8.00 | 8.00 | BOTH PASS |

**Key finding:** Only Problem 5 produced a signal, but it was due to misleading prompt wording rather than a true physics trap. These frontier models are extremely competent at standard physics — they check boundary conditions, verify rolling constraints, handle non-inertial frames, identify overdamping, and correctly apply parity filtering.

**Recommendations for future testing:**
- Need problems with GENUINELY ambiguous physics (not textbook traps)
- Try multi-step problems where errors compound
- Try problems requiring counting (topology, degeneracies, phase space)
- Try problems where the answer depends on a convention choice not specified in the prompt

---

## PROBLEM 11: Klein-Gordon + Hulthén potential (arXiv-inspired, supercritical Z)
**Prompt:** Spin-0 particle m=500 MeV in Hulthén potential V(r) with Z=80, δ=0.200 fm⁻¹. Ask for s-wave ground-state relativistic binding energy via KG equation.
**Trap:** Zα = 0.584 > 1/2 → KG equation with vector coupling has fall-to-center instability. No standard formula works directly. Models must choose how to handle it.
**R1:** E_b = 46.4 MeV (assumed scalar potential coupling, regularized indicial equation)
**R2:** E_b = 59.9 MeV (dropped V² term, used Schrödinger-like approximation)
**STATUS:** ★★ DISAGREE ★★ — R1 and R2 give DIFFERENT answers (46.4 vs 59.9 MeV). Both recognized the supercritical problem but handled it with different approximations. THIS IS A STRONG CANDIDATE — the physics itself forces a choice that the prompt doesn't specify, leading to genuine disagreement.
**Model B results:** R1: 46.4 MeV | R2: 46.4 MeV (both used scalar coupling)
**Full picture:** Model A DISAGREES (46.4 vs 59.9), Model B AGREES (46.4 vs 46.4). The problem causes inconsistent approaches across model generations.
**Source:** Inspired by arXiv papers on KG equation with Hulthén potential solved via NU method (e.g., 2411.00804, 2408.03962)

---

## PROBLEM 12: Dirac + Manning-Rosen with spin symmetry (fixed version)
**Prompt:** Dirac equation, spin symmetry (Δ=0), Manning-Rosen Σ(r) with (ℏc)α prefactor, A=50, B=20, α=0.3 fm⁻¹, κ=-2, n_r=0.
**QC Status:** Old ambiguity FAIL never refreshed after fix, but other checks passed. My judgment: prompt is now well-specified.
**R1:** E_b = 1520 MeV | **R2:** E_b = 1517 MeV (both round to 1520 at 3 sig figs)
**Verified:** My own calculation confirms E = -580 MeV, E_b ≈ 1519 MeV. The math is correct.
**RETEST (with verified correct answer):**
**Correct answer:** E_b = 587 MeV (particle-branch root at E = 351 MeV, verified numerically by Igor)
**The antiparticle root at E = -582 MeV gives E_b = 1520 MeV — this is the TRAP answer.**

| | Response 1 | Response 2 |
|---|---|---|
| **Model A** | 1520 MeV (WRONG) | 587 MeV (CORRECT) |
| **Model B** | 1520 MeV (WRONG) | 587 MeV (CORRECT) |

**STATUS:** ★★★ PRODUCTION READY ★★★
- QC: ALL PASSED (grammar, plagiarism, spellcheck, single question, ambiguity)
- Both Model A and Model B each have 1 failing response (R1) and 1 passing response (R2) — meets playbook minimum
- Failure mode: R1 picks the antiparticle root (E < 0) without checking the stated E > 0 constraint
- Dominant error: "regime misidentification" — model finds a valid mathematical solution but selects the wrong physical branch
- Reference answer: 587 MeV (tolerance ~5%: 557–617 MeV)

---

## PROBLEM 13: GaAs/AlGaAs quantum well — implicit BenDaniel-Duke BC
**Prompt:** Electron in GaAs/Al₀.₃Ga₀.₇As well, L=10 nm, V₀=230 meV, m*_well=0.067mₑ, m*_barrier=0.150mₑ. Effective-mass Schrödinger equation stated but BenDaniel-Duke BCs NOT named. Ask for ground-state E₁.
**Correct answer:** 26.4 meV (BenDaniel-Duke: continuity of ψ and (1/m*)dψ/dx)
**Trap answers:** 37.5 meV (standard matching with correct masses) or 32.1 meV (uniform mass)
**QC:** All passed. Ambiguity check noted BCs could be stated explicitly but did NOT flag as FAIL.
**R1:** 26.4 meV (correctly applied BenDaniel-Duke, even named it) | **R2:** 26.4 meV (same)
**STATUS:** BOTH PASS — Models correctly inferred BenDaniel-Duke BCs from "effective-mass Schrödinger equation" context. The phrase "effective-mass Schrödinger equation" is too strong a hint. To make this trap work, would need to remove that phrase and just state different masses without naming the equation — but that risks QC ambiguity FAIL.

---

## FULL SESSION SUMMARY (March 14-15, 2026)

### Problems 1-10: Generic physics traps (generated from memory)
- **0 out of 10 produced genuine disagreement**
- Models handled ALL standard physics traps correctly
- Only Problem 5 (perpendicular spring) matched the trap, but due to misleading prompt wording
- **Lesson:** Standard textbook traps don't work on frontier models

### Problems 11-12: arXiv NU-method inspired problems
- **Problem 11 (KG + Hulthén): ★★ GENUINE DISAGREE ★★**
  - Model A: 46.4 vs 59.9 MeV (scalar coupling vs drop-V² approximation)
  - Model B: 46.4 vs 46.4 MeV
  - Root cause: Zα > 1/2 creates genuine physics ambiguity (no unique answer)
  - Need to verify correct answer with Mathematica
- **Problem 12 (Dirac + Manning-Rosen): BOTH WRONG but agree**
  - R1: 1520 MeV, R2: 1517 MeV (different numbers, but both unphysical)
  - Math is correct, but E < 0 violates particle-branch requirement
  - Directionally correct approach — need parameter tuning for production
  - Per playbook, "no solution" is not valid — must have numerical reference answer

### Key Insights
1. **arXiv-sourced problems >> generic textbook problems** for tripping models
2. **Physics ambiguity** (multiple valid approaches) is the strongest trap mechanism
3. **Supercritical regimes** (Zα > 1/2, strong coupling) force models to make unjustified choices
4. **Always check QC** before generating — saves time and catches dimensional/convention errors
5. **Playbook requires numerical answers** — "no solution exists" doesn't count as a valid Proctor failure
6. Models are extremely competent at standard physics but struggle with:
   - Problems requiring a choice between valid frameworks (KG scalar vs vector coupling)
   - Sanity-checking whether their numerical answer satisfies stated constraints (E > 0)

### Next Steps
1. Verify Problem 11 correct answer with Mathematica (KG + Hulthén, both coupling schemes)
2. ~~Tune Problem 12 parameters (reduce A, B) for realistic particle-branch binding~~ DONE — see Problem 12v2
3. Design more problems in the "supercritical regime" pattern from arXiv NU-method literature
4. Try Dirac + Hulthén with pseudospin symmetry where ℓ̃ mapping is non-trivial
5. Try combined potentials (Hulthén + Coulomb, Manning-Rosen + Yukawa) where the NU method gives different results depending on which approximation scheme is used

---

## PROBLEM 12v2: Dirac + Manning-Rosen — PRODUCTION (updated parameters)
**Task ID:** f15e9522-8bc0-4d6f-9a35-1f02cac4d6de
**Date:** March 16, 2026
**Prompt:** Same structure as Problem 12 but with updated parameters: A=48.0, B=18.0, α=0.320 fm⁻¹ (was A=50, B=20, α=0.300).
**Golden answer:** 689 MeV (E = 249.21 MeV, particle branch)
**Trap mechanism:** Energy-dependent NU parameters — the (E+m) factor in (E+m)Σ(r)/(ℏc)² makes C_eff and D_eff depend on E, creating a transcendental equation. Models that treat them as constants get wildly wrong answers.

| | Response 1 | Response 2 |
|---|---|---|
| **Model A** | 771 MeV (WRONG — bad iteration) | 36.4 MeV (WRONG — E-independent params) |
| **Model B** | 689 MeV (CORRECT) | 87.1 MeV (WRONG — spurious root) |

**Pass@K:** 688 and 689 both pass (2 passes for golden=689)
**QC:** ALL PASSED (spellcheck, grammar, unambiguous, not plagiarized)
**Failure count:** 3 out of 4

**STATUS:** ★★★ SUBMITTED TO PRODUCTION ★★★
- Playbook requirements all met
- 6-criterion rubric (total weight 7) with QC flags resolved
- Golden solution with 5-step derivation submitted
- Failure justifications written for Model A R2 and Model B R2
- 3 progressive hints provided
- Domain: Physics / Nuclear & Particle Physics, Graduate, Hard
- Full details saved in proctor_tasks/drafts/problem_12_production.md

