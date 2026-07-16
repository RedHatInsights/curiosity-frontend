import { platformTypes } from '../types';
import { platformServices } from '../../services/platform/platformServices';

/**
 * Platform service wrappers for dispatch, state update.
 *
 * @memberof Actions
 * @module PlatformActions
 */

/**
 * Get an emulated API response from the platform's "getUser" global method.
 *
 * @param {object} params
 * @param {Function} params.getUser
 * @returns {Function}
 */
const authorizeUser =
  ({ getUser } = {}) =>
  dispatch =>
    dispatch({
      type: platformTypes.PLATFORM_USER_AUTH,
      payload: Promise.all([platformServices.getUser({ getUser })])
    });

/**
 * Get all existing exports, if "pending" then poll, and when complete download.
 * Include toast notifications via a try/catch using the Promise.resolve.
 *
 * @param {Array} existingExports
 * @returns {Function}
 */
const getExistingExports = existingExports => dispatch =>
  Promise.resolve(
    dispatch({
      type: platformTypes.GET_PLATFORM_EXPORT_EXISTING,
      payload: platformServices.getExistingExports(existingExports),
      meta: {}
    })
  );

/**
 * Delete all existing exports.
 *
 * @param {Array<{ id: string }>} existingExports
 * @returns {Function}
 */
const deleteExistingExports = existingExports => dispatch =>
  dispatch({
    type: platformTypes.DELETE_PLATFORM_EXPORT_EXISTING,
    payload: Promise.all(existingExports.map(({ id }) => platformServices.deleteExport(id))),
    meta: {}
  });

/**
 * Get a status from any existing exports. Display a confirmation for downloading, or ignoring, the exports.
 *
 * @returns {Function}
 */
const getExistingExportsStatus = () => dispatch =>
  dispatch({
    type: platformTypes.SET_PLATFORM_EXPORT_EXISTING_STATUS,
    payload: platformServices.getExistingExportsStatus(),
    meta: {}
  });

/**
 * Create an export for download. Include toast notifications via a try/catch using the Promise.resolve.
 *
 * @param {string} id
 * @param {object} data
 * @param {object} options Apply polling options
 * @returns {Function}
 */
const createExport =
  (id, data = {}, options = {}) =>
  dispatch =>
    Promise.resolve(
      dispatch({
        type: platformTypes.SET_PLATFORM_EXPORT_CREATE,
        payload: platformServices.postExport(data, options),
        meta: {
          id
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
