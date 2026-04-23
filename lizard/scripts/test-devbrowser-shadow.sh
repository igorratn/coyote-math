#!/usr/bin/env bash
# test-devbrowser-shadow.sh — one-shot harness for the dev-browser Job 4 pilot.
#
# Runs devbrowser-shadow-set-time.js against the currently-open HAI tab.
# Preflight-checks Chrome :9222 and dev-browser binary, then executes and
# logs timing + result JSON to scripts/devbrowser-pilot-logs/<timestamp>.log.
#
# Usage:
#   bash scripts/test-devbrowser-shadow.sh                 # default 20 min
#   SHADOW_MINUTES=25 bash scripts/test-devbrowser-shadow.sh
#
# PREREQ: the HAI task shadow must already be at the "Task complete!" screen
# (Edit time button visible). This pilot covers ONLY the time-confirm step.

set -uo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PILOT_JS="${SCRIPT_DIR}/devbrowser-shadow-set-time.js"
LOG_DIR="${SCRIPT_DIR}/devbrowser-pilot-logs"
mkdir -p "${LOG_DIR}"

TS="$(date -u +%Y%m%dT%H%M%SZ)"
LOG="${LOG_DIR}/${TS}.log"

log() { printf '[%s] %s\n' "$(date -u +%H:%M:%S)" "$*" | tee -a "${LOG}"; }

log "pilot start — minutes=${SHADOW_MINUTES:-20}"

# Preflight 1: dev-browser binary
if ! command -v dev-browser >/dev/null 2>&1; then
  log "FAIL: dev-browser not on PATH. install: npm i -g dev-browser && dev-browser install"
  exit 2
fi
log "dev-browser: $(command -v dev-browser)"

# Preflight 2: Chrome DevTools on :9222
if ! curl -s -f -m 3 http://127.0.0.1:9222/json/version >/dev/null; then
  log "FAIL: Chrome not listening on :9222. Launch Chrome with --remote-debugging-port=9222"
  exit 3
fi
log "chrome :9222 reachable"

# Preflight 3: HAI tab present
TABS_JSON="$(curl -s -f -m 3 http://127.0.0.1:9222/json/list || echo '[]')"
if ! echo "${TABS_JSON}" | grep -q "ai.joinhandshake.com"; then
  log "FAIL: no open tab matches ai.joinhandshake.com"
  log "open tabs:"
  echo "${TABS_JSON}" | tee -a "${LOG}"
  exit 4
fi
log "HAI tab present"

# Run pilot
log "invoking dev-browser --connect < ${PILOT_JS}"
START_NS=$(date +%s%N 2>/dev/null || date +%s000000000)
OUT="$(dev-browser --connect < "${PILOT_JS}" 2>&1)"
RC=$?
END_NS=$(date +%s%N 2>/dev/null || date +%s000000000)
ELAPSED_MS=$(( (END_NS - START_NS) / 1000000 ))

log "exit=${RC} elapsed_ms=${ELAPSED_MS}"
log "---- output ----"
echo "${OUT}" | tee -a "${LOG}"
log "---- end output ----"

# Parse .ok field
if echo "${OUT}" | grep -q '"ok": true'; then
  log "pilot OK"
  exit 0
else
  log "pilot FAILED (ok!=true in output)"
  exit 1
fi
