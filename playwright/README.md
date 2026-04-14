# Playwright POC for curiosity-frontend

Testing curiosity-frontend with Playwright on **Stage environment** using API mocking.

## 📁 Structure

```
playwright/
├── helpers/
│   ├── rhsm-mocks.ts        # RhsmMocker class - mock RHSM APIs
│   ├── chart-utils.ts       # ChartUtils class - test charts
│   └── types.ts             # TypeScript types for API responses
├── fixtures/
│   ├── instances.json       # Mock instances data (3 instances)
│   ├── tally.json          # Mock tally data (31 days: March 14 - April 13, 2026)
│   └── capacity.json       # Mock capacity data (threshold: 600)
├── examples/
│   ├── poc-stage-test.spec.ts  # Main POC - Stage environment tests ⭐
│   └── poc-test.spec.ts        # Reference - localhost tests
└── README.md               # This file
```

## 🚀 Quick Start

### 1. Set Stage Password

```bash
export RH_STAGE_PASSWORD="your-stage-password"
```

### 2. Run the POC Tests

```bash
# From curiosity-frontend root directory

# Run all Stage POC tests
npx playwright test examples/poc-stage-test.spec.ts

# Run with UI mode (recommended for exploration)
npx playwright test examples/poc-stage-test.spec.ts --ui

# Run specific test
npx playwright test examples/poc-stage-test.spec.ts -g "chart displays with mocked tally"

# Run in headed mode (see browser)
npx playwright test examples/poc-stage-test.spec.ts --headed

# Debug mode with Inspector
npx playwright test examples/poc-stage-test.spec.ts --debug
```

### 3. Generate HTML Report

```bash
npx playwright test examples/poc-stage-test.spec.ts
npx playwright show-report
```

### 4. View Traces (After Failure)

```bash
# Traces are automatically saved on failure
npx playwright show-trace playwright-report/trace.zip
```

## 📚 Usage Examples

### Stage Login Helper

All tests use the `loginToStage()` helper:

```typescript
import { Page } from '@playwright/test';

async function loginToStage(page: Page) {
  // Handles cookie banner, login form, and authentication
  // Uses RH_STAGE_PASSWORD env variable
  // Username: curiosity-automation-user
}
```

### Basic Mock Usage on Stage

```typescript
import { RhsmMocker } from '../helpers/rhsm-mocks';

test('my test', async ({ page }) => {
  const mocker = new RhsmMocker(page);
  
  // Mock tally API with default fixture data (31 days)
  await mocker.mockTally('RHEL for x86', 'Sockets');
  
  // Navigate to Stage
  await page.goto('https://console.stage.redhat.com/subscriptions/usage/rhel');
  await loginToStage(page);
  
  // Verify chart renders
  await expect(page.locator('[data-test="curiosity-chartarea"]')).toBeVisible();
});
```

### Mock with Custom Data

```typescript
test('custom data', async ({ page }) => {
  const mocker = new RhsmMocker(page);
  
  // Mock with custom data
  await mocker.mockTally('RHEL for x86', 'Sockets', {
    data: {
      data: [
        { date: '2026-04-01T00:00:00Z', value: 100, has_data: true },
        { date: '2026-04-02T00:00:00Z', value: 150, has_data: true }
      ],
      meta: {
        count: 2,
        product: 'RHEL for x86',
        granularity: 'daily',
        metric_id: 'Sockets'
      }
    }
  });
  
  await page.goto('https://console.stage.redhat.com/subscriptions/usage/rhel');
  await loginToStage(page);
});
```


### Mock with Granularity and Category

```typescript
test('monthly data for physical instances', async ({ page }) => {
  const mocker = new RhsmMocker(page);
  
  // Mock specific granularity and category
  await mocker.mockTally('RHEL for x86', 'Sockets', {
    granularity: 'monthly',
    category: 'physical',
    data: monthlyPhysicalData
  });
  
  await page.goto('https://console.stage.redhat.com/subscriptions/usage/rhel');
  await loginToStage(page);
});
```

### Chart Testing with Tooltip Sweep

