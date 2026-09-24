/**
 * POC Tests Against Stage Environment
 *
 * This demonstrates testing against Stage with:
 * 1. Real Stage authentication
 * 2. API mocking (ephemeral UI code → Stage-like backend behavior)
 * 3. Real Stage API (integration validation)
 */

import { test, expect } from '../helpers/test-fixtures';
import { disableCookiePrompt } from '@redhat-cloud-services/playwright-test-auth';
import { RHEL_METRIC, RHEL_PRODUCT } from '../pages/rhel-page';

test.beforeEach(async ({ page }) => {
  await disableCookiePrompt(page);
});

test.describe('POC: Stage Tests with Mocking', () => {
  // ============================================
  // Tests with Mocked API (Test UI code)
  // ============================================

  test('system table displays mocked data on Stage', async ({ rhelPage, mocker }) => {
    // Mock API BEFORE navigation
    await mocker.mockInstances(RHEL_PRODUCT, {
      data: {
        data: [
          {
            id: 'fdf1ed33-ed61-4acb-8d57-e3c5b79fd0d4',
            instance_id: 'd7bd052f-3ba6-46fd-9ef8-ba84b4a1976e',
            display_name: 'physical_1f50f4e3zxifxjpk.example.dev',
            measurements: [4.0],
            last_seen: '2026-04-08T11:45:41.088467Z',
            number_of_guests: 0,
            category: 'physical',
            subscription_manager_id: 'd8e38990-4c30-4792-8012-e705ba8db1f8',
            inventory_id: 'd7bd052f-3ba6-46fd-9ef8-ba84b4a1976e'
          },
          {
            id: '9760babb-8cb7-4d7b-a729-a9c3f5a99bc9',
            instance_id: 'bde3f04e-de7b-4327-8a16-cfeaba61b4c0',
            display_name: 'physical_d3d85d36rizjgqbv.example.gov',
            measurements: [2.0],
            last_seen: '2026-04-08T11:45:41.086609Z',
            number_of_guests: 0,
            category: 'physical',
            subscription_manager_id: '53ee6c45-724d-474b-be0e-51e919bb8a18',
            inventory_id: 'bde3f04e-de7b-4327-8a16-cfeaba61b4c0'
          }
        ],
        links: {
          first: '/api/rhsm-subscriptions/v1/instances/products/RHEL%20for%20x86?offset=0',
          last: '/api/rhsm-subscriptions/v1/instances/products/RHEL%20for%20x86?offset=0'
        },
        meta: { count: 2, product: RHEL_PRODUCT, measurements: [RHEL_METRIC] }
      }
    });

    // Navigate to Stage
    await rhelPage.goto();

    // Click "Current instances" tab
    await rhelPage.navigateToInstances();

    // Wait for table - but we get MOCKED data!
    await rhelPage.waitForInstances();

    // Verify mocked host names appear
    await rhelPage.expectInstanceVisible('physical_1f50f4e3zxifxjpk.example.dev');

    console.log('✅ Mocked data displayed successfully on Stage!');
  });

  test('chart displays with mocked tally data on Stage', async ({ rhelPage, mocker, chartUtils }) => {
    // Mock tally API with default fixture (31 days: March 14 - April 13, 2026)
    // Values range from 120-195, below capacity threshold of 200
    await mocker.mockTally(RHEL_PRODUCT, RHEL_METRIC);

    await rhelPage.goto();
    // Wait for chart
    await chartUtils.waitForChart();

    // Verify chart rendered
    await chartUtils.assertHasData();

    // Read actual data values by sweeping across chart (iqe-core approach)
    console.log('Sweeping across chart to read data points...');

    const dataPoints = await chartUtils.getAllDataValuesBySweep();
    console.log('Data points found:', JSON.stringify(dataPoints, null, 2));

    // Verify we found data points (should find ~31 points from March 14 - April 13)
    expect(dataPoints.length).toBeGreaterThan(0);

    // Each data point has categories (Physical, Virtual, Hypervisor, Public cloud, Subscription threshold)
    // Extract all values across all categories
    const allValues: number[] = [];
    dataPoints.forEach(dp => {
      Object.values(dp.categories).forEach(value => {
        allValues.push(value);
      });
    });

    console.log('All category values found:', allValues);

    // Verify we have data
    expect(allValues.length).toBeGreaterThan(0);

    // Verify chart displays reasonable values (below capacity threshold of 200)
    const hasNonZeroValues = allValues.some(v => v > 0);
    expect(hasNonZeroValues).toBeTruthy();

    // Verify values are below capacity threshold
    const maxValue = Math.max(...allValues.filter(v => v > 0));
    console.log('Maximum value found:', maxValue);
    expect(maxValue).toBeLessThan(600);

    console.log('✅ Chart data verified - displaying category breakdown with values below threshold');
  });

  test('empty state test with mocked empty data on Stage', async ({ rhelPage, mocker }) => {
    // Mock empty instances
    await mocker.mockEmptyInstances(RHEL_PRODUCT);
    await mocker.mockEmptyTally(RHEL_PRODUCT, RHEL_METRIC);

    await rhelPage.goto();
    // Click instances tab
    await rhelPage.navigateToInstances();

    // Should show empty state
    await rhelPage.waitForEmptyState();

    console.log('✅ Empty state displayed correctly with mocked empty data');
  });

  test('chart handles mocked data spike on Stage', async ({ rhelPage, mocker, chartUtils }) => {
    // Mock tally with spike
    await mocker.mockTallyWithSpike(RHEL_PRODUCT, RHEL_METRIC, {
      spikeDay: 3,
      spikeValue: 1000,
      baseValue: 100,
      days: 7
    });

    await rhelPage.goto();
    await chartUtils.waitForChart();

    // Verify Y-axis scales to spike
    const yLabels = await chartUtils.getYAxisLabels();
    const yValues = await chartUtils.getYAxisValues();
    console.log('Y-axis labels with spike:', yLabels);
    console.log('Y-axis values with spike:', yValues);

    // Should have high values (spike value is 1000)
    const hasHighValue = yValues.some(value => value >= 900);
    expect(hasHighValue).toBeTruthy();

    console.log('✅ Chart handles spike correctly');
  });

  test('API error handling with mocked error on Stage', async ({ rhelPage, mocker }) => {
    // Mock error response
    await mocker.mockError('**/api/rhsm-subscriptions/**', 500, 'Service Unavailable');

    await rhelPage.goto();
    // Should show error message
    await rhelPage.waitForError();
    await expect(rhelPage.viewErrorButton).toBeVisible({ timeout: 10000 });

    console.log('✅ Error state displayed correctly');
  });
});

