#!/usr/bin/env bash
#
#
# Update deployment paths, prefixes
#
deployPaths()
{
  local DEPLOY_BRANCH=$1
  local DEPLOY_BUILD_STAGE=$2
  local CONTAINER_BUILD_ENV=$3

  DEPLOY_PATH_PREFIX=""

  # Note: allow Container build, fallback to Travis build
  if [[ $CONTAINER_BUILD_ENV == "true" ]]; then
    DEPLOY_PATH_PREFIX=/preview
    DEPLOY_PATH_LINK_PREFIX=/preview
  elif [[ $DEPLOY_BUILD_STAGE == *"Beta"* ]]; then
    DEPLOY_PATH_PREFIX=/beta
    DEPLOY_PATH_LINK_PREFIX=/preview
  fi

  echo UI_DEPLOY_PATH_PREFIX="$DEPLOY_PATH_PREFIX" >> ./.env.production.local
  echo UI_DEPLOY_PATH_LINK_PREFIX="$DEPLOY_PATH_LINK_PREFIX" >> ./.env.production.local

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

  # Note: See .travis.yml globals, GitHub actions, and Container Build environment variables
  # - Travis, GitHub actions: BRANCH, BUILD_STAGE
  # - Container Build: BETA
  deployPaths "${BRANCH:-local}" "${BUILD_STAGE:-Local Deploy}" "${BETA:-local env}"
}
