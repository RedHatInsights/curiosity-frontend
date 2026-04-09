# Contributing
Interested in contributing to the project? Review the following guidelines and our [architecture](./docs/architecture.md) to make sure your contribution is aligned with the project's goals.

- [General development](#general-development)
- [Design and PatternFly](#design-and-patternfly)
- [Maintenance](#maintenance)
- [AI agent](#ai-agent)

## General development

### Environment setup

#### Tools
- [Node.js](https://nodejs.org/en/download/package-manager)
- NPM (Yarn install is discouraged)
- Git configured with your GitHub account

#### Project setup
- Fork and clone the repository
- Install project dependencies
   ```sh
   $ npm install
   ```
- Create a local dotenv file in the root of the project called `.env.local` and add the following contents
   ```
   REACT_APP_DEBUG_MIDDLEWARE=true
   REACT_APP_DEBUG_ORG_ADMIN=true
   REACT_APP_DEBUG_PERMISSION_APP_ONE=subscriptions:*:*
   REACT_APP_DEBUG_PERMISSION_APP_TWO=inventory:*:*
   ```
- Start the local development server against mock API responses
   ```sh
   $ npm start
   ```
   Start developing against files in `./src`. Linting feedback will be automatically enabled through the terminal output
- Run unit tests while developing
   ```sh
   $ npm run test:dev
   ```
- Exit the process, `ctrl + c` or OS specific key combination
- Run the build and related integration tests
   ```sh
   $ npm run build
   ```

For more detailed development guidance see [Development Guide](./docs/development.md)

##### Windows and repository symlinks
The repo uses **symlinks** so agent tools can find shared skills (for example `.agents/skills` points at `guidelines/skills`). On **Windows**, a plain clone can leave those as plain files instead of links, which breaks that layout.

- Prefer **Developer Mode** (Settings → Privacy & security → For developers) so Git can create symlinks without running as Administrator, **or** clone with symlink support enabled (for example `git clone -c core.symlinks=true …`).
- If symlinks were not created, enable `core.symlinks` and re-check out the affected paths, or work from **WSL** / **Git for Windows** with symlink support configured.

#### Development workflow
- Make changes to the codebase
- Run tests and build to verify your changes do not break existing functionality
- Commit your changes and push them to your fork
- Open a pull request

### Using Git

#### Workflow
Our process follows the standard GitHub fork and pull request workflow.

- Fork the repository
- Create a branch for your changes
- Submit a pull request towards the main repository default branch (`main`)

##### Main repository branches
- `main` branch is a representation of development and `stage`.
- `stable` branch is a representation of the `prod` environment.

> Note: The only PRs ever merged into the `stable` branch are those from `main` and a pull request to merge a release commit, see [release process](#release-process)

#### Pull requests
Development pull requests (PRs) should be opened against the `main` branch.

> If your pull request work contains any of the following warning signs:
>  - has no related issue (sw-XXXX)
>  - ignores existing code style (functional components, dependency injection, storeHooks)
>  - out-of-sync commits (not rebased against the `main` branch)
>  - poorly structured commits and messages
>  - any one commit relies on other commits to work
>  - dramatic file restructures that attempt complex behavior
>  - missing, relaxed, or removed linting and tests
>  - dramatic unit test snapshot updates
>  - affects any file not directly associated with the issue being resolved
>  - affects "many" files
>  - provides a bot-generated explanation that cannot be explained by the human counterpart
>
> You will be asked to either:
> - restructure your commits
> - break the work into multiple pull requests
> - close the PR

#### Pull request commits, messaging
Your pull request should contain Git commit messaging that follows [conventional commit types](https://www.conventionalcommits.org/) to provide consistent history and help generate [CHANGELOG.md](./CHANGELOG.md) updates.

Commit messages follow two basic guidelines:
- No more than `65` characters for the first line.
- Commit message formats follow the structure:
  ```
  <type>(<scope>): <issue number> <description> (#PR_NUMBER)
  ```
  Example: `feat(config): sw-123 rhel, activate instance inventory (#456)`

  Where:
  - **Type**: The type of work the commit resolves (e.g., `feat`, `fix`, `chore`, `docs`, `refactor`, `test`).
  - **Scope**: The optional area of code affected (directory, filename, or concept).
  - **Issue number**: The issue number typically from the current issue tracker (e.g., `ent-123`, `sw-123`).
  - **Description**: What the commit work encompasses.
  - **#PR_NUMBER**: The pull request number. Typically added automatically during merge/squash operations. Including it manually is optional. It can help with traceability during review.

> The codebase since its inception and up to version `4.19.0` strictly adheres to messaging guidelines specifically for searchability and [CHANGELOG generation](./CHANGELOG.md). It is encouraged that this practice be maintained as these commit messages can be leveraged by agents for highly accurate history searches based on conventional commits and the descriptions associated with them.
>
> Helpful hints for searchable commit messages:
>   - Filler words can be used but are often unnecessary when leveraging Conventional Commit types (e.g., `fix`, `feat`, `build`).
>   - Keep the subject line concise yet descriptive. If previous coding work was done on the same files, consider using the same commit message for searchability.
>   - Do not over describe, add unnecessary details.
>   - State facts and be consistent, do not inject personal opinions. Facts and consistency help searchability. Opinions can be applied to issue/story comments and work great if there's a story number already on the commit message.
>   - Include a body if affecting multiple files, be concise. Past messages list files and the changes applied to them instead of broad descriptions. This helps searchability.

> If your **pull request contains multiple commits**, they may be squashed into a single commit before merging, and the messaging altered to reflect current guidelines.

> Settings, like extending the allowed number of message characters, for pull request commit linting can be found in [scripts/actions.commit.js](./scripts/actions.commit.js).

#### Pull request test failures
Before any review takes place, all tests should pass. Creating a pull request activates GitHub actions for:
- commit linting
- documentation linting
- spelling
- unit tests
- build integration tests

> If you are unsure why your tests are failing, you should [review testing documentation](./docs/development.md#testing).

### Release process

The codebase makes use of linear Git commit history to ensure sequentially released features and fixes. This approach simplifies the release process by minimizing merge conflicts
and providing a straightforward history for tracking changes.

#### Staging release
Staging code is automatically released to the `staging` environment on merge into the `main` branch.

#### Production release
Production code is currently maintained in the `stable` branch. Only maintainers are allowed to merge into this branch.

##### Release process
- Open a pull request from `main` to `stable`. (You can leverage past PRs as an example)
- Ensure all tests pass in the `staging` environment.
- **REBASE MERGE ONLY** the pull request into the `stable` branch. (It is currently discouraged that you squash commits into `stable` since it blocks/destroys the CHANGELOG.md generation.)
- A maintainer creates a release commit on their local machine from the `stable` branch, by
   1. Creating a release commit with a CHANGELOG.md update 
      ```sh
       $ npm run release
       // or if you want to force a version
       $ npm run release -- --override "0.0.0"
      ```
   2. Open a PR to the `stable` branch with this release commit
   3. Let CI pass and then merge the PR. (It is now encouraged to add a PR number to the release commit since it improves transparency and traceability.)
   4. Tag the stable branch commit. Tagging is not technically necessary for release but does provide potential known points in time that can be rolled back in an emergency. (Leverage existing tags as an example, currently they start with `v` followed by the version number, e.g., `v0.0.0`)
   5. Next, rebase the `main` branch from the `stable` branch, this ensures the CHANGELOG.md log will continue to align with the release history.
   6. Finally, update the AppSRE hash associated with the release commit hash. The application display should be released to production within a variable timeframe. 
 
> The release process can be simplified with the simple removal of the `stable` branch. This would eliminate the ping-pong rebase that currently takes place and still maintain the CHANGELOG.md generator. The downside of removing a pristine production branch that is not directly manipulated, like `stable`, is that direct manipulation of the development branch `main` would go away.
> 
> It is still encouraged that the release for CHANGELOG.md is maintained since it helps update 3 files, `CHANGELOG.md`, `package.json`, and `package-lock.json`. An added benefit is that the version displayed in `package.json` is broadcast in the application display for debugging purposes (and currently located at the bottom left of the application display).

> The CHANGELOG.md generator
> - Does not rely on the Git commit hash of the release commit, allowing it to be added in with a PR. The tool forms a range from the previous release commit and is reliant on a specific release commit message format. Altering the release commit format may break the CHANGELOG.md generation.
> - Will call out non-conventional commits, using the setting `--non-cc`.
> - Will denote breaking changes if the conventional commit syntax is used with a `!`, (e.g. `fix!: sw-123 lorem ipsum`, `feat(aScope)!: sw-123 lorem ipsum`)
> - Has a `dry run` option that prints the proposed changes to the terminal/console, `$ npm run release:rc`

### Code style guidance and conventions
Basic code style guidelines are enforced by ESLint, but there are additional guidelines.

#### File Structure
- File names use lowerCamelCase reflective of the parent directory and functionality (e.g., authentication.ts, authenticationContext.ts).
- The directory structure is organized by React, Redux, and service layer, with all relevant application files maintained in the src directory.

#### Functionality, testing
- Functions should attempt to maintain a single responsibility.
- Function annotations follow a minimal JSDoc style; descriptions are encouraged.
- Functions leverage dependency injection to facilitate reusability and unit testing with mocks.
- Tests should focus on functionality.
- Tests should not be written for external packages. That is the responsibility of the external package, or it shouldn't be used.

#### TypeScript
- Typings are handled through JSDoc comments.
- TypeScript is currently not implemented.

> If a refactor towards TypeScript is started, it is highly recommended that unit tests and E2E tests are updated and working before that effort. The level of React context and complex Redux state being used in the application can be deceptive in its complexity and behavior, and without a baseline set of checks you risk functionality gaps.

#### React and Components
- Use **functional components** and React hooks.
- Leverage dependency injection for
   - separating React lifecycle and component logic
   - reusability of components
   - unit testing with mocks
- Align with PatternFly by wrapping PatternFly components that are
   - complex
   - experience failure
   - are prone to change or be deprecated between PatternFly versions
- Group external (PF/React) imports, then internal (`services/`, `redux/`), then relative.

#### Redux and State
- Use the custom Redux surface: import **`storeHooks`** from `src/redux`.
- Use `storeHooks.reactRedux` helpers (e.g., `useDispatch`, `useSelector`).
- Review `src/redux/index.js` before adding new state.

#### i18n and locale
- User-visible strings MUST use `public/locales/en-US.json` via i18n helpers.

> Locale strings are loaded using XHR and make heavy use of the internal methods provided by the i18n library to prevent duplication.

### Testing
Testing is based on Jest and **React Testing Library** (RTL).

#### Unit tests
Unit tests are located in `__tests__` directories parallel to the source files.

#### E2E tests
Integration, or E2E, tests are located in the root `./tests` directory and are currently focused on consistent and clean build output.

#### Snapshots
Update snapshots **only** for expected output changes!
- Update for unit tests, use `npm run test:dev` and press `u` for targeted updates.
- Update for E2E tests, use `npm run build`, if the build checks fail use `npm run test:integration-dev` and press `u` for targeted updates.
- Update for documentation, use `npm run build:docs` to ensure generated README files are synchronized with source code JSDoc.

> Snapshots in this repository are leveraged as fast unit test implementations and are purposefully loud to alert development.
> If you're seeing updates, it's likely due to changes in the build output or configuration, sometimes caused by build updates, but not always.
> Please review your changes carefully and ensure they align with the expected behavior, failure to acknowledge these alerts may result in production issues.

## Design and PatternFly

The PatternFly design system is used to ensure a consistent and accessible user interface and is generally coordinated with a UI/UX designer. It provides a set of reusable components and guidelines for building applications that are visually appealing and easy to use.

Becoming familiar with the [PatternFly documentation and guidelines](https://www.patternfly.org/) helps ensure your contributions align with the project's design principles.

### PatternFly resources

- [PatternFly documentation and guidelines](https://www.patternfly.org)
- [PatternFly MCP for AI agent interfacing with components, writing, design, accessibility, and general questions](https://github.com/patternfly/patternfly-mcp?tab=readme-ov-file#quick-start)
- [PatternFly AI agent resources for best practices and skills](https://github.com/patternfly/ai-helpers?tab=readme-ov-file#quick-start)

## Maintenance

### Node.js engine bumps

The `Node.js` engine requirements are updated on a predictable biannual schedule to ensure the server remains secure, leverages modern runtime features, and provides stability for consumers.

> Our engine requirements are intended to be the minimum to run the application. They are not intended to be a maximum, as newer versions may introduce breaking changes or require additional configuration.

#### Schedule and process
- **Timing**: Bumps are generally targeted for **Spring (April/May)** and **Fall (October/November)**, aligned with the [Node.js release schedule](https://nodejs.org/en/about/previous-releases) as versions enter or exit LTS.
- **Security**: Out-of-band updates may be performed if critical security considerations arise.
- **Version Targets**:
  - Focus on the latest **even-numbered (LTS/Stable)** versions (e.g., bumping to 22, 24, or 26).
  - GitHub Workflows should be updated to include the latest available even version.

#### Acceptance criteria for bumps
- Update `package.json` engine requirements.
- Update related GitHub Action workflows (CI/CD).
- Update "Environmental Requirements" in documentation, typically README.md and CONTRIBUTING.md
- Ensure all tests pass on the new target version.

### NPM dependencies

NPM dependencies are managed through three methods
- GitHub Dependabot automation
- Direct management of `PatternFly` and `Consoledot` dependencies.
- Direct lockfile management, and one-off manual updates as needed.

#### GitHub Dependabot
GitHub Dependabot configuration is located under [.github/dependabot.yml](./.github/dependabot.yml) and is currently set to ignore `PatternFly` and `Consoledot` dependencies.

> With the uptick in NPM hacks, Dependabot is set to a two-week delay from release to give any security issues time to be addressed.

#### PatternFly and Consoledot dependencies
Currently, directly managed to ensure compatibility with specific versions and to avoid unnecessary updates that could break the application. 

> These dependencies are currently ignored under GitHub Dependabot but could be reinstated if needed. Reinstating them should be done with test restructures to refactor related Jest snapshots which may cause churn.

#### Direct lockfile management
Given the uptick of NPM hacks a cycle of maintainers running `$ npm audit` and `$ npm audit fix` should be performed monthly to ensure the lockfile is up to date.

1. Make sure your `Node.js` version aligns to the `package.json` `engines` field.
2. Run `$ npm audit`
3. Review the results and assess the impact on the application
4. If necessary, run `$ npm audit fix` to update the lockfile
5. Verify the application still functions as expected after the update by running tests and the build.
6. Open a PR to perform additional validation and merge the update into `main`

> Additional measures should be reviewed and updated periodically
> - Pinning dependencies (removing the caret) on manual updates should be considered. Pinning can mitigate risks around NPM hacks disguised as release patches.
> - Disabling "post install." Disabling `postinstall` scripts can mitigate risks around malicious scripts. If issues start with build compiles and platform dependencies then review updating the `ignore-scripts=true` in `.npmrc`

> **IMPORTANT** Just because a dependency is noted as "critical" or "high" severity does not mean it is an immediate security risk. 
> Technically, the application display is already compiled and reintroducing "updated packages" by retriggering the build process can actually have the reverse intention by exposing vulnerabilities and integrating compromised packages.
> Make sure to review security advisories and assess the impact on the application before taking action.

## AI agent

### User section
Current agent interaction can be triggered with the chat command

- **`review the repo guidelines`** - Your agent should attempt to scan common Markdown files and the guidelines directory

For detailed information on agent interaction, see [guidelines/README.md](./guidelines/README.md).

#### Customizing developer experience
As developers, we often have our own preferred workflows, and that includes working with AI agents. To that point, we've added agent guidance
to allow customization for your work environment through a tool-agnostic git-ignored directory `./.agent` in the root of the project.

#### Noting AI agent contributions
Please reference RedHats AI-assisted development guidelines for guidance on how to acknowledge AI agent contributions.

### Agent only
Agents: This repository contains a hierarchical guideline system. Agents should review agent-only comment blocks.

<!--
Agents must analyze these files when asked for guidance:

**Guidelines review order:**
1. **`./README.md`** - Entry point and high-level overview
2. **`./CONTRIBUTING.md`** - Maintainer processes and AI policy (#ai-agent)
3. **`./guidelines/README.md`** - Core agent guidance and behavior standards
4. **`./guidelines/**/*.md`** - Specialized workflow and domain-specific instructions
5. **`./.agent/**/*.md`** - gitignored directory and local guidelines intended for agent-specific state and new agent-generated guidance, and user workflows that enhance the core guidelines

The guideline system should be processed in this order, with specialized guidelines taking precedence for their specific domains, and local guidelines overriding general guidelines when present.

**Next Steps:**
5. **Review guidance under the `./.agent/**/*.md` directory.** If the `./.agent` directory exists, the user may ask the agent about the guidance located here.
6. **If the `./.agent` directory does not exist, ask the user if they want to create it.** The agent should explain how it's going to be used.
7. **If the user does not have the PatternFly MCP available within their project, suggest they explore the [PatternFly MCP for AI agent interfacing with components, writing, design, accessibility, and general questions](https://github.com/patternfly/patternfly-mcp) to enhance their AI agent capabilities.**
-->