```typescript
import { ChartUtils } from '../helpers/chart-utils';

test('read chart data', async ({ page }) => {
  const mocker = new RhsmMocker(page);
  const chartUtils = new ChartUtils(page);
  
  await mocker.mockTally('RHEL for x86', 'Sockets');
  await page.goto('https://console.stage.redhat.com/subscriptions/usage/rhel');
  await loginToStage(page);
  
  // Wait for chart
  await chartUtils.waitForChart();
  
  // Read data by sweeping across chart and reading tooltips
  const dataPoints = await chartUtils.getAllDataValuesBySweep();
  console.log(dataPoints);
  // [{ date: 'March 14', categories: { Physical: 40, Virtual: 24, ... } }, ...]
  
  // Get axis values
  const yLabels = await chartUtils.getYAxisLabels(); // ['0', '1K', '2K']
  const yValues = await chartUtils.getYAxisValues();  // [0, 1000, 2000]
  const xLabels = await chartUtils.getXAxisLabels();  // ['March 14', 'March 15']
});
```

### Three Testing Modes

**Mode 1: Stage Auth + Mocked APIs** (90% of tests)
```typescript
test('test UI with controlled data', async ({ page }) => {
  const mocker = new RhsmMocker(page);
  
  // Mock specific scenario
  await mocker.mockTally('RHEL for x86', 'Sockets');
  
  await page.goto('https://console.stage.redhat.com/subscriptions/usage/rhel');
  await loginToStage(page);  // Real Stage authentication
  
  // Test UI with mocked data
  await chartUtils.waitForChart();
  const dataPoints = await chartUtils.getAllDataValuesBySweep();
  expect(dataPoints.length).toBeGreaterThan(0);
});
```

**Mode 2: Stage Auth + Real APIs** (10% of tests)
```typescript
test('integration validation', async ({ page }) => {
  // NO MOCKING - use real Stage backend
  
  await page.goto('https://console.stage.redhat.com/subscriptions/usage/rhel');
  await loginToStage(page);
  
  // Validate real data flows through correctly
  await chartUtils.waitForChart();
  await chartUtils.assertHasData();
});
```

**Mode 3: Hybrid** (edge cases)
```typescript
test('test edge case with Stage auth', async ({ page }) => {
  const mocker = new RhsmMocker(page);
  
  // Real auth, but mock edge case data
  await mocker.mockTallyWithSpike('RHEL for x86', 'Sockets', {
    spikeDay: 3,
    spikeValue: 10000
  });
  
  await page.goto('https://console.stage.redhat.com/subscriptions/usage/rhel');
  await loginToStage(page);
  
  // Verify UI handles extreme values
  const yMax = await chartUtils.getYAxisMaxValue();
  expect(yMax).toBeGreaterThan(9000);
});
```

## 🔧 RhsmMocker API Reference

### Core Methods

```typescript
// Mock instances API
await mocker.mockInstances(productId, options?);

// Mock tally API (supports category and granularity filtering)
await mocker.mockTally(productId, metricId?, options?);

// Mock capacity API (supports granularity filtering)
await mocker.mockCapacity(productId, options?);

// Mock subscriptions API
await mocker.mockSubscriptions(options?);
```

### Tally/Capacity Options

```typescript
// Mock tally with specific granularity
await mocker.mockTally('RHEL for x86', 'Sockets', {
  granularity: 'monthly',  // daily, weekly, monthly, quarterly, yearly
  data: monthlyData
});

// Mock tally with specific category
await mocker.mockTally('RHEL for x86', 'Sockets', {
  category: 'physical',  // physical, virtual, hypervisor, cloud
  data: physicalData
});

// Mock capacity with granularity
await mocker.mockCapacity('RHEL for x86', {
  granularity: 'daily',
  data: dailyCapacityData
});
```

### Convenience Methods

```typescript
// Mock empty responses
await mocker.mockEmptyInstances(productId);
await mocker.mockEmptyTally(productId, metricId?);

// Mock error
await mocker.mockError(pattern, statusCode?, message?);

// Mock slow API (test loading states)
await mocker.mockSlowApi(pattern, delay?);

// Mock large dataset
await mocker.mockLargeInstancesDataset(productId, count?);

// Mock tally with spike
await mocker.mockTallyWithSpike(productId, metricId?, options?);

// Mock tally with gaps
await mocker.mockTallyWithGaps(productId, metricId?, options?);

// Mock complete scenario
await mocker.mockCompleteScenario(productId, 'populated' | 'empty' | 'error');

// Remove all mocks (passthrough to real API)
await mocker.passthroughAll();
```

### Options

