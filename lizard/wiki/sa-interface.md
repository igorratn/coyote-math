# SuperAnnotate Interface Notes

## Task Structure
- Each task has 1 image + up to 5 annotations
- Each annotation: prompt text, skill tags, question type (MCQ/Short Answer), model answer, model answer rating
- Status change logs at bottom of task — use to determine first vs second pass

## Task Statuses
- **QC_Complete** — all annotations thumbs-up, task approved
- **QC_Return** — any annotation thumbs-down, sent back to annotator
- **Hold** — needs lead input (unclear image, policy question)
- **Skipped** — outside domain or blocked
- **Unusable** — image quality or content makes task unworkable

## Annotation Fields (per annotation)
- Prompt text (editable by reviewer)
- Skill tags checkboxes (editable)
- Question Type: MCQ / Short Answer (editable)
- Model Answer Rating: thumbs-up / thumbs-down
- QC Rating: thumbs-up / thumbs-down
- QC Feedback: free text field (dated entries)

## Reviewer Actions
- Edit prompt text directly
- Check/uncheck skill tags
- Change question type
- Rewrite answer (model answer field)
- Set QC rating per annotation
- Write QC feedback per annotation
- Set task-level status

## Image Handling
- Right-click image → save for shadow task upload
- Zoom to read exact values — NEVER guess from thumbnails
- Dense images (tables, multi-chart dashboards) should have multiple annotations

## Shadow Tasks (Handshake AI)
- Select "Reviewing" (not "Annotating")
- 1 shadow task per annotation reviewed (not per SA task)
- Start shadow when you start annotation, submit when you finish

### HAI Form Fields (in order)
1. **Task ID** (text) — exact SA task filename, e.g. `Plot_Spectral_analysis_charts_80.json`. This is the human-readable filename shown in SA's task list, NOT the numeric URL task_id (e.g. `187109779`). Derivable from the IMAGE_URL basename (swap `.png` → `.json`).
2. **Annotating/Reviewing** (button) — select "Reviewing"
3. **Annotation number** (number 1-5) — position from top in SA
4. **Annotator Prompt + Image** (textarea + file upload) — full prompt text (post-edits), upload task image via + button (native file picker)
5. **Rewrite Answer** (text) — final answer value
6. **LLM feedback** (read-only) — ignore per workflow rules, always follow playbook
7. **Continue** → Cowork stops here
8. **Submit task + Confirm time** → human only, after review

### Automation Notes
- Cowork fills all text fields + clicks Continue
- Image upload requires manual file selection (native picker)
- Submit task and Confirm time are always manual — never automated
- ~3 min per shadow task with automation

## DOM Structure (host scrape reference)

SA editor is an Angular app. Content lives inside a nested iframe — must access `iframe.contentDocument`.

**Locate iframe:**
```js
Array.from(document.querySelectorAll('iframe')).find(f => f.src.includes('custom-llm'))
```

**Textarea layout** (verified 2026-04-13, General VQA v2):
- `textareas[0..1]`: header/empty — skip
- Per annotation `i` (0-indexed), `base = 2 + i * 10`:
  - `base+0` PROMPT (placeholder: "write your own question...")
  - `base+1` MODEL_GENERATED_ANSWER (raw model output; e.g. "77.8%", "C")
  - `base+2` empty
  - `base+3` ANSWER (annotator's final correct answer — "Rewrite Answer" field; "Rewrite" is a verb instructing annotator to write the correct answer; e.g. "100.0%", "B")
  - `base+4` empty
  - `base+5` METRIC_LOG (large JSON array)
  - `base+6..9` QC_FEEDBACK (placeholder "Placeholder", empty until rated)
- After 5 annotations:
  - `textareas[52]`: STATUS_LOG JSON
  - `textareas[53]`: STATUS_LOG plain text

**Checkboxes:** 9 per annotation (Enumeration, Attribute Perception, Spatial Reasoning, Math Reasoning, Logical Reasoning, Table/Chart/Graph Understanding, World Knowledge, MCQ, Short answer question). Group `i` starts at `checkboxes[i*9]`.

**Section order per annotation** (top to bottom in right panel):
1. Rewrite Answer and Question Section
2. Work validation (model eval result)
3. Metric Log
4. **QC** (blue) — `<p class="title">QC</p>` — contains `Disapprove / Approve` + `Feedback`
5. **Audit** (purple) — `Disapprove / Approve of Annotation (Does Annotation Pass?)` + `Feedback for QC`
6. **NV Audit** (purple) — `Disapprove / Approve` + `Feedback`

**To click QC approve:** find `<p class="title">` with text `QC`, walk up to its section container, query `button[ng-reflect-svg-icon="approve-action"]` inside it.
```js
const qcHeaders = Array.from(doc.querySelectorAll('p.title')).filter(p => p.textContent.trim() === 'QC');
// walk up from qcHeaders[i].parentElement until approve button found
```

Active state = inline `style` contains `rgb(0, 205, 108)` (green). `ng-reflect-color` stays "gray" even when active — ignore it.

**Do NOT use** "Disapprove / Approve of Annotation (Does Annotation Pass?)" — that is the **Audit** section. Do NOT use "NV Audit" section.

**Image:** single `<img>` in iframe `contentDocument` — `doc.querySelector('img').src`.

**Scrape script:** `scripts/scrape-superannotate.js` — inject via `evaluate_script`, returns metadata + triggers blob download.

## Known Quirks
- Selecting a QC status removes task from your queue (expected — task moves to next stage)
- Model outages happen — check #lizard-tasking for status
- Handshake miscategorizes domains frequently — content matters more than labels
- **Explanation tab is unused.** Ignore any value there. Scrape scripts must not pull from it.
- **Model Generated Answer vs Rewrite Answer**: two distinct fields, always-differ rule. The annotator's goal is to craft a prompt that STUMPS the model — so MODEL_GENERATED != REWRITE is the expected state. If they match, the prompt didn't stump the model → annotator failed objective → likely thumbs-down.

## Requesting More QC Tasks
- Channel: **#lizard-qc-requests-only** (C0AMWS79EMD)
- Format: "Ready for more QCs!" with tags — Nikhil D. [HAI] (U0AQNJPT2C8), Harsha S. [HAI] (U0ANBQHUHFV), Achsah W. [HAI] (U0AMVH1K99D)
- Empty category dropdown in General VQA v5 UI = no tasks; post in channel to request refill
