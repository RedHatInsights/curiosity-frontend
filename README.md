# Curiosity Frontend
[![Build Status](https://travis-ci.org/RedHatInsights/curiosity-frontend.svg?branch=master)](https://travis-ci.org/RedHatInsights/curiosity-frontend)
[![codecov](https://codecov.io/gh/RedHatInsights/curiosity-frontend/branch/master/graph/badge.svg)](https://codecov.io/gh/RedHatInsights/curiosity-frontend)
[![License](https://img.shields.io/github/license/RedHatInsights/curiosity-frontend.svg)](https://github.com/RedHatInsights/curiosity-frontend/blob/master/LICENSE)

A web user interface for subscription reporting, based on [Patternfly](https://www.patternfly.org/)

## Requirements
Before developing for Curiosity Frontend, the basic requirements:
 * Your system needs to be running [NodeJS version 14+ and NPM](https://nodejs.org/)
 * [Docker](https://docs.docker.com/engine/installation/)
 * And [Yarn 1.22+](https://yarnpkg.com) for dependency and script management.
 
For in-depth tooling install guidance see the [contribution guidelines](./CONTRIBUTING.md#Install)

## Development, Quick Start

### Installing
  1. Clone the repository
     ```
     $ git clone https://github.com/RedHatInsights/curiosity-frontend.git
     ```

  1. Within the repo context, install project dependencies
     ```
     $ cd curiosity-frontend && yarn
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
