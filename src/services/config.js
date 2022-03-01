import axios, { CancelToken } from 'axios';
import LruCache from 'lru-cache';
import _isPlainObject from 'lodash/isPlainObject';
import { platformServices } from './platform/platformServices';
import { serviceHelpers } from './common/helpers';

/**
 * Apply consistent service configuration.
 *
 * @param {object} passedConfig
 * @returns {object}
 */
const serviceConfig = (passedConfig = {}) => ({
  headers: {},
  timeout: process.env.REACT_APP_AJAX_TIMEOUT,
  ...passedConfig
});

/**
 * Cache Axios service call cancel tokens.
 *
 * @private
 * @type {object}
 */
const cancelTokens = {};

/**
 * Cache Axios service call responses.
 *
 * @type {object}
 */
const responseCache = new LruCache({
  ttl: Number.parseInt(process.env.REACT_APP_AJAX_CACHE, 10),
  max: 100,
  updateAgeOnGet: true
});

// ToDo: consider another way of hashing cacheIDs. base64 could get a little large depending on settings, i.e. md5
/**
 * Set Axios configuration, which includes response schema validation and caching.
 * Call platform "getUser" auth method, and apply service config. Service configuration
 * includes the ability to cancel all and specific calls, cache and normalize a response
 * based on both a provided schema and a successful API response. The cache will refresh
 * its timeout on continuous calls. To reset it a user will either need to refresh the
 * page or wait the "maxAge".
 *
 * @param {object} config
 * @param {string} config.url
 * @param {object} config.params
 * @param {boolean} config.cache
 * @param {boolean} config.cancel
 * @param {string} config.cancelId
 * @param {boolean} config.exposeCacheId
 * @param {Array} config.schema
 * @param {Array} config.transform
 * @returns {Promise<*>}
 */
const serviceCall = async config => {
  await platformServices.getUser();

  const updatedConfig = { ...config, cache: undefined, cacheResponse: config.cache, method: config.method || 'get' };
  const responseTransformers = [];
  const cancelledMessage = 'cancelled request';
  const axiosInstance = axios.create();

  // don't cache responses if "get" isn't used
  updatedConfig.cacheResponse = updatedConfig.cacheResponse === true && updatedConfig.method === 'get';

  // account for alterations to transforms, and other config props
  const cacheId =
    (updatedConfig.cacheResponse === true &&
      `${btoa(
        JSON.stringify(updatedConfig, (key, value) => {
          if (value !== updatedConfig && _isPlainObject(value)) {
            return (Object.entries(value).sort(([a], [b]) => a.localeCompare(b)) || []).toString();
          }
          if (typeof value === 'function') {
            return value.toString();
          }
          return value;
        })
      )}`) ||
    null;

  // simple check to place responsibility on consumer, primarily used for testing
  if (updatedConfig.exposeCacheId === true) {
    updatedConfig.cacheId = cacheId;
  }

  if (updatedConfig.cancel === true) {
    const cancelTokensId = `${updatedConfig.cancelId || ''}-${updatedConfig.method}-${updatedConfig.url}`;

    if (cancelTokens[cancelTokensId]) {
      cancelTokens[cancelTokensId].cancel(cancelledMessage);
    }

    cancelTokens[cancelTokensId] = CancelToken.source();
    updatedConfig.cancelToken = cancelTokens[cancelTokensId].token;

    delete updatedConfig.cancel;
  }

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

      return axiosInstance(serviceConfig(updatedConfig));
    }
  }

  if (updatedConfig.schema) {
    responseTransformers.push(updatedConfig.schema);
  }

  if (updatedConfig.transform) {
    responseTransformers.push(updatedConfig.transform);
  }

  responseTransformers.forEach(([successTransform, errorTransform]) => {
    const transformers = [undefined, response => Promise.reject(response)];

    if (successTransform) {
      transformers[0] = response => {
        const updatedResponse = { ...response };
        const { data, error: normalizeError } = serviceHelpers.passDataToCallback(
          updatedResponse.data,
          successTransform
        );

        if (!normalizeError) {
          updatedResponse.data = data;
        }

        return updatedResponse;
      };
    }

    if (errorTransform) {
      transformers[1] = response => {
        const updatedResponse = { ...response };

        if (updatedResponse?.message === cancelledMessage) {
          return Promise.reject(updatedResponse);
        }

        const { data, error: normalizeError } = serviceHelpers.passDataToCallback(
          updatedResponse?.response?.data,
          errorTransform
        );

        if (!normalizeError) {
          updatedResponse.response = { ...updatedResponse.response, data };
        }

        return Promise.reject(updatedResponse);
      };
    }

    axiosInstance.interceptors.response.use(...transformers);
  });

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

  return axiosInstance(serviceConfig(updatedConfig));
};

const config = { serviceCall, serviceConfig };

export { config as default, config, serviceCall, serviceConfig };
