import { waitFor } from '@testing-library/dom';
import moxios from 'moxios';
import { serviceConfig } from '../serviceConfig';

/**
 * Describe poll configuration with stable fields.
 * Function identity and Axios timing stay out of the comparison.
 *
 * @param {Function|object} pollConfig Poll callback or normalized poll configuration.
 * @returns {string|object|undefined}
 */
const describePoll = pollConfig => {
  if (typeof pollConfig === 'function') {
    return 'callback';
  }

  if (pollConfig == null) {
    return undefined;
  }

  const { location } = pollConfig;
  let describedLocation;

  if (typeof location === 'function') {
    describedLocation = 'callback';
  } else if (location == null) {
    describedLocation = undefined;
  } else {
    describedLocation = {
      url: typeof location.url === 'function' ? 'callback' : location.url,
      config: location.config
    };
  }

  return {
    retryCount: pollConfig.__retryCount,
    pollInterval: pollConfig.pollInterval,
    location: describedLocation,
    hasValidate: typeof pollConfig.validate === 'function',
    hasStatusCallback: typeof pollConfig.status === 'function'
  };
};

/**
 * Stable fields from one poll validator or status callback invocation.
 * The callback receives a cloned response, so function identity on that clone is not compared.
 *
 * @param {Array} call Arguments passed to the callback, `[response, count]`.
 * @returns {object}
 */
const describePollCall = call => {
  const [response, count] = call;
  const pollConfig = response?.config?.poll;
  const location = pollConfig?.location;
  let locationUrl;

  if (location && typeof location === 'object') {
    locationUrl = typeof location.url === 'function' ? 'callback' : location.url;
  }

  return {
    count,
    data: response?.data,
    error: response?.error,
    url: response?.request?.url,
    retryCount: pollConfig?.__retryCount,
    pollInterval: pollConfig && typeof pollConfig === 'object' ? pollConfig.pollInterval : undefined,
    locationUrl
  };
};

/**
 * Stable fields from a fulfilled or cancelled service call.
 * Elapsed duration and the rest of the Axios object stay out of the comparison.
 *
 * @param {PromiseSettledResult} result One `Promise.allSettled` entry.
 * @returns {object}
 */
const describeSettledCall = result => {
  if (result.status === 'rejected') {
    return {
      status: 'rejected',
      message: result.reason?.message
    };
  }

  return {
    status: 'fulfilled',
    httpStatus: result.value?.status,
    data: result.value?.data,
    method: result.value?.config?.method,
    url: result.value?.config?.url
  };
};

/**
 * The poll interval a callback observes for a given retry count when the call passes `pollInterval: 0`.
 * A poll interval of `0` is treated as missing, so every retry after the first falls back to the
 * global interval.
 *
 * @param {number} count Internal retry count, `-1` for the initial, pre-poll invocation.
 * @returns {number|undefined}
 */
const expectedPollInterval = count => {
  if (count < 0) {
    return undefined;
  }

  return count === 0 ? 0 : serviceConfig.globalPollInterval;
};

/**
 * Expected `describePollCall` summary for a single poll callback invocation.
 * Defaults describe the initial, pre-poll invocation, i.e. no response and no location, override per test.
 *
 * @param {number} count Internal retry count, `-1` for the initial, pre-poll invocation.
 * @param {object} overrides Fields that differ for the test under comparison.
 * @returns {object}
 */
const expectedPollCall = (count, overrides = {}) => ({
  count,
  data: undefined,
  error: undefined,
  url: undefined,
  retryCount: count < 0 ? undefined : count,
  pollInterval: expectedPollInterval(count),
  locationUrl: undefined,
  ...overrides
});

/**
 * Expected `describePollCall` summaries for a validate callback polling a single, successful url.
 *
 * @param {string} url
 * @returns {Array<object>}
 */
