import _get from 'lodash/get';
import { appTypes, platformTypes } from '../types';
import { rhsmConstants } from '../../services/rhsm/rhsmConstants';
import { reduxHelpers } from '../common';

/**
 * Application related state reducer.
 *
 * @memberof Reducers
 * @module AppReducer
 */

/**
 * Initial state.
 *
 * @private
 * @type {{auth: {}, exports: {}, exportsExisting: {}, optin: {}, locale: {}, errors: {}}}
 */
const initialState = {
  auth: {},
  errors: {},
  exports: {},
  exportsExisting: {},
  locale: {},
  optin: {}
};

/**
 * Apply application observer/reducer logic to state, against actions.
 *
 * @param {object} state
 * @param {object} action
 * @returns {object|{}}
 */
const appReducer = (state = initialState, action) => {
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
    case platformTypes.SET_PLATFORM_EXPORT_STATUS:
      return reduxHelpers.setStateProp(
        'exports',
        {
          [action.id]: {
            isPending: action.isPending,
            pending: action.pending
          }
        },
        {
          state,
          initialState
        }
      );
    default:
      return reduxHelpers.generatedPromiseActionReducer(
        [
          { ref: 'locale', type: appTypes.USER_LOCALE },
          { ref: 'optin', type: [appTypes.DELETE_USER_OPTIN, appTypes.GET_USER_OPTIN, appTypes.UPDATE_USER_OPTIN] },
          { ref: 'exportsExisting', type: platformTypes.SET_PLATFORM_EXPORT_EXISTING_STATUS },
          { ref: 'auth', type: platformTypes.PLATFORM_USER_AUTH }
        ],
        state,
        action
      );
  }
};

appReducer.initialState = initialState;

export { appReducer as default, initialState, appReducer };
