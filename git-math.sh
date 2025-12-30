#!/bin/bash

# 1. Start the README
printf "# Coyote Math Task Index\n\n" > README.md

# 2. Hard-coded NU and Geometry Clusters
printf "## Dynamic Problem Tree\n\n" >> README.md
printf '```text\n' >> README.md
printf "Root: Special Functions & Geometry\n" >> README.md

# NU Terminology & Differential Geometry Pool
# We use patterns based on the NU book chapters and your tasks
nu_names=("Hypergeometric Type" "Classical Orthogonal" "Discrete Variables" "Differential Geometry" "Physical Applications" "Second Kind & Transforms")
nu_pats=("hypergeometric\|differential equation\|Rodrigues" "Jacobi\|Legendre\|Hermite\|Laguerre" "Hahn\|Racah\|Clebsch\|3j\|difference equation" "geodesic\|curvature\|torsion\|Poincare\|metric" "membrane\|acoustic\|thermal\|sine-Gordon" "Cauchy\|second kind\|Q_n\|asymptotic")

for i in "${!nu_names[@]}"; do
    name="${nu_names[$i]}"
    pat="${nu_pats[$i]}"
    
    # Dynamically find files matching the NU/Geometry keywords
    matches=$(grep -ilE "$pat" *.md | grep -v "README.md" | sed 's/\.md//g' | tr '\n' ',' | sed 's/,$//')
    
    if [ -n "$matches" ]; then
        if [ "$i" -eq $((${#nu_names[@]}-1)) ]; then
            printf "└── %s: %s\n" "$name" "$matches" >> README.md
        else
            printf "├── %s: %s\n" "$name" "$matches" >> README.md
        fi
    fi
done
printf '```\n\n' >> README.md



printf "---\n\n" >> README.md

# 3. Recent Updates
printf "## Recent Updates\n\n" >> README.md

get_math_snippet() {
    # Grabs first non-empty line, removes \text per instructions
    content=$(grep -vE '^\\|^#|^$' "$1" | head -n 1 | sed 's/\\text//g')
    echo "$content" | cut -c 1-100 | sed 's/[]()[]//g'
}

ls -t *.md | grep -v "README.md" | head -5 | while read -r file; do
    TITLE=$(get_math_snippet "$file")
    [ -z "$TITLE" ] && TITLE="Problem: ${file%.*}"
    printf "* %s ... [[view]](%s)\n" "$TITLE" "$file" >> README.md
done

printf "\n---\n\n" >> README.md

# 4. Library by NU Category
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
git commit -m "Update index with NU book terminology and geometry clusters"
git push origin main