#!/usr/bin/env bash
# state_update.sh — atomic writer for scrapes/_state.json (orchestrator pointer).
#
# Usage:
#   scripts/state_update.sh set phase=job2.reviewers current_task=<stem> last_step=job1.skeleton_written
#   scripts/state_update.sh set job3_progress.annotation_2=applied
#   scripts/state_update.sh set job4_progress.<stem>.annotation_3=fired
#   scripts/state_update.sh get phase                   # print current value
#   scripts/state_update.sh clear-pid                   # on graceful shutdown
#
# Write discipline:
#   - All writes via scrapes/_state.json.tmp + rename (atomic).
#   - Always stamp updated_at with ISO-8601 UTC.
#   - pid field = current CLI pid on every non-clear write.
#   - Concurrent-safe via flock on scrapes/_state.json.lock (separate lockfile, not the data file).
#
# Callers:
#   - Every job boundary in HOST_SOP (phase, last_step).
#   - Per-task within Job 3 (two-step split):
#       awaiting_resolution — 3a pending, Igor resolving per-annotation decisions
#       resolved            — 3a done (all annotations resolved); 3b not yet pushed to SA
#       applied             — 3b done (SA push succeeded, sa_applied:true in manifest)
#   - Phase values (top-level):
#       job3.pending_resolution        — tasks awaiting Igor's per-annotation decisions
#       job3.resolved_pending_sa_apply — all resolved tasks, 3b not yet done
#       job3.applying                  — 3b SA push in progress
#   - Per-annotation within Job 4 (job4_progress: pending → fired).
#
# Crash recovery: new CLI reads _state.json on startup; see HOST_SOP.md#crash-recovery.
#
# CLI implements. Stub only.
echo "TODO: implement scripts/state_update.sh per HOST_SOP.md state-files section"
exit 1
