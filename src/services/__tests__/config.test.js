import moxios from 'moxios';
import * as service from '../config';

describe('ServiceConfig', () => {
  // Return a promise, or promise like, response for errors
  const returnPromiseAsync = async promiseAsyncCall => {
    let response;

    try {
      response = await promiseAsyncCall();
    } catch (e) {
      response = e;
    }

    return response;
  };

  // JSON stringify, and replace functions as strings
  const stringifyConfig = config =>
    JSON.stringify(
      config,
      (key, value) => {
        if (typeof value === 'function') {
          return value.toString();
        }
        return value;
      },
      2
    ).replace(new RegExp('\\"', 'g'), '');

  beforeAll(() => {
    moxios.install();

    moxios.stubRequest(/\/test.*?/, {
      status: 200,
      responseText: 'success',
      timeout: 1
    });

    moxios.stubRequest(/\/error.*?/, {
      status: 404,
      responseText: 'error',
      timeout: 1
    });
  });

  afterAll(() => {
    moxios.uninstall();
  });

  it('should export a specific number of methods and classes', () => {
    expect(Object.keys(service)).toHaveLength(4);
  });

  it('should export a default services config', () => {
    const configObject = service.serviceConfig();

    expect(Object.keys(configObject.headers).length).toBe(0);
    expect(configObject.timeout).toBe(process.env.REACT_APP_AJAX_TIMEOUT);
  });

  it('should export a customized services config', () => {
    const configObject = service.serviceConfig({
      method: 'post',
      timeout: 3
    });

    expect(configObject.method).toBe('post');
    expect(configObject.timeout).toBe(3);
  });

  it('should handle producing a service call configuration', async () => {
    const config = [];

    const responseOne = await service.serviceCall({
      cache: false,
      exposeCacheId: true,
      url: '/test/',
      params: { lorem: 'ipsum', dolor: 'sit' },
      schema: [successResponse => `${successResponse}-schema-transform`],
      transform: [successResponse => `${successResponse}-transform`]
    });
    config.push(stringifyConfig(responseOne.request.config));

    expect(config).toMatchSnapshot('response configs');
  });

  it('should handle a bundled authentication and service call', async () => {
    const response = await service.serviceCall({ url: '/test/' });

    expect(response.data).toBe('success');
  });

  it('should handle cancelling service calls', async () => {
    // Highlight cancel takes into account url and method
    const responseAll = await returnPromiseAsync(() =>
      Promise.all([
        service.serviceCall({ url: '/test/', cancel: true }),
        service.serviceCall({ url: '/test/', method: 'post', cancel: true }),
        service.serviceCall({ url: '/test/', method: 'post', cancel: true }),
        service.serviceCall({ url: '/test/', cancel: true }),
        service.serviceCall({ url: '/test/', cancel: true })
      ])
    );

    expect(responseAll).toMatchSnapshot('cancelled request, Promise.all');

    // Highlight cancel takes into account url and method
    const responseAllSettled = await returnPromiseAsync(() =>
      Promise.allSettled([
        service.serviceCall({ url: '/test/', cancel: true }),
        service.serviceCall({ url: '/test/', method: 'post', cancel: true }),
        service.serviceCall({ url: '/test/', method: 'post', cancel: true }),
        service.serviceCall({ url: '/test/', cancel: true }),
        service.serviceCall({ url: '/test/', cancel: true })
      ])
    );

    expect(responseAllSettled).toMatchSnapshot('cancelled request, Promise.allSettled');
  });

  it('should handle caching service calls', async () => {
    const responses = [];

    // First, call an endpoint with set params
    const responseOne = await service.serviceCall({
      cache: true,
      url: '/test/',
      params: { lorem: 'ipsum', dolor: 'sit' },
      exposeCacheId: true
    });
    responses.push(`1. method=get, status=${responseOne.status}, desc=initial call`);

    // Second, call the same endpoint with same params, expect a cached response, emulated 304
    const responseTwo = await service.serviceCall({
      cache: true,
      url: '/test/',
      params: { lorem: 'ipsum', dolor: 'sit' },
      exposeCacheId: true
    });
    responses.push(`2. method=get, status=${responseTwo.status}, desc=repeat 1st call and config`);

    // Third, updating config creates a new cache
    const responseThree = await service.serviceCall({
      cache: true,
      url: '/test/',
      params: { lorem: 'ipsum' },
      exposeCacheId: true
    });
    responses.push(`3. method=get, status=${responseThree.status}, desc=updated config`);

    // Fourth, confirm cache isn't created for other methods, i.e. post
    const responseFour = await service.serviceCall({
      cache: true,
      method: 'post',
      url: '/test/',
      params: { lorem: 'ipsum' },
      exposeCacheId: true
    });
    responses.push(`4. method=post, status=${responseFour.status}, desc=attempt post method`);

    // Fifth, confirm cache exists from responseThree
    const responseFive = await service.serviceCall({
      cache: true,
      url: '/test/',
      params: { lorem: 'ipsum' },
      exposeCacheId: true
    });
    responses.push(`5. method=get, status=${responseFive.status}, desc=repeat 3rd call and config`);

    // Six, don't use a cache
    const responseSix = await service.serviceCall({
      cache: false,
      url: '/test/',
      params: { lorem: 'ipsum' },
      exposeCacheId: true
    });
    responses.push(`6. method=get, status=${responseSix.status}, desc=no caching`);

    expect(responses).toMatchSnapshot('cached responses, emulated 304');
  });

  it('should handle transforming service call responses', async () => {
    const responses = [];

    // First, use the schema transform - alias for transform, but relates a sequence and happens before other transformations.
    const responseOne = await service.serviceCall({
      cache: true,
      url: '/test/',
      schema: [successResponse => `${successResponse}-schema-transform`]
    });
    responses.push(responseOne.data);

    // Second, use a transform
    const responseTwo = await service.serviceCall({
      cache: true,
      url: '/test/',
      transform: [successResponse => `${successResponse}-transform`]
    });
    responses.push(responseTwo.data);

    // Third, use error transform
    let responseThree;
    try {
      responseThree = await service.serviceCall({
        cache: true,
        url: '/error/',
        transform: [
          successResponse => `${successResponse}-transform`,
          errorResponse => `${errorResponse}-error-transform`
        ]
      });
    } catch (e) {
      responseThree = e.response || e;
    }

    responses.push(responseThree.data);

    // Fourth, use error transform with cancel
    const responseFourConfig = {
      cache: true,
      cancel: true,
      url: '/error/',
      transform: [
        successResponse => `${successResponse}-transform`,
        errorResponse => `${errorResponse}-cancel-transform`
      ]
    };

    const responseFour = await Promise.allSettled([
      service.serviceCall({
        ...responseFourConfig
      }),
      service.serviceCall({
        ...responseFourConfig
      })
    ]);

    responses.push(responseFour.map(({ reason }) => reason.message));

    expect(responses).toMatchSnapshot('transformed responses');
  });
});
