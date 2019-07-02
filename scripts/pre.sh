#!/usr/bin/env bash
#
#
# Update public path
#
path()
{

  local CI_BRANCH=$1

  PUBLIC_URL_PREFIX=""

  if [[ $CI_BRANCH == *"beta"* ]] || [[ $CI_BRANCH == *"master"* ]]; then
    PUBLIC_URL_PREFIX=/beta
  fi

  echo "Path prefix for branch ${CI_BRANCH}... PUBLIC_URL_PREFIX=$PUBLIC_URL_PREFIX"
  echo PUBLIC_URL_PREFIX="$PUBLIC_URL_PREFIX" >> ./.env.production.local
}
#
#
# Clean directories
#
version()
{
  UI_VERSION="$(node -p 'require(`./package.json`).version').$(git rev-parse --short HEAD)"
  echo "Version... UI_VERSION=$UI_VERSION"
  echo UI_VERSION="$UI_VERSION" > ./.env.production.local
}
#
#
# Clean directories
#
clean()
{
  echo "Cleaning build directories..."
  rm -rf -- "$(pwd)"/build
  rm -rf -- "$(pwd)"/public/apps;
}
#
#
# main()
#
{
  clean
  version

  # see .travis.yml globals
  path $BRANCH
}