const expectedValidatePollCalls = (url = '/test/') => [
  expectedPollCall(-1, { data: 'success', url }),
  expectedPollCall(0, { data: 'success', url, locationUrl: url }),
  expectedPollCall(1, { data: 'success', url, locationUrl: url })
];

/**
 * Expected `describePollCall` summaries for a status callback that only observes an errored poll.
 *
 * @param {string} locationUrl
 * @returns {Array<object>}
 */
const expectedErrorStatusPollCalls = (locationUrl = '/pollError') => [
  expectedPollCall(-1),
  expectedPollCall(0, { error: true, locationUrl })
];

/**
 * Expected `describePoll` summary for the poll configuration left on a resolved response.
 * Defaults describe a validate callback that polled its original url, override per test.
 *
 * @param {object} overrides Fields that differ for the test under comparison.
 * @returns {object}
 */
const expectedPollConfig = (overrides = {}) => ({
  retryCount: 1,
  pollInterval: serviceConfig.globalPollInterval,
  location: { url: '/test/', config: undefined },
  hasValidate: true,
  hasStatusCallback: false,
  ...overrides
});

describe('ServiceConfig', () => {
  beforeEach(() => {
    moxios.install();
    moxios.stubRequest(/\/(test).*?/, {
      status: 200,
      responseText: 'success',
      timeout: 0
    });
  });

  afterEach(() => {
    moxios.uninstall();
    jest.clearAllMocks();
  });

  it('should have specific properties and methods', () => {
    expect(Object.keys(serviceConfig)).toEqual([
      'axiosServiceCall',
      'globalXhrTimeout',
      'globalPollInterval',
      'globalCancelTokens',
      'globalResponseCache'
    ]);
    expect(serviceConfig.axiosServiceCall).toEqual(expect.any(Function));
    expect(serviceConfig.globalXhrTimeout).toEqual(expect.any(Number));
    expect(serviceConfig.globalPollInterval).toEqual(expect.any(Number));
    expect(serviceConfig.globalCancelTokens).toEqual(expect.any(Object));
    expect(serviceConfig.globalResponseCache).toBeDefined();
  });

  it('should handle producing a consistent service call configuration', async () => {
    const callConfig = {
      cache: false,
      exposeCacheId: true,
      url: '/test/',
      params: { lorem: 'ipsum', dolor: 'sit' },
      schema: [successResponse => `${successResponse}-schema-transform`],
      transform: [successResponse => `${successResponse}-transform`]
    };
    const response = await serviceConfig.axiosServiceCall(callConfig);
    const repeated = await serviceConfig.axiosServiceCall(callConfig);

    const stableConfig = ({ method, url, params, timeout, cacheResponse, cacheId }) => ({
      method,
      url,
      params,
      timeout,
      cacheResponse,
      cacheId
    });

    expect(response.status).toBe(200);
    expect(response.data).toBe('success-schema-transform-transform');
    expect(stableConfig(response.config)).toEqual({
      method: 'get',
      url: '/test/',
      params: { lorem: 'ipsum', dolor: 'sit' },
      timeout: serviceConfig.globalXhrTimeout,
      cacheResponse: false,
      cacheId: null
    });
    expect(stableConfig(repeated.config)).toEqual(stableConfig(response.config));
    expect(repeated.data).toBe(response.data);
  });
});

