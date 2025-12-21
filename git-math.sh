#!/bin/bash

# 1. Start the README
printf "# Coyote Math Task Index\n\n" > README.md
printf "## Recently Updated\n\n" >> README.md

# 2. Peek into the 10 most recent files to create the "Recent" section
# This finds the filename and the first non-empty line (usually the title)
for file in $(ls -t *.md | grep -v "README.md" | head -10); do
    TITLE=$(grep -m 1 "." "$file" | sed 's/#//g' | x86_64-apple-darwin21-strip -p 2>/dev/null || grep -m 1 "." "$file" | sed 's/#//g')
    printf "* [%s](%s)\n" "$TITLE" "$file" >> README.md
done

printf "\n---\n\n" >> README.md

# 3. Re-scan all files to reconstruct the grouped index
# This looks for keywords like 'Jacobi', 'Hermite', etc., inside the files
printf "## 1. Orthogonal Polynomials\n\n" >> README.md

for category in "Jacobi" "Legendre" "Hermite" "Laguerre" "Racah" "Hahn"; do
    printf "### $category\n\n" >> README.md
    # Find files containing the category name (case insensitive)
    for file in $(grep -il "$category" *.md | grep -v "README.md"); do
        TITLE=$(grep -m 1 "." "$file" | sed 's/#//g')
        printf "* [%s](%s)\n" "$TITLE" "$file" >> README.md
    done
    printf "\n" >> README.md
done

# 4. Standard Git Commands
git add .
git commit -m "Update dynamic index from file content"
git push origin main