import { createSelector } from 'reselect';
import moment from 'moment';
import _get from 'lodash/get';
import _camelCase from 'lodash/camelCase';
import { rhsmApiTypes } from '../../types/rhsmApiTypes';
import { reduxHelpers } from '../common/reduxHelpers';

const graphCardCache = { dataId: null, data: {} };

const graphComponent = (state, props = {}) => ({ ..._get(state, ['graph', 'component', props.viewId]) });

const graphResponse = (state, props = {}) => ({
  ..._get(state, ['graph', 'reportCapacity', props.productId]),
  ...{ viewId: props.viewId, productId: props.productId }
});

const graphCardSelector = createSelector(
  [graphResponse, graphComponent],
  (response, component) => {
    const { viewId = null, productId = null, metaQuery = {}, ...responseData } = response || {};

    const updatedResponseData = {
      ...component,
      error: responseData.error || false,
      errorStatus: responseData.errorStatus,
      fulfilled: responseData.fulfilled || false,
      pending: responseData.pending || false,
      graphData: {},
      syncing: false
    };

    const responseGranularity = metaQuery[rhsmApiTypes.RHSM_API_QUERY_GRANULARITY] || null;
    let granularity = null;

    if (component.graphGranularity === responseGranularity || (!component.graphGranularity && responseData.fulfilled)) {
      granularity = responseGranularity;
    }

    if (!granularity && responseData.fulfilled) {
      updatedResponseData.syncing = true;
    }

    const cachedGranularity =
      (granularity && viewId && productId && graphCardCache.data[`${viewId}_${productId}_${granularity}`]) || {};
    const initialLoad = 'initialLoad' in cachedGranularity ? cachedGranularity.initialLoad : true;

    Object.assign(updatedResponseData, { initialLoad, ...cachedGranularity });

    if (viewId && graphCardCache.dataId !== viewId) {
      graphCardCache.dataId = viewId;
      graphCardCache.data = {};
    }

    if (responseData.fulfilled && granularity && productId) {
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
          keyPrefix: 'threshold'
        });
      });

      // Update response and cache
      updatedResponseData.initialLoad = false;
      graphCardCache.data[`${viewId}_${productId}_${granularity}`] = { ...updatedResponseData };
    }

    return updatedResponseData;
  }
);

const makeGraphCardSelector = () => graphCardSelector;

const graphCardSelectors = {
  graphCard: graphCardSelector,
  makeGraphCard: makeGraphCardSelector
};

export { graphCardSelectors as default, graphCardSelectors, graphCardSelector, makeGraphCardSelector };
