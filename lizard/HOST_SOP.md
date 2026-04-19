# Lizard Host SOP (run in host claude code)

Host CLI owns every step end-to-end: browser scrape (SA + HAI via `chrome-devtools` MCP), skeleton write, reviewer orchestration, deterministic merge, SA apply, shadow form-fill. **Single human-in-loop stop per task: Job 3 NEED APPROVAL.** No cowork in runtime. Handoff between CLI and human = filesystem + terminal prompt.

Repo root: `/Users/iratnere/dev/coyote-math/lizard` (host path). Mirror in Cowork: `/sessions/<current-session>/mnt/lizard` (session ID rotates — do not hardcode).

## File naming convention
- `<stem>` = SA task filename without ext (e.g. `Plot_Spectral_analysis_charts_80`). Human-readable. Captured from SA task list or derived from IMAGE_URL basename.
- `<task_id>` = numeric SA internal ID from editor URL path (e.g. `187109779`). Used only for URL parsing + scrape script internals.
- **Repo files use `<stem>`** — `scrapes/<stem>.txt`, `screenshots/<stem>.<ext>`, `tasks/<stem>.md`.
- Intermediate download is numeric — `~/Downloads/sa-scrape-<task_id>.txt` — host renames to `<stem>.txt` on cp.
- **HAI shadow "Task ID" field** = `<stem>.json`.

## Execution model — per-task serial, then shadow sweep

CLI runs one task at a time from Job 0 through Job 3. Only after all tasks in the batch are SA-applied does Job 4 (shadow sweep) fire across the batch.

```
for each stem in manifest (in manifest order):
  if state sidecar says sa_applied:true → skip to next
  Job 0  scrape
  Job 1  skeleton
  Job 2  review1 + review2 parallel → independence gate → deterministic merge → payload materialized
  Job 3  NEED APPROVAL stop → YES: SA apply + stamp SA Applied / NO: sync feedback, mark held
  mark sa_applied:true in state sidecar
  cleanup /tmp/lizard/<stem>/

after all tasks sa_applied or held:
  for each stem with sa_applied (skip held):
    Job 4  HAI shadow form-fill (per annotation in payload)
    mark shadows_fired:true
```

**Why per-task serial (not batch-by-job):**
- SA state stays consistent — each task is fully applied before next starts; no half-applied batch if something breaks.
- Human context sticks with one task during merge — no mental context switch across 11 tasks mid-review.
- Scrape freshness — review happens seconds after scrape, not hours after.
- Graceful partial completion — if you stop after task 7 of 11, tasks 1-7 are SA-complete; shadow sweep can fire on them anytime.
- Shadow sweep at end is batch-friendly — HAI tab stays open, CLI cycles through stems mechanically.

## Batch + state files

Three files govern batch lifecycle. Separated by mutability: spec (frozen) / progress (task-level mutable) / pointer (sub-task-level mutable).

```
scrapes/
  _manifest.json          # batch spec — IMMUTABLE once frozen
  _manifest.state.json    # per-task progress — MUTABLE per job
  _state.json             # orchestrator pointer — MUTABLE per step (crash recovery)
  <stem>.txt              # scrape files
  archive/
    <batch-id>/           # rotated after batch complete
```

### `_manifest.json` — batch spec
```json
{
  "batch_frozen_at": "2026-04-19",
  "source": "sa-queue | manual-backfill",
  "note": "...",
  "tasks": [
    {
      "stem": "Report_Dashboard_X",
      "task_id": 187110788,
      "SA_TASK_FILENAME": "Report_Dashboard_X.json",
      "category": "-",
      "editor_url": "https://app.superannotate.com/editor/..."
    }
  ]
}
```
Written once at batch start. Never edited during batch.

### `_manifest.state.json` — per-task progress
```json
{
  "tasks": {
    "Report_Dashboard_X": {
      "sa_applied": true,
      "shadows_fired": false,
      "held": false,
      "reviewers": {"r1": "opus", "r2": "gpt"}
    }
  }
}
```
Updated atomically after each task's Job 3 and Job 4 completions. CLI skips already-`sa_applied` tasks on J0-J3 resume, skips already-`shadows_fired` tasks on shadow sweep.

### `_state.json` — orchestrator pointer (crash recovery)
```json
{
  "batch": "scrapes/_manifest.json",
  "current_task": "Report_Dashboard_X",
  "phase": "idle | job0 | job1 | job2.reviewers | job2.merge | job2.payload | job3 | job4 | crashed",
  "last_step": "job1.skeleton_written",
  "updated_at": "2026-04-19T14:32:00Z",
  "pid": 12345,
  "session_log": "logs/session-2026-04-19-143200.md",
  "job3_progress": {"annotation_1": "applied", "annotation_2": "in_flight"},
  "job4_progress": {"Report_Dashboard_X": {"annotation_1": "fired"}}
}
```
**Write rule:** always `_state.json.tmp` → `rename` (atomic). Never partial reads. Updated at every phase transition + within Job 3/4 at per-annotation granularity.

## Batch lifecycle

