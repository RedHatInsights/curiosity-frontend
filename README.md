# Curiosity Frontend
[![Build Status](https://app.travis-ci.com/RedHatInsights/curiosity-frontend.svg?branch=main)](https://app.travis-ci.com/RedHatInsights/curiosity-frontend)
[![codecov](https://codecov.io/gh/RedHatInsights/curiosity-frontend/branch/main/graph/badge.svg)](https://codecov.io/gh/RedHatInsights/curiosity-frontend)
[![License](https://img.shields.io/github/license/RedHatInsights/curiosity-frontend.svg)](https://github.com/RedHatInsights/curiosity-frontend/blob/main/LICENSE)

A web user interface for subscription reporting, based on [Patternfly](https://www.patternfly.org/)

## Development, Quick Start

### Requirements
Before developing for Curiosity Frontend
 * Your system needs to be running [NodeJS version 18+ and NPM](https://nodejs.org/)
 * [Docker](https://docs.docker.com/desktop/)
   * Alternatively, you can try [Podman](https://github.com/containers/podman).
 * And [Yarn](https://yarnpkg.com) for dependency and script management.

For in-depth tooling install guidance see the [contribution guidelines](./CONTRIBUTING.md#Development)

### Install
  1. Clone the repository
     ```
     $ git clone https://github.com/RedHatInsights/curiosity-frontend.git
     ```

  1. Within the repo context, install project dependencies
     ```
     $ cd curiosity-frontend && yarn
     ```

### Develop
This is the base context for running a local UI against a mock API and styling.

  1. Create a local dotenv file called `.env.local` and add the following contents
      ```
      REACT_APP_DEBUG_MIDDLEWARE=true
      REACT_APP_DEBUG_ORG_ADMIN=true
      REACT_APP_DEBUG_PERMISSION_APP_ONE=subscriptions:*:*
      REACT_APP_DEBUG_PERMISSION_APP_TWO=inventory:*:*
     ```
  1. In a terminal instance that uses the repo context... Run
     ```
     $ yarn start
     ```
  1. Start developing against files in `./src`. Linting feedback will be automatically enabled through the terminal output

For in-depth local run guidance review the [contribution guidelines](./CONTRIBUTING.md#Serving%20Content) 

### Unit testing
Run and update unit tests while developing instead of after-the-fact. In a new terminal instance

  1. In a new terminal instance that uses the repo context... Run
     ```
     $ yarn test:dev
     ```
  2. Test files can be accessed, and edited, under `__test__` directories parallel to the files you're editing. Test failures for
     recently edited files will be available in the terminal output along with basic testing framework use directions.

For in-depth testing guidance review the [contribution guidelines](./CONTRIBUTING.md#Testing) 

## Contributing
Contributing encompasses [repository specific requirements](./CONTRIBUTING.md).
