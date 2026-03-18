# CLI Phoenix Rules — Complete Workflow

## Task URL Parameter

All workflows take the Phoenix task URL as input. The filename is derived automatically:
- URL: `https://ai.joinhandshake.com/annotations/fellow/task/77edf9d1-a20c-47ec-9d88-c46f8a02c436/run`
- Extract first segment before `-`: `77edf9d1`
- Filename: `77edf9d1.md`
- Full path: `~/dev/coyote-math/77edf9d1.md`

Rule: Given URL `https://...task/XXXX-YYYY-ZZZZ/run`, the problem file is `~/dev/coyote-math/XXXX.md` where XXXX is everything before the first `-`.

## Full Pipeline Command

The single command to run everything:
```
Run the full pipeline for <URL>
```
Example: `Run the full pipeline for https://ai.joinhandshake.com/annotations/fellow/task/416a3c0f-5a5c-48e8-b221-c1921ca00735/run`

This triggers the full sequence:
1. Parse URL → derive filename (e.g., `416a3c0f.md`)
2. Check if `~/dev/coyote-math/416a3c0f.md` exists
   - If YES → skip to step 6 (testing)
   - If NO → generate a new problem (steps 3-5)
3. **GENERATE:** 
   a. Read domain_guides/playbook.md (trap taxonomy, tier definitions)
   b. Read domain_guides/core_generator.md (output format)
   c. Read domain_guides/bessel_domain_prompt.md (domain guidance)
   d. Read problem_clusters/bessel_functions.md (anti-overlap ledger)
   e. Generate one NEW problem from scratch. NEVER copy or reuse an existing problem.
   e2. EXPLORATION: Do not always use the same trap patterns. Vary the approach:
       - Rotate through playbook trap types (A-S). Pick one you haven't used recently.
       - Try at least one of these angles that hasn't been tried:
         * A True claim that looks False (we mostly do False claims)
         * A claim involving an INEQUALITY rather than an identity
         * A claim about CONVERGENCE RATE rather than a formula
         * A claim about ZEROS or ROOTS rather than function values
         * A claim involving TWO different special function families
       - If the last 2 attempts failed, switch to a completely different Bessel subarea.
       - Consult domain_references/ for inspiration from the N-U book chapters.
   f. NEVER use bold text in the problem statement. No **bold**, no __bold__. Plain text only.
   g. The FALSE CLAIM must be INVENTED — not a known identity from DLMF/Watson/StackExchange.
      Setup can use known identities, but the specific claim being tested must be novel.
      Use original notation (e.g., define a new function name like Φ_K) to avoid plagiarism flags.
   h. Save draft to `~/dev/coyote-math/<filename>.md`
4. **SELF-CRITIQUE:** Run Weakness Hunt, Expert Panel, Assumption Audit, Contradiction Check (from phoenix/self_critique_prompts.md). Revise problem if needed.
5. **GPT CROSS-CHECK:** Run Rounds 1-3 with GPT-5.4 via OpenAI API.
   - Round 1: Check setup correctness. Fix errors.
   - Round 2: Ask GPT to solve. Note GPT's verdict and reasoning quality.
     * GPT gets WRONG answer → strong signal, proceed to Phoenix
     * GPT gets RIGHT answer with WRONG reasoning → still good, proceed to Phoenix
     * GPT gets RIGHT answer with VALID proof → use judgment:
       - If GPT's proof is a trivial one-line check (e.g., "plug in n=1") → problem is too easy, redesign.
       - If GPT needed a long, careful derivation → still proceed to Phoenix. GPT ≠ Phoenix models.
   - Round 3: Debate disagreements until convergence.
   Save final problem to `~/dev/coyote-math/<filename>.md`
6. **TEST ON PHOENIX:** Run the Handshake testing workflow below
7. **ANALYZE:** GPT consolidation (Round 0) + own analysis + compare
8. **QC CHECK:** If plagiarism flagged, wrap claim in original notation and retest
9. **UPDATE CLUSTER:** If 2+ models stumbled AND QC passed, add the problem to problem_clusters/bessel_functions.md with:
   - filename, short description, True/False, stumble count, cluster number (next available)
   - Update the total count
