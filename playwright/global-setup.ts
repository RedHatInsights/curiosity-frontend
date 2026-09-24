import { mkdir } from 'node:fs/promises';
import { dirname } from 'node:path';

import { chromium } from 'playwright';
import type { FullConfig } from '@playwright/test';
import { disableCookiePrompt, login } from '@redhat-cloud-services/playwright-test-auth';

export default async function globalSetup(config: FullConfig): Promise<void> {
  const { storageState, baseURL, proxy } = config.projects[0].use;

  if (!storageState) {
    return;
  }

  if (typeof storageState !== 'string') {
    throw new Error('The Playwright storageState must be a file path for global setup.');
  }

  await mkdir(dirname(storageState), { recursive: true });

  // The published auth helper omits the proxy when it launches Chromium.
  const browser = await chromium.launch({ proxy });
  const context = await browser.newContext({
    baseURL,
    ignoreHTTPSErrors: true,
  });
  const page = await context.newPage();

  try {
    await disableCookiePrompt(page);
    await page.goto(baseURL || '/', { waitUntil: 'load', timeout: 60000 });

    const user = process.env.E2E_USER;
    const password = process.env.E2E_PASSWORD;
    if (!user || !password) {
      throw new Error('E2E_USER and E2E_PASSWORD environment variables must be set');
    }

    await page.waitForLoadState('load');
    await login(page, user, password);
    await context.storageState({ path: storageState });
    console.log('Authentication state saved successfully');
  } finally {
    await context.close();
    await browser.close();
  }
}
