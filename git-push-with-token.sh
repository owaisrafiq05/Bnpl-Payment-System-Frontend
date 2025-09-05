#!/bin/bash
set -euo pipefail

# --- CONFIG ---
REPO_OWNER="owaisrafiq05"   # e.g. your org or username
REPO_NAME="Bnpl-Payment-System-Frontend"             # repo name
BRANCH="main"                    # branch you want to push to
# ---------------

read -p "GitHub Username: " GH_USER
read -s -p "Fine-grained Token: " GH_TOKEN
echo ""

# Commit all staged and unstaged changes
git add .
echo "Enter commit message: "
read COMMIT_MSG
git commit -m "$COMMIT_MSG" || echo "Nothing to commit"

# Push using token (not saved anywhere)
git push https://$GH_USER:$GH_TOKEN@github.com/$REPO_OWNER/$REPO_NAME.git $BRANCH

# Cleanup
unset GH_TOKEN
history -d $((HISTCMD-1)) 2>/dev/null || true

echo "✅ Push complete. Token cleared."