**Create** — at batch start:
- Human picks N tasks (or CLI scrapes SA queue with filter).
- CLI writes `_manifest.json` (frozen spec).
- CLI writes `_manifest.state.json` with all flags `false` per task.
- CLI writes `_state.json` with `phase: idle`.

**Update** — mid-batch:
- After each Job 3 success on `<stem>` → set `tasks.<stem>.sa_applied:true` in state sidecar.
- After each Job 4 success on `<stem>` → set `tasks.<stem>.shadows_fired:true`.
- Task held for cycle-2 or skipped → set `held:true`, CLI skips in subsequent passes.

**Archive** — at batch end:
- When every task has (`sa_applied:true OR held:true`) AND (`shadows_fired:true OR held:true`):
  - Move `_manifest.json` + `_manifest.state.json` + all batch scrape txt files → `scrapes/archive/<YYYY-MM-DD>-<short-hash>/`
  - Delete (or blank) `_state.json`.
- On next CLI invocation, `scrapes/` is empty of batch-scoped state → ready for next batch.

**Discard** — explicit abandon:
- `lizard batch discard` moves current state files to `scrapes/archive/<date>-abandoned/`.
- SA side state (if any Job 3 already ran) is NOT rolled back — human reconciles.

## Crash recovery

On CLI startup:

```
if scrapes/_state.json exists:
  read state
  if state.pid is alive (kill -0 $pid):
    error: "another CLI running (pid=X)"; exit
  if state.phase != "idle":
    mark phase: "crashed" (atomic write)
    print resume plan based on last_step + job3_progress + job4_progress
    ask human: resume? / discard? / inspect?
else:
  fresh start
```

### Resume strategy by phase

| Phase crashed in | Recovery |
|---|---|
| `idle` | Nothing to do. Pick next task. |
| `job0` | Re-scrape (idempotent; newest-mtime rule on downloads). |
| `job1` | Re-run (deterministic from scrape). |
| `job2.reviewers` | Discard any partial `tasks/review{1,2}/<stem>.md`, delete sandbox `/tmp/lizard/<stem>/`, re-launch reviewers. |
| `job2.merge` | Re-run merge step (deterministic from review1/2 + skeleton). Overwrites `tasks/<stem>.md`. |
| `job3.approval` | Re-print NEED APPROVAL plan for task; wait on human. |
| `job3` | Use `job3_progress`. Re-scrape SA state (ground truth), diff against payload, apply only `pending`/`in_flight` annotations. If any annotation shows partial apply (rating yes, feedback no) → print diff, ask human to reconcile. |
| `job4` | Use `job4_progress`. Skip already-fired shadows per task, resume from first `pending`. |

### Update frequency within `_state.json`

- Before each atomic step: `phase`, `last_step` flipped.
- Within Job 3: per annotation `pending` → `in_flight` → `applied`.
- Within Job 4: per annotation `pending` → `fired`.
- At graceful per-task boundary: `phase: idle`, `current_task: null`.
- At normal shutdown: clear `pid`.

## Reviewer orchestration (Job 2 core)

Two reviewers run in parallel, blind to each other. Independence is enforced by filesystem sandbox (Opus) + session isolation (openclaw) — not by prompt.

### Reviewer pool (`config/reviewers.yaml`)

Two entries, two invocation kinds:

- **`opus`** (kind: `cli_subprocess`) — Claude Opus 4.7 via `claude -p` subprocess. Uses host Claude Code auth (no API key setup). Runs with cwd = sandbox view dir.
- **`openclaw`** (kind: `http_post`) — HTTP POST to local openclaw shim at `127.0.0.1:18789/chat`. Model behind openclaw is deliberately opaque. No filesystem access — CLI inlines skeleton text + framework text into the prompt.

Pool is A ≠ B by construction (exactly two entries, different paths). Slot assignment (r1 vs r2) per task is random.

### Slot-assignment policy (CLI-side, per task)

- Random coin flip: opus→r1, openclaw→r2 OR opus→r2, openclaw→r1.
- If either path fails (subprocess crash / openclaw 500 / timeout) → hard-fail, log, mark task held.
- Override: env `LIZARD_FORCE_REVIEWERS=opus,openclaw` pins the order for debugging. Logged.
- Pair assignment written to `_manifest.state.json → tasks.<stem>.reviewers:{r1, r2}` — audit trail, not surfaced to merger.

### Per-reviewer sandbox (symlink tree)

For each task + reviewer role, CLI builds a per-reviewer view dir that exposes only what the reviewer needs. The other reviewer's output path does NOT exist in the view.

```
/tmp/lizard/<stem>/r1-view/
  skeleton.md      -> <repo>/tasks/skeleton/<stem>.md
  template.md      -> <repo>/templates/review-template.md
  framework.md     -> <repo>/templates/review-prompt.md    # Two-Part Check + 5 Guidelines + 12 Error Types + 7 Skills
  wiki/            -> <repo>/wiki/
  CLAUDE.md        -> <repo>/CLAUDE.md
  review.md        (reviewer writes here; CLI copies out after)

/tmp/lizard/<stem>/r2-view/   (symmetric)
```

