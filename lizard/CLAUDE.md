# Project Lizard

## What This Is
Visual reasoning Q&A review (SuperAnnotate). $30/hr on Handshake AI.

## CRITICAL: SINGLE HUMAN STOP — JOB 3 RESOLUTION
CLI runs Jobs 0-4 autonomously. **One human stop per task: Job 3 per-annotation resolution** before writing to SA.
- Igor resolves each annotation 👍/👎 individually.
- Once all annotations resolved → task state → `resolved`.
- CLI pushes to SA in 3b → state → `applied`, stamps `SA Applied`.

No blanket task-level YES/NO; no `held` state. Every annotation is resolved before the task leaves Job 3.

## Caveman Mode (Default)
Terse like smart caveman. Technical substance stays, fluff dies. Fragments OK. No sycophantic openers/closers. "stop caveman" → standard English.

## Efficiency Rules
- Don't re-read files already read this session
- Prefer Edit over full file rewrite
- No trailing summaries

## Reviewer / merger roles
- **Two reviewers per task** — Opus 4.7 via `claude -p` subprocess (sandbox cwd) + openclaw via WebSocket gateway (`scripts/openclaw-probe.mjs`). A ≠ B by construction. Slot assignment (r1/r2) = coin flip per task. Model identity opaque downstream.
- **Independence** enforced by filesystem sandbox (Opus) + session isolation (openclaw). Not by prompt.
- **Merger = CLI**, deterministic:
  - Both reviewers agree → take it.
  - Disagree, or any thumbs-down, or any escalation trigger → flag in task file, defer to Job 3 approval.
- **Escalation triggers** (surface for Igor at Job 3, not mid-merge):
  1. Any thumbs-down on any annotation
  2. Three-way disagreement (R1 ≠ R2 ≠ merger)
  3. Image crop / pixel count disputed
  4. Slack ruling referenced but not in `wiki/slack-rulings.md`
  5. Cycle 2 + prior feedback not cleanly addressed
  6. Prompt rewrite changes answer
  7. Low merger confidence

## Task Workflow (batching model)

**Batching shape:**
- **Jobs 0-2 (automated):** parallel across all N tasks in manifest
- **Job 3a (resolution):** serial walk-through, one Igor session for all tasks
- **Job 3b (SA apply):** batched — one SA session pushes all `resolved` tasks
- **Job 4 (shadow sweep):** serial per task (shadow system one-at-a-time constraint)

Jobs:
1. **Job 0 — scrape** (CLI, parallel). For each task: `scrapes/<stem>.txt` + `screenshots/<stem>.<ext>`. Newest-mtime rule. OCR safety check.
2. **Job 1 — skeleton** (CLI, parallel). Raw scrape → `tasks/skeleton/<stem>.md`. Cycle detection (file-exists on `tasks/<stem>.md`).
3. **Source checkpoint** — n_annotations, prompt/answer/skills/qtype present. Auto-skip on fail.
4. **Job 2 Phase A — reviewers** (CLI, parallel across tasks; R1+R2 parallel within task). Sandbox per task; parallel R1/R2 launch. Capture → `tasks/review1/<stem>.md`, `tasks/review2/<stem>.md`. Independence gate (grep).
5. **Job 2 Phase B — merge** (CLI, parallel). Deterministic merge. Output = `tasks/<stem>.md` with per-annotation sections + escalation flags + `## Form-Fill Payload` YAML.
6. **Job 3 — RESOLUTION stop** (CLI + Igor). Two-step split:
   - **3a — resolution**: CLI walks Igor through per-annotation decisions. Serial within Igor session; all tasks in one sitting. When all annotations resolved, per-task state → `resolved`.
   - **3b — SA apply**: CLI pushes all `resolved` tasks to SuperAnnotate in one batched session. On per-task success: stamp `SA Applied (Cycle N): ✅` + flip `sa_applied:true`, state → `applied`.

After all tasks `applied`:

7. **Job 4 — shadow sweep** (CLI, serial per task). Shadow system supports one at a time. HAI form-fill + 20:00 time edit. Mark `shadows_fired:true`. (Parallelism worth testing but unlikely to work.)

**Cycle 2 locked rules:**
- Payload includes ALL annotations (unchanged ones get `rating: unchanged` + full `hai.*` block).
- Shadows fire for ALL payload entries (including unchanged carry-overs).
- Decision set for prior thumbs-down = approve or delete only (no QC_Return).

**Crash recovery:** `_state.json` is the orchestrator pointer (atomic writes). New CLI reads it on startup; resumes per phase. Full detail: `HOST_SOP.md#crash-recovery`.

Second pass, audit returns, MCQ/SA rules, shadow task details → `wiki/workflow-procedures.md`.

## Framework (quick ref — details in wiki)
- **Two-Part Check:** question vs 5 Guidelines + 12 Error Types; then answer correctness (verify math yourself)
- **5 Guidelines:** Complexity (2+ skills), Single answer, Self-contained, Independence, No giveaways
- **12 Error Types:** 1-12, see `wiki/guideline-patterns.md`
- **7 Skills:** Enumeration, Attribute Perception, Spatial Reasoning, Math Reasoning, Logical Reasoning, TCG Understanding (= Table/Chart/Graph Understanding; use full form in task files / SA tags), World Knowledge
- Decision patterns, MCQ/SA rules, key rules → `wiki/guideline-patterns.md`

## Knowledge Base
`references/` = immutable playbooks. `wiki/` = LLM-owned. `tasks/` = reviews. `templates/` = template. `scrapes/` = raw SA dumps (gitignored). `scripts/` = host SA scripts. `screenshots/` = images (gitignored).

Key wiki files: `workflow-lessons.md`, `review-calibration.md`, `guideline-patterns.md`, `workflow-procedures.md`, `common-errors.md`, `domain-notes.md`, `sa-interface.md`, `slack-rulings.md`
Key refs: `references/playbook_onboarding.md`, `references/playbook_reviewer.md`
Skip list: `skip-list.md` — filenames CLI must not process. Remove entry when resolved.

## Communication
Igor is terse and direct. Show thinking. If stuck, pick randomly, move.
