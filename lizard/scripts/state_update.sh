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
#   - Per-annotation within Job 3 (job3_progress: pending → in_flight → applied).
#   - Per-annotation within Job 4 (job4_progress: pending → fired).
#
# Crash recovery: new CLI reads _state.json on startup; see HOST_SOP.md#crash-recovery.
#
# CLI implements. Stub only.
echo "TODO: implement scripts/state_update.sh per HOST_SOP.md state-files section"
exit 1
