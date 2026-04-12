# Project Alloy — Quick Reference Guide

## What Is Project Alloy?

**Reward Model Side-by-Side (RM SxS) evaluation** — you act as a domain expert judge comparing two AI-generated responses to a prompt.

**Platform:** Handshake AI
**Pay:** $75/hour, flexible schedule, remote
**Philosophy:** Accuracy over speed. Your domain expertise is the point.

---

## What You Receive Per Task

1. **A prompt** (question or instruction)
2. **Response A** (AI-generated)
3. **Response B** (AI-generated)

Prompts span many domains: mathematics, medicine, chemistry, law, physics, economics, and more.

## What You Submit Per Task

1. **Rating** — a score from 1 to 7
2. **Rationale** — written justification explaining your choice
3. **Rewrite trigger category** — one of 5 categories, or "N/A — No rewrite needed"
4. **Issue explanation** — describe the specific issue and location, or confirm why no rewrite is needed

### Key Takeaways — What Is Project Alloy

- You receive a prompt and two model responses and must judge which is better
- Your output is a numeric score, a written rationale, a rewrite trigger category (or N/A), and an explanation of any issue found
- Prompts will span many expert domains — your domain expertise is the whole point
- This data trains reward models that shape how AI responds to expert-level questions

---

## The Score Scale (1–7)

| Score | Meaning |
|-------|---------|
| 1 | Strongly prefer Response A |
| 2 | Moderately prefer Response A |
| 3 | Slightly prefer Response A |
| **4** | **NEVER USE — always find a meaningful difference** |
| 5 | Slightly prefer Response B |
| 6 | Moderately prefer Response B |
| 7 | Strongly prefer Response B |

### When to Use Each Tier

**1 or 7 — Stark, consequential difference:**
- One response has a significant factual error (wrong diagnosis, incorrect derivation, flawed reasoning)
- One directly answers the question, the other misses the point entirely
- One is coherent and well-structured, the other is disorganized or substantially incomplete
- One demonstrates deep domain expertise, the other is shallow or generic

> **Example (Math):** Response A correctly proves a theorem using a valid proof by induction. Response B attempts the same proof but makes a fundamental logical error in the inductive step, rendering the proof invalid. **Score: 1** (strongly prefer A).

**2 or 6 — Clearly better, but the weaker response still has value:**
- One is more complete and covers important nuances the other misses
- One is better organized and easier to follow, though both are correct
- One uses more appropriate notation or framing for the domain

> **Example (Medicine):** Both responses correctly identify the most likely diagnosis. The chosen response also discusses the differential diagnosis, flags a drug interaction, and recommends a specific follow-up test. The rejected response is technically correct but too brief for clinical utility. **Score: 2** (moderately prefer A).

**3 or 5 — Close call, mild preference:**
- Both are correct and complete, but one is slightly clearer or better formatted
- One uses slightly more precise language
- The difference is real but minor

### Calibration Question

> "Would a domain expert immediately see one response as clearly superior?"
> - If yes → strong score (1 or 7)
> - If it takes careful reading → mild score (3 or 5)

### Common Scoring Mistakes to Avoid

1. **Score compression** — Don't default to 3/5 for everything. Use the full range. A major factual error warrants 1 or 7.
2. **Averaging** — Don't split the difference when one is more accurate but the other looks nicer. Decide what matters most *in context*.
3. **Recency bias** — The response you read second feels more familiar. Always re-read both before scoring.
4. **Length bias** — Longer does not equal better. Concise and correct beats verbose and padded.

### Key Takeaways — Score Scale

- Lower scores (1–3) favor Response A; higher scores (5–7) favor Response B
- Use the full range — 1 or 7 for large quality gaps, 3 or 5 for close calls
- A significant factual or logical error in one response almost always warrants 1 or 7
- Do not compress all scores to 3 or 5 — that destroys the usefulness of the annotation
- **Never select 4** — if one response is even slightly better on any dimension, assign a non-4 score

---

## How to Evaluate Responses

### The Evaluation Framework

When comparing two responses, evaluate across four dimensions in priority order:

**1. Correctness (almost always the most important)**

Is the response factually and logically correct? A correct response beats a well-written wrong one every time.

- **Mathematics:** Is the proof valid? Are the steps logically sound? Is the final answer correct?
- **Medicine:** Is the diagnosis accurate? Is the treatment appropriate? Are contraindications addressed?
- **Chemistry:** Is the reaction mechanism correct? Are the products right? Is the stereochemistry accurate?
- **Law:** Is the legal reasoning sound? Are the cited principles correctly applied?

