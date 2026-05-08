#!/usr/bin/env bash
# reclaim-shadow.sh — robust HAI shadow reclaim driver.
#
# Replaces a previously-fired shadow's prompt + answer with new values via
# HAI's /reclaim flow. Idempotent: safe to re-run if interrupted.
#
# Usage:
#   UUID=<full-uuid> STEM=<stem> [PROMPT="..." ANSWER="..."] bash scripts/reclaim-shadow.sh
#
# Defaults (intended for retroactive "Deleted Annotation" cleanup):
#   PROMPT = "Deleted Annotation"
#   ANSWER = "Deleted Annotation"
#
# Codified 2026-05-07 after the bulk-reclaim debugging session.
# Lessons learned (and now hardened against):
# - HAI's /reclaim URL sometimes redirects to /run; the script handles both.
# - HAI's pre-submit LLM validation can take >90s; uses 180s timeouts.
# - HAI sometimes returns "upstream connect error" on intermediate loads;
#   script reloads on empty body.
# - The bulk driver's "first textarea with value > 10 chars" heuristic
#   accidentally targeted task_id_field (filename was >10 chars). Fix:
#   index Edit-this-step buttons explicitly (step 0 = task_id_field,
#   step 1 = annotation_n, step 2 = prompt, step 3 = answer).
# - After editing prompt/answer via Edit-this-step, the form resets back
#   to the Reviewing role-selection step — the script handles this branch.
set -e
: "${UUID:?UUID env required (full UUID, not 8-char prefix)}"
: "${STEM:?STEM env required}"
PROMPT="${PROMPT:-Deleted Annotation}"
ANSWER="${ANSWER:-Deleted Annotation}"

TMP_DIR="$HOME/.dev-browser/tmp"
mkdir -p "$TMP_DIR"
PROMPT_NAME="reclaim-prompt-${UUID}.txt"
ANSWER_NAME="reclaim-answer-${UUID}.txt"
printf '%s' "$PROMPT" > "$TMP_DIR/$PROMPT_NAME"
printf '%s' "$ANSWER" > "$TMP_DIR/$ANSWER_NAME"

dev-browser --connect --timeout 360 <<DBSCRIPT
const FULL_UUID = "${UUID}";
const TASK_ID_FIELD = "${STEM}.json";
const PROMPT_NAME = "${PROMPT_NAME}";
const ANSWER_NAME = "${ANSWER_NAME}";
const promptText = await readFile(PROMPT_NAME);
const answerText = await readFile(ANSWER_NAME);

const page = await browser.getPage("hai-lizard-job4");

async function waitForBody() {
  // HAI sometimes returns "upstream connect error" — body is short or empty.
  // Reload up to 3 times before giving up.
  for (let attempt = 0; attempt < 3; attempt++) {
    await new Promise(r => setTimeout(r, 3000));
    const len = await page.evaluate(() => document.body?.innerText?.length || 0);
    if (len > 200) return;
    console.log("BODY_EMPTY_RELOAD attempt=" + attempt);
    await page.reload({ waitUntil: "domcontentloaded", timeout: 60000 });
  }
  throw new Error('page body never populated after 3 reloads');
}

// Try /reclaim; HAI may redirect to /run. Either is fine.
await page.goto("https://ai.joinhandshake.com/annotations/fellow/task/" + FULL_UUID + "/reclaim", { waitUntil: "domcontentloaded", timeout: 60000 });
await waitForBody();

// Click Start timer if present
const started = await page.evaluate(() => {
  const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.trim() === 'Start timer' && !b.disabled);
  if (btn) { btn.click(); return true; }
  return false;
});
if (started) await new Promise(r => setTimeout(r, 4000));

// Helper: click Edit-this-step at given index (0=task_id_field, 1=annot_n, 2=prompt, 3=answer)
async function editStep(idx) {
  await page.waitForFunction((i) => document.querySelectorAll('button[aria-label="Edit this step"]').length > i, idx, { timeout: 30000 });
  await page.evaluate((i) => {
    const btns = Array.from(document.querySelectorAll('button[aria-label="Edit this step"]'));
    btns[i].click();
  }, idx);
  await new Promise(r => setTimeout(r, 2000));
}

