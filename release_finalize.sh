#!/bin/bash

# Script: release_finalize.sh

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

# Wait for the user to merge the pull request before proceeding
read -p "Once the pull request is merged into main, press Enter to continue."

# Switch to main and pull the latest changes
echo "Switching to main and pulling latest changes..."
git checkout main
git pull origin main

# Merge main into develop to sync changes
echo "Switching to develop and merging main..."
git checkout develop
git pull origin develop
git rebase main
git push origin develop

# Create and push the tag
echo "Creating and pushing tag v${VERSION}..."
git tag "v${VERSION}"
git push origin "v${VERSION}"

echo "Release finalized, main and develop are in sync, and tag v${VERSION} created."
