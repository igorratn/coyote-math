# Project Alloy

Handshake AI — Reward Model Side-by-Side (RM SxS) Evaluation

## Directory Structure

```
alloy/
├── README.md                # This file
├── REFERENCE_GUIDE.md       # Complete project rules & reference
├── tasks/                   # Notes on completed tasks
└── rewrites/                # Saved rewrites for reference
```

## Quick Start

1. Open Handshake AI dashboard → Project Alloy → Available tasks
2. Filter by L1_domain, L2_domain, Difficulty
3. For each task: Read prompt → Read both responses + AI investigation notes → Decide preference → Rate strength 0–3 → Justify (including any shared/systematic issues) → Review formatting flags → Review seeded rewrite

## Key Rules (Cheat Sheet)

- **Choose a preferred response first, then rate strength on the 0–3 scale**
- **0 = no meaningful difference, 1 = slight, 2 = moderate, 3 = strong preference**
- **Always say "chosen response" / "rejected response"** (use "both responses" only when rating `0`)
- **AI investigation notes are hints, not verdicts**
- **Seeded rewrites are back** — review the generated rewrite + change log, then accept/modify/revert as needed
- **Systematic/shared issues now live inside the rating justification** — no separate field
- **5 formatting flags still matter:** Broken LaTeX, Broken markdown, Non-standard notation, Structure/layout, Random tokens/language switching
- **Broken LaTeX uses the any-renderer rule** — KaTeX-only failures do not qualify
- **When in doubt on domain:** Abandon the task
