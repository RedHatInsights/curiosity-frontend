import userReducer from '../userReducer';
import { userTypes as types } from '../../types';
import { reduxHelpers } from '../../common/reduxHelpers';

describe('UserReducer', () => {
  it('should return the initial state', () => {
    expect(userReducer.initialState).toBeDefined();
  });

  it('should handle all defined error types', () => {
    const specificTypes = [types.USER_AUTH];

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
    const specificTypes = [types.USER_AUTH];

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
    const specificTypes = [types.USER_AUTH, types.USER_LOCALE];

    specificTypes.forEach(value => {
      const dispatched = {
        type: reduxHelpers.FULFILLED_ACTION(value),
        payload: {
          data: {
            test: 'success'
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
