import { context, useHistory, useRouteDetail } from '../routerContext';

describe('RouterContext', () => {
  it('should return specific properties', () => {
    expect(context).toMatchSnapshot('specific properties');
  });

  it('should apply a hook for return routeDetail', () => {
    const mockUseRouterContext = () => ({
      routeDetail: {
        lorem: 'ipsum'
      },
      dolor: 'sit'
    });

    const { result } = shallowHook(() => useRouteDetail({ useRouterContext: mockUseRouterContext }));
    expect(result).toMatchSnapshot('route details');
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
