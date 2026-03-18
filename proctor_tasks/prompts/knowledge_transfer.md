# Project Proctor — Knowledge Transfer Document
**Last updated:** March 16, 2026
**Purpose:** Bring a new Claude conversation up to speed on Proctor task development

---

## What Is Project Proctor?

Proctor is a Handshake AI platform project where fellows design STEM problems that cause frontier AI models to produce **wrong final answers** due to genuine reasoning errors. Each task requires stumbling BOTH Model A and Model B (at least one wrong response from each).

**Key files:**
- `proctor_tasks/prompts/proctor_generator.md` — full task specification and rubric rules
- `proctor_tasks/prompts/proctor_prompt_creator.md` — lean workflow
- `proctor_tasks/prompts/triz_framework.md` — TRIZ-based problem construction framework
- `domain_guides/playbook.md` — the stumble guide (v3.2, 19 trap types A-S)

**Platform:** Handshake sandbox at `https://ai.joinhandshake.com/annotations/fellow/task/[ID]/run`

---

## Automation Pipeline (SOLVED — March 14, 2026)

### Use Claude Code + chrome-devtools-mcp

**Setup (one-time):**
1. Enable Chrome remote debugging: `chrome://inspect/#remote-debugging` → toggle ON
2. Install Claude Code: `npm install -g @anthropic-ai/claude-code`
3. Add MCP server: `claude mcp add chrome-devtools -- npx -y chrome-devtools-mcp@latest --autoConnect`
4. Launch: `cd ~/dev/coyote-math && claude`
5. Press "2" (allow and don't ask again) for each tool permission

**Workflow:**
Tell Claude Code:
```
Navigate to the Handshake sandbox at [URL], click Edit on the prompt, 
paste this new prompt [text], submit it, click Continue, wait for 
Model A to finish (look for "Generate Model B" text), click the "All" 
tab, and report both final answers.
```

Claude Code handles: timer dismissal, React textarea injection via `evaluate_script` with `nativeInputValueSetter`, button clicking by `uid`, waiting for generation, reading responses, extracting final answers, pausing timer.

**What DOESN'T work (don't waste time on these):**
- Claude chat → Chrome extension tool calls: slow, disconnects on wait
- Tampermonkey userscripts: fragile, 6+ broken versions — React textarea, prose counting, answer extraction, timer dialog, page state all break
- Manual click-by-click via Chrome extension: too slow

**The chrome-devtools-mcp tools include:**
- `navigate_page` — go to URL
- `take_snapshot` — accessibility tree with uid for each element
- `click` — click by uid (reliable)
- `evaluate_script` — run JS in page context (handles React)
- `take_screenshot` — visual check
- `type_text` — native text input

---

## Approved / Submitted Tasks

- `proctor_tasks/submitted/713bbe64.md` — Holonomy/Gauss-Bonnet sign convention (answer −0.886 rad) — APPROVED
- `proctor_tasks/submitted/2c968d24.md` — Helmholtz red herring (answer 2π/3) — was ambiguous

---

## What We Learned (March 13-14, 2026 Sessions)

### What DOESN'T work for stumbling models:
1. **"Compute X" problems** — models solve any standard computation flawlessly (tested 15+ problems, all passed)
2. **Known identities/formulas** — models have memorized all standard special function results
3. **Red herring problems** — Igor explicitly said NOT to pursue this approach further
4. **Problems where the answer is obvious from the problem statement** — e.g., "toroidal tube" immediately tells models to use periodic BCs
5. **Explicit boundary conditions** — when you state the BC type or give parameters that determine it, models handle it correctly:
   - Thermal contact resistance with stated h_c → models correctly derive Robin BC
   - Spring-loaded string with stated K → models correctly derive transcendental equation
   - Stepped acoustic duct with stated area ratio → models correctly apply impedance matching