If one response contains a factual or logical error that the other avoids, that is typically decisive.

**2. Completeness**

Does the response address everything the prompt asked?

- Does it answer all parts of a multi-part question?
- Does it cover the most important edge cases or caveats?
- Does it acknowledge uncertainty where appropriate?

A response that answers 80% of the question is worse than one that answers 100%, even if the 80% is excellent.

**3. Clarity and Communication**

Can the reader actually understand the response? Matters more for non-specialist audiences, less for purely technical prompts.

- Is the reasoning explained step-by-step, or does it jump to a conclusion?
- Is the structure logical (e.g., for a proof: setup → argument → conclusion)?
- Is the response appropriately concise, or bloated with filler?

**4. Domain Appropriateness**

Does the response use the conventions, notation, and terminology expected in the field?

- A physics response should use standard variable names (v for velocity, not x)
- A medical response should use appropriate clinical terminology
- A mathematical proof should follow accepted proof conventions

### Worked Evaluation Examples

> **Example 1 — Mathematics**
> **Prompt:** Prove that the sum of two odd integers is even.
>
> **Response A:** Let a = 2m+1 and b = 2n+1 be odd integers. Then a+b = 2m+1+2n+1 = 2(m+n+1), which is even since it is divisible by 2. □
>
> **Response B:** Odd numbers can't be added together to make an odd number. If you try it with any odd numbers like 3 and 5 you get 8 which is even. So the sum of two odd numbers is always even.
>
> **Evaluation:** Response A gives a formal proof using the definition of odd integers and algebraic manipulation — the appropriate form for a mathematical proof. Response B gives an informal argument by example, which is not a proof at all. **Score: 1** (strongly prefer A).

> **Example 2 — Medicine**
> **Prompt:** A 45-year-old woman presents with fatigue, cold intolerance, constipation, and weight gain over the past 6 months. TSH is 12 mIU/L. What is the diagnosis and first-line treatment?
>
> **Response A:** This presentation is consistent with primary hypothyroidism, confirmed by the elevated TSH. First-line treatment is levothyroxine, starting at 1.6 mcg/kg/day, titrated to normalize TSH. Periodic monitoring every 6-8 weeks initially, then annually once stable.
>
> **Response B:** The patient likely has a thyroid problem. The TSH being high suggests the thyroid is underactive. You would treat this with thyroid replacement medication.
>
> **Evaluation:** Both responses reach the correct diagnosis. Response A names the specific diagnosis (primary hypothyroidism), gives the correct medication with dosing guidance, and includes monitoring protocol — all clinically essential. Response B is vague and lacks actionable detail. **Score: 2** (moderately prefer A — both correct, but A is substantially more useful).

### Key Takeaways — Evaluation Framework

- Correctness is almost always the primary dimension — a factual error is usually disqualifying
- Apply domain-specific standards: what "good" means in math proofs differs from what it means in clinical medicine
- Completeness matters: a response that answers 80% of the question is weaker than one that answers 100%
- Clarity matters when communication is part of the task; less so when the prompt is purely technical
- Re-read both responses after you have formed an initial impression

---

## Writing Strong Justifications

### The Language Rule (CRITICAL)

**Never refer to responses as "Response A" or "Response B."** Always say **"the chosen response"** and **"the rejected response."**

This is a hard requirement, not a style preference. The labels A and B are arbitrary and meaningless downstream.

- ❌ "Response A correctly derived the integral while Response B made an error."
- ✅ "The chosen response correctly derived the integral; the rejected response made an arithmetic error in the substitution step."

### The Five Components of a Strong Justification

1. **Lead with what made the chosen response better** — Name the exact feature, step, argument, or fact that was superior.
2. **Explain what the rejected response got wrong or missed** — Don't just praise the winner; describe the loser's failure (factually wrong? incomplete? vague? poorly reasoned?).
3. **Reference specific content from the responses** — Quote or paraphrase specific elements. "Correctly identified the mechanism as SN2" beats "was more accurate."
4. **Acknowledge legitimate merits in the rejected response (when they exist)** — Shows you evaluated carefully rather than just picking a side.
5. **Connect your reasoning to the domain** — Explain why the distinction matters: "In a clinical context, omitting the dosing schedule is a significant gap."

### Length and Tone

