# Contributing
Contributing encompasses repository specific requirements and the global [Insights guidelines](https://cloud.redhat.com/docs/storybook?path=/story/welcome--getting-started).

## Install
Before developing you'll need to install:
 * [NodeJS and NPM](https://nodejs.org/)
 * [Docker](https://docs.docker.com/engine/installation/)
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
  * [Docker postinstall documentation](https://docs.docker.com/install/linux/linux-postinstall/)

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

Settings for [Standard Version](https://github.com/conventional-changelog/standard-version#readme) can be found in [package.json](./package.json)

### Branching, Pull Requests, and Releases
Curiosity makes use of the branches `master`, `stage`, `qa`, and `ci`. 
- `master` branch is a protected representation of production environments
   - Adding commits, or a PR, into `master` should generate a `prod-stable` branch within the deploy repository [curiosity-frontend-build](https://github.com/RedHatInsights/curiosity-frontend-build)
   - The `prod-stable` branch is manually deployed through coordination with the operations team.
- `stage` branch is a protected representation of production environments
   - Adding commits, or a PR, into `stage` should generate a `prod-beta` branch within the deploy repository [curiosity-frontend-build](https://github.com/RedHatInsights/curiosity-frontend-build)
   - The `prod-beta` branch is manually deployed through coordination with the operations team.
- `qa` branch is a representation of `qa-stable`, and `ci-stable`.
   - Adding commits, or a PR, into `ci-stable` should generate `ci-*` and `qa-*` branches within the deploy repository [curiosity-frontend-build](https://github.com/RedHatInsights/curiosity-frontend-build)
   - The `ci-*` and `qa-*` branches are automatically deployed within an averaged time for both `https://ci.*.redhat.com` and `https://qa.*.redhat.com`
   - In the future, once the API is fully deployed to QA, this will be a representation of `qa-beta` and `qa-stable`
- `ci` branch is a representation of `ci-beta`, and `qa-beta`.
   - Adding commits, or a PR, into `ci-beta` should generate `ci-*` and `qa-*` branches within the deploy repository [curiosity-frontend-build](https://github.com/RedHatInsights/curiosity-frontend-build)
   - The `ci-*` and `qa-*` branches are automatically deployed within an averaged time for both `https://ci.*.redhat.com` and `https://qa.*.redhat.com`
   - In the future, once the API is fully deployed to QA, this will be a representation of `ci-beta` and `ci-stable`

#### Branching and Pull Request Workflow
It is required that all work is handled through GitHub's fork and pull workflow. 

**Working directly on the master repository is highly discouraged since a form of Continuous Integration is implemented and dependent on branch structure.**

1. General development PRs should almost always be opened against the `ci` branch.
1. It is preferred that PRs to `qa` originate from `ci`, but testing related fixes and general PRs opened against `qa` are allowed.
1  PRs from `ci` to `qa` are allowed
1. PRs from `qa` to `stage` are preferred.
1. PRs to `stage` require a QE team members approval/sign-off.
1. PRs to `master` are only allowed from `stage`.
1. PRs to `master` branch are considered production ready releases.
1. Development or testing PRs opened against master, unless a team agreed exception occurs, will be closed.
1. All PRs to production, master branch, should have a final review, coordination, from Quality Engineering.

```
   PR fork -> ci <-> qa -> stage -> master
```

### Releases and Tagging
1. Merging a PR into `master` is considered production ready.
1. Merging a PR into `master` doesn't require tagging and [CHANGELOG.md](./CHANGELOG.md) updates.
1. Tagging and `CHANGELOG.md` updates should be coordinated against a consistent release cycle, and can take place at an independent time.
1. Tagging should make use of semver.
1. Manipulating tags against commits directly should be avoided in favor of a semantic version increment, iteration.
1. Once a release commit and tag have been implemented `stage`, `qa`, and `ci` will be rebased accordingly.

## Serving content, or getting everything to run in your local environment.
To serve content you'll need to have Docker, Node, and Yarn installed.

Serving content comes in 3 variations
- `$ yarn start`, Styled local run, without the Insights proxy. 
  
  The cons to this are a lack of chroming aspects such as functional login and left navigation.
- `$ yarn start:proxy`, Styled local run WITH the Insights proxy. 
   
  This requires access in order to be used, and you may be asked for your credentials during initial repository setup. The credentials are used to modify your `hosts` for local run.
- `$ yarn start:standalone`, No Insights styling, just the straight GUI. 
  
  Useful for confirming issues between the Insights parent app vs Curiosity Frontend.
  
### Proxy failing to run?
Occasionally the proxy setup will attempt to connect, acknowledge that it's connected, but then fail to load the GUI.
Things to try:

#### It's the Port, maybe?
The API requires a secure origin header within its AJAX/XHR calls.
1. Stop the build
1. Confirm within `package.json` that the NPM scripts
   - `$ yarn api:proxy` has a port parameter setting of `443`
   - `$ yarn api:proxy` has the `domain` or `-d` parameter setup like `...proxy.api.sh -d "https://ci.foo.redhat.com/beta/subscriptions/"...` 
1. Run the build again, `$ yarn start:proxy`
1. Confirm you browser is pointed at `https://ci.foo.redhat.com/...`

#### It's Docker?
1. Stop the build
1. Restart Docker
1. Run the build again, `$ yarn start:proxy`

#### It's Authentication?
1. Stop the build
1. Confirm you're logged in, connect if necessary
1. Run the build again, `$ yarn start:proxy`

#### It's still failing, and now I'm frustrated!
You can take the easy way out and just run, `$ yarn start`, it'll be styled and use mock data but you'll have enough access to continue development. 

## Build
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
The configuration file(s) within this directory are utilized primarily during the `$ yarn start:proxy` local development run.

This file(s) has multiple team and build dependencies. **Before relocating/moving this file(s) the appropriate teams should be informed.**
- Development team
- QE team

There is a related integration test snapshot(s), `./tests/platform.test.js` that will need to be updated if this file(s) is updated.

## Testing
To test content you'll need to have Node and Yarn installed.

### Code Coverage Requirements
Updates that drop coverage below the current threshold will need to have their coverage expanded accordingly before being merged. 

Settings for the Jest aspect of code coverage can be found in [package.json](./package.json). Settings for the CI reporting level of code coverage
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
The default context for starting the local development run with 
   ```
   $ yarn start
   ```
Comes with a caveat, it uses the [Platform Chrome](https://github.com/RedHatInsights/insights-chrome) CI/master branch as its basis. What
this means is that potential styling changes will affect it, or not depending on recent updates. If styling is looking odd/off, or you
simply want to use the production styling update the NPM script branch parameter, line 63. Simply change `master` to something like `prod-stable`.
   ```
   "dev:chrome": "sh ./scripts/dev.chrome.sh -b master"
   ```

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
   REACT_APP_DEBUG_SUBSCRIPTIONS_PERMISSION_RESOURCE=*
   REACT_APP_DEBUG_SUBSCRIPTIONS_PERMISSION_OPERATION=*
   REACT_APP_DEBUG_INVENTORY_PERMISSION_RESOURCE=*
   REACT_APP_DEBUG_INVENTORY_PERMISSION_OPERATION=*
   ```

As additional resource and operation checks are implemented these values can be altered accordingly.

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
1. Confirm you've installed all recommended tooling
1. Confirm you've installed resources through yarn
1. Create a local dotenv file called `.env.local` and add the following contents
    ```
    REACT_APP_DEBUG_MIDDLEWARE=true
    REACT_APP_DEBUG_ORG_ADMIN=true
    REACT_APP_DEBUG_SUBSCRIPTIONS_PERMISSION_RESOURCE=*
    REACT_APP_DEBUG_SUBSCRIPTIONS_PERMISSION_OPERATION=*
    REACT_APP_DEBUG_INVENTORY_PERMISSION_RESOURCE=*
    REACT_APP_DEBUG_INVENTORY_PERMISSION_OPERATION=*
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
