import axios, { CancelToken } from 'axios';
import { LRUCache } from 'lru-cache';
import { serviceHelpers } from './helpers';

/**
 * Axios config for cancelling, caching, and emulated service calls.
 *
 * @memberof Helpers
 * @module ServiceConfig
 */

/**
 * Set Axios XHR default timeout.
 *
 * @type {number}
 */
const globalXhrTimeout = Number.parseInt(process.env.REACT_APP_AJAX_TIMEOUT, 10) || 60000;

/**
 * Set Axios polling default.
 *
 * @type {number}
 */
const globalPollInterval = Number.parseInt(process.env.REACT_APP_AJAX_POLL_INTERVAL, 10) || 10000;

/**
 * Used to calculate the retry limit. Set a user configured Axios polling timeout default relative to the poll interval.
 * If this number is set lower than the poll interval then a minimum retry number of 1 is used.
 *
 * @type {number}
 */
const globalPollTimeout = Number.parseInt(process.env.REACT_APP_AJAX_POLL_TIMEOUT, 10) || 600000;

/**
 * Cache Axios service call cancel tokens.
 *
 * @type {object}
 */
const globalCancelTokens = {};

/**
 * Cache Axios service call responses.
 *
 * @type {object}
 */
const globalResponseCache = new LRUCache({
  ttl: Number.parseInt(process.env.REACT_APP_AJAX_CACHE, 10) || 30000,
  max: 100,
  updateAgeOnGet: true
});

/**
 * Set Axios configuration. This includes response schema validation and caching.
 * Call platform "getUser" auth method, and apply service config. Service configuration
 * includes the ability to cancel all and specific calls, cache and normalize a response
 * based on both a provided schema and a successful API response. The cache will refresh
 * its timeout on continuous calls. To reset it a user will either need to refresh the
 * page or wait the "maxAge".
 *
 * @param {object} config
 * @param {object} config.cache
 * @param {boolean} config.cancel
 * @param {string} config.cancelId
 * @param {object} config.params
 * @param {{ location: Function|string, validate: Function, pollInterval: number, status: Function,
 *     timeout: number }|Function} config.poll
 * @param {Array} config.schema
 * @param {Array} config.transform
 * @param {string|Function} config.url
 * @param {object} options
 * @param {string} options.cancelledMessage
 * @param {object} options.responseCache
 * @param {number} options.xhrTimeout
 * @param {number} options.pollInterval
 * @param {number} options.pollTimeout
 * @returns {Promise<*>}
 */
