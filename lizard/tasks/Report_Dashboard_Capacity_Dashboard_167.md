# Review: Report_Dashboard_Capacity_Dashboard_167

## Task Info
- **SA Task Filename:** `Report_Dashboard_Capacity_Dashboard_167.json` (HAI shadow task "Task ID" field)
- **SA Internal Task ID:** 187110202 (numeric — from editor URL, cross-ref only)
- **Image:** `screenshots/Report_Dashboard_Capacity_Dashboard_167.png` — Agent availability dashboard (Zendesk) with 7 filter dropdowns (all "is any value"), Email/Messaging/Voice sections each showing 25 agents available; Agent capacity donuts (Email: 34% Used/66% Spare; Messaging: 100% Spare; Voice: 100% Spare); Agent statuses table (Online=25, Offline=4).
- **Date:** 2026-04-15
- **Review Cycle:** 1st (status log: Shyla Hardwick 2026-04-15 Submit_to_QC)

## Annotations

### Annotation 1
- **Shadow Task:** ✅ submitted — [896df636](shadows/896df636.md)
- **Rating:** thumbs-up
- **Question:** SAQ — |sum of digits in Agent statuses table − sum of digits in Agent capacity for email box|
- **Skills Tagged (original):** Attribute Perception, Spatial Reasoning, Math Reasoning, Logical Reasoning, Table/Chart/Graph Understanding, Short answer question
- **Skills Tagged (revised):** Attribute Perception, Spatial Reasoning, Math Reasoning, Logical Reasoning, Table/Chart/Graph Understanding, Short answer question
- **Question Type:** SAQ
- **Model Generated Answer:** 4
- **Rewrite Answer:** 8

#### Two-Part Check
1. **Question Check:**
   - Guidelines violated: none
   - Error types found: none. "Sum of digits" is unambiguous; both sources are clearly named. CMW passed.
2. **Answer Check:**
   - Math verified: Agent statuses table digits: 25 (Online) → 2+5=7; 4 (Offline) → 4. Sum = 11. Email capacity donut digits: 34 → 3+4=7; 66 → 6+6=12. Sum = 19. |11 − 19| = 8 ✓. Model got 4 (likely summed only one value per source or made counting error). Stumped ✓.

#### Full Prompt
What is the absolute difference between the sum of the digits in the 'Agent statuses' table and the sum of the digits in the 'Agent capacity for e...' box on this image?  Ignore percent signs. Answer using a number (e.g. 25).

#### Rewrite Answer
8

#### Edits Made (if any)
None.

#### Feedback
N/A

---

### Annotation 2
- **Shadow Task:** ✅ submitted — [18e29019](shadows/18e29019.md)
- **Rating:** thumbs-up
- **Question:** SAQ — |count of fully visible "Agent" occurrences − sum of all digits in image| (ignore decimal points and %)
- **Skills Tagged (original):** Attribute Perception, Spatial Reasoning, Math Reasoning, Logical Reasoning, Table/Chart/Graph Understanding, Short answer question
- **Skills Tagged (revised):** Attribute Perception, Spatial Reasoning, Math Reasoning, Logical Reasoning, Table/Chart/Graph Understanding, Short answer question
- **Question Type:** SAQ
- **Model Generated Answer:** 47
- **Rewrite Answer:** 44

#### Two-Part Check
1. **Question Check:**
   - Guidelines violated: none
   - Error types found: none. Case insensitivity explicitly stated; excludes decimal points and %. CMW passed.
2. **Answer Check:**
   - Math verified: "Agent" occurrences (exact word, case-insensitive): "Agent availability" (heading), "Agent" (filter), "Agent status" (filter), "Agent capacity for e...", "Agent capacity for m...", "Agent capacity for vo...", "Agent availability" (left nav), "Agent statuses" (table heading), "Agent status" (table column) = 9 occurrences. Digit sum (ignore %): 25+25+25 (agent sections) + 34+66 (email donut) + 100+100 (messaging/voice donuts) + 25+4 (table) = digit sums: 7+7+7+7+12+1+1+7+4 = 53. |9 − 53| = 44 ✓. Model got 47 (different count or digit sum). Stumped ✓.

#### Full Prompt
What is the absolute difference between the number of fully visible occurrences of the word "Agent" and the sum of all digits in the image? Ignore decimal points and percent signs. Ignore case sensitivity. What is the final output? Answer with a single integer (e.g., 25).

#### Rewrite Answer
44

#### Edits Made (if any)
None.

#### Feedback
N/A

---