Reviewer session's filesystem root = its view dir. Reviewer physically cannot read `tasks/review1/` or `tasks/review2/` — those dirs aren't exposed.

### Reviewer prompt (short)

CLI POSTs a small instruction string; reviewer reads files from its sandbox. Template lives at `templates/review-prompt.md`. Example substance:

```
You are a Project Lizard SA reviewer.

Read:
  skeleton.md         — your input (one task, N annotations)
  framework.md        — Two-Part Check + 5 Guidelines + 12 Error Types + 7 Skills
  template.md         — output format
  wiki/               — calibration notes, relevant lessons
  CLAUDE.md           — project rules

For each annotation: apply Two-Part Check. Rating = thumbs-up or thumbs-down.
Verify math independently. Never anchor on any other source.

Write verdict to review.md using template.md structure.

Do not speculate about any other reviewer. Do not output your own model identity.
```

### Parallel launch

CLI fires both reviewers in one go via shell `&` + `wait`:

- **opus path**: `cd /tmp/lizard/<stem>/<role>-view/ && claude -p "$PROMPT" < /dev/null > opus.log 2>&1 &`
  (Writes `review.md` into the sandbox dir.)
- **openclaw path**: `curl -sS -X POST "http://127.0.0.1:18789/chat?session=agent:r:<stem>-<uuid>" -d "$PROMPT_WITH_INLINED_FILES" > openclaw.log 2>&1 &`
  (Response body is the review text.)

After `wait`, CLI copies each output to `tasks/review1/<stem>.md` and `tasks/review2/<stem>.md` per the slot assignment.

Openclaw session ID includes `<stem>-<uuid>` so histories don't cross tasks. Stateless across tasks — no reset round-trip needed.

### Independence gate (grep — no Python)

After both `tasks/review1/<stem>.md` and `tasks/review2/<stem>.md` are written, CLI runs:

```bash
grep -qi "reviewer.2\|review2\|R2" tasks/review1/<stem>.md && { echo "FAIL R1 leaked"; exit 1; }
grep -qi "reviewer.1\|review1\|R1" tasks/review2/<stem>.md && { echo "FAIL R2 leaked"; exit 1; }
```

Any leak → abort, discard both outputs, re-launch reviewers. No merger call until gate passes.

### Merger (CLI deterministic, no stop)

Reviewers produce `tasks/review1/<stem>.md` + `tasks/review2/<stem>.md`. CLI merges deterministically:

- **Both reviewers agree** (same rating + compatible edits) → take it. Write per-annotation section with chosen rating + merged edits + feedback.
- **Disagree on rating, or any thumbs-down, or any escalation trigger fires** → take the more-supported reviewer as default, but **tag the annotation with a `⚠️ flag`** in the task file. Flag carries through to Job 3 approval.

No silent overrides of reviewer answers. Merger override discipline: if CLI's own pixel count or reasoning disagrees with a reviewer rewrite, flag the annotation rather than silently flipping. Any three-way disagreement is a flag — never a split-the-difference.

#### Escalation triggers (flagged, not stopped mid-merge)

Annotation gets `⚠️ flag` if any of:

1. **Any thumbs-down** on any annotation (always flagged).
2. **Three-way disagreement** (R1 ≠ R2 ≠ merger on rating or answer).
3. **Image crop / pixel-count needed** to resolve an ambiguity.
4. **Slack ruling referenced** in R1 or R2 but not present in `wiki/slack-rulings.md`.
5. **Cycle 2** + prior-cycle feedback not cleanly addressed by annotator.
6. **Prompt rewrite changes the answer** (cycle-2 risk — rewrite silently re-values).
7. **Merger confidence below threshold** on any annotation (explicit self-flag in merger output).

All flags surface to Igor at Job 3 NEED APPROVAL stop — not mid-merge.

### Merger output

CLI writes complete `tasks/<stem>.md` including per-annotation sections AND `## Form-Fill Payload` YAML block. Payload is auto-materialized from merger verdicts — no separate walk-through phase.

Per-annotation block format:
- `Rating:` — `thumbs-up` / `thumbs-down` / `deleted` / `unchanged`
- `⚠️ flag` lines for any escalation triggers (human reads these at Job 3)
- `Edits Made:` — skill toggles, prompt edits, answer edits
- `Feedback:` — annotator feedback text
- `Merge Log:` — which reviewer dominated + reason (audit trail)

## Cycle-1 / Cycle-2 rules (LOCKED)

### Cycle detection (Job 1)

- `tasks/<stem>.md` absent → **cycle 1**.
- `tasks/<stem>.md` present with ≥1 `## Cycle N Review` section (or only cycle-1 content) → **cycle 2**.
- 2+ cycle sections already → **refuse** (cycle 3 not allowed; cycle 2 is terminal).

### Cycle-2 reviewer symmetry

Both Review 1 and Review 2 get the same treatment in cycle 2 — no blanket skip:
- Prior thumbs-up annotation, byte-diff `Full Prompt` + `Rewrite Answer` unchanged → mark `unchanged`, skip full review (carry thumbs-up forward).
- Prior thumbs-up annotation, byte-diff shows change → flag `CHANGED`, run full review.
- Prior thumbs-down annotation → full review. Decision set = **approve or delete** only (no QC_Return path).

