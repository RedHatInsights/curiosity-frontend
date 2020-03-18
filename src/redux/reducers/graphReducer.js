import { rhsmTypes } from '../types';
import { reduxHelpers } from '../common/reduxHelpers';

/**
 * Initial state.
 *
 * @private
 * @type {{reportCapacity: object}}
 */
const initialState = {
  reportCapacity: {}
};

/**
 * Apply generated graph observer/reducer for reportCapacity to state, against actions.
 *
 * @param {object} state
 * @param {object} action
 * @returns {object|{}}
 */
const graphReducer = (state = initialState, action) =>
  reduxHelpers.generatedPromiseActionReducer(
    [{ ref: 'reportCapacity', type: rhsmTypes.GET_GRAPH_REPORT_CAPACITY_RHSM }],
    state,
    action
  );

graphReducer.initialState = initialState;

export { graphReducer as default, initialState, graphReducer };
