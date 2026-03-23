# CLI Phoenix Rules — 3-Stage Pipeline

## ⚠️ ANALYSIS QUALITY WARNING — READ FIRST

The response analysis (Stage 3) is the most important part of the pipeline. It directly determines whether a task gets accepted or rejected. Vague descriptions like "wrong weight," "measure confusion," or "uses wrong formula" are NOT acceptable. For every failed response, you MUST:
- Quote the EXACT erroneous expression from the response
- Show the correct computation
- Identify WHERE in the response the error occurs

THE FIRST PASS MUST BE THE FINAL PASS.

---

## ⛔ CRITICAL: DO NOT FABRICATE RESPONSES

If extraction or reading fails, REPORT THE FAILURE. Do NOT generate plausible-looking responses.

---

## ⛔ NO PYTHON

Do not use Python anywhere in this pipeline.

---

## Browser Tool: page-agent

All browser interaction uses page-agent (Alibaba) injected via CDN, then re-instantiated with OpenAI config. Called via `javascript_tool` in Claude in Chrome.

**Injection (once per page load):**
```javascript
// 1. Inject CDN
const script = document.createElement('script');
script.src = 'https://cdn.jsdelivr.net/npm/page-agent@1.5.11/dist/iife/page-agent.demo.js';
script.crossOrigin = 'true';
document.head.appendChild(script);
// wait 3s

// 2. Re-instantiate with OpenAI config
const PA = window.pageAgent.constructor;
window.pageAgent = new PA({
  baseURL: 'https://api.openai.com/v1',
  apiKey: '<OPENAI_API_KEY>',
  model: 'gpt-5.4',
  language: 'en-US'
});

// 3. Inject _pa wrapper (see phoenix/page_agent_notes.md for full code)
```

**page-agent is stateful** — history carries across `exec()` calls within the same page session. Do NOT clear history between calls. GPT accumulates context across all steps.

**Core APIs via `_pa` wrapper:**
- `_pa.getElements()` — indexed elements, long ones chunked
- `_pa.chunk(idx, n)` — read long elements in 120-char chunks
- `_pa.click(index)` — click element
- `_pa.type(index, text)` — fill input/textarea
- `_pa.exec(cmd)` — natural language command to GPT-5.4 on-page

**All calls wrapped in async IIFE:**
```javascript
(async () => { return await window._pa.exec("..."); })()
```

---

## Task URL Parameter

Given URL `https://...task/XXXX-YYYY-ZZZZ/run`, the problem file is `XXXX.md` where XXXX is everything before the first `-`.

## Output Directory

All pipeline work products go in `phoenix_tasks/`. Shared config stays in `phoenix/`.
Problem files saved as `phoenix_tasks/wip_{name}.md`.

---

## Stage 1 — Generate, Solve & Verify

One problem at a time, start to finish.

### Files read:
- `domain_guides/playbook.md` — master playbook: methodology + field notes. **Check Recent Technique Usage table** to confirm separation rule.
- `problem_clusters/{cluster}.md` — existing problems to avoid repeats
- `problem_clusters/guide.md` — cluster organization
- `phoenix/self_critique_prompts.md` — "too easy" detection

### Steps:

