#!/usr/bin/env bash
#
#
# main()
#
{
  UI_VERSION="$(node -p 'require(`./package.json`).version').$(git rev-parse --short HEAD)"
  echo "Compiling version information... v$UI_VERSION"
  echo UI_VERSION="$UI_VERSION" > ./.env.production.local
}
