import { appTypes } from '../types';
import { userServices } from '../../services/user/userServices';

/**
 * User, and RHSM, service wrappers for dispatch, state update.
 *
 * @memberof Actions
 * @module UserActions
 */

/**
 * Get a user's locale.
 *
 * @returns {{payload: Promise<{data: void}>, type: string}}
 */
const getLocale = () => dispatch =>
  dispatch({
    type: appTypes.USER_LOCALE,
    payload: userServices.getLocale()
  });

/**
 * Delete a user's opt-in.
 *
 * @returns {Function}
 */
const deleteAccountOptIn = () => dispatch =>
  dispatch({
    type: appTypes.DELETE_USER_OPTIN,
    payload: userServices.deleteAccountOptIn(),
    meta: {}
  });

/**
 * Get a user's opt-in config.
 *
 * @returns {Function}
 */
const getAccountOptIn = () => dispatch =>
  dispatch({
    type: appTypes.GET_USER_OPTIN,
    payload: userServices.getAccountOptIn(),
    meta: {}
  });

/**
 * Update a user's opt-in.
 *
 * @param {object} query
 * @returns {Function}
 */
const updateAccountOptIn =
  (query = {}) =>
  dispatch =>
    Promise.resolve(
      dispatch({
        type: appTypes.UPDATE_USER_OPTIN,
        payload: userServices.updateAccountOptIn(query),
        meta: {
          query
        }
      })
    );

const userActions = { getLocale, deleteAccountOptIn, getAccountOptIn, updateAccountOptIn };

export { userActions as default, userActions, getLocale, deleteAccountOptIn, getAccountOptIn, updateAccountOptIn };
