/**
 * RHSM API Mocker for Playwright Tests
 *
 * Provides easy mocking of RHSM subscription APIs using Playwright's page.route()
 *
 * Usage:
 *   const mocker = new RhsmMocker(page);
 *   await mocker.mockInstances('RHEL for x86');
 *   await mocker.mockTally('RHEL for x86', 'Sockets');
 */

import { type Page, type Route } from '@playwright/test';
import type { CapacityData, InstancesData, SubscriptionsData, TallyGraphData, TallyGraphDataTemplate } from './types';

// Import fixtures (will create these next)
import instancesFixture from '../fixtures/instances.json';
import tallyFixture from '../fixtures/tally.json';
import capacityFixture from '../fixtures/capacity.json';

type RouteMatcher = Parameters<Page['route']>[0];
type RouteHandler = Parameters<Page['route']>[1];

const MILLISECONDS_PER_DAY = 24 * 60 * 60 * 1000;

const generateRecentDailyDates = (days: number): string[] => {
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  return Array(days)
    .fill(null)
    .map((_, i) => {
      const date = new Date(today);
      date.setUTCDate(today.getUTCDate() - days + i + 1);
      return date.toISOString();
    });
};

const generateDailyDatesFromRequest = (requestUrl: string): string[] | undefined => {
  const request = new URL(requestUrl);
  const beginning = request.searchParams.get('beginning');
  const ending = request.searchParams.get('ending');
  if (!beginning || !ending) {
    return undefined;
  }

  const startDate = new Date(beginning);
  const endDate = new Date(ending);
  if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
    return undefined;
  }

  startDate.setUTCHours(0, 0, 0, 0);
  endDate.setUTCHours(0, 0, 0, 0);
  const dayCount = Math.floor((endDate.getTime() - startDate.getTime()) / MILLISECONDS_PER_DAY) + 1;
  if (dayCount < 1) {
    return undefined;
  }

  return Array.from({ length: dayCount }, (_, i) => {
    const date = new Date(startDate);
    date.setUTCDate(startDate.getUTCDate() + i);
    return date.toISOString();
  });
};

const hasTallyDates = (data: TallyGraphData | TallyGraphDataTemplate): data is TallyGraphData =>
  data.data.length === 0 || 'date' in data.data[0];

const createTallyResponse = (
  data: TallyGraphData | TallyGraphDataTemplate,
  requestUrl: string,
  productId: string,
  metricId: string
): TallyGraphData => {
  if (hasTallyDates(data)) {
    return data;
  }

  const request = new URL(requestUrl);
  const dates = generateDailyDatesFromRequest(requestUrl) ?? generateRecentDailyDates(data.data.length);
  const points = dates.map((date, i) => ({
    ...data.data[i % data.data.length],
    date
  }));

  return {
    ...data,
    data: points,
    meta: {
      ...data.meta,
      count: points.length,
      product: productId,
      granularity: request.searchParams.get('granularity') ?? data.meta?.granularity ?? 'daily',
      metric_id: metricId
    }
  };
};

export interface MockOptions<TData extends object = object> {
  statusCode?: number;
  delay?: number;
  data?: TData;
  waitForRelease?: Promise<void>;
}

export interface TallyMockOptions extends MockOptions<TallyGraphData | TallyGraphDataTemplate> {
  category?: 'physical' | 'virtual' | 'hypervisor' | 'cloud';
  granularity?: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
}

export interface CapacityMockOptions extends MockOptions<CapacityData> {
  granularity?: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
}

export class RhsmMocker {
  private readonly rhsmRoutes: Array<{ matcher: RouteMatcher; handler: RouteHandler }> = [];

  constructor(private page: Page) {}

  /**
   * Mock instances/inventory API
   *
   * @example
   * await mocker.mockInstances('RHEL for x86');
   * await mocker.mockInstances('RHEL for x86', { data: customData });
   * await mocker.mockInstances('RHEL for x86', { statusCode: 500 });
   */
  async mockInstances(productId: string, options: MockOptions<InstancesData> = {}) {
    const { statusCode = 200, delay = 0, data = instancesFixture, waitForRelease } = options;

    const path = this.instancesPath(productId);

    await this.registerRoute(
      url => url.pathname === path,
      async (route: Route) => {
        await this.fulfill(route, statusCode, data, delay, waitForRelease);
      }
    );
  }

