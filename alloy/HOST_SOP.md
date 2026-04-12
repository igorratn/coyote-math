# Alloy Host SOP (run in host claude code)

Host claude code owns all Handshake browser interaction via the `chrome-devtools` MCP. Cowork owns reasoning and task file writing. Handoff = filesystem.

Repo root: `/Users/iratnere/dev/coyote-math/alloy` (host path). Mirror in Cowork: `/sessions/<current-session>/mnt/alloy` (session ID rotates — do not hardcode).

## Two jobs

### 1. Scrape
Input: Handshake task URL (e.g. `https://ai.joinhandshake.com/annotations/fellow/task/<uuid>/run`).

Steps:
1. Extract `<uuid>` from URL. `short_id` = first 8 chars.
2. Locate existing Chrome tab at that URL via `chrome-devtools` MCP `list_pages`. If found, reuse — do NOT navigate. Else open tab + navigate.
3. Read `scripts/scrape-handshake.js` from repo.
4. `evaluate_script` on the tab with that script. Expected return: `{ok, task_id, prompt_len, r1_len, r2_len, download_name, missing}`.
5. Script downloads blob as `handshake-scrape-<short_id>.txt` to Downloads dir.
6. `cp ~/Downloads/handshake-scrape-<short_id>.txt alloy/scrapes/<short_id>.txt`.
7. Validate: `prompt_len >= 200`, `r1_len > 500`, `r2_len > 500`, `missing == 0`. Fail loud on any miss.
8. **Immediately** print: `scrapes/<short_id>.txt ready. prompt_len=X, r1_len=X, r2_len=X, missing=0` — this is the FIRST output after cp, before any other checks or commentary. Done. Hand back to Cowork.

### 2. Form fill
Input: `alloy/tasks/<short_id>.md` — contains a `## Form-Fill Payload` section with the canonical schema (see Cowork CLAUDE.md).

Steps:
1. Read task file. Parse `## Form-Fill Payload` section → payload dict.
2. Locate tab at the matching task URL. Reuse. No navigation.
3. Execute per-section protocol from CLAUDE.md §"Form fill":
   - Per section: one `read_page(filter:"interactive")` for refs, `form_input` each field once with final strings, verify non-empty, click advance (↑), report checkpoint.
   - Fast path: `rewriteCategory == "N/A"` → skip rewrite fields entirely.
   - Submit blacklist: if Submit button ref surfaces, record as DO-NOT-TOUCH. Never click.
4. STOP at the section immediately before Submit. Report `{last_section, fields_written, awaiting_human_submit: true}`.
5. Human reviews and clicks Submit manually.

## Hard rules
- **NEVER click Submit.** Human does it.
- **Never reinterpret payload.** Sonnet-style dumb executor. All strings are final as-written in task file.
- **Never rescore, never rewrite text, never edit rewrite content.** Cowork already finalized.
- **Tab reuse mandatory** when a matching tab exists.
- **Fail loud** on validation errors — don't proceed with partial scrape or ambiguous refs.

## File locations (host paths)
- Scrape script: `alloy/scripts/scrape-handshake.js`
- Scrape output: `alloy/scrapes/<short_id>.txt`
- Task file (payload source): `alloy/tasks/<short_id>.md`
- Selector cache: `alloy/wiki/handshake-selectors.md`
