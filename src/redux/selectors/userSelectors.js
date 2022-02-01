import { createSelectorCreator, defaultMemoize } from 'reselect';
import _isEqual from 'lodash/isEqual';
import { rbacConfig as permissions } from '../../config';
import {
  platformConstants as platformApiTypes,
  PLATFORM_API_RESPONSE_USER_PERMISSION_APP_TYPES as APP_TYPES,
  PLATFORM_API_RESPONSE_USER_PERMISSION_RESOURCE_TYPES as RESOURCE_TYPES,
  PLATFORM_API_RESPONSE_USER_PERMISSION_OPERATION_TYPES as OPERATION_TYPES
} from '../../services/platform/platformConstants';

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
    const { user = {}, permissions: responsePermissions = [] } = data;

    updatedSession.admin =
      user?.[platformApiTypes.PLATFORM_API_RESPONSE_USER_IDENTITY]?.[
        platformApiTypes.PLATFORM_API_RESPONSE_USER_IDENTITY_TYPES.USER
      ]?.[platformApiTypes.PLATFORM_API_RESPONSE_USER_IDENTITY_USER_TYPES.ORG_ADMIN] || false;

    updatedSession.entitled =
      user?.[platformApiTypes.PLATFORM_API_RESPONSE_USER_ENTITLEMENTS]?.[APP_TYPES.SUBSCRIPTIONS]?.[
        platformApiTypes.PLATFORM_API_RESPONSE_USER_ENTITLEMENTS_APP_TYPES.ENTITLED
      ] || false;

    // All permissions breakdown
    responsePermissions.forEach(
      ({
        [platformApiTypes.PLATFORM_API_RESPONSE_USER_PERMISSION_TYPES.PERMISSION]: permission,
        [platformApiTypes.PLATFORM_API_RESPONSE_USER_PERMISSION_TYPES.RESOURCE_DEFS]: definitions = []
      }) => {
        const [app = '', resource, operation] = permission?.split(':') || [];

        if (!updatedSession.permissions[app]) {
          updatedSession.permissions[app] = {
            all: false,
            resources: {}
          };
        }

        if (resource === RESOURCE_TYPES.ALL && operation === OPERATION_TYPES.ALL) {
          updatedSession.permissions[app].all = true;
        }

        if (!updatedSession.permissions[app].resources[resource]) {
          updatedSession.permissions[app].resources[resource] = {};
        }

        updatedSession.permissions[app].resources[resource][operation] = definitions;
      }
    );

    // Alias specific app permissions checks
    Object.entries(permissions).forEach(([key, { permissions: resourcePermissions }]) => {
      updatedSession.authorized[key] = updatedSession.permissions[key]?.all || false;

      resourcePermissions.forEach(({ resource: res, operation: op }) => {
        if (updatedSession.permissions[key]?.resources?.[res]?.[op]) {
          updatedSession.authorized[key] = true;
        }
      });
    });
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