```typescript
interface TallyMockOptions {
  statusCode?: number;     // HTTP status code (default: 200)
  delay?: number;          // Delay in ms (default: 0)
  data?: any;             // Custom response data (default: fixture)
  category?: string;       // Filter by category (physical, virtual, hypervisor, cloud)
  granularity?: string;    // Filter by granularity (daily, weekly, monthly, quarterly, yearly)
}

interface CapacityMockOptions {
  statusCode?: number;
  delay?: number;
  data?: any;
  granularity?: string;    // Filter by granularity
}
```

## 🎨 ChartUtils API Reference

### Core Methods

```typescript
// Wait for chart to render
await chartUtils.waitForChart(timeout?);

// Verify chart state
await chartUtils.assertHasData();
await chartUtils.assertIsEmpty();

// Count elements
const seriesCount = await chartUtils.countDataSeries();
const pointCount = await chartUtils.countDataPoints();  // Note: may be 0 for area charts
```

### Reading Chart Data

```typescript
// Get axis labels (uses chart IDs: chart-axis-0-ChartLabel, chart-axis-1-ChartLabel)
const xLabels = await chartUtils.getXAxisLabels();  // ['March 14', 'March 15', ...]
const yLabels = await chartUtils.getYAxisLabels();  // ['0', '100', '200', '1K', '2K']

// Get axis values (Y-axis labels parsed to numbers)
const yValues = await chartUtils.getYAxisValues();  // [0, 100, 200, 1000, 2000]
const yMax = await chartUtils.getYAxisMaxValue();   // 2000

// Parse individual Y-axis value
const value = chartUtils.parseYAxisValue('1K');  // 1000
```

### Reading Tooltip Data (iqe-curiosity-plugin approach)

```typescript
// Sweep across chart and read all tooltips
const dataPoints = await chartUtils.getAllDataValuesBySweep();
/* Returns:
[
  {
    date: 'March 14',
    categories: {
      'Physical': 40,
      'Virtual': 24,
      'Hypervisor': 6,
      'Public cloud': 12,
      'Subscription threshold': 600
    }
  },
  ...
]
*/

// Manual tooltip interaction
await chartUtils.hoverDataPoint(index);
const tooltipData = await chartUtils.getTooltipData();
const tooltipText = await chartUtils.getTooltipValue();
```

### Utility Methods

```typescript
// Screenshots
const screenshot = await chartUtils.getChartScreenshot();
await chartUtils.waitForChartStable(timeout?);

// Locators
const chartArea = chartUtils.getChartArea();
const svg = chartUtils.getSvg();

// Debug
await chartUtils.debugSvgStructure();
```

## 📊 Test Scenarios in POC

The POC (`poc-stage-test.spec.ts`) includes:

### Stage Tests with Mocking
- ✅ **System table** - Mocked instances data
- ✅ **Chart rendering** - Mocked tally data with tooltip sweep
- ✅ **Empty states** - Mocked empty data
- ✅ **Data spike** - Chart Y-axis scaling with extreme values
- ✅ **API errors** - Error message display

### Stage Tests with Real API
- ✅ **Real instances** - Integration with Stage backend
- ✅ **Real chart data** - Actual tally data from Stage
- ✅ **Chart validation** - Verify real data rendering
- ✅ **Tooltips** - Hover interactions with real data
- ✅ **Pagination** - Table pagination with real data

### Hybrid Tests (Stage Auth + Mocked Data)
- ✅ **Edge cases** - Test specific UI scenarios
- ✅ **Data gaps** - Missing data handling
- ✅ **Large datasets** - Hypervisors with 150 guests
- ✅ **Visual regression** - Screenshot baselines

## 🔍 Using Inspector

The Inspector is the killer feature for developing tests:

```bash
# Run with Inspector
npx playwright test examples/poc-stage-test.spec.ts --debug

# Use Inspector to:
# 1. Point and click to generate selectors
# 2. Explore SVG structure visually
# 3. Step through test execution
# 4. View network requests and API responses
# 5. See console logs
# 6. Inspect chart tooltip structure
```

**Pro tip:** Click "Explore" in Inspector to hover over elements and see their selectors. Great for finding chart axis IDs!

## 📸 Using Trace Viewer

When tests fail, traces show you exactly what happened:

