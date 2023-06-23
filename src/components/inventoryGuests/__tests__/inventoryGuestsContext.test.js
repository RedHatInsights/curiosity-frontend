import { context, useGetGuestsInventory, useOnScroll } from '../inventoryGuestsContext';
import { RHSM_API_QUERY_SET_TYPES } from '../../../services/rhsm/rhsmConstants';

describe('InventorySubscriptionsContext', () => {
  it('should return specific properties', () => {
    expect(context).toMatchSnapshot('specific properties');
  });

  it('should handle instances inventory API responses', async () => {
    const { result: errorResponse } = await renderHook(() =>
      useGetGuestsInventory('1234567890', {
        getInventory: () => () => {},
        useDispatch: () => {},
        useProductInventoryQuery: () => ({}),
        useSelectorsInventory: () => ({ error: true })
      })
    );

    expect(errorResponse).toMatchSnapshot('inventory, error');

    const { result: pendingResponse } = await renderHook(() =>
      useGetGuestsInventory('1234567890', {
        getInventory: () => () => {},
        useDispatch: () => {},
        useProductInventoryQuery: () => ({}),
        useSelectorsInventory: () => ({ pending: true })
      })
    );

    expect(pendingResponse).toMatchSnapshot('inventory, pending');

    const { result: cancelledResponse } = await renderHook(() =>
      useGetGuestsInventory('1234567890', {
        getInventory: () => () => {},
        useDispatch: () => {},
        useProductInventoryQuery: () => ({}),
        useSelectorsInventory: () => ({ cancelled: true })
      })
    );

    expect(cancelledResponse).toMatchSnapshot('inventory, cancelled');

    const { result: fulfilledResponse } = await renderHook(() =>
      useGetGuestsInventory('1234567890', {
        getInventory: () => () => {},
        useDispatch: () => {},
        useProductInventoryQuery: () => ({}),
        useSelectorsInventory: () => ({ fulfilled: true })
      })
    );

    expect(fulfilledResponse).toMatchSnapshot('inventory, fulfilled');
  });

  it('should handle an onScroll event', async () => {
    const mockDispatch = jest.fn();

    const { unmount } = await renderHook(() => {
      const onScroll = useOnScroll('1234567890', {
        useDispatch: () => mockDispatch,
        useProductInventoryQuery: () => ({
          [RHSM_API_QUERY_SET_TYPES.OFFSET]: 0,
          [RHSM_API_QUERY_SET_TYPES.LIMIT]: 100
        }),
        useSelectorsInventory: () => ({ pending: false, data: { meta: { count: 200 } } })
      });

      onScroll({ target: { scrollHeight: 200, scrollTop: 100, clientHeight: 100 } });
    });

    await unmount();

    expect(mockDispatch.mock.calls).toMatchSnapshot('onPage event, dispatch');
    mockDispatch.mockClear();
  });
});
