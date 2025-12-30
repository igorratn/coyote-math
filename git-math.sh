#!/bin/bash

# 1. Start the README
printf "# Coyote Math Task Index\n\n" > README.md

# 2. Re-building the Tree with NU terms and Geometry
printf "## Problem Tree\n\n" >> README.md
printf '```text\n' >> README.md
printf "Root: Special Functions & Geometry\n" >> README.md

# Hardcoded NU and Geometry categories
nu_names=("Hypergeometric Type" "Classical Orthogonal" "Discrete Variables" "Differential Geometry" "Physical Applications" "Second Kind & Transforms")
# These patterns are sourced from the Nikiforov-Uvarov index and your geometry tasks
nu_pats=("hypergeometric\|Rodrigues\|gamma" "Jacobi\|Legendre\|Hermite\|Laguerre\|Chebyshev" "Hahn\|Racah\|Clebsch\|3j\|difference" "geodesic\|curvature\|torsion\|Poincare\|metric\|disk" "membrane\|acoustic\|thermal\|sine-Gordon\|vibration" "Cauchy\|second kind\|Q_n\|asymptotic\|integral")

for i in "${!nu_names[@]}"; do
    name="${nu_names[$i]}"
    pat="${nu_pats[$i]}"
    
    # -i: case insensitive, -l: list filename, -E: regex
    # We look at all .md files except README
    matches=$(grep -ilE "$pat" *.md | grep -v "README.md" | sed 's/\.md//g' | tr '\n' ',' | sed 's/,$//')
    
    if [ -n "$matches" ]; then
        # Check if it is the last category for tree branching
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

# 3. Recent Updates
printf "## Recent Updates\n\n" >> README.md

get_math_snippet() {
    # Grabs first non-empty line, removes \text per instruction
    content=$(grep -vE '^\\|^#|^$' "$1" | head -n 1 | sed 's/\\text//g')
    echo "$content" | cut -c 1-100 | sed 's/[]()[]//g'
}

ls -t *.md | grep -v "README.md" | head -5 | while read -r file; do
    TITLE=$(get_math_snippet "$file")
    [ -z "$TITLE" ] && TITLE="Problem: ${file%.*}"
    printf "* %s ... [[view]](%s)\n" "$TITLE" "$file" >> README.md
done

printf "\n---\n\n" >> README.md

# 4. Library by Category
printf "## Library by Category\n\n" >> README.md

for i in "${!nu_names[@]}"; do
    name="${nu_names[$i]}"
    pat="${nu_pats[$i]}"
    
    files=$(grep -ilE "$pat" *.md | grep -v "README.md")
    
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

# 5. Git Automation
git add .
git commit -m "Fix empty tree and update NU geometry index"
git push origin main