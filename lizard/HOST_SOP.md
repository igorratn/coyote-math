# Lizard Host SOP (run in host claude code)

Host CLI owns every step end-to-end: browser scrape (SA + HAI via `chrome-devtools` MCP), skeleton write, reviewer orchestration, agreement merge, SA apply (per-annotation fields only), shadow form-fill. **Human stops per task:** (1) Phase C resolution — fires for any R1/R2 disagreement, any thumbs-down, and any delete; skipped only on all-clean thumbs-up tasks. (2) Job 3 NEED APPROVAL — review + YES/NO on finalized plan. (3) SA task status set in SA UI post-apply. No cowork in runtime. Handoff between CLI and human = filesystem + terminal prompt.

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
  Job 2  Phase A: review1 + review2 parallel → independence gate
         Phase B: CLI merges agreements only for clean thumbs-up accepts. Any disagreement, any thumbs-down, or any delete is marked UNRESOLVED (no default tiebreak, no auto-delete)
         Phase C: human resolves each UNRESOLVED annotation (R1 / R2 / custom), including all deletes and thumbs-downs — SKIPPED only if every annotation is a clean thumbs-up accept
         payload materialized after Phase C
  Job 3  NEED APPROVAL stop (pure review of resolved plan) → YES: SA apply + stamp / NO: feedback, hold
  mark sa_applied:true in state sidecar (human-set SA status separately in SA UI)
  cleanup /tmp/lizard/<stem>/

after all tasks sa_applied or held:
  for each stem with sa_applied (skip held):
    Job 4  HAI shadow form-fill (per annotation in payload)
    mark shadows_fired:true

