#!/usr/bin/env bash
# fire-stem.sh — fire all HAI shadows for one stem, then run --finalize.
#
# Usage:
#   STEM=<S> bash scripts/fire-stem.sh [--dry-run]
#
# Drives run-job4.mjs --precheck for the annot list, fires each via
# fire-shadow-devbrowser.sh, records via --record-shadow, finalizes via --finalize.
# Idempotent — skips annots already_fired in the precheck.
set -e

: "${STEM:?STEM env required}"
DRY_RUN="${1:-}"

# Serialization lock — only one Job 4 fire-stem runs at a time per Igor 2026-05-09.
# HAI's allocation pool gets confused when multiple Start-task clicks land
# concurrently (cross-allocation incidents). Use PID-file lock (macOS has no flock).
# Codified 2026-05-09. Lock file holds running PID; check if stale on conflict.
LIZARD_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
FIRE_LOCK="$LIZARD_DIR/scrapes/.fire-stem.lock"
if [ -f "$FIRE_LOCK" ]; then
  HELD_PID=$(cat "$FIRE_LOCK" 2>/dev/null || echo "")
  if [ -n "$HELD_PID" ] && kill -0 "$HELD_PID" 2>/dev/null; then
    echo "ERROR: another fire-stem is running (pid=$HELD_PID, lock=$FIRE_LOCK). Job 4 must run one stem at a time."
    exit 3
  fi
  # Stale lock — previous fire-stem died without cleanup. Take it.
fi
echo $$ > "$FIRE_LOCK"

# Per-run log capture for post-fire analyzer (codified 2026-05-12).
FIRE_LOG_DIR="$LIZARD_DIR/logs/fire"
mkdir -p "$FIRE_LOG_DIR"
FIRE_LOG="$FIRE_LOG_DIR/$(date +%s)-${STEM}.log"
echo "[fire-stem] $STEM: log → $FIRE_LOG"

trap 'rm -f "$FIRE_LOCK"; node "$LIZARD_DIR/scripts/post-fire-analyze.mjs" "$FIRE_LOG" 2>/dev/null || true' EXIT INT TERM

# Helper: tee subsequent stdout to log.
exec > >(tee -a "$FIRE_LOG") 2>&1

PRECHECK=$(STEM=$STEM node scripts/run-job4.mjs --precheck 2>/dev/null)
[ -n "$PRECHECK" ] || { echo "ERROR: precheck failed for $STEM"; exit 2; }

QC_DISP=$(echo "$PRECHECK" | node -e 'process.stdin.on("data", d => { const j = JSON.parse(d); console.log(j.qc_disposition || ""); })')
if echo "$QC_DISP" | grep -qE 'Valid Skipped to Hold|Valid Skipped to Skipped|Valid Skip to Unusable'; then
  echo "[fire-stem] $STEM: skip-disposition '$QC_DISP' — running --skip-finalize, no shadows fire"
  STEM=$STEM node scripts/run-job4.mjs --skip-finalize
  exit 0
fi

REMAINING=$(echo "$PRECHECK" | node -e 'process.stdin.on("data", d => { console.log(JSON.parse(d).remaining_count); })')
TOTAL=$(echo "$PRECHECK" | node -e 'process.stdin.on("data", d => { console.log(JSON.parse(d).annot_count); })')
echo "[fire-stem] $STEM: $REMAINING/$TOTAL annots to fire"

if [ "$REMAINING" = "0" ]; then
  echo "[fire-stem] $STEM: nothing to fire — finalizing"
  STEM=$STEM node scripts/run-job4.mjs --finalize
  exit 0
fi

IMG_PATH=$(ls screenshots/${STEM}.* 2>/dev/null | head -n1)
[ -f "$IMG_PATH" ] || { echo "ERROR: no screenshot for $STEM"; exit 2; }

# Number of fire-queue entries.
NQ=$(echo "$PRECHECK" | node -e 'process.stdin.on("data", d => { console.log(JSON.parse(d).fire_queue.length); })')

