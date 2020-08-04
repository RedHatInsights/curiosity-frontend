/**
 * Allow passing an array of actions for batch dispatch.
 *
 * @param {object} store
 * @returns {Function}
 */
const multiActionMiddleware = store => next => action =>
  (Array.isArray(action) && action.map(a => store.dispatch(a))) || next(action);

export { multiActionMiddleware as default, multiActionMiddleware };