const axiosServiceCall = async (
  config = {},
  {
    cancelledMessage = 'cancelled request',
    responseCache = globalResponseCache,
    xhrTimeout = globalXhrTimeout,
    pollInterval = globalPollInterval,
    pollTimeout = globalPollTimeout
  } = {}
) => {
  const updatedConfig = {
    timeout: xhrTimeout,
    ...config,
    cache: undefined,
    cacheResponse: config.cache,
    method: config.method || 'get'
  };
  const responseTransformers = [];
  const axiosInstance = axios.create();

  // don't cache responses if "get" isn't used
  updatedConfig.cacheResponse = updatedConfig.cacheResponse === true && updatedConfig.method === 'get';

  // account for alterations to transforms, and other config props
  const cacheId = (updatedConfig.cacheResponse === true && serviceHelpers.generateHash(updatedConfig)) || null;

  // simple check to place responsibility on consumer, primarily used for testing
  if (updatedConfig.exposeCacheId === true) {
    updatedConfig.cacheId = cacheId;
  }

  // apply cancel configuration
  if (updatedConfig.cancel === true) {
    const cancelTokensId =
      updatedConfig.cancelId || serviceHelpers.generateHash({ ...updatedConfig, data: undefined, params: undefined });

    if (globalCancelTokens[cancelTokensId]) {
      await globalCancelTokens[cancelTokensId].cancel(cancelledMessage);
    }

    globalCancelTokens[cancelTokensId] = CancelToken.source();
    updatedConfig.cancelToken = globalCancelTokens[cancelTokensId].token;

    delete updatedConfig.cancel;
  }

  // if cached response return
  if (updatedConfig.cacheResponse === true) {
    const cachedResponse = responseCache.get(cacheId);

    if (cachedResponse) {
      updatedConfig.adapter = adapterConfig =>
        Promise.resolve({
          ...cachedResponse,
          status: 304,
          statusText: 'Not Modified',
          config: adapterConfig
        });

      return axiosInstance(updatedConfig);
    }
  }

  // if schema transform, add before standard transform
  if (updatedConfig.schema) {
    responseTransformers.push(updatedConfig.schema);
  }

  // add response transformers
  if (updatedConfig.transform) {
    responseTransformers.push(updatedConfig.transform);
  }

  // apply response transformers
  responseTransformers.forEach(([successTransform, errorTransform]) => {
    const transformers = [undefined, response => Promise.reject(response)];

    if (successTransform) {
      transformers[0] = response => {
        const updatedResponse = { ...response };
        const { data, error: normalizeError } = serviceHelpers.passDataToCallback(
          successTransform,
          serviceHelpers.memoClone(updatedResponse.data),
          serviceHelpers.memoClone(updatedResponse.config)
        );

        if (normalizeError) {
          console.warn(normalizeError);
        } else {
          updatedResponse.data = data;
        }

        return updatedResponse;
      };
    }

    if (errorTransform) {
      transformers[1] = response => {
        const updatedResponse = { ...(response.response || response) };

        if (updatedResponse?.message === cancelledMessage) {
          return Promise.reject(updatedResponse);
        }

        const { data, error: normalizeError } = serviceHelpers.passDataToCallback(
          errorTransform,
          serviceHelpers.memoClone(updatedResponse?.data || updatedResponse?.message),
          serviceHelpers.memoClone(updatedResponse.config)
        );

        if (normalizeError) {
          console.warn(normalizeError);
        } else {
          updatedResponse.response = { ...updatedResponse, data };
        }

        return Promise.reject(updatedResponse);
      };
    }

    axiosInstance.interceptors.response.use(...transformers);
  });

  // apply a response to cache
  if (updatedConfig.cacheResponse === true) {
    axiosInstance.interceptors.response.use(
      response => {
        const updatedResponse = { ...response };
        responseCache.set(cacheId, updatedResponse);
        return updatedResponse;
      },
      response => Promise.reject(response)
    );
  }

  // use a function instead of a URL-string, receive service emulated output (for implementation consistency)
  if (typeof updatedConfig.url === 'function') {
    const emulateCallback = updatedConfig.url;
    updatedConfig.url = '/emulated';

    let message = 'success, emulated';
    let emulatedResponse;
    let isSuccess = true;

    try {
      emulatedResponse = await serviceHelpers.timeoutFunctionCancel(emulateCallback, { timeout: xhrTimeout });
    } catch (e) {
      isSuccess = false;
      message = e.message || e;
    }

    if (isSuccess) {
      updatedConfig.adapter = adapterConfig =>
        Promise.resolve({
          data: emulatedResponse,
          status: 200,
          statusText: message,
          config: adapterConfig
        });
    } else {
      updatedConfig.adapter = adapterConfig =>
        Promise.reject({ // eslint-disable-line
          ...new Error(message),
          message,
          status: 418,
          config: adapterConfig
        });
    }
  }

  // apply a response poll
  if (typeof updatedConfig.poll === 'function' || typeof updatedConfig.poll?.validate === 'function') {
    axiosInstance.interceptors.response.use(
      async response => {
        const updatedResponse = { ...response };
        const callbackResponse = serviceHelpers.memoClone(updatedResponse);

        // passed config, allow future updates by passing modified poll config
        const updatedPoll = {
          ...updatedConfig.poll,
          // a URL, or callback that returns a URL to poll the put/posted url
          location: updatedConfig.poll.location || updatedConfig.url,
          // only required param, a function, validate status in prep for next
          validate: updatedConfig.poll.validate || updatedConfig.poll,
          // a number, the setTimeout interval
          pollInterval: updatedConfig.poll.pollInterval || pollInterval,
          // internal counter passed towards validate
          __retryCount: updatedConfig.poll.__retryCount ?? 0,
          // internal limit on number of polling retries, aka avoid runaway timers with broken service responses
          __retryLimit:
            updatedConfig.poll.__retryLimit ??
            serviceHelpers.pollingRetryLimit.memoize(pollTimeout, this.pollInterval, 1)
        };

        let validated;

        try {
          validated = await updatedPoll.validate.call(null, callbackResponse, updatedPoll.__retryCount);
        } catch (err) {
          console.error(err);
          validated = true;
        }

        if (validated === true) {
          return updatedResponse;
        }

        let tempLocation = updatedPoll.location;

        if (typeof tempLocation === 'function') {
          try {
            tempLocation = await tempLocation.call(null, callbackResponse, updatedPoll.__retryCount);
          } catch (err) {
            console.error(err);
            tempLocation = updatedConfig.url;
          }
        }

        const pollResponse = new Promise((resolve, reject) => {
          window.setTimeout(async () => {
            try {
              const output = await axiosServiceCall({
                ...config,
                method: 'get',
                data: undefined,
                url: tempLocation,
                cache: false,
                poll: { ...updatedPoll, __retryCount: updatedPoll.__retryCount + 1 }
              });

              resolve(output);
            } catch (e) {
              reject(e);
            }
          }, updatedPoll.pollInterval);
        });

        // either apply a status resolver for up-to-date responses or chain poll-response to the response
        if (typeof updatedPoll.status === 'function') {
          pollResponse.then(
            resolved => {
              try {
                updatedPoll.status.call(null, resolved, undefined, updatedPoll.__retryCount);
              } catch (err) {
                console.error(err);
              }
            },
            resolved => {
              try {
                updatedPoll.status.call(
                  null,
                  undefined,
                  { ...resolved, error: true, status: resolved?.response?.status },
                  updatedPoll.__retryCount
                );
              } catch (err) {
                console.error(err);
              }
            }
          );
        } else {
          return pollResponse;
        }

        return updatedResponse;
      },
      response => Promise.reject(response)
    );
  }

  return axiosInstance(updatedConfig);
};

const serviceConfig = {
  axiosServiceCall,
  globalXhrTimeout,
  globalPollInterval,
  globalCancelTokens,
  globalResponseCache
};

export {
  serviceConfig as default,
  serviceConfig,
  axiosServiceCall,
  globalXhrTimeout,
  globalPollInterval,
  globalCancelTokens,
  globalResponseCache
};
