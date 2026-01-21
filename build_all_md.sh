#!/usr/bin/env bash
set -euo pipefail

# Build all.md by concatenating all .md files in the current directory
# excluding: readme.md, all.md, clusters.md, solver.md, mk_cl.md (case-insensitive)

out="all.md"
: > "$out"

# Collect files safely (handles spaces) and exclude the listed names.
find . -maxdepth 1 -type f -name "*.md" -print0 \
| while IFS= read -r -d '' path; do
    file="${path#./}"
    lower="$(printf '%s' "$file" | tr '[:upper:]' '[:lower:]')"

    case "$lower" in
      readme.md|all.md|clusters.md|solver.md|mk_cl.md) continue ;;
    esac

    printf "\n### File: %s\n\n" "$file" >> "$out"
    cat "$file" >> "$out"
  done

echo "Wrote $out"