describe('Cancel service calls', () => {
  beforeEach(() => {
    moxios.install();
    moxios.stubRequest(/\/(test).*?/, {
      status: 200,
      responseText: 'success',
      timeout: 0
    });
  });

  afterEach(() => {
    moxios.uninstall();
    jest.clearAllMocks();
  });

  it('should handle cancelling service calls', async () => {
    // Cancel takes url and method into account, so the grouped call rejects on the cancelled request.
    await expect(
      Promise.all([
        serviceConfig.axiosServiceCall({ url: '/test/all', cancel: true }),
        serviceConfig.axiosServiceCall({ url: '/test/all', method: 'post', cancel: true }),
        serviceConfig.axiosServiceCall({ url: '/test/all', method: 'post', cancel: true }),
        serviceConfig.axiosServiceCall({ url: '/test/all', cancel: true }),
        serviceConfig.axiosServiceCall({ url: '/test/all', cancel: true })
      ])
    ).rejects.toMatchObject({
      message: 'cancelled request'
    });

    const settled = await Promise.allSettled([
      serviceConfig.axiosServiceCall({ url: '/test/allsettled', cancel: true }),
      serviceConfig.axiosServiceCall({ url: '/test/allsettled', method: 'post', cancel: true }),
      serviceConfig.axiosServiceCall({ url: '/test/allsettled', method: 'post', cancel: true }),
      serviceConfig.axiosServiceCall({ url: '/test/allsettled', cancel: true }),
      serviceConfig.axiosServiceCall({ url: '/test/allsettled', cancel: true })
    ]);
    const summarized = settled.map(describeSettledCall);

    expect(summarized.filter(result => result.status === 'rejected')).toEqual([
      { status: 'rejected', message: 'cancelled request' },
      { status: 'rejected', message: 'cancelled request' }
    ]);
    expect(summarized.filter(result => result.status === 'fulfilled')).toEqual([
      { status: 'fulfilled', httpStatus: 200, data: 'success', method: 'post', url: '/test/allsettled' },
      { status: 'fulfilled', httpStatus: 200, data: 'success', method: 'get', url: '/test/allsettled' },
      { status: 'fulfilled', httpStatus: 200, data: 'success', method: 'get', url: '/test/allsettled' }
    ]);
  });
});

describe('Cache service calls', () => {
  beforeEach(() => {
    moxios.install();
    moxios.stubRequest(/\/(test).*?/, {
      status: 200,
      responseText: 'success',
      timeout: 0
    });
  });

  afterEach(() => {
    moxios.uninstall();
    jest.clearAllMocks();
  });

  it('should handle caching service calls', async () => {
    const call = config =>
      serviceConfig.axiosServiceCall({
        cache: true,
        exposeCacheId: true,
        url: '/test/',
        ...config
      });

    const initial = await call({ params: { lorem: 'ipsum', dolor: 'sit' } });
    const repeated = await call({ params: { lorem: 'ipsum', dolor: 'sit' } });
    const updated = await call({ params: { lorem: 'ipsum' } });
    const posted = await call({ method: 'post', params: { lorem: 'ipsum' } });
    const repeatedUpdate = await call({ params: { lorem: 'ipsum' } });
    const uncached = await serviceConfig.axiosServiceCall({
      cache: false,
      exposeCacheId: true,
      url: '/test/',
      params: { lorem: 'ipsum' }
    });

    const summary = response => ({
      method: response.config.method,
      status: response.status,
      data: response.data,
      cacheId: response.config.cacheId
    });

    expect(summary(initial)).toEqual({
      method: 'get',
      status: 200,
      data: 'success',
      cacheId: expect.any(String)
    });
    expect(summary(repeated)).toEqual({
      method: 'get',
      status: 304,
      data: 'success',
      cacheId: initial.config.cacheId
    });
    expect(summary(updated)).toEqual({
      method: 'get',
      status: 200,
      data: 'success',
      cacheId: expect.any(String)
    });
    expect(updated.config.cacheId).not.toBe(initial.config.cacheId);
    expect(summary(posted)).toEqual({
      method: 'post',
      status: 200,
      data: 'success',
      cacheId: null
    });
    expect(summary(repeatedUpdate)).toEqual({
      method: 'get',
      status: 304,
      data: 'success',
      cacheId: updated.config.cacheId
    });
    expect(summary(uncached)).toEqual({
      method: 'get',
      status: 200,
      data: 'success',
      cacheId: null
    });
  });
});

