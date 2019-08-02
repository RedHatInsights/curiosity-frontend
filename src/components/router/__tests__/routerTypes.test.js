import { baseName, dynamicBaseName, routes } from '../routerTypes';

describe('RouterTypes', () => {
  it('should return specific properties', () => {
    expect(baseName).toBeDefined();
    expect(dynamicBaseName).toBeDefined();
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
});
