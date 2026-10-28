import {
  routerHelpers,
  cleanPath,
  dynamicBaseName,
  dynamicBasePath,
  getProductPath,
  getRouteConfigByPath,
  isProductPathId,
  OIDC_FRAGMENT_PARAMS,
  parseSearchParams,
  pathJoin,
  sanitizeOidcParams
} from '../routerHelpers';
import { helpers } from '../../../common';
import { RHSM_API_PATH_PRODUCT_TYPES } from '../../../services/rhsm/rhsmConstants';

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

  it('should remove OIDC params while preserving legitimate URL parameters', () => {
    expect(
      sanitizeOidcParams({
        search: '?lorem=ipsum&state=abc123&code=xyz789',
        hash: '#anchor&session_state=def456'
      })
    ).toEqual({
      search: '?lorem=ipsum',
      hash: '#anchor'
    });
  });

  it('should remove every reserved OIDC parameter from query and fragment', () => {
    const reservedParams = OIDC_FRAGMENT_PARAMS.map(param => `${param}=value`).join('&');

    expect(
      sanitizeOidcParams({
        search: `?lorem=ipsum&${reservedParams}`,
        hash: `#anchor&${reservedParams}`
      })
    ).toEqual({
      search: '?lorem=ipsum',
      hash: '#anchor'
    });
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
    {
      path: '/Test%20Variant%20space',
      expected: 'Test Variant space',
      description: 'encoded characters'
    },
    {
      path: '/test-variant-hyphen',
      expected: 'test-variant-hyphen',
      description: 'hyphenated variant'
    },
    {
      path: 'test-alias',
      expected: 'TestProduct',
      description: 'alias'
    },
    {
      path: '/TestProduct',
      expected: 'TestProduct',
      description: 'product id'
    },
    {
      path: '/lorem-ipsum/test-variant-hyphen',
      expected: 'test-variant-hyphen',
      description: 'nested path'
    },
    {
      path: `https://ci.foo.redhat.com/${helpers.UI_DISPLAY_NAME}/TestProduct`,
      expected: 'TestProduct',
      description: 'full URL'
    },
    {
      path: `lorem-ipsum/${helpers.UI_DISPLAY_NAME}/dolor-sit/TestProduct`,
      expected: 'TestProduct',
      description: 'additional paths with no root'
    },
    {
      path: '/TestProduct?query=param',
      expected: 'TestProduct',
      description: 'URL with search params'
    },
    {
      path: '/TestProduct?query=param#hash',
      expected: 'TestProduct',
      description: 'URL with search and hash'
    }
  ])('should handle route and config matching, $description: $path', ({ path, expected }) => {
    const result = getRouteConfigByPath({ pathName: path, configs: customConfigs });
    expect(result.isClosest).toBe(false);
    expect(result.firstMatch?.productId).toBe(expected);
  });

  it.each([
    {
      path: '/test-invalid-variant',
      description: 'invalid variant uses non exact match'
    },
    {
      path: '/lorem-ipsum-missing',
      description: 'missing path uses non exact match'
    }
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

describe('isProductPathId', () => {
  it.each([
    { pathId: 'rhel', expected: true, description: 'a product group and path' },
    { pathId: 'RHEL', expected: true, description: 'a product label, case insensitive' },
    { pathId: 'insights', expected: true, description: 'an alias' },
    { pathId: 'openshift', expected: true, description: 'another product group' },
    { pathId: RHSM_API_PATH_PRODUCT_TYPES.RHEL_ARM, expected: true, description: 'a variant containing spaces' },
    {
      pathId: encodeURIComponent(RHSM_API_PATH_PRODUCT_TYPES.RHEL_ARM),
      expected: true,
      description: 'an encoded variant'
    },
    { pathId: 'rhel-for-x86-els-payg', expected: true, description: 'a hyphenated variant' },
    { pathId: 'usage', expected: false, description: 'a mount point segment' },
    { pathId: helpers.UI_NAME, expected: false, description: 'the application name segment' },
    { pathId: 'rhel-for-arm', expected: false, description: 'a slug that only resolves through closest match' },
    { pathId: '', expected: false, description: 'an empty segment' },
    { pathId: undefined, expected: false, description: 'a missing segment' }
  ])('should identify $description: $pathId', ({ pathId, expected }) => {
    expect(isProductPathId({ pathId })).toBe(expected);
  });

  it('should tolerate a malformed percent-encoded segment', () => {
    expect(isProductPathId({ pathId: '%E0%A4%A' })).toBe(false);
  });
});

describe('getProductPath', () => {
  /**
   * Treat "lorem", "ipsum", and the group "dolor" as the only known product identifiers,
   * isolating path manipulation from product configuration.
   *
   * @param {object} params
   * @param {string} params.pathId
   * @returns {boolean}
   */
  const mockIsProductPathId = ({ pathId }) => ['lorem', 'ipsum', 'dolor'].includes(pathId);

  /**
   * Resolve "ipsum" to the product group "dolor".
   *
   * @returns {{firstMatch: {productPath: string}}}
   */
  const mockGetRouteConfigByPath = () => ({ firstMatch: { productPath: 'dolor' } });

  const mocks = {
    getRouteConfigByPath: mockGetRouteConfigByPath,
    isProductPathId: mockIsProductPathId
  };

  it.each([
    {
      pathName: '/subscriptions/usage/dolor',
      expected: '/subscriptions/usage/dolor/ipsum',
      description: 'nest below the group path'
    },
    {
      pathName: '/subscriptions/usage/dolor/lorem',
      expected: '/subscriptions/usage/dolor/ipsum',
      description: 'replace an existing variant rather than accumulate'
    },
    {
      pathName: '/subscriptions/usage/lorem',
      expected: '/subscriptions/usage/dolor/ipsum',
      description: 'canonicalize a flat variant path'
    },
    {
      pathName: '/subscriptions/usage',
      expected: '/subscriptions/usage/dolor/ipsum',
      description: 'append when the mount point carries no product'
    },
    {
      pathName: '/subscriptions/usage/',
      expected: '/subscriptions/usage/dolor/ipsum',
      description: 'normalize a trailing slash'
    },
    {
      pathName: '/insights/subscriptions',
      expected: '/insights/subscriptions/dolor/ipsum',
      description: 'append for an alternate mount point'
    },
    {
      pathName: '/openshift/subscriptions/dolor',
      expected: '/openshift/subscriptions/dolor/ipsum',
      description: 'nest for an alternate mount point'
    },
    {
      pathName: '/beta/subscriptions/usage/dolor/lorem',
      expected: '/beta/subscriptions/usage/dolor/ipsum',
      description: 'preserve an environment prefix'
    },
    {
      pathName: '/',
      expected: '/dolor/ipsum',
      description: 'handle a root path'
    },
    {
      pathName: '',
      expected: '/dolor/ipsum',
      description: 'handle an empty path'
    }
  ])('should $description: $pathName', ({ pathName, expected }) => {
    expect(getProductPath({ pathName, productId: 'ipsum', ...mocks })).toBe(expected);
  });

  it('should return the path unchanged without a productId', () => {
    expect(getProductPath({ pathName: '/subscriptions/usage/lorem', ...mocks })).toBe('/subscriptions/usage/lorem');
  });

  it('should omit a duplicate segment when the product is its own group', () => {
    expect(
      getProductPath({
        pathName: '/subscriptions/usage',
        productId: 'dolor',
        ...mocks
      })
    ).toBe('/subscriptions/usage/dolor');
  });

  it('should nest and encode a product identifier containing spaces', () => {
    expect(
      getProductPath({
        pathName: '/subscriptions/usage/rhel',
        productId: RHSM_API_PATH_PRODUCT_TYPES.RHEL_ARM
      })
    ).toBe('/subscriptions/usage/rhel/RHEL%20for%20ARM');
  });

  it('should replace an already encoded variant segment', () => {
    expect(
      getProductPath({
        pathName: `/subscriptions/usage/rhel/${encodeURIComponent(RHSM_API_PATH_PRODUCT_TYPES.RHEL_ARM)}`,
        productId: 'rhel-for-x86-els-payg'
      })
    ).toBe('/subscriptions/usage/rhel/rhel-for-x86-els-payg');
  });

  it('should nest an openshift group variant below its own group', () => {
    expect(
      getProductPath({
        pathName: '/subscriptions/usage/openshift',
        productId: RHSM_API_PATH_PRODUCT_TYPES.RHACM
      })
    ).toBe('/subscriptions/usage/openshift/rhacm');
  });

  it.each([
    { productId: RHSM_API_PATH_PRODUCT_TYPES.RHEL_ARM, description: 'a variant containing spaces' },
    { productId: 'rhel-for-x86-els-payg', description: 'a hyphenated variant' },
    { productId: RHSM_API_PATH_PRODUCT_TYPES.SATELLITE_SERVER, description: 'a satellite variant' },
    { productId: RHSM_API_PATH_PRODUCT_TYPES.RHACM, description: 'an openshift group variant' }
  ])('should produce a path that routes back to $description', ({ productId }) => {
    const pathName = getProductPath({ pathName: '/subscriptions/usage/rhel', productId });
    const { firstMatch, isClosest } = getRouteConfigByPath({ pathName });

    expect(isClosest).toBe(false);
    expect(firstMatch?.productId).toBe(productId);
  });
});