- **Target: 2–5 sentences.** Longer is not better. Focused and specific beats rambling.
- Every sentence should carry new information.
- Neutral, analytical tone. Not "blew it out of the water" but "was superior because..."
- No need to hedge — if the difference is clear, say so clearly.

### Worked Examples — Weak vs. Strong

> **Mathematics — Evaluate ∫₀¹ x·eˣ² dx**
>
> ❌ Weak: "The chosen response was better and more accurate than the rejected response."
> *Fails: Zero specifics. Could be written without reading either response.*
>
> ✅ Strong: "The chosen response correctly applied u-substitution with u = x², yielding ½(e − 1) as the exact answer, and showed each substitution step clearly. The rejected response attempted integration by parts unnecessarily and made an error in the boundary evaluation, arriving at an incorrect numerical result."
> *Works: Names technique, quotes answer, explains the specific error.*

> **Medicine — Apixaban dosing for 68yo with AFib and CKD stage 3**
>
> ❌ Weak: "The chosen response gave better clinical guidance and was more helpful overall."
> *Fails: No specifics. Reader can't tell if this reflects domain knowledge or a guess.*
>
> ✅ Strong: "The chosen response correctly identified that apixaban requires a dose reduction to 2.5 mg twice daily when two of three criteria are met (age ≥80, weight ≤60 kg, or creatinine ≥1.5 mg/dL), and appropriately noted that CKD stage 3 alone does not automatically trigger the reduction without meeting the two-of-three threshold. The rejected response recommended a blanket dose reduction based on CKD alone, which is clinically incorrect and could lead to underdosing."
> *Works: Quotes specific dosing criteria, identifies precise clinical error, explains real-world stakes.*

> **Chemistry — Major product of (R)-2-bromobutane with NaOH in aqueous conditions**
>
> ❌ Weak: "The chosen response correctly identified the product and mechanism."
> *Fails: Doesn't say what the product is, what mechanism, or why rejected was wrong.*
>
> ✅ Strong: "The chosen response correctly identified the major product as (S)-2-butanol via an SN2 mechanism, with inversion of configuration at the chiral center (Walden inversion), and correctly noted that aqueous conditions favor substitution over elimination. The rejected response predicted the E2 elimination product (but-2-ene) as the major product, which is incorrect because SN2 is favored for primary and secondary substrates with strong nucleophiles in polar protic solvents."
> *Works: Names product, mechanism, stereochemical outcome, and reason.*

> **Law — Employee terminated for social media criticism of employer**
>
> ❌ Weak: "The chosen response provided a more legally accurate analysis."
> *Fails: Every reader already knows you thought the chosen response was more accurate.*
>
> ✅ Strong: "The chosen response correctly identified that First Amendment protections apply only to government action, not private employer conduct, and therefore a private-sector employee has no viable First Amendment claim in this scenario. It also appropriately noted that the employee may have protection under the NLRA if the post constituted protected concerted activity. The rejected response incorrectly analyzed this as a First Amendment case without identifying the threshold state-action doctrine issue, rendering its analysis legally unsound."
> *Works: Names specific doctrine (state-action), identifies secondary protection (NLRA), explains where reasoning broke down.*

### When the Responses Are Close (Score 3 or 5)

Your justification should still be specific — but it can be shorter:

> "Both responses correctly solved the problem, but the chosen response's step-by-step derivation is easier to follow because it labels each algebraic transformation. The rejected response presents the same steps without annotation, which makes it harder to verify the reasoning."

You do not need to manufacture a large distinction when a small one exists. Just be honest and specific about what the small difference actually is.

### Quick Checklist Before You Submit

- [ ] Did I say "chosen response" and "rejected response" — not A or B?
- [ ] Did I give at least one specific reason (not just "better" or "more accurate")?
- [ ] Did I explain what the rejected response got wrong, not just praise the winner?
- [ ] Is my justification 2–5 sentences?
- [ ] Does my justification match my score? (If I scored 1 or 7, does it read like a decisive difference?)

### Key Takeaways — Justifications

- **Never use "Response A" or "Response B"** — always say "the chosen response" and "the rejected response"
- Lead with the specific reason the chosen response was better — name the exact feature, step, or argument
- Explain what the rejected response got wrong, not just why the winner was good
- Reference specific content from the responses — names, formulas, doctrines, techniques
- Target 2–5 focused sentences; longer is not better
- Your justification should be specific enough that a reader could infer your score without seeing it

---

## Rewrite Trigger Categories

### The Core Rule

