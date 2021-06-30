import {
  routerHelpers,
  dynamicBaseName,
  dynamicBasePath,
  getErrorRoute,
  getRouteConfig,
  getRouteConfigByPath
} from '../routerHelpers';
import { routes } from '../../../config/routes';

describe('RouterHelpers', () => {
  it('should return specific properties', () => {
    const { routesConfig, ...helpers } = routerHelpers;
    expect(routesConfig).toBeDefined();
    expect({ ...helpers }).toMatchSnapshot('routerHelpers');
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
      id: getRouteConfig({ id: 'optin' })?.id
    }).toMatchSnapshot('detail: specific route ID');

    expect({
      id: getRouteConfig({ id: 'rhel-arm' })?.id
    }).toMatchSnapshot('detail: specific navigation ID');

    expect({
      id: getRouteConfig({ pathName: '/rhel' })?.id
    }).toMatchSnapshot('detail: match specific path navigation');

    expect({
      id: getRouteConfig({ id: 'lorem-missing', pathName: '/rhel' })?.id
    }).toMatchSnapshot('detail: missing ID, specific path');

    expect({
      id: getRouteConfig({ id: 'lorem', pathName: '/lorem-ipsum-missing', returnDefault: true })?.id
    }).toMatchSnapshot('detail: missing id and pathName, default');

    expect({
      id: getRouteConfig({ id: 'lorem', pathName: '/lorem-ipsum-missing', returnDefault: false })?.id
    }).toMatchSnapshot('detail: missing id and pathName and default');

    expect({
      id: getRouteConfig({})?.id
    }).toMatchSnapshot('detail: missing parameters');
  });

  it('should return default navigation and route details', () => {
    mockWindowLocation(
      () => {
        const { allConfigs, allConfigsById, ...matchingConfigs } = getRouteConfigByPath();

        expect(allConfigs.length).toBe(routes.length);
        expect(Object.entries(allConfigsById).length).toBe(routes.length);
        expect(matchingConfigs).toMatchSnapshot('detail: defaults');
      },
      {
        url: 'https://ci.foo.redhat.com/loremIpsum/dolorSit/'
      }
    );
  });

  it('should return navigation and route details from a path', () => {
    expect({
      id: getRouteConfigByPath({ pathName: '/rhel' }).firstMatch?.id
    }).toMatchSnapshot('detail: match specific path');

    expect({
      id: getRouteConfigByPath({ pathName: '/rhel-arm' }).firstMatch?.id
    }).toMatchSnapshot('detail: specific product path');

    expect({
      id: getRouteConfigByPath({ pathName: '/lorem-ipsum-missing' }).firstMatch?.id
    }).toMatchSnapshot('detail: missing pathName');

    expect({
      id: getRouteConfigByPath({}).firstMatch?.id
    }).toMatchSnapshot('detail: missing parameters');
  });

  it('should return navigation and route details from a related name', () => {
    expect({
      id: getRouteConfigByPath({ pathName: '/lorem-ipsum/RHEL%20for%20ARM' }).firstMatch?.id
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