### What DOES work (or almost worked):
1. **Problems requiring SIMULATION** (Bennett's Breakthrough 3) — where the model must build a world model and run the physics forward to determine which framework applies
2. **State physical conditions, don't name the framework** — make the model figure out which equation governs the problem by simulating the physics, not by pattern-matching keywords
3. **Multi-step physical scenarios** (like the golden Physics example in the Playbook: Gaussian beam → lens → detector) where each component transforms parameters
4. **Regime confusion** — where two valid frameworks give different answers and a physical detail determines which applies
5. **The waveguide problem** — Model A stumbled (6.97 vs correct 7.12 GHz) but Model B passed. The trap: the core/cladding structure looks like an optical fiber (V-parameter approach), but the conducting wall at r=a makes it a waveguide with fundamentally different dispersion.
6. **Energy-dependent parameters in relativistic equations** (NEW — March 16, 2026) — CONFIRMED STUMBLE (3/4 failed). When the NU method (or any hypergeometric-type solution) is applied to a relativistic equation (Dirac, Klein-Gordon), the eigenvalue E appears inside the potential as a multiplicative factor (E+m) or (E²−m²). This makes the quantization parameters energy-dependent, turning a normally algebraic eigenvalue equation into a transcendental one requiring numerical iteration. Models pattern-match the standard nonrelativistic formula and treat parameters as constants, getting wildly wrong answers. See Problem 12 (Dirac + Manning-Rosen, task f15e9522).

### Problems Tested on March 14 (all passed Model A):

| # | Problem | Trap | Correct | Model A | Why it passed |
|---|---------|------|---------|---------|---------------|
| 1 | Thermal contact resistance | Dirichlet (1300s) | Robin (2760s) | 2760s | h_c stated explicitly |
| 2 | Spring-loaded string | Fixed-fixed (50Hz) | Robin (42.2Hz) | 42.2Hz | Spring K stated explicitly |
| 3 | Stepped acoustic duct | Uniform (172Hz) | Impedance match (207Hz) | 207Hz | Area ratio stated, models know matching |

### Key Theoretical Framework:

**Bennett's "A Brief History of Intelligence"** — Five evolutionary breakthroughs:
1. Steering (approach/avoid)
2. Reinforcement learning / pattern recognition
3. **Simulation** (neocortex, world models) ← THE GAP
4. Mentalizing (theory of mind)
5. Language

Current LLMs have B1, B2, B5 but are weak on B3 and B4. The soft spot is **simulation** — models pattern-match (B2) instead of simulating (B3). Problems should require the model to simulate physical conditions to determine which framework applies.

**TRIZ (Altshuller's Theory of Inventive Problem Solving):**
- Identify a physical/technical **contradiction** — two valid frameworks that give different answers
- The problem sits at the **boundary** where it's ambiguous which framework applies
- The contradiction resolves through a **deeper physical principle** that models don't check
- Don't engineer the trap — let it **emerge** from the physics
- See `proctor_tasks/prompts/triz_framework.md` for full framework

### The Critical Insight (March 14):
**Models can solve ANY well-posed boundary value problem.** The trap cannot be in the computation — it must be in the **judgment** of which BVP to solve. Problems must require the model to:
1. Recognize that the standard framework doesn't apply
2. Identify why (a subtle physical detail changes the governing equation)
3. Set up the correct (non-standard) BVP
4. Solve it

Steps 3-4 are easy for models. Steps 1-2 are where they fail — but ONLY when the problem doesn't explicitly state the non-standard condition.

---

## Repository Structure

```
coyote-math/
├── *.md (100+ Phoenix problems — True/False proof tasks)
├── domain_guides/
│   ├── playbook.md (stumble guide v3.2 — THE key reference)
│   ├── core_generator.md
│   ├── bessel_domain_prompt.md
│   └── ...
├── problem_clusters/ (problems organized by methodology)
├── proctor_tasks/
│   ├── prompts/
│   │   ├── proctor_generator.md (full task spec)
│   │   ├── proctor_prompt_creator.md (lean workflow)
│   │   ├── triz_framework.md (TRIZ construction method)
│   │   ├── knowledge_transfer.md (THIS FILE)
│   │   └── handshake_automator_v3.js (deprecated — use Claude Code)
│   ├── drafts/
│   │   ├── wip.md (current work-in-progress — obsolete)
│   │   ├── session_2026_03_13.md
│   │   ├── session_2026_03_14.md
│   │   ├── study_plan.md
│   │   └── testing_status.md
│   └── submitted/ (completed tasks)
└── domain_references/
```

---

## Rules and Constraints

### Proctor Task Rules:
- Need ≥1 failure from EACH model (Model A AND Model B) with wrong final answer
- Only generate Model B if Model A already failed at least once
- One draft at a time in `proctor_tasks/drafts/` — always named `wip.md`
- After submission: move to `proctor_tasks/submitted/{hash}.md`, delete wip.md
- Rubric weights must sum to exactly 7
- 2-3 significant figures for final answer
- No True/False or Prove/Disprove format
- Prompts must not hint at solution method
- Problems must be novel in APPROACH, not just parameters

### Lean Workflow:
1. Design problem, verify answer numerically
2. Test on Handshake sandbox via Claude Code (no wip.md until confirmed stumble)
3. Only write wip.md AFTER both models stumble
4. Complete rubric, hints, solution for submission

---

## Critical Lesson (March 16, 2026): No Computational Problems

**Models are excellent at computation.** Any problem that reduces to "solve this equation" or "compute this number" will be handled correctly. Tested and confirmed:
- KG + Hulthén bound state count: models got 7/7 correct
- KG + Hulthén binding energy: models correctly identified supercritical regime
- All 5 BVP problems from March 14: models solved every one

**DO NOT design problems that are computation-heavy.** This is the #1 time-waster.

## Both Tier 1 and Tier 2 Are Valid

**Tier 1 (Reasoning-first):** Deep structural insight needed. Multiple concepts connected. "Aha" moment. Trap prevents shortcuts. Best problems are Tier 1.
- Example: Kelvin Wronskian (f09a765d) — 4/4 stumbled. Models used false J₀/K₀ Wronskian (different ODEs).

**Tier 2 (Trap-first):** Mainly tests whether models catch a specific trap. Mechanical once identified. Still valuable — models often miss these.
- Example: Modified Bessel addition theorem sign flip (91a25388) — checking at ϕ=0 catches the error.
- Example: Order-derivative identity (016629d1) — checking near z=0 catches missing digamma terms.

**Bessel cluster tier breakdown (17 problems):** 8 Tier 1 (3T/5F), 9 Tier 2 (5T/4F).

**What does NOT work (tested March 16):**
- Problems where numerical check at x=1 immediately disproves the claim (models just compute)
- Cross-ODE Wronskian problems stated explicitly (models know different ODEs → no common Wronskian)
- Schläfli contour for non-integer order (models know branch cuts)
- Mixed Wronskian J₀/I₀ (models derive the ODE for W and see it's not 1/x)
- Shifted-order spherical Bessel Wronskian (models compute at n=0 and see it fails)

## Confirmed Soft Spot: Energy-Dependent Parameters (Proctor)

**Confirmed:** Problem 12 (Dirac + Manning-Rosen) — 3/4 failed, task f15e9522.

**Why it works:** The trap is in JUDGMENT (recognizing that quantization parameters are energy-dependent), not COMPUTATION (solving the transcendental equation). Models pattern-match to the standard formula and plug in constants.

**Failed explorations of the same idea (DO NOT repeat):**
- KG + Hulthén with m=300, V0=2.0, alpha=0.5: wrong parameters, no n_r=0 solution exists. Models correctly identified this.
- KG + Hulthén bound state count: models got the correct count (7). Counting problems don't work.
- Any variation that turns into "solve this equation numerically" will NOT stumble models.

**Guideline:** Avoid exploiting the exact same weakness repeatedly — vary the approach.

## What Works for Phoenix (True/False Proof Problems)

Phoenix problems that stumble 2+ models share these traits:
- **Tier 1 from the stumble guide** — reasoning-first, trap as gatekeeper
- **Structural traps** — an identity/formula fails in a domain where models assume it works
- **No elementary verification** — models can't self-correct by plugging in simple values
- **Multiple concepts connected** — requires linking two different areas

Best results:
- **Kelvin Wronskian (f09a765d):** 4/4 stumbled. Models used false $J_0$/$K_0$ Wronskian (different ODEs).
- **Rayleigh sums σ₄ (c23294e1):** 3/4 stumbled. Models got False verdict but wrong formula — algebra too hard.
- **Kapteyn exponential (77edf9d1):** 4/4 stumbled. Models said True (wrong). Fabricated references, false citations.

## QC Plagiarism: What Passes vs What Fails

**PASSES QC:** Problems where the FALSE CLAIM itself is original (not in any reference).
- Rayleigh σ₄ = 1/(64...) — the wrong formula isn't in DLMF/Watson. The correct one is.
- Kapteyn exponential Φ_K(x) = 1/(1-x) — invented notation, no reference has this.
- Kelvin W₁-W₂ = 1/x — the wrong sign claim isn't documented anywhere.

**FAILS QC:** Problems where the claim directly asks about a KNOWN identity/formula.
- Weber-Schafheitlin boundary value I_ν(b,b) = 1/b — the piecewise formula is in DLMF, Watson, Wikipedia.
- Kapteyn ∑J_n(nx)/n = -½ln(1-x) — the series itself is a known Kapteyn result.

**Rule:** The FALSE CLAIM must be something you INVENTED, not something that appears in references. The SETUP can use known identities, but the specific claim being tested must be novel.

**Fix for flagged problems:** Wrap the claim in original notation/framing. E.g., define Φ_K(x) = exp(2∑J_n(nx)/n) and claim Φ_K(x) = 1/(1-x) instead of claiming ∑J_n(nx)/n = -½ln(1-x) directly.

## GPT Cross-Check Workflow

After generating a problem, use GPT-5.4 via OpenAI API ($OPENAI_API_KEY) for independent verification:
1. **Round 1:** Check setup correctness (don't solve)
2. **Round 2:** Ask GPT to solve it — if GPT stumbles, the trap works
3. **Round 3:** Argue disagreements until convergence
See phoenix/self_critique_prompts.md for full workflow.

## Automation Pipeline (Phoenix)

1. **Generate** — read playbook + core_generator + domain prompt + anti-overlap ledger
2. **Self-critique** — Weakness Hunt, Expert Panel, Assumption Audit, Contradiction Check
3. **GPT cross-check** — 3-round workflow via OpenAI API
4. **Test on Phoenix** — CLI submits, reads 4 responses, analyzes
5. **Fix QC issues** — if plagiarism flagged, wrap claim in original notation
6. **Submit** — only after 2+ stumbles AND QC passes

See phoenix/cli_system_prompt.md for CLI instructions.
See phoenix/self_critique_prompts.md for self-critique and GPT workflow.

## Next Steps

1. **Focus on Tier 1 reasoning traps only** — no computational problems
2. **Use the playbook trap taxonomy** (Types A–S) for systematic trap design
3. **Test on sandbox before building full tasks** — use CLI speed rules
4. **Vary the weakness exploited** — don't repeat the exact same trap
5. **Novel false claims only** — never claim a known identity, always invent the false formula
6. **GPT cross-check before Phoenix testing** — saves time on bad problems
7. **Format requirements** — rubrics must use KaTeX, be atomic, use "Award X points if..." format, resolve all QC flags
