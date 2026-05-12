# Shadow Task: 9cfaf1f9

- **SA Task ID:** Financial_Index_fund_charts_33.json
- **Annotation:** 1
- **Cycle:** 1
- **Rating:** Approve
- **Fired at:** 2026-05-12T14:49:44.336Z
- **HAI Link:** https://ai.joinhandshake.com/annotations/fellow/task/9cfaf1f9-e901-4807-a3ba-f9b7cf0911e3/run
- **Status:** ✅ submitted
- **Verdict source:** auto
- **HAI LLM eval:** warning
- **HAI LLM comment:** While you correctly used the phrase "strictly above" for the blue line, you used the word "below" for the orange line without specifying if the boundary is included or excluded. Per the evaluation rules, boundary words like "over", "under", "below", or "less than" must specify whether the boundary value is included. Please change "below" to "strictly below" to resolve this. Otherwise, the annotati
- **Review file:** [Financial_Index_fund_charts_33.md](../Financial_Index_fund_charts_33.md) → Annotation 1

## Prompt
Focus only on the line chart and only on the dates printed as x-axis labels. Identify the labeled dates where the blue “FFI: Index Equity” line is strictly above the gray 50 line while the orange “FFI: Active Equity” line is below the gray 50 line. Count those dates, then multiply that count by the number of line series shown in the legend. Answer as a single number, e.g., 6.

## Rewrite Answer
9
