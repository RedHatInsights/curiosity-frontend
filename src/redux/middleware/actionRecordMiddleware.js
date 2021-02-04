import { platformApiTypes } from '../../types';
import { userTypes } from '../types/userTypes';

/**
 * Modify actions' payload for privacy.
 *
 * @param {object} action
 * @param {object} action.payload
 * @returns {object}
 */
const sanitizeActionHeaders = ({ payload, ...action }) => {
  if (payload) {
    let updatedPayload = { ...payload, headers: {} };

    if (Array.isArray(payload)) {
      updatedPayload = payload.map(({ headers, ...obj }) => ({ ...obj, headers: {} }));
    }

    return { payload: updatedPayload, ...action };
  }

  return { ...action };
};

/**
 * Modify actions' payload data for privacy.
 *
 * @param {object} action
 * @param {string} action.type
 * @param {object} action.payload
 * @returns {object}
 */
const sanitizeData = ({ type, payload, ...action }) => {
  if (payload && new RegExp(userTypes.USER_AUTH).test(type)) {
    const updatedPayload = {
      ...payload,
      data: {
        ...payload.data,
        user: {
          ...payload.data.user,
          [platformApiTypes.PLATFORM_API_RESPONSE_USER_IDENTITY]: {
            ...payload.data.user[platformApiTypes.PLATFORM_API_RESPONSE_USER_IDENTITY],
            [platformApiTypes.PLATFORM_API_RESPONSE_USER_IDENTITY_TYPES.USER]: {}
          }
        }
      }
    };

    return { type, payload: updatedPayload, ...action };
  }

  return { type, ...action };
};

/**
 * Return existing sessionStorage log.
 *
 * @param {string} id
 * @param {number} limit
 * @returns {Array}
 */
const getActions = (id, limit) => {
  const { sessionStorage } = window;
  const item = sessionStorage.getItem(id);
  let parsedItems = (item && (JSON.parse(item) || {})?.actions) || [];

  if (parsedItems?.length && limit > 0) {
    parsedItems = parsedItems.slice(limit * -1);
  }

  return parsedItems;
};

/**
 * Store actions against an id in sessionStorage.
 *
 * @param {object} action
 * @param {object} config
 * @param {number} config.id
 * @param {number} config.limit
 */
const recordAction = (action, { id, limit, ...config }) => {
  const { navigator, sessionStorage } = window;
  const items = getActions(id, limit) || [];
  const priorItem = items[items.length - 1];
  const updatedAction = sanitizeData(sanitizeActionHeaders(action));
  const actionObj = {
    diff: 0,
    timestamp: Date.now(),
    action: updatedAction
  };

  if (priorItem && priorItem.timestamp) {
    actionObj.diff = actionObj.timestamp - priorItem.timestamp;
  }

  items.push(actionObj);
  sessionStorage.setItem(
    id,
    JSON.stringify({
      browser: navigator.userAgent,
      timestamp: new Date().toLocaleString(),
      ...config,
      actions: items
    })
  );
};

/**
 * Expose settings and record middleware.
 *
 * @param {object} config
 * @returns {Function}
 */
const actionRecordMiddleware = (config = {}) => () => next => action => {
  recordAction(action, {
    id: 'actionRecordMiddleware/v1',
    limit: 100,
    ...config
  });

  return next(action);
};

export { actionRecordMiddleware as default, actionRecordMiddleware };
