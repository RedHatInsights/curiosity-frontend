import _get from 'lodash/get';
import { appTypes, platformTypes, userTypes } from '../types';
import { rhsmConstants } from '../../services/rhsm/rhsmConstants';
import { reduxHelpers } from '../common';

/**
 * Initial state.
 *
 * @private
 * @type {{auth: {}, optin: {}, locale: null, errors: {}}}
 */
const initialState = {
  auth: {},
  errors: {},
  locale: {},
  optin: {}
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
    case reduxHelpers.HTTP_STATUS_RANGE(appTypes.STATUS_4XX):
      const actionStatus = reduxHelpers.getStatusFromResults(action);

      if (actionStatus === 401 || actionStatus === 403) {
        const errorCodes = _get(reduxHelpers.getDataFromResults(action), [rhsmConstants.RHSM_API_RESPONSE_ERRORS], []);

        return reduxHelpers.setStateProp(
          'errors',
          {
            error: true,
            errorMessage: reduxHelpers.getMessageFromResults(action),
            data: errorCodes.map(value => value[rhsmConstants.RHSM_API_RESPONSE_ERRORS_TYPES.CODE]),
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
          { ref: 'locale', type: userTypes.USER_LOCALE },
          { ref: 'optin', type: userTypes.DELETE_USER_OPTIN },
          { ref: 'optin', type: userTypes.GET_USER_OPTIN },
          { ref: 'optin', type: userTypes.UPDATE_USER_OPTIN },
          { ref: 'auth', type: platformTypes.PLATFORM_USER_AUTH }
        ],
        state,
        action
      );
  }
};

userReducer.initialState = initialState;

export { userReducer as default, initialState, userReducer };
