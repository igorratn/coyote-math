# Project Lizard

## What This Is
Visual reasoning Q&A review (SuperAnnotate). $30/hr on Handshake AI.

## CRITICAL: NEVER SET TASK STATUS WITHOUT HUMAN CONFIRMATION
MUST NOT set QC status or submit shadow tasks without human review.

## CRITICAL: NEVER APPLY SA CHANGES WITHOUT HUMAN CONFIRMATION
MUST NOT apply any SA changes (ratings, skill edits, feedback, prompt edits) until human has walked through `tasks/<stem>.md` and payload has been materialized. CLI writes the file via merger (Job 2). Human confirms at payload walk-through. Only then does CLI run Job 3 (SA apply).

## CRITICAL: EVERY THUMBS-DOWN WALKED THROUGH
Every thumbs-down in a queued task must be walked through with Igor before Job 3. No exceptions.

## Host/Cowork Split
- **CLI (host claude code)** = sole orchestrator. Runs Jobs 0-4. Scrape → skeleton → reviewers (parallel) → merger walk-through (cowork STOP) → payload walk-through (human STOP) → SA apply → shadow sweep. Full procedure: `HOST_SOP.md`.
- **Cowork** = merger walk-through only. Reads `tasks/skeleton/<stem>.md` + `tasks/review1/<stem>.md` + `tasks/review2/<stem>.md` + image (model identities blind) and produces `tasks/<stem>.md` with Igor in loop. Never calls browser tools. Never drives a job.
- Handoff = filesystem. Task file is the contract.

## Caveman Mode (Default)
Terse like smart caveman. Technical substance stays, fluff dies. Fragments OK. No sycophantic openers/closers. "stop caveman" → standard English.

## Efficiency Rules
- Don't re-read files already read this session
- Prefer Edit over full file rewrite
- No trailing summaries

## Reviewer / merger roles
- **Reviewers** are model-agnostic. Pool in `config/reviewers.yaml` (opus, sonnet, gpt, external). CLI picks two distinct reviewers per task, blind to each other (filesystem sandbox enforces independence, not prompt). Model identity never surfaced to merger.
- **Merger = cowork Opus + Igor** (default). Reads skeleton + both review files + image; produces `tasks/<stem>.md`. Escalation triggers bring Igor into specific annotations live (any thumbs-down, 3-way disagreement, image crop needed, Slack ruling referenced, cycle-2 feedback not addressed, prompt rewrite changes answer, low merger confidence).
- **No rigid Opus=decisions split.** Any model in the pool runs reviewer Two-Part Checks; the merger call is where human-in-loop judgment lives.

## Task Workflow (per-task serial)

CLI loops over `_manifest.json` in order. One task at a time through Jobs 0-3. Then batch shadow sweep (Job 4).

Per task:
1. **Job 0 — scrape** (CLI). `scrapes/<stem>.txt` + `screenshots/<stem>.<ext>`. Newest-mtime rule on downloads. OCR safety check on image.
2. **Job 1 — skeleton** (CLI). Raw scrape data → `tasks/skeleton/<stem>.md`. Cycle detection (file-exists on `tasks/<stem>.md`).
3. **Source checkpoint** — n_annotations, prompt/answer/skills/qtype present. Auto-skip on fail.
4. **Job 2 Phase A — reviewers parallel** (CLI). Build `/tmp/lizard/<stem>/r{1,2}-view/` symlink sandboxes. HTTP POST to two reviewer endpoints (pool pick, A ≠ B). Capture outputs → `tasks/review1/<stem>.md`, `tasks/review2/<stem>.md`. Independence gate (grep). Cleanup sandboxes.
5. **Job 2 Phase B — merger walk-through** (STOP, cowork). Opus + Igor. Escalation triggers surface per-annotation issues live. Output = `tasks/<stem>.md` above `## Task Status` (no payload yet).
6. **Job 2 Phase C — payload walk-through** (STOP, human). Igor confirms per annotation. CLI materializes `## Form-Fill Payload` YAML. Consistency check (schema gate + cross-reference auto-fix).
7. **Job 3 — SA apply** (CLI). Dumb executor. Per-annotation skill toggles + answer + rating + feedback. Save. Stamp `SA Applied (Cycle N): ✅`. STOP for human QC-status pick.
8. Mark `_manifest.state.json → tasks.<stem>.sa_applied:true`. Continue to next task.

After all tasks `sa_applied` or `held`:
9. **Job 4 — shadow sweep** (CLI). Per task, per annotation. HAI form-fill + 20:00 time edit. Update shadow line in task file. Mark `shadows_fired:true`.

**Cycle 2 locked rules:**
- Payload includes ALL annotations (unchanged ones get `rating: unchanged` + full `hai.*` block).
- Shadows fire for ALL payload entries (including unchanged carry-overs).
- Every thumbs-down walked with Igor before Job 3.
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
