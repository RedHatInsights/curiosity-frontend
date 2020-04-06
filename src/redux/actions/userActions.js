import { userTypes } from '../types';
import { userServices } from '../../services/userServices';

/**
 * Get an emulated API response from the platforms "getUser" method.
 *
 * @returns {Function}
 */
const authorizeUser = () => dispatch =>
  dispatch({
    type: userTypes.USER_AUTH,
    payload: userServices.authorizeUser()
  });

/**
 * Get a user's locale.
 *
 * @returns {{payload: Promise<{data: void}>, type: string}}
 */
const getLocale = () => ({
  type: userTypes.USER_LOCALE,
  payload: userServices.getLocale()
});

/**
 * Delete a user's opt-in.
 *
 * @returns {Function}
 */
const deleteAccountOptIn = () => dispatch =>
  dispatch({
    type: userTypes.DELETE_USER_OPTIN,
    payload: userServices.deleteAccountOptIn(),
    meta: {
      notifications: {}
    }
  });

/**
 * Get a user's opt-in config.
 *
 * @returns {Function}
 */
const getAccountOptIn = () => dispatch =>
  dispatch({
    type: userTypes.GET_USER_OPTIN,
    payload: userServices.getAccountOptIn(),
    meta: {
      notifications: {}
    }
  });

/**
 * Update a user's opt-in.
 *
 * @param {object} query
 * @returns {Function}
 */
const updateAccountOptIn = (query = {}) => dispatch =>
  dispatch({
    type: userTypes.UPDATE_USER_OPTIN,
    payload: userServices.updateAccountOptIn(query),
    meta: {
      query,
      notifications: {}
    }
  });

const userActions = { authorizeUser, getLocale, deleteAccountOptIn, getAccountOptIn, updateAccountOptIn };

export {
  userActions as default,
  userActions,
  authorizeUser,
  getLocale,
  deleteAccountOptIn,
  getAccountOptIn,
  updateAccountOptIn
};
