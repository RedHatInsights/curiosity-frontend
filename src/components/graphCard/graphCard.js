import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardHead, CardActions, CardBody } from '@patternfly/react-core';
import { chart_color_green_300 as chartColorGreenDark } from '@patternfly/react-tokens';
import { Skeleton, SkeletonSize } from '@redhat-cloud-services/frontend-components';
import { Select } from '../select/select';
import { connectTranslate, reduxActions, reduxSelectors, reduxTypes, store } from '../../redux';
import { helpers, dateHelpers } from '../../common';
import { rhsmApiTypes, RHSM_API_QUERY_GRANULARITY_TYPES as GRANULARITY_TYPES } from '../../types/rhsmApiTypes';
import { graphCardHelpers } from './graphCardHelpers';
import { graphCardTypes } from './graphCardTypes';
import ChartArea from '../chartArea/chartArea';

class GraphCard extends React.Component {
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

  /**
   * FixMe: custom use of dash over threshold vs updating PF Charts legend threshold symbol
   * @patternfly/react-tokens chart_threshold_stroke_dash_array and chart_threshold_stroke_Width
   */
  renderChart() {
    const { filterGraphData, graphData, graphGranularity, t, translateProduct } = this.props;

    const xAxisTickFormat = ({ item, previousItem, tick }) =>
      graphCardHelpers.xAxisTickFormat({
        tick,
        date: item.date,
        previousDate: previousItem.date,
        granularity: graphGranularity
      });

    const tooltips = ({ itemsByKey }) =>
      graphCardHelpers.getTooltips({
        itemsByKey,
        granularity: graphGranularity,
        product: translateProduct
      });

    const chartAreaProps = {
      xAxisFixLabelOverlap: true,
      xAxisLabelIncrement: graphCardHelpers.getChartXAxisLabelIncrement(graphGranularity),
      xAxisTickFormat,
      yAxisTickFormat: graphCardHelpers.yAxisTickFormat,
      tooltips
    };

    const filteredGraphData = data => {
      const filtered = key => {
        const tempFiltered = {
          data: data[key],
          id: key,
          animate: {
            duration: 250,
            onLoad: { duration: 250 }
          },
          legendLabel: t(`curiosity-graph.${key}Label`, { product: translateProduct }),
          isStacked: key !== 'threshold',
          isThreshold: key === 'threshold'
        };

        if (key === 'threshold') {
          tempFiltered.animate = {
            duration: 100,
            onLoad: { duration: 100 }
          };
          tempFiltered.legendSymbolType = 'dash';
          tempFiltered.stroke = chartColorGreenDark.value;
          tempFiltered.strokeDasharray = '4,3';
          tempFiltered.strokeWidth = 2.5;
        }

        return tempFiltered;
      };

      if (filterGraphData.length) {
        return filterGraphData.map(value => Object.assign(filtered(value.id), value));
      }

      return Object.keys(data).map(key => filtered(key));
    };
    return <ChartArea key={helpers.generateId()} {...chartAreaProps} dataSets={filteredGraphData(graphData)} />;
  }

  // ToDo: combine "curiosity-skeleton-container" into a single class w/ --loading and BEM style
  render() {
    const { cardTitle, error, graphGranularity, selectOptionsType, pending, t } = this.props;
    const getGranularityOptions = graphCardTypes.getGranularityOptions(selectOptionsType);

    return (
      <Card className="curiosity-usage-graph fadein">
        <CardHead>
          <h2>{cardTitle}</h2>
          <CardActions>
            <Select
              aria-label={t('curiosity-graph.dropdownPlaceholder')}
              onSelect={this.onSelect}
              options={getGranularityOptions}
              selectedOptions={graphGranularity}
              placeholder={t('curiosity-graph.dropdownPlaceholder')}
            />
          </CardActions>
        </CardHead>
        <CardBody>
          <div className={`curiosity-skeleton-container ${(error && 'blur') || ''}`}>
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

GraphCard.propTypes = {
  cardTitle: PropTypes.string,
  error: PropTypes.bool,
  filterGraphData: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      fill: PropTypes.string,
      stroke: PropTypes.string
    })
  ),
  getGraphCapacity: PropTypes.func,
  getGraphReports: PropTypes.func,
  graphData: PropTypes.object,
  graphGranularity: PropTypes.oneOf([
    GRANULARITY_TYPES.DAILY,
    GRANULARITY_TYPES.WEEKLY,
    GRANULARITY_TYPES.MONTHLY,
    GRANULARITY_TYPES.QUARTERLY
  ]),
  pending: PropTypes.bool,
  productId: PropTypes.string,
  selectOptionsType: PropTypes.oneOf(['default']),
  t: PropTypes.func,
  translateProduct: PropTypes.string,
  startDate: PropTypes.instanceOf(Date),
  endDate: PropTypes.instanceOf(Date)
};

GraphCard.defaultProps = {
  cardTitle: null,
  error: false,
  filterGraphData: [],
  getGraphCapacity: helpers.noop,
  getGraphReports: helpers.noop,
  graphData: {},
  graphGranularity: GRANULARITY_TYPES.DAILY,
  pending: false,
  productId: rhsmApiTypes.RHSM_API_PATH_ID_TYPES.RHEL,
  selectOptionsType: 'default',
  t: helpers.noopTranslate,
  translateProduct: 'RHEL',
  startDate: dateHelpers.defaultDateTime.startDate,
  endDate: dateHelpers.defaultDateTime.endDate
};

const makeMapStateToProps = () => {
  const getGraphCard = reduxSelectors.graphCard.makeGraphCard();

  return (state, props) => ({
    ...getGraphCard(state, props)
  });
};

const mapDispatchToProps = dispatch => ({
  getGraphCapacity: (id, query) => dispatch(reduxActions.rhsm.getGraphCapacity(id, query)),
  getGraphReports: (id, query) => dispatch(reduxActions.rhsm.getGraphReports(id, query))
});

const ConnectedGraphCard = connectTranslate(makeMapStateToProps, mapDispatchToProps)(GraphCard);

export { ConnectedGraphCard as default, ConnectedGraphCard, GraphCard };
