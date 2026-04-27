// scrape-superannotate.js
// Inject via mcp__chrome-devtools__evaluate_script into the SA editor page.
// SA content lives in an iframe (src contains 'custom-llm') — script accesses
// iframe.contentDocument to reach the Angular app.
//
// Returns: {ok, task_id, n_annotations, annotations:[...], image_url, status_log_len, missing}
// Side effect: triggers download of sa-scrape-<task_id>.txt to ~/Downloads/
//
// IMAGE HANDLING: this script does NOT download the task image — it only extracts
// IMAGE_URL from the rendered <img src>. Host fetches the native CDN asset with:
//   IMG_URL=$(grep '^IMAGE_URL:' lizard/scrapes/<stem>.txt | cut -d' ' -f2-)
//   EXT=$(basename "${IMG_URL%%\?*}" | awk -F. '{print $NF}')
//   curl -fsSL -o lizard/screenshots/<stem>.$EXT "$IMG_URL"
// NEVER right-click → save-as. That path captured the editor viewport (1650×738
// with SA chrome — Annotator Question/Ontology panel visible) on Risk_40, Risk_93,
// and SaaS_106 original (Apr 17, 2026), breaking pixel inspection. See HOST_SOP.md
// "Image save rule" + wiki/workflow-lessons.md "Bad Image Capture Lesson".

