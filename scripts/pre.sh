#!/usr/bin/env bash
#
#
# Update deployment paths, prefixes
#
deployPaths()
{
  local CI_BRANCH=$1

  DEPLOY_PATH_PREFIX=""

  if [[ $CI_BRANCH == *"beta"* ]] || [[ $CI_BRANCH == *"master"* ]]; then
    DEPLOY_PATH_PREFIX=/beta
  fi

  echo UI_DEPLOY_PATH_PREFIX="$DEPLOY_PATH_PREFIX" >> ./.env.production.local

  echo "Deploy config for branch \"${CI_BRANCH}\"..."
  echo "Deploy path prefix ... UI_DEPLOY_PATH_PREFIX=$DEPLOY_PATH_PREFIX"
}
#
#
# Clean directories
#
version()
{
  UI_VERSION="$(node -p 'require(`./package.json`).version').$(git rev-parse --short HEAD)"
  echo "Version... UI_VERSION=$UI_VERSION"
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
  rm ./.env.production.local
}
#
#
# main()
#
{
  clean
  version

  # see .travis.yml globals
  deployPaths ${BRANCH:-local}
}
