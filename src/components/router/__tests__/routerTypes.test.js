import { baseName, dynamicBaseName, getRouteDetail, navigation, routes } from '../routerTypes';

describe('RouterTypes', () => {
  it('should return specific properties', () => {
    expect(baseName).toBeDefined();
    expect(dynamicBaseName).toBeDefined();
    expect(getRouteDetail).toBeDefined();
    expect(navigation).toMatchSnapshot('navigation');
    expect(routes).toMatchSnapshot('routes');
  });

  it('should return a generated baseName', () => {
    expect(
      dynamicBaseName({
        pathName: '/apps/appName',
        pathPrefix: '/beta'
      })
    ).toMatchSnapshot('app base name');

    expect(
      dynamicBaseName({
        pathName: '/apps/lorem/appName',
        pathPrefix: '/beta'
      })
    ).toMatchSnapshot('app base lorem base name');

    expect(
      dynamicBaseName({
        pathName: '/beta/apps/appName',
        pathPrefix: '/beta'
      })
    ).toMatchSnapshot('beta app base name');

    expect(
      dynamicBaseName({
        pathName: '/beta/apps/lorem/appName',
        pathPrefix: '/beta'
      })
    ).toMatchSnapshot('beta app lorem base name');
  });

  it('should return route details that match navigation', () => {
    expect(getRouteDetail({ test: 'computenode' })).toMatchSnapshot('route detail: computenode');
    expect(getRouteDetail({})).toMatchSnapshot('route detail: default');
    expect(getRouteDetail(null)).toMatchSnapshot('route detail: null or undefined');
  });
});
