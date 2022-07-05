# Contributing
Contributing encompasses repository specific requirements and the global [Insights guidelines](https://console.redhat.com/docs/storybook?path=/story/welcome--getting-started).

## Install
Before developing you'll need to install:
 * [NodeJS and NPM](https://nodejs.org/)
 * [Docker](https://docs.docker.com/engine/install/)
   * Alternatively, you can try [Podman](https://github.com/containers/podman). [Homebrew](https://brew.sh/) can be used for the install `$ brew install podman`
 * And [Yarn](https://yarnpkg.com)

### OS Support
A large percentage of front-end tooling is `Mac OSX` centered, the tooling for Curiosity falls into this category.

While some aspects of the tooling have been expanded for Linux there may still be issues. It is encouraged that OS tooling
changes are contributed back while maintaining existing `Mac OSX` functionality.

If you are unable to test additional OS support it is imperative that code reviews take place before integrating/merging build changes.

### Docker & Mac
Setting Docker up on a Mac? Install the appropriate package and you should be good to go. To check if everything installed correctly you can try these steps.
  * At a terminal prompt type

    ```
    $ docker run hello-world
    ```

### Docker & Linux
Setting Docker up on a Linux machine can include an additional convenience step. If you're having to prefix "sudo" in front of your Docker commands you can try these steps.
  * [Docker postinstall documentation](https://docs.docker.com/engine/install/linux-postinstall/)

### Yarn
Once you've installed NodeJS you can use NPM to perform the [Yarn](https://yarnpkg.com) install

  ```
  $ npm install yarn -g
  ``` 

You can also use [Homebrew](https://brew.sh/)

  ```
  $ brew update
  $ brew install yarn
  ```

## Git process
### Commits
In an effort to continue enhancing future automation around 
[CHANGELOG.md](./CHANGELOG.md) and tagging we make use of [Standard Version](https://github.com/conventional-changelog/standard-version#readme) and [Conventional Commits](https://www.conventionalcommits.org).

It's required that commit messaging follow the format
```
   <type>[optional scope]: <issue number><description>
```

For Jira issues that looks like
```
   <type>[optional scope]: ent-123 <description>
```

For Github issues that looks like
```
   <type>[optional scope]: issues/123 <description>
```

Settings for [Standard Version](https://github.com/conventional-changelog/standard-version#readme) can be found in [package.json](./package.json)

### Branching, Pull Requests, and Releases
Curiosity makes use of the branches `main`, `stage`, `qa`, and `ci`. 
- `main` branch is a protected representation of production environments
   - Adding commits, or a PR, into `main` should generate a `prod-stable` branch within the deploy repository [curiosity-frontend-build](https://github.com/RedHatInsights/curiosity-frontend-build)
   - The `prod-stable` branch is manually deployed through coordination with the operations team.
- `stage` branch is a protected representation of production environments
   - Adding commits, or a PR, into `stage` should generate a `prod-beta` branch within the deploy repository [curiosity-frontend-build](https://github.com/RedHatInsights/curiosity-frontend-build)
   - The `prod-beta` branch is manually deployed through coordination with the operations team.
- `qa` branch is a representation of `ci-stable`, `qa-stable` and `stage-stable`.
   - Adding commits, or a PR, into `ci-stable` should generate `ci-*` and `qa-*` branches within the deploy repository [curiosity-frontend-build](https://github.com/RedHatInsights/curiosity-frontend-build)
   - The `ci-*` and `qa-*` branches are automatically deployed within an averaged time for `https://ci.*.redhat.com`, `https://qa.*.redhat.com` and `https://*.stage.redhat.com`
   - In the future, once the API is fully deployed to QA, this will be a representation of `qa-beta` and `qa-stable`
- `ci` branch is a representation of `ci-beta`, `qa-beta` and `stage-beta`.
   - Adding commits, or a PR, into `ci-beta` should generate `ci-*` and `qa-*` branches within the deploy repository [curiosity-frontend-build](https://github.com/RedHatInsights/curiosity-frontend-build)
   - The `ci-*` and `qa-*` branches are automatically deployed within an averaged time for `https://ci.*.redhat.com`, `https://qa.*.redhat.com` and  `https://*.stage.redhat.com`
   - In the future, once the API is fully deployed to QA, this will be a representation of `ci-beta` and `ci-stable`

#### Branching and Pull Request Workflow
It is required that all work is handled through GitHub's fork and pull workflow. 

**Working directly on the main repository is highly discouraged. Continuous Integration is dependent on branch structure.**

1. General development PRs should almost always be opened against the `ci` branch.
1. It is preferred that PRs to `qa` originate from `ci`, but testing related fixes and general PRs opened against `qa` are allowed.
1  PRs from `ci` to `qa` are allowed
1. PRs from `qa` to `stage` are preferred.
1. PRs to `stage` require a QE team members approval/sign-off.
1. PRs to `main` are only allowed from `stage`.
1. PRs to `main` branch are considered production ready releases.
1. Development or testing PRs opened against main, unless a team agreed exception occurs, will be closed.
1. All PRs to production, main branch, should have a final review, coordination, from Quality Engineering.

```
   PR fork -> ci <-> qa -> stage -> main
```

### Releases and Tagging
1. Merging a PR into `main` is considered production ready.
1. Merging a PR into `main` doesn't require tagging and [CHANGELOG.md](./CHANGELOG.md) updates.
1. Running `$ yarn release` after commits are merged into `main` generates the release commit and [CHANGELOG.md](./CHANGELOG.md). You may need to update/pull tags prior to running this command. This commit should be pushed towards `main`. This release commit is currently used as a purposeful block and may be automated in the future. [The commit message is recognized in the release script](./.travis/custom_release.sh#L41). This commit format controls when files are pushed towards production stable, and gives development a fallback when something goes wrong.
1. Tagging and `CHANGELOG.md` updates should be coordinated against a consistent release cycle, and can take place at an independent time.
1. Tagging should make use of semver.
1. Manipulating tags against commits directly should be avoided in favor of a semantic version increment, iteration.
1. Once a release commit and tag have been implemented `stage`, `qa`, and `ci` will be rebased accordingly.

## Serving content, or getting everything to run in your local environment.
To serve content you'll need to have Docker, Node, and Yarn installed.

Serving content comes in 3 variations
- `$ yarn start`, Styled local run, without the Insights proxy, using a mock server.
  - You'll be presented with a login, you can attempt to login with user `admin` password `admin` as the credentials.
    However, the up-to-date credentials are maintained here, [RH Cloud Services Config standalone](https://github.com/RedHatInsights/frontend-components/tree/master/packages/config#standalone)
  - By default `local` run uses the `prod-stable` branch of the [Insights chroming repo](https://github.com/RedHatInsights/insights-chrome) (see the repo for additional branches). You can run a branch of your choice by either running the terminal command
     ```
      $ export DEV_BRANCH=ci-beta; yarn start
     ```
    or by placing the parameter in a `.env.local` dotenv file in the root directory of the project (you can use .env.development and .env.proxy as examples)
     ```
      DEV_BRANCH=ci-beta
     ```
  - Terminal messaging should indicate the path at which the app can be opened, you may need to scroll up.

- `$ yarn start:proxy`, Styled local using the Insights proxy.
  - This requires access in order to be used. In addition, you may be asked for your credentials during initial repository setup. The credentials are used to modify your `hosts` for local run.
  - By default `proxy` run uses the `ci-stable` branch of the [Insights chroming repo](https://github.com/RedHatInsights/insights-chrome) (see the repo for additional branches). You can run a branch of your choice by either running the terminal command
     ```
      $ export DEV_BRANCH=ci-beta; yarn start:proxy
     ```
    or by placing the parameter in a `.env.local` dotenv file in the root directory of the project (you can use .env.development and .env.proxy as examples)
     ```
      DEV_BRANCH=ci-beta
     ```
  - Terminal messaging should indicate the path at which the app can be opened, you may need to scroll up.

### Proxy failing to run?
Occasionally the proxy setup will attempt to connect, acknowledge that it's connected, but then fail to load the GUI.
Things to try:

#### It's Docker?
1. Stop the build
1. Restart Docker
1. Run the build again, `$ yarn start:proxy`

#### It's Authentication?
1. Stop the build
1. Confirm you're logged in, connect if necessary
1. Run the build again, `$ yarn start:proxy`

#### You forgot to unset an exported parameter
1. Determine if you recently ran any command that used `$ export DEV_[something]; yarn [some-command]`.
1. Stop the build
2. Unset that `exported` value by running `$ unset DEV_[something]`
1. Run the build again, `$ yarn start:proxy`

#### It's still failing, and now I'm frustrated!
You can take the easy way out and just run, `$ yarn start`, it'll be styled and use mock data, but you'll have enough access to continue development. 

## Build
### Maintenance
#### NPMs
Our schedule for updating NPMs
- dependabot running once a week on low level packages that require only testing confirmation
- 1x a month: running our aggregated dependency update script for all low level packages that require only testing confirmation
   - `$ yarn build:deps`
- 1x a month: running updates on NPMs that require additional visual confirmation, this includes...
   - dependency-name: "@patternfly/*"
   - dependency-name: "@redhat-cloud-services/frontend*"
   - dependency-name: "*i18next*"
   - dependency-name: "victory*"
   - dependency-name: "react-router*"

### dotenv files
Our current build leverages `dotenv`, or `.env*`, files to apply environment build configuration. 

There are currently build processes in place that leverage the `.env*.local` files, these files are actively applied in our `.gitignore` in order to avoid build conflicts. They should continue to remain ignored, and not be added to the repository.

Specific uses:
- `.env.local`, is left alone for developer purposes, typically around displaying Redux logging
- `.env.development.local`, is used by the local run NPM script `$ yarn start:local`
- `.env.production.local`, is used by the build to relate version information

## Writing code
### Reserved CSS class names
This project makes use of reserved CSS class prefixes used by external resources. 
> Updating elements with these classes should be done with the knowledge "you are affecting an external resource in a potentially unanticipated way".

1. Prefix `uxui-`

   CSS classes with the prefix `uxui-` are used by external resources to identify elements for use in 3rd party tooling. Changes to the class name or element should be broadcast towards our UI/UX team members. 

### Reserved QE testing attributes
This project makes use of reserved DOM attributes used by the QE team.
> Updating elements with these attributes should be done with the knowledge "you are affecting" QE's ability to test.

1. Attribute `data-test`

   DOM attributes with `data-test=""` are used by QE as a means to identify specific DOM elements.

### Reserved Files
#### Spandx Config
##### Current setup
A low level Spandx config is being used within the [proxy config](./config/webpack.proxy.config.js) local run. It follows the same guidelines as the original Spandx config, but is now
integrated with dotenv parameters.

This proxy route file still has multiple team and build dependencies. **Before relocating/moving this file(s) the appropriate teams should be informed.**
- Development team
- QE team

There is a related integration test snapshot(s) of this proxy route file, `./tests/platform.test.js` that may need updating if the file is altered.

## Testing
To test content you'll need to have Node and Yarn installed.

### Analyzing build output
You may want to confirm what exactly gets output from the build, run the build with `analyze`
   ```
   $ export DEV_ANALYZE=true; yarn build
   ```

### Code Coverage Requirements
Updates that drop coverage below the current threshold will need to have their coverage expanded accordingly before being merged. 

Settings for the Jest aspect of code coverage can be found in [jest.config.js](./jest.config.js). Settings for the CI reporting level of code coverage
can be found in [.codecov.yml](./.codecov.yml).

### Debugging and Testing

#### Debugging in environments
You can access basic dotenv config values via a global window object unique to the application. You'll need to access the GUI through a browser, open the development console and type
   ```
   curiosity
   ```
   or
   ```
   window.curiosity
   ```

This should expose a quick grouping of string values (along with a few superfluous helper functions) enabling you to identify things such as the `release version`.

The name of the window value can be found under the dotenv file `.env`
   ```
   REACT_APP_UI_LOGGER_ID=curiosity
   ```

#### Debugging local development
You can apply overrides during local development by adding a `.env.local` (dotenv) file in the repository root directory.

Once you have made the dotenv file and/or changes, like the below "debug" flags, restart the project and the flags should be active.

*Any changes you make to the `.env.local` file should be ignored with `.gitignore`.*


##### Local CSS/Styling display vs Environments
The default context for starting local development runs with the command
   ```
   $ yarn start
   ```

This default comes with a caveat, it uses mock API data.

##### Graph display
You can apply a date override during **local development** (using `$ yarn start`) by adding the following line to your `.env.local` file.
   ```
   REACT_APP_DEBUG_DEFAULT_DATETIME=20190630
   ```

##### Admin role
You can access the administrator role experience during **local development** (using `$ yarn start`) by adding the following line to your `.env.local` file.
   ```
   REACT_APP_DEBUG_ORG_ADMIN=true
   ```

Combining this flag with [manipulating the http status on the API/service mocks](https://github.com/cdcabrera/apidoc-mock#more-examples-and-custom-responses) can be an effective emulation.

##### Permissions
You can access different levels of user permissions during **local development** (using `$ yarn start`) by adding the following lines to your `.env.local` file.
   ```
   REACT_APP_DEBUG_PERMISSION_APP_ONE=subscriptions:*:*
   REACT_APP_DEBUG_PERMISSION_APP_TWO=inventory:*:*
   ```

As additional resource and operation checks are implemented these values should be altered accordingly.

Combining these flags with [manipulating the http status on the API/service mocks](https://github.com/cdcabrera/apidoc-mock#more-examples-and-custom-responses) can be an effective emulation.

##### Debugging Redux
This project makes use of React & Redux. To enable Redux browser console logging add the following line to your `.env.local` file.
  ```
  REACT_APP_DEBUG_MIDDLEWARE=true
  ```

#### Unit Testing
To run the unit tests with a watch during development you'll need to open an additional terminal instance, then run
  ```
  $ yarn test:dev
  ```

##### Updating test snapshots
To update snapshots from the terminal run 
  ```
  $ yarn test:dev
  ```

From there you'll be presented with a few choices, one of them is "update", you can then hit the "u" key. Once the update script has run you should see additional changed files within Git, make sure to commit them along with your changes or testing will fail.

##### Checking code coverage
To check the coverage report from the terminal run
  ```
  $ yarn test
  ```

##### Code coverage failing to update?
If you're having trouble getting an accurate code coverage report, or it's failing to provide updated results (i.e. you renamed files) you can try running
  ```
  $ yarn test:clearCache
  ```

## Typical Development Workflow
1. Confirm you've installed all recommended tooling
1. Confirm the repository name has no blank spaces in it. If it does replace that blank with a dash or underscore, Docker has issues with unescaped parameter strings.
1. Confirm you've installed resources through yarn
1. Create a local dotenv file called `.env.local` and add the following contents
    ```
    REACT_APP_DEBUG_MIDDLEWARE=true
    ```
1. Confirm you have access to the network
1. Make sure Docker is running
1. Open a couple of instances of Terminal and run...
    ```
    $ yarn start:proxy
    ```
    and, optionally,
    ```
    $ yarn test:dev
    ```
1. Make sure your browser opened around the domain `https://*.foo.redhat.com/`
1. Start developing...

### Local Run Development Workflow
1. Confirm you've installed all recommended tooling, and it's running (Docker or alternative)
1. Confirm the repository name has no blank spaces in it. If it does replace that blank with a dash or underscore, Docker has issues with unescaped parameter strings.
1. Confirm you've installed resources through yarn
1. Create a local dotenv file called `.env.local` and add the following contents
    ```
    REACT_APP_DEBUG_MIDDLEWARE=true
    REACT_APP_DEBUG_ORG_ADMIN=true
    REACT_APP_DEBUG_PERMISSION_APP_ONE=subscriptions:*:*
    REACT_APP_DEBUG_PERMISSION_APP_TWO=inventory:*:*
    ```
1. Open a couple of instances of Terminal and run...
   ```
   $ yarn start
   ```
   and, optionally,
   ```
   $ yarn test:dev
   ```
1. Make sure your browser opened around the domain `https://localhost:3000/`
1. Start developing...
