import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardBody, CardFooter, CardTitle, Flex, FlexItem } from '@patternfly/react-core';
import moment from 'moment';
import numbro from 'numbro';
import { useProductGraphTallyQuery } from '../productView/productViewContext';
import { useMetricsSelector } from './graphCardContext';
import { MinHeight } from '../minHeight/minHeight';
import { Loader, SkeletonSize } from '../loader/loader';
import { dateHelpers } from '../../common';
import { toolbarFieldOptions } from '../toolbar/toolbarFieldRangedMonthly';
import { RHSM_API_QUERY_SET_TYPES } from '../../services/rhsm/rhsmConstants';
import { translate } from '../i18n/i18n';

/**
 * Display totals for a single metric.
 *
 * @param {object} props
 * @param {Node} props.children
 * @param {Function} props.t
 * @param {Function} props.useMetricsSelector
 * @param {Function} props.useProductGraphTallyQuery
 * @returns {Node}
 */
const GraphCardMetricTotals = ({
  children,
  t,
  useMetricsSelector: useAliasMetricsSelector,
  useProductGraphTallyQuery: useAliasProductGraphTallyQuery
}) => {
  const { [RHSM_API_QUERY_SET_TYPES.START_DATE]: startDate } = useAliasProductGraphTallyQuery();
  const { pending, error, fulfilled, dataSets = [] } = useAliasMetricsSelector();
  const { data = [], id: metricId, meta = {} } = dataSets[0] || {};
  const { date: currentDate, hasData: currentHasData, y: currentValue } = data[data.length - 1] || {};
  const { totalMonthlyDate, totalMonthlyHasData, totalMonthlyValue } = meta;

  const { title: selectedMonth, isCurrent } =
    toolbarFieldOptions.find(
      option => option.title === startDate || option.value.startDate.toISOString() === startDate
    ) || {};

  return (
    <Flex className="curiosity-usage-graph__totals">
      <Flex flex={{ default: 'flex_1' }} direction={{ default: 'column' }} alignSelf={{ default: 'alignSelfStretch' }}>
        <FlexItem className="curiosity-usage-graph__totals-column">
          <Card className={`curiosity-usage-graph__totals-column-card ${(error && 'blur') || ''}`}>
            <CardTitle>
              {t('curiosity-graph.cardHeadingMetric_currentTotal', {
                context: [isCurrent && 'current', metricId],
                month: selectedMonth
              })}
            </CardTitle>
            <MinHeight key="currentBody">
              <CardBody>
                <div>
                  {pending && <Loader variant="skeleton" skeletonProps={{ size: SkeletonSize.lg }} />}
                  {fulfilled &&
                    t(
                      'curiosity-graph.cardBodyMetric_currentTotal',
                      {
                        context: (currentHasData && metricId) || '',
                        total: numbro(currentValue)
                          .format({ average: true, mantissa: 5, trimMantissa: true, lowPrecision: false })
                          .toUpperCase()
                      },
                      [<strong title={currentValue} aria-label={currentValue} />]
                    )}
                </div>
              </CardBody>
            </MinHeight>
            <MinHeight key="currentFooter">
              <CardFooter>
                <div className={(!currentHasData && 'hidden') || ''}>
                  {fulfilled &&
                    currentDate &&
                    t('curiosity-graph.cardFooterMetric', {
                      date: moment.utc(currentDate).format(dateHelpers.timestampTimeFormats.yearTimeShort)
                    })}
                </div>
              </CardFooter>
            </MinHeight>
          </Card>
          <Card className={`curiosity-usage-graph__totals-column-card ${(error && 'blur') || ''}`}>
            <CardTitle>
              {t('curiosity-graph.cardHeadingMetric_total', { context: metricId, month: selectedMonth })}
            </CardTitle>
            <MinHeight key="totalMonthlyBody">
              <CardBody>
                <div>
                  {pending && <Loader variant="skeleton" skeletonProps={{ size: SkeletonSize.lg }} />}
                  {fulfilled &&
                    t(
                      'curiosity-graph.cardBodyMetric_total',
                      {
                        context: (totalMonthlyHasData && metricId) || '',
                        total: numbro(totalMonthlyValue)
                          .format({ average: true, mantissa: 5, trimMantissa: true, lowPrecision: false })
                          .toUpperCase()
                      },
                      [<strong title={totalMonthlyValue} aria-label={totalMonthlyValue} />]
                    )}
                </div>
              </CardBody>
            </MinHeight>
            <MinHeight key="totalMonthlyFooter">
              <CardFooter>
                <div className={(!totalMonthlyHasData && 'hidden') || ''}>
                  {fulfilled &&
                    totalMonthlyDate &&
                    t('curiosity-graph.cardFooterMetric', {
                      date: moment.utc(totalMonthlyDate).format(dateHelpers.timestampTimeFormats.yearTimeShort)
                    })}
                </div>
              </CardFooter>
            </MinHeight>
          </Card>
        </FlexItem>
      </Flex>
      <Flex flex={{ default: 'flex_3' }} direction={{ default: 'column' }} alignSelf={{ default: 'alignSelfStretch' }}>
        <FlexItem className="curiosity-usage-graph__totals-graph-column">{children}</FlexItem>
      </Flex>
    </Flex>
  );
};

/**
 * Prop types.
 *
 * @type {{useProductGraphTallyQuery: Function, t: Function, children: Node, useMetricsSelector: Function}}
 */
GraphCardMetricTotals.propTypes = {
  children: PropTypes.node,
  t: PropTypes.func,
  useMetricsSelector: PropTypes.func,
  useProductGraphTallyQuery: PropTypes.func
};

/**
 * Default props.
 *
 * @type {{useProductGraphTallyQuery: Function, t: Function, children: Node, useMetricsSelector: Function}}
 */
GraphCardMetricTotals.defaultProps = {
  children: null,
  t: translate,
  useMetricsSelector,
  useProductGraphTallyQuery
};

export { GraphCardMetricTotals as default, GraphCardMetricTotals };
