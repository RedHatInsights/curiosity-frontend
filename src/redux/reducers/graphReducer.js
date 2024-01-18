import { rhsmTypes, graphTypes } from '../types';
import { reduxHelpers } from '../common/reduxHelpers';

/**
 * Graph/Chart related API and user state reducer.
 *
 * @memberof Reducers
 * @module GraphReducer
 */

/**
 * Initial state.
 *
 * @private
 * @type {{legend: {}, tally: {}, capacity: {}}}
 */
const initialState = {
  capacity: {},
  legend: {},
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
          { ref: 'capacity', type: rhsmTypes.GET_GRAPH_CAPACITY_RHSM },
          { ref: 'tally', type: rhsmTypes.GET_GRAPH_TALLY_RHSM }
        ],
        state,
        action
      );
  }
};

graphReducer.initialState = initialState;

export { graphReducer as default, initialState, graphReducer };
