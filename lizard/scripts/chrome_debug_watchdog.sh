#!/bin/bash
# chrome_debug_watchdog.sh — poll for Chrome's "Allow remote debugging?" dialog
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
#   - Accessibility permission for cliclick (added separately).
#   - cliclick installed: `brew install cliclick`.
#   - Chrome launched with --force-renderer-accessibility (still needed for
#     `count of sheets of w` + `position`/`size` of the sheet to be reliable).
#
# Detection + dismiss strategy (Chrome 145+, codified 2026-04-27):
#   Earlier strategy (static-text walk + AXButton click) WORKED on Chrome 144
#   but Chrome 145+ strips the modal sheet's entire AX subtree — empty contents,
#   no AXStaticText, no AXButton accessible from the sheet. The window-level
#   button query only returns the macOS titlebar controls (close/min/zoom).
#
#   Surviving signal: front Chrome window's `count of sheets > 0`, and the
#   sheet's position + size are still queryable (verified 2026-04-27 on the
#   live remote-debug popup at pos=(2670,355) size=(448,240)).
#
#   Layout is fixed: macOS modal sheet with 3 buttons in a row at the bottom,
#   right-aligned. Allow is the rightmost button. Click target =
#     (sheet_x + sheet_w - 60, sheet_y + sheet_h - 30)
#   verified working by Igor 2026-04-27 (single cliclick dismissed the popup).
#
#   False-positive guard: the popup is ~448x240. We accept any sheet whose
#   width is 350-600 and height 180-320 — wide enough to absorb future Chrome
#   resizes, narrow enough to skip larger dialogs (file picker ~700x500, save
#   panel ~600x400 are excluded by the height ceiling).

set -uo pipefail

POLL_INTERVAL=${POLL_INTERVAL:-2}
QUIET=0
[[ "${1:-}" == "--quiet" ]] && QUIET=1

log() { [[ "$QUIET" == "1" ]] || echo "[$(date +%H:%M:%S)] $*"; }
say_dismiss() { echo "[$(date +%H:%M:%S)] DISMISS — $*"; }

# Returns "found" if Chrome's front window has a sheet matching the popup's
# size signature; "none" otherwise; "no-chrome" if Chrome isn't running.
detect_dialog() {
  /usr/bin/osascript <<'APPLESCRIPT' 2>/dev/null
tell application "System Events"
  if not (exists process "Google Chrome") then return "no-chrome"
  tell process "Google Chrome"
    try
      set w to front window
    on error
      return "none"
    end try
    if (count of sheets of w) = 0 then return "none"
    try
      set s to sheet 1 of w
      set sz to size of s
      set wd to item 1 of sz
      set ht to item 2 of sz
      -- popup is ~448x240; tolerate ±25% for future Chrome changes;
      -- height ceiling 320 excludes file pickers / save panels.
      if wd > 350 and wd < 600 and ht > 180 and ht < 320 then
        return "found"
      else
        return "none-other-sheet"
      end if
    on error
      return "none"
    end try
  end tell
end tell
APPLESCRIPT
}

# Returns "x,y" (Allow button center) or empty string on failure.
get_click_coords() {
  /usr/bin/osascript <<'APPLESCRIPT' 2>/dev/null
tell application "System Events"
  tell process "Google Chrome"
    try
      set s to sheet 1 of front window
      set p to position of s
      set sz to size of s
      set xClick to (item 1 of p) + (item 1 of sz) - 60
      set yClick to (item 2 of p) + (item 2 of sz) - 30
      return (xClick as string) & "," & (yClick as string)
    on error
      return ""
    end try
  end tell
end tell
APPLESCRIPT
}

dismiss() {
  if ! command -v cliclick >/dev/null 2>&1; then
    echo "cliclick-not-installed (brew install cliclick)"
    return 1
  fi
  local coords
  coords=$(get_click_coords)
  if [[ -z "$coords" ]]; then
    echo "no-coords (sheet vanished?)"
    return 1
  fi
  cliclick "c:${coords}"
  echo "clicked Allow at ${coords}"
}

log "chrome_debug_watchdog started (poll=${POLL_INTERVAL}s, strategy=cliclick-coords)"
trap 'log "stopped"; exit 0' INT TERM

# Pre-flight: warn if cliclick missing — script runs but every dismiss will fail.
if ! command -v cliclick >/dev/null 2>&1; then
  log "WARN: cliclick not found in PATH — install with 'brew install cliclick'."
fi

while true; do
  status=$(detect_dialog)
  if [[ "$status" == "found" ]]; then
    result=$(dismiss)
    say_dismiss "popup detected (sheet on front window) — ${result}"
    # back off to avoid double-clicking if the dialog takes a moment to disappear
    sleep 1
  fi
  sleep "$POLL_INTERVAL"
done
