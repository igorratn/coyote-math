# Phoenix Response Analysis Prompt

When analyzing model responses to a Phoenix True/False proof problem, evaluate each response on these criteria:

## 1. Verdict
What does the model conclude — True or False?

## 2. Correctness
Compare to the correct answer (found in the problem's .md file in the repo, after the problem statement). Is the verdict right or wrong?

## 3. Reasoning Quality (only if verdict is wrong)
Identify the SPECIFIC error:
- Did the model apply a formula that doesn't hold in this context?
- Did the model confuse two different mathematical objects?
- Did the model use an identity outside its domain of validity?
- Did the model make a sign/factor error in a derivation?
- Did the model assume something that isn't true?
- Did the model cite a false reference or fabricate a result?

## 4. Reasoning Quality (only if verdict is correct)
Is the proof actually valid, or did the model get the right answer for the wrong reason?
- A correct verdict with a flawed proof still counts as a stumble for Phoenix purposes.

## Report Format
For each response:
```
Response N: [True/False] — [CORRECT/WRONG] — [one-line summary of error if wrong, or "valid proof" if correct with valid reasoning]
```

Then:
```
Summary: X/4 stumbled (Responses N, M, ...)
```

A model "stumbled" if it got the wrong verdict OR got the right verdict with fundamentally flawed reasoning.
