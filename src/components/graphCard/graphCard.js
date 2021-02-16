import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardTitle, CardHeader, CardActions, CardBody, Title } from '@patternfly/react-core';
import _isEqual from 'lodash/isEqual';
import { connect, reduxActions, reduxSelectors } from '../../redux';
import { helpers, dateHelpers } from '../../common';
import { RHSM_API_QUERY_GRANULARITY_TYPES as GRANULARITY_TYPES, RHSM_API_QUERY_TYPES } from '../../types/rhsmApiTypes';
import { Loader } from '../loader/loader';
import { MinHeight } from '../minHeight/minHeight';
import { GraphCardChart } from './graphCardChart';

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

    if (!isDisabled && graphGranularity && productId) {
      const { startDate, endDate } = dateHelpers.getRangedDateTime(graphGranularity);
      const graphQuery = {
        [RHSM_API_QUERY_TYPES.START_DATE]: startDate.toISOString(),
        [RHSM_API_QUERY_TYPES.END_DATE]: endDate.toISOString(),
        ...query
      };

      getGraphReportsCapacity(productId, graphQuery);
    }
  };

  getQueryGranularity() {
    const { query } = this.props;
    return query?.[RHSM_API_QUERY_TYPES.GRANULARITY];
  }

  /**
   * Render a chart/graph card with chart/graph.
   *
   * @returns {Node}
   */
  render() {
    const { cardTitle, children, error, graphData, isDisabled, pending } = this.props;

    if (isDisabled) {
      return null;
    }

    const graphGranularity = this.getQueryGranularity();

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
            <div className={(error && 'blur') || 'fadein'}>
              {pending && <Loader variant="graph" />}
              {!pending && <GraphCardChart granularity={graphGranularity} graphData={graphData} />}
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
 *     cardTitle: string, filterGraphData: Array, getGraphReportsCapacity: Function,
 *     viewId: string, t: Function, children: Node, graphData: object, isDisabled: boolean}}
 */
GraphCard.propTypes = {
  cardTitle: PropTypes.string,
  children: PropTypes.node,
  error: PropTypes.bool,
  getGraphReportsCapacity: PropTypes.func,
  graphData: PropTypes.object,
  query: PropTypes.shape({
    [RHSM_API_QUERY_TYPES.GRANULARITY]: PropTypes.oneOf([...Object.values(GRANULARITY_TYPES)]).isRequired
  }).isRequired,
  isDisabled: PropTypes.bool,
  pending: PropTypes.bool,
  productId: PropTypes.string.isRequired,
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
  getGraphReportsCapacity: helpers.noop,
  graphData: {},
  isDisabled: helpers.UI_DISABLED_GRAPH,
  pending: false,
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
