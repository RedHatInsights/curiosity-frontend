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

import { Page, Route } from '@playwright/test';
import type {
  InstancesData,
  TallyGraphData,
  CapacityData
} from './types';

// Import fixtures (will create these next)
import instancesFixture from '../fixtures/instances.json';
import tallyFixture from '../fixtures/tally.json';
import capacityFixture from '../fixtures/capacity.json';

export interface MockOptions {
  statusCode?: number;
  delay?: number;
  data?: any;
}

export interface TallyMockOptions extends MockOptions {
  category?: string; // 'physical', 'virtual', 'hypervisor', 'cloud'
  granularity?: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
}

export interface CapacityMockOptions extends MockOptions {
  granularity?: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
}

export class RhsmMocker {
  constructor(private page: Page) {}

  /**
   * Mock instances/inventory API
   *
   * @example
   * await mocker.mockInstances('RHEL for x86');
   * await mocker.mockInstances('RHEL for x86', { data: customData });
   * await mocker.mockInstances('RHEL for x86', { statusCode: 500 });
   */
  async mockInstances(productId: string, options: MockOptions = {}) {
    const {
      statusCode = 200,
      delay = 0,
      data = instancesFixture
    } = options;

    // Match any query params (metric_id, offset, etc.)
    const pattern = `**/api/rhsm-subscriptions/v1/instances/products/${this.encodeProduct(productId)}*`;

    await this.page.route(pattern, async (route: Route) => {
      console.log(`[Mock] Instances API called: ${route.request().url()}`);

      if (delay > 0) {
        await new Promise(resolve => setTimeout(resolve, delay));
      }

      await route.fulfill({
        status: statusCode,
        contentType: 'application/json',
        body: JSON.stringify(data),
        headers: {
          'Access-Control-Allow-Origin': '*'
        }
      });
    });
  }

