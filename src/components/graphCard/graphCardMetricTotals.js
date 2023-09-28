import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardBody, CardFooter, CardHeader, CardTitle, Title } from '@patternfly/react-core';
import _camelCase from 'lodash/camelCase';
import { useProductGraphTallyQuery } from '../productView/productViewContext';
import { useGraphCardContext, useMetricsSelector } from './graphCardContext';
import { Loader, SkeletonSize } from '../loader/loader';
import { toolbarFieldOptions } from '../toolbar/toolbarFieldRangedMonthly';
import { RHSM_API_QUERY_SET_TYPES } from '../../services/rhsm/rhsmConstants';
import { graphCardHelpers } from './graphCardHelpers';
import { helpers } from '../../common';

/**
 * @memberof GraphCard
 * @module GraphCardMetricTotals
 */

/**
 * Display totals for a single metric.
 *
 * @param {object} props
 * @param {React.ReactNode} props.children
 * @param {Function} props.useGraphCardContext
 * @param {Function} props.useMetricsSelector
 * @param {Function} props.useProductGraphTallyQuery
 * @returns {React.ReactNode}
 */
const GraphCardMetricTotals = ({
  children,
  useGraphCardContext: useAliasGraphCardContext,
  useMetricsSelector: useAliasMetricsSelector,
  useProductGraphTallyQuery: useAliasProductGraphTallyQuery
}) => {
  const { settings = {} } = useAliasGraphCardContext();
  const query = useAliasProductGraphTallyQuery();
  const { pending, error, fulfilled, dataSets: dataByList = [] } = useAliasMetricsSelector();

  const { [RHSM_API_QUERY_SET_TYPES.START_DATE]: startDate } = query;
  const { isCurrent: isSelectedMonthCurrent } =
    toolbarFieldOptions.find(
      option => option.title === startDate || option.value.startDate.toISOString() === startDate
    ) || {};

  if (settings?.isMetricDisplay && settings?.cards?.length) {
    const metricDisplayPassedData = helpers.setImmutableData(
      {
        dataSets: dataByList.map(dataSet => {
          const { id: chartId, metric: metricId } = dataSet || {};
          return {
            ...dataSet,
            display: {
              ...graphCardHelpers.getDailyMonthlyTotals({ dataSet, isCurrent: isSelectedMonthCurrent }),
              ...graphCardHelpers.getRemainingCapacity({
                ...graphCardHelpers.getPrepaidTallyCapacity({ data: dataByList }),
                isCurrent: isSelectedMonthCurrent
              }),
              ...graphCardHelpers.getRemainingOverage({
                ...graphCardHelpers.getPrepaidTallyCapacity({ data: dataByList }),
                isCurrent: isSelectedMonthCurrent
              }),
              chartId,
              metricId
            }
          };
        })
      },
      { isClone: true }
    );

    return (
      <div
        data-test={`graphMetricTotals-${settings?.groupMetric?.map(metricId => _camelCase(metricId))?.join('-')}`}
        data-test-data={JSON.stringify(metricDisplayPassedData)}
        className="curiosity-graph__totals curiosity-usage-graph__totals"
      >
        <div>
          <div className="curiosity-graph__totals-column curiosity-usage-graph__totals-column">
            {settings?.cards?.map(({ key, header, body, footer }, index) => (
              <Card
                key={key || helpers.generateHash({ metricDisplayPassedData, index })}
                isPlain
                data-test={`graphMetricTotalsCard-${index}`}
                className={`curiosity-graph__totals-column-card curiosity-usage-graph__totals-column-card ${
                  (error && 'blur') || ''
                }`}
              >
                <CardHeader className="curiosity-graph__totals-column-card-header">
                  <CardTitle>
                    <Title headingLevel="h2" size="md">
                      {pending && <Loader variant="skeleton" skeletonProps={{ size: SkeletonSize.lg }} />}
                      {fulfilled && ((typeof header === 'function' && header(metricDisplayPassedData)) || header)}
                    </Title>
                  </CardTitle>
                </CardHeader>
                <CardBody className="curiosity-graph__totals-column-card-body">
                  <div>
                    {pending && <Loader variant="skeleton" skeletonProps={{ size: SkeletonSize.lg, height: '60px' }} />}
                    {fulfilled && ((typeof body === 'function' && body(metricDisplayPassedData)) || body)}
                  </div>
                </CardBody>
                <CardFooter className="curiosity-graph__totals-column-card-footer">
                  <div>
                    {pending && <Loader variant="skeleton" skeletonProps={{ size: SkeletonSize.lg }} />}
                    {fulfilled && ((typeof footer === 'function' && footer(metricDisplayPassedData)) || footer)}
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
        <div>
          <div className="curiosity-graph__totals-graph-column curiosity-usage-graph__totals-graph-column">
            {children}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div data-test="graphStandalone" className="curiosity-graph__standalone curiosity-usage-graph__standalone">
      {children}
    </div>
  );
};

/**
 * Prop types.
 *
 * @type {{useProductGraphTallyQuery: Function, children: React.ReactNode, useMetricsSelector: Function}}
 */
GraphCardMetricTotals.propTypes = {
  children: PropTypes.node,
  useGraphCardContext: PropTypes.func,
  useMetricsSelector: PropTypes.func,
  useProductGraphTallyQuery: PropTypes.func
};

/**
 * Default props.
 *
 * @type {{useProductGraphTallyQuery: Function, children: React.ReactNode, useMetricsSelector: Function}}
 */
GraphCardMetricTotals.defaultProps = {
  children: null,
  useGraphCardContext,
  useMetricsSelector,
  useProductGraphTallyQuery
};

export { GraphCardMetricTotals as default, GraphCardMetricTotals };