// Helper: fill the active step's textarea with given value.
// mode='edit'  → pick the visible textarea with EXISTING content (overwriting an old saved value)
// mode='new'   → pick the visible EMPTY textarea (filling a fresh active step)
// (Codified 2026-05-08: previous "longest value wins" heuristic picked wrong
// textarea when an empty active step coexisted with a stale-but-still-visible
// edit textarea.)
async function fillActiveTextarea(value, mode='edit') {
  await page.evaluate(({ v, mode }) => {
    const setter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value').set;
    const tas = Array.from(document.querySelectorAll('textarea')).filter(t => t.getBoundingClientRect().height > 0);
    if (!tas.length) throw new Error('no visible textarea');
    let ta;
    if (mode === 'new') {
      ta = tas.find(t => t.value === '') || tas[0];
    } else {
      // edit mode: pick textarea with greatest length
      ta = tas.reduce((a, b) => (b.value.length > (a?.value?.length || 0) ? b : a), null) || tas[0];
    }
    setter.call(ta, v);
    ta.dispatchEvent(new Event('input', { bubbles: true }));
    ta.dispatchEvent(new Event('change', { bubbles: true }));
  }, { v: value, mode });
  await new Promise(r => setTimeout(r, 800));
}

async function clickVisibleSubmit() {
  await page.evaluate(() => {
    const visible = el => { const r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0; };
    const sub = Array.from(document.querySelectorAll('button[type="submit"]:not([disabled])')).filter(visible)[0];
    if (sub) sub.click();
  });
}

async function clickByText(text) {
  await page.evaluate((t) => {
    const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.trim() === t && !b.disabled);
    if (btn) btn.click();
  }, text);
}

// Check if task_id_field is mangled (= "Deleted Annotation" or empty)
const sectionsBefore = await page.evaluate(() => Array.from(document.querySelectorAll('[data-block-turn-id]')).map(b => b.textContent.trim()));
console.log("SECTIONS_BEFORE=" + JSON.stringify(sectionsBefore.map(s => s.slice(0, 60))));

const numSteps = sectionsBefore.length;
// If task_id_field (step 0) is wrong, fix it
if (sectionsBefore[0] === PROMPT || sectionsBefore[0] === '') {
  console.log("FIXING_TASK_ID_FIELD");
  await editStep(0);
  await fillActiveTextarea(TASK_ID_FIELD);
  await clickVisibleSubmit();
  await new Promise(r => setTimeout(r, 4000));
  // After this submit, may need to restart timer
  const restarted = await page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.trim() === 'Start timer' && !b.disabled);
    if (btn) { btn.click(); return true; }
    return false;
  });
  if (restarted) await new Promise(r => setTimeout(r, 4000));
}

// Edit prompt (step 2) — only if not already PROMPT
const sectionsAfterTaskFix = await page.evaluate(() => Array.from(document.querySelectorAll('[data-block-turn-id]')).map(b => b.textContent.trim()));
if (sectionsAfterTaskFix.length >= 3 && sectionsAfterTaskFix[2] !== promptText) {
  console.log("EDITING_PROMPT");
  await editStep(2);
  await fillActiveTextarea(promptText);
  await clickVisibleSubmit();
  await new Promise(r => setTimeout(r, 4000));
}

// Edit answer (step 3 if exists, otherwise the active step is the answer step)
const sectionsAfterPrompt = await page.evaluate(() => Array.from(document.querySelectorAll('[data-block-turn-id]')).map(b => b.textContent.trim()));
const hasSavedAnswer = sectionsAfterPrompt.length >= 4 && sectionsAfterPrompt[3] !== answerText;
const isActiveAnswerStep = sectionsAfterPrompt.length === 3; // prompt was last saved; answer is current active step
if (hasSavedAnswer) {
  console.log("EDITING_SAVED_ANSWER");
  await editStep(3);
  await fillActiveTextarea(answerText);
  await clickVisibleSubmit();
} else if (isActiveAnswerStep) {
  console.log("FILLING_NEW_ANSWER");
  await fillActiveTextarea(answerText, 'new');
  await clickVisibleSubmit();
}

