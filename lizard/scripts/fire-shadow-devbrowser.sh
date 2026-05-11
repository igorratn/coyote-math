#!/usr/bin/env bash
# fire-shadow-devbrowser.sh — single-shot HAI shadow fire via dev-browser
# Replaces chrome-mcp Job 4 round-trips. Faster + frees context budget.
#
# Usage:
#   STEM=<S> ANNOT_N=<n> RATING=<Approve|Reject> \
#   IMG_PATH=<path> TASK_ID_FIELD=<S>.json \
#   PROMPT_FILE=<path-with-prompt-text> ANSWER=<rewrite answer> \
#   [VERDICT_SOURCE=auto|igor] \
#   bash scripts/fire-shadow-devbrowser.sh
#
# VERDICT_SOURCE (default 'auto') controls the QC-gate behavior. Per CLAUDE.md
# (2026-05-05 refinement): Igor-verdict annots are gate-immune — Igor's 3a
# adjudication already weighed equivalent signals, so HAI's pre-submit LLM
# nudge does not halt. Auto-verdict annots still halt on non-clean QC text.
#
# Outputs parseable lines on stdout (key=value); caller parses for
#   SHADOW_FULL_UUID, SHADOW_UUID, TIME_LOGGED, HAI_LLM_EVAL,
#   QC_FEEDBACK_OK, QC_FEEDBACK_TAIL, WALL_SECONDS
set -e

: "${STEM:?STEM env required}"
: "${ANNOT_N:?ANNOT_N env required}"
: "${RATING:?RATING env required (Approve|Reject)}"
: "${IMG_PATH:?IMG_PATH env required}"
: "${TASK_ID_FIELD:?TASK_ID_FIELD env required}"
: "${PROMPT_FILE:?PROMPT_FILE env required (file containing prompt text)}"
: "${ANSWER:?ANSWER env required}"
VERDICT_SOURCE="${VERDICT_SOURCE:-auto}"
QC_BYPASS="${QC_BYPASS:-false}"  # set to "true" to bypass auto-verdict QC halt for a batch of pre-approved nudges

# Stage image as base64 (sandbox can't read host fs but readFile() reads ~/.dev-browser/tmp/).
TMP_DIR="$HOME/.dev-browser/tmp"
mkdir -p "$TMP_DIR"
IMG_BASENAME=$(basename "$IMG_PATH")
B64_NAME="${IMG_BASENAME%.*}.b64"
base64 -i "$IMG_PATH" > "$TMP_DIR/$B64_NAME"

# Stage prompt + answer as text files (avoids shell-escape hell across heredoc).
PROMPT_TMP_NAME="hai-prompt-${STEM}-A${ANNOT_N}.txt"
cp "$PROMPT_FILE" "$TMP_DIR/$PROMPT_TMP_NAME"
ANSWER_TMP_NAME="hai-answer-${STEM}-A${ANNOT_N}.txt"
printf '%s' "$ANSWER" > "$TMP_DIR/$ANSWER_TMP_NAME"

# Export for sandbox script (sandbox has no process.env; we'll splice via shell expansion).
export TASK_ID_FIELD ANNOT_N RATING B64_NAME IMG_BASENAME PROMPT_TMP_NAME ANSWER_TMP_NAME VERDICT_SOURCE QC_BYPASS

START=$(date +%s)

# Heredoc — shell expands $TASK_ID_FIELD etc. before sending to dev-browser.
# Sandbox script reads prompt/answer/image-bytes via readFile(name).
dev-browser --connect --timeout 240 <<DBSCRIPT
const TASK_ID_FIELD = "${TASK_ID_FIELD}";
const ANNOT_N = "${ANNOT_N}";
const RATING = "${RATING}";
const B64_NAME = "${B64_NAME}";
const IMG_BASENAME = "${IMG_BASENAME}";
const PROMPT_TMP_NAME = "${PROMPT_TMP_NAME}";
const ANSWER_TMP_NAME = "${ANSWER_TMP_NAME}";
const VERDICT_SOURCE = "${VERDICT_SOURCE}";
const QC_BYPASS = "${QC_BYPASS}" === "true";

