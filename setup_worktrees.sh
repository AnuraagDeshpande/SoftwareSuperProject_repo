#!/bin/bash

# Define the main repository folder
MAIN_REPO=$(pwd)  # The current directory
WORKTREE_DIR="$MAIN_REPO/worktrees"  # Store all worktrees in a subdirectory

# Ensure the worktrees directory exists
mkdir -p "$WORKTREE_DIR"

# Fetch all branches
git fetch --all

# Loop through all remote branches
for branch in $(git branch -r | grep -v HEAD | sed 's/origin\///'); do
    if [ ! -d "$WORKTREE_DIR/$branch" ]; then  # Only add if it doesn't exist
        echo "Setting up worktree for branch: $branch"
        git worktree add "$WORKTREE_DIR/$branch" "$branch"
    else
        echo "Worktree for $branch already exists."
    fi
done

echo "✅ Worktrees are set up in: $WORKTREE_DIR"