import React, { useContext } from 'react';
import { reduxActions, storeHooks } from '../../redux';
import { useProduct, useProductGraphTallyQuery } from '../productView/productViewContext';
import { helpers } from '../../common/helpers';

/**
 * Chart context.
 *
 * @type {React.Context<{}>}
 */
const DEFAULT_CONTEXT = [{ settings: { isStandalone: false, metrics: [], metric: undefined } }, helpers.noop];

const GraphCardContext = React.createContext(DEFAULT_CONTEXT);

/**
 * Get an updated graph card context.
 *
 * @returns {React.Context<{}>}
 */
const useGraphCardContext = () => useContext(GraphCardContext);

/**
 * Use Redux RHSM Actions, getGraphTally.
 *
 * @param {object} options
 * @param {Function} options.useDispatch
 * @param {Function} options.useProductGraphTallyQuery
 * @returns {Function}
 */
const useGetGraphTally = ({
  useDispatch: useAliasDispatch = storeHooks.reactRedux.useDispatch,
  useProductGraphTallyQuery: useAliasProductGraphTallyQuery = useProductGraphTallyQuery
} = {}) => {
  const query = useAliasProductGraphTallyQuery();
  const dispatch = useAliasDispatch();

  return metrics => reduxActions.rhsm.getGraphTally(metrics, query)(dispatch);
};

/**
 * Get multiple metrics from store.
 *
 * @param {object} options
 * @param {Function} options.useGraphCardContext
 * @param {Function} options.useSelectors
 * @param {Function} options.useProduct
 * @returns {{data: object, pending: boolean, fulfilled: boolean, dataSets: Array, error: boolean}}
 */
const useMetricsSelector = ({
  useGraphCardContext: useAliasGraphCardContext = useGraphCardContext,
  useSelectors: useAliasSelectors = storeHooks.reactRedux.useSelectors,
  useProduct: useAliasProduct = useProduct
} = {}) => {
  const { productId } = useAliasProduct();
  const { settings = {} } = useAliasGraphCardContext();
  const { metrics = [] } = settings;
  const data = {};

  const metricResponses = useAliasSelectors(
    metrics.map(
      ({ id: metricId }) =>
        ({ graph }) =>
          graph.tally?.[`${productId}_${metricId}`]
    ),
    []
  );

  let isPending = false;
  let isFulfilled = false;
  let errorCount = 0;

  const dataSets = metricResponses.map((metric, index) => {
    const { pending, fulfilled, error, cancelled } = metric || {};
    const updatedPending = pending || cancelled || false;

    if (updatedPending) {
      isPending = true;
    }

    if (fulfilled) {
      isFulfilled = true;
    }

    if (error) {
      errorCount += 1;
    }

    const updatedMetric = {
      ...metrics[index],
      data: metric?.data?.data || [],
      meta: metric?.data?.meta || {}
    };
    data[metrics[index].id] = updatedMetric;

    return updatedMetric;
  });

  const response = {
    data,
    dataSets,
    error: false,
    fulfilled: false,
    pending: false
  };

  if (errorCount === dataSets.length) {
    response.error = true;
  } else if (isPending) {
    response.pending = true;
  } else if (isFulfilled) {
    response.fulfilled = true;
  }

  return response;
};

const context = {
  GraphCardContext,
  DEFAULT_CONTEXT,
  useGetGraphTally,
  useGraphCardContext,
  useMetricsSelector
};

export {
  context as default,
  context,
  GraphCardContext,
  DEFAULT_CONTEXT,
  useGetGraphTally,
  useGraphCardContext,
  useMetricsSelector
};
