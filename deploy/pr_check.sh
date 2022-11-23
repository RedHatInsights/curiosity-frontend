#!/bin/bash

# --------------------------------------------
# Export vars for helper scripts to use
# --------------------------------------------
# name of app-sre "application" folder this component lives in; needs to match for quay
export COMPONENT="rhsm"
# IMAGE should match the quay repo set by app.yaml in app-interface
export IMAGE="quay.io/cloudservices/curiosity-frontend"
export WORKSPACE=${WORKSPACE:-$APP_ROOT} # if running in jenkins, use the build's workspace
export APP_ROOT=$(pwd)
export NODE_BUILD_VERSION=`node -e 'console.log(require("./package.json").engines.node.match(/(\d+)\.\d+\.\d+/)[1])'`
COMMON_BUILDER=https://raw.githubusercontent.com/RedHatInsights/insights-frontend-builder-common/master

# --------------------------------------------
# Options that must be configured by app owner
# --------------------------------------------
export IQE_PLUGINS="curiosity"
export IQE_IMAGE_TAG="curiosity"
export IQE_MARKER_EXPRESSION="ephemeral"
export IQE_FILTER_EXPRESSION=""
export IQE_ENV="ephemeral"
export IQE_SELENIUM="true"
export IQE_CJI_TIMEOUT="30m"

# --------------------------------------------
# Run unit tests, build container and push it to quay
# --------------------------------------------
set -exv
# source is preferred to | bash -s in this case to avoid a subshell
source <(curl -sSL $COMMON_BUILDER/src/frontend-build.sh)
BUILD_RESULTS=$?

# --------------------------------------------
# Run QE tests on ephemeral environment
# --------------------------------------------

# Install bonfire repo/initialize
CICD_URL=https://raw.githubusercontent.com/RedHatInsights/bonfire/master/cicd
curl -s $CICD_URL/bootstrap.sh > .cicd_bootstrap.sh && source .cicd_bootstrap.sh

export APP_NAME="rhsm"
export REF_ENV="insights-production"
export DEPLOY_FRONTENDS="true"
export COMPONENT_NAME="curiosity-frontend"
# Keep that in sync with rhsm-subscriptions pr_check.sh
export OPTIONAL_DEPS_METHOD=none

# Deploy to an ephemeral namespace for testing
source $CICD_ROOT/deploy_ephemeral_env.sh

# Run smoke tests with ClowdJobInvocation
source $CICD_ROOT/cji_smoke_test.sh

# Add link to Ibutsu in GitHub check results
source $CICD_ROOT/post_test_results.sh

# teardown_docker
exit $BUILD_RESULTS