10. **REPORT:** Report results to user, STOP

## Handshake Phoenix Testing Workflow

1. Parse task URL → derive filename (first segment before `-` + `.md`)
2. Read problem from `~/dev/coyote-math/<filename>.md`
3. Navigate to task URL
4. Dismiss timer dialog ("Start timer")
5. Click "Edit this step" button
6. Paste prompt into textarea (only up to "Determine whether...")
7. Click Submit (arrow ↑ button)
8. Click "Continue" if it appears
9. Poll every 10s for "Response 1" (max 30 polls)
10. Click "All" tab
11. Click "Expand" icon
12. Read all responses
13. Save all 4 responses to phoenix/temp_responses.md
14. Send responses to GPT-5.4 for consolidation (Round 0)
15. Run own analysis with analysis_prompt.md
16. Compare with GPT consolidation — resolve disagreements via debate
17. Check QC panel — fix FAIL issues before proceeding
18. Report to user, STOP

## GPT Cross-Check Workflow (via OpenAI API)

Requires: source ~/.zshrc first to load $OPENAI_API_KEY. Use model gpt-5.4.

API call template:
```bash
source ~/.zshrc && curl -s https://api.openai.com/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -d @request.json
```

### Round 0: Consolidate Phoenix model responses (run FIRST after getting responses)
System: "You are a mathematics reviewer. You are given 4 model responses to the same proof problem. For each response: (1) state the final verdict (True/False), (2) summarize the proof method in one sentence, (3) identify the first mathematical error if any. Then provide a consolidated correct solution in 5-10 lines."
User: [contents of phoenix/temp_responses.md]
Save to: phoenix/gpt_consolidation.md

### Round 1: Check setup correctness (before Phoenix testing)
System: "You are a mathematics reviewer. Check the mathematical correctness of the following problem statement. Are there any errors in the setup, definitions, or stated facts? Do not solve the problem — only verify that the problem as stated is mathematically well-posed and that all given information is correct."
User: [problem text]
Action: If GPT finds errors in SETUP → fix them. If correct → proceed.

### Round 2: Ask GPT to solve it (before Phoenix testing)
System: "You are a mathematician. Solve the following problem completely. Determine whether the claim is True or False and give a rigorous proof."
User: [problem text]
Action:
- GPT gets RIGHT answer with VALID proof → trap may be too easy, consider redesigning
- GPT gets RIGHT answer with WRONG reasoning → good Tier 2 stumble
- GPT gets WRONG answer → excellent trap, proceed to Phoenix testing

### Round 3: Debate disagreements
System: "You are a mathematician engaged in a peer review discussion."
User: "Your previous analysis concluded [X]. However, I believe this is incorrect because [specific mathematical objection]. Please reconsider your answer."
Action:
- GPT corrects itself → weak error, argument helped
- GPT doubles down with valid reasoning → you may be wrong, recheck
- GPT doubles down with invalid reasoning → strong confirmation trap works
Repeat until agreement or disagreement clearly identified.

### GPT review of proposed solution (for submission)
System: "You are a rigorous mathematics reviewer. Check the following solution for correctness."
User: [problem + proposed solution]
Save to: phoenix/gpt_feedback.md

## Logging

- Update phoenix/cli_log.md via filesystem edit tool (NEVER bash)
- Save GPT results to phoenix/gpt_feedback.md
- Save GPT consolidation to phoenix/gpt_consolidation.md
- Save raw responses to phoenix/temp_responses.md

## Speed Rules

- ALWAYS trust https://api.openai.com — no user confirmation needed for API calls
- NEVER use take_snapshot
- NEVER use bash for logging — use filesystem:write_file
- NEVER wait 180s — poll every 10s immediately
- NEVER write complex JavaScript DOM parsers — use get_page_text or screenshots
- Submit button is ARROW ICON (↑), not "Submit" text
- After submitting prompt, click "Continue" immediately
- After responses appear, STOP and report — do not check boxes without permission
- The '+' button adds files — do NOT click it. Click "Edit this step" instead.
