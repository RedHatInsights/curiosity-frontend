import numbro from 'numbro';
import cryptoSha1 from 'crypto-js/sha1';
import _cloneDeep from 'lodash/cloneDeep';
import _isPlainObject from 'lodash/isPlainObject';

/**
 * @memberof Helpers
 * @module General
 */

/**
 * Fill for AggregatedError
 *
 * @param {Array|*} errors An array of errors
 * @param {string|*} message
 * @param {object} options
 * @param {string} options.name
 * @returns {Error|window.AggregateError<Error>}
 */
const aggregatedError = (errors, message, { name = 'AggregateError' } = {}) => {
  const { AggregateError, Error } = window;
  let err;

  if (AggregateError) {
    err = new AggregateError(errors, message);
  } else {
    err = new Error(message);
    err.name = name;
    err.errors = (Array.isArray(errors) && errors) || [errors];
    err.isEmulated = true;
  }
  return err;
};

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
 * Generate a consistent hash
 *
 * @param {*|object} anyValue
 * @param {object} options
 * @param {Function} options.method
 * @returns {*|string}
 */
const generateHash = (anyValue, { method = cryptoSha1 } = {}) =>
  method(
    JSON.stringify({
      value:
        (_isPlainObject(anyValue) &&
          JSON.stringify(
            Object.entries(anyValue).sort(([a], [b]) => a.localeCompare(b)),
            (key, value) => {
              if (value !== anyValue && _isPlainObject(value)) {
                return JSON.stringify(Object.entries(value).sort(([a], [b]) => a.localeCompare(b)) || []);
              }
              if (typeof value === 'function') {
                return value.toString();
              }
              return value;
            }
          )) ||
        `${typeof anyValue}${anyValue?.toString() || anyValue}`
    })
  ).toString();

/**
 * Simple memoize, cache based arguments with adjustable limit.
 *
 * @param {Function} func
 * @param {object} options
 * @param {number} options.cacheLimit
 * @returns {Function}
 */
const memo = (func, { cacheLimit = 1 } = {}) => {
  // eslint-disable-next-line func-names
  const ized = function () {
    const cache = [];

    return (...args) => {
      const key = JSON.stringify({ value: [...args].map(arg => (typeof arg === 'function' && arg.toString()) || arg) });
      const keyIndex = cache.indexOf(key);

      if (keyIndex < 0) {
        const result = func.call(null, ...args);
        cache.unshift(key, result);
        cache.length = cacheLimit * 2;
        return cache[1];
      }

      return cache[keyIndex + 1];
    };
  };

  return ized();
};

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
 * ToDo: review adding "locale" for numbro
 */
/**
 * Convenience wrapper for numbro. Numbro assumes all values passed to it conform as "number".
 * This allows us to optional chain the function results.
 *
 * @param {*} value
 * @returns {numbro.Numbro|*}
 */
const numberDisplay = value => {
  if (typeof value !== 'number' || Number.isNaN(value)) {
    return value;
  }
  return numbro(value);
};

/**
 * Recursive object and props freeze/immutable.
 * Used from deep-freeze-strict, an older npm package, license - public domain
 * https://bit.ly/3HR4XWP and https://bit.ly/3Ye4S6B
 *
 * @param {object} obj
 * @returns {*}
 */
const objFreeze = obj => {
  Object.freeze(obj);

  const oIsFunction = typeof obj === 'function';
  const hasOwnProp = Object.prototype.hasOwnProperty;

  Object.getOwnPropertyNames(obj).forEach(prop => {
    if (
      hasOwnProp.call(obj, prop) &&
      (oIsFunction ? prop !== 'caller' && prop !== 'callee' && prop !== 'arguments' : true) &&
      obj[prop] !== null &&
      (typeof obj[prop] === 'object' || typeof obj[prop] === 'function') &&
      !Object.isFrozen(obj[prop])
    ) {
      objFreeze(obj[prop]);
    }
  });

  return obj;
};

/**
 * Quick set data as "immutable-like". Typically used to pass object and array data through configuration callbacks.
 *
 * @param {*} data
 * @param {object} options
 * @param {boolean} options.isClone Clone your data before mutating it.
 * @returns {*}
 */
