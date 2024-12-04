#!/bin/bash

# Script: release_start.sh
set -e  # Stop the script on errors

# Utility Functions
function print_usage {
  echo "Usage: $0 <major|minor|patch>"
  echo ""
  echo "Choose the version increment type based on the nature of your changes:"
  echo "  - major: For breaking changes that are incompatible with the current API."
  echo "           Example: Removing or modifying an existing feature."
  echo "  - minor: For adding new features that are backward compatible."
  echo "           Example: Adding a new feature or endpoint without affecting existing ones."
  echo "  - patch: For bug fixes or minor changes that don't impact the API."
  echo "           Example: Fixing a bug or making visual adjustments."
  exit 1
}

function get_current_version {
  git tag --sort=-v:refname | grep -E '^[0-9]+\.[0-9]+\.[0-9]+$' | head -n 1 || echo "0.0.0"
}

function increment_version {
  local version=$1
  local part=$2

  IFS='.' read -r major minor patch <<< "$version"

  case $part in
    major) ((major++)); minor=0; patch=0 ;;
    minor) ((minor++)); patch=0 ;;
    patch) ((patch++)) ;;
    *) echo "Invalid version part: $part"; exit 1 ;;
  esac

  echo "${major}.${minor}.${patch}"
}

# Check parameters
if [ "$#" -ne 1 ]; then
  print_usage
fi

TYPE=$1

if [[ ! "$TYPE" =~ ^(major|minor|patch)$ ]]; then
  print_usage
fi

# Fetch the current version
CURRENT_VERSION=$(get_current_version)
NEW_VERSION=$(increment_version "$CURRENT_VERSION" "$TYPE")

echo "Current version: $CURRENT_VERSION"
echo "New version: $NEW_VERSION"

# Create the release branch
BRANCH_NAME="release/v${NEW_VERSION}"
echo "Creating release branch: $BRANCH_NAME"
git checkout -b "$BRANCH_NAME" develop

echo "Release branch '$BRANCH_NAME' created. Make your changes and finalize the release later."
