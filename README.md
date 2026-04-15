# Curiosity Frontend

[![Build](https://github.com/RedHatInsights/curiosity-frontend/actions/workflows/integration.yml/badge.svg?branch=main)](https://github.com/RedHatInsights/curiosity-frontend/actions/workflows/integration.yml)
[![codecov](https://codecov.io/gh/RedHatInsights/curiosity-frontend/branch/main/graph/badge.svg)](https://codecov.io/gh/RedHatInsights/curiosity-frontend)
[![License](https://img.shields.io/github/license/RedHatInsights/curiosity-frontend.svg)](https://github.com/RedHatInsights/curiosity-frontend/blob/main/LICENSE)

A web user interface for subscription reporting, based on [PatternFly](https://www.patternfly.org/).

Curiosity Frontend provides a comprehensive UI for managing and reporting on Red Hat subscriptions, usage, and capacity.

## Requirements
- [Node.js 20+](https://nodejs.org/)
- npm

## Quick start

For in-depth tooling, environment, and proxy setup guidance see [docs/development.md](./docs/development.md).

### Install
1. Clone the repository
   ```
   $ git clone https://github.com/RedHatInsights/curiosity-frontend.git
   ```

1. Within the repo context, install project dependencies
   ```
   $ cd curiosity-frontend && npm install
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
1. In a terminal instance within the repository root, run:
   ```
   $ npm start
   ```
1. Start developing against files in `./src`. Linting feedback will be automatically enabled through the terminal output

For in-depth local run guidance review [docs/development.md](./docs/development.md).

### Unit testing
Run and update unit tests during development. In a new terminal instance:

1. Within the repository root, run:
   ```
   $ npm run test:dev
   ```
2. Test files are located in `__tests__` directories parallel to the source files. Test failures for
   recently edited files will be available in the terminal output along with basic testing framework use directions.

For in-depth testing guidance review [docs/development.md](./docs/development.md).

## Documentation

For comprehensive development and project architecture [read the docs](./docs/README.md).

- **Development**: Reference for [development strategy, debugging, and testing](./docs/development.md).
- **Architecture**: Learn about the [application structure and data flow](./docs/architecture.md#system-overview).

## Contributing

Contributing? Guidelines can be found here [CONTRIBUTING.md](./CONTRIBUTING.md).

### AI agent

If you're using an AI assistant to help with development in this repository, please prompt it to `review the repo guidelines` to ensure adherence to project conventions.

Guidelines for developer-agent interaction can be found in [CONTRIBUTING.md](./CONTRIBUTING.md#ai-agent).