after all tasks shadows_fired:
  advance _state.json: phase→idle, last_step→job4.completed, job4_progress: all stems→fired
  print final pipeline completion summary:
    - per shadow: UUID | task | annotation # | Approve/Reject | time confirmed ✅
    - Approve/Reject rule: thumbs-up→Approve, thumbs-down→Reject
    - _state.json phase confirmed idle
    - _manifest.state.json all shadows_fired:true confirmed
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
      "resolved": true,
      "sa_applied": true,
      "shadows_fired": false,
      "held": false,
      "reviewers": {"r1": "opus", "r2": "openclaw"}
    }
  }
}
```
Flags (all boolean, default `false`):
- `resolved` — Job 3a done; every annotation, including all deletes and thumbs-downs, has an Igor decision. Gate for 3b.
- `sa_applied` — Job 3b done; SA push succeeded + task file stamped `SA Applied`.
- `shadows_fired` — Job 4 done; HAI form-fill + 20:00 time edit persisted.
- `held` — task removed from active pipeline (cycle-2 deferred / skip-list / manual abandon). CLI skips on all subsequent passes.

Updated atomically after each task's Job 3a, 3b, and Job 4 completions. CLI skips already-`sa_applied` tasks on J0-J3 resume, skips already-`shadows_fired` tasks on shadow sweep.

### `_state.json` — orchestrator pointer (crash recovery)
```json
{
  "batch": "scrapes/_manifest.json",
  "current_task": "Report_Dashboard_X",
  "phase": "idle | job0 | job1 | job2.reviewers | job2.merge | job2.payload | job3.pending_resolution | job3.resolved_pending_sa_apply | job3.applying | job4 | crashed",
  "last_step": "job1.skeleton_written",
  "updated_at": "2026-04-19T14:32:00Z",
  "pid": 12345,
  "session_log": "logs/session-2026-04-19-143200.md",
  "job3_progress": {"Report_Dashboard_X": "resolved", "Report_Dashboard_Y": "awaiting_resolution"},
  "job4_progress": {"Report_Dashboard_X": {"annotation_1": "fired"}}
}
```
**Write rule:** always `_state.json.tmp` → `rename` (atomic). Never partial reads. Updated at every phase transition + within Job 3/4 at per-annotation granularity.

### CLI sidecar consumption (status derivation)

For Job 4, `tasks/shadows/*.md` are canonical. Sidecars mirror shadow-file truth and are used as orchestrator pointers, not as the primary record of which shadows exist.

**Read order on startup / status display:**
1. Open `scrapes/_manifest.json` → authoritative task list for this batch (frozen).
2. Open `tasks/shadows/*.md` → authoritative Job 4 submission record. Match by `Review file` + annotation number (+ cycle when present).
3. Open `scrapes/_state.json` → use `phase` as orchestrator pointer; treat `job4_progress` as derived mirror only.
4. Open `scrapes/_manifest.state.json` → per-task flags; treat `shadows_fired` as derived mirror only.
5. For each stem in `_manifest.json.tasks[].stem`, derive status column:

| Condition on `tasks.<stem>` | Status column |
|---|---|
| `held:true` | `HELD` |
| `resolved:false` | `awaiting resolution` (Job 3a pending, including all thumbs-down/delete decisions) |
| `resolved:true, sa_applied:false` | `resolved` (Job 3b pending) |
| `sa_applied:true, shadows_fired:false` | `applied` (Job 4 pending) |
| `shadows_fired:true` | `complete` |

**Write mechanics (any flag flip):**
```
state = json.load("_manifest.state.json")
state["tasks"][stem][flag] = true       # single-field mutation
json.dump(state, "_manifest.state.json.tmp")
os.rename(".tmp", "_manifest.state.json")  # atomic on POSIX
```
Same pattern for `_state.json` (mutate `phase` + `last_step` + `updated_at` + `job3_progress[stem]` or `job4_progress[stem]`).

**Concurrency:** single-writer. CLI uses `_state.json.pid` advisory lock (see crash-recovery section). No second CLI starts while pid is alive. No other process writes sidecars — Igor's 3a decisions flow through CLI prompts, task `.md` files are separate (LLM/human editable, not state).

**When to flip flags (summary — full phase table below in "Update frequency"):**

| Event | File + mutation |
|---|---|
| Job 3a: all annotations in task resolved, including every thumbs-down/delete | `_manifest.state.json`: `resolved:true` + `_state.json`: `job3_progress[stem] = "resolved"` |
| Job 3b: SA push succeeded for task | `_manifest.state.json`: `sa_applied:true` + `_state.json`: `job3_progress[stem] = "applied"` |
| Job 4: shadow fired + 20:00 edit persisted | first create `tasks/shadows/{uuid-prefix}.md` (canonical), then mirror to `_manifest.state.json`: `shadows_fired:true` and `_state.json`: `job4_progress[stem] = "fired"` |
| Phase boundary (every Job step) | `_state.json`: `phase`, `last_step`, `updated_at` |

## Batch lifecycle

**Create** — at batch start:
- Human picks N tasks (or CLI scrapes SA queue with filter).
- CLI writes `_manifest.json` (frozen spec).
- CLI writes `_manifest.state.json` with all flags `false` per task.
- CLI writes `_state.json` with `phase: idle`.

**Update** — mid-batch:
- After each Job 3a success on `<stem>` → set `tasks.<stem>.resolved:true` in state sidecar, but only after Igor has explicitly resolved every annotation, including all thumbs-downs and deletes.
- After each Job 3b success on `<stem>` → set `tasks.<stem>.sa_applied:true`.
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
| `job3.pending_resolution` | Re-print per-annotation resolution walk-through for task; resume at first unresolved annotation. |
| `job3.resolved_pending_sa_apply` | All annotations resolved; skip 3a, proceed to 3b (SA push) when triggered. |
| `job3.applying` | Re-scrape SA state (ground truth), diff against payload, apply only tasks still in `resolved` state. If partial apply (rating yes, feedback no) → print diff, ask human to reconcile. |
| `job4` | Use `tasks/shadows/*.md` as ground truth for already-fired shadows; use `job4_progress` only as a convenience pointer. Resume from first annotation without a shadow file. |

### Update frequency within `_state.json`

**Rule: write _state.json at EVERY phase transition. No exceptions. Failure to advance the pointer is the #1 cause of unrecoverable crash state.**

Exact writes required (use `_state.json.tmp` → rename each time):

| When | `phase` | `last_step` | `current_task` |
|------|---------|-------------|----------------|
| Entering per-task loop for `<stem>` | `job0` | `job0.start` | `<stem>` |
| Job 0 complete for `<stem>` | `job1` | `job0.done` | `<stem>` |
| Job 1 skeleton written | `job2.reviewers` | `job1.skeleton_written` | `<stem>` |
| Both reviewers launched (before `wait`) | `job2.reviewers` | `job2.reviewers.launched` | `<stem>` |
| Both reviewers done + outputs copied | `job2.merge` | `job2.reviewers.done` | `<stem>` |
| Independence gate passed | `job2.merge` | `job2.independence_gate.passed` | `<stem>` |
| Phase B merge written to `tasks/<stem>.md` | `job3.approval` | `job2.merge.done` | `<stem>` |
| Job 3a resolution started | `job3.pending_resolution` | `job3.resolution_presented` | `<stem>` |
| Job 3a all annotations resolved | `job3.resolved_pending_sa_apply` | `job3.resolution_completed` | `<stem>` |
| Job 3b SA push started | `job3.applying` | `job3.sa_apply_started` | `<stem>` |
| Job 3b SA push complete + stamped | `idle` | `job3.done` | `null` |
| Job 4 shadow sweep start for `<stem>` | `job4` | `job4.start` | `<stem>` |
| Job 4 complete for `<stem>` | `idle` | `job4.done` | `null` |

- Within Job 3: per-task `job3_progress` with values:
    - `awaiting_resolution` — 3a pending (Igor resolving every per-annotation decision, including all thumbs-down/delete outcomes)
    - `resolved` — 3a done (all annotations resolved); 3b (SA push) not yet done
    - `applied` — 3b done; also flip `sa_applied:true` in `_manifest.state.json`
- Within Job 4: per annotation `pending` → `fired` in `job4_progress`.
- At graceful per-task boundary: `phase: idle`, `current_task: null`.
- At normal shutdown: clear `pid`.

## Reviewer orchestration (Job 2 core)

Two reviewers run in parallel, blind to each other. Independence is enforced by filesystem sandbox (Opus) + session isolation (openclaw) — not by prompt.

### Reviewer pool (`config/reviewers.yaml`)

Two entries, two invocation kinds:

- **`opus`** (kind: `cli_subprocess`) — Claude Opus 4.7 via `claude -p` subprocess. Uses host Claude Code auth (no API key setup). Runs with cwd = sandbox view dir.
- **`openclaw`** (kind: `http_post`) — HTTP POST to local openclaw shim at `127.0.0.1:18789/chat`. Model behind openclaw is deliberately opaque. No filesystem access — CLI uses `scripts/build-openclaw-msg.mjs` to assemble the prompt with absolute paths inlined (skeleton content + absolute paths for framework, template, screenshot, CLAUDE.md). Relative paths are never passed to openclaw; its workspace (`~/.openclaw/workspace/`) is not the lizard repo.

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
  skeleton.md      (blind copy — Rewrite Answer lines redacted; see note below)
  template.md      -> <repo>/templates/review-template.md
  framework.md     -> <repo>/templates/review-prompt.md    # Two-Part Check + 5 Guidelines + 12 Error Types + 7 Skills
  wiki/            -> <repo>/wiki/
  CLAUDE.md        -> <repo>/CLAUDE.md
  review.md        (reviewer writes here; CLI copies out after)

/tmp/lizard/<stem>/r2-view/   (symmetric)
```

**skeleton.md is a blind copy, not a symlink.** CLI strips `#### Rewrite Answer` lines before writing:
```bash
sed '/^#### Rewrite Answer$/{n;s/.*/\(redacted — verify independently from image\)/}' \
  tasks/skeleton/<stem>.md > /tmp/lizard/<stem>/<role>-view/skeleton.md
