import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardTitle, CardHeader, CardActions, CardBody, Title } from '@patternfly/react-core';
import { connect, reduxActions, reduxSelectors } from '../../redux';
import { helpers, dateHelpers, contextHelpers } from '../../common';
import { RHSM_API_QUERY_TYPES } from '../../types/rhsmApiTypes';
import { Loader } from '../loader/loader';
import { MinHeight } from '../minHeight/minHeight';
import { GraphCardChart } from './graphCardChart';
import { useRouteDetail } from '../router/routerContext';
import { useGraphTallyQuery } from '../productView/productContext';

/**
 * A chart/graph card.
 *
 * @param {object} props
 * @param {string} props.cardTitle
 * @param {Node} props.children
 * @param {boolean} props.error
 * @param {Function} props.getGraphReportsCapacity
 * @param {object} props.graphData
 * @param {boolean} props.isDisabled
 * @param {boolean} props.pending
 * @returns {Node}
 */
const GraphCard = ({ cardTitle, children, error, getGraphReportsCapacity, graphData, isDisabled, pending } = {}) => {
  const { pathParameter: productId } = useRouteDetail();
  const updatedQuery = useGraphTallyQuery();
  const granularity = updatedQuery?.[RHSM_API_QUERY_TYPES.GRANULARITY];

  /**
   * Call the API, apply query.
   */
  contextHelpers.useDeepCompareEffect(() => {
    if (!isDisabled && granularity && productId) {
      const { startDate, endDate } = dateHelpers.getRangedDateTime(granularity);
      const graphQuery = {
        [RHSM_API_QUERY_TYPES.START_DATE]: startDate.toISOString(),
        [RHSM_API_QUERY_TYPES.END_DATE]: endDate.toISOString(),
        ...updatedQuery
      };

      getGraphReportsCapacity(productId, graphQuery);
    }
  }, [getGraphReportsCapacity, isDisabled, granularity, productId, updatedQuery]);

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
          <div className={(error && 'blur') || 'fadein'}>
            {pending && <Loader variant="graph" />}
            {!pending && <GraphCardChart granularity={granularity} graphData={graphData} />}
          </div>
        </CardBody>
      </MinHeight>
    </Card>
  );
};

/**
 * Prop types.
 *
 * @type {{getGraphReportsCapacity: Function, children: Node, pending: boolean, graphData: object,
 *     isDisabled: boolean, error: boolean, cardTitle: Node}}
 */
GraphCard.propTypes = {
  cardTitle: PropTypes.node,
  children: PropTypes.node,
  error: PropTypes.bool,
  getGraphReportsCapacity: PropTypes.func,
  graphData: PropTypes.object,
  isDisabled: PropTypes.bool,
  pending: PropTypes.bool
};

/**
 * Default props.
 *
 * @type {{getGraphReportsCapacity: Function, children: Node, pending: boolean, graphData: object,
 *     isDisabled: boolean, error: boolean, cardTitle: Node}}
 */
GraphCard.defaultProps = {
  cardTitle: null,
  children: null,
  error: false,
  getGraphReportsCapacity: helpers.noop,
  graphData: {},
  isDisabled: helpers.UI_DISABLED_GRAPH,
  pending: false
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
