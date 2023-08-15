import {
  context,
  useGetInstancesInventory,
  useOnPageInstances,
  useOnColumnSortInstances
} from '../inventoryCardContext';
import {
  RHSM_API_QUERY_INVENTORY_SORT_DIRECTION_TYPES as SORT_DIRECTION_TYPES,
  RHSM_API_QUERY_INVENTORY_SORT_TYPES as SORT_TYPES
} from '../../../services/rhsm/rhsmConstants';

describe('InventoryCardContext', () => {
  it('should return specific properties', () => {
    expect(context).toMatchSnapshot('specific properties');
  });

  it('should expect specific sort properties', () => {
    expect(SORT_TYPES).toMatchSnapshot('sort properties');
  });

  it('should handle a store response with useGetInstancesInventory', async () => {
    const { result } = await renderHook(
      () =>
        useGetInstancesInventory({
          getInventory: () => () => {},
          useProduct: () => ({ productId: 'lorem' }),
          useDispatch: () => {}
        }),
      {
        state: {
          inventory: {
            instancesInventory: {
              lorem: {
                fulfilled: true,
                data: [{ data: [{ lorem: 'ipsum' }, { dolor: 'sit' }], meta: {} }]
              }
            }
          }
        }
      }
    );

    expect(result).toMatchSnapshot('store response');
  });

  it('should handle variations in instances inventory API responses', async () => {
    const { result: errorResponse } = await renderHook(() =>
      useGetInstancesInventory({
        getInventory: () => () => {},
        useProduct: () => ({ productId: 'lorem' }),
        useDispatch: () => {},
        useSelectorsResponse: () => ({ error: true })
      })
    );

    expect(errorResponse).toMatchSnapshot('inventory, error');

    const { result: pendingResponse } = await renderHook(() =>
      useGetInstancesInventory({
        getInventory: () => () => {},
        useProduct: () => ({ productId: 'lorem' }),
        useDispatch: () => {},
        useSelectorsResponse: () => ({ pending: true })
      })
    );

    expect(pendingResponse).toMatchSnapshot('inventory, pending');

    const { result: cancelledResponse } = await renderHook(() =>
      useGetInstancesInventory({
        getInventory: () => () => {},
        useProduct: () => ({ productId: 'lorem' }),
        useDispatch: () => {},
        useSelectorsResponse: () => ({ cancelled: true })
      })
    );

    expect(cancelledResponse).toMatchSnapshot('inventory, cancelled');

    const { result: fulfilledResponse } = await renderHook(() =>
      useGetInstancesInventory({
        getInventory: () => () => {},
        useProduct: () => ({ productId: 'lorem' }),
        useDispatch: () => {},
        useSelectorsResponse: () => ({ fulfilled: true })
      })
    );

    expect(fulfilledResponse).toMatchSnapshot('inventory, fulfilled');

    const { result: disabledResponse } = await renderHook(() =>
      useGetInstancesInventory({
        isDisabled: true,
        getInventory: () => () => {},
        useProduct: () => ({ productId: 'lorem' }),
        useDispatch: () => {},
        useSelectorsResponse: () => ({ fulfilled: true })
      })
    );

    expect(disabledResponse).toMatchSnapshot('inventory, disabled');
  });

  it('should handle an onPage event', () => {
    const mockDispatch = jest.fn();
    const onPage = useOnPageInstances({
      useDispatch: () => mockDispatch,
      useProduct: () => ({ productId: 'lorem' })
    });

    onPage({ offset: 1, perPage: 5 });
    expect(mockDispatch.mock.calls).toMatchSnapshot('onPage event, dispatch');
    mockDispatch.mockClear();
  });

  it('should handle an onColumnSort event', () => {
    const mockDispatch = jest.fn();
    const onColumnSort = useOnColumnSortInstances({
      sortColumns: { LOREM_IPSUM_COLUMN_ONE: 'loremIpsumColumnOne' },
      useDispatch: () => mockDispatch,
      useProduct: () => ({ productId: 'lorem' })
    });

    onColumnSort(null, { direction: SORT_DIRECTION_TYPES.DESCENDING, id: 'loremIpsumColumnOne' });
    onColumnSort(null, { direction: SORT_DIRECTION_TYPES.ASCENDING, id: 'loremIpsumColumnOne' });

    expect(mockDispatch.mock.calls).toMatchSnapshot('onColumnSort event, dispatch');
    mockDispatch.mockClear();
  });
});
