import { createSelector } from 'reselect';
import moment from 'moment';
import _get from 'lodash/get';
import { rhelApiTypes } from '../../types/rhelApiTypes';

const rhelGraphCardCache = {};

const rhelGraph = state => state.rhelGraph;

const rhelGraphCardSelector = createSelector(
  [rhelGraph],
  rhelGraphReducer => {
    const { capacity = {}, report = {} } = rhelGraphReducer || {};
    const reportGranularity = _get(report, ['metaQuery', rhelApiTypes.RHSM_API_QUERY_GRANULARITY]);
    const capacityGranularity = _get(capacity, ['metaQuery', rhelApiTypes.RHSM_API_QUERY_GRANULARITY]);
    const granularity = reportGranularity || capacityGranularity || null;
    const cachedGranularity = (granularity && rhelGraphCardCache[granularity]) || {};
    const initialLoad = typeof cachedGranularity.initialLoad === 'boolean' ? cachedGranularity.initialLoad : true;

    const updatedData = {
      error: false,
      fulfilled: false,
      pending: false,
      initialLoad,
      graphData: {
        sockets: [],
        hypervisor: [],
        threshold: []
      },
      ...cachedGranularity
    };

    if (granularity === null) {
      updatedData.error = true;
      return updatedData;
    }

    if (initialLoad) {
      updatedData.error = report.error || capacity.error || false;
      updatedData.pending = report.pending || capacity.pending || false;
    }

    if (capacity.fulfilled && report.fulfilled && granularity) {
      const productsData = _get(report, ['data', rhelApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA], []);
      const thresholdData = _get(capacity, ['data', rhelApiTypes.RHSM_API_RESPONSE_CAPACITY_DATA], []);

      productsData.forEach((value, index) => {
        const date = moment
          .utc(value[rhelApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_TYPES.DATE])
          .startOf('day')
          .toDate();

        const checkThresholdDate = item => {
          if (!item) {
            return false;
          }

          const itemDate = moment
            .utc(item[rhelApiTypes.RHSM_API_RESPONSE_CAPACITY_DATA_TYPES.DATE])
            .startOf('day')
            .toDate();

          return moment(date).isSame(itemDate);
        };

        updatedData.graphData.sockets.push({
          date,
          x: index,
          y: Number.parseInt(value[rhelApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_TYPES.PHYSICAL_SOCKETS], 10)
        });

        updatedData.graphData.hypervisor.push({
          date,
          x: index,
          y: Number.parseInt(value[rhelApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_TYPES.HYPERVISOR_SOCKETS], 10)
        });

        updatedData.graphData.threshold.push({
          date,
          x: index,
          y: Number.parseInt(
            (checkThresholdDate(thresholdData && thresholdData[index]) &&
              thresholdData[index][rhelApiTypes.RHSM_API_RESPONSE_CAPACITY_DATA_TYPES.SOCKETS]) ||
              0,
            10
          )
        });
      });

      updatedData.initialLoad = false;
      updatedData.fulfilled = true;

      if (reportGranularity === capacityGranularity) {
        rhelGraphCardCache[granularity] = { ...updatedData };
      }
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
