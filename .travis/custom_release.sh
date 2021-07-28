#!/bin/bash
#
#
# Release a branch
release()
{
  local DEPLOY_BRANCH=$1

  printf "${YELLOW}PUSHING ${DEPLOY_BRANCH}${NOCOLOR}\n"
  rm -rf ./dist/.git
  .travis/release.sh "${DEPLOY_BRANCH}"
  printf "${GREEN}COMPLETED ${DEPLOY_BRANCH}${NOCOLOR}\n"
}
#
#
# CI/Dev beta release for "ci" and "qa" "beta" and "stable" branches, based on deploy stage name
#
releaseDev()
{
  if [[ "${TRAVIS_BRANCH}" = "ci-beta" || "${TRAVIS_BRANCH}" = "dev" || "${TRAVIS_BRANCH}" = "ci" ]] && [[ $TRAVIS_BUILD_STAGE_NAME == *"Beta"* ]]; then
    release "ci-beta"
    release "qa-beta"
  fi

  if [[ "${TRAVIS_BRANCH}" = "ci-stable" || "${TRAVIS_BRANCH}" = "test" || "${TRAVIS_BRANCH}" = "qa" ]] && [[ $TRAVIS_BUILD_STAGE_NAME != *"Beta"* ]];  then
    release "ci-stable"
    release "qa-stable"
  fi
}
#
#
# Prod release for "master" and "stage" branches based on deploy stage name.
#
releaseProd()
{
  if [[ "${TRAVIS_BRANCH}" = "prod-beta" || "${TRAVIS_BRANCH}" = "stage" ]] && [[ $TRAVIS_BUILD_STAGE_NAME == *"Beta"* ]]; then
    release "prod-beta"
  fi

  if [[ "${TRAVIS_BRANCH}" = "prod-stable" || "${TRAVIS_BRANCH}" = "prod" || "${TRAVIS_BRANCH}" = "main" || "${TRAVIS_BRANCH}" = "master" ]] && [[ $TRAVIS_BUILD_STAGE_NAME != *"Beta"* ]];  then
    if [[ "${TRAVIS_COMMIT_MESSAGE}" = *"chore(release):"* ]]; then
      release "prod-stable"
    fi
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
