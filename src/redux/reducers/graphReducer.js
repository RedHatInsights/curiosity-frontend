import { rhsmTypes, graphTypes } from '../types';
import { reduxHelpers } from '../common/reduxHelpers';

/**
 * Initial state.
 *
 * @private
 * @type {{reportCapacity: {}, legend: {}, tallyCapacity: {}}}
 */
const initialState = {
  legend: {},
  reportCapacity: {},
  tally: {}
};

/**
 * Apply graph interaction, and generated graph observer/reducer for reportCapacity to state,
 * against actions.
 *
 * @param {object} state
 * @param {object} action
 * @returns {object|{}}
 */
const graphReducer = (state = initialState, action) => {
  switch (action.type) {
    case graphTypes.SET_GRAPH_LEGEND:
      return reduxHelpers.setStateProp(
        'legend',
        {
          [action.id]: action.value
        },
        {
          state,
          reset: false
        }
      );
    default:
      return reduxHelpers.generatedPromiseActionReducer(
        [
          { ref: 'reportCapacity', type: rhsmTypes.GET_GRAPH_REPORT_CAPACITY_RHSM },
          { ref: 'tally', type: rhsmTypes.GET_GRAPH_TALLY_RHSM }
        ],
        state,
        action
      );
  }
};

graphReducer.initialState = initialState;

export { graphReducer as default, initialState, graphReducer };
