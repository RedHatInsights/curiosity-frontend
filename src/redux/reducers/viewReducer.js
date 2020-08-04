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
 * @type {{query: {}}}
 */
const initialState = {
  query: {}
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
    case reduxTypes.query.SET_QUERY_CLEAR:
      return reduxHelpers.setStateProp(
        'query',
        {
          [action.viewId]: {
            ...state.query[action.viewId],
            ...action.clearFilters
          }
        },
        {
          state,
          reset: false
        }
      );
    case reduxTypes.query.SET_QUERY_GRANULARITY_RHSM:
      return reduxHelpers.setStateProp(
        'query',
        {
          [action.viewId]: {
            ...state.query[action.viewId],
            [RHSM_API_QUERY_GRANULARITY]: action[RHSM_API_QUERY_GRANULARITY]
          }
        },
        {
          state,
          reset: false
        }
      );
    case reduxTypes.query.SET_QUERY_SLA_RHSM:
      return reduxHelpers.setStateProp(
        'query',
        {
          [action.viewId]: {
            ...state.query[action.viewId],
            [RHSM_API_QUERY_SLA]: action[RHSM_API_QUERY_SLA]
          }
        },
        {
          state,
          reset: false
        }
      );
    case reduxTypes.query.SET_QUERY_USAGE_RHSM:
      return reduxHelpers.setStateProp(
        'query',
        {
          [action.viewId]: {
            ...state.query[action.viewId],
            [RHSM_API_QUERY_USAGE]: action[RHSM_API_QUERY_USAGE]
          }
        },
        {
          state,
          reset: false
        }
      );
    case reduxTypes.query.SET_QUERY_PAGE_LIMIT_RHSM:
      return reduxHelpers.setStateProp(
        'query',
        {
          [action.viewId]: {
            ...state.query[action.viewId],
            [RHSM_API_QUERY_LIMIT]: action[RHSM_API_QUERY_LIMIT]
          }
        },
        {
          state,
          reset: false
        }
      );
    case reduxTypes.query.SET_QUERY_PAGE_OFFSET_RHSM:
      return reduxHelpers.setStateProp(
        'query',
        {
          [action.viewId]: {
            ...state.query[action.viewId],
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