After choosing your preferred response, check it for fixable presentation errors. If any of the five triggers below are present in the **chosen response**, you must rewrite it to correct them.

- **Only rewrite the chosen response** — never the rejected one
- If none of the five categories apply, **do not rewrite**
- There is no "optional improvement" rewrite — either a specific trigger is present, or it is not
- Fix the specific issue and leave everything else exactly as it is

### The Five Triggers

**Trigger 1: Broken LaTeX / Math Rendering**

Malformed mathematical expressions that would fail to render or render incorrectly.

- Unclosed environments (e.g., `\begin{equation}` without `\end{equation}`)
- Wrong or mismatched delimiters (e.g., using `$` inside a double-dollar block)
- Missing braces (e.g., `\frac{x{y}` instead of `\frac{x}{y}`)
- Incorrect command names (e.g., `\intergral` instead of `\int`)

**Trigger 2: Broken Markdown / Code Formatting**

Formatting errors that would cause the response to render incorrectly.

- Unclosed code fences (a ` ``` ` block that is never closed)
- Wrong language tags on code blocks (e.g., ` ```python ` containing JavaScript)
- Broken numbered list structure (e.g., 1, 2, 4, 4 instead of 1, 2, 3, 4)
- Unclosed bold or italic markers (`**text` with no closing `**`)

**Important:** Fix the formatting structure only. Do not rewrite the code logic.

**Trigger 3: Non-Standard Notation & Symbol Misuse**

The math or content is correct, but the symbols or variable names are wrong or misleading relative to well-established field conventions.

- Using a non-standard symbol where a universal standard exists
- Using a symbol that means something different in the field
- Notation that would confuse a domain expert even though the underlying idea is right

**Important:** Do not "fix" notation that is non-standard but unambiguous in context. Only fix cases where using the wrong symbol could actively mislead a reader in the field.

**Trigger 4: Structure & Layout Issues**

The content is correct, but the organization makes it materially harder to read, use, or verify.

- Information presented as a wall of prose when a table or list would be clearer
- Steps presented out of logical order
- Missing headers on a long response that would benefit from structure
- A feature comparison written as two paragraphs instead of a table

> **Example:**
> *Before:* "The reaction can proceed via SN1 or SN2 depending on the substrate. SN2 occurs with primary substrates, inverts configuration, is bimolecular, and favored by polar aprotic solvents. SN1 occurs with tertiary substrates, may racemize, is unimolecular, and favored by polar protic solvents."
> *After:* Reformatted as a table with columns: Mechanism | Substrate | Stereochemistry | Kinetics | Solvent

**Important:** This is about organization, not content. Do not add new information.

**Trigger 5: Random Tokens, Language Switching, or Garbled Text**

The response contains artifacts that suggest a rendering or generation error.

- Random symbols or tokens mid-sentence (e.g., "The integral converges %%%CITE%%% when...")
- Unexpected language switching mid-response (e.g., shifting from English to French mid-explanation)
- Garbled or repeated text that appears to be a copy-paste artifact

> **Example:**
> *Before:* "The eigenvalues are λ₁ = 2 and λ₂ = 3. Die Eigenvektoren können berechnet werden durch... The eigenvectors are thus [1,0] and [0,1]."
> *After:* Full response in English, removing the German fragment.

**Important:** Fix only the artifacts. Preserve all the substantive mathematical or scientific content.

### Key Takeaways — Rewrite Triggers

- A rewrite is triggered only by one of these five specific categories — not by general preference
- You only ever rewrite the chosen response, never the rejected one
- Fix the specific issue and leave everything else exactly as it is
- Broken LaTeX and non-standard notation are the most common triggers in expert-domain tasks
- Structure fixes are about organization, not content — do not add new information

### When NOT to Rewrite

**The most important rule:** A rewrite is a technical correction, not an improvement. If you are rewriting to make the response *better*, you are doing it wrong.

**Do NOT rewrite because you disagree with the content:**
> The chosen response solves a differential equation using separation of variables. You would have used an integrating factor. Both methods are valid. Do not rewrite to use your preferred technique.

**Do NOT rewrite to add content:**
> The chosen response correctly answers a pharmacology question but does not mention a relevant drug interaction. Do not add it. Note it in your justification instead.

**Do NOT rewrite the rejected response:**
> Even if it has broken LaTeX — leave it alone. Only the chosen response gets rewritten. The rejected response will not be used as training data.