```
Reviewer physically cannot read `tasks/review1/` or `tasks/review2/` — those dirs aren't exposed.

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
- **openclaw path**:
  ```bash
  OPENCLAW_MSG=$(STEM="<stem>" LIZARD_DIR="$LIZARD" node scripts/build-openclaw-msg.mjs)
  OPENCLAW_TOKEN="$TOKEN" OPENCLAW_MSG="$OPENCLAW_MSG" \
    OPENCLAW_SESSION="agent:main:<stem>-<uuid>" \
    node scripts/openclaw-probe.mjs > openclaw.log 2>&1 &
  ```
  `build-openclaw-msg.mjs` sanity-checks all paths with `existsSync`, prints a path check to stderr, and exits 1 if any required path is missing. Response is captured from `openclaw.log`.

After `wait`, CLI copies each output to `tasks/review1/<stem>.md` and `tasks/review2/<stem>.md` per the slot assignment.

Openclaw session ID includes `<stem>-<uuid>` so histories don't cross tasks. Stateless across tasks — no reset round-trip needed.

### Independence gate (grep — no Python)

After both `tasks/review1/<stem>.md` and `tasks/review2/<stem>.md` are written, CLI runs:

```bash
grep -qi "reviewer.2\|review2\|R2" tasks/review1/<stem>.md && { echo "FAIL R1 leaked"; exit 1; }
grep -qi "reviewer.1\|review1\|R1" tasks/review2/<stem>.md && { echo "FAIL R2 leaked"; exit 1; }
```

Any leak → abort, discard both outputs, re-launch reviewers. No merger call until gate passes.

### Merger (CLI, agreement-only — no tiebreak)

Reviewers produce `tasks/review1/<stem>.md` + `tasks/review2/<stem>.md`. CLI merges conservatively:

- **Both reviewers agree** (same rating + compatible edits + same answer) → take it. Write per-annotation section with chosen rating + merged edits + feedback. No flag.
- **Any disagreement** (rating, answer, skills, prompt edit) **OR any thumbs-down** (even if both agree) → annotation marked `UNRESOLVED` in task file. **CLI does NOT pick a default.** Both reviewer verdicts preserved side-by-side for Phase C.

Rationale: previously CLI defaulted to the "more-supported" reviewer, acting as a silent 3rd judge. That's gone. CLI cannot tiebreak; Phase C exists precisely so human resolves conflicts and thumbs-downs.

#### UNRESOLVED triggers

Annotation marked `UNRESOLVED` (requiring Phase C human resolution) if any of:

1. **R1 rating ≠ R2 rating.**
2. **Any thumbs-down** from either reviewer (always UNRESOLVED, even if both agree thumbs-down — human must confirm the reject).
3. **R1 answer ≠ R2 answer** (even if both thumbs-up).
4. **R1 skill edits ≠ R2 skill edits.**
5. **R1 prompt edits ≠ R2 prompt edits.**
6. **Three-way tension**: CLI notices its own read conflicts with both reviewers.
7. **Image crop / pixel-count needed** to resolve an ambiguity.
8. **Slack ruling referenced** in R1 or R2 but not present in `wiki/slack-rulings.md`.
9. **Cycle 2** + prior-cycle feedback not cleanly addressed by annotator.
10. **Prompt rewrite changes the answer** (cycle-2 risk).

### Phase B output (pre-Phase-C)

CLI writes `tasks/<stem>.md` with:
- Per-annotation sections for all annotations.
- Agreement annotations fully populated (rating, edits, feedback, payload entry).
- UNRESOLVED annotations marked with `UNRESOLVED: <reason>` header + BOTH reviewer verdicts side-by-side. No payload entry yet.
- `## Form-Fill Payload` block partial — only contains entries for agreement annotations.

