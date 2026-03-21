# PinchTab Textarea Fix for Handshake

## Problem
Handshake uses a React contenteditable div (ProseMirror). PinchTab's `fill` action doesn't work.

## Solution: Use PinchTab evaluate endpoint with execCommand

PinchTab's evaluate endpoint can run JavaScript on the page — same capability as Chrome DevTools MCP javascript_tool, but through PinchTab's HTTP API. No need for Chrome DevTools MCP.

### Step 6f procedure (ALL PinchTab, no MCP needed):

1. Click "Edit this step" button via PinchTab action (step 6e)
2. Wait 3 seconds for the textarea to appear
3. Use PinchTab evaluate to fill the textarea:

```bash
curl -s -X POST "http://localhost:$PORT/tabs/$TAB/evaluate" \
  -H "$AUTH" -H "Content-Type: application/json" \
  -d '{"expression":"const el=document.querySelector(\".ProseMirror\")||document.querySelector(\"[contenteditable=true]\"); if(el){el.focus(); document.execCommand(\"selectAll\"); document.execCommand(\"insertText\",false,ESCAPED_PROMPT_TEXT);} !!el"}'
```

The `execCommand("insertText")` simulates real keyboard typing. It triggers React's input handlers, unlike directly setting innerText/innerHTML.

4. Verify the text was inserted:
```bash
curl -s -X POST "http://localhost:$PORT/tabs/$TAB/evaluate" \
  -H "$AUTH" -H "Content-Type: application/json" \
  -d '{"expression":"(document.querySelector(\".ProseMirror\")||document.querySelector(\"[contenteditable=true]\"))?.innerText?.length || 0"}'
```

If the length matches the prompt length, proceed to step 6g (submit).

### If evaluate fails:
Ask user to paste manually in the PinchTab Chrome window. Do NOT loop, do NOT fall back to Chrome DevTools MCP.

### KEY POINTS:
- ALL steps use PinchTab. No Chrome DevTools MCP needed anywhere.
- The evaluate endpoint is the equivalent of javascript_tool but through PinchTab's HTTP API.
- Use execCommand("insertText") not innerText/innerHTML — React needs real input events.
- Long prompts may need to be inserted in chunks.
