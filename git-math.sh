#!/bin/bash

# 1. Start the README
printf "# Coyote Math Task Index\n\n" > README.md
printf "## Recent Updates\n\n" >> README.md

# Function to extract a clean title/snippet from a file
get_snippet() {
    # 1. Get first 10 lines
    # 2. Ignore lines starting with \ (LaTeX commands) or # (Markdown headers)
    # 3. Ignore empty lines
    # 4. Take the first remaining line and cut it at 80 characters
    grep -vE '^\\|^#|^$' "$1" | head -n 1 | cut -c 1-80 | sed 's/[[:space:]]*$//'
}

# 2. Build the "Recent Updates" Section (Last 5 modified files)
ls -t *.md | grep -v "README.md" | head -5 | while read -r file; do
    SNIPPET=$(get_snippet "$file")
    # If snippet is empty, use the filename as a backup title
    [ -z "$SNIPPET" ] && SNIPPET="Problem: ${file%.*}"
    printf "* [%s](%s)\n" "$SNIPPET" "$file" >> README.md
done

printf "\n---\n\n" >> README.md

# 3. Build the Grouped Categories
# We use your existing categories but populate them dynamically
categories=("Jacobi" "Legendre" "Hermite" "Laguerre" "Racah" "Hahn" "Clebsch" "Sine-Gordon" "Geodesic")
display_names=("Jacobi Polynomials" "Legendre Polynomials" "Hermite Polynomials" "Laguerre Polynomials" "Racah Polynomials" "Hahn Polynomials" "Quantum Mechanics" "Differential Equations" "Geometry & Topology")

printf "## Library by Category\n\n" >> README.md

for i in "${!categories[@]}"; do
    cat_key="${categories[$i]}"
    cat_name="${display_names[$i]}"
    
    # Check if any files contain the keyword (case-insensitive)
    files=$(grep -il "$cat_key" *.md | grep -v "README.md")
    
    if [ -n "$files" ]; then
        printf "### $cat_name\n\n" >> README.md
        echo "$files" | while read -r file; do
            SNIPPET=$(get_snippet "$file")
            [ -z "$SNIPPET" ] && SNIPPET="Problem: ${file%.*}"
            printf "* [%s](%s)\n" "$SNIPPET" "$file" >> README.md
        done
        printf "\n" >> README.md
    fi
done

# 4. Git Push
git add .
git commit -m "Update intelligent dynamic index"
git push origin main