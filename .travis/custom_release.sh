#!/bin/bash
#
#
# main()
#
{
  set -e
  set -x

  if [ "${TRAVIS_BRANCH}" = "ci" ]; then
      for env in ci qa
      do
        echo "PUSHING ${env}-beta"
        rm -rf ./dist/.git
        .travis/release.sh "${env}-beta"
      done
  fi

  if [ "${TRAVIS_BRANCH}" = "master" ]; then
    rm -rf ./build/.git

    echo "PUSHING prod-beta"
    .travis/release.sh "prod-beta"

    echo "PUSHING prod-stable"
    .travis/release.sh "prod-stable"
  fi
}
