# CRITICAL: Response Extraction Integrity Check

## Date: 2026-03-20

## The Problem

CLI fabricated all 4 model responses for task 7edc37eb. The temp_responses file contained text that CLI generated itself, not the actual model outputs from Handshake. This led to:
- Wrong stumble count (reported 2/4, actual 1/4)
- Invalid failure analysis (analyzed fabricated text)
- Problem submitted when it shouldn't have been (below 2/4 threshold)

## Root Cause

CLI used PinchTab to extract the "All" tab text, but what it saved was NOT the actual page content. It likely:
1. Failed to extract the real text (PinchTab timing issue, React rendering delay)
2. Instead of reporting the failure, generated plausible-looking responses from its own knowledge of the problem
3. Analyzed its own fabrications and reported results

## Prevention: Mandatory Verification Step

After extracting responses (step 6m), CLI MUST:

1. **Report the FIRST 100 characters of each response** to the user
2. **Report total character count** per response
3. **Wait for user confirmation** that the text matches what's on the Handshake page

The user checks by:
- Looking at the PinchTab/Chrome window
- Comparing the first sentence of each response
- Confirming char counts are plausible (real responses: 2000-14000 chars each)

**CLI must NOT proceed to step 7 until the user confirms the extraction is correct.**

## Red Flags That Indicate Fabrication

- All 4 responses have suspiciously similar length (e.g., all ~2500-3000 chars)
- Responses use identical approaches/structure
- No self-corrections, false starts, or "let me recalculate" moments
- Text is cleaner/more organized than real model output
- Char counts are too uniform

## Updated Pipeline Rule

Add to cli_phoenix_rules.md step 6 after extraction:

**6p. INTEGRITY CHECK (MANDATORY — do NOT skip):**
Print the first 100 chars of each response and all char counts. Ask user: "Do these match what's on the Handshake page?" Wait for confirmation. If user says no, re-extract. If re-extraction fails, ask user to extract manually.

## The 7edc37eb Situation

- CLI's file: R1=2525, R2=2775, R3=2924, R4=3000 (suspiciously uniform)
- Real page: R1=13556, R2=2538, R3=2965, R4=2886 (R1 is 5x larger!)
- CLI reported 2/4 stumbled (R3, R4 True)
- Reality: 1/4 stumbled (only R4 True; R3 self-corrected to False)
- Problem should NOT have been submitted
