# Lovable site content

Source: https://project-peacock-40.learn.joinhandshake.com/
Slack Physics Info canvas: F0AU78GEVJM (Fedor K., 2026-04-18)
Slack PDF: physics_stumping_strategies_and_resources_for_peacock.pdf (Matt O., 2026-04-25)
Scraped: 2026-05-02

---

## Domain Guidelines — Physics
Source: https://project-peacock-40.learn.joinhandshake.com/domain-guidelines/physics

For questions with a numerical final answer: units must be specified in prompt, number of significant figures in answer must be specified in prompt, units must be included in LaTeX and not formatted in math mode (F=123 N where the ~ puts a small space between the number and unit), and the number of significant figures to carry through in intermediate calculations must be specified.

**Standard formatting instruction to append to all prompts:**
> 'The answer should be expressed in Newtons. Report your answer as a 3 significant figure number only. Any intermediate calculations should be carried out to 6 significant figures.'

If model responses are close to the correct answer, that is NOT a valid model failure. Tolerance: ~5%+ difference generally required. If off by only the last digit of a 3-sig-fig number, almost always not a valid failure — even if every single step is wrong.

**Here's a task walkthrough by Fedor:** (linked from /domain-guidelines/physics, announcement 2026-04-28)

### Graduate level cut-off

At some universities courses are taught with both upper-level undergrad and first-year grad students — "undergrads getting grad education" counts; "grads catching up on missed undergrad material" does not.

#### Classical Mechanics (CM)

NOT graduate level:
- Any kinematics problems
- Conservation of energy, work, and central force potentials
- Damped/driven oscillators
- Basic Lagrangian problems (double pendulum, 1D cart-spring, coupled pendulums)
- Rutherford scattering
- Basic non-inertial frame problems (centripetal force, Coriolis, Foucault pendulum)

Graduate level:
- Degree of freedom, constraints, and Lagrangian (lowest level)
- Complicated system Lagrangians with constraints
- Rigid body dynamics, Euler's Angles
- Hamiltonian mechanics
- Chaos / Nonlinear Mechanics
- Classical field theory

#### Electrodynamics

NOT graduate level (Griffiths level):
- Electrostatics, magnetostatics, potentials, image charges
- Electric and magnetic fields in matter
- Electrodynamics, electromagnetic waves

Graduate level (Jackson/Landau level):
- Green's Theorem
- Advanced image charge problems
- Waveguides, resonant cavities, optical fibers
- Radiating systems
- Scattering and Diffraction
- Transmission coefficients
- Relativistic particles and electromagnetic fields
- Collisions, energy loss, and scattering of charged particles
- Radiation by moving charges

#### Optics

NOT graduate level:
- Reflection and refraction, Snell's Law
- Mirrors and lenses, thin lens/mirror equations
- Dispersion
- Young's double-slit interference
- Basic diffraction, polarization

In-between (acceptable with additional advanced difficulty causing reasoning failure):
- Wave-equation and Fresnel equations
- Photoelectric effect
- Wave-particle duality

Graduate level:
- Advanced electromagnetism and wave optics: Maxwell's equations, anisotropic/bianisotropic media, crystal optics, Fourier diffraction theory, coherence theory
- Laser physics: rate equations, laser amplification, resonator design, Gaussian beam optics, ultrashort pulses
- Fourier optics: 2D Fourier analysis, wave-front modulation, holography, spatial filters
- Quantum optics
- Nonlinear optics: nonlinear susceptibility tensors, SHG, OPO, electro-optic effect
- Photonics and fiber optics: dielectric waveguides, dispersion/attenuation, photodetectors
- Optical Metrology and Sensing

#### Thermodynamics / Statistical Mechanics

NOT graduate level:
- Laws of thermodynamics (0–3)
- Thermodynamic potentials: enthalpy, Helmholtz, Gibbs free energy
- Heat engines and cycles: Carnot, Otto, Diesel
- Kinetic theory of gases, Maxwell-Boltzmann distribution

Graduate level:
- Ensemble theory: microcanonical, canonical, grand canonical
- Quantum statistics: Fermi-Dirac and Bose-Einstein
- Phase transitions and critical phenomena: Ising model, critical exponents, renormalization group
- Non-equilibrium thermodynamics

#### Quantum Mechanics (QM)

NOT graduate level:
- Wave-particle duality, Heisenberg's Uncertainty, postulates of QM
- 1D harmonic oscillator, hydrogen atom
(Advanced additions to these topics that clearly cause reasoning failure are acceptable)

Graduate level:
- Approximation methods: perturbation theory (time-independent and time-dependent), variational method, WKB approximation
- Angular momentum: orbital and spin, addition (Clebsch-Gordan coefficients), Wigner-Eckart theorem
- Scattering: Born approximation, partial waves, Lippmann-Schwinger equation, S-matrix
- Identical particles: Fermions/Bosons, degenerate Fermi gas, charged particles in magnetic field, Pauli exclusion
- Adiabatic evolution: Berry phase, Born-Oppenheimer approximation
- Quantum dynamics: Schrödinger, Heisenberg, interaction pictures