### Annotation 3
- **Shadow Task:** ✅ submitted — [d89c31fd](shadows/d89c31fd.md)
- **Rating:** thumbs-up
- **Question:** SAQ — (blue numbers count × fully gray circular charts count) − total circular charts count
- **Skills Tagged (original):** Attribute Perception, Spatial Reasoning, Math Reasoning, Logical Reasoning, Table/Chart/Graph Understanding, Short answer question
- **Skills Tagged (revised):** Attribute Perception, Spatial Reasoning, Math Reasoning, Logical Reasoning, Table/Chart/Graph Understanding, Short answer question
- **Question Type:** SAQ
- **Model Generated Answer:** 5
- **Rewrite Answer:** 7

#### Two-Part Check
1. **Question Check:**
   - Guidelines violated: none
   - Error types found: none. Color-based identification (blue numbers, gray donuts) is unambiguous given the clear visual contrast. CMW passed.
2. **Answer Check:**
   - Math verified: Blue numbers: 25 (Email section), 25 (Messaging section), 25 (Voice section), 25 (table Online), 4 (table Offline) = 5 blue numbers. Fully gray circular charts: Messaging donut (100% gray) and Voice donut (100% gray) = 2. Total circular charts = 3 (Email + Messaging + Voice). (5 × 2) − 3 = 7 ✓. Model got 5 (likely computed with 4 blue numbers: 4×2−3=5). Stumped ✓.

#### Full Prompt
Multiply the total number of blue numbers on the image by the total number of fully gray circular charts on the image then subtract the total number of circular charts from that total. What is the final output? Answer in a whole number (e.g. 5)

#### Rewrite Answer
7

#### Edits Made (if any)
None.

#### Feedback
N/A

---

### Annotation 4
- **Shadow Task:** ✅ submitted — [b4827704](shadows/b4827704.md)
- **Rating:** thumbs-up
- **Question:** SAQ — |count of "is any value" in Agent availability section − count of letter "i" in toolbar| (ignore case)
- **Skills Tagged (original):** Attribute Perception, Spatial Reasoning, Math Reasoning, Table/Chart/Graph Understanding, World Knowledge, Short answer question
- **Skills Tagged (revised):** Attribute Perception, Spatial Reasoning, Math Reasoning, Table/Chart/Graph Understanding, World Knowledge, Short answer question
- **Question Type:** SAQ
- **Model Generated Answer:** 10
- **Rewrite Answer:** 4

#### Two-Part Check
1. **Question Check:**
   - Guidelines violated: none
   - Error types found: none. Both counts reference specific, bounded regions. World Knowledge appropriate for recognizing software toolbar context. CMW passed.
