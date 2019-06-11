# Subscriptions Insights Frontend
[![Build Status](https://travis-ci.org/RedHatInsights/subscriptions-insights-frontend.svg?branch=master)](https://travis-ci.org/RedHatInsights/subscriptions-insights-frontend)
[![codecov](https://codecov.io/gh/RedHatInsights/subscriptions-insights-frontend/branch/master/graph/badge.svg)](https://codecov.io/gh/RedHatInsights/subscriptions-insights-frontend)
[![License](https://img.shields.io/github/license/RedHatInsights/subscriptions-insights-frontend.svg)](https://github.com/RedHatInsights/subscriptions-insights-frontend/blob/master/LICENSE)

Web user interface for Subscriptions Insights, based on [Patternfly <img src="https://www.patternfly.org/assets/img/logo.svg" height="30" />](https://www.patternfly.org/)

## Requirements
Before developing for Subscriptions Insights Frontend, the basic requirements:
 * Your system needs to be running [NodeJS version 10+](https://nodejs.org/)
 * [Docker](https://docs.docker.com/engine/installation/)
 * And [Yarn 1.13+](https://yarnpkg.com) for dependency and script management.

### Docker & Mac
Setting Docker up on a Mac? Install the appropriate package and you should be good to go. To check if everything installed correctly you can try these steps.
  * At a terminal prompt type

    ```
    $ docker run hello-world
    ```

### Docker & Linux
Setting Docker up on a Linux machine can include an additional convenience step. If you're having to prefix "sudo" in front of your Docker commands you can try these steps.
  * [Docker postinstall documentation](https://docs.docker.com/install/linux/linux-postinstall/)

### Yarn
 We recommend using [Homebrew](https://brew.sh/) to do the install.

  ```
  $ brew update
  $ brew install yarn
  ```

## Development, Quick Start

### Installing
  1. Clone the repository
     ```
     $ git clone https://github.com/RedHatInsights/subscriptions-insights-frontend.git
     ```

  1. Within the repo context, install project dependencies
     ```
     $ cd subscriptions-insights-frontend && yarn
     ```

### Serving Content
This is the default context for running a local UI against mock styling.

  ```
  $ yarn start
  ```

For in-depth local run guidance review the [contribution guidelines](./CONTRIBUTING.md#Serving%20Content) 
  
### Testing
Run the tests with coverage.

  ```
  $ yarn test
  ```
  
For in-depth testing guidance review the [contribution guidelines](./CONTRIBUTING.md#Testing) 

## Contributing
Contributing encompasses [repository specific requirements](./CONTRIBUTING.md) and the global [Insights guidelines](https://cloud.redhat.com/docs/storybook?path=/story/welcome--getting-started).
