// fill-hai-shadow.js — HAI Shadow Task Form fill helpers
//
// Replaces ~25–30 chrome-devtools MCP round-trips per shadow with ~6 calls.
// Each exported function is a standalone blob CLI invokes via
// `mcp__chrome-devtools__evaluate_script`.
//
// Call sequence per shadow:
//   1. haiPassThroughReminders()                → {step: 'task_id_ready'}
//   2. haiFillStep1And2({taskId, annotationN})  → {step: 'step3_ready'}
//   3. [MCP] upload_file(uploadBtnUid, imagePath)
//   4. haiFillStep3Prompt({prompt})             → {step: 'step4_ready'}
//   5. haiFillStep4ToComplete({answer})         → {step: 'task_complete'}
//   6. haiSetTimeAndConfirm({minutes: 20})      → {step: 'confirmed', url: ...}
//
// Total: 5 evaluate_script calls + 1 upload_file MCP call = 6 round-trips.
//
// Selectors captured from wiki/hai-selectors.md (2026-04-18).

// ============================================================
// Helpers — included inline in each blob so they're self-contained.
// ============================================================

/**
 * Wait for selector to appear, return the element, or reject after timeout.
 */
function waitFor(selectorFn, { timeout = 30000, interval = 150 } = {}) {
  return new Promise((resolve, reject) => {
    const start = Date.now();
    const check = () => {
      try {
        const el = selectorFn();
        if (el) return resolve(el);
      } catch (e) {}
      if (Date.now() - start > timeout) {
        return reject(new Error(`waitFor timeout after ${timeout}ms`));
      }
      setTimeout(check, interval);
    };
    check();
  });
}

/** Return true when element is visibly rendered on screen. */
function isVisible(el) {
  if (!el) return false;
  const rect = el.getBoundingClientRect();
  return rect.width > 0 && rect.height > 0;
}

/** Native setter for React-controlled textarea. */
function setTextarea(ta, value) {
  const setter = Object.getOwnPropertyDescriptor(
    window.HTMLTextAreaElement.prototype, 'value'
  ).set;
  setter.call(ta, value);
  ta.dispatchEvent(new Event('input', { bubbles: true }));
  ta.dispatchEvent(new Event('change', { bubbles: true }));
}

/** Native setter for React-controlled input. */
function setInput(inp, value) {
  const setter = Object.getOwnPropertyDescriptor(
    window.HTMLInputElement.prototype, 'value'
  ).set;
  setter.call(inp, value);
  inp.dispatchEvent(new Event('input', { bubbles: true }));
  inp.dispatchEvent(new Event('change', { bubbles: true }));
}

/** Click a button by exact text match. Throws if not found or disabled. */
function clickButtonByText(text) {
  const btn = Array.from(document.querySelectorAll('button'))
    .find(b => b.textContent.trim() === text && !b.disabled);
  if (!btn) throw new Error(`button "${text}" not found or disabled`);
  btn.click();
  return btn;
}

/** Find submit button on current step. */
function findSubmit() {
  return document.querySelector('button[type="submit"]:not([disabled])');
}

/** Find all visible enabled submit buttons in DOM order. */
function findVisibleEnabledSubmits() {
  return Array.from(document.querySelectorAll('button[type="submit"]:not([disabled])'))
    .filter(isVisible);
}

/** Find visible uploaded-file tiles on Step 3. */
function findUploadedFiles() {
  return Array.from(document.querySelectorAll('button'))
    .filter(b => {
      const aria = (b.getAttribute('aria-label') || '').trim();
      return (
        isVisible(b) &&
        (
          aria.startsWith('Open ') ||
          aria.startsWith('View file ')
        )
      );
    });
}

/** Remove extra uploaded files until exactly one remains. */
async function normalizeUploadedFilesToOne() {
  for (let i = 0; i < 8; i++) {
    const files = findUploadedFiles();
    if (files.length <= 1) return { file_count: files.length, removed: i };
    const removeBtns = Array.from(document.querySelectorAll('button'))
      .filter(b => isVisible(b) && (b.getAttribute('aria-label') || '').trim() === 'Remove file');
    if (!removeBtns.length) {
      throw new Error(`expected Remove file button with ${files.length} uploaded files`);
    }
    removeBtns[removeBtns.length - 1].click();
    await new Promise(r => setTimeout(r, 400));
  }
  throw new Error(`failed to normalize uploaded files to one; remaining=${findUploadedFiles().length}`);
}

