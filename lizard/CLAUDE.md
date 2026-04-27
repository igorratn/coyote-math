# Project Lizard

## What This Is
Visual reasoning Q&A review (SuperAnnotate). $30/hr on Handshake AI.

## CRITICAL: SINGLE HUMAN STOP — JOB 3 RESOLUTION
CLI runs Jobs 0-4 autonomously. **One human stop per task: Job 3 per-annotation resolution** before writing to SA.
- Igor resolves each *disputed* annotation 👍/👎 individually.
- **Per-annot vs task-level SA action (HOST_SOP-derived, MUST always say it this way):**
  - **Per-annot SA actions** (set on each annotation in SA, recorded in `merge-summary.json.per_annotation[].sa_action`):
    - 👍 (any cycle) → **approve** the annotator's answer on this annot
    - 👎 + **cycle 1** → **reject** the annot (sets thumbs-down + feedback in SA)
    - 👎 + **cycle 2** → **delete** the annot (annotator already had a chance)
    - unchanged carry-forward → **none** (no SA edit on this annot)
  - **Task-level QC status** (derived from per-annot ratings, set as task transition in SA):
    - cycle 1 + any reject → **QC_Return** (whole task back to annotator)
    - cycle 1 + no rejects (all approve/none) → **QC_Complete**
    - cycle 2 → always **QC_Complete** (deletes are per-annot; task itself completes)
  - Never conflate per-annot `reject` with task-level `QC_Return`. Never say "delete" without confirming cycle == 2.
  - `merge-summary.json.per_annotation[].sa_action` is canonical per annot. Task-level QC is computed by `scripts/prepare-job3b-summary.mjs`.
- **Auto-resolve carve-outs (2026-04-25 v2):** annotation is auto-resolved at Job 2 (skipped at Job 3a) under either of:
  - **👍 case:** ANY reviewer rated 👍. SA push approves the annotator's answer regardless of whether the reviewer's own Final Answer matches. The first 👍 reviewer becomes the pick.
  - **👎 case (G1 unanimous):** ALL configured reviewers fired (≥2) AND ALL rated 👎 AND ALL flagged G1 (V6 anchor-skill fail). The pick is the first 👎 reviewer. SA action at Job 3b: delete (cycle 2) or QC_Return (cycle 1) per HOST_SOP doctrine.
  Other reviewers' opinions are embedded in the task file for audit but don't gate the decision. Auto-resolved annotations go straight to Job 3b SA push. (Rule history: 2026-04-24 strict-quorum → 2026-04-25 v1 any-👍-with-answer-match → 2026-04-25 v2 any-👍.)
- Once all non-auto-resolved annotations are resolved by Igor → task state → `resolved`.
- CLI pushes to SA in 3b (auto-resolved + Igor-resolved together) → state → `applied`, stamps `SA Applied`.

No blanket task-level YES/NO; no `held` state. Every annotation is either auto-resolved at Job 2 or resolved by Igor at Job 3a before the task leaves Job 3.

**Re-merge guard (2026-04-26):** `scripts/job2-merge.mjs` refuses to overwrite `tasks/<stem>.md` if the existing file contains any `#### Igor Verdict` block — exits 1 with a "delete verdicts or move file aside" message. This is the simplest possible protection against silently wiping Job 3a work. If you need to re-merge after Job 3a, manually delete the verdict blocks (or move the file aside, re-merge, then re-append). Regression test: `scripts/tests/test-merger-verdict-guard.mjs`. Longer-term fix (sidecar `tasks/<stem>.verdicts.json`) deferred until pain returns.

## Caveman Mode (Default)
Terse like smart caveman. Technical substance stays, fluff dies. Fragments OK. No sycophantic openers/closers. "stop caveman" → standard English.

## Efficiency Rules
- Don't re-read files already read this session
- Prefer Edit over full file rewrite
- No trailing summaries

## Doc structure & per-job SOP loading
CLAUDE.md is the always-loaded thin layer: dispatch graph + recently-codified guardrails (incidents-not-yet-graduated-into-procedure). HOST_SOP.md is the on-demand deep playbook: procedures, file structures, formats, edge cases, file locations.