### Cycle-2 payload rule (LOCKED)

**Cycle-2 payload MUST include all annotations, regardless of change status.** Reason: Job 4 fires one HAI shadow per annotation in payload — unchanged annotations still generate payment events for the review work done. Undercount caused backfill effort on `Report_Dashboard_Marketing_Dashboard_46` (2026-04-19).

Per-annotation payload entries in cycle 2:
- `rating: unchanged` for prior thumbs-up that carried over clean — Job 2 applies no SA edits; Job 4 still fires a shadow.
- `rating: thumbs-up` / `rating: thumbs-down` / `rating: deleted` for annotations that were re-reviewed or flipped.
- Every entry has full `hai.*` block — Job 4 fires regardless of change status.

### Cycle-2 shadow rule (LOCKED)

Job 4 fires one shadow per annotation in the cycle-2 payload. Including annotations marked `rating: unchanged`. No exceptions.

## Job details

### Job 0 — Scrape

Per task, as the first step inside the per-task loop.

Steps:
1. `tabs_context_mcp` → locate/reuse tab at SA project data URL (`https://app.superannotate.com/35245/project/283665/data?sort=name&direction=asc`).
2. If batch manifest not yet frozen (first task), read queue: `read_page(tabId, filter:"interactive")` → capture all candidate rows (Name, category, editor URL). Build manifest by filtering out: skip-list entries, `return_to_QC_by_NV`, terminal statuses (QC_Complete, Skipped, Unusable). If N > 10, confirm full list with human before proceeding. Write `_manifest.json` + initialize `_manifest.state.json` + `_state.json`.
3. For the current task: locate/reuse tab at cached `editor_url`. Scrape via `javascript_tool` + `scripts/scrape-superannotate.js`.
4. Download lands in `~/Downloads/sa-scrape-<task_id>*.txt`. Copy the **newest** matching file (by mtime) to `scrapes/<stem>.txt`. Browser-added `(1)`, `(2)` suffixes on re-download mean the un-suffixed file is often stale — do not assume name. Hard-fail if zero matches. Log which file was picked if multiple.
5. **Image save:** if `screenshots/<stem>.<ext>` already exists → skip (cycle 2, image unchanged). Else `curl` the `IMAGE_URL` from the scrape directly — never right-click → save-as (captures editor viewport).
   ```bash
   IMG_URL=$(grep '^IMAGE_URL:' scrapes/<stem>.txt | cut -d' ' -f2-)
   EXT=$(basename "${IMG_URL%%\?*}" | awk -F. '{print $NF}')
   curl -fsSL -o screenshots/<stem>.$EXT "$IMG_URL"
   ```
6. **OCR safety check:** scan image for SA UI markers (`Annotator Question`, `Ontology`, `Question Type`, `Answer Rating`, `Rewrite Answer`, `SuperAnnotate`, `QualityCheck`). Any hit → set `image_capture: invalid` in the task file Task Info block; Job 2 refuses review until re-fetched.
7. Validate scrape (consistency checks — see Job 1 step 5).

On failure → log + continue (auto-skip; mark task `held:true`).

### Job 1 — Skeleton

Per task. Output: `tasks/skeleton/<stem>.md` (raw data only, no reviewer verdicts).

Steps:
1. **Cycle detection** (per rule above).
2. **Parse scrape** → per-annotation raw data (prompt, skills, qtype, `MODEL_GENERATED_ANSWER`, `ANSWER`).
3. **Read manifest** for `task_id` + `SA_TASK_FILENAME`.
4. **Write skeleton:**
   - Cycle 1 → fresh `tasks/skeleton/<stem>.md` from `templates/review-template.md` (skeleton subset — Task Info + per-annotation sections with raw fields inline). Rating / Two-Part Check / Edits / Feedback sections left empty.
   - Cycle 2 → append `## Cycle 2 Review` section with raw cycle-2 scrape data. Task Info `task_id` already populated from cycle 1 — verify match with manifest (mismatch = fail loud).
5. **Consistency check** (raw-data only): `n_annotations >= 1`, every `prompt_len >= 50`, `answer_len > 0`, image on disk, all scrape sections populated, `task_id` in Task Info. On fail → log + auto-skip.

### Job 2 — Review + merge + payload

**Phases (per task, no STOPs — all CLI autonomous):**

#### Phase A — Reviewers parallel

1. CLI assigns slot (r1/r2) per reviewer (opus, openclaw). Writes pair to `_manifest.state.json → tasks.<stem>.reviewers`.
2. CLI builds Opus sandbox at `/tmp/lizard/<stem>/<role>-view/` with symlink tree.
3. CLI fires both reviewers in parallel (bash `&` + `wait`):
   - Opus: `cd /tmp/lizard/<stem>/<role>-view/ && claude -p "$PROMPT" < /dev/null > opus.log 2>&1 &`
   - Openclaw: `OPENCLAW_MSG="$PROMPT_INLINED" OPENCLAW_SESSION=agent:main:main node scripts/openclaw-probe.mjs > openclaw.log 2>&1 &`
