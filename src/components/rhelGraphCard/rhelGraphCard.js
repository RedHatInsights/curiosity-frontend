import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardHead, CardActions, CardBody } from '@patternfly/react-core';
import { ChartThemeColor } from '@patternfly/react-charts';
import {
  chart_color_blue_100 as chartColorBlue100,
  chart_color_blue_400 as chartColorBlue400,
  chart_color_cyan_100 as chartColorCyan100,
  chart_color_cyan_400 as chartColorCyan400
} from '@patternfly/react-tokens';
import { Skeleton, SkeletonSize } from '@redhat-cloud-services/frontend-components';
import { Select } from '../select/select';
import { connectTranslate, reduxActions, reduxSelectors, reduxTypes, store } from '../../redux';
import { helpers, dateHelpers } from '../../common';
import { rhelApiTypes, RHSM_API_QUERY_GRANULARITY_TYPES as GRANULARITY_TYPES } from '../../types/rhelApiTypes';
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
    const { getGraphCapacityRhel, getGraphReportsRhel, graphGranularity, startDate, endDate } = this.props;
    const submit = {
      [rhelApiTypes.RHSM_API_QUERY_GRANULARITY]: graphGranularity,
      [rhelApiTypes.RHSM_API_QUERY_START_DATE]: startDate.toISOString(),
      [rhelApiTypes.RHSM_API_QUERY_END_DATE]: endDate.toISOString()
    };

    getGraphCapacityRhel(submit);
    getGraphReportsRhel(submit);
  };

  onSelect = event => {
    const { graphGranularity } = this.props;
    const { value } = event;

    if (graphGranularity !== value) {
      store.dispatch({
        type: reduxTypes.rhel.SET_GRAPH_RHEL_GRANULARITY,
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
            fill: chartColorBlue100.value,
            stroke: chartColorBlue400.value,
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
            fill: chartColorCyan100.value,
            stroke: chartColorCyan400.value,
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
            themeColor: ChartThemeColor.green,
            legendLabel: t('curiosity-graph.rhelLegendThresholdLabel'),
            isThreshold: true
          }
        ]}
      />
    );
  }

  // ToDo: combine "curiosity-skeleton-container" into a single class w/ --loading and BEM style
  render() {
    const { graphGranularity, pending, t } = this.props;
    const getDateMenuOptions = rhelGraphCardTypes.getDateMenuOptions();

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
  getGraphCapacityRhel: PropTypes.func,
  getGraphReportsRhel: PropTypes.func,
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
  t: PropTypes.func,
  startDate: PropTypes.instanceOf(Date),
  endDate: PropTypes.instanceOf(Date)
};

RhelGraphCard.defaultProps = {
  getGraphCapacityRhel: helpers.noop,
  getGraphReportsRhel: helpers.noop,
  graphData: {
    sockets: [],
    hypervisor: [],
    threshold: []
  },
  graphGranularity: GRANULARITY_TYPES.DAILY,
  pending: false,
  t: helpers.noopTranslate,
  startDate: dateHelpers.defaultDateTime.startDate,
  endDate: dateHelpers.defaultDateTime.endDate
};

const makeMapStateToProps = () => {
  const getRhelGraphCard = reduxSelectors.graphCard.makeRhelGraphCard();

  return (state, props) => ({
    ...state.rhelGraph.component,
    ...getRhelGraphCard(state, props)
  });
};

const mapDispatchToProps = dispatch => ({
  getGraphCapacityRhel: query => dispatch(reduxActions.rhel.getGraphCapacityRhel(query)),
  getGraphReportsRhel: query => dispatch(reduxActions.rhel.getGraphReportsRhel(query))
});

const ConnectedRhelGraphCard = connectTranslate(makeMapStateToProps, mapDispatchToProps)(RhelGraphCard);

export { ConnectedRhelGraphCard as default, ConnectedRhelGraphCard, RhelGraphCard };
