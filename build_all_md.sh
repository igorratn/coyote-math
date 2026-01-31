#!/usr/bin/env bash
set -euo pipefail

out="all.md"
: >"$out"

# Files to skip (case-insensitive)
skip_list=(
  "readme.md"
  "all.md"
)

is_skipped() {
  local f_lc="$1"
  local s
  for s in "${skip_list[@]}"; do
    if [[ "$f_lc" == "$s" ]]; then
      return 0
    fi
  done
  return 1
}

# Merge all .md files in current dir (not recursive), skipping the listed ones.
# Sort for deterministic order.
find . -maxdepth 1 -type f -name "*.md" -print0 \
| sort -z \
| while IFS= read -r -d '' path; do
    file="${path#./}"
    lower="$(printf '%s' "$file" | tr '[:upper:]' '[:lower:]')"

    if is_skipped "$lower"; then
      continue
    fi

    printf "\n### File: %s\n\n" "$file" >>"$out"
    cat -- "$path" >>"$out"
  done

echo "Wrote $out"