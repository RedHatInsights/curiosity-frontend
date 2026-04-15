# Agent Coding

## Overview
Coding standards and architectural patterns for the project.

## For Agents
### Processing Priority
High - Process when implementing features or refactoring code.

### Related Guidelines
See the [Guidelines Index](./README.md#guidelines-index) for all guidelines.

## 1. Stack and Architecture
- **React**: Mirror functional component and hook patterns used in neighboring files.
- **UI**: Use `@patternfly/react-*` and tokens; align with existing shared components.
- **Types**: Match the existing language (JS or TS) and JSDoc style. Always use `@memberof`, `@module`, and `@property` tags for documentation.

## 2. Module Organization
- **Imports**: Group external (PF/React), then internal (`services/`, `redux/`), then relative.
- **Components**: Follow `src/components/<name>/` with `__tests__` and `index.js`.
- **Styles**: SCSS files should be centralized under `src/styles/` (e.g., `_component.scss`) and imported in `src/styles/index.scss`. Do NOT house styles next to components.
- **Config**: Use `src/config/` for product-specific logic. Review [Product Configuration skills](./skills/product-configuration/SKILL.md) for automated support.
- **Services**: Maintain a consistent file structure: `*Services.js` (API), `*Constants.js` (URLs/Types), `*Schemas.js` (Validation), `*Transformers.js` (Data transformation), and `*Helpers.js` (Service utilities).

## 3. Redux and State
- **Custom Surface**: Import **`storeHooks`** from `src/redux`. Use `storeHooks.reactRedux` helpers:
    - `useDispatch`: Supports batch dispatching arrays of actions via `multiActionMiddleware`.
    - `useSelector`: Standard wrapper for `useSelector` with fallback value support.
    - `useSelectors`: Aggregates multiple selectors into an array or object.
    - `useSelectorsResponse`: Aggregates multiple selectors and handles response states (pending, fulfilled, error). Similar hooks include `useSelectorsAllSettledResponse`, `useSelectorsAnyResponse`, and `useSelectorsRaceResponse`.
- **Patterns**:
    - **Action Suffixes**: Promise-based actions MUST use `_PENDING`, `_FULFILLED`, and `_REJECTED` suffixes (see `promiseMiddleware.js`).
    - **Normalization**: Use `src/redux/common/reduxHelpers.js` (e.g., `setNormalizedResponse`) for consistent API data processing.
    - **Data Transformation**: Prefer transforming API data in `*Transformers.js` (at the service/action level) to prepare it for the UI, rather than using complex selectors that process raw data in the Redux store.

## 4. Implementation Details
- **Testability**: Use dependency injection for hooks and helpers (e.g., `useX = defaultX`, `t = translate`).
- **I18n**: User-visible strings MUST use `translate` from `src/components/i18n/i18n` to pull values from `public/locales/` (e.g., `en-US.json`).
    - **String Logic**: The helper filters `undefined` or `falsy` values from arrays, minimizing display logic in components.
    - **E2E Support**: Use the `testId` property in `translate` to wrap strings in a `<span>` with `data-test` for QE/QA access.
- **Routing**: Use `routerHelpers` from `src/components/router/` for handling dynamic paths and URL parameters.
- **Component Reuse**: Reuse existing components (e.g., `toolbarField*`) and utilities from `src/common/` (e.g., `dateHelpers`, `downloadHelpers`) to maintain consistency.
- **Layout Constraints**: Avoid wrapping children of layout components (like `PageLayout`) in custom containers, as they often filter children by type (e.g., `PageHeader`).
- **Layout Shifts**: Use the `MinHeight` component for asynchronous content to prevent page jumping.
- **Linting**: Run `npm run test:lint` and `npm run test:lintfix` before completion.

## 5. Quality Control & Validation
Agents MUST validate all code outputs using the project's quality suite:

1. **Linting**: `npm run test:lint` (Ensures style consistency)
2. **Documentation**: `npm run test:spell` and `npm run test:spell-support` (CSpell validation)
3. **Testing**: `npm run test` (Unit) and `npm run test:integration` (E2E)
4. **Build**: `npm run build` (Webpack compilation and bundling and integration testing)
5. **Build Integration Testing**: `npm run build` Ensure all tests pass and no snapshot errors are present before committing. If errors persist, run `npm run test:integration-dev` to enter Jest watch mode and update snapshots.
