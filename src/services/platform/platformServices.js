import _set from 'lodash/set';
import { helpers } from '../../common';
import {
  platformConstants,
  PLATFORM_API_RESPONSE_USER_PERMISSION_TYPES as USER_PERMISSION_TYPES
} from './platformConstants';

/**
 * Basic user authentication.
 *
 * @returns {Promise<void>}
 */
const getUser = async () => {
  const { insights } = window;
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
};

/**
 * FixMe: revert this back towards async/await
 * Removed because there appears to be some quirky behavior where permissions will not come through
 * unless the function, and/or await are specifically returned, i.e. "return await insights.chrome...".
 */
/**
 * Basic user permissions.
 *
 * @param {string} appName
 * @returns {Promise<void>}
 */
const getUserPermissions = appName => {
  const { insights } = window;
  try {
    return (
      (helpers.DEV_MODE && [
        {
          [USER_PERMISSION_TYPES.PERMISSION]: process.env.REACT_APP_DEBUG_PERMISSION_APP_ONE
        },
        {
          [USER_PERMISSION_TYPES.PERMISSION]: process.env.REACT_APP_DEBUG_PERMISSION_APP_TWO
        }
      ]) ||
      insights.chrome.getUserPermissions(appName)
    );
  } catch (e) {
    throw new Error(`{ getUserPermissions } = insights.chrome, ${e.message}`);
  }
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
 * @returns {Promise<void>}
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

// FixMe: Revert catch to throwing an error. Relaxed for development
/**
 * Set application ID.
 *
 * @param {string} name
 * @returns {Promise<void>}
 */
const setAppName = async (name = null) => {
  const { insights } = window;
  try {
    await insights.chrome.identifyApp(name);
  } catch (e) {
    const error = `{ identifyApp } = insights.chrome, ${e.message}`;
    await Promise.reject(error);
  }
};

/**
 * Set app routes via the platform left-nav navigation.
 *
 * @param {string} id The navigation ID associated with internal route config, and external platform nav config
 * @param {object} options
 * @param {string} options.appName
 * @param {boolean} options.secondaryNav
 * @returns {Promise<object>}
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
