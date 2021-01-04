import axios, { CancelToken } from 'axios';
import LruCache from 'lru-cache';
import { platformServices } from './platformServices';

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
  maxAge: Number.parseInt(process.env.REACT_APP_AJAX_CACHE, 10),
  max: 100,
  updateAgeOnGet: true
});

/**
 * Call platform "getUser" auth method, and apply service config. Service configuration
 * includes the ability to cancel all and specific calls, and cache specific calls with
 * their success response only. The cache will refresh its timeout on continuous calls.
 * To reset it a user will either need to refresh the page or wait the "maxAge".
 *
 * @param {object} config
 * @returns {Promise<*>}
 */
const serviceCall = async config => {
  await platformServices.getUser();

  const updatedConfig = { ...config };
  const axiosInstance = axios.create();

  if (updatedConfig.cancel === true) {
    const cancelTokensId = `${updatedConfig.cancelId || ''}-${updatedConfig.url}`;

    if (cancelTokens[cancelTokensId]) {
      cancelTokens[cancelTokensId].cancel('cancelled request');
    }

    cancelTokens[cancelTokensId] = CancelToken.source();
    updatedConfig.cancelToken = cancelTokens[cancelTokensId].token;

    delete updatedConfig.cancel;
  }

  if (updatedConfig.cache === true) {
    const sortedParams = Object.entries(updatedConfig.params).sort(([a], [b]) => a.localeCompare(b));
    const cacheId = `${updatedConfig.url}-${JSON.stringify(sortedParams)}`;
    const cachedResponse = responseCache.get(cacheId);

    if (cachedResponse) {
      updatedConfig.adapter = adapterConfig =>
        Promise.resolve({
          ...cachedResponse,
          status: 304,
          statusText: 'Not Modified',
          config: adapterConfig
        });
    }

    axiosInstance.interceptors.response.use(response => {
      responseCache.set(cacheId, response);
      return response;
    });

    delete updatedConfig.cache;
  }

  return axiosInstance(serviceConfig(updatedConfig));
};

const config = { serviceCall, serviceConfig };

export { config as default, config, serviceCall, serviceConfig };
