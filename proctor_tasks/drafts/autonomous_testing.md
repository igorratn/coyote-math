# Proctor Rapid Testing — Autonomous Workflow

You are helping Igor test physics problems on the Handshake AI sandbox to find problems that trip frontier AI models.

## Your Goal
Generate and test 10 physics/math problems. For each problem:
1. Design a problem inspired by recent arXiv papers on exactly solvable quantum mechanics (NU method, Morse, Rosen-Morse, Pöschl-Teller, Woods-Saxon, Hulthen, Kratzer, Scarf potentials) OR classical physics (beams, acoustics, heat transfer, waveguides)
2. BEND the problem — change one parameter, add an asymmetric term, use a different regime, combine two potentials, use a non-standard boundary condition — so the standard textbook formula gives a WRONG answer
3. Write the prompt in KaTeX format (escape dollar signs for CLI)
4. Navigate to https://ai.joinhandshake.com/fellow/projects, start a new Proctor sandbox task
5. Paste the prompt, submit, click Continue, wait for Model A to finish
6. Check ONLY whether Response 1 and Response 2 DISAGREE on the final answer
7. Report: problem description, both answers, whether they agree or disagree
8. Move to the next problem

## Key Principles
- Do NOT solve the problem yourself first — just fire it at Model A
- DISAGREEMENT between Response 1 and Response 2 = signal that the problem might work
- AGREEMENT = problem probably too easy, move on
- Problems should state physical conditions, NOT name the solution method
- No hints like "use the Nikiforov-Uvarov method" or "this is a Klein-Gordon equation"
- KaTeX math notation required
- Each problem gets a NEW sandbox task

## Problem Design Strategies (pick different ones for variety)
1. Take a known potential, add an asymmetric or anharmonic term
2. Use parameters where a standard approximation (e.g., centrifugal) breaks down
3. Combine two domains (e.g., quantum + electromagnetic, acoustic + thermal)
4. Change boundary conditions from the textbook case without stating the BC type
5. Use a regime where relativistic effects matter but the problem looks non-relativistic
6. Ask for a quantity that requires knowing the NUMBER of bound states (finite vs infinite)
7. Use a composite system where interface matching conditions change eigenvalues
8. State a problem in one coordinate system that's usually solved in another

## Handshake Sandbox Workflow
- Navigate to https://ai.joinhandshake.com/fellow/projects
- Click "Start task" for Project Proctor (Sandbox Environment)
- Dismiss timer dialog (click "Start timer")
- Find the textarea, paste the prompt using evaluate_script with nativeInputValueSetter
- Click Submit (the up-arrow button)
- Click Continue to generate Model A
- Wait for "Generate Model B" text to appear (= Model A done)
- Click the "All" tab to show both responses
- Read both responses and extract Final Answer values
- Report results
- Do NOT generate Model B unless specifically asked

## Start now — design and test 10 problems!
