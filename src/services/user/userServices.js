import Cookies from 'js-cookie';
import LocaleCode from 'iso-639-1';
import { serviceCall } from '../config';
import { helpers } from '../../common';

/**
 * User, and RHSM, calls for locale and Opt-In.
 *
 * @memberof User
 * @module UserServices
 */

/**
 * ToDo: Review moving the getLocale function under platformServices.
 * Also review using window.navigator.language as the primary pull for language.
 */
/**
 * Return a browser locale, or fallback towards the platform locale cookie
 *
 * @returns {Promise<*>}
 */
const getLocale = () => {
  const defaultLang = {
    value: helpers.UI_LOCALE_DEFAULT,
    key: helpers.UI_LOCALE_DEFAULT_DESC
  };
  const parseLang = value => {
    const key = (value && LocaleCode.getName(value.split('-')[0])) || null;
    return (key && { value, key }) || undefined;
  };

  return serviceCall({
    url: async () => {
      const cookieLang = await (Cookies.get(process.env.REACT_APP_CONFIG_SERVICE_LOCALES_COOKIE) || '').replace(
        '_',
        '-'
      );

      return parseLang(cookieLang) || defaultLang;
    }
  });
};

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

const userServices = { getLocale, deleteAccountOptIn, getAccountOptIn, updateAccountOptIn };

/**
 * Expose services to the browser's developer console.
 */
helpers.browserExpose({ userServices });

export { userServices as default, userServices, getLocale, deleteAccountOptIn, getAccountOptIn, updateAccountOptIn };
