#!/bin/bash

# 1. Start the README
printf "# Coyote Math Task Index\n\n" > README.md

# 2. Re-building the Tree using Content-Based Clustering
printf "## Problem Tree\n\n" >> README.md
printf '```text\n' >> README.md
printf "Root: Special Functions & Geometry\n" >> README.md

# Defined clusters based on NU book chapters and specific task keywords
nu_names=("Hypergeometric Type" "Classical Orthogonal" "Discrete Variables" "Differential Geometry" "Physical Applications" "Second Kind & Transforms")
nu_pats=("hypergeometric\|Rodrigues\|gamma\|Jacobi\|Bochner" "Legendre\|Hermite\|Laguerre\|Chebyshev\|orthonormal" "Hahn\|Racah\|Clebsch\|3j\|discrete" "geodesic\|curvature\|torsion\|Poincare\|metric\|torus" "membrane\|acoustic\|harmonic\|sine-Gordon\|vibration" "Cauchy\|second kind\|Q_n\|asymptotic\|integral")

# We use csplit to temporarily break all.md into parts to identify which "file" belongs where
csplit -s -z all.md '/==> /' '{*}'

for i in "${!nu_names[@]}"; do
    name="${nu_names[$i]}"
    pat="${nu_pats[$i]}"
    matches=""

    for part in xx*; do
        # Check if the content of this part matches the pattern
        if grep -qiE "$pat" "$part"; then
            # Extract the original filename from the header
            filename=$(head -n 1 "$part" | sed 's/==> \(.*\) <==/\1/')
            # Append to matches list
            [ -z "$matches" ] && matches="${filename%.md}" || matches="$matches,${filename%.md}"
        fi
    done

    if [ -n "$matches" ]; then
        if [ "$i" -eq $((${#nu_names[@]}-1)) ]; then
            printf "└── %s\n" "$name" >> README.md
            printf "    └── %s\n" "$matches" >> README.md
        else
            printf "├── %s\n" "$name" >> README.md
            printf "│   └── %s\n" "$matches" >> README.md
        fi
    fi
done

# Cleanup temporary parts
rm xx*

printf '```\n\n' >> README.md


printf "---\n\n" >> README.md

# 3. Recent Updates (extracted from the head of all.md)
printf "## Recent Updates\n\n" >> README.md

# Function to clean snippets: removes \text and mathematical brackets
clean_snippet() {
    echo "$1" | sed 's/\\text//g' | sed 's/[]()[]//g' | cut -c 1-80
}

# Grab the first 5 entries from all.md
grep "==>" all.md | head -n 5 | while read -r line; do
    fname=$(echo "$line" | sed 's/==> \(.*\) <==/\1/')
    # Get the first line of content following that header in all.md
    snippet=$(grep -A 2 "$line" all.md | tail -n 1)
    TITLE=$(clean_snippet "$snippet")
    printf "* %s ... [[view]](%s)\n" "$TITLE" "all.md" >> README.md
done

# 4. Git Push
git add .
git commit -m "Fixed empty root by clustering directly from all.md content"
git push origin main