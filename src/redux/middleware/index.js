import { createLogger } from 'redux-logger';
import { thunk as thunkMiddleware } from 'redux-thunk';
import { promiseMiddleware } from './promiseMiddleware';
import { multiActionMiddleware } from './multiActionMiddleware';
import { statusMiddleware } from './statusMiddleware';
import { actionRecordMiddleware } from './actionRecordMiddleware';

/**
 * Redux middleware.
 *
 * @type {Array}
 */
const reduxMiddleware = [
  thunkMiddleware,
  statusMiddleware(),
  multiActionMiddleware,
  promiseMiddleware({ isCatchRejection: true }),
  actionRecordMiddleware({
    id: process.env.REACT_APP_UI_LOGGER_ID,
    app: { version: process.env.REACT_APP_UI_VERSION }
  })
];

if (process.env.NODE_ENV !== 'production' && process.env.REACT_APP_DEBUG_MIDDLEWARE === 'true') {
  reduxMiddleware.push(createLogger());
}

export {
  reduxMiddleware as default,
  reduxMiddleware,
  createLogger,
  actionRecordMiddleware,
  multiActionMiddleware,
  promiseMiddleware,
  statusMiddleware,
  thunkMiddleware
};
