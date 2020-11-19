import axios, { CancelToken } from 'axios';
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
 * Call platform "getUser" auth method, and apply service config.
 *
 * @param {object} config
 * @returns {Promise<*>}
 */
const serviceCall = async config => {
  await platformServices.getUser();

  const updatedConfig = { ...config };
  const cancelTokensId = `${updatedConfig.cancelId || ''}-${updatedConfig.url}`;

  if (updatedConfig.cancel === true) {
    if (cancelTokens[cancelTokensId]) {
      cancelTokens[cancelTokensId].cancel('cancelled request');
    }

    cancelTokens[cancelTokensId] = CancelToken.source();
    updatedConfig.cancelToken = cancelTokens[cancelTokensId].token;

    delete updatedConfig.cancel;
  }

  return axios(serviceConfig(updatedConfig));
};

const config = { serviceCall, serviceConfig };

export { config as default, config, serviceCall, serviceConfig };
