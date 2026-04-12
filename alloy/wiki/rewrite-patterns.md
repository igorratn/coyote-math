# Rewrite Patterns

## Triggers Encountered

### Task d6b6b1dd — Broken LaTeX (missed by CLI, caught by human)
- Response 1 had double `$$` delimiters around `\begin{aligned}` block in section 49.a
- Created empty math environment, leaving the aligned equations unrendered
- **CLI initially marked:** N/A (no rewrite needed)
- **Correct decision:** Broken LaTeX — rewrite trigger YES
- **Fix:** Remove extra `$$` on each side so aligned block is in a single `$$` pair
- **Lesson:** Double display-math delimiters are easy to miss when scanning raw source. Always check rendered output.

### Task d6b6b1dd — Intentional Notation Not a Trigger
- Response 1 used "u" instead of "ν" as a dummy Lorentz index in intermediate steps
- Judged intentional — avoids notational clash with topological charge ν in same section
- **Decision:** Not a trigger. Non-standard but unambiguous in context.
- **Rule reminder:** Only fix notation that could actively mislead a domain expert. Intentional disambiguation is not an error.

### Task 189da35a — Double `$$` Around `\begin{aligned}` (CLI missed again)
- Both responses had double `$$` delimiters around `\begin{aligned}` blocks in raw LaTeX source
- Platform rendered correctly, but source LaTeX is malformed
- **CLI marked:** N/A (renders fine on platform)
- **Correct decision:** Still a rewrite trigger — same pattern as d6b6b1dd. Broken source LaTeX = broken LaTeX regardless of platform rendering quirks.
- **Lesson:** CLI keeps missing this. The standard is whether the LaTeX source is valid, not whether one particular renderer handles it gracefully. QuickLaTeX or any standard renderer would choke on double `$$`.

## Decision Patterns
- Notation that avoids variable name collision → NOT a trigger (intentional choice)
- Notation using wrong standard symbol (e.g., σ for mean instead of μ) → IS a trigger
- Double/duplicate math delimiters creating empty environments → IS a trigger (broken LaTeX)
- Double `$$` around `\begin{aligned}` → IS a trigger even if platform renders it. Source must be valid LaTeX.
- `\[...\]` vs `$$...$$` delimiter difference → NOT a trigger. Just convention — client's renderer may handle `\[` fine. (Nick, onboarding meeting 2026-04-09; formal announcement pending)
- Redundant content / model rambling after proof is complete → NOT a trigger. Penalize in preference scoring (completeness/clarity) but do NOT delete in rewrite. (Dillon, onboarding meeting 2026-04-09)
- Factual/reasoning errors in chosen response → NOT a rewrite target. Leave them in. Note in justification instead. (Dillon, onboarding meeting 2026-04-09)
- Symbol reuse (same variable for multiple things): if still understandable → rewrite trigger (fix notation). If so confusing proof becomes unclear → preference penalty (clarity dimension), not just rewrite. Gray area — use judgment. (Dillon/Nick, onboarding meeting 2026-04-09)
- ~~Double `$$` around `\begin{equation*}` with custom macros → if stripping the inner environment breaks rendering, do NOT rewrite.~~ **REVERSED 2026-04-10:** `$$\begin{equation*}...\end{equation*}$$` IS a real trigger. Custom macros (`\norm`, `\pexpecf`, etc.) are inline math commands, entirely independent of the `equation*` environment — stripping `\begin{equation*}`/`\end{equation*}` does not touch macro expansion. Minimal fix: remove the inner environment lines, keep `$$...$$` and any `\tag{N}`. The original "macros might break" excuse was unfounded. (Task 1f890578 reversal)
- Key test: "Would the author agree this was unintentional?" If no → don't rewrite
- When invoking "if in doubt, don't," state the specific mechanism by which the fix would break the response. Hand-wavy mechanisms ("macros might break") are usually wrong — verify by testing the minimal strip, not by vague worry.

## Corrections
- **189da35a phantom trigger (2026-04-10):** The entry above claiming "Both responses had double `$$` delimiters around `\begin{aligned}` blocks" could not be verified against the saved verbatim text. Chosen response uses clean `$$\begin{aligned}...\end{aligned}$$`. Original trigger call was made from a mental model of what was seen on Handshake, not from the saved file. Task file corrected to Rewrite: N/A. **Lesson:** Every rewrite trigger claim must quote the exact literal text in the saved response.
