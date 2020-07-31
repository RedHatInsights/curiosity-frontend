import { reduxTypes } from '../types';
import { reduxHelpers } from '../common/reduxHelpers';
import {
  RHSM_API_QUERY_GRANULARITY,
  RHSM_API_QUERY_LIMIT,
  RHSM_API_QUERY_OFFSET,
  RHSM_API_QUERY_SLA,
  RHSM_API_QUERY_USAGE
} from '../../types/rhsmApiTypes';

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
    case reduxTypes.rhsm.SET_FILTER_GRANULARITY_RHSM:
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
    case reduxTypes.rhsm.SET_FILTER_SLA_RHSM:
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
    case reduxTypes.rhsm.SET_FILTER_USAGE_RHSM:
      return reduxHelpers.setStateProp(
        'graphQuery',
        {
          [action.viewId]: {
            ...state.graphQuery[action.viewId],
            [RHSM_API_QUERY_USAGE]: action[RHSM_API_QUERY_USAGE]
          }
        },
        {
          state,
          reset: false
        }
      );
    case reduxTypes.rhsm.SET_CLEAR_FILTERS:
      return reduxHelpers.setStateProp(
        'graphQuery',
        {
          [action.viewId]: {
            ...state.graphQuery[action.viewId],
            ...action.clearFilters
          }
        },
        {
          state,
          reset: false
        }
      );
    case reduxTypes.rhsm.SET_PAGE_LIMIT_RHSM:
      return reduxHelpers.setStateProp(
        'graphQuery',
        {
          [action.viewId]: {
            ...state.graphQuery[action.viewId],
            [RHSM_API_QUERY_LIMIT]: action[RHSM_API_QUERY_LIMIT]
          }
        },
        {
          state,
          reset: false
        }
      );
    case reduxTypes.rhsm.SET_PAGE_OFFSET_RHSM:
      return reduxHelpers.setStateProp(
        'graphQuery',
        {
          [action.viewId]: {
            ...state.graphQuery[action.viewId],
            [RHSM_API_QUERY_OFFSET]: action[RHSM_API_QUERY_OFFSET]
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
