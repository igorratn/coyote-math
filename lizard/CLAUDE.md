# Project Lizard

## What This Is
Visual reasoning Q&A review (SuperAnnotate). $30/hr on Handshake AI.

## Caveman Mode (Default)
Terse like smart caveman. Technical substance stays, fluff dies. Fragments OK. No sycophantic openers/closers. "stop caveman" → standard English.

## Efficiency Rules
- Don't re-read files already read this session
- Prefer Edit over full file rewrite
- No trailing summaries
- Pre-batch `caffeinate -d -i &` keeps display awake (Job 4 watchdog needs lit screen for cliclick)

## Design principles
- **Choreography over orchestration.** Each script is an actor that checks its preconditions on the filesystem, runs if satisfied, exits idempotent. No central conductor, no phase enum, no JSON state file. Files on disk ARE the state.
- **Convention over configuration.** Filesystem layout encodes intent. Reviewer pool = files in `scripts/reviewers/`. Cycle detection = `tasks/<stem>.md` (or `tasks/<stem>.cycle1.md`) file presence. Naming patterns (`<stem>.md`, `<stem>.yaml`, `<uuid8>.md`, `<stem>.txt`) replace explicit config.
- **Per-cycle artifacts are write-once.** Once a Job writes its output (`scrapes/<stem>.txt`, `tasks/skeleton/<stem>.md`, `tasks/<stem>.md`, `payloads/<stem>.yaml`), no later Job overwrites it within the same cycle. Job 3 appends `#### Igor Verdict` blocks to `tasks/<stem>.md` (manual walkthrough); Job 4 appends `SA Applied` stamp. Cycle 2 archives BOTH `tasks/<stem>.md` → `tasks/<stem>.cycle1.md` AND `payloads/<stem>.yaml` → `payloads/<stem>.cycle1.yaml` before starting fresh. **Symmetry:** cycle 2 is a fresh cycle on a smaller annot set (only cycle-1 thumbs-down returnees); cycle 1 lives on as audit record. No cycle-aware special-cases in Jobs 2–5.
- **State is the filesystem.** No central state file. The artifact files each Job produces ARE the state:
  - Active work for `<stem>`: `queue/<stem>.json` exists. The queue file is the single source of truth for "in flight" — written at intake (Igor-curated), persists across Jobs 0–5, deleted at Job 5 finalize. While it exists, the stem is being processed; while it's absent, Lizard does nothing for that stem (and intake refuses to clobber it). One file = one active stem. **Pipeline-wide invariant: every Actor precondition starts with `queue/<stem>.json exists ∧ ...`.**
  - Job 0 done for `<stem>`: `scrapes/<stem>.txt` + `screenshots/<stem>.<ext>` exist (queue file untouched)
  - Job 1 done for `<stem>`: `tasks/skeleton/<stem>.md` exists
  - Job 2 done for `<stem>`: `tasks/<stem>.md` exists
  - Job 3a done for `<stem>`: every `## Annotation N` block in `tasks/<stem>.md` carries either `#### Auto Verdict` (Job 2 carve-out) or `#### Igor Verdict` (Igor walkthrough)
  - Job 3b done for `<stem>`: `payloads/<stem>.yaml` exists (fan-out reads task file, validates verdict coverage, writes payload)
  - Job 4 done for `<stem>`: `payloads/sa_applied/<stem>.yaml` exists (atomic mv from `payloads/<stem>.yaml`)
  - Job 5 done for `<stem>`: `payloads/done/<stem>.yaml` exists AND `queue/<stem>.json` deleted (Job 5 finalize). Per-annot proof: `tasks/shadows/<uuid8>.md` files (sidecar `payloads/done/<stem>.shadows.yaml` indexes them).
  - Cycle 2 enforcement is automatic: `queue/<stem>.json` lives the entire cycle. Re-queueing while in flight is impossible (intake refuses overwrite). Cycle 2 starts only after cycle 1's Job 5 finalize removes the queue entry.
  - Concurrency: `scrapes/.lock` flock held by current CLI process during SA queue intake
  - Session log: `logs/session-<unix-ts>.md` (newest mtime = active session)
- **Codified rules expire.** Incident-driven rules tagged `(codified <date>)`. When the underlying fix has a regression test, the rule graduates out of CLAUDE.md.

## Doc structure
CLAUDE.md is the always-loaded thin layer. It is self-sufficient: every Job procedure lives here in full, no on-demand companion file required for runtime.

When codifying a new rule from an incident: add it to CLAUDE.md, tag with `(codified <date>)`. Search before adding (no duplicates). Tag rules whose underlying fix has a regression test so they can graduate out later.

## Communication
Igor is terse and direct. Show thinking. If stuck, pick randomly, move.

---

## Job 0 — Scrape (CLI, per-stem actor; queue-driven)

Two phases — both file-based, no manifest, no batch concept (codified 2026-04-29):

- **Queue intake** (manual, on demand): Igor decides which SA queue rows to scrape next. Writes one `queue/<stem>.json` per chosen row.
- **Scrape actor**: per stem in `queue/`, opens editor, scrapes, writes `scrapes/<stem>.txt` + `screenshots/<stem>.<ext>`. **Queue file is NOT deleted here** — it persists through the entire pipeline and is removed only at Job 5 finalize.

