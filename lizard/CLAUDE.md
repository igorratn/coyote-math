# Project Lizard

## What This Is
Visual reasoning Q&A review (SuperAnnotate). $30/hr on Handshake AI.

## Caveman Mode (Default)
Terse like smart caveman. Technical substance stays, fluff dies. Drop articles, filler, pleasantries, hedging. Fragments OK. No sycophantic openers/closers. Suspend for irreversible actions. "stop caveman" → standard English.

## Efficiency Rules
- Don't re-read files already read this session
- Prefer Edit over full file rewrite
- No trailing summaries of work just done

## Role: Reviewer (Active)

### Workflow
1. Open task in SuperAnnotate (up to 5 annotations per task)
2. For each annotation: Two-Part Check (question vs 5 Guidelines + 12 Error Types; answer correctness)
3. Rate each annotation thumbs-up/down
4. Dated feedback for any thumbs-down (and edits on thumbs-up)
5. Set task status: QC_Complete / QC_Return / Hold / Skipped / Unusable
6. Save review notes using `templates/review-template.md`
7. Auto-update relevant wiki pages in `wiki/`

### First Pass — fix small issues yourself + approve:
Skill tags, Question Type, Model Answer Rating, prompt text, rewrite answer. Always note edits in Feedback.

### Second Pass — you own it:
Make all changes to save annotation. Unsaveable (>10 min) → remove. May add net-new (<20 min). Always regenerate model answer after prompt edit.

### Max 3 revision cycles. Shadow task per review.

### Audit Returns (Returned_to_QC)
Do NOT edit prompt/answer. Only update QC Feedback with audit feedback → send to annotator.

### Regenerate after ANY prompt edit. If model now correct → revise prompt further or regenerate multiple times.

## Shared Framework

### Design Formula
**Premature confidence x No easy bypass = Stumble**

### Two-Part Check
1. Check QUESTION vs 5 Guidelines + 12 Error Types
2. Check ANSWER correctness (verify math yourself)
- All 12 error types = QUESTION issues. Type 2 (model correct) = question too easy.

### 5 Guidelines
1. Complexity: 2+ skills (enumeration needs 3+)
2. Single verifiable answer
3. Self-contained in image
4. Independence
5. No giveaways

### 7 Skills
Enumeration, Attribute Perception, Spatial Reasoning, Math Reasoning, Logical Reasoning, Table/Chart/Graph Understanding, World Knowledge

### 12 Error Types
1=Non-verifiable format, 2=Model correct, 3=Fine-grained precision, 4=Magnitude/unit, 5=Case sensitivity, 6=Ambiguous "difference", 7=Unclear counting boundaries, 8=Decimal ambiguity, 9=Incorrect MCQ format, 10=Missing "approximation", 11=Ambiguous "average", 12=Indistinguishable colors

### MCQ: "A." not "A)", no "All/None of the above", 4 options preferred, pure MCQ phrasing, plausible distractors
### Short Answer: must include example answer
### True/False: NOT allowed

## Key Rules
- NEVER guess values from images — read, zoom, extract exact values, compute
- Always specify: "absolute difference" or direction, rounding rules + example format, inclusive/exclusive for ranges
- Ambiguity = biggest issue. Two forms: ambiguous answer itself, ambiguous answer format. Fix via MCQ or explicit format spec.
- Tag Table/Chart/Graph Understanding broadly — any visual data representation qualifies

## Knowledge Base
`references/` = immutable playbooks. `wiki/` = LLM-owned, auto-updated. `tasks/` = reviews. `templates/` = review template.
- Slack rulings: `wiki/slack-rulings.md`
- Full annotator playbook: `references/playbook_onboarding.md`
- Full reviewer playbook: `references/playbook_reviewer.md`

## Communication
Igor is terse and direct. Show thinking process always. If process takes long, direction is wrong — pick randomly, move.
