// sa-apply.js — SuperAnnotate per-annotation apply helpers.
//
// Pattern mirrors scripts/fill-hai-shadow.js: each exported function is a
// self-contained blob the CLI/agent invokes via `mcp__chrome-devtools__evaluate_script`.
// Replaces ~25-30 round-trips per stem with ~4-6.
//
// Call sequence per stem (Job 5 actor — SA push, terminal step post-2026-05-02 swap):
//   1. saContext()                              → {iframe_ok, annot_count, qc_textareas}
//   2. saApplyAnnots({annots})                  → {writes:[...], errors:[...]}
//   3. saPreSaveAudit({annots})                 → {mismatches:[...]} (must be empty before Save)
//   4. saSave()                                 → {saved: true} (no toast wait)
//
// Total: 4 evaluate_script calls per stem (no per-annot round-trip — saApplyAnnots
// loops over the entire annot array in-browser).
//
// ============================================================
// SA UI mechanics (ported from HOST_SOP.legacy.md §818-851)
// ============================================================
//
// Iframe: SA renders the editor inside `iframe.custom-llm`. All DOM ops happen
// inside that iframe's contentDocument. evaluate_script runs in the parent
// frame; helpers must `doc = iframe.contentDocument` first.
//
// Section order per annotation (top → bottom):
//   Rewrite Answer → Work validation → Metric Log → QC (blue) → Audit (purple)
//   → NV Audit (purple)
// **Only touch QC.** Never touch Audit / NV Audit.
//
// Skill checkbox layout: per annotation `i` (0..N-1), 9 checkboxes at
// `checkboxes[i*9 + j]` where j maps to:
//   0 = Enumeration
//   1 = Attribute Perception
//   2 = Spatial Reasoning
//   3 = Math Reasoning
//   4 = Logical Reasoning
//   5 = Table/Chart/Graph Understanding
//   6 = World Knowledge
//   7 = MCQ
//   8 = Short answer question
// QType flips share this same group (positions 7+8); they're NOT a separate field.
//
// QC button locator: by section header (label is empty). Walk up from any
// `p.title` whose textContent === "QC" to the container with
// `button[ng-reflect-svg-icon="approve-action"]`. Active rating: inline `style`
// contains `rgb(0, 205, 108)`. `ng-reflect-color` stays "gray" — ignore.
//
// QC feedback textarea: same walk-up pattern, terminating at
// `container.querySelector('textarea')`. Append-not-replace: read existing
// value, concat with newline + payload feedback, then native-setter write.
//
// React/Angular-controlled inputs require native setters + input/change events
// to actually register the change (setting .value alone is silently ignored).
//
// Status dropdown blacklist: task-level status dropdown = DO-NOT-TOUCH.
// CLI stops at Save. Igor sets status manually.

// ============================================================
// Shared helpers — included inline in each blob (self-contained).
// ============================================================

function getSaIframeDoc() {
  const iframe = document.querySelector('iframe.custom-llm') || document.querySelector('iframe[src*="custom-llm"]');
  if (!iframe) throw new Error('SA custom-llm iframe not found');
  const doc = iframe.contentDocument;
  if (!doc) throw new Error('iframe contentDocument unreachable (not loaded yet?)');
  return doc;
}

function setTextareaNative(ta, value) {
  const setter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value').set;
  setter.call(ta, value);
  ta.dispatchEvent(new Event('input', { bubbles: true }));
  ta.dispatchEvent(new Event('change', { bubbles: true }));
}

function setCheckboxNative(cb, checked) {
  // Click the LABEL parent, not the input directly. Angular's (change) handler
  // on <sn-checkbox> doesn't reliably fire from input.click() — for skills with
  // special characters in their value (e.g. "Table/Chart/Graph Understanding"
  // — the slashes appear to break ng-reflect-value), the input.click toggles
  // cb.checked but Angular's form model never updates, so Save persists the
  // pre-click state. label.click() is the accessibility-correct trigger and
  // fires the full Angular change cycle reliably.
  // Codified 2026-05-06 — Customer_Service_19 incident: +Math Reasoning + TCG
  // appeared in apply log but didn't persist; ng-reflect-checked stayed "false"
  // until ~2s after the click. Hard reload showed TCG missing.
  if (cb.checked === checked) return;
  const label = cb.parentElement;
  if (label && label.tagName === 'LABEL') label.click();
  else cb.click();  // fallback if DOM doesn't match expected wrapper
}

