#!/bin/bash
# chrome_debug_watchdog.sh — poll for Chrome 144+'s "Allow remote debugging?" dialog
# and auto-click Allow. Runs as a background daemon, independent of any CLI / MCP
# connection that the dialog itself blocks.
#
# Usage:
#   ./scripts/chrome_debug_watchdog.sh             # foreground, prints to terminal
#   ./scripts/chrome_debug_watchdog.sh --quiet     # foreground, silent unless dismiss fires
#   nohup ./scripts/chrome_debug_watchdog.sh > /tmp/chrome-watchdog.log 2>&1 &  # background
#
# Stop:
#   pkill -f chrome_debug_watchdog.sh
#
# Prerequisites:
#   - Accessibility permission for the launching shell (Terminal/iTerm):
#     System Settings → Privacy & Security → Accessibility → add Terminal/iTerm.
#     Without it the keystroke is silently dropped.
#
# Detection + dismiss strategy:
#   Chrome 144+ renders this dialog with web-content buttons whose AX names are
#   stripped (all show 'missing value' under System Events). We CAN'T match by
#   button name, and we CAN'T dismiss by pressing Return — `activate` brings
#   Chrome to front but doesn't move Chrome's internal keyboard focus to the
#   modal, so Return goes to whatever web element was previously focused (a
#   page text input, etc.) instead of the Allow button.
#
#   What works: detect the dialog by matching the unique static-text phrase
#   "external app wants full control over this Chrome session", collect every
#   AXButton appearing after that text in the AX tree (these are the dialog's
#   3 buttons: Turn off in settings / Cancel / Allow), and CLICK the rightmost
#   one (Allow is on the right per the dialog layout). Click bypasses keyboard
#   focus entirely — verified working by Igor 2026-04-26.

set -uo pipefail

POLL_INTERVAL=${POLL_INTERVAL:-2}
QUIET=0
[[ "${1:-}" == "--quiet" ]] && QUIET=1

log() { [[ "$QUIET" == "1" ]] || echo "[$(date +%H:%M:%S)] $*"; }
say_dismiss() { echo "[$(date +%H:%M:%S)] DISMISS — $*"; }

# Returns "found" if the Allow-remote-debug dialog is detected, "none" otherwise,
# "no-chrome" if Chrome isn't running.
# We walk the entire AX tree for any AXStaticText whose value contains the
# dialog's unique sentence. Cheaper detections (button name match, window title)
# don't work — Chrome strips button names and the dialog doesn't change the
# window title.
detect_dialog() {
  /usr/bin/osascript <<'APPLESCRIPT' 2>/dev/null
tell application "System Events"
  if not (exists process "Google Chrome") then return "no-chrome"
  tell process "Google Chrome"
    repeat with w in windows
      try
        set els to entire contents of w
        repeat with e in els
          try
            if role of e is "AXStaticText" then
              set t to ""
              try
                set t to value of e as string
              end try
              if t contains "external app wants full control" then
                return "found"
              end if
            end if
          end try
        end repeat
      end try
    end repeat
  end tell
  return "none"
end tell
APPLESCRIPT
}

dismiss() {
  /usr/bin/osascript <<'APPLESCRIPT' 2>/dev/null
tell application "Google Chrome" to activate
delay 0.3
tell application "System Events"
  tell process "Google Chrome"
    repeat with w in windows
      try
        set els to entire contents of w
        set foundDialog to false
        set dialogBtns to {}
        repeat with e in els
          try
            if role of e is "AXStaticText" then
              if value of e as string contains "external app wants full control" then
                set foundDialog to true
              end if
            end if
            if foundDialog and role of e is "AXButton" then
              set end of dialogBtns to e
            end if
          end try
        end repeat
        if (count of dialogBtns) ≥ 3 then
          set rightmostX to -1
          set rightmostBtn to missing value
          repeat with b in dialogBtns
            try
              set p to position of b
              if (item 1 of p) > rightmostX then
                set rightmostX to (item 1 of p)
                set rightmostBtn to b
              end if
            end try
          end repeat
          if rightmostBtn is not missing value then
            click rightmostBtn
            return "clicked-x=" & rightmostX
          end if
        end if
      end try
    end repeat
    return "no-dialog-found-on-dismiss"
  end tell
end tell
APPLESCRIPT
}

log "chrome_debug_watchdog started (poll=${POLL_INTERVAL}s)"
trap 'log "stopped"; exit 0' INT TERM

while true; do
  status=$(detect_dialog)
  if [[ "$status" == "found" ]]; then
    result=$(dismiss)
    say_dismiss "Allow button detected — pressed Return (result=${result:-empty})"
    # back off briefly to avoid double-press if the dialog takes a moment to dismiss
    sleep 1
  fi
  sleep "$POLL_INTERVAL"
done
