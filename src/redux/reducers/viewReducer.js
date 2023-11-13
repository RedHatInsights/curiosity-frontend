import { productConfig } from '../../config';
import { reduxTypes } from '../types';
import { reduxHelpers } from '../common/reduxHelpers';
import { RHSM_API_QUERY_SET_TYPES as RHSM_API_QUERY_TYPES } from '../../services/rhsm/rhsmConstants';

/**
 * View query related user state reducer.
 *
 * @memberof Reducers
 * @module ViewReducer
 */

/**
 * Initial state.
 *
 * @private
 * @type {{product: {}, graphTallyQuery: {}, inventoryHostsQuery: {}, inventorySubscriptionsQuery: {},
 *     query: {}, productConfig: {}, inventoryGuestsQuery: {}}}
 */
const initialState = {
  query: {},
  graphTallyQuery: {},
  inventoryGuestsQuery: {},
  inventoryHostsQuery: {},
  inventorySubscriptionsQuery: {},
  product: {},
  productConfig: {}
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
    case reduxTypes.app.SET_PRODUCT_VARIANT_QUERY_RESET_ALL:
      const updateVariantResetQueries = (query = {}, id) => {
        const queryIds =
          productConfig.sortedConfigs().byGroupIdConfigs[id]?.map(({ viewId }) => viewId) || (query[id] && [id]) || [];
        const updatedQuery = { ...query };

        queryIds.forEach(queryId => {
          delete updatedQuery[queryId];
        });

        return updatedQuery;
      };

      return reduxHelpers.setStateProp(
        null,
        {
          ...state,
          query: updateVariantResetQueries(state.query, action.productGroup),
          graphTallyQuery: updateVariantResetQueries(state.graphTallyQuery, action.productGroup),
          inventoryGuestsQuery: updateVariantResetQueries(state.inventoryGuestsQuery, action.productGroup),
          inventoryHostsQuery: updateVariantResetQueries(state.inventoryHostsQuery, action.productGroup),
          inventorySubscriptionsQuery: updateVariantResetQueries(state.inventorySubscriptionsQuery, action.productGroup)
        },
        {
          state,
          reset: false
        }
      );
    case reduxTypes.query.SET_QUERY_RESET_INVENTORY_LIST:
      const updateResetQueries = (query = {}, id) => {
        const queryIds = productConfig.sortedConfigs().byViewIds[id] || (query[id] && [id]) || [];
        const updatedQuery = { ...query };

        queryIds.forEach(queryId => {
          const productQuery = updatedQuery[queryId] || {};

          if (typeof productQuery[RHSM_API_QUERY_TYPES.OFFSET] === 'number') {
            productQuery[RHSM_API_QUERY_TYPES.OFFSET] = 0;
          }

          delete productQuery[RHSM_API_QUERY_TYPES.DIRECTION];
          delete productQuery[RHSM_API_QUERY_TYPES.SORT];
        });

        return updatedQuery;
      };

      return reduxHelpers.setStateProp(
        null,
        {
          ...state,
          inventoryHostsQuery: updateResetQueries(state.inventoryHostsQuery, action.viewId),
          inventorySubscriptionsQuery: updateResetQueries(state.inventorySubscriptionsQuery, action.viewId)
        },
        {
          state,
          reset: false
        }
      );
    case reduxTypes.query.SET_QUERY_CLEAR_INVENTORY_LIST:
      const updateClearQueries = (query = {}, id) => {
        const queryIds = productConfig.sortedConfigs().byViewIds[id] || (query[id] && [id]) || [];
        const updatedQuery = { ...query };

        queryIds.forEach(queryId => {
          const productQuery = updatedQuery[queryId] || {};

          if (typeof productQuery[RHSM_API_QUERY_TYPES.OFFSET] === 'number') {
            productQuery[RHSM_API_QUERY_TYPES.OFFSET] = 0;
          }
        });

        return updatedQuery;
      };

      return reduxHelpers.setStateProp(
        null,
        {
          ...state,
          inventoryHostsQuery: updateClearQueries(state.inventoryHostsQuery, action.viewId),
          inventorySubscriptionsQuery: updateClearQueries(state.inventorySubscriptionsQuery, action.viewId)
        },
        {
          state,
          reset: false
        }
      );
    case reduxTypes.query.SET_QUERY_CLEAR_INVENTORY_GUESTS_LIST:
      const updateClearGuestQuery = (query = {}, id) => {
        const queryIds = productConfig.sortedConfigs().byViewIds[id] || (query[id] && [id]) || [];
        const updatedQuery = { ...query };

        queryIds.forEach(queryId => {
          const productQuery = updatedQuery[queryId] || {};

          if (typeof productQuery[RHSM_API_QUERY_TYPES.OFFSET] === 'number') {
            productQuery[RHSM_API_QUERY_TYPES.OFFSET] = 0;
          }
        });

        return updatedQuery;
      };

      return reduxHelpers.setStateProp(
        null,
        {
          ...state,
          inventoryGuestsQuery: updateClearGuestQuery(state.inventoryGuestsQuery, action.viewId)
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
    case reduxTypes.query.SET_QUERY:
      return reduxHelpers.setStateProp(
        'query',
        {
          [action.viewId]: {
            ...state.query[action.viewId],
            [action.filter]: action.value
          }
        },
        {
          state,
          reset: false
        }
      );
    case reduxTypes.query.SET_QUERY_GRAPH:
      return reduxHelpers.setStateProp(
        'graphTallyQuery',
        {
          [action.viewId]: {
            ...state.graphTallyQuery[action.viewId],
            [action.filter]: action.value
          }
        },
        {
          state,
          reset: false
        }
      );
    case reduxTypes.query.SET_QUERY_INVENTORY_GUESTS:
      return reduxHelpers.setStateProp(
        'inventoryGuestsQuery',
        {
          [action.viewId]: {
            ...state.inventoryGuestsQuery[action.viewId],
            [action.filter]: action.value
          }
        },
        {
          state,
          reset: false
        }
      );
    case reduxTypes.query.SET_QUERY_INVENTORY_INSTANCES:
      return reduxHelpers.setStateProp(
        'inventoryHostsQuery',
        {
          [action.viewId]: {
            ...state.inventoryHostsQuery[action.viewId],
            [action.filter]: action.value
          }
        },
        {
          state,
          reset: false
        }
      );
    case reduxTypes.query.SET_QUERY_INVENTORY_SUBSCRIPTIONS:
      return reduxHelpers.setStateProp(
        'inventorySubscriptionsQuery',
        {
          [action.viewId]: {
            ...state.inventorySubscriptionsQuery[action.viewId],
            [action.filter]: action.value
          }
        },
        {
          state,
          reset: false
        }
      );
    case reduxTypes.app.SET_PRODUCT:
      return reduxHelpers.setStateProp(
        'product',
        {
          config: action.config
        },
        {
          state,
          reset: false
        }
      );
    case reduxTypes.app.SET_PRODUCT_VARIANT:
      return reduxHelpers.setStateProp(
        'product',
        {
          variant: {
            ...state?.product?.variant,
            [action.productGroup]: action.variant
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
