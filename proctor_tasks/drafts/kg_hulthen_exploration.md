# Exploratory Problem — Bound State Count (KG + Hulthén)
# Purpose: Test energy-dependent parameter soft spot with a simple counting question
# Status: Parameters verified, ready for sandbox testing

## The Idea

Ask "how many particle-branch bound states exist?" for a KG + Hulthén system.
The nonrelativistic counting formula gives n_max = 5, but the correct 
relativistic count is 4. Models will use the NR formula and overcount.

Simple question, integer answer, judgment-heavy, computation-light.

## Parameters

- $m = 938.3$ MeV/$c^2$
- $V_0 = 0.40$ (dimensionless)
- $\alpha = 0.300$ fm$^{-1}$
- $\hbar c = 197.327$ MeV·fm
- $\hbar c\alpha = 59.198$ MeV

## Correct Answer: 4

Relativistic levels (KG, equal S=V coupling):
- n=1: E=699.4, Eb=238.9 MeV
- n=2: E=887.0, Eb=51.3 MeV
- n=3: E=924.6, Eb=13.7 MeV
- n=4: E=935.8, Eb=2.5 MeV
- n=5: NO positive-E solution

## Trap Answer: 5

NR formula: n_max = floor(sqrt(4mV0/(hbar_c * alpha))) = floor(sqrt(25.36)) = 5
NR n=5 state has kappa = 0.011, Eb = 0.002 MeV (barely bound).
But relativistically, this state doesn't exist — the energy-dependent 
coupling is too weak at near-threshold energies.

## Why Models Fail

The standard Hulthén bound state count is n_max = floor(sqrt(4μV0_eff/(ℏ²α))).
Models will plug in the parameters and get 5. They won't check whether each 
level actually has a positive-E solution when the coupling depends on E.

## Draft Prompt

A spinless particle of rest mass $m = 938.3$ MeV/$c^2$ is described by the Klein-Gordon equation with equal Lorentz scalar and vector potentials, $S(r) = V(r)$, where

$$V(r) = -V_0\,(\hbar c)\alpha\,\frac{e^{-\alpha r}}{1 - e^{-\alpha r}}$$

with dimensionless depth $V_0 = 0.40$ and range parameter $\alpha = 0.300$ fm$^{-1}$. Use $\hbar c = 197.327$ MeV·fm.

Under equal scalar-vector coupling, the $s$-wave ($\ell = 0$) radial equation supports a finite number of particle-branch ($E > 0$) bound states.

Determine the total number of $s$-wave particle-branch bound states for this potential.

## TODO
- [ ] Test on Handshake sandbox — do models get 5 instead of 4?
- [ ] If ≥2 models stumble, develop into full Proctor task
- [ ] Wait ≥1 week after Problem 12 submission (same weakness rule)
