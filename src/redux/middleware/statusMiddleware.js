import { reduxHelpers } from '../common/reduxHelpers';

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
          const payloadConfig = { ...(action.payload.config || {}) };
          const range = `${Math.floor(httpStatus / 100)}${rangeFiller}`;

          if (dispatchRange) {
            dispatch({
              type: `${range}${statusDelimiter}${rangeSuffix}`,
              status: httpStatus,
              config: payloadConfig,
              range,
              message
            });
          }

          if (dispatchStatus) {
            dispatch({
              type: `${httpStatus}${statusDelimiter}${statusSuffix}`,
              status: httpStatus,
              config: payloadConfig,
              range,
              message
            });
          }
        }
      }

      return next(action);
    };
  };
};

export { statusMiddleware as default, statusMiddleware };
