# Template Lint Checklist

Run before form-fill. Every box must be checked.

- [ ] Using the current task flow: chosen side + strength `0/1/2/3` (not stale 1–7 / Likert language)
- [ ] "chosen response" / "rejected response" only — no R1/R2/A/B anywhere in eval text; rating `0` may use "both responses"
- [ ] Justification is 2–5 sentences
- [ ] Justification does not rely on stale score-4 / Likert wording
- [ ] Verbatim responses inline (not summaries, not external refs)
- [ ] AI investigation notes copied or summarized faithfully, with an explicit evaluator check of what they got right/wrong
- [ ] **Formatting Flags section present with per-category justification.** Each of the 5 flags (Broken LaTeX, Broken Markdown, Non-standard notation, Structural issues, Garbled text) must have explicit Yes/No/N/A + reason. No silent defaults.
- [ ] **LaTeX verification:** for any `$...$` or `\[...\]` block in chosen response, mentally parse for unbalanced braces, math-mode `$` toggles inside operator chains, missing `\`-escapes. **Broken LaTeX = Yes ONLY if the fragment fails the "any renderer counts" rule.** Paste suspect fragments into quicklatex.com (or another non-KaTeX renderer) and confirm failure. KaTeX-only parse errors do NOT qualify. Never diagnose from Handshake's rendered output.
  - `\(...\)` and `\[...\]` are **valid LaTeX** — most common false positive. Do NOT flag these.
  - LaTeX flag N/A = response contains **zero LaTeX**. If LaTeX is present and correct, flag = **No** (not N/A).
- [ ] **Broken Markdown flag scope:** LaTeX issues go under LaTeX flag, not here. Stylistic choices are content decisions — not broken rendering.
- [ ] **Non-standard notation flag:** Notation introduced and immediately defined in context is NOT an error, even if non-standard. Flag only notation that actively misleads a domain expert.
- [ ] **Structure/Layout flag threshold:** "Could be better organized" is NOT enough. Threshold = does the current layout materially hurt a domain expert's ability to read or verify?
- [ ] Shared/systematic issues, if any, are folded into the justification rather than split into a stale separate section
- [ ] Seeded rewrite reviewed against original + change log; final rewrite justification matches the actual kept changes
- [ ] **Preference lock gate:** finish the written evaluation first. Do not click preferred response on Handshake until rating + justification draft are complete and checked.
- [ ] **Announcement gate:** before trusting local docs, verify no newer announcement/thread changed the form flow
