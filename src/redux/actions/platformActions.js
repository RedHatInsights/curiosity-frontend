import { platformTypes } from '../types';
import { platformServices } from '../../services/platform/platformServices';

/**
 * Platform service wrappers for dispatch, state update.
 *
 * @memberof Actions
 * @module PlatformActions
 */

/**
 * Get an emulated and combined API response from the platforms "getUser" and "getUserPermissions" global methods.
 *
 * @param {object} params
 * @param {string|Array} params.appName
 * @param {Function} params.getUser
 * @param {Function} params.getUserPermissions
 * @returns {Function}
 */
const authorizeUser =
  ({ appName, getUser, getUserPermissions } = {}) =>
  dispatch =>
    dispatch({
      type: platformTypes.PLATFORM_USER_AUTH,
      payload: Promise.all([
        platformServices.getUser({ getUser }),
        platformServices.getUserPermissions(appName, { getUserPermissions })
      ])
    });

/**
 * Get all existing exports, if "pending" then poll, and when complete download.
 * Includes toast notifications through the callbacks parameter.
 *
 * @param {Array} existingExports
 * @param {object} callbacks Apply notification callbacks with options
 * @returns {Function}
 */
const getExistingExports =
  (existingExports, callbacks = {}) =>
  dispatch =>
    Promise.resolve(
      dispatch({
        type: platformTypes.GET_PLATFORM_EXPORT_EXISTING,
        payload: platformServices.getExistingExports(existingExports),
        meta: {
          ...callbacks
        }
      })
    );

/**
 * Delete all existing exports. Includes toast notifications through the callbacks parameter
 *
 * @param {Array<{ id: string }>} existingExports
 * @param {object} callbacks
 * @returns {Function}
 */
const deleteExistingExports = (existingExports, callbacks) => dispatch =>
  dispatch({
    type: platformTypes.DELETE_PLATFORM_EXPORT_EXISTING,
    payload: Promise.all(existingExports.map(({ id }) => platformServices.deleteExport(id))),
    meta: {
      ...callbacks
    }
  });

/**
 * Get a status from any existing exports. Display a confirmation for downloading, or ignoring, the exports.
 * Includes toast notifications through the callbacks parameter
 *
 * @param {object} callbacks
 * @returns {Function}
 */
const getExistingExportsStatus = callbacks => dispatch =>
  dispatch({
    type: platformTypes.SET_PLATFORM_EXPORT_EXISTING_STATUS,
    payload: platformServices.getExistingExportsStatus(),
    meta: {
      ...callbacks
    }
  });

/**
 * Create an export for download. Includes toast notifications through the callbacks parameter.
 *
 * @param {string} id
 * @param {object} data
 * @param {object} options Apply polling options
 * @param {object} callbacks
 * @returns {Function}
 */
const createExport =
  (id, data = {}, options = {}, callbacks = {}) =>
  dispatch =>
    Promise.resolve(
      dispatch({
        type: platformTypes.SET_PLATFORM_EXPORT_CREATE,
        payload: platformServices.postExport(data, options),
        meta: {
          id,
          ...callbacks
        }
      })
    );

const platformActions = {
  authorizeUser,
  createExport,
  deleteExistingExports,
  getExistingExports,
  getExistingExportsStatus
};

export {
  platformActions as default,
  platformActions,
  authorizeUser,
  createExport,
  deleteExistingExports,
  getExistingExports,
  getExistingExportsStatus
};
