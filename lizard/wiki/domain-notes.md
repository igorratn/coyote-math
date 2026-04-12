# Domain Notes

## Image Type Patterns

### Handwritten Text Images
- Unclear if these are usable. Example: Plot_Organic_chemistry_charts_49.json had all handwritten text.
- When in doubt, flag to project leads before reviewing (Laiba J. raised this Apr 5).

### Line Charts — Continuous Lines
- Local peaks on smooth/continuous lines = ambiguous (Type 3: fine-grained precision)
- Fix: convert to MCQ or add "approximate" qualifier
- Intersection questions: be careful with lines that never intersect — answer of 0 from non-existence is bad

### Dense Tables / Complex Charts
- Information-rich images should have more than 1 annotation
- Character/letter counting on axis labels is a common but tedious prompt pattern
- Verify counts carefully — spaces may or may not count as characters depending on wording

## Model Behavior Notes (Apr 2026)
- Model is reportedly getting smarter — annotators noting it answers more things correctly now (Maweir M., Apr 5)
- Model outage on Apr 7 — not generating answers. SuperAnnotate team working on fix.
- Remember: model fails once = valid failure. Don't reject just because model sometimes gets it right across regenerations.

(Notes on specific chart/graph/table types and their common pitfalls)