const SKILL_INDEX = {
  'Enumeration': 0,
  'Attribute Perception': 1,
  'Spatial Reasoning': 2,
  'Math Reasoning': 3,
  'Logical Reasoning': 4,
  'Table/Chart/Graph Understanding': 5,
  'World Knowledge': 6,
  'MCQ': 7,
  'Short answer question': 8,
};
const CHECKBOX_GROUP_SIZE = 9;

function findQcSectionContainer(doc, annotIndex) {
  // Walk up from `p.title` "QC" → annotation container. Each annot has its own
  // QC section, so we expect annotIndex-th match.
  const qcHeaders = Array.from(doc.querySelectorAll('p.title')).filter(p => p.textContent.trim() === 'QC');
  if (annotIndex >= qcHeaders.length) {
    throw new Error(`QC header[${annotIndex}] not found (only ${qcHeaders.length} present)`);
  }
  let container = qcHeaders[annotIndex].parentElement;
  for (let depth = 0; depth < 6 && container; depth++) {
    if (container.querySelector('button[ng-reflect-svg-icon="approve-action"]')) return container;
    container = container.parentElement;
  }
  throw new Error(`QC container walk-up failed for annot ${annotIndex + 1}`);
}

function getQcTextarea(doc, annotIndex) {
  const container = findQcSectionContainer(doc, annotIndex);
  const ta = container.querySelector('textarea');
  if (!ta) throw new Error(`QC feedback textarea not found for annot ${annotIndex + 1}`);
  return ta;
}

function getQcRatingButton(doc, annotIndex, kind /* 'approve' | 'reject' */) {
  const container = findQcSectionContainer(doc, annotIndex);
  // approve = approve-action; reject = disapprove-action (not reject-action)
  const icon = (kind === 'approve') ? 'approve-action' : 'disapprove-action';
  const btn = container.querySelector(`button[ng-reflect-svg-icon="${icon}"]`);
  if (!btn) throw new Error(`QC ${kind} button not found for annot ${annotIndex + 1}`);
  return btn;
}

function isRatingActive(btn) {
  const style = btn.getAttribute('style') || '';
  // approve active = green rgb(0,205,108); disapprove active = red rgb(245,34,45)
  return /rgb\(\s*0\s*,\s*205\s*,\s*108\s*\)/.test(style) || /rgb\(\s*245\s*,\s*34\s*,\s*45\s*\)/.test(style);
}

// Find the Nth textarea whose surrounding panel has a title element matching
// `label`. Walks up to 6 ancestors looking for `p.title`/`p[class*="title"]`/
// `h3`/`h4`/`label` whose textContent === label. Returns the annotIndex-th
// match (0-based) in DOM order, or null if not found.
//
// Used for label-anchored lookups (Annotator Question, Rewrite Answer, etc.)
// — robust against per-stem DOM-depth variation that broke the prior walk-up
// + tas[0] heuristic. (codified 2026-05-06 — V6 batch incident)
function findLabeledTextarea(doc, label, annotIndex) {
  // Each labeled panel may contain MULTIPLE textareas (e.g. "Annotator Question"
  // panels in V6 multi-annot Dashboard tasks contain a prompt textarea + a
  // hidden JSON metadata textarea with model_response data). We want exactly
  // one textarea per panel — the first one in DOM order, which is the actual
  // editable prompt field. Dedupe by the title element itself so multiple
  // textareas under the same title only count once.
  // Codified 2026-05-06 — Data_Analytics_4 batch incident: pre-save audit
  // returned A1's JSON metadata as A2's prompt (off-by-one shift), would have
  // overwritten 5 stems' worth of prompts on Save.
  const tas = Array.from(doc.querySelectorAll('textarea'));
  const seenTitles = new Set();
  const matches = [];
  for (const t of tas) {
    let cur = t;
    let foundTitle = null;
    for (let d = 0; d < 6 && cur; d++) {
      const titleEl = cur.parentElement?.querySelector('p.title, p[class*="title"], h3, h4, label');
      if (titleEl && titleEl.textContent.trim() === label) { foundTitle = titleEl; break; }
      cur = cur.parentElement;
    }
    if (foundTitle && !seenTitles.has(foundTitle)) {
      seenTitles.add(foundTitle);
      matches.push(t);
    }
  }
  return matches[annotIndex] ?? null;
}

