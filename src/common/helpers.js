/* eslint-disable camelcase */
import {
  global_breakpoint_xs,
  global_breakpoint_sm,
  global_breakpoint_md,
  global_breakpoint_lg,
  global_breakpoint_xl,
  global_breakpoint_2xl
} from '@patternfly/react-tokens';

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

const breakpoints = {
  xs: parseInt(global_breakpoint_xs.value, 10),
  sm: parseInt(global_breakpoint_sm.value, 10),
  md: parseInt(global_breakpoint_md.value, 10),
  lg: parseInt(global_breakpoint_lg.value, 10),
  xl: parseInt(global_breakpoint_xl.value, 10),
  xl2: parseInt(global_breakpoint_2xl.value, 10)
};

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
  UI_VERSION,
  breakpoints
};

export { helpers as default, helpers };
