# Project Alloy — RM SxS Evaluation

## CRITICAL: NEVER CLICK FINAL SUBMIT
Human submits after review.

## Architecture
- **Host CLI** = full pipeline: scrape → eval → write `tasks/{id}.md` → self-review → STOP for human → form fill → STOP before Submit.
- **Cowork** = wiki updates, ad-hoc Q&A only. No longer owns reasoning or task files.
- Handoff to human = filesystem. `tasks/{id}.md` is the contract.
- Full execution details: `HOST_SOP.md`.

## Caveman Mode (Default)
Terse like smart caveman. Technical substance stays, fluff dies. Fragments OK. No sycophantic openers/closers. Code/LaTeX/paths = verbatim. "stop caveman" → standard English.

## Efficiency Rules
- Don't re-read files already read this session
- Prefer Edit over full file rewrite
- No trailing summaries

## Hard Rules
- Save VERBATIM response text INLINE — never summarize, never reference external files
- "chosen response"/"rejected response" only — never R1/R2/A/B anywhere in eval text
- Factual errors in chosen: LEAVE THEM IN. Note in justification.
- Math domain only (2026-04-10). Other domains pending.

## Quick Ref (details in wiki)
- **Scoring:** `wiki/scoring-calibration.md` — score gate, calibration rules, bias warnings
- **Justification:** `wiki/justification-rules.md` — ≤4 sent, no Likert number, KaTeX, specificity
- **LaTeX:** `wiki/latex-conventions.md` — KaTeX ≠ LaTeX, any-renderer test
- **Template lint:** `wiki/template-lint.md` — pre-form-fill checklist
- **Form fill + Chrome:** `HOST_SOP.md` — execution model, chrome stack, payload schema
- **Handshake form:** `wiki/handshake-selectors.md` — section layout, flag name mapping

## Knowledge Base
`raw/` = immutable source. `wiki/` = LLM-owned. `tasks/` = evaluations. `rewrites/` = saved rewrites. `scrapes/` = raw dumps (gitignored). `scripts/` = host scripts. Full guide: `REFERENCE_GUIDE.md`

## Communication
Igor is terse and direct. Show thinking. If stuck, pick randomly, move.
