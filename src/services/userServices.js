import Cookies from 'js-cookie';
import LocaleCode from 'locale-code';
import _isPlainObject from 'lodash/isPlainObject';
import { getUser } from './platformServices';

/**
 * Apply an emulated API response to the platforms getUser method.
 *
 * @returns {Promise<{data: void, message: string, status: number}>}
 */
const authorizeUser = async () => {
  let message = '{ getUser } = insights.chrome.auth';
  let userData;

  try {
    userData = await getUser();
  } catch (e) {
    message = e.message;
  }

  if (_isPlainObject(userData) && Object.keys(userData).length) {
    return Promise.resolve({ data: userData, message, status: 200 });
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

const userServices = { authorizeUser, getLocale, logoutUser };

export { userServices as default, userServices, authorizeUser, getLocale, logoutUser };
