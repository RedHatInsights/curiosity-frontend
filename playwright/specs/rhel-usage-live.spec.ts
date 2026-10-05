import { disableCookiePrompt } from '@redhat-cloud-services/playwright-test-auth';
import { test, expect } from '../helpers/test-fixtures';
import { RHEL_METRIC, RHEL_PRODUCT } from '../pages/rhel-page';

test.beforeEach(async ({ page }) => {
  await disableCookiePrompt(page);
});

test.describe('RHEL usage live integration @live', () => {
  test('displays real Stage instances', async ({ rhelPage }) => {
    await rhelPage.goto();
    await rhelPage.navigateToInstances();
    await rhelPage.waitForInstances(20000);

    expect(await rhelPage.getInstanceCount()).toBeGreaterThan(0);
  });

  test('renders real Stage chart data', async ({ rhelPage, chartUtils }) => {
    await rhelPage.goto();
    await chartUtils.waitForChart();
    await chartUtils.assertHasData();

    expect(await chartUtils.getYAxisMaxValue()).toBeGreaterThan(0);
    expect(await chartUtils.getXAxisDateRange()).not.toHaveLength(0);
  });

  test('renders a chart axis that covers the Stage API response', async ({ page, rhelPage, chartUtils }) => {
    const tallyPath = `/api/rhsm-subscriptions/v1/tally/products/${encodeURIComponent(RHEL_PRODUCT)}/${encodeURIComponent(RHEL_METRIC)}`;
    const tallyResponsePromise = page.waitForResponse(response => {
      const url = new URL(response.url());
      return url.pathname === tallyPath && response.ok();
    });

    await rhelPage.goto();
    const tallyResponse = await tallyResponsePromise;
    const payload = (await tallyResponse.json()) as {
      data?: Array<{ value?: number; has_data?: boolean }>;
    };
    const apiValues = (payload.data ?? [])
      .filter(item => item.has_data !== false && typeof item.value === 'number' && Number.isFinite(item.value))
      .map(item => item.value as number);

    expect(apiValues).not.toHaveLength(0);

    await chartUtils.waitForChart();
    await chartUtils.assertHasData();
    expect(await chartUtils.getYAxisMaxValue()).toBeGreaterThanOrEqual(Math.max(...apiValues));
    expect(await chartUtils.getXAxisDateRange()).not.toHaveLength(0);
  });

  test('shows real Stage data in the chart tooltip', async ({ rhelPage, chartUtils }) => {
    await rhelPage.goto();
    await chartUtils.waitForChart();
    await chartUtils.hoverDataPoint(0);

    await expect(rhelPage.chartTooltip).toBeVisible({ timeout: 2000 });
    const tooltipData = await chartUtils.getTooltipData();

    expect(tooltipData?.date).toBeTruthy();
    expect(Object.keys(tooltipData?.categories ?? {})).not.toHaveLength(0);
  });

  test('paginates real Stage instances when multiple pages exist', async ({ rhelPage }) => {
    await rhelPage.goto();
    await rhelPage.navigateToInstances();
    await rhelPage.waitForInstances(20000);

    const paginationAvailable =
      (await rhelPage.nextPageButton.isVisible()) && (await rhelPage.nextPageButton.isEnabled());
    test.skip(!paginationAvailable, 'Current Stage data contains only one page of instances.');

    const initialRange = await rhelPage.getPaginationRangeText();
    expect(await rhelPage.goToNextPage()).toBeTruthy();
    expect(await rhelPage.getPaginationRangeText()).not.toBe(initialRange);
  });
});
