import userSelectors from '../userSelectors';
import { platformApiTypes } from '../../../types';
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
                [platformApiTypes.PLATFORM_API_RESPONSE_USER_PERMISSION_TYPES.PERMISSION]: `${helpers.UI_NAME}:*:*`
              },
              {
                [platformApiTypes.PLATFORM_API_RESPONSE_USER_PERMISSION_TYPES.PERMISSION]: `${helpers.UI_NAME}:*:read`
              },
              {
                [platformApiTypes.PLATFORM_API_RESPONSE_USER_PERMISSION_TYPES.PERMISSION]: `${helpers.UI_NAME}:*:write`
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
                [platformApiTypes.PLATFORM_API_RESPONSE_USER_PERMISSION_TYPES.PERMISSION]: `${helpers.UI_NAME}:*:*`
              },
              {
                [platformApiTypes.PLATFORM_API_RESPONSE_USER_PERMISSION_TYPES.PERMISSION]: `${helpers.UI_NAME}:*:read`
              },
              {
                [platformApiTypes.PLATFORM_API_RESPONSE_USER_PERMISSION_TYPES.PERMISSION]: `${helpers.UI_NAME}:*:write`
              }
            ]
          }
        }
      }
    };

    expect(userSelectors.userSession(state)).toMatchSnapshot('global errors, unauthorized');
  });
});
