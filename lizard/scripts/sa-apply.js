// sa-apply.js — SuperAnnotate per-annotation apply helpers.
//
// Pattern mirrors scripts/fill-hai-shadow.js: each exported function is a
// self-contained blob the CLI/agent invokes via `mcp__chrome-devtools__evaluate_script`.
// Replaces ~25-30 round-trips per stem with ~4-6.
//
// Call sequence per stem (Job 4 actor):
//   1. saContext()                              → {iframe_ok, annot_count, qc_textareas}
//   2. saApplyAnnots({annots})                  → {writes:[...], errors:[...]}
//   3. saPreSaveAudit({annots})                 → {mismatches:[...]} (must be empty before Save)
//   4. saSave()                                 → {saved: true|false, toast: "..."}
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
  // Angular ignores native-setter+change; cb.click() toggles and triggers
  // all framework handlers. Only click if state needs to change.
  if (cb.checked !== checked) cb.click();
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
        if (a.qtype === 'MCQ' && mcqCb) { setCheckboxNative(mcqCb, true); annotResult.ops.push('+MCQ(qtype-fix)'); }
        else if (a.qtype === 'Short answer question' && saqCb) { setCheckboxNative(saqCb, true); annotResult.ops.push('+SAQ(qtype-fix)'); }
        else { errors.push(`A${a.n}: qtype empty (neither MCQ nor SAQ checked) and payload qtype unhelpful: ${a.qtype}`); }
      } else if (mcqOn && saqOn) {
        errors.push(`A${a.n}: both MCQ and SAQ checked — manual fix required`);
      }
    }

    // c) Rewrite Answer (if non-null) — only on approve.
    if (isApprove && a.answer_final !== null && a.answer_final !== undefined) {
      try {
        // Annot root contains both Rewrite Answer (top) and QC (mid) sections.
        // Find by walking up further from QC container.
        const qcContainer = findQcSectionContainer(doc, idx);
        let annotRoot = qcContainer.parentElement;
        for (let depth = 0; depth < 4 && annotRoot; depth++) {
          const tas = Array.from(annotRoot.querySelectorAll('textarea'));
          if (tas.length >= 2) { // expect ≥2 (Rewrite Answer + QC feedback)
            const rewriteTa = tas[0]; // top of annot panel = Rewrite Answer
            setTextareaNative(rewriteTa, String(a.answer_final));
            annotResult.ops.push(`answer="${String(a.answer_final).slice(0, 40)}"`);
            break;
          }
          annotRoot = annotRoot.parentElement;
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
// 3. saPreSaveAudit — readback every annot's QC textarea, compare to payload.
// ============================================================
//
// Args: {annots: [{n, feedback}, ...]}  (only need n + feedback)
// Returns: {mismatches: [{n, expected, got}], ok}
//
// MUST run before clicking Save. SA tasks lock on submit; post-save correction
// impossible.
function saPreSaveAudit({ annots }) {
  const doc = getSaIframeDoc();
  const mismatches = [];
  for (const a of annots) {
    if (!a.feedback) continue;
    const idx = a.n - 1;
    try {
      const ta = getQcTextarea(doc, idx);
      const got = ta.value || '';
      if (!got.includes(a.feedback)) {
        mismatches.push({ n: a.n, expected: a.feedback.slice(0, 80), got: got.slice(-200) });
      }
    } catch (e) {
      mismatches.push({ n: a.n, error: e.message });
    }
  }
  return { mismatches, ok: mismatches.length === 0 };
}

// ============================================================
// 4. saSave — click task-level Save, wait for toast.
// ============================================================
//
// Returns: {saved, toast, error?}
async function saSave() {
  const doc = getSaIframeDoc();
  // Task-level Save lives in the editor's top toolbar (NOT inside any annot).
  // Selector: button containing exact text "Save" that's enabled.
  const saveBtn = Array.from(doc.querySelectorAll('button'))
    .find(b => b.textContent.trim() === 'Save' && !b.disabled);
  if (!saveBtn) return { saved: false, error: 'Save button not found or disabled' };
  saveBtn.click();
  // Wait for save toast (look for "saved" / "success" notification within 10s).
  const start = Date.now();
  while (Date.now() - start < 10000) {
    const toasts = Array.from(doc.querySelectorAll('[class*="toast"], [class*="notification"], [class*="snack"]'))
      .map(el => el.textContent.trim())
      .filter(Boolean);
    const success = toasts.find(t => /sav(ed|ing)|success/i.test(t));
    if (success) return { saved: true, toast: success };
    await new Promise(r => setTimeout(r, 200));
  }
  return { saved: false, error: 'Save toast not detected within 10s' };
}