1. **Generate** — Claude creates problem + solution + complexity analysis
2. **Self-critique** — read `self_critique_prompts.md`, too easy → retry
3. **Claim task** on Handshake (must have an open task before pasting)
4. **Paste problem into Handshake textarea** (don't submit)
5. **GPT Round 1** — `_pa.exec()`: "Read the problem in the textarea. Verify: is it well-formed? Is the proposed answer correct? Is the proof rigorous? Solve independently and compare."
6. **Claude verifies independently** — reads same problem file
7. **Consolidate** — if Claude and GPT disagree → resolve with specific math, fix problem/solution
8. **Save** as `phoenix_tasks/wip_{name}.md` (problem + solution + complexity)

Output: verified `wip_{name}.md` → proceed to Stage 2.

---

## Stage 2 — Submit & QC

One problem at a time.

### Steps:

1. **Clear textarea** (if anything left from Stage 1)
2. **Extract problem statement only** from `phoenix_tasks/wip_{name}.md` (not solution, not complexity analysis)
3. **Paste** into Handshake textarea via `_pa.type()`
4. **Click** Start timer → Submit → Continue (all via `_pa.click()`)
5. **Poll** for responses via `_pa.getElements()` every 10s (max 30 polls)
6. **Click** All tab → Expand (via `_pa.click()`)
7. **Integrity check (MANDATORY):**
   - `_pa.exec("Read all 4 responses. For each, print the first 100 characters and total character count.")`
   - Ask user: "Do these match what's on the Handshake page?"
   - WAIT for user confirmation. Do NOT proceed until user says yes.
8. **QC check** — `_pa.exec("Read the QC panel. Report any flags or warnings.")`

**Red flags (re-extract):**
- All 4 responses similar length (within 500 chars)
- Any response under 1000 chars
- Unusually uniform formatting across all 4 responses
- Identical paragraph structure across responses
- Mismatch between visible tab content and extracted text

Output: 4 model responses on page, QC confirmed.

---

## Stage 3 — Analyze Responses

All on-page, stateful. GPT reads DOM directly — no extraction, no curl.

### Files read:
- `domain_guides/analysis_prompt.md` — failure types, output format, valid stumble criteria

### Steps:

1. **Claude analyzes** all 4 responses using `analysis_prompt.md` criteria
   - Output: `phoenix_tasks/failure_explanations_{task}.md`
2. **Self-verify (MANDATORY)** — re-read each response, confirm every cited error exists in verbatim text
3. **GPT Round A** — for each response tab:
   - `_pa.exec("Here is the analysis criteria: {analysis_prompt.md content}. Analyze Response N on this page.")`
   - GPT reads response directly from DOM
   - History carries forward — GPT accumulates context across all 4
4. **Consolidate** — compare Claude vs GPT verdicts:
   - `_pa.exec("Compare your analysis with Claude's verdicts: [...]. Resolve disagreements citing specific lines.")`
   - All on-page, GPT already has everything in memory
5. **Update** `problem_clusters/{cluster}.md` + `domain_guides/playbook.md`
6. **Completion checklist**
7. **Report** — stumble count, which models failed, failure types, QC status

---

## Completion Checklist

```
[CHK-1] integrity check: user confirmed responses match page: PASS/FAIL
[CHK-2] Claude analysis file: PASS/FAIL (all 4 responses analyzed)
[CHK-3] Claude analysis quotes exact error text: PASS/FAIL
[CHK-4] self-verification: every cited error found in verbatim text: PASS/FAIL
[CHK-5] GPT Round A completed: PASS/FAIL
[CHK-6] Claude analysis written before GPT call: PASS/FAIL
[CHK-7] Claude vs GPT disagreements resolved with citations: PASS/FAIL (or N/A)
[CHK-8] cluster updated: PASS/FAIL (or N/A if <2 stumbled)
[CHK-9] playbook updated: PASS/FAIL
[CHK-10] QC check: PASS/FAIL
```

---

## page-agent Known Gotchas

1. Element indices change after page state changes — re-run `_pa.getElements()` after every click.
2. React rendering delays — wait 3-5s after clicking before next `_pa.getElements()`.
3. "All" tab — click before reading responses.
4. Expand button — click before reading responses.
5. Tx button — toggles raw LaTeX. Must be raw for reading.
6. Textarea index is typically [11] but ALWAYS verify via `_pa.getElements()`.
7. All async calls: `(async () => { ... })()` — top-level await not supported.
8. **NEVER fabricate responses. If reading fails, report failure and ask user.**
9. `_pa.exec()` response is in `last.action.input.text`, NOT `last.reflection`.
10. Do NOT clear `window.pageAgent.history` between calls — stateful session needed.
11. All DOM reading goes through `_pa.exec()` (GPT) — Claude never reads DOM directly.
12. Page reload kills page-agent — re-inject if `window._pa` is undefined.

---

## Speed Rules

- NEVER use Python
- NEVER fabricate or paraphrase responses
- ALWAYS re-run `_pa.getElements()` after any click (indices change)
- ALWAYS get user confirmation on responses before analysis
- ONE tool: page-agent for everything on-page
