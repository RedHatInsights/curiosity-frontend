# Playwright tests for curiosity-frontend

This directory contains Playwright tests for the Curiosity RHEL usage view against the Red Hat Stage environment.

The suite uses real Stage authentication and can either mock the RHSM APIs or call the Stage APIs.

## What the suite covers

- RHEL navigation and page-object usage
- RHSM inventory, tally, capacity, and subscription route mocking
- Chart rendering, axes, tooltips, empty states, errors, loading, and visual snapshots
- A small set of live Stage integration checks

The mocked tests control RHSM responses, but the browser, application assets, authentication, and any unmocked requests still use Stage.

## Layout

```text
playwright/
├── global-setup.ts                 # Authenticates once and writes storage state
├── specs/
│   ├── basic-navigation.spec.ts    # Basic RHEL page checks
│   ├── rhel-usage.spec.ts          # Controlled RHSM feature tests
│   ├── rhel-usage-live.spec.ts     # Live Stage integration checks
│   └── rhel-usage-visual.spec.ts   # Chart visual regression
├── pages/
│   └── rhel-page.ts                # RHEL page object and shared locators
├── helpers/
│   ├── chart-utils.ts              # Chart and tooltip helpers
│   ├── rhsm-mocks.ts               # RHSM route mocking helpers
│   ├── test-fixtures.ts            # chartUtils, mocker, and rhelPage fixtures
│   └── types.ts                    # RHSM response types
├── fixtures/
│   ├── instances.json
│   ├── tally.json
│   └── capacity.json
└── README.md
```

The Playwright configuration is at the repository root in `playwright.config.ts`. Authentication state is written to `playwright/.auth/user.json`; this path is ignored by Git.

## Prerequisites

Use a Node.js version supported by the repository (`>=22.23.2`), install dependencies, and install the Chromium browser:

```bash
npm ci
npx playwright install chromium
```

The current configuration targets `https://console.stage.redhat.com` and uses the Red Hat corporate Squid proxy. It therefore requires access to the Stage environment and the corporate network. Override these defaults with `PLAYWRIGHT_BASE_URL` and `PLAYWRIGHT_PROXY_SERVER` when needed.

## Authentication

Set both Stage credentials before running tests:

```bash
export E2E_USER="your-stage-username"
export E2E_PASSWORD="your-stage-password"
```

`globalSetup` launches Chromium, disables the cookie prompt, signs in once, and saves the reusable storage state. Test contexts reuse that state; test files should not perform a fresh login. Each spec disables the cookie prompt before navigation because routes from the global setup page are not carried into test pages.

Do not commit credentials or `playwright/.auth/user.json`.

## Running tests

Run the complete suite:

```bash
npm run test:e2e
npm run test:e2e:typecheck
```

The complete suite includes live Stage tests and requires Stage data. For a readable console report, override the configured HTML reporter:

```bash
npx playwright test --reporter=list
```

Run only the controlled checks:

```bash
npm run test:e2e:mocked
```

Run the controlled feature specs:

```bash
npx playwright test specs/basic-navigation.spec.ts specs/rhel-usage.spec.ts
```

Run the live Stage specs explicitly:

```bash
npx playwright test specs/rhel-usage-live.spec.ts --grep @live
```

Run the live Stage checks explicitly:

```bash
npm run test:e2e:live
```

Useful development modes:

```bash
# Browser visible
npx playwright test specs/rhel-usage.spec.ts --headed

# Playwright UI mode
npx playwright test specs/rhel-usage.spec.ts --ui

# Inspector
npx playwright test specs/rhel-usage.spec.ts --debug

# One test by title
npx playwright test specs/rhel-usage.spec.ts -g "chart renders with default mock data"
```

The current configuration runs with one worker by default. Increase workers only when the Stage environment and the tests being run can safely handle parallel requests.

## Reports and traces

Normal runs use the HTML reporter:

```bash
npx playwright test specs/rhel-usage.spec.ts
npx playwright show-report
```

Tracing is retained for failed tests by default. Enable the same behavior explicitly for a diagnostic run with `retain-on-failure`:

```bash
npx playwright test specs/rhel-usage-live.spec.ts --trace retain-on-failure
TRACE_PATH=$(find test-results -name trace.zip -print -quit)
npx playwright show-trace "$TRACE_PATH"
```

Screenshots and reports are runtime artifacts and are ignored by Git. Visual baselines are stored beside their specs under `*-snapshots/`.

## Authentication and test boundaries

There are three useful test boundaries in this suite:

1. RHSM-mocked tests exercise Curiosity UI behavior with controlled responses. They still use the authenticated Stage page.
2. Hybrid tests use Stage authentication and selected mocked RHSM responses for edge cases.
3. Live Stage tests validate the current Stage backend and are inherently data- and environment-dependent.

Keep live tests separate from deterministic UI checks. A live test should not be used to prove a fixed value, row count, or pagination state unless the Stage data is provisioned and controlled for that test.

## RHSM mocking

Register routes before navigating:

```typescript
import { test, expect } from './helpers/test-fixtures';
import { RHEL_METRIC, RHEL_PRODUCT } from './pages/rhel-page';

test('renders controlled chart data', async ({ rhelPage, mocker, chartUtils }) => {
  await mocker.mockInstances(RHEL_PRODUCT);
  await mocker.mockTally(RHEL_PRODUCT, RHEL_METRIC);
  await mocker.mockCapacity(RHEL_PRODUCT);

  await rhelPage.goto();
  await chartUtils.waitForChart();
  await chartUtils.assertHasData();

  await expect(rhelPage.chartArea).toBeVisible();
});
```

