# Proctor Rapid Testing — Workflow v3

## Speed-Optimized Loop

For each problem:
1. Design problem with a known TRAP (standard formula that gives wrong answer)
2. Know what the TRAP answer is (what standard approach gives)
3. Fire at Model A — DON'T compute correct answer yet
4. Read both responses:
   - If they DISAGREE → flag immediately, compute correct answer to check
   - If they AGREE on the TRAP answer → PROMISING! Both fell for it. Compute correct answer to verify.
   - If they AGREE on something OTHER than the trap → compute correct answer to check
5. Move to next problem

## Key Insight
- We know the TRAP answer without solving (it's the standard textbook result)
- If both models give the TRAP answer, we have a candidate
- Only need to fully solve the problem to confirm it's actually wrong
- This lets us test 3-5x more problems per session

## What to report:
```
PROBLEM N: [description]
Trap answer: Y (standard formula)
R1: Z1 | R2: Z2
STATUS: DISAGREE / BOTH MATCH TRAP / BOTH PASS / UNKNOWN
→ If promising: compute correct answer and verify
```