**Do NOT rewrite for minor style preferences:**
- Different but valid sentence structure → not a trigger
- A slightly different but correct word choice → not a trigger
- Using a comma where you would use a semicolon → not a trigger
- Writing in a more formal register than you prefer → not a trigger

**Do NOT rewrite to fix factual errors:**
> If the chosen response has a wrong final answer but is still better overall, you cannot rewrite to fix the math. Fixing factual content would mean replacing the model's output with your own. Note the error in your justification instead.

### The Decision Tree

1. **Is this issue in one of the five categories?**
   - Broken LaTeX → rewrite
   - Broken markdown/code → rewrite
   - Non-standard notation → rewrite
   - Structure/layout hurts readability → rewrite
   - Random tokens/language switching → rewrite
   - Anything else → **no rewrite**
2. **Am I changing content or just fixing presentation?**
   - Only fixing rendering, symbol, or layout → OK to rewrite
   - Adding information, changing the argument, correcting the math → **stop, not your job**
3. **Is this the chosen response?**
   - Yes → proceed
   - No → **stop**

### Quick Test

> "If I showed this fix to the model that wrote the response, would it say 'yes, that was a typo/formatting error' or 'no, that's how I intended it'?"
> A true rewrite trigger is something the model would agree was unintentional. A content change is something the model intended.

### Key Takeaways — When NOT to Rewrite

- Do not rewrite to add content, fix factual errors, or substitute your preferred approach
- Do not rewrite the rejected response under any circumstances
- Minor stylistic preferences are not rewrite triggers
- The rewrite fixes objective, mechanical presentation errors only
- If in doubt, don't rewrite — a missing rewrite is less harmful than an over-rewrite

---

## How to Rewrite Well

### Core Principle: Minimal Intervention

Fix the specific issue and change nothing else. Every word, sentence, argument, and structure that was not the source of the problem should be preserved exactly.

**Think of it like a code diff.** A good rewrite has a small, targeted diff. A bad rewrite has a massive diff that touches things it didn't need to touch.

### How to Approach Each Trigger

**Broken LaTeX / Math Rendering**
- Fix the syntax error (mismatched brace, missing `\end{}`, wrong delimiter) — leave mathematical content unchanged
- Do NOT restructure the argument, change step order, or add explanatory text

> *Before:* `$x = \frac{-b \pm \sqrt{b^2 - 4ac}{2a}$`
> *After:* `$x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}$`
> One closing brace added. Nothing else changed.

**Broken Markdown / Code Formatting**
- Close unclosed fences, fix language tags, correct list numbering — leave code content exactly as written
- Do NOT fix bugs, improve variable names, add comments, or restructure functions

> *Before:* ` ```javascript ` block with missing closing fence
> *After:* Add the closing ` ``` `. Code itself untouched.

**Non-Standard Notation**
- Replace the non-standard symbol with the field-standard one consistently throughout
- Do NOT rewrite surrounding explanation or change the mathematical argument

> *Before:* "The acid dissociation constant $K_b = \frac{[H^+][A^-]}{[HA]}$..."
> *After:* "The acid dissociation constant $K_a = \frac{[H^+][A^-]}{[HA]}$..."
> Symbol corrected. Everything else unchanged.

**Structure & Layout**
- Reorganize the same information into a clearer format (table, headers, reordered steps)
- Do NOT add new information, cut content, or change level of detail

> *Before:* Wall of prose comparing SN2 and SN1 reactions
> *After:* Table with columns: Feature | SN2 | SN1 — every piece of information preserved, nothing added or removed.

**Random Tokens / Language Switching**
- Remove artifacts and restore linguistic continuity
- Do NOT rewrite surrounding paragraphs or change content from the garbled section

> *Before:* "The stress tensor is symmetric, σᵢⱼ = σⱼᵢ. Der Beweis folgt direkt aus dem Hookeschen Gesetz. This means that only six independent components are needed."
> *After:* "The stress tensor is symmetric, σᵢⱼ = σⱼᵢ. This means that only six independent components are needed."
> German fragment removed. Surrounding sentences joined. Nothing else changed.

### Multiple Triggers in One Response

If more than one trigger is present, fix all of them in a single rewrite pass. Do not do separate rewrites. Still change only what those triggers require — nothing more.

### Key Takeaways — How to Rewrite Well

- Minimal intervention: fix only what the trigger requires, leave everything else exactly as written
- A good rewrite has a small diff — targeted changes only
- Do not fix code bugs, improve arguments, or add information while doing a structural rewrite
- If multiple triggers are present, fix all of them in one pass
- When in doubt: less is more

