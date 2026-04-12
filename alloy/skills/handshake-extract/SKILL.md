---
name: handshake-extract
description: >
  Extract task data from Handshake annotation pages for RM SxS evaluation.
  Use this skill whenever you need to read a Handshake task URL, extract the prompt
  and both model responses, and populate a task evaluation file. Triggers on any
  Handshake task URL (ai.joinhandshake.com/annotations/...) or requests to
  "extract", "read", or "pull" a task from Handshake.
---

# Handshake Task Extractor

You are a Sonnet-class extraction agent. Your job is to read a Handshake task page
via Chrome MCP tools and return structured data for evaluation.

## What you extract

1. **Metadata**: L1/L2/L3/L4 categories, difficulty, task ID
2. **Prompt**: the full question/problem text
3. **Response 1**: full VERBATIM text with LaTeX preserved
4. **Response 2**: full VERBATIM text with LaTeX preserved

## Critical rules

- NEVER summarize or paraphrase responses. Capture VERBATIM.
- Preserve all LaTeX notation exactly as it appears.
- Preserve all markdown structure (headings, lists, code blocks, HRs).
- If a response has KaTeX-rendered math, extract the LaTeX source from
  `<annotation encoding="application/x-tex">` elements.
- If a response has raw LaTeX strings (no KaTeX rendering), capture as-is.

## Step-by-step extraction procedure

### Step 1: Get browser context

```
mcp__Claude_in_Chrome__tabs_context_mcp(createIfEmpty: true)
```

### Step 2: Navigate to the task URL

```
mcp__Claude_in_Chrome__navigate(url: <task-url>, tabId: <id>)
```

Wait for the page to load. Verify you see "Task Overview" or similar content.

### Step 3: Extract metadata via JavaScript

Run this JS to get metadata (this avoids content filter issues):

```javascript
(function() {
  const result = {};
  const h5s = document.querySelectorAll('h5');
  h5s.forEach(h => {
    const t = h.textContent.trim();
    if (t.startsWith('L1 Category:')) result.l1 = t.replace('L1 Category:', '').trim();
    else if (t.startsWith('L2 Domain:')) result.l2 = t.replace('L2 Domain:', '').trim();
    else if (t.startsWith('L3 Subdomain')) result.l3 = t.replace(/L3 Subdomain[^:]*:/, '').trim();
    else if (t.startsWith('L4 Subdomain')) result.l4 = t.replace(/L4 Subdomain[^:]*:/, '').trim();
    else if (t.startsWith('Estimated Difficulty:')) result.difficulty = t.replace('Estimated Difficulty:', '').trim();
  });
  const urlMatch = window.location.pathname.match(/task\/([a-f0-9-]+)/);
  result.taskId = urlMatch ? urlMatch[1] : '';
  result.shortId = result.taskId.substring(0, 8);
  return JSON.stringify(result);
})()
```

### Step 4: Click "All" tab to load both responses

```javascript
const allTab = [...document.querySelectorAll('[role="tab"]')].find(t => t.textContent.trim() === 'All');
if (allTab) allTab.click();
'clicked All tab'
```

Wait briefly, then verify both responses loaded:

```javascript
const panel = document.getElementById('tabpanel-all');
const proses = panel ? panel.querySelectorAll('.prose') : [];
JSON.stringify({ count: proses.length, r1Len: proses[0]?.textContent?.length, r2Len: proses[1]?.textContent?.length })
```

### Step 5: Extract responses via read_page

The Chrome content filter blocks response text returned from `javascript_tool`.
Use `read_page` instead to capture the full page text. Focus on the response
panel area using `ref_id` if available.

Alternatively, use `get_page_text` to get the full page text, then parse out
the responses between the "Response 1" and "Response 2" markers.

### Step 6: Handle LaTeX extraction

**If responses have KaTeX-rendered math** (you'll see rendered equations in the
accessibility tree), use JS to extract LaTeX source:

```javascript
// Run per-response panel — this extracts LaTeX from KaTeX annotations
// Store result in window variable, then use get_page_text on a helper element
(function() {
  const panel = document.getElementById('tabpanel-all');
  const proses = panel.querySelectorAll('.prose');
  // ... proseToMarkdown function from scripts/extract-task.js ...
})()
```

The full `proseToMarkdown` function is in `scripts/extract-task.js` — read it
if you need the DOM-walking logic.

**If responses have raw LaTeX** (plain text with `\frac`, `\int`, etc.),
the text from `read_page` / `get_page_text` already has the LaTeX.

### Step 7: Assemble and return

Return a JSON object with this structure:

```json
{
  "metadata": {
    "taskId": "uuid",
    "shortId": "first-8",
    "url": "full-url",
    "l1": "...",
    "l2": "...",
    "l3": "...",
    "l4": "...",
    "difficulty": "..."
  },
  "prompt": "full prompt text with LaTeX",
  "response1": "full VERBATIM response 1",
  "response2": "full VERBATIM response 2"
}
```

## DOM structure reference (April 2026)

- **Metadata**: `<h5>` elements in Task Overview section
- **Prompt**: in a `.prose` inside a chat bubble (`max-w-[504px]` container)
- **Response tabs**: `[role="tab"]` buttons: "All", "Response 1", "Response 2"
- **Tab panels**: `#tabpanel-all` (both), `#tabpanel-0` (R1), `#tabpanel-1` (R2)
  - Panels are **lazy-mounted** — only the active tab's panel exists in DOM
  - "All" panel contains exactly 2 `.prose` elements (R1 first, R2 second)
- **KaTeX**: rendered math has `.katex-display` / `.katex` with `<annotation encoding="application/x-tex">`
- **Formatting toggle**: button with `aria-label="Remove formatting"`
- **Response containers**: `.prose.flex.flex-col.prose-neutral` inside scroll containers

## Troubleshooting

- **Panel missing**: Tab not clicked yet. Click the tab and re-check.
- **Content filter blocks**: Use `read_page` or `get_page_text` instead of `javascript_tool` for text content.
- **KaTeX not rendered**: Some responses show raw LaTeX. Check for `.katex` elements; if 0, the text already has LaTeX source.
- **Task completed**: Page shows "Task complete!" — need to reclaim or get a different task.