4. CLI captures output → writes to `tasks/review1/<stem>.md` and `tasks/review2/<stem>.md` per slot assignment.
5. CLI runs independence gate grep. Fail → discard + retry.
6. CLI cleans up Opus sandbox: `rm -rf /tmp/lizard/<stem>/`.

Reviewer wall-clock ~60-120 s per task.

#### Phase B — Merge + payload materialize

1. CLI reads `tasks/skeleton/<stem>.md` + `tasks/review1/<stem>.md` + `tasks/review2/<stem>.md` + image.
2. Per annotation: apply deterministic merge logic (see Merger section above). Write per-annotation section with `⚠️ flag` for any escalation trigger.
3. After all annotations merged, materialize `## Form-Fill Payload` (cycle 1) or `## Form-Fill Payload (Cycle 2)` YAML block.
4. Consistency check on materialized payload (see "Payload consistency check" below).

All Phase B output lands in `tasks/<stem>.md` — ready for Job 3 approval.

**Payload YAML fields (one entry per annotation):**
- `sa.rating` ← `Rating:` field (`thumbs-up` / `thumbs-down` / `deleted` / `unchanged` for cycle-2 carry-over)
- `sa.skills_check` / `sa.skills_uncheck` ← skill edits from `Edits Made`
- `sa.prompt_edits` ← prompt-text edits (null if none)
- `sa.answer_final` ← `Rewrite Answer` if differs from model's original; else null
- `sa.feedback` ← `Feedback` body if thumbs-down or any field changed; else null
- `hai.task_id_field` ← `<stem>.json`
- `hai.role` ← `"Reviewing"`
- `hai.annotation_n` ← position (1..N)
- `hai.prompt` ← `Full Prompt` (post-edits)
- `hai.answer` ← `Rewrite Answer`

**Cycle-2 payload scope — LOCKED:** ALL annotations, regardless of change status. Unchanged ones get `sa.rating: unchanged` + `sa.feedback: null` + full `hai.*` block (Job 4 still fires a shadow). Deleted ones get `sa.rating: deleted` + `sa.feedback: <delete reason>` (CLI applies feedback + thumbs-down before human deletes in SA). No prior-cycle clean annotations are omitted.

**Payload consistency check (auto-fix drift, hard-fail schema):**

Step A — mechanical schema gate:
```bash
python3 scripts/validate_payload.py tasks/<stem>.md --cycle <N>
```
Non-zero exit → ABORT Job 3 for this task. Hard-fail, no auto-fix. Human edits payload, reruns.

Step B — markdown cross-reference (auto-fix):
- `sa.rating` ↔ `Rating:`
- `sa.skills_uncheck` / `sa.skills_check` ↔ `Edits Made`
- `sa.feedback` present iff thumbs-down or any field changed (including `rating: deleted`)
- `sa.answer_final` set iff rewrite differs from model
- `hai.answer` ↔ `Rewrite Answer`
- `hai.prompt` ↔ `Full Prompt` (post-edits)
- Task status matches ratings (cycle 1: any 👎 → QC_Return, else QC_Complete; cycle 2: always QC_Complete)
- **Top-level `task_id` = numeric SA ID; `hai.task_id_field` = `<stem>.json` filename.** Reject crossed types.
- QTYPE flips land in `skills_check/uncheck`, not a separate field.

Auto-fix mismatches silently, report `{fixes_applied, clean}`. Only then task is ready for Job 3.

### Job 3 — NEED APPROVAL + Apply

Per task. **Single human stop: NEED APPROVAL.** One task at a time (parallel SA writes corrupt state).

Input: `tasks/<stem>.md` — CLI-merged, payload materialized. Canonical source is the `## Form-Fill Payload` YAML block.

**Pre-flight (mandatory, before approval stop):**
- Step A — `python3 scripts/validate_payload.py tasks/<stem>.md --cycle <N>` → non-zero = ABORT, mark held.
- Step B — markdown cross-reference auto-fix.

**Approval stop:**

```
─── NEED APPROVAL: <stem> (Cycle N) ───────────────
Annotations: <N>   Ratings: <m>👍 / <n>👎 / <d>deleted / <u>unchanged
Flags (⚠️): <list of annotation#s with flag reasons>
Derived QC status: <status>

Per-annotation plan:
  A1: thumbs-up, skills +TCG -WK, feedback=null
  A2: thumbs-down ⚠️ flag:3way-disagree, skills -Enum, answer_final=<diff>, feedback=<...>
  ...

Type YES to apply, NO to reject with feedback, OPEN to open task file first.
```

Responses:
- **YES** → proceed with apply steps below.
- **OPEN** → CLI prints `tasks/<stem>.md` path + waits for Igor to read + return with YES/NO.
- **NO** → CLI prompts for feedback (per-annotation edits in natural language). CLI applies edits to `tasks/<stem>.md`, re-runs pre-flight, marks `held:true`. Task stays in batch for later re-approval; loop moves to next task.

