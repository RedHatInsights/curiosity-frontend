import { disableCookiePrompt } from '@redhat-cloud-services/playwright-test-auth';
import { test, expect } from '../helpers/test-fixtures';
import { RHEL_METRIC, RHEL_PRODUCT } from '../pages/rhel-page';

test.beforeEach(async ({ page }) => {
  await disableCookiePrompt(page);
});

test.describe('RHEL usage visual regression', () => {
  test('renders a stable chart baseline', async ({ rhelPage, mocker, chartUtils }) => {
    await mocker.mockInstances(RHEL_PRODUCT);
    await mocker.mockTally(RHEL_PRODUCT, RHEL_METRIC, {
      data: {
        data: Array.from({ length: 30 }, (_, index) => ({
          date: new Date(Date.UTC(2026, 3, index + 1)).toISOString(),
          value: 100 + Math.sin(index / 7) * 20,
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
    await mocker.mockCapacity(RHEL_PRODUCT);

    await rhelPage.goto();
    await chartUtils.waitForChartStable();

    await expect(rhelPage.chartArea).toHaveScreenshot('stage-rhel-chart-baseline.png', {
      maxDiffPixels: 100,
      threshold: 0.2,
      animations: 'disabled'
    });
  });
});
