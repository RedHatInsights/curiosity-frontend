import { createSelector } from 'reselect';
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
      cached: false,
      error: false,
      fulfilled: false,
      pending: false,
      initialLoad,
      graphData: {
        usage: [],
        capacity: []
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
      updatedData.graphData.usage = _get(report, ['data', rhelApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA], []);
      updatedData.graphData.capacity = _get(capacity, ['data', rhelApiTypes.RHSM_API_RESPONSE_CAPACITY_DATA], []);
      updatedData.initialLoad = false;
      updatedData.fulfilled = true;
      updatedData.cached = false;

      if (reportGranularity === capacityGranularity) {
        rhelGraphCardCache[granularity] = { ...updatedData, cached: true };
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
