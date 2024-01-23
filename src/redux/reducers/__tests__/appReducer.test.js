import appReducer from '../appReducer';
import { rhsmConstants } from '../../../services/rhsm/rhsmConstants';
import { platformConstants } from '../../../services/platform/platformConstants';
import { appTypes as types, platformTypes } from '../../types';
import { reduxHelpers } from '../../common';

describe('UserReducer', () => {
  it('should return the initial state', () => {
    expect(appReducer.initialState).toBeDefined();
  });

  it('should handle specific http status types', () => {
    const specificTypes = [
      { type: types.STATUS_4XX, status: 400 },
      { type: types.STATUS_4XX, status: 401 },
      { type: types.STATUS_4XX, status: 403 }
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
              [rhsmConstants.RHSM_API_RESPONSE_ERRORS]: [
                {
                  [rhsmConstants.RHSM_API_RESPONSE_ERRORS_TYPES.CODE]:
                    rhsmConstants.RHSM_API_RESPONSE_ERRORS_CODE_TYPES.OPTIN
                }
              ]
            }
          }
        }
      };

      const resultState = appReducer(undefined, dispatched);

      expect({ type: value.type, result: resultState }).toMatchSnapshot(`http status ${value.type} ${value.status}`);
    });
  });

  it('should handle all defined error types', () => {
    const specificTypes = [
      platformTypes.PLATFORM_USER_AUTH,
      types.USER_LOCALE,
      types.DELETE_USER_OPTIN,
      types.GET_USER_OPTIN,
      types.UPDATE_USER_OPTIN
    ];

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

      const resultState = appReducer(undefined, dispatched);

      expect({ type: reduxHelpers.REJECTED_ACTION(value), result: resultState }).toMatchSnapshot(
        `rejected types ${value}`
      );
    });
  });

  it('should handle all defined pending types', () => {
    const specificTypes = [
      platformTypes.PLATFORM_USER_AUTH,
      types.USER_LOCALE,
      types.DELETE_USER_OPTIN,
      types.GET_USER_OPTIN,
      types.UPDATE_USER_OPTIN
    ];

    specificTypes.forEach(value => {
      const dispatched = {
        type: reduxHelpers.PENDING_ACTION(value)
      };

      const resultState = appReducer(undefined, dispatched);

      expect({ type: reduxHelpers.PENDING_ACTION(value), result: resultState }).toMatchSnapshot(
        `pending types ${value}`
      );
    });
  });

  it('should handle all defined fulfilled types', () => {
    const specificTypes = [
      platformTypes.PLATFORM_USER_AUTH,
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
              [platformConstants.PLATFORM_API_RESPONSE_USER_IDENTITY]: {
                [platformConstants.PLATFORM_API_RESPONSE_USER_IDENTITY_TYPES.USER]: {
                  [platformConstants.PLATFORM_API_RESPONSE_USER_IDENTITY_USER_TYPES.ORG_ADMIN]: true
                }
              }
            },
            permissions: []
          }
        }
      };

      const resultState = appReducer(undefined, dispatched);

      expect({ type: reduxHelpers.FULFILLED_ACTION(value), result: resultState }).toMatchSnapshot(
        `fulfilled types ${value}`
      );
    });
  });
});
