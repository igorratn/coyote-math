# PinchTab Setup Notes

## Status: INSTALLED, TESTED, AND WORKING WITH HANDSHAKE

## Configuration
- Binary: built from source at ~/pinchtab, installed to /usr/local/bin/
- Security posture: Guard DOWN (development mode)
- Port: 9867 (server), 9868 (default headless), 9870 (handshake headed)
- Token: 3e64a4e055c949c20c37f70f99b8191f440bb3f0aa3031bc
- Handshake session: logged in, cookies persisted in "handshake" profile

## Headed Instance (for Handshake)
- Instance ID: inst_c545ab97
- Profile: handshake
- Port: 9870
- Mode: headed (visible Chrome window)

## Tested Workflow (2026-03-19)

Navigate to task:
```bash
curl -X POST "http://localhost:9870/navigate" -H "Authorization: Bearer 3e64a4e055c949c20c37f70f99b8191f440bb3f0aa3031bc" -H "Content-Type: application/json" -d '{"url":"https://ai.joinhandshake.com/annotations/fellow/task/TASKID/run"}'
```

List tabs:
```bash
curl -H "Authorization: Bearer 3e64a4e055c949c20c37f70f99b8191f440bb3f0aa3031bc" "http://localhost:9870/tabs"
```

Get interactive elements (stable refs):
```bash
curl -H "Authorization: Bearer 3e64a4e055c949c20c37f70f99b8191f440bb3f0aa3031bc" "http://localhost:9870/tabs/TAB_ID/snapshot?filter=interactive"
```

Click element by ref:
```bash
curl -X POST "http://localhost:9870/tabs/TAB_ID/action" -H "Authorization: Bearer 3e64a4e055c949c20c37f70f99b8191f440bb3f0aa3031bc" -H "Content-Type: application/json" -d '{"kind":"click","ref":"e0"}'
```

Extract all page text (one call gets everything):
```bash
curl -H "Authorization: Bearer 3e64a4e055c949c20c37f70f99b8191f440bb3f0aa3031bc" "http://localhost:9870/tabs/TAB_ID/text"
```

## Handshake Element Refs (from tested snapshot)
- e3: Remove formatting (Tx button)
- e10: Edit this step
- e12: Expand
- e13: All tab
- e14-e17: Response 1-4 tabs
- e18: Submit (arrow icon)
- e20-e23: Response 1-4 checkboxes

## Advantages over Chrome DevTools MCP
- Single text call extracts ALL responses (no per-tab JS extraction needed)
- Stable element refs (e0, e1...) instead of fragile coordinate clicks
- 800 tokens per page vs 10,000+ for Chrome DevTools MCP
- Persistent sessions across restarts
- Simple HTTP API — CLI can use curl from bash

## Next Steps
- [ ] Update cli_phoenix_rules.md step 6 with PinchTab commands
- [ ] Test full pipeline: paste prompt, submit, extract responses
- [ ] Compare extraction quality — does PinchTab text include raw LaTeX?
- [ ] Test fill command for pasting prompts into textarea
