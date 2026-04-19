# Project Lizard

## What This Is
Visual reasoning Q&A review (SuperAnnotate). $30/hr on Handshake AI.

## CRITICAL: SINGLE HUMAN STOP — JOB 3 APPROVAL
CLI runs Jobs 0-4 autonomously. **One human stop per task: Job 3 "NEED APPROVAL"** before writing to SA.
- YES → CLI applies SA changes, stamps `SA Applied`, task exits SA queue.
- NO  → CLI does not apply. Takes Igor's feedback, syncs changes into `tasks/<stem>.md`, task stays held, re-attempts on next approval pass.

No per-annotation stops. No mid-merge walk-throughs. All merger decisions made by CLI; human reviews the final plan once.

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

## Task Workflow (per-task serial, CLI end-to-end)

CLI loops over `_manifest.json` in order. One task at a time through Jobs 0-3. Then batch shadow sweep (Job 4).

Per task:
1. **Job 0 — scrape** (CLI). `scrapes/<stem>.txt` + `screenshots/<stem>.<ext>`. Newest-mtime rule on downloads. OCR safety check on image.
2. **Job 1 — skeleton** (CLI). Raw scrape → `tasks/skeleton/<stem>.md`. Cycle detection (file-exists on `tasks/<stem>.md`).
3. **Source checkpoint** — n_annotations, prompt/answer/skills/qtype present. Auto-skip on fail.
4. **Job 2 Phase A — reviewers parallel** (CLI). Build `/tmp/lizard/<stem>/{r1,r2}-view/` symlink sandbox for Opus; prepare openclaw prompt (inline skeleton + framework). Parallel launch. Capture outputs → `tasks/review1/<stem>.md`, `tasks/review2/<stem>.md`. Independence gate (grep). Cleanup sandboxes.
5. **Job 2 Phase B — merge** (CLI, no stop). Deterministic merge with flags. Output = `tasks/<stem>.md` with per-annotation sections + escalation flags + `## Form-Fill Payload` YAML below.
6. **Job 3 — NEED APPROVAL stop** (CLI + Igor). CLI prints per-annotation plan (rating, skill toggles, answer, feedback, derived QC status) + any flagged items. Igor: YES → apply + stamp `SA Applied (Cycle N): ✅`; NO → sync feedback, mark held.
7. Mark `_manifest.state.json → tasks.<stem>.sa_applied:true`. Continue to next task.

After all tasks `sa_applied` or `held`:

8. **Job 4 — shadow sweep** (CLI). Per task, per annotation. HAI form-fill + 20:00 time edit. Update shadow line in task file. Mark `shadows_fired:true`.

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
