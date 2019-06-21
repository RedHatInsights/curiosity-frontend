const generateId = prefix =>
  `${prefix || 'generatedid'}-${(process.env.REACT_APP_ENV !== 'test' && Math.ceil(1e5 * Math.random())) || ''}`;

const noop = Function.prototype;

const noopPromise = Promise.resolve({});

const noopTranslate = (key, value) => value || `t('${key}')`;

const DEV_MODE = process.env.REACT_APP_ENV === 'development';

const PROD_MODE = process.env.REACT_APP_ENV === 'production';

const REVIEW_MODE = process.env.REACT_APP_ENV === 'review';

const TEST_MODE = process.env.REACT_APP_ENV === 'test';

const PUBLIC_URL = process.env.PUBLIC_URL || '/';

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
  PUBLIC_URL,
  UI_VERSION
};

export { helpers as default, helpers };
