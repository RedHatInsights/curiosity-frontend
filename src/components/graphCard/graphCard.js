import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardTitle, CardHeader, CardActions, CardBody, Title } from '@patternfly/react-core';
import { chart_color_green_300 as chartColorGreenDark } from '@patternfly/react-tokens';
import _isEqual from 'lodash/isEqual';
import { connect, reduxActions, reduxSelectors } from '../../redux';
import { helpers } from '../../common';
import { RHSM_API_QUERY_GRANULARITY_TYPES as GRANULARITY_TYPES, RHSM_API_QUERY_TYPES } from '../../types/rhsmApiTypes';
import { graphCardHelpers } from './graphCardHelpers';
import GraphCardChartTooltip from './graphCardChartTooltip';
import GraphCardChartLegend from './graphCardChartLegend';
import { ChartArea } from '../chartArea/chartArea';
import { Loader } from '../loader/loader';
import { MinHeight } from '../minHeight/minHeight';
import { translate } from '../i18n/i18n';

/**
 * A chart/graph card.
 *
 * @augments React.Component
 * @fires onUpdateGraphData
 */
class GraphCard extends React.Component {
  componentDidMount() {
    this.onUpdateGraphData();
  }

  componentDidUpdate(prevProps) {
    const { productId, query } = this.props;

    if (productId !== prevProps.productId || !_isEqual(query, prevProps.query)) {
      this.onUpdateGraphData();
    }
  }

  /**
   * Call the RHSM APIs, apply filters.
   *
   * @event onUpdateGraphData
   */
  onUpdateGraphData = () => {
    const { getGraphReportsCapacity, isDisabled, productId, query } = this.props;
    const graphGranularity = this.getQueryGranularity();
    const { [RHSM_API_QUERY_TYPES.START_DATE]: startDate, [RHSM_API_QUERY_TYPES.END_DATE]: endDate } = query;

    if (!isDisabled && graphGranularity && startDate && endDate && productId) {
      getGraphReportsCapacity(productId, query);
    }
  };

  getQueryGranularity() {
    const { query } = this.props;
    return query?.[RHSM_API_QUERY_TYPES.GRANULARITY];
  }

  /**
   * FixMe: custom use of dash over threshold vs updating PF Charts legend threshold symbol
   *
   * patternfly/react-tokens chart_threshold_stroke_dash_array and chart_threshold_stroke_Width
   */
  /**
   * Apply props to chart/graph.
   *
   * @returns {Node}
   */
  renderChart() {
    const { filterGraphData, graphData, productLabel, query, viewId } = this.props;
    const graphGranularity = this.getQueryGranularity();

    const xAxisTickFormat = ({ item, previousItem, tick }) =>
      graphCardHelpers.xAxisTickFormat({
        tick,
        date: item.date,
        previousDate: previousItem.date,
        granularity: graphGranularity
      });

    const chartAreaProps = {
      xAxisFixLabelOverlap: true,
      xAxisLabelIncrement: graphCardHelpers.getChartXAxisLabelIncrement(graphGranularity),
      xAxisTickFormat,
      yAxisTickFormat: graphCardHelpers.yAxisTickFormat
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
          strokeWidth: 2,
          isStacked: !/^threshold/.test(key),
          isThreshold: /^threshold/.test(key)
        };

        if (/^threshold/.test(key)) {
          tempFiltered.animate = {
            duration: 100,
            onLoad: { duration: 100 }
          };
          tempFiltered.stroke = chartColorGreenDark.value;
          tempFiltered.strokeDasharray = '4,3';
          tempFiltered.strokeWidth = 3;
        }

        return tempFiltered;
      };

      if (filterGraphData.length) {
        return filterGraphData.map(value => Object.assign(filtered(value.id), value));
      }

