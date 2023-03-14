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
import { useProductGraphTallyQuery } from '../productView/productViewContext';
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
 * @memberof GraphCard
 * @module GraphCardChart
 */

/**
 * A chart/graph card.
 *
 * @param {object} props
 * @param {Function} props.t
 * @param {Function} props.useGetMetrics
 * @param {Function} props.useGraphCardActions
 * @param {Function} props.useGraphCardContext
 * @param {Function} props.useProductGraphTallyQuery
 * @returns {React.ReactNode}
 */
const GraphCardChart = ({
  t,
  useGetMetrics: useAliasGetMetrics,
  useGraphCardActions: useAliasGraphCardActions,
  useGraphCardContext: useAliasGraphCardContext,
  useProductGraphTallyQuery: useAliasProductGraphTallyQuery
}) => {
  const updatedActionDisplay = useAliasGraphCardActions();
  const { settings = {} } = useAliasGraphCardContext();
  const { groupMetric, stringId } = settings;

  const { [RHSM_API_QUERY_SET_TYPES.GRANULARITY]: granularity } = useAliasProductGraphTallyQuery();
  const { pending, error, dataSets = [] } = useAliasGetMetrics();

  return (
    <Card isPlain className="curiosity-usage-graph">
      <CardHeader>
        <CardTitle>
          <Title headingLevel="h2" size="lg">
            {t('curiosity-graph.cardHeading', { context: [stringId, groupMetric.join('-')] })}
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
 * @type {{useGraphCardContext: Function, useProductGraphTallyQuery: Function, t: Function,
 *     useGetMetrics: Function, useGraphCardActions: Function}}
 */
GraphCardChart.propTypes = {
  t: PropTypes.func,
  useGetMetrics: PropTypes.func,
  useGraphCardActions: PropTypes.func,
  useGraphCardContext: PropTypes.func,
  useProductGraphTallyQuery: PropTypes.func
};

/**
 * Default props.
 *
 * @type {{useGraphCardContext: Function, useProductGraphTallyQuery: Function, t: translate,
 *     useGetMetrics: Function, useGraphCardActions: Function}}
 */
GraphCardChart.defaultProps = {
  t: translate,
  useGetMetrics,
  useGraphCardActions,
  useGraphCardContext,
  useProductGraphTallyQuery
};

export { GraphCardChart as default, GraphCardChart };
