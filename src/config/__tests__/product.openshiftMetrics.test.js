import { config } from '../product.openshiftMetrics';
import { generateChartIds, generateChartSettings } from '../../components/graphCard/graphCardHelpers';
import { parseRowCellsListData } from '../../components/inventoryCard/inventoryCardHelpers';
import {
  RHSM_API_PATH_METRIC_TYPES,
  RHSM_API_QUERY_INVENTORY_SORT_DIRECTION_TYPES as SORT_DIRECTION_TYPES,
  RHSM_API_QUERY_SET_TYPES,
  RHSM_API_RESPONSE_INSTANCES_DATA_TYPES as INVENTORY_TYPES
} from '../../services/rhsm/rhsmConstants';

describe('Product OpenShift Metrics config', () => {
  it('should apply toolbar configuration', () => {
    const { initialToolbarFilters } = config;

    expect(initialToolbarFilters).toMatchSnapshot('filters');
  });

  it('should apply graph configuration', () => {
    const { initialGraphFilters, initialGraphSettings } = config;

    expect(generateChartSettings({ filters: initialGraphFilters, settings: initialGraphSettings })).toMatchSnapshot(
      'filters'
    );
    expect(initialGraphSettings).toMatchSnapshot('settings');

    expect({
      productActionDisplay: initialGraphSettings.actions[0].content({
        data: [
          {
            id: generateChartIds({ isCapacity: false, metric: RHSM_API_PATH_METRIC_TYPES.CORES, productId: 'Ipsum' }),
            metric: RHSM_API_PATH_METRIC_TYPES.CORES,
            data: [
              {
                y: 0
              },
              {
                y: 400
              },
              {
                y: 100
              }
            ],
            meta: {
              totalMonthlyValue: 500
            }
          }
        ]
      })
    }).toMatchSnapshot('product action display should display a total value below 1000');

    expect({
      productActionDisplay: initialGraphSettings.actions[0].content({
        data: [
          {
            id: generateChartIds({ isCapacity: false, metric: RHSM_API_PATH_METRIC_TYPES.CORES, productId: 'Ipsum' }),
            metric: RHSM_API_PATH_METRIC_TYPES.CORES,
            data: [
              {
                y: 0
              },
              {
                y: 800000
              },
              {
                y: 100000
              }
            ],
            meta: {
              totalMonthlyValue: 900000
            }
          }
        ]
      })
    }).toMatchSnapshot('product action display should display a total value below 1000000');

    expect({
      productActionDisplay: initialGraphSettings.actions[0].content({
        data: [
          {
            id: generateChartIds({ isCapacity: false, metric: RHSM_API_PATH_METRIC_TYPES.CORES, productId: 'Ipsum' }),
            metric: RHSM_API_PATH_METRIC_TYPES.CORES,
            data: [
              {
                y: 0
              },
              {
                y: 1000
              },
              {
                y: 100
              }
            ],
            meta: {
              totalMonthlyValue: 1100
            }
          }
        ]
      })
    }).toMatchSnapshot('product action display should display a total value');

    expect({
      productActionDisplay: initialGraphSettings.actions[0].content({
        data: [
          {
            id: generateChartIds({ isCapacity: false, metric: 'loremIpsum', productId: 'Ipsum' }),
            metric: 'loremIpsum',
            data: [
              {
                y: 0
              },
              {
                y: 1000
              },
              {
                y: 100
              }
            ],
            meta: {
              totalMonthlyValue: undefined
            }
          }
        ]
      })
    }).toMatchSnapshot('product action display should NOT display a total value');
  });

  it('should apply an inventory configuration', () => {
    const { initialInventoryFilters: initialFilters, inventoryHostsQuery: inventoryQuery, productId } = config;

    const inventoryData = {
      [INVENTORY_TYPES.DISPLAY_NAME]: 'lorem ipsum',
      [RHSM_API_PATH_METRIC_TYPES.CORES]: 100,
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
});