Phase B is atomic and auto — no human stop.

**HARD RULE — No `deleted` rating in payload until Igor confirms at Phase C.**
CLI must never write `rating: deleted` (or `rating: thumbs-down`) into the Form-Fill Payload during Phase B. Any annotation heading toward delete is UNRESOLVED by definition (trigger #2 above) and must go through Phase C. Only after Igor explicitly confirms delete at Phase C may the payload be stamped `rating: deleted`. Violation = potential loss of valid paid annotations in SA.

**HARD RULE — `rating: deleted` is CYCLE 2 ONLY.**
Cycle 1 thumbs-down = send back to annotator (QC_Return). The annotator must get a chance to fix it. `rating: deleted` is only valid in cycle 2 — when the annotation came back from the annotator and is still unfixable. CLI must reject any reviewer recommendation of `deleted` on a cycle 1 annotation and convert it to `thumbs-down` (QC_Return) automatically. Igor still confirms at Phase C, but the outcome can only be thumbs-down (return) or thumbs-up (approve) — never deleted — on cycle 1.

### Phase C — Human conflict resolution

If `tasks/<stem>.md` contains zero `UNRESOLVED:` markers → skip Phase C, proceed to Job 3.

Otherwise, CLI walks the unresolved list one annotation at a time:

```
─── UNRESOLVED: <stem> A<n> ────────────
Task: <stem>
Annotation: <n>
Prompt: <full prompt text>
Annotator answer: <Y>
Image: screenshots/<stem>.<ext>   # CLI opens this before asking for decision
Look here: <exact panel / label / region / visual evidence to inspect>
Conflict: <exact disagreement, ambiguity, or rule question>

R1 reviewer: <model / system name>
R1 verdict: <rating>
R1 response: <reasoning, answer, edits, feedback>

R2 reviewer: <model / system name>
R2 verdict: <rating>
R2 response: <reasoning, answer, edits, feedback>

[1] take R1   [2] take R2   [O]ther (human direct resolution)
```

Human picks. CLI fills per-annotation section with chosen verdict + appends payload entry. Loops to next UNRESOLVED.

After all UNRESOLVED resolved (or skipped → task held) → payload complete → Job 3.

### Final task file format

Per-annotation block (after Phase B+C):
- `Rating:` — `thumbs-up` / `thumbs-down` / `deleted` / `unchanged`
- `Edits Made:` — skill toggles, prompt edits, answer edits
- `Feedback:` — annotator feedback text
- `Resolution:` — `agreement` (both reviewers) or `human-resolved: R1` / `human-resolved: R2` / `human-resolved: custom` (audit trail for Phase C picks)

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

Per task, as the first step inside the per-task loop. **NEVER bulk-scrape all tasks up front** — content scrape for task N happens only when task N enters the loop body, not as a batch prelude. Only the one-time queue metadata read (step 2 below) fires once at batch start; content scrape (step 3+) is strictly per-task.

Steps:
1. `tabs_context_mcp` → locate/reuse tab at SA project data URL (`https://app.superannotate.com/35245/project/283665/data?sort=name&direction=asc`).
2. If batch manifest not yet frozen (first task), read queue: `read_page(tabId, filter:"interactive")` → capture all candidate rows (Name, category, editor URL). Build manifest by filtering out: terminal statuses (`QC_Complete`, `Skipped`, `Unusable`) and all `return_to_QC_by_NV` rows (those belong to the NV rebuttal flow — see `wiki/workflow-procedures.md` §NV Audit Returns — never mixed into a regular review batch). **Always print the filtered candidate list and confirm with Igor before freezing** (no N threshold). Write `_manifest.json` + initialize `_manifest.state.json` + `_state.json`.
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
**→ write `_state.json`: `phase: job1, last_step: job0.done, current_task: <stem>`**

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
**→ write `_state.json`: `phase: job2.reviewers, last_step: job1.skeleton_written, current_task: <stem>`**

### Job 2 — Review + (agreement) merge + Phase C + payload

**Phases (per task):** A is auto. B is auto (agreement-only merge). C is human-interactive ONLY if any UNRESOLVED annotations. Payload materialized at end of C (or end of B if zero UNRESOLVED).

#### Phase A — Reviewers parallel (auto)

1. CLI assigns slot (r1/r2) per reviewer (opus, openclaw). Writes pair to `_manifest.state.json → tasks.<stem>.reviewers`.
2. CLI builds Opus sandbox at `/tmp/lizard/<stem>/<role>-view/` with symlink tree.
3. CLI fires both reviewers in parallel (bash `&` + `wait`):
   - Opus: `cd /tmp/lizard/<stem>/<role>-view/ && claude -p "$PROMPT" < /dev/null > opus.log 2>&1 &`
   - Openclaw:
     ```bash
     OPENCLAW_MSG=$(STEM="<stem>" LIZARD_DIR="$LIZARD" node scripts/build-openclaw-msg.mjs)
     OPENCLAW_TOKEN="$TOKEN" OPENCLAW_MSG="$OPENCLAW_MSG" \
       OPENCLAW_SESSION="agent:main:<stem>-<uuid>" \
       node scripts/openclaw-probe.mjs > openclaw.log 2>&1 &
     ```
4. CLI captures output → writes to `tasks/review1/<stem>.md` and `tasks/review2/<stem>.md` per slot assignment.
5. CLI runs independence gate grep. Fail → discard + retry.
6. CLI cleans up Opus sandbox: `rm -rf /tmp/lizard/<stem>/`.
**→ write `_state.json`: `phase: job2.merge, last_step: job2.reviewers.done, current_task: <stem>`**

Reviewer wall-clock ~60-120 s per task.

#### Phase B — Agreement merge (auto)

1. CLI reads `tasks/skeleton/<stem>.md` + `tasks/review1/<stem>.md` + `tasks/review2/<stem>.md` + image.
   **Read-First block check (before merge):** verify each review file contains a `## Read-First Observations` section:
   ```bash
   grep -q "^## Read-First Observations" tasks/review1/<stem>.md || echo "MALFORMED r1: missing Read-First block"
   grep -q "^## Read-First Observations" tasks/review2/<stem>.md || echo "MALFORMED r2: missing Read-First block"
   ```
   Missing block = malformed → discard that side, re-launch that reviewer once. If still missing after retry → hard-fail, report to human.
2. Per annotation: apply agreement-only merge (see Merger section above). Agreements fully populated; disagreements and thumbs-downs marked `UNRESOLVED: <reason>` with both reviewer verdicts preserved side-by-side.
3. No `⚠️ flag` / no "more-supported default" picks — CLI does NOT tiebreak.
4. Partial `## Form-Fill Payload` materialized — only agreement entries. UNRESOLVED annotations have no payload entry yet.

Phase B output lands in `tasks/<stem>.md`.
**→ write `_state.json`: `phase: job3.approval, last_step: job2.merge.done, current_task: <stem>`**
If zero UNRESOLVED → payload is complete, jump to Job 3. Else → Phase C.

#### Phase C — Human conflict resolution (interactive, only if UNRESOLVED > 0)

For each `UNRESOLVED:` annotation in order:

1. CLI picks the next unresolved annotation, shows task name, annotation number, and the full prompt text.
2. CLI opens the image and shows the image path.
3. CLI tells the human exactly where the conflict is, what evidence matters, and where in the image to look.
4. CLI shows the annotator answer.
5. CLI shows R1 reviewer name/model, plus R1 verdict and R1 response.
6. CLI shows R2 reviewer name/model, plus R2 verdict and R2 response.
7. CLI does not foreground or print the evaluated model answer during human resolution unless Igor explicitly asks for it.
8. Human picks `[1] R1` / `[2] R2` / `[O]ther`. Image inspection is always assumed in this project, so there is no separate image option.
9. On `[O]ther`, CLI records the human-decided rating/answer/feedback from Igor's direct image read.
10. CLI fills the annotation section with chosen verdict, writes `Resolution: human-resolved: <R1|R2|other>`. If 3a produces feedback text, it must begin with a date stamp like `4/21:`.
11. Feedback rules: thumbs-up annotations carry no feedback. In the annotation block, omit the `#### Feedback` section entirely for thumbs-up outcomes; in payload, use `sa.feedback: null`. Thumbs-down annotations use a dated rationale only, with no workflow instructions like `QC_Return`, `send back to annotator`, `delete`, or other internal process notes in the feedback text.
12. CLI appends or updates the payload entry immediately. For thumbs-down outcomes, payload feedback must exactly match the annotation-block feedback text. For thumbs-up outcomes, omit annotation-block feedback and set `sa.feedback: null`.

After all UNRESOLVED resolved → payload complete → Job 3.
**→ write `_state.json`: `phase: job3.pending_approval, last_step: job3.approval_presented, current_task: <stem>`** (immediately after printing NEED APPROVAL plan)

#### Payload consistency check (end of Phase B or C)

Run mechanical + markdown cross-reference (see "Payload consistency check" below). Auto-fix drift, hard-fail schema.

**Payload YAML fields (one entry per annotation):**
- `sa.rating` ← `Rating:` field (`thumbs-up` / `thumbs-down` / `deleted` / `unchanged` for cycle-2 carry-over)
- `sa.skills_check` / `sa.skills_uncheck` ← skill edits from `Edits Made`
- `sa.prompt_edits` ← prompt-text edits (null if none)
- `sa.answer_final` ← `Rewrite Answer` if differs from model's original; else null
- `sa.feedback` ← `Feedback` body if thumbs-down or any field changed; else null. During 3a human resolution, this must exactly mirror the annotation-block `Feedback`, including any leading date stamp.
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

### Job 3 — NEED APPROVAL + Apply (pure review)

Per task. Human stop: NEED APPROVAL. **Pure review** — all conflicts already resolved in Phase C. No picking happens here.

Input: `tasks/<stem>.md` — fully resolved, payload materialized (0 `UNRESOLVED:` markers, or task was held after Phase C skip). Canonical source is the `## Form-Fill Payload` YAML block.

**Pre-flight (mandatory, before approval stop):**
- Step A — `python3 scripts/validate_payload.py tasks/<stem>.md --cycle <N>` → non-zero = ABORT, mark held.
- Step B — markdown cross-reference auto-fix.
- Step C — verify no `UNRESOLVED:` markers remain in `tasks/<stem>.md`. If any → Phase C incomplete, return to Phase C.

**Approval stop:**

```
─── NEED APPROVAL: <stem> (Cycle N) ───────────────
Annotations: <N>   Ratings: <m>👍 / <n>👎 / <d>deleted / <u>unchanged
Resolution: <a> agreement / <r> human-resolved

Per-annotation plan:
  A1: thumbs-up (agreement), skills +TCG -WK, feedback=null
  A2: thumbs-down (human-resolved: R2), skills -Enum, answer_final=<diff>, feedback=<...>
  ...

Derived QC status (advisory, for human to set in SA UI post-apply): <status>

Type YES to apply, NO to reject with feedback, OPEN to open task file first.
```

Responses:
- **DONE** → all annotations resolved; task state → `resolved`; proceed to 3b SA apply when triggered.
- **OPEN** → CLI prints `tasks/<stem>.md` path + waits for human to read + return.
- **(per-annotation edits)** → Igor adjusts individual annotations in the walk-through. Task remains in `awaiting_resolution` until all annotations are decided.

No blanket task-level NO or held state. Every annotation gets resolved before task leaves 3a.

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
   - For `rating: deleted`: click thumbs-down + paste feedback + save — so annotator sees delete reason. **CLI does NOT click the SA Delete button. EVER. Annotation deletion in SA is IRREVERSIBLE — only Igor clicks Delete in the SA UI manually after reviewing the applied feedback.** Violation = permanent data loss.
3. **Pre-save audit (mandatory before Save):** For every annotation, read back the feedback textarea value and compare against payload `feedback` field character-by-character. Mismatch = fix before Save. SA tasks lock on submit; post-save correction is impossible.
4. After ALL annotations pass audit, click task-level **Save**. Confirm save toast.
4. **STOP — human sets task-level SA status manually.** CLI never touches the task-level status dropdown. Human sets it in the SA UI after CLI finishes step 3.
5. Stamp `- **SA Applied (Cycle N):** ✅` in `tasks/<stem>.md` under `## Task Status`.
6. Mark `_manifest.state.json → tasks.<stem>.sa_applied:true`.
7. **→ write `_state.json`: `phase: idle, last_step: job3.done, current_task: null`**

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
   - **Single-image gate:** before submitting Step 3, read back uploaded file tiles. Must be exactly 1. If >1, click `Remove file` until only 1 remains.
   - **Step-3 submit target:** click the **first visible enabled** `button[type="submit"]` (up-arrow on prompt/image card). Do not click a later role-step submit if the page still has lower steps mounted after an edit.
   - Rewrite Answer ← `answer`. JS native setter.
   - LLM feedback → ignore.
3. Click Continue. Editing a submitted step resets later steps — re-fill answer if prompt/image step edited.
4. **Submit.** On "Task complete!" screen: read current session time.
   - **If session time < 20:00** → click **Edit time** → Hours=0, Minutes=20, Seconds=0 → Save → **Confirm time**. Floor short sessions up to 20:00.
   - **If session time ≥ 20:00** → skip Edit time entirely. Click **Confirm time** directly. NEVER overwrite a time greater than 20:00 — real logged work determines pay; overriding it downward destroys legitimate time.
   - **MANDATORY verification before Confirm time:** readback displayed time from DOM snapshot. Must be ≥ `00:20:00`. If < 20:00 → STOP, do not click Confirm time (re-run Edit time).
   - **Mechanical time-edit gate:**
     ```bash
     python3 scripts/check_time_log.py --last
     ```
     Non-zero → ABORT shadow sweep. Last log line time must be ≥ `00:20:00`.
5. Create `tasks/shadows/{uuid-prefix}.md` from `templates/shadow-template.md` (uuid-prefix = first 8 chars of HAI task URL UUID). This file is the canonical proof that the shadow exists.
6. Update shadow line in `tasks/<stem>.md`:
   - Cycle 1 → replace `⬜ not submitted` with `✅ submitted (cycle 1) — [{uuid-prefix}](shadows/{uuid-prefix}.md)`.
   - Cycle 2 → **append** `✅ submitted (cycle 2) — [{uuid-prefix}](shadows/{uuid-prefix}.md)` on a new line below cycle-1 link.
7. Update `_state.json → job4_progress.<stem>.<annotation_n>: fired` as a mirror of the shadow file.
8. After last annotation: set `_manifest.state.json → tasks.<stem>.shadows_fired:true` as a mirror of the shadow files for that task.

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

### Job NV — Rebuttal flow (separate pipeline)

Runs on demand, not on the regular batch cadence. Entry point when Igor says "do NV tasks" / "pull NV" / "process rebuttals" or when the regular SA queue read surfaces `return_to_QC_by_NV` rows that need attention.

**Pull rule (replaces Job 0 step 2 for this flow):**
1. `tabs_context_mcp` → SA project data URL.
2. `read_page(tabId, filter:"interactive")` → filter rows where **category = `return_to_QC_by_NV`**.
3. For each candidate stem, grep `tasks/<stem>.md` for `^- \*\*NV Rebuttal Filed:\*\*`.
   - Stamp present → skip (awaiting ruling).
   - Stamp absent → include in NV manifest.
4. Print candidate list + confirm with Igor before freezing. Write a separate `_nv_manifest.json` (do NOT reuse batch manifest — this is a different pipeline).

**Process per task (from manifest):**
1. Re-scrape (Job 0 steps 3–7) — scrape must capture NV Audit rating + feedback per annotation.
2. Single reviewer (not R1+R2; no merge) walks each flagged annotation with Igor per `wiki/workflow-procedures.md` §NV Audit Returns Step 2. Output draft rebuttal text per annotation; Igor approves/rejects.
3. For each Igor-approved annotation: fill rebuttal form (mechanics in `## NV Audit Rebuttal Form` below); Igor submits; stamp `tasks/<stem>.md`:
   ```
   - **NV Rebuttal Filed:** YYYY-MM-DD (A<n>, ...)
   ```
4. Leave task untouched in SA. Move to next.

**No Job 3 approval gate, no Job 4 shadows** for NV rebuttal flow — only the form submission + stamp. Regular pipeline resumes for these tasks if/when SA flips them out of `return_to_QC_by_NV`.

## Hard rules

- **CLI never tiebreaks reviewers.** Disagreements + thumbs-downs → UNRESOLVED, resolved by human in Phase C. No silent 3rd-judge defaults.
- **Job 3 is pure review.** All conflicts resolved in Phase C before Job 3. Job 3 = human YES/NO on an assembled, fully-resolved plan.
- **Human stops per task:** Phase C (only if UNRESOLVED > 0) + Job 3 approval + SA status set in SA UI.
- **CLI never sets SA task status.** Task-level QualityCheck dropdown is human-only. CLI applies per-annotation fields (skills, rating, answer, feedback) + saves + stamps SA Applied. Human then sets status in SA UI.
- **CLI clicks HAI Submit + Confirm time.** Automatic.
- **Never reinterpret payload after approval.** Dumb executor post-YES. Values are final as-written in YAML.
- **Never rescore during Job 3 apply.** Eval finalized in Phase B+C; approval gate is yes/no on the plan, not a per-annotation re-eval.
- **Payload materialized after Phase C (or end of B if zero UNRESOLVED).** CLI emits full `tasks/<stem>.md` including payload block before the approval stop.
- **Job 3 apply never fires without YES approval.**
- **Job 4 never fires until task is SA-applied** (stamped `SA Applied: ✅`).
- **Cycle 3 refused** at Job 1. Cycle 2 is terminal.
- **Canonical task file is `tasks/<stem>.md`** — written by Phase B (agreements) + Phase C (human resolutions) + payload. `tasks/review1/<stem>.md` and `tasks/review2/<stem>.md` are intermediate artifacts.
- **Model identity never surfaced to merger.** Pool assignment lives in `_manifest.state.json → tasks.<stem>.reviewers` only.
- **Reviewer independence enforced by filesystem sandbox**, not by prompt.
- **Cycle-2 payload includes ALL annotations.** No "only changed" rule. LOCKED (2026-04-19).
- **Cycle-2 shadows fire for ALL payload entries.** Including `rating: unchanged`. LOCKED.
- **No bulk content-scrape at batch start.** Only queue metadata read builds the manifest; content scrape is per-task inside the loop.
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
- Flow: navigate → fill → STOP before Submit. Igor submits. Navigate to fresh form for next annotation.
- **After submit, stamp `tasks/<stem>.md`** per convention in `wiki/workflow-procedures.md` §NV Audit Returns.

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