```bash
# View trace after failure
npx playwright show-trace playwright-report/trace.zip

# In trace viewer you can:
# - See visual timeline of test
# - View screenshots at each step
# - See network requests/responses
# - View console logs
# - Inspect DOM at any point
# - See which locators failed and why
```

## 🎯 Next Steps

### 1. Set Up Environment

```bash
# Set Stage password
export RH_STAGE_PASSWORD="your-password"

# Install Playwright browsers (if not done)
npx playwright install
```

### 2. Run the POC

```bash
# Run Stage tests with UI mode
npx playwright test examples/poc-stage-test.spec.ts --ui

# Run specific test suite
npx playwright test examples/poc-stage-test.spec.ts -g "Stage Tests with Mocking"
```

### 3. Explore with Inspector

```bash
# Debug a specific test
npx playwright test examples/poc-stage-test.spec.ts --debug -g "chart displays"
```

### 4. Create Your Own Stage Test

```typescript
// playwright/my-stage-test.spec.ts
import { test, expect } from '@playwright/test';
import { RhsmMocker } from './helpers/rhsm-mocks';
import { ChartUtils } from './helpers/chart-utils';

test.describe('My Stage Tests', () => {
  test('my test scenario', async ({ page }) => {
    const mocker = new RhsmMocker(page);
    const chartUtils = new ChartUtils(page);
    
    // Mock API
    await mocker.mockTally('RHEL for x86', 'Sockets', {
      granularity: 'monthly'
    });
    
    // Navigate to Stage
    await page.goto('https://console.stage.redhat.com/subscriptions/usage/rhel');
    await loginToStage(page);
    
    // Test chart
    await chartUtils.waitForChart();
    const dataPoints = await chartUtils.getAllDataValuesBySweep();
    expect(dataPoints.length).toBeGreaterThan(0);
  });
});
```

### 5. Test Different Granularities

```typescript
// Mock different data for different filters
await mocker.mockTally('RHEL for x86', 'Sockets', {
  granularity: 'daily',
  data: dailyFixture
});

await mocker.mockTally('RHEL for x86', 'Sockets', {
  granularity: 'monthly',
  data: monthlyFixture
});

// Switch granularity in UI and verify correct mock is used
```

## 💡 Tips & Tricks

### Debugging on Stage

```typescript
// 1. Use page.pause() to manually inspect Stage UI
await page.pause();

// 2. Log API requests (mock vs real)
page.on('response', async res => {
  if (res.url().includes('rhsm-subscriptions')) {
    console.log('API:', res.status(), res.url());
    console.log('Body:', await res.json());
  }
});

// 3. Take screenshots of current state
await page.screenshot({ path: 'stage-debug.png' });

// 4. Debug chart structure
await chartUtils.debugSvgStructure();

// 5. Check tooltip data
const tooltipData = await chartUtils.getTooltipData();
console.log('Tooltip:', tooltipData);

// 6. Browser console logs
page.on('console', msg => console.log('Browser:', msg.text()));
```

### Working with Fixtures

The default fixtures use realistic Stage-like data:

```typescript
// tally.json: 31 days (March 14 - April 13, 2026)
// - Values: 120-195 (below capacity threshold)
// - Gradual upward trend

// capacity.json: 31 days
// - Threshold: 600 (constant)

// instances.json: 3 instances
// - Mix of physical, virtual, hypervisor

// Override with custom data for specific tests
await mocker.mockTally('RHEL for x86', 'Sockets', {
  data: {
    data: [
      { date: '2026-04-14T00:00:00.000Z', value: 100, has_data: true }
    ],
    meta: { count: 1, product: 'RHEL for x86', granularity: 'daily', metric_id: 'Sockets' }
  }
});
```

### Speed Up Stage Tests

```typescript
// Use shorter timeouts for mocked tests
test.setTimeout(30000); // 30 seconds

// Run independent tests in parallel
test.describe.configure({ mode: 'parallel' });

// Skip delays in mocks
await mocker.mockTally('RHEL for x86', 'Sockets', {
  delay: 0 // Instant response
});

// Reduce tooltip sweep timeout
await this.page.waitForTimeout(50); // Instead of 100ms
```

### Reuse Stage Login

```typescript
// Share login state across tests (experimental)
// See: https://playwright.dev/docs/auth

// Or use beforeEach for fresh login each test
test.beforeEach(async ({ page }) => {
  await page.goto('https://console.stage.redhat.com/subscriptions/usage/rhel');
  await loginToStage(page);
});
```