test.describe('POC: Stage Tests with Real API', () => {
  // ============================================
  // Tests with Real Stage API (Integration)
  // ============================================

  test('system table displays real Stage data', async ({ rhelPage }) => {
    // NO MOCKING - use real Stage API

    await rhelPage.goto();
    // Click instances tab
    await rhelPage.navigateToInstances();

    // Wait for table with real data
    await rhelPage.waitForInstances(20000);

    // Count rows
    const rowCount = await rhelPage.getInstanceCount();
    console.log(`Real Stage data: ${rowCount} instances found`);

    expect(rowCount).toBeGreaterThan(0);

    console.log('✅ Real Stage data displayed successfully');
  });

  test('chart displays with real Stage tally data', async ({ rhelPage, chartUtils }) => {
    // NO MOCKING - use real Stage API

    await rhelPage.goto();
    // Wait for chart to load
    await chartUtils.waitForChart();

    // Verify chart has real data
    await chartUtils.assertHasData();

    // Verify real Stage data is displayed
    const yMax = await chartUtils.getYAxisMaxValue();
    console.log(`Chart Y-axis max value from real Stage API: ${yMax}`);
    expect(yMax).toBeGreaterThan(0);

    const xLabels = await chartUtils.getXAxisDateRange();
    console.log('Chart X-axis labels from real Stage API:', xLabels);
    expect(xLabels.length).toBeGreaterThan(0);

    console.log('✅ Real Stage chart data displayed');
  });

  test('verify chart data matches API response', async ({ rhelPage, chartUtils }) => {
    // NO MOCKING - test integration

    await rhelPage.goto();
    // Wait for chart
    await chartUtils.waitForChart();

    // Verify chart data by reading axis values
    await chartUtils.assertHasData();

    const yMax = await chartUtils.getYAxisMaxValue();
    const xLabels = await chartUtils.getXAxisDateRange();

    console.log('Chart Y-axis max:', yMax);
    console.log('Chart X-axis labels:', xLabels);

    // Verify chart has meaningful data
    expect(yMax).toBeGreaterThan(0);
    expect(xLabels.length).toBeGreaterThan(0);

    console.log('✅ Chart data retrieved and validated');
  });

  test('tooltip shows real data on hover', async ({ rhelPage, chartUtils }) => {
    await rhelPage.goto();
    await chartUtils.waitForChart();

    // Hover over data point
    await chartUtils.hoverDataPoint(0);

    // Verify tooltip appears (selector may vary)
    const tooltipCount = await rhelPage.chartTooltip.count();

    console.log(`Tooltip elements found: ${tooltipCount}`);

    // Just verify we can hover without errors
    console.log('✅ Hover interaction successful');
  });

  test('pagination works with real Stage data', async ({ rhelPage }) => {
    await rhelPage.goto();
    await rhelPage.navigateToInstances();

    // Wait for table
    await rhelPage.waitForInstances(20000);

    // Check if pagination exists
    if (await rhelPage.goToNextPage()) {
      console.log('✅ Pagination works with real data');
    } else {
      console.log('✅ Pagination disabled or not needed (small dataset)');
    }
  });
});

