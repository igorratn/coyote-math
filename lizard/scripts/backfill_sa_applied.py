#!/usr/bin/env python3
"""Backfill `- **SA Applied (Cycle 1):** ✅ (legacy backfill 2026-04-18)` into
legacy task files that lack the marker.

Insertion rule: the line is inserted immediately after the first line that
starts with `- **Reason:**` (case-sensitive). If a file already contains any
line starting with `- **SA Applied`, the file is skipped — no double-stamp.
"""
from pathlib import Path

TASKS_DIR = Path("/Users/iratnere/dev/coyote-math/lizard/tasks")
MARKER = "- **SA Applied (Cycle 1):** ✅ (legacy backfill 2026-04-18)"

skipped = []
modified = []
no_reason = []

for f in sorted(TASKS_DIR.glob("*.md")):
    text = f.read_text()
    lines = text.splitlines(keepends=True)
    if any(ln.lstrip().startswith("- **SA Applied") for ln in lines):
        skipped.append(f.name)
        continue
    # Find first Reason line
    for i, ln in enumerate(lines):
        if ln.lstrip().startswith("- **Reason:**"):
            # Insert marker on next line, preserving line ending of the Reason line
            sep = "\n" if ln.endswith("\n") else ""
            lines.insert(i + 1, MARKER + sep)
            f.write_text("".join(lines))
            modified.append(f.name)
            break
    else:
        no_reason.append(f.name)

print(f"Modified: {len(modified)}")
for n in modified:
    print(f"  + {n}")
print(f"\nSkipped (already had SA Applied): {len(skipped)}")
print(f"\nNo Reason line found: {len(no_reason)}")
for n in no_reason:
    print(f"  ? {n}")
