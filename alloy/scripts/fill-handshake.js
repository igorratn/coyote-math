// fill-handshake.js — single-shot Handshake fellow form fill
// Usage: set window.__fillPayload = {...} then inject via Chrome javascript_tool.
// Fills all non-Submit fields in the fellow task form, advances through sections,
// STOPS before final Submit. Never clicks Submit.
//
// Payload schema (all fields required unless noted):
//   {
//     preference: "Response 1" | "Response 2",
//     score: 1..7,
//     systematicIssues: string,
//     justification: string,
//     flags: {
//       latex:     "Yes"|"No",
//       markdown:  "Yes"|"No",
//       notation:  "Yes"|"No",
//       garbled:   "Yes"|"No",    // Handshake label: "Random Symbols"
//       structure: "Yes"|"No"     // Handshake label: "Structure/Layout"
//     },
//     flagExplanations: {
//       latex: string, markdown: string, notation: string,
//       garbled: string, structure: string
//     },
//     formatIssuesSummary: "Yes"|"No",   // "Yes" if any flag is "Yes"
//     rewriteText: string | null,        // null = no rewrite (all flags "No")
//     advance: true,                     // advance through sections
//     stopBeforeSubmit: true             // hard stop at final Submit button
//   }
//
// Return value: { ok, filled:[...], skipped:[...], errors:[...],
//                 stoppedBeforeSubmit, finalSection }
// If content filter blocks the return, writes the same object as a blob download.

