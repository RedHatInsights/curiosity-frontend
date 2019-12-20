import Cookies from 'js-cookie';
import LocaleCode from 'locale-code';
import { helpers } from '../common/helpers';

const authorizeUser = async () => {
  let getUserData = (helpers.TEST_MODE || helpers.DEV_MODE) && {};
  let platformResponse;

  if (!helpers.DEV_MODE && window.insights && window.insights.chrome.auth.getUser) {
    getUserData = await window.insights.chrome.auth.getUser();
  }

  /**
   * ToDo: evaluate this periodically, expecting specific platform behavior, this could be simplified
   * Basic check for missing user data. Allowing GUI auth to pass in those cases affects our API
   * auth for RHSM, so we block it.
   */
  if (getUserData) {
    platformResponse = Promise.resolve(getUserData);
  } else {
    platformResponse = Promise.reject(new Error('{ getUser } = insights.chrome.auth'));
  }

  return platformResponse;
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
