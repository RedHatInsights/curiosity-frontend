import { rhsmTypes } from '../types';
import { reduxHelpers } from '../common/reduxHelpers';

/**
 * Initial state.
 *
 * @private
 * @type {{report: {}}}
 */
const initialState = {
  report: {}
};

/**
 * Generated daily observer/reducer for report to state,
 * against actions.
 *
 * @param {object} state
 * @param {object} action
 * @returns {object|{}}
 */
const messagesReducer = (state = initialState, action) =>
  reduxHelpers.generatedPromiseActionReducer(
    [{ ref: 'report', type: rhsmTypes.GET_MESSAGE_REPORTS_RHSM }],
    state,
    action
  );

messagesReducer.initialState = initialState;

export { messagesReducer as default, initialState, messagesReducer };
