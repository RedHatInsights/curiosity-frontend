import { config } from '../product.openshiftMetrics';
import { parseRowCellsListData } from '../../components/inventoryCard/inventoryCardHelpers';
import {
  RHSM_API_QUERY_INVENTORY_SORT_DIRECTION_TYPES as SORT_DIRECTION_TYPES,
  RHSM_API_QUERY_SET_TYPES
} from '../../services/rhsm/rhsmConstants';

describe('Product OpenShift Metrics config', () => {
  it('should apply graph configuration', () => {
    const { initialGraphSettings } = config;

    expect({
      productActionDisplay: initialGraphSettings.actionDisplay({
        data: {
          coreHours: [
            {
              y: 0
            },
            {
              y: 400
            },
            {
              y: 100
            }
          ]
        },
        meta: {
          totalCoreHours: 500
        }
      })
    }).toMatchSnapshot('product action display should display a total value below 1000');

    expect({
      productActionDisplay: initialGraphSettings.actionDisplay({
        data: {
          coreHours: [
            {
              y: 0
            },
            {
              y: 800000
            },
            {
              y: 100000
            }
          ]
        },
        meta: {
          totalCoreHours: 900000
        }
      })
    }).toMatchSnapshot('product action display should display a total value below 1000000');

    expect({
      productActionDisplay: initialGraphSettings.actionDisplay({
        data: {
          coreHours: [
            {
              y: 0
            },
            {
              y: 1000
            },
            {
              y: 100
            }
          ]
        },
        meta: {
          totalCoreHours: 1100
        }
      })
    }).toMatchSnapshot('product action display should display a total value');

    expect({
      productActionDisplay: initialGraphSettings.actionDisplay({
        data: {
          loremIpsum: [
            {
              y: 0
            },
            {
              y: 1000
            },
            {
              y: 100
            }
          ]
        },
        meta: {
          totalCoreHours: undefined
        }
      })
    }).toMatchSnapshot('product action display should NOT display a total value');
  });

  it('should apply hosts inventory configuration', () => {
    const { initialInventoryFilters: initialFilters, inventoryHostsQuery: inventoryQuery } = config;

    const inventoryData = {
      displayName: 'lorem',
      inventoryId: 'lorem inventory id',
      coreHours: 12.53,
      lastSeen: '2022-01-01T00:00:00.000Z',
      loremIpsum: 'hello world'
    };

    const filteredInventoryData = parseRowCellsListData({
      filters: initialFilters,
      cellData: inventoryData
    });

    expect(filteredInventoryData).toMatchSnapshot('filtered');

    const fallbackInventoryData = {
      ...inventoryData,
      coreHours: null,
      inventoryId: null,
      lastSeen: null
    };

    const fallbackFilteredInventoryData = parseRowCellsListData({
      filters: initialFilters,
      cellData: fallbackInventoryData
    });

    expect(fallbackFilteredInventoryData).toMatchSnapshot('filtered, fallback display');

    expect(inventoryQuery[RHSM_API_QUERY_SET_TYPES.DIRECTION] === SORT_DIRECTION_TYPES.DESCENDING).toBe(true);
  });
});
