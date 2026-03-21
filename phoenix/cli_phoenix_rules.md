# CLI Phoenix Rules — Complete Workflow

## ⚠️ ANALYSIS QUALITY WARNING — READ FIRST

The response analysis (step 7) is the most important part of the pipeline. It directly determines whether a task gets accepted or rejected. Vague descriptions like "wrong weight," "measure confusion," or "uses wrong formula" are NOT acceptable. For every failed response, you MUST:
- Quote the EXACT erroneous expression from the response (e.g., "$e^{-a} \cdot e^a = 1$")
- Show the correct computation (e.g., "$e^{-a} \cdot e^{-a} \cdot e^a = e^{-a}$, not $1$")
- Identify WHERE in the response the error occurs (e.g., "Step 5, second line")

Known failure pattern: CLI does a lazy first pass, calls errors "minor," skips checking all computational steps, and only produces rigorous analysis after being pushed. THE FIRST PASS MUST BE THE FINAL PASS.

---

## ⛔ CRITICAL: DO NOT FABRICATE RESPONSES

On 2026-03-20, CLI fabricated all 4 model responses for task 7edc37eb. The saved file contained CLI-generated text, not actual model outputs. This led to wrong stumble count (2/4 vs real 1/4) and invalid submission.

**If extraction fails, REPORT THE FAILURE. Do NOT generate plausible-looking responses.**

After extraction, you MUST run the integrity check (step 6p) and get user confirmation BEFORE proceeding.

---

## ⛔ NO PYTHON

Do not use Python anywhere in this pipeline. All mathematical verification goes through GPT Round 1 (step 5) or hand computation.

---

## ⛔ NO CHROME DEVTOOLS MCP

PinchTab is the ONLY browser tool. All browser interaction uses PinchTab HTTP API via curl to localhost:9870.

---

## Task URL Parameter

Rule: Given URL `https://...task/XXXX-YYYY-ZZZZ/run`, the problem file is `~/dev/coyote-math/XXXX.md` where XXXX is everything before the first `-`.

## Output Directory

All pipeline work products go in `phoenix_tasks/`. Shared config stays in `phoenix/`.

## Full Pipeline

1. Parse URL → derive filename
2. Check if problem file exists (if YES skip to step 6, if NO generate steps 3-5)
3. **GENERATE:** Read playbook + cluster + design_methodology.md, generate new problem.
4. **SELF-CRITIQUE:** If too easy, go back to step 3.
5. **GPT CROSS-CHECK:** Round 1. Round 2 only if disagreement.
6. **TEST ON PHOENIX via PinchTab:** Steps 6a-6p.
7. **ANALYZE.** Sub-steps:
   a. Own analysis FIRST → failure_explanations file
   b. Self-verify (MANDATORY) — re-read temp_responses, confirm every cited error exists in verbatim text
   c. GPT Round A with LITERAL text
   d. Resolve disagreements with specific citations
8. **QC CHECK**
9. **WRITE SOLUTION** (if 2+ stumbled AND QC passed)
10. **UPDATE** cluster + playbook
11. **COMPLETION CHECKLIST — ALWAYS RUN**
12. **REPORT**

## Handshake Testing Workflow (step 6) — ALL PinchTab

```bash
AUTH="Authorization: Bearer 3e64a4e055c949c20c37f70f99b8191f440bb3f0aa3031bc"
PORT=9870
```

6a. Parse task URL → derive filename
6b. Read problem from file
6c. Navigate to task URL. Save returned tabId.
6d. Wait 5s, get snapshot, click "Start timer".
6e. Get snapshot, click "Edit this step".
6f. Paste prompt via evaluate + execCommand("insertText"). If fails, ask user to paste.
6g. Get snapshot, click Submit (arrow icon ↑).
6h. Check for "Continue" button. Click if present.
6i. Poll every 10s for Response tabs (max 30 polls).
6j-6k. Click "All" tab, click "Expand".
6l. Click Tx button for raw LaTeX.
6m. Extract ALL responses in one text call. Split by "Response N" markers. Save to temp_responses file.
6n. Report char counts. Under 500 = re-extract.
6o. Read back and confirm all 4 present.

**6p. ⚠️ INTEGRITY CHECK (MANDATORY — do NOT skip):**
Print to the user:
- First 100 characters of each response
- Character count of each response
- Total character count
Then ask: **"Do these match what's on the Handshake page? Please verify before I proceed."**
WAIT for user confirmation. Do NOT proceed to step 7 until user says yes.

**Red flags that indicate failed extraction (STOP and re-extract):**
- All 4 responses have similar length (within 500 chars of each other)
- Any response under 1000 chars
- Responses lack self-corrections, false starts, or "let me recalculate" moments
- Text is suspiciously clean and well-organized

**If extraction fails twice: ask user to extract responses manually.**

## Completion Checklist

```
[CHK-1] temp_responses file: PASS/FAIL (char counts: R1=XXXX R2=XXXX R3=XXXX R4=XXXX)
[CHK-2] INTEGRITY CHECK: user confirmed responses match Handshake page: PASS/FAIL
[CHK-3] failure_explanations file: PASS/FAIL (all 4 responses analyzed)
[CHK-4] failure_explanations quotes exact error text from verbatim responses: PASS/FAIL
[CHK-5] self-verification completed — every cited error found in verbatim text: PASS/FAIL
[CHK-6] gpt_round_a file: PASS/FAIL
[CHK-7] own analysis written before GPT call: PASS/FAIL
[CHK-8] GPT disagreements resolved with citations: PASS/FAIL (or N/A)
[CHK-9] solution appended to problem file: PASS/FAIL (or N/A if <2 stumbled)
[CHK-10] solution GPT-reviewed: PASS/FAIL (or N/A)
[CHK-11] cluster updated: PASS/FAIL (or N/A if <2 stumbled)
[CHK-12] playbook updated: PASS/FAIL
[CHK-13] log up to date: PASS/FAIL
```

## PinchTab Configuration

- Headed instance: port 9870, profile "handshake"
- Token: 3e64a4e055c949c20c37f70f99b8191f440bb3f0aa3031bc

## PinchTab Known Gotchas

1. Tab IDs change — verify with GET /tabs.
2. ?filter=interactive renumbers refs.
3. React rendering delays — wait 3-5s after clicking.
4. "All" tab for extraction — individual tab clicks don't update /text.
5. Expand button — click before extracting.
6. Tx button — toggles raw LaTeX. Must be raw for extraction.
7. Textarea is contenteditable — use evaluate with execCommand("insertText").
8. Do NOT use Chrome DevTools MCP.
9. Do NOT put # comments inside curl commands.
10. **NEVER fabricate responses. If extraction fails, report failure and ask user.**

## GPT Cross-Check Workflow (via OpenAI API)

Use model gpt-5.4. Source ~/.zshrc first.

### Round 1: Verify & Solve (SINGLE CALL)
### Round A: Analyze Responses (SINGLE CALL, NEVER SKIP)
### GPT Solution Review (step 9b)

See previous version for full prompts.

## Speed Rules

- NEVER use Python
- NEVER use Chrome DevTools MCP
- NEVER put # comments inside curl commands
- NEVER fabricate or paraphrase responses
- ALWAYS get user confirmation on extracted responses before analysis
