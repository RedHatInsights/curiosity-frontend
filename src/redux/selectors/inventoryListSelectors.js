import { createSelector } from 'reselect';
import moment from 'moment';
import _isEqual from 'lodash/isEqual';
import _camelCase from 'lodash/camelCase';
import { rhsmApiTypes } from '../../types/rhsmApiTypes';
import { reduxHelpers } from '../common/reduxHelpers';
import { getCurrentDate } from '../../common/dateHelpers';

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
  ...state.inventory?.hostsInventory?.[props.productId],
  ...{
    viewId: props.viewId,
    productId: props.productId,
    query: props.listQuery
  }
});

/**
 * Create selector, transform combined state, props into a consumable object.
 *
 * @type {{pending: boolean, fulfilled: boolean, listData: object, error: boolean, status: (*|number)}}
 */
const selector = createSelector([statePropsFilter], response => {
  const { viewId = null, productId = null, query = {}, metaId, metaQuery = {}, ...responseData } = response || {};

  const updatedResponseData = {
    error: responseData.error || false,
    fulfilled: false,
    pending: responseData.pending || responseData.cancelled || false,
    listData: [],
    status: responseData.status
  };

  const responseMetaQuery = { ...metaQuery };

  const cache =
    (viewId && productId && selectorCache.data[`${viewId}_${productId}_${JSON.stringify(query)}`]) || undefined;

  Object.assign(updatedResponseData, { ...cache });

  if (viewId && selectorCache.dataId !== viewId) {
    selectorCache.dataId = viewId;
    selectorCache.data = {};
  }

  if (responseData.fulfilled && productId === metaId && _isEqual(query, responseMetaQuery)) {
    const inventory = responseData.data;
    const listData = inventory?.[rhsmApiTypes.RHSM_API_RESPONSE_INVENTORY_DATA] || [];

    updatedResponseData.listData.length = 0;

    // Populate expected API response values with undefined
    const [hostsSchema = {}] = reduxHelpers.setResponseSchemas([rhsmApiTypes.RHSM_API_RESPONSE_INVENTORY_DATA_TYPES]);

    // Apply "display logic" then return a custom value for entries
    const customInventoryValue = ({ key, value }) => {
      switch (key) {
        case rhsmApiTypes.RHSM_API_RESPONSE_INVENTORY_DATA_TYPES.LAST_SEEN:
          return moment.utc(value).startOf('day').from(getCurrentDate()) || null;
        default:
          return value ?? null;
      }
    };

    // Generate reflected properties
    listData.forEach(value => {
      const generateReflectedData = ({ dataObj, keyPrefix = '', customValue = null }) => {
        const updatedDataObj = {};

        Object.keys(dataObj).forEach(dataObjKey => {
          const casedDataObjKey = _camelCase(`${keyPrefix} ${dataObjKey}`).trim();

          if (typeof customValue === 'function') {
            updatedDataObj[casedDataObjKey] = customValue({ data: dataObj, key: dataObjKey, value: value[dataObjKey] });
          } else {
            updatedDataObj[casedDataObjKey] = value[dataObjKey];
          }
        });

        updatedResponseData.listData.push(updatedDataObj);
      };

      generateReflectedData({ dataObj: { ...hostsSchema, ...value }, customValue: customInventoryValue });
    });

    // Update response and cache
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
 * @returns {{pending: boolean, fulfilled: boolean, graphData: object, error: boolean, status: (*|number)}}
 */
const makeSelector = defaultProps => (state, props) => ({
  ...selector(state, props, defaultProps)
});

const inventoryListSelectors = {
  inventoryList: selector,
  makeInventoryList: makeSelector
};

export { inventoryListSelectors as default, inventoryListSelectors, selector, makeSelector };