// ============================================================
// Blob 1: Pass through reminder screens
// ============================================================
async function haiPassThroughReminders() {
  // Two "reminder" screens before Step 1. Each has a Continue button.
  // Loop Continue clicks until a textarea appears (Step 1).
  let clicks = 0;
  for (let i = 0; i < 5; i++) {
    // Step 1 is reached when a textarea is present AND no "Continue" button visible.
    const ta = document.querySelector('textarea');
    if (ta) break;
    const cont = Array.from(document.querySelectorAll('button'))
      .find(b => b.textContent.trim() === 'Continue' && !b.disabled);
    if (!cont) {
      await new Promise(r => setTimeout(r, 300));
      continue;
    }
    cont.click();
    clicks++;
    await new Promise(r => setTimeout(r, 400));
  }
  await waitFor(() => document.querySelector('textarea'), { timeout: 30000 });
  return { step: 'task_id_ready', reminder_clicks: clicks };
}

// ============================================================
// Blob 2: Fill Step 1 (Task ID) + Step 2 (Annotation Number)
// ============================================================
async function haiFillStep1And2({ taskId, annotationN }) {
  // Step 1: single textarea on page.
  const ta1 = await waitFor(() => document.querySelector('textarea'));
  setTextarea(ta1, taskId);
  await new Promise(r => setTimeout(r, 200));
  const sub1 = await waitFor(findSubmit, { timeout: 30000 });
  sub1.click();

  // Wait for Step 2 — input[type=number] to appear.
  const numInp = await waitFor(
    () => document.querySelector('input[type="number"]'),
    { timeout: 30000 }
  );
  setInput(numInp, String(annotationN));
  await new Promise(r => setTimeout(r, 200));
  const sub2 = await waitFor(findSubmit, { timeout: 30000 });
  sub2.click();

  // Wait for Step 3 — Upload assets button to appear.
  await waitFor(
    () => Array.from(document.querySelectorAll('button'))
      .find(b => b.textContent.trim() === 'Upload assets'),
    { timeout: 30000 }
  );
  return { step: 'step3_ready' };
}

// ============================================================
// Blob 3: Fill Step 3 prompt textarea + click Submit
// (IMAGE UPLOAD is done via MCP upload_file call BEFORE this blob.)
// ============================================================
async function haiFillStep3Prompt({ prompt }) {
  // At this point, image should already be uploaded. Normalize to exactly one
  // uploaded file before typing so retries don't leave duplicate assets behind.
  await waitFor(() => findUploadedFiles().length > 0, { timeout: 30000 });
  const uploadInfo = await normalizeUploadedFilesToOne();

  // Textarea is still empty.
  const ta = await waitFor(
    () => Array.from(document.querySelectorAll('textarea'))
      .find(t => t.value === '' && t.getBoundingClientRect().height > 0)
  );
  setTextarea(ta, prompt);
  await new Promise(r => setTimeout(r, 300));

  // Important: Step 3 has its own up-arrow submit. When later steps are
  // already mounted after an edit, multiple enabled submits can exist in the
  // DOM. The prompt/image step is always the first visible enabled submit.
  const submit = await waitFor(
    () => findVisibleEnabledSubmits()[0],
    { timeout: 30000 }
  );
  submit.click();
  // Wait for Step 4 — new empty textarea appears.
  await waitFor(
    () => Array.from(document.querySelectorAll('textarea'))
      .find(t => t.value === '' && t.getBoundingClientRect().height > 0),
    { timeout: 30000 }
  );
  return { step: 'step4_ready', upload_info: uploadInfo };
}

