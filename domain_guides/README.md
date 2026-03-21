# domain_guides

This directory contains the active prompt system for creating and evaluating Project Phoenix style mathematics tasks.

## Active files

- `playbook.md`
  - master guide: trap taxonomy (A-S), tier definitions, output format, creation workflow, operational lessons
  - v3.3 (2026-03-18)

- `analysis_prompt.md`
  - evaluator prompt for model responses

- `librechat_system_prompt.md`
  - orchestration wrapper for LibreChat

## Deprecated (safe to delete)

- `model_failure_prompt.md` — replaced by `analysis_prompt.md` + GPT Round A
- `core_generator.md` — folded into `playbook.md` and CLI pipeline
- `bessel_domain_prompt.md` — redundant with `problem_clusters/bessel_functions.md`
- `spherical_harmonics_domain_prompt.md` — redundant with `problem_clusters/spherical_harmonics.md`

## Workflow

### Generate a new problem
1. `playbook.md` (how to generate: traps, format, design principles)
2. Cluster file (what exists: `problem_clusters/bessel_functions.md` or `problem_clusters/spherical_harmonics.md`)

### Analyze model responses
1. `analysis_prompt.md` (Claude's own analysis)
2. GPT Round A in `phoenix/cli_phoenix_rules.md`

### Full CLI pipeline
See `phoenix/cli_phoenix_rules.md` — reads playbook + cluster, that's it.
