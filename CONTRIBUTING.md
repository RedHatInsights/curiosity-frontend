# Contributing
Contributing encompasses repository specific requirements and the global [Insights guidelines](https://cloud.redhat.com/docs/storybook?path=/story/welcome--getting-started).

## Commits
In an effort to bring in future automation around 
[CHANGELOG.md](./CHANGELOG.md) and tagging we make use of [Standard Version](https://github.com/conventional-changelog/standard-version#readme) and [Conventional Commits](https://www.conventionalcommits.org).

It's encouraged that commit messaging follow the format
```
   <type>[optional scope]: <issue number><description>
```

Settings for [Standard Version](https://github.com/conventional-changelog/standard-version#readme) can be found in [package.json](./package.json)

## Build
### dotenv files
Our current build leverages `dotenv`, or `.env*`, files to apply environment build configuration. 

There are currently build processes in place that leverage the `.env*.local` files, these files are actively applied in our `.gitignore` in order to avoid build conflicts. They should continue to remain ignored, and not be added to the repository.

Specific uses:
- `.env.local`, is left alone for developer purposes, typically around displaying Redux logging
- `.env.development.local`, is used by the local run NPM script `$ yarn start:local`
- `.env.production.local`, is used by the build to relate version information

## Serving Content
To serve content you'll need to have Docker, Node, and Yarn installed.

Serving content comes in 3 variations
- `$ yarn start`, Styled local run, without the Insights proxy. 
  
  The cons to this are a lack of chroming aspects such as functional login and left navigation.
- `$ yarn start:proxy`, Styled local run WITH the Insights proxy. 
   
  This requires access in order to be used, and you may be asked for your credentials during initial repository setup. The credentials are used to modify your `hosts` for local run.
- `$ yarn start:standalone`, No Insights styling, just the straight GUI. 
  
  Useful for confirming issues between the Insights parent app vs the Subscriptions Insights GUI.
  
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

#### It's still failing, and now I'm frustrated!
You can take the easy way out and just run, `$ yarn start`, it'll be styled and use mock data but you'll have enough access to continue development. 

## Testing
To test content you'll need to have Node and Yarn installed.

### Code Coverage Requirements
Updates that drop coverage below the current threshold will need to have their coverage expanded accordingly before being merged. 

Settings for the Jest aspect of code coverage can be found in [package.json](./package.json). Settings for the CI reporting level of code coverage
can be found in [.codecov.yml](./.codecov.yml).

### Debugging and Testing

#### Debugging Redux
This project makes use of React & Redux. To enable Redux console logging, within the repository root directory, add a `.env.local` (dotenv) file with the follow line
  ```
  REACT_APP_DEBUG_MIDDLEWARE=true
  ```

Once you've made the change, restart the project and console browser logging should appear.

*Any changes you make to the `.env.local` file should be ignored with `.gitignore`.*

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

## Typical Workflow
After setting up the repository...
1. Make sure Docker is running
1. Open a couple of instances of Terminal and run...
    ```
    $ yarn start
    ```
    and, optionally,
    ```
    $ yarn test:dev
    ```
1. Make sure your browser opened around the domain `https://*.foo.redhat.com:1337`
1. Start developing...