// ============================================================
// 1. saContext — sanity probe before any writes.
// ============================================================
//
// Returns:
//   {iframe_ok, annot_count_qc, annot_count_skills, ok}
// Caller compares annot_count_qc === payload annot count before proceeding.
function saContext() {
  const doc = getSaIframeDoc();
  const qcCount = doc.querySelectorAll('p.title').length
    ? Array.from(doc.querySelectorAll('p.title')).filter(p => p.textContent.trim() === 'QC').length
    : 0;
  const checkboxCount = doc.querySelectorAll('input[type="checkbox"]').length;
  const annotCountSkills = checkboxCount / CHECKBOX_GROUP_SIZE;
  return {
    iframe_ok: true,
    annot_count_qc: qcCount,
    annot_count_skills: annotCountSkills,
    checkbox_total: checkboxCount,
    ok: qcCount > 0 && Number.isInteger(annotCountSkills) && annotCountSkills === qcCount,
  };
}

// ============================================================
// 2. saApplyAnnots — apply skill toggles, qtype, answer, rating, feedback.
// ============================================================
//
// Args: {annots: [{n, skills_check, skills_uncheck, qtype, answer_final, rating, feedback}, ...]}
// Returns: {writes:[per-annot results], errors:[strings]}
//
// Per annot:
//   a) Toggle skill checkboxes per skills_check / skills_uncheck deltas.
//      Idempotent: if both empty, skip the whole skill block.
//   b) Verify exactly one of MCQ / "Short answer question" is checked. If
//      neither and `qtype` arg specifies one, set it. Empty after = error.
//   c) If answer_final non-null: write into Rewrite Answer textarea.
//      (Rewrite Answer textarea = first non-QC textarea above QC section in
//      this annot's container — see findRewriteAnswerTextarea.)
//   d) Set QC rating per `rating`.
//   e) If feedback non-null: append to existing QC Feedback (newline-separated).
//
// All writes use native setters + input/change events.
function saApplyAnnots({ annots }) {
  const doc = getSaIframeDoc();
  const allCheckboxes = Array.from(doc.querySelectorAll('input[type="checkbox"]'));
  const writes = [];
  const errors = [];

  for (const a of annots) {
    const idx = a.n - 1; // 1-based n → 0-based array index
    const annotResult = { n: a.n, ops: [] };
    const isApprove = a.rating === 'thumbs-up';

    // HARD RULE (Slack Concede): on thumbs-down, do NOT edit metadata
    // (skills, qtype, answer). Only set rating + append feedback.
    // Defense in depth — payload should already have empty arrays + null
    // answer_final on thumbs-down (run-job3.mjs forces it), but enforce here too.
    if (!isApprove) {
      const skipped = [];
      if ((a.skills_check?.length ?? 0) > 0 || (a.skills_uncheck?.length ?? 0) > 0) skipped.push('skill-edits');
      if (a.answer_final != null) skipped.push('answer_final');
      if (skipped.length) annotResult.ops.push(`(skipped on 👎: ${skipped.join(', ')})`);
    }

    // a) Skill toggles — ONLY for approve (thumbs-up).
    const checkSet = new Set(isApprove ? (a.skills_check || []) : []);
    const uncheckSet = new Set(isApprove ? (a.skills_uncheck || []) : []);
    if (checkSet.size || uncheckSet.size) {
      for (const [skill, j] of Object.entries(SKILL_INDEX)) {
        const cbIdx = idx * CHECKBOX_GROUP_SIZE + j;
        const cb = allCheckboxes[cbIdx];
        if (!cb) { errors.push(`A${a.n}: checkbox[${cbIdx}] (${skill}) missing`); continue; }
        if (checkSet.has(skill) && !cb.checked) {
          setCheckboxNative(cb, true);
          annotResult.ops.push(`+${skill}`);
        } else if (uncheckSet.has(skill) && cb.checked) {
          setCheckboxNative(cb, false);
          annotResult.ops.push(`-${skill}`);
        }
      }
    }

    // b) QType gate — exactly one of positions 7 / 8 must be checked.
    // Only fix qtype on approve (thumbs-up); on 👎, don't touch annotator's qtype.
    if (isApprove) {
      const mcqCb = allCheckboxes[idx * CHECKBOX_GROUP_SIZE + 7];
      const saqCb = allCheckboxes[idx * CHECKBOX_GROUP_SIZE + 8];
      const mcqOn = mcqCb?.checked === true;
      const saqOn = saqCb?.checked === true;
      if (!mcqOn && !saqOn) {
        // Accept both "SAQ" (run-job3.mjs shorthand) and "Short answer question" (full label).
        // (codified 2026-05-05 — DevOps_86 A5 incident: payload had qtype:"SAQ", helper only checked
        // for "Short answer question", qtype-fix bailed silently and SA pushed with empty qtype.)
        const isSaq = a.qtype === 'Short answer question' || a.qtype === 'SAQ';
        const isMcq = a.qtype === 'MCQ';
        if (isMcq && mcqCb) { setCheckboxNative(mcqCb, true); annotResult.ops.push('+MCQ(qtype-fix)'); }
        else if (isSaq && saqCb) { setCheckboxNative(saqCb, true); annotResult.ops.push('+SAQ(qtype-fix)'); }
        else { errors.push(`A${a.n}: qtype empty (neither MCQ nor SAQ checked) and payload qtype unhelpful: ${a.qtype}`); }
      } else if (mcqOn && saqOn) {
        errors.push(`A${a.n}: both MCQ and SAQ checked — manual fix required`);
      }
    }

    // c) Rewrite Answer (if non-null) — only on approve.
    //
    // Find the Rewrite Answer textarea by LABEL ("Rewrite Answer" title element),
    // not by walk-up + position. The walk-up + tas[0] approach was wrong: at
    // depth 8 the parent contains 10+ textareas spanning prompt/model_answer/
    // rewrite/explanation/etc, and tas[0] is the *Annotator Question* (prompt),
    // not the Rewrite Answer. (codified 2026-05-06 — V6 batch incident: 12
    // prompts across 8 stems were overwritten with answer values; 1 unrecoverable
    // because SA task moved out of queue before restore could fire.)
    if (isApprove && a.answer_final !== null && a.answer_final !== undefined) {
      try {
        const rewriteTa = findLabeledTextarea(doc, 'Rewrite Answer', idx);
        if (!rewriteTa) {
          errors.push(`A${a.n}: Rewrite Answer textarea not found (label-anchor lookup failed for annot index ${idx})`);
        } else if ((rewriteTa.value ?? '') === String(a.answer_final)) {
          // Idempotent: skip if already matches (no spurious React events).
          annotResult.ops.push(`answer="${String(a.answer_final).slice(0, 40)}" (already)`);
        } else {
          setTextareaNative(rewriteTa, String(a.answer_final));
          annotResult.ops.push(`answer="${String(a.answer_final).slice(0, 40)}"`);
        }
      } catch (e) {
        errors.push(`A${a.n}: Rewrite Answer write failed: ${e.message}`);
      }
    }

    // d) QC rating
    if (a.rating === 'thumbs-up' || a.rating === 'thumbs-down') {
      try {
        const kind = a.rating === 'thumbs-up' ? 'approve' : 'reject';
        const btn = getQcRatingButton(doc, idx, kind);
        if (!isRatingActive(btn)) {
          btn.click();
          annotResult.ops.push(`rating=${a.rating}`);
        } else {
          annotResult.ops.push(`rating=${a.rating} (already)`);
        }
      } catch (e) {
        errors.push(`A${a.n}: rating click failed: ${e.message}`);
      }
    }

    // e) QC feedback (append-not-replace)
    if (a.feedback) {
      try {
        const ta = getQcTextarea(doc, idx);
        const existing = ta.value || '';
        // Idempotency: if existing already ends with our payload feedback,
        // skip. Catches accidental re-runs.
        if (existing.includes(a.feedback)) {
          annotResult.ops.push('feedback (already present)');
        } else {
          const sep = existing.trim() ? '\n\n' : '';
          setTextareaNative(ta, existing + sep + a.feedback);
          annotResult.ops.push(`feedback (appended ${a.feedback.length}c)`);
        }
      } catch (e) {
        errors.push(`A${a.n}: feedback append failed: ${e.message}`);
      }
    }

    writes.push(annotResult);
  }

  return { writes, errors };
}

