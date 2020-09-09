import {
  addNotification as RcsAddNotification,
  removeNotification as RcsRemoveNotification,
  clearNotifications as RcsClearNotifications
} from '@redhat-cloud-services/frontend-components-notifications/cjs';
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
 * Apply platform method for handling the left-nav navigation active item.
 *
 * @param {object} data
 * @returns {Function}
 */
const setNavigation = data => dispatch => {
  dispatch({
    type: platformTypes.PLATFORM_SET_NAV
  });
  return platformServices.setNavigation(data);
};

const platformActions = {
  addNotification,
  removeNotification,
  clearNotifications,
  initializeChrome,
  onNavigation,
  setAppName,
  setNavigation
};

export {
  platformActions as default,
  platformActions,
  addNotification,
  removeNotification,
  clearNotifications,
  initializeChrome,
  onNavigation,
  setAppName,
  setNavigation
};
