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
 * Create an export for download.
 *
 * @param {object} data
 * @returns {Function}
 */
const createExport =
  (data = {}) =>
  dispatch =>
    dispatch({
      type: platformTypes.GET_PLATFORM_EXPORT_STATUS,
      payload: platformServices.getExportStatus(data)
    });

/**
 * Get an export download packaged response.
 *
 * @param {string} id
 * @returns {Function}
 */
const getExport = (id = null) => ({
  type: platformTypes.GET_PLATFORM_EXPORT,
  payload: platformServices.getExport(id)
});

/**
 * Get an export download package status.
 *
 * @param {string} id
 * @returns {Function}
 */
const getExportStatus =
  (id = null) =>
  dispatch =>
    dispatch({
      type: platformTypes.GET_PLATFORM_EXPORT_STATUS,
      payload: platformServices.getExportStatus(id)
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
  getExportStatus,
  hideGlobalFilter
};
