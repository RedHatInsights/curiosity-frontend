import { config } from '../product.rosa';
import { generateChartSettings } from '../../components/graphCard/graphCardHelpers';
import { parseRowCellsListData } from '../../components/inventoryCard/inventoryCardHelpers';
import {
  RHSM_API_PATH_METRIC_TYPES,
  RHSM_API_QUERY_INVENTORY_SORT_DIRECTION_TYPES as SORT_DIRECTION_TYPES,
  RHSM_API_QUERY_SET_TYPES,
  RHSM_API_RESPONSE_INSTANCES_DATA_TYPES as INVENTORY_TYPES,
  RHSM_API_RESPONSE_SUBSCRIPTIONS_DATA_TYPES as SUBSCRIPTIONS_INVENTORY_TYPES
} from '../../services/rhsm/rhsmConstants';

describe('Product ROSA config', () => {
  it('should apply toolbar configuration', () => {
    const { initialToolbarFilters } = config;

    expect(initialToolbarFilters).toMatchSnapshot('filters');
  });

  it('should apply graph configuration', () => {
    const { initialGraphFilters, initialGraphSettings } = config;

    expect(
      generateChartSettings({
        filters: initialGraphFilters,
        settings: initialGraphSettings,
        productId: 'loremIpsumTest'
      })
    ).toMatchSnapshot('filters');
    expect(initialGraphSettings).toMatchSnapshot('settings');
  });

  it('should handle metric card display for graphs', () => {
    const { initialGraphFilters, initialGraphSettings } = config;
    const { filtersSettings } = generateChartSettings({
      filters: initialGraphFilters,
      settings: initialGraphSettings,
      productId: 'loremIpsumTest'
    });
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
            cardOutput.push(
              footer({
                dataSets: [
                  {
                    display: {
                      dailyDate: '09 Mar 2023',
                      monthlyDate: '09 Mar 2023'
                    }
                  }
                ]
              })
            );
          } else {
            cardOutput.push(footer);
          }
        });
      }
    });

    expect(cardOutput).toMatchSnapshot('cards');
  });

  it('should handle a custom axis settings', async () => {
    const axisMethod = method => (typeof method === 'function' && method()) || method;
    expect(axisMethod(config.initialGraphSettings.xAxisChartLabel)).toMatchSnapshot('xAxisChartLabel');

    const yAxisChartLabels = [];
    config.initialGraphFilters?.forEach(({ metric, yAxisChartLabel }) =>
      yAxisChartLabels.push({
        metric,
        yAxisChartLabel: axisMethod(yAxisChartLabel)
      })
    );
    expect(yAxisChartLabels).toMatchSnapshot('yAxisChartLabel');
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

  it('should apply an inventory configuration', () => {
    const { initialInventoryFilters: initialFilters, inventoryHostsQuery: inventoryQuery, productId } = config;

    const inventoryData = {
      [INVENTORY_TYPES.DISPLAY_NAME]: 'lorem ipsum',
      [RHSM_API_PATH_METRIC_TYPES.CORES]: 100,
      [RHSM_API_PATH_METRIC_TYPES.INSTANCE_HOURS]: 200,
      [INVENTORY_TYPES.LAST_SEEN]: '2022-01-01T00:00:00.000Z'
    };

    const filteredInventoryData = parseRowCellsListData({
      filters: initialFilters,
      cellData: inventoryData,
      productId
    });

    expect(filteredInventoryData).toMatchSnapshot('filtered');

    const fallbackFilteredInventoryData = parseRowCellsListData({
      filters: initialFilters,
      cellData: {
        ...inventoryData,
        [INVENTORY_TYPES.INSTANCE_ID]: null,
        [INVENTORY_TYPES.LAST_SEEN]: null,
        [INVENTORY_TYPES.NUMBER_OF_GUESTS]: null
      },
      productId
    });

    expect(fallbackFilteredInventoryData).toMatchSnapshot('filtered, fallback display');

    const filteredInventoryDataAuthorized = parseRowCellsListData({
      filters: initialFilters,
      cellData: {
        ...inventoryData,
        [INVENTORY_TYPES.INSTANCE_ID]: 'XXXX-XXXX-XXXXX-XXXXX'
      },
      session: { authorized: { inventory: true } },
      productId
    });

    expect(filteredInventoryDataAuthorized).toMatchSnapshot('filtered, authorized');

    const filteredInventoryDataNotAuthorized = parseRowCellsListData({
      filters: initialFilters,
      cellData: {
        ...inventoryData,
        [INVENTORY_TYPES.INSTANCE_ID]: 'XXXX-XXXX-XXXXX-XXXXX'
      },
      session: { authorized: { inventory: false } },
      productId
    });

    expect(filteredInventoryDataNotAuthorized).toMatchSnapshot('filtered, NOT authorized');

    expect(inventoryQuery[RHSM_API_QUERY_SET_TYPES.DIRECTION] === SORT_DIRECTION_TYPES.DESCENDING).toBe(true);
  });

  it('should apply subscriptions inventory configuration', () => {
    const {
      initialSubscriptionsInventoryFilters: initialFilters,
      inventorySubscriptionsQuery: inventoryQuery,
      productId
    } = config;

    const inventoryData = {
      [SUBSCRIPTIONS_INVENTORY_TYPES.PRODUCT_NAME]: 'lorem',
      [SUBSCRIPTIONS_INVENTORY_TYPES.SERVICE_LEVEL]: 'hello world',
      [SUBSCRIPTIONS_INVENTORY_TYPES.NEXT_EVENT_DATE]: '2022-01-01T00:00:00.000Z',
      [SUBSCRIPTIONS_INVENTORY_TYPES.TOTAL_CAPACITY]: 2000,
      [SUBSCRIPTIONS_INVENTORY_TYPES.HAS_INFINITE_QUANTITY]: true
    };

    const filteredInventoryData = parseRowCellsListData({
      filters: initialFilters,
      cellData: inventoryData,
      productId
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
      productId
    });

    expect(fallbackFilteredInventoryData).toMatchSnapshot('filtered, fallback display');

    expect(inventoryQuery[RHSM_API_QUERY_SET_TYPES.DIRECTION] === SORT_DIRECTION_TYPES.DESCENDING).toBe(true);
  });

  it('should apply guest inventory configuration', () => {
    const { initialGuestsFilters: initialFilters } = config;

    const guestsData = {
      [INVENTORY_TYPES.DISPLAY_NAME]: 'lorem',
      [INVENTORY_TYPES.INVENTORY_ID]: 'lorem inventory id',
      [INVENTORY_TYPES.SUBSCRIPTION_MANAGER_ID]: 'lorem subscription id',
      [INVENTORY_TYPES.LAST_SEEN]: '2022-01-01T00:00:00.000Z',
      loremIpsum: 'hello world'
    };

    const filteredGuestsData = parseRowCellsListData({
      filters: initialFilters,
      cellData: guestsData
    });

    expect(filteredGuestsData).toMatchSnapshot('filtered');

    const filteredGuestsDataMissing = parseRowCellsListData({
      filters: initialFilters,
      cellData: {
        ...guestsData,
        [INVENTORY_TYPES.INVENTORY_ID]: undefined
      }
    });

    expect(filteredGuestsDataMissing).toMatchSnapshot('filtered, missing inventory id');

    const filteredGuestsDataAuthorized = parseRowCellsListData({
      filters: initialFilters,
      cellData: guestsData,
      session: { authorized: { inventory: true } }
    });

    expect(filteredGuestsDataAuthorized).toMatchSnapshot('filtered, authorized');

    const filteredGuestsDataNotAuthorized = parseRowCellsListData({
      filters: initialFilters,
      cellData: guestsData,
      session: { authorized: { inventory: false } }
    });

    expect(filteredGuestsDataNotAuthorized).toMatchSnapshot('filtered, NOT authorized');
  });
});