  /**
   * Mock tally/graph API
   *
   * @example
   * await mocker.mockTally('RHEL for x86', 'Sockets');
   * await mocker.mockTally('RHEL for x86', 'Cores', { granularity: 'monthly' });
   * await mocker.mockTally('RHEL for x86', 'Sockets', { category: 'physical', granularity: 'daily' });
   */
  async mockTally(productId: string, metricId: string = 'Sockets', options: TallyMockOptions = {}) {
    const { statusCode = 200, delay = 0, data, category, granularity, waitForRelease } = options;

    await this.registerRoute(
      url => {
        const path = `/api/rhsm-subscriptions/v1/tally/products/${this.encodeProduct(productId)}/${encodeURIComponent(metricId)}`;
        if (url.pathname !== path) {
          return false;
        }

        // Match query parameters if specified
        if (category && url.searchParams.get('category') !== category) {
          return false;
        }

        if (granularity && url.searchParams.get('granularity') !== granularity) {
          return false;
        }

        return true;
      },
      async (route: Route) => {
        const responseData = createTallyResponse(data ?? tallyFixture, route.request().url(), productId, metricId);
        await this.fulfill(route, statusCode, responseData, delay, waitForRelease);
      }
    );
  }

  /**
   * Mock capacity API
   *
   * @example
   * await mocker.mockCapacity('RHEL for x86');
   * await mocker.mockCapacity('RHEL for x86', { granularity: 'monthly' });
   */
  async mockCapacity(productId: string, options: CapacityMockOptions = {}) {
    const { statusCode = 200, delay = 0, data = capacityFixture, granularity, waitForRelease } = options;

    await this.registerRoute(
      url => {
        const basePath = `/api/rhsm-subscriptions/v1/capacity/products/${this.encodeProduct(productId)}`;
        if (!url.pathname.startsWith(`${basePath}/`)) {
          return false;
        }

        // Match query parameters if specified
        if (granularity && url.searchParams.get('granularity') !== granularity) {
          return false;
        }

        return true;
      },
      async (route: Route) => {
        await this.fulfill(route, statusCode, data, delay, waitForRelease);
      }
    );
  }

  /**
   * Mock subscriptions API
   */
  async mockSubscriptions(productId: string, options: MockOptions<SubscriptionsData> = {}) {
    const { statusCode = 200, delay = 0, data = { data: [], meta: { count: 0 } }, waitForRelease } = options;

    const path = `/api/rhsm-subscriptions/v2/subscriptions/products/${this.encodeProduct(productId)}`;

    await this.registerRoute(
      url => url.pathname === path,
      async (route: Route) => {
        await this.fulfill(route, statusCode, data, delay, waitForRelease);
      }
    );
  }

  /*
   * ============================================
   * Convenience Methods (Common Scenarios)
   * ============================================
   */

  /**
   * Mock empty instances response
   *
   * @example
   * await mocker.mockEmptyInstances('RHEL for x86');
   */
  async mockEmptyInstances(productId: string) {
    await this.mockInstances(productId, {
      data: {
        data: [],
        meta: { count: 0, product: productId, measurements: [] },
        links: { first: '', last: '' }
      }
    });
  }

  /**
   * Mock empty tally response
   */
  async mockEmptyTally(productId: string, metricId: string = 'Sockets') {
    await this.mockTally(productId, metricId, {
      data: {
        data: [],
        meta: { count: 0, product: productId, granularity: 'daily', metric_id: metricId },
        links: { first: '', last: '' }
      }
    });
  }

  /**
   * Mock API error response
   *
   * Pattern should be a glob matching the RHSM subscriptions API URL.
   *
   * @param pattern - URL pattern to match
   * @param statusCode - HTTP status code (default: 500)
   * @param message - Error message (default: 'Internal Server Error')
   */
  async mockError(pattern: string, statusCode: number = 500, message: string = 'Internal Server Error') {
    await this.registerRoute(pattern, async (route: Route) => {
      await this.fulfill(route, statusCode, {
        errors: [
          {
            status: String(statusCode),
            code: `SUBSCRIPTIONS${statusCode}`,
            title: message,
            detail: message
          }
        ]
      });
    });
  }

  /**
   * Return a controlled response after a delay.
   *
   * @param pattern - URL pattern to match
   * @param delay - Delay in milliseconds (default: 5000)
   * @param data - JSON response body (default: an empty API response)
   */
  async mockSlowApi(pattern: string, delay: number = 5000, data: object = { data: [], meta: { count: 0 } }) {
    await this.registerRoute(pattern, async route => {
      await this.fulfill(route, 200, data, delay);
    });
  }

  /**
   * Mock large instances dataset (for performance testing)
   *
   * @example
   * await mocker.mockLargeInstancesDataset('RHEL for x86', 1000);
   */
  async mockLargeInstancesDataset(productId: string, count: number = 1000) {
    if (!Number.isInteger(count) || count < 0) {
      throw new RangeError('The mocked instance count must be a non-negative integer.');
    }

    const instances = Array.from({ length: count }, (_, i) => ({
      id: `instance-${i}`,
      instance_id: `uuid-${i}`,
      display_name: `host-${i}.example.com`,
      measurements: [(i % 16) + 1],
      last_seen: '2026-04-08T12:00:00.000Z',
      number_of_guests: i % 10,
      category: ['physical', 'virtual', 'cloud'][i % 3] as 'physical' | 'virtual' | 'cloud',
      subscription_manager_id: `sm-${i}`,
      inventory_id: `inv-${i}`
    }));

    const path = this.instancesPath(productId);
    await this.registerRoute(
      url => url.pathname === path,
      async (route: Route) => {
        const offset = this.queryInteger(route.request().url(), 'offset', 0);
        const limit = this.queryInteger(route.request().url(), 'limit', instances.length) || instances.length;
        const response: InstancesData = {
          data: instances.slice(offset, offset + limit),
          links: { first: '', last: '' },
          meta: {
            count: instances.length,
            product: productId,
            measurements: ['Sockets']
          }
        };

        await this.fulfill(route, 200, response);
      }
    );
  }

