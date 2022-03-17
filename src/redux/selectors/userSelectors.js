import { createSelectorCreator, defaultMemoize } from 'reselect';
import _isEqual from 'lodash/isEqual';

/**
 * Create a custom "are objects equal" selector.
 *
 * @private
 * @type {Function}}
 */
const createDeepEqualSelector = createSelectorCreator(defaultMemoize, _isEqual);

/**
 * Return a combined state, props object.
 *
 * @private
 * @param {object} state
 * @returns {object}
 */
const statePropsFilter = state => ({
  ...state.user?.session
});

/**
 * Create selector, transform combined state, props into a consumable graph/charting object.
 *
 * @type {{session: {entitled: boolean, permissions: object, authorized: object, admin: boolean,
 *     error: boolean}}}
 */
const selector = createDeepEqualSelector([statePropsFilter], response => {
  const { error = false, fulfilled = false, data = {}, ...rest } = response || {};
  const updatedSession = {
    ...rest,
    admin: false,
    entitled: false,
    error,
    authorized: {},
    permissions: {}
  };

  if (!error && fulfilled) {
    const [user = {}, responsePermissions = {}] = data;
    updatedSession.admin = user.isAdmin;
    updatedSession.entitled = user.isEntitled;
    updatedSession.permissions = responsePermissions.permissions;
    updatedSession.authorized = responsePermissions.authorized;
  }

  return { session: updatedSession };
});

/**
 * Expose selector instance. For scenarios where a selector is reused across component instances.
 *
 * @param {object} defaultProps
 * @returns {{session: {entitled: boolean, permissions: Array, authorized: boolean, admin: boolean}}}
 */
const makeSelector = defaultProps => (state, props) => ({
  ...selector(state, props, defaultProps)
});

const userSessionSelectors = {
  userSession: selector,
  makeUserSession: makeSelector
};

export { userSessionSelectors as default, userSessionSelectors, selector, makeSelector };
