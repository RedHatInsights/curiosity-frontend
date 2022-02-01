import Cookies from 'js-cookie';
import LocaleCode from 'locale-code';
import _isPlainObject from 'lodash/isPlainObject';
import { rbacConfig as permissions } from '../../config';
import { getUser, getUserPermissions } from '../platform/platformServices';
import { serviceCall } from '../config';
import { helpers } from '../../common';

/**
 * Apply an emulated API response to the platforms getUser method.
 *
 * @returns {Promise<{data: {permissions: (void|*[]), user: void}, message: string, status: number}>}
 */
const authorizeUser = async () => {
  const updatedPermissions = Object.keys(permissions);
  let message = '{ auth.getUser, getUserPermissions } = insights.chrome';
  let userData;
  let userPermissions;

  try {
    userData = await getUser();

    if (updatedPermissions.length) {
      const allPermissions = await Promise.all(updatedPermissions.map(app => getUserPermissions(app)));

      if (Array.isArray(allPermissions)) {
        userPermissions = [...allPermissions.flat()];
      }
    } else {
      userPermissions = await getUserPermissions();
    }
  } catch (e) {
    message = e.message;
  }

  if (_isPlainObject(userData) && Object.keys(userData).length) {
    return Promise.resolve({ data: { user: userData, permissions: userPermissions || [] }, message, status: 200 });
  }

  const emulatedErrorResponse = {
    ...new Error(message),
    message,
    status: 418
  };

  return Promise.reject(emulatedErrorResponse);
};

/**
 * Return a platform locale value from a cookie.
 *
 * @private
 * @returns {{value: string, key: string | null}|null}
 */
const getLocaleFromCookie = () => {
  const value = (Cookies.get(process.env.REACT_APP_CONFIG_SERVICE_LOCALES_COOKIE) || '').replace('_', '-');
  const key = (value && LocaleCode.getLanguageName(value)) || null;

  return (key && { value, key }) || null;
};

/**
 * Return platform locale.
 *
 * @returns {Promise<{data: void}>}
 */
const getLocale = () => {
  const defaultLocale = {
    value: helpers.UI_LOCALE_DEFAULT,
    key: helpers.UI_LOCALE_DEFAULT_DESC
  };

  return new Promise(resolve =>
    resolve({
      data: getLocaleFromCookie() || defaultLocale
    })
  );
};

const logoutUser = () =>
  new Promise(resolve => {
    resolve({});
  });

/**
 * @apiMock {DelayResponse} 2000
 * @api {delete} /api/rhsm-subscriptions/v1/opt-in
 * @apiDescription Delete a RHSM account opt-in config
 *
 * Reference [RHSM API](https://github.com/RedHatInsights/rhsm-subscriptions/blob/main/api/rhsm-subscriptions-api-spec.yaml)
 *
 * @apiSuccessExample {text} Success-Response:
 *     HTTP/1.1 204 OK
 *
 * @apiError {Array} errors
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *        "errors": [
 *          {
 *            "status": "string",
 *            "code": "string",
 *            "title": "string",
 *            "detail": "string"
 *          }
 *        ]
 *     }
 *
 * @apiError {Array} errors
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 403 Forbidden
 *     {
 *        "errors": [
 *          {
 *            "status": "string",
 *            "code": "string",
 *            "title": "string",
 *            "detail": "string"
 *          }
 *        ]
 *     }
 *
 * @apiError {Array} errors
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *        "errors": [
 *          {
 *            "status": "string",
 *            "code": "string",
 *            "title": "string",
 *            "detail": "string"
 *          }
 *        ]
 *     }
 *
 * @apiError {Array} errors
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *        "errors": [
 *          {
 *            "status": "string",
 *            "code": "string",
 *            "title": "string",
 *            "detail": "string"
 *          }
 *        ]
 *     }
 */
/**
 * Delete a RHSM account opt-in config.
 *
 * @returns {Promise<*>}
 */
const deleteAccountOptIn = () =>
  serviceCall({
    method: 'delete',
    url: process.env.REACT_APP_SERVICES_RHSM_OPTIN
  });