  /**
   * Mock tally/graph API
   *
   * @example
   * await mocker.mockTally('RHEL for x86', 'Sockets');
   * await mocker.mockTally('RHEL for x86', 'Cores', { granularity: 'monthly' });
   * await mocker.mockTally('RHEL for x86', 'Sockets', { category: 'physical', granularity: 'daily' });
   */
  async mockTally(
    productId: string,
    metricId: string = 'Sockets',
    options: TallyMockOptions = {}
  ) {
    const {
      statusCode = 200,
      delay = 0,
      data = tallyFixture,
      category,
      granularity
    } = options;

    await this.page.route(
      (url) => {
        // Match base path
        const basePath = `/api/rhsm-subscriptions/v1/tally/products/${this.encodeProduct(productId)}/${metricId}`;
        if (!url.pathname.includes(basePath)) {
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
        console.log(`[Mock] Tally API called: ${route.request().url()}`);

        if (delay > 0) {
          await new Promise(resolve => setTimeout(resolve, delay));
        }

        await route.fulfill({
          status: statusCode,
          contentType: 'application/json',
          body: JSON.stringify(data),
          headers: {
            'Access-Control-Allow-Origin': '*'
          }
        });
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
    const {
      statusCode = 200,
      delay = 0,
      data = capacityFixture,
      granularity
    } = options;

    await this.page.route(
      (url) => {
        // Match base path
        const basePath = `/api/rhsm-subscriptions/v1/capacity/products/${this.encodeProduct(productId)}`;
        if (!url.pathname.includes(basePath)) {
          return false;
        }

        // Match query parameters if specified
        if (granularity && url.searchParams.get('granularity') !== granularity) {
          return false;
        }

        return true;
      },
      async (route: Route) => {
        console.log(`[Mock] Capacity API called: ${route.request().url()}`);

        if (delay > 0) {
          await new Promise(resolve => setTimeout(resolve, delay));
        }

        await route.fulfill({
          status: statusCode,
          contentType: 'application/json',
          body: JSON.stringify(data),
          headers: {
            'Access-Control-Allow-Origin': '*'
          }
        });
      }
    );
  }

  /**
   * Mock subscriptions API
   */
  async mockSubscriptions(options: MockOptions = {}) {
    const {
      statusCode = 200,
      delay = 0,
      data = { data: [], meta: { count: 0 } }
    } = options;

    const pattern = `**/api/rhsm-subscriptions/v1/subscriptions*`;

    await this.page.route(pattern, async (route: Route) => {
      console.log(`[Mock] Subscriptions API called: ${route.request().url()}`);

      if (delay > 0) {
        await new Promise(resolve => setTimeout(resolve, delay));
      }

      await route.fulfill({
        status: statusCode,
        contentType: 'application/json',
        body: JSON.stringify(data),
        headers: {
          'Access-Control-Allow-Origin': '*'
        }
      });
    });
  }

  // ============================================
  // Convenience Methods (Common Scenarios)
  // ============================================

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
   * Pattern should be a glob like: `*​*​/api/rhsm-subscriptions/*​*​`
   *
   * @param pattern - URL pattern to match
   * @param statusCode - HTTP status code (default: 500)
   * @param message - Error message (default: 'Internal Server Error')
   */
  async mockError(
    pattern: string,
    statusCode: number = 500,
    message: string = 'Internal Server Error'
  ) {
    await this.page.route(pattern, async (route: Route) => {
      console.log(`[Mock] Error response: ${statusCode} ${message}`);

      await route.fulfill({
        status: statusCode,
        contentType: 'application/json',
        body: JSON.stringify({
          errors: [
            {
              status: String(statusCode),
              code: `SUBSCRIPTIONS${statusCode}`,
              title: message,
              detail: message
            }
          ]
        }),
        headers: {
          'Access-Control-Allow-Origin': '*'
        }
      });
    });
  }

  /**
   * Mock slow API (for testing loading states)
   *
   * @param pattern - URL pattern to match
   * @param delay - Delay in milliseconds (default: 5000)
   */
  async mockSlowApi(pattern: string, delay: number = 5000) {
    await this.page.route(pattern, async (route: Route) => {
      console.log(`[Mock] Slow API (${delay}ms delay)`);

      await new Promise(resolve => setTimeout(resolve, delay));
      await route.continue();
    });
  }

  /**
   * Mock large instances dataset (for performance testing)
   *
   * @example
   * await mocker.mockLargeInstancesDataset('RHEL for x86', 1000);
   */
  async mockLargeInstancesDataset(productId: string, count: number = 1000) {
    const instances = Array(count).fill(null).map((_, i) => ({
      id: `instance-${i}`,
      instance_id: `uuid-${i}`,
      display_name: `host-${i}.example.com`,
      measurements: [Math.floor(Math.random() * 16)],
      last_seen: new Date().toISOString(),
      number_of_guests: Math.floor(Math.random() * 10),
      category: ['physical', 'virtual', 'cloud'][i % 3] as 'physical' | 'virtual' | 'cloud',
      subscription_manager_id: `sm-${i}`,
      inventory_id: `inv-${i}`
    }));

    await this.mockInstances(productId, {
      data: {
        data: instances,
        links: { first: '', last: '' },
        meta: {
          count: instances.length,
          product: productId,
          measurements: ['Sockets']
        }
      }
    });
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
    const data = Array(days).fill(null).map((_, i) => {
      const date = new Date('2026-04-01');
      date.setDate(date.getDate() + i);

      return {
        date: date.toISOString(),
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
    const data = Array(days).fill(null).map((_, i) => {
      const date = new Date('2026-04-01');
      date.setDate(date.getDate() + i);

      return {
        date: date.toISOString(),
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
  async mockCompleteScenario(
    productId: string,
    scenario: 'empty' | 'populated' | 'error' = 'populated'
  ) {
    switch (scenario) {
      case 'empty':
        await this.mockEmptyInstances(productId);
        await this.mockEmptyTally(productId, 'Sockets');
        await this.mockCapacity(productId, {
          data: { data: [], meta: {} }
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
    await this.page.unroute('**/api/rhsm-subscriptions/**');
  }

  // ============================================
  // Helper Methods
  // ============================================

  private encodeProduct(productId: string): string {
    return encodeURIComponent(productId);
  }
}