import { config } from '../product.openshiftDedicated';
import { generateChartIds, generateChartSettings } from '../../components/graphCard/graphCardHelpers';
import { parseRowCellsListData } from '../../components/inventoryCard/inventoryCardHelpers';
import {
  RHSM_API_PATH_METRIC_TYPES,
  RHSM_API_QUERY_INVENTORY_SORT_DIRECTION_TYPES as SORT_DIRECTION_TYPES,
  RHSM_API_QUERY_SET_TYPES,
  RHSM_API_RESPONSE_HOSTS_DATA_TYPES as INVENTORY_TYPES
} from '../../services/rhsm/rhsmConstants';

describe('Product OpenShift Dedicated config', () => {
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

  it('should apply hosts inventory configuration', () => {
    const { initialInventoryFilters: initialFilters, inventoryHostsQuery: inventoryQuery, productId } = config;

    const inventoryData = {
      [INVENTORY_TYPES.DISPLAY_NAME]: 'lorem',
      [INVENTORY_TYPES.INVENTORY_ID]: 'lorem inventory id',
      [INVENTORY_TYPES.CORE_HOURS]: 12.53,
      [INVENTORY_TYPES.INSTANCE_HOURS]: 20.04,
      [INVENTORY_TYPES.LAST_SEEN]: '2022-01-01T00:00:00.000Z',
      loremIpsum: 'hello world'
    };

    const filteredInventoryData = parseRowCellsListData({
      filters: initialFilters,
      cellData: inventoryData,
      productId
    });

    expect(filteredInventoryData).toMatchSnapshot('filtered');

    const fallbackInventoryData = {
      ...inventoryData,
      [INVENTORY_TYPES.INVENTORY_ID]: null,
      [INVENTORY_TYPES.CORE_HOURS]: null,
      [INVENTORY_TYPES.INSTANCE_HOURS]: null,
      [INVENTORY_TYPES.LAST_SEEN]: null
    };

    const fallbackFilteredInventoryData = parseRowCellsListData({
      filters: initialFilters,
      cellData: fallbackInventoryData,
      productId
    });

    expect(fallbackFilteredInventoryData).toMatchSnapshot('filtered, fallback display');

    expect(inventoryQuery[RHSM_API_QUERY_SET_TYPES.DIRECTION] === SORT_DIRECTION_TYPES.DESCENDING).toBe(true);
  });
});
