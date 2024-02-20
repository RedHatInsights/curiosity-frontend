import {
  addNotification as RcsAddNotification,
  removeNotification as RcsRemoveNotification,
  clearNotifications as RcsClearNotifications
} from '@redhat-cloud-services/frontend-components-notifications';
import { platformTypes } from '../types';
import { platformServices } from '../../services/platform/platformServices';

/**
 * Platform service wrappers for dispatch, state update.
 *
 * @memberof Actions
 * @module PlatformActions
 */

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
 * Get an emulated and combined API response from the platforms "getUser" and "getUserPermissions" global methods.
 *
 * @param {string|Array} appName
 * @returns {Function}
 */
const authorizeUser = appName => dispatch =>
  dispatch({
    type: platformTypes.PLATFORM_USER_AUTH,
    payload: Promise.all([platformServices.getUser(), platformServices.getUserPermissions(appName)])
  });

/**
 * Get a specific export download package.
 *
 * @param {string} id
 * @returns {Function}
 */
const getExport = id => dispatch =>
  dispatch({
    type: platformTypes.GET_PLATFORM_EXPORT,
    payload: platformServices.getExport(id)
  });

/**
 * Return a "dispatch ready" export poll status check.
 *
 * @param {Function} dispatch
 * @returns {Function}
 */
const setExportStatus =
  dispatch =>
  (success = {}, error) =>
    dispatch({
      type: platformTypes.SET_PLATFORM_EXPORT_STATUS,
      payload: (error && Promise.reject(error)) || Promise.resolve(success)
    });

/**
 * Get a specific, or all, export status.
 *
 * @param {object} options Apply polling options
 * @returns {Function}
 */
const getExportStatus =
  (options = {}) =>
  dispatch =>
    dispatch({
      type: platformTypes.SET_PLATFORM_EXPORT_STATUS,
      payload: platformServices.getExportStatus(undefined, undefined, {
        ...options,
        poll: { ...options.poll, status: setExportStatus(dispatch) }
      })
    });

/**
 * Create an export for download.
 *
 * @param {object} data
 * @param {object} options Apply polling options
 * @returns {Function}
 */
const createExport =
  (data = {}, options = {}) =>
  dispatch =>
    dispatch({
      type: platformTypes.SET_PLATFORM_EXPORT_STATUS,
      payload: platformServices.postExport(data, {
        ...options,
        poll: { ...options.poll, status: setExportStatus(dispatch) }
      })
    });

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

const platformActions = {
  addNotification,
  removeNotification,
  clearNotifications,
  authorizeUser,
  createExport,
  getExport,
  setExportStatus,
  getExportStatus,
  hideGlobalFilter
};

export {
  platformActions as default,
  platformActions,
  addNotification,
  removeNotification,
  clearNotifications,
  authorizeUser,
  createExport,
  getExport,
  setExportStatus,
  getExportStatus,
  hideGlobalFilter
};
