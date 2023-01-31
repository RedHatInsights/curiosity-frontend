import { config } from '../product.satellite';
import { generateChartSettings } from '../../components/graphCard/graphCardHelpers';
import { parseRowCellsListData } from '../../components/inventoryCard/inventoryCardHelpers';
import {
  RHSM_API_QUERY_INVENTORY_SORT_DIRECTION_TYPES as SORT_DIRECTION_TYPES,
  RHSM_API_QUERY_SET_TYPES,
  RHSM_API_RESPONSE_HOSTS_DATA_TYPES as INVENTORY_TYPES
} from '../../services/rhsm/rhsmConstants';

describe('Product Satellite config', () => {
  it('should apply graph configuration', () => {
    const { initialGraphFilters, initialGraphSettings } = config;

    expect(generateChartSettings({ filters: initialGraphFilters })).toMatchSnapshot('filters');
    expect(initialGraphSettings).toMatchSnapshot('settings');
  });

  it('should apply hosts inventory configuration', () => {
    const { initialInventoryFilters: initialFilters, inventoryHostsQuery: inventoryQuery, productId } = config;

    const inventoryData = {
      [INVENTORY_TYPES.DISPLAY_NAME]: 'lorem',
      [INVENTORY_TYPES.INVENTORY_ID]: undefined,
      [INVENTORY_TYPES.HARDWARE_TYPE]: 'ipsum',
      [INVENTORY_TYPES.MEASUREMENT_TYPE]: null,
      [INVENTORY_TYPES.NUMBER_OF_GUESTS]: 3,
      [INVENTORY_TYPES.SOCKETS]: 10,
      [INVENTORY_TYPES.CORES]: 12,
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
      [INVENTORY_TYPES.LAST_SEEN]: null,
      [INVENTORY_TYPES.CLOUD_PROVIDER]: 'dolor sit'
    };

    const fallbackFilteredInventoryData = parseRowCellsListData({
      filters: initialFilters,
      cellData: fallbackInventoryData,
      productId
    });

    expect(fallbackFilteredInventoryData).toMatchSnapshot('filtered, fallback display');

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
  });
});