// Wait for next stable state — Reviewing | Submit task | Continue | Retry — generous timeout
await page.waitForFunction(() => Array.from(document.querySelectorAll('button')).find(b => /^(Reviewing|Submit task|Continue|Retry)\$/.test(b.textContent.trim()) && !b.disabled), null, { timeout: 240000 });

// Handle Retry if HAI's pre-submit LLM hiccupped
let isRetry = await page.evaluate(() => !!Array.from(document.querySelectorAll('button')).find(b => b.textContent.trim() === 'Retry' && !b.disabled));
if (isRetry) {
  console.log("LLM_RETRY");
  await clickByText('Retry');
  await page.waitForFunction(() => Array.from(document.querySelectorAll('button')).find(b => /^(Reviewing|Submit task|Continue)\$/.test(b.textContent.trim()) && !b.disabled), null, { timeout: 120000 });
}

// Role select if needed (form went back to Reviewing)
const needsRoleSelect = await page.evaluate(() => !!Array.from(document.querySelectorAll('button')).find(b => b.textContent.trim() === 'Reviewing' && !b.disabled));
if (needsRoleSelect) {
  console.log("ROLE_SELECT");
  await clickByText('Reviewing');
  await new Promise(r => setTimeout(r, 1200));
  await page.waitForFunction(() => !!document.querySelector('button[type="submit"]:not([disabled])'), null, { timeout: 30000 });
  await clickVisibleSubmit();
  await page.waitForFunction(() => Array.from(document.querySelectorAll('button')).find(b => /^(Approve|Reject)\$/.test(b.textContent.trim())), null, { timeout: 60000 });
  await clickByText('Reject');
  await new Promise(r => setTimeout(r, 1000));
  await clickVisibleSubmit();
  await page.waitForFunction(() => Array.from(document.querySelectorAll('button')).find(b => /^(Continue|Submit task|Retry)\$/.test(b.textContent.trim()) && !b.disabled), null, { timeout: 240000 });
}

// Re-check Retry after role+rating
isRetry = await page.evaluate(() => !!Array.from(document.querySelectorAll('button')).find(b => b.textContent.trim() === 'Retry' && !b.disabled));
if (isRetry) {
  await clickByText('Retry');
  await page.waitForFunction(() => Array.from(document.querySelectorAll('button')).find(b => /^(Continue|Submit task)\$/.test(b.textContent.trim()) && !b.disabled), null, { timeout: 120000 });
}

// Continue → Submit task → Confirm time (no time edit per Igor's reclaim policy)
const hasContinue = await page.evaluate(() => !!Array.from(document.querySelectorAll('button')).find(b => b.textContent.trim() === 'Continue' && !b.disabled));
if (hasContinue) {
  await clickByText('Continue');
  await new Promise(r => setTimeout(r, 1200));
}
await page.waitForFunction(() => Array.from(document.querySelectorAll('button')).find(b => b.textContent.trim() === 'Submit task' && !b.disabled), null, { timeout: 30000 });
await clickByText('Submit task');
await page.waitForFunction(() => Array.from(document.querySelectorAll('button')).find(b => b.textContent.trim() === 'Confirm time' && !b.disabled), null, { timeout: 30000 });
await clickByText('Confirm time');
await page.waitForFunction(() => Array.from(document.querySelectorAll('button')).find(b => /^(Next task|Go home)\$/.test(b.textContent.trim()) && !b.disabled), null, { timeout: 30000 });
console.log("RECLAIM_DONE uuid=" + FULL_UUID);
DBSCRIPT
