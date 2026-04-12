// Handshake Task Page Extractor v2
//
// USAGE: This script is split into phases because tab-clicking requires DOM reflow.
// Phase 1: extract-metadata.js — metadata + prompt (no tab clicks needed)
// Phase 2: extract-responses.js — click "All" tab, wait, then extract both responses
//
// OR: Use this as a single-shot extractor when the "All" tab is already active.
//
// DOM structure (as of April 2026):
//   Metadata: <h5> elements under .prose in Task Overview section
//   Prompt: text after "Prompt:" in the page, in a chat-like bubble (.prose within max-w-[504px] container)
//   Responses: In tab panels. "All" tab → #tabpanel-all has exactly 2 .prose children
//              Individual tabs → #tabpanel-0 / #tabpanel-1 (lazy-mounted)
//   KaTeX: rendered elements have <annotation encoding="application/x-tex"> with LaTeX source
//          Some responses may not have KaTeX (plain text with raw LaTeX strings)
//   Formatting toggle: button with aria-label="Remove formatting"

(function() {
  const result = { metadata: {}, prompt: '', response1: '', response2: '', error: null };

  try {
    // --- METADATA ---
    const h5s = document.querySelectorAll('h5');
    h5s.forEach(h => {
      const t = h.textContent.trim();
      if (t.startsWith('L1 Category:')) result.metadata.l1 = t.replace('L1 Category:', '').trim();
      else if (t.startsWith('L2 Domain:')) result.metadata.l2 = t.replace('L2 Domain:', '').trim();
      else if (t.startsWith('L3 Subdomain')) result.metadata.l3 = t.replace(/L3 Subdomain[^:]*:/, '').trim();
      else if (t.startsWith('L4 Subdomain')) result.metadata.l4 = t.replace(/L4 Subdomain[^:]*:/, '').trim();
      else if (t.startsWith('Estimated Difficulty:')) result.metadata.difficulty = t.replace('Estimated Difficulty:', '').trim();
    });

    // Task ID from URL
    const urlMatch = window.location.pathname.match(/task\/([a-f0-9-]+)/);
    result.metadata.taskId = urlMatch ? urlMatch[1] : '';
    result.metadata.shortId = result.metadata.taskId.substring(0, 8);
    result.metadata.url = window.location.href;

    // --- HELPER: Reconstruct markdown from a prose container ---
    function proseToMarkdown(proseEl) {
      if (!proseEl) return '';
      const parts = [];

      function processNode(node) {
        if (node.nodeType === Node.TEXT_NODE) {
          return node.textContent;
        }
        if (node.nodeType !== Node.ELEMENT_NODE) return '';

        const tag = node.tagName;

        // KaTeX display math — extract LaTeX source from annotation
        if (node.classList?.contains('katex-display')) {
          const ann = node.querySelector('annotation[encoding="application/x-tex"]');
          if (ann) return '\n$$\n' + ann.textContent.trim() + '\n$$\n';
          return '';
        }

        // KaTeX inline math
        if (node.classList?.contains('katex') && !node.closest('.katex-display')) {
          const ann = node.querySelector('annotation[encoding="application/x-tex"]');
          if (ann) return '$' + ann.textContent.trim() + '$';
          return '';
        }

        // Skip KaTeX rendering internals
        if (node.classList?.contains('katex-mathml') || node.classList?.contains('katex-html')) {
          return '';
        }

        // Headings
        if (/^H[1-6]$/.test(tag)) {
          const level = parseInt(tag[1]);
          return '\n' + '#'.repeat(level) + ' ' + getChildText(node) + '\n';
        }

        // Paragraphs
        if (tag === 'P') return '\n' + getChildText(node) + '\n';

        // Horizontal rule
        if (tag === 'HR') return '\n---\n';

        // Lists
        if (tag === 'UL' || tag === 'OL') {
          const items = [...node.querySelectorAll(':scope > li')];
          return '\n' + items.map((li, i) => {
            const prefix = tag === 'OL' ? (i + 1) + '. ' : '- ';
            return prefix + getChildText(li);
          }).join('\n') + '\n';
        }

        // Code blocks
        if (tag === 'PRE') {
          const code = node.querySelector('code');
          const lang = code?.className?.replace('language-', '') || '';
          return '\n```' + lang + '\n' + (code || node).textContent + '\n```\n';
        }

        // Inline formatting
        if (tag === 'STRONG' || tag === 'B') return '**' + getChildText(node) + '**';
        if (tag === 'EM' || tag === 'I') return '*' + getChildText(node) + '*';
        if (tag === 'CODE') return '`' + node.textContent + '`';
        if (tag === 'SUP') return '^{' + getChildText(node) + '}';
        if (tag === 'SUB') return '_{' + getChildText(node) + '}';
        if (tag === 'BR') return '\n';

        // Block containers — recurse
        if (tag === 'DIV' || tag === 'SECTION' || tag === 'ARTICLE') return getChildText(node);
        if (tag === 'BLOCKQUOTE') return '> ' + getChildText(node);

        // SPAN (non-katex) — just recurse
        if (tag === 'SPAN') return getChildText(node);

        // TABLE support
        if (tag === 'TABLE') {
          const rows = [...node.querySelectorAll('tr')];
          return '\n' + rows.map(r => {
            const cells = [...r.querySelectorAll('th, td')];
            return '| ' + cells.map(c => getChildText(c).trim()).join(' | ') + ' |';
          }).join('\n') + '\n';
        }

        // Fallback
        return getChildText(node);
      }

      function getChildText(node) {
        return [...node.childNodes].map(processNode).join('');
      }

      for (const child of proseEl.children) {
        parts.push(processNode(child));
      }

      return parts.join('').replace(/\n{3,}/g, '\n\n').trim();
    }

    // --- PROMPT ---
    // Find the prompt bubble: it's in a .prose inside a container with max-w-[504px] and bg-[#F1F1F...]
    // or we can find it via the chat structure — look for "Prompt:" text marker
    const promptBubbles = [...document.querySelectorAll('.prose')].filter(p => {
      const parent = p.closest('[class*="max-w-[504px]"]');
      return parent && p.textContent.length > 50 && p.textContent.length < 3000;
    });
    if (promptBubbles.length > 0) {
      result.prompt = proseToMarkdown(promptBubbles[0]);
    }
    // Fallback: extract from innerText
    if (!result.prompt) {
      const allText = document.body.innerText;
      const promptIdx = allText.indexOf('Prompt:');
      if (promptIdx !== -1) {
        const after = allText.substring(promptIdx + 7, promptIdx + 2000);
        // Trim at double-newline or "Response" marker
        const end = after.search(/\n\n\n|\nResponse [12]\n|\nAll\n/);
        result.prompt = (end > 0 ? after.substring(0, end) : after).trim();
      }
    }

    // --- RESPONSES ---
    // Strategy: Use individual tab panels if they exist, else use "All" panel
    const panel0 = document.getElementById('tabpanel-0');
    const panel1 = document.getElementById('tabpanel-1');
    const panelAll = document.getElementById('tabpanel-all');

    if (panel0) {
      const prose = panel0.querySelector('.prose');
      if (prose) result.response1 = proseToMarkdown(prose);
    }
    if (panel1) {
      const prose = panel1.querySelector('.prose');
      if (prose) result.response2 = proseToMarkdown(prose);
    }

    // If individual panels missing, try "All" panel (has 2 .prose children)
    if (panelAll && (!result.response1 || !result.response2)) {
      const proses = panelAll.querySelectorAll(':scope .prose');
      // In "All" view, responses are under containers with "Response 1"/"Response 2" labels
      // The .prose elements appear in order: first = R1, second = R2
      if (proses.length >= 2) {
        if (!result.response1) result.response1 = proseToMarkdown(proses[0]);
        if (!result.response2) result.response2 = proseToMarkdown(proses[1]);
      }
    }

    // Report what we got
    result.stats = {
      r1Len: result.response1.length,
      r2Len: result.response2.length,
      promptLen: result.prompt.length,
      activeTab: document.querySelector('[role="tab"][aria-selected="true"]')?.textContent?.trim(),
      formattingOff: document.querySelector('[aria-label="Remove formatting"]')?.getAttribute('aria-pressed') === 'true'
    };

  } catch (e) {
    result.error = e.message + ' at ' + e.stack?.substring(0, 300);
  }

  return JSON.stringify(result);
})()
