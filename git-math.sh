#!/bin/bash

# Ensure we are in a git repository
if ! git rev-parse --is-inside-work-tree > /dev/null 2>&1; then
  exit 1
fi

# 1. Update the README with a list of the 5 most recently modified .md files
echo "# Math Problems" > README.md
echo "## Recently Updated" >> README.md
ls -t *.md | grep -v "README.md" | head -5 | sed 's/\(.*\)/- [\1](\1)/' >> README.md
echo "" >> README.md
echo "---" >> README.md

# 2. Use a general message or custom one
if [ -z "$1" ]
then
    MESSAGE="Update math problems and derivations (.md)"
else
    MESSAGE="$1"
fi

# 3. Execute git commands
git add .
git commit -m "$MESSAGE"
git push