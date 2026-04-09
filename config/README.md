# Configuration
## Build
Build support scripts.

## cspell config
The cspell config file(s) contain spelling configuration and include project specific terms.

Support and top-level markdown (`./docs/**/*.md`, `./guidelines/**/*.md`, `README.md`, `CONTRIBUTING.md`, this file) are checked with `npm run test:spell-support` from the repository root. Application sources and locale JSON use `npm run test:spell`. Both run during `npm test` (and `test:spell-support` is included in `npm run test:dev` and `npm run build:docs` via `test:docs`).

## Spandx config
The Spandx config file originally had multiple team and build dependencies around it, including the proxy run. This file may no longer be needed or used. **But before relocating/moving this file, a thorough search of the repository should be in order.**

## Testing
Jest configuration setup and transform scripts.

## Webpack
Webpack for local development and proxy run, and build output.