// ============================================================
// 3. saPreSaveAudit — readback every annot's QC textarea + Annotator Question.
// ============================================================
//
// Args: {annots: [{n, feedback, hai_prompt}, ...]}
//   - feedback: payload sa.feedback. If non-null, must be present in QC textarea.
//   - hai_prompt: payload hai.prompt. ALWAYS readback the Annotator Question
//     textarea and verify it equals hai_prompt. Catches the case where a
//     write helper accidentally targeted the prompt textarea instead of the
//     intended one (codified 2026-05-06 — V6 batch incident: 12 prompts
//     overwritten with answer values; 1 unrecoverable).
// Returns: {mismatches: [{n, kind, expected, got}], ok}
//
// MUST run before clicking Save. SA tasks lock on submit; post-save correction
// impossible.
function saPreSaveAudit({ annots }) {
  const doc = getSaIframeDoc();
  const mismatches = [];
  for (const a of annots) {
    const idx = a.n - 1;
    // Required-feedback guardrail (codified 2026-05-09 — Tech_53/Travel_69 incident):
    // CLAUDE.md feedback rule: sa.feedback must be non-null whenever a field changes
    // (skills_check/uncheck, qtype, prompt, answer_final). Earlier audit only verified
    // "feedback is in textarea IF non-null" — silently allowed null feedback when
    // skills were patched, leaving SA with edits but no explanation.
    const skillEdits = (Array.isArray(a.skills_check) && a.skills_check.length > 0) ||
                        (Array.isArray(a.skills_uncheck) && a.skills_uncheck.length > 0);
    const isReject = a.rating === 'thumbs-down';
    if ((skillEdits || isReject) && (a.feedback == null || String(a.feedback).trim() === '')) {
      mismatches.push({ n: a.n, kind: 'missing_feedback',
        reason: isReject ? 'thumbs-down requires feedback' : 'skill edits require feedback',
        skills_check: a.skills_check, skills_uncheck: a.skills_uncheck });
    }
    // Feedback readback (only when payload has feedback).
    if (a.feedback) {
      try {
        const ta = getQcTextarea(doc, idx);
        const got = ta.value || '';
        if (!got.includes(a.feedback)) {
          mismatches.push({ n: a.n, kind: 'feedback', expected: a.feedback.slice(0, 80), got: got.slice(-200) });
        }
      } catch (e) {
        mismatches.push({ n: a.n, kind: 'feedback', error: e.message });
      }
    }
    // Annotator Question (prompt) readback — MANDATORY for every annot,
    // regardless of rating. The prompt must NOT have changed from what the
    // payload recorded. (codified 2026-05-06 — V6 batch incident: 12 prompts
    // overwritten with answer values; 1 unrecoverable.)
    if (a.hai_prompt == null) {
      mismatches.push({ n: a.n, kind: 'prompt', error: 'hai_prompt missing from payload — audit cannot verify' });
    } else {
      try {
        const promptTa = findLabeledTextarea(doc, 'Annotator Question', idx);
        if (!promptTa) {
          mismatches.push({ n: a.n, kind: 'prompt', error: 'Annotator Question textarea not found' });
        } else {
          const got = promptTa.value || '';
          if (got.trim() !== a.hai_prompt.trim()) {
            mismatches.push({ n: a.n, kind: 'prompt', expected_len: a.hai_prompt.length, got_len: got.length, got_head: got.slice(0, 120) });
          }
        }
      } catch (e) {
        mismatches.push({ n: a.n, kind: 'prompt', error: e.message });
      }
    }
  }
  return { mismatches, ok: mismatches.length === 0 };
}

// ============================================================
// 4. saSave — click task-level Save and return immediately.
// ============================================================
//
// SA does NOT emit a save toast (codified 2026-05-05 — Box_plot_4 incident).
// Pre-save audit at step 3 already verified state. Click and return.
// Returns: {saved, error?}
function saSave() {
  const doc = getSaIframeDoc();
  // Task-level Save lives in the editor's top toolbar (NOT inside any annot).
  const saveBtn = Array.from(doc.querySelectorAll('button'))
    .find(b => b.textContent.trim() === 'Save' && !b.disabled);
  if (!saveBtn) return { saved: false, error: 'Save button not found or disabled' };
  saveBtn.click();
  return { saved: true };
}
