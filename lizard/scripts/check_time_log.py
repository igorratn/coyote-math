#!/usr/bin/env python3
"""
check_time_log.py — per-shadow mechanical gate for Job 4 time-edit compliance.

Usage:
    python3 scripts/check_time_log.py --last
        Check the last line of scrapes/_job4_session_log.txt. Non-compliant
        time value → exit 1.
    python3 scripts/check_time_log.py --scan
        Scan the whole log; report every non-compliant line. Exit 1 if any.
    python3 scripts/check_time_log.py --stem <stem>
        Check every line for <stem>. Exit 1 if any non-compliant.

Compliance rule (SOP §4, Jobs 4 time-edit):
    Every submitted-shadow log line must contain `time=00:20:00`.
    Both cycles: always 20:00 regardless of actual elapsed time.

Non-compliant values we have observed in the wild:
    time=overrun
    time=01:10:14  (raw elapsed)
    time=00:03:13  (raw elapsed)
    time=00:15:00  (raw elapsed)
    time=20:00     (acceptable — short form used in earlier session)

Rule match: the log line must contain either `time=00:20:00` or `time=20:00`
(legacy short form). Anything else is a miss — the Edit-time step was skipped
or the value was wrong, and the shadow was submitted with a sub-20 timer.

Exit codes:
    0 — all checked lines compliant
    1 — one or more non-compliant
    2 — usage / IO error
"""

import argparse
import re
import sys
from pathlib import Path

LOG_PATH = Path("scrapes/_job4_session_log.txt")
TIME_RE = re.compile(r"time=([^\s|]+)")
COMPLIANT = {"00:20:00", "20:00"}


def extract_time(line: str) -> str | None:
    m = TIME_RE.search(line)
    return m.group(1) if m else None


def is_compliant(line: str) -> tuple[bool, str | None]:
    """Return (compliant, time_value). `compliant=True` if line has no time field
    (legacy 'ok' lines pre-dating the time= convention are exempt) OR time matches."""
    t = extract_time(line)
    if t is None:
        return (True, None)  # legacy line, no time field — not our concern
    return (t in COMPLIANT, t)


def main() -> int:
    ap = argparse.ArgumentParser()
    g = ap.add_mutually_exclusive_group(required=True)
    g.add_argument("--last", action="store_true", help="Check the final log line only.")
    g.add_argument("--scan", action="store_true", help="Check the whole log.")
    g.add_argument("--stem", type=str, help="Check every line for the given stem.")
    ap.add_argument(
        "--log", type=Path, default=LOG_PATH, help="Path to Job 4 session log."
    )
    args = ap.parse_args()

    if not args.log.exists():
        print(f"ERROR: log file {args.log} not found", file=sys.stderr)
        return 2

    lines = [ln.rstrip("\n") for ln in args.log.read_text().splitlines() if ln.strip()]
    if not lines:
        print("ERROR: log file empty", file=sys.stderr)
        return 2

    if args.last:
        target = [lines[-1]]
    elif args.stem:
        target = [ln for ln in lines if args.stem in ln]
        if not target:
            print(f"ERROR: no log lines match stem {args.stem!r}", file=sys.stderr)
            return 2
    else:  # --scan
        target = lines

    failures: list[tuple[int, str, str]] = []
    for i, ln in enumerate(target):
        ok, t = is_compliant(ln)
        if not ok:
            failures.append((i, t or "", ln))

    if failures:
        print(f"FAIL: {len(failures)} non-compliant time-edit line(s):")
        for i, t, ln in failures:
            print(f"  time={t!r}  | {ln}")
        print()
        print("SOP §4: time-edit must be 00:20:00 on every shadow submit.")
        print("Likely cause: CLI skipped the 'Edit time' click before 'Confirm time'.")
        return 1

    print(f"OK — {len(target)} line(s) checked, all compliant (time=00:20:00).")
    return 0


if __name__ == "__main__":
    sys.exit(main())
