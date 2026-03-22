# Coyote-Math: Project Phoenix

## What This Is
True/False mathematical proof problems that stump frontier AI models. Problems submitted to Handshake AI platform where 4 models attempt them. Goal: 2+ out of 4 stumble.

## Repository Structure
- Problem files: `{task_id}.md` in repo root
- Pipeline work: `phoenix_tasks/`
- Methodology: `domain_references/`
- Pipeline rules: `phoenix/cli_phoenix_rules.md` — READ THIS BEFORE ANY PIPELINE WORK
- Design methodology: `domain_references/design_methodology.md`
- Problem clusters: `problem_clusters/`

## Design Formula
Premature confidence × No easy bypass = Stumble

Start from complexity: "What two correct things, combined, produce a wrong conclusion?"
- Design REASONING traps, not recall traps
- Error must live in INTERACTION of components
- No easy bypass — no small-value checks, no formula recall shortcuts
- Mix True and False (~50/50)

## Pipeline
Read `phoenix/cli_phoenix_rules.md` for the full pipeline. Key rules:
- GPT cross-check uses `source ~/.zshrc` for API key, model `gpt-5.4`
- INTEGRITY CHECK (step 6p) is MANDATORY — print char counts, wait for confirmation
- DO NOT FABRICATE RESPONSES — if extraction fails, report failure
- No Python in the pipeline

## Communication
Igor is terse and direct. One problem at a time. Do the math — don't reject ideas without computing. Stop immediately when asked.
