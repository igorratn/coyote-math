# Lizard Host SOP (run in host claude code)

Host CLI owns every step: browser scrape (SA + HAI via `chrome-devtools` MCP), skeleton write, reviewer orchestration, merger walk-through stop, SA apply, shadow form-fill. Cowork = merger walk-through only (human-in-loop), never drives a job. Handoff between CLI and human = filesystem.

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
  Job 2  review1 + review2 parallel → independence gate → merger walk-through (STOP, cowork) → payload walk-through (STOP, human) → payload materialized
  Job 3  SA apply (STOP for human QC-status pick)
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
| `job2.merge` | Cowork task file on disk. Re-enter merger STOP, human continues. |
| `job2.payload` | Payload written. Re-enter payload walk-through STOP. |
| `job3` | Use `job3_progress`. Re-scrape SA state (ground truth), diff against payload, apply only `pending`/`in_flight` annotations. If any annotation shows partial apply (rating yes, feedback no) → print diff, ask human to reconcile. |
| `job4` | Use `job4_progress`. Skip already-fired shadows per task, resume from first `pending`. |

### Update frequency within `_state.json`

- Before each atomic step: `phase`, `last_step` flipped.
- Within Job 3: per annotation `pending` → `in_flight` → `applied`.
- Within Job 4: per annotation `pending` → `fired`.
- At graceful per-task boundary: `phase: idle`, `current_task: null`.
- At normal shutdown: clear `pid`.

## Reviewer orchestration (Job 2 core)

Two reviewers run in parallel, blind to each other. Model pool is configurable; CLI picks two distinct models per task. Independence is enforced by filesystem sandbox — not by prompt.

### Reviewer pool (`config/reviewers.yaml`)

```yaml
pool:
  - id: opus
    endpoint: http://127.0.0.1:18789/chat?session=agent:opus:r
    enabled: true
  - id: sonnet
    endpoint: http://127.0.0.1:18789/chat?session=agent:sonnet:r
    enabled: true
  - id: gpt
    endpoint: http://127.0.0.1:18789/chat?session=agent:main:main
    enabled: true
# add more as they come online
```

All reviewers speak the same interface: HTTP POST prompt → text response. Model identity is never surfaced to the merger.

### Model-pick policy (CLI-side, per task)

- Random uniform from `enabled:true` pool, no replacement per task. Reviewer A ≠ Reviewer B.
- If pool has fewer than 2 enabled models → hard-fail, log, skip task (add to hold list).
- Override: env `LIZARD_FORCE_REVIEWERS=opus,sonnet` pins the pair for debugging. Logged.
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

CLI fires both reviewers in one go. Two HTTP POSTs in parallel (shell `&` + `wait`, or async within CLI orchestrator). Each reviewer's session is distinct so histories don't cross.

Session strategy: one session ID per reviewer per task (`session=agent:<role>:<stem>-<uuid>`). Stateless across tasks — no reset round-trip needed.

### Independence gate (grep — no Python)

After both `tasks/review1/<stem>.md` and `tasks/review2/<stem>.md` are written, CLI runs:

```bash
grep -qi "reviewer.2\|review2\|R2" tasks/review1/<stem>.md && { echo "FAIL R1 leaked"; exit 1; }
grep -qi "reviewer.1\|review1\|R1" tasks/review2/<stem>.md && { echo "FAIL R2 leaked"; exit 1; }
```

Any leak → abort, discard both outputs, re-launch reviewers. No merger call until gate passes.

### Merger (cowork, human-in-loop by default)

Reviewers produce `tasks/review1/<stem>.md` + `tasks/review2/<stem>.md`. CLI stops. Human opens cowork; Opus merger reads both blind (model identity not surfaced) + `tasks/skeleton/<stem>.md` + image. Writes final `tasks/<stem>.md` per-annotation sections with Igor in loop.

#### Escalation triggers (merger pauses + flags explicitly for Igor)

Merger auto-involves Igor on any of:

