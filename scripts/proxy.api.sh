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
# Update hosts, use proxy repo script
#
updateHosts()
{
  local PROXYDIR=$1
  local PROXYDIR_REPO=$2

  printf "${YELLOW}Confirm hosts updated ...${NOCOLOR}"

  if [ $(cat /etc/hosts | grep -c "redhat.com") -ge 4 ]; then
    printf "${GREEN}SUCCESS${NOCOLOR}\n\n"
  else
    printf "${RED}ERROR${NOCOLOR}\n"
    printf "${RED}Updating hosts... you may need to \"allow write access\"...${NOCOLOR}\n"
    sh $PROXYDIR_REPO/scripts/patch-etc-hosts.sh || sudo sh $PROXYDIR_REPO/scripts/patch-etc-hosts.sh

    mkdir -p $PROXYDIR
    echo "Hosts file updated $(date)" >> $PROXYDIR/hosts.txt

    printf "${GREEN}Hosts file updated${NOCOLOR}\n\n"
  fi
}
#
#
# Check docker permissions
#
sudoCheck()
{
  local CHECK=$(docker ps || 'SUDO REQUIRED::')

  if [ ! -z "$($CHECK | grep "SUDO REQUIRED:::")" ]; then
    printf "\n${YELLOW}Container failed to setup, sudo required.${NOCOLOR}\n"
    printf "  ${YELLOW}Run the platform proxy script.${NOCOLOR}\n\n"
    exit 0
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

  REPO="https://github.com/RedHatInsights/insights-proxy.git"
  DATADIR=./.proxy
  DATADIR_REPO=./.proxy/insights-proxy
  BRANCH="master"

  if [ -z "$(docker -v)" ]; then
    printf "\n${RED}Docker missing, confirm installation and running.${NOCOLOR}\n"
    exit 1
  fi

  sudoCheck
  gitRepo $REPO $DATADIR $DATADIR_REPO $BRANCH
  updateHosts $DATADIR $DATADIR_REPO
  exit 0
}
