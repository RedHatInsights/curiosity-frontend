#!/bin/bash
#
#
# Release a branch
release()
{
  local DEPLOY_BRANCH=$1

  printf "${YELLOW}PUSHING ${DEPLOY_BRANCH}${NOCOLOR}\n"
  rm -rf ./build/.git
  .travis/release.sh "${DEPLOY_BRANCH}"
  printf "${GREEN}COMPLETED ${DEPLOY_BRANCH}${NOCOLOR}\n"
}
#
#
# CI/Dev beta release for "ci" and "qa" "beta" and "stable" branches, based on deploy stage name
#
releaseDev()
{
  local CI_BRANCH=$1
  local CI_BUILD_STAGE=$2

  if [[ "${CI_BRANCH}" = "ci-beta" || "${CI_BRANCH}" = "dev" || "${CI_BRANCH}" = "ci" ]] && [[ $CI_BUILD_STAGE == *"Beta"* ]]; then
    release "ci-beta"
    release "qa-beta"
  fi

  if [[ "${CI_BRANCH}" = "ci-stable" || "${CI_BRANCH}" = "test" || "${CI_BRANCH}" = "qa" ]] && [[ $CI_BUILD_STAGE != *"Beta"* ]];  then
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
  local CI_BRANCH=$1
  local CI_BUILD_STAGE=$2
  local CI_COMMIT_MESSAGE=$3

  if [[ "${CI_BRANCH}" = "prod-beta" || "${CI_BRANCH}" = "stage" ]] && [[ $CI_BUILD_STAGE == *"Beta"* ]]; then
    release "prod-beta"
  fi

  if [[ "${CI_BRANCH}" = "prod-stable" || "${CI_BRANCH}" = "prod" || "${CI_BRANCH}" = "main" || "${CI_BRANCH}" = "master" ]] && [[ $CI_BUILD_STAGE != *"Beta"* ]];  then
    if [[ "${CI_COMMIT_MESSAGE}" = *"chore(release):"* ]]; then
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

  releaseDev $BRANCH $BUILD_STAGE
  releaseProd $BRANCH $BUILD_STAGE $TRAVIS_COMMIT_MESSAGE
}
