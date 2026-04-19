# LaTeX Conventions by Domain

## Mathematical Physics / Gauge Theory

### Standard Notation
- Field strength tensor: $F_{\mu\nu}$
- Dual field strength: $\tilde{F}_{\mu\nu} = \frac{1}{2}\varepsilon_{\mu\nu\rho\sigma}F_{\rho\sigma}$
- Euclidean action: $S_E$
- Topological charge: $\nu$ or $Q$ (both standard)
- Chern-Simons number: $N_{CS}$ or $n_{CS}$
- Coupling constant: $g$ (or $g_{YM}$)
- 't Hooft symbols: $\eta_{a\mu\nu}$, $\bar{\eta}_{a\mu\nu}$

### Common LaTeX Pitfalls
- `\frac{}{}` — watch for missing closing braces, especially in nested fractions
- `\begin{align}` without `\end{align}` — common in long derivations
- Mixing `$...$` (inline) and `$$...$$` (display) inconsistently
- Unicode math symbols (², ³, etc.) that won't render in LaTeX environments
- **Double `$$` delimiters** — `$$ $$ \begin{aligned}` creates an empty math block and leaves the aligned equations outside any math environment. CLI missed this on task d6b6b1dd. Always verify rendered output.

## Delimiter Conventions (updated 2026-04-09, onboarding meeting)
- `\[...\]` vs `$$...$$` — NOT an error, just different conventions. Don't rewrite one to the other.
- `\(...\)` vs `$...$` — same: not an error.
- Handshake platform may not render `\[` delimiters (backslash gets eaten by scripting layer), but client's renderer might handle them fine.
- **Always turn off formatting on Handshake** (top-right button) and render LaTeX externally to verify correctness.
- Formal announcement from Nick/Dillon pending, but ruling from meeting is clear.

## General
- Always check that LaTeX renders correctly — broken LaTeX is the most common rewrite trigger in math/physics tasks
- **CLI does not reliably catch structural LaTeX issues** — human must verify rewrite triggers against actual rendered page
- **Always use raw view on Handshake** — the platform's LaTeX rendering is unreliable (different package versions). Toggle off formatting, copy to external renderer.

## KaTeX vs LaTeX
- **KaTeX ≠ LaTeX.** KaTeX (Handshake's renderer) is stricter than MathJax/quicklatex — notably on `&` inside inline math, certain `\begin{env}` inside `$`, and some macro edge cases.
- A KaTeX parse error alone is NOT sufficient to flag Broken LaTeX.
- Before flagging, paste the fragment into quicklatex.com; if it renders, the flag is No and no rewrite is warranted.
- **Platform rendering is intentionally OFF** (Nicolas, 2026-04-10). Plain text = source of truth.
- Verify externally via https://stackedit.io/app# or https://quicklatex.com/. Any renderer that displays it correctly is acceptable.
- Never diagnose from Handshake's rendered output.
