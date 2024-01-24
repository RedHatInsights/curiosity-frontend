import { platformTransformers } from '../platformTransformers';
import {
  platformConstants,
  PLATFORM_API_RESPONSE_USER_PERMISSION_TYPES as USER_PERMISSION_TYPES,
  PLATFORM_API_RESPONSE_USER_PERMISSION_OPERATION_TYPES as OPERATION_TYPES,
  PLATFORM_API_RESPONSE_USER_PERMISSION_RESOURCE_TYPES as RESOURCE_TYPES
} from '../platformConstants';
import { helpers } from '../../../common';

describe('Platform Transformers', () => {
  it('should have specific response transformers', () => {
    expect(platformTransformers).toMatchSnapshot('specific transformers');
  });

  it('should attempt to parse an exports response', () => {
    expect(platformTransformers.exports()).toMatchSnapshot('exports, default');

    expect(
      platformTransformers.exports({
        [platformConstants.PLATFORM_API_EXPORT_RESPONSE_TYPES.EXPIRES_AT]: '2019-07-14T00:00:00Z',
        [platformConstants.PLATFORM_API_EXPORT_RESPONSE_TYPES.ID]: '0123456789',
        [platformConstants.PLATFORM_API_EXPORT_RESPONSE_TYPES.STATUS]:
          platformConstants.PLATFORM_API_EXPORT_STATUS_TYPES.PENDING
      })
    ).toMatchSnapshot('exports, parsed');
  });

  it('should attempt to parse a user response', () => {
    expect(platformTransformers.user()).toMatchSnapshot('user, default');

    expect(
      platformTransformers.user({
        [platformConstants.PLATFORM_API_RESPONSE_USER_IDENTITY]: {
          [platformConstants.PLATFORM_API_RESPONSE_USER_IDENTITY_TYPES.USER]: {
            [platformConstants.PLATFORM_API_RESPONSE_USER_IDENTITY_USER_TYPES.ORG_ADMIN]: true
          }
        },
        [platformConstants.PLATFORM_API_RESPONSE_USER_ENTITLEMENTS]: {
          [helpers.UI_NAME]: {
            [platformConstants.PLATFORM_API_RESPONSE_USER_ENTITLEMENTS_APP_TYPES.ENTITLED]: true
          }
        }
      })
    ).toMatchSnapshot('user, parsed');
  });

  it('should attempt to parse a permissions response', () => {
    expect(platformTransformers.permissions()).toMatchSnapshot('permissions, default');

    expect(
      platformTransformers.permissions([
        {
          [USER_PERMISSION_TYPES.PERMISSION]: `${helpers.UI_NAME}:${RESOURCE_TYPES.ALL}:${OPERATION_TYPES.ALL}`
        },
        {
          [USER_PERMISSION_TYPES.PERMISSION]: `${helpers.UI_NAME}:${RESOURCE_TYPES.ALL}:${OPERATION_TYPES.READ}`
        },
        {
          [USER_PERMISSION_TYPES.PERMISSION]: `${helpers.UI_NAME}:${RESOURCE_TYPES.ALL}:loremCustom`
        },
        {
          [USER_PERMISSION_TYPES.PERMISSION]: `lorem:${RESOURCE_TYPES.ALL}:${OPERATION_TYPES.READ}`
        },
        {
          [USER_PERMISSION_TYPES.PERMISSION]: `ipsum:${RESOURCE_TYPES.ALL}:${OPERATION_TYPES.READ}`
        },
        {
          [USER_PERMISSION_TYPES.PERMISSION]: `broken`
        },
        {
          [USER_PERMISSION_TYPES.PERMISSION]: `broken:partially`
        }
      ])
    ).toMatchSnapshot('permissions, parsed');
  });
});
