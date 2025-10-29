# Curiosity Frontend
[![Build](https://github.com/RedHatInsights/curiosity-frontend/actions/workflows/integration.yml/badge.svg?branch=main)](https://github.com/RedHatInsights/curiosity-frontend/actions/workflows/integration.yml)
[![codecov](https://codecov.io/gh/RedHatInsights/curiosity-frontend/branch/main/graph/badge.svg)](https://codecov.io/gh/RedHatInsights/curiosity-frontend)
[![License](https://img.shields.io/github/license/RedHatInsights/curiosity-frontend.svg)](https://github.com/RedHatInsights/curiosity-frontend/blob/main/LICENSE)

A web user interface for subscription reporting, based on [Patternfly](https://www.patternfly.org/)

## Development, Quick Start

### Requirements
Before developing for Curiosity Frontend
 * Your system needs to be running [NodeJS version 20+ and NPM](https://nodejs.org/)
    * Yarn install is discouraged. There are dependency install issues with Yarn `1.x.x` versions.

For in-depth tooling install guidance see the [contribution guidelines](./CONTRIBUTING.md#install-tooling)

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
  1. In a terminal instance that uses the repo context... Run
     ```
     $ npm start
     ```
  1. Start developing against files in `./src`. Linting feedback will be automatically enabled through the terminal output

For in-depth local run guidance review the [contribution guidelines](./CONTRIBUTING.md#local-and-proxy-development) 

### Unit testing
Run and update unit tests while developing instead of after-the-fact. In a new terminal instance

  1. In a new terminal instance that uses the repo context... Run
     ```
     $ npm run test:dev
     ```
  2. Test files can be accessed, and edited, under `__test__` directories parallel to the files you're editing. Test failures for
     recently edited files will be available in the terminal output along with basic testing framework use directions.

For in-depth testing guidance review the [contribution guidelines](./CONTRIBUTING.md#testing) 

## Contributing
Contributing encompasses
- [Repository coding requirements](./CONTRIBUTING.md) - Includes everything from commit messaging practices and environment setup to unit testing.  
- [User and AI agent guidance](./guidelines/README.md) - Includes everything from interactive workflows and prompts to general automation

## Agent Only
Agents: This repository contains a hierarchical guideline system. Agents should review agent-only comment blocks.

<!--
Agents must analyze these files when asked for guidance:

**Guidelines review order:**
1. **`./README.md`** - Main agent guidance and behavior standards (including agent-only comment block)
2. **`./guidelines/README.md`** - Core agent guidance and behavior standards
3. **`./guidelines/**/*.md`** - Specialized workflow and domain-specific instructions
4. **`./.agent/**/*.md`** - gitignored directory and local guidelines intended for agent-specific state and new agent-generated guidance, and user workflows that enhance the core guidelines

The guideline system should be processed in this order, with specialized guidelines taking precedence for their specific domains, and local guidelines overriding general guidelines when present.

**Next Steps:**
5. **Review guidance under the `./.agent/**/*.md` directory.** If the `./.agent` directory exists, the user may ask the agent about the guidance located here.
6. **If the `./.agent` directory does not exist, ask the user if they want to create it.** The agent should explain how it's going to be used.

**Final Steps:**
7. **Ask the user if they want to index this repo and create a `code-summary.md` summary of agent notes and user summary under the `.agent/` directory and explain what it is.** This file should be used as an indexed repo resource for agents with a user-friendly summary.
-->

