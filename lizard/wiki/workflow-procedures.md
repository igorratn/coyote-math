# Workflow Procedures

## TOP RULE: Payload Written Only After Human Walk-Through (Apr 17, 2026)
The `## Form-Fill Payload` YAML block in any `tasks/<stem>.md` is written ONLY after Stage 3 merge AND human walk-through have both completed. Stages 1-3 (Opus review → external model → Opus merge) populate per-annotation markdown sections (Rating, Two-Part Check, Edits Made, Feedback, Rewrite Answer). The YAML payload is materialized from the human-confirmed markdown — it does not exist earlier.

- **Why:** Payload = what Job 3 executes in SA. If any stage writes the payload before human review, a silent override (like SaaS_11 A1, where a truncated merge-stage crop wrote `answer: "10"` in place of the correct `13`) becomes the thing that actually runs. Keeping the payload absent until post-walk-through makes the human walk-through the single source of truth for execution.
- **Job 3 precondition:** payload block present in task file. If absent → task hasn't been human-confirmed yet; Job 3 must refuse to fire.
- **When to materialize:** in Job 2's walk-through tail — immediately after human finishes walking through all annotations in the task, before Job 3's pre-flight consistency check.
- **Content:** generated from the finalized markdown sections (Rating → `sa.rating`, Rewrite Answer → `hai.answer`, Full Prompt post-edits → `hai.prompt`, Edits Made → `skills_check/uncheck`, Feedback → `sa.feedback`).

## TOP RULE: Thumbs-Down Requires Human Review (Apr 17, 2026)
Every thumbs-down annotation in a currently queued task MUST be walked through with Igor before Job 3 applies SA changes. No exceptions.

- Thumbs-down rejects the annotator's work and affects their scores. It's a strong call.
- Stage 1 (Opus review) may propose thumbs-down; Stage 3 (merge) may flip to thumbs-down. Either way, human must confirm before SA submission.
- Procedure: present prompt, annotation number, rating reason, open image, wait for Igor's confirmation. Only then does the rating stand in the submitted payload.
- Thumbs-up → human review still required (per CLAUDE.md), but thumbs-down has an even higher bar: evidence of guideline violation or answer error must be specific and defensible.

## TOP RULE: Pre-Walk-Through Consistency Check (Apr 17, 2026)
Before starting any thumbs-down walk-through, Claude MUST enumerate and present two counts, and Igor confirms both before Claude opens the first image:

1. **Manifest count** — number of actionable tasks from `scrapes/_manifest.json` (current batch). Cross-check against Igor's own count of tasks in the SA queue.
2. **Actionable thumbs-down count** — per-task, from the CURRENT cycle's payload only (excluding any annotations under a locked cycle). List: task stem + annotation # + rating reason one-liner. Cross-check against Igor's expectation.

If either count doesn't match what Igor expects, STOP and reconcile before walking through. Mismatch almost always means one of:
- Cycle-lock misparse (counting ratings from submitted cycles as actionable)
- Manifest stale (queue changed since Job 0 scrape — need re-scrape)
- Payload has historical ratings that were already flipped in markdown but not reflected in YAML
- Claude scanned with a regex that catches "thumbs-up/down" mentions in feedback text (not just actual ratings)

**Why:** 2026-04-17, initial list claimed 3 thumbs-downs in the 11-task queue (SEO_101 A1, SaaS_106 A2, Metrics_2 A2). Actual was 2 — Metrics_2 A2 👎 was cycle-1-locked; cycle 2 is all 👍. Igor had to catch the mismatch. If he hadn't, walk-through would have wasted time on a locked annotation (violates Work-Only-On-Queued-Tasks rule).

**How to apply:** The list Claude presents before walk-through MUST match reality exactly. Don't present a list and then filter during walk-through — filter first, present clean.

## TOP RULE: Work Only on Currently Queued Tasks (Apr 17, 2026)
Before any work on a task — stage 2 dispute review, pixel verification, walk-through, rebuttal, audit-return check, anything — first grep `SA Applied:` in `tasks/<stem>.md`.

- **`SA Applied: ✅`** (or `SA Applied (Cycle N): ✅`) → that cycle is submitted, locked. STOP for anything touching that cycle.
- **`SA Applied: ⬜` or unset** → current cycle is in queue, work is actionable.
- **Multi-cycle tasks:** Check `Review Cycle` field. If Cycle 2, grep `SA Applied (Cycle 1):` — that's locked. Only the CURRENT cycle's ratings/payload matter. When enumerating thumbs-down, filter out ratings from submitted cycles — they're historical and immutable.

When building any list of "outstanding items" (stage 3 merge disputes, rebuttals, unreviewed, etc.), filter SA_Applied out FIRST, before presenting. Do not present locked tasks as actionable and rely on Igor to catch them — that's a time waste that burned an hour walking through Mobile_142 A3.

Lessons from SA_Applied tasks may still be logged to wiki/memory as calibration notes — but they are never actionable work.

## Second Pass Workflow

**Trigger:** task reappears in SA queue with existing `tasks/<stem>.md` — always a new review cycle (submitted tasks are purged from list; reappearance = annotator fixed and resubmitted).

### Task file update rules (NEVER overwrite prior cycle)
1. Update `Review Cycle` field in Task Info (1st → 2nd, etc.).
2. Keep all prior cycle content intact below.
3. Append a `## Cycle N Review` section at the bottom with fresh annotation review (re-scrape → new Two-Part Check, new ratings, new feedback).
4. Update `## Task Status` at the bottom to reflect new cycle outcome.
5. Update `## Form-Fill Payload` YAML to reflect new cycle ratings/feedback only.

