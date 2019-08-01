const generateId = prefix =>
  `${prefix || 'generatedid'}-${(process.env.REACT_APP_ENV !== 'test' && Math.ceil(1e5 * Math.random())) || ''}`;

const noop = Function.prototype;

const noopPromise = Promise.resolve({});

const noopTranslate = (key, value) => value || `t('${key}')`;

const DEV_MODE = process.env.REACT_APP_ENV === 'development';

const PROD_MODE = process.env.REACT_APP_ENV === 'production';

const REVIEW_MODE = process.env.REACT_APP_ENV === 'review';

const TEST_MODE = process.env.REACT_APP_ENV === 'test';

const UI_DEPLOY_PATH_PREFIX = process.env.REACT_APP_UI_DEPLOY_PATH_PREFIX;

const UI_DISABLED = process.env.REACT_APP_UI_DISABLED === 'true';

const UI_DISPLAY_NAME = process.env.REACT_APP_UI_DISPLAY_NAME;

const UI_LOGGER_ID = process.env.REACT_APP_UI_LOGGER_ID || 'GUI';

const UI_NAME = process.env.REACT_APP_UI_NAME;

const UI_PATH = process.env.PUBLIC_URL || '/';

const UI_VERSION = process.env.REACT_APP_UI_VERSION;

const helpers = {
  generateId,
  noop,
  noopPromise,
  noopTranslate,
  DEV_MODE,
  PROD_MODE,
  REVIEW_MODE,
  TEST_MODE,
  UI_DEPLOY_PATH_PREFIX,
  UI_DISABLED,
  UI_DISPLAY_NAME,
  UI_LOGGER_ID,
  UI_NAME,
  UI_PATH,
  UI_VERSION
};

window[UI_LOGGER_ID] = { ...helpers };

export { helpers as default, helpers };
