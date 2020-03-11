import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardHead, CardActions, CardBody } from '@patternfly/react-core';
import { chart_color_green_300 as chartColorGreenDark } from '@patternfly/react-tokens';
import { Skeleton, SkeletonSize } from '@redhat-cloud-services/frontend-components/components/Skeleton';
import _isEqual from 'lodash/isEqual';
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
    const { graphQuery, productId } = this.props;

    if (productId !== prevProps.productId || !_isEqual(graphQuery, prevProps.graphQuery)) {
      this.onUpdateGraphData();
    }
  }

  onUpdateGraphData = () => {
    const { getGraphReportsCapacity, graphQuery, productId } = this.props;
    const graphGranularity = graphQuery && graphQuery[rhsmApiTypes.RHSM_API_QUERY_GRANULARITY];

    if (graphGranularity && productId) {
      const { startDate, endDate } = dateHelpers.getRangedDateTime(graphGranularity);
      const query = {
        [rhsmApiTypes.RHSM_API_QUERY_START_DATE]: startDate.toISOString(),
        [rhsmApiTypes.RHSM_API_QUERY_END_DATE]: endDate.toISOString(),
        ...graphQuery
      };

      getGraphReportsCapacity(productId, query);
    }
  };

  onSelect = (event = {}) => {
    const { value } = event;

    store.dispatch({
      type: reduxTypes.rhsm.SET_GRAPH_GRANULARITY_RHSM,
      granularity: value
    });
  };

  /**
   * FixMe: custom use of dash over threshold vs updating PF Charts legend threshold symbol
   * @patternfly/react-tokens chart_threshold_stroke_dash_array and chart_threshold_stroke_Width
   */
  renderChart() {
    const { filterGraphData, graphData, graphQuery, selectOptionsType, t, productShortLabel } = this.props;
    const graphGranularity = graphQuery && graphQuery[rhsmApiTypes.RHSM_API_QUERY_GRANULARITY];
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
          isStacked: !/^threshold/.test(key),
          isThreshold: /^threshold/.test(key)
        };

        if (/^threshold/.test(key)) {
          tempFiltered.animate = {
            duration: 100,
            onLoad: { duration: 100 }
          };
          tempFiltered.legendSymbolType = 'dash';
          tempFiltered.stroke = chartColorGreenDark.value;
          tempFiltered.strokeDasharray = '4,3';
          tempFiltered.strokeWidth = 2.5;
          tempFiltered.legendLabel = t(`curiosity-graph.thresholdLabel`);
        } else {
          tempFiltered.legendLabel = t(`curiosity-graph.${key}Label`, { product: productShortLabel });
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

  render() {
    const { cardTitle, children, error, graphQuery, selectOptionsType, pending, t } = this.props;
    const { options } = graphCardTypes.getGranularityOptions(selectOptionsType);
    const graphGranularity = graphQuery && graphQuery[rhsmApiTypes.RHSM_API_QUERY_GRANULARITY];

    return (
      <Card className="curiosity-usage-graph fadein">
        <CardHead>
          <h2>{cardTitle}</h2>
          <CardActions>
            {children}
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
  children: PropTypes.node,
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
  graphQuery: PropTypes.shape({
    [rhsmApiTypes.RHSM_API_QUERY_GRANULARITY]: PropTypes.oneOf([...Object.values(GRANULARITY_TYPES)]).isRequired
  }).isRequired,
  pending: PropTypes.bool,
  productId: PropTypes.string.isRequired,
  selectOptionsType: PropTypes.oneOf(['default']),
  t: PropTypes.func,
  productShortLabel: PropTypes.string,
  viewId: PropTypes.string
};

GraphCard.defaultProps = {
  cardTitle: null,
  children: null,
  error: false,
  filterGraphData: [],
  getGraphReportsCapacity: helpers.noop,
  graphData: {},
  pending: false,
  selectOptionsType: 'default',
  t: helpers.noopTranslate,
  productShortLabel: '',
  viewId: 'graphCard'
};

const makeMapStateToProps = reduxSelectors.graphCard.makeGraphCard();

const mapDispatchToProps = dispatch => ({
  getGraphReportsCapacity: (id, query) => dispatch(reduxActions.rhsm.getGraphReportsCapacity(id, query))
});

const ConnectedGraphCard = connectTranslate(makeMapStateToProps, mapDispatchToProps)(GraphCard);

export { ConnectedGraphCard as default, ConnectedGraphCard, GraphCard };
