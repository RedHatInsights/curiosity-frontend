import {
  addNotification as RcsAddNotification,
  removeNotification as RcsRemoveNotification,
  clearNotifications as RcsClearNotifications
} from '@redhat-cloud-services/frontend-components-notifications';
import { platformTypes } from '../types';
import { platformServices } from '../../services/platformServices';

/**
 * Add a platform plugin toast notification.
 *
 * @param {object} data
 * @returns {*}
 */
const addNotification = data => RcsAddNotification(data);

/**
 * Remove a platform plugin toast notification.
 *
 * @param {string} id
 * @returns {*}
 */
const removeNotification = id => RcsRemoveNotification(id);

/**
 * Clear all platform plugin toast notifications.
 *
 * @returns {*}
 */
const clearNotifications = () => RcsClearNotifications();

/**
 * Hide platform global filter.
 *
 * @param {boolean} isHidden
 * @returns {{Function}}
 */
const hideGlobalFilter = isHidden => ({
  type: platformTypes.PLATFORM_GLOBAL_FILTER_HIDE,
  payload: platformServices.hideGlobalFilter(isHidden)
});

/**
 * Apply platform method for initializing chrome, i.e. header, left-nav.
 *
 * @returns {{payload: Promise<void>, type: string}}
 */
const initializeChrome = () => ({
  type: platformTypes.PLATFORM_INIT,
  payload: platformServices.initializeChrome()
});

/**
 * Apply platform method for updating routing history on "navigating" with the left-nav.
 *
 * @param {Function} callback
 * @returns {Function}
 */
const onNavigation = callback => dispatch => {
  dispatch({
    type: platformTypes.PLATFORM_ON_NAV
  });
  return platformServices.onNavigation(callback);
};

/**
 * Apply platform method for setting the application name/identifier.
 *
 * @param {string} name
 * @returns {{payload: Promise<void>, meta: {data: {name: *}}, type: string}}
 */
const setAppName = name => ({
  type: platformTypes.PLATFORM_APP_NAME,
  payload: platformServices.setAppName(name),
  meta: {
    data: { name }
  }
});

/**
 * Apply platform method for changing routes via the left-nav navigation.
 *
 * @param {string} id
 * @param {object} options
 * @param {string} options.appName
 * @param {boolean} options.secondaryNav
 * @returns {Function}
 */
const setAppNav =
  (id, { appName, secondaryNav } = {}) =>
  dispatch =>
    dispatch({
      type: platformTypes.PLATFORM_SET_NAV,
      payload: platformServices.setAppNav(id, { appName, secondaryNav }),
      meta: {
        id,
        appName,
        secondaryNav
      }
    });

const platformActions = {
  addNotification,
  removeNotification,
  clearNotifications,
  hideGlobalFilter,
  initializeChrome,
  onNavigation,
  setAppName,
  setAppNav
};

export {
  platformActions as default,
  platformActions,
  addNotification,
  removeNotification,
  clearNotifications,
  hideGlobalFilter,
  initializeChrome,
  onNavigation,
  setAppName,
  setAppNav
};
