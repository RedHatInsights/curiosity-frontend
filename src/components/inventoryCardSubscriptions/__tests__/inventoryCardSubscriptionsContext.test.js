import {
  context,
  useGetSubscriptionsInventory,
  useOnPageSubscriptions,
  useOnColumnSortSubscriptions
} from '../inventoryCardSubscriptionsContext';
import {
  RHSM_API_QUERY_INVENTORY_SORT_DIRECTION_TYPES as SORT_DIRECTION_TYPES,
  RHSM_API_QUERY_INVENTORY_SUBSCRIPTIONS_SORT_TYPES as SORT_TYPES,
  RHSM_API_QUERY_SET_TYPES as QUERY_TYPES,
  RHSM_API_QUERY_SLA_TYPES as SLA_TYPES
} from '../../../services/rhsm/rhsmConstants';
import { useProductInventorySubscriptionsQuery } from '../../productView/productViewContext';
import { useGetInstancesInventory } from '../../inventoryCardInstances/inventoryCardInstancesContext';

describe('InventoryCardSubscriptionsContext', () => {
  it('should return specific properties', () => {
    expect(context).toMatchSnapshot('specific properties');
  });

  it('should expect specific sort properties', () => {
    expect(SORT_TYPES).toMatchSnapshot('sort properties');
  });

  it('should fetch annual OpenShift subscriptions without an unsupported Usage filter', async () => {
    const getInventory = jest.fn(() => () => {});
    const useOpenShiftInventoryQuery = () =>
      useProductInventorySubscriptionsQuery({
        useProductViewContext: () => ({
          initialToolbarFilters: [{ id: QUERY_TYPES.SLA }],
          defaultFilteringEnabled: true
        }),
        useProductQuery: () => ({
          [QUERY_TYPES.SLA]: null,
          [QUERY_TYPES.USAGE]: null
        }),
        useProductQueryFactory: () => ({
          [QUERY_TYPES.SLA]: '',
          [QUERY_TYPES.USAGE]: 'unsupported',
          [QUERY_TYPES.LIMIT]: 100
        })
      });
    const useOpenShiftInventoryRequest = options =>
      useGetInstancesInventory({
        ...options,
        useDispatch: () => jest.fn(),
        useProduct: () => ({ productId: 'openshift' }),
        useSelector: () => ({})
      });

    const { unmount } = await renderHook(() =>
      useGetSubscriptionsInventory({
        getInventory,
        useGetInventory: useOpenShiftInventoryRequest,
        useProductInventoryQuery: useOpenShiftInventoryQuery
      })
    );

    expect(getInventory).toHaveBeenCalledWith('openshift', {
      [QUERY_TYPES.SLA]: SLA_TYPES.PREMIUM,
      [QUERY_TYPES.LIMIT]: 100
    });

    await unmount();
  });

  it('should handle an onPage event', () => {
    const mockDispatch = jest.fn();
    const onPage = useOnPageSubscriptions({
      useDispatch: () => mockDispatch,
      useProduct: () => ({ productId: 'lorem' })
    });

    onPage({ offset: 1, perPage: 5 });
    expect(mockDispatch.mock.calls).toMatchSnapshot('onPage event, dispatch');
    mockDispatch.mockClear();
  });

  it('should handle an onColumnSort event', () => {
    const mockDispatch = jest.fn();
    const onColumnSort = useOnColumnSortSubscriptions({
      sortColumns: { LOREM_IPSUM_COLUMN_ONE: 'loremIpsumColumnOne' },
      useDispatch: () => mockDispatch,
      useProduct: () => ({ productId: 'lorem' })
    });

    onColumnSort({ direction: SORT_DIRECTION_TYPES.DESCENDING, data: { metric: 'loremIpsumColumnOne' } });
    onColumnSort({ direction: SORT_DIRECTION_TYPES.ASCENDING, data: { metric: 'loremIpsumColumnOne' } });

    expect(mockDispatch.mock.calls).toMatchSnapshot('onColumnSort event, dispatch');
    mockDispatch.mockClear();
  });
});
