# Project Alloy — RM SxS Evaluation

## CRITICAL: NEVER CLICK FINAL SUBMIT
CAN interact with Handshake page (click tabs, scroll, expand). MUST NOT click final "Submit". Human submits after review.

## Host/Cowork Split (2026-04-11)
Chrome-in-Cowork MCP has a ~30s transport floor per call. Host claude code with `chrome-devtools` MCP talks raw CDP (ms-level). Pivot:
- **Cowork (this session)** = reasoning only. Reads scrape file from `alloy/scrapes/{id}.txt`, writes `tasks/{id}.md`, produces form-fill payload, updates wiki. NEVER calls `mcp__Claude_in_Chrome__*` tools anymore.
- **Host claude code (user runs manually)** = all browser mechanics via `chrome-devtools` MCP. Scrapes Handshake → dumps verbatim to `alloy/scrapes/{id}.txt`. Later reads payload from task file → drives form fill → STOPS before Submit.
- Handoff = filesystem. Task file is the contract. User manually runs host session between Cowork steps.

## Caveman Mode (Default)
Terse like smart caveman. Technical substance stays, fluff dies. Drop articles, filler, pleasantries, hedging. Fragments OK. No sycophantic openers/closers. Code/LaTeX/paths = verbatim. Suspend for security warnings or irreversible actions. "stop caveman" → standard English.

## Efficiency Rules
- Don't re-read files already read this session
- Prefer Edit over full file rewrite
- No trailing summaries of work just done

## Agent Division of Labor
**Opus (main) = decisions only.** Domain check, Systematic Issues, score, justification, rewrite trigger verification against literal text, wiki judgment.
**Sonnet subagents = mechanical work.** Use Task tool with subagent_type=general-purpose, model=sonnet.
- **Scrape = host claude code (NOT Cowork).** Cowork waits for `alloy/scrapes/{short-id}.txt` to appear on disk, then reads it. If file missing → tell user to run host scrape, then wait. Never call `mcp__Claude_in_Chrome__*` from Cowork.
  Validate after read: prompt present + not truncated, both responses present + not truncated. Fail early → ask user to re-run host scrape.
- **Form fill = host claude code (NOT Cowork).** Cowork produces payload, saves it in task file, tells user "run host fill". Host claude code reads task file, executes via `chrome-devtools` MCP, STOPS before Submit. Cowork never calls `form_input`/`find`/`read_page` on Handshake. Payload schema below still applies — host reads it from task file.
  ```
  {
    score: 1..7,
    systematicIssues: string,
    justification: string,
    rewriteCategory: "N/A" | "Broken LaTeX" | "Broken Markdown" | "Non-standard notation" | "Structural issues" | "Garbled text",
    rewriteExplanation: string,
    rewriteText: string | null,   // null when rewriteCategory == "N/A"
    flags: { latex, markdown, notation, structure, garbled },  // each "Yes"|"No"|"N/A"
    advance: true
  }
  ```
  Execution model = **per-section snapshot**, not one whole-form snapshot (React re-renders invalidate refs). For each visible section:
  1. One lightweight `read_page(tabId, filter:"interactive")` to acquire refs for *that section only*, and to assert expected section (fail fast on mis-target).
  2. `form_input` each field in the section with final text, once. No click+type. No incremental typing. Use cached labels/accepted-value strings from `wiki/handshake-selectors.md`, not raw refs, for score/radio controls.
  3. Before advancing: verify required fields non-empty.
  4. Click section advance (↑). Report checkpoint: `{section: <name>, fieldsWritten: [...], nextSectionVisible: true|false}`.
  5. Repeat for next section.
  **Fast paths:** if `rewriteCategory == "N/A"`, skip rewrite textarea AND any rewrite-only controls hidden downstream — do not touch fields the UI won't require.
  **Bounded retry:** if a step fails (stale ref, missing control), reacquire refs for the *current section only*, retry the failed step ONCE, else abort and report. No loops, no full-form re-scan.
  **Submit blacklist:** if `read_page` exposes the Submit button, explicitly record its ref as a DO-NOT-TOUCH. Never pass it to `form_input`, `click`, or `find`. STOP at the section before Submit and report status.
  Never reinterpret the payload. Never rescore. Never alternate read/write beyond the per-section protocol.
