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
3. For each task: Read prompt → Read both responses → Score → Justify → Check rewrite triggers

## Key Rules (Cheat Sheet)

- **Never score 4**
- **Always say "chosen response" / "rejected response"** (never A or B)
- **Only rewrite the chosen response** (never the rejected)
- **Rewrites fix presentation only** (never content, facts, or additions)
- **5 rewrite triggers:** Broken LaTeX, Broken markdown, Non-standard notation, Structure/layout, Random tokens/language switching
- **Justifications:** 2–5 sentences, specific, reference concrete details
- **When in doubt on rewrite:** Don't rewrite
- **When in doubt on domain:** Abandon the task
