import { baseName, dynamicBaseName, getRouteDetail } from '../routerHelpers';

describe('RouterHelpers', () => {
  it('should return specific properties', () => {
    expect(baseName).toBeDefined();
    expect(dynamicBaseName).toBeDefined();
    expect(getRouteDetail).toBeDefined();
  });

  it('should return a generated baseName', () => {
    expect(
      dynamicBaseName({
        pathName: '/appName',
        pathPrefix: '/beta'
      })
    ).toMatchSnapshot('app base name');

    expect(
      dynamicBaseName({
        pathName: '/beta/appName',
        pathPrefix: '/beta'
      })
    ).toMatchSnapshot('app base lorem base name');

    expect(
      dynamicBaseName({
        pathName: '/beta/appName',
        pathPrefix: '/beta'
      })
    ).toMatchSnapshot('beta app base name');

    expect(
      dynamicBaseName({
        pathName: '/beta/appName/loremRoute',
        pathPrefix: '/beta'
      })
    ).toMatchSnapshot('beta app lorem route name');
  });

  it('should return route details that match navigation', () => {
    expect(getRouteDetail({ test: 'computenode' })).toMatchSnapshot('route detail: computenode');
    expect(getRouteDetail({ params: {} })).toMatchSnapshot('route detail: default');
    expect(getRouteDetail({ pathname: '/rhel-sw/all' })).toMatchSnapshot('route detail: match specific navigation');
    expect(getRouteDetail({})).toMatchSnapshot('route detail: null or undefined');
  });
});
