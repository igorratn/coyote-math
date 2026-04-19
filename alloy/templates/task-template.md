# Task: {short-task-id}

## Metadata
- **Task ID:** {full-uuid}
- **URL:** {task-url}
- **L1 Domain:** {value}
- **L2 Domain:** {value}
- **L3 Subdomain:** {value}
- **Difficulty:** {value}
- **Date:** {YYYY-MM-DD}

## Prompt
{full prompt text}

## Response 1
{full VERBATIM response 1 text with LaTeX preserved — not a summary}

## Response 2
{full VERBATIM response 2 text with LaTeX preserved — not a summary}

## Evaluation

### Domain Check
- [ ] This task is within my domain of expertise

### Systematic Issues
{Issues shared across BOTH responses on the 4 evaluation dimensions ONLY: correctness, completeness, clarity, helpfulness. <5 sentences or "N/A". Do NOT include shared formatting/presentation issues here — those belong in Rewrite Trigger. This section is completed BEFORE choosing a preference.}

### Score: {1-7}
{Brief explanation of score choice}

### Justification
{2-4 sentences using "chosen response" / "rejected response" language. Reference specific content. Do NOT mention Likert score number. Do NOT cite rewrite triggers as preference reasons.}

### Formatting Flags (chosen response)
Each flag must have an explicit per-category justification. Yes = issue present, No = category applies but no issue, N/A = category doesn't apply.
- **Broken LaTeX: {Yes/No/N/A}** — {reason: if Yes, cite specific parse error or broken construct; if No, note that LaTeX is present and parses; if N/A, note absence of LaTeX}
- **Broken Markdown: {Yes/No/N/A}** — {reason}
- **Non-standard notation: {Yes/No/N/A}** — {reason}
- **Structural issues: {Yes/No/N/A}** — {reason}
- **Garbled text / random tokens: {Yes/No/N/A}** — {reason}

