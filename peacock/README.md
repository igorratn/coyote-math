# Project Peacock — Physics

Handshake AI tasks for **Project Peacock (Physics)**. Migrated from `proctor_tasks/` structure with Physics-specific deltas.

## External resources
- **Lovable site:** https://project-peacock-40.learn.joinhandshake.com/
  - `/golden-examples/physics` — DO NOT copy. Reviewers run cosine-similarity check.
  - `/common-failure-modes/physics`
  - `/domain-guidelines/physics`
  - `/pod-leads/physics` — 1:1 booking links
- **Slack channel:** `#peacock-physics` (`C0AT4D0J32A`)
- **Domain lead:** Matt O. (`U0ANBMMDC81`)
- **Project lead:** Rajamani A. (HAI)
- **War room (when active):** https://joinhandshake.zoom.us/j/97100764868
- **Open office hours (daily ~11am EDT):** https://joinhandshake.zoom.us/j/94335610162

## Repository layout
```
peacock/
├── README.md                ← this file (project rules + context)
├── playbook_numerical.md    ← local playbook for numerical-answer / FEA-defended problems
├── drafts/                  ← work-in-progress prompts, session notes, exploration
├── submitted/               ← final task files (mirror of proctor_tasks/submitted/)
├── references/              ← pasted Lovable content, reference material
├── responses/               ← model run outputs (gitignored — never commit)
└── prompts/                 ← (NOT YET CREATED — peacock_generator, peacock_evaluator, etc.)
```

**Where model responses go:** keep raw model run outputs (Handshake "Models" tab copy-pastes,
intermediate response captures, scratch notes from individual runs) in `peacock/responses/`.
That directory is gitignored (`peacock/responses/` is in the repo `.gitignore`). The legacy
file `peacock/drafts/models.md` is also gitignored explicitly so it's safe to leave in place
during transition. Do not commit any model response text — it can include prompt content
that triggers cosine-similarity flags on future submissions and isn't useful in version history
anyway.

For numerical-answer problems defended by FEA / Fourier / quadrature, see
`playbook_numerical.md` for the closed-form-anchor protocol, mesh-convergence error-bar
derivation (Richardson + Aitken), 5%-tolerance stumble accounting, and failure-justification
template. The playbook walks through `drafts/layered_centerline_threshold_problem.md` as a
worked example.

## What's different from Proctor
1. **Domain:** Physics (graduate-level target).
2. **References must be specific** — if a problem is beyond standard graduate physics, give chapter + equation number for textbook references, or specific equation locations for papers. Vague references are a frequent rejection cause (per Matt O., 2026-04-30).
3. **Cosine-similarity check on prompts** — golden examples and prior submissions are checked for duplicity. Don't copy structure, not just numbers.
4. **Concurrent task limit:** 1 until first approval, then up to 10. Spammy/low-quality submissions = grounds for offboard.
5. **First Task Approval incentive:** $150 (live as of 2026-04-24).
6. **Throughput pressure:** delivery targets are weekly; team is currently behind ramp.

## Failure-induction tactics noted in channel
- Use highly specific molecules/processes/materials (e.g. chlorophyll, phycocyanin) instead of generic categories — diverts model bandwidth toward knowledge recall and away from generalization (Fedor K., 2026-04-30).
- After multiple reasoning steps still don't induce failure: save prompt, restart task (three-dot menu, top right). Models seem to retain memory across reruns; restart kills it (Chinmay K., 2026-04-23).
- Saturate the model with related-area calculations + use context-driven concepts to trigger wrong-concept application (Fedor K., 2026-04-24).

## Pipeline / workflow
TBD — fill in after pasting Lovable content into `references/lovable_content.md`. Likely close to Proctor's 9-step structure (prompt → Model A → Model B → failures → rationale → solution → hints → metadata → rubric) but adjusted for Peacock task type (TBD if same evaluation apparatus or simpler prompt-only format).

## Reference: Proctor structure for comparison
See `../proctor_tasks/prompts/proctor_generator.md` for the 9-step Proctor template if useful as a starting point when seeding `peacock/prompts/`.
