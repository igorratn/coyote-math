# Fire-stem run report — Financial_Index_fund_charts_149

**Log:** `/Users/iratnere/dev/coyote-math/lizard/logs/fire/1778611219-Financial_Index_fund_charts_149.log`
**Attempts:** 1 (fired 0, abort 1, incomplete 0)

## Attempt ledger

| Annot | Status | UUID | eval | signature |
|---|---|---|---|---|
| A1 | abort | `—` | — | waitForFunction |

## Abort taxonomy

- **waitForFunction** × 1 — timeout waiting for DOM element
  - Gate to audit: `check HAI page state; consider longer timeout`

## Fragility flags

- CRITICAL: 0 fires, all attempts aborted
- HIGH: abort rate ≥ 50%

## Suggested action

- Inspect the gate(s) listed under Abort taxonomy.
- If the same signature appears 2+ times in this run, treat as regression.
- Open the full log: `/Users/iratnere/dev/coyote-math/lizard/logs/fire/1778611219-Financial_Index_fund_charts_149.log`
