import _get from 'lodash/get';
import { appTypes, userTypes } from '../types';
import { rhsmApiTypes } from '../../types/rhsmApiTypes';
import { reduxHelpers } from '../common/reduxHelpers';

/**
 * Initial state.
 *
 * @private
 * @type {{session: {errorCodes: Array, locale: string}, optin: {}}}
 */
const initialState = {
  optin: {},
  session: {
    errorCodes: [],
    locale: null
  }
};

/**
 * Apply user observer/reducer logic for session to state, against actions.
 *
 * @param {object} state
 * @param {object} action
 * @returns {object|{}}
 */
const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case reduxHelpers.FULFILLED_ACTION(userTypes.USER_LOCALE):
      return reduxHelpers.setStateProp(
        'session',
        {
          locale: action.payload.data
        },
        {
          state,
          reset: false
        }
      );

    case reduxHelpers.HTTP_STATUS_RANGE(appTypes.STATUS_4XX):
      const actionStatus = reduxHelpers.getStatusFromResults(action);

      if (actionStatus === 401 || actionStatus === 403) {
        const errorCodes = _get(
          reduxHelpers.getDataFromResults(action),
          [rhsmApiTypes.RHSM_API_RESPONSE_ERROR_DATA],
          []
        );

        return reduxHelpers.setStateProp(
          'session',
          {
            error: true,
            errorCodes: errorCodes.map(value => value[rhsmApiTypes.RHSM_API_RESPONSE_ERROR_DATA_TYPES.CODE]),
            errorMessage: reduxHelpers.getMessageFromResults(action),
            locale: state.session.locale,
            status: reduxHelpers.getStatusFromResults(action)
          },
          {
            state,
            initialState
          }
        );
      }

      return state;

    default:
      return reduxHelpers.generatedPromiseActionReducer(
        [
          { ref: 'optin', type: userTypes.DELETE_USER_OPTIN },
          { ref: 'optin', type: userTypes.GET_USER_OPTIN },
          { ref: 'optin', type: userTypes.UPDATE_USER_OPTIN },
          { ref: 'session', type: userTypes.USER_AUTH }
        ],
        state,
        action
      );
  }
};

userReducer.initialState = initialState;

export { userReducer as default, initialState, userReducer };