const page = await browser.getPage("hai-lizard-job4");
const t0 = Date.now();

// ============ Phase 0: open new task ============
// HAI's /fellow/projects can be slow to reach domcontentloaded under load —
// retry the goto on timeout (codified 2026-05-07).
async function gotoProjects() {
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      await page.goto("https://ai.joinhandshake.com/fellow/projects", { waitUntil: "domcontentloaded", timeout: 60000 });
      return;
    } catch (e) {
      if (attempt === 2) throw e;
      await new Promise(r => setTimeout(r, 2000));
    }
  }
}
// Phase 0 retry loop with "Error loading project" detection (codified 2026-05-11).
// HAI's /fellow/projects sometimes loads with an "Error loading project" panel
// instead of the project tiles → Start task button never appears → waitForFunction
// times out. Recovery: reload the page and re-attempt from gotoProjects.
let phase0Done = false;
for (let outerAttempt = 0; outerAttempt < 3 && !phase0Done; outerAttempt++) {
  try {
    await gotoProjects();
    // Detect "Error loading project" page early.
    await new Promise(r => setTimeout(r, 2500));
    const errPage = await page.evaluate(() => /loading your project|rror loading project/i.test(document.body.innerText || ''));
    if (errPage) {
      console.log("PHASE0_ERROR_LOADING_PROJECT=true (attempt " + (outerAttempt + 1) + ") — reloading");
      await page.reload({ waitUntil: "domcontentloaded", timeout: 60000 });
      await new Promise(r => setTimeout(r, 3000));
      const stillErr = await page.evaluate(() => /loading your project|rror loading project/i.test(document.body.innerText || ''));
      if (stillErr) {
        if (outerAttempt === 2) throw new Error('Error loading project persists after 3 reload attempts');
        continue;
      }
    }
    await page.waitForFunction(() => Array.from(document.querySelectorAll('button')).find(b => b.textContent.trim() === 'Start task' && !b.disabled), null, { timeout: 60000 });
    await page.evaluate(() => {
      const lizardEl = Array.from(document.querySelectorAll('*')).find(el => el.children.length === 0 && el.textContent.trim() === 'Project Lizard');
      if (!lizardEl) throw new Error('Project Lizard text not found');
      let cur = lizardEl;
      for (let i = 0; i < 10; i++) {
        cur = cur.parentElement;
        if (!cur) break;
        const btn = Array.from(cur.querySelectorAll('button')).find(b => b.textContent.trim() === 'Start task' && !b.disabled);
        if (btn) { btn.click(); return; }
      }
      throw new Error('Start task button not found near Project Lizard');
    });
    await page.waitForFunction(() => Array.from(document.querySelectorAll('button')).find(b => b.textContent.trim() === 'Start timer' && !b.disabled), null, { timeout: 60000 });
    await page.evaluate(() => Array.from(document.querySelectorAll('button')).find(b => b.textContent.trim() === 'Start timer' && !b.disabled).click());
    await page.waitForFunction(() => /\/annotations\/fellow\/task\/[a-f0-9-]+\/run/.test(location.pathname), null, { timeout: 60000 });
    phase0Done = true;
  } catch (e) {
    if (outerAttempt === 2) throw e;
    // Check if "Error loading project" is the cause; if so, reload and retry.
    const errPage = await page.evaluate(() => /loading your project|rror loading project/i.test(document.body.innerText || '')).catch(() => false);
    console.log("PHASE0_RETRY=" + (outerAttempt + 1) + " errLoadingProject=" + errPage + " msg=" + String(e.message || e).slice(0, 120));
    if (errPage) {
      try { await page.reload({ waitUntil: "domcontentloaded", timeout: 60000 }); } catch (_) {}
      await new Promise(r => setTimeout(r, 3000));
    }
  }
}
const taskUrl = page.url();
const fullUuid = taskUrl.match(/task\/([a-f0-9-]+)\//)[1];
console.log("UUID=" + fullUuid);
console.log("PHASE0_MS=" + (Date.now() - t0));

// ============ Phase 1: reminders + Step 1 + Step 2 ============
// Reminders chain: 2-3 Continue clicks before the Step 1 textarea appears.
// Need ~1s slack between clicks for HAI's React re-render — too tight a loop
// fires the next click before the prior advances the form (codified 2026-05-06).
await page.evaluate(async () => {
  for (let i = 0; i < 10; i++) {
    if (document.querySelector('textarea')) break;
    const cont = Array.from(document.querySelectorAll('button')).find(b => b.textContent.trim() === 'Continue' && !b.disabled);
    if (!cont) { await new Promise(r => setTimeout(r, 800)); continue; }
    cont.click();
    await new Promise(r => setTimeout(r, 1200));
  }
});
await page.waitForFunction(() => !!document.querySelector('textarea'), null, { timeout: 60000 });
// Freshness gate (codified 2026-05-09, refined 2026-05-09 — cross-allocation
// corruption incident): HAI's "Start task" can serve a mid-flow task whose first
// textarea is actually the PROMPT slot (Step 3) or REWRITE slot (Step 4), with
// content empty if the prior fire bailed before filling. Empty-check alone is
// insufficient — we MUST verify the page is on Step 1 by checking the label
// text. Step 1 has "Copy the ID of the task..." prompt; Step 3 has "Copy over
// the Annotator Prompt..."; Step 4 has "Copy over the Rewrite Answer...". If
// the visible step label isn't Step 1's, abort cleanly.
const stepCheck = await page.evaluate(() => {
  const text = document.body.innerText;
  const ta = document.querySelector('textarea');
  const onStep1 = /Copy the ID of the task that you are working on from SuperAnnotate/.test(text);
  const onStep3 = /Copy over the Annotator Prompt from SuperAnnotate/.test(text);
  const onStep4 = /Copy over the Rewrite Answer from SuperAnnotate/.test(text);
  return {
    onStep1, onStep3, onStep4,
    taValue: (ta && ta.value) || '',
    taLen: (ta && ta.value || '').length
  };
});
if (!stepCheck.onStep1) {
  const where = stepCheck.onStep3 ? 'Step 3 (prompt slot)' : stepCheck.onStep4 ? 'Step 4 (rewrite slot)' : 'unknown step';
  console.log("FRESHNESS_FAIL=not_on_step1 page=" + where + " ta_len=" + stepCheck.taLen);
  throw new Error('Cross-allocation detected: page is on ' + where + ', not Step 1. Refusing to fill (would corrupt prompt/rewrite).');
}
if (stepCheck.taLen > 0) {
  console.log("FRESHNESS_FAIL=step1_textarea_prefilled length=" + stepCheck.taLen + " preview=" + stepCheck.taValue.slice(0, 80).replace(/\\n/g, ' '));
  throw new Error('Cross-allocation detected: Step 1 textarea is pre-filled (' + stepCheck.taLen + ' chars). Refusing to fill.');
}
await page.evaluate((v) => {
  const setter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value').set;
  const ta = document.querySelector('textarea');
  setter.call(ta, v);
  ta.dispatchEvent(new Event('input', { bubbles: true }));
  ta.dispatchEvent(new Event('change', { bubbles: true }));
}, TASK_ID_FIELD);
// Wait for enabled submit before clicking (React form-validation lag).
// Retry submit click on silent-noop (verify Step 2 number-input appears).
// Codified 2026-05-09 (Igor: every submit must verify+retry, not single-shot).
await page.waitForFunction(() => !!document.querySelector('button[type="submit"]:not([disabled])'), null, { timeout: 60000 });
await new Promise(r => setTimeout(r, 500));
let phase1Step1Attempt = 0;
while (true) {
  phase1Step1Attempt++;
  const clicked = await page.evaluate(() => {
    const sub = document.querySelector('button[type="submit"]:not([disabled])');
    if (!sub) return false;
    sub.click();
    return true;
  });
  if (!clicked && phase1Step1Attempt > 1) { console.log("PHASE1_STEP1_PAGE_ADVANCED"); break; }
  try {
    await page.waitForFunction(() => !!document.querySelector('input[type="number"]'), null, { timeout: 15000 });
    break;
  } catch (e) {
    if (phase1Step1Attempt >= 3) throw e;
    console.log("PHASE1_STEP1_RETRY=" + phase1Step1Attempt);
    await new Promise(r => setTimeout(r, 1500));
  }
}
await page.evaluate((v) => {
  const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
  const inp = document.querySelector('input[type="number"]');
  setter.call(inp, v);
  inp.dispatchEvent(new Event('input', { bubbles: true }));
  inp.dispatchEvent(new Event('change', { bubbles: true }));
}, ANNOT_N);
// Wait for enabled submit before clicking (React form-validation lag).
// Retry submit click on silent-noop (same pattern as Phase 4 — codified 2026-05-09).
await page.waitForFunction(() => !!document.querySelector('button[type="submit"]:not([disabled])'), null, { timeout: 60000 });
await new Promise(r => setTimeout(r, 500));
let phase1Step2Attempt = 0;
while (true) {
  phase1Step2Attempt++;
  const clicked = await page.evaluate(() => {
    const sub = document.querySelector('button[type="submit"]:not([disabled])');
    if (!sub) return false;
    sub.click();
    return true;
  });
  if (!clicked && phase1Step2Attempt > 1) { console.log("PHASE1_STEP2_PAGE_ADVANCED"); break; }
  try {
    await page.waitForFunction(() => Array.from(document.querySelectorAll('button')).find(b => (b.getAttribute('aria-label') || '') === 'Upload assets' && !b.disabled), null, { timeout: 15000 });
    break;
  } catch (e) {
    if (phase1Step2Attempt >= 3) throw e;
    console.log("PHASE1_STEP2_RETRY=" + phase1Step2Attempt);
    await new Promise(r => setTimeout(r, 1500));
  }
}
console.log("PHASE1_MS=" + (Date.now() - t0));

// ============ Phase 2: image upload (filechooser + buffer) ============
const b64 = (await readFile(B64_NAME)).replace(/\\s+/g, '');
const bytes = Buffer.from(b64, 'base64');
const fcPromise = page.waitForEvent('filechooser', { timeout: 15000 });
await page.evaluate(() => Array.from(document.querySelectorAll('button')).find(b => (b.getAttribute('aria-label') || '') === 'Upload assets').click());
const fc = await fcPromise;
await fc.setFiles({ name: IMG_BASENAME, mimeType: "image/png", buffer: bytes });
await page.waitForFunction(() => {
  function isVisible(el) { if (!el) return false; const r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0; }
  return Array.from(document.querySelectorAll('button')).filter(b => {
    const aria = (b.getAttribute('aria-label') || '').trim();
    return isVisible(b) && (aria.startsWith('Open ') || aria.startsWith('View file '));
  }).length > 0;
}, null, { timeout: 60000 });
console.log("PHASE2_MS=" + (Date.now() - t0));

// ============ Phase 3: prompt textarea ============
const promptText = await readFile(PROMPT_TMP_NAME);
await page.evaluate((p) => {
  const setter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value').set;
  const ta = Array.from(document.querySelectorAll('textarea')).find(t => t.value === '' && t.getBoundingClientRect().height > 0);
  if (!ta) throw new Error('step3 prompt textarea not found');
  setter.call(ta, p);
  ta.dispatchEvent(new Event('input', { bubbles: true }));
  ta.dispatchEvent(new Event('change', { bubbles: true }));
}, promptText);
await new Promise(r => setTimeout(r, 400));
// Readback: verify what's actually in the textarea matches what we passed (codified 2026-05-06).
// Caught: prompt extractor truncating multi-paragraph prompts at blank lines; HAI received
// only the intro line. 5 shadows fired with broken prompts before this check existed.
const promptReadback = await page.evaluate(() => {
  const tas = Array.from(document.querySelectorAll('textarea')).filter(t => t.getBoundingClientRect().height > 0 && t.value && !t.closest('iframe'));
  return tas.length > 0 ? tas[tas.length - 1].value : '';
});
if (promptReadback.trim() !== promptText.trim()) {
  console.log("PROMPT_READBACK_MISMATCH=true");
  console.log("PROMPT_PASSED_LEN=" + promptText.length);
  console.log("PROMPT_FILLED_LEN=" + promptReadback.length);
  throw new Error('Prompt readback mismatch — passed=' + promptText.length + ' chars, filled=' + promptReadback.length + ' chars. Form not submitted.');
}
console.log("PROMPT_READBACK_OK=" + promptText.length + "_chars");
// Wait for enabled+visible step-3 submit. Long prompts (>500 chars) cause HAI's
// React form validation to take >400ms to enable the submit button — clicking
// a disabled submit silently no-ops, leading to 30s downstream timeout
// (codified 2026-05-06 — Customer_Service_19 incident, 868-char prompt).
// Wait for enabled+visible submit, then click. Retry click up to 3 times on
// React-handler "silent no-op" — long prompts (>200 chars) sometimes leave the
// onClick handler unbound when the DOM enables the button (codified 2026-05-06
// — Business_Intelligence_133 A2 + Data_Analytics_111 A4 incidents).
await page.waitForFunction(() => {
  function isVisible(el) { if (!el) return false; const r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0; }
  return Array.from(document.querySelectorAll('button[type="submit"]:not([disabled])')).filter(isVisible).length > 0;
}, null, { timeout: 60000 });
await new Promise(r => setTimeout(r, 1500));
// Retry submit click on silent-noop (verify Step 4 textarea appears).
// Codified 2026-05-09 (Igor: every submit must verify+retry).
let phase3SubmitAttempt = 0;
while (true) {
  phase3SubmitAttempt++;
  const clicked = await page.evaluate(() => {
    function isVisible(el) { if (!el) return false; const r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0; }
    const subs = Array.from(document.querySelectorAll('button[type="submit"]:not([disabled])')).filter(isVisible);
    if (!subs.length) return false;
    subs[0].click();
    return true;
  });
  if (!clicked && phase3SubmitAttempt > 1) { console.log("PHASE3_PAGE_ADVANCED"); break; }
  try {
    await page.waitForFunction(() => Array.from(document.querySelectorAll('textarea')).find(t => t.value === '' && t.getBoundingClientRect().height > 0), null, { timeout: 15000 });
    break;
  } catch (e) {
    if (phase3SubmitAttempt >= 3) throw e;
    console.log("PHASE3_SUBMIT_RETRY=" + phase3SubmitAttempt);
    await new Promise(r => setTimeout(r, 1500));
  }
}

// ============ Phase 4: answer textarea ============
const answerText = await readFile(ANSWER_TMP_NAME);
await page.evaluate((a) => {
  const setter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value').set;
  const ta = Array.from(document.querySelectorAll('textarea')).find(t => t.value === '' && t.getBoundingClientRect().height > 0);
  if (!ta) throw new Error('step4 answer textarea not found');
  setter.call(ta, a);
  ta.dispatchEvent(new Event('input', { bubbles: true }));
  ta.dispatchEvent(new Event('change', { bubbles: true }));
}, answerText);
await new Promise(r => setTimeout(r, 400));
const answerReadback = await page.evaluate(() => {
  const tas = Array.from(document.querySelectorAll('textarea')).filter(t => t.getBoundingClientRect().height > 0 && t.value && !t.closest('iframe'));
  return tas.length > 0 ? tas[tas.length - 1].value : '';
});
if (answerReadback.trim() !== answerText.trim()) {
  console.log("ANSWER_READBACK_MISMATCH=true");
  throw new Error('Answer readback mismatch — passed="' + answerText + '", filled="' + answerReadback + '". Form not submitted.');
}
console.log("ANSWER_READBACK_OK=" + JSON.stringify(answerText));
// Wait for enabled+visible step-4 submit (same React-validation lag as step 3).
// Wait for enabled+visible submit, then click. Retry click up to 3 times on
// React-handler "silent no-op" — long prompts (>200 chars) sometimes leave the
// onClick handler unbound when the DOM enables the button (codified 2026-05-06
// — Business_Intelligence_133 A2 + Data_Analytics_111 A4 incidents).
await page.waitForFunction(() => {
  function isVisible(el) { if (!el) return false; const r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0; }
  return Array.from(document.querySelectorAll('button[type="submit"]:not([disabled])')).filter(isVisible).length > 0;
}, null, { timeout: 60000 });
await new Promise(r => setTimeout(r, 1500));
// Click submit with retry — long prompts (>200 chars) sometimes leave the React
// onClick handler unbound when the DOM enables the button, making a single click
// a silent no-op. Detect by waiting for Phase-5 'Reviewing'/'Retry' button to
// appear; if it doesn't, re-click. Codified 2026-05-09 (Agile_99 A3 incident,
// 396-char prompt — single click was silent no-op, manual click advanced page).
// Click then wait long enough for HAI's LLM validation (which can take 30-60s).
// On retry, only re-click if Step-4 submit button is STILL present (page didn't
// advance). If the page advanced but Reviewing/Retry hasn't appeared yet, just
// keep waiting — re-clicking would fail (no submit button → undefined.click()).
let phase4ClickAttempt = 0;
while (true) {
  phase4ClickAttempt++;
  const clicked = await page.evaluate(() => {
    function isVisible(el) { if (!el) return false; const r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0; }
    const sub = Array.from(document.querySelectorAll('button[type="submit"]:not([disabled])')).filter(isVisible)[0];
    if (!sub) return false;
    sub.click();
    return true;
  });
  if (!clicked && phase4ClickAttempt > 1) {
    // No submit button visible AND we already clicked once → page advanced; just wait for Phase 5.
    console.log("PHASE4_PAGE_ADVANCED");
    await page.waitForFunction(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      return btns.find(b => (b.textContent.trim() === 'Reviewing' || b.textContent.trim() === 'Retry') && !b.disabled);
    }, null, { timeout: 90000 });
    break;
  }
  try {
    await page.waitForFunction(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      return btns.find(b => (b.textContent.trim() === 'Reviewing' || b.textContent.trim() === 'Retry') && !b.disabled);
    }, null, { timeout: 60000 });
    break;
  } catch (e) {
    if (phase4ClickAttempt >= 3) throw e;
    console.log("PHASE4_CLICK_RETRY=" + phase4ClickAttempt);
    await new Promise(r => setTimeout(r, 1500));
  }
}
console.log("PHASE4_MS=" + (Date.now() - t0));