**Apply steps (after YES):**
1. Parse payload YAML. Extract `task_id` from Task Info. Locate SA editor tab at matching URL.
2. Per annotation (in order 1..N):
   - **Skip entirely if `rating: unchanged`** (cycle-2 carry-over — no SA edit).
   - Apply `prompt_edits` (if non-null) via `form_input` into prompt field.
   - Toggle skill checkboxes per `skills_check` / `skills_uncheck`. Deltas only. QTYPE lives in this checkbox group (MCQ vs Short answer question are toggles here).
   - **Verify skill toggles** — readback after write. Retry on mismatch.
   - **Verify question type set** — exactly one of {MCQ, Short answer question} must be checked. Empty = fail loud, STOP.
   - Write `answer_final` into Rewrite Answer field if present.
   - Set QC rating per `rating`.
   - Paste `feedback` into QC Feedback field if thumbs-down OR any field changed. **Append to existing, never replace.** Readback to verify.
   - For `rating: deleted` (cycle 2): click thumbs-down + paste feedback + save — so annotator sees delete reason. CLI does NOT click delete itself (human does).
3. After ALL annotations, click task-level **Save**. Confirm save toast.
4. Set task-level QC status to derived value (CLI auto-sets since human already approved):
   - cycle 2 → `QC_Complete` (terminal)
   - cycle 1 + any 👎 → `QC_Return`
   - cycle 1 + all 👍 → `QC_Complete`
5. Stamp `- **SA Applied (Cycle N):** ✅` in `tasks/<stem>.md` under `## Task Status`.
6. Mark `_manifest.state.json → tasks.<stem>.sa_applied:true`.
7. Advance to next task. `_state.json` `phase: idle`, `current_task: null`.

Task is now gone from SA queue (submitted).

**Cycle-2 specifics:** Deleted annotations require human to click delete in SA (CLI applies feedback first). CLI bundles deletes into the approval plan; Igor clicks deletes after YES, then CLI confirms.

### Job 4 — Shadow sweep

Runs AFTER all tasks in the batch are SA-applied (or held). Iterates manifest, one task at a time, one annotation at a time.

**Pre-flight (per task):**
```bash
python3 scripts/validate_payload.py tasks/<stem>.md --cycle <N>
```
Non-zero → ABORT this task, continue to next.

**Session hygiene:**
- MCP check before each session start and before each shadow's upload step — verify `mcp__chrome-devtools__evaluate_script` in tool list. Missing → abort with `chrome-devtools MCP missing. Run /mcp to reconnect, then resume.`
- Log each shadow to `scrapes/_job4_session_log.txt`: `<ISO-timestamp> <stem> A<n> time=<HH:MM:SS> ok|drop`.
- One continuous session until MCP drops or batch completes; no proactive restart.

**HAI image upload path (canonical):**
1. `python3 -m http.server 9876` in screenshots dir (auto-confirm shell prompt).
2. Intercept `showOpenFilePicker` via `javascript_tool`: override returns File fetched from `http://localhost:9876/<stem>.<ext>`.
3. Click `+` upload button — intercepted picker returns File synchronously.

Do NOT attempt `mcp__Claude_in_Chrome__file_upload` or `upload_image` against this form. They fail every time on this React form.

**Steps per annotation:**
1. One shadow per `annotations[].hai` entry in payload (including `rating: unchanged` carry-overs — ALL fire).
2. Open new HAI shadow task. Fill:
   - Task ID ← `task_id_field` (`<stem>.json`, not numeric task_id).
   - Annotating/Reviewing ← `role` (always "Reviewing").
   - Annotation number ← `annotation_n`.
   - Annotator Prompt + Image: upload image first via `upload_file(uid, absolute_path)`, THEN set prompt text via JS native setter. Do NOT use `fill` MCP — silently fails on this React form.
   - Rewrite Answer ← `answer`. JS native setter.
   - LLM feedback → ignore.
3. Click Continue. Editing a submitted step resets later steps — re-fill answer if prompt/image step edited.
4. **Submit.** On "Task complete!" screen: click **Edit time** → Hours=0, Minutes=20, Seconds=0 → Save → **Confirm time**.
   - Always exactly 20:00, both cycles, every shadow. Regardless of actual elapsed time.
   - **MANDATORY verification before Confirm time:** readback displayed time from DOM snapshot. Must match `00:20:00`. Mismatch → STOP, do not click Confirm time.
   - **Mechanical time-edit gate:**
     ```bash
     python3 scripts/check_time_log.py --last
     ```
     Non-zero → ABORT shadow sweep. Last log line must contain `time=00:20:00`.
5. Create `tasks/shadows/{uuid-prefix}.md` from `templates/shadow-template.md` (uuid-prefix = first 8 chars of HAI task URL UUID).
6. Update shadow line in `tasks/<stem>.md`:
   - Cycle 1 → replace `⬜ not submitted` with `✅ submitted (cycle 1) — [{uuid-prefix}](shadows/{uuid-prefix}.md)`.
   - Cycle 2 → **append** `✅ submitted (cycle 2) — [{uuid-prefix}](shadows/{uuid-prefix}.md)` on a new line below cycle-1 link.
