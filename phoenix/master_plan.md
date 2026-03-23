# Phoenix Master Plan
# One problem at a time, start to finish — updated 2026-03-22

`cli_phoenix_rules.md` is the executable reference. This file is the overview.

---

## Active Files

**Pipeline core:**
- `phoenix/cli_phoenix_rules.md` — detailed pipeline rules (source of truth)
- `phoenix/page_agent_notes.md` — page-agent setup, _pa wrapper v4 (single source for setup code)
- `phoenix/self_critique_prompts.md` — 4 critique prompts
- `phoenix/response_integrity_check.md` — integrity check protocol

**Design & analysis:**
- `domain_guides/playbook.md` — master playbook (methodology + field notes)
- `domain_guides/analysis_prompt.md` — Stage 3 analysis prompt

**Supporting reference (read when designing in new domain):**
- `phoenix/reasoning_pattern_analysis.md` — complexity principle details
- `phoenix/reverse_triz_analysis.md` — contradiction type details
- `phoenix/self_reflection_20260319.md` — session lessons
- `phoenix/self_reflection_20260320.md` — session lessons
- `domain_references/operational_lessons.md` — model failure patterns

**Per-problem work:**
- `phoenix_tasks/wip_{name}.md` — current problem
- `phoenix_tasks/gpt_r1_{name}.md` — GPT verification save
- `phoenix_tasks/failure_explanations_{task}.md` — analysis output
- `problem_clusters/guide.md` + `problem_clusters/{cluster}.md` — uniqueness checks

**Config:**
- `CLAUDE.md` — project instructions

---

## Before Each Stage

**page-agent health check:** verify `window._pa` exists. If not → re-inject (see `phoenix/page_agent_notes.md`).

---

## Stage 1 — Generate, Solve & Verify

### Files read:
- `domain_guides/playbook.md` — design formula, Gaussian noise table, TRIZ types, Q1-Q4, short-circuit checks. **Check Recent Technique Usage table** to confirm separation rule.
- `problem_clusters/guide.md` + `problem_clusters/{cluster}.md` — avoid repeats
- `phoenix/self_critique_prompts.md` — 4 critique checks

### Steps:

1. **Generate** — Claude creates problem + solution + complexity analysis using playbook methodology
2. **Self-critique** — run 4 checks from `self_critique_prompts.md` (Weakness Hunt, Expert Panel, Assumption Audit, Contradiction Check). Too easy → retry
3. **Claim task** on Handshake (must have an open task before pasting)
4. **Paste problem** into Handshake textarea (don't submit yet)
5. **GPT Round 1** — `_pa.exec()`: GPT reads textarea, solves independently, compares. If GPT fails or returns nonsense → retry once. If still fails → Claude proceeds alone, flag in wip file.
6. **Claude verifies** independently
7. **Consolidate** — Claude vs GPT disagree → resolve with specific math, fix problem/solution. Agreement counts only if at least one method is constructive: explicit computation of a value, explicit counterexample with admissibility checked, or direct symbolic reduction to the claimed result. Structural arguments alone ("this looks right") don't count.
8. **Save** as `phoenix_tasks/wip_{name}.md` (problem + solution + complexity)

### Output:
Verified `wip_{name}.md` → proceed to Stage 2.

---

## Stage 2 — Submit & QC

### Files read:
- `phoenix_tasks/wip_{name}.md` — the problem from Stage 1

### Steps:

1. **Clear textarea** (if anything left from Stage 1)
2. **Extract** problem statement only (not solution, not complexity analysis)
3. **Paste** into Handshake textarea via `_pa.type()`
4. **Click** Start timer → Submit → Continue via `_pa.click()`
5. **Poll** for responses via `_pa.getElements()` every 10s until responses appear or 10 minutes
6. **Click** All tab → Expand via `_pa.click()`
7. **Integrity check (MANDATORY)** — `_pa.exec()`: GPT reads all 4 responses, prints first 100 chars + char count of each. Ask user: "Do these match?" WAIT for confirmation.
8. **QC check** — `_pa.exec()`: GPT reads QC panel, reports flags/warnings.

### Abort rule:
If integrity check fails 2x → skip problem, report failure.

### Red flags (re-extract):
- All 4 responses similar length (within 500 chars)
- Any response under 1000 chars
- Unusually uniform formatting across all 4 responses
- Identical paragraph structure across responses
- Mismatch between visible tab content and extracted text

### Output:
4 model responses on page, QC confirmed → proceed to Stage 3.

---

## Stage 3 — Analyze Responses

All on-page, stateful. GPT reads DOM directly — no extraction, no curl, no text transfer.

### Files read:
- `domain_guides/analysis_prompt.md` — valid/invalid failure types, output format
- `phoenix_tasks/wip_{name}.md` — re-read our solution for reference

### Steps:

1. **"Are we wrong?" check** — if 3+ models disagree with our solution → re-verify our solution from `wip_{name}.md` before analyzing. If we find an error → fix solution, re-score.
2. **Claude analyzes** all 4 responses using `analysis_prompt.md` criteria → saves `phoenix_tasks/failure_explanations_{task}.md`
3. **Self-verify (MANDATORY)** — re-read each response, confirm every cited error exists in verbatim text
4. **GPT Round A** — `_pa.exec()` per response tab. GPT reads response directly from DOM. History carries forward — GPT accumulates context across all 4.
5. **Consolidate** — `_pa.exec()`: compare Claude vs GPT verdicts, resolve disagreements citing specific lines.
6. **Update** `problem_clusters/{cluster}.md` (if 2+ stumbled) + `domain_guides/playbook.md` (recent usage table — always)
7. **Completion checklist**
8. **Report** — stumble count, which models failed, failure types, QC status

### Completion Checklist:
```
[CHK-1] integrity check: user confirmed responses match page
[CHK-2] "are we wrong?" check passed (or solution corrected)
[CHK-3] Claude analysis file: all 4 responses analyzed
[CHK-4] Claude analysis quotes exact error text
[CHK-5] self-verification: every cited error found in verbatim text
[CHK-6] GPT Round A completed
[CHK-7] Claude analysis written before GPT call
[CHK-8] Claude vs GPT disagreements resolved with citations (or N/A)
[CHK-9] cluster updated (or N/A if <2 stumbled)
[CHK-10] playbook updated
[CHK-11] QC check
```

---

## page-agent Setup

See `phoenix/page_agent_notes.md` for full setup code (_pa wrapper, GPT-5.4 new-instance, injection steps).

**Stateful** — do NOT clear `window.pageAgent.history` between calls.

**All calls wrapped:** `(async () => { return await window._pa.exec("..."); })()`

---

## Known Gotchas

1. Element indices change after clicks — re-run `_pa.getElements()` after every click
2. React rendering delays — wait 3-5s after clicking before next read
3. Click "All" tab before reading responses
4. Click "Expand" before reading responses
5. "Tx" button toggles raw LaTeX — must be raw for reading
6. Textarea index typically [11] but ALWAYS verify
7. NEVER fabricate responses — if reading fails, report failure
8. `_pa.exec()` response is in `last.action.input.text`, NOT `last.reflection`
9. Page reload kills page-agent — re-inject if `window._pa` is undefined
10. All DOM reading goes through `_pa.exec()` (GPT) — Claude never reads DOM directly
