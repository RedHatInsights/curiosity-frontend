import { createLogger } from 'redux-logger';
import { thunk as thunkMiddleware } from 'redux-thunk';
import { notificationsMiddleware } from '@redhat-cloud-services/frontend-components-notifications';
import { promiseMiddleware } from './promiseMiddleware';
import { multiActionMiddleware } from './multiActionMiddleware';
import { statusMiddleware } from './statusMiddleware';
import { actionRecordMiddleware } from './actionRecordMiddleware';
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
  multiActionMiddleware,
  promiseMiddleware({ isCatchRejection: true }),
  actionRecordMiddleware({
    id: process.env.REACT_APP_UI_LOGGER_ID,
    app: { version: process.env.REACT_APP_UI_VERSION }
  }),
  notificationsMiddleware(notificationsOptions)
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
  notificationsMiddleware,
  promiseMiddleware,
  statusMiddleware,
  thunkMiddleware
};
