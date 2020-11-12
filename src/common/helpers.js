/**
 * Generate a random'ish ID.
 *
 * @param {string} prefix
 * @returns {string}
 */
const generateId = prefix =>
  `${prefix || 'generatedid'}-${(process.env.REACT_APP_ENV !== 'test' && Math.ceil(1e5 * Math.random())) || ''}`;

/**
 * Check if "is a Date"
 *
 * @param {Date|*} date
 * @returns {boolean}
 */
const isDate = date => Object.prototype.toString.call(date) === '[object Date]';

/**
 * Check if "is a Promise", "Promise like".
 *
 * @param {Promise|*} obj
 * @returns {boolean}
 */
const isPromise = obj => /^\[object (Promise|Async|AsyncFunction)]/.test(Object.prototype.toString.call(obj));

/**
 * An empty function.
 * Typically used as a default prop.
 */
const noop = Function.prototype;

/**
 * An empty promise.
 * Typically used as a default prop, or during testing.
 *
 * @type {Promise<{}>}
 */
const noopPromise = Promise.resolve({});

/**
 * A placeholder for "t", translation method.
 * Associated with the i18n package, and typically used as a default prop.
 *
 * @param {string} key
 * @param {string|object} value
 * @param {Array} components
 * @returns {string}
 */
const noopTranslate = (key, value, components) =>
  `t(${key}${(value && `, ${(typeof value === 'string' && value) || (value && JSON.stringify(value))}`) || ''}${
    (components && `, ${components}`) || ''
  })`;

/**
 * Is dev mode active.
 * Associated with using the NPM script "start". See dotenv config files for activation.
 *
 * @type {boolean}
 */
const DEV_MODE = process.env.REACT_APP_ENV === 'development';

/**
 * Is prod mode active.
 * Associated with production builds. See dotenv config files for activation.
 *
 * @type {boolean}
 */
const PROD_MODE = process.env.REACT_APP_ENV === 'production';

/**
 * Is review/proxy mode active.
 * Associated with using the NPM script "start:proxy". See dotenv config files for activation.
 *
 * @type {boolean}
 */
const REVIEW_MODE = process.env.REACT_APP_ENV === 'review';

/**
 * Is test mode active.
 * Associated with running unit tests. See dotenv config files for activation.
 *
 * @type {boolean}
 */
const TEST_MODE = process.env.REACT_APP_ENV === 'test';

/**
 * Apply a path prefix for routing.
 * Typically associated with applying a "beta" path prefix. See dotenv config files for updating. See build scripts for generated prefix.
 *
 * @type {string}
 */
const UI_DEPLOY_PATH_PREFIX = process.env.REACT_APP_UI_DEPLOY_PATH_PREFIX;

/**
 * Disable an aspect of the UI.
 * Typically associated with disabling views through route settings. See dotenv config files for activation.
 *
 * @type {boolean}
 */
const UI_DISABLED = process.env.REACT_APP_UI_DISABLED === 'true';

/**
 * Disable the graph card aspect of the UI.
 * See dotenv config files for activation.
 *
 * @type {boolean}
 */
const UI_DISABLED_GRAPH = process.env.REACT_APP_UI_DISABLED_GRAPH === 'true';

/**
 * Disable the inventory/table aspect of the UI.
 * See dotenv config files for activation.
 *
 * @type {boolean}
 */
const UI_DISABLED_TABLE = process.env.REACT_APP_UI_DISABLED_TABLE === 'true';

/**
 * Disable the filter toolbar aspect of the UI.
 * See dotenv config files for activation.
 *
 * @type {boolean}
 */
const UI_DISABLED_TOOLBAR = process.env.REACT_APP_UI_DISABLED_TOOLBAR === 'true';

/**
 * UI application name.
 * See dotenv config files for updating.
 *
 * @type {string}
 */
const UI_DISPLAY_NAME = process.env.REACT_APP_UI_DISPLAY_NAME;

/**
 * UI application configuration name.
 * See dotenv config files for updating.
 *
 * @type {string}
 */
const UI_DISPLAY_CONFIG_NAME = process.env.REACT_APP_UI_DISPLAY_CONFIG_NAME;

