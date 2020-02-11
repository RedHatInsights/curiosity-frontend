import { createSelector } from 'reselect';
import moment from 'moment';
import _get from 'lodash/get';
import { rhsmApiTypes } from '../../types/rhsmApiTypes';

const graphCardCache = { dataId: null, data: {} };

const graphComponent = (state, props = {}) => ({ ..._get(state, ['graph', 'component', props.viewId]) });

const graphResponse = (state, props = {}) => ({
  ..._get(state, ['graph', 'reportCapacity', props.productId]),
  ...{ viewId: props.viewId }
});

const graphCardSelector = createSelector(
  [graphResponse, graphComponent],
  (response, component) => {
    const { viewId = null, metaId = null, metaQuery = {}, ...responseData } = response || {};

    const productId = metaId;
    const responseGranularity = metaQuery[rhsmApiTypes.RHSM_API_QUERY_GRANULARITY] || null;

    let granularity = null;

    if (component.graphGranularity === responseGranularity || (!component.graphGranularity && responseData.fulfilled)) {
      granularity = responseGranularity;
    }

    const cachedGranularity =
      (viewId && granularity && productId && graphCardCache.data[`${viewId}_${productId}_${granularity}`]) || {};
    const initialLoad = typeof cachedGranularity.initialLoad === 'boolean' ? cachedGranularity.initialLoad : true;

    if (viewId && graphCardCache.dataId !== viewId) {
      graphCardCache.dataId = viewId;
      graphCardCache.data = {};
    }

    const updatedResponseData = {
      ...component,
      error: responseData.error,
      errorStatus: responseData.errorStatus,
      fulfilled: responseData.fulfilled,
      pending: responseData.pending,
      initialLoad,
      graphData: {
        cores: [],
        hypervisorCores: [],
        hypervisorSockets: [],
        physicalCores: [],
        physicalSockets: [],
        sockets: [],
        threshold: []
      },
      ...cachedGranularity
    };

    if (productId === null || granularity === null) {
      return updatedResponseData;
    }

    if (initialLoad) {
      updatedResponseData.pending = responseData.pending || false;
    }

    if (responseData.fulfilled && granularity && productId) {
      const productsData = _get(responseData.data[0], [rhsmApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA], []);
      const thresholdData = _get(responseData.data[1], [rhsmApiTypes.RHSM_API_RESPONSE_CAPACITY_DATA], []);

      updatedResponseData.graphData.cores.length = 0;
      updatedResponseData.graphData.hypervisorCores.length = 0;
      updatedResponseData.graphData.hypervisorSockets.length = 0;
      updatedResponseData.graphData.physicalCores.length = 0;
      updatedResponseData.graphData.physicalSockets.length = 0;
      updatedResponseData.graphData.sockets.length = 0;
      updatedResponseData.graphData.threshold.length = 0;

      productsData.forEach((value, index) => {
        const date = moment
          .utc(value[rhsmApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_TYPES.DATE])
          .startOf('day')
          .toDate();

        const checkThresholdDate = item => {
          if (!item) {
            return false;
          }

          const itemDate = moment
            .utc(item[rhsmApiTypes.RHSM_API_RESPONSE_CAPACITY_DATA_TYPES.DATE])
            .startOf('day')
            .toDate();

          return moment(date).isSame(itemDate);
        };

        updatedResponseData.graphData.cores.push({
          date,
          x: index,
          y: Number.parseInt(value[rhsmApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_TYPES.CORES], 10) || 0
        });

        updatedResponseData.graphData.hypervisorCores.push({
          date,
          x: index,
          y: Number.parseInt(value[rhsmApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_TYPES.HYPERVISOR_CORES], 10) || 0
        });

        updatedResponseData.graphData.hypervisorSockets.push({
          date,
          x: index,
          y: Number.parseInt(value[rhsmApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_TYPES.HYPERVISOR_SOCKETS], 10) || 0
        });

        updatedResponseData.graphData.physicalCores.push({
          date,
          x: index,
          y: Number.parseInt(value[rhsmApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_TYPES.PHYSICAL_CORES], 10) || 0
        });

        updatedResponseData.graphData.physicalSockets.push({
          date,
          x: index,
          y: Number.parseInt(value[rhsmApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_TYPES.PHYSICAL_SOCKETS], 10) || 0
        });

        updatedResponseData.graphData.sockets.push({
          date,
          x: index,
          y: Number.parseInt(value[rhsmApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_TYPES.SOCKETS], 10) || 0
        });

        updatedResponseData.graphData.threshold.push({
          date,
          x: index,
          y: Number.parseInt(
            (checkThresholdDate(thresholdData && thresholdData[index]) &&
              thresholdData[index][rhsmApiTypes.RHSM_API_RESPONSE_CAPACITY_DATA_TYPES.SOCKETS]) ||
              0,
            10
          )
        });
      });

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
