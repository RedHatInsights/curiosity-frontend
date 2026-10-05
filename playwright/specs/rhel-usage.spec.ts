/**
 * RHEL usage feature tests using controlled RHSM responses.
 */

import { disableCookiePrompt } from '@redhat-cloud-services/playwright-test-auth';
import { test, expect } from '../helpers/test-fixtures';
import hypervisorInstanceFixture from '../fixtures/hypervisor-instance.json';
import tallyFixture from '../fixtures/tally.json';
import type { InstancesData } from '../helpers/types';
import { RHEL_METRIC, RHEL_PRODUCT } from '../pages/rhel-page';

const underCapacityTallyFixture = {
  ...tallyFixture,
  data: tallyFixture.data.map(point => ({ ...point, value: 50 }))
};

test.beforeEach(async ({ page }) => {
  await disableCookiePrompt(page);
});

test.describe('RHEL usage view', () => {
  /*
   * ============================================
   * Basic Chart Tests
   * ============================================
   */

  test('chart renders with default mock data', async ({ rhelPage, mocker, chartUtils }) => {
    // Mock tally API with default fixture data
    await mocker.mockInstances(RHEL_PRODUCT);
    await mocker.mockTally(RHEL_PRODUCT, RHEL_METRIC);
    await mocker.mockCapacity(RHEL_PRODUCT);

    // Navigate to RHEL view
    await rhelPage.goto();

    // Wait for chart to load
    await chartUtils.waitForChart();

    // Verify chart has data
    await chartUtils.assertHasData();
  });

  test('chart displays correct axis labels', async ({ rhelPage, mocker, chartUtils }) => {
    await mocker.mockInstances(RHEL_PRODUCT);
    await mocker.mockTally(RHEL_PRODUCT, RHEL_METRIC);
    await mocker.mockCapacity(RHEL_PRODUCT);
    await rhelPage.goto();
    await chartUtils.waitForChart();

    // Get axis labels
    const xLabels = await chartUtils.getXAxisLabels();
    const yLabels = await chartUtils.getYAxisLabels();

    // Should have date labels on X-axis
    expect(xLabels).not.toHaveLength(0);

    // Should have numeric labels on Y-axis
    expect(yLabels).not.toHaveLength(0);
  });

  /*
   * ============================================
   * System Table Tests
   * ============================================
   */

  test('system table displays instances', async ({ rhelPage, mocker }) => {
    // Mock both APIs
    await mocker.mockInstances(RHEL_PRODUCT);
    await mocker.mockTally(RHEL_PRODUCT, RHEL_METRIC);
    await mocker.mockCapacity(RHEL_PRODUCT);

    await rhelPage.goto();

    // Click "Current instances" tab
    await rhelPage.navigateToInstances();

    // Wait for table
    await expect(rhelPage.instancesTable).toBeVisible({ timeout: 10000 });

    // The controlled fixture contains exactly three instances.
    await expect(rhelPage.instanceRows).toHaveCount(3);

    // Verify host names from fixture
    await rhelPage.expectInstanceVisible('physical_1f50f4e3zxifxjpk.example.dev');
    await rhelPage.expectInstanceVisible('virtual_host.example.com');
  });

  test('displays a mocked guest count for a hypervisor instance', async ({ rhelPage, mocker }) => {
    await mocker.mockInstances(RHEL_PRODUCT, {
      data: hypervisorInstanceFixture as InstancesData
    });
    await mocker.mockTally(RHEL_PRODUCT, RHEL_METRIC);
    await mocker.mockCapacity(RHEL_PRODUCT);

    await rhelPage.goto();
    await rhelPage.navigateToInstances();

    await rhelPage.expectInstanceVisible('test-hypervisor.example.com');
    await rhelPage.expectGuestCountVisible(150);
  });

  /*
   * ============================================
   * Edge Case Tests
   * ============================================
   */

  test('shows empty state when no instances', async ({ rhelPage, mocker }) => {
    // Mock empty response
    await mocker.mockEmptyInstances(RHEL_PRODUCT);
    await mocker.mockEmptyTally(RHEL_PRODUCT, RHEL_METRIC);
    await mocker.mockCapacity(RHEL_PRODUCT, {
      data: { data: [], meta: { count: 0, product: RHEL_PRODUCT } }
    });

    await rhelPage.goto();

    // Should show empty state message
    await rhelPage.waitForEmptyState();
  });

  test('chart handles data spike correctly', async ({ rhelPage, mocker, chartUtils }) => {
    // Mock tally with spike on day 15
    await mocker.mockInstances(RHEL_PRODUCT);
    await mocker.mockTallyWithSpike(RHEL_PRODUCT, RHEL_METRIC, {
      spikeDay: 4,
      spikeValue: 1000,
      baseValue: 100,
      days: 8
    });
    await mocker.mockCapacity(RHEL_PRODUCT);

    await rhelPage.goto();
    await chartUtils.waitForChart();

    // Verify Y-axis scales to accommodate spike
    const yValues = await chartUtils.getYAxisValues();
    expect(Math.max(...yValues)).toBeGreaterThanOrEqual(1000);
  });

  test('chart handles data gaps correctly', async ({ rhelPage, mocker, chartUtils }) => {
    // Mock tally with gaps on days 3, 4, 5
    await mocker.mockInstances(RHEL_PRODUCT);
    await mocker.mockTallyWithGaps(RHEL_PRODUCT, RHEL_METRIC, {
      gapDays: [3, 4, 5],
      baseValue: 100,
      days: 8
    });
    await mocker.mockCapacity(RHEL_PRODUCT);

    await rhelPage.goto();
    await chartUtils.waitForChart();

    // Chart should still render (just with gaps)
    await chartUtils.assertHasData();
  });

  test('handles API error gracefully', async ({ rhelPage, mocker }) => {
    // Mock error response
    await mocker.mockError('**/api/rhsm-subscriptions/**', 500, 'Service Unavailable');

    await rhelPage.goto();

    // Should show error message
    await rhelPage.waitForError();
  });

  test('shows loading state with slow API', async ({ rhelPage, mocker }) => {
    let releaseResponses!: () => void;
    const waitForRelease = new Promise<void>(resolve => {
      releaseResponses = resolve;
    });

    await mocker.mockInstances(RHEL_PRODUCT, { waitForRelease });
    await mocker.mockTally(RHEL_PRODUCT, RHEL_METRIC, { waitForRelease });
    await mocker.mockCapacity(RHEL_PRODUCT, { waitForRelease });

    try {
      await rhelPage.goto();
      await rhelPage.waitForLoading();
    } finally {
      releaseResponses();
    }

    await rhelPage.waitForLoadingToFinish();
  });

  /*
   * ============================================
   * Large Dataset Tests
   * ============================================
   */

  test('handles large dataset (1000 instances)', async ({ rhelPage, mocker }) => {
    // Mock 1000 instances
    await mocker.mockLargeInstancesDataset(RHEL_PRODUCT, 1000);
    await mocker.mockTally(RHEL_PRODUCT, RHEL_METRIC);
    await mocker.mockCapacity(RHEL_PRODUCT);

    await rhelPage.goto();

    // Click instances tab
    await rhelPage.navigateToInstances();

    // Should show pagination
    await rhelPage.expectPaginationRange(/1\s*-\s*100 of 1000|1\s*-\s*20 of 1000/);

    // The next page must update both the range and the returned rows.
    expect(await rhelPage.goToNextPage()).toBe(true);
    const nextRange = await rhelPage.getPaginationRangeText();
    expect(nextRange).toMatch(/101\s*-\s*200 of 1000|21\s*-\s*40 of 1000/);

    const firstHostOnNextPage = nextRange.startsWith('101') ? 'host-100.example.com' : 'host-20.example.com';
    await rhelPage.expectInstanceVisible(firstHostOnNextPage);
  });

  /*
   * ============================================
   * Interaction Tests
   * ============================================
   */

  test('tooltip shows on chart hover', async ({ rhelPage, mocker, chartUtils }) => {
    await mocker.mockInstances(RHEL_PRODUCT);
    await mocker.mockTally(RHEL_PRODUCT, RHEL_METRIC);
    await mocker.mockCapacity(RHEL_PRODUCT);
    await rhelPage.goto();
    await chartUtils.waitForChart();

    // Hover over first data point
    await chartUtils.hoverDataPoint(0);

    // Tooltip should appear
    await expect(rhelPage.chartTooltip).toBeVisible({ timeout: 2000 });
  });

  test('renders usage values below the mocked capacity threshold', async ({ rhelPage, mocker, chartUtils }) => {
    await mocker.mockInstances(RHEL_PRODUCT);
    await mocker.mockTally(RHEL_PRODUCT, RHEL_METRIC, { data: underCapacityTallyFixture });
    await mocker.mockCapacity(RHEL_PRODUCT);
    await rhelPage.goto();
    await chartUtils.waitForChart();

    const dataPoints = await chartUtils.getAllDataValuesBySweep();
    const dailyUsage = dataPoints.map(({ date, categories }) => {
      const entries = Object.entries(categories);
      const capacity = entries.find(([category]) => /threshold/i.test(category));
      const usage = entries
        .filter(([category]) => !/threshold/i.test(category))
        .reduce((total, [, value]) => total + value, 0);

      return { date, usage, capacity: capacity?.[1] };
    });

    expect(dailyUsage).not.toHaveLength(0);
    dailyUsage.forEach(({ date, usage, capacity }) => {
      expect(capacity, `Expected capacity data for ${date}`).toBeDefined();
      expect(usage, `Expected usage data for ${date}`).toBeGreaterThan(0);
      expect(usage, `Total category usage on ${date} should remain below capacity`).toBeLessThan(capacity ?? 0);
    });
  });

  /*
   * ============================================
   * Complete Scenario Tests
   * ============================================
   */

  test('complete populated scenario', async ({ rhelPage, mocker, chartUtils }) => {
    // Mock all APIs for a complete scenario
    await mocker.mockCompleteScenario(RHEL_PRODUCT, 'populated');

    await rhelPage.goto();

    // Verify chart
    await chartUtils.waitForChart();
    await chartUtils.assertHasData();

    // Verify instances
    await rhelPage.navigateToInstances();
    await expect(rhelPage.instanceRows).toHaveCount(3);
  });

  test('complete empty scenario', async ({ rhelPage, mocker }) => {
    // Mock all APIs for empty scenario
    await mocker.mockCompleteScenario(RHEL_PRODUCT, 'empty');

    await rhelPage.goto();

    // Should show empty state
    await rhelPage.waitForEmptyState();
  });
});
