import { reduxTypes } from '../types';
import { reduxHelpers } from '../common/reduxHelpers';
import { RHSM_API_QUERY_GRANULARITY, RHSM_API_QUERY_SLA } from '../../types/rhsmApiTypes';

/**
 * Initial state.
 *
 * @private
 * @type {{graphQuery: {}}}
 */
const initialState = {
  graphQuery: {}
};

/**
 * Apply user observer/reducer logic for views to state, against actions.
 *
 * @param {object} state
 * @param {object} action
 * @returns {object|{}}
 */
const viewReducer = (state = initialState, action) => {
  switch (action.type) {
    case reduxTypes.rhsm.SET_GRAPH_GRANULARITY_RHSM:
      return reduxHelpers.setStateProp(
        'graphQuery',
        {
          [action.viewId]: {
            ...state.graphQuery[action.viewId],
            [RHSM_API_QUERY_GRANULARITY]: action[RHSM_API_QUERY_GRANULARITY]
          }
        },
        {
          state,
          reset: false
        }
      );
    case reduxTypes.rhsm.SET_GRAPH_SLA_RHSM:
      return reduxHelpers.setStateProp(
        'graphQuery',
        {
          [action.viewId]: {
            ...state.graphQuery[action.viewId],
            [RHSM_API_QUERY_SLA]: action[RHSM_API_QUERY_SLA]
          }
        },
        {
          state,
          reset: false
        }
      );
    default:
      return state;
  }
};

viewReducer.initialState = initialState;

export { viewReducer as default, initialState, viewReducer };
