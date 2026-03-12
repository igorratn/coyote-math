# Phoenix Tasks

Persistent workspace for Project Phoenix (Turing STEM Math RLHF).

## What is Phoenix

Turing tasks: graduate-level True/False proof problems submitted as `<hash>.md` files
in the repo root. Each file contains the problem statement and a complete rigorous proof.

## Directory layout

```
phoenix_tasks/
├── README.md          ← this file
├── current/
│   └── wip.md         ← the problem being drafted RIGHT NOW
├── submitted/         ← index entries for submitted problems (not full copies)
│   └── index.md       ← one-line summary per submitted hash
└── session_log.md     ← running cross-session log
```

## Workflow

### Starting a new problem
1. Check `session_log.md` for where we left off
2. Check `problem_clusters/bessel_functions.md` for gaps to fill
3. Draft in `current/wip.md`

### Submitting
1. Submit content as `<hash>.md` in repo root (as always)
2. Append one line to `submitted/index.md`: `<hash> | <topic> | <verdict>`
3. Add entry to `problem_clusters/bessel_functions.md` cluster
4. Clear or stub `current/wip.md`
5. Append session summary to `session_log.md`

## Problem format (Phoenix)

```
<problem statement with KaTeX math>

<verdict line: "The claim is True." or "The claim is False.">

<complete rigorous proof>
```

No YAML frontmatter. No headers. Plain markdown with KaTeX.
