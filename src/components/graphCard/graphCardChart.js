import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardActions, CardBody, CardHeader, CardTitle, Title } from '@patternfly/react-core';
import { useShallowCompareEffect } from 'react-use';
import { useProduct, useProductGraphTallyQuery } from '../productView/productViewContext';
import { useGraphCardContext, useGetGraphTally, useMetricsSelector } from './graphCardContext';
import { graphCardHelpers } from './graphCardHelpers';
import { Chart } from '../chart/chart';
import { GraphCardChartLegend } from './graphCardChartLegend';
import { GraphCardChartTooltip } from './graphCardChartTooltip';
import { GraphCardChartTitleTooltip } from './graphCardChartTitleTooltip';
import { RHSM_API_QUERY_SET_TYPES } from '../../services/rhsm/rhsmConstants';
import { MinHeight } from '../minHeight/minHeight';
import { Loader } from '../loader/loader';
import { translate } from '../i18n/i18n';

/**
 * A chart/graph card.
 *
 * @param {object} props
 * @param {Function} props.t
 * @param {Function} props.useGetGraphTally
 * @param {Function} props.useGraphCardContext
 * @param {Function} props.useMetricsSelector
 * @param {Function} props.useProduct
 * @param {Function} props.useProductGraphTallyQuery
 * @returns {Node}
 */
const GraphCardChart = ({
  t,
  useGetGraphTally: useAliasGetGraphTally,
  useGraphCardContext: useAliasGraphCardContext,
  useMetricsSelector: useAliasMetricsSelector,
  useProduct: useAliasProduct,
  useProductGraphTallyQuery: useAliasProductGraphTallyQuery
}) => {
  const { productId } = useAliasProduct();
  const { settings = {} } = useAliasGraphCardContext();
  const { actionDisplay, metric, metrics = [] } = settings;

  const { [RHSM_API_QUERY_SET_TYPES.GRANULARITY]: granularity } = useAliasProductGraphTallyQuery();
  const { pending, error, data = {}, dataSets = [] } = useAliasMetricsSelector();
  const getGraphTally = useAliasGetGraphTally();

  useShallowCompareEffect(() => {
    getGraphTally(metrics.map(({ id: metricId }) => ({ id: productId, metric: metricId })));
  }, [metrics, productId, getGraphTally]);

  const standaloneMetricId = (metric?.id && `_${metric?.id}`) || '';
  let updatedActionDisplay = null;

  if (typeof actionDisplay === 'function') {
    updatedActionDisplay = actionDisplay({ data: { ...data } });
  }

  return (
    <Card className="curiosity-usage-graph">
      <MinHeight key="headerMinHeight">
        <CardHeader>
          <CardTitle>
            <Title headingLevel="h2" size="lg">
              {t(`curiosity-graph.cardHeading${standaloneMetricId}`, { context: productId })}
              <GraphCardChartTitleTooltip />
            </Title>
          </CardTitle>
          {updatedActionDisplay && (
            <CardActions className={(error && 'blur') || ''}>{updatedActionDisplay}</CardActions>
          )}
        </CardHeader>
      </MinHeight>
      <MinHeight key="bodyMinHeight">
        <CardBody>
          <div className={(error && 'blur') || (pending && 'fadein') || ''}>
            {pending && <Loader variant="graph" />}
            {!pending && (
              <Chart
                {...graphCardHelpers.generateExtendedChartSettings({ settings, granularity })}
                dataSets={dataSets}
                chartLegend={({ chart, datum }) => <GraphCardChartLegend chart={chart} datum={datum} />}
                chartTooltip={({ datum }) => <GraphCardChartTooltip datum={datum} />}
              />
            )}
          </div>
        </CardBody>
      </MinHeight>
    </Card>
  );
};

/**
 * Prop types.
 *
 * @type {{useGraphCardContext: Function, useProduct: Function, useProductGraphTallyQuery: Function,
 *     useMetricsSelector: Function, useGetGraphTally: Function}}
 */
GraphCardChart.propTypes = {
  t: PropTypes.func,
  useGetGraphTally: PropTypes.func,
  useGraphCardContext: PropTypes.func,
  useMetricsSelector: PropTypes.func,
  useProduct: PropTypes.func,
  useProductGraphTallyQuery: PropTypes.func
};

/**
 * Default props.
 *
 * @type {{useGraphCardContext: Function, useProduct: Function, useProductGraphTallyQuery: Function,
 *     useMetricsSelector: Function, useGetGraphTally: Function}}
 */
GraphCardChart.defaultProps = {
  t: translate,
  useGetGraphTally,
  useGraphCardContext,
  useMetricsSelector,
  useProduct,
  useProductGraphTallyQuery
};

export { GraphCardChart as default, GraphCardChart };
