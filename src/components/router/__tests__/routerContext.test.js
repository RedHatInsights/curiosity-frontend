import { context, useHistory, useLocation, useRedirect, useRouteDetail } from '../routerContext';

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

  it('should apply a hook for useLocation', async () => {
    const mockLocation = {
      search: '?lorem=ipsum'
    };

    const { result: mockUseLocation } = await shallowHook(() => useLocation({ useLocation: () => mockLocation }));
    expect(mockUseLocation).toMatchSnapshot('location');
  });

  it('should apply a hook for useRedirect', async () => {
    const mockReplace = jest.fn();
    const mockLocation = {
      replace: mockReplace
    };

    const { result: mockUseRedirect } = await shallowHook(() => useRedirect({ useLocation: () => mockLocation }));
    mockUseRedirect('/dolor/sit');
    expect(mockReplace.mock.calls).toMatchSnapshot('redirect, replace');
  });
});
