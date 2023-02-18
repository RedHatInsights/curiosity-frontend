import { axiosServiceCall } from './common/serviceConfig';
import { platformServices } from './platform/platformServices';

/**
 * @namespace Services
 * @property {module} Helpers
 * @property {module} Platform
 * @property {module} Rhsm
 * @property {module} User
 */

/**
 * Apply a global custom service configuration.
 *
 * @param {object} passedConfig
 * @returns {object}
 */
const serviceConfig = (passedConfig = {}) => ({
  headers: {},
  ...passedConfig
});

/**
 * Use a global Axios configuration.
 *
 * @param {object} config
 * @param {object} config.cache
 * @param {boolean} config.cancel
 * @param {string} config.cancelId
 * @param {object} config.params
 * @param {Array} config.schema
 * @param {Array} config.transform
 * @param {string|Function} config.url
 * @returns {Promise<*>}
 */
const serviceCall = async config => {
  await platformServices.getUser();
  return axiosServiceCall(serviceConfig(config));
};

const config = { serviceCall, serviceConfig };

export { config as default, config, serviceCall, serviceConfig };
