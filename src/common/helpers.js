const generateId = prefix =>
  `${prefix || 'generatedid'}-${(process.env.REACT_APP_ENV !== 'test' && Math.ceil(1e5 * Math.random())) || ''}`;

const isPromise = obj => Object.prototype.toString.call(obj) === '[object Promise]';

const noop = Function.prototype;

const noopPromise = Promise.resolve({});

const noopTranslate = (key, value) => `t(${key}${(value && `, ${value}`) || ''})`;

const DEV_MODE = process.env.REACT_APP_ENV === 'development';

const PROD_MODE = process.env.REACT_APP_ENV === 'production';

const REVIEW_MODE = process.env.REACT_APP_ENV === 'review';

const TEST_MODE = process.env.REACT_APP_ENV === 'test';

const UI_DEPLOY_PATH_PREFIX = process.env.REACT_APP_UI_DEPLOY_PATH_PREFIX;

const UI_DISABLED = process.env.REACT_APP_UI_DISABLED === 'true';

const UI_DISABLED_GRAPH = process.env.REACT_APP_UI_DISABLED_GRAPH === 'true';

const UI_DISABLED_TABLE = process.env.REACT_APP_UI_DISABLED_TABLE === 'true';

const UI_DISABLED_TOOLBAR = process.env.REACT_APP_UI_DISABLED_TOOLBAR === 'true';

const UI_DISPLAY_NAME = process.env.REACT_APP_UI_DISPLAY_NAME;

const UI_DISPLAY_CONFIG_NAME = process.env.REACT_APP_UI_DISPLAY_CONFIG_NAME;

const UI_DISPLAY_START_NAME = process.env.REACT_APP_UI_DISPLAY_START_NAME;

const UI_LOGGER_ID = process.env.REACT_APP_UI_LOGGER_ID || 'GUI';

const UI_NAME = process.env.REACT_APP_UI_NAME;

const UI_PATH = process.env.PUBLIC_URL || '/';

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

window[UI_LOGGER_ID] = { ...helpers };

export { helpers as default, helpers };
