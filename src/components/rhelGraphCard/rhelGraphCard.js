import React from 'react';
import PropTypes from 'prop-types';
import numeral from 'numeral';
import { Card, CardHead, CardActions, CardBody } from '@patternfly/react-core';
import { Skeleton, SkeletonSize } from '@redhat-cloud-services/frontend-components';
import { Select } from '../select/select';
import { connectTranslate, reduxActions, reduxTypes, store } from '../../redux';
import { helpers, dateHelpers, graphHelpers } from '../../common';
import { rhelApiTypes } from '../../types/rhelApiTypes';
import { rhelGraphCardTypes } from './rhelGraphCardTypes';
import ChartArea from '../chartArea/chartArea';

const GRANULARITY_TYPES = rhelApiTypes.RHSM_API_QUERY_GRANULARITY_TYPES;

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
    const { getGraphReports, graphGranularity, startDate, endDate } = this.props;

    getGraphReports({
      [rhelApiTypes.RHSM_API_QUERY_GRANULARITY]: graphGranularity,
      [rhelApiTypes.RHSM_API_QUERY_START_DATE]: startDate.toISOString(),
      [rhelApiTypes.RHSM_API_QUERY_END_DATE]: endDate.toISOString()
    });
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

  // ToDo: evaluate show error toast on chart error
  renderChart() {
    const { graphData, graphGranularity, startDate, endDate, t } = this.props;
    const { chartXAxisLabelIncrement, chartData, chartDataThresholds } = graphHelpers.convertChartData({
      data: graphData.usage,
      dataFacet: rhelApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_SOCKETS,
      dataThresholdFacet: rhelApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA_SOCKETS_THRESHOLD,
      tooltipLabel: t('curiosity-graph.tooltipSockets'),
      tooltipThresholdLabel: t('curiosity-graph.tooltipSocketsThreshold'),
      startDate,
      endDate,
      granularity: graphGranularity
    });

    return (
      <ChartArea
        xAxisFixLabelOverlap
        xAxisLabelIncrement={chartXAxisLabelIncrement}
        yAxisTickFormat={({ tick }) => numeral(tick).format('0a')}
        dataSets={[
          {
            data: chartData,
            thresholds: chartDataThresholds,
            legendThreshold: { name: t('curiosity-graph.legendSocketsThresholdLabel') },
            legendData: { name: t('curiosity-graph.legendSocketsLabel') }
          }
        ]}
      />
    );
  }

  // ToDo: combine "curiosity-skeleton-container" into a single class w/ --loading and BEM style
  render() {
    const { error, fulfilled, graphGranularity, pending, t } = this.props;
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
            {!pending && (fulfilled || error) && this.renderChart()}
          </div>
        </CardBody>
      </Card>
    );
  }
}

RhelGraphCard.propTypes = {
  error: PropTypes.bool,
  fulfilled: PropTypes.bool,
  getGraphReports: PropTypes.func,
  graphData: PropTypes.shape({
    usage: PropTypes.array
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
  error: false,
  fulfilled: false,
  getGraphReports: helpers.noop,
  graphData: {
    usage: []
  },
  graphGranularity: GRANULARITY_TYPES.DAILY,
  pending: false,
  t: helpers.noopTranslate,
  startDate: dateHelpers.defaultDateTime.startDate,
  endDate: dateHelpers.defaultDateTime.endDate
};

const mapStateToProps = state => ({
  ...state.rhelGraph
});

const mapDispatchToProps = dispatch => ({
  getGraphReports: query => dispatch(reduxActions.rhel.getGraphReports(query))
});

const ConnectedRhelGraphCard = connectTranslate(mapStateToProps, mapDispatchToProps)(RhelGraphCard);

export { ConnectedRhelGraphCard as default, ConnectedRhelGraphCard, RhelGraphCard };
