#!/usr/bin/env bash
#
#
# Update deployment paths, prefixes
#
deployPaths()
{
  local DEPLOY_BRANCH=$1
  local DEPLOY_BUILD_STAGE=$2

  DEPLOY_PATH_PREFIX=""

  if [[ $DEPLOY_BUILD_STAGE == *"Beta"* ]]; then
    DEPLOY_PATH_PREFIX=/beta
  fi

  echo UI_DEPLOY_PATH_PREFIX="$DEPLOY_PATH_PREFIX" >> ./.env.production.local

  echo "\"${DEPLOY_BUILD_STAGE}\" build stage config for branch \"${DEPLOY_BRANCH}\"..."
  printf "Deploy path prefix ... ${GREEN}UI_DEPLOY_PATH_PREFIX=$DEPLOY_PATH_PREFIX${NOCOLOR}\n"
}
#
#
# Clean directories
#
version()
{
  UI_VERSION="$(node -p 'require(`./package.json`).version').$(git rev-parse --short HEAD)"
  printf "Version... ${GREEN}UI_VERSION=$UI_VERSION${NOCOLOR}\n"
  echo UI_VERSION="$UI_VERSION" >> ./.env.production.local
}
#
#
# Clean directories
#
clean()
{
  echo "Cleaning build directories, files..."
  rm -rf -- ./build
  rm -rf -- ./public/apps
  rm -f ./.env.production.local
}
#
#
# main()
#
{
  BLUE="\e[34m"
  RED="\e[31m"
  GREEN="\e[32m"
  YELLOW="\e[33m"
  NOCOLOR="\e[39m"

  clean
  version

  # see .travis.yml globals
  deployPaths "${BRANCH:-local}" "${BUILD_STAGE:-Local Deploy}"
}