7. Update `_state.json → job4_progress.<stem>.<annotation_n>: fired`.
8. After last annotation: set `_manifest.state.json → tasks.<stem>.shadows_fired:true`.

**HAI textarea fill technique** (prompt + answer):
```js
const ta = Array.from(document.querySelectorAll('textarea')).find(t => t.getBoundingClientRect().height > 0 && t.value === '');
ta.focus();
const setter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value').set;
setter.call(ta, VALUE);
ta.dispatchEvent(new Event('input', {bubbles: true}));
ta.dispatchEvent(new Event('change', {bubbles: true}));
```

**Cycle-2 specifics:**
- Task ID field = same `<stem>.json`.
- Deleted annotations: file shadow with "deleted annotation" placeholder in prompt + answer. Payment event preserved.
- `rating: unchanged` annotations: file shadow with prompt + answer from original cycle-1 data (carried forward in payload).

## Hard rules

- **Single human stop per task: Job 3 NEED APPROVAL.** No mid-merge, no mid-apply stops.
- **CLI auto-sets SA task status** after YES approval (derived from cycle + ratings). Human can reject at NEED APPROVAL and override in feedback.
- **CLI clicks HAI Submit + Confirm time.** Automatic.
- **Never reinterpret payload after approval.** Dumb executor post-YES. Values are final as-written in YAML.
- **Never rescore during Job 3 apply.** Eval finalized in Job 2 merge; approval gate is yes/no on the plan, not a per-annotation re-eval.
- **Payload auto-materialized in Phase B.** CLI emits full `tasks/<stem>.md` including payload block before the approval stop.
- **Job 3 apply never fires without YES approval.**
- **Job 4 never fires until task is SA-applied** (stamped `SA Applied: ✅`).
- **Cycle 3 refused** at Job 1. Cycle 2 is terminal.
- **Canonical task file is CLI merger output.** `tasks/<stem>.md` written by Job 2 Phase B (merge + payload). `tasks/review1/<stem>.md` and `tasks/review2/<stem>.md` are intermediate artifacts.
- **Model identity never surfaced to merger.** Pool assignment lives in `_manifest.state.json → tasks.<stem>.reviewers` only.
- **Reviewer independence enforced by filesystem sandbox**, not by prompt.
- **Cycle-2 payload includes ALL annotations.** No "only changed" rule. LOCKED (2026-04-19).
- **Cycle-2 shadows fire for ALL payload entries.** Including `rating: unchanged`. LOCKED.
- **Newest scrape file by mtime** — never assume un-suffixed name.
- **Image save is `curl IMAGE_URL`**, never right-click save-as.
- **Tab reuse mandatory** when matching tab exists.
- **Fail loud** on validation errors.
- **Auto-proceed on mechanical file ops** — `rm`, `cp`, `mv`, shell commands, download dialogs. No human confirmation for mechanical ops.
- **Atomic state writes only** — `_state.json.tmp` → rename. Never partial writes.

## File locations (host paths)

- Scrape script: `lizard/scripts/scrape-superannotate.js`
- Scrape output: `lizard/scrapes/<stem>.txt`
- Image: `lizard/screenshots/<stem>.<ext>` (gitignored)
- Skeleton: `lizard/tasks/skeleton/<stem>.md` — raw data, no reviewer verdicts
- Reviewer outputs: `lizard/tasks/review1/<stem>.md`, `lizard/tasks/review2/<stem>.md` — blind intermediate artifacts
- Final / payload source: `lizard/tasks/<stem>.md` — merger output + payload (canonical)
- Shadow tasks: `lizard/tasks/shadows/<uuid-prefix>.md`
- Batch manifest: `lizard/scrapes/_manifest.json`
- Batch state sidecar: `lizard/scrapes/_manifest.state.json`
- Orchestrator pointer: `lizard/scrapes/_state.json`
- Session log: `lizard/logs/session-<ts>.md`
- Reviewer pool config: `lizard/config/reviewers.yaml`
- Review framework prompt: `lizard/templates/review-prompt.md`
- Review template: `lizard/templates/review-template.md`
- Shadow template: `lizard/templates/shadow-template.md`
- Skip list: `lizard/skip-list.md`
- Per-reviewer sandbox: `/tmp/lizard/<stem>/r{1,2}-view/`

## NV Audit Rebuttal Form (Google Forms)

Form URL in `wiki/workflow-procedures.md`. One submission per annotation.

- **Dropdown (Annotation Number):** can't be filled with `fill` or direct `click`. Pattern:
  1. Open listbox: `document.querySelector('[role="listbox"]').querySelector('[jsname="LgbsSe"]').click()`
  2. Take snapshot; options get new UIDs.
  3. `click(uid)` on target option.
- **Date field:** JS native setter on `input[type="date"]` with `'YYYY-MM-DD'` + dispatch `input`+`change`.
- **All other fields:** `fill` MCP works.
- Flow: navigate → fill → STOP before Submit. Human submits. Navigate to fresh form for next annotation.

## Chrome interaction stack (SA / HAI)

