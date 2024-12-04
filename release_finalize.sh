#!/bin/bash

# Script: release_finalize_with_pr.sh
set -e  # Stop the script on errors

# Ensure on a release branch
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)

if [[ ! "$CURRENT_BRANCH" =~ ^release/v[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
  echo "You must be on a release branch (e.g., release/v1.2.3) to finalize a release."
  exit 1
fi

# Extract version from branch name
VERSION=${CURRENT_BRANCH#release/v}

echo "Preparing to finalize release for version $VERSION"

# Push the release branch (if not already pushed)
echo "Pushing release branch to origin..."
git push origin "$CURRENT_BRANCH"

# Create a pull request (requires GitHub CLI installed)
echo "Creating a pull request to merge $CURRENT_BRANCH into main..."
gh pr create --base main --head "$CURRENT_BRANCH" --title "Release v$VERSION" --body "This is the release PR for version $VERSION."

echo "Pull request created. Please review and merge manually from the GitHub UI."