import {
  addNotification as RcsAddNotification,
  removeNotification as RcsRemoveNotification,
  clearNotifications as RcsClearNotifications
} from '@redhat-cloud-services/frontend-components-notifications';
import { platformTypes } from '../types';
import { platformServices } from '../../services/platform/platformServices';
import { helpers } from '../../common';

/**
 * Platform service wrappers for dispatch, state update.
 *
 * @memberof Actions
 * @module PlatformActions
 */

/**
 * Add a platform plugin toast notification. Generate an id if one doesn't exist. The default generated id is
 * random when testing.
 *
 * @param {object} data
 * @returns {*}
 */
const addNotification = data => dispatch => {
  const updatedData = { ...data };

  if (updatedData.id) {
    dispatch(RcsRemoveNotification(updatedData.id));
  } else {
    updatedData.id = helpers.generateId();
  }

  return dispatch(RcsAddNotification(updatedData));
};

/**
 * Remove a platform plugin toast notification.
 *
 * @param {string} id
 * @returns {*}
 */
const removeNotification = id => dispatch => dispatch(RcsRemoveNotification(id));

/**
 * Clear all platform plugin toast notifications.
 *
 * @returns {*}
 */
const clearNotifications = () => dispatch => dispatch(RcsClearNotifications());

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
 * Get all existing exports, if pending poll, and when complete download. Includes toast notifications.
 *
 * @param {Array} existingExports
 * @param {object} notifications Apply notification options
 * @returns {Function}
 */
const getExistingExports =
  (existingExports, notifications = {}) =>
  dispatch =>
    dispatch({
      type: platformTypes.GET_PLATFORM_EXPORT_EXISTING,
      payload: platformServices.getExistingExports(existingExports),
      meta: {
        notifications
      }
    });

/**
 * Delete all existing exports. Includes toast notifications.
 *
 * @param {Array<{ id: string }>} existingExports
 * @param {object} notifications
 * @returns {Function}
 */
const deleteExistingExports = (existingExports, notifications) => dispatch =>
  dispatch({
    type: platformTypes.DELETE_PLATFORM_EXPORT_EXISTING,
    payload: Promise.all(existingExports.map(({ id }) => platformServices.deleteExport(id))),
    meta: {
      notifications
    }
  });

/**
 * Get a status from any existing exports. Display a confirmation for downloading, or ignoring, the exports.
 * Includes toast notifications.
 *
 * @param {object} notifications
 * @returns {Function}
 */
const getExistingExportsStatus = notifications => dispatch =>
  dispatch({
    type: platformTypes.SET_PLATFORM_EXPORT_EXISTING_STATUS,
    payload: platformServices.getExistingExportsStatus(),
    meta: {
      notifications
    }
  });

/**
 * Create an export for download. Includes toast notifications.
 *
 * @param {string} id
 * @param {object} data
 * @param {object} options Apply polling options
 * @param {object} notifications
 * @returns {Function}
 */
const createExport =
  (id, data = {}, options = {}, notifications = {}) =>
  dispatch =>
    dispatch({
      type: platformTypes.SET_PLATFORM_EXPORT_CREATE,
      payload: platformServices.postExport(data, options),
      meta: {
        id,
        notifications
      }
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
  deleteExistingExports,
  getExistingExports,
  getExistingExportsStatus,
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
  deleteExistingExports,
  getExistingExports,
  getExistingExportsStatus,
  hideGlobalFilter
};
