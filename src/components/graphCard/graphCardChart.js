import React from 'react';
import PropTypes from 'prop-types';
import {
  Card,
  CardActions,
  CardBody,
  CardHeader,
  CardTitle,
  Title,
  Toolbar,
  ToolbarContent,
  ToolbarGroup
} from '@patternfly/react-core';
import { useProduct, useProductGraphTallyQuery } from '../productView/productViewContext';
import { useGraphCardActions, useGraphCardContext, useGetMetrics } from './graphCardContext';
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
 * @param {Function} props.useGetMetrics
 * @param {Function} props.useGraphCardActions
 * @param {Function} props.useGraphCardContext
 * @param {Function} props.useProduct
 * @param {Function} props.useProductGraphTallyQuery
 * @returns {Node}
 */
const GraphCardChart = ({
  t,
  useGetMetrics: useAliasGetMetrics,
  useGraphCardActions: useAliasGraphCardActions,
  useGraphCardContext: useAliasGraphCardContext,
  useProduct: useAliasProduct,
  useProductGraphTallyQuery: useAliasProductGraphTallyQuery
}) => {
  const { productId } = useAliasProduct();
  const updatedActionDisplay = useAliasGraphCardActions();
  const { settings = {} } = useAliasGraphCardContext();
  const { isStandalone, metric } = settings;

  const { [RHSM_API_QUERY_SET_TYPES.GRANULARITY]: granularity } = useAliasProductGraphTallyQuery();
  const { pending, error, dataSets = [] } = useAliasGetMetrics();

  return (
    <Card isPlain={isStandalone} className="curiosity-usage-graph">
      <CardHeader>
        <CardTitle>
          <Title headingLevel="h2" size="lg">
            {t('curiosity-graph.cardHeading', { context: (isStandalone && metric?.id) || productId })}
            <GraphCardChartTitleTooltip />
          </Title>
        </CardTitle>
        {updatedActionDisplay && (
          <CardActions className={(error && 'blur') || ''}>
            <Toolbar collapseListedFiltersBreakpoint="sm">
              <ToolbarContent>
                <ToolbarGroup alignment={{ default: 'alignRight' }}>{updatedActionDisplay}</ToolbarGroup>
              </ToolbarContent>
            </Toolbar>
          </CardActions>
        )}
      </CardHeader>
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
 * @type {{useGraphCardContext: Function, useProduct: Function, useProductGraphTallyQuery: Function, t: Function,
 *     useGetMetrics: Function, useGraphCardActions: Function}}
 */
GraphCardChart.propTypes = {
  t: PropTypes.func,
  useGetMetrics: PropTypes.func,
  useGraphCardActions: PropTypes.func,
  useGraphCardContext: PropTypes.func,
  useProduct: PropTypes.func,
  useProductGraphTallyQuery: PropTypes.func
};

/**
 * Default props.
 *
 * @type {{useGraphCardContext: Function, useProduct: Function, useProductGraphTallyQuery: Function, t: translate,
 *     useGetMetrics: Function, useGraphCardActions: Function}}
 */
GraphCardChart.defaultProps = {
  t: translate,
  useGetMetrics,
  useGraphCardActions,
  useGraphCardContext,
  useProduct,
  useProductGraphTallyQuery
};

export { GraphCardChart as default, GraphCardChart };
