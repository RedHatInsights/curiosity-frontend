#!/bin/bash
#
#
# Release a branch. APP_BUILD_DIR should be updated at the Travis configuration level.
release()
{
  local DEPLOY_BRANCH=$1
  local BUILD_DIR=$APP_BUILD_DIR

  printf "${YELLOW}PUSHING ${DEPLOY_BRANCH}${NOCOLOR}\n"
  rm -rf "./${BUILD_DIR}/.git"
  .travis/release.sh "${DEPLOY_BRANCH}"
  printf "${GREEN}COMPLETED ${DEPLOY_BRANCH}${NOCOLOR}\n"
}
#
#
# Dev release when pushing into "dev" and "main"/"master" branches. Beta/stable condition for Travis build stage name.
#
releaseDev()
{
  if [[ "${TRAVIS_BRANCH}" = "main" ]] && [[ $TRAVIS_BUILD_STAGE_NAME == *"Beta"* ]]; then
    release "ci-beta"
    release "qa-beta"
  fi

  if [[ "${TRAVIS_BRANCH}" = "stable" ]] && [[ $TRAVIS_BUILD_STAGE_NAME != *"Beta"* ]];  then
    release "ci-stable"
    release "qa-stable"
  fi
}
#
#
# Prod release for "main" based on commit message, and tags. Sync related lower environments.
#
releaseProd()
{
  local UPDATED_UI_VERSION="$(node -p 'require(`./package.json`).version')";

  if [[ "${TRAVIS_COMMIT_MESSAGE}" = *"chore(release):"* ]]; then
    if [[ "${TRAVIS_BRANCH}" = "v${UPDATED_UI_VERSION}" ]] && [[ $TRAVIS_BUILD_STAGE_NAME != *"Beta"* ]]; then
      release "ci-stable"
      release "qa-stable"
      release "prod-beta"
      release "prod-stable"
    fi
  elif [[ "${TRAVIS_BRANCH}" = *"-alpha"* || "${TRAVIS_BRANCH}" = *"-beta"* || "${TRAVIS_BRANCH}" = *"-rc."* ]] && [[ $TRAVIS_BUILD_STAGE_NAME == *"Beta"* ]]; then
    release "prod-beta"
  fi

}
#
#
# main()
#
{
  set -e
  set -x

  BLUE="\e[34m"
  RED="\e[31m"
  GREEN="\e[32m"
  YELLOW="\e[33m"
  NOCOLOR="\e[39m"

  releaseDev
  releaseProd
}