// ============================================================
// Blob 4: Fill Step 4 answer → wait for LLM validation →
//         Step 5 role → Step 6 approve → Step 7 continue → task complete.
// Longest blob. Covers ~15–60s LLM validation wait internally.
// ============================================================
async function haiFillStep4ToComplete({ answer }) {
  // Step 4 — answer textarea.
  const ta = await waitFor(
    () => Array.from(document.querySelectorAll('textarea'))
      .find(t => t.value === '' && t.getBoundingClientRect().height > 0)
  );
  setTextarea(ta, answer);
  await new Promise(r => setTimeout(r, 300));
  const step4Submit = await waitFor(
    () => findVisibleEnabledSubmits()[0],
    { timeout: 30000 }
  );
  step4Submit.click();

  // Wait for LLM validation to complete → Reviewing button appears.
  // Budget: up to 90s.
  const reviewingBtn = await waitFor(
    () => Array.from(document.querySelectorAll('button'))
      .find(b => b.textContent.trim() === 'Reviewing' && !b.disabled),
    { timeout: 120000, interval: 500 }
  );
  reviewingBtn.click();
  await new Promise(r => setTimeout(r, 500));

  // Step 5 — Submit (enabled after role selected).
  const step5Submit = await waitFor(findSubmit, { timeout: 30000 });
  step5Submit.click();

  // Step 6 — Approve button.
  const approveBtn = await waitFor(
    () => Array.from(document.querySelectorAll('button'))
      .find(b => b.textContent.trim() === 'Approve'),
    { timeout: 30000 }
  );
  approveBtn.click();
  await new Promise(r => setTimeout(r, 300));
  // Submit may still be disabled — re-click Approve if so (known quirk).
  let step6Submit = Array.from(document.querySelectorAll('button'))
    .find(b => b.textContent.trim() === 'Submit');
  if (step6Submit && step6Submit.disabled) {
    approveBtn.click();
    await new Promise(r => setTimeout(r, 400));
  }
  step6Submit = await waitFor(
    () => Array.from(document.querySelectorAll('button'))
      .find(b => b.textContent.trim() === 'Submit' && !b.disabled),
    { timeout: 30000 }
  );
  step6Submit.click();

  // Step 7 — Continue button → Submit task.
  const contBtn = await waitFor(
    () => Array.from(document.querySelectorAll('button'))
      .find(b => b.textContent.trim() === 'Continue' && !b.disabled),
    { timeout: 30000 }
  );
  contBtn.click();
  await new Promise(r => setTimeout(r, 500));
  const submitTaskBtn = await waitFor(
    () => Array.from(document.querySelectorAll('button'))
      .find(b => b.textContent.trim() === 'Submit task' && !b.disabled),
    { timeout: 30000 }
  );
  submitTaskBtn.click();

  // Wait for "Task complete!" screen — Edit time button appears.
  await waitFor(
    () => Array.from(document.querySelectorAll('button'))
      .find(b => b.textContent.trim() === 'Edit time'),
    { timeout: 30000 }
  );
  return { step: 'task_complete', url: window.location.href };
}

// ============================================================
// Blob 5: Edit time → set {0, minutes, 0} → Save → Confirm time
// ============================================================
async function haiSetTimeAndConfirm({ minutes = 20 } = {}) {
  const editBtn = await waitFor(
    () => Array.from(document.querySelectorAll('button'))
      .find(b => b.textContent.trim() === 'Edit time')
  );
  editBtn.click();
  // Dialog opens with Hours/Minutes/Seconds inputs.
  const dialogInputs = await waitFor(() => {
    const inps = document.querySelectorAll('input[type="text"], input:not([type])');
    return inps.length >= 3 ? inps : null;
  }, { timeout: 30000 });

  // Heuristic: inputs in DOM order = Hours, Minutes, Seconds.
  // (Confirmed by wiki/hai-selectors.md step 8.)
  const [hours, mins, secs] = Array.from(dialogInputs).slice(0, 3);
  setInput(hours, '0');
  setInput(mins, String(minutes));
  setInput(secs, '0');
  await new Promise(r => setTimeout(r, 300));

  const saveBtn = await waitFor(
    () => Array.from(document.querySelectorAll('button'))
      .find(b => b.textContent.trim() === 'Save' && !b.disabled),
    { timeout: 30000 }
  );
  saveBtn.click();
  await new Promise(r => setTimeout(r, 500));

  const confirmBtn = await waitFor(
    () => Array.from(document.querySelectorAll('button'))
      .find(b => b.textContent.trim() === 'Confirm time' && !b.disabled),
    { timeout: 30000 }
  );
  confirmBtn.click();
  return { step: 'confirmed', url: window.location.href, set_minutes: minutes };
}

// ============================================================
// Usage via chrome-devtools evaluate_script
// ============================================================
// CLI pastes the full file content + invokes a single function:
//
//   evaluate_script(tabId, `
//     ${FILE_CONTENTS_OF_THIS_FILE}
//     return haiFillStep1And2({taskId: 'Plot_Foo.json', annotationN: 3});
//   `)
//
// Each call returns a small JSON-serializable object. On failure, the
// promise rejects — evaluate_script will surface the error message.
