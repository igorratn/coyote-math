# Alloy Host SOP (run in host claude code)

Host CLI owns all browser interaction and all reasoning. Handoff to human = filesystem. Human reviews `tasks/<short_id>.md`, confirms, then triggers form fill.

Repo root: `/Users/iratnere/dev/coyote-math/alloy` (host path).

---

## Jobs 1 + 2 — Scrape + Evaluate (parallelized)

**Fire Track A + Track B simultaneously. Track B is pre-load only — eval proper begins once Track A delivers the scrape file.**

### Track A — Scrape

Input: Handshake task URL (e.g. `https://ai.joinhandshake.com/annotations/fellow/task/<uuid>/run`).

1. Extract `<uuid>` from URL. `short_id` = first 8 chars.
2. Locate existing Chrome tab at that URL via `chrome-devtools` MCP `list_pages`. Reuse if found — do NOT navigate. Else open tab + navigate.
3. Read `scripts/scrape-handshake.js` from repo.
4. `evaluate_script` on the tab. Expected return: `{ok, task_id, prompt_len, r1_len, r2_len, download_name, missing}`.
5. Script downloads blob as `handshake-scrape-<short_id>.txt` to Downloads dir.
6. `cp ~/Downloads/handshake-scrape-<short_id>.txt alloy/scrapes/<short_id>.txt`.
7. Validate: `prompt_len >= 200`, `r1_len > 500`, `r2_len > 500`, `missing == 0`. Fail loud on any miss.
8. Signal Track B: scrape ready. Print: `scrapes/<short_id>.txt ready. prompt_len=X, r1_len=X, r2_len=X, missing=0`.

### Track B — Eval Pre-load (runs while Track A scrapes)

- Read `wiki/workflow-lessons.md`
- Read `wiki/scoring-calibration.md`
- Read `templates/task-template.md`
- Check latest announcement / thread delta before trusting local docs. If platform flow changed, update instructions first.
- Flag any relevant lessons for this task type (if URL or domain known from input).

### Eval Proper (after Track A completes)

Input: `scrapes/<short_id>.txt`

**Source checkpoint (MANDATORY):**
- Prompt present and not truncated?
- Both responses present and not truncated?
- No `[BLOCKED]` markers?
- FAIL EARLY if any check fails.

**Write `tasks/<short_id>.md` using `templates/task-template.md`:**
1. Paste raw verbatim prompt + both responses inline. Never summarize.
2. Copy the platform's AI investigation notes (Correctness / Completeness / Clarity / Helpfulness), then explicitly mark what you agree/disagree with.
3. **Preference gate** — choose side first, then strength:
   - 0 = no meaningful difference
   - 1 = slight preference
   - 2 = moderate preference
   - 3 = strong preference
4. **Evaluate** — Correctness > Completeness > Clarity > Helpfulness / domain appropriateness.
5. **Rating justification** — 2–5 sentences, "chosen response"/"rejected response" only, no stale Likert language, cite specific formulas/steps. Shared/systematic issues now live here.
6. **Formatting Flags** — all 5 per-category with Yes/No/N/A + reason.
7. **Seeded rewrite review** — inspect generated rewrite + change log, keep/modify/revert, then write brief rewrite justification.

**Self-review pass (MANDATORY before stopping):**

*Literal-claim audit:*
- Re-read saved task file.
- Verify EVERY justification claim against literal saved text.
- Phantom claims (asserting something not in the text) = #1 error. Fix any found.

*Template lint (checklist from `wiki/template-lint.md`):*
- [ ] No R1/R2/A/B anywhere in eval text
- [ ] Rating uses current 0–3 flow, not stale 1–7/Likert language
- [ ] Justification 2–5 sentences and includes shared/systematic issues when relevant
- [ ] Verbatim responses inline
- [ ] All 5 formatting flags with per-category justification
- [ ] Seeded rewrite review completed when present
- [ ] LaTeX: broken only if fails "any renderer counts" test (not KaTeX-only)

**STOP. Print summary:**
```
Evaluation saved: tasks/<short_id>.md
Chosen: {chosen side}
Strength: {0-3}
Shared issues in justification: {one-line summary or N/A}
Justification: {first sentence}
Flags: Broken LaTeX={}, Broken Markdown={}, Non-standard notation={}, Structural issues={}, Garbled text={}
Rewrite review: {accepted/modified/reverted/N/A}
Review tasks/<short_id>.md. Run "host fill <short_id>" when ready.
```
Human reviews. Human triggers Job 3.

---

## Job 3 — Form Fill

Input: `tasks/<short_id>.md` — `## Form-Fill Payload` section.

1. Read task file. Parse `## Form-Fill Payload` → payload dict.
2. Locate tab at matching task URL. Reuse. No navigation.
3. Per-section fill (React re-renders invalidate whole-form refs — snapshot per section):
   - `read_page(tabId, filter:"interactive")` for current section only.
   - `form_input` each field once with final strings. Use cached labels from `wiki/handshake-selectors.md`.
   - Verify required fields non-empty. When flag == "No", write "N/A" in explanation — never leave blank.
   - Click section advance (↑). Report checkpoint.
4. **Submit blacklist:** if Submit button ref surfaces → DO-NOT-TOUCH. Record and stop.
5. STOP before Submit. Report: `{last_section, fields_written, awaiting_human_submit: true}`.
6. Human reviews and clicks Submit manually.

---

## Hard Rules
- **NEVER click Submit.** Human does it.
- **Never reinterpret payload.** All strings are final as-written in task file.
- **Never rescore, never edit evaluation content** after self-review pass.
- **Tab reuse mandatory** when matching tab exists.
- **Fail loud** on validation errors — don't proceed with partial scrape or ambiguous refs.
- **VERBATIM always** — no summaries, no paraphrases in task file.
- **"chosen response"/"rejected response" only** — no R1/R2/A/B anywhere in eval text. Rating-0 case may use "both responses".

---

## File Locations (host paths)
- Scrape script: `alloy/scripts/scrape-handshake.js`
- Scrape output: `alloy/scrapes/<short_id>.txt`
- Task file: `alloy/tasks/<short_id>.md`
- Template: `alloy/templates/task-template.md`
- Selector cache: `alloy/wiki/handshake-selectors.md`

---

## Chrome Interaction Stack

1. `tabs_context_mcp` — always first. Returns tab IDs.
2. `navigate(tabId, url)` — loads URL, waits.
3. `javascript_tool(tabId, text)` — workhorse. Inject `scrape-handshake.js` as string.
   - **Content filter**: LaTeX/math return values come back `[BLOCKED]`. Workaround: script writes Blob + triggers download, returns length counts only.
4. `read_page(tabId, filter:"interactive")` — accessibility tree. Form-fill locates fields + advance button.
5. `get_page_text(tabId)` — fails on Handshake (LaTeX triggers filter). Use blob download.
6. `form_input(...)` — use for all field writes. NOT click+type (flaky on React inputs).

Scrape flow (~4 calls):
```
tabs_context_mcp                    → tabId
navigate(tabId, handshake URL)      → page loads
javascript_tool(tabId, <scrape.js>) → expand tabs, build blob, download, return {ok, lens}
[approve download prompt if shown]
→ file lands in ~/Downloads/
cp to alloy/scrapes/<short_id>.txt
Read(scrapes/<short_id>.txt)        → verify verbatim
```

**Bounded retry (form fill):** stale ref → reacquire current section only, retry ONCE, else abort.