Available core methods:

```typescript
await mocker.mockInstances(productId, options?);
await mocker.mockTally(productId, metricId?, options?);
await mocker.mockCapacity(productId, options?);
await mocker.mockSubscriptions(productId, options?);
```

Common scenario helpers:

```typescript
await mocker.mockEmptyInstances(productId);
await mocker.mockEmptyTally(productId, metricId?);
await mocker.mockError(pattern, statusCode?, message?);
await mocker.mockSlowApi(pattern, delay?, data?);
await mocker.mockLargeInstancesDataset(productId, count?);
await mocker.mockTallyWithSpike(productId, metricId?, options?);
await mocker.mockTallyWithGaps(productId, metricId?, options?);
await mocker.mockCompleteScenario(productId, 'populated' | 'empty' | 'error');
```

Example custom response:

```typescript
await mocker.mockTally(RHEL_PRODUCT, RHEL_METRIC, {
  data: {
    data: [
      { date: '2026-04-01T00:00:00Z', value: 100, has_data: true },
      { date: '2026-04-02T00:00:00Z', value: 150, has_data: true }
    ],
    meta: {
      count: 2,
      product: RHEL_PRODUCT,
      granularity: 'daily',
      metric_id: RHEL_METRIC
    }
  }
});
```

`category` and `granularity` options restrict which request is matched; they do not filter the response body. If either option is supplied, the request must contain the same query parameter. Set the corresponding UI filter before navigation or provide a mock without that restriction.

Mocks are page-scoped. Register a fresh set of routes in each test and use a fresh test page when switching between mocked and live behavior.

## Page objects and fixtures

Use the shared fixtures instead of constructing helpers manually:

```typescript
import { test } from './helpers/test-fixtures';
import { RHEL_METRIC, RHEL_PRODUCT } from './pages/rhel-page';

test('shows a mocked instance', async ({ rhelPage, mocker }) => {
  await mocker.mockInstances(RHEL_PRODUCT);
  await mocker.mockTally(RHEL_PRODUCT, RHEL_METRIC);
  await mocker.mockCapacity(RHEL_PRODUCT);

  await rhelPage.goto();
  await rhelPage.navigateToInstances();
  await rhelPage.expectInstanceVisible('virtual_host.example.com');
});
```

`RHELPage` owns navigation and RHEL-specific locators. `ChartUtils` is scoped to the RHEL chart fixture and provides chart waits, axis access, tooltip access, and visual-stability helpers.

Prefer page-object methods, accessible roles, and existing `data-test` attributes. The chart helpers currently inspect application-specific SVG structure, so chart markup changes may require helper updates.

## Chart helpers

```typescript
await chartUtils.waitForChart();
await chartUtils.assertHasData();
await chartUtils.assertIsEmpty();

const xLabels = await chartUtils.getXAxisLabels();
const yLabels = await chartUtils.getYAxisLabels();
const yValues = await chartUtils.getYAxisValues();
const yMax = await chartUtils.getYAxisMaxValue();

await chartUtils.hoverDataPoint(0);
const tooltip = await chartUtils.getTooltipData();
```

The tooltip sweep is an interaction helper. It relies on pixel movement and timing, and should be used for interaction coverage rather than as the sole source of exact API-value validation. Formatted values such as abbreviated thousands or decimal values require explicit parsing and should not be compared using integer parsing.

For exact API/UI comparisons, capture the relevant response before navigation and compare it with the rendered result:

```typescript
const responsePromise = page.waitForResponse(
  response => response.url().includes('/api/rhsm-subscriptions/v1/tally/') && response.ok()
);

await rhelPage.goto();
const response = await responsePromise;
const apiData = await response.json();
```

## Visual regression

Visual tests use fixed mocked data and Chromium. Run or update a baseline deliberately:

```bash
npx playwright test specs/rhel-usage-visual.spec.ts
npx playwright test specs/rhel-usage-visual.spec.ts --update-snapshots
```

Review updated PNGs as part of the change. Do not update snapshots merely to make a failing test pass.

## Troubleshooting

### Authentication fails

Confirm both variables are set and that the Stage URL and corporate proxy are reachable:

```bash
test -n "$E2E_USER" && echo "E2E_USER is set"
test -n "$E2E_PASSWORD" && echo "E2E_PASSWORD is set"
```

The authentication state is regenerated by `globalSetup` for each Playwright invocation.

### A mock is not being used

- Register the route before `rhelPage.goto()`.
- Confirm the product and metric match the request path.
- If `category` or `granularity` is specified, confirm the request query parameter matches exactly.
- Use the `[Mock]` request logs or attach a `page.on('request')` listener while diagnosing.

### A chart assertion is unstable

Wait for the chart with `chartUtils.waitForChart()` before reading SVG content. Use `waitForChartStable()` for screenshots. Avoid adding arbitrary sleeps to tests; prefer a locator assertion or a response wait for the state being tested.

## Current limitations

- The configuration is fixed to Stage and a corporate proxy.
- All tests require Stage authentication, including RHSM-mocked tests.
- Live Stage tests depend on external data and are not suitable as deterministic CI checks.
- Playwright is not currently invoked by `npm test` or the repository CI workflow.
- The suite does not yet provide a separate local app project.

These limitations should be addressed before treating this directory as the repository-wide E2E testing standard.

## Further reading

- [Playwright documentation](https://playwright.dev/docs)
- [Playwright best practices](https://playwright.dev/docs/best-practices)
- [Locators](https://playwright.dev/docs/locators)
- [Assertions](https://playwright.dev/docs/test-assertions)
- [Fixtures](https://playwright.dev/docs/test-fixtures)
