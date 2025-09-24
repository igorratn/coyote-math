#!/usr/bin/env bash
set -euo pipefail

if [ $# -lt 1 ]; then
  echo "Usage: $0 file.tex [dpi]"
  exit 1
fi

TEX="$1"
BASE="${TEX%.tex}"
DPI="${2:-300}"   # default resolution 300 dpi

# Compile with pdflatex (MacTeX)
pdflatex -interaction=nonstopmode -halt-on-error "$TEX"

# Convert to JPEG (using ImageMagick convert)
if command -v convert >/dev/null 2>&1; then
  convert -density "$DPI" -trim +repage \
    -background white -alpha remove -alpha off \
    -quality 92 "${BASE}.pdf" "${BASE}.jpg"
  echo "JPEG created: ${BASE}.jpg"
else
  echo "ImageMagick convert not found, trying pdftoppm..."
  pdftoppm -jpeg -r "$DPI" "${BASE}.pdf" "${BASE}"
  echo "JPEG created: ${BASE}-1.jpg"
fi