import { context, useRouteDetail } from '../routerContext';

describe('ChartContext', () => {
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
});
