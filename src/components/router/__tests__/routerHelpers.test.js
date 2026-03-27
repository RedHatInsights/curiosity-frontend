import {
  routerHelpers,
  cleanPath,
  dynamicBaseName,
  dynamicBasePath,
  getRouteConfigByPath,
  parseSearchParams,
  pathJoin
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

  it('should apply a simple pathJoin helper', () => {
    expect(pathJoin('/hello', 'world', 'lorem/', 'ipsum', '/dolor/')).toMatchSnapshot('single forward slash');
    expect(pathJoin('//hello', '/world', '/lorem/', 'ipsum', '/dolor')).toMatchSnapshot('double forward slash');
    expect(pathJoin('///hello', '/world', '//lorem/', 'ipsum', '//dolor')).toMatchSnapshot('triple forward slash');
    expect(pathJoin('/////hello', '///world////', '///////lorem///', 'ipsum', '///dolor')).toMatchSnapshot(
      'forward slashes everywhere'
    );
  });

  it('should return parse search parameters into unique key, value pairs', () => {
    expect(parseSearchParams('?lorem=ipsum&dolor=sit&lorem=hello%20world')).toMatchSnapshot('unique pairs');
  });
});

describe('cleanPath', () => {
  it('should decode percent-encoded characters', () => {
    expect(cleanPath({ pathName: '/RHEL%20for%20x86' })).toBe('rhel for x86');
  });
  it('should return undefined for undefined input', () => {
    expect(cleanPath({ pathName: undefined })).toBeUndefined();
  });
});

describe('product variant routing with custom configs', () => {
  const customConfig = {
    productId: 'TestProduct',
    aliases: ['test-alias']
  };

  const customConfigs = () => ({
    byAnything: {
      TestProduct: [customConfig],
      'test-variant-hyphen': [{ ...customConfig, productId: 'test-variant-hyphen' }],
      'Test Variant space': [{ ...customConfig, productId: 'Test Variant space' }],
      'test-alias': [customConfig]
    },
    byAnythingPathIds: ['TestProduct', 'test-variant-hyphen', 'Test Variant space', 'test-alias'],
    byAnythingVariants: {},
    byProductIdConfigs: {}
  });

  it.each([
    { path: '/Test%20Variant%20space', expected: 'Test Variant space' },
    { path: '/test-variant-hyphen', expected: 'test-variant-hyphen' }
  ])('should route $path to $expected with exact matching', ({ path, expected }) => {
    const result = getRouteConfigByPath({ pathName: path, configs: customConfigs });
    expect(result.isClosest).toBe(false);
    expect(result.firstMatch?.productId).toBe(expected);
  });

  it.each([
    { path: 'test-alias', expected: 'TestProduct', description: 'alias' },
    { path: '/TestProduct', expected: 'TestProduct', description: 'product id' },
    { path: '/lorem-ipsum/test-variant-hyphen', expected: 'test-variant-hyphen', description: 'nested path' },
    { path: 'https://ci.foo.redhat.com/subscriptions/TestProduct', expected: 'TestProduct', description: 'full URL' },
    { path: '/TestProduct?query=param', expected: 'TestProduct', description: 'URL with search params' },
    { path: '/TestProduct?query=param#hash', expected: 'TestProduct', description: 'URL with search and hash' }
  ])('should route $path ($description)', ({ path, expected }) => {
    const result = getRouteConfigByPath({ pathName: path, configs: customConfigs });
    expect(result.isClosest).toBe(false);
    expect(result.firstMatch?.productId).toBe(expected);
  });

  it.each([
    { path: '/test-invalid-variant', description: 'invalid variant uses non exact match' },
    { path: '/lorem-ipsum-missing', description: 'missing path uses non exact match' }
  ])('should use non exact matching for $description: $path', ({ path }) => {
    const result = getRouteConfigByPath({ pathName: path, configs: customConfigs });
    expect(result.isClosest).toBe(true);
    expect(result.firstMatch?.productId).toBeDefined();
  });

  it('should return undefined for missing parameters', () => {
    const result = getRouteConfigByPath({ configs: customConfigs });
    expect(result.firstMatch?.productId).toBeUndefined();
  });
});