- **Audit agent** (pre-submit, optional) — verify every "chosen does X"/"rejected does Y" claim in justification against saved response text. Remind which response is chosen.

## Task Workflow
Given Handshake task URL → extract UUID → short ID = first 8 chars → filename `tasks/{id}.md`

**Separation principle:** mechanical source capture vs judgment. Never mix. Capture must finish cleanly (verbatim, verified) before any scoring thought.

1. **Scrape (host claude code)** — user runs host session, which dumps blob to `alloy/scrapes/{short-id}.txt`. Cowork checks file exists, reads it. If missing: tell user to run host scrape, wait.
2. **Source-of-truth checkpoint (Opus, MANDATORY)** — before any scoring:
   - Prompt present, not truncated? Responses both present, not truncated, not summarized?
   - Any missing blocks, `[BLOCKED: ...]` markers, or ellipses?
   - FAIL EARLY: if anything is off, re-scrape. Do not proceed to evaluation with partial source.
3. **Wiki lessons scan (Opus, MANDATORY)** — before any scoring, read `wiki/workflow-lessons.md` and `wiki/scoring-calibration.md`. Purpose: apply prior lessons to the current task (e.g., "read whole conclusion before calling contradiction," "KaTeX ≠ LaTeX for Broken LaTeX flag," "justification asymmetry hedging"). This is the whole point of maintaining the wiki — lessons must be read on entry, not just written on exit. Skim, don't deep-read; flag any entry that looks relevant to the current prompt/response style and hold it in mind during steps 4–10.
4. **Save (Opus)** — use template at `templates/task-template.md`. Paste raw verbatim inline.
5. **Systematic Issues (Opus)** — issues shared across BOTH responses BEFORE choosing preference. <5 sentences or N/A. 4 dims only (correctness, completeness, clarity, helpfulness). Shared formatting → Rewrite Trigger, not here.
6. **Evaluate (Opus)** — Correctness > Completeness > Clarity > Domain appropriateness.
7. **Score gate (Opus)** — before finalizing score, answer explicitly:
   - Is the difference **correctness**? (factual error in one, not other → strong 1/2 or 6/7)
   - Or only **completeness/clarity**? (→ 3/5 range)
   - Are responses **exact-match identical**? (only then → 4)
   - Would I defend the chosen side if asked "specifically, where does it win?"
   - Prevents drift to soft 3/5 when correctness asymmetry exists, and prevents spurious 2/6 when only style differs.