for i in $(seq 0 $((NQ - 1))); do
  ENTRY=$(echo "$PRECHECK" | node -e "let buf=''; process.stdin.on('data', d => buf+=d); process.stdin.on('end', () => { console.log(JSON.stringify(JSON.parse(buf).fire_queue[$i])); });")
  ALREADY=$(echo "$ENTRY" | node -e 'process.stdin.on("data", d => { console.log(JSON.parse(d).already_fired); })')
  if [ "$ALREADY" = "true" ]; then
    N=$(echo "$ENTRY" | node -e 'process.stdin.on("data", d => { console.log(JSON.parse(d).n); })')
    echo "[fire-stem] $STEM A$N: already fired — skip"
    continue
  fi

  N=$(echo "$ENTRY" | node -e 'process.stdin.on("data", d => { console.log(JSON.parse(d).n); })')
  RATING=$(echo "$ENTRY" | node -e 'process.stdin.on("data", d => { console.log(JSON.parse(d).hai_rating); })')
  IS_DELETE=$(echo "$ENTRY" | node -e 'process.stdin.on("data", d => { console.log(JSON.parse(d).is_delete); })')
  VERDICT_SOURCE=$(echo "$ENTRY" | node -e 'process.stdin.on("data", d => { console.log(JSON.parse(d).verdict_source); })')
  HAI_PROMPT=$(echo "$ENTRY" | node -e 'let buf=""; process.stdin.on("data", d => buf+=d); process.stdin.on("end", () => { process.stdout.write(JSON.parse(buf).prompt); });')
  HAI_ANSWER=$(echo "$ENTRY" | node -e 'let buf=""; process.stdin.on("data", d => buf+=d); process.stdin.on("end", () => { process.stdout.write(JSON.parse(buf).answer); });')
  TASK_ID_FIELD=$(echo "$ENTRY" | node -e 'process.stdin.on("data", d => { console.log(JSON.parse(d).task_id_field); })')

  PROMPT_FILE=$(mktemp -t fire-stem-prompt.XXXXXX)
  printf '%s' "$HAI_PROMPT" > "$PROMPT_FILE"

  echo "[fire-stem] $STEM A$N: rating=$RATING source=$VERDICT_SOURCE delete=$IS_DELETE"

  if [ "$DRY_RUN" = "--dry-run" ]; then
    echo "  (dry-run) STEM=$STEM ANNOT_N=$N RATING=$RATING IMG_PATH=$IMG_PATH TASK_ID_FIELD=$TASK_ID_FIELD VERDICT_SOURCE=$VERDICT_SOURCE answer=$(printf '%s' "$HAI_ANSWER" | head -c 60)"
    rm -f "$PROMPT_FILE"
    continue
  fi

  set +e
  OUT=$(STEM="$STEM" ANNOT_N="$N" RATING="$RATING" IMG_PATH="$IMG_PATH" TASK_ID_FIELD="$TASK_ID_FIELD" PROMPT_FILE="$PROMPT_FILE" ANSWER="$HAI_ANSWER" VERDICT_SOURCE="$VERDICT_SOURCE" bash scripts/fire-shadow-devbrowser.sh 2>&1)
  EC=$?
  set -e
  rm -f "$PROMPT_FILE"

  echo "$OUT" | tail -25
  if [ $EC -ne 0 ]; then
    echo "[fire-stem] $STEM A$N: fire-shadow exited $EC — abort"
    exit $EC
  fi

  SHADOW_FULL_UUID=$(echo "$OUT" | grep -E '^SHADOW_FULL_UUID=' | tail -n1 | cut -d= -f2-)
  SHADOW_UUID=$(echo "$OUT" | grep -E '^SHADOW_UUID=' | tail -n1 | cut -d= -f2-)
  TIME_LOGGED=$(echo "$OUT" | grep -E '^TIME_LOGGED=' | tail -n1 | cut -d= -f2-)
  HAI_LLM_EVAL=$(echo "$OUT" | grep -E '^HAI_LLM_EVAL=' | tail -n1 | cut -d= -f2-)
  HAI_LLM_COMMENT=$(echo "$OUT" | grep -E '^HAI_LLM_COMMENT=' | tail -n1 | cut -d= -f2- || true)

  if [ -z "$SHADOW_FULL_UUID" ] || [ -z "$SHADOW_UUID" ]; then
    echo "[fire-stem] $STEM A$N: missing UUID in script output — abort"
    exit 1
  fi

  echo "[fire-stem] $STEM A$N: uuid=$SHADOW_UUID time=$TIME_LOGGED eval=$HAI_LLM_EVAL"

  STEM="$STEM" ANNOT_N="$N" SHADOW_UUID="$SHADOW_UUID" SHADOW_FULL_UUID="$SHADOW_FULL_UUID" RATING="$RATING" TIME_LOGGED="$TIME_LOGGED" HAI_LLM_EVAL="$HAI_LLM_EVAL" HAI_LLM_COMMENT="$HAI_LLM_COMMENT" node scripts/run-job4.mjs --record-shadow
done

echo "[fire-stem] $STEM: all annots fired, finalizing"
STEM=$STEM node scripts/run-job4.mjs --finalize
