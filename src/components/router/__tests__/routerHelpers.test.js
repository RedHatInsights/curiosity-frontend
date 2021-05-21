import {
  routerHelpers,
  dynamicBaseName,
  dynamicBasePath,
  getErrorRoute,
  getRouteConfig,
  getRouteConfigByPath
} from '../routerHelpers';

describe('RouterHelpers', () => {
  it('should return specific properties', () => {
    expect(routerHelpers).toMatchSnapshot('routerHelpers');
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

  it('should return a generated basePath', () => {
    expect(
      dynamicBasePath({
        pathName: '/insights/appName',
        appName: 'appName'
      })
    ).toMatchSnapshot('insights, app base path');

    expect(
      dynamicBasePath({
        pathName: '/beta/insights/appName',
        appName: 'appName'
      })
    ).toMatchSnapshot('insights, beta app base path');

    expect(
      dynamicBasePath({
        pathName: '/insights/appName/loremRoute',
        appName: 'appName'
      })
    ).toMatchSnapshot('insights, app lorem route name base path');

    expect(
      dynamicBasePath({
        pathName: '/beta/insights/appName/loremRoute',
        appName: 'appName'
      })
    ).toMatchSnapshot('insights, beta app lorem route name base path');
  });

  it('should return an error route', () => {
    expect(getErrorRoute).toMatchSnapshot('error route');
  });

  it('should return navigation and route details that align to location', () => {
    expect({
      navRoute: getRouteConfig({ id: 'optin' })
    }).toMatchSnapshot('detail: specific route ID');

    expect({
      navRoute: getRouteConfig({ id: 'rhel-arm' })
    }).toMatchSnapshot('detail: specific navigation ID');

    expect({
      navRoute: getRouteConfig({ pathName: '/rhel' })
    }).toMatchSnapshot('detail: match specific path navigation');

    expect({
      navRoute: getRouteConfig({ id: 'lorem-missing', pathName: '/rhel' })
    }).toMatchSnapshot('detail: missing ID, specific path');

    expect({
      navRoute: getRouteConfig({ id: 'lorem', pathName: '/lorem-ipsum-missing', returnDefault: true })
    }).toMatchSnapshot('detail: missing id and pathName, default');

    expect({
      navRoute: getRouteConfig({ id: 'lorem', pathName: '/lorem-ipsum-missing', returnDefault: false })
    }).toMatchSnapshot('detail: missing id and pathName and default');

    expect({
      navRoute: getRouteConfig({})
    }).toMatchSnapshot('detail: missing parameters');
  });

  it('should return default navigation and route details', () => {
    mockWindowLocation(
      () => {
        expect({
          navRoute: getRouteConfigByPath()
        }).toMatchSnapshot('detail: defaults');
      },
      {
        url: 'https://ci.foo.redhat.com/loremIpsum/dolorSit/'
      }
    );
  });

  it('should return navigation and route details from a path', () => {
    expect({
      navRoute: getRouteConfigByPath({ pathName: '/rhel' }).firstMatch
    }).toMatchSnapshot('detail: match specific path');

    expect({
      navRoute: getRouteConfigByPath({ pathName: '/rhel-arm' }).firstMatch
    }).toMatchSnapshot('detail: specific product path');

    expect({
      navRoute: getRouteConfigByPath({ pathName: '/lorem-ipsum-missing' }).firstMatch
    }).toMatchSnapshot('detail: missing pathName');

    expect({
      navRoute: getRouteConfigByPath({}).firstMatch
    }).toMatchSnapshot('detail: missing parameters');
  });

  it('should return navigation and route details from a related name', () => {
    expect({
      navRoute: getRouteConfigByPath({ pathName: '/lorem-ipsum/RHEL%20for%20ARM' }).firstMatch
    }).toMatchSnapshot('detail: match related name');
  });

  it('should handle location search and hash passthrough values', () => {
    mockWindowLocation(
      () => {
        expect({
          routeHref: getRouteConfig({ pathName: '/rhel' }).routeHref
        }).toMatchSnapshot('NO search and hash');
      },
      {
        url: 'https://ci.foo.redhat.com/subscriptions/rhel'
      }
    );

    mockWindowLocation(
      () => {
        expect({
          routeHref: getRouteConfig({ pathName: '/rhel' }).routeHref
        }).toMatchSnapshot('search');
      },
      {
        url: 'https://ci.foo.redhat.com/subscriptions/rhel?dolor=sit'
      }
    );

    mockWindowLocation(
      () => {
        expect({
          routeHref: getRouteConfig({ pathName: '/rhel' }).routeHref
        }).toMatchSnapshot('hash');
      },
      {
        url: 'https://ci.foo.redhat.com/subscriptions/rhel#lorem'
      }
    );

    mockWindowLocation(
      () => {
        expect({
          routeHref: getRouteConfig({ pathName: '/rhel' }).routeHref
        }).toMatchSnapshot('search and hash');
      },
      {
        url: 'https://ci.foo.redhat.com/subscriptions/rhel?dolor=sit#lorem'
      }
    );
  });
});