() => {
  const TASK_ID = window.location.pathname.split('/').filter(Boolean).pop();

  const llmFrame = Array.from(document.querySelectorAll('iframe'))
    .find(f => f.src.includes('custom-llm'));
  if (!llmFrame) return { ok: false, error: 'custom-llm iframe not found' };

  const doc = llmFrame.contentDocument;
  if (!doc) return { ok: false, error: 'iframe contentDocument not accessible' };

  const textareas = Array.from(doc.querySelectorAll('textarea'));
  const checkboxes = Array.from(doc.querySelectorAll('input[type="checkbox"]'));

  // --- DOM layout (verified 2026-04-14) ---
  // textareas[0..1]: header/empty (skip)
  // Per annotation i (0-indexed), base = 2 + i*10:
  //   base+0  PROMPT                  (placeholder: "write your own question...")
  //   base+1  MODEL_GENERATED_ANSWER  (raw model output; e.g. "77.8%", "C")
  //   base+2  empty
  //   base+3  ANSWER                  (annotator's final correct answer; "Rewrite Answer" field)
  //   base+4  EXPLANATION             (LLM explanation text; do not emit verbatim)
  //   base+5  METRIC_LOG              (JSON array, large — do not emit as answer)
  //   base+6  LLM_JUDGE_FEEDBACK      (placeholder: "Placeholder", usually empty)
  //   base+7  QC_FEEDBACK             (placeholder: "Placeholder", may be empty)
  //   base+8  AUDIT_FEEDBACK          (placeholder: "Placeholder", usually empty)
  //   base+9  NV_AUDIT_FEEDBACK       (placeholder: "Placeholder", may be empty)
  // After n annotations (base = 2 + n*10):
  //   statusBase+0: SCORING_JSON      (schema_version, timestamp)
  //   statusBase+1: STATUS_LOG_TEXT   (human-readable status change log)
  //   statusBase+2: STATUS_LOG_JSON   (full metric/scoring JSON, large)
  //
  // NOTE: base+3 is NOT the "Explanation tab" — it is the annotator's correct answer.
  //       Explanation tab is unused in this workflow. Do not scrape it separately.

  // Skill checkboxes: 9 per annotation (7 skills + MCQ + Short answer question)
  const SKILL_NAMES = [
    'Enumeration', 'Attribute Perception', 'Spatial Reasoning',
    'Math Reasoning', 'Logical Reasoning', 'Table/Chart/Graph Understanding',
    'World Knowledge', 'MCQ', 'Short answer question'
  ];

  // Rating buttons: 5 pairs per annotation (10 buttons per annotation).
  // Section order per annotation: Work validation (j=0), LLM Judge (j=1), QC (j=2),
  //   Audit (j=3), NV Audit (j=4).
  // Active state detection: button inline style contains rgb(245, 34, 45) = disapprove,
  //   rgb(0, 205, 108) = approve. ng-reflect-color stays 'gray' even when active — ignore it.
  const allBtns = Array.from(doc.querySelectorAll('button'));
  const ratingBtns = allBtns.filter(b =>
    b.innerHTML.includes('disapprove-action') || b.innerHTML.includes('approve-action')
  );

  function getRating(dis, app) {
    const ds = dis?.getAttribute('style') || '';
    const as = app?.getAttribute('style') || '';
    if (ds.includes('rgb(245, 34, 45)')) return 'disapprove';
    if (as.includes('rgb(0, 205, 108)')) return 'approve';
    return 'unset';
  }

  const img = doc.querySelector('img');
  const image_url = img?.src || '';

  // SA_TASK_FILENAME — the human-readable SA task filename (e.g. Plot_Spectral_analysis_charts_80.json).
  // This is what HAI's "Task ID" form field expects, NOT the numeric URL TASK_ID (187109779).
  // Derivable from image URL basename: strip query string, take basename, swap ext → .json.
  let sa_task_filename = '';
  try {
    const urlNoQuery = image_url.split('?')[0];
    const basename = urlNoQuery.split('/').pop() || '';
    const stem = basename.replace(/\.[^.]+$/, '');
    if (stem) sa_task_filename = stem + '.json';
  } catch (e) { /* leave blank */ }

  const N = 5; // SA tasks always have up to 5 annotations; detect actual count
  const actualN = Math.round((textareas.length - 4) / 10); // rough count
  const n = Math.min(N, actualN > 0 ? actualN : N);

  const annotations = [];
  const lines = [];

  // Status log: dynamic index based on annotation count
  const statusBase = 2 + n * 10;
  const statusLogText = textareas[statusBase + 1]?.value || '';
  const statusLogJson = textareas[statusBase + 2]?.value || '';

  lines.push('TASK_ID: ' + TASK_ID);
  lines.push('SA_TASK_FILENAME: ' + sa_task_filename);
  lines.push('IMAGE_URL: ' + image_url);
  lines.push('N_ANNOTATIONS: ' + n);
  lines.push('STATUS_LOG_LEN: ' + statusLogJson.length);
  lines.push('STATUS_LOG_TEXT: ' + statusLogText.substring(0, 300));
  lines.push('');

  for (let i = 0; i < n; i++) {
    const base = 2 + i * 10;
    const prompt               = textareas[base]?.value     || '';
    const modelGeneratedAnswer = textareas[base + 1]?.value || '';
    const answer               = textareas[base + 3]?.value || '';
    const metricLog            = textareas[base + 5]?.value || '';
    const qcFeedback           = textareas[base + 7]?.value || '';
    const auditFeedback        = textareas[base + 8]?.value || '';
    const nvAuditFeedback      = textareas[base + 9]?.value || '';

    const checkedSkills = SKILL_NAMES.filter((_, j) => checkboxes[i * 9 + j]?.checked);
    const isMCQ = checkboxes[i * 9 + 7]?.checked;
    const qtype = isMCQ ? 'MCQ' : 'SAQ';

    const base_b = i * 10; // button base for this annotation
    // j: 0=Work, 1=LLM, 2=QC, 3=Audit, 4=NV Audit
    const sectionRatings = [];
    for (let j = 0; j < 5; j++) {
      sectionRatings.push(getRating(ratingBtns[base_b + j * 2], ratingBtns[base_b + j * 2 + 1]));
    }
    const [workRating, llmRating, qcRating, auditRating, nvAuditRating] = sectionRatings;

    const stumped = modelGeneratedAnswer !== answer && answer.length > 0;

    annotations.push({
      n: i + 1,
      prompt_len: prompt.length,
      answer_len: answer.length,
      skills: checkedSkills,
      qtype,
      qc_rating: qcRating,
      nv_audit_rating: nvAuditRating,
      stumped,
    });

    lines.push('=== ANNOTATION ' + (i + 1) + ' ===');
    lines.push('PROMPT_LEN: '             + prompt.length);
    lines.push('SKILLS: '                 + checkedSkills.join(', '));
    lines.push('QTYPE: '                  + qtype);
    lines.push('MODEL_GENERATED_ANSWER: ' + modelGeneratedAnswer);
    lines.push('ANSWER: '                 + answer);
    lines.push('ANSWER_LEN: '             + answer.length);
    lines.push('STUMPED: '                + stumped);
    lines.push('WORK_RATING: '            + workRating);
    lines.push('LLM_RATING: '             + llmRating);
    lines.push('QC_RATING: '              + qcRating);
    lines.push('AUDIT_RATING: '           + auditRating);
    lines.push('NV_AUDIT_RATING: '        + nvAuditRating);
    lines.push('');
    lines.push('--- PROMPT ---');
    lines.push(prompt);
    lines.push('');
    lines.push('--- MODEL_METRIC_LOG ---');
    lines.push(metricLog);
    lines.push('');
    lines.push('--- QC_FEEDBACK ---');
    lines.push(qcFeedback);
    lines.push('');
    lines.push('--- AUDIT_FEEDBACK ---');
    lines.push(auditFeedback);
    lines.push('');
    lines.push('--- NV_AUDIT_FEEDBACK ---');
    lines.push(nvAuditFeedback);
    lines.push('');
  }

  lines.push('=== STATUS_LOG_TEXT ===');
  lines.push(statusLogText);
  lines.push('');
  lines.push('=== STATUS_LOG_JSON ===');
  lines.push(statusLogJson);

  const content = lines.join('\n');
  const missing = annotations.filter(a => a.prompt_len < 50 || a.answer_len === 0).length;

  // ---------- Pre-download completeness check (added 2026-04-25) ----------
  // 5 of 6 Scrum cycle-2 scrapes silently shipped broken on 2026-04-23: empty
  // STATUS_LOG_TEXT or only cycle-1 events. Reviewers ran on stale prompts;
  // verdicts were invalid. Refuse the download if the scrape is broken so
  // CLI immediately knows to retry instead of poisoning downstream.
  const fail = (reason) => ({ ok: false, error: reason, task_id: TASK_ID,
    n_annotations: n, missing,
    status_log_len: (statusLogText || '').length,
    status_log_submissions: ((statusLogText || '').match(/to:\s*(Submit_to_QC|QC_Complete)/g) || []).length });

  if (n < 1) return fail('n_annotations < 1');
  if (!statusLogText || statusLogText.trim().length === 0) {
    return fail('STATUS_LOG_TEXT is empty — DOM not fully loaded? retry after page settles');
  }
  if (missing > 0) {
    return fail(`${missing} annotation(s) have prompt_len<50 or empty answer — DOM not fully loaded`);
  }

  // Trigger download (only after passing checks)
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = doc.createElement('a');
  a.href = url;
  a.download = 'sa-scrape-' + TASK_ID + '.txt';
  doc.body.appendChild(a);
  a.click();
  doc.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 5000);

  // Stump rule: MODEL_GENERATED_ANSWER != ANSWER is expected (annotator objective).
  // If they match, flag — annotator likely failed objective → probable thumbs-down downstream.
  return { ok: true, task_id: TASK_ID, sa_task_filename, n_annotations: n, image_url: image_url.substring(0, 120), annotations, missing };
}