describe('Transform service call responses', () => {
  beforeEach(() => {
    moxios.install();
    moxios.stubRequest(/\/(test).*?/, {
      status: 200,
      responseText: 'success',
      timeout: 0
    });
    moxios.stubRequest(/\/(error).*?/, {
      status: 404,
      responseText: 'error',
      timeout: 0
    });
  });

  afterEach(() => {
    moxios.uninstall();
    jest.clearAllMocks();
  });

  it('should handle transforming responses with schema transform', async () => {
    const responses = await Promise.allSettled([
      serviceConfig.axiosServiceCall({
        cache: true,
        url: '/test/',
        schema: [successResponse => `${successResponse}-schema-transform`]
      })
    ]);

    expect(responses.map(response => response.value.data)).toEqual(['success-schema-transform']);
  });

  it('should handle transforming success responses and errors', async () => {
    const responses = await Promise.allSettled([
      serviceConfig.axiosServiceCall({
        cache: true,
        url: '/test/',
        transform: [successResponse => `${successResponse}-transform`]
      }),
      serviceConfig.axiosServiceCall({
        cache: true,
        url: '/test/',
        transform: [
          () => {
            throw new Error('success response transform error');
          }
        ]
      })
    ]);

    expect(responses.map(response => response.value.data)).toEqual(['success-transform', 'success']);
  });

  it('should handle transforming error responses and errors', async () => {
    const responses = await Promise.allSettled([
      serviceConfig.axiosServiceCall({
        cache: true,
        url: '/error/',
        transform: [
          successResponse => `${successResponse}-transform`,
          errorResponse => `${errorResponse}-error-transform`
        ]
      }),
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
    ]);

    expect(responses.map(({ reason }) => reason?.response?.data || reason.data)).toEqual([
      'error-error-transform',
      'error'
    ]);
  });

  it('should handle transforming responses with a cancel', async () => {
    const config = {
      cache: true,
      cancel: true,
      url: '/error/',
      transform: [
        successResponse => `${successResponse}-transform`,
        errorResponse => `${errorResponse}-cancel-transform`
      ]
    };

    const responses = await Promise.allSettled([
      serviceConfig.axiosServiceCall({
        ...config
      }),
      serviceConfig.axiosServiceCall({
        ...config
      })
    ]);

    expect(responses.map(({ reason }) => reason?.response?.data || reason.message)).toEqual([
      'cancelled request',
      'error-cancel-transform'
    ]);
  });
});

