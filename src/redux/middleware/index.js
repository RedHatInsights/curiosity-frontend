import { createLogger } from 'redux-logger';
import promiseMiddleware from 'redux-promise-middleware';
import thunkMiddleware from 'redux-thunk';

const reduxMiddleware = [thunkMiddleware, promiseMiddleware];

if (process.env.NODE_ENV !== 'production' && process.env.REACT_APP_DEBUG_MIDDLEWARE === 'true') {
  reduxMiddleware.push(createLogger());
}

export { reduxMiddleware as default, reduxMiddleware, createLogger, promiseMiddleware, thunkMiddleware };
