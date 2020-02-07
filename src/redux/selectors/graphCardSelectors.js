import { createSelector } from 'reselect';
import moment from 'moment';
import _get from 'lodash/get';
import { rhsmApiTypes } from '../../types/rhsmApiTypes';

const graphCardCache = {};

const graph = state => state.graph;

const graphCardSelector = createSelector(
  [graph],
  graphReducer => {
    const { component = {}, capacity = {}, report = {} } = graphReducer || {};

    const graphGranularity = component.graphGranularity || null;
    const reportGranularity = _get(report, ['metaQuery', rhsmApiTypes.RHSM_API_QUERY_GRANULARITY], null);
    const capacityGranularity = _get(capacity, ['metaQuery', rhsmApiTypes.RHSM_API_QUERY_GRANULARITY], null);
    const reportProductId = _get(report, ['metaData', 'id'], null);
    const capacityProductId = _get(capacity, ['metaData', 'id'], null);

    const productId = (reportProductId === capacityProductId && reportProductId) || null;
    let granularity = null;

    if (graphGranularity === reportGranularity || reportGranularity === capacityGranularity) {
      granularity = reportGranularity;
    } else if (graphGranularity === capacityGranularity) {
      granularity = capacityGranularity;
    }

    const cachedGranularity = (granularity && productId && graphCardCache[`${productId}_${granularity}`]) || {};
    const initialLoad = typeof cachedGranularity.initialLoad === 'boolean' ? cachedGranularity.initialLoad : true;

    const updatedData = {
      error: false,
      errorStatus: null,
      fulfilled: false,
      pending: false,
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
      ...cachedGranularity,
      ...component
    };

    if (granularity === null || productId === null) {
      updatedData.error = true;
      return updatedData;
    }

    if (initialLoad) {
      updatedData.pending = report.pending || capacity.pending || false;
    }

    updatedData.error = report.error || capacity.error || false;
    updatedData.errorStatus = report.errorStatus || capacity.errorStatus || null;

    if (capacity.fulfilled && report.fulfilled && granularity && productId) {
      const productsData = _get(report, ['data', rhsmApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA], []);
      const thresholdData = _get(capacity, ['data', rhsmApiTypes.RHSM_API_RESPONSE_CAPACITY_DATA], []);

      updatedData.graphData.cores.length = 0;
      updatedData.graphData.hypervisorCores.length = 0;
      updatedData.graphData.hypervisorSockets.length = 0;
      updatedData.graphData.physicalCores.length = 0;
      updatedData.graphData.physicalSockets.length = 0;
      updatedData.graphData.sockets.length = 0;
      updatedData.graphData.threshold.length = 0;

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

        updatedData.graphData.cores.push({
          date,
          x: index,
          y: Number.parseInt(value[rhsmApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_TYPES.CORES], 10) || 0
        });

        updatedData.graphData.hypervisorCores.push({
          date,
          x: index,
          y: Number.parseInt(value[rhsmApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_TYPES.HYPERVISOR_CORES], 10) || 0
        });

        updatedData.graphData.hypervisorSockets.push({
          date,
          x: index,
          y: Number.parseInt(value[rhsmApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_TYPES.HYPERVISOR_SOCKETS], 10) || 0
        });

        updatedData.graphData.physicalCores.push({
          date,
          x: index,
          y: Number.parseInt(value[rhsmApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_TYPES.PHYSICAL_CORES], 10) || 0
        });

        updatedData.graphData.physicalSockets.push({
          date,
          x: index,
          y: Number.parseInt(value[rhsmApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_TYPES.PHYSICAL_SOCKETS], 10) || 0
        });

        updatedData.graphData.sockets.push({
          date,
          x: index,
          y: Number.parseInt(value[rhsmApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_TYPES.SOCKETS], 10) || 0
        });

        updatedData.graphData.threshold.push({
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

      updatedData.initialLoad = false;
      updatedData.fulfilled = true;
      graphCardCache[`${productId}_${granularity}`] = { ...updatedData };
    }

    return updatedData;
  }
);

const makeGraphCardSelector = () => graphCardSelector;

const graphCardSelectors = {
  graphCard: graphCardSelector,
  makeGraphCard: makeGraphCardSelector
};

export { graphCardSelectors as default, graphCardSelectors, graphCardSelector, makeGraphCardSelector };
