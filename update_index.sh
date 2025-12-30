#!/bin/bash

# Define the README header
printf "# Coyote Math Task Index\n\n" > README.md

# Build the NU and Geometry Classification Tree
printf "## Problem Tree\n\n" >> README.md
printf '```text\n' >> README.md
printf "Root: Special Functions & Geometry\n" >> README.md

# Define NU Book Clusters & Keyword Patterns
# These patterns correspond to themes in Nikiforov-Uvarov Chapters 1-4 and Differential Geometry
nu_names=("Hypergeometric Type (NU Ch. 1-2)" "Classical Orthogonal (NU Ch. 3)" "Discrete Variables (NU Ch. 4)" "Differential Geometry" "Physical Applications" "Asymptotics & Transforms")
nu_pats=("hypergeometric|Rodrigues|gamma|Bochner" "Jacobi|Legendre|Hermite|Laguerre|Chebyshev" "Hahn|Racah|Clebsch|3j|discrete" "geodesic|curvature|torsion|Poincare|metric|disk" "membrane|acoustic|harmonic|sine-Gordon|vibration" "Cauchy|second kind|Q_n|asymptotic|integral")

# Use tail -n +1 *.md to feed all files into the analysis
# We iterate through the clusters and grep the file contents
for i in "${!nu_names[@]}"; do
    name="${nu_names[$i]}"
    pat="${nu_pats[$i]}"
    matches=""

    # Scan every .md file in the current directory
    for file in *.md; do
        # Skip README.md and files not matching the pattern
        if [[ "$file" != "README.md" ]] && grep -qiE "$pat" "$file"; then
            id="${file%.md}"
            [ -z "$matches" ] && matches="$id" || matches="$matches, $id"
        fi
    done

    # If matches were found for this category, add them to the tree
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

printf '```\n\n' >> README.md

# Count total indexed files
file_count=$(ls -1 *.md | grep -v "README.md" | wc -l)
printf "--- \n\n*Note: This index covers %s total task files identified in this directory.*\n" "$file_count" >> README.md

# Optional: Add Git commands to automate the update
# git add .
# git commit -m "Auto-update index: $file_count files"
# git push origin main