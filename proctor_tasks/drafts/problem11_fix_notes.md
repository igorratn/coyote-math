# Problem 11 Fix — Status and Next Steps

## What worked
- Problem 11 (KG + Hulthén, Z=80) produced GENUINE DISAGREEMENT between responses
- Model A: 46.4 vs 59.9 MeV (scalar coupling vs drop-V² approximation)
- This is the strongest signal from 17 problems tested

## Why QC rejected it
- Zα = 0.584 > 1/2 creates fall-to-center instability
- Multiple valid approaches (scalar vs vector coupling, regularization)
- Problem has no unique answer without specifying coupling scheme

## QC's suggested fixes
1. Reduce Z so Zα < 1/2 (but pionic atom with Coulomb already passed at Z=60)
2. Specify "Lorentz-scalar potential added to mass term" (fixes ambiguity)
3. Use finite nuclear charge radius to regularize (makes it numerical, not analytical)

## Fix strategy for next session
- Use Hulthén potential (NOT Coulomb) with SCALAR coupling specified
- Keep Z subcritical (Zα < 1/2)
- The trap: models apply the "equal scalar and vector" formula from papers
  instead of the pure scalar formula — these give different energies
- Need to derive the correct KG+scalar Hulthén formula from papers
- Key reference: Ikhdair & Sever (2009), Tazimi (2020), Egrifes & Sever (2007)

## What went wrong in tonight's derivation
- My implicit KG equation doesn't approach Coulomb KG as δ→0
- The (E+m) factor in the S=V case needs careful handling
- Unit conversion between fm⁻¹ and MeV caused errors
- Need to work from a published formula, not derive from scratch

## Formula needed (from papers)
For KG with EQUAL S=V Hulthén (s-wave, n=0):
  m² - E² = [(E+m)·mZα/δ - δ/2]²   (need to verify this)

For KG with PURE SCALAR Hulthén:
  Different formula — the V enters as (m+S)² instead of (E-V)²
  Energy levels will be different from S=V case

## Key insight for Proctor
The KG literature has MANY different coupling schemes:
1. Pure vector: V enters as E-V
2. Pure scalar: S enters as m+S  
3. Equal S=V: simplifies to Schrödinger-like
4. Unequal S≠V: most general, hardest

Each gives DIFFERENT eigenvalues for the same potential shape!
Models trained on "equal S=V" papers will get the wrong answer
if we specify a different coupling scheme.