/**
 * @api {get} /api/rhsm-subscriptions/v1/opt-in
 * @apiDescription Get a RHSM account opt-in config
 *
 * Reference [RHSM API](https://github.com/RedHatInsights/rhsm-subscriptions/blob/main/api/rhsm-subscriptions-api-spec.yaml)
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *        "data": {
 *          "opt_in_complete": true,
 *          "account": {
 *            "account_number": 12345,
 *            "tally_sync_enabled": true,
 *            "tally_reporting_enabled": true,
 *            "opt_in_type": "API",
 *            "created": "2017-08-04T17:32:05Z",
 *            "last_updated": "2017-08-04T17:32:05Z"
 *          },
 *          "org": {
 *            "org_id": 1111,
 *            "conduit_sync_enabled": true,
 *            "opt_in_type": "API",
 *            "created": "2017-08-04T17:32:05Z",
 *            "last_updated": "2017-08-04T17:32:05Z"
 *          }
 *        },
 *        "meta": {
 *          "account_number": 12345,
 *          "org_id": 1111
 *        }
 *     }
 *
 * @apiError {Array} errors
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *        "errors": [
 *          {
 *            "status": "string",
 *            "code": "string",
 *            "title": "string",
 *            "detail": "string"
 *          }
 *        ]
 *     }
 */
/**
 * Get a RHSM account opt-in config.
 *
 * @param {object} options
 * @param {boolean} options.cancel
 * @param {string} options.cancelId
 * @returns {Promise<*>}
 */
const getAccountOptIn = (options = {}) => {
  const { cancel = true, cancelId } = options;
  return serviceCall({
    url: process.env.REACT_APP_SERVICES_RHSM_OPTIN,
    cancel,
    cancelId
  });
};

/**
 * @apiMock {DelayResponse} 1000
 * @apiMock {ForceStatus} 200
 * @api {put} /api/rhsm-subscriptions/v1/opt-in
 * @apiDescription Create/Update an account's opt-in configuration. Account and Org ID are defined by
 * the identity header. If no parameters are specified, everything will be enabled.
 *
 * Reference [RHSM API](https://github.com/RedHatInsights/rhsm-subscriptions/blob/main/api/rhsm-subscriptions-api-spec.yaml)
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *        "data": {
 *          "opt_in_complete": true,
 *          "account": {
 *            "account_number": 12345,
 *            "tally_sync_enabled": true,
 *            "tally_reporting_enabled": true,
 *            "opt_in_type": "API",
 *            "created": "2017-08-04T17:32:05Z",
 *            "last_updated": "2017-08-04T17:32:05Z"
 *          },
 *          "org": {
 *            "org_id": 1111,
 *            "conduit_sync_enabled": true,
 *            "opt_in_type": "API",
 *            "created": "2017-08-04T17:32:05Z",
 *            "last_updated": "2017-08-04T17:32:05Z"
 *          }
 *        },
 *        "meta": {
 *          "account_number": 12345,
 *          "org_id": 1111
 *        }
 *     }
 *
 * @apiError {Array} errors
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *        "errors": [
 *          {
 *            "status": "string",
 *            "code": "string",
 *            "title": "string",
 *            "detail": "string"
 *          }
 *        ]
 *     }
 */
/**
 * Update a RHSM account opt-in config.
 *
 * @param {object} params Query/search params
 * @returns {Promise<*>}
 */
const updateAccountOptIn = (params = {}) =>
  serviceCall({
    method: 'put',
    url: process.env.REACT_APP_SERVICES_RHSM_OPTIN,
    params
  });

const userServices = { authorizeUser, getLocale, logoutUser, deleteAccountOptIn, getAccountOptIn, updateAccountOptIn };

/**
 * Expose services to the browser's developer console.
 */
helpers.browserExpose({ userServices });

export {
  userServices as default,
  userServices,
  authorizeUser,
  getLocale,
  logoutUser,
  deleteAccountOptIn,
  getAccountOptIn,
  updateAccountOptIn
};
