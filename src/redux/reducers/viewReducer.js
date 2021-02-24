import { reduxTypes } from '../types';
import { reduxHelpers } from '../common/reduxHelpers';
import { RHSM_API_QUERY_TYPES } from '../../types/rhsmApiTypes';

/**
 * Initial state.
 *
 * @private
 * @type {{graphTallyQuery: {}, inventoryHostsQuery: {}, inventorySubscriptionsQuery: {}, query: {},
 *     inventoryGuestsQuery: {}}}
 */
const initialState = {
  query: {},
  graphTallyQuery: {},
  inventoryGuestsQuery: {},
  inventoryHostsQuery: {},
  inventorySubscriptionsQuery: {}
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
    case reduxTypes.query.SET_QUERY_RESET_INVENTORY_LIST:
      const updateResetQueries = query => {
        const tempQuery = {};

        Object.entries(query).forEach(([key, value]) => {
          tempQuery[key] = { ...value };

          if (typeof value[RHSM_API_QUERY_TYPES.OFFSET] === 'number') {
            tempQuery[key][RHSM_API_QUERY_TYPES.OFFSET] = 0;
          }

          delete tempQuery[key][RHSM_API_QUERY_TYPES.DIRECTION];
          delete tempQuery[key][RHSM_API_QUERY_TYPES.SORT];
        });

        return tempQuery;
      };

      return reduxHelpers.setStateProp(
        null,
        {
          ...state,
          inventoryHostsQuery: updateResetQueries(state.inventoryHostsQuery),
          inventorySubscriptionsQuery: updateResetQueries(state.inventorySubscriptionsQuery)
        },
        {
          state,
          reset: false
        }
      );
    case reduxTypes.query.SET_QUERY_CLEAR_INVENTORY_LIST:
      const updateClearQueries = query => {
        const tempQuery = {};

        Object.entries(query).forEach(([key, value]) => {
          tempQuery[key] = { ...value };

          if (typeof value[RHSM_API_QUERY_TYPES.OFFSET] === 'number') {
            tempQuery[key][RHSM_API_QUERY_TYPES.OFFSET] = 0;
          }
        });

        return tempQuery;
      };

      return reduxHelpers.setStateProp(
        null,
        {
          ...state,
          inventoryHostsQuery: updateClearQueries(state.inventoryHostsQuery),
          inventorySubscriptionsQuery: updateClearQueries(state.inventorySubscriptionsQuery)
        },
        {
          state,
          reset: false
        }
      );
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
    case reduxTypes.query.SET_QUERY_RHSM_TYPES[RHSM_API_QUERY_TYPES.GRANULARITY]:
      return reduxHelpers.setStateProp(
        'graphTallyQuery',
        {
          [action.viewId]: {
            ...state.graphTallyQuery[action.viewId],
            [RHSM_API_QUERY_TYPES.GRANULARITY]: action[RHSM_API_QUERY_TYPES.GRANULARITY]
          }
        },
        {
          state,
          reset: false
        }
      );
    case reduxTypes.query.SET_QUERY_RHSM_TYPES[RHSM_API_QUERY_TYPES.START_DATE]:
      return reduxHelpers.setStateProp(
        'graphTallyQuery',
        {
          [action.viewId]: {
            ...state.graphTallyQuery[action.viewId],
            [RHSM_API_QUERY_TYPES.START_DATE]: action[RHSM_API_QUERY_TYPES.START_DATE]
          }
        },
        {
          state,
          reset: false
        }
      );
    case reduxTypes.query.SET_QUERY_RHSM_TYPES[RHSM_API_QUERY_TYPES.END_DATE]:
      return reduxHelpers.setStateProp(
        'graphTallyQuery',
        {
          [action.viewId]: {
            ...state.graphTallyQuery[action.viewId],
            [RHSM_API_QUERY_TYPES.END_DATE]: action[RHSM_API_QUERY_TYPES.END_DATE]
          }
        },
        {
          state,
          reset: false
        }
      );
    case reduxTypes.query.SET_QUERY_RHSM_TYPES[RHSM_API_QUERY_TYPES.SLA]:
      return reduxHelpers.setStateProp(
        'query',
        {
          [action.viewId]: {
            ...state.query[action.viewId],
            [RHSM_API_QUERY_TYPES.SLA]: action[RHSM_API_QUERY_TYPES.SLA]
          }
        },
        {
          state,
          reset: false
        }
      );
    case reduxTypes.query.SET_QUERY_RHSM_TYPES[RHSM_API_QUERY_TYPES.UOM]:
      return reduxHelpers.setStateProp(
        'query',
        {
          [action.viewId]: {
            ...state.query[action.viewId],
            [RHSM_API_QUERY_TYPES.UOM]: action[RHSM_API_QUERY_TYPES.UOM]
          }
        },
        {
          state,
          reset: false
        }
      );
    case reduxTypes.query.SET_QUERY_RHSM_TYPES[RHSM_API_QUERY_TYPES.USAGE]:
      return reduxHelpers.setStateProp(
        'query',
        {
          [action.viewId]: {
            ...state.query[action.viewId],
            [RHSM_API_QUERY_TYPES.USAGE]: action[RHSM_API_QUERY_TYPES.USAGE]
          }
        },
        {
          state,
          reset: false
        }
      );
    case reduxTypes.query.SET_QUERY_RHSM_HOSTS_INVENTORY_TYPES[RHSM_API_QUERY_TYPES.DISPLAY_NAME]:
      return reduxHelpers.setStateProp(
        'inventoryHostsQuery',
        {
          [action.viewId]: {
            ...state.inventoryHostsQuery[action.viewId],
            [RHSM_API_QUERY_TYPES.DISPLAY_NAME]: action[RHSM_API_QUERY_TYPES.DISPLAY_NAME]
          }
        },
        {
          state,
          reset: false
        }
      );
    case reduxTypes.query.SET_QUERY_RHSM_HOSTS_INVENTORY_TYPES[RHSM_API_QUERY_TYPES.LIMIT]:
      return reduxHelpers.setStateProp(
        'inventoryHostsQuery',
        {
          [action.viewId]: {
            ...state.inventoryHostsQuery[action.viewId],
            [RHSM_API_QUERY_TYPES.LIMIT]: action[RHSM_API_QUERY_TYPES.LIMIT]
          }
        },
        {
          state,
          reset: false
        }
      );
    case reduxTypes.query.SET_QUERY_RHSM_HOSTS_INVENTORY_TYPES[RHSM_API_QUERY_TYPES.OFFSET]:
      return reduxHelpers.setStateProp(
        'inventoryHostsQuery',
        {
          [action.viewId]: {
            ...state.inventoryHostsQuery[action.viewId],
            [RHSM_API_QUERY_TYPES.OFFSET]: action[RHSM_API_QUERY_TYPES.OFFSET]
          }
        },
        {
          state,
          reset: false
        }
      );
    case reduxTypes.query.SET_QUERY_RHSM_HOSTS_INVENTORY_TYPES[RHSM_API_QUERY_TYPES.DIRECTION]:
      return reduxHelpers.setStateProp(
        'inventoryHostsQuery',
        {
          [action.viewId]: {
            ...state.inventoryHostsQuery[action.viewId],
            [RHSM_API_QUERY_TYPES.DIRECTION]: action[RHSM_API_QUERY_TYPES.DIRECTION]
          }
        },
        {
          state,
          reset: false
        }
      );
    case reduxTypes.query.SET_QUERY_RHSM_HOSTS_INVENTORY_TYPES[RHSM_API_QUERY_TYPES.SORT]:
      return reduxHelpers.setStateProp(
        'inventoryHostsQuery',
        {
          [action.viewId]: {
            ...state.inventoryHostsQuery[action.viewId],
            [RHSM_API_QUERY_TYPES.SORT]: action[RHSM_API_QUERY_TYPES.SORT]
          }
        },
        {
          state,
          reset: false
        }
      );
    case reduxTypes.query.SET_QUERY_RHSM_SUBSCRIPTIONS_INVENTORY_TYPES[RHSM_API_QUERY_TYPES.LIMIT]:
      return reduxHelpers.setStateProp(
        'inventorySubscriptionsQuery',
        {
          [action.viewId]: {
            ...state.inventorySubscriptionsQuery[action.viewId],
            [RHSM_API_QUERY_TYPES.LIMIT]: action[RHSM_API_QUERY_TYPES.LIMIT]
          }
        },
        {
          state,
          reset: false
        }
      );
    case reduxTypes.query.SET_QUERY_RHSM_SUBSCRIPTIONS_INVENTORY_TYPES[RHSM_API_QUERY_TYPES.OFFSET]:
      return reduxHelpers.setStateProp(
        'inventorySubscriptionsQuery',
        {
          [action.viewId]: {
            ...state.inventorySubscriptionsQuery[action.viewId],
            [RHSM_API_QUERY_TYPES.OFFSET]: action[RHSM_API_QUERY_TYPES.OFFSET]
          }
        },
        {
          state,
          reset: false
        }
      );
    case reduxTypes.query.SET_QUERY_RHSM_SUBSCRIPTIONS_INVENTORY_TYPES[RHSM_API_QUERY_TYPES.DIRECTION]:
      return reduxHelpers.setStateProp(
        'inventorySubscriptionsQuery',
        {
          [action.viewId]: {
            ...state.inventorySubscriptionsQuery[action.viewId],
            [RHSM_API_QUERY_TYPES.DIRECTION]: action[RHSM_API_QUERY_TYPES.DIRECTION]
          }
        },
        {
          state,
          reset: false
        }
      );
    case reduxTypes.query.SET_QUERY_RHSM_SUBSCRIPTIONS_INVENTORY_TYPES[RHSM_API_QUERY_TYPES.SORT]:
      return reduxHelpers.setStateProp(
        'inventorySubscriptionsQuery',
        {
          [action.viewId]: {
            ...state.inventorySubscriptionsQuery[action.viewId],
            [RHSM_API_QUERY_TYPES.SORT]: action[RHSM_API_QUERY_TYPES.SORT]
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
