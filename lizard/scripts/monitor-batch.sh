#!/usr/bin/env bash
# monitor-batch.sh — live status for the current lizard batch.
# Usage: ./scripts/monitor-batch.sh
# Reads: scrapes/_manifest.json, scrapes/_state.json, /tmp/lizard-batch-*.log
set -u

LIZARD_DIR="${LIZARD_DIR:-$HOME/dev/coyote-math/lizard}"
INTERVAL="${INTERVAL:-10}"

render() {
  local dir="$1"
  local manifest="$dir/scrapes/_manifest.json"
  local state="$dir/scrapes/_state.json"

  echo "=== $(date) ==="
  if [[ ! -f "$manifest" ]]; then
    echo "no manifest at $manifest"
    return
  fi

  local total
  total=$(grep -c '"stem"' "$manifest" 2>/dev/null || echo 0)
  local merged
  merged=$(find "$dir/tasks" -maxdepth 1 -name "*.md" -newer "$manifest" 2>/dev/null | wc -l | tr -d ' ')
  echo "merged: $merged / $total"

  echo "--- state ---"
  [[ -f "$state" ]] && cat "$state" || echo "(no state)"

  echo "--- running ---"
  ps -ef | grep -E "run-job[0-2]|claude -p|run-.*-reviewer" | grep -v grep | awk '{for(i=8;i<=NF;i++) printf "%s ",$i; print ""}' | head -5

  echo "--- last log lines ---"
  local log
  log=$(ls -t /tmp/lizard-batch-*.log 2>/dev/null | head -1)
  if [[ -n "$log" ]]; then
    echo "($log)"
    tail -n 15 "$log"
  else
    echo "(no /tmp/lizard-batch-*.log)"
  fi
}

if command -v watch >/dev/null 2>&1; then
  export -f render
  export LIZARD_DIR
  watch -n "$INTERVAL" --color "bash -c 'render \"$LIZARD_DIR\"'"
else
  while true; do
    clear
    render "$LIZARD_DIR"
    sleep "$INTERVAL"
  done
fi