Completely graduate level specializations:
- **Quantum Field Theory (QFT):** classical field theory, canonical quantization, QED, Feynman diagrams, renormalization, gauge theories
- **AMO Physics:** atomic structure (fine/hyperfine, Zeeman/Stark), light-matter interactions, laser cooling/trapping, quantum optics, molecular physics
- **Condensed Matter:** transport (Boltzmann), many-body theory (second quantization, Green's functions), band theory, tight-binding, BEC, superconductivity (Cooper pairs, BCS), superfluidity, magnetism, topological phases; experimental (SEM, TEM, AFM, Raman, XPS, NMR, XRD, Neutron Diffraction)
- **Quantum Information:** qubits, entanglement, Bell inequalities, quantum gates, error correction, cryptography, metrology (Heisenberg limit, Quantum Fisher Information)

#### Nuclear Physics
Topics beyond basic decays (α, β, γ), half-lives, and basic nuclear properties are generally accepted. Avoid "Modern Physics" undergrad-level material.

#### High-Energy / Particle Physics
Topics beyond basic Standard Model particle classification are fine.

#### Electives (Fluid Mechanics, Astrophysics/Cosmology/GR, Biophysics, Geophysics, Plasma Physics, Computational Physics)

- **Fluid Mechanics:** Basic Bernoulli/Archimedes/ideal flow: No. More complicated: probably.
- **Astrophysics/Cosmology/GR:** First 5–6 chapters of undergrad-only textbooks: No. Grad: Cosmology, gravitational lensing, black holes.
- **Biophysics:** Must be biophysics, not biology.
- **Computational Physics:** Beyond trapezoidal rule, Euler's method, bisection: acceptable. Molecular dynamics, DFT, FEA, Monte-Carlo/Metropolis: all fine.

---

## Common Model Failure Modes — Physics
Source: https://project-peacock-40.learn.joinhandshake.com/common-failure-modes/physics

Analysis from 8 current Ready-to-Deliver tasks.

### Summary

- **FM1:** Responses use incorrect information during the process.
- **FM2:** Responses use equations not valid for that piece of the problem.
- **FM3:** Responses make a quick assumption to simplify that is not valid.
- **FM4:** Responses make an assumption based on most problems without verifying it applies.

### FM1: Subtle Physical Quantity Misidentification

Model picks a conceptually adjacent but physically wrong quantity. Understands the general approach but substitutes the wrong variable at a key step.

| Task | What model used | What it should have used |
|------|-----------------|--------------------------|
| Photosystem 2 (annihilation) | Excitation rate ∝ total chlorophyll n₀ | Excitation rate ∝ ground-state chlorophyll (n₀ − n) |
| Photosystem 2 (electron transport) | "Rate of charge stabilization" = turnover time τ | Functional cross-section = photochemical efficiency / functional cross-section |
| PS2 2-compartment model | Functional cross-section = σ_opt × charge separation yield | Functional cross-section = σ_opt × radical pair stabilization yield |
| Black hole accretion | Eddington luminosity uses mixture-specific μ_e | Standard Eddington L uses pure hydrogen mass m_p |

### FM2: Domain of Validity Errors

Model applies a valid formula outside its regime of applicability.

- **Supershear rupture / Mach cone:** Applies Mach cone arrival-time equation as if rupture has been supershear from the start. Equation only valid for x > x_T (post-transition). Selects westernmost point on secondary fault as first-arrival incorrectly.
- **Black hole wind (Step 4):** Assumes radiation reduces gravity by exactly fraction λ (valid for pure hydrogen). For mixed H/He gas, correct reduction is λ(m_p/μ_e). Two errors partially cancel, masking the mistake until the final answer.

### FM3: Incomplete Contribution / Premature Dismissal

Model correctly sets up a framework but incorrectly discards a contribution.

- **Z-boson Fierz identity (particle physics):** Computes only t-channel. Explicitly — and incorrectly — states s-channel "identically disappears." Fierz identities correctly show s-channel also contributes. Final answer completely wrong.
- **Lindblad dimer (quantum physics):** Applies secular approximation too aggressively, fully decoupling populations and coherences. Then reduces to populations-only. Coherences are load-bearing for the characteristic polynomial; their removal gives wrong eigenvalue structure.

### FM4: Using Prior Knowledge Instead of Deriving from Data

- **XRD Si/Ge multilayer:** Assumes X-ray wavelength is Cu Kα (standard lab source). Prompt gives Si(001) substrate peak at 2θ = 47.268° precisely to derive wavelength via Bragg's law. Model skips derivation, assumes Cu Kα, incorrectly identifies reflection as (220) instead of (004), propagates error through bilayer thickness calculation.

---

## Common Errors — Physics (Submission Rejection Causes)
Source: https://project-peacock-40.learn.joinhandshake.com/common-errors/physics

### Prompt writing issues (most common)

- Not specifying units for answer
- Not specifying number of significant figures (use 2 or 3 for most cases)
- Mismatch between sig figs in given values and requested in answer — if answer wants 3 sig figs, all given values must be at least 3 sig figs (except integer counts)
- Ambiguous answer format — if equation requested, all variables in answer must be stated in prompt
- Ambiguous prompt: key information missing (orientation, direction, etc.)
  - Example: mercury column in tube — initial position not specified, tube state not constrained → under-constrained
  - Example: CFT vacuum / symmetries — final answer format not constrained (must specify e.g. "Write in standard group-theoretic notation as a composition of factor groups")

### Reference / source issues

- Post-January 2025 publications — rejected; must use pre-cutoff literature
- Unverifiable references — DOIs must be valid and directly support the prompt

### Final answer issues

- Final answer is not incorrect — reasoning error alone insufficient; must cause wrong final answer
- Final answer is close enough — within 1–2% usually not significant (exceptions exist; generally want 5%+ difference). Small-angle approximation off by 1% = not enough
- Physically impossible answers — e.g., satellite position inside the planet

### Step-by-step solution issues

- Missing detail — too brief; starting and ending points of each reasoning step must be shown; number substitutions stated so calculations can be verified
- Inconsistent or missing rounding rules — intermediate and final rounding must follow prompt rules

### Formatting / minor issues

- LaTeX formatting errors — all equations/variables/numbers must render correctly; numerical values and variables inside `$...$`; units inside `$...$` not italicized. Use `$F=123 \text{~N}$` (~ puts small space). Each physical quantity given to at least the precision requested.
- Grammar and typos
- Confirm Model Failure section left blank / not detailed enough — must identify where error occurs, specify the error, explain why it's a significant reasoning error, verify it leads to incorrect final answer

---

## Golden Examples — Physics (3)
Source: https://project-peacock-40.learn.joinhandshake.com/golden-examples/physics

> **DO NOT copy these prompts.** Reviewers run a cosine-similarity check. Use only as a calibration reference for difficulty / style / structure.

### Golden Example 1 — Task 5335f · Condensed Matter & Materials Physics

**Prompt:**

An X-ray diffraction study is performed on a Si/Ge multilayer sample on a Si(001) substrate. The multilayers consisted of 10 bilayers deposited by molecular beam epitaxy. Apart from the Si substrate peak at 2θ = 47.268°, the XRD profile consisted of several equally spaced peaks. A few had 2θ values as 45.6°, 46.048°, 46.496°, 46.944° and so on. Determine the thickness of one Si/Ge bilayer in the given sample. Provide your final answer in nanometers, with four significant figures. Given that the lattice parameter of Si is 5.431 Å, and use π = 3.142.

**Final Answer:** 21.49 nm (but model gets 21.49 via wrong path — see failure)

**Failure Rationale:** In Step 1, model incorrectly assumes Cu Kα wavelength. Consequently reaches wrong conclusion that reflection is (220). The prompt specifies Si(001) substrate — substrate peak corresponds to the first allowed reflection of {001} planes, which is (004). Correct approach: use Si substrate peak position to determine X-ray wavelength via Bragg's law. Model skips derivation.

---

### Golden Example 2 — Task ab93b · Mechanics

**Prompt:**

An infinite planar vertical strike-slip fault lies along the x axis in a homogeneous, isotropic Poisson solid with Lamé parameters μ = 28.0000 GPa and ρ = 2800.00 kg/m³. At t = 0 and location (0,0), a rupture tip is already propagating in the positive x direction at the Rayleigh wave velocity. At t = 12.116 s, the rupture tip instantaneously transitions to a supershear rupture velocity of V_r = 0.9000 V_p.

A second vertical planar fault segment of length L = 17.000 km has its midpoint at (36.7888, 25.1150) km and strikes 16.996° clockwise from the x axis. This secondary fault is near-critically stressed and will begin to rupture immediately upon the first arrival of Mach cone energy at any point along its length.

What is the time of rupture initiation on the secondary fault segment? Express in seconds. Report the answer as a 3 significant figure number only. Any intermediate calculations carried out to 6 significant figures.

**Final Answer:** 17.5 s (model) — **wrong** due to FM2 below

**Failure Rationale:** Critical error in Step 2: model applied Mach cone equation as if rupture had been supershear from the beginning, selecting the westernmost point on the secondary fault. The Mach cone equation is only valid for x > x_T (post-transition location). The point in front of x_T is the correct first-arrival candidate.

---

### Golden Example 3 — Task fd78b · Astrophysics & Cosmology

**Prompt:**

Consider a stellar-mass Black Hole (M = 10 M☉) in a High/Soft state. The system radiates at λ = L/L_Edd = 0.5 of the standard Eddington luminosity (based on pure hydrogen). Powered by accretion rate Ṁ_acc with radiative efficiency η = 0.1.

Fully ionized gas with primordial composition: 75% H and 25% He by mass. Uniform Compton temperature T_C = 1.4 × 10⁷ K.

Determine μ (mean mass per particle) for sound speed, and μ_e (mean mass per electron) for radiation interactions. Thermal energy drives a steady-state biconical isothermal Parker Wind subtending solid angle fraction f = Ω/4π = 0.2. Radiation exerts outward force via Thomson scattering — account for how this modifies effective gravitational potential Φ_eff. Wind accelerates through critical point (sonic radius R_s). For integrated quantities, assume v ≈ c_s for all r ≥ R_s. System self-regulated: integrated electron-scattering optical depth τ from R_s to infinity = 1.

Constants: m_p = 1.673 × 10⁻²⁴ g, k_B = 1.381 × 10⁻¹⁶ erg/K, G = 6.674 × 10⁻⁸ cm³g⁻¹s⁻², c = 2.998 × 10¹⁰ cm/s, σ_T = 6.652 × 10⁻²⁵ cm².

Determine the ratio Ṁ_wind / Ṁ_acc. Report as a 2 significant figure number only. Intermediate calculations to 6 significant figures.

**Final Answer:** 8.7 (model) — **wrong** due to FM2+FM1 below

**Failure Rationale (two coupled errors that partially cancel):**
- Step 2: Model uses mixture-specific μ_e in Eddington luminosity, but standard L_Edd uses pure hydrogen m_p. This inflates luminosity and makes Ṁ_acc too high by factor 8/7.
- Step 4: Model assumes radiation reduces gravity by exactly fraction λ. For mixed H/He, correct reduction is λ(m_p/μ_e) because radiation pushes electrons but gravity pulls full ion mass. Makes sonic radius too small.
- Step 6: μ_e cancels in final ratio — but only because the two errors cancel. With correct formulas, composition does affect the result. Correct answer differs from the incorrect 6.8 to the correct ~8.7.

---

## Pod Leads — Physics
Source: https://project-peacock-40.learn.joinhandshake.com/pod-leads/physics

### Pod Leads by Subdomain

| Subdomain | Pod Lead | Booking |
|-----------|----------|---------|
| Astrophysics | Matt Olmstead | https://calendar.app.google/LE2k3TQ6L7d1Biek8 |
| Condensed Matter/Materials | Manjula Sharma | https://calendar.app.google/7eEF9jXADJGUUrij7 |
| Nuclear/Particle | Taylor Powell | https://calendar.app.google/Uc4NMdVUeVBfiHLf8 |

### Onboarding 1:1 Sessions May 1–4

Schedule with someone in your subdomain; if unavailable, may schedule with anyone.

| Role | Subdomain | Person | Booking |
|------|-----------|--------|---------|
| Domain Lead | Astrophysics/Astronomy | Matt Olmstead | https://calendar.app.google/dgvrEMGjX3nusxuN9 |
| Pod Lead | Condensed Matter/Materials | Manjula Sharma | https://calendar.app.google/hojPTfAWgDgDDDj57 |
| Reviewer | | Justin White | https://calendar.app.google/gumeX5kyC8jz1osr5 |
| Reviewer | Condensed Matter/Materials/Quantum | Gaige Riggs | https://calendar.app.google/W4HGasX7spqviaj28 |
| Reviewer | Astrophysics | Zahra Taghadomi | https://calendar.app.google/XA69pnCA8qSYKKWw6 |
| Reviewer | Medical physics | Ryan Brosch | https://calendar.app.google/Bra43oKUeaQo7f8s7 |
| Reviewer | Optics and Instrumentation | Xuan Luo | (no link) |

---

## Taskflow — Write Prompt (Step 2)
Source: https://project-peacock-40.learn.joinhandshake.com/writing-prompt

### Difficulty requirements
- Target: Graduate / PhD level
- Must require deep reasoning — not routine computation
- Avoid straightforward, textbook-style questions

### Model Knowledge Cutoff
January 2025. Do not submit prompts requiring knowledge past this date.

### What makes a prompt hard?
Both legs must be load-bearing: hard even knowing all underlying facts (applying them requires genuine reasoning) AND hard not only because the fact is obscure (trivial once looked up).

### Originality requirements
- 100% original — not copied from textbooks, papers, competitions, or websites
- Must not appear in online search results
- May use papers for inspiration, but problem must be significantly different
- Trivial modifications (changing variable names or numbers) unacceptable
- Avoid AI-generated summaries when gathering information

### Prompt must be unambiguous
- Exactly one question with exactly one final answer
- Solvable one clear, correct way using only information in image/text provided
- All necessary numerical values, units, and assumptions included
- Desired precision stated clearly (e.g., "Round to 2 decimal places")
- All symbols clearly specified
- All assumptions not common-law stated explicitly
- Numerical values of constants used in problem included
- If answer has units, state units explicitly in prompt

### Prompt must be self-contained
Must include: exact constants and values, clear rounding instructions (≤4 decimal places), defined symbols, units for all quantities, named data formats when relevant, explicit assumptions, equation/model form if multiple interpretations possible.

### Formatting requirements
- KaTeX for math — verify rendering before submitting
- Answers must be CURVD: Contained, Unambiguous, Reduced, Verifiable, Discrete
- Answers can't be guessable; must require at least 6 potential answer choices
- For Math tasks, final answer in LaTeX must not exceed 80 characters
- Tables tool: https://www.tablesgenerator.com/markdown_tables#

### Pre-submission checklist (9 items)
1. Avoid questions requiring niche knowledge not broadly known in your field
2. Use diverse range of strategies and question formats
3. Does not contain ambiguous questions or requests
4. Does not have missing context necessary to respond
5. Is not contrived — no unnatural, awkward constraints
6. Is timeless — correct answer does not change over time
7. Does not contain PII
8. Does not contain information past cutoff date January 2025

---

## Reasoning Types
Source: https://project-peacock-40.learn.joinhandshake.com/writing-prompt/reasoning-types

| Reasoning Type | Definition | STEM Example |
|----------------|-----------|--------------|
| Deductive | Drawing specific conclusions from general laws | Given this reaction mechanism, which stereoisomer must result? |
| Inductive | Generalizing from patterns or experimental observations | From this series of spectral peaks, what structural motif is present? |
| Temporal | Predicting events or states based on order in time | If enzyme A is inhibited before step B, which metabolite accumulates? |
| Spatial | Understanding structures, orientation, or symmetry | Which product isomers from EAS reaction lie in the C2v point group? |
| Causal | Identifying cause-and-effect relationships | What upstream defect explains the observed drop in cellular ATP? |
| Comparative analysis | Judging between alternatives | Which of these two reaction pathways has lower activation energy under acidic conditions? |
| Abstract | Working with non-concrete or theoretical ideas | What is the entropy change in a hypothetical closed system with constraint X? |
| Pattern recognition | Spotting regularities in data or sequences | Which codons in this alignment are consistent with histidine insertion? |
| Statistical | Using data, probabilities, and distributions | What is the probability the observed phenotypic ratio arose by chance? |
| Abductive | Inferring most likely explanation from incomplete evidence | Given this anomalous m/z signal, what is the most plausible source? |
| Hypothetical | Predicting outcomes under counterfactual scenarios | If the bulky base is replaced with methoxide, how does the product distribution change? |

Strongest prompts require multiple reasoning types. Layer tasks — diagnose, justify, and conclude — to force connected reasoning moves.

---

## Prompt Strategies
Source: https://project-peacock-40.learn.joinhandshake.com/writing-prompt/strategies

1. **Layer tasks — diagnose, justify, and conclude:** Ask for identification + mechanism explanation + prediction under modified condition. Failing any one breaks the chain.

2. **Reframe facts as observations:** Give the data used to identify something, not the name. Forces an additional reasoning step before the main reasoning begins.
   - Good: "A researcher performs elimination on compound X. GC-MS shows a single major product; 1H NMR shows no adjacent vicinal coupling. KOtBu was used. What is the IUPAC name of the major product?"
   - Bad: "What is the major product of an E2 elimination with KOtBu on 2-bromobutane?"

3. **Use exceptions to rules:** LLMs default to the common case. Prompts involving genuine exceptions where the standard rule doesn't apply reliably produce failures. Do NOT name the exception.
   - Chemistry: Bulky base + bulky substrate → Hofmann, not Zaitsev. Present reagents; ask for product.
   - Biology: Promoter mutation breaks Mendelian ratios. Embed as phenotypic data; ask for molecular explanation.

4. **Add reasoning layers incrementally:** Stack reasoning steps, not obscured facts.
   | Iteration | Reasoning Added |
   |-----------|-----------------|
   | Determine point group of 1,5-dibromonaphthalene | Spatial only — single step |
   | Two eq. Br2 react with naphthalene via EAS. How many structurally distinct products in C2v? | Added: inductive enumeration, spatial assessment |
   | Same, neglecting directing effects. Probability the product lies in C2v? | Added: statistical reasoning over full isomer set |

5. **Cross disciplinary boundaries:** Require integration across sub-fields (e.g., Biology + Analytical Chemistry, Physical + Inorganic Chemistry, Genetics + Statistics, Biochemistry + Kinetics).

6. **Add realistic constraints:** Prevent pattern-matching to familiar technique.
   - "Using only instruments available to a first-year grad student in a standard wet lab..."
   - "Assume ideal gas behaviour does not apply. Use van der Waals equation with provided constants."
   - "The mass spectrometer is unavailable. Using only the following UV-Vis and IR data..."

7. **Leverage your own research experience:** Unexpected results, conflicting data, or edge cases you encountered. Models fail here because training data skews toward clean textbook outcomes.

---

## Deliverables: Final Answer (Step 3)
Source: https://project-peacock-40.learn.joinhandshake.com/deliverables/final-answer

Enter only the exact final answer — concise, clear, unambiguous. No explanations, labels, commentary, or units unless explicitly required. Format must match prompt requirements exactly.

**Answers must be CURVD:** Contained, Unambiguous, Reduced, Verifiable, Discrete.

Not guessable; must require at least 6 potential answer choices.

For Math tasks, final answer in LaTeX must not exceed 80 characters.

| Format | When to Use |
|--------|------------|
| Integer | Whole number counts (number of space groups, product isomers, paired tendons) |
| Decimal | Numerical results requiring precision (equilibrium constants, delta-G, rate constants, probabilities) |
| Fraction | Exact ratios or probabilities (phenotypic ratios 3/4, mole fractions, product isomer probability) |
| Text (case sensitive) | Exact identifiers (chemical formulas C10H14O2, IUPAC names, point groups C2v/D2h, gene symbols, physics equations) |
| Text (case insensitive) | Named concepts (organelle name, reaction type, enzyme family, pathway name) |
| Ordered list | Sequence matters (reaction steps in order, products ranked by yield, species ranked by stability) |
| Unordered list | Sequence does not matter (set of m/z values, valid restriction enzymes, allowed techniques) |

---

## Deliverables: Justify Model Failures (Step 5)
Source: https://project-peacock-40.learn.joinhandshake.com/deliverables/failure-critique

Provide detailed failure justification for each model failure. Clearly refer only to the specific response identified as failing.

**Must include:**
- The exact reasoning error the model made
- Why it is incorrect
- Where in the response it occurs (how and where it failed)
- Why this error matters for the final answer

**Template structure:**
1. **Where:** Identify the exact step or line where the error occurs.
2. **What:** Describe the specific error made.
3. **Why:** Explain why this constitutes a reasoning failure (not just a computational slip).
4. **Impact:** Show how this error propagates to an incorrect final answer, with specific values where possible.

**Good example:** "In step 4, the model incorrectly applies the ideal gas law to a system at high pressure where intermolecular forces are significant. The model should have used the van der Waals equation because the gas density exceeds the threshold where ideal behaviour breaks down. This conceptual error leads to an underestimated pressure of 2.1 atm vs. the correct 3.8 atm."

**What to avoid:**
- Vague language ("the model is wrong", "the model made an error")
- Lack of technical precision — name the specific concept or theorem misapplied
- Generic critiques not tied to a specific response
- Describing only the wrong answer without explaining the faulty reasoning

---

## Deliverables: Provide Golden Response (Step 6)
Source: https://project-peacock-40.learn.joinhandshake.com/deliverables/golden-response

Steps must be complete (all calculations, definitions, assumptions) and original (do not copy AI model's reasoning).

**Required structure:**
1. Reasoning action — Cite reference [N] where claim is non-trivial
2. Reasoning action — Show all intermediate calculations to 5 decimal places
3. Reasoning action — Define all variables, state all assumptions and theorems
4. Final synthesis — Bring all reasoning together to reach final answer
   - Final Answer: [Exact answer in format specified by prompt]

**Format:**
```
Step 1: [First reasoning action — define knowns, state assumptions]
Step 2: [Next reasoning action — apply relevant equations or principles]
Step 3: [Continue building toward the answer]
...
Final Answer: [Exact answer in format specified by prompt]
```

**Solution requirements:**
- Every reasoning step must be explicit
- All intermediate math and calculations included
- Define all variables and constants used
- State all definitions, assumptions, and theorems used
- Justify each theorem or identity applied
- No "it is obvious" — provide reasoning explicitly
- Completeness matters more than brevity — no character limit

**Watch-outs:**
- DO NOT copy any text from a model response — constitutes LLM use → offboarding without pay
- DO NOT simply restate the prompt requirements
- DO NOT add content the prompt did not ask for — stay within scope

---

## Deliverables: Add References (Step 7)
Source: https://project-peacock-40.learn.joinhandshake.com/deliverables/references

References not mandatory but strongly recommended. Good references help reviewer/auditor understand and approve, especially for niche content.

- Include URLs for any source material that inspired your problem
- Identify if reference is required to solve the problem (True / False)
- Provide justification for why the reference is helpful

| Type | Details |
|------|---------|
| Textbook | URL to publisher's official product page — specify page number, chapter, and section |
| Peer-reviewed journal | DOI preferred — open-access or abstract/SI only; no paywalled full text |
| Additional | Up to 4 additional references of either type |

**Not acceptable:**
- SciHub
- Paywalled full-text without open abstract or supplementary info
- Wikipedia as primary source
- Blog posts, forum posts, Reddit, non-peer-reviewed commentary
- Any source requiring login/subscription to verify

---

## Deliverables: Quality Checks (Step 8)
Source: https://project-peacock-40.learn.joinhandshake.com/deliverables/quality-checks

Quality checks catch issues early. **Acceptable to submit even if a check is marked FAIL.** Acceptable to stand by original work and submit without changes.

| Check | What it does |
|-------|-------------|
| Spellcheck | Verifies spelling quality standards |
| Model Failure for Justification | Ensures selected failure choice matches one of the previously selected model responses |
| Reference Publication Date Check | Confirms all references dated before January 1, 2025 |
| Final Answer Format | Checks if final answer matches required format type (Integer, Decimal, Text, etc.) |

---

## Physics Stumping Strategies and Resources (PDF)
Source: Slack #peacock-physics Physics Info tab — `physics_stumping_strategies_and_resources_for_peacock.pdf`
Author: Matt O. | Added: 2026-04-25

### How the Models Work

(Slide 2 — no text; visual only)

### Stumping the Models

Two things to keep in mind:

1. **AI model success is a strong function of the volume of similar training data it has seen.**
   - Many areas well-established in research literature do not make it into textbooks. These are good areas to probe.

2. **AI models tend to be very bad at extrapolating to novel contexts.**
   - Applying a framework/approximation typically used in one scenario in an entirely distinct scenario (in which it still applies).
   - Breaking standard approximations/assumptions.
     - Design the prompt so that the parameter values/context preclude an approximation **without explicitly telling the model not to use it**. If it applies the approximation anyway, that is a valid failure — but it can't be borderline; must clearly not apply.

### Techniques That DON'T Work

- Hyper-complex calculations
- Textbook-like problems
- Using a result/equation from a single paper
- Trickery — things that don't apply
- Contradictions

### Good Stumping Strategies (Part 1)

- **Niche Areas** — topics well-established in research but absent from textbooks
- **Frameworks applied out of context** — same framework, different scenario
- **Tractable but Novel Derivations** — starts from uncontroversial points, proceeds through verifiable steps
- **Implicitly Broken Approximation** — parameter values unambiguously exclude the approximation; model uses it anyway
- **Implicit Data / Complicated physical reasoning** — withhold some information; force model to infer using physics
- **Experimental set-ups**
- **Add boundary conditions:** under which case, use certain values/methods

### Good Stumping Strategies (Part 2)

- **Add more reasoning layers:** stitch more concepts and approaches into the task
- **Use stochastic rather than deterministic:** Gaussian noise, uniform probability
- **Combine topics that aren't often combined**
- **Start standard, make a big change that causes something fundamentally different**

### Reasoning Types (same table as Lovable)

| Reasoning Type | Definition | Example |
|----------------|-----------|---------|
| Deductive | Drawing specific conclusions from general laws | "Given this mechanism, what must follow?" |
| Inductive | Generalizing from patterns or experimental observations | "Given this data, what can we infer about X?" |
| Temporal | Predicting events or states based on order in time | "If A happens before B, what's the downstream effect?" |
| Spatial | Understanding structures, orientation, or symmetry | "Which product isomers exhibit C2v symmetry?" |
| Causal | Identifying cause-and-effect relationships | "What change in gene expression could cause this phenotype?" |
| Comparative analysis | Judging between alternatives | "Which treatment has higher efficacy and why?" |
| Abstract | Working with non-concrete or theoretical ideas | "What's the entropy change in a hypothetical closed system?" |
| Pattern recognition | Spotting regularities in data or sequences | "Which degenerate codons could result in histidine insertion?" |
| Statistical | Using data, probabilities, and distributions | "What's the statistical likelihood the library diversity meets threshold?" |
| Abductive | Inferring most likely explanation from incomplete evidence | "What's the explanation for this anomaly?" |
| Hypothetical | Predicting outcomes under counterfactual scenarios | "If we changed the methylation site, how will binding affinity shift?" |

### How One Specialist Builds Tasks (Anthony's approach)

1. Identify areas of *true* expertise — fluent at researcher/specialist level. (Examples: stratified environmental flows, nanofluidics, nonlinear response theory, chiral active fluids — few, niche, specific)
2. Identify what the model would be bad at.
3. Find a problem that's interesting but whose answer is *unknown* — then:
   - Break common assumptions just to see what happens.
   - Apply something known to a completely novel context.
   - Smash two apparently distinct/unrelated topics together.

### How a Different Specialist Builds Tasks (iterative probe approach)

1. Pick an area of interest
2. Start with a general open-ended question (possibly undergrad level)
3. Analyze responses and ask a more focused question in areas showing signs of weakness
4. Repeat — probe for weakness. Once found, ask the detailed question that follows the guidelines

### Niche Research Areas (detailed)

Topics well-established in academic research but too niche to merit inclusion in textbooks/curricula. Results exist only in primary research and review papers.

**Example:** Two-layer hydraulics — governs density-driven flow of two approximately immiscible fluids.
- Well-established: original results 80+ years old, primary theoretical foundation laid in 1980s
- Uncontroversial: no expert familiar with its theoretical foundations finds them objectionable
- Limited applications: few or no textbooks treat the subject

### Frameworks Applied Out-of-Context (detailed)

Model is good at applying the correct theoretical framework in its usual context. Design prompts where the same framework applies but in a different context.

Example: two-layer stratified flow used outside its usual setting; turbulence scaling applied to a novel geometry.

### Tractable But Novel Derivations (detailed)

Research papers are good sources of derivations that:
- Start from uncontroversial initial points
- Proceed through verifiable logical and mathematical steps
- Are advanced or niche enough that models are unlikely to have seen them

These derivations **cannot be used directly** but are good starting points for distinct but similar calculations.

**Example:** Novel equations for ion transport in nanochannels in a specific limiting regime.
- Proceeds from common, universally accepted starting assumptions
- Any expert could derive and verify the equations
- Recent addition to literature, unlikely to be in training data
- Can be inspired by any research — not just your own work

Requirements:
- Same calculation/derivation cannot be found in the paper
- Starting point must be uncontroversial (experts in your field must agree)
- Starting point must be clearly given in the prompt
- Starting assumptions → final answer must be deductively verifiable

### Implicitly Broken Approximations (detailed)

Classes of problems almost universally solved using simplifying approximations (e.g., small angle approximation, small deflection approximation, small density-difference approximation in stratified flows).

Design prompts with parameter values that **unambiguously exclude** these approximations. If the model applies them anyway → valid failure.

**Critical:** The invalidity must be truly unambiguous — not small quantitative differences between approximate and exact solution, but **truly divergent results due to the physical absurdity of applying the approximation**.

### Implicit Data / Complicated Physical Reasoning (detailed)

Pare down information to the bare minimum. Rather than giving every parameter value explicitly, force the model to infer withheld information using physical/engineering reasoning. Can also rely on cancellations during solution that render nominally important information irrelevant.

### Don't Use Specific, Empirical Findings from a Single Study

**Papers can be used for inspiration — but only for calculations**, not specific empirical findings.

Standards for a calculation inspired by a research paper:
1. **The same calculation/derivation cannot be found in the paper.**
   - Can derive a similar quantity under substantially different assumptions
   - Can push through a basic theoretical result to obtain a specific numerical result for a given system
2. **Starting point must be uncontroversial.** Experts in your field must agree on the validity of your solution.
3. **Starting point must be clearly given.** If the model must start from a specific equation or framework, state it explicitly in the prompt.
4. **Moving from starting assumptions to final answer must be deductively verifiable.** Every logical step and mathematical manipulation must be such that any expert in your field would agree.

An expert in your field should be able to verify your solution **without having read the paper**.

---

## War Room / Office Hours Meeting Transcript
Source: `proctor_tasks/drafts/meeting_saved_closed_caption.txt`
Speakers: Matt Olmstead (domain lead), Fedor Kuzminov, Gaige Riggs, Ryan Brosch (reviewer), Vaibhav Chauhan
Context: Project Peacock physics war room — stumping strategies discussion

### Core principle on "trickery" (Matt)

If you tell the model to use a technique and it uses that technique, that **cannot** be a failure — even if a human would reason that the technique is not useful here. That's the trickery we don't want. Similarly, never put contradictory things in the prompt and then call it a failure when the model gets confused.

### Why standard approaches fail (Matt)

Models are really good. You can't just ask questions you've seen — they won't fail. Failures occur in **assumptions** — when the situation isn't clearly enough constrained. When the model fails due to under-constraint, it will say things like "I don't know what this constant/volume/normalization factor is" and try different things. Those are NOT the failures we want.

### What doesn't work

- Hyper-complex / computationally intensive calculations — models are good at chaining these
- Standard textbook questions
- Being under-constrained (model will try multiple things, not a real stumping)
- Spatial reasoning in the **physics** sense — we have equations for positions; that's not where they struggle
- Brute-force-able problems — at small scale, models enumerate; at large scale, becomes intractable for humans too
- Adding more of the **same** type of reasoning layer (e.g., energy conservation → energy conservation → energy conservation)

### What works

- **Niche areas** — research specialties where only 5-10-20 people in the world know. Not a lot of training data.
- **Frameworks out of context** — as long as they still apply
- **Tractable but novel derivations** — start from something I've thought about but never actually done
- **Broken approximations** — set up parameter values/context that preclude the approximation WITHOUT explicitly telling the model not to use it. If it applies the approximation anyway → valid failure. Example: image charges — everyone sets up infinite grounded plane or 90°/60° angles. If you set it up differently, the results are different (e.g., energy = half for single plane, not for double plane).
- **Experimental setups** — instead of giving abstract starting state ("here's my starting ket"), set it up as a lab configuration. Same underlying physics, different reasoning context.
- **Non-standard boundary conditions**
- **Start standard, make a big change** that causes something fundamentally different — and make it a change that just doesn't happen very often
- **Different types of reasoning layers** — not just more computation. Add noise, probability, stochastic elements, completely different concept types.
- **Combine topics that aren't often combined** — this is one of the primary success paths
- **Go sideways, not just deeper** — sometimes stepping down in difficulty but asking for something not normally calculated works better than adding more of the same complexity

### Spatial reasoning for physics (Matt)

Models are bad at spatial reasoning in biology sense (e.g., "I hurt my elbow, what happens at my knee?"). For physics, we have equations for positions — so that's not usually the stumping mechanism.

Where models **do** struggle spatially: **structures, orientations, symmetries, and symmetry-breaking situations** — things that require visualization. Topological reasoning can sometimes expose this (e.g., Gaige's surface code example where brute force didn't work but symmetry arguments did — and the model actually handled it).

### Fedor's core stumping insight: "wrong branch" theory

> "LLMs are like trees. When they select a branch, they follow it down. It's very difficult for them to jump the branch. So if you provide context that causes them to choose the wrong branch initially — that's when you hook them. Provide context (not trickery) that will essentially force it to pick the wrong branch of reasoning, and then go with it."

Key: give it context of a scenario where it will naturally oversimplify or apply the wrong version. A trained human with the same context would take the right approach. The model, driven by training data patterns, takes the wrong branch.

### Fedor's second strategy: similar physical quantities with different definitions

When there are multiple definitions of similar physical processes (e.g., different types of acceleration, different types of cross-sections), and you provide context where a trained expert would unambiguously pick the right one — but the model gets confused because they "sound similar" — that's a valid stump.

### Fedor's workflow (combining areas)

Fedor's success: biophysics tasks that draw from laser physics + spectroscopy + biophysics context. Combining excitation energy harvesting + excitation transfer + electron transfer — areas not usually combined → model gets confused or applies its own principles from one area to the other.

### Matt's clarification: "all assumptions must be stated"

This does NOT mean explain PhD-level baseline knowledge. The model is assumed to have PhD-level background — you don't need to state things any PhD would know.

What it DOES mean: during solving, if an assumption comes up that constrains the problem (e.g., "I only want to take it to second order"), that needs to be explicitly stated in the prompt. Same for normalization factors, ordering choices, approximations being made.

### Probing-first workflow for novel/niche topics (Matt)

If unsure what the model knows about your niche instrumentation or experimental technique:
1. First probe it with open-ended questions at various levels
2. See where it knows things, where it doesn't
3. Write your question based on what it knows — if it knows the instrumentation, you don't need to explain it

Rule: if it's general knowledge for a PhD in your field (e.g., "using a mass spectrometer"), don't explain it. If it's known to fewer than 10 people in the world, you probably need to give more context — but probe first.

### Independent runs (Matt)

Each prompt submission is an independent run — no chat history carries over between prompts. However: if you **stop a prompt mid-run** and restart it, there may be some residual state. Workaround known: restarting a task completely (three-dot menu) kills any retained state.

### Adding complexity correctly (Matt + Ryan Brosch)

Ryan's particle beam problem (multi-material straggling distribution, unknown particle + materials): model was crushing it even with many steps and unknowns.

Matt's suggestion that worked: add a **StatMec step** at the beginning — particles escaping from a hot plasma box determines the starting distribution. Now it's StatMec → accelerator physics → materials inference → collision analysis. Four different reasoning domains instead of more of the same calculation.

> "We've seen it's really good at just doing the calculations, even if it's combining them again and again. We want to ask something **different**."

Also: "Sometimes bringing it down a little bit in difficulty but going **to the side** helps — asking something not normally calculated, not a calculation normally done in this context."

### Workflow tip: write question first, solve later (Matt)

> "Write your question... Our problems take a long time to solve, but I can see what steps you would do to solve this. You can see: are the models doing those steps? If they all get the same answer, they're probably doing them. Then just double-check that they're doing them correctly."

You don't need to have the full answer before running it. Identify the steps, check if models take them, then verify.

### Models getting better (Matt + Ryan)

Models in Peacock are confirmed to be better than in Proctor. Similar to Darwin. This is why we need niche areas, novel derivations, and combined reasoning types — standard approaches that worked before may not work anymore.
