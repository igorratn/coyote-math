// devbrowser-shadow-set-time.js — PILOT
//
// Purpose: port Step 6 of Job 4 shadow flow (Edit time → set N min → Save →
// Confirm time) from chrome-devtools MCP evaluate_script delivery to
// dev-browser --connect heredoc delivery.
//
// Scope: ONLY the time-confirm phase. Assumes shadow is already at the
// "Task complete!" screen (Edit time button visible). Does NOT do steps 1-5,
// does NOT upload images. Pilot measurement for full port.
//
// Invoke:
//   dev-browser --connect < scripts/devbrowser-shadow-set-time.js
//
// Prereqs on host:
//   - Chrome launched with --remote-debugging-port=9222
//   - HAI shadow task active tab at "Task complete!" screen
//   - `npm install -g dev-browser && dev-browser install` done
//
// Output: JSON on stdout. { ok, step, url, set_minutes } on success,
// { ok:false, error } on failure. Exit 0 either way; check .ok field.
//
// Env vars:
//   SHADOW_MINUTES   — minutes to set (default 20)
//   HAI_URL_NEEDLE   — substring to find HAI tab (default "ai.joinhandshake.com")

(async () => {
  const MINUTES = parseInt(globalThis.process?.env?.SHADOW_MINUTES ?? '20', 10);
  const NEEDLE = globalThis.process?.env?.HAI_URL_NEEDLE ?? 'ai.joinhandshake.com';

  try {
    // --- Step A: find the HAI tab among open pages ---
    const pages = await browser.listPages();
    let hai = null;
    let haiUrl = null;
    for (const p of pages) {
      const url = typeof p.url === 'function' ? await p.url() : p.url;
      if (url && url.includes(NEEDLE)) {
        hai = p;
        haiUrl = url;
        break;
      }
    }
    if (!hai) {
      const urls = [];
      for (const p of pages) {
        urls.push(typeof p.url === 'function' ? await p.url() : p.url);
      }
      throw new Error(
        `No tab matching "${NEEDLE}". Open tabs: ${JSON.stringify(urls)}`
      );
    }

    // --- Step B: evaluate time-set logic in page context ---
    // Mirrors haiSetTimeAndConfirm from fill-hai-shadow.js exactly.
    const result = await hai.evaluate(async (minutes) => {
      function waitFor(selectorFn, { timeout = 30000, interval = 150 } = {}) {
        return new Promise((resolve, reject) => {
          const start = Date.now();
          const check = () => {
            try { const el = selectorFn(); if (el) return resolve(el); } catch (_) {}
            if (Date.now() - start > timeout) return reject(new Error('waitFor timeout'));
            setTimeout(check, interval);
          };
          check();
        });
      }
      function setInput(inp, value) {
        const setter = Object.getOwnPropertyDescriptor(
          window.HTMLInputElement.prototype, 'value'
        ).set;
        setter.call(inp, value);
        inp.dispatchEvent(new Event('input', { bubbles: true }));
        inp.dispatchEvent(new Event('change', { bubbles: true }));
      }

      // Click Edit time
      const editBtn = await waitFor(
        () => Array.from(document.querySelectorAll('button'))
          .find(b => b.textContent.trim() === 'Edit time')
      );
      editBtn.click();

      // Wait for dialog with 3 inputs (Hours/Minutes/Seconds, DOM order)
      const dialogInputs = await waitFor(() => {
        const inps = document.querySelectorAll(
          'input[type="text"], input:not([type])'
        );
        return inps.length >= 3 ? inps : null;
      }, { timeout: 30000 });
      const [hours, mins, secs] = Array.from(dialogInputs).slice(0, 3);
      setInput(hours, '0');
      setInput(mins, String(minutes));
      setInput(secs, '0');
      await new Promise(r => setTimeout(r, 300));

      // Save
      const saveBtn = await waitFor(
        () => Array.from(document.querySelectorAll('button'))
          .find(b => b.textContent.trim() === 'Save' && !b.disabled),
        { timeout: 30000 }
      );
      saveBtn.click();
      await new Promise(r => setTimeout(r, 500));

      // Confirm time
      const confirmBtn = await waitFor(
        () => Array.from(document.querySelectorAll('button'))
          .find(b => b.textContent.trim() === 'Confirm time' && !b.disabled),
        { timeout: 30000 }
      );
      confirmBtn.click();

      return {
        step: 'confirmed',
        url: window.location.href,
        set_minutes: minutes,
      };
    }, MINUTES);

    console.log(JSON.stringify({ ok: true, tab_url: haiUrl, ...result }, null, 2));
  } catch (e) {
    console.log(JSON.stringify({
      ok: false,
      error: e && e.message ? e.message : String(e),
      stack: e && e.stack ? String(e.stack) : null,
    }, null, 2));
  }
})();
