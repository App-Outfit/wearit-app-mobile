#!/bin/bash

# Script: stop_release.sh

set -e  # Stop the script on errors

# Colors for better visibility
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
YELLOW='\033[0;33m'
RESET='\033[0m'

# Ensure on a release branch
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)

if [[ ! "$CURRENT_BRANCH" =~ ^release/v[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
  echo -e "${RED}Error:${RESET} You must be on a release branch (e.g., release/v1.2.3) to finalize a release."
  exit 1
fi

# Extract version from branch name
VERSION=${CURRENT_BRANCH#release/v}

echo -e "${CYAN}Preparing to finalize release for version ${YELLOW}${VERSION}${RESET}..."

# Push the release branch
echo -e "${CYAN}Pushing release branch to origin...${RESET}"
git push origin "$CURRENT_BRANCH"

# Create a pull request (requires GitHub CLI installed)
echo -e "${CYAN}Creating a pull request to merge ${YELLOW}$CURRENT_BRANCH${CYAN} into ${GREEN}main${CYAN}...${RESET}"
if ! gh pr create --base main --head "$CURRENT_BRANCH" --title "Release v$VERSION" --body "This is the release PR for version $VERSION."; then
  echo -e "${RED}Error:${RESET} Failed to create pull request. Ensure you have GitHub CLI installed and authenticated."
  exit 1
fi

echo -e "${GREEN}Pull request created successfully.${RESET}"
echo -e "${YELLOW}Please review and merge the pull request manually in the GitHub UI.${RESET}"

# Wait for the user to merge the pull request
read -p "Once the pull request is merged into main, press Enter to continue."

# Switch to main and pull the latest changes
echo -e "${CYAN}Switching to main and pulling the latest changes...${RESET}"
git checkout main
git pull origin main

# Create and push the tag
echo -e "${CYAN}Creating and pushing tag ${YELLOW}v${VERSION}${CYAN}...${RESET}"
git tag -a "v${VERSION}" -m "Release v${VERSION}"
git push origin "v${VERSION}"

# Merge main into develop
echo -e "${CYAN}Switching to develop and syncing it with main...${RESET}"
git checkout develop
git pull origin develop
git merge ${CURRENT_BRANCH} -m "Merge branch ${CURRENT_BRANCH} into develop"
git push origin develop

echo -e "${GREEN}Release finalized.${RESET}"
echo -e "${CYAN}Branches ${YELLOW}main${CYAN} and ${YELLOW}develop${CYAN} are in sync, and tag ${YELLOW}v${VERSION}${CYAN} has been created.${RESET}"