describe('Poll service calls', () => {
  beforeEach(() => {
    moxios.install();
    moxios.stubRequest(/\/(test|pollSuccess).*?/, {
      status: 200,
      responseText: 'success',
      timeout: 0
    });
    moxios.stubRequest(/\/(error|pollError).*?/, {
      status: 404,
      responseText: 'error',
      timeout: 0
    });
  });

  afterEach(() => {
    moxios.uninstall();
    jest.clearAllMocks();
  });

  it('should handle basic polling', async () => {
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
      { pollInterval: 0 }
    );

    expect(basicPollValidator).toHaveBeenCalledTimes(3);
    expect(basicPollValidator.mock.calls.map(describePollCall)).toEqual(expectedValidatePollCalls());
    expect(basicOutput.data).toBe('success');
    expect(describePoll(basicOutput.config.poll)).toEqual(expectedPollConfig());
  });

  it('should handle basic polling error', async () => {
    const consoleSpyError = jest.spyOn(console, 'error');

    await serviceConfig.axiosServiceCall(
      {
        cache: false,
        url: '/test/',
        poll: () => {
          throw new Error('basic error');
        }
      },
      { pollInterval: 0 }
    );

    expect(consoleSpyError.mock.calls.map(([error]) => error.message)).toEqual(['basic error']);
    consoleSpyError.mockClear();
  });

  it('should handle polling with a validate callback', async () => {
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
      { pollInterval: 0 }
    );

    expect(specificPollValidator).toHaveBeenCalledTimes(3);
    expect(specificPollValidator.mock.calls.map(describePollCall)).toEqual(expectedValidatePollCalls());
    expect(specificOutput.data).toBe('success');
    expect(describePoll(specificOutput.config.poll)).toEqual(expectedPollConfig());
  });

  it('should handle polling with a validate callback error', async () => {
    const consoleSpyError = jest.spyOn(console, 'error');

    await serviceConfig.axiosServiceCall(
      {
        cache: false,
        url: '/test/',
        poll: {
          validate: () => {
            throw new Error('validate error');
          }
        }
      },
      { pollInterval: 0 }
    );

    expect(consoleSpyError.mock.calls.map(([error]) => error.message)).toEqual(['validate error']);
    consoleSpyError.mockClear();
  });

  it('should handle polling with a status callback', async () => {
    const statusPoll = jest.fn();
    const statusOutput = await serviceConfig.axiosServiceCall(
      {
        cache: true,
        url: '/test/',
        poll: {
          validate: (response, count) => count === 1,
          status: (...args) => statusPoll(...args)
        }
      },
      { pollInterval: 0 }
    );

    await waitFor(() => expect(statusPoll).toHaveBeenCalledTimes(3));
    expect(statusPoll.mock.calls.map(describePollCall)).toEqual([
      expectedPollCall(-1),
      expectedPollCall(0, { data: 'success', error: false, url: '/test/', locationUrl: '/test/' }),
      expectedPollCall(1, { data: 'success', error: false, url: '/test/', locationUrl: '/test/' })
    ]);
    expect(statusOutput.data).toBe('success');
    expect(describePoll(statusOutput.config.poll)).toEqual(
      expectedPollConfig({
        retryCount: undefined,
        pollInterval: undefined,
        location: undefined,
        hasStatusCallback: true
      })
    );
  });

  it('should handle polling with a status callback error', async () => {
    const consoleSpyError = jest.spyOn(console, 'error');

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
      { pollInterval: 0 }
    );

    await waitFor(() =>
      expect(consoleSpyError.mock.calls.map(([error]) => error.message)).toEqual([
        'status error',
        'status error',
        'status error',
        'status error',
        'status error'
      ])
    );
    consoleSpyError.mockClear();
  });

  it('should handle polling against a different service call path', async () => {
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
      { pollInterval: 0 }
    );

    expect(mockLocation).toHaveBeenCalledTimes(3);
    expect(mockLocation.mock.calls.map(describePollCall)).toEqual([
      expectedPollCall(-1, { data: 'success', url: '/test/' }),
      expectedPollCall(0, { data: 'success', url: '/pollSuccess/', locationUrl: 'callback' }),
      expectedPollCall(1, { data: 'success', url: '/pollSuccess/', locationUrl: 'callback' })
    ]);
    expect(locationOutput.data).toBe('success');
    expect(describePoll(locationOutput.config.poll)).toEqual(
      expectedPollConfig({ retryCount: 2, location: { url: 'callback', config: undefined } })
    );
  });

  it('should handle polling against a different service call path error and status callback', async () => {
    const statusErrorPoll = jest.fn();
    await serviceConfig.axiosServiceCall(
      {
        cache: false,
        url: '/test/',
        poll: {
          location: '/pollError',
          validate: (response, count) => count === 5,
          status: (...args) => statusErrorPoll(...args)
        }
      },
      { pollInterval: 0 }
    );

    await waitFor(() => expect(statusErrorPoll).toHaveBeenCalledTimes(2));
    expect(statusErrorPoll.mock.calls.map(describePollCall)).toEqual(expectedErrorStatusPollCalls());
  });

  it('should handle polling against a different service call path but with a callback error', async () => {
    const consoleSpyError = jest.spyOn(console, 'error');

    await serviceConfig.axiosServiceCall(
      {
        cache: false,
        url: '/test/',
        poll: {
          validate: (response, count) => count === 1,
          location: () => {
            throw new Error('location error');
          }
        }
      },
      { pollInterval: 0 }
    );

    await waitFor(() =>
      expect(consoleSpyError.mock.calls.map(([error]) => error.message)).toEqual(['location error', 'location error'])
    );
    consoleSpyError.mockClear();
  });

  it('should handle polling against a different service call path error and status callback error', async () => {
    const consoleSpyError = jest.spyOn(console, 'error');

    const statusStatusErrorPoll = jest.fn();
    await serviceConfig.axiosServiceCall(
      {
        cache: false,
        url: '/test/',
        poll: {
          location: '/pollError',
          validate: (response, count) => count === 5,
          status: (...args) => {
            statusStatusErrorPoll(...args);
            throw new Error('status error');
          }
        }
      },
      { pollInterval: 0 }
    );

    await waitFor(() => expect(statusStatusErrorPoll).toHaveBeenCalledTimes(2));
    expect(statusStatusErrorPoll.mock.calls.map(describePollCall)).toEqual(expectedErrorStatusPollCalls());
    expect(consoleSpyError.mock.calls.map(([error]) => error.message)).toEqual(['status error', 'status error']);
    consoleSpyError.mockClear();
  });
});

