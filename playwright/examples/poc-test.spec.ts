/**
 * POC Example Tests using RhsmMocker and ChartUtils
 *
 * This demonstrates the complete testing workflow:
 * 1. Mock API responses
 * 2. Test chart rendering
 * 3. Verify data accuracy
 * 4. Test edge cases
 */

import { test, expect } from '../helpers/test-fixtures';
import { RHEL_METRIC, RHEL_PRODUCT } from '../pages/rhel-page';

const LOCAL_RHEL_URL = 'http://localhost:3000/subscriptions/usage/rhel';

test.describe('POC: RHEL System Table and Chart Tests', () => {
  // ============================================
  // Basic Chart Tests
  // ============================================

  test('chart renders with default mock data', async ({ rhelPage, mocker, chartUtils }) => {
    // Mock tally API with default fixture data
    await mocker.mockTally(RHEL_PRODUCT, RHEL_METRIC);

    // Navigate to RHEL view
    await rhelPage.goto(LOCAL_RHEL_URL);

    // Wait for chart to load
    await chartUtils.waitForChart();

    // Verify chart has data
    await chartUtils.assertHasData();

    // Count data points
    const pointCount = await chartUtils.countDataPoints();
    console.log(`Chart has ${pointCount} data points`);
    expect(pointCount).toBeGreaterThan(0);
  });

  test('chart displays correct axis labels', async ({ rhelPage, mocker, chartUtils }) => {
    await mocker.mockTally(RHEL_PRODUCT, RHEL_METRIC);
    await rhelPage.goto(LOCAL_RHEL_URL);
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

  test('system table displays instances', async ({ rhelPage, mocker }) => {
    // Mock both APIs
    await mocker.mockInstances(RHEL_PRODUCT);
    await mocker.mockTally(RHEL_PRODUCT, RHEL_METRIC);

    await rhelPage.goto(LOCAL_RHEL_URL);

    // Click "Current instances" tab
    await rhelPage.navigateToInstances();

    // Wait for table
    await expect(rhelPage.instancesTable).toBeVisible({ timeout: 10000 });

    // Verify we have rows (fixture has 3 instances)
    const rowCount = await rhelPage.getInstanceCount();
    console.log(`Table has ${rowCount} rows`);
    expect(rowCount).toBeGreaterThanOrEqual(3);

    // Verify host names from fixture
    await rhelPage.expectInstanceVisible('physical_1f50f4e3zxifxjpk.example.dev');
    await rhelPage.expectInstanceVisible('virtual_host.example.com');
  });

  // ============================================
  // Edge Case Tests
  // ============================================

  test('shows empty state when no instances', async ({ rhelPage, mocker }) => {
    // Mock empty response
    await mocker.mockEmptyInstances(RHEL_PRODUCT);
    await mocker.mockEmptyTally(RHEL_PRODUCT, RHEL_METRIC);

    await rhelPage.goto(LOCAL_RHEL_URL);

    // Should show empty state message
    await rhelPage.waitForEmptyState();
  });

  test('chart handles data spike correctly', async ({ rhelPage, mocker, chartUtils }) => {
    // Mock tally with spike on day 15
    await mocker.mockTallyWithSpike(RHEL_PRODUCT, RHEL_METRIC, {
      spikeDay: 4,
      spikeValue: 1000,
      baseValue: 100,
      days: 8
    });

    await rhelPage.goto(LOCAL_RHEL_URL);
    await chartUtils.waitForChart();

    // Verify Y-axis scales to accommodate spike
    const yLabels = await chartUtils.getYAxisLabels();
    console.log('Y-axis labels with spike:', yLabels);

    // Should have labels near 1000
    const hasHighValue = yLabels.some(label => parseInt(label) >= 900);
    expect(hasHighValue).toBeTruthy();
  });

  test('chart handles data gaps correctly', async ({ rhelPage, mocker, chartUtils }) => {
    // Mock tally with gaps on days 3, 4, 5
    await mocker.mockTallyWithGaps(RHEL_PRODUCT, RHEL_METRIC, {
      gapDays: [3, 4, 5],
      baseValue: 100,
      days: 8
    });

    await rhelPage.goto(LOCAL_RHEL_URL);
    await chartUtils.waitForChart();

    // Chart should still render (just with gaps)
    await chartUtils.assertHasData();
  });

  test('handles API error gracefully', async ({ rhelPage, mocker }) => {
    // Mock error response
    await mocker.mockError('**/api/rhsm-subscriptions/**', 500, 'Service Unavailable');

    await rhelPage.goto(LOCAL_RHEL_URL);

    // Should show error message
    await rhelPage.waitForError();
  });

  test('shows loading state with slow API', async ({ rhelPage, mocker }) => {
    // Mock slow API (3 second delay)
    await mocker.mockSlowApi('**/api/rhsm-subscriptions/**', 3000);

    await rhelPage.goto(LOCAL_RHEL_URL);

    // Should show loading spinner
    await rhelPage.waitForLoading();

    // Wait for it to finish
    await rhelPage.waitForLoadingToFinish();
  });

  // ============================================
  // Large Dataset Tests
  // ============================================

  test('handles large dataset (1000 instances)', async ({ rhelPage, mocker }) => {
    // Mock 1000 instances
    await mocker.mockLargeInstancesDataset(RHEL_PRODUCT, 1000);
    await mocker.mockTally(RHEL_PRODUCT, RHEL_METRIC);

    await rhelPage.goto(LOCAL_RHEL_URL);

    // Click instances tab
    await rhelPage.navigateToInstances();

    // Should show pagination
    await rhelPage.expectPaginationRange(/1-100 of 1000|1-20 of 1000/);

    // Should be able to navigate pages
    if (await rhelPage.goToNextPage()) {
      await rhelPage.expectPaginationRange(/101-200|21-40/, 5000);
    }
  });

  // ============================================
  // Interaction Tests
  // ============================================

  test('tooltip shows on chart hover', async ({ rhelPage, mocker, chartUtils }) => {
    await mocker.mockTally(RHEL_PRODUCT, RHEL_METRIC);
    await rhelPage.goto(LOCAL_RHEL_URL);
    await chartUtils.waitForChart();

    // Hover over first data point
    await chartUtils.hoverDataPoint(0);

    // Tooltip should appear
    await expect(rhelPage.chartTooltip).toBeVisible({ timeout: 2000 });
  });

  // ============================================
  // Complete Scenario Tests
  // ============================================

  test('complete populated scenario', async ({ rhelPage, mocker, chartUtils }) => {
    // Mock all APIs for a complete scenario
    await mocker.mockCompleteScenario(RHEL_PRODUCT, 'populated');

    await rhelPage.goto(LOCAL_RHEL_URL);

    // Verify chart
    await chartUtils.waitForChart();
    await chartUtils.assertHasData();

    // Verify instances
    await rhelPage.navigateToInstances();
    expect(await rhelPage.getInstanceCount()).toBeGreaterThan(0);
  });

  test('complete empty scenario', async ({ rhelPage, mocker }) => {
    // Mock all APIs for empty scenario
    await mocker.mockCompleteScenario(RHEL_PRODUCT, 'empty');

    await rhelPage.goto(LOCAL_RHEL_URL);

    // Should show empty state
    await rhelPage.waitForEmptyState();
  });

  // ============================================
  // Visual Regression Test
  // ============================================

  test('chart visual regression baseline', async ({ rhelPage, mocker, chartUtils }) => {
    // Use consistent mock data
    await mocker.mockTally(RHEL_PRODUCT, RHEL_METRIC);

    await rhelPage.goto(LOCAL_RHEL_URL);

    // Wait for chart to stabilize
    await chartUtils.waitForChartStable(2000);

    // Take screenshot
    await expect(rhelPage.chartArea).toHaveScreenshot('rhel-tally-chart-baseline.png', {
      maxDiffPixels: 100,
      threshold: 0.2,
      animations: 'disabled'
    });
  });

  // ============================================
  // Debug Helper Test
  // ============================================

  test.skip('debug SVG structure', async ({ rhelPage, mocker, chartUtils }) => {
    await mocker.mockTally(RHEL_PRODUCT, RHEL_METRIC);
    await rhelPage.goto(LOCAL_RHEL_URL);
    await chartUtils.waitForChart();

    // Log SVG structure for exploration
    await chartUtils.debugSvgStructure();
  });
});