8. **Mechanical-task flag** — for calculator / operator-reduction / symbolic-evaluation prompts where correctness = one numeric answer: if responses don't show derivation, correctness credit is limited to shown/checkable steps. Don't award correctness on unverified assertions — penalize completeness instead.
9. **Prompt well-posedness check (Opus, BEFORE hard preference claims)** — ask whether the prompt itself fixes the mathematical convention, definition, branch choice, or interpretation tightly enough for a unique answer. If the prompt is under-specified and BOTH responses lean on the same ambiguity, record that in `Systematic Issues` first. Do not manufacture a strong correctness split from messy algebra/sign handling when the deeper issue is prompt ambiguity.
10. **Literal-claim audit (Opus, MANDATORY pre-form-fill)** — **PRIMARY GUARDRAIL.** Before spawning form-fill agent: re-read saved response text and check EVERY sentence of justification + every rewrite-trigger claim against literal text. Each "chosen does X" / "rejected does Y" must cite something actually present. Phantom claims (describing from memory) are the #1 source of backfill work. Catch them here.
11. **Template lint (Opus)** — pre-form-fill checklist:
   - [ ] Section order matches template (Systematic Issues BEFORE Score)
   - [ ] "chosen response" / "rejected response" only — no R1/R2/A/B anywhere in eval text
   - [ ] Justification ≤ 4 sentences
   - [ ] Justification does not mention Likert number
   - [ ] Rewrite Trigger section present (even if N/A)
   - [ ] Verbatim responses inline (not summaries, not external refs)
   - [ ] **Formatting Flags section present with per-category justification.** Each of the 5 flags (Broken LaTeX, Broken Markdown, Non-standard notation, Structural issues, Garbled text) must have an explicit Yes/No/N/A + reason. No silent defaults. If a flag says No but the rewrite trigger says Broken-LaTeX (or similar), that's a contradiction — fix before spawning form-fill.
   - [ ] **LaTeX verification:** for any `$...$` or `\[...\]` block in chosen response, mentally parse for unbalanced braces, math-mode `$` toggles inside operator chains, missing `\`-escapes. **Broken LaTeX = Yes ONLY if the fragment fails the "any renderer counts" rule.** Mental parsing alone is insufficient — paste the suspect fragment into quicklatex.com (or another non-KaTeX renderer) and confirm failure there too. KaTeX-only parse errors do NOT qualify: KaTeX is stricter than MathJax/quicklatex on things like unescaped `&` in inline math, but per Nicolas (2026-04-10) any renderer that displays it correctly is acceptable. Never diagnose from Handshake's rendered output; platform rendering is intentionally off. See workflow-lessons.md → "Task f95a7def — Broken LaTeX Flag Flipped Twice."
12. **Present** — "Evaluation saved. Review before submitting." MUST explicitly list EVERY section in the review summary, not just the changed ones: Chosen side, Score + one-line rationale, Systematic Issues (full text), Justification (full text), **all 5 Formatting Flags with Yes/No/N/A + reason per flag** (Broken LaTeX, Broken Markdown, Non-standard notation, Structural issues, Garbled text), Rewrite Trigger (category + explanation), Rewrite text (or "N/A"). No "unchanged" shortcuts — human needs the full state every time to review. NEVER click Submit. NEVER select preference on Handshake until human confirms.
13. **Form-fill payload (Opus, right before spawning form-fill agent)** — precompose the full canonical payload. Sonnet is a dumb executor; all strings must be final:
    - Chosen side = Response {1 or 2}
    - Score (1–7) + orientation reminder: 1=strong R1, 7=strong R2, so {N} means {interpretation}
    - Systematic Issues text (final, copy-paste ready)
    - Justification text (final, ≤4 sent, KaTeX, no Likert number, no R1/R2 labels)
    - Rewrite category (exact wording: N/A or the trigger label)
    - Rewrite explanation text (final) or N/A
    - Rewrite text (final corrected chosen response) or "" if N/A
    - Formatting flag values — **MUST come from the task file's `### Formatting Flags` section verbatim.** No inventing values at payload time. If the task file lacks per-flag justifications, STOP and backfill the task file first.
    - Explicit "STOP before Submit" instruction
14. **Form fill (host claude code)** — Cowork saves final payload inside task file under a `## Form-Fill Payload` section. Cowork tells user: "Payload ready in tasks/{id}.md. Run host fill." User runs host claude code, which reads task file + drives Handshake via chrome-devtools MCP, STOPS before Submit. Cowork never touches browser.
15. **Wiki update (Opus)** — selective updates to `wiki/`. Never modify `raw/` or `tasks/`.
   - `scoring-calibration.md` — only when there's a new calibration lesson (not just to log every score)
   - `common-errors.md` — only if error represents a *new recurring pattern*, not a one-off
   - `domain-notes.md` — only if same subdomain seen twice+
   - `rewrite-patterns.md` — only if new trigger type encountered
   - `workflow-lessons.md` — only on process failures