---

## Full Task Walkthrough

### Step 0: Verify You Are Qualified

**CRITICAL:** Before doing anything else, confirm the task falls within your domain of expertise. If the prompt covers a subject area you are not qualified to evaluate — **exit and abandon the task immediately.** Do not attempt to score, justify, or submit work outside your expertise.

### The Five Steps in Order

1. **Read the prompt carefully** — understand what is being asked
2. **Read both responses fully** — do not score until you have read both
3. **Assign a score** (1 to 7)
4. **Write your justification** (chosen/rejected, 2–5 sentences, specific)
5. **Identify the rewrite trigger category** (or select "N/A — No rewrite needed") and explain any issues found

### Worked Example 1: No Rewrite Needed (Medicine)

> **Prompt:** A 34-year-old woman with no prior psychiatric history presents with 3-week history of depressed mood, anhedonia, hypersomnia, 6-lb weight gain, and difficulty concentrating. She denies suicidal ideation. She recently lost her job. What is the most appropriate initial management?
>
> **Response A:** Identifies MDD using DSM-5 criteria, recommends SSRI (sertraline 50mg), CBT referral, PHQ-9 baseline, safety assessment, 2–4 week follow-up.
>
> **Response B:** Vague — attributes presentation to job loss without naming diagnosis, recommends "antidepressant medication" without specifics, suggests therapy without naming type, no follow-up timeline.
>
> **Score: 1** (strongly prefer A)
>
> **Justification:** "The chosen response correctly identified the presentation as meeting DSM-5 criteria for major depressive disorder and recommended appropriate first-line management: an SSRI (sertraline with a starting dose), CBT referral, PHQ-9 baseline assessment, and a 2–4 week follow-up — all consistent with evidence-based guidelines. The rejected response attributed the presentation to a situational stressor without naming the diagnosis, recommended medication non-specifically without naming a drug class or dose, and gave no concrete follow-up timeline, making it insufficiently actionable for clinical use."
>
> **Rewrite trigger category:** N/A — No rewrite needed
> **Explanation:** The chosen response contains no broken LaTeX, markdown errors, non-standard notation, structure issues, or garbled text. No rewrite is required.

### Worked Example 2: Rewrite Required (Mathematics)

> **Prompt:** Evaluate ∫₀^{π/2} sin²(x) dx
>
> **Chosen Response:** Uses the identity `$\sin^2(x) = \frac{1 - \cos(2x){2}$` — note the missing closing brace. The rest of the math is correct, arriving at π/4.
>
> **Rewrite trigger category:** Broken LaTeX / Math Rendering
> **Explanation:** The `\frac` command on the first line is missing a closing brace before the denominator — `\frac{1 - \cos(2x){2}` should be `\frac{1 - \cos(2x)}{2}`. This causes the expression to render incorrectly.
>
> **The Rewrite:** One brace added. Everything else unchanged. Minimal intervention.

### Key Takeaways — Full Task Walkthrough

- Always verify you are qualified for the domain before starting — exit and abandon if not
- Always read both responses fully before assigning a score
- Follow the steps in order: score → justify → identify trigger category → explain the issue (or confirm N/A)
- A strong justification names specific clinical details, techniques, formulas, or doctrines
- Always explicitly select the rewrite trigger category — even when the answer is "N/A — No rewrite needed"
- Most responses will not require a rewrite, but you must still confirm this explicitly

---

## Claiming Tasks That Match Your Expertise

### Finding Available Tasks

1. Go to your **Handshake AI dashboard** → click **View project** under Project Alloy
2. Click the **Available tasks** tab at the top of the task list
3. Use filters to narrow to your expertise:
   - **L1_domain** — broad field (e.g., Biology)
   - **L2_domain** — specific subfield (e.g., Cell Biology)
   - **Difficulty** — matches your level (e.g., Master's)

### Only Work on Tasks in Your Domain

You must only work on tasks within your area of expertise. If a task covers a subject you are not qualified to evaluate — even if you think you could "figure it out" — do not attempt it.

### What to Do If You Claim the Wrong Task

If you realize after reading the prompt that the task is outside your expertise:

1. Click **Exit** in the top-right corner of the task
2. Select **Abandon**

This releases the task back to the pool. **There is no penalty for abandoning** — but there is a cost to submitting low-quality annotations on topics you're not qualified to evaluate.

**When in doubt, abandon.** Always better to release a task than to submit a poor annotation.
