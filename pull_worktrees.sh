#!/bin/bash

WORKTREE_DIR="worktrees"

for branch_dir in "$WORKTREE_DIR"/*; do
    if [ -d "$branch_dir" ]; then
        echo "🔄 Pulling updates for $(basename "$branch_dir")..."
        cd "$branch_dir"
        git pull origin $(basename "$branch_dir")
        cd - > /dev/null
    fi
done

echo "✅ All worktrees are up to date!"
