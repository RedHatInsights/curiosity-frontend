import { baseName, dynamicBaseName, getNavigationDetail, getRouteDetail, getNavRouteDetail } from '../routerHelpers';

describe('RouterHelpers', () => {
  it('should return specific properties', () => {
    expect(baseName).toBeDefined();
    expect(dynamicBaseName).toBeDefined();
    expect(getNavigationDetail).toBeDefined();
    expect(getRouteDetail).toBeDefined();
    expect(getNavRouteDetail).toBeDefined();
  });

  it('should return a generated baseName using NO path prefix', () => {
    expect(
      dynamicBaseName({
        pathName: '/appName',
        pathPrefix: ''
      })
    ).toMatchSnapshot('empty pathPrefix: app base name');

    expect(
      dynamicBaseName({
        pathName: '/appName'
      })
    ).toMatchSnapshot('undefined pathPrefix: app base name');

    expect(
      dynamicBaseName({
        pathName: '/appName',
        pathPrefix: '/'
      })
    ).toMatchSnapshot('root reference pathPrefix: app base name');

    expect(
      dynamicBaseName({
        pathName: '/appName/loremRoute',
        pathPrefix: ''
      })
    ).toMatchSnapshot('app lorem route name');
  });

  it('should return a generated baseName using a beta path prefix', () => {
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
    ).toMatchSnapshot('beta app base name');

    expect(
      dynamicBaseName({
        pathName: '/beta/appName/loremRoute',
        pathPrefix: '/beta'
      })
    ).toMatchSnapshot('beta app lorem route name');
  });

  it('should return navigation and route details that align to location', () => {
    expect({
      nav: getNavigationDetail({ id: 'soon' }),
      route: getRouteDetail({ id: 'soon' }),
      navRoute: getNavRouteDetail({ id: 'soon' })
    }).toMatchSnapshot('detail: specific route ID');

    expect({
      nav: getNavigationDetail({ id: 'arm' }),
      route: getRouteDetail({ id: 'arm' }),
      navRoute: getNavRouteDetail({ id: 'arm' })
    }).toMatchSnapshot('detail: specific navigation ID');

    expect({
      nav: getNavigationDetail({ pathname: '/rhel-sw/all' }),
      route: getRouteDetail({ pathname: '/rhel-sw/all' }),
      navRoute: getNavRouteDetail({ pathname: '/rhel-sw/all' })
    }).toMatchSnapshot('detail: match specific path navigation');

    expect({
      nav: getNavigationDetail({ id: 'lorem-missing', pathname: '/rhel-sw/all' }),
      route: getRouteDetail({ id: 'lorem-missing', pathname: '/rhel-sw/all' }),
      navRoute: getNavRouteDetail({ id: 'lorem-missing', pathname: '/rhel-sw/all' })
    }).toMatchSnapshot('detail: missing ID, specific path');

    expect({
      nav: getNavigationDetail({ id: 'lorem', pathname: '/lorem-ipsum-missing', returnDefault: true }),
      route: getRouteDetail({ id: 'lorem', pathname: '/lorem-ipsum-missing', returnDefault: true }),
      navRoute: getNavRouteDetail({ id: 'lorem', pathname: '/lorem-ipsum-missing', returnDefault: true })
    }).toMatchSnapshot('detail: missing id and pathname, default');

    expect({
      nav: getNavigationDetail({ id: 'lorem', pathname: '/lorem-ipsum-missing', returnDefault: false }),
      route: getRouteDetail({ id: 'lorem', pathname: '/lorem-ipsum-missing', returnDefault: false }),
      navRoute: getNavRouteDetail({ id: 'lorem', pathname: '/lorem-ipsum-missing', returnDefault: false })
    }).toMatchSnapshot('detail: missing id and pathname and default');

    expect({
      nav: getNavigationDetail({}),
      route: getRouteDetail({}),
      navRoute: getNavRouteDetail({})
    }).toMatchSnapshot('detail: missing parameters');
  });
});