  /**
   * Mock tally data with spike (for testing chart edge cases)
   *
   * @example
   * await mocker.mockTallyWithSpike('RHEL for x86', 'Sockets', { spikeDay: 15, spikeValue: 1000 });
   */
  async mockTallyWithSpike(
    productId: string,
    metricId: string = 'Sockets',
    { spikeDay = 15, spikeValue = 1000, baseValue = 100, days = 30 } = {}
  ) {
    const data = generateRecentDailyDates(days).map((date, i) => {
      return {
        date,
        value: i === spikeDay ? spikeValue : baseValue,
        has_data: true
      };
    });

    await this.mockTally(productId, metricId, {
      data: {
        data,
        meta: {
          count: data.length,
          product: productId,
          granularity: 'daily',
          metric_id: metricId
        }
      }
    });
  }

  /**
   * Mock tally data with gaps (has_data: false)
   *
   * @example
   * await mocker.mockTallyWithGaps('RHEL for x86', 'Sockets', { gapDays: [5, 6, 7] });
   */
  async mockTallyWithGaps(
    productId: string,
    metricId: string = 'Sockets',
    { gapDays = [5, 6, 7], baseValue = 100, days = 30 } = {}
  ) {
    const data = generateRecentDailyDates(days).map((date, i) => {
      return {
        date,
        value: gapDays.includes(i) ? 0 : baseValue,
        has_data: !gapDays.includes(i)
      };
    });

    await this.mockTally(productId, metricId, {
      data: {
        data,
        meta: {
          count: data.length,
          product: productId,
          granularity: 'daily',
          metric_id: metricId
        }
      }
    });
  }

  /**
   * Mock complete scenario (instances + tally + capacity)
   *
   * @example
   * await mocker.mockCompleteScenario('RHEL for x86', 'populated');
   * await mocker.mockCompleteScenario('RHEL for x86', 'empty');
   * await mocker.mockCompleteScenario('RHEL for x86', 'error');
   */
  async mockCompleteScenario(productId: string, scenario: 'empty' | 'populated' | 'error' = 'populated') {
    switch (scenario) {
      case 'empty':
        await this.mockEmptyInstances(productId);
        await this.mockEmptyTally(productId, 'Sockets');
        await this.mockCapacity(productId, {
          data: { data: [], meta: { count: 0, product: productId } }
        });
        break;

      case 'error':
        await this.mockError('**/api/rhsm-subscriptions/**', 500);
        break;

      case 'populated':
      default:
        await this.mockInstances(productId);
        await this.mockTally(productId, 'Sockets');
        await this.mockCapacity(productId);
        break;
    }
  }

  /**
   * Remove all mocks (passthrough to real API)
   *
   * @example
   * await mocker.passthroughAll();
   */
  async passthroughAll() {
    const rhsmRoutes = this.rhsmRoutes.splice(0);
    await Promise.all(rhsmRoutes.map(({ matcher, handler }) => this.page.unroute(matcher, handler)));
  }

  /*
   * ============================================
   * Helper Methods
   * ============================================
   */

  private async registerRoute(matcher: RouteMatcher, handler: RouteHandler): Promise<void> {
    await this.page.route(matcher, handler);
    this.rhsmRoutes.push({ matcher, handler });
  }

  private encodeProduct(productId: string): string {
    return encodeURIComponent(productId);
  }

  private instancesPath(productId: string): string {
    return `/api/rhsm-subscriptions/v1/instances/products/${this.encodeProduct(productId)}`;
  }

  private queryInteger(url: string, name: string, fallback: number): number {
    const value = Number.parseInt(new URL(url).searchParams.get(name) ?? '', 10);
    return Number.isInteger(value) && value >= 0 ? value : fallback;
  }

  private async fulfill(
    route: Route,
    statusCode: number,
    data: object,
    delay: number = 0,
    waitForRelease?: Promise<void>
  ): Promise<void> {
    if (waitForRelease) {
      await waitForRelease;
    }

    if (delay > 0) {
      await new Promise(resolve => {
        globalThis.setTimeout(resolve, delay);
      });
    }

    const body = JSON.stringify(data);
    if (body === undefined) {
      throw new TypeError('Mock response data must be JSON serializable.');
    }

    await route.fulfill({
      status: statusCode,
      contentType: 'application/json',
      body,
      headers: {
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
}
