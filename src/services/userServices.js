import Cookies from 'js-cookie';
import LocaleCode from 'locale-code';
import axios from 'axios';
import serviceConfig from './config';
import { helpers } from '../common/helpers';

const authorizeUser = () => {
  let returnMethod = helpers.noopPromise;

  try {
    if (!helpers.DEV_MODE) {
      returnMethod = window.insights.chrome.auth.getUser;
    }
  } catch (e) {
    if (!helpers.TEST_MODE) {
      console.warn(`{ getUser } = insights.chrome.auth: ${e.message}`);
    }
  }

  return returnMethod;
};

/**
 * @api {get} /api/rhsm-subscriptions/v1/version
 * @apiDescription Retrieve API version information
 *
 * Reference [RHSM API](https://github.com/RedHatInsights/rhsm-subscriptions/blob/master/api/rhsm-subscriptions-api-spec.yaml)
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "build": {
 *       "version": "0.0.0",
 *       "gitDescription": "lorem ipsum",
 *       "artifact": "dolor sit",
 *       "name": "lorem",
 *       "group": "ipsum",
 *       "gitHash": "0000000000000000"
 *     }
 *
 * @apiError {String} detail
 * @apiErrorExample {text} Error-Response:
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
const getApiVersion = () =>
  axios(
    serviceConfig({
      url: process.env.REACT_APP_SERVICES_RHSM_VERSION
    })
  );

const getLocaleFromCookie = () => {
  const value = (Cookies.get(process.env.REACT_APP_CONFIG_SERVICE_LOCALES_COOKIE) || '').replace('_', '-');
  const key = (value && LocaleCode.getLanguageName(value)) || null;

  return (key && { value, key }) || null;
};

const getLocale = () => {
  const defaultLocale = {
    value: process.env.REACT_APP_CONFIG_SERVICE_LOCALES_DEFAULT_LNG,
    key: process.env.REACT_APP_CONFIG_SERVICE_LOCALES_DEFAULT_LNG_DESC
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

const userServices = { authorizeUser, getApiVersion, getLocale, logoutUser };

export { userServices as default, userServices, authorizeUser, getApiVersion, getLocale, logoutUser };
