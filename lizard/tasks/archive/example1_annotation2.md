# New Annotation for Example 1 (Receipt)

## Image
Receipt with 6 line items (ARTICLE #, QTY, PRICE, AMOUNT columns)

## Prompt
Looking at row 4 of the receipt (SPORREN CHR FRM), if only 1 unit were purchased instead of the quantity shown, how much would the total cost **decrease**? Provide your answer in decimal format to the nearest hundredth (e.g., 50.00).

## Rewrite Answer
75.00

## Skills
Attribute Perception, Spatial Reasoning, Math Reasoning, Table/Chart/Graph Understanding

## Math Verification
- Row 4: SPORREN CHR FRM, QTY=4, PRICE=25.00, AMOUNT=100.00
- Current total: 4 × 25.00 = 100.00
- New total if QTY=1: 1 × 25.00 = 25.00
- Decrease: 100.00 - 25.00 = **75.00** ✓

## Stumble Logic
1. **Premature Confidence:** Model reads row 4 and might grab PRICE (25.00) as the answer, or calculate current total (100.00) and confuse it with the answer
2. **No Easy Bypass:** Must locate row 4 → read QTY and PRICE → compute current total → compute new total → subtract in correct direction
3. **Differentiation from Existing Annotation:** Existing targets row 1 with unit price recalculation (2 units vs 4). This targets row 4 with total decrease calculation (1 unit vs current) — different row, different operation

## Checklist
- [x] Type 6: "decrease" — direction unambiguous
- [x] Type 8: "nearest hundredth" + example "50.00"
- [x] Table/Chart/Graph Understanding tagged
- [x] Short answer with example format
- [x] 2+ skills required
- [x] Single verifiable answer
- [x] Self-contained in image
