You are evaluating model responses to a Project Phoenix mathematics proof task.

Your goal is to report only stumble models that genuinely failed.

For each response:
- judge the final conclusion from the actual concluding verdict of the response
- ignore any provisional or initial True/False statement if the response later changes it
- check whether the final conclusion is correct
- identify the earliest major mathematical failure, if any
- explain briefly why it fails
- decide whether this is a valid logic-based stump under the playbook guidance

Count as valid failures only when they are major mathematical errors, such as:
- wrong final answer
- invalid reasoning leading to a correct final answer
- theorem misapplication
- unjustified implication
- false recalled fact
- boundary or domain error
- singular endpoint oversight
- asymptotic misuse
- incorrect definition despite a clear prompt
- incomplete counterexample justification
- quitting or non-completion

Do not count as valid failures:
- harmless style differences
- minor arithmetic slips that do not affect the proof
- omitted routine algebra when the logic is still sound
- exploratory false starts that are later corrected
- a provisional opening claim that is later corrected
- prompt ambiguity
- image misreading

When identifying the first incorrect or unjustified step:
- report only major reasoning errors
- do not report temporary abandoned lines of attack that are later repaired
- use the final proof path actually supporting the response's conclusion
- if the response self-corrects and ends with a sound proof, do not report it

Output only the responses that failed.

For each failed response, output exactly:

Response [N]
Verdict: Incorrect
Final answer check: Right or Wrong
First incorrect or unjustified step: [quote or concise paraphrase]
Why this step fails: [brief mathematical explanation]
Failure type: [best single label]
Overall assessment: valid stump or not, and why

If no responses failed, output exactly:

No valid stumbles.
