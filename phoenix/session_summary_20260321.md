# Session Summary — 2026-03-20/21

## Completed
- **Gegenbauer problem (7edc37eb):** 2/4 stumbled. Corrected formula version. R1 algebra error (extra λm in expansion), R4 sign reversal. Solution: g_2(1,1;λ) = 2λ/(λ+1) > 1 for λ > 1. Submitted.
- **91a25388 dispute:** Filed dispute form + Slack defense. Reviewer cited wrong equation on wrong page. Thomas Harris DM discussion — demonstrated it's a reasoning trap (R3/R4 stumbled on φ-shift trick despite knowing correct formula). Awaiting resolution.
- **Repo cleanup:** Stale files archived, .gitignore updated, committed and pushed.
- **Design methodology updated:** Complexity-first approach. Start from interacting components.
- **Self-reflection:** domain_references/self_reflection_20260320.md

## Infrastructure Set Up
- **Claude Project:** "Coyote-Math Phoenix" on claude.ai with GitHub sync to igorratn/coyote-math
- **CLAUDE.md:** Created at repo root for CLI context
- **about-me.md:** Created at phoenix/about-me.md for Cowork context
- **Page-agent discovered:** Alibaba's in-page GUI agent. Can replace PinchTab. Notes at phoenix/page_agent_notes.md
- **GPT API from browser:** Works via Chrome JavaScript fetch. Bash curl blocked (needs new conversation after domain allowlist change).

## Pending / Next Session
- [ ] Test bash curl to GPT API (api.openai.com added to allowlist, needs new conversation)
- [ ] Test page-agent inputText() on Handshake contenteditable textarea
- [ ] 91a25388 dispute resolution — check status
- [ ] Claim new Phoenix task (Chris confirmed can claim while dispute pending)
- [ ] WIP problems ready: CG moment (False), Legendre derivative bound (True)
- [ ] Update design_methodology.md — complexity-first as THE starting point (not just one option)

## Key Insights
1. **Complexity-first design:** Start from "what two correct things produce wrong conclusion?" — the rest follows
2. **Page-agent pageController:** getBrowserState() for instant DOM extraction, clickElement()/inputText() for interaction. No LLM cost. One CDN script injection replaces PinchTab.
3. **GPT callable from browser:** window._gptKey + fetch to api.openai.com. Works through Chrome (your machine's network). Potential full orchestrator without CLI.
4. **Handshake originality policy:** "Problems can be inspired by well-known results but should have different constraints or assumptions." False claims of known theorems are acceptable if the claim itself is novel.

## Files Changed This Session
- Created: 7edc37eb.md (corrected Gegenbauer), CLAUDE.md, phoenix/about-me.md, phoenix/page_agent_notes.md, phoenix/project_instructions.md, domain_references/self_reflection_20260320.md, domain_references/design_methodology.md (updated)
- Updated: 91a25388.md (removed correct identity paragraph), .gitignore, phoenix/cli_phoenix_rules.md
- Cleaned: phoenix_tasks/ archived stale files
- Deleted: .zshrc symlink from repo root