const setImmutableData = memo(
  (data, { isClone = false } = {}) => (isClone && objFreeze(_cloneDeep(data))) || objFreeze(data)
);

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
 * FixMe: Replace, or alias towards UI_DEPLOY_PATH_PREFIX, this dotenv parameter if/when "beta" and "preview" are normalized.
 */
/**
 * Patch for compensating for platform updates where a mismatch between "beta" and "preview" for redirects means
 * that the same prefix can no longer be used for both additional remote resources and links. See build scripts for generated prefix.
 *
 * @type {string}
 */
const UI_DEPLOY_PATH_LINK_PREFIX = process.env.REACT_APP_UI_DEPLOY_PATH_LINK_PREFIX;

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
 * Disable platform notifications.
 * See dotenv config files for activation.
 *
 * @type {boolean}
 */
const UI_DISABLED_NOTIFICATIONS = process.env.REACT_APP_UI_DISABLED_NOTIFICATIONS === 'true';

/**
 * Disable the inventory/table aspect of the UI.
 * See dotenv config files for activation.
 *
 * @type {boolean}
 */
const UI_DISABLED_TABLE = process.env.REACT_APP_UI_DISABLED_TABLE === 'true';

/**
 * Disable the current instances inventory/table aspect of the UI.
 * See dotenv config files for activation.
 *
 * @type {boolean}
 */
const UI_DISABLED_TABLE_INSTANCES = process.env.REACT_APP_UI_DISABLED_TABLE_INSTANCES === 'true';

/**
 * Disable the current subscriptions inventory/table aspect of the UI.
 * See dotenv config files for activation.
 *
 * @type {boolean}
 */
const UI_DISABLED_TABLE_SUBSCRIPTIONS = process.env.REACT_APP_UI_DISABLED_TABLE_SUBSCRIPTIONS === 'true';

/**
 * Disable the filter toolbar aspect of the UI.
 * See dotenv config files for activation.
 *
 * @type {boolean}
 */
const UI_DISABLED_TOOLBAR = process.env.REACT_APP_UI_DISABLED_TOOLBAR === 'true';

/**
 * Disable the group variant filter aspect of the toolbar.
 * See dotenv config files for activation.
 *
 * @type {boolean}
 */
const UI_DISABLED_TOOLBAR_GROUP_VARIANT = process.env.REACT_APP_UI_DISABLED_TOOLBAR_GROUP_VARIANT === 'true';

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
 * UI state logging file name.
 *
 * @type {string}
 */
const UI_LOGGER_FILE = process.env.REACT_APP_UI_LOGGER_FILE || 'debug_log_{0}.json';

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
 * @param {boolean} options.limit
 * @param {string} options.id
 */
const browserExpose = (obj = {}, options) => {
  const { limit = PROD_MODE, id = UI_WINDOW_ID } = options || {};
  window[id] = (limit && { ...window[id] }) || { ...window[id], ...obj };
};

const helpers = {
  aggregatedError,
  browserExpose,
  generateHash,
  generateId,
  isDate,
  isPromise,
  memo,
  noop,
  noopPromise,
  numberDisplay,
  objFreeze,
  setImmutableData,
  DEV_MODE,
  PROD_MODE,
  REVIEW_MODE,
  TEST_MODE,
  UI_DEPLOY_PATH_PREFIX,
  UI_DEPLOY_PATH_LINK_PREFIX,
  UI_DISABLED,
  UI_DISABLED_GRAPH,
  UI_DISABLED_NOTIFICATIONS,
  UI_DISABLED_TABLE,
  UI_DISABLED_TABLE_INSTANCES,
  UI_DISABLED_TABLE_SUBSCRIPTIONS,
  UI_DISABLED_TOOLBAR,
  UI_DISABLED_TOOLBAR_GROUP_VARIANT,
  UI_DISPLAY_NAME,
  UI_DISPLAY_CONFIG_NAME,
  UI_DISPLAY_START_NAME,
  UI_LINK_CONTACT_US,
  UI_LINK_LEARN_MORE,
  UI_LINK_REPORT_ACCURACY_RECOMMENDATIONS,
  UI_LOCALE_DEFAULT,
  UI_LOCALE_DEFAULT_DESC,
  UI_LOGGER_ID,
  UI_LOGGER_FILE,
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