/**
 * UI application sentence start name.
 * See dotenv config files for updating.
 *
 * @type {string}
 */
const UI_DISPLAY_START_NAME = process.env.REACT_APP_UI_DISPLAY_START_NAME;

/**
 * A url, or uri, for "contact us".
 *
 * @type {string}
 */
const UI_LINK_CONTACT_US = process.env.REACT_APP_UI_LINK_CONTACT_US;

/**
 * A url, or uri, for "learn more".
 *
 * @type {string}
 */
const UI_LINK_LEARN_MORE = process.env.REACT_APP_UI_LINK_LEARN_MORE;

/**
 * A url, or uri, for "recommend actions"
 *
 * @type {string}
 */
const UI_LINK_REPORT_ACCURACY_RECOMMENDATIONS = process.env.REACT_APP_UI_LINK_REPORT_ACCURACY_RECOMMENDATIONS;

/**
 * UI locale default.
 *
 * @type {string}
 */
const UI_LOCALE_DEFAULT = process.env.REACT_APP_CONFIG_SERVICE_LOCALES_DEFAULT_LNG;

/**
 * UI locale default description.
 *
 * @type {string}
 */
const UI_LOCALE_DEFAULT_DESC = process.env.REACT_APP_CONFIG_SERVICE_LOCALES_DEFAULT_LNG_DESC;

/**
 * UI state logging name/id.
 * See dotenv config files for updating.
 *
 * @type {string}
 */
const UI_LOGGER_ID = process.env.REACT_APP_UI_LOGGER_ID || 'GUI';

/**
 * UI packaged application name.
 * See dotenv config files for updating.
 *
 * @type {string}
 */
const UI_NAME = process.env.REACT_APP_UI_NAME;

/**
 * UI packaged application path, with generated prefix.
 * See dotenv config files for updating. See build scripts for generated prefix.
 *
 * @type {string}
 */
const UI_PATH = process.env.PUBLIC_URL || '/';

/**
 * UI packaged application version, with generated hash.
 * See dotenv config files for updating. See build scripts for generated hash.
 *
 * @type {string}
 */
const UI_VERSION = process.env.REACT_APP_UI_VERSION;

/**
 * UI exposed window name/id.
 * See dotenv config files for updating.
 *
 * @type {string}
 */
const UI_WINDOW_ID = process.env.REACT_APP_UI_WINDOW_ID || 'GUI';

/**
 * Expose an application specific object.
 * Associated with access on a browser's developer console. Limits exposed additions to
 * test and non-production environments only. Exposes helpers across all environments.
 *
 * @param {object} obj
 * @param {object} options
 * @property {boolean} limit
 * @property {string} id
 */
const browserExpose = (obj = {}, options) => {
  const { limit = PROD_MODE, id = UI_WINDOW_ID } = options || {};
  window[id] = (limit && { ...window[id] }) || { ...window[id], ...obj };
};

const helpers = {
  browserExpose,
  generateId,
  isDate,
  isPromise,
  noop,
  noopPromise,
  noopTranslate,
  DEV_MODE,
  PROD_MODE,
  REVIEW_MODE,
  TEST_MODE,
  UI_DEPLOY_PATH_PREFIX,
  UI_DISABLED,
  UI_DISABLED_GRAPH,
  UI_DISABLED_TABLE,
  UI_DISABLED_TOOLBAR,
  UI_DISPLAY_NAME,
  UI_DISPLAY_CONFIG_NAME,
  UI_DISPLAY_START_NAME,
  UI_LINK_CONTACT_US,
  UI_LINK_LEARN_MORE,
  UI_LINK_REPORT_ACCURACY_RECOMMENDATIONS,
  UI_LOCALE_DEFAULT,
  UI_LOCALE_DEFAULT_DESC,
  UI_LOGGER_ID,
  UI_NAME,
  UI_PATH,
  UI_VERSION,
  UI_WINDOW_ID
};

/**
 * Expose helpers to the browser's developer console.
 */
helpers.browserExpose({ ...helpers }, { limit: false });

export { helpers as default, helpers };