**Before entering any Job N, agent MUST read `HOST_SOP.md §<JobN>` once.** Skipping this → agent invents conventions → drift (root cause: 2026-04-27 chrome-devtools shadow path used stem-based filenames because it never read `HOST_SOP.md:694`'s UUID-prefix rule). HOST_SOP.md is canonical for: reviewer pool / fire policy / sandbox / merger, state file structures + crash recovery, cycle-1/2 rules, Phase A/B/C, Job NV, file locations, hard rules.

**When codifying a new rule from an incident:** decide upfront — dispatch guardrail (CLAUDE.md) or procedure detail (HOST_SOP.md). Default to HOST_SOP.md unless the rule must be in always-loaded context. Search both files first; never duplicate. Tag CLAUDE.md rules with `(codified <date>)` so they can graduate out once the underlying fix has a regression test.

## Reviewer / merger roles
Canonical in `HOST_SOP.md §"Reviewer orchestration (Job 2 core)"` — pool, fire policy, sandbox, prompt, merger, UNRESOLVED triggers (10 — supersedes the prior 7-trigger summary that lived here). Read on Job 2 entry.

## Task Workflow (batching model)

**Empty task after delete (codified 2026-04-26):** If all annotations in a task are deleted (cycle 2), the task has no approved annotations. Task-level action is still **QC_Complete** — cycle 2 closes the task regardless. Do NOT use QC_Return (that would send it back for a 3rd attempt). An empty QC_Complete signals to Handshake that this task's work was not recoverable. Shadow still fires for the deleted annotation (cycle 2 locked rule: shadows fire for all payload entries).

**CRITICAL — Cycle 2 pickup rule (codified 2026-04-26):** Any task present in the SA queue (status=6, In QC) that already has `SA Applied (Cycle 1): ✅` in its task file is a **cycle 2 task** — always include it in the next pipeline batch. A prior-cycle completion stamp does NOT mean the task is done; SA queue presence overrides it. Never label a queued task as "already applied" without confirming it is not a new cycle submission. Cross-reference: task file cycle stamp vs SA queue presence. Queue presence wins.

**Batching shape:**
- **Jobs 0-2 (automated):** parallel across all N tasks in manifest
- **Job 3a (resolution):** serial walk-through, one Igor session for all tasks
- **Job 3b (SA apply):** batched — one SA session pushes all `resolved` tasks
- **Job 4 (shadow sweep):** serial per task (shadow system one-at-a-time constraint)

Jobs:
1. **Job 0 — scrape** (CLI, parallel). For each task: `scrapes/<stem>.txt` + `screenshots/<stem>.<ext>`. Newest-mtime rule. OCR safety check.
2. **Job 1 — skeleton** (CLI, parallel). Raw scrape → `tasks/skeleton/<stem>.md`. Cycle detection (file-exists on `tasks/<stem>.md`).
3. **Source checkpoint** — n_annotations, prompt/answer/skills/qtype present. Auto-skip on fail.
3.25. **Cycle-2 identical-prompt auto-reject (codified 2026-04-26):** Before firing any reviewer on a cycle-2 task, CLI MUST compare each `[CHANGED]` annotation's current prompt against the cycle-1 prompt (from the archived task file or prior scrape). If prompt is byte-for-byte identical AND the cycle-1 verdict was 👎 → **auto-reject without running reviewers**: rating=thumbs-down, sa_action=delete (cycle 2), flags carry forward from cycle 1. CLI surfaces to Igor: "A{N}: prompt unchanged from cycle 1, prior verdict 👎 → auto-reject (delete)" and proceeds without asking 👍/👎. **SKIP_FRESHNESS_CHECK=1 does NOT bypass this rule** — fresh scrape + identical prompt + prior 👎 = auto-reject regardless. Root cause: bypassing Guard D on Server_22 (2026-04-26) burned reviewer API calls on a no-op resubmission.

3.5. **Job 2 pre-flight gate (MANDATORY)** — before starting any batched Job 2 run, CLI MUST execute `node scripts/tests/run-all.mjs`. Suite includes unit tests (<1s each) plus `test-pipeline.mjs` — Job 1 + Job 2 e2e on a 1-annot fixture with single reviewer (~30-60s, opus only, free on Max plan). Stops and surfaces failure verbatim on any test fail. If the gate FAILS, CLI MUST NOT start Job 2. This gate exists because the 2026-04-23 silent-drop bug corrupted an entire 16-task batch; the pre-flight is cheap insurance against burning the whole batch.

  **Sentinel — once per batch, not per task (codified 2026-04-27):** `run-all.mjs` self-manages a sentinel in `scrapes/_state.json.preflight` (`{ passed_at: ISO, batch: <manifest_path> }`). On entry, if the sentinel exists AND its `batch` matches `_state.json.batch` AND it's within 6h, the script exits 0 immediately ("SKIP — pre-flight already green for this batch"). After a green run it stamps the sentinel atomically (write to `_state.json.tmp` then rename). Batch change (new manifest path in `_state.json.batch`) auto-invalidates. Force a re-run with `FORCE_PREFLIGHT=1`. Override TTL with `SENTINEL_TTL_MS=<ms>`. Skip stamping (dev runs) with `STAMP=0`. Override state path (tests) with `STATE_PATH=<abs>`. CLI may call `run-all.mjs` per task in the batch — the sentinel makes that cheap (instant skip after the first green run). Root cause this addresses: 2026-04-27 batch resumed from compaction with no sentinel awareness, re-ran the full suite mid-batch, and per-task concurrency caused fixture-collision on `/tmp/lizard/<stem>/` between overlapping pre-flights → false `grok missing from reviewers_used` assertion.

  Skip rule: if Igor explicitly says "skip pipeline test" for this run (e.g., known-good code, urgent re-run), proceed without it and note `(pre-flight skipped)` in the run log.
4. **Job 2 Phase A — reviewers** (CLI, parallel across tasks; sequential 4-reviewer fire within task with early-stop, or `PARALLEL=1` for full concurrent fire). Sandbox per task. Capture → `/tmp/lizard/<stem>/{opus,gpt,grok,gemini}-review.md`. Each reviewer's output is validated against `EXPECTED_ANNOTS` (must emit one `## Annotation N` block per skeleton annotation; silent drops are rejected as `bad_output`). Independence gate (grep).
5. **Job 2 Phase B — merge** (CLI, parallel). Deterministic merge. Output = `tasks/<stem>.md` with per-annotation sections + escalation flags + `## Form-Fill Payload` YAML.
6. **Job 3 — RESOLUTION stop** (CLI + Igor). Two-step split:
   - **3a — resolution**: CLI walks Igor through per-annotation decisions. Serial within Igor session; all tasks in one sitting. For each annotation, CLI appends an `#### Igor Verdict` block to `tasks/<stem>.md` (see format below). **Cycle ≥2 annots being re-reviewed (not `carry-forward`): CLI MUST surface the prior-cycle `QC_FEEDBACK` block from `scrapes/<stem>.txt` before asking for verdict — shows Igor what he told the annotator last cycle so he can judge whether rewrite addresses it.** **Per-annot presentation format — CLI MUST show, in order:** (1) task stem + annot # + resolution bucket + reviewer verdicts summary; (2) prior-cycle QC_FEEDBACK verbatim (cycle ≥2 only); (3) full current prompt verbatim; (4) plain-English breakdown of what the prompt asks (step-by-step); (5) where to focus in the image (UI region, column, icon type); (6) skills / qtype / annotator answer / model answer / reviewer final answers + tags; (7) rewrite-addresses-prior-objection judgment (cycle ≥2 only); then ask 👍/👎. When all annotations resolved, per-task state → `resolved`. At end of 3a sitting, run `node scripts/reconcile-stats.mjs` to update `scripts/reviewer-stats.json` with Igor-vs-reviewer match rates (overall + per-skill + per-qtype).
   - **3b — SA apply**: CLI pushes all `resolved` tasks to SuperAnnotate one at a time. **Push order: all `QC_Return` tasks first, then all `QC_Complete` tasks** (QC_Return needs annotator attention sooner; surface failures while attention is fresh). **MANDATORY human confirmation between tasks:** after completing each task's SA edits, CLI MUST (1) print the task QC status that was applied (e.g. "Server_134: QC_Return — A1 👎 A2 👍 A3 👎"); for QC_Return tasks, EXPLICITLY TELL Igor: "Set this task to QC_Return in the SA task list now (task list → click row → Status dropdown → QC_Return → Save) before confirming"; (2) stop and wait for explicit Igor confirmation ("ok", "next", "confirmed", etc.) before opening the next task. Never auto-advance. On per-task success: stamp `SA Applied (Cycle N): ✅` + flip `sa_applied:true`, state → `applied`.
   - **CRITICAL — SA feedback append rule (codified 2026-04-26):** when writing to any QC Feedback textarea in SA, ALWAYS read the existing value first. If non-empty, set the new value to `existing_value + "\n" + new_feedback`. NEVER overwrite existing feedback. Prior cycle feedback must be preserved. Violation = data loss in locked tasks.
   - **CRITICAL — SA feedback date stamp rule (codified 2026-04-27):** every feedback line written to a QC Feedback textarea MUST be prefixed with the current date in `M/DD:` format (e.g. `4/27:`). Format: `"M/DD: <feedback text>"`. No date stamp = feedback is untraceable. Always apply, no exceptions.
   - **Job 3b SA apply is a MANUAL action by Igor (codified 2026-04-27):** CLI navigates to the task URL in SA and stops. Igor manually: (1) sets per-annotation QC rating (Disapprove/Approve thumbs buttons) + fills QC Feedback + clicks Save; (2) sets the task-level QC status via the **selection box** (dropdown) in the SA task list — currently using QC_Complete and QC_Return, but more options exist — this is what removes the task from the queue. CLI does NOT click any buttons or dropdowns in SA. After Igor completes both steps and says "next"/"ok", CLI stamps `SA Applied (Cycle N): ✅` and navigates to the next task. Canonical completion signal: task absent from SA queue = applied.
   - **MANDATORY pre-push gate (codified 2026-04-25):** before any SA push, CLI MUST run `node scripts/prepare-job3b-summary.mjs`. The script (a) prints the per-task summary report (filename, cycle, QC status, 👍/👎/unchanged counts, full annotator-facing feedback for every 👎) and (b) validates payload sync — every annot must have a definitive `sa_action`, every `pending-igor` must have an `#### Igor Verdict` block, and Igor Verdicts must be parseable. Exit code 2 = sync errors, push BLOCKED. Exit code 0 = report clean — CLI MUST surface to Igor and **wait for explicit confirmation** before firing the actual SA push.

**Igor Verdict format** (required — parsed by `reconcile-stats.mjs`):
```
#### Igor Verdict
- rating: thumbs-up            # or thumbs-down
- final_answer: B              # optional; omit if not applicable
- notes: (optional)
- date: 2026-04-24
```
Without this block the annotation is invisible to the learning loop.

After all tasks `applied`:

7. **Job 4 — shadow sweep** (CLI, serial per task). Shadow system supports one at a time. HAI form-fill + 20:00 time edit. `tasks/shadows/*.md` are the canonical submission record; `shadows_fired:true` is a derived mirror. (Parallelism worth testing but unlikely to work.) **After each shadow task completes ("Task complete!" screen + time confirm): click "Next task" ONLY if more shadows remain in the batch. If this was the LAST shadow, click "Go home" (or dismiss) — do NOT click "Next task" when the batch is exhausted; doing so opens an empty HAI task that must be abandoned. Root cause: Server_22 batch (2026-04-27) had only 1 shadow; clicking "Next task" created a spurious empty task. Check `_state.json.job4_progress` against manifest annotation count before clicking.** After all shadows in a batch: run `node scripts/reconcile-shadows.mjs` to sync `_state.json.job4_progress`.

  **CRITICAL — state-update is part of shadow success (codified 2026-04-27):** A shadow is NOT counted complete until `_state.json.job4_progress` reflects it. After every successful HAI submission ("Task complete!" + 20:00 time confirm), CLI MUST, in order: (1) write `tasks/shadows/<shadow-id>.md`; (2) update `_state.json.job4_progress[stem]` (set per-annotation key to `"fired"` if more annots remain in this stem, or set the stem value to `"fired"` if this was the last annot); (3) write `_state.json.tmp` then atomic rename to `_state.json`. CLI MAY NOT click "Next task" / "Go home" / advance to the next shadow until step 3 is persisted. If state-update fails (disk full, permissions, JSON parse error), CLI MUST stop and surface the failure to Igor — DO NOT continue firing shadows on stale state. The python helper `submit_pending_hai_shadows.py::sync_state_after_submission` is the canonical implementation when running the localhost-server path; the chrome-devtools-MCP path MUST replicate the same writes inline. `reconcile-shadows.mjs` exists as a backstop for crash recovery, NOT as a primary "do it all at the end" mechanism — using it that way means state is unreliable in-flight, which defeats the purpose of having a state file. Root cause this rule addresses: 2026-04-27 NPS batch fired 9 shadows via chrome-devtools MCP; `tasks/shadows/*.md` were written but `_state.json.job4_progress` stayed `{}` because the MCP path never updated state, requiring an out-of-band reconcile pass.

**Job 4 React textarea fill rule (codified 2026-04-27):** The `fill` MCP tool silently fails to register text in React-controlled textareas (sets DOM value but doesn't fire React's synthetic events — field submits empty). Use `evaluate_script` with the native setter + input event dispatch. Then verify programmatically (read back value) before clicking Submit — no human visual inspection:
```javascript
// Step 1: fill using native setter
() => {
  const el = document.querySelector('textarea[aria-label="Paragraph response"]');
  const setter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value').set;
  setter.call(el, 'THE TEXT TO FILL');
  el.dispatchEvent(new Event('input', { bubbles: true }));
  return el.value;  // verify: must equal 'THE TEXT TO FILL'
}
// If return value is empty or wrong: abort, do NOT click Submit.
```
Apply this rule to ALL textareas in the HAI shadow form (prompt, answer, task_id). If multiple textareas on page, use `querySelectorAll('textarea[aria-label="Paragraph response"]')` and index by position.

**Job 4 pre-submit all-fields check (codified 2026-04-27):** Before clicking Submit on any HAI shadow form step, CLI MUST run a final sweep that reads back ALL textareas on the current step and asserts none are empty. Do this even if each textarea was verified after fill — React re-renders can silently reset values between fill and submit. Pattern:
```javascript
() => {
  const fields = [...document.querySelectorAll('textarea[aria-label="Paragraph response"]')];
  return fields.map((el, i) => ({ i, len: el.value.length, preview: el.value.slice(0, 40) }));
}
// If ANY field has len === 0: abort, do NOT click Submit. Re-fill and re-verify.
```
This is a hard gate — no exceptions. Root cause: `fill` MCP + React synthetic event failure caused c55261fc and c96c45e4 to submit with empty prompt (2026-04-26); similar silent resets possible on any step with multiple textareas.

**Job 4 deleted-annotation shadow rule (codified 2026-04-27):** For deleted annotations (`rating: deleted`, cycle 2), file the shadow with `"deleted annotation"` as the placeholder for both prompt and answer fields. Do NOT paste the original annotator prompt. Approve/Reject = **Reject** (per-annotation rating is 👎 regardless of task-level QC_Complete). Payment event is preserved; the placeholder signals the annotation did not survive QC.

**Job 4 image upload rule (codified 2026-04-27):** Use `mcp__chrome-devtools__upload_file` with the UID of the "Upload assets" button (from `take_snapshot`). Do NOT inject base64, do NOT intercept showOpenFilePicker, do NOT try http.server fetch from browser. The `upload_file` MCP works reliably when given the correct UID. Memory file `feedback_hai_upload_assets.md` is stale — `upload_file` MCP works; "let Igor click manually" fallback only if UID lookup fails.

**Job NV — NV rebuttal flow** (separate pipeline, on demand). Pulls SA queue rows with category `return_to_QC_by_NV` **and** no `NV Rebuttal Filed:` stamp in `tasks/<stem>.md`. Re-scrape → single reviewer walks annotations with Igor → Igor approves each → file Google Form → stamp task file. No Job 3/4 gates. Full SOP: `HOST_SOP.md` §Job NV + `wiki/workflow-procedures.md` §NV Audit Returns.

**Cycle 2 locked rules:** see `HOST_SOP.md §"Cycle-1 / Cycle-2 rules (LOCKED)"` — reviewer symmetry, payload scope (ALL annots), shadow rule (fires for ALL payload entries), decision set for prior 👎 (approve or delete only).

**Crash recovery + state file structures:** see `HOST_SOP.md §"Batch + state files"` + `§"Crash recovery"` + `§"Update frequency within _state.json"`. Atomic writes only (`_state.json.tmp` → rename). The Job 4 shadow-success state-update rule (above) is the recently-codified addition; everything else is in HOST_SOP.md.

Second pass, audit returns, MCQ/SA rules, shadow task details → `wiki/workflow-procedures.md`.

## Framework (quick ref — details in wiki)
- **Two-Part Check:** question vs 5 Guidelines + 12 Error Types; then answer correctness (verify math yourself)
- **5 Guidelines:** Complexity (2+ skills), Single answer, Self-contained, Independence, No giveaways
- **12 Error Types:** 1-12, see `wiki/guideline-patterns.md`
- **7 Skills:** Enumeration, Attribute Perception, Spatial Reasoning, Math Reasoning, Logical Reasoning, TCG Understanding (= Table/Chart/Graph Understanding; use full form in task files / SA tags), World Knowledge
- **V6 anchor-skill rule:** every prompt must include ≥1 of {Logical Reasoning, TCG Understanding, World Knowledge}. No anchor skill = G1 FAIL even with 2+ skills tagged.
- **V6 non-contextual / non-extraction bans:** letter/vowel counting = FAIL; pure read-off/OCR = FAIL.
- Decision patterns, MCQ/SA rules, key rules → `wiki/guideline-patterns.md`; V6 full spec → `wiki/common-errors.md`

## Knowledge Base
`references/` = immutable playbooks. `wiki/` = LLM-owned. `tasks/` = reviews. `templates/` = template. `scrapes/` = raw SA dumps (gitignored). `scripts/` = host SA scripts. `screenshots/` = images (gitignored).

Key wiki files: `workflow-lessons.md`, `review-calibration.md`, `guideline-patterns.md`, `workflow-procedures.md`, `common-errors.md`, `domain-notes.md`, `sa-interface.md`, `slack-rulings.md`
Key refs: `references/playbook_onboarding.md`, `references/playbook_reviewer.md`
Skip list: `skip-list.md` — filenames CLI must not process. Remove entry when resolved.

## Communication
Igor is terse and direct. Show thinking. If stuck, pick randomly, move.

## Chrome Remote-Debug Popup (codified 2026-04-26, updated 2026-04-27 for Chrome 145+)
Chrome 144+ shows "Allow remote debugging?" mid-batch (often after screen-saver wake invalidates the prior session's grant). Blocks Job 4 / any chrome_js path.

**REQUIRED Chrome launch flag.** Chrome MUST be launched with `--force-renderer-accessibility` so the modal sheet's `position` and `size` are queryable. Standard startup:
```bash
pkill -f "Google Chrome"
open -a "Google Chrome" --args --force-renderer-accessibility
# then re-login to HAI
```

**REQUIRED watchdog.** `bash scripts/chrome_debug_watchdog.sh` runs as a background daemon in its own terminal (separate from CLI). Uses osascript/System Events (NOT CDP) so it dismisses popups while CDP is blocked. Igor starts the watchdog once at login; CLI never invokes it directly.

**REQUIRED tool: `cliclick`.** `brew install cliclick` once. Watchdog uses it for coordinate-based clicks since Chrome 145+ no longer exposes the sheet's button AX tree.

**Detection + dismiss strategy (Chrome 145+, codified 2026-04-27):** Earlier strategy walked the sheet's AX subtree for the static-text phrase "external app wants full control" and clicked the rightmost AXButton. Worked on Chrome 144. Chrome 145+ strips the modal sheet's entire AX subtree — empty contents, no AXStaticText, no AXButton accessible from the sheet (verified 2026-04-27 with `count of entire contents of sheet 1 = 0`). Window-level button query only returns the macOS titlebar controls (close/min/zoom). Surviving signal: front Chrome window's `count of sheets > 0` plus the sheet's `position` and `size` are still queryable. Watchdog now: detects sheet whose size matches popup signature (~448×240, tolerance 350-600 × 180-320), computes Allow center as `(sheet_x + sheet_w - 60, sheet_y + sheet_h - 30)`, dismisses via `cliclick c:<x>,<y>`. Verified working 2026-04-27 (single cliclick at `(3058, 565)` on a `pos=(2670,355) size=(448,240)` sheet dismissed the popup).

**Prereqs to verify on first setup:**
1. Chrome launched with `--force-renderer-accessibility` (see above).
2. Watchdog's launching shell (Terminal/iTerm) has Accessibility permission: `open "x-apple.systempreferences:com.apple.preference.security?Privacy_Accessibility"` → add Terminal/iTerm.
3. `cliclick` installed and granted Accessibility permission. `which cliclick || brew install cliclick`. After install, may need to add cliclick to Accessibility list manually.

**CRITICAL — CLI cannot dismiss this popup itself.** The popup blocks Chrome's debugging protocol; CDP / chrome-devtools / chrome_js calls are dead until it's dismissed. Dismiss must come from OUTSIDE the CDP channel (the watchdog, or human click). Do NOT attempt to dismiss via chrome_js, chrome-devtools MCP, or anything routed through Chrome's debugging port — that path is blocked. Retrying just compounds failures.

**Fallback if watchdog isn't catching it** (e.g., Chrome wasn't launched with the AX flag): Igor clicks Allow manually, then says "continue" / "resume" / "done" to the CLI. CLI resumes from `current_task` pointer in `_state.json`.

**What CLI does on stall:** chrome_js (osascript path) auto-retries once after firing the inline dismiss script (`submit_pending_hai_shadows.py::_dismiss_chrome_debug_prompt`). If retry also times out, raises `RuntimeError` — surface to Igor, do not loop. **For chrome-devtools MCP / CDP path there is no auto-retry** — when CLI sees the CDP connection drop, it must stop and surface "popup likely up — watchdog should handle, or Igor please dismiss" to the user. Do not poll CDP hoping it comes back.

## No Extra Confirmations (codified 2026-04-26)
CLI MUST NOT ask Igor to confirm routine actions. The ONLY allowed human stops are the codified gates above:
- Job 3a per-annotation 👍/👎 resolution
- Job 3b pre-push gate (`prepare-job3b-summary.mjs` report + explicit confirmation before SA push)
- Job 3b per-task confirmation between SA edits (one explicit "ok"/"next"/"confirmed" per task) — **MANDATORY: after completing each task's SA push (Save clicked, stamp written), STOP and wait for Igor's explicit "next"/"ok" before navigating to the next task. Never auto-navigate. This applies for the remainder of all Job 3b runs until Igor explicitly says otherwise.**
- Job NV per-annotation Igor approval before filing the Google Form
- **Job 4 pre-submit verification** — snapshot + field summary before clicking role button; wait for "ok"/"looks good"

Outside those gates, just execute. No "Proceed?", no "Confirm this state edit?", no "Should I continue?", no "Ready to move on?". Igor launched with `--dangerously-skip-permissions` because he wants tool-call autonomy; conversational confirmations defeat that intent. If a step is risky enough to warrant a stop, codify it in CLAUDE.md as a new mandatory gate; do not improvise stops mid-run.
