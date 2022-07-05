import _set from 'lodash/set';
import { rbacConfig } from '../../config';
import { axiosServiceCall } from '../common/serviceConfig';
import { platformSchemas } from './platformSchemas';
import { platformTransformers } from './platformTransformers';
import { helpers } from '../../common';
import {
  platformConstants,
  PLATFORM_API_RESPONSE_USER_PERMISSION_TYPES as USER_PERMISSION_TYPES
} from './platformConstants';

/**
 * @api {get} /auth/realms/redhat-external/protocol/openid-connect/3p-cookies/step1.html
 * @apiDescription Mock keycloak bypass
 *
 * @apiSuccessExample {html} Success-Response:
 *     HTTP/1.1 200 OK
 *     <!DOCTYPE html>
 *     <html>
 *       <body>
 *         <script>
 *           document.cookie = "KEYCLOAK_3P_COOKIE_SAMESITE=; expires=Thu, 01 Jan 1970 00:00:00 GMT; secure"
 *           document.cookie = "KEYCLOAK_3P_COOKIE=; expires=Thu, 01 Jan 1970 00:00:00 GMT"
 *           window.parent.postMessage("supported", "*")
 *         </script>
 *       </body>
 *     </html>
 */
/**
 * Basic user authentication.
 *
 * @param {object} options
 * @returns {Promise<*>}
 */
const getUser = async (options = {}) => {
  const { schema = [platformSchemas.user], transform = [platformTransformers.user] } = options;
  const { insights } = window;
  return axiosServiceCall({
    url: async () => {
      try {
        return (
          (helpers.DEV_MODE &&
            _set(
              {},
              [
                platformConstants.PLATFORM_API_RESPONSE_USER_IDENTITY,
                platformConstants.PLATFORM_API_RESPONSE_USER_IDENTITY_TYPES.USER,
                platformConstants.PLATFORM_API_RESPONSE_USER_IDENTITY_USER_TYPES.ORG_ADMIN
              ],
              process.env.REACT_APP_DEBUG_ORG_ADMIN === 'true'
            )) ||
          (await insights.chrome.auth.getUser())
        );
      } catch (e) {
        throw new Error(`{ getUser } = insights.chrome.auth, ${e.message}`);
      }
    },
    schema,
    transform
  });
};

/**
 * Basic user permissions.
 *
 * @param {string} appName
 * @param {object} options
 * @returns {Promise<*>}
 */
const getUserPermissions = (appName = Object.keys(rbacConfig), options = {}) => {
  const { schema = [platformSchemas.permissions], transform = [platformTransformers.permissions] } = options;
  const updatedAppName = (Array.isArray(appName) && appName) || [appName];
  const { insights } = window;
  const platformMethod = name =>
    (helpers.DEV_MODE && [
      {
        [USER_PERMISSION_TYPES.PERMISSION]: process.env.REACT_APP_DEBUG_PERMISSION_APP_ONE
      },
      {
        [USER_PERMISSION_TYPES.PERMISSION]: process.env.REACT_APP_DEBUG_PERMISSION_APP_TWO
      }
    ]) ||
    insights.chrome.getUserPermissions(name);

  return axiosServiceCall({
    url: async () => {
      let userPermissions;

      try {
        const allPermissions = await Promise.all(updatedAppName.map(name => platformMethod(name)));

        if (Array.isArray(allPermissions)) {
          userPermissions = [...allPermissions.flat()];
        }
      } catch (e) {
        throw new Error(`{ getUserPermissions } = insights.chrome, ${e.message}`);
      }

      return userPermissions;
    },
    schema,
    transform
  });
};

/**
 * Disables the Platform's global filter display.
 *
 * @param {boolean} isHidden
 * @returns {Promise<*>}
 */
const hideGlobalFilter = async (isHidden = true) => {
  const { insights } = window;
  try {
    await insights.chrome.hideGlobalFilter(isHidden);
  } catch (e) {
    throw new Error(`{ on } = insights.chrome, ${e.message}`);
  }
};

/**
 * Help initialize global platform methods.
 *
 * @returns {Promise<*>}
 */
const initializeChrome = async () => {
  const { insights } = window;
  try {
    await insights.chrome.init();
  } catch (e) {
    throw new Error(`{ init } = insights.chrome, ${e.message}`);
  }
};

/**
 * Apply on "app_navigation" event. Return an un-listener.
 *
 * @param {Function} callback
 * @returns {Function}
 */
const onNavigation = callback => {
  const { insights } = window;
  try {
    return insights.chrome.on('APP_NAVIGATION', callback);
  } catch (e) {
    throw new Error(`{ on } = insights.chrome, ${e.message}`);
  }
};

/**
 * Set application ID.
 *
 * @param {string} name
 * @returns {Promise<*>}
 */
const setAppName = (name = null) => {
  const { insights } = window;
  return axiosServiceCall({
    url: async () => {
      try {
        await insights.chrome.identifyApp(name);
      } catch (e) {
        throw new Error(`{ identifyApp } = insights.chrome, ${e.message}`);
      }
    }
  });
};

/**
 * Set app routes via the platform left-nav navigation.
 *
 * @param {string} id The navigation ID associated with internal route config, and external platform nav config
 * @param {object} options
 * @param {string} options.appName
 * @param {boolean} options.secondaryNav
 * @returns {Promise<*>}
 */
const setAppNav = async (id, { appName = helpers.UI_NAME, secondaryNav = true } = {}) => {
  const { insights } = window;
  try {
    return await insights.chrome.appNavClick({ id, secondaryNav, parentId: appName });
  } catch (e) {
    throw new Error(`{ appNavClick } = insights.chrome, ${e.message}`);
  }
};

const platformServices = {
  getUser,
  getUserPermissions,
  hideGlobalFilter,
  initializeChrome,
  onNavigation,
  setAppName,
  setAppNav
};

export {
  platformServices as default,
  platformServices,
  getUser,
  getUserPermissions,
  hideGlobalFilter,
  initializeChrome,
  onNavigation,
  setAppName,
  setAppNav
};
