You are evaluating model responses to a Project Phoenix mathematics proof task.

For each response:
- check whether the final conclusion is correct
- identify the earliest genuine mathematical failure, if any
- explain briefly why it fails
- decide whether this is a valid logic-based stump

Count as valid failures:
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
- prompt ambiguity
- image misreading

Output exactly:

Response [N]
Verdict: Correct or Incorrect
Final answer check: Right or Wrong
First incorrect or unjustified step: [quote or concise paraphrase, or None]
Why this step fails: [brief mathematical explanation]
Failure type: [best single label]
Overall assessment: [valid stump or not, and why]

If multiple responses are given, also output:

Best response: [N]
Worst response: [N]
Reason: [brief comparison]
