import { context, useBannerMessages, useRemoveBannerMessages, useSetBannerMessages } from '../bannerMessagesContext';

describe('BannerMessagesContext', () => {
  it('should return specific properties', () => {
    expect(context).toMatchSnapshot('specific properties');
  });

  it('should apply a hook for retrieving messages data from a selector', async () => {
    const { result } = await renderHook(() =>
      useBannerMessages({
        useSelector: () => [
          {
            id: 'lorem',
            title: 'ipsum'
          }
        ]
      })
    );

    expect(result).toMatchSnapshot('banner messages');
  });

  it('should apply a hook for retrieving messages data from a selector and apply new messages', async () => {
    const mockDispatch = jest.fn();
    const { result } = await renderHook(() =>
      useSetBannerMessages({
        useDispatch: () => mockDispatch,
        useProduct: () => ({ productId: 'dolorSit' }),
        useBannerMessages: () => [
          {
            id: 'lorem',
            title: 'ipsum'
          }
        ]
      })
    );

    result('new message');
    expect(mockDispatch.mock.calls).toMatchSnapshot('dispatch');
  });

  it('should apply a hook for retrieving messages data from a selector and remove messages', async () => {
    const mockDispatch = jest.fn();
    const { result } = await renderHook(() =>
      useRemoveBannerMessages({
        useDispatch: () => mockDispatch,
        useProduct: () => ({ productId: 'dolorSit' }),
        useBannerMessages: () => [
          {
            id: 'lorem',
            title: 'ipsum'
          }
        ]
      })
    );

    result('ipsum');
    expect(mockDispatch.mock.calls).toMatchSnapshot('dispatch');
  });
});
