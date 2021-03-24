import {
  baseName,
  dynamicBaseName,
  getErrorRoute,
  getNavigationDetail,
  getRouteDetail,
  getNavRouteDetail
} from '../routerHelpers';

describe('RouterHelpers', () => {
  const mockWindowLocation = async ({ url, callback }) => {
    const updatedUrl = new URL(url);
    const { location } = window;
    delete window.location;
    window.location = { href: updatedUrl.href, search: updatedUrl.search, hash: updatedUrl.hash };
    await callback();
    window.location = location;
  };

  it('should return specific properties', () => {
    expect(baseName).toBeDefined();
    expect(dynamicBaseName).toBeDefined();
    expect(getErrorRoute).toBeDefined();
    expect(getNavigationDetail).toBeDefined();
    expect(getRouteDetail).toBeDefined();
    expect(getNavRouteDetail).toBeDefined();
  });

  it('should return a generated baseName using NO path prefix', () => {
    expect(
      dynamicBaseName({
        pathName: '/appName',
        appName: 'appName'
      })
    ).toMatchSnapshot('empty pathPrefix: app base name');

    expect(
      dynamicBaseName({
        pathName: '/appName/loremRoute',
        appName: 'appName'
      })
    ).toMatchSnapshot('app lorem route name');
  });

  it('should return a generated baseName using a beta path prefix', () => {
    expect(
      dynamicBaseName({
        pathName: '/beta/appName',
        appName: 'appName'
      })
    ).toMatchSnapshot('beta app base name');

    expect(
      dynamicBaseName({
        pathName: '/beta/appName/loremRoute',
        appName: 'appName'
      })
    ).toMatchSnapshot('beta app lorem route name');
  });

  it('should return a generated baseName using an insights path prefix', () => {
    expect(
      dynamicBaseName({
        pathName: '/insights/appName',
        appName: 'appName'
      })
    ).toMatchSnapshot('insights, app base name');

    expect(
      dynamicBaseName({
        pathName: '/beta/insights/appName',
        appName: 'appName'
      })
    ).toMatchSnapshot('insights, beta app base name');

    expect(
      dynamicBaseName({
        pathName: '/insights/appName/loremRoute',
        appName: 'appName'
      })
    ).toMatchSnapshot('insights, app lorem route name');

    expect(
      dynamicBaseName({
        pathName: '/beta/insights/appName/loremRoute',
        appName: 'appName'
      })
    ).toMatchSnapshot('insights, beta app lorem route name');
  });

  it('should return an error route', () => {
    expect(getErrorRoute).toMatchSnapshot('error route');
  });

  it('should return navigation and route details that align to location', () => {
    expect({
      nav: getNavigationDetail({ id: 'optin' }),
      route: getRouteDetail({ id: 'optin' }),
      navRoute: getNavRouteDetail({ id: 'optin' })
    }).toMatchSnapshot('detail: specific route ID');

    expect({
      nav: getNavigationDetail({ id: 'rhel-arm' }),
      route: getRouteDetail({ id: 'rhel-arm' }),
      navRoute: getNavRouteDetail({ id: 'rhel-arm' })
    }).toMatchSnapshot('detail: specific navigation ID');

    expect({
      nav: getNavigationDetail({ pathname: '/rhel' }),
      route: getRouteDetail({ pathname: '/rhel' }),
      navRoute: getNavRouteDetail({ pathname: '/rhel' })
    }).toMatchSnapshot('detail: match specific path navigation');

    expect({
      nav: getNavigationDetail({ id: 'lorem-missing', pathname: '/rhel' }),
      route: getRouteDetail({ id: 'lorem-missing', pathname: '/rhel' }),
      navRoute: getNavRouteDetail({ id: 'lorem-missing', pathname: '/rhel' })
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

  it('should handle location search and hash passthrough values', () => {
    mockWindowLocation({
      url: 'https://ci.foo.redhat.com/subscriptions/rhel',
      callback: () => {
        expect({
          routeHref: getNavigationDetail({ pathname: '/rhel' }).routeHref
        }).toMatchSnapshot('NO search and hash');
      }
    });

    mockWindowLocation({
      url: 'https://ci.foo.redhat.com/subscriptions/rhel?dolor=sit',
      callback: () => {
        expect({
          routeHref: getNavigationDetail({ pathname: '/rhel' }).routeHref
        }).toMatchSnapshot('search');
      }
    });

    mockWindowLocation({
      url: 'https://ci.foo.redhat.com/subscriptions/rhel#lorem',
      callback: () => {
        expect({
          routeHref: getNavigationDetail({ pathname: '/rhel' }).routeHref
        }).toMatchSnapshot('hash');
      }
    });

    mockWindowLocation({
      url: 'https://ci.foo.redhat.com/subscriptions/rhel?dolor=sit#lorem',
      callback: () => {
        expect({
          routeHref: getNavigationDetail({ pathname: '/rhel' }).routeHref
        }).toMatchSnapshot('search and hash');
      }
    });
  });
});
