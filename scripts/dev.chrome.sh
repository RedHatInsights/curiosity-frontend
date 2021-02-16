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
  local GITBRANCH=$4
  local CURRENT_DATE=$(date "+%s")
  local EXPIRE=$(head -n 1 $DIR/expire.txt)

  if [ ! -d $DIR_REPO/build ] || [ "${EXPIRE:-0}" -lt "${CURRENT_DATE}" ]; then
    mkdir -p $DIR
    rm -rf $DIR/temp

    printf "\n${YELLOW}Accessing ${GITREPO}${NOCOLOR}\n"

    if [ -z "$GITBRANCH" ]; then
      (cd $DIR && git clone --depth=1 $GITREPO temp > /dev/null 2>&1)
    else
      (cd $DIR && git clone $GITREPO temp > /dev/null 2>&1)

      printf "${YELLOW}Attempting to access branch \"${BRANCH}\" ...${NOCOLOR}"

      if [ ! -z "$(cd $DIR/temp && git branch -a | grep $GITBRANCH)" ]; then
        (cd $DIR/temp && git checkout $GITBRANCH > /dev/null 2>&1)
        printf "${GREEN}SUCCESS${NOCOLOR}\n"
      else
        printf "${YELLOW}non-existant ...IGNORE, use default${NOCOLOR}\n"
      fi
    fi

    if [ $? -eq 0 ]; then
      printf "${YELLOW}Confirm repository ...${NOCOLOR}"

      rm -rf $DIR_REPO
      cp -R  $DIR/temp $DIR_REPO

      rm -rf $DIR/temp
      rm -rf $DIR_REPO/.git

      if [ "$(uname)" = "Darwin" ]; then
        echo $(date -v +10d "+%s") > $DIR/expire.txt
      else
        echo $(date -d "+10 days" "+%s" ) > $DIR/expire.txt
      fi

      printf "${GREEN}SUCCESS${NOCOLOR}\n"

    elif [ -d $DIR_REPO ]; then
      printf "${YELLOW}Unable to connect, using cached ${GITREPO}...${NOCOLOR}\n"
    else
      printf "${RED}Build Error cloning ${GITREPO}, unable to setup repo${NOCOLOR}\n"
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
  local GITREPO=$1
  local DIR_REPO=$2
  local DIR_PUBLIC=$3
  local SNIPPET_HEAD=$4
  local SNIPPET_BODY=$5

  if [ ! -d $DIR_REPO/build ]; then
    printf "\n${GREEN}Building Chrome...${NOCOLOR}"

    if [ -z "$(node -v)" ] || [ -z "$(npm -v)" ]; then
      printf "${YELLOW}Node and NPM need to be installed in order to local run.${NOCOLOR}\n"
      exit 0
    fi

    (cd $DIR_REPO && npm install && npm run build > /dev/null 2>&1)
    printf "\n${GREEN}Build SUCCESS${NOCOLOR}"
  fi

  if [ ! -d $DIR_REPO/build ]; then
    printf "\n${YELLOW}Build output failed, confirm recent chroming updates didn't alter the output directory.${NOCOLOR}\n"
    exit 0
  else
    printf "\n${GREEN}Build SUCCESS${NOCOLOR}"
  fi

  printf "\n${YELLOW}Setting up local chrome ...${NOCOLOR}"

  mkdir -p $DIR_PUBLIC
  cp -R $DIR_REPO/build/* $DIR_PUBLIC

  printf "${YELLOW}dotenv includes ...${NOCOLOR}"

  HEADER_CONTENT_STR="require('fs').readFileSync('${SNIPPET_HEAD}').toString().replace(/\n/g, '').concat('<style>"
  HEADER_CONTENT_STR="${HEADER_CONTENT_STR}.pf-c-page__sidebar * {display:none !important;}"
  HEADER_CONTENT_STR="${HEADER_CONTENT_STR}.pf-m-user.pf-m-user-skeleton * {display:none;}"
  HEADER_CONTENT_STR="${HEADER_CONTENT_STR}.pf-m-user.pf-m-user-skeleton:before {content:\"Development\";}"
  HEADER_CONTENT_STR="${HEADER_CONTENT_STR}</style>')"

  HEADER_CONTENT=$(node -pe "${HEADER_CONTENT_STR}")
  BODY_CONTENT=$(node -pe "require('fs').readFileSync('${SNIPPET_BODY}').toString().replace(/\n/g,'')")

  if [[ ! -z "$HEADER_CONTENT" ]] && [[ ! -z "$BODY_CONTENT" ]]; then
    echo "REACT_APP_INCLUDE_CONTENT_HEADER=${HEADER_CONTENT}" > ./.env.development.local
    echo "REACT_APP_INCLUDE_CONTENT_BODY=${BODY_CONTENT}" >> ./.env.development.local
    printf "${GREEN}SUCCESS${NOCOLOR}\n\n"
  else
    printf "\n${RED}ERROR, include content doesn't exist${NOCOLOR}\n"
    printf "${RED}    This is most likely due to an alteration on the includes repository.${NOCOLOR}\n"
    printf "${RED}    You'll need to confirm the repository can still be accessed\n    ${GITREPO}${NOCOLOR}\n\n"
  fi
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
  BRANCH="prod-stable"
  PUBLICDIR=./public/apps/chrome
  HEAD=./public/apps/chrome/snippets/head.html
  BODY=./public/apps/chrome/snippets/body.html

  while getopts b:u option;
    do
      case $option in
        b ) BRANCH="$OPTARG";;
        u ) UPDATE=true;;
      esac
  done

  if [ "$UPDATE" = true ]; then
    printf "${YELLOW}Updating chrome...${NOCOLOR}\n"
    rm -rf $DATADIR
  fi

  gitRepo $REPO $DATADIR $DATADIR_REPO $BRANCH
  cleanLocalDotEnv
  buildChrome $REPO $DATADIR_REPO $PUBLICDIR $HEAD $BODY
}