The queue file is the active-work marker for the whole pipeline. Every Job's precondition gates on `queue/<stem>.json` existing. New tasks interleave with in-flight ones; cycle-2 re-entry is impossible until cycle 1 reaches Job 5 finalize (intake refuses to clobber a live queue file).

### Queue intake (run on demand)
1. Acquire concurrency lock: `flock -n scrapes/.lock` for the duration of the intake session (serializes SA queue-tab access). Fail loud if another CLI holds it.
2. Open / refresh log: `logs/session-$(date +%s).md`. Newest-mtime under `logs/` is the active session.
3. Open SA queue tab: `https://app.superannotate.com/35245/project/283665/data?sort=name&direction=asc`
4. `read_page(tabId, filter:"interactive")` → JSON of candidate rows (Name, category, editor_url, task_id, status).
5. Filter NV rows: `node scripts/filter-queue-rows.mjs` (excludes `category === "return_to_QC_by_NV"`; SA's `status=6` URL filter handles terminal statuses server-side).
6. Pipe to `node scripts/queue-intake.mjs` — interactive picker by default. Igor selects which to queue. CLI writes `queue/<stem>.json` per selection (atomic `.tmp` → rename). Refuses to clobber existing queue files unless `--force`. Re-queueing a stem whose `scrapes/<stem>.txt` already exists is allowed (cycle-2 re-scrape) and reported as `queued-rescrape`.

### Scrape actor (per stem, serial)

Actor precondition for stem `<S>`:
- `queue/<S>.json` exists
- AND `scrapes/<S>.txt` is absent OR older than `queue/<S>.json` (cycle-2 re-scrape signal: re-touching the queue file marks intent to re-scrape)

1. Read `queue/<S>.json` for `task_id` + `editor_url`.
2. Open editor tab at `editor_url` (reuse if matching tab exists).
3. `evaluate_script scripts/scrape-superannotate.js` → triggers download to `~/Downloads/sa-scrape-<task_id>*.txt`.
4. Pick newest matching download:
   ```bash
   SCRAPE=$(TASK_ID=<task_id> node scripts/pick-newest-scrape.mjs)
   ```
   Browser-added `(1)`, `(2)` suffixes mean un-suffixed file is often stale; the picker handles this. Exit 1 (no matches) → leave queue file in place, log, continue. Re-running Job 0 retries.
5. Copy: `cp "$SCRAPE" scrapes/<S>.txt` (overwrite OK — supports cycle-2 re-scrape).
6. Image (skip if `screenshots/<S>.<ext>` exists — cycle 2 reuse):
   ```bash
   IMG_URL=$(grep '^IMAGE_URL:' scrapes/<S>.txt | cut -d' ' -f2-)
   EXT=$(basename "${IMG_URL%%\?*}" | awk -F. '{print $NF}')
   curl -fsSL -o screenshots/<S>.$EXT "$IMG_URL"
   ```
   Never right-click → save-as (captures editor viewport instead of native asset).
7. **Queue file untouched.** `queue/<S>.json` stays in place; it's the pipeline-wide active-work marker, removed only by Job 5 finalize. **Job 0 done signal** = `scrapes/<S>.txt` + `screenshots/<S>.<ext>` exist (mtime ≥ `queue/<S>.json` mtime to handle cycle-2 re-scrape).

### Failure
Per-stem failure → scrape/screenshot files absent or stale, queue file stays. Re-running Job 0 retries (precondition still satisfied).

### File locations
- Active-work queue: `queue/<stem>.json` (gitignored; one row per file: `{stem, name, category, editor_url, status}`). Persists from intake through Job 5 finalize.
- Scrape: `scrapes/<stem>.txt` (gitignored)
- Image: `screenshots/<stem>.<ext>` (gitignored)
- Concurrency lock: `scrapes/.lock` (flock; held during queue intake)
- Session log: `logs/session-<unix-ts>.md`

---

## Job 1 — Skeleton (CLI, per-task serial)

### Actor precondition (filesystem-derived)
For stem `<S>`, run Job 1 when:
- `queue/<S>.json` exists (active work)
- `scrapes/<S>.txt` exists (Job 0 done)
- `screenshots/<S>.<ext>` exists (Job 0 done)
- AND `tasks/skeleton/<S>.md` either does NOT exist, OR is older than the scrape (re-scrape case)

### Steps
1. Run: `STEM=<S> node scripts/run-job1.mjs`
2. Reads `scrapes/<S>.txt` headers (`TASK_ID`, `SA_TASK_FILENAME`, `IMAGE_URL`, `N_ANNOTATIONS`) + per-annotation sections.
3. Cycle detection by file presence: `tasks/<S>.md` AND `payloads/<S>.yaml` absent → cycle 1; either present → cycle 2. **No manifest read for cycle.**
4. **Cycle-2 archive (symmetric):** if cycle 2 AND `tasks/<S>.md` exists, rename to `tasks/<S>.cycle1.md`. If `payloads/<S>.yaml` exists, rename to `payloads/<S>.cycle1.yaml`. Refuses if any cycle-1 archive already exists (collision = cycle 3, not supported). Both cycle-2 slots empty before Jobs proceed.
5. **Cycle-2 scope filter:** at cycle 2, parse `scrapes/<S>.txt` per-annotation sections; emit skeleton only for annots with `QC_RATING: thumbs-down` (returnees from cycle 1). Cycle 1: include all annots.
6. Consistency check: post-filter `N_ANNOTATIONS ≥ 1`, every `prompt_len ≥ 50`, every annotator answer non-empty. Any failure → exit 1.
7. Write `tasks/skeleton/<S>.md` with: Task Info (task_id, SA_TASK_FILENAME, image path, date, review cycle) + per-annotation sections (skills, qtype, model answer, annotator answer, prompt, QC feedback, empty Two-Part Check / Edits / Feedback placeholders).

### Output contract
Skeleton MUST have parseable headers `## Annotation N` (one per annotation). Job 2 merger relies on this regex; misparsing here = downstream silent drop.

### Failure
Any error → exit 1, no partial skeleton written, log, continue to next stem.

### Job 1 done for `<stem>` is signaled by `tasks/skeleton/<stem>.md` existing with mtime ≥ scrape mtime. No state-file write — Job 2 actor sees the artifact and picks up.

---

## Job 2 — Review + merge (CLI, per-task serial)

### Actor precondition (filesystem-derived)
For stem `<S>`, run Job 2 when:
- `queue/<S>.json` exists (active work)
- `tasks/skeleton/<S>.md` exists with mtime ≥ scrape mtime (Job 1 done, fresh)
- `tasks/<S>.md` does NOT exist (write-once; cycle 2 case is pre-archived by Job 1)

### Steps
1. **Run review + merge:** `STEM=<S> node scripts/run-job2.mjs`. Sequential fire of 4 reviewers in order: opus → gpt → gemini → grok. Per-annot filtering: each reviewer sees only annots still pending after upstream auto-resolves. First-👍-wins early-stop. Override fire order with `REVIEWERS=a,b,c` env (rare; defaults are policy).
2. Inside `run-job2.mjs`:
   - Reviewers fire to `/tmp/lizard/<S>/<name>-review.md`. Each output validated: one `## Annotation N` block per skeleton annot + `**Flags:**` field per block. Bad output → reviewer dropped.
   - Per-annotation drop: after each reviewer, dry-merge auto-resolves annots; subsequent reviewers fire only on still-pending ones.
   - Merger (`job2-merge.mjs`) writes `tasks/<S>.md` with per-annotation sections (reviewer bodies, picked verdict, Auto Verdict block for carve-outs). **No payload block** — payload is Job 3's output.
   - `scripts/reviewer-stats.json` updated.

### Job 2 done for `<S>` is signaled by `tasks/<S>.md` existing. Merge summary at `/tmp/lizard/<S>/merge-summary.json` (ephemeral cache).

### Failure modes
- All reviewers fail (no valid output) → mark stem `held`, continue
- `tasks/<S>.md` already exists → merger refuses (write-once). Move/delete the file to re-merge.

### Auto-resolve carve-outs (codified 2026-04-25 v2)

Reviewers fire as sequential binary probes. 👎 = next probe. 👍 = stop, auto-resolve. Annotation skipped at Job 3 manual walkthrough (no Igor 👍/👎 needed) under either:
- **👍 case:** ANY reviewer rated 👍 AND the reviewer's Final Answer is close to annotator's rewrite (numeric ≤ 10% relative diff; non-numeric exact match after case+whitespace normalize). SA push approves the annotator's answer regardless of the reviewer's Final Answer. First 👍 reviewer in fire order becomes the pick.
- **👎 unanimous G1 case:** ALL reviewers fired (≥2) AND ALL rated 👎 AND ALL flagged G1 (V6 anchor-skill fail). Picks the first 👎 reviewer. SA action: delete (cycle 2) or QC_Return (cycle 1).
Other reviewers' opinions embedded in task file for audit but don't gate the decision.

**Carve-out stamping:** Job 2 emits a `#### Auto Verdict` block per carve-out annot with fields `carve_out`, `rating`, `final_answer`, `source`, `sa_action`, `skills_check`, `skills_uncheck`, `notes`. State IS the filesystem; `merge-summary.json` is ephemeral cache.

**👍 + big-diff escalation:** if the picked 👍 reviewer's Final Answer diverges from annotator's (numeric > 10% relative, or non-numeric mismatch), annotation lands `pending-igor` instead of `auto-resolved` — divergent 👍 may be sloppy or corrective (per `templates/review-prompt.md` "Wrong rewrite answer" rule). Igor decides at 3a.

---

## Job 3 — Igor Verdicts + Payload Fan-out (Igor + CLI, per-task serial)

Job 3 splits into **Job 3a** (Igor walkthrough — append manual verdicts) and **Job 3b** (CLI fan-out — write payload). Both are filesystem-derived; both read state from `tasks/<S>.md` only.

### In-flight status report (emit at Job 3 start)
First action of every Job 3 session: render a per-stem table for the **in-flight set** (`node scripts/in-flight.mjs` — every stem with an artifact and no `payloads/done/<S>.yaml`). One row per stem. Per row, classify each `## Annotation N`:
- `#### Auto Verdict` present → `auto ✅` (note `carve_out:` value if non-trivial: 👍-close vs 👎-G1)
- `#### Igor Verdict` present (and no Auto, OR Igor is overriding Auto) → `igor done`
- Neither present → `Igor needed` (mention reviewer fire chain from `**All Verdicts:**` line)

Also emit a tail summary listing which stems are 3b-ready (every annot stamped) vs still gated on 3a (and which annots).

This is a re-render of Job 2's finish summary, derived purely from filesystem state. No state file. Required so Igor sees the landscape before walking annots.

---

### Job 3a — Manual verdicts (Igor)

#### Actor precondition (filesystem-derived)
Run Job 3a on stem `<S>` when:
- `queue/<S>.json` exists (active work)
- `tasks/<S>.md` exists (Job 2 done)
- `payloads/<S>.yaml` does NOT exist (write-once gate; if present, this stem is past 3a)
- AT LEAST ONE `## Annotation N` block in `tasks/<S>.md` lacks BOTH `#### Auto Verdict` AND `#### Igor Verdict`

#### Find pending stems (one-liner)
```bash
for q in queue/*.json; do
  s=$(basename "$q" .json)
  [ -f "tasks/$s.md" ] || continue
  [ -f "payloads/$s.yaml" ] && continue
  a=$(grep -c '^## Annotation ' "tasks/$s.md"); v=$(grep -cE '^#### (Auto|Igor) Verdict' "tasks/$s.md")
  [ "$a" -gt 0 ] && [ "$v" -lt "$a" ] && printf "%-50s %d/%d need verdict\n" "$s" $((a-v)) "$a"
done
```
The loop already iterates `queue/*.json` — in-flight by definition. No further intersection needed.

#### Steps (per annotation requiring Verdict)

1. **Pick** the next `## Annotation N` block in `tasks/<S>.md` that lacks both `#### Auto Verdict` and `#### Igor Verdict`. Skip annotations with `#### Auto Verdict` already present (pre-resolved by Job 2 carve-out) unless Igor wants to override — Igor Verdict wins on conflict.

2. **Open the image** for Igor: provide a `computer://<absolute-path>` link to `screenshots/<stem>.<ext>`. Image inspection is always assumed; do NOT prompt Igor to open it as a separate step.

3. **Present the annotation** using this exact template (friendly markdown — bold labels, blank lines between sections, NO fenced code blocks):

   **3a: `<stem>` — A`<n>`**

   **Skills:** `<comma-list>` · **QType:** `<MCQ|SAQ>`
   **Image:** `[screenshots/<stem>.<ext>](computer://<absolute-path>)`

   **Prompt:**
   `<full prompt text>`

   **Look here:** `<exact panel/region/label/visual evidence to inspect — see "Look here:" rules below>`

   **Model answer:** `<X>` · **Annotator rewrite:** `<Y>`

   **Conflict:** `<exact disagreement / ambiguity / rule question — one sentence>`

   **[1] `<reviewer-1-name>`** — `<👍|👎>`, final_answer `<a₁>`
   `<reasoning, edits, feedback — terse, 1-2 lines>`

   **[2] `<reviewer-2-name>`** — `<👍|👎>`, final_answer `<a₂>`
   ...

   **[N] `<reviewer-N-name>`** — `<👍|👎>`, final_answer `<aₙ>`

   **[1..N]** adopt that reviewer's verdict · **[O]** other (custom)

4. **Igor responds:**
   - `1..N` → adopt that reviewer's pick verbatim (rating + final_answer + feedback). `source: <reviewer-name>`.
   - `O` → Igor provides a custom rating, final_answer, and (if 👎) feedback inline. `source: custom`.

5. **CLI appends the Igor Verdict block** under the annotation (immediately after the reviewer bodies, before any closing `---`):
   ```
   #### Igor Verdict
   rating: thumbs-up | thumbs-down
   final_answer: <text>
   source: <reviewer-name | custom>
   skills_check: [<comma-list>]      # OPTIONAL — Igor's skill-tag corrections (add)
   skills_uncheck: [<comma-list>]    # OPTIONAL — Igor's skill-tag corrections (drop)
   notes: <reasoning, especially when overriding reviewer pick or going custom>
   ```
   `skills_check` / `skills_uncheck` are optional: omit (parser falls back to Auto Verdict's deltas) or include `[]` (Igor explicitly cleared all deltas). Non-empty edits trigger the feedback rule below. See `wiki/review-calibration.md` for over-tag patterns.

6. **CLI updates the `#### Feedback` block** per the feedback formatting rules below. (Job 3b later mirrors this verbatim into payload `sa.feedback`.)

#### "Look here:" rules
The `Look here:` line is the highest-leverage line in the walkthrough. Igor reads this BEFORE inspecting the image and decides where to focus his eye. Goal: friendly, precise, no time-wasting. Place it immediately after the prompt — Igor reads the prompt, then the locator, then opens the image with a clear target.

**Rules:**
- One sentence (two max). Name the panel/chart, the axis or region, the labeled markers or values that anchor the visual evidence.
- Use coordinates Igor can pixel-verify: axis labels (`-2.698σ`), gridline values (`33.0%`), panel names (`bottom-right quadrant`, `Responses and Average Rating by Month chart`), labeled markers (`green tail regions`).
- Do NOT paraphrase the prompt. Do NOT summarize reviewer reasoning. The locator is purely *where to look*, not *what conclusion to reach*.
- Do NOT say "look at the chart" or "verify the reviewers' math" — vague locators waste Igor's time.

**Good (Plot_Box_plot_statistical_data_4 A1):**
> bottom normal-distribution curve — the two green tail regions left of -2.698σ and right of +2.698σ, each labeled with a percentage.

Anchors: chart name (`bottom normal-distribution curve`), axis values (`-2.698σ`, `+2.698σ`), labeled regions (`green tail regions`). Igor's eye lands in <2 seconds.

**Bad — vague:**
> Verify the math the reviewers did.

**Bad — paraphrases the prompt:**
> Look at the percentage of data outside the whiskers.

**Bad — too long:**
> Examine the bottom panel which shows a normal distribution curve with several labeled regions; specifically, focus on the leftmost green tail region and the rightmost green tail region, each of which has a percentage label that should be summed to derive the total outside the whiskers.

#### Feedback formatting rules
- **`sa.feedback` present iff thumbs-down OR any field changed (skills, qtype, prompt, answer).** Edits and feedback are coupled: any non-empty `skills_check` / `skills_uncheck` / `prompt_edits` / `answer_final` requires a date-stamped feedback line explaining the edit, even on 👍 outcomes. Empty edits + 👍 → `sa.feedback: null` and `#### Feedback` body is `(none — thumbs-up)`.
- Date-stamp the leading line: `M/D: <rationale>` (e.g., `4/28: Prompt premise false — no unlabeled gridline above 33.0%.` or `4/13: Skill tag corrected: dropped Spatial Reasoning (chart-reading, not relational layout).`).
- No workflow instructions in feedback text — never write `QC_Return`, `send back`, `delete`, etc. The action is encoded in `sa_action` (cycle 1: 👎 → `QC_Return`; cycle 2: 👎 → `delete`), not the prose.
- Payload `sa.feedback` must exactly mirror the annotation-block `#### Feedback` text (including date stamp). Job 3b verifier enforces this round-trip.

#### Job 3a done signal
Every `## Annotation N` block in `tasks/<S>.md` carries `#### Auto Verdict` or `#### Igor Verdict` (or both — Igor wins). No state-file write. Job 3b actor sees coverage and picks up.

---

### Job 3b — Payload fan-out (CLI)

#### Actor precondition (filesystem-derived)
Run Job 3b on stem `<S>` when:
- `queue/<S>.json` exists (active work)
- `tasks/<S>.md` exists
- `payloads/<S>.yaml` does NOT exist (write-once)
- EVERY `## Annotation N` block has `#### Auto Verdict` or `#### Igor Verdict` (3a done)

#### Steps
1. Run: `STEM=<S> node scripts/run-job3.mjs`
2. Reads `tasks/<S>.md`: skeleton fields per annot + Auto Verdict + Igor Verdict (Igor wins on conflict).
3. Validates: every annot has Auto Verdict OR Igor Verdict. Missing → exit 2.
4. Writes `payloads/<S>.yaml` (atomic: `.tmp` → rename). Refuses if file exists (write-once).

### Payload schema

```yaml
task:
  stem: <S>
  sa_task_filename: <S>.json       # also the HAI Task ID field
  task_id: <numeric SA internal ID>
  image: screenshots/<S>.<ext>

annotations:
  - n: <int>                        # annotation index (1..N)
    sa:
      action: approve | QC_Return | delete | none
      # approve: 👍 — apply skill/answer/feedback edits, set thumbs-up
      # QC_Return: cycle 1 + 👎 — apply edits, set thumbs-down
      # delete: cycle 2 + 👎 — apply feedback, set thumbs-down (Igor clicks SA Delete manually)
      # none: not used in cycle-1; reserved
      rating: thumbs-up | thumbs-down
      answer_final: "<text>"        # value to write into Rewrite Answer field
      flags: [G1, G3, ...]          # closed enum from templates/review-prompt.md
      feedback: "<text>"            # paste into QC Feedback (append-not-replace at SA push)
      verdict_source: auto | igor   # provenance (Auto Verdict carve-out vs Igor Verdict)
      skills_check: [...]           # skill checkbox deltas to enable (skills the picked reviewer/Igor wants ADDED)
      skills_uncheck: [...]         # skill checkbox deltas to disable (skills the picked reviewer/Igor wants REMOVED)
      qtype: MCQ | Short answer question
    hai:
      task_id_field: <S>.json
      role: Reviewing
      annotation_n: <int>           # same as parent n
      prompt: |
        <full prompt text>
      answer: "<text>"              # Rewrite Answer for HAI shadow form
```

**Schema rules:**
- `sa.action` is the per-annot SA action (NOT task-level QC status). Already encodes the cycle-dependent choice: `QC_Return` is cycle-1-only, `delete` is cycle-2-only. Cycle field itself is filesystem-derived (presence of `payloads/<S>.cycle1.yaml`) and not in the YAML.
- Task-level QC status (QC_Complete / QC_Return) derives from per-annot `sa.action`. Igor sets it manually in SA UI after Job 4 push.
- Cycle 2 payload contains only the cycle-1 thumbs-down returnees (filtered at Job 1). No `unchanged` carry-forwards.
- All string values UTF-8; multiline via YAML `|` block scalar.

**Optional `task.qc_disposition` field** (added 2026-04-29): when Igor sets the task-level SA dropdown to a non-default value (`Skipped` / `Hold` / `Unusable`), record it in `task.qc_disposition`. Default unset = `QC_Complete` or `QC_Return` (derivable from per-annot `sa.action`). Job 5 (shadow sweep) **MUST skip** stems with `qc_disposition ∈ {Skipped, Unusable, Hold}` — no HAI shadows fire (Slack ruling, Angie Z. Apr 28, see `wiki/slack-rulings.md`).

**Per-annot fields when `task.qc_disposition ∈ {Skipped, Hold, Unusable}`** (codified 2026-04-29): per-annot review doesn't apply when the task is dropped at task level. Schema MUST emit:
- `sa.rating: null`
- `sa.action: none`
- `sa.answer_final: null`
- `sa.skills_check: []` and `sa.skills_uncheck: []`
- `sa.feedback`: optional (per Angie Z. Apr 28 — "Can't hurt to leave feedback though")
- `hai.answer`: annotator's original (unused by Job 5 anyway since stem is skipped)

Verifier permits these null/none values only when `task.qc_disposition` is in the skip-set; otherwise per-annot rating required as before.

**Field-source mapping:**
- `sa.rating` ← `rating:` from picked Auto / Igor Verdict block
- `sa.skills_check` / `sa.skills_uncheck` ← skill edits parsed from picked reviewer's `Edits Made` (Igor overrides at 3a if needed)
- `sa.answer_final` ← `final_answer:` from verdict block, only when `action == approve`. For `QC_Return` / `delete`: `null` (Slack Concede ruling — don't edit annotator's Rewrite Answer)
- `sa.feedback` ← `#### Feedback` block body. Present iff thumbs-down OR any field changed; null otherwise
- `hai.task_id_field` ← `<stem>.json`
- `hai.role` ← `"Reviewing"`
- `hai.annotation_n` ← position (1..N)
- `hai.prompt` ← `#### Full Prompt`
- `hai.answer` ← mirrors `sa.answer_final` when set (approve); else annotator's `#### Rewrite Answer`. Audit-trail rule: HAI shadow's Rewrite Answer must match SA's Rewrite Answer post-Job-4
- QTYPE flips (MCQ ↔ Short answer question) → `skills_check` / `skills_uncheck`, NOT a separate field (positions 7+8 in the 9-checkbox group)

### Job 3b done for `<S>` is signaled by `payloads/<S>.yaml` existing. Job 4 actor sees it and picks up.

### Failure modes
- 3a incomplete (annot lacks Auto and Igor Verdict) → 3b exit 2, no payload written.
- `payloads/<S>.yaml` already exists → 3b refuses (write-once). Move/delete to re-fan.

### Hard rules
- 👍/👎 = agree/disagree with annotator's Rewrite Answer, not prompt quality.
- Cycle 1 + 👎 → `sa.action: QC_Return`. Cycle 2 + 👎 → `sa.action: delete`. Never abbreviate.
- Igor Verdict overrides Auto Verdict. Fan-out reads Igor first; falls back to Auto.
- Payload is immutable once written. Job 4 and Job 5 are dumb executors.
- **NEVER leak reviewer model identity into annotator-facing text.** Payload `sa.feedback` and the `#### Feedback` block in `tasks/<S>.md` are pasted verbatim into SA's QC Feedback box — annotator reads them. Strings like "per opus audit", "gpt suggests", "gemini found", "grok flagged" are forbidden. RLHF integrity depends on annotator not seeing AI scaffolding. Use neutral phrasing: `Skill tag corrected: drop X. <reason>.` (codified 2026-04-29 after Box_4 / Geo_79 audit feedback exposed model name in QC text). Note: model name CAN appear in `notes:` fields of Auto/Igor Verdict blocks (audit trail, never sent to SA).

---

## Job 4 — SA push (CLI, per-stem actor)

Reads `payloads/<S>.yaml` (immutable), navigates to the SA editor for the stem's `task_id`, applies per-annotation edits, clicks Save, then atomically moves the payload to `payloads/sa_applied/<S>.yaml`. Binary state — payload is either "live" (in `payloads/`) or "applied" (in `payloads/sa_applied/`). No intermediate stamp; tasks/ is sealed at end of Job 3.

### In-flight status report (emit at Job 4 start)
First action of every Job 4 session: render `node scripts/job4-batch-status.mjs`. Per stem (sorted alpha across `payloads/*.yaml`): cycle, derived QC status, per-annot rating + skill deltas + full feedback. Output split into Phase 1 (clean approves — no human Delete needed) and Phase 2 (any rejection — pause/warning between phases). This is the canonical pre-Job-4 view; re-derived from `payloads/*.yaml` each invocation, no state file. Re-runnable any time.

### Actor precondition (filesystem-derived)
Run Job 4 on stem `<S>` when:
- `queue/<S>.json` exists (active work)
- `payloads/<S>.yaml` exists
- `payloads/sa_applied/<S>.yaml` does NOT exist (binary write-once gate)

### Steps
1. Read `payloads/<S>.yaml`. Extract `task_id`, derive SA editor URL.
2. Locate / reuse SA editor tab via Chrome MCP (`tabs_context_mcp` + `navigate`). Tab reuse is mandatory if a matching tab exists.
3. **Per annotation (in order 1..N):**
   - Apply skill checkbox deltas: toggle off skills in `skills_uncheck`, toggle on skills in `skills_check`. Idempotent — skip if both lists empty. Use the per-annot 9-checkbox group (positions 0-6 = the 7 skills, 7 = MCQ, 8 = Short answer question; QType flips share this same group).
   - **Verify skill toggles via readback** — re-query checkbox state, retry on mismatch.
   - **Verify question type set** — exactly one of `MCQ` / `Short answer question` must be checked. Empty = fail loud, STOP (do not Save).
   - If `sa.answer_final` non-null: write into Rewrite Answer textarea (native setter + `input` + `change` events).
   - Set QC rating per `sa.rating` — click thumbs-up or thumbs-down button in the QC section (active state = inline `style` contains `rgb(0, 205, 108)`).
   - If `sa.feedback` non-null: append to existing QC Feedback textarea — never replace. Readback to verify char-by-char match against payload `sa.feedback`.
4. **Pre-save audit (mandatory):** for every annot, readback the feedback textarea value and compare against payload `sa.feedback` character-by-character. Mismatch = STOP, do not Save (SA tasks lock on submit; post-save correction impossible).
5. Click task-level **Save**. Confirm save toast.
6. **Atomic move:** `mv payloads/<S>.yaml → payloads/sa_applied/<S>.yaml`. This is the filesystem signal that Job 4 succeeded for this stem.
7. Exit. Print human-bridge instructions: "SA-applied for `<S>`. Set task-level QC status dropdown manually in SA UI. Click SA Delete button manually for any cycle-2 `action: delete` annots."
8. **STOP. Wait for Igor's explicit go-ahead ("next", "ok", "go") before navigating to the next stem.** (codified 2026-04-29 — Igor needs screen to set task-level QC status and handle any Deletes before next stem loads.)

### Job 4 done for `<S>` is signaled by `payloads/sa_applied/<S>.yaml` existing. Job 5 actor sees it and picks up.

### Failure modes
- Tab not found / Chrome MCP unreachable → exit 1, no SA mutation.
- Skill readback mismatch → retry once, then exit 1 with the offending annot.
- QType empty after toggles → exit 1 (annotator's qtype field unfilled — payload bug; refuse to Save).
- Pre-save audit mismatch → exit 1 (do NOT click Save).
- Save toast absent within timeout → exit 1 (SA may have rejected; manual recovery needed).
- `payloads/sa_applied/<S>.yaml` already exists → refuse (binary write-once gate). Move/delete to re-apply.

### Hard rules
- **CLI never clicks SA Delete.** Cycle-2 `action: delete` annots: CLI applies feedback + thumbs-down rating, then STOPS. Igor manually clicks SA Delete in the UI. Annotation deletion in SA is **IRREVERSIBLE** — only Igor's hands.
- **CLI never sets task-level QC status dropdown.** That's a human-only field in SA. CLI applies per-annot fields (skills, rating, answer, feedback) + Save. Igor sets task status manually in SA UI after Job 4.
- **Feedback writes are append, never replace.** Per `references/playbook_reviewer.md` line 76: "Add your feedback in chronological order." Existing reviewer feedback stays at top; new payload `sa.feedback` goes below.
- **Pre-save audit is mandatory before clicking Save.** SA tasks lock on submit; post-save correction is impossible.
- **Never reinterpret payload after Save.** CLI is a dumb executor post-fan-out. Values are final as-written in YAML.
- **Move payload AFTER Save, not before.** Save success → mv. If Save fails, payload stays in `payloads/`, Igor can re-run after fixing root cause.

### DOM mechanics
SA UI write helpers live in `scripts/sa-apply.js` (browser-side blobs invoked via Chrome MCP `evaluate_script`, mirroring the `scripts/fill-hai-shadow.js` pattern for HAI). DOM specifics (selectors, native-setter pattern, checkbox layout) are inline comments there + `wiki/sa-interface.md`. CLAUDE.md describes the actor; the helper script owns the technicalities.

---

## Job 5 — Shadow sweep (CLI, per-stem actor)

Reads `payloads/sa_applied/<S>.yaml`, fires one HAI shadow task per annotation (or zero if task is skip-disposition), writes proof file `tasks/shadows/<uuid8>.md` per shadow, atomically moves payload to `payloads/done/<S>.yaml`. Binary state: SA-applied → done.

### Actor precondition (filesystem-derived)
Run Job 5 on stem `<S>` when:
- `queue/<S>.json` exists (active work)
- `payloads/sa_applied/<S>.yaml` exists
- `payloads/done/<S>.yaml` does NOT exist (binary write-once gate)

### Per-stem orphan self-heal (built into run-job5.mjs)
Top of `scripts/run-job5.mjs`: if `queue/<S>.json` + `payloads/done/<S>.yaml` are both present, that's an orphan from a crash between the atomic mv and `rm queue/`. Script deletes the queue file and exits 0. Idempotent; runs on every Job 5 invocation, so any orphan is cleaned up the next time you touch that stem. No session-wide sweep needed — `in-flight.mjs` surfaces orphans by labeling them `stage=done` in the in-flight list.

### Pre-flight: skip-disposition check
Read `task.qc_disposition` from payload. If `∈ {Skipped, Hold, Unusable}` → atomic mv payload to `payloads/done/`, then `rm queue/<S>.json`, exit. Zero shadows fired (Slack ruling, Angie Z. Apr 28).

### Per-annotation steps (in order 1..N)
For each annot in payload:
1. **Idempotency:** scan `tasks/shadows/*.md` for one with matching `**stem:** <S>` AND `**annotation_n:** <n>`. If found → skip (already fired).
2. **Determine HAI form content:**
   - `action: delete` → prompt = `annotation deleted`, answer = `annotation deleted`, HAI rating = Reject
   - `rating: thumbs-up` → prompt = `hai.prompt`, answer = `hai.answer`, HAI rating = Approve
   - `rating: thumbs-down` (non-delete) → prompt = `hai.prompt`, answer = `hai.answer`, HAI rating = Reject
3. **Fill via `scripts/fill-hai-shadow.js` blobs** (~6 round-trips):
   - `haiPassThroughReminders()` → step1 ready
   - `haiFillStep1And2({task_id_field, annotation_n})` → step3 ready
   - `mcp__chrome-devtools__upload_file(uid, screenshots/<stem>.<ext>)` → image attached
   - `haiFillStep3Prompt({prompt})` → step4 ready
   - `haiFillStep4ToComplete({answer})` → "Task complete!" page
4. **Time edit (ONE-WAY FLOOR):**
   - Read displayed time. If `< 20:00` → `haiSetTimeAndConfirm({minutes: 20})`. If `≥ 20:00` → skip Edit time, click Confirm time directly.
   - Verify page advanced past time screen.
5. **Capture shadow UUID** from final URL (first 8 chars of UUID = filename slug).
6. **Write proof file** `tasks/shadows/<uuid8>.md` from `templates/shadow-template.md` with `**stem:**`, `**annotation_n:**`, `**cycle:**`, `**rating:** Approve|Reject`, `**fired_at:**`, HAI link, prompt + answer (frozen snapshot).
7. **Append entry to sidecar** `payloads/sa_applied/<S>.shadows.yaml` (atomic .tmp → rename): `{n, uuid, fired_at, rating, time_logged}`.

### Finalize (after all annots covered)
1. Atomic mv BOTH payload files:
   - `payloads/sa_applied/<S>.yaml` → `payloads/done/<S>.yaml`
   - `payloads/sa_applied/<S>.shadows.yaml` → `payloads/done/<S>.shadows.yaml`
2. **Remove queue entry:** `rm queue/<S>.json`. This is the pipeline's exit gate — once gone, the stem is no longer "active". A crash between step 1 and step 2 leaves an orphan queue file; the next time `run-job5.mjs` is invoked on any stem, the per-stem self-heal at the top of the script picks it up.

Sidecar absent in done = "no shadows fired" (skip-disposition path); present = "all annots shadowed."

### Job 5 done for `<S>` is signaled by `payloads/done/<S>.yaml` existing AND `queue/<S>.json` removed.

### Failure modes
- Chrome MCP unreachable → exit 1, no mutation.
- HAI image upload returns >1 file with no Remove button → exit 1.
- Time-edit verification fails (`< 20:00` after attempted set) → STOP, do not Confirm time.
- Shadow file write fails after Submit → SA submitted but no proof file; manual recovery needed.
- `payloads/done/<S>.yaml` already exists → refuse (binary write-once gate).

### Hard rules
- **1 shadow per annot reviewed.** No exceptions for non-delete annots in non-skipped tasks.
- **Time edit is ONE-WAY FLOOR.** Never overwrite a session time `> 20:00` — destroys real logged work.
- **Verify page advanced after Confirm time.** Silent rollback = no payment recorded.
- **Skipped / Hold / Unusable stems → ZERO shadows.** Task-level skip dispositions skip the whole stem.
- **Shadow file is canonical proof.** Sidecar is forward index for fast lookup; not a replacement.
- **QC feedback check is mandatory before role click (codified 2026-04-30).** After LLM validation, before clicking "Reviewing": extract the QC feedback text from the page body (text above "Are you annotating or reviewing this task?"). Print it. If it contains anything other than "looks good" / "may continue" / "no issues" — STOP. Do not click "Reviewing". Surface the warning to Igor and wait for explicit go-ahead. Silently passing QC errors into submissions corrupts the annotation record.

### DOM mechanics
HAI form-fill helpers live in `scripts/fill-hai-shadow.js` (browser-side blobs invoked via Chrome MCP `evaluate_script`). Selectors + native-setter patterns + step-flow logic are inline comments there + `wiki/hai-selectors.md`. CLAUDE.md describes the actor; the helper script owns the technicalities.
