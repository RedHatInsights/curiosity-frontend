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
    const { getGraphReportsCapacity, graphGranularity, productId, selectOptionsType } = this.props;

    if (productId) {
      const { selected } = graphCardTypes.getGranularityOptions(selectOptionsType);
      const updatedGranularity = graphGranularity || selected;

      const { startDate, endDate } = dateHelpers.getRangedDateTime(updatedGranularity);
      const query = {
        [rhsmApiTypes.RHSM_API_QUERY_GRANULARITY]: updatedGranularity,
        [rhsmApiTypes.RHSM_API_QUERY_START_DATE]: startDate.toISOString(),
        [rhsmApiTypes.RHSM_API_QUERY_END_DATE]: endDate.toISOString()
      };

      getGraphReportsCapacity(productId, query);
    }
  };

  onSelect = event => {
    const { graphGranularity, viewId } = this.props;
    const { value } = event;

    if (graphGranularity !== value) {
      store.dispatch({
        type: reduxTypes.rhsm.SET_GRAPH_GRANULARITY_RHSM,
        graphGranularity: value,
        viewId
      });
    }
  };

  /**
   * FixMe: custom use of dash over threshold vs updating PF Charts legend threshold symbol
   * @patternfly/react-tokens chart_threshold_stroke_dash_array and chart_threshold_stroke_Width
   */
  renderChart() {
    const { filterGraphData, graphData, graphGranularity, selectOptionsType, t, productShortLabel } = this.props;
    const { selected } = graphCardTypes.getGranularityOptions(selectOptionsType);
    const updatedGranularity = graphGranularity || selected;

    const xAxisTickFormat = ({ item, previousItem, tick }) =>
      graphCardHelpers.xAxisTickFormat({
        tick,
        date: item.date,
        previousDate: previousItem.date,
        granularity: updatedGranularity
      });

    const tooltips = ({ itemsByKey }) =>
      graphCardHelpers.getTooltips({
        itemsByKey,
        granularity: updatedGranularity,
        product: productShortLabel
      });

    const chartAreaProps = {
      xAxisFixLabelOverlap: true,
      xAxisLabelIncrement: graphCardHelpers.getChartXAxisLabelIncrement(updatedGranularity),
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
          legendLabel: t(`curiosity-graph.${key}Label`, { product: productShortLabel }),
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
    const { options } = graphCardTypes.getGranularityOptions(selectOptionsType);

    return (
      <Card className="curiosity-usage-graph fadein">
        <CardHead>
          <h2>{cardTitle}</h2>
          <CardActions>
            <Select
              aria-label={t('curiosity-graph.dropdownPlaceholder')}
              onSelect={this.onSelect}
              options={options}
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
  getGraphReportsCapacity: PropTypes.func,
  graphData: PropTypes.object,
  graphGranularity: PropTypes.oneOf([...Object.values(GRANULARITY_TYPES)]),
  pending: PropTypes.bool,
  productId: PropTypes.string.isRequired,
  selectOptionsType: PropTypes.oneOf(['default']),
  t: PropTypes.func,
  productShortLabel: PropTypes.string,
  viewId: PropTypes.string
};

GraphCard.defaultProps = {
  cardTitle: null,
  error: false,
  filterGraphData: [],
  getGraphReportsCapacity: helpers.noop,
  graphData: {},
  graphGranularity: null,
  pending: false,
  selectOptionsType: 'default',
  t: helpers.noopTranslate,
  productShortLabel: '',
  viewId: 'graphCard'
};

const makeMapStateToProps = () => {
  const getGraphCard = reduxSelectors.graphCard.makeGraphCard();

  return (state, props) => ({
    ...getGraphCard(state, props)
  });
};

const mapDispatchToProps = dispatch => ({
  getGraphReportsCapacity: (id, query) => dispatch(reduxActions.rhsm.getGraphReportsCapacity(id, query))
});

const ConnectedGraphCard = connectTranslate(makeMapStateToProps, mapDispatchToProps)(GraphCard);

export { ConnectedGraphCard as default, ConnectedGraphCard, GraphCard };