2. **Answer Check:**
   - Math verified: "is any value" in Agent availability filter section = 7 (one per each dropdown: Brand, Queue, Group, Agent, Agent status, Channel type, Channel). Letter "i" in toolbar (top bar) = 3. |7 − 3| = 4 ✓. Model got 10 (miscounted). Stumped ✓. (Trusting annotator's verified count.)

#### Full Prompt
What is the absolute difference between the total number of times 'is any value' appears in the 'Agent availability' section and the number of times the letter 'i' appears in the toolbar of the image? Ignore case sensitivity. Answer using a number (e.g. 25).

#### Rewrite Answer
4

#### Edits Made (if any)
None.

#### Feedback
N/A

---

### Annotation 5
- **Shadow Task:** ✅ submitted — [f5a5f78d](shadows/f5a5f78d.md)
- **Rating:** thumbs-up
- **Question:** SAQ — |Online agents − Offline agents| × count of blue colored digits in image
- **Skills Tagged (original):** Attribute Perception, Spatial Reasoning, Math Reasoning, Logical Reasoning, Short answer question
- **Skills Tagged (revised):** Attribute Perception, Spatial Reasoning, Math Reasoning, Logical Reasoning, Short answer question
- **Question Type:** SAQ
- **Model Generated Answer:** 273
- **Rewrite Answer:** 189

#### Two-Part Check
1. **Question Check:**
   - Guidelines violated: none
   - Error types found: none. Online/Offline counts are exact table values; blue colored digit identification is unambiguous. CMW passed.
2. **Answer Check:**
   - Math verified: Online = 25, Offline = 4. |25 − 4| = 21. Blue colored digits (individual digit characters): 2,5 (Email 25) + 2,5 (Messaging 25) + 2,5 (Voice 25) + 2,5 (table Online 25) + 4 (table Offline 4) = 9 blue digits. 21 × 9 = 189 ✓. Model got 273 (21 × 13 = 273 — model overcounted blue digits, likely including donut percentage labels). Stumped ✓.

#### Full Prompt
Calculate the absolute difference between the total number of Agents Online and the number of Agents Offline then multiply that total by the number of blue colored digits on the image.  Answer using a number (e.g. 25).

#### Rewrite Answer
189

#### Edits Made (if any)
None.

#### Feedback
N/A

---

## Task Status
- **Status:** QC_Complete
- **Reason:** A1–A5 all thumbs-up — all stumped. Math verified for A1, A3, A5.
- **SA Applied (Cycle 1):** ✅ (legacy backfill 2026-04-18)

---

## Form-Fill Payload
Canonical payload for host jobs 2 (SA apply-review) and 3 (HAI shadow task). Host parses this section verbatim — do not reinterpret. Dumb executor.

```yaml
sa_task_filename: "Report_Dashboard_Capacity_Dashboard_167.json"
sa_internal_task_id: "187110202"
sa_status_proposed: QC_Complete   # host STOPS before setting; human confirms

annotations:
  - n: 1
    sa:
      rating: approve
      skills_check:   []
      skills_uncheck: []
      prompt_edits: null
      answer_final: "8"
      feedback: null
    hai:
      task_id_field: "Report_Dashboard_Capacity_Dashboard_167.json"
      role: Reviewing
      annotation_n: 1
      prompt: "What is the absolute difference between the sum of the digits in the 'Agent statuses' table and the sum of the digits in the 'Agent capacity for e...' box on this image?  Ignore percent signs. Answer using a number (e.g. 25)."
      image_ref: "screenshots/Report_Dashboard_Capacity_Dashboard_167.png"
      answer: "8"
  - n: 2
    sa:
      rating: approve
      skills_check:   []
      skills_uncheck: []
      prompt_edits: null
      answer_final: "44"
      feedback: null
    hai:
      task_id_field: "Report_Dashboard_Capacity_Dashboard_167.json"
      role: Reviewing
      annotation_n: 2
      prompt: "What is the absolute difference between the number of fully visible occurrences of the word \"Agent\" and the sum of all digits in the image? Ignore decimal points and percent signs. Ignore case sensitivity. What is the final output? Answer with a single integer (e.g., 25)."
      image_ref: "screenshots/Report_Dashboard_Capacity_Dashboard_167.png"
      answer: "44"
  - n: 3
    sa:
      rating: approve
      skills_check:   []
      skills_uncheck: []
      prompt_edits: null
      answer_final: "7"
      feedback: null
    hai:
      task_id_field: "Report_Dashboard_Capacity_Dashboard_167.json"
      role: Reviewing
      annotation_n: 3
      prompt: "Multiply the total number of blue numbers on the image by the total number of fully gray circular charts on the image then subtract the total number of circular charts from that total. What is the final output? Answer in a whole number (e.g. 5)"
      image_ref: "screenshots/Report_Dashboard_Capacity_Dashboard_167.png"
      answer: "7"
  - n: 4
    sa:
      rating: approve
      skills_check:   []
      skills_uncheck: []
      prompt_edits: null
      answer_final: "4"
      feedback: null
    hai:
      task_id_field: "Report_Dashboard_Capacity_Dashboard_167.json"
      role: Reviewing
      annotation_n: 4
      prompt: "What is the absolute difference between the total number of times 'is any value' appears in the 'Agent availability' section and the number of times the letter 'i' appears in the toolbar of the image? Ignore case sensitivity. Answer using a number (e.g. 25)."
      image_ref: "screenshots/Report_Dashboard_Capacity_Dashboard_167.png"
      answer: "4"
  - n: 5
    sa:
      rating: approve
      skills_check:   []
      skills_uncheck: []
      prompt_edits: null
      answer_final: "189"
      feedback: null
    hai:
      task_id_field: "Report_Dashboard_Capacity_Dashboard_167.json"
      role: Reviewing
      annotation_n: 5
      prompt: "Calculate the absolute difference between the total number of Agents Online and the number of Agents Offline then multiply that total by the number of blue colored digits on the image.  Answer using a number (e.g. 25)."
      image_ref: "screenshots/Report_Dashboard_Capacity_Dashboard_167.png"
      answer: "189"
```

**Host contract:**
- Job 2 (SA apply-review) → parse `annotations[].sa`. STOP before `sa_status_proposed`.
- Job 3 (HAI shadow) → one shadow task per `annotations[].hai` entry. STOP before Submit + Confirm time.
- Image upload = `upload_file` MCP tool. All other fields = `form_input` / checkbox toggles.
