import { reduxHelpers } from '../common/reduxHelpers';

/**
 * @memberof Middleware
 * @module StatusMiddleware
 */

/**
 * Apply a status type based on actions, such as those generated from redux-promise-middleware.
 *
 * @param {object} config
 * @param {string} config.statusSuffix
 * @param {string} config.rangeSuffix
 * @param {string} config.rangeFiller
 * @param {string} config.statusDelimiter
 * @param {boolean} config.statusRange
 * @param {boolean} config.dispatchStatus
 * @returns {Function}
 */
const statusMiddleware = (config = {}) => {
  const statusSuffix = config.statusSuffix || 'STATUS';
  const rangeSuffix = config.rangeSuffix || 'STATUS_RANGE';
  const rangeFiller = config.rangeFiller || 'XX';
  const statusDelimiter = config.statusDelimiter || '_';
  const dispatchRange = config.statusRange || true;
  const dispatchStatus = config.dispatchStatus || false;

  return store => {
    const { dispatch } = store;

    return next => action => {
      if (action.payload) {
        const httpStatus = reduxHelpers.getStatusFromResults({ ...action });

        if (httpStatus > 99) {
          const message = reduxHelpers.getMessageFromResults({ ...action });
          const data = reduxHelpers.getDataFromResults({ ...action });
          const payloadConfig = { ...(action.payload.config || {}) };
          const range = `${Math.floor(httpStatus / 100)}${rangeFiller}`;

          if (dispatchRange) {
            dispatch({
              type: `${range}${statusDelimiter}${rangeSuffix}`,
              config: payloadConfig,
              data,
              message,
              range,
              status: httpStatus
            });
          }

          if (dispatchStatus) {
            dispatch({
              type: `${httpStatus}${statusDelimiter}${statusSuffix}`,
              config: payloadConfig,
              data,
              message,
              range,
              status: httpStatus
            });
          }
        }
      }

      return next(action);
    };
  };
};

export { statusMiddleware as default, statusMiddleware };