      return Object.keys(data).map(key => filtered(key));
    };

    return (
      <ChartArea
        key={`chart_${JSON.stringify(query)}`}
        {...chartAreaProps}
        dataSets={filteredGraphData(graphData)}
        chartLegend={({ chart, datum }) => (
          <GraphCardChartLegend chart={chart} datum={datum} productLabel={productLabel} viewId={viewId} />
        )}
        chartTooltip={({ datum }) => (
          <GraphCardChartTooltip datum={datum} granularity={graphGranularity} productLabel={productLabel} />
        )}
      />
    );
  }

  /**
   * ToDo: Evaluate applying a minHeight attr to the MinHeight component graphCard setup
   * Appears there may be a minor page shift when compared to the prior hard-set min-height
   * of 410px
   */
  /**
   * Render a chart/graph card with chart/graph.
   *
   * @returns {Node}
   */
  render() {
    const { cardTitle, children, error, isDisabled, pending } = this.props;

    if (isDisabled) {
      return null;
    }

    return (
      <Card className="curiosity-usage-graph">
        <MinHeight key="headerMinHeight">
          <CardHeader>
            <CardTitle>
              <Title headingLevel="h2" size="lg">
                {cardTitle}
              </Title>
            </CardTitle>
            <CardActions className={(error && 'blur') || ''}>{children}</CardActions>
          </CardHeader>
        </MinHeight>
        <MinHeight key="bodyMinHeight">
          <CardBody>
            <div className={(error && 'blur') || (pending && 'fadein') || ''}>
              {pending && <Loader variant="graph" />}
              {!pending && this.renderChart()}
            </div>
          </CardBody>
        </MinHeight>
      </Card>
    );
  }
}

/**
 * Prop types.
 *
 * @type {{productLabel: string, productId: string, pending: boolean, error: boolean, query: object,
 *     cardTitle: Node, filterGraphData: Array, getGraphReportsCapacity: Function,
 *     viewId: string, t: Function, children: Node, graphData: object, isDisabled: boolean}}
 */
GraphCard.propTypes = {
  cardTitle: PropTypes.node,
  children: PropTypes.node,
  error: PropTypes.bool,
  filterGraphData: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      fill: PropTypes.string,
      stroke: PropTypes.string
    })
  ),
  getGraphReportsCapacity: PropTypes.func,
  graphData: PropTypes.object,
  query: PropTypes.shape({
    [RHSM_API_QUERY_TYPES.GRANULARITY]: PropTypes.oneOf([...Object.values(GRANULARITY_TYPES)]).isRequired,
    [RHSM_API_QUERY_TYPES.START_DATE]: PropTypes.string.isRequired,
    [RHSM_API_QUERY_TYPES.END_DATE]: PropTypes.string.isRequired
  }).isRequired,
  isDisabled: PropTypes.bool,
  pending: PropTypes.bool,
  productId: PropTypes.string.isRequired,
  productLabel: PropTypes.string,
  t: PropTypes.func,
  viewId: PropTypes.string
};

/**
 * Default props.
 *
 * @type {{getGraphReportsCapacity: Function, productLabel: string, viewId: string, t: translate,
 *     children: Node, pending: boolean, graphData: object, isDisabled: boolean, error: boolean,
 *     cardTitle: string, filterGraphData: Array}}
 */
GraphCard.defaultProps = {
  cardTitle: null,
  children: null,
  error: false,
  filterGraphData: [],
  getGraphReportsCapacity: helpers.noop,
  graphData: {},
  isDisabled: helpers.UI_DISABLED_GRAPH,
  pending: false,
  productLabel: '',
  t: translate,
  viewId: 'graphCard'
};

/**
 * Apply actions to props.
 *
 * @param {Function} dispatch
 * @returns {object}
 */
const mapDispatchToProps = dispatch => ({
  getGraphReportsCapacity: (id, query) => dispatch(reduxActions.rhsm.getGraphReportsCapacity(id, query))
});

/**
 * Create a selector from applied state, props.
 *
 * @type {Function}
 */
const makeMapStateToProps = reduxSelectors.graphCard.makeGraphCard();

const ConnectedGraphCard = connect(makeMapStateToProps, mapDispatchToProps)(GraphCard);

export { ConnectedGraphCard as default, ConnectedGraphCard, GraphCard };
