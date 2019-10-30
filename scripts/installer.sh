#!/bin/bash -e

readonly ATOM_PACKAGES="$HOME/.atom/packages"
readonly PROJECT_NAME="athena-ide-atom"

function check-existance() {
  if [ -d "$ATOM_PACKAGES/$PROJECT_NAME" ]; then
    echo "Package $ATOM_PACKAGES/$PROJECT_NAME already exists.."
    echo "Remove it by 'rm -rf $ATOM_PACKAGES/$PROJECT_NAME' or 'apm uninstall $PROJECT_NAME'"
    exit -1
  fi
}

function unzip-bin() {
  echo "Installing to $ATOM_PACKAGES/$PROJECT_NAME"
  unzip -d ${ATOM_PACKAGES} $0 > /dev/null 2>&1
}

function main() {
  check-existance
  unzip-bin
}

main "$@"
