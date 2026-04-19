#!/usr/bin/env python3
"""
validate_payload.py — mechanical schema check for `tasks/<stem>.md` payload blocks.

Usage:
    python3 scripts/validate_payload.py tasks/<stem>.md
    python3 scripts/validate_payload.py tasks/<stem>.md --cycle 2

Exits 0 when all checks pass, 1 otherwise. Prints per-field errors.

Scope (intentionally narrow — mechanical drift catcher, not semantic reviewer):
  - `task_id` (top-level)           → numeric SA internal ID,     regex ^\\d+$
  - `hai.task_id_field` (per ann.)  → `<stem>.json` filename,     regex ^[A-Za-z0-9_\\-]+\\.json$
                                      AND equals `<stem>.json` derived from task filename
  - `sa.rating`                     → enum {thumbs-up, thumbs-down, deleted, unchanged}
  - `sa.feedback`                   → REQUIRED (non-empty string) iff rating in {thumbs-down, deleted}
  - `hai.role`                      → "Reviewing"
  - `hai.annotation_n`              → positive int, matches YAML `n`
  - Cross-field: every annotation entry has both `sa` and `hai` blocks

Not checked here (belongs to Job 2 walk-through / Job 3 apply re-check):
  - Cross-reference between payload YAML and per-annotation markdown
  - QC status ↔ ratings consistency
"""

import argparse
import re
import sys
from pathlib import Path

try:
    import yaml
except ImportError:
    print("ERROR: PyYAML required. Install with `pip install pyyaml --break-system-packages`.", file=sys.stderr)
    sys.exit(2)

TASK_ID_RE = re.compile(r"^\d+$")
FILENAME_RE = re.compile(r"^[A-Za-z0-9_\-]+\.json$")
VALID_RATINGS = {"thumbs-up", "thumbs-down", "deleted", "unchanged"}
FEEDBACK_REQUIRED = {"thumbs-down", "deleted"}


def extract_payload_block(text: str, cycle: int) -> str | None:
    """Extract the YAML body of the Form-Fill Payload section for the given cycle.

    Cycle 1 header: `## Form-Fill Payload`
    Cycle 2 header: `## Form-Fill Payload (Cycle 2)`
    YAML fenced with ```yaml ... ```
    """
    header = "## Form-Fill Payload (Cycle 2)" if cycle == 2 else "## Form-Fill Payload"
    # Find header, then next ```yaml block
    hdr_idx = text.find(header)
    if hdr_idx < 0:
        return None
    # Guard: for cycle 1 we must not accidentally match cycle-2 header
    if cycle == 1 and text.find("## Form-Fill Payload (Cycle 2)") == hdr_idx:
        # cycle-1 header not actually present
        return None
    tail = text[hdr_idx:]
    m = re.search(r"```yaml\n(.*?)\n```", tail, re.DOTALL)
    if not m:
        return None
    return m.group(1)


def derive_stem_json(task_path: Path) -> str:
    """`tasks/Foo_Bar_46.md` → `Foo_Bar_46.json`."""
    return task_path.stem + ".json"


def validate(payload: dict, expected_stem_json: str) -> list[str]:
    errors: list[str] = []

    # Top-level task_id
    top_task_id = payload.get("task_id")
    if top_task_id is None:
        errors.append("top-level `task_id`: missing")
    else:
        s = str(top_task_id)
        if not TASK_ID_RE.match(s):
            errors.append(f"top-level `task_id`: must be numeric (got {s!r})")

    anns = payload.get("annotations")
    if not anns:
        errors.append("`annotations`: missing or empty")
        return errors
    if not isinstance(anns, list):
        errors.append("`annotations`: must be a list")
        return errors

    for i, ann in enumerate(anns):
        prefix = f"annotations[{i}]"
        n = ann.get("n")
        if n is None:
            errors.append(f"{prefix}.n: missing")
        prefix = f"annotations[{i}] (n={n})"

        sa = ann.get("sa")
        hai = ann.get("hai")

        if not isinstance(sa, dict):
            errors.append(f"{prefix}.sa: missing or not a mapping")
        else:
            rating = sa.get("rating")
            if rating not in VALID_RATINGS:
                errors.append(
                    f"{prefix}.sa.rating: {rating!r} not in {sorted(VALID_RATINGS)}"
                )
            if rating in FEEDBACK_REQUIRED:
                fb = sa.get("feedback")
                if not (isinstance(fb, str) and fb.strip()):
                    errors.append(
                        f"{prefix}.sa.feedback: required non-empty string when rating={rating!r}"
                    )

        if not isinstance(hai, dict):
            errors.append(f"{prefix}.hai: missing or not a mapping")
        else:
            tid_field = hai.get("task_id_field")
            if tid_field is None:
                errors.append(f"{prefix}.hai.task_id_field: missing")
            else:
                s = str(tid_field)
                if not FILENAME_RE.match(s):
                    errors.append(
                        f"{prefix}.hai.task_id_field: must match <stem>.json (got {s!r}) — "
                        f"not a numeric ID"
                    )
                elif s != expected_stem_json:
                    errors.append(
                        f"{prefix}.hai.task_id_field: {s!r} != expected {expected_stem_json!r} "
                        f"(derived from task filename)"
                    )

            role = hai.get("role")
            if role != "Reviewing":
                errors.append(f"{prefix}.hai.role: must be 'Reviewing' (got {role!r})")

            ann_n = hai.get("annotation_n")
            if ann_n != n:
                errors.append(f"{prefix}.hai.annotation_n: {ann_n!r} != top-level n={n!r}")

            if "prompt" not in hai:
                errors.append(f"{prefix}.hai.prompt: missing")
            if "answer" not in hai:
                errors.append(f"{prefix}.hai.answer: missing")

    return errors


def main() -> int:
    parser = argparse.ArgumentParser(description="Validate Lizard payload YAML in a task file.")
    parser.add_argument("task_file", type=Path, help="Path to tasks/<stem>.md")
    parser.add_argument(
        "--cycle",
        type=int,
        choices=[1, 2],
        help="Payload cycle to validate (default: auto — validate both if present)",
    )
    args = parser.parse_args()

    if not args.task_file.exists():
        print(f"ERROR: {args.task_file} not found", file=sys.stderr)
        return 2

    text = args.task_file.read_text()
    expected_stem_json = derive_stem_json(args.task_file)

    cycles_to_check = [args.cycle] if args.cycle else [1, 2]
    any_found = False
    total_errors = 0

    for cyc in cycles_to_check:
        body = extract_payload_block(text, cyc)
        if body is None:
            if args.cycle:  # user explicitly asked for this cycle
                print(f"ERROR: no payload block found for cycle {cyc}", file=sys.stderr)
                return 1
            continue
        any_found = True
        try:
            payload = yaml.safe_load(body)
        except yaml.YAMLError as e:
            print(f"[cycle {cyc}] YAML parse error: {e}", file=sys.stderr)
            total_errors += 1
            continue

        errors = validate(payload, expected_stem_json)
        if errors:
            print(f"[cycle {cyc}] FAIL ({len(errors)} issue(s)):")
            for e in errors:
                print(f"  - {e}")
            total_errors += len(errors)
        else:
            print(f"[cycle {cyc}] OK — payload clean.")

    if not any_found:
        print(f"ERROR: no payload block found in {args.task_file}", file=sys.stderr)
        return 1

    return 0 if total_errors == 0 else 1


if __name__ == "__main__":
    sys.exit(main())
