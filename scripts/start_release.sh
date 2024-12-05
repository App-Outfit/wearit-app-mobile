#!/bin/bash

# Script: start_release.sh
set -e  # Stop the script on errors

# Colors for better visibility
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
YELLOW='\033[0;33m'
RESET='\033[0m'

# Utility Functions
function print_usage {
  echo -e "${CYAN}Usage:${RESET} npm run release:start <${YELLOW}major|minor|patch${RESET}>"
  echo ""
  echo -e "${CYAN}Choose the version increment type:${RESET}"
  echo -e "  ${YELLOW}major${RESET}: For ${RED}breaking changes${RESET}."
  echo -e "  ${YELLOW}minor${RESET}: For ${GREEN}new features${RESET}."
  echo -e "  ${YELLOW}patch${RESET}: For ${CYAN}bug fixes${RESET}."
  echo ""
  echo -e "${CYAN}For more information, visit:${RESET} ${BLUE}https://semver.org/${RESET}"
  exit 1
}

function get_current_version {
  git tag --sort=-v:refname | grep -E '^v[0-9]+\.[0-9]+\.[0-9]+$' | head -n 1 | sed 's/^v//' || echo "0.0.0"
}

function increment_version {
  local version=$1
  local part=$2

  IFS='.' read -r major minor patch <<< "$version"

  case $part in
    major) ((major++)); minor=0; patch=0 ;;
    minor) ((minor++)); patch=0 ;;
    patch) ((patch++)) ;;
    *) echo -e "${RED}Invalid version part: $part${RESET}"; exit 1 ;;
  esac

  echo "${major}.${minor}.${patch}"
}

# Check parameters
if [ "$#" -ne 1 ] || [[ ! "$1" =~ ^(major|minor|patch)$ ]]; then
  print_usage
fi

TYPE=$1

# Ensure on the develop branch
echo -e "${CYAN}Ensuring you are on the ${YELLOW}develop${CYAN} branch...${RESET}"
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
if [[ "$CURRENT_BRANCH" != "develop" ]]; then
  echo -e "${YELLOW}Switching to develop branch...${RESET}"
  git checkout develop
fi

# Pull the latest changes from develop
echo -e "${CYAN}Updating develop branch with the latest changes...${RESET}"
git pull origin develop

# Verify if there are uncommitted changes
if [[ -n $(git status --porcelain) ]]; then
  echo -e "${RED}Error: You have uncommitted changes. Please commit or stash them before proceeding.${RESET}"
  exit 1
fi

# Fetch the current version
CURRENT_VERSION=$(get_current_version)
echo -e "${CYAN}Current version:${RESET} ${YELLOW}$CURRENT_VERSION${RESET}"

NEW_VERSION=$(increment_version "$CURRENT_VERSION" "$TYPE")
echo -e "${CYAN}New version:${RESET} ${GREEN}$NEW_VERSION${RESET}"

NEW_TAG="v$NEW_VERSION"
echo -e "${CYAN}New tag:${RESET} ${GREEN}$NEW_TAG${RESET}"

# Create the release branch
BRANCH_NAME="release/v${NEW_VERSION}"
echo -e "${CYAN}Creating release branch: ${YELLOW}$BRANCH_NAME${RESET}"
git checkout -b "$BRANCH_NAME" develop

echo -e "${GREEN}Release branch '$BRANCH_NAME' created successfully.${RESET}"
