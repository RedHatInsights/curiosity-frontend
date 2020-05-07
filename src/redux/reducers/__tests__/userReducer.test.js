import userReducer from '../userReducer';
import { platformApiTypes, rhsmApiTypes } from '../../../types';
import { appTypes, userTypes as types } from '../../types';
import { reduxHelpers } from '../../common/reduxHelpers';

describe('UserReducer', () => {
  it('should return the initial state', () => {
    expect(userReducer.initialState).toBeDefined();
  });

  it('should handle specific http status types', () => {
    const specificTypes = [
      { type: appTypes.STATUS_4XX, status: 400 },
      { type: appTypes.STATUS_4XX, status: 401 },
      { type: appTypes.STATUS_4XX, status: 403 }
    ];

    specificTypes.forEach(value => {
      const dispatched = {
        type: reduxHelpers.HTTP_STATUS_RANGE(value.type),
        error: true,
        payload: {
          message: `Request failed with status code ${value.status}`,
          response: {
            status: value.status,
            statusText: 'Error',
            data: {
              [rhsmApiTypes.RHSM_API_RESPONSE_ERROR_DATA]: [
                {
                  [rhsmApiTypes.RHSM_API_RESPONSE_ERROR_DATA_TYPES.CODE]:
                    rhsmApiTypes.RHSM_API_RESPONSE_ERROR_DATA_CODE_TYPES.OPTIN
                }
              ]
            }
          }
        }
      };

      const resultState = userReducer(undefined, dispatched);

      expect({ type: value.type, result: resultState }).toMatchSnapshot(`http status ${value.type} ${value.status}`);
    });
  });

  it('should handle all defined error types', () => {
    const specificTypes = [types.USER_AUTH, types.DELETE_USER_OPTIN, types.GET_USER_OPTIN, types.UPDATE_USER_OPTIN];

    specificTypes.forEach(value => {
      const dispatched = {
        type: reduxHelpers.REJECTED_ACTION(value),
        error: true,
        payload: {
          message: 'MESSAGE',
          response: {
            status: 0,
            statusText: 'ERROR TEST',
            data: {
              detail: 'ERROR'
            }
          }
        }
      };

      const resultState = userReducer(undefined, dispatched);

      expect({ type: reduxHelpers.REJECTED_ACTION(value), result: resultState }).toMatchSnapshot(
        `rejected types ${value}`
      );
    });
  });

  it('should handle all defined pending types', () => {
    const specificTypes = [types.USER_AUTH, types.DELETE_USER_OPTIN, types.GET_USER_OPTIN, types.UPDATE_USER_OPTIN];

    specificTypes.forEach(value => {
      const dispatched = {
        type: reduxHelpers.PENDING_ACTION(value)
      };

      const resultState = userReducer(undefined, dispatched);

      expect({ type: reduxHelpers.PENDING_ACTION(value), result: resultState }).toMatchSnapshot(
        `pending types ${value}`
      );
    });
  });

  it('should handle all defined fulfilled types', () => {
    const specificTypes = [
      types.USER_AUTH,
      types.USER_LOCALE,
      types.DELETE_USER_OPTIN,
      types.GET_USER_OPTIN,
      types.UPDATE_USER_OPTIN
    ];

    specificTypes.forEach(value => {
      const dispatched = {
        type: reduxHelpers.FULFILLED_ACTION(value),
        payload: {
          data: {
            test: 'success',
            user: {
              [platformApiTypes.PLATFORM_API_RESPONSE_USER_IDENTITY]: {
                [platformApiTypes.PLATFORM_API_RESPONSE_USER_IDENTITY_TYPES.USER]: {
                  [platformApiTypes.PLATFORM_API_RESPONSE_USER_IDENTITY_USER_TYPES.ORG_ADMIN]: true
                }
              }
            },
            permissions: []
          }
        }
      };

      const resultState = userReducer(undefined, dispatched);

      expect({ type: reduxHelpers.FULFILLED_ACTION(value), result: resultState }).toMatchSnapshot(
        `fulfilled types ${value}`
      );
    });
  });
});