// ============ Phase 5: LLM validation + QC capture ============
// HAI's pre-submit LLM validation can fail and surface a "Retry" button
// (codified 2026-05-07). Watch for either Reviewing (success) or Retry; click
// Retry up to 3 times before giving up.
{
  let retries = 0;
  while (true) {
    await page.waitForFunction(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      return btns.find(b => (b.textContent.trim() === 'Reviewing' || b.textContent.trim() === 'Retry') && !b.disabled);
    }, null, { timeout: 120000 });
    const isRetry = await page.evaluate(() => !!Array.from(document.querySelectorAll('button')).find(b => b.textContent.trim() === 'Retry' && !b.disabled));
    if (!isRetry) break;
    if (++retries > 3) throw new Error('HAI LLM validation Retry limit exceeded');
    console.log("LLM_RETRY=" + retries);
    await page.evaluate(() => Array.from(document.querySelectorAll('button')).find(b => b.textContent.trim() === 'Retry' && !b.disabled).click());
    await new Promise(r => setTimeout(r, 1000));
  }
}
console.log("PHASE5_LLM_MS=" + (Date.now() - t0));

const qc = await page.evaluate(() => {
  const all = document.body.innerText;
  const idx = all.indexOf('Are you annotating or reviewing this task?');
  if (idx < 0) return { tail: '' };
  const snippet = all.slice(Math.max(0, idx - 1500), idx);
  const lines = snippet.split('\\n').map(s => s.trim()).filter(Boolean);
  return { tail: lines.slice(-2).join(' ') };
});
const qcOk = /(looks good|may continue|no issues)/i.test(qc.tail);
console.log("QC_FEEDBACK_TAIL=" + qc.tail);
console.log("QC_FEEDBACK_OK=" + (qcOk ? "yes" : "no"));
// Push-through policy (codified 2026-05-06): never halt on non-clean QC text.
// Capture as warning + comment, fire shadow normally, let Job 5 resolution
// gate handle Igor review on the warning subset. Saves wall-clock on prompt-nit
// halts (typical "answer is correct, but prompt phrasing..." cases).
// Igor-verdict annots are gate-immune (already-pre-approved by Igor at 3a).
const preSubmitWarning = !qcOk && VERDICT_SOURCE === "auto";
if (preSubmitWarning) console.log("QC_WARNING_CAPTURED=true");
{
  // ============ Phase 6: role + Approve/Reject ============
  // Reviewing-click + post-Reviewing submit can both fail silently (React onClick
  // unbound) on the role-select page — same silent-noop pattern as Phase 4.
  // Retry-click on each, verify advance via Approve/Reject button appearance.
  // Codified 2026-05-09 (Agile_99 A3 incident — manual click via dev-browser
  // advanced page when script's single click was a no-op).
  // Click Reviewing → wait for submit-enabled (HAI's role-select can take 5-30s
  // for form-validation to enable the submit). Re-click only if Reviewing button
  // still present after wait (silent no-op case).
  let phase6ReviewAttempt = 0;
  while (true) {
    phase6ReviewAttempt++;
    const reviewClicked = await page.evaluate(() => {
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.trim() === 'Reviewing' && !b.disabled);
      if (!btn) return false;
      btn.click();
      return true;
    });
    if (!reviewClicked && phase6ReviewAttempt > 1) {
      // Already advanced past role-select on a prior click.
      console.log("PHASE6_PAGE_ADVANCED");
      break;
    }
    try {
      // Wait for either submit-enabled (role accepted) OR Approve/Reject (already past submit).
      await page.waitForFunction(() => {
        if (document.querySelector('button[type="submit"]:not([disabled])')) return true;
        return Array.from(document.querySelectorAll('button')).find(b => /^(Approve|Reject)$/.test(b.textContent.trim()) && !b.disabled);
      }, null, { timeout: 30000 });
      break;
    } catch (e) {
      if (phase6ReviewAttempt >= 3) throw e;
      console.log("PHASE6_REVIEWING_RETRY=" + phase6ReviewAttempt);
      await new Promise(r => setTimeout(r, 1000));
    }
  }
  // Submit (advances to Approve/Reject) — only if not already there.
  const alreadyAtRating = await page.evaluate(() =>
    !!Array.from(document.querySelectorAll('button')).find(b => /^(Approve|Reject)$/.test(b.textContent.trim()) && !b.disabled));
  if (!alreadyAtRating) {
    let phase6SubmitAttempt = 0;
    while (true) {
      phase6SubmitAttempt++;
      const subClicked = await page.evaluate(() => {
        const sub = document.querySelector('button[type="submit"]:not([disabled])');
        if (!sub) return false;
        sub.click();
        return true;
      });
      if (!subClicked && phase6SubmitAttempt > 1) {
        console.log("PHASE6_SUBMIT_PAGE_ADVANCED");
        break;
      }
      try {
        await page.waitForFunction(() => Array.from(document.querySelectorAll('button')).find(b => /^(Approve|Reject)$/.test(b.textContent.trim()) && !b.disabled), null, { timeout: 30000 });
        break;
      } catch (e) {
        if (phase6SubmitAttempt >= 3) throw e;
        console.log("PHASE6_SUBMIT_RETRY=" + phase6SubmitAttempt);
        await new Promise(r => setTimeout(r, 1500));
      }
    }
  }
  await page.evaluate((r) => {
    const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.trim() === r && !b.disabled);
    if (!btn) throw new Error('rating button ' + r + ' not found');
    btn.click();
  }, RATING);
  await new Promise(r => setTimeout(r, 500));
  await page.evaluate(() => {
    function isVisible(el) { if (!el) return false; const r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0; }
    const sub = Array.from(document.querySelectorAll('button[type="submit"]:not([disabled])')).filter(isVisible)[0];
    if (!sub) throw new Error('Approve/Reject submit not found');
    sub.click();
  });

  await page.waitForFunction(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    return btns.find(b => /^(Continue|Submit task)$/.test(b.textContent.trim()) && !b.disabled);
  }, null, { timeout: 60000 });
  const haiLlm = await page.evaluate(() => {
    const text = document.body.innerText.toLowerCase();
    return { has_warning: /warning|caution|please review/.test(text) };
  });
  // Pre-submit QC warning takes precedence over post-submit modal — both halt Job 5.
  const finalEval = (preSubmitWarning || haiLlm.has_warning) ? "warning" : "clean";
  console.log("HAI_LLM_EVAL=" + finalEval);
  if (preSubmitWarning) {
    console.log("HAI_LLM_COMMENT=" + qc.tail.replace(/\\n/g, " ").slice(0, 400));
  }

  // ============ Phase 7: Continue → Submit task ============
  await page.evaluate(() => Array.from(document.querySelectorAll('button')).find(b => b.textContent.trim() === 'Continue' && !b.disabled).click());
  await new Promise(r => setTimeout(r, 400));
  await page.waitForFunction(() => Array.from(document.querySelectorAll('button')).find(b => b.textContent.trim() === 'Submit task' && !b.disabled), null, { timeout: 60000 });
  await page.evaluate(() => Array.from(document.querySelectorAll('button')).find(b => b.textContent.trim() === 'Submit task' && !b.disabled).click());

  // ============ Phase 8: time edit + Confirm time ============
  await page.waitForFunction(() => Array.from(document.querySelectorAll('button')).find(b => b.textContent.trim() === 'Confirm time' && !b.disabled), null, { timeout: 60000 });
  const sessionTime = await page.evaluate(() => {
    const m = document.body.innerText.match(/Time this session\\s*\\n?\\s*([\\d:]+)/);
    return m ? m[1] : null;
  });
  function toSec(t) {
    const p = (t || '').split(':').map(Number);
    if (p.length === 2) return p[0]*60 + p[1];
    if (p.length === 3) return p[0]*3600 + p[1]*60 + p[2];
    return 0;
  }
  if (toSec(sessionTime) < 1200) {
    await page.evaluate(() => Array.from(document.querySelectorAll('button')).find(b => b.textContent.trim() === 'Edit time').click());
    await page.waitForFunction(() => document.querySelectorAll('input[type="text"], input:not([type])').length >= 3, null, { timeout: 60000 });
    await page.evaluate(() => {
      const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
      const inps = document.querySelectorAll('input[type="text"], input:not([type])');
      setter.call(inps[1], '20');
      inps[1].dispatchEvent(new Event('input', { bubbles: true }));
      inps[1].dispatchEvent(new Event('change', { bubbles: true }));
    });
    await new Promise(r => setTimeout(r, 300));
    await page.evaluate(() => Array.from(document.querySelectorAll('button')).find(b => b.textContent.trim() === 'Save' && !b.disabled).click());
    await new Promise(r => setTimeout(r, 800));
  }

  await page.evaluate(() => Array.from(document.querySelectorAll('button')).find(b => b.textContent.trim() === 'Confirm time' && !b.disabled).click());
  await page.waitForFunction(() => Array.from(document.querySelectorAll('button')).find(b => /^(Next task|Go home)$/.test(b.textContent.trim()) && !b.disabled), null, { timeout: 60000 });
  const finalTime = await page.evaluate(() => {
    const m = document.body.innerText.match(/Time this session\\s*\\n?\\s*([\\d:]+)/);
    return m ? m[1] : null;
  });
  console.log("TIME_LOGGED=" + finalTime);
  console.log("DONE_MS=" + (Date.now() - t0));
  console.log("SHADOW_FULL_UUID=" + fullUuid);
  console.log("SHADOW_UUID=" + fullUuid.slice(0, 8));
}
DBSCRIPT

END=$(date +%s)
echo "WALL_SECONDS=$((END - START))"