describe('Emulate a service call with a function', () => {
  it('should allow emulating a service call by passing a function', async () => {
    const output = 'lorem.ipsum';
    const response = await serviceConfig.axiosServiceCall({
      cache: true,
      url: () => output
    });

    expect(response.data).toBe(output);
  });

  it('should allow emulating a service call by passing a promise-like function', async () => {
    const output = 'lorem.ipsum';
    const response = await serviceConfig.axiosServiceCall({
      cache: true,
      url: async () => output
    });

    expect(response.data).toBe(output);
  });

  it('should allow schema transforming a function call response', async () => {
    const response = await serviceConfig.axiosServiceCall({
      cache: true,
      url: () => 'lorem.ipsum',
      schema: [successResponse => `${successResponse}-function-schema-transform`]
    });

    expect(response.data).toBe('lorem.ipsum-function-schema-transform');
  });

  it('should allow transforming a function call response', async () => {
    const response = await serviceConfig.axiosServiceCall({
      cache: true,
      url: () => Promise.resolve('lorem.ipsum'),
      transform: [successResponse => `${successResponse}-function-transform`]
    });

    expect(response.data).toBe('lorem.ipsum-function-transform');
  });

  it('should handle function call response errors', async () => {
    const responses = await Promise.allSettled([
      serviceConfig.axiosServiceCall({
        url: () => Promise.reject(new Error('dolor.sit'))
      })
    ]);

    expect(responses.map(({ reason }) => reason.message)).toEqual(['dolor.sit']);
  });

  it('should handle function call response error with transformations', async () => {
    const responses = await Promise.allSettled([
      serviceConfig.axiosServiceCall({
        url: () => Promise.reject(new Error('dolor.sit')),
        transform: [
          successResponse => `${successResponse}-transform`,
          errorResponse => `${errorResponse}-error-transform`
        ]
      })
    ]);

    expect(responses.map(({ reason }) => reason.response.data)).toEqual(['Error: dolor.sit-error-transform']);
  });

  it('should handle function call response error string with transformations', async () => {
    const responses = await Promise.allSettled([
      serviceConfig.axiosServiceCall({
        url: () => Promise.reject('dolor.sit'), // eslint-disable-line
        transform: [
          successResponse => `${successResponse}-transform`,
          errorResponse => `${errorResponse}-error-transform`
        ]
      })
    ]);

    expect(responses.map(({ reason }) => reason.response.data)).toEqual(['dolor.sit-error-transform']);
  });

  it('should handle passed http status with emulated, grouped service calls', async () => {
    const responses = await Promise.allSettled([
      serviceConfig.axiosServiceCall({
        url: () => Promise.reject({ status: 403, statusText: 'Forbidden', message: 'dolor.sit' }) // eslint-disable-line
      })
    ]);

    expect(responses[0].reason.status).toBe(403);
  });
});
