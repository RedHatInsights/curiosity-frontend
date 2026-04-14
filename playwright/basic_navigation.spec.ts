import { test, expect } from '@playwright/test';

const RH_STAGE_PASSWORD = process.env.RH_STAGE_PASSWORD;


test('Navigate to RHEL for x86', async ({ page }) => {

  await page.route('https://console.stage.redhat.com/api/rhsm-subscriptions/v1/instances/products/RHEL%20for%20x86?*', async route => {
    const json =
      {
        "data":[{"id":"fdf1ed33-ed61-4acb-8d57-e3c5b79fd0d4","instance_id":"d7bd052f-3ba6-46fd-9ef8-ba84b4a1976e","display_name":"physical_1f50f4e3zxifxjpk.example.dev","measurements":[4.0],"last_seen":"2026-04-08T11:45:41.088467Z","number_of_guests":0,"category":"physical","subscription_manager_id":"d8e38990-4c30-4792-8012-e705ba8db1f8","inventory_id":"d7bd052f-3ba6-46fd-9ef8-ba84b4a1976e"},{"id":"9760babb-8cb7-4d7b-a729-a9c3f5a99bc9","instance_id":"bde3f04e-de7b-4327-8a16-cfeaba61b4c0","display_name":"physical_d3d85d36rizjgqbv.example.gov","measurements":[2.0],"last_seen":"2026-04-08T11:45:41.086609Z","number_of_guests":0,"category":"physical","subscription_manager_id":"53ee6c45-724d-474b-be0e-51e919bb8a18","inventory_id":"bde3f04e-de7b-4327-8a16-cfeaba61b4c0"}],
        "links": {
          "first": "/api/rhsm-subscriptions/v1/instances/products/RHEL%20for%20x86?dir=desc&ending=2026-04-08T23:59:59.999Z&limit=100&metric_id=Sockets&sort=last_seen&beginning=2026-03-09T00:00:00.000Z&offset=0",
          "last": "/api/rhsm-subscriptions/v1/instances/products/RHEL%20for%20x86?dir=desc&ending=2026-04-08T23:59:59.999Z&limit=100&metric_id=Sockets&sort=last_seen&beginning=2026-03-09T00:00:00.000Z&offset=0"
        },
        "meta":{"count":2,"product":"RHEL for x86","measurements":["Sockets"]}
      };
    await route.fulfill({ json });
  });

  await page.goto('https://console.stage.redhat.com/subscriptions/usage/rhel');
  await expect(page.getByRole('textbox', { name: 'Red Hat login' })).toBeVisible({ timeout: 20000 })

  // Cookie banner
  await page.locator('iframe[name="trustarc_cm"]').contentFrame().getByRole('button', { name: 'Proceed with Required Cookies' }).click();
  await page.reload();
  await expect(page.getByRole('textbox', { name: 'Red Hat login' })).toBeVisible({ timeout: 20000 });

  await page.getByRole('textbox', { name: 'Red Hat login' }).fill('curiosity-automation-user');
  await page.getByRole('button', { name: 'Next' }).click();

  await expect(page.getByRole('textbox', { name: 'Password' })).toBeVisible({timeout: 20000});
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill(String(RH_STAGE_PASSWORD));

  await page.getByRole('button', { name: 'Log in' }).click();

  await expect(page.getByRole('heading', { name: 'Red Hat Enterprise Linux' })).toBeVisible();
  await expect(page.locator('[data-test="graphStandalone"]')).toBeVisible();

  await expect(page.getByRole('tab', { name: 'Current instances' })).toHaveAttribute('aria-selected', 'true');
  await page.pause();


});

test('Mock instances table for RHEL for x86', async ({ page }) => {

  await page.route('https://console.stage.redhat.com/api/rhsm-subscriptions/v1/instances/products/RHEL%20for%20x86?*', async route => {
    const json =
      {
        "data":[{"id":"fdf1ed33-ed61-4acb-8d57-e3c5b79fd0d4","instance_id":"d7bd052f-3ba6-46fd-9ef8-ba84b4a1976e","display_name":"physical_1f50f4e3zxifxjpk.example.dev","measurements":[4.0],"last_seen":"2026-04-08T11:45:41.088467Z","number_of_guests":0,"category":"physical","subscription_manager_id":"d8e38990-4c30-4792-8012-e705ba8db1f8","inventory_id":"d7bd052f-3ba6-46fd-9ef8-ba84b4a1976e"},{"id":"9760babb-8cb7-4d7b-a729-a9c3f5a99bc9","instance_id":"bde3f04e-de7b-4327-8a16-cfeaba61b4c0","display_name":"physical_d3d85d36rizjgqbv.example.gov","measurements":[2.0],"last_seen":"2026-04-08T11:45:41.086609Z","number_of_guests":0,"category":"physical","subscription_manager_id":"53ee6c45-724d-474b-be0e-51e919bb8a18","inventory_id":"bde3f04e-de7b-4327-8a16-cfeaba61b4c0"}],
        "links": {
          "first": "/api/rhsm-subscriptions/v1/instances/products/RHEL%20for%20x86?dir=desc&ending=2026-04-08T23:59:59.999Z&limit=100&metric_id=Sockets&sort=last_seen&beginning=2026-03-09T00:00:00.000Z&offset=0",
          "last": "/api/rhsm-subscriptions/v1/instances/products/RHEL%20for%20x86?dir=desc&ending=2026-04-08T23:59:59.999Z&limit=100&metric_id=Sockets&sort=last_seen&beginning=2026-03-09T00:00:00.000Z&offset=0"
        },
        "meta":{"count":2,"product":"RHEL for x86","measurements":["Sockets"]}
      };
    await route.fulfill({ json });
  });

  await page.goto('https://console.stage.redhat.com/subscriptions/usage/rhel');
  await expect(page.getByRole('textbox', { name: 'Red Hat login' })).toBeVisible({ timeout: 20000 })

  // Cookie banner
  await page.locator('iframe[name="trustarc_cm"]').contentFrame().getByRole('button', { name: 'Proceed with Required Cookies' }).click();
  await page.reload();
  await expect(page.getByRole('textbox', { name: 'Red Hat login' })).toBeVisible({ timeout: 20000 });

  await page.getByRole('textbox', { name: 'Red Hat login' }).fill('curiosity-automation-user');
  await page.getByRole('button', { name: 'Next' }).click();

  await expect(page.getByRole('textbox', { name: 'Password' })).toBeVisible({timeout: 20000});
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill(String(RH_STAGE_PASSWORD));

  await page.getByRole('button', { name: 'Log in' }).click();

  await expect(page.getByRole('heading', { name: 'Red Hat Enterprise Linux' })).toBeVisible();
  await expect(page.locator('[data-test="graphStandalone"]')).toBeVisible();

  await expect(page.getByRole('tab', { name: 'Current instances' })).toHaveAttribute('aria-selected', 'true');
  await page.pause();

  await page.getByRole('link', { name: 'physical_1f50f4e3zxifxjpk.' })

});
