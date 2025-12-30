#!/bin/bash

# 1. Start the README
printf "# Coyote Math Task Index\n\n" > README.md

# 2. Recent Updates (Top Section)
printf "## Recent Updates\n\n" >> README.md

# Function to clean title: removes \text and mathematical brackets
clean_title() {
    echo "$1" | sed 's/\\text//g' | sed 's/[]()[]//g' | cut -c 1-80
}

# List 5 most recently modified .md files (excluding README)
ls -t *.md | grep -v "README.md" | head -n 5 | while read -r file; do
    # Grab the first non-empty, non-header line as a title
    raw_title=$(grep -vE '^\\|^#|^$' "$file" | head -n 1)
    TITLE=$(clean_title "$raw_title")
    printf "* %s ... [[view]](%s)\n" "$TITLE" "$file" >> README.md
done
printf "\n---\n\n" >> README.md

# 3. Build the Tree with Finer Clusters
printf "## Problem Tree\n\n" >> README.md
printf '```text\n' >> README.md
printf "Root: Special Functions & Geometry\n" >> README.md

# Define Finer Clusters
nu_names=(
    "Hypergeometric: Rodrigues & ODEs"
    "Jacobi & Legendre Polynomials"
    "Hermite & Laguerre Polynomials"
    "Discrete: Hahn & Racah"
    "Discrete: Clebsch-Gordan / 3j"
    "Geometry: Poincare & Metrics"
    "Geometry: Surfaces & Geodesics"
    "Physics: Waves & Vibrations"
    "Physics: Heat & Potential"
    "Asymptotics & Second Kind"
)

nu_pats=(
    "hypergeometric|Rodrigues|Bochner"
    "Jacobi|Legendre|Chebyshev"
    "Hermite|Laguerre"
    "Hahn|Racah"
    "Clebsch|3j|Wigner"
    "Poincare|metric|disk|upper half"
    "geodesic|curvature|torsion|surface"
    "membrane|acoustic|harmonic|vibration|sine-Gordon"
    "heat|temperature|potential|equilibrium"
    "Cauchy|second kind|Q_n|asymptotic|integral"
)

# Initialize the pool of files
unassigned_files=$(ls -1 *.md | grep -v "README.md")

for i in "${!nu_names[@]}"; do
    name="${nu_names[$i]}"
    pat="${nu_pats[$i]}"
    matches=""
    still_unassigned=""

    for file in $unassigned_files; do
        if tail -n +1 "$file" | grep -qiE "$pat"; then
            id="${file%.md}"
            [ -z "$matches" ] && matches="$id" || matches="$matches, $id"
        else
            still_unassigned="$still_unassigned $file"
        fi
    done

    unassigned_files=$still_unassigned

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

if [ -n "$unassigned_files" ]; then
    misc_ids=$(echo "$unassigned_files" | sed 's/\.md//g' | tr '\n' ',' | sed 's/,$//')
    printf "└── Unclassified Tasks\n" >> README.md
    printf "    └── %s\n" "$misc_ids" >> README.md
fi

printf '```\n\n' >> README.md



# 4. Linked Leaf Index
printf "## Linked Map\n\n" >> README.md

# Reset pool for linking
unassigned_files=$(ls -1 *.md | grep -v "README.md")

for i in "${!nu_names[@]}"; do
    name="${nu_names[$i]}"
    pat="${nu_pats[$i]}"
    links=""
    still_unassigned=""

    for file in $unassigned_files; do
        if tail -n +1 "$file" | grep -qiE "$pat"; then
            id="${file%.md}"
            [ -z "$links" ] && links="[$id]($file)" || links="$links, [$id]($file)"
        else
            still_unassigned="$still_unassigned $file"
        fi
    done

    unassigned_files=$still_unassigned

    if [ -n "$links" ]; then
        printf "**%s**\n\n%s\n\n" "$name" "$links" >> README.md
    fi
done

# 5. Footer and Git
file_count=$(ls -1 *.md | grep -v "README.md" | wc -l)
printf "---\n\n*Note: Total files indexed: %s.*\n" "$file_count" >> README.md

git add .
git commit -m "Auto-index: $file_count files updated with recent list and linked map"
git push origin main