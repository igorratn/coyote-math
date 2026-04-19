#!/usr/bin/env bash
# init_batch.sh — initialize batch state sidecar + orchestrator pointer from manifest.
#
# Usage:
#   scripts/init_batch.sh
#
# Preconditions:
#   - scrapes/_manifest.json exists (frozen batch spec)
#
# Actions:
#   1. If scrapes/_manifest.state.json exists → refuse (batch already initialized; archive or discard first).
#   2. Build _manifest.state.json:
#      {"tasks": {"<stem>": {"sa_applied": false, "shadows_fired": false, "held": false, "reviewers": null}, ...}}
#   3. Build _state.json (orchestrator pointer, idle):
#      {"batch": "scrapes/_manifest.json", "current_task": null, "phase": "idle",
#       "last_step": "init", "updated_at": "<iso>", "pid": null,
#       "session_log": "logs/session-<ts>.md", "job3_progress": {}, "job4_progress": {}}
#   4. Create the session log file in logs/.
#
# Write discipline:
#   - All writes via tmpfile + rename (atomic).
#   - HARD-FAIL on any manifest parse error; do not write partial state.
#
# CLI implements. Stub only.
echo "TODO: implement scripts/init_batch.sh per HOST_SOP.md batch-lifecycle section"
exit 1
