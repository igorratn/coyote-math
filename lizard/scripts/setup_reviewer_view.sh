#!/usr/bin/env bash
# setup_reviewer_view.sh — build per-reviewer symlink sandbox for one task/role.
#
# Usage:
#   scripts/setup_reviewer_view.sh <stem> <role>     # role = r1 | r2
#
# Preconditions:
#   - tasks/skeleton/<stem>.md exists
#   - templates/review-prompt.md exists
#   - templates/review-template.md exists
#   - wiki/ exists
#   - CLAUDE.md exists
#
# Actions:
#   Build /tmp/lizard/<stem>/<role>-view/ containing ONLY:
#     skeleton.md   -> repo/tasks/skeleton/<stem>.md
#     template.md   -> repo/templates/review-template.md
#     framework.md  -> repo/templates/review-prompt.md
#     wiki/         -> repo/wiki/
#     CLAUDE.md     -> repo/CLAUDE.md
#
#   Independence guarantee: this view does NOT symlink tasks/review1/ or tasks/review2/.
#   The other reviewer's output path is NOT reachable from this sandbox.
#
# Cleanup (after reviewer completes):
#   scripts/setup_reviewer_view.sh <stem> <role> --cleanup   # rm -rf /tmp/lizard/<stem>/<role>-view/
#
# CLI implements. Stub only.
echo "TODO: implement scripts/setup_reviewer_view.sh per HOST_SOP.md reviewer-orchestration section"
exit 1
