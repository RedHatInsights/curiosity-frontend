import { config } from '../product.satellite';
import { generateChartSettings } from '../../components/graphCard/graphCardHelpers';
import { parseRowCellsListData } from '../../components/inventoryCard/inventoryCardHelpers';
import {
  RHSM_API_PATH_METRIC_TYPES,
  RHSM_API_QUERY_INVENTORY_SORT_DIRECTION_TYPES as SORT_DIRECTION_TYPES,
  RHSM_API_QUERY_SET_TYPES,
  RHSM_API_RESPONSE_INSTANCES_DATA_TYPES as INVENTORY_TYPES
} from '../../services/rhsm/rhsmConstants';

describe('Product Satellite config', () => {
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
  });

  it('should apply an inventory configuration', () => {
    const { initialInventoryFilters: initialFilters, inventoryHostsQuery: inventoryQuery, productId } = config;

    const inventoryData = {
      [INVENTORY_TYPES.DISPLAY_NAME]: 'lorem ipsum',
      [RHSM_API_PATH_METRIC_TYPES.SOCKETS]: 200,
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
        [INVENTORY_TYPES.CLOUD_PROVIDER]: 'dolor sit'
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

  it('should apply guest inventory configuration', () => {
    const { initialGuestsFilters: initialFilters } = config;

    const guestsData = {
      displayName: 'lorem',
      inventoryId: 'lorem inventory id',
      subscriptionManagerId: 'lorem subscription id',
      lastSeen: '2022-01-01T00:00:00.000Z',
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
        inventoryId: undefined
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
