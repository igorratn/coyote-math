# RM SxS Evaluation Pipeline

## Overview
Advisor-pattern pipeline for Handshake task evaluation.
- **Sonnet agents**: extraction, template fill, rewrite execution, form fill (mechanical)
- **Opus** (orchestrator): domain check, scoring, justification, rewrite detection (judgment)
- **Human**: final review + Submit

## Trigger
User provides a Handshake task URL like:
`https://ai.joinhandshake.com/annotations/fellow/task/{uuid}/run`

## Pipeline Steps

### Phase 1: Extraction (Sonnet)

Spawn a Sonnet agent with:
- The extract-and-fill prompt from `prompts/extract-and-fill.md`
- Substituted variables: TASK_URL, TAB_ID, OUTPUT_PATH
- OUTPUT_PATH = `/sessions/focused-eager-planck/mnt/alloy/tasks/{shortId}.md`

The agent:
1. Reads the Handshake page via Chrome MCP
2. Extracts metadata, prompt, both responses VERBATIM
3. Writes the task file with evaluation sections marked "(pending)"

**Orchestrator checks after return:**
- File exists at expected path
- Both responses are non-empty
- Prompt is captured
- Metadata is complete

### Phase 2: Evaluation (Opus)

Orchestrator (me) reads the task file and performs:

1. **Domain Check** — Is this within our expertise? If not, flag and consider abandoning.

2. **Systematic Issues** — Read BOTH responses. Identify issues shared across both on the 4 dimensions (correctness, completeness, clarity, helpfulness). <5 sentences or "N/A". Complete BEFORE choosing preference.

3. **Scoring** — Apply the scoring framework:
   - Correctness (most important) > Completeness > Clarity > Domain appropriateness
   - Use full 1-7 range. Never use 4.
   - Factual error in key result → 1/2 or 6/7 (but only when one errs and other doesn't)
   - Both have major issues → stay in 3/5 range
   - Don't bias toward longer responses
   - Consult `wiki/scoring-calibration.md` for calibration lessons

4. **Justification** — Max 4 sentences. Must:
   - NOT mention likert score number
   - Reference specific parts of responses
   - Use "chosen response" / "rejected response" language
   - Prioritize dimensions that most influenced score
   - Use KaTeX notation ($...$, $$...$$) for math

5. **Rewrite Detection** — Check chosen response for each of the 5 categories:
   - Broken LaTeX (display math not rendering)
   - Broken markdown/code formatting
   - Non-standard notation (if it causes confusion)
   - Random symbols / language switching
   - Structure/layout issues
   - NOT a trigger: `\[...\]` vs `$$...$$` delimiter convention
   - NOT a trigger: redundant content / model rambling
   - When in doubt, don't rewrite

6. **Determine ALL form values** — Before dispatching any agent, Opus must decide
   every value for the Handshake form by analyzing the actual content:

   For each of the 5 rewrite trigger categories, choose based on the CONTENT:
   - **Yes** = this format exists in the chosen response AND has issues
   - **No** = this format exists in the chosen response but no issues
   - **N/A** = this format does not exist in the chosen response

   Example: a pure math response → LaTeX: Yes/No, Markdown/Code: N/A.
   A coding response → LaTeX: N/A, Markdown/Code: Yes/No.

   Compile the complete form fill data:
   - Systematic issues text
   - Preferred response (1 or 2)
   - Degree of preference (exact button text)
   - Justification text
   - Each rewrite trigger: Yes/No/N/A + explanation
   - Rewrite text (if any trigger is Yes)

7. **Update task file** with all evaluation sections filled in.

### Phase 3: Rewrite (Sonnet, if needed)

If a rewrite trigger was identified, spawn a Sonnet agent with:
- The specific rewrite instructions (what to fix, where)
- The chosen response text
- Rules: minimal diff, fix ONLY the trigger, never alter content/facts

### Phase 4: Form Fill (Sonnet)

Spawn a Sonnet agent with the COMPLETE form data from step 6 — every field value
already decided by Opus. The Sonnet agent is purely mechanical: it enters the values
it's given. It makes ZERO judgment calls about what to select.

The agent fills Handshake form fields. NEVER clicks Submit.

**Key lesson:** The form is a multi-step wizard. After each section, the agent must
click the up-arrow/send button to advance to the next section. Without this, later
sections never appear in the DOM.

### Phase 5: Human Review

Present: "Evaluation saved. Review before submitting."
- Link to task file
- Summary of score + key reasoning
- Note any rewrite applied
- Remind: check Handshake form, then Submit manually

## Wiki Updates (after human confirms)

Check if any wiki updates are warranted (selective, not every task):
- `scoring-calibration.md` — only for new calibration lessons
- `common-errors.md` — only for new recurring patterns
- `domain-notes.md` — only if same subdomain seen 2+ times
- `rewrite-patterns.md` — only for new trigger types
- `workflow-lessons.md` — only on process failures

## Quick Reference: What NOT to Do
- Never click Submit on Handshake
- Never summarize responses in task file
- Never select preference on Handshake until human confirms
- Never use score 4
- Never say "Response A/B" — use "chosen/rejected response"
- Never rewrite content/facts — only presentation
- Never rewrite the rejected response
