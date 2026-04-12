# Common Errors in Model Responses

## Error Types Encountered

### Spurious Factors in Physics Formulas
- **Task:** d6b6b1dd (Instantons, Yang-Mills)
- **Error:** Response appended a spurious $\nu$ (topological charge) factor to the tunneling amplitude: $\langle n+1|e^{-HT}|n\rangle \sim e^{-S_{\mathrm{inst}}}\,\nu$
- **Correct:** Amplitude is simply $\sim e^{-8\pi^2/g^2}$ with no topological charge prefactor
- **Pattern:** Model adds an extra variable/factor that "looks right" in context but is physically wrong. Watch for plausible-looking but incorrect multiplicative factors in final results.

### Wrong Coefficient in Perturbation Theory
- **Task:** 0f44e912 (Cooper pair box, superconducting qubit)
- **Error:** Second-order correction coefficient written as $E_J/(8E_C)$ instead of correct $E_J/(4E_C)$
- **How it happens:** Matrix element $\langle -1|H_J|g\rangle = -E_J/(2\sqrt{2})$, denominator $-2E_C$, gives $E_J/(4\sqrt{2}E_C)$. Recombining with the $1/\sqrt{2}$ normalization gives $E_J/(4E_C)$, not $E_J/(8E_C)$.
- **Pattern:** Factor-of-2 errors in perturbation theory — often from mishandling normalization factors or energy denominators. Always re-derive coefficients independently.

## Error Detection Tips
- Always check final formulas/results independently — don't just follow the derivation and assume the conclusion is right
- Back-check key results: does the formula have the right dimensions? Right limiting behavior?
- Compare both responses' final answers — if they differ, one is likely wrong
- For perturbation theory: independently compute matrix elements and energy denominators. Factor-of-2 errors are common.
