import { helpers } from '../common';

const emulateService = async ({ successStatus = 200, errorStatus = 418, message = `I'm a teapot`, callback }) => {
  const response = {
    status: errorStatus,
    message
  };
  let getData = (helpers.TEST_MODE || helpers.DEV_MODE) && {};

  if (!helpers.DEV_MODE && callback) {
    getData = await callback();
  }

  if (getData) {
    response.status = successStatus;
    response.data = getData;
    return Promise.resolve(response);
  }

  const emulatedError = { ...new Error(message), ...response };
  return Promise.reject(emulatedError);
};

/**
 * Basic user authentication.
 * @returns {Promise<{statusText: string, message: string, status: number}>}
 */
const getUser = () => {
  const { insights } = window;
  const method = insights && insights.chrome && insights.chrome.auth.getUser;
  return emulateService({ message: '{ getUser } = insights.chrome.auth', callback: method });
};

/**
 * Help initialize global platform methods.
 * @returns {Promise<{statusText: string, message: string, status: number}>}
 */
const initializeChrome = async () => {
  const { insights } = window;
  try {
    await insights.chrome.init();
  } catch (e) {
    throw new Error(`{ init } = insights.chrome, ${e.message}`);
  }
};

/**
 * Apply on "app_navigation" event.
 * @param callback {function}
 * @returns {Promise<void>}
 */
const onNavigation = async callback => {
  const { insights } = window;
  try {
    await insights.chrome.on('APP_NAVIGATION', callback);
  } catch (e) {
    throw new Error(`{ on } = insights.chrome, ${e.message}`);
  }
};

/**
 * Set application ID.
 * @param name {string}
 * @returns {Promise<void>}
 */
const setAppName = async (name = null) => {
  const { insights } = window;
  try {
    await insights.chrome.identifyApp(name);
  } catch (e) {
    throw new Error(`{ identifyApp } = insights.chrome, ${e.message}`);
  }
};

/**
 * Set platform left hand navigation active item.
 * @param data {Array}
 * @returns {Promise<void>}
 */
const setNavigation = async (data = []) => {
  const { insights, location } = window;
  try {
    await insights.chrome.navigation(
      data.map(item => ({
        ...item,
        active: item.id === location.pathname.split('/').slice(-1)[0]
      }))
    );
  } catch (e) {
    throw new Error(`{ navigation } = insights.chrome, ${e.message}`);
  }
};

const platformServices = { getUser, initializeChrome, onNavigation, setAppName, setNavigation };

export {
  platformServices as default,
  platformServices,
  getUser,
  initializeChrome,
  onNavigation,
  setAppName,
  setNavigation
};
