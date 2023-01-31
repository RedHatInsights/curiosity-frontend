import { routerHooks, useHistory } from '../useRouter';

describe('useRouter', () => {
  it('should return specific properties', () => {
    expect(routerHooks).toMatchSnapshot('specific properties');
  });

  it('should apply a hook for useHistory', () => {
    const mockHistoryPush = jest.fn();
    const { result: mockUseHistory } = shallowHook(() =>
      useHistory({
        useHistory: () => ({ push: mockHistoryPush })
      })
    );

    mockUseHistory.push('/dolor/sit');
    mockUseHistory.push('rhel');
    mockUseHistory.push('insights');

    expect(mockHistoryPush.mock.calls).toMatchSnapshot('history push');
  });
});
