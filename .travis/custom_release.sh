#!/bin/bash
#
#
# CI/Dev beta release for "ci-beta" and "qa-beta" branches, based on deploy stage name
#
releaseDev()
{
  if [[ "${TRAVIS_BRANCH}" = "ci" ]] && [[ $TRAVIS_BUILD_STAGE_NAME == *"Beta"* ]]; then
    printf "${YELLOW}PUSHING ci-beta${NOCOLOR}\n"
    rm -rf ./build/.git
    .travis/release.sh "ci-beta"
    printf "${GREEN}COMPLETED ci-beta${NOCOLOR}\n"

    printf "${YELLOW}PUSHING qa-beta${NOCOLOR}\n"
    rm -rf ./build/.git
    .travis/release.sh "qa-beta"
    printf "${GREEN}COMPLETED qa-beta${NOCOLOR}\n"
  fi
}
#
#
# Prod release for "master" branch based on deploy stage name.
#
releaseProd()
{
  if [[ "${TRAVIS_BRANCH}" = "master" ]] && [[ $TRAVIS_BUILD_STAGE_NAME == *"Beta"* ]]; then
    printf "${YELLOW}PUSHING prod-beta${NOCOLOR}\n"
    rm -rf ./build/.git
    .travis/release.sh "prod-beta"
    printf "${GREEN}COMPLETED prod-beta${NOCOLOR}\n"
  fi

  if [[ "${TRAVIS_BRANCH}" = "master" ]] && [[ $TRAVIS_BUILD_STAGE_NAME != *"Beta"* ]];  then
    printf "${YELLOW}PUSHING prod-stable${NOCOLOR}\n"
    rm -rf ./build/.git
    .travis/release.sh "prod-stable"
    printf "${GREEN}COMPLETED prod-stable${NOCOLOR}\n"
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
