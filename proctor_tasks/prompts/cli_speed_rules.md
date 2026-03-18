# CLI Speed Rules for Handshake Sandbox Testing
# Read this file FIRST before doing anything on Handshake.

## CRITICAL SPEED RULES — follow strictly:

1. NEVER take_snapshot. Use find or take_screenshot instead.
2. NEVER read the full page. Use find to locate specific elements.
3. Click buttons IMMEDIATELY after finding them. Do not analyze or plan.
4. Do not explain what you are doing. Just do it.
5. Never crystallize for more than 30 seconds. If you are planning, stop and act.
6. Maximum 2 screenshots per step. No redundant verification.

## REACT TEXTAREA RULES:
7. Do NOT use form_input for textareas — it won't work with React.
8. To paste text into a React textarea:
   a. Click the textarea to focus it
   b. Select all: cmd+a
   c. Type or paste the new text using the type action
9. For long text (>500 chars), use evaluate_script with nativeInputValueSetter:
   ```
   const el = document.querySelector('textarea');
   const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value').set;
   nativeSetter.call(el, 'YOUR TEXT HERE');
   el.dispatchEvent(new Event('input', { bubbles: true }));
   el.dispatchEvent(new Event('change', { bubbles: true }));
   ```

## SUBMITTING THE PROMPT:
10. The submit button is the ARROW ICON (↑) next to the textarea — NOT a "Submit" text button.
11. Find it with: find("arrow button") or find("send button"). Click immediately.
12. After the prompt renders, a "Continue" button appears. Click it IMMEDIATELY to generate Model A responses.

## WAITING FOR MODEL GENERATION:
13. After clicking Continue, wait 180 seconds first.
14. Then poll every 30 seconds using evaluate_script:
    document.body.innerText.includes('Response 1') || document.body.innerText.includes('Generate Model B')
15. Maximum 10 polls. If still not done, take a screenshot and report.

## EXTRACTING ANSWERS:
16. To get final answers, use evaluate_script:
    document.body.innerText.match(/\d{1,4}\s*MeV/g)
    Or for general answers: search for "Final Answer" in the page text.

## AFTER MODEL A:
17. STOP after Model A finishes. Report the final answers to the user.
18. WAIT for the user to say "generate Model B" before clicking anything.
19. When told to generate Model B, find "Generate Model B" or "Continue" button and click immediately.

## SANDBOX WORKFLOW (step by step):
1. Navigate to sandbox URL
2. Find textarea → click → cmd+a → type/paste prompt
3. Find arrow icon → click to submit
4. Find "Continue" button → click immediately
5. Wait 180s → poll with evaluate_script until done
6. Extract answers → report to user → STOP
7. (Only if user says so) Click "Generate Model B"
8. Wait 180s → poll → extract → report

## COMMON MISTAKES TO AVOID:
- Do NOT take_snapshot to find buttons. Use find instead.
- Do NOT use form_input on React textareas. Use click + cmd+a + type.
- Do NOT look for a button labeled "Submit". It's an arrow icon.
- Do NOT generate Model B without user permission.
- Do NOT take screenshots repeatedly to check if generation is done. Use evaluate_script.
- Do NOT explain your plan. Just execute.
