import Cookies from 'js-cookie';
import LocaleCode from 'locale-code';
import { helpers } from '../common/helpers';

/**
 * Emulate service response http status to aid in error handling.
 * @returns {Promise<{statusText: string, message: string, status: number}>}
 */
const authorizeUser = async () => {
  const response = {
    status: 418,
    message: '{ getUser } = insights.chrome.auth'
  };
  let getUserData = (helpers.TEST_MODE || helpers.DEV_MODE) && {};

  if (!helpers.DEV_MODE && window.insights && window.insights.chrome.auth.getUser) {
    getUserData = await window.insights.chrome.auth.getUser();
  }

  /**
   * ToDo: evaluate this periodically, expecting specific platform behavior.
   * Basic check for missing user data. Allowing GUI auth to pass with missing data affects our API
   * auth for RHSM, so we block it. An additional, more specific, check for "account_number" may be needed.
   */
  if (getUserData) {
    response.status = 200;
    response.data = getUserData;
    return Promise.resolve(response);
  }

  const emulatedError = { ...new Error('{ getUser } = insights.chrome.auth'), ...response };
  return Promise.reject(emulatedError);
};

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

const userServices = { authorizeUser, getLocale, logoutUser };

export { userServices as default, userServices, authorizeUser, getLocale, logoutUser };
