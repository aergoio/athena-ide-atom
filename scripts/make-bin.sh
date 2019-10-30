#!/bin/bash -e

# Resolve script home
SOURCE="${BASH_SOURCE[0]}"
# resolve $SOURCE until the file is no longer a symlink
while [ -h "$SOURCE" ]; do
  SCRIPT_HOME="$( cd -P "$( dirname "$SOURCE" )" >/dev/null && pwd )"
  SOURCE="$(readlink "$SOURCE")"
  # if $SOURCE was a relative symlink, we need to resolve it relative to the path where the symlink file was located
  [[ $SOURCE != /* ]] && SOURCE="$SCRIPT_HOME/$SOURCE"
done
readonly SCRIPT_HOME="$( cd -P "$( dirname "$SOURCE" )" >/dev/null && pwd )"

readonly PROJECT_NAME="athena-ide-atom"
readonly PROJECT_HOME=$(cd $SCRIPT_HOME/.. && pwd)
readonly VERSION=$(cat ${PROJECT_HOME}/package.json | grep version | head -1 | cut -d"\"" -f4)
readonly TEMP_ZIP="temp.zip"
readonly TARGET_FILE="$PROJECT_NAME-$VERSION-installer.bin"

function build-dist() {
  echo "Building dist.."
  rm -rf ${PROJECT_HOME}/node_modules
  npm install
  npm run build
}

function clean-dev-modules() {
  echo "Cleaning dev dependencies.."
  npm prune --production
}

function archive-bin() {
  local target="$PROJECT_HOME/$TARGET_FILE"
  echo "Archiving.."

  pushd $PROJECT_HOME/.. > /dev/null
  zip -r ${TEMP_ZIP} ${PROJECT_NAME} -x \*.git\* -x \*.bin -x .DS_Store > /dev/null
  cat << EOF | cat - ${PROJECT_HOME}/scripts/installer.sh ${TEMP_ZIP} > ${target}
EOF
  chmod +x ${target}
  rm ${TEMP_ZIP}
  popd > /dev/null

  echo -e "\nInstaller file is generated to $target"
}

function main() {
  build-dist
  clean-dev-modules
  archive-bin
}

main $@