1. **Any thumbs-down** on any annotation (LOCKED — every thumbs-down walked through before Job 3 per wiki rule).
2. **Three-way disagreement** (R1 ≠ R2 ≠ merger on rating or answer).
3. **Image crop / pixel-count needed** to resolve an ambiguity.
4. **Slack ruling referenced** in R1 or R2 but not present in `wiki/slack-rulings.md`.
5. **Cycle 2** + prior-cycle feedback not cleanly addressed by annotator.
6. **Prompt rewrite changes the answer** (cycle-2 risk — verify the rewrite doesn't silently re-value).
7. **Merger confidence below threshold** on any annotation (explicit self-flag in merger output).

If no trigger hits and reviewers agree → merger can produce the task file fast; human still reads at walk-through (see next STOP).

### Merger output

Merger writes `tasks/<stem>.md` sections above `## Task Status` only. **No payload block yet** — payload is materialized only after human walk-through confirms each annotation.

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

**Phases (per task, STOPs between phases):**

#### Phase A — Reviewers parallel

1. CLI picks two models from pool (A ≠ B). Writes pair to `_manifest.state.json → tasks.<stem>.reviewers`.
2. CLI builds per-reviewer sandboxes `/tmp/lizard/<stem>/r{1,2}-view/` with symlink tree.
3. CLI fires two HTTP POSTs in parallel to reviewer endpoints. Prompt = short instruction (`templates/review-prompt.md`).
4. CLI captures response text → writes to `tasks/review1/<stem>.md` and `tasks/review2/<stem>.md`.
5. CLI runs independence gate grep. Fail → discard + retry.
6. CLI cleans up sandboxes: `rm -rf /tmp/lizard/<stem>/`.

No human stop here. Reviewer wall-clock ~60-120 s per task.

#### Phase B — Merger + walk-through (STOP, cowork)

1. CLI stops. Prints: `Task <stem> ready for merger. Open cowork.`
2. Human opens cowork. Opus reads `tasks/skeleton/<stem>.md` + `tasks/review1/<stem>.md` + `tasks/review2/<stem>.md` + image. Model identity NOT surfaced.
3. Merger produces `tasks/<stem>.md` per-annotation sections. Escalation triggers bring Igor into specific annotations live.
4. Merger writes merge log (which reviewer won per annotation, why) either inline in `Edits Made` or in a top-level `## Merge Log (Cycle N)` section.
5. No payload block yet.

#### Phase C — Payload walk-through (STOP, human)

1. Human reads `tasks/<stem>.md`. Per annotation: confirms rating + edits + feedback.
2. After all annotations confirmed, CLI materializes `## Form-Fill Payload` (cycle 1) or `## Form-Fill Payload (Cycle 2)` YAML block.
3. Consistency check on freshly-materialized payload (see "Payload consistency check" below).

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

### Job 3 — Apply review in SA

Per task. **STOP after each task** for human QC-status pick. Parallel SA writes corrupt state — one task at a time.

Input: `tasks/<stem>.md` — human-confirmed, payload present. Canonical source is the `## Form-Fill Payload` YAML block.

**Pre-flight (mandatory):**
- Step A — `python3 scripts/validate_payload.py tasks/<stem>.md --cycle <N>` → non-zero = ABORT.
- Step B — markdown cross-reference auto-fix (see above).

Steps:
1. Parse payload YAML. Extract `task_id` from Task Info. Locate SA editor tab at matching URL.
2. Per annotation (in order 1..N):
   - **Skip entirely if `rating: unchanged`** (cycle-2 carry-over — no SA edit).
   - Apply `prompt_edits` (if non-null) via `form_input` into prompt field.
   - Toggle skill checkboxes per `skills_check` / `skills_uncheck`. Deltas only. QTYPE lives in this checkbox group (MCQ vs Short answer question are toggles here).
   - **Verify skill toggles** — readback after write. Retry on mismatch.
   - **Verify question type set** — exactly one of {MCQ, Short answer question} must be checked. Empty = fail loud, STOP.
   - Write `answer_final` into Rewrite Answer field if present.
   - Set QC rating per `rating`.
   - Paste `feedback` into QC Feedback field if thumbs-down OR any field changed. **Append to existing, never replace.** Readback to verify (QC textarea can fail silently).
   - For `rating: deleted` (cycle 2): click thumbs-down + paste feedback + save — so annotator sees delete reason. CLI does NOT click delete itself (human does).
3. After ALL annotations, click task-level **Save**. Confirm save toast.
4. Stamp `- **SA Applied (Cycle N):** ✅` in `tasks/<stem>.md` under `## Task Status`.
5. Mark `_manifest.state.json → tasks.<stem>.sa_applied:true`.
6. **STOP.** Print QC-status selection form:
   ```
   ─── SA APPLY DONE: <stem> (Cycle N) ───────────────
   Applied: <k> annotations, feedback_readback_ok=<bool>, saved=✅
   Ratings: <m>👍 / <n>👎
   Derived status: <status>   (← deterministic from cycle + ratings)
   ───────────────────────────────────────────────────
   Press Enter to accept derived; or type an override reason to flag.
   ```
   Derived status:
   - cycle 2 → `QC_Complete` (terminal)
   - cycle 1 + any 👎 → `QC_Return`
   - cycle 1 + all 👍 → `QC_Complete`
   Full numbered override menu (Hold / Skipped / Unusable) only on explicit request. Human performs the actual SA status click; CLI only logs.
7. On confirmation → advance to next task. `_state.json` `phase: idle`, `current_task: null`.

**Cycle-2 specifics:** Deleted annotations require human to click delete in SA (CLI applies feedback first). CLI bundles deletes + status confirm into a single action list at the STOP.

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

- **NEVER set SA task status.** Human does it.
- **CLI clicks HAI Submit + Confirm time.** Automatic.
- **Never reinterpret payload.** Dumb executor. Values are final as-written in YAML.
- **Never rescore during Job 3.** Eval finalized in Job 2 walk-through.
- **Payload only after human walk-through.** Phase A/B produce markdown only. Payload is Phase C output.
- **Job 3 never fires without payload present.**
- **Job 4 never fires until SA status set by human (per Job 3 STOP confirmation).**
- **Cycle 3 refused** at Job 1. Cycle 2 is terminal.
- **Canonical task file is merger output.** `tasks/<stem>.md` is written by Job 2 Phase B (merger) + Phase C (payload tail). `tasks/review1/<stem>.md` and `tasks/review2/<stem>.md` are intermediate artifacts.
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
