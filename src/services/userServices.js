import Cookies from 'js-cookie';
import LocaleCode from 'locale-code';
import { helpers } from '../common/helpers';

const authorizeUser = () => {
  let returnMethod = helpers.noopPromise;

  try {
    returnMethod = window.insights.chrome.auth.getUser;
  } catch (e) {
    if (!helpers.TEST_MODE) {
      console.warn(`{ getUser } = insights.chrome.auth: ${e.message}`);
    }
  }

  return returnMethod;
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
