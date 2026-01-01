#!/bin/bash

# 1. setup readme header with documentation link

printf "# Coyote Math Task Index\n\n" > README.md
printf "## Documentation\n" >> README.md
printf "Detailed proof analysis and clustering: [Google Doc](https://docs.google.com/document/d/1vrRIbRS1Zi0qY7KNODVhqSM5Zrq4iXK4TO8kBl9UVBI/edit?tab=t.0)\n\n" >> README.md

printf "## Recent Activity\n" >> README.md
printf "The 5 most recently updated mathematical tasks in the repository:\n\n" >> README.md

# 2. get list of markdown files excluding indices

all_files=$(ls -1 *.md | grep -v "README.md" | grep -v "all.md")

# 3. loop through the top 5 latest files

ls -t $all_files | head -n 5 | while read -r file; do
    
    # capture the preview into a variable properly
    # removes \text and joins lines to keep math snippets intact
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
git commit -m "index: add central documentation link"
git push origin main