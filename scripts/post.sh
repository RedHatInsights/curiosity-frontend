#!/usr/bin/env bash
#
#
# main()
#
{
  echo "Cleaning up build resources..."

  # clean up build
  rm -f ./build/*manifest*.js*
  rm -f ./build/service-worker.js
}