### Review rules for second pass
- Approve or delete ONLY — no sending back again (max 3 cycles total).
- ~10-20 min to try to save each annotation. Can't fix → delete annotation.
- Read prior feedback before reviewing — check if annotator addressed it.
- If addressed adequately → thumbs-up. If not → delete (not thumbs-down).

### Deleted Annotation (any cycle-2 delete)
Any annotation with `sa_action: delete` (cycle 2 thumbs-down, OR near-duplicate) follows the same shadow rule:
- SA: set thumbs-down + delete the annotation. For near-duplicates: skip rating, human deletes manually.
- **HAI shadow task: file with `"deleted annotation"` in both prompt AND rewrite answer fields.**
- Task status: advance to QC_Complete if remaining annotations all pass (deleted annotation doesn't block completion).
- Near-duplicate test: if question type, filtering criterion, and final answer are identical to another annotation, it's a duplicate regardless of surface wording ("x-values less than 5" = "orders less than 5" on a chart with x=order).

## Audit Returns (Returned_to_QC)
- Do NOT edit prompt/answer
- Only update QC Feedback with audit feedback → send to annotator

## NV Audit Returns (Reviewer Disagrees)

Triggered when SA task returns with NV Audit thumbs-down on annotations you approved. Form per Slack: **NV Audit → rebuttal form** (not office hours, not the channel). Internal audit disputes → office hours or `lizard-reviewers` channel.

### Step 1: Re-scrape
Host re-scrapes (no image needed). Captures NV Audit rating + feedback per annotation → `scrapes/<stem>.txt` → `tasks/<stem>.md`.

### Step 2: Per-annotation review with human
One reviewer only, walked with Igor. For each flagged annotation:
- Re-verify math independently
- Identify what value the auditor may have read differently
- Note visual ambiguities
- Draft rebuttal text: exact values, math chain, prompt language supporting the reading
- **Igor approves or rejects before anything is filed.** Approve → rebuttal. Reject → concede, correct answer in task file.

### Step 3: File form (approved annotations only)
- Form URL: https://docs.google.com/forms/d/e/1FAIpQLSfwv4KFZp2eEaPQ_sfg8BAyjFhvAG2o5jwi6N3CpWJuxHAJEA/viewform
- One submission per annotation. Igor submits.
- After submit, update `tasks/<stem>.md` in two places:
  1. `## Task Info` — stamp (machine-readable flag):
     ```
     - **NV Rebuttal Filed:** YYYY-MM-DD (A<n>, A<n>, ...)
     ```
  2. Per-annotation `#### NV Audit` subsection (audit trail — survives form, needed when ruling returns in ~2 weeks):
     ```
     #### NV Audit
     - **Rating:** thumbs-down
     - **Feedback:** <verbatim NV audit text>
     - **Rebuttal filed:** YYYY-MM-DD — awaiting ruling.
     - **Rebuttal text:**
       > <full rebuttal letter submitted to the form>
     ```
- Grep target for stamp: `^- \*\*NV Rebuttal Filed:\*\*`
- Decision on next SA queue pass: `return_to_QC_by_NV` + stamp → skip; no stamp → file; category flips → ruling came back.

Ruling takes ~1–2 weeks. Achsah/HAI pings when client responds.

## Regeneration Rule
Regenerate after ANY prompt edit. If model now correct → revise prompt further or regenerate multiple times.

## Max 3 revision cycles. Shadow task per annotation reviewed.

## Shadow Task Process (Handshake AI)
- Select "Reviewing" (not "Annotating")
- 1 shadow task per annotation reviewed (not per SA task)
- Task ID = .json filename from SuperAnnotate (exact match)
- Annotation number = position from top (1-5)
- Copy full prompt text from SA (after your edits)
- **Time budget: ~3 min per prompt first pass, ~10–20 min second pass** (Slack, Apr 7). Shadow task time = source of truth for payment.
- Second review cycle = new shadow task (new time log).
- Upload task image: CLI uses `mcp__chrome-devtools__upload_file` on the "Upload assets" button with the screenshot path from `lizard/screenshots/<stem>.<ext>`. Never ask Igor to upload manually.
- **Approve/Reject = per-annotation rating: thumbs-up → Approve, thumbs-down → Reject**
- **Time edit rule — one-way floor, never a ceiling:** at the "Task complete!" screen, override to 00:20:00 ONLY if session time < 20 min. If session time ≥ 20 min, SKIP Edit time and click Confirm time directly. Overwriting a time > 20 min destroys real logged work and reduces pay; 20:00 is a minimum, not a target.
- After Confirm time, verify page advanced past the time screen before reporting done
- Final pipeline completion summary must list each shadow: UUID, annotation #, Approve/Reject, time confirmed ✅

## First Pass Edits (what reviewer can fix)
- Skill tags: uncheck wrong ones
- Prompt text: trim wordiness, fix ambiguity
- Answer: correct errors, fix MCQ format ("A." not "A)")
- Question type: switch MCQ ↔ Short Answer if needed
- Always note edits in feedback field

## MCQ Rules
- "A." not "A)", no "All/None of the above", 4 options preferred
- Pure MCQ phrasing (don't say "answer with a letter")
- Plausible distractors required
- Rewrite answer = just the letter, no period

## Short Answer Rules
- Must include example answer
- Specify format (number, text, units)

## True/False: NOT allowed