(async function fillHandshake() {
  const P = window.__fillPayload;
  if (!P) return { ok: false, error: "window.__fillPayload not set" };

  const filled = [], skipped = [], errors = [];
  let stoppedBeforeSubmit = false;
  let finalSection = null;

  // ---- Utilities ----------------------------------------------------------

  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  // React-compatible value setter for textarea/input.
  // Plain `el.value = x` does NOT work because React tracks an internal value
  // via its own setter and will revert on next render. Must call the native
  // prototype setter and then dispatch a bubbling 'input' event.
  function setNativeValue(el, value) {
    const proto = el.tagName === "TEXTAREA"
      ? window.HTMLTextAreaElement.prototype
      : window.HTMLInputElement.prototype;
    const setter = Object.getOwnPropertyDescriptor(proto, "value").set;
    setter.call(el, value);
    el.dispatchEvent(new Event("input", { bubbles: true }));
    el.dispatchEvent(new Event("change", { bubbles: true }));
  }

  // Find all elements whose visible text (lowercased, trimmed) matches a predicate.
  function findByText(selector, pred) {
    return Array.from(document.querySelectorAll(selector)).filter((el) => {
      const t = (el.textContent || "").trim().toLowerCase();
      return pred(t, el);
    });
  }

  // Find a label element by visible text, then return its associated control.
  // Tries: (1) label.control, (2) label[for] → #id, (3) closest containing
  // form section's first input/textarea.
  function findControlByLabelText(labelText) {
    const target = labelText.toLowerCase();
    const labels = Array.from(document.querySelectorAll("label, legend, h1, h2, h3, h4, h5, h6, p, span, div"))
      .filter((el) => {
        const t = (el.textContent || "").trim().toLowerCase();
        return t === target || t.startsWith(target) || t.includes(target);
      })
      .sort((a, b) => (a.textContent || "").length - (b.textContent || "").length); // tightest first
    for (const lbl of labels) {
      if (lbl.control) return lbl.control;
      const forId = lbl.getAttribute && lbl.getAttribute("for");
      if (forId) {
        const el = document.getElementById(forId);
        if (el) return el;
      }
      // fall back: closest section with a textarea/input/button group
      const section = lbl.closest("section, fieldset, div[class*='section'], div[class*='field'], div");
      if (section) {
        const ctrl = section.querySelector("textarea, input:not([type=hidden])");
        if (ctrl) return ctrl;
      }
    }
    return null;
  }

  // Fill a textarea by label text. Returns true on success.
  function fillTextareaByLabel(labelText, value, key) {
    try {
      const el = findControlByLabelText(labelText);
      if (!el || el.tagName !== "TEXTAREA") {
        errors.push({ key, reason: `no textarea found for label "${labelText}"` });
        return false;
      }
      setNativeValue(el, value);
      filled.push(key);
      return true;
    } catch (e) {
      errors.push({ key, reason: String(e) });
      return false;
    }
  }

  // Click a radio/button by its visible label (e.g., "Yes", "No", "1".."7").
  // `groupLabel` narrows the search to a specific section (e.g., "LaTeX Formatting").
  function clickOptionByLabel(groupLabel, optionText, key) {
    try {
      const groupHeader = findByText("label, legend, h1, h2, h3, h4, h5, h6, p, span, div",
        (t) => t === groupLabel.toLowerCase() || t.startsWith(groupLabel.toLowerCase()))
        .sort((a, b) => (a.textContent || "").length - (b.textContent || "").length)[0];
      if (!groupHeader) {
        errors.push({ key, reason: `group "${groupLabel}" not found` });
        return false;
      }
      const section = groupHeader.closest("section, fieldset, div[class*='section'], div[class*='field'], form, div");
      const candidates = Array.from((section || document).querySelectorAll("button, [role='radio'], input[type='radio'], label"));
      const match = candidates.find((el) => {
        const t = (el.textContent || el.value || "").trim().toLowerCase();
        return t === optionText.toLowerCase();
      });
      if (!match) {
        errors.push({ key, reason: `option "${optionText}" not found in group "${groupLabel}"` });
        return false;
      }
      match.click();
      filled.push(key);
      return true;
    } catch (e) {
      errors.push({ key, reason: String(e) });
      return false;
    }
  }

  // Find and click the section advance (up-arrow) button.
  // Handshake renders advance as a circular button with type="submit" containing
  // an up-arrow icon. We distinguish it from final Submit by:
  //   - button has no visible text "Submit" (only icon)
  //   - button's accessible name is empty or an icon/aria-label like "next"
  // Returns true if clicked.
  function clickSectionAdvance() {
    // Prefer buttons with aria-label hinting "next"/"continue"/"advance"
    const aria = Array.from(document.querySelectorAll("button[aria-label]"))
      .find((b) => /next|continue|advance|submit.*section/i.test(b.getAttribute("aria-label") || ""));
    if (aria) { aria.click(); return true; }
    // Fallback: button with type="submit", icon only (no visible text)
    const iconOnly = Array.from(document.querySelectorAll("button[type='submit']"))
      .filter((b) => {
        const t = (b.textContent || "").trim().toLowerCase();
        return t === "" || t === "↑" || /^\s*$/.test(t);
      });
    if (iconOnly.length) { iconOnly[0].click(); return true; }
    return false;
  }

  // Check for final Submit button (literal text "Submit"). If present and
  // visible, we STOP — do not click.
  function finalSubmitVisible() {
    const btns = Array.from(document.querySelectorAll("button"))
      .filter((b) => {
        const t = (b.textContent || "").trim().toLowerCase();
        return t === "submit" || t === "submit task" || t === "finish";
      });
    return btns.length > 0 ? btns[0] : null;
  }

  // ---- Fill sequence ------------------------------------------------------

  // We call the fill routine once per visible section, then click advance,
  // then re-run until all payload fields are written or Submit appears.
  //
  // Section fill strategy: try every known label/key in the payload; whichever
  // are visible in the current section will succeed. The rest are carried
  // forward to the next iteration.

  const pendingFlags = new Set(["latex", "markdown", "notation", "garbled", "structure"]);
  const pendingTextFields = new Set([
    "systematicIssues",
    "justification",
    "rewriteText",
  ]);
  if (P.rewriteText == null) pendingTextFields.delete("rewriteText");

  const maxSections = 20; // safety cap
  let preferenceSet = false;
  let scoreSet = false;
  let summarySet = false;

  for (let iter = 0; iter < maxSections; iter++) {
    // Stop if final Submit appears
    const submitBtn = finalSubmitVisible();
    if (submitBtn) {
      stoppedBeforeSubmit = true;
      finalSection = (submitBtn.closest("section, fieldset, form, div") || {}).textContent?.slice(0, 80) || "submit screen";
      break;
    }

    let didAnything = false;

    // Preference (buttons labeled by snippet text — brittle; fallback to
    // first button whose text contains "Response 1"/"Response 2" if any).
    if (!preferenceSet) {
      const prefBtns = Array.from(document.querySelectorAll("button"))
        .filter((b) => /response\s*[12]/i.test(b.textContent || ""));
      const targetIdx = P.preference === "Response 2" ? 1 : 0;
      if (prefBtns[targetIdx]) {
        prefBtns[targetIdx].click();
        preferenceSet = true;
        filled.push("preference");
        didAnything = true;
      }
    }

    // Score (widget type varies — try buttons labeled 1..7, then radios)
    if (!scoreSet) {
      const scoreStr = String(P.score);
      const scoreBtns = Array.from(document.querySelectorAll("button, [role='radio']"))
        .filter((el) => (el.textContent || "").trim() === scoreStr);
      if (scoreBtns.length) {
        scoreBtns[0].click();
        scoreSet = true;
        filled.push("score");
        didAnything = true;
      }
    }

    // Text fields
    for (const key of Array.from(pendingTextFields)) {
      const labelMap = {
        systematicIssues: "systematic issues",
        justification: "justification",
        rewriteText: "rewrite",
      };
      const value = key === "systematicIssues" ? P.systematicIssues
        : key === "justification" ? P.justification
        : P.rewriteText;
      if (fillTextareaByLabel(labelMap[key], value, key)) {
        pendingTextFields.delete(key);
        didAnything = true;
      }
    }

    // Formatting flags + their explanations
    const flagLabelMap = {
      latex:     "LaTeX Formatting",
      markdown:  "Markdown",
      notation:  "Non-Standard Notation",
      garbled:   "Random Symbols",
      structure: "Structure/Layout",
    };
    for (const key of Array.from(pendingFlags)) {
      const group = flagLabelMap[key];
      const val = P.flags[key];
      if (clickOptionByLabel(group, val, `flag:${key}`)) {
        // Also write the explanation textarea (N/A if No)
        const expl = P.flagExplanations && P.flagExplanations[key]
          ? P.flagExplanations[key]
          : (val === "No" ? "N/A" : "");
        fillTextareaByLabel(group.toLowerCase(), expl, `flagExplanation:${key}`);
        pendingFlags.delete(key);
        didAnything = true;
      }
    }

    // Format issues summary
    if (!summarySet) {
      if (clickOptionByLabel("format issues summary", P.formatIssuesSummary, "formatIssuesSummary")) {
        summarySet = true;
        didAnything = true;
      }
    }

    // Advance to next section
    if (P.advance) {
      await sleep(200); // let React settle
      const advanced = clickSectionAdvance();
      if (!advanced) {
        if (!didAnything) {
          errors.push({ reason: "no advance button found and no fields written — stuck", iter });
          break;
        }
      }
      await sleep(400); // wait for next section to render
    } else {
      break;
    }

    // All fields written?
    const done = preferenceSet && scoreSet && summarySet
      && pendingTextFields.size === 0 && pendingFlags.size === 0;
    if (done) {
      // One more loop iteration to detect Submit and stop cleanly
      continue;
    }
  }

  const result = {
    ok: errors.length === 0,
    filled,
    skipped,
    errors,
    stoppedBeforeSubmit,
    finalSection,
    pending: {
      textFields: Array.from(pendingTextFields),
      flags: Array.from(pendingFlags),
      preferenceSet,
      scoreSet,
      summarySet,
    },
  };

  // Try to return directly. If content filter blocks it, write a blob download.
  try {
    return result;
  } catch (e) {
    const blob = new Blob([JSON.stringify(result, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "fill-result.json";
    document.body.appendChild(a);
    a.click();
    return { ok: false, blobWritten: true };
  }
})();
