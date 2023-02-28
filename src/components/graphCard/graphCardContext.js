import React, { useContext, useMemo } from 'react';
import { useShallowCompareEffect } from 'react-use';
import { ToolbarItem } from '@patternfly/react-core';
import { reduxActions, storeHooks } from '../../redux';
import { useProduct, useProductGraphConfig, useProductGraphTallyQuery } from '../productView/productViewContext';
import { toolbarFieldOptions } from '../toolbar/toolbarFieldSelectCategory';
import { helpers } from '../../common/helpers';
import { graphCardHelpers } from './graphCardHelpers';

/**
 * @memberof GraphCard
 * @module GraphCardContext
 */

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
 * Parse filters settings for context.
 *
 * @param {object} options
 * @param {Function} options.useProduct
 * @param {Function} options.useProductGraphConfig
 * @returns {{standaloneFiltersSettings: Array<{ settings: object }>, groupedFiltersSettings: { settings: object }}}
 */
const useParseFiltersSettings = ({
  useProduct: useAliasProduct = useProduct,
  useProductGraphConfig: useAliasProductGraphConfig = useProductGraphConfig
} = {}) => {
  const { productId } = useAliasProduct();
  const { filters = [], settings = {} } = useAliasProductGraphConfig();
  const { groupedFiltersSettings, standaloneFiltersSettings = [] } = useMemo(
    () =>
      graphCardHelpers.generateChartSettings({
        filters,
        settings,
        productId
      }),
    [filters, settings, productId]
  );

  return {
    groupedFiltersSettings,
    standaloneFiltersSettings
  };
};

/**
 * Transform multiple metrics from store for chart/graph consumption.
 *
 * @param {object} options
 * @param {Function} options.useGraphCardContext
 * @param {Function} options.useSelectorsResponse
 * @returns {{data: {}, pending: boolean, fulfilled: boolean, responses: {errorList: Array, errorId: {},
 *     id: {}, list: Array}, cancelled: boolean, dataSets: Array, message: null, error: boolean}}
 */
const useMetricsSelector = ({
  useGraphCardContext: useAliasGraphCardContext = useGraphCardContext,
  useSelectorsResponse: useAliasSelectorsResponse = storeHooks.reactRedux.useSelectorsResponse
} = {}) => {
  const { settings = {} } = useAliasGraphCardContext();
  const { metrics = [] } = settings;

  const {
    error,
    fulfilled,
    pending,
    data = [],
    ...response
  } = useAliasSelectorsResponse(
    metrics.map(
      ({ id: metricId, isCapacity }) =>
        ({ graph }) =>
          isCapacity ? graph.capacity?.[metricId] : graph.tally?.[metricId]
    )
  );

  /**
   * Apply graph config settings to metric data.
   */
  const dataById = {};
  const dataByList = data?.map((metricData, index) => {
    const updatedMetricData = {
      ...metrics[index],
      ...metricData
    };
    dataById[metrics[index].id] = updatedMetricData;
    return updatedMetricData;
  });

  return {
    ...response,
    data: dataById,
    dataSets: dataByList,
    error,
    fulfilled,
    pending
  };
};

/**
 * Get graph metrics from Tally or Capacity.
 *
 * @param {object} params
 * @param {Function} params.getGraphMetrics
 * @param {Function} params.useDispatch
 * @param {Function} params.useGraphCardContext
 * @param {Function} params.useMetricsSelector
 * @param {Function} params.useProduct
 * @param {Function} params.useProductGraphTallyQuery
 * @returns {{data: {}, pending: boolean, fulfilled: boolean, responses: {errorList: Array, errorId: {},
 *     id: {}, list: Array}, cancelled: boolean, dataSets: Array, message: null, error: boolean}}
 */
const useGetMetrics = ({
  getGraphMetrics = reduxActions.rhsm.getGraphMetrics,
  useDispatch: useAliasDispatch = storeHooks.reactRedux.useDispatch,
  useGraphCardContext: useAliasGraphCardContext = useGraphCardContext,
  useMetricsSelector: useAliasMetricsSelector = useMetricsSelector,
  useProduct: useAliasProduct = useProduct,
  useProductGraphTallyQuery: useAliasProductGraphTallyQuery = useProductGraphTallyQuery
} = {}) => {
  const { productId } = useAliasProduct();
  const query = useAliasProductGraphTallyQuery();
  const dispatch = useAliasDispatch();
  const response = useAliasMetricsSelector();
  const { settings = {} } = useAliasGraphCardContext();
  const { metrics = [] } = settings;

  useShallowCompareEffect(() => {
    const updatedMetrics = metrics.map(({ metric: metricId, isCapacity, query: metricQuery }) => ({
      id: productId,
      metric: metricId,
      isCapacity,
      query: metricQuery
    }));
    getGraphMetrics(updatedMetrics, query)(dispatch);
  }, [metrics, productId, query]);

  return response;
};

/**
 * Return a component list for a configurable graphCard action toolbar.
 * Allow the "content" prop to receive graph data for display via callback.
 *
 * @param {object} params
 * @param {Array} params.categoryOptions
 * @param {Function} params.useMetricsSelector
 * @param {Function} params.useGraphCardContext
 * @returns {Array}
 */
const useGraphCardActions = ({
  categoryOptions = toolbarFieldOptions,
  useMetricsSelector: useAliasMetricsSelector = useMetricsSelector,
  useGraphCardContext: useAliasGraphCardContext = useGraphCardContext
} = {}) => {
  const { pending, dataSets } = useAliasMetricsSelector();
  const { settings = {} } = useAliasGraphCardContext();
  const { actions } = settings;

  return useMemo(
    () =>
      actions?.map(({ id, content, ...actionProps }) => {
        const option = categoryOptions.find(({ value: categoryOptionValue }) => id === categoryOptionValue);
        const { component: OptionComponent } = option || {};

        return (
          (OptionComponent && (
            <ToolbarItem key={`option-${id}`}>
              <OptionComponent isFilter={false} {...actionProps} />
            </ToolbarItem>
          )) ||
          (content && !pending && dataSets.length && (
            <ToolbarItem key={id || helpers.generateId()}>
              {typeof content === 'function' ? content({ data: dataSets }) : content}
            </ToolbarItem>
          )) ||
          null
        );
      }),
    [actions, categoryOptions, dataSets, pending]
  );
};

const context = {
  GraphCardContext,
  DEFAULT_CONTEXT,
  useGetMetrics,
  useGraphCardActions,
  useGraphCardContext,
  useMetricsSelector,
  useParseFiltersSettings
};

export {
  context as default,
  context,
  GraphCardContext,
  DEFAULT_CONTEXT,
  useGetMetrics,
  useGraphCardActions,
  useGraphCardContext,
  useMetricsSelector,
  useParseFiltersSettings
};
