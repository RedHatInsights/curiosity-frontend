import { createSelector } from 'reselect';
import _get from 'lodash/get';
import { platformApiTypes } from '../../types/platformApiTypes';
import { helpers } from '../../common/helpers';

/**
 * Return a combined state, props object.
 *
 * @private
 * @param {object} state
 * @returns {object}
 */
const userSession = state => ({
  ...state.user?.session
});

/**
 * Create selector, transform combined state, props into a consumable graph/charting object.
 *
 * @type {{session: {entitled: boolean, permissions: Array, authorized: boolean, admin: boolean}}}
 */
const userSessionSelector = createSelector([userSession], response => {
  const { fulfilled = false, data = {}, ...rest } = response || {};
  const updatedSession = {
    ...rest,
    admin: false,
    authorized: false,
    entitled: false,
    permissions: []
  };

  if (fulfilled) {
    const { user = {}, permissions = [] } = data;

    const admin = _get(
      user,
      [
        platformApiTypes.PLATFORM_API_RESPONSE_USER_IDENTITY,
        platformApiTypes.PLATFORM_API_RESPONSE_USER_IDENTITY_TYPES.USER,
        platformApiTypes.PLATFORM_API_RESPONSE_USER_IDENTITY_USER_TYPES.ORG_ADMIN
      ],
      false
    );

    const entitled = _get(
      user,
      [
        platformApiTypes.PLATFORM_API_RESPONSE_USER_ENTITLEMENTS,
        helpers.UI_NAME,
        platformApiTypes.PLATFORM_API_RESPONSE_USER_ENTITLEMENTS_APP_TYPES.ENTITLED
      ],
      false
    );

    const subscriptionPermissions = permissions.map(value => {
      const src = value[platformApiTypes.PLATFORM_API_RESPONSE_USER_PERMISSION_TYPES.PERMISSION];
      const [app, resource, operation] = src.split(':');
      return {
        permission: { app, resource, operation, src },
        definitions: value[platformApiTypes.PLATFORM_API_RESPONSE_USER_PERMISSION_TYPES.RESOURCE_DEFS]
      };
    });

    updatedSession.admin = admin;
    updatedSession.entitled = entitled;
    updatedSession.permissions = subscriptionPermissions;

    if (subscriptionPermissions.find(({ permission }) => permission.resource === '*' && permission.operation === '*')) {
      updatedSession.authorized = true;
    }
  }

  return { session: updatedSession };
});

/**
 * Expose selector instance. For scenarios where a selector is reused across component instances.
 *
 * @param {object} defaultProps
 * @returns {{session: {entitled: boolean, permissions: Array, authorized: boolean, admin: boolean}}}
 */
const makeUserSessionSelector = defaultProps => (state, props) => ({
  ...userSessionSelector(state, props, defaultProps)
});

const userSessionSelectors = {
  userSession: userSessionSelector,
  makeUserSession: makeUserSessionSelector
};

export { userSessionSelectors as default, userSessionSelectors, userSessionSelector, makeUserSessionSelector };
