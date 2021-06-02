import { routerHooks } from '../useRouter';

describe('useRouter', () => {
  it('should return specific properties', () => {
    expect(routerHooks).toMatchSnapshot('specific properties');
  });

  it('should apply a hook for useHistory', () => {
    const mockDispatch = jest.fn();
    const mockHistoryPush = jest.fn();
    const mockUseHistory = mockHook(() =>
      routerHooks.useHistory({
        useDispatch: () => action => action(mockDispatch),
        useHistory: () => ({ push: mockHistoryPush })
      })
    );

    mockUseHistory.push('rhel');
    expect(mockDispatch.mock.calls).toMatchSnapshot('push, config route');

    mockUseHistory.push('/lorem/ipsum');
    expect(mockHistoryPush.mock.calls).toMatchSnapshot('push, unique route');
  });
});
