import { test as base, expect } from '@playwright/test';

import { ChartUtils } from './chart-utils';
import { RhsmMocker } from './rhsm-mocks';
import { RHELPage } from '../pages/rhel-page';

type PlaywrightFixtures = {
  chartUtils: ChartUtils;
  mocker: RhsmMocker;
  rhelPage: RHELPage;
};

export const test = base.extend<PlaywrightFixtures>({
  chartUtils: async ({ page, rhelPage }, use) => {
    await use(new ChartUtils(page, rhelPage.chart));
  },
  mocker: async ({ page }, use) => {
    await use(new RhsmMocker(page));
  },
  rhelPage: async ({ page }, use) => {
    await use(new RHELPage(page));
  }
});

export { expect };
