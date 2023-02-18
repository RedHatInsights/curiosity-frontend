/**
 * @memberof Types
 * @module UserTypes
 */

const DELETE_USER_OPTIN = 'DELETE_USER_OPTIN';
const GET_USER_OPTIN = 'GET_USER_OPTIN';
const UPDATE_USER_OPTIN = 'UPDATE_USER_OPTIN';
const USER_LOCALE = 'USER_LOCALE';
const USER_LOGOUT = 'USER_LOGOUT';

/**
 * User action, reducer types.
 *
 * @type {{USER_LOGOUT: string, USER_LOCALE: string, GET_USER_OPTIN: string,
 *     UPDATE_USER_OPTIN: string, DELETE_USER_OPTIN: string}}
 */
const userTypes = { DELETE_USER_OPTIN, GET_USER_OPTIN, UPDATE_USER_OPTIN, USER_LOCALE, USER_LOGOUT };

export {
  userTypes as default,
  userTypes,
  DELETE_USER_OPTIN,
  GET_USER_OPTIN,
  UPDATE_USER_OPTIN,
  USER_LOCALE,
  USER_LOGOUT
};
