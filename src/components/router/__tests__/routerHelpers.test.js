import {
  routerHelpers,
  dynamicBaseName,
  dynamicBasePath,
  getRouteConfigByPath,
  parseSearchParams,
  pathJoin
} from '../routerHelpers';

describe('RouterHelpers', () => {
  it('should return specific properties', () => {
    const { routes, ...rest } = routerHelpers;
    expect(routes.map(value => value.path)).toMatchSnapshot('routerHelpers: routes');
    expect(rest).toMatchSnapshot('routerHelpers');
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

  it('should apply a simple pathJoin helper', () => {
    expect(pathJoin('/hello', 'world', 'lorem/', 'ipsum', '/dolor/')).toMatchSnapshot('single forward slash');
    expect(pathJoin('//hello', '/world', '/lorem/', 'ipsum', '/dolor')).toMatchSnapshot('double forward slash');
    expect(pathJoin('///hello', '/world', '//lorem/', 'ipsum', '//dolor')).toMatchSnapshot('triple forward slash');
    expect(pathJoin('/////hello', '///world////', '///////lorem///', 'ipsum', '///dolor')).toMatchSnapshot(
      'forward slashes everywhere'
    );
  });

  it('should return product configuration details from a url, path, or path-like id, or alias', () => {
    expect({
      productId: getRouteConfigByPath({ pathName: 'rhods' }).firstMatch?.productId
    }).toMatchSnapshot('detail: specific navigation ID');

    expect({
      productId: getRouteConfigByPath({ pathName: 'insights' }).firstMatch?.productId
    }).toMatchSnapshot('detail: alias insights');

    expect({
      productId: getRouteConfigByPath({ pathName: '/rhel' }).firstMatch?.productId
    }).toMatchSnapshot('detail: match specific path');

    expect({
      productId: getRouteConfigByPath({ pathName: '/lorem-ipsum/RHODS' }).firstMatch?.productId
    }).toMatchSnapshot('detail: specific product path');

    expect({
      productId: getRouteConfigByPath({ pathName: '/lorem-ipsum-missing' }).firstMatch?.productId
    }).toMatchSnapshot('detail: missing pathName');

    expect({
      productId: getRouteConfigByPath({}).firstMatch?.productId
    }).toMatchSnapshot('detail: missing parameters');

    expect({
      productId: getRouteConfigByPath({ pathName: 'https://ci.foo.redhat.com/subscriptions/rhel' }).firstMatch
        ?.productId
    }).toMatchSnapshot('NO search and hash');

    expect({
      productId: getRouteConfigByPath({ pathName: '/rhel?dolor=sit' }).firstMatch?.productId
    }).toMatchSnapshot('search');

    expect({
      productId: getRouteConfigByPath({ pathName: '/subscriptions/rhel?dolor=sit#lorem' }).firstMatch?.productId
    }).toMatchSnapshot('search and hash');
  });

  it('should return parse search parameters into unique key, value pairs', () => {
    expect(parseSearchParams('?lorem=ipsum&dolor=sit&lorem=hello%20world')).toMatchSnapshot('unique pairs');
  });
});
