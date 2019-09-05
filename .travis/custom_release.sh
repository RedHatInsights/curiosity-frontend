#!/bin/bash
#
#
# main()
#
{
  set -e
  set -x

  if [ "${TRAVIS_BRANCH}" = "ci" ]; then
    echo "PUSHING ci-beta"
    rm -rf ./build/.git
    .travis/release.sh "ci-beta"

    echo "PUSHING qa-beta"
    rm -rf ./build/.git
    .travis/release.sh "qa-beta"
  fi

  if [ "${TRAVIS_BRANCH}" = "master" ]; then
    echo "PUSHING prod-beta"
    rm -rf ./build/.git
    .travis/release.sh "prod-beta"

    echo "PUSHING prod-stable"
    rm -rf ./build/.git
    .travis/release.sh "prod-stable"
  fi
}
