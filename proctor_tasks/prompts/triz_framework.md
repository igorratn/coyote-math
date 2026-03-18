# TRIZ-Based Proctor Problem Construction Framework

## Core Principle
Proctor problems are **inventions**, not adaptations. They are constructed using Altshuller's Theory of Inventive Problem Solving (TRIZ).

## The Construction Method

### Step 1: Identify a Physical/Technical Contradiction
Find two valid frameworks (methods, conventions, regimes) that give **different numerical answers** for the same physical setup. Examples:
- Fiber optics vs waveguide (different outer boundary)
- Propagating vs evanescent regime (different sign in Helmholtz)
- Condon-Shortley vs alternative phase convention
- Geometric optics vs wave optics (near caustic)
- Perturbative vs non-perturbative (coupling not small)

### Step 2: Construct a Scenario at the Boundary
Design a physical system that:
- **Looks like** it belongs to Framework A (the wrong one)
- **Actually** belongs to Framework B (the correct one)
- The distinction depends on a **subtle physical detail** that models skip

The scenario must combine **known ingredients** (textbook components) in a **novel configuration** (not in any textbook as a complete problem).

### Step 3: Choose Parameters
Pick numerical values so that:
- The wrong answer (from Framework A) differs from the correct answer (from Framework B) by at least 10-20%
- Both answers are clean numbers that models would confidently report
- The computation is straightforward once the right framework is identified

### Step 4: Verify
- Compute the correct answer numerically (independent verification)
- Confirm the wrong answer is what Framework A gives
- Check that the problem is well-posed and unambiguous

## Key TRIZ Principles Applied to Problem Design

| TRIZ Principle | Application to Proctor |
|---|---|
| **Segmentation** | Break the physical system into regions that interact unexpectedly |
| **The Other Way Around** | The answer is the opposite sign/regime from what intuition suggests |
| **Merging** | Combine two textbook systems that individually are known, creating a novel whole |
| **Prior Action** | State a constraint early that silently eliminates the obvious approach |
| **Parameter Changes** | Choose parameters so the system crosses a regime boundary |
| **Separation in Space** | Different physics applies in different spatial regions |
| **Separation in Condition** | The boundary condition determines which solution branch is valid |

## Examples

### Waveguide Problem (wip.md)
- **Contradiction:** Fiber (evanescent cladding) vs Waveguide (oscillatory cladding)
- **Resolving detail:** Conducting wall at r = a
- **Wrong answer:** 8.56 GHz (fiber V-parameter)
- **Correct answer:** 7.12 GHz (full 3-region matching)

### Helmholtz Problem (2c968d24.md, approved)
- **Contradiction:** Include stiffness modulation vs ignore it
- **Resolving detail:** Decay boundary condition forces modified Helmholtz
- **Wrong answer:** Complex perturbation result
- **Correct answer:** 2π/3 (simple Green's function)

### Holonomy Problem (713bbe64.md, approved)
- **Contradiction:** +∬K dA vs −∬K dA for holonomy
- **Resolving detail:** Sign convention in Gauss-Bonnet
- **Wrong answer:** +0.886 rad
- **Correct answer:** −0.886 rad

## Anti-Patterns (What Doesn't Work)
- "Compute this integral/limit/sum" — models execute known techniques flawlessly
- Problems where the trap is in the **computation**, not in the **framework choice**
- Problems where the answer is a **known identity** that models have memorized
- Problems where the wrong answer differs by less than 5% from the correct answer (looks like rounding)

## The Invention Mindset
The problem is not found — it is **constructed**. Start with the contradiction, build the physical scenario around it. The trap is an **emergent property** of the physics, not something bolted on after the fact. The physics comes first; the trap reveals itself.