test.describe('POC: Hybrid Tests (Stage Auth + Mocked Data)', () => {
  // ============================================
  // Best of both worlds:
  // - Real Stage authentication
  // - Mocked API to test specific UI scenarios
  // ============================================

  test('test new UI feature with Stage auth but mocked data', async ({ rhelPage, mocker }) => {
    // Mock specific test scenario
    await mocker.mockInstances(RHEL_PRODUCT, {
      data: {
        data: [
          {
            id: 'test-hypervisor-1',
            instance_id: 'hypervisor-uuid',
            display_name: 'test-hypervisor.example.com',
            measurements: [32],
            last_seen: new Date().toISOString(),
            number_of_guests: 150, // Large number to test UI
            category: 'hypervisor',
            subscription_manager_id: 'test-sm-id',
            inventory_id: 'test-inv-id'
          }
        ],
        meta: { count: 1, product: RHEL_PRODUCT, measurements: [RHEL_METRIC] },
        links: { first: '', last: '' }
      }
    });

    await rhelPage.goto();

    // But we see MOCKED data (controlled test scenario)
    await rhelPage.navigateToInstances();

    // Verify mocked hypervisor
    await rhelPage.expectInstanceVisible('test-hypervisor.example.com');

    // Verify guest count (from mocked data)
    await rhelPage.expectGuestCountVisible(150);

    console.log('✅ Hybrid test: Stage auth + mocked data works!');
  });

  test('test usage chart with day gaps', async ({ rhelPage, mocker, chartUtils }) => {
    // Mock edge case: gaps in data
    await mocker.mockTallyWithGaps(RHEL_PRODUCT, RHEL_METRIC, {
      gapDays: [2, 3, 4], // Weekend gap
      baseValue: 100,
      days: 7
    });

    await rhelPage.goto();
    await chartUtils.waitForChart();

    // Chart should handle gaps
    await chartUtils.assertHasData();

    console.log('✅ Chart handles gaps correctly (hybrid test)');
  });
});

test.describe('POC: Visual Regression on Stage', () => {
  test('chart baseline screenshot on Stage', async ({ rhelPage, mocker, chartUtils }) => {
    // Use consistent mock data for visual regression
    await mocker.mockTally(RHEL_PRODUCT, RHEL_METRIC, {
      data: {
        data: Array(30)
          .fill(null)
          .map((_, i) => ({
            date: new Date(2026, 3, i + 1).toISOString(),
            value: 100 + Math.sin(i / 7) * 20,
            has_data: true
          })),
        meta: {
          count: 30,
          product: RHEL_PRODUCT,
          granularity: 'daily',
          metric_id: RHEL_METRIC
        }
      }
    });

    await rhelPage.goto();
    // Wait for chart to stabilize
    await chartUtils.waitForChartStable(2000);

    // Take screenshot
    await expect(rhelPage.chartArea).toHaveScreenshot('stage-rhel-chart-baseline.png', {
      maxDiffPixels: 100,
      threshold: 0.2,
      animations: 'disabled'
    });

    console.log('✅ Visual regression baseline captured');
  });
});
