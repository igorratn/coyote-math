#!/bin/bash

# 1. Start the README
printf "# Coyote Math Task Index\n\n" > README.md

# 2. Dynamic Pool & Tree Creation (No hard-coding)
# This identifies the "pool" by finding frequent capitalized words in your files
printf "## Dynamic Problem Tree\n\n" >> README.md
printf '```text\n' >> README.md
printf "Root: Mathematical Physics Collection\n" >> README.md

# Auto-generate the pool by finding frequent capitalized words in .md files
# We filter out common English words and look for "Math Names"
DYNAMIC_POOL=$(grep -oE '\b[A-Z][a-z]+\b' *.md | cut -d: -f2 | sort | uniq -c | sort -nr | head -n 12 | awk '{print $2}' | grep -vE "The|Let|For|If|This|Claim|Proof|True|False|And")

for tag in $DYNAMIC_POOL; do
    # Dynamically find all files containing this specific tag
    matches=$(grep -il "$tag" *.md | grep -v "README.md" | sed 's/\.md//g' | tr '\n' ',' | sed 's/,$//')
    
    if [ -n "$matches" ] && [[ "$matches" == *","* ]]; then
        # Only create a branch if more than one file belongs to it
        printf "├── %s Cluster: %s\n" "$tag" "$matches" >> README.md
    fi
done
printf "└── Miscellaneous: Others\n" >> README.md
printf '```\n\n' >> README.md



printf "---\n\n" >> README.md

# 3. Recent Updates
printf "## Recent Updates\n\n" >> README.md

get_math_snippet() {
    # Grabs first line of content, removes \text, and cleans math
    content=$(grep -vE '^\\|^#|^$' "$1" | head -n 1 | sed 's/\\text//g')
    echo "$content" | cut -c 1-100 | sed 's/[]()[]//g'
}

ls -t *.md | grep -v "README.md" | head -5 | while read -r file; do
    TITLE=$(get_math_snippet "$file")
    [ -z "$TITLE" ] && TITLE="Problem: ${file%.*}"
    printf "* %s ... [[view]](%s)\n" "$TITLE" "$file" >> README.md
done

printf "\n---\n\n" >> README.md

# 4. Dynamic Library by Category
printf "## Library by Category\n\n" >> README.md

for tag in $DYNAMIC_POOL; do
    files=$(grep -il "$tag" *.md | grep -v "README.md")
    
    if [ -n "$files" ]; then
        printf "### %s\n\n" "$tag" >> README.md
        echo "$files" | while read -r file; do
            TITLE=$(get_math_snippet "$file")
            [ -z "$TITLE" ] && TITLE="ID: ${file%.*}"
            printf "* %s ... [[view]](%s)\n" "$TITLE" "$file" >> README.md
        done
        printf "\n" >> README.md
    fi
done

# 5. Standard Push
git add .
git commit -m "Completely dynamic index refresh with auto-pool generation"
git push origin main