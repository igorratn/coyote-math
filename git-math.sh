#!/bin/bash

# 1. Setup Environment
# Splitting all.md into temporary files so the script can "see" individual problems
csplit -s -z all.md '/==> /' '{*}'
for f in xx*; do
    # Extract the filename from the header line (e.g., 027f10a7.md)
    name=$(head -n 1 "$f" | sed 's/==> \(.*\) <==/\1/')
    mv "$f" "$name"
done

# 2. Start the README
printf "# Coyote Math Task Index\n\n" > README.md

# 3. Build the Tree using NU and Geometry Content
printf "## Problem Tree\n\n" >> README.md
printf '```text\n' >> README.md
printf "Root: Special Functions & Geometry\n" >> README.md

nu_names=("Hypergeometric Type" "Classical Orthogonal" "Discrete Variables" "Differential Geometry" "Physical Applications" "Second Kind & Transforms")
nu_pats=("hypergeometric\|Rodrigues\|gamma" "Jacobi\|Legendre\|Hermite\|Laguerre\|Chebyshev" "Hahn\|Racah\|Clebsch\|3j\|difference" "geodesic\|curvature\|torsion\|Poincare\|metric\|disk" "membrane\|acoustic\|thermal\|sine-Gordon\|vibration" "Cauchy\|second kind\|Q_n\|asymptotic\|integral")

for i in "${!nu_names[@]}"; do
    name="${nu_names[$i]}"
    pat="${nu_pats[$i]}"
    
    # Identify files containing the cluster keywords
    matches=$(grep -ilE "$pat" *.md | grep -v "README.md" | grep -v "all.md" | sed 's/\.md//g' | tr '\n' ',' | sed 's/,$//')
    
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



printf "---\n\n" >> README.md

# 4. Recent Updates
printf "## Recent Updates\n\n" >> README.md

get_math_snippet() {
    # Remove \text and grab the first descriptive line
    content=$(grep -vE '^\\|^#|^$|==>' "$1" | head -n 1 | sed 's/\\text//g')
    echo "$content" | cut -c 1-100 | sed 's/[]()[]//g'
}

ls -t *.md | grep -vE "README.md|all.md" | head -5 | while read -r file; do
    TITLE=$(get_math_snippet "$file")
    [ -z "$TITLE" ] && TITLE="Problem: ${file%.*}"
    printf "* %s ... [[view]](%s)\n" "$TITLE" "$file" >> README.md
done

printf "\n---\n\n" >> README.md

# 5. Library by Category
printf "## Library by Category\n\n" >> README.md

for i in "${!nu_names[@]}"; do
    name="${nu_names[$i]}"
    pat="${nu_pats[$i]}"
    
    files=$(grep -ilE "$pat" *.md | grep -vE "README.md|all.md")
    
    if [ -n "$files" ]; then
        printf "### %s\n\n" "$name" >> README.md
        echo "$files" | while read -r file; do
            TITLE=$(get_math_snippet "$file")
            [ -z "$TITLE" ] && TITLE="ID: ${file%.*}"
            printf "* %s ... [[view]](%s)\n" "$TITLE" "$file" >> README.md
        done
        printf "\n" >> README.md
    fi
done

# 6. Push to Git
git add .
git commit -m "Split all.md and update index with NU terminology"
git push origin main