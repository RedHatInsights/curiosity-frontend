import { config } from '../product.rhosak';
import { generateChartSettings } from '../../components/graphCard/graphCardHelpers';
import { parseRowCellsListData } from '../../components/inventoryCard/inventoryCardHelpers';
import {
  RHSM_API_QUERY_INVENTORY_SORT_DIRECTION_TYPES as SORT_DIRECTION_TYPES,
  RHSM_API_RESPONSE_INSTANCES_DATA_TYPES as INVENTORY_TYPES,
  RHSM_API_QUERY_SET_TYPES,
  RHSM_API_PATH_METRIC_TYPES
} from '../../services/rhsm/rhsmConstants';

describe('Product RHOSAK config', () => {
  it('should apply graph configuration', () => {
    const { initialGraphFilters, initialGraphSettings } = config;

    expect(generateChartSettings(initialGraphFilters)).toMatchSnapshot('filters');
    expect(initialGraphSettings).toMatchSnapshot('settings');
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
  it('should apply an instances inventory configuration under hosts', () => {
    const { initialInventoryFilters: initialFilters, inventoryHostsQuery: inventoryQuery } = config;

    const inventoryData = {
      [INVENTORY_TYPES.DISPLAY_NAME]: 'lorem ipsum',
      [RHSM_API_PATH_METRIC_TYPES.TRANSFER_GIBIBYTES]: 0.0003456,
      [RHSM_API_PATH_METRIC_TYPES.STORAGE_GIBIBYTES]: 1000.00123,
      [RHSM_API_PATH_METRIC_TYPES.INSTANCE_HOURS]: 200,
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
        [INVENTORY_TYPES.INVENTORY_ID]: 'XXXX-XXXX-XXXXX-XXXXX'
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
      productName: 'lorem',
      serviceLevel: 'hello world',
      nextEventDate: '2022-01-01T00:00:00.000Z'
    };

    const filteredInventoryData = parseRowCellsListData({
      filters: initialFilters,
      cellData: inventoryData
    });

    expect(filteredInventoryData).toMatchSnapshot('filtered');

    const fallbackInventoryData = {
      ...inventoryData,
      serviceLevel: null,
      nextEventDate: null
    };

    const fallbackFilteredInventoryData = parseRowCellsListData({
      filters: initialFilters,
      cellData: fallbackInventoryData
    });

    expect(fallbackFilteredInventoryData).toMatchSnapshot('filtered, fallback display');

    expect(inventoryQuery[RHSM_API_QUERY_SET_TYPES.DIRECTION] === SORT_DIRECTION_TYPES.DESCENDING).toBe(true);
  });
});
