import { createSelectorCreator, defaultMemoize } from 'reselect';
import _isEqual from 'lodash/isEqual';
import { rhsmApiTypes } from '../../types/rhsmApiTypes';
import { reduxHelpers } from '../common/reduxHelpers';
import { apiQueries } from '../common';
import { selector as userSession } from './userSelectors';

/**
 * ToDo: Consider consolidating inventory selectors, and/or create API specific selectors, i.e. RHSM, etc
 * Breaking out the inventory selectors is a temporary solution until the API is finalized. Aspects
 * of the caching and applying the API schemas is now consistent enough to allow for grouping/refinement.
 */

/**
 * Create a custom "are objects equal" selector.
 *
 * @private
 * @type {Function}}
 */
const createDeepEqualSelector = createSelectorCreator(defaultMemoize, _isEqual);

/**
 * Selector cache.
 *
 * @private
 * @type {{dataId: {string}, data: {object}}}
 */
const selectorCache = { dataId: null, data: {} };

/**
 * Return a combined state, props object.
 *
 * @private
 * @param {object} state
 * @param {object} props
 * @returns {object}
 */
const statePropsFilter = (state, props = {}) => ({
  ...state.inventory?.subscriptionsInventory?.[props.productId],
  ...{
    viewId: props.viewId,
    productId: props.productId
  }
});

/**
 * Return a combined query object.
 *
 * @param {object} state
 * @param {object} props
 * @returns {object}
 */
const queryFilter = (state, props = {}) => {
  const { inventoryQuery: query } = apiQueries.parseRhsmQuery({
    ...props.query,
    ...state.view?.subscriptionsQuery?.[props.productId],
    ...state.view?.query?.[props.productId],
    ...state.view?.query?.[props.viewId]
  });

  return query;
};

/**
 * Create selector, transform combined state, props into a consumable object.
 *
 * @type {{pending: boolean, fulfilled: boolean, listData: object, error: boolean, status: (*|number)}}
 */
const selector = createDeepEqualSelector([statePropsFilter, queryFilter], (response, query = {}) => {
  const { viewId = null, productId = null, metaId, ...responseData } = response || {};

  const updatedResponseData = {
    error: responseData.error || false,
    fulfilled: false,
    pending: responseData.pending || responseData.cancelled || false,
    listData: [],
    itemCount: 0,
    query,
    status: responseData.status
  };

  const cache =
    (viewId && productId && selectorCache.data[`${viewId}_${productId}_${JSON.stringify(query)}`]) || undefined;

  Object.assign(updatedResponseData, { ...cache });

  // Reset cache on viewId update
  if (viewId && selectorCache.dataId !== viewId) {
    selectorCache.dataId = viewId;
    selectorCache.data = {};
  }

  /**
   * ToDo: evaluate removing id check
   * This logic is left over. We started cancelling subsequent promise calls making additional
   * checks superfluous, fulfilled should be the only check necessary now.
   */
  if (responseData.fulfilled && productId === metaId) {
    const {
      [rhsmApiTypes.RHSM_API_RESPONSE_INVENTORY_DATA]: listData = [],
      [rhsmApiTypes.RHSM_API_RESPONSE_META]: listMeta = {}
    } = responseData.data || {};

    updatedResponseData.listData.length = 0;

    // Apply "display logic" then return a custom value for entries
    const customInventoryValue = ({ key, value }) => {
      switch (key) {
        case rhsmApiTypes.RHSM_API_RESPONSE_INVENTORY_SUBSCRIPTIONS_DATA_TYPES.UPCOMING_EVENT_DATE:
          return (value && new Date(value)) || null;
        default:
          return value ?? null;
      }
    };

    // Generate normalized properties
    const [updatedListData, updatedListMeta] = reduxHelpers.setNormalizedResponse(
      {
        schema: rhsmApiTypes.RHSM_API_RESPONSE_INVENTORY_SUBSCRIPTIONS_DATA_TYPES,
        data: listData,
        customResponseValue: customInventoryValue
      },
      {
        schema: rhsmApiTypes.RHSM_API_RESPONSE_META_TYPES,
        data: listMeta
      }
    );

    const [meta = {}] = updatedListMeta || [];

    // Update response and cache
    updatedResponseData.itemCount = meta[rhsmApiTypes.RHSM_API_RESPONSE_META_TYPES.COUNT] ?? 0;
    updatedResponseData.listData = updatedListData;
    updatedResponseData.fulfilled = true;
    selectorCache.data[`${viewId}_${productId}_${JSON.stringify(query)}`] = {
      ...updatedResponseData
    };
  }

  return updatedResponseData;
});

/**
 * Expose selector instance. For scenarios where a selector is reused across component instances.
 *
 * @param {object} defaultProps
 * @returns {{pending: boolean, fulfilled: boolean, graphData: object, error: boolean, session: object,
 *     status: (*|number)}}
 */
const makeSelector = defaultProps => (state, props) => ({
  ...userSession(state, props, defaultProps),
  ...selector(state, props, defaultProps)
});

const subscriptionsListSelectors = {
  subscriptionsList: selector,
  makeSubscriptionsList: makeSelector
};

export { subscriptionsListSelectors as default, subscriptionsListSelectors, selector, makeSelector };
