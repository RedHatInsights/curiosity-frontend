import { config } from '../product.rhacs';
import { generateChartSettings } from '../../components/graphCard/graphCardHelpers';
import { parseRowCellsListData } from '../../components/inventoryCard/inventoryCardHelpers';
import {
  RHSM_API_QUERY_INVENTORY_SORT_DIRECTION_TYPES as SORT_DIRECTION_TYPES,
  RHSM_API_RESPONSE_INSTANCES_DATA_TYPES as INVENTORY_TYPES,
  RHSM_API_RESPONSE_SUBSCRIPTIONS_DATA_TYPES as SUBSCRIPTIONS_INVENTORY_TYPES,
  RHSM_API_RESPONSE_SUBSCRIPTIONS_META_TYPES as SUBSCRIPTIONS_INVENTORY_META_TYPES,
  RHSM_API_QUERY_SET_TYPES,
  RHSM_API_PATH_METRIC_TYPES
} from '../../services/rhsm/rhsmConstants';

describe('Product RHACS config', () => {
  it('should apply graph configuration', () => {
    const { initialGraphFilters, initialGraphSettings } = config;

    expect(generateChartSettings({ filters: initialGraphFilters, settings: initialGraphSettings })).toMatchSnapshot(
      'filters'
    );
    expect(initialGraphSettings).toMatchSnapshot('settings');
  });

  it('should handle metric card display for graphs', () => {
    const { initialGraphFilters, initialGraphSettings } = config;
    const { filtersSettings } = generateChartSettings({ filters: initialGraphFilters, settings: initialGraphSettings });
    const cardOutput = [];

    filtersSettings.forEach(({ settings }) => {
      if (Array.isArray(settings.cards)) {
        settings.cards.forEach(({ header, body, footer }) => {
          if (typeof header === 'function') {
            cardOutput.push(header());
          } else {
            cardOutput.push(header);
          }

          if (typeof body === 'function') {
            cardOutput.push(body());
          } else {
            cardOutput.push(body);
          }

          if (typeof footer === 'function') {
            cardOutput.push(footer({ dailyDate: '09 Mar 2023', monthlyDate: '09 Mar 2023' }));
          } else {
            cardOutput.push(footer);
          }
        });
      }
    });

    expect(cardOutput).toMatchSnapshot('cards');
  });

  it('should handle a custom yAxisTickFormat for floating points', () => {
    const generateTicks = (method = config.initialGraphSettings.yAxisTickFormat) => {
      const ticks = {};

      for (let i = 0.00001345; i < 1; i++) {
        for (let k = 1; k < 26; k++) {
          const incrementMultiplier = k * i;
          ticks[incrementMultiplier] = method({ tick: incrementMultiplier });
        }
      }

      for (let i = 0.001; i < 1; i++) {
        for (let k = 1; k < 26; k++) {
          const incrementMultiplier = k * i;
          ticks[incrementMultiplier] = method({ tick: incrementMultiplier });
        }
      }

      for (let i = 0; i < 13; i++) {
        const multiplier = Math.pow(10, i);
        for (let k = 1; k < 16; k++) {
          const incrementMultiplier = k * multiplier;
          ticks[incrementMultiplier] = method({ tick: incrementMultiplier });
        }
      }
      return ticks;
    };

    expect(generateTicks()).toMatchSnapshot('yAxisTickFormat');
  });

  /**
   * FixMe: this test needs to be updated as part of the refactor towards instances vs hosts
   */
  it('should apply an inventory configuration', () => {
    const { initialInventoryFilters: initialFilters, inventoryHostsQuery: inventoryQuery } = config;

    const inventoryData = {
      [INVENTORY_TYPES.DISPLAY_NAME]: 'lorem ipsum',
      [RHSM_API_PATH_METRIC_TYPES.CORES]: 200,
      [INVENTORY_TYPES.LAST_SEEN]: '2022-01-01T00:00:00.000Z'
    };

    const filteredInventoryData = parseRowCellsListData({
      filters: initialFilters,
      cellData: inventoryData
    });

    expect(filteredInventoryData).toMatchSnapshot('filtered');

    const filteredInventoryDataAuthorized = parseRowCellsListData({
      filters: initialFilters,
      cellData: {
        ...inventoryData,
        [INVENTORY_TYPES.INSTANCE_ID]: 'XXXX-XXXX-XXXXX-XXXXX'
      },
      session: { authorized: { inventory: true } }
    });

    expect(filteredInventoryDataAuthorized).toMatchSnapshot('filtered, authorized');

    expect(inventoryQuery[RHSM_API_QUERY_SET_TYPES.DIRECTION] === SORT_DIRECTION_TYPES.DESCENDING).toBe(true);
  });

  it('should apply subscriptions inventory configuration', () => {
    const { initialSubscriptionsInventoryFilters: initialFilters, inventorySubscriptionsQuery: inventoryQuery } =
      config;

    const inventoryData = {
      [SUBSCRIPTIONS_INVENTORY_TYPES.PRODUCT_NAME]: 'lorem',
      [SUBSCRIPTIONS_INVENTORY_TYPES.SERVICE_LEVEL]: 'hello world',
      [SUBSCRIPTIONS_INVENTORY_TYPES.NEXT_EVENT_DATE]: '2022-01-01T00:00:00.000Z',
      [SUBSCRIPTIONS_INVENTORY_TYPES.TOTAL_CAPACITY]: 2000,
      [SUBSCRIPTIONS_INVENTORY_TYPES.HAS_INFINITE_QUANTITY]: true
    };

    const inventoryMeta = {
      [SUBSCRIPTIONS_INVENTORY_META_TYPES.SUBSCRIPTION_TYPE]: 'dolor'
    };

    const filteredInventoryData = parseRowCellsListData({
      filters: initialFilters,
      cellData: inventoryData,
      meta: inventoryMeta
    });

    expect(filteredInventoryData).toMatchSnapshot('filtered');

    const fallbackInventoryData = {
      ...inventoryData,
      [SUBSCRIPTIONS_INVENTORY_TYPES.SERVICE_LEVEL]: null,
      [SUBSCRIPTIONS_INVENTORY_TYPES.NEXT_EVENT_DATE]: null
    };

    const fallbackFilteredInventoryData = parseRowCellsListData({
      filters: initialFilters,
      cellData: fallbackInventoryData,
      meta: {}
    });

    expect(fallbackFilteredInventoryData).toMatchSnapshot('filtered, fallback display');

    expect(inventoryQuery[RHSM_API_QUERY_SET_TYPES.DIRECTION] === SORT_DIRECTION_TYPES.DESCENDING).toBe(true);
  });
});
