#!/bin/bash

# 1. Start the README
printf "# Coyote Math Task Index\n\n" > README.md
printf "## Recent Updates\n\n" >> README.md

# Function to extract and clean math snippets
get_math_snippet() {
    # Grabs the first line that isn't a LaTeX command or header
    # Removes common LaTeX preamble junk to find the actual problem statement
    content=$(grep -vE '^\\|^#|^$' "$1" | head -n 1)
    
    # Clean up the snippet: 
    # - Limit length to 100 chars
    # - Remove any trailing special characters that break markdown links
    clean=$(echo "$content" | cut -c 1-100 | sed 's/[]()[]//g')
    echo "$clean"
}

# 2. Build Recent Updates
ls -t *.md | grep -v "README.md" | head -5 | while read -r file; do
    TITLE=$(get_math_snippet "$file")
    [ -z "$TITLE" ] && TITLE="Problem: ${file%.*}"
    # Format as: Snippet Text [view file](filename) 
    # This keeps the math outside the link brackets for better rendering
    printf "* %s ... [[view]](%s)\n" "$TITLE" "$file" >> README.md
done

printf "\n---\n\n" >> README.md

# 3. Library by Category
categories=("Jacobi" "Legendre" "Hermite" "Laguerre" "Racah" "Hahn" "Clebsch" "Sine-Gordon" "Geodesic")
display_names=("Jacobi Polynomials" "Legendre Polynomials" "Hermite Polynomials" "Laguerre Polynomials" "Racah Polynomials" "Hahn Polynomials" "Quantum Mechanics" "Differential Equations" "Geometry & Topology")

printf "## Library by Category\n\n" >> README.md

for i in "${!categories[@]}"; do
    cat_key="${categories[$i]}"
    cat_name="${display_names[$i]}"
    
    files=$(grep -il "$cat_key" *.md | grep -v "README.md")
    
    if [ -n "$files" ]; then
        printf "### $cat_name\n\n" >> README.md
        echo "$files" | while read -r file; do
            TITLE=$(get_math_snippet "$file")
            [ -z "$TITLE" ] && TITLE="Problem: ${file%.*}"
            # Keeping the math part separate from the link part improves rendering
            printf "* %s ... [[view]](%s)\n" "$TITLE" "$file" >> README.md
        done
        printf "\n" >> README.md
    fi
done

# 4. Standard Push
git add .
git commit -m "Fix math rendering in index"
git push origin main