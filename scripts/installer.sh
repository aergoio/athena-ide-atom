#!/bin/bash -e

readonly ATOM_PACKAGES="$HOME/.atom/packages"
readonly PROJECT_NAME="athena-ide-atom"

function check_existance() {
  if [ ! -d "$ATOM_PACKAGES" ]; then
    echo "No package home $ATOM_PACKAGES.."
    echo "Install atom first (https://atom.io/)"
    exit -1
  fi

  if [ -d "$ATOM_PACKAGES/$PROJECT_NAME" ]; then
    echo "Package $ATOM_PACKAGES/$PROJECT_NAME already exists.."
    echo "Remove it by 'rm -rf $ATOM_PACKAGES/$PROJECT_NAME' or 'apm uninstall $PROJECT_NAME'"
    exit -1
  fi
}

function unzip_bin() {
  echo "Installing to $ATOM_PACKAGES/$PROJECT_NAME"
  unzip -d "$ATOM_PACKAGES" "$0" > /dev/null 2>&1
}

function main() {
  check_existance
  unzip_bin
}

main "$@"

# Don't remove next statement
# It makes the separation with zip part
exit 0
