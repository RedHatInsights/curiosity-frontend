import Cookies from 'js-cookie';
import LocaleCode from 'locale-code';
import { getUser } from './platformServices';

const authorizeUser = async () => {
  let message = '{ getUser } = insights.chrome.auth';
  let userData;

  try {
    userData = await getUser();
  } catch (e) {
    message = e.message;
  }

  if (userData) {
    return Promise.resolve({ data: userData, message, status: 200 });
  }

  const emulatedErrorResponse = {
    ...new Error(message),
    message,
    status: 418
  };

  return Promise.reject(emulatedErrorResponse);
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
