/**
 * Generate a random'ish ID.
 *
 * @param {string} prefix
 * @returns {string}
 */
const generateId = prefix =>
  `${prefix || 'generatedid'}-${(process.env.REACT_APP_ENV !== 'test' && Math.ceil(1e5 * Math.random())) || ''}`;

// ToDo: expand to include "async" check in scenarios where async/await are utilized.
/**
 * Check if "is a Promise".
 *
 * @param {Promise|*} obj
 * @returns {boolean}
 */
const isPromise = obj => Object.prototype.toString.call(obj) === '[object Promise]';

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
 * @param {string} value
 * @returns {string}
 */
const noopTranslate = (key, value) => `t(${key}${(value && `, ${value}`) || ''})`;

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

const helpers = {
  generateId,
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
  UI_LOGGER_ID,
  UI_NAME,
  UI_PATH,
  UI_VERSION
};

/**
 * Expose an application specific type.
 * Associated with access on a browser's developer console.
 *
 * @type {{UI_DISABLED_TOOLBAR: boolean, UI_DISPLAY_CONFIG_NAME: string, generateId: function(string): string,
 *     REVIEW_MODE: boolean, UI_LOGGER_ID: string, UI_DISABLED_GRAPH: boolean, UI_DISPLAY_START_NAME: string,
 *     UI_DEPLOY_PATH_PREFIX: string, UI_DISPLAY_NAME: string, noopPromise: Promise<{}>, DEV_MODE: boolean,
 *     TEST_MODE: boolean, noop: Function, isPromise: function((Promise|*)): boolean, UI_PATH: string,
 *     UI_NAME: string, UI_DISABLED: boolean, UI_DISABLED_TABLE: boolean, UI_VERSION: string, PROD_MODE: boolean,
 *     noopTranslate: function(string, string): string}}
 */
window[UI_LOGGER_ID] = { ...helpers };

export { helpers as default, helpers };
