#!/bin/bash
for file in *-i.md; do
  if [ -f "$file" ]; then
    mv "$file" "${file%-i.md}-i.tex"
  fi
done