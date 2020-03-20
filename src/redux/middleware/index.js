import { createLogger } from 'redux-logger';
import promiseMiddleware from 'redux-promise-middleware';
import thunkMiddleware from 'redux-thunk';
import { notificationsMiddleware } from '@redhat-cloud-services/frontend-components-notifications';
import { statusMiddleware } from './statusMiddleware';
import { reduxHelpers } from '../common/reduxHelpers';

/**
 * Platform notifications settings.
 *
 * @private
 * @type {{errorDescriptionKey: string, autoDismiss: boolean, errorTitleKey: string, fulfilledSuffix: string,
 *     dispatchDefaultFailure: boolean, pendingSuffix: string, rejectedSuffix: string, dismissDelay: number}}
 */
const notificationsOptions = {
  dispatchDefaultFailure: false, // automatic error notifications
  pendingSuffix: reduxHelpers.PENDING_ACTION(), // pending state action suffix
  fulfilledSuffix: reduxHelpers.FULFILLED_ACTION(), // fulfilled state action suffix
  rejectedSuffix: reduxHelpers.REJECTED_ACTION(), // rejected state action suffix
  autoDismiss: true, // autoDismiss pending and success notifications
  dismissDelay: 3000, // autoDismiss delay in ms
  errorTitleKey: 'title', // path to notification title in error response
  errorDescriptionKey: 'detail' // path to notification description in error response
};

/**
 * Redux middleware.
 *
 * @type {Array}
 */
const reduxMiddleware = [
  thunkMiddleware,
  statusMiddleware(),
  promiseMiddleware,
  notificationsMiddleware(notificationsOptions)
];

if (process.env.NODE_ENV !== 'production' && process.env.REACT_APP_DEBUG_MIDDLEWARE === 'true') {
  reduxMiddleware.push(createLogger());
}

export {
  reduxMiddleware as default,
  reduxMiddleware,
  createLogger,
  notificationsMiddleware,
  promiseMiddleware,
  statusMiddleware,
  thunkMiddleware
};
