# Common Errors in Annotations

## Error Patterns from Slack (Apr 5–7, 2026)

### LLM-Generated Annotations
- Copy-paste style with step-by-step formatting ("Step 1 — Identify...", "Step 2 — Extract...", variable definitions, conditional logic)
- Overly structured, formulaic prompts that no human would write naturally
- Flag to project leads immediately — this is task abuse
- Example: Report_Dashboard_Retail_Dashboard_2.json (flagged by Alexander D., confirmed by Achsah)

### Overly Wordy Prompts
- Annotators pad simple questions with excessive specificity
- Example: "Examine the blue line (B) and the thick horizontal black line forming the x-axis at the absolute bottom of the graph (which represents a mathematical value of 0)..." = just asking "How many times does line B intersect the x-axis?"
- Fix on first pass by trimming to the core question
- Watch out: over-trimming can make the question trivially easy for the model

### Math Precision Exploitation
- Using ln(), sin(), huge exponents (e.g., 60^5.55) to force rounding errors at 6th+ decimal place
- Not the type of model error the project is targeting
- Hard to verify without Wolfram Alpha-level tools
- Rounding must be specified BEFORE operations (e.g., how to round sin(4) before computing 2^sin(4))
- Consensus: consider thumbs down, awaiting formal ruling

### Inflated Skill Tags
- Annotators check skills that don't apply (e.g., TCG Understanding and Spatial on a simple enumeration task)
- Uncheck wrong tags and send back with feedback to make questions more complex per playbook

### Zero-Answer Counting
- Asking "how many times does X intersect Y" when it never does → answer is 0
- Counting things that don't exist = bad
- Exception: doing math with non-zero numbers that results in 0 = fine

### Duplicate/Similar Prompts
- Multiple prompts on same image with same ontology and similar "flavor"
- Common pattern: multiple vowel-counting prompts on the same image
- Thumbs up one, thumbs down the rest

### MCQ Formatting Errors
- Rewrite answers with periods ("A." instead of "A")
- Adding unnecessary format instructions ("answer with a letter")
- Both should be corrected during review

## Error Patterns Encountered
(Auto-populated after each review task)
