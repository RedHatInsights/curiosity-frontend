import { appTypes, userTypes } from '../types';
import { reduxHelpers } from '../common/reduxHelpers';

/**
 * Initial state.
 *
 * @private
 * @type {{session: {pending: boolean, authorized: boolean, errorMessage: string, fulfilled: boolean,
 *     errorStatus: (string|number), error: boolean, locale: string}}}
 */
const initialState = {
  optin: {},
  session: {
    error: false,
    errorMessage: null,
    errorStatus: null,
    pending: false,
    fulfilled: false,
    authorized: false,
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
    case reduxHelpers.REJECTED_ACTION(userTypes.USER_AUTH):
      return reduxHelpers.setStateProp(
        'session',
        {
          error: action.error,
          errorMessage: reduxHelpers.getMessageFromResults(action),
          errorStatus: reduxHelpers.getStatusFromResults(action),
          locale: state.session.locale
        },
        {
          state,
          initialState
        }
      );

    case reduxHelpers.PENDING_ACTION(userTypes.USER_AUTH):
      return reduxHelpers.setStateProp(
        'session',
        {
          locale: state.session.locale,
          pending: true
        },
        {
          state,
          initialState
        }
      );

    case reduxHelpers.FULFILLED_ACTION(userTypes.USER_AUTH):
      return reduxHelpers.setStateProp(
        'session',
        {
          authorized: true,
          fulfilled: true,
          locale: state.session.locale
        },
        {
          state,
          initialState
        }
      );

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
      if (action.status === 401 || action.status === 403) {
        return reduxHelpers.setStateProp(
          'session',
          {
            error: true,
            errorMessage: reduxHelpers.getMessageFromResults(action),
            errorStatus: reduxHelpers.getStatusFromResults(action),
            locale: state.session.locale
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
          { ref: 'optin', type: userTypes.UPDATE_USER_OPTIN }
        ],
        state,
        action
      );
  }
};

userReducer.initialState = initialState;

export { userReducer as default, initialState, userReducer };
