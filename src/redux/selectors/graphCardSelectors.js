import { createSelector } from 'reselect';
import LruCache from 'lru-cache';
import moment from 'moment';
import _isEqual from 'lodash/isEqual';
import _camelCase from 'lodash/camelCase';
import { rhsmApiTypes } from '../../types/rhsmApiTypes';
import { reduxHelpers } from '../common/reduxHelpers';
import { apiQueries } from '../common';

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
  ...state.graph?.reportCapacity?.[props.productId],
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
  const { graphTallyQuery: query } = apiQueries.parseRhsmQuery(
    {
      ...props.query,
      ...state.view?.query?.[props.productId],
      ...state.view?.query?.[props.viewId]
    },
    {
      graphTallyQuery: { ...state.view?.graphTallyQuery?.[props.viewId] }
    }
  );

  return query;
};

/**
 * Create selector, transform combined state, props into a consumable graph/charting object.
 *
 * @type {{pending: boolean, fulfilled: boolean, graphData: object, error: boolean, status: (*|number)}}
 */
const selector = createSelector([statePropsFilter, queryFilter], (response, query = {}) => {
  const { viewId = null, productId = null, metaId, metaQuery = {}, ...responseData } = response || {};

  const updatedResponseData = {
    error: responseData.error || false,
    fulfilled: false,
    pending: responseData.pending || responseData.cancelled || false,
    graphData: {},
    query,
    status: responseData.status
  };

  const responseMetaQuery = { ...metaQuery };

  const cache =
    (viewId && productId && selectorCache.get(`${viewId}_${productId}_${JSON.stringify(query)}`)) || undefined;

  Object.assign(updatedResponseData, { ...cache });

  if (responseData.fulfilled && productId === metaId && _isEqual(query, responseMetaQuery)) {
    const [report, capacity] = responseData.data;
    const reportData = report?.[rhsmApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA] || [];
    const capacityData = capacity?.[rhsmApiTypes.RHSM_API_RESPONSE_CAPACITY_DATA] || [];

    /**
     * ToDo: Reevaluate this reset on graphData when working with Reselect's memoize.
     * Creating a new object i.e. updatedResponseData.graphData = {}; causes an update,
     * which in turn causes the graph to reload and flash.
     */
    Object.keys(updatedResponseData.graphData).forEach(graphDataKey => {
      updatedResponseData.graphData[graphDataKey] = [];
    });

    // Populate expected API response values with undefined
    const [tallySchema = {}, capacitySchema = {}] = reduxHelpers.setResponseSchemas([
      rhsmApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_TYPES,
      rhsmApiTypes.RHSM_API_RESPONSE_CAPACITY_DATA_TYPES
    ]);

    // Apply "display logic" then return a custom value for Reporting graph entries
    const customReportValue = (data, key, presetData) => ({
      ...presetData,
      hasData: data[rhsmApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_TYPES.HAS_DATA],
      hasCloudigradeData: data[rhsmApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_TYPES.HAS_CLOUDIGRADE_DATA],
      hasCloudigradeMismatch: data[rhsmApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_TYPES.HAS_CLOUDIGRADE_MISMATCH]
    });

    // Apply "display logic" then return a custom value for Capacity graph entries
    const customCapacityValue = (data, key, { date, x, y }) => ({
      date,
      x,
      y: data[rhsmApiTypes.RHSM_API_RESPONSE_CAPACITY_DATA_TYPES.HAS_INFINITE] === true ? null : y,
      hasInfinite: data[rhsmApiTypes.RHSM_API_RESPONSE_CAPACITY_DATA_TYPES.HAS_INFINITE]
    });

    // Generate reflected graph data for number, undefined, and null
    reportData.forEach((value, index) => {
      const date = moment.utc(value[rhsmApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_TYPES.DATE]).startOf('day').toDate();

      const generateGraphData = ({ graphDataObj, keyPrefix = '', customValue = null }) => {
        Object.keys(graphDataObj).forEach(graphDataObjKey => {
          if (
            typeof graphDataObj[graphDataObjKey] === 'number' ||
            graphDataObj[graphDataObjKey] === undefined ||
            graphDataObj[graphDataObjKey] === null
          ) {
            const casedGraphDataObjKey = _camelCase(`${keyPrefix} ${graphDataObjKey}`).trim();

            if (!updatedResponseData.graphData[casedGraphDataObjKey]) {
              updatedResponseData.graphData[casedGraphDataObjKey] = [];
            }

            let generatedY;

            if (typeof graphDataObj[graphDataObjKey] === 'number') {
              generatedY =
                (Number.isInteger(graphDataObj[graphDataObjKey]) &&
                  Number.parseInt(graphDataObj[graphDataObjKey], 10)) ||
                Number.parseFloat(Number.parseFloat(graphDataObj[graphDataObjKey]).toFixed(2));
            } else if (graphDataObj[graphDataObjKey] === undefined) {
              generatedY = 0;
            } else if (graphDataObj[graphDataObjKey] === null) {
              generatedY = graphDataObj[graphDataObjKey];
            }

            const updatedItem =
              (typeof customValue === 'function' &&
                customValue(graphDataObj, graphDataObjKey, { date, x: index, y: generatedY })) ||
              {};

            updatedResponseData.graphData[casedGraphDataObjKey][index] = {
              date,
              x: index,
              y: generatedY,
              ...updatedItem
            };
          }
        });
      };

      generateGraphData({ graphDataObj: { ...tallySchema, ...value }, customValue: customReportValue });
      generateGraphData({
        graphDataObj: { ...capacitySchema, ...capacityData[index] },
        keyPrefix: 'threshold',
        customValue: customCapacityValue
      });
    });

    // Update response and cache
    updatedResponseData.fulfilled = true;
    selectorCache.set(`${viewId}_${productId}_${JSON.stringify(query)}`, { ...updatedResponseData });
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

const graphCardSelectors = {
  graphCard: selector,
  makeGraphCard: makeSelector
};

export { graphCardSelectors as default, graphCardSelectors, selector, makeSelector };
