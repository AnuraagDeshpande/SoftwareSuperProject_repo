#!/bin/bash

WORKTREE_DIR="worktrees"

for branch_dir in "$WORKTREE_DIR"/*; do
    if [ -d "$branch_dir" ]; then
        cd "$branch_dir"
        
        # Check if there are changes to commit
        if [[ -n $(git status --porcelain) ]]; then
            echo "🚀 Pushing changes for $(basename "$branch_dir")..."
            git add .
            git commit -m "Auto-commit: Updating $(basename "$branch_dir")"
            git push origin $(basename "$branch_dir")
        else
            echo "✅ No changes in $(basename "$branch_dir")"
        fi
        
        cd - > /dev/null
    fi
done

echo "✅ All worktrees are pushed!"