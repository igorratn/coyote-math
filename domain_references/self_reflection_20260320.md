# Self-Reflection: Problem Design Lessons (Updated 2026-03-20)

## Session Data

### Previous session (2026-03-19): 13 attempts, 4 successes (31%)
Successes: fc18bf67 (3/4), adaaffa2 (2/4), 8ac6e061 (4/4), 7edc37eb attempt 7 (2/4 — but responses were fabricated by CLI, actual was 1/4).

### This session (2026-03-20): 5 attempts, 1 success (20%)
- Attempt 8: Sturm-Liouville perturbation — 0/4. All models bypassed via implicit differentiation.
- Attempt 9: Fubini trap — ill-posed, QC plagiarism flagged. Dead on arrival.
- Attempt 10: Modified Clausen (hypergeometric) — 0/4. Models computed z² coefficient easily.
- Attempt 11: Gegenbauer linearization (wrong formula) — 2/4 but formula was incorrect.
- Attempt 12: Gegenbauer linearization (corrected formula) — **2/4 SUCCESS.** R1 algebra error, R4 sign reversal.

## Key Lessons Learned Today

### 1. CLI fabricates responses
CLI fabricated all 4 responses for the original 7edc37eb Kapteyn problem AND fabricated log entries for Fubini and Clausen attempts. The integrity check (step 6p) was added to catch this — print first 100 chars + char counts, verify against Handshake page. This is the most critical pipeline fix.

### 2. Don't design recall traps — design reasoning traps
The Clausen problem ($1/2 \to 1$) relied on models NOT recalling the exact parameter. All 4 recalled it and caught the mismatch at $z^2$. A good problem must be one where even a model that knows everything still gets fooled by the REASONING.

### 3. Don't assume "hard computation" is the barrier
Models can do Pochhammer algebra, Taylor coefficients, implicit differentiation. Arithmetic errors don't count as stumbles. The real barrier is PREMATURE CONFIDENCE — models believe they have a proof and don't bother checking. The computation isn't hard; models just don't DO it because they think they don't need to.

### 4. The problem must not have an easy bypass
The SL problem failed because models derived the eigenvalue equation in one line and used implicit differentiation, completely ignoring the perturbation sum. If there's an alternative path to disproof that's shorter than engaging with the trap, models will find it.

### 5. Complexity theory applies to problem design
Simple problems (one component) = models solve instantly.
Complex problems (multiple interacting components) = models simplify away the interaction = stumble.

The error must live in the INTERACTION of multiple components, not in any single component alone. Each piece looks correct in isolation. The falsity only appears when you put them together.

### 6. The Gegenbauer problem demonstrates the right recipe
The Gegenbauer problem works because:
- The $x=1$ evaluation gives a VALID-LOOKING bound (premature confidence)
- The bound involves $(2\lambda)_m$ while the actual formula has $(\lambda)_m$ (subtle difference)
- The factor-by-factor analysis gives $m(\lambda-1) \leq 0$ which holds for $\lambda \leq 1$ but reverses for $\lambda > 1$ (interaction between technique and parameter range)
- Two different stumble mechanisms: R1 made an algebra error, R4 reversed a sign direction

### 7. Well-posedness is non-negotiable
The Fubini problem was ill-posed (integral doesn't exist). The original Gegenbauer problem had a wrong formula. Both were rejected/invalid. Every claim must be definitively True or False. The formula in the problem must be correct.

### 8. QC cares about the FALSE claim, not the correct version
The reviewer rejected 91a25388 because the correct Graf formula is standard. But the FALSE claim (without $(-1)^m$) doesn't appear in references. The dispute argues: "The submitted statement is the false claim, not the standard formula in Watson." This is the same pattern as 8ac6e061 ($dt$ vs $t\,dt$).

### 9. Patterns in successful problems
Every passed problem in the repo:
- Is well-posed, self-contained, definitively True or False
- Is concise (readable in 2 minutes)
- Has a short solution (counterexample or 5-line proof)
- If False: claim is TRUE for most parameter values, FALSE for specific ones
- If False: small perturbation of a known identity (one sign, one factor, one parameter)
- Mix of True and False (~50/50)

## The Design Formula

**Premature confidence × No easy bypass = Stumble**

Premature confidence comes from:
- A plausible structural argument that ALMOST works
- A recalled formula that ALMOST applies  
- An analogy that ALMOST transfers
- A pattern that ALMOST continues

No easy bypass means:
- No simple substitution disproves the claim
- No alternative computation path avoids the trap
- The only way to disprove requires engaging with the subtle detail

## What to Try Next

1. More Gegenbauer/orthogonal polynomial problems — the linearization coefficient space is rich
2. Clebsch-Gordan moment problem (wip_cg_moment.md) — complexity-based, three interacting components
3. Apply Gaussian noise to NEW domains (Wigner symbols, Racah polynomials, angular momentum)
4. Focus on "for all $\lambda$" claims that fail at specific $\lambda$ — this pattern works
5. Factor-by-factor proofs where the sign flips at a boundary — the Gegenbauer mechanism

## What NOT to Try

1. Recall traps (Clausen parameter, Graf's theorem) — models recall too well
2. Problems with easy bypasses (SL: implicit differentiation, Fubini: reverse order)
3. Ill-posed problems (non-integrable singularities, ambiguous double integrals)
4. Well-known counterexamples (Fubini $(x^2-y^2)/(x^2+y^2)^2$)
5. Taylor coefficient mismatches at low order ($z^2$) — models compute these easily
