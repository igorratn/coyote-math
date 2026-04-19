# Template Lint Checklist

Run before form-fill. Every box must be checked.

- [ ] Section order matches template (Systematic Issues BEFORE Score)
- [ ] "chosen response" / "rejected response" only — no R1/R2/A/B anywhere in eval text
- [ ] Justification ≤ 4 sentences
- [ ] Justification does not mention Likert number
- [ ] Verbatim responses inline (not summaries, not external refs)
- [ ] **Formatting Flags section present with per-category justification.** Each of the 5 flags (Broken LaTeX, Broken Markdown, Non-standard notation, Structural issues, Garbled text) must have explicit Yes/No/N/A + reason. No silent defaults.
- [ ] **LaTeX verification:** for any `$...$` or `\[...\]` block in chosen response, mentally parse for unbalanced braces, math-mode `$` toggles inside operator chains, missing `\`-escapes. **Broken LaTeX = Yes ONLY if the fragment fails the "any renderer counts" rule.** Paste suspect fragments into quicklatex.com (or another non-KaTeX renderer) and confirm failure. KaTeX-only parse errors do NOT qualify. Never diagnose from Handshake's rendered output. See workflow-lessons.md → "Task f95a7def."
  - `\(...\)` and `\[...\]` are **valid LaTeX** — most common false positive. Do NOT flag these.
  - LaTeX flag N/A = response contains **zero LaTeX**. If LaTeX is present and correct, flag = **No** (not N/A).
- [ ] **Broken Markdown flag scope:** LaTeX issues go under LaTeX flag, not here. Stylistic choices (code blocks for math, comments in code, section headers absent) are content decisions — not broken rendering.
- [ ] **Non-standard notation flag:** Notation introduced and immediately defined in context is NOT an error, even if non-standard. Flag only notation that actively misleads a domain expert. Confirm flagged symbols actually appear in the response your score selected.
- [ ] **Structure/Layout flag threshold:** "Could be better organized" is NOT enough. Threshold = does the current layout materially hurt a domain expert's ability to read or verify? Missing explanations and insufficient detail are content issues → affect SxS score, not this flag.
- [ ] **Systematic Issues scope:** shared factual/correctness errors only. Check before writing:
  - Does the issue appear in BOTH responses? (if one response only → SxS/justification, not here)
  - Did you read the prompt? (don't flag omissions the prompt never asked for)
  - No preference comparisons or template text in this field
  - Use "N/A" when no genuine shared issue exists — but don't reflexively mark N/A; missing real shared errors is equally penalized