### Reuse Mock Configurations

```typescript
// Create reusable mock setups
async function mockCompleteRHEL(mocker: RhsmMocker, granularity = 'daily') {
  await mocker.mockInstances('RHEL for x86');
  await mocker.mockTally('RHEL for x86', 'Sockets', { granularity });
  await mocker.mockCapacity('RHEL for x86', { granularity });
}

test('daily data', async ({ page }) => {
  const mocker = new RhsmMocker(page);
  await mockCompleteRHEL(mocker, 'daily');
  // Test with daily data
});

test('monthly data', async ({ page }) => {
  const mocker = new RhsmMocker(page);
  await mockCompleteRHEL(mocker, 'monthly');
  // Test with monthly data
});
```

## 🐛 Troubleshooting

### Stage Login Issues

```typescript
// Check password is set
console.log('Password set:', !!process.env.RH_STAGE_PASSWORD);

// Increase login timeouts
await expect(page.getByRole('textbox', { name: 'Red Hat login' }))
  .toBeVisible({ timeout: 30000 });

// Debug: Pause to manually inspect
await page.pause();
```

### Mocks not working?

```typescript
// Log all API requests to see if mock is being hit
page.on('request', req => {
  if (req.url().includes('rhsm-subscriptions')) {
    console.log('API request:', req.url());
  }
});

page.on('response', async res => {
  if (res.url().includes('rhsm-subscriptions')) {
    console.log('API response:', res.status(), res.url());
  }
});

// Check if granularity/category parameters match
// Mock: granularity: 'monthly'
// URL:  ...?granularity=daily  <- Won't match!
```

### Chart Tooltip Not Reading?

```typescript
// Verify tooltip appears
const tooltip = page.locator('.curiosity-chartarea__tooltip');
console.log('Tooltip count:', await tooltip.count());

// Debug tooltip HTML structure
const html = await tooltip.innerHTML();
console.log('Tooltip HTML:', html);

// Check sweep parameters
const dataPoints = await chartUtils.getAllDataValuesBySweep();
console.log('Data points found:', dataPoints.length);
// If 0, try adjusting pixelStep in chart-utils.ts
```

### Y-Axis Parsing Issues?

```typescript
// Check raw labels
const yLabels = await chartUtils.getYAxisLabels();
console.log('Y-axis labels:', yLabels);  // ['0', '100K', '200K']

// Check parsed values
const yValues = await chartUtils.getYAxisValues();
console.log('Y-axis values:', yValues);  // [0, 100000, 200000]

// Test parser directly
console.log(chartUtils.parseYAxisValue('1K'));   // 1000
console.log(chartUtils.parseYAxisValue('2.5M')); // 2500000
```

## 📖 Further Reading

- [Playwright Documentation](https://playwright.dev)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
- [Locators Guide](https://playwright.dev/docs/locators)
- [Assertions](https://playwright.dev/docs/test-assertions)
- [Test Fixtures](https://playwright.dev/docs/test-fixtures)

## 🎉 Stage Testing POC Complete!

**What you get:**
- ✅ **Stage environment testing** - Real authentication, stable backend
- ✅ **API mocking** - Test UI behavior with controlled data
- ✅ **Chart testing** - Read tooltips via sweep, parse Y-axis values
- ✅ **Category/granularity support** - Mock different filter combinations
- ✅ **TypeScript type safety** - Full type definitions for API responses
- ✅ **Full Playwright tooling** - Inspector, Traces, UI mode work perfectly
- ✅ **Three test modes** - Mocked data, real API, or hybrid

**Benefits over ephemeral environments:**
- ⚡ **No 30+ min EE creation** - Test immediately on Stage
- 🔍 **Inspector works** - Point-and-click selector generation
- 📊 **Traces work** - Visual debugging on failures
- 🎯 **Full control** - Mock any edge case scenario
- 🚀 **6x faster feedback** - PR testing in 5-10 minutes

**Key Features:**
- Reads actual chart tooltips using pixel sweep (iqe-core approach)
- Parses Y-axis labels (handles 1K, 2M, etc.)
- Supports all granularities (daily, monthly, quarterly, yearly)
- Works with any product variant (RHEL, OpenShift, etc.)

Happy testing! 🚀
