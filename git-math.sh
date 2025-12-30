#!/bin/bash

# 1. setup readme header
printf "# Coyote Math Task Index\n\n" > README.md
printf "## Recent Activity\n" >> README.md
printf "The 5 most recently updated mathematical tasks in the repository:\n\n" >> README.md

# 2. get list of markdown files excluding indices
all_files=$(ls -1 *.md | grep -v "README.md" | grep -v "all.md")

# 3. loop through the top 5 latest files
ls -t $all_files | head -n 5 | while read -r file; do
    # extract the first 3 lines
    # sed removes \text but keeps all other math commands and $ delimiters
    # xargs trims whitespace but we use a specialized sed to join lines to avoid losing $
    PREVIEW=$(grep -vE '^\\|^#|^$' "$file" | head -n 3 | \
              sed 's/\\text//g' | \
              tr '\n' ' ' | sed 's/  */ /g' | cut -c 1-250)
    
    # fallback if preview extraction is empty
    if [ -z "$PREVIEW" ]; then PREVIEW="Mathematical task ${file%.md}"; fi

    # append to readme using filename link
    printf "%s ... [[%s]](https://github.com/igorratn/coyote-math/blob/main/%s)\n\n" "$PREVIEW" "$file" "$file" >> README.md
done

# 4. git automation
git add README.md
git commit -m "index: fix math rendering in previews"
git push origin main