#!/usr/bin/env bash
#
#
# Update deployment paths, prefixes
#
deployPaths()
{
  local DEPLOY_BRANCH=$1
  local CONTAINER_BUILD_ENV=$3

  DEPLOY_PATH_PREFIX=""
  DEPLOY_STAGE="Stable"

  # Note: allow Container build
  if [[ $CONTAINER_BUILD_ENV == "true" ]]; then
    DEPLOY_STAGE="Preview"
    DEPLOY_PATH_PREFIX=/preview
    DEPLOY_PATH_LINK_PREFIX=/preview
  fi

  echo UI_DEPLOY_PATH_PREFIX="$DEPLOY_PATH_PREFIX" >> ./.env.production.local
  echo UI_DEPLOY_PATH_LINK_PREFIX="$DEPLOY_PATH_LINK_PREFIX" >> ./.env.production.local

  echo "\"${DEPLOY_STAGE}\" build stage config for branch \"${DEPLOY_BRANCH}\"..."
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
  rm -rf -- ./dist
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

  # Note: See GitHub actions, and Container Build environment variables
  # - GitHub actions: BRANCH, BETA
  # - Container Build: BETA
  deployPaths "${BRANCH:-local}" "${BETA:-local env}"
}
