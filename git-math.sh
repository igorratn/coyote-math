#!/bin/bash

# 1. Setup README header with documentation link
printf "# Coyote Math Task Index\n\n" > README.md
printf "## Documentation\n" >> README.md
printf "Detailed proof analysis and clustering: [Google Doc](https://docs.google.com/document/d/1vrRIbRS1Zi0qY7KNODVhqSM5Zrq4iXK4TO8kBl9UVBI/edit?tab=t.0)\n\n" >> README.md
printf "## Recent Activity\n" >> README.md
printf "The 5 most recently updated mathematical tasks in the repository:\n\n" >> README.md

# 2. Get list of markdown files excluding indices
all_files=$(ls -1 *.md | grep -v "README.md" | grep -v "all.md")

# 3. Loop through the top 5 latest files and add previews
ls -t $all_files | head -n 5 | while read -r file; do
    # Extract preview: first 3 non-empty, non-comment, non-header lines
    # Remove \text{}, join lines, collapse spaces, truncate to ~250 chars
    PREVIEW=$(grep -vE '^\\|^#|^$' "$file" | head -n 3 | \
              sed 's/\\text{[^}]*}//g' | \
              tr '\n' ' ' | sed 's/  */ /g' | cut -c 1-250)

    # Fallback if preview is empty
    if [ -z "$PREVIEW" ]; then
        PREVIEW="Mathematical task ${file%.md}"
    fi

    # Append to README with link to the file
    printf "%s ... [[%s]](https://github.com/igorratn/coyote-math/blob/main/%s)\n\n" \
           "$PREVIEW" "$file" "$file" >> README.md
done

# 4. Git automation: stage all new and modified files, then commit and push
git add -A                                   # Stages all new, modified, and deleted files
git commit -m "index: update README with latest tasks and documentation link"
git push origin main