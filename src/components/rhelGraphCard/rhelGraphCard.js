import React from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import { Card, CardHead, CardActions, CardBody } from '@patternfly/react-core';
import {
  chart_color_green_300 as chartColorGreenDark,
  chart_color_blue_100 as chartColorBlueLight,
  chart_color_blue_300 as chartColorBlueDark,
  chart_color_cyan_100 as chartColorCyanLight,
  chart_color_cyan_300 as chartColorCyanDark
} from '@patternfly/react-tokens';
import { Skeleton, SkeletonSize } from '@redhat-cloud-services/frontend-components';
import { Select } from '../select/select';
import { connectTranslate, reduxActions, reduxSelectors, reduxTypes, store } from '../../redux';
import { helpers, dateHelpers } from '../../common';
import { rhsmApiTypes, RHSM_API_QUERY_GRANULARITY_TYPES as GRANULARITY_TYPES } from '../../types/rhsmApiTypes';
import { rhelGraphCardHelpers } from './rhelGraphCardHelpers';
import { rhelGraphCardTypes } from './rhelGraphCardTypes';
import ChartArea from '../chartArea/chartArea';

class RhelGraphCard extends React.Component {
  componentDidMount() {
    this.onUpdateGraphData();
  }

  componentDidUpdate(prevProps) {
    const { graphGranularity } = this.props;

    if (graphGranularity !== prevProps.graphGranularity) {
      this.onUpdateGraphData();
    }
  }

  onUpdateGraphData = () => {
    const { getGraphCapacity, getGraphReports, graphGranularity, startDate, endDate, productId } = this.props;
    const query = {
      [rhsmApiTypes.RHSM_API_QUERY_GRANULARITY]: graphGranularity,
      [rhsmApiTypes.RHSM_API_QUERY_START_DATE]: startDate.toISOString(),
      [rhsmApiTypes.RHSM_API_QUERY_END_DATE]: endDate.toISOString()
    };

    if (productId) {
      getGraphCapacity(productId, query);
      getGraphReports(productId, query);
    }
  };

  onSelect = event => {
    const { graphGranularity } = this.props;
    const { value } = event;

    if (graphGranularity !== value) {
      store.dispatch({
        type: reduxTypes.rhsm.SET_GRAPH_GRANULARITY_RHSM,
        graphGranularity: value
      });
    }
  };

  renderChart() {
    const { graphData, graphGranularity, t } = this.props;

    const xAxisTickFormat = ({ item, previousItem, tick }) =>
      rhelGraphCardHelpers.xAxisTickFormat({
        tick,
        date: item.date,
        previousDate: previousItem.date,
        granularity: graphGranularity
      });

    const tooltips = ({ itemsByKey }) =>
      rhelGraphCardHelpers.getTooltips({
        itemsByKey,
        granularity: graphGranularity
      });

    const chartAreaProps = {
      xAxisFixLabelOverlap: true,
      xAxisLabelIncrement: rhelGraphCardHelpers.getChartXAxisLabelIncrement(graphGranularity),
      xAxisTickFormat,
      yAxisTickFormat: rhelGraphCardHelpers.yAxisTickFormat,
      tooltips
    };

    return (
      <ChartArea
        {...chartAreaProps}
        dataSets={[
          {
            data: graphData.sockets,
            id: 'sockets',
            animate: {
              duration: 250,
              onLoad: { duration: 250 }
            },
            fill: chartColorBlueLight.value,
            stroke: chartColorBlueDark.value,
            legendLabel: t('curiosity-graph.rhelLegendSocketsLabel'),
            isStacked: true
          },
          {
            data: graphData.hypervisor,
            id: 'hypervisor',
            animate: {
              duration: 250,
              onLoad: { duration: 250 }
            },
            fill: chartColorCyanLight.value,
            stroke: chartColorCyanDark.value,
            legendLabel: t('curiosity-graph.rhelLegendHypervisorLabel'),
            isStacked: true
          },
          {
            data: graphData.threshold,
            id: 'threshold',
            animate: {
              duration: 100,
              onLoad: { duration: 100 }
            },
            stroke: chartColorGreenDark.value,
            legendLabel: t('curiosity-graph.rhelLegendThresholdLabel'),
            isThreshold: true
          }
        ]}
      />
    );
  }

  // ToDo: combine "curiosity-skeleton-container" into a single class w/ --loading and BEM style
  render() {
    const { error, errorRoute, errorStatus, graphGranularity, pending, t } = this.props;
    const getDateMenuOptions = rhelGraphCardTypes.getDateMenuOptions();

    if (error && (errorStatus === 403 || errorStatus >= 500)) {
      return (errorRoute && errorRoute.to && <Redirect to={errorRoute.to} />) || null;
    }

    return (
      <Card className="curiosity-usage-graph fadein">
        <CardHead>
          <h2>{t('curiosity-graph.heading', 'CPU socket usage')}</h2>
          <CardActions>
            <Select
              aria-label={t('curiosity-graph.dropdownPlaceholder', 'Select date range')}
              onSelect={this.onSelect}
              options={getDateMenuOptions}
              selectedOptions={graphGranularity}
              placeholder={t('curiosity-graph.dropdownPlaceholder', 'Select date range')}
            />
          </CardActions>
        </CardHead>
        <CardBody>
          <div className="curiosity-skeleton-container">
            {pending && (
              <React.Fragment>
                <Skeleton size={SkeletonSize.xs} />
                <Skeleton size={SkeletonSize.sm} />
                <Skeleton size={SkeletonSize.md} />
                <Skeleton size={SkeletonSize.lg} />
              </React.Fragment>
            )}
            {!pending && this.renderChart()}
          </div>
        </CardBody>
      </Card>
    );
  }
}

RhelGraphCard.propTypes = {
  error: PropTypes.bool,
  errorRoute: PropTypes.shape({
    to: PropTypes.string
  }),
  errorStatus: PropTypes.number,
  getGraphCapacity: PropTypes.func,
  getGraphReports: PropTypes.func,
  graphData: PropTypes.shape({
    sockets: PropTypes.arrayOf(
      PropTypes.shape({
        date: PropTypes.instanceOf(Date),
        x: PropTypes.number,
        y: PropTypes.number
      })
    ),
    hypervisor: PropTypes.arrayOf(
      PropTypes.shape({
        date: PropTypes.instanceOf(Date),
        x: PropTypes.number,
        y: PropTypes.number
      })
    ),
    threshold: PropTypes.arrayOf(
      PropTypes.shape({
        date: PropTypes.instanceOf(Date),
        x: PropTypes.number,
        y: PropTypes.number
      })
    )
  }),
  graphGranularity: PropTypes.oneOf([
    GRANULARITY_TYPES.DAILY,
    GRANULARITY_TYPES.WEEKLY,
    GRANULARITY_TYPES.MONTHLY,
    GRANULARITY_TYPES.QUARTERLY
  ]),
  pending: PropTypes.bool,
  productId: PropTypes.string,
  t: PropTypes.func,
  startDate: PropTypes.instanceOf(Date),
  endDate: PropTypes.instanceOf(Date)
};

RhelGraphCard.defaultProps = {
  error: false,
  errorRoute: {},
  errorStatus: null,
  getGraphCapacity: helpers.noop,
  getGraphReports: helpers.noop,
  graphData: {
    sockets: [],
    hypervisor: [],
    threshold: []
  },
  graphGranularity: GRANULARITY_TYPES.DAILY,
  pending: false,
  productId: rhsmApiTypes.RHSM_API_PATH_RHEL_ID_TYPES.RHEL,
  t: helpers.noopTranslate,
  startDate: dateHelpers.defaultDateTime.startDate,
  endDate: dateHelpers.defaultDateTime.endDate
};

const makeMapStateToProps = () => {
  const getRhelGraphCard = reduxSelectors.graphCard.makeRhelGraphCard();

  return (state, props) => ({
    ...getRhelGraphCard(state, props)
  });
};

const mapDispatchToProps = dispatch => ({
  getGraphCapacity: (id, query) => dispatch(reduxActions.rhsm.getGraphCapacity(id, query)),
  getGraphReports: (id, query) => dispatch(reduxActions.rhsm.getGraphReports(id, query))
});

const ConnectedRhelGraphCard = connectTranslate(makeMapStateToProps, mapDispatchToProps)(RhelGraphCard);

export { ConnectedRhelGraphCard as default, ConnectedRhelGraphCard, RhelGraphCard };
