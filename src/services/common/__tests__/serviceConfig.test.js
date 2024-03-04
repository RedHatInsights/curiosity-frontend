import moxios from 'moxios';
import { serviceConfig } from '../serviceConfig';

describe('ServiceConfig', () => {
  // Return a promise, or promise like, response for errors
  const returnPromiseAsync = async promiseAsyncCall => {
    let response;

    try {
      response = await promiseAsyncCall();
    } catch (e) {
      response = e.response || e.message || e;
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

    moxios.stubRequest(/\/(test|pollSuccess).*?/, {
      status: 200,
      responseText: 'success',
      timeout: 1
    });

    moxios.stubRequest(/\/(error|pollError).*?/, {
      status: 404,
      responseText: 'error',
      timeout: 1
    });
  });

  afterAll(() => {
    moxios.uninstall();
    jest.clearAllMocks();
  });

  it('should have specific properties and methods', () => {
    expect(Object.keys(serviceConfig)).toMatchSnapshot('specific props and methods');
  });

  it('should handle producing a service call configuration', async () => {
    const config = [];

    const responseOne = await serviceConfig.axiosServiceCall({
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

  it('should use a package that removes undefined, null parameters instead of applying them as empty values', async () => {
    const requestUndefined = await returnPromiseAsync(() =>
      Promise.all([
        serviceConfig.axiosServiceCall({ url: '/test/all', method: 'get', params: { lorem: 'ipsum' } }),
        serviceConfig.axiosServiceCall({ url: '/test/all', method: 'get', params: { lorem: undefined } })
      ])
    );

    const requestNull = await returnPromiseAsync(() =>
      Promise.all([
        serviceConfig.axiosServiceCall({ url: '/test/all', method: 'get', params: { dolor: 'sit' } }),
        serviceConfig.axiosServiceCall({ url: '/test/all', method: 'get', params: { dolor: null } })
      ])
    );

    expect({
      requestUndefined:
        (Array.isArray(requestUndefined) &&
          requestUndefined.map(({ request, config }) => ({
            url: request.url,
            params: config.params
          }))) ||
        requestUndefined,
      requestNull:
        (Array.isArray(requestNull) &&
          requestNull.map(({ request, config }) => ({
            url: request.url,
            params: config.params
          }))) ||
        requestNull
    }).toMatchSnapshot('undefined, null params');
  });

  it('should handle cancelling service calls', async () => {
    // Highlight cancel takes into account url and method
    const responseAll = await returnPromiseAsync(() =>
      Promise.all([
        serviceConfig.axiosServiceCall({ url: '/test/all', cancel: true }),
        serviceConfig.axiosServiceCall({ url: '/test/all', method: 'post', cancel: true }),
        serviceConfig.axiosServiceCall({ url: '/test/all', method: 'post', cancel: true }),
        serviceConfig.axiosServiceCall({ url: '/test/all', cancel: true }),
        serviceConfig.axiosServiceCall({ url: '/test/all', cancel: true })
      ])
    );

    expect(responseAll).toMatchSnapshot('cancelled request, Promise.all');

    // Highlight cancel takes into account url and method
    const responseAllSettled = await returnPromiseAsync(() =>
      Promise.allSettled([
        serviceConfig.axiosServiceCall({ url: '/test/allsettled', cancel: true }),
        serviceConfig.axiosServiceCall({ url: '/test/allsettled', method: 'post', cancel: true }),
        serviceConfig.axiosServiceCall({ url: '/test/allsettled', method: 'post', cancel: true }),
        serviceConfig.axiosServiceCall({ url: '/test/allsettled', cancel: true }),
        serviceConfig.axiosServiceCall({ url: '/test/allsettled', cancel: true })
      ])
    );

    expect(responseAllSettled).toMatchSnapshot('cancelled request, Promise.allSettled');
  });

  it('should handle caching service calls', async () => {
    const responses = [];

    // First, call an endpoint with set params
    const responseOne = await serviceConfig.axiosServiceCall({
      cache: true,
      url: '/test/',
      params: { lorem: 'ipsum', dolor: 'sit' },
      exposeCacheId: true
    });
    responses.push(
      `1. method=get, status=${responseOne.status}, cacheId=${responseOne.request.config.cacheId}, desc=initial call`
    );

    // Second, call the same endpoint with same params, expect a cached response, emulated 304
    const responseTwo = await serviceConfig.axiosServiceCall({
      cache: true,
      url: '/test/',
      params: { lorem: 'ipsum', dolor: 'sit' },
      exposeCacheId: true
    });
    responses.push(
      `2. method=get, status=${responseTwo.status}, cacheId=${responseTwo.request.config.cacheId}, desc=repeat 1st call and config`
    );

    // Third, updating config creates a new cache
    const responseThree = await serviceConfig.axiosServiceCall({
      cache: true,
      url: '/test/',
      params: { lorem: 'ipsum' },
      exposeCacheId: true
    });
    responses.push(
      `3. method=get, status=${responseThree.status}, cacheId=${responseThree.request.config.cacheId}, desc=updated config`
    );

    // Fourth, confirm cache isn't created for other methods, i.e. post
    const responseFour = await serviceConfig.axiosServiceCall({
      cache: true,
      method: 'post',
      url: '/test/',
      params: { lorem: 'ipsum' },
      exposeCacheId: true
    });
    responses.push(
      `4. method=post, status=${responseFour.status}, cacheId=${responseFour.request.config.cacheId}, desc=attempt post method`
    );

    // Fifth, confirm cache exists from responseThree
    const responseFive = await serviceConfig.axiosServiceCall({
      cache: true,
      url: '/test/',
      params: { lorem: 'ipsum' },
      exposeCacheId: true
    });
    responses.push(
      `5. method=get, status=${responseFive.status}, cacheId=${responseFive.request.config.cacheId}, desc=repeat 3rd call and config`
    );

    // Six, don't use a cache
    const responseSix = await serviceConfig.axiosServiceCall({
      cache: false,
      url: '/test/',
      params: { lorem: 'ipsum' },
      exposeCacheId: true
    });
    responses.push(
      `6. method=get, status=${responseSix.status}, cacheId=${responseSix.request.config.cacheId}, desc=no caching`
    );

    expect(responses).toMatchSnapshot('cached responses, emulated 304');
  });

  it('should handle transforming service call responses', async () => {
    const responses = [];

    // First, since it happens before other transformations, use the schema transform
    const responseOne = await serviceConfig.axiosServiceCall({
      cache: true,
      url: '/test/',
      schema: [successResponse => `${successResponse}-schema-transform`]
    });
    responses.push(responseOne.data);

    // Second, use a transform
    const responseTwo = await serviceConfig.axiosServiceCall({
      cache: true,
      url: '/test/',
      transform: [successResponse => `${successResponse}-transform`]
    });
    responses.push(responseTwo.data);

    // Second-Error, use a transform but expect an error
    const responseTwoError = await serviceConfig.axiosServiceCall({
      cache: true,
      url: '/test/',
      transform: [
        () => {
          throw new Error('success response transform error');
        }
      ]
    });
    responses.push(responseTwoError.data);

    // Third, use error transform
    const responseThree = await returnPromiseAsync(async () =>
      serviceConfig.axiosServiceCall({
        cache: true,
        url: '/error/',
        transform: [
          successResponse => `${successResponse}-transform`,
          errorResponse => `${errorResponse}-error-transform`
        ]
      })
    );
    responses.push(responseThree.data);

    // Third-Error, use error transform
    const responseThreeError = await returnPromiseAsync(async () =>
      serviceConfig.axiosServiceCall({
        cache: true,
        url: '/error/',
        transform: [
          successResponse => `${successResponse}-transform`,
          () => {
            throw new Error('error response transform error');
          }
        ]
      })
    );
    responses.push(responseThreeError.data);

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
      serviceConfig.axiosServiceCall({
        ...responseFourConfig
      }),
      serviceConfig.axiosServiceCall({
        ...responseFourConfig
      })
    ]);

    responses.push(responseFour.map(({ reason }) => reason.message));

    expect(responses).toMatchSnapshot('transformed responses');
  });

  it('should handle polling service calls', async () => {
    const basicPollValidator = jest.fn();
    const basicOutput = await serviceConfig.axiosServiceCall(
      {
        cache: true,
        url: '/test/',
        poll: (response, count) => {
          basicPollValidator(response, count);
          return count === 1;
        }
      },
      { pollInterval: 1 }
    );

    expect(basicPollValidator).toHaveBeenCalledTimes(2);
    expect({
      validator: basicPollValidator.mock.calls.map(([response, count]) => ({
        success: {
          data: response.data,
          pollConfig: response.config.poll
        },
        count
      })),
      output: {
        pollConfig: basicOutput.config.poll,
        data: basicOutput.data
      }
    }).toMatchSnapshot('basic polling validator');

    const specificPollValidator = jest.fn();
    const specificOutput = await serviceConfig.axiosServiceCall(
      {
        cache: true,
        url: '/test/',
        poll: {
          validate: (response, count) => {
            specificPollValidator(response, count);
            return count === 1;
          }
        }
      },
      { pollInterval: 1 }
    );

    expect(specificPollValidator).toHaveBeenCalledTimes(2);
    expect({
      validator: specificPollValidator.mock.calls.map(([response, count]) => ({
        success: {
          data: response.data,
          pollConfig: response.config.poll
        },
        count
      })),
      output: {
        pollConfig: specificOutput.config.poll,
        data: specificOutput.data
      }
    }).toMatchSnapshot('specific polling validator');

    const statusPoll = jest.fn();
    const statusOutput = await serviceConfig.axiosServiceCall(
      {
        cache: true,
        url: '/test/',
        poll: {
          validate: (response, count) => count === 2,
          status: (success, err, count) => {
            statusPoll(success, err, count);
          }
        }
      },
      { pollInterval: 1 }
    );

    // delay to give the internal status promise time to unwrap
    await new Promise(resolve => {
      setTimeout(() => resolve(), 25);
    });

    expect(statusPoll).toHaveBeenCalledTimes(2);
    expect({
      status: statusPoll.mock.calls.map(([success, err, count]) => ({
        success: {
          data: success.data,
          pollConfig: success.config.poll
        },
        err,
        count
      })),
      output: {
        data: statusOutput.data,
        pollConfig: statusOutput.config.poll
      }
    }).toMatchSnapshot('status polling');

    const mockLocation = jest.fn().mockImplementation(() => '/pollSuccess/');
    const locationOutput = await serviceConfig.axiosServiceCall(
      {
        cache: true,
        url: '/test/',
        poll: {
          location: mockLocation,
          validate: (response, count) => count === 2
        }
      },
      { pollInterval: 1 }
    );

    expect(mockLocation).toHaveBeenCalledTimes(2);
    expect({
      validator: mockLocation.mock.calls.map(([success, count]) => ({
        success: {
          data: success.data,
          url: success.request.url,
          pollConfig: { ...success.config.poll, location: Function.prototype }
        },
        count
      })),
      output: {
        pollConfig: { ...locationOutput.config.poll, location: Function.prototype },
        data: locationOutput.data
      }
    }).toMatchSnapshot('custom location');
  });

  it('should handle polling service call errors', async () => {
    const consoleSpyError = jest.spyOn(console, 'error');

    await serviceConfig.axiosServiceCall(
      {
        cache: false,
        url: '/test/',
        poll: () => {
          throw new Error('basic validation error');
        }
      },
      { pollInterval: 1 }
    );
    expect(consoleSpyError.mock.calls).toMatchSnapshot('validation error');
    consoleSpyError.mockClear();

    await serviceConfig.axiosServiceCall(
      {
        cache: false,
        url: '/test/',
        poll: {
          validate: (response, count) => count === 1,
          location: () => {
            throw new Error('location string error');
          }
        }
      },
      { pollInterval: 1 }
    );

    // delay to give the internal status promise time to unwrap
    await new Promise(resolve => {
      setTimeout(() => resolve(), 25);
    });

    expect(consoleSpyError.mock.calls).toMatchSnapshot('location error');
    consoleSpyError.mockClear();

    const statusErrorPoll = jest.fn();
    await serviceConfig.axiosServiceCall(
      {
        cache: false,
        url: '/test/',
        poll: {
          location: '/pollError',
          validate: (response, count) => count === 5,
          status: (success, err, count) => {
            statusErrorPoll(success, err, count);
          }
        }
      },
      { pollInterval: 1 }
    );

    // delay to give the internal status promise time to unwrap
    await new Promise(resolve => {
      setTimeout(() => resolve(), 50);
    });

    expect(statusErrorPoll).toHaveBeenCalledTimes(1);
    expect({
      status: statusErrorPoll.mock.calls.map(([success, err, count]) => ({
        error: {
          data: err.response.data,
          pollConfig: err.config.poll
        },
        success,
        count
      }))
    }).toMatchSnapshot('status error polling');

    await serviceConfig.axiosServiceCall(
      {
        cache: false,
        url: '/test/',
        poll: {
          validate: (response, count) => count === 3,
          status: () => {
            throw new Error('status error');
          }
        }
      },
      { pollInterval: 1 }
    );

    // delay to give the internal status promise time to unwrap
    await new Promise(resolve => {
      setTimeout(() => resolve(), 25);
    });

    expect(consoleSpyError.mock.calls).toMatchSnapshot('status error');
    consoleSpyError.mockClear();

    const statusStatusErrorPoll = jest.fn();
    await serviceConfig.axiosServiceCall(
      {
        cache: false,
        url: '/test/',
        poll: {
          location: '/pollError',
          validate: (response, count) => count === 5,
          status: (success, err, count) => {
            statusStatusErrorPoll(success, err, count);
            throw new Error('status error');
          }
        }
      },
      { pollInterval: 1 }
    );

    // delay to give the internal status promise time to unwrap
    await new Promise(resolve => {
      setTimeout(() => resolve(), 25);
    });

    expect(statusStatusErrorPoll).toHaveBeenCalledTimes(1);
    expect({
      status: statusStatusErrorPoll.mock.calls.map(([success, err, count]) => ({
        error: {
          data: err.response.data,
          pollConfig: err.config.poll
        },
        success,
        count
      }))
    }).toMatchSnapshot('status of a status error polling');
    expect(consoleSpyError.mock.calls).toMatchSnapshot('status of a status error');
    consoleSpyError.mockClear();
  });

  it('should allow passing a function and emulating a service call', async () => {
    const responses = [];

    // First, pass a regular function similar to any service call
    const responseOne = await serviceConfig.axiosServiceCall({
      cache: true,
      url: () => 'lorem.ipsum'
    });
    responses.push(responseOne.data);

    // Second, pass a function similar to any service call, schema transform
    const responseTwo = await serviceConfig.axiosServiceCall({
      cache: true,
      url: () => Promise.resolve('lorem.ipsum'),
      schema: [successResponse => `${successResponse}-function-schema-transform`]
    });
    responses.push(responseTwo.data);

    // Third, pass a function similar to any service call, transform
    const responseThree = await serviceConfig.axiosServiceCall({
      cache: true,
      url: () => Promise.resolve('lorem.ipsum'),
      transform: [successResponse => `${successResponse}-function-transform`]
    });
    responses.push(responseThree.data);

    // Fourth, use error then return cached response
    const responseFour = await returnPromiseAsync(async () =>
      serviceConfig.axiosServiceCall({
        cache: true,
        url: () => Promise.reject(new Error('dolor.sit'))
      })
    );

    responses.push(responseFour.data);

    // Fifth, use reject error with transform
    const responseFive = await returnPromiseAsync(async () =>
      serviceConfig.axiosServiceCall({
        cache: true,
        url: () => Promise.reject(new Error('dolor.sit')),
        transform: [
          successResponse => `${successResponse}-transform`,
          errorResponse => `${errorResponse}-error-transform`
        ]
      })
    );

    responses.push(responseFive.data);

    // Sixth, use reject string with transform
    const responseSix = await returnPromiseAsync(async () =>
      serviceConfig.axiosServiceCall({
        cache: true,
        url: () => Promise.reject('dolor.sit'), // eslint-disable-line
        transform: [
          successResponse => `${successResponse}-transform`,
          errorResponse => `${errorResponse}-error-transform`
        ]
      })
    );

    responses.push(responseSix.data);

    expect(responses).toMatchSnapshot('function responses');
  });
});
