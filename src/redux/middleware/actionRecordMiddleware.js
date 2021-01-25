/**
 * Modify actions for privacy.
 *
 * @param {object} action
 * @param {string} action.type
 * @param {object} action.payload
 * @returns {object}
 */
const sanitizeActionHeaders = ({ type, payload, ...action }) => {
  if (payload) {
    let updatedPayload = { ...payload, headers: {} };

    if (Array.isArray(payload)) {
      updatedPayload = payload.map(({ headers, ...obj }) => ({ ...obj, headers: {} }));
    }

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
  let parsedItems = (item && (JSON.parse(item) || {})?.actions) || null;

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
  const updatedAction = sanitizeActionHeaders(action);
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
      timestamp: new Date(),
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
const actionRecordMiddleware = (config = {}) => {
  return () => next => action => {
    recordAction(action, {
      id: 'actionRecordMiddleware/v1',
      limitResults: 100,
      ...config
    });

    return next(action);
  };
};

export { actionRecordMiddleware as default, actionRecordMiddleware };
