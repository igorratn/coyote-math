# Dual-Project Workflow: Phoenix + Proctor

## How they complement each other

**Phoenix → Proctor pipeline:**
- Phoenix problem reveals models can't distinguish between two similar theorems
- Design a Proctor problem where applying the wrong theorem gives the wrong number
- The Phoenix reasoning failure becomes the Proctor numerical trap

**Proctor → Phoenix pipeline:**
- Proctor testing reveals models blindly compute without sanity-checking (Problem 12)
- Design a Phoenix True/False claim: "The particle-branch bound state energy for [setup] is positive"
- Models that don't check the sign will claim True when it's False (or vice versa)

## Shared NU territory
- Both projects use NU book as primary reference
- Same special functions (Bessel, Laguerre, Jacobi, Legendre)
- Same physical applications (hydrogen, oscillator, scattering)
- Same trap mechanisms (singular endpoints, regime confusion, approximation failures)

## Current active problems
- **Proctor Problem 12** (Dirac + Manning-Rosen): models find antiparticle branch, don't check E > 0
- **Proctor Problem 11** (KG + Hulthén): genuine disagreement on coupling scheme
- **Phoenix**: 100+ problems in coyote-math repo, organized by methodology

## Automation
- **Proctor**: Claude Code + chrome-devtools-mcp for Handshake sandbox testing
- **Phoenix**: Manual or Claude Code for verification
