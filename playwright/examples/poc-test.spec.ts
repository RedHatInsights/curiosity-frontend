/**
 * POC Example Tests using RhsmMocker and ChartUtils
 *
 * This demonstrates the complete testing workflow:
 * 1. Mock API responses
 * 2. Test chart rendering
 * 3. Verify data accuracy
 * 4. Test edge cases
 */

import { test, expect } from '@playwright/test';
import { RhsmMocker } from '../helpers/rhsm-mocks';
import { ChartUtils } from '../helpers/chart-utils';

test.describe('POC: RHEL System Table and Chart Tests', () => {
  let mocker: RhsmMocker;
  let chartUtils: ChartUtils;

  test.beforeEach(async ({ page }) => {
    mocker = new RhsmMocker(page);
    chartUtils = new ChartUtils(page);
  });

  // ============================================
  // Basic Chart Tests
  // ============================================

  test('chart renders with default mock data', async ({ page }) => {
    // Mock tally API with default fixture data
    await mocker.mockTally('RHEL for x86', 'Sockets');

    // Navigate to RHEL view
    await page.goto('http://localhost:3000/subscriptions/usage/rhel');

    // Wait for chart to load
    await chartUtils.waitForChart();

    // Verify chart has data
    await chartUtils.assertHasData();

    // Count data points
    const pointCount = await chartUtils.countDataPoints();
    console.log(`Chart has ${pointCount} data points`);
    expect(pointCount).toBeGreaterThan(0);
  });

  test('chart displays correct axis labels', async ({ page }) => {
    await mocker.mockTally('RHEL for x86', 'Sockets');
    await page.goto('http://localhost:3000/subscriptions/usage/rhel');
    await chartUtils.waitForChart();

    // Get axis labels
    const xLabels = await chartUtils.getXAxisLabels();
    const yLabels = await chartUtils.getYAxisLabels();

    console.log('X-axis labels:', xLabels);
    console.log('Y-axis labels:', yLabels);

    // Should have date labels on X-axis
    expect(xLabels.length).toBeGreaterThan(0);

    // Should have numeric labels on Y-axis
    expect(yLabels.length).toBeGreaterThan(0);
  });

  // ============================================
  // System Table Tests
  // ============================================

  test('system table displays instances', async ({ page }) => {
    // Mock both APIs
    await mocker.mockInstances('RHEL for x86');
    await mocker.mockTally('RHEL for x86', 'Sockets');

    await page.goto('http://localhost:3000/subscriptions/usage/rhel');

    // Click "Current instances" tab
    await page.getByRole('tab', { name: 'Current instances' }).click();

    // Wait for table
    const table = page.locator('[data-test="instancesTable"]');
    await expect(table).toBeVisible({ timeout: 10000 });

    // Verify we have rows (fixture has 3 instances)
    const rows = page.locator('tbody tr');
    const rowCount = await rows.count();
    console.log(`Table has ${rowCount} rows`);
    expect(rowCount).toBeGreaterThanOrEqual(3);

    // Verify host names from fixture
    await expect(page.getByText('physical_1f50f4e3zxifxjpk.example.dev')).toBeVisible();
    await expect(page.getByText('virtual_host.example.com')).toBeVisible();
  });

  // ============================================
  // Edge Case Tests
  // ============================================

  test('shows empty state when no instances', async ({ page }) => {
    // Mock empty response
    await mocker.mockEmptyInstances('RHEL for x86');
    await mocker.mockEmptyTally('RHEL for x86', 'Sockets');

    await page.goto('http://localhost:3000/subscriptions/usage/rhel');

    // Should show empty state message
    await expect(page.getByText(/no data|no results|clear some or all filters/i))
      .toBeVisible({ timeout: 10000 });
  });

  test('chart handles data spike correctly', async ({ page }) => {
    // Mock tally with spike on day 15
    await mocker.mockTallyWithSpike('RHEL for x86', 'Sockets', {
      spikeDay: 4,
      spikeValue: 1000,
      baseValue: 100,
      days: 8
    });

    await page.goto('http://localhost:3000/subscriptions/usage/rhel');
    await chartUtils.waitForChart();

    // Verify Y-axis scales to accommodate spike
    const yLabels = await chartUtils.getYAxisLabels();
    console.log('Y-axis labels with spike:', yLabels);

    // Should have labels near 1000
    const hasHighValue = yLabels.some(label => parseInt(label) >= 900);
    expect(hasHighValue).toBeTruthy();
  });

  test('chart handles data gaps correctly', async ({ page }) => {
    // Mock tally with gaps on days 3, 4, 5
    await mocker.mockTallyWithGaps('RHEL for x86', 'Sockets', {
      gapDays: [3, 4, 5],
      baseValue: 100,
      days: 8
    });

    await page.goto('http://localhost:3000/apps/subscriptions/rhel');
    await chartUtils.waitForChart();

    // Chart should still render (just with gaps)
    await chartUtils.assertHasData();
  });

  test('handles API error gracefully', async ({ page }) => {
    // Mock error response
    await mocker.mockError('**/api/rhsm-subscriptions/**', 500, 'Service Unavailable');

    await page.goto('http://localhost:3000/apps/subscriptions/rhel');

    // Should show error message
    await expect(page.getByText(/error|failed|unavailable/i))
      .toBeVisible({ timeout: 10000 });
  });

  test('shows loading state with slow API', async ({ page }) => {
    // Mock slow API (3 second delay)
    await mocker.mockSlowApi('**/api/rhsm-subscriptions/**', 3000);

    await page.goto('http://localhost:3000/subscriptions/usage/rhel');

    // Should show loading spinner
    const spinner = page.locator('.pf-c-spinner, [role="progressbar"]');
    await expect(spinner).toBeVisible({ timeout: 2000 });

    // Wait for it to finish
    await expect(spinner).not.toBeVisible({ timeout: 5000 });
  });

  // ============================================
  // Large Dataset Tests
  // ============================================

  test('handles large dataset (1000 instances)', async ({ page }) => {
    // Mock 1000 instances
    await mocker.mockLargeInstancesDataset('RHEL for x86', 1000);
    await mocker.mockTally('RHEL for x86', 'Sockets');

    await page.goto('http://localhost:3000/subscriptions/usage/rhel');

    // Click instances tab
    await page.getByRole('tab', { name: 'Current instances' }).click();

    // Should show pagination
    await expect(page.getByText(/1-100 of 1000|1-20 of 1000/)).toBeVisible({ timeout: 10000 });

    // Should be able to navigate pages
    const nextButton = page.getByRole('button', { name: /next/i });
    if (await nextButton.isEnabled()) {
      await nextButton.click();
      await expect(page.getByText(/101-200|21-40/)).toBeVisible({ timeout: 5000 });
    }
  });

  // ============================================
  // Interaction Tests
  // ============================================

  test('tooltip shows on chart hover', async ({ page }) => {
    await mocker.mockTally('RHEL for x86', 'Sockets');
    await page.goto('http://localhost:3000/subscriptions/usage/rhel');
    await chartUtils.waitForChart();

    // Hover over first data point
    await chartUtils.hoverDataPoint(0);

    // Tooltip should appear
    const tooltip = page.locator('[role="tooltip"], .pf-c-tooltip');
    await expect(tooltip).toBeVisible({ timeout: 2000 });
  });

  // ============================================
  // Complete Scenario Tests
  // ============================================

  test('complete populated scenario', async ({ page }) => {
    // Mock all APIs for a complete scenario
    await mocker.mockCompleteScenario('RHEL for x86', 'populated');

    await page.goto('http://localhost:3000/subscriptions/usage/rhel');

    // Verify chart
    await chartUtils.waitForChart();
    await chartUtils.assertHasData();

    // Verify instances
    await page.getByRole('tab', { name: 'Current instances' }).click();
    const table = page.locator('tbody tr');
    expect(await table.count()).toBeGreaterThan(0);
  });

  test('complete empty scenario', async ({ page }) => {
    // Mock all APIs for empty scenario
    await mocker.mockCompleteScenario('RHEL for x86', 'empty');

    await page.goto('http://localhost:3000/subscriptions/usage/rhel');

    // Should show empty state
    await expect(page.getByText(/no data|no results/i)).toBeVisible({ timeout: 10000 });
  });

  // ============================================
  // Visual Regression Test
  // ============================================

  test('chart visual regression baseline', async ({ page }) => {
    // Use consistent mock data
    await mocker.mockTally('RHEL for x86', 'Sockets');

    await page.goto('http://localhost:3000/subscriptions/usage/rhel');

    // Wait for chart to stabilize
    await chartUtils.waitForChartStable(2000);

    // Take screenshot
    const chartArea = chartUtils.getChartArea();
    await expect(chartArea).toHaveScreenshot('rhel-tally-chart-baseline.png', {
      maxDiffPixels: 100,
      threshold: 0.2,
      animations: 'disabled'
    });
  });

  // ============================================
  // Debug Helper Test
  // ============================================

  test.skip('debug SVG structure', async ({ page }) => {
    await mocker.mockTally('RHEL for x86', 'Sockets');
    await page.goto('http://localhost:3000/subscriptions/usage/rhel');
    await chartUtils.waitForChart();

    // Log SVG structure for exploration
    await chartUtils.debugSvgStructure();
  });
});