## Scoring
`1/7`=stark, `2/6`=clear, `3/5`=close. `4`=Equally Prefer — **ONLY** for EXACT-MATCH responses (identical text). Very rare. When using 4, write justification with "both responses" language, not chosen/rejected. Otherwise always indicate at least slight preference. (Nicolas, #alloy-announcements 2026-04-10)
- Factual error in key result → 1/2 or 6/7, never 3/5 — **BUT only when one response errs and the other doesn't**
- Both responses have major issues → NEVER extreme (1/7). Stay in 3/5 range; slight preference to whichever is better on other dimensions.
- Don't bias toward longer responses. Don't bias preference by which response needs more rewrites.
- Ambiguous/ill-posed prompt → accept reasonable model interpretations; don't penalize for prompt's ambiguity.

## Justification Rules
- Max 4 sentences (Nick confirmed via Slack 2026-04-05)
- Do NOT mention likert score number in justification text (Handshake QC check enforces this)
- Must be specific — reference specific parts of responses. Dillon's test: "if you read the justification alone and can't tell what problem it applies to, it's too vague."
- Prioritize the dimensions that most influenced the score. Don't need to be exhaustive, but must be aligned to rating.
- Use KaTeX in justification field on Handshake. Handshake renders KaTeX — write math as `$...$` / `$$...$$`.

## Critical Rules
- Save VERBATIM response text INLINE in task file — never summarize, never reference external snapshots (/tmp, etc.). Full text regardless of length.
- Say "chosen response"/"rejected response", never "Response A/B"
- Only rewrite chosen response, never rejected
- Rewrites fix presentation only (broken LaTeX, broken markdown, non-standard notation, structure, random tokens) — never content/facts
- Rewrites = minimal diff. Fix ONLY the specific trigger. Do not alter surrounding delimiters, whitespace, or structure that wasn't broken. If fixing `\begin{equation*}` inside `$$`, strip the inner environment but keep `$$` intact.
- `\[...\]` vs `$$...$$` delimiter difference is NOT a rewrite trigger — just convention. Don't convert between them.
- Redundant content / model rambling is NOT a rewrite trigger — penalize in preference scoring (completeness/clarity) instead.
- Factual errors in chosen response: LEAVE THEM IN. Never remove reasoning errors in rewrite. Note in justification.
- Symbol reuse (same var for multiple things): if still understandable → rewrite trigger (fix notation). If so bad proof is unclear → preference penalty (clarity), not just rewrite.
- If in doubt on rewrite: don't. If outside domain: abandon.
- Always turn off formatting on Handshake (top-right button) — use raw view, render LaTeX externally.
- **Platform rendering is intentionally OFF** (Nicolas, 2026-04-10). Plain text = source of truth. Verify externally via https://stackedit.io/app# or https://quicklatex.com/ or similar. Any renderer that displays it correctly is acceptable — don't require a specific library.
- **KaTeX ≠ LaTeX.** KaTeX (what Handshake uses when rendering is on) is stricter than MathJax/quicklatex — notably on `&` inside inline math, certain `\begin{env}` inside `$$`, and some macro edge cases. A KaTeX parse error alone is NOT sufficient to flag Broken LaTeX. Before flagging, paste the fragment into quicklatex.com; if quicklatex renders it, the flag is No and no rewrite is warranted. (See f95a7def lesson.)
- **Rewrite-trigger decisions = raw text ONLY.** Never trust rendered Handshake view (rendering is off, and even when on it masks source defects). Decide from downloaded blob in `alloy/scrapes/{id}.txt` or inline verbatim in task file. If you have not read the raw source, you have not earned the rewrite-trigger call.
- Currently only Math / Math-adjacent (Physics) tasks available (2026-04-10). Other domains pending.

## Chrome Interaction Stack (HOST ONLY — deprecated in Cowork)
**Cowork must not use these tools.** Kept for host claude code reference.
Order of use for Handshake interaction:
1. `tabs_context_mcp` — always first. Returns tab IDs in MCP tab group. Pick one or `tabs_create_mcp`.
2. `navigate(tabId, url)` — loads URL, waits for load.
3. `javascript_tool(tabId, text)` — workhorse. Inject `scrape-handshake.js` as string. Returns last expression.
   - **Content filter**: return values with LaTeX/math come back as `[BLOCKED: ...]`. Workaround: script writes Blob + triggers download, returns only length counts (safe).
4. `read_page(tabId, filter: "interactive")` — accessibility tree. Form-fill uses this to locate justification field + up-arrow advance button.
5. `get_page_text(tabId)` — fails on Handshake (LaTeX triggers filter). Use blob download instead.
6. `form_input(...)`, `find(...)` — form-fill uses `form_input` (NOT click+type) — click+type flaky on React-controlled inputs.

Scrape agent flow (~4 calls):
```
tabs_context_mcp                    → tabId
navigate(tabId, handshake URL)      → page loads
javascript_tool(tabId, <scrape.js>) → expand tabs, build blob, download, return {ok, lens}
[approve download prompt if shown]
→ file lands in /sessions/dreamy-kind-davinci/mnt/Downloads
Read(/path/to/file)                 → Opus reads verbatim
```

Downloads dir `/sessions/dreamy-kind-davinci/mnt/Downloads` is mounted and readable. After scrape, copy the blob into `alloy/scrapes/{short-id}.txt` (create dir if missing) so audits have a clean per-task artifact and the Downloads folder stays uncluttered.

## Knowledge Base
`raw/` = immutable source material. `wiki/` = LLM-owned, auto-updated. `tasks/` = evaluations. `rewrites/` = saved rewrites. Full guide: REFERENCE_GUIDE.md