1. `tabs_context_mcp` — first call, returns tab IDs.
2. `navigate(tabId, url)` — skip if tab exists.
3. `javascript_tool(tabId, text)` — workhorse. Content filter may block math-heavy returns; script writes Blob + download, returns only counts.
4. `read_page(tabId, filter: "interactive")` — accessibility tree for fields, checkboxes, buttons.
5. `get_page_text(tabId)` — may fail on math; prefer blob download.
6. `form_input(...)`, `find(...)` — `form_input` over click+type.

Scrape agent flow (~4 calls):
```
tabs_context_mcp                          → tabId
navigate(tabId, SA URL)                   → page loads (skip if tab exists)
javascript_tool(tabId, <scrape.js>)       → expand + blob download, returns {ok, n, lens}
→ auto-approve download/save dialog inline → file lands in ~/Downloads/sa-scrape-<task_id>*.txt
copy newest matching file (by mtime) to lizard/scrapes/<stem>.txt
curl -fsSL "$(grep ^IMAGE_URL: lizard/scrapes/<stem>.txt | cut -d' ' -f2-)" -o lizard/screenshots/<stem>.<ext>
OCR-check screenshot for SA UI markers; hit → image_capture: invalid
```

## Apply-review execution model

Use `evaluate_script` inside `custom-llm` iframe. Fields are Angular-controlled — native setters + events required.

**Textarea writes** (answer, feedback):
```js
const setter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value').set;
setter.call(ta, value);
ta.dispatchEvent(new Event('input', { bubbles: true }));
ta.dispatchEvent(new Event('change', { bubbles: true }));
```

**Checkbox toggles** (skills):
```js
const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'checked').set;
setter.call(cb, true/false);
cb.dispatchEvent(new Event('change', { bubbles: true }));
```
Skill order per annotation (i=0..4): `checkboxes[i*9 + j]`, j=0..8 maps to [Enumeration, Attribute Perception, Spatial Reasoning, Math Reasoning, Logical Reasoning, TCG Understanding, World Knowledge, MCQ, Short answer question].

**QC approve button** — locate by section header, not label:
```js
const qcHeaders = Array.from(doc.querySelectorAll('p.title')).filter(p => p.textContent.trim() === 'QC');
// walk up from qcHeaders[i].parentElement until: container.querySelector('button[ng-reflect-svg-icon="approve-action"]')
```
Active state = inline `style` contains `rgb(0, 205, 108)`. `ng-reflect-color` stays "gray" even when active — ignore.

**QC feedback textarea** — same walk-up from `p.title` QC header until `container.querySelector('textarea')`.

**Section order** (top to bottom per annotation): Rewrite Answer → Work validation → Metric Log → **QC** (blue) → Audit (purple) → NV Audit (purple). Only touch QC. Never touch Audit or NV Audit.

**Verify post-write:** re-query and check `style` / `value` before Save.

**Status blacklist:** task-level status dropdown = DO-NOT-TOUCH. STOP before status.

## Scrape script spec (`scripts/scrape-superannotate.js`)

Script must:
- Derive `SA_TASK_FILENAME` from IMAGE_URL basename (strip query, swap `.png`→`.json`). Top-level field. Required for HAI Task ID.
- Expand all annotation panels.
- Per annotation: prompt, skill tag states, question type, `MODEL_GENERATED_ANSWER` (main Answer panel, NOT Explanation tab), `ANSWER` (Rewrite Answer textbox — should differ from MODEL_GENERATED_ANSWER; annotator's objective is to stump the model), model answer rating, QC rating + feedback.
- Label the two answer fields EXACTLY `MODEL_GENERATED_ANSWER` and `ANSWER` in output.
- DOM → label mapping (2026-04-13): textarea `base+1` → `MODEL_GENERATED_ANSWER:`, textarea `base+3` → `ANSWER:`.
- Do NOT scrape Explanation tab.
- **Stump rule:** `MODEL_GENERATED_ANSWER` ≠ `ANSWER` expected; if equal, flag in consistency check.
- Pull image URL from canvas/img.
- Pull status change log (first vs second pass detection).
- Serialize to text format readable by template.
- Write as Blob, download as `sa-scrape-<task_id>.txt`.
- Return `{ok, task_id, n_annotations, annotations:[...], image_url, status_log_len, missing}` — no raw text (content-filter safe).

## V6 Pre-Submit Checklist (Human — before Submit in SA)

Run **"Verify Submission"** button first — catches blockers automatically. Fix flagged items. Then confirm:

- [ ] **≥2 ontologies selected** for the task
- [ ] **All model answers rated thumbs down** (required before sending to QC)
- [ ] **All 6 CMW criteria marked agree or disagree** — `QUESTION_UNCLEAR`, `ANSWER_INCORRECT`, `AMBIGUOUS_ANSWER_FORMAT`, `FINE_GRAINED_PRECISION`, `MCQ_FORMAT`, `ROUNDING_NOT_EXPLICIT`
- [ ] **"Automated Check Results"** shows no remaining blockers
- [ ] **Format strictness:** model answer must match annotator's specified format (e.g. `1,000` vs `1000`) to be accepted. Intent doesn't override format.
