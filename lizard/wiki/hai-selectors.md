# HAI Shadow Task Form — Selectors Reference

Captured 2026-04-18 during Risk_90 A5 (task `fa37e0cd`).

## HTML body sizes by step

| Step | Description | `document.body.outerHTML.length` |
|------|-------------|----------------------------------|
| Reminder screen (1st) | "It is VERY important…" + Continue | 676,282 |
| Reminder screen (2nd) | Shadow Tasks instructions + Continue | ~676,282 |
| Step 1 — Task ID | Textarea + Submit | 681,189 |
| Step 2 — Annotation # | Spinbutton + Submit | 684,805 |
| Step 3 — Prompt + Image | Textarea + Upload + Submit | 689,559 |
| Step 4 — Answer | Textarea + Submit | 693,382 |
| Step 5 — Role selection | Annotating / Reviewing buttons + Submit | ~698,960 |

---

## Step 1 — Task ID

**Element:** `textarea` (one on page)  
**a11y label:** `textbox "Paragraph response" multiline`  
**Placeholder:** `Start typing...`  
**name/id:** `<task-UUID>_<randomsuffix>` — changes per task instance  
**Class prefix:** `box-border field-sizing-content w-full resize-none border-fg-border text-body-md text-primary-foregr`  
**Submit button:** `button[type="submit"]` — no visible text (icon only), disabled until textarea filled  

**Fill method:** JS native setter (React-controlled textarea):
```js
const ta = document.querySelector('textarea');
const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value').set;
nativeSetter.call(ta, 'YOUR_VALUE');
ta.dispatchEvent(new Event('input', { bubbles: true }));
ta.dispatchEvent(new Event('change', { bubbles: true }));
```

---

## Step 2 — Annotation Number

**Element:** `input[type="number"]`  
**a11y label:** `spinbutton "Number input, range 1 to 5"` (valuemin=1, valuemax=5)  
**name/id:** `<task-UUID>_<randomsuffix>` — changes per task instance  
**Class:** `flex w-full rounded-lg border-0.5 border-fg-border bg-primary text-primary-foreground outline-hidden`  
**Submit button:** same `button[type="submit"]` pattern, disabled until filled  

**Fill method:** `mcp__chrome-devtools__fill` works directly (not React-controlled).

---

## Step 3 — Prompt + Image

**Textarea:** unnamed (`name=""`), same class prefix as Step 1, `placeholder="Start typing..."`  
**Upload button:** `button "Upload assets"` — `mcp__chrome-devtools__upload_file` works with this uid and a local `filePath`  
**Submit button:** up-arrow `button[type="submit"]` on the prompt/image card. Important after edits: later-step submit buttons can also exist in the DOM, so use the **first visible enabled** `button[type="submit"]`, not an arbitrary enabled submit.  
**Uploaded-file controls:** uploaded image tile appears as `button[aria-label^="Open "]` or `button[aria-label^="View file "]`; each tile exposes a sibling `button[aria-label="Remove file"]` while Step 3 is active. Keep exactly 1 image before advancing.

**Fill method:** JS native setter for textarea. `upload_file` MCP for image.  
**Note:** Prior memory said `upload_file` was broken — confirmed working as of 2026-04-18.

---

## Step 4 — Answer

**Textarea:** same as Step 3 (unnamed, placeholder `Start typing...`)  
**Submit button:** `button "Submit" disableable disabled` — disabled until filled  
**After submit:** LLM validation begins; page shows `StaticText "This may take a few minutes"`  

**Fill method:** JS native setter. Poll with `take_snapshot` until role buttons appear (~15–60s).

---

## Step 5 — Role Selection (post-LLM validation)

**LLM feedback block:** appears above the role buttons — may contain critique of prompt/answer  
**Role buttons:** `button "Annotating"` and `button "Reviewing"` (both enabled)  
**Submit:** `button[type="submit"]` disabled until a role is selected  

**Flow:** click `Reviewing` → Submit becomes enabled → click Submit → Approve/Reject step appears

---

## Step 6 — Approve / Reject

**Buttons:** `button "Approve"` and `button "Reject"`  
**Submit:** `button "Submit" disableable disabled` — disabled until one is selected  
**Quirk:** After clicking Approve, Submit may still be disabled if Approve lost `pressed` state. Re-click Approve to restore `focused pressed` state, then Submit enables.  

**After Submit:** `button "Continue"` appears.

---

## Step 7 — Continue → Submit task

**Continue button:** `button "Continue"` — may briefly appear disabled during page transition; poll if needed  
**After Continue:** `button "Submit task"` appears  
**Submit task:** click → "Task complete!" screen appears

---

## Step 8 — Time Edit (Task complete screen)

**Confirm time:** `button "Confirm time"` — uses actual elapsed time  
**Edit time:** `button "Edit time"` → opens dialog  
**Dialog fields:** `textbox "Hours"` (value="0"), `textbox "Minutes"` (value=elapsed), `textbox "Seconds"` (value=elapsed)  
**Save:** `button "Save"`  
**Target time:** always set to `Hours=0, Minutes=20, Seconds=0` for Cycle 1  

**Fill method:** `mcp__chrome-devtools__fill` works directly on these dialog inputs.

---

## Key invariants

- Textarea `name` attribute in Steps 1 and 2 embeds the HAI task UUID — not stable across tasks.
- Steps 3 and 4 textareas have `name=""` — select by `document.querySelector('textarea')`.
- All textareas require JS native setter (React-controlled). Spinbutton and dialog inputs use `fill` MCP directly.
- `upload_file` MCP works on the `button "Upload assets"` uid — tested and confirmed 2026-04-18.
- If Step 3 is re-entered via `Edit this step`, later steps may remain mounted below it. In that state, the correct submit is still the **first visible enabled** `button[type="submit"]`.
- Before Step 3 submit, assert exactly one uploaded image tile; remove extras via `button[aria-label="Remove file"]`.
