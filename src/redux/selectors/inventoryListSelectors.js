import { createSelectorCreator, defaultMemoize } from 'reselect';
import LruCache from 'lru-cache';
import _isEqual from 'lodash/isEqual';
import { rhsmApiTypes } from '../../types/rhsmApiTypes';
import { reduxHelpers } from '../common/reduxHelpers';
import { apiQueries } from '../common';
import { selector as userSession } from './userSelectors';

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
 * @type {object}
 */
const selectorCache = new LruCache({
  maxAge: Number.parseInt(process.env.REACT_APP_SELECTOR_CACHE, 10),
  max: 10,
  stale: true,
  updateAgeOnGet: true
});

/**
 * Return a combined state, props object.
 *
 * @private
 * @param {object} state
 * @param {object} props
 * @returns {object}
 */
const statePropsFilter = (state, props = {}) => ({
  ...state.inventory?.hostsInventory?.[props.productId],
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
  const { inventoryHostsQuery: query } = apiQueries.parseRhsmQuery(
    {
      ...props.query,
      ...state.view?.query?.[props.productId],
      ...state.view?.query?.[props.viewId]
    },
    {
      inventoryHostsQuery: {
        ...state.view?.inventoryHostsQuery?.[props.productId],
        ...state.view?.inventoryHostsQuery?.[props.viewId]
      }
    }
  );

  return query;
};

/**
 * Note: We use an in-memory cache to provide the user a pleasant UX experience. To
 * aid in that UX we need "pending" to fire in scenarios that are not loaded in-memory. Because
 * we load the cache first there are scenarios where the previous XHR call is still in state
 * when a subsequent fulfilled XHR call comes through. Without the _isEqual(query, metaQuery) check
 * the overlap of the prior fulfilled call interferes with the pending of the subsequent call.
 */
/**
 * Create selector, transform combined state, props into a consumable object.
 *
 * @type {{pending: boolean, fulfilled: boolean, listData: object, error: boolean, status: (*|number)}}
 */
const selector = createDeepEqualSelector([statePropsFilter, queryFilter], (response, query = {}) => {
  const { viewId = null, productId = null, metaId, metaQuery = {}, ...responseData } = response || {};

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
    (viewId && productId && selectorCache.get(`${viewId}_${productId}_${JSON.stringify(query)}`)) || undefined;

  Object.assign(updatedResponseData, { ...cache });

  if (responseData.fulfilled && productId === metaId && _isEqual(query, metaQuery)) {
    const {
      [rhsmApiTypes.RHSM_API_RESPONSE_INVENTORY_DATA]: listData = [],
      [rhsmApiTypes.RHSM_API_RESPONSE_META]: listMeta = {}
    } = responseData.data || {};

    updatedResponseData.listData.length = 0;

    // Apply "display logic" then return a custom value for entries
    const customInventoryValue = ({ key, value }) => {
      switch (key) {
        case rhsmApiTypes.RHSM_API_RESPONSE_INVENTORY_DATA_TYPES.CLOUD_PROVIDER:
        case rhsmApiTypes.RHSM_API_RESPONSE_INVENTORY_DATA_TYPES.HARDWARE:
        case rhsmApiTypes.RHSM_API_RESPONSE_INVENTORY_DATA_TYPES.MEASUREMENT:
          return value?.toLowerCase() || null;
        case rhsmApiTypes.RHSM_API_RESPONSE_INVENTORY_DATA_TYPES.LAST_SEEN:
          return (value && new Date(value)) || null;
        default:
          return value ?? null;
      }
    };

    // Generate normalized properties
    const [updatedListData, updatedListMeta] = reduxHelpers.setNormalizedResponse(
      {
        schema: rhsmApiTypes.RHSM_API_RESPONSE_INVENTORY_DATA_TYPES,
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
    selectorCache.set(`${viewId}_${productId}_${JSON.stringify(query)}`, { ...updatedResponseData });
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

const inventoryListSelectors = {
  inventoryList: selector,
  makeInventoryList: makeSelector
};

export { inventoryListSelectors as default, inventoryListSelectors, selector, makeSelector };
