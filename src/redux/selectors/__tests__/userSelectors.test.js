import userSelectors from '../userSelectors';
import {
  platformConstants as platformApiTypes,
  PLATFORM_API_RESPONSE_USER_PERMISSION_TYPES as USER_PERMISSION_TYPES,
  PLATFORM_API_RESPONSE_USER_PERMISSION_APP_TYPES as APP_TYPES,
  PLATFORM_API_RESPONSE_USER_PERMISSION_RESOURCE_TYPES as RESOURCE_TYPES,
  PLATFORM_API_RESPONSE_USER_PERMISSION_OPERATION_TYPES as OPERATION_TYPES
} from '../../../services/platform/platformConstants';
import { helpers } from '../../../common';

describe('UserSelectors', () => {
  it('should return specific selectors', () => {
    expect(userSelectors).toMatchSnapshot('selectors');
  });

  it('should pass minimal data on missing a reducer response', () => {
    const state = {};
    expect(userSelectors.userSession(state)).toMatchSnapshot('missing reducer error');
  });

  it('should pass existing state data through response', () => {
    const state = {
      user: {
        session: {
          locale: 'en-US'
        }
      }
    };

    expect(userSelectors.userSession(state)).toMatchSnapshot('existing state data');
  });

  it('should pass error state data through response', () => {
    const state = {
      user: {
        session: {
          error: true,
          errorCodes: ['loremIpsum'],
          errorMessage: 'lorem ipsum',
          status: 403
        }
      }
    };

    expect(userSelectors.userSession(state)).toMatchSnapshot('error state data');
  });

  it('should pass data with administrator checks', () => {
    const state = {
      user: {
        session: {
          fulfilled: true,
          data: {
            user: {
              [platformApiTypes.PLATFORM_API_RESPONSE_USER_IDENTITY]: {
                [platformApiTypes.PLATFORM_API_RESPONSE_USER_IDENTITY_TYPES.USER]: {
                  [platformApiTypes.PLATFORM_API_RESPONSE_USER_IDENTITY_USER_TYPES.ORG_ADMIN]: true
                }
              }
            }
          }
        }
      }
    };

    expect(userSelectors.userSession(state)).toMatchSnapshot('administrator, and missing user data');
  });

  it('should pass data with entitlements checks', () => {
    const state = {
      user: {
        session: {
          fulfilled: true,
          data: {
            user: {
              [platformApiTypes.PLATFORM_API_RESPONSE_USER_ENTITLEMENTS]: {
                [helpers.UI_NAME]: {
                  [platformApiTypes.PLATFORM_API_RESPONSE_USER_ENTITLEMENTS_APP_TYPES.ENTITLED]: true
                }
              }
            }
          }
        }
      }
    };

    expect(userSelectors.userSession(state)).toMatchSnapshot('entitlements, and missing user data');
  });

  it('should pass data with permissions checks', () => {
    const state = {
      user: {
        session: {
          fulfilled: true,
          data: {
            permissions: [
              {
                [USER_PERMISSION_TYPES.PERMISSION]: `${APP_TYPES.SUBSCRIPTIONS}:${RESOURCE_TYPES.ALL}:${OPERATION_TYPES.ALL}`
              },
              {
                [USER_PERMISSION_TYPES.PERMISSION]: `${APP_TYPES.SUBSCRIPTIONS}:${RESOURCE_TYPES.ALL}:${OPERATION_TYPES.READ}`
              },
              {
                [USER_PERMISSION_TYPES.PERMISSION]: `${APP_TYPES.SUBSCRIPTIONS}:${RESOURCE_TYPES.ALL}:loremCustom`
              },
              {
                [USER_PERMISSION_TYPES.PERMISSION]: `lorem:${RESOURCE_TYPES.ALL}:${OPERATION_TYPES.READ}`
              },
              {
                [USER_PERMISSION_TYPES.PERMISSION]: `ipsum:${RESOURCE_TYPES.ALL}:${OPERATION_TYPES.READ}`
              }
            ]
          }
        }
      }
    };

    expect(userSelectors.userSession(state)).toMatchSnapshot('permissions, and missing user data');
  });

  it('should not authorize a user when global errors exist', () => {
    const state = {
      user: {
        session: {
          error: true,
          errorCodes: ['loremIpsum'],
          errorMessage: 'lorem ipsum',
          status: 403,
          fulfilled: true,
          data: {
            user: {
              [platformApiTypes.PLATFORM_API_RESPONSE_USER_ENTITLEMENTS]: {
                [helpers.UI_NAME]: {
                  [platformApiTypes.PLATFORM_API_RESPONSE_USER_ENTITLEMENTS_APP_TYPES.ENTITLED]: true
                }
              },
              [platformApiTypes.PLATFORM_API_RESPONSE_USER_IDENTITY]: {
                [platformApiTypes.PLATFORM_API_RESPONSE_USER_IDENTITY_TYPES.USER]: {
                  [platformApiTypes.PLATFORM_API_RESPONSE_USER_IDENTITY_USER_TYPES.ORG_ADMIN]: true
                }
              }
            },
            permissions: [
              {
                [USER_PERMISSION_TYPES.PERMISSION]: `${APP_TYPES.SUBSCRIPTIONS}:${RESOURCE_TYPES.ALL}:${OPERATION_TYPES.ALL}`
              },
              {
                [USER_PERMISSION_TYPES.PERMISSION]: `${APP_TYPES.SUBSCRIPTIONS}:${RESOURCE_TYPES.ALL}:${OPERATION_TYPES.READ}`
              },
              {
                [USER_PERMISSION_TYPES.PERMISSION]: `${APP_TYPES.SUBSCRIPTIONS}:${RESOURCE_TYPES.ALL}:loremCustom`
              },
              {
                [USER_PERMISSION_TYPES.PERMISSION]: `lorem:${RESOURCE_TYPES.ALL}:${OPERATION_TYPES.READ}`
              },
              {
                [USER_PERMISSION_TYPES.PERMISSION]: `ipsum:${RESOURCE_TYPES.ALL}:${OPERATION_TYPES.READ}`
              }
            ]
          }
        }
      }
    };

    expect(userSelectors.userSession(state)).toMatchSnapshot('global errors, unauthorized');
  });
});
