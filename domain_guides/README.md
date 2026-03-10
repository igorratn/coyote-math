# domain_guides

This directory contains the active prompt system for creating and evaluating Project Phoenix style mathematics tasks.

## Active files

- `core_generator.md`
  - domain-agnostic generator prompt
  - use this for creating new proof-based stumble problems

- `bessel_domain_prompt.md`
  - Bessel-specific domain prompt
  - use this together with `core_generator.md` when generating Bessel problems

- `analysis_prompt.md`
  - evaluator prompt for model responses
  - use this when analyzing which model response failed and why

- `librechat_system_prompt.md`
  - orchestration wrapper for LibreChat
  - tells LibreChat to use the modular prompt files in this directory

## Workflow

### Generate a new Bessel problem
Use:
- `core_generator.md`
- `bessel_domain_prompt.md`

### Analyze model responses
Use:
- `analysis_prompt.md`

## Notes

- `domain_references/` contains mathematical background and reference material, not operational prompts
- `domain_guides_legacy/` contains older prompt files retained only for reference
- the active modular workflow is:

  - generation = `core_generator.md` + one domain prompt
  - evaluation = `analysis_prompt.md`

