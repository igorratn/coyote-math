# Page-Agent Pipeline Integration Notes

## Date: 2026-03-20

## What Is It
Alibaba's page-agent.js — an in-page GUI agent. MIT licensed. Inject via CDN script tag.

## CDN URL
```
https://cdn.jsdelivr.net/npm/page-agent@1.5.11/dist/iife/page-agent.demo.js
```
Demo version includes free Qwen 3.5-plus LLM. No API key needed.

## Key APIs (No LLM Required)

### pageController.getBrowserState()
- Returns dehydrated DOM with indexed elements + all visible text
- ~20K chars, instant, no LLM call
- Replaces PinchTab `/text` endpoint and Claude in Chrome `read_page`

### pageController.clickElement(index)
- Click any indexed element by number
- Replaces finding refs and using javascript_tool

### pageController.inputText(index, text)
- Fill any input/textarea by index
- UNTESTED on React contenteditable — the key test for Handshake textarea
- This is page-agent's specialty (form fills on complex React apps)

### pageController.scroll() / scrollHorizontally()
- Page navigation

## LLM-Powered API

### pageAgent.execute(command)
- Natural language commands via free Qwen API
- "Click the All tab" — works, fast
- "Extract all 4 model responses" — works but may truncate long content
- Good for complex multi-step interactions

## Injection Method
```javascript
const script = document.createElement('script');
script.src = 'https://cdn.jsdelivr.net/npm/page-agent@1.5.11/dist/iife/page-agent.demo.js';
script.crossOrigin = 'true';
document.head.appendChild(script);
// After load: window.pageAgent and window.PageAgent available
```

## Test Results (2026-03-20)
- Tested on Handshake task page 7edc37eb (read-only)
- getBrowserState(): SUCCESS — extracted full page with indexed elements
- execute('Click the All tab'): SUCCESS — clicked tab correctly
- execute('Extract responses'): PARTIAL — got Response 1 but truncated others
- Tested on Proctor sandbox fa41b7c2 (read-only)
- getBrowserState(): SUCCESS — extracted Dirac equation problem + model responses
- inputText on contenteditable: NOT YET TESTED

## Pipeline Potential
- Replace PinchTab for reading: getBrowserState() is faster and cleaner
- Replace PinchTab /evaluate for writing: inputText() might solve the React contenteditable problem
- No HTTP server, no port management, no restart scripts
- Just inject CDN script + call pageController methods via javascript_tool

## TODO (when unblocked)
1. Test inputText() on Handshake contenteditable textarea
2. If it works, write a pipeline script that replaces PinchTab entirely
3. Compare reliability with PinchTab for response extraction
