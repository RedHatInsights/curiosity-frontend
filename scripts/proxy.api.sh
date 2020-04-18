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

      echo $(date -v +10d "+%s") > $DIR/expire.txt

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
# Update hosts, use proxy repo script
#
updateHosts()
{
  local PROXYDIR=$1
  local PROXYDIR_REPO=$2

  printf "${YELLOW}Confirm hosts updated ...${NOCOLOR}"

  if [ $(cat /private/etc/hosts | grep -c "redhat.com") -eq 4 ]; then
    printf "${GREEN}SUCCESS${NOCOLOR}\n\n"
  else
    printf "${RED}ERROR${NOCOLOR}\n"
    printf "${RED}Updating hosts... you may need to \"allow write access\"...${NOCOLOR}\n"
    sh $PROXYDIR_REPO/scripts/patch-etc-hosts.sh || sudo sh $PROXYDIR_REPO/scripts/patch-etc-hosts.sh
    echo "Hosts file updated $(date)" >> $PROXYDIR/hosts.txt
    printf "${GREEN}Hosts file updated${NOCOLOR}\n\n"
  fi
}
#
#
# Quick check to see if a container is running
#
checkContainerRunning()
{
  local CHECKONE=$1
  local COUNT=1
  local DURATION=10
  local DELAY=0.1

  printf "${YELLOW}Check container running ...${NOCOLOR}"

  while [ $COUNT -le $DURATION ]; do
    sleep $DELAY
    (( COUNT++ ))
    if [ -z "$(docker ps | grep $CHECKONE)" ]; then
      break
    fi
  done

  if [ ! -z "$(docker ps | grep $CHECKONE)" ]; then
    printf "${GREEN}Container SUCCESS"
    printf "\n\n${NOCOLOR}"
  else
    printf "${RED}Container ERROR"
    printf "\n\n  Error: ${RED}Check container \"${CHECKONE}\""
    printf "${NOCOLOR}\n"
  fi
}
#
#
# Run the proxy
#
runProxy()
{
  local RUN_CONTAINER=$1
  local RUN_NAME=$2
  local RUN_DOMAIN=$3
  local RUN_PORT=$4
  local RUN_CONFIG=$5
  local DIR=$6
  local CURRENT_DATE=$(date "+%s")
  local EXPIRE=$(head -n 1 $DIR/expire-docker.txt)

  docker stop -t 0 $RUN_NAME >/dev/null

  if [ -z "$(docker images -q $RUN_CONTAINER)" ] || [ "${EXPIRE:-0}" -lt "${CURRENT_DATE}" ]; then
    printf "${YELLOW}Setting up development Docker proxy container...${NOCOLOR}\n"
    docker pull $RUN_CONTAINER
    echo $(date -v +10d "+%s") > $DIR/expire-docker.txt
  fi

  if [ -z "$(docker ps | grep $RUN_CONTAINER)" ]; then
    echo "Starting development proxy..."

    if [ ! -z "$RUN_CONFIG" ]; then
      RUN_CONFIG="-e CUSTOM_CONF=true -v ${RUN_CONFIG}:/config/spandx.config.js"
    fi

    docker run -d --rm -p $RUN_PORT:1337 $RUN_CONFIG -e PLATFORM -e PORT -e LOCAL_API -e SPANDX_HOST -e SPANDX_PORT --name $RUN_NAME $RUN_CONTAINER >/dev/null
  fi

  checkContainerRunning $RUN_NAME

  if [ ! -z "$(docker ps | grep $RUN_CONTAINER)" ]; then
    printf "  ${YELLOW}Container: $(docker ps | grep $RUN_CONTAINER | cut -c 1-50)${NOCOLOR}\n"
    echo "  Development proxy running: http://${RUN_DOMAIN}:${RUN_PORT}/"
    printf "  To stop: $ ${YELLOW}docker stop ${RUN_NAME}${NOCOLOR}\n"
  fi

  exit 0
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

  DOMAIN="localhost"
  PORT=1337
  CONFIG=""
  UPDATE=false
  HOST_ONLY=false


  REPO="https://github.com/RedHatInsights/insights-proxy.git"
  DATADIR=./.proxy
  DATADIR_REPO=./.proxy/insights-proxy
  BRANCH="master"
  CONTAINER="redhatinsights/insights-proxy"
  CONTAINER_NAME="insightsproxy"

  while getopts p:c:d:us option;
    do
      case $option in
        p ) PORT="$OPTARG";;
        c ) CONFIG="$OPTARG";;
        d ) DOMAIN="$OPTARG";;
        u ) UPDATE=true;;
        s ) HOST=true;;
      esac
  done

  if [ "$UPDATE" = true ]; then
    printf "${YELLOW}Updating ${CONTAINER_NAME}, Docker and data...${NOCOLOR}\n"
    docker stop -t 0 $CONTAINER_NAME
    docker rmi -f $CONTAINER
    printf "${GREEN}${CONTAINER_NAME} updated...${NOCOLOR}\n"
    exit 0
  fi

  if [ "$HOST" = true ]; then
    gitRepo $REPO $DATADIR $DATADIR_REPO $BRANCH
    updateHosts $DATADIR $DATADIR_REPO
    exit 0
  fi

  printf "${YELLOW}The proxy environment requires being able to access secure resources at runtime.${NOCOLOR}\n"

  cleanLocalDotEnv
  runProxy $CONTAINER $CONTAINER_NAME $DOMAIN $PORT $CONFIG $DATADIR
}
