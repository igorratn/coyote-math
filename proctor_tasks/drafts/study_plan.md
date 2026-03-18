# Study Plan for Next Session — NU-Based Proctor Problems

## The NU Method Opportunity

The Nikiforov-Uvarov method is widely used in quantum mechanics literature (100+ papers on arXiv) to solve Schrödinger, Klein-Gordon, and Dirac equations for various potentials. Models have been trained on this material extensively. The Proctor opportunity: design problems that LOOK like standard NU applications but require simulation to identify a regime change.

## Concrete Problem Ideas

### 1. Klein-Gordon vs Schrödinger (NU §26.2 vs §26.3)
- Same Coulomb potential, same radial equation structure
- Schrödinger: effective angular momentum ν = l, energy E = -Z²/(2n²)
- Klein-Gordon: ν = √((l+1/2)² - μ²), energy E = [1 + μ²/(n+ν+1)²]^{-1/2}
- TRAP: state the problem as "a particle in a Coulomb field" with parameters that make it relativistic (μ = Z/137 not small). Models apply hydrogen formula.
- The key: DON'T say "Klein-Gordon" or "relativistic" — describe the physical conditions (particle mass comparable to binding energy) and let the model determine which equation governs.

### 2. Centrifugal Approximation Failure
- For Hulthen, Woods-Saxon, and other short-range potentials, the NU method requires approximating l(l+1)/r² ≈ l(l+1)δ²e^{-δr}/(1-e^{-δr})² (Greene-Aldrich)
- This approximation is only valid for small l and large screening parameter
- TRAP: give parameters where l is large enough that the approximation breaks badly
- Models will blindly apply the standard NU result from papers

### 3. Singular vs Regular Endpoint (NU §25.2, §26)
- At r=0 in the radial equation, the boundary condition depends on the potential
- For Coulomb: R(r)/r must be bounded → selects one solution
- For Klein-Gordon with strong field: R(r) must be bounded → admits BOTH solutions when ν is not integer
- TRAP: a potential that looks Coulomb-like but has a 1/r² term that changes the indicial equation at r=0

### 4. Dirac Equation Matrix Reduction (NU §26.4)
- The choice of transformation matrix C (with c₁₂=0, c₂₁=0 vs b₁₂=0, b₂₁=0) gives different but equivalent forms
- In the nonrelativistic limit, one form has f(r) >> g(r), the other doesn't
- TRAP: ask for the nonrelativistic limit of a Dirac solution — models might use the wrong form and get incorrect scaling

### 5. Pöschl-Teller / Morse with Unusual Parameters
- These potentials are exactly solvable by NU
- But the number of bound states depends on the depth parameter
- TRAP: give parameters where the potential supports fewer bound states than expected, so asking for the "third excited state" has no solution — models will compute it anyway

## Key Principle
All problems must:
- State PHYSICAL CONDITIONS, not name the framework
- Look like a standard NU/quantum mechanics problem
- Require the model to SIMULATE (check which regime applies) rather than pattern-match
- Have a clean numerical answer with >10% difference from the trap answer

## Resources
- NU book Chapter V (uploaded as PDF)
- arXiv papers on NU method applications (2023-2025)
- Ellis et al., "On Potentials Integrated by the Nikiforov-Uvarov Method" (arXiv:2303.02560)
- Gordillo-Núñez, "The Nikiforov-Uvarov method" (arXiv:2411.00804, Oct 2024)
- ResearchGate: "Application of the Nikiforov-Uvarov Method in Quantum Mechanics"

## Automation
Use Claude Code + chrome-devtools-mcp for all testing. Setup documented in knowledge_transfer.md.
