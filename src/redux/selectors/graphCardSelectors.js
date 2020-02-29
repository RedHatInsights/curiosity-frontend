import { createSelector } from 'reselect';
import moment from 'moment';
import _get from 'lodash/get';
import _camelCase from 'lodash/camelCase';
import { rhsmApiTypes } from '../../types/rhsmApiTypes';
import { reduxHelpers } from '../common/reduxHelpers';

const graphCardCache = { dataId: null, data: {} };

const graphResponse = (state, props = {}) => ({
  ..._get(state, ['graph', 'reportCapacity', props.productId]),
  ...{ viewId: props.viewId, productId: props.productId, graphGranularity: props.graphGranularity }
});

const graphCardSelector = createSelector([graphResponse], response => {
  const { viewId = null, productId = null, graphGranularity, metaId, metaQuery = {}, ...responseData } = response || {};

  const updatedResponseData = {
    error: responseData.error || false,
    errorStatus: responseData.errorStatus,
    fulfilled: false,
    pending: responseData.pending || false,
    graphData: {}
  };

  const responseGranularity = metaQuery[rhsmApiTypes.RHSM_API_QUERY_GRANULARITY] || null;

  const cachedGranularity =
    (graphGranularity && viewId && productId && graphCardCache.data[`${viewId}_${productId}_${graphGranularity}`]) ||
    {};
  const initialLoad = 'initialLoad' in cachedGranularity ? cachedGranularity.initialLoad : true;

  Object.assign(updatedResponseData, { initialLoad, ...cachedGranularity });

  if (viewId && graphCardCache.dataId !== viewId) {
    graphCardCache.dataId = viewId;
    graphCardCache.data = {};
  }

  if (responseData.fulfilled && graphGranularity === responseGranularity && productId === metaId) {
    const [report, capacity] = responseData.data;
    const reportData = _get(report, [rhsmApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA], []);
    const capacityData = _get(capacity, [rhsmApiTypes.RHSM_API_RESPONSE_CAPACITY_DATA], []);

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

    // Apply "display logic" then return a custom value for Capacity graph entries
    const customCapacityValue = (data, key, { date, x, y }) => ({
      date,
      x,
      y: data[rhsmApiTypes.RHSM_API_RESPONSE_CAPACITY_DATA_TYPES.HAS_INFINITE] === true ? null : y
    });

    // Generate reflected graph data for number, undefined, and null
    reportData.forEach((value, index) => {
      const date = moment
        .utc(value[rhsmApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_TYPES.DATE])
        .startOf('day')
        .toDate();

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
              generatedY = Number.parseInt(graphDataObj[graphDataObjKey], 10);
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

      generateGraphData({ graphDataObj: { ...tallySchema, ...value } });
      generateGraphData({
        graphDataObj: { ...capacitySchema, ...capacityData[index] },
        keyPrefix: 'threshold',
        customValue: customCapacityValue
      });
    });

    // Update response and cache
    updatedResponseData.fulfilled = true;
    updatedResponseData.initialLoad = false;
    graphCardCache.data[`${viewId}_${productId}_${graphGranularity}`] = { ...updatedResponseData };
  }

  return updatedResponseData;
});

const makeGraphCardSelector = () => graphCardSelector;

const graphCardSelectors = {
  graphCard: graphCardSelector,
  makeGraphCard: makeGraphCardSelector
};

export { graphCardSelectors as default, graphCardSelectors, graphCardSelector, makeGraphCardSelector };
