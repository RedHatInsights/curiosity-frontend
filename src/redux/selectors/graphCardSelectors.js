import { createSelector } from 'reselect';
import moment from 'moment';
import _get from 'lodash/get';
import { rhsmApiTypes } from '../../types/rhsmApiTypes';

const rhelGraphCardCache = {};

const rhelGraph = state => state.rhelGraph;

const rhelGraphCardSelector = createSelector(
  [rhelGraph],
  rhelGraphReducer => {
    const { component = {}, capacity = {}, report = {} } = rhelGraphReducer || {};

    const graphGranularity = component.graphGranularity || null;
    const reportGranularity = _get(report, ['metaQuery', rhsmApiTypes.RHSM_API_QUERY_GRANULARITY], null);
    const capacityGranularity = _get(capacity, ['metaQuery', rhsmApiTypes.RHSM_API_QUERY_GRANULARITY], null);
    const reportProductId = _get(report, ['metaData', 'id'], null);
    const capacityProductId = _get(capacity, ['metaData', 'id'], null);

    let productId = null;
    let granularity = null;

    if (
      (graphGranularity && graphGranularity === reportGranularity && graphGranularity === capacityGranularity) ||
      (!graphGranularity && reportGranularity === capacityGranularity)
    ) {
      granularity = reportGranularity;
    }

    if (reportProductId === capacityProductId) {
      productId = reportProductId;
    }

    const cachedGranularity = (granularity && productId && rhelGraphCardCache[`${productId}_${granularity}`]) || {};
    const initialLoad = typeof cachedGranularity.initialLoad === 'boolean' ? cachedGranularity.initialLoad : true;

    const updatedData = {
      error: false,
      errorStatus: null,
      fulfilled: false,
      pending: false,
      initialLoad,
      graphData: {
        sockets: [],
        hypervisor: [],
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

      updatedData.graphData.sockets.length = 0;
      updatedData.graphData.hypervisor.length = 0;
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

        updatedData.graphData.sockets.push({
          date,
          x: index,
          y: Number.parseInt(value[rhsmApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_TYPES.PHYSICAL_SOCKETS], 10) || 0
        });

        updatedData.graphData.hypervisor.push({
          date,
          x: index,
          y: Number.parseInt(value[rhsmApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_TYPES.HYPERVISOR_SOCKETS], 10) || 0
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
      rhelGraphCardCache[`${productId}_${granularity}`] = { ...updatedData };
    }

    return updatedData;
  }
);

const makeRhelGraphCardSelector = () => rhelGraphCardSelector;

const graphCardSelectors = {
  rhelGraphCard: rhelGraphCardSelector,
  makeRhelGraphCard: makeRhelGraphCardSelector
};

export { graphCardSelectors as default, graphCardSelectors, rhelGraphCardSelector, makeRhelGraphCardSelector };
