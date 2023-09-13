import { context, useGetGuestsInventory, useOnScroll } from '../inventoryGuestsContext';
import { RHSM_API_QUERY_SET_TYPES } from '../../../services/rhsm/rhsmConstants';

describe('InventoryGuestsContext', () => {
  it('should return specific properties', () => {
    expect(context).toMatchSnapshot('specific properties');
  });

  it('should handle variations in guests inventory API responses', async () => {
    const { result: errorResponse } = await renderHook(() =>
      useGetGuestsInventory('1234567890', {
        getInventory: () => () => {},
        useDispatch: () => {},
        useProductInventoryQuery: () => ({}),
        useSelector: () => ({ error: true })
      })
    );

    expect(errorResponse).toMatchSnapshot('inventory, error');

    const { result: pendingResponse } = await renderHook(() =>
      useGetGuestsInventory('1234567890', {
        getInventory: () => () => {},
        useDispatch: () => {},
        useProductInventoryQuery: () => ({}),
        useSelector: () => ({ pending: true })
      })
    );

    expect(pendingResponse).toMatchSnapshot('inventory, pending');

    const { result: cancelledResponse } = await renderHook(() =>
      useGetGuestsInventory('1234567890', {
        getInventory: () => () => {},
        useDispatch: () => {},
        useProductInventoryQuery: () => ({}),
        useSelector: () => ({ cancelled: true })
      })
    );

    expect(cancelledResponse).toMatchSnapshot('inventory, cancelled');

    const { result: fulfilledResponse } = await renderHook(() =>
      useGetGuestsInventory('1234567890', {
        getInventory: () => () => {},
        useDispatch: () => {},
        useProductInventoryQuery: () => ({}),
        useSelector: () => ({ fulfilled: true })
      })
    );

    expect(fulfilledResponse).toMatchSnapshot('inventory, fulfilled');

    const { result: disabledResponse } = await renderHook(() =>
      useGetGuestsInventory('1234567890', {
        isDisabled: true,
        getInventory: () => () => {},
        useDispatch: () => {},
        useProductInventoryQuery: () => ({}),
        useSelector: () => ({ data: {}, fulfilled: false, pending: false, error: false })
      })
    );

    expect(disabledResponse).toMatchSnapshot('inventory, disabled');
  });

  it('should handle an onScroll event', async () => {
    const mockDispatch = jest.fn();

    const { unmount } = await renderHook(() => {
      const onScroll = useOnScroll(
        { id: '1234567890', numberOfGuests: 200 },
        {
          useDispatch: () => mockDispatch,
          useProductInventoryQuery: () => ({
            [RHSM_API_QUERY_SET_TYPES.OFFSET]: 0,
            [RHSM_API_QUERY_SET_TYPES.LIMIT]: 100
          }),
          useSelector: () => ({ pending: false })
        }
      );

      onScroll({ target: { scrollHeight: 200, scrollTop: 100, clientHeight: 100 } });
    });

    await unmount();

    expect(mockDispatch.mock.calls).toMatchSnapshot('onPage event, dispatch');
    mockDispatch.mockClear();
  });
});
