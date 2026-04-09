# Agent Testing

## Overview
Testing procedures and standards for the project.

## For Agents
### Processing Priority
High - Process when writing tests or verifying changes.

### Related Guidelines
See the [Guidelines Index](./README.md#guidelines-index) for all guidelines.

## 1. Principles
- **Don't Test Dependencies**: Assume `@patternfly` packages and NPM dependencies work as intended. Test integration and custom logic.
- **Focus on Display Logic for Components**: Test user-visible outcomes using React Testing Library (roles, labels) and available Jest helpers.
- **Focus on Lifecycle Logic for React Hooks**: Test component lifecycle behavior using React Testing Library and available Jest helpers.
- **Mocking**: Isolate external services. Use dependency injection for test doubles.
- **Reproducers Required**: Every bug fix must include a test case that reproduces the issue and verifies the fix.
- **Structure**: Unit tests in `__tests__/` parallel to source; integration tests in `tests/`.
- **Global Utilities**: Use the custom global utilities provided in `config/jest.setupTests.js`: `renderComponent`, `renderHook`, and `shallowComponent`.
- **Redux Testing**:
    - **Mock State**: When testing hooks with Redux, `renderHook` accepts a `state` option to mock the store's state: `await renderHook(() => useMyHook(), { state: { ... } });`
    - **Action Sequences**: Test action sequences using `promiseMiddleware` with a real store (via `legacy_createStore`) or stub dispatch with `jest.fn()`. Use `moxios` to mock API responses.
    - **Action Helpers**: Use `reduxHelpers.PENDING_ACTION`, `reduxHelpers.FULFILLED_ACTION`, and `reduxHelpers.REJECTED_ACTION` from `src/redux/common/reduxHelpers.js` to test reducer logic.

## 2. Command Reference
For all available NPM scripts see [package.json](../package.json).

| Intent        | Command                                                                                                                                             |
|---------------|-----------------------------------------------------------------------------------------------------------------------------------------------------|
| **Develop**   | `npm run test:dev` (Watch mode), `npm run build` (Compile and run integration tests), `npm run test:integration-dev` (Watch mode for build compile) |
| **Pipeline**  | `npm test` (Lints, spells, unit tests)                                                                                                              |
| **CI / Done** | `npm run build` (Compile and run integration tests)                                                                                                 |
| **Lint**      | `npm run test:lint` / `npm run test:lintfix`                                                                                                        |
| **Spelling**  | `npm run test:spell` (locale strings and code), `npm run test:spell-support` (for `docs/` and `guidelines/`)                                        |
| **Docs**      | `npm run build:docs` (Spells, lints, and updates documentation READMEs)                                                                             |

## 3. Unit Test Snapshots
- **Intentionality**: Update snapshots **only** for expected output changes.
- **Workflow**: Use `npm run test:dev` and press `u` for targeted updates. Inspect all diffs.

### 3.1 Integration Test Snapshots
- **Intentionality**: Update snapshots **only** for expected output changes.
- **Workflow**: Use `npm run build` to confirm tests complete without issue. If test snapshots fail, run `npm run test:integration-dev` and press `u` for targeted updates. Inspect all diffs.

## 4. Definition of Done
1. **Linting**: `npm run test:lint` passes.
2. **Verification**: `npm run test:ci` (or `npm test`) passes for the affected area.
3. **Build Compile Verification**: `npm run build` passes.
4. **Documentation**: `npm run build:docs` passes and ensures READMEs are in sync with JSDoc.
5. **Handoff**: Summarize verification steps and justify snapshot updates.
