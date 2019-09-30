#!/usr/bin/env bash
#
#
# Clone, build for local development
#
gitRepo()
{
  local GITREPO=$1
  local DIR=$2
  local DIR_REPO=$3
  local CURRENT_DATE=$(date "+%s")
  local EXPIRE=$(head -n 1 $DIR/expire.txt)

  if [ ! -d $DIR_REPO/build ] || [ "${EXPIRE:-0}" -lt "${CURRENT_DATE}" ]; then
    mkdir -p $DIR
    rm -rf $DIR/temp
    (cd $DIR && git clone --depth=1 $GITREPO temp > /dev/null 2>&1)

    if [ $? -eq 0 ]; then
      printf "\n${GREEN}Checking ${GITREPO} ...${NOCOLOR}"

      rm -rf $DIR_REPO
      cp -R  $DIR/temp $DIR_REPO

      rm -rf $DIR/temp
      rm -rf $DIR_REPO/.git

      echo $(date -v +10d "+%s") > $DIR/expire.txt

      printf "${GREEN}Clone SUCCESS${NOCOLOR}\n"

    elif [ -d $DIR_REPO ]; then
      printf "${YELLOW}Unable to connect, using cached ${GITREPO}...${NOCOLOR}\n"
    else
      printf "${RED}Build Error cloning ${GITREPO}, unable to setup Docker${NOCOLOR}\n"
      exit 1
    fi
  fi
}
#
#
# Clean up build env
#
cleanLocalDotEnv()
{
  echo "" > ./.env.development.local
  echo "" > ./.env.production.local
}
#
#
# Build chrome resources
#
buildChrome()
{
  local DIR_REPO=$1
  local DIR_PUBLIC=$2
  local SNIPPET_HEAD=$3
  local SNIPPET_BODY=$4

  if [ ! -d $DIR_REPO/build ]; then
    printf "\n${GREEN}Building Chrome...${NOCOLOR}"

    if [ -z "$(node -v)" ] || [ -z "$(yarn -v)" ]; then
      printf "${YELLOW}Node and Yarn need to be installed in order to local run.${NOCOLOR}\n"
      exit 0
    fi

    (cd $DIR_REPO && yarn && yarn build > /dev/null 2>&1)
    printf "\n${GREEN}Build SUCCESS${NOCOLOR}"
  fi

  printf "\n${GREEN}Setting up local chrome... ${NOCOLOR}"

  mkdir -p $DIR_PUBLIC
  cp -R $DIR_REPO/build/ $DIR_PUBLIC

  printf "${GREEN}dotenv includes... ${NOCOLOR}"

  HEADER_CONTENT=$(node -pe "require('fs').readFileSync('${SNIPPET_HEAD}').toString().replace(/\n/g, '').concat('<style>.pf-c-page__sidebar .ins-c-skeleton{display:none}</style>')")
  BODY_CONTENT=$(node -pe "require('fs').readFileSync('${SNIPPET_BODY}').toString().replace(/\n/g,'').replace(/Logging in\.\.\./i, 'Development')")

  echo "\nREACT_APP_INCLUDE_CONTENT_HEADER=${HEADER_CONTENT}\nREACT_APP_INCLUDE_CONTENT_BODY=${BODY_CONTENT}\n" > ./.env.development.local
  printf "${GREEN}SUCCESS${NOCOLOR}\n"
}
#
#
# main()
#
{
  BLUE="\e[34m"
  RED="\e[31m"
  GREEN="\e[32m"
  YELLOW="\e[33m"
  NOCOLOR="\e[39m"

  REPO="https://github.com/RedHatInsights/insights-chrome.git"
  DATADIR=./.chrome
  DATADIR_REPO=./.chrome/insights-chrome
  PUBLICDIR=./public/apps/chrome
  HEAD=./public/apps/chrome/snippets/head.html
  BODY=./public/apps/chrome/snippets/body.html

  gitRepo $REPO $DATADIR $DATADIR_REPO
  cleanLocalDotEnv
  buildChrome $DATADIR_REPO $PUBLICDIR $HEAD $BODY
}
