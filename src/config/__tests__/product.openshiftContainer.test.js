import { config } from '../product.openshiftContainer';
import { generateChartSettings } from '../../components/graphCard/graphCardHelpers';
import { parseRowCellsListData } from '../../components/inventoryCard/inventoryCardHelpers';
import {
  RHSM_API_QUERY_INVENTORY_SORT_DIRECTION_TYPES as SORT_DIRECTION_TYPES,
  RHSM_API_QUERY_SET_TYPES,
  RHSM_API_RESPONSE_HOSTS_DATA_TYPES as INVENTORY_TYPES,
  RHSM_API_RESPONSE_SUBSCRIPTIONS_DATA_TYPES as SUBSCRIPTIONS_INVENTORY_TYPES
} from '../../services/rhsm/rhsmConstants';

describe('Product OpenShift Container config', () => {
  it('should apply graph configuration', () => {
    const { initialGraphFilters, initialGraphSettings } = config;

    expect(generateChartSettings({ filters: initialGraphFilters })).toMatchSnapshot('filters');
    expect(initialGraphSettings).toMatchSnapshot('settings');
  });

  it('should apply hosts inventory configuration', () => {
    const { initialInventoryFilters: initialFilters, inventoryHostsQuery: inventoryQuery, productId } = config;

    const inventoryData = {
      [INVENTORY_TYPES.DISPLAY_NAME]: 'lorem',
      [INVENTORY_TYPES.INVENTORY_ID]: 'lorem inventory id',
      [INVENTORY_TYPES.NUMBER_OF_GUESTS]: 3,
      [INVENTORY_TYPES.CORES]: 20,
      [INVENTORY_TYPES.SOCKETS]: 100,
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
      [INVENTORY_TYPES.NUMBER_OF_GUESTS]: null,
      [INVENTORY_TYPES.CORES]: null,
      [INVENTORY_TYPES.SOCKETS]: null,
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

    const filteredInventoryData = parseRowCellsListData({
      filters: initialFilters,
      cellData: inventoryData
    });

    expect(filteredInventoryData).toMatchSnapshot('filtered');

    const fallbackInventoryData = {
      ...inventoryData,
      [SUBSCRIPTIONS_INVENTORY_TYPES.SERVICE_LEVEL]: null,
      [SUBSCRIPTIONS_INVENTORY_TYPES.NEXT_EVENT_DATE]: null
    };

    const fallbackFilteredInventoryData = parseRowCellsListData({
      filters: initialFilters,
      cellData: fallbackInventoryData
    });

    expect(fallbackFilteredInventoryData).toMatchSnapshot('filtered, fallback display');

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

    const filteredGuestsDataAuthorized = parseRowCellsListData({
      filters: initialFilters,
      cellData: guestsData,
      session: { authorized: { inventory: true } }
    });

    expect(filteredGuestsDataAuthorized).toMatchSnapshot('filtered, authorized');
  });
});
