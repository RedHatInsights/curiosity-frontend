import _set from 'lodash/set';
import { helpers } from '../common';
import { platformApiTypes } from '../types';

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
            platformApiTypes.PLATFORM_API_RESPONSE_USER_IDENTITY,
            platformApiTypes.PLATFORM_API_RESPONSE_USER_IDENTITY_TYPES.USER,
            platformApiTypes.PLATFORM_API_RESPONSE_USER_IDENTITY_USER_TYPES.ORG_ADMIN
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
const getUserPermissions = (appName = '') => {
  const { insights } = window;
  try {
    return insights.chrome.getUserPermissions(appName);
  } catch (e) {
    throw new Error(`{ getUserPermissions } = insights.chrome, ${e.message}`);
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

// ToDo: Clean up, consider removing setNavigation, currently no longer used.
/**
 * Set platform left hand navigation active item.
 *
 * @param {Array} data
 * @returns {*}
 */
const setNavigation = (data = []) => {
  const { insights, location } = window;
  try {
    return insights.chrome.navigation(
      data.map(item => ({
        ...item,
        active: item.id === location.pathname.split('/').slice(-1)[0]
      }))
    );
  } catch (e) {
    throw new Error(`{ navigation } = insights.chrome, ${e.message}`);
  }
};

const platformServices = { getUser, getUserPermissions, initializeChrome, onNavigation, setAppName, setNavigation };

export {
  platformServices as default,
  platformServices,
  getUser,
  getUserPermissions,
  initializeChrome,
  onNavigation,
  setAppName,
  setNavigation
};
