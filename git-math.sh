#!/bin/bash

# Ensure we are in a git repository
if ! git rev-parse --is-inside-work-tree > /dev/null 2>&1; then
  echo "Error: Not a git repository."
  exit 1
fi

# Use a specific message if provided, else use the general math update message
if [ -z "$1" ]
then
    MESSAGE="Update math problems and derivations (.md)"
else
    MESSAGE="$1"
fi

# Execute commands
git add .
git commit -m "$MESSAGE"
git push
