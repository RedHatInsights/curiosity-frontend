/**
 * Basic user authentication.
 * @returns {Promise<void>}
 */
const getUser = async () => {
  const { insights } = window;
  try {
    return await insights.chrome.auth.getUser();
  } catch (e) {
    throw new Error(`{ getUser } = insights.chrome.auth, ${e.message}`);
  }
};

/**
 * Help initialize global platform methods.
 * @returns {Promise<void>}
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
 * Apply on "app_navigation" event. Return an un-listener.
 * @param callback {function}
 * @returns {Function}
 */
const onNavigation = callback => {
  const { insights } = window;
  try {
    return insights.chrome.on('APP_NAVIGATION', callback);
  } catch (e) {
    throw new Error(`{ on } = insights.chrome, ${e.message}`);
  }
};

// FixMe: Revert catch to throwing an error. Relaxed for development
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
    const error = `{ identifyApp } = insights.chrome, ${e.message}`;
    await Promise.reject(error);
  }
};

/**
 * Set platform left hand navigation active item.
 * @param data {Array}
 * @returns {*}
 */
const setNavigation = (data = []) => {
  const { insights, location } = window;
  try {
    return insights.chrome.navigation(
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
