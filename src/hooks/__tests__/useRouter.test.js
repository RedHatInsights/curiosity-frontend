import { routerHooks, useHistory } from '../useRouter';

describe('useRouter', () => {
  it('should return specific properties', () => {
    expect(routerHooks).toMatchSnapshot('specific properties');
  });

  it('should apply a hook for useHistory', () => {
    const mockDispatch = jest.fn();
    const mockHistoryPush = jest.fn();
    const { result: mockUseHistory } = shallowHook(() =>
      useHistory({
        useDispatch: () => action => action(mockDispatch),
        useHistory: () => ({ push: mockHistoryPush })
      })
    );

    mockUseHistory.push('/lorem/ipsum');
    mockUseHistory.push('rhel');

    expect(mockDispatch.mock.calls).toMatchSnapshot('dispatch platform navigation');
    expect(mockHistoryPush.mock.calls).toMatchSnapshot('history push');
  });

  it('should apply a hook for useHistory that emulates history but allows dispatching platform navigation updates if available', () => {
    const mockDispatch = jest.fn();
    const mockHistoryPush = jest.fn();
    const { result: mockUseHistory } = shallowHook(() =>
      useHistory({
        isSetAppNav: true,
        useDispatch: () => action => action(mockDispatch),
        useHistory: () => ({ push: mockHistoryPush })
      })
    );

    mockUseHistory.push('/lorem/ipsum');
    mockUseHistory.push('rhel');

    expect(mockDispatch.mock.calls).toMatchSnapshot('dispatch platform navigation');
    expect(mockHistoryPush.mock.calls).toMatchSnapshot('history push');
  });
});
