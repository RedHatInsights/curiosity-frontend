import { test, expect } from './helpers/test-fixtures';
import { RHEL_METRIC, RHEL_PRODUCT } from './pages/rhel-page';

test.describe('RHEL navigation', () => {
  test('navigates to RHEL for x86', async ({ rhelPage, mocker }) => {
    await mocker.mockInstances(RHEL_PRODUCT);
    await mocker.mockTally(RHEL_PRODUCT, RHEL_METRIC);

    await rhelPage.goto();

    await expect(rhelPage.heading).toBeVisible();
    await expect(rhelPage.chart).toBeVisible();
    await expect(rhelPage.currentInstancesTab).toHaveAttribute('aria-selected', 'true');
  });

  test('displays mocked RHEL for x86 instances', async ({ rhelPage, mocker }) => {
    await mocker.mockInstances(RHEL_PRODUCT);
    await mocker.mockTally(RHEL_PRODUCT, RHEL_METRIC);

    await rhelPage.goto();
    await rhelPage.navigateToInstances();
    await rhelPage.waitForInstances();

    await rhelPage.expectInstanceVisible('physical_1f50f4e3zxifxjpk.example.dev');
  });
});
