#!/usr/bin/env bash
#
#
# main()
#
{
  echo "Cleaning up build resources..."

  # clean up build
  rm ./build/*manifest*.js*
  rm ./build/service-worker.js
}
