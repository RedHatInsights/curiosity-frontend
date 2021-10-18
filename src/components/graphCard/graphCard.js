import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardTitle, CardHeader, CardActions, CardBody, Title } from '@patternfly/react-core';
import { useShallowCompareEffect } from 'react-use';
import { connect, reduxActions, reduxSelectors } from '../../redux';
import { useProduct, useProductGraphConfig, useProductGraphTallyQuery } from '../productView/productViewContext';
import { helpers } from '../../common';
import { RHSM_API_QUERY_TYPES } from '../../types/rhsmApiTypes';
import { Loader } from '../loader/loader';
import { MinHeight } from '../minHeight/minHeight';
import { GraphCardChart } from './graphCardChart';

/**
 * A chart/graph card.
 *
 * @param {object} props
 * @param {Node} props.cardTitle
 * @param {Node} props.children
 * @param {boolean} props.error
 * @param {Function} props.getGraphReportsCapacity
 * @param {object} props.graphData
 * @param {object} props.meta
 * @param {boolean} props.isDisabled
 * @param {boolean} props.pending
 * @param {Function} props.useProduct
 * @param {Function} props.useProductGraphConfig
 * @param {Function} props.useProductGraphTallyQuery
 * @returns {Node}
 */
const GraphCard = ({
  cardTitle,
  children,
  error,
  getGraphReportsCapacity,
  graphData,
  meta,
  isDisabled,
  pending,
  useProduct: useAliasProduct,
  useProductGraphConfig: useAliasProductGraphConfig,
  useProductGraphTallyQuery: useAliasProductGraphTallyQuery
}) => {
  const { productId } = useAliasProduct();
  const { settings } = useAliasProductGraphConfig();
  const query = useAliasProductGraphTallyQuery();

  useShallowCompareEffect(() => {
    const {
      [RHSM_API_QUERY_TYPES.START_DATE]: startDate,
      [RHSM_API_QUERY_TYPES.END_DATE]: endDate,
      [RHSM_API_QUERY_TYPES.GRANULARITY]: granularity
    } = query;

    if (!isDisabled && granularity && startDate && endDate && productId) {
      getGraphReportsCapacity(productId, query);
    }
  }, [getGraphReportsCapacity, isDisabled, productId, query]);

  if (isDisabled) {
    return null;
  }

  let actionDisplay = null;

  if (typeof settings?.actionDisplay === 'function') {
    actionDisplay = settings.actionDisplay({ data: { ...graphData }, meta: { ...meta } });
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
          <CardActions className={(error && 'blur') || ''}>
            <React.Fragment key="actionDisplay">{actionDisplay}</React.Fragment>
            {children}
          </CardActions>
        </CardHeader>
      </MinHeight>
      <MinHeight key="bodyMinHeight">
        <CardBody>
          <div className={(error && 'blur') || (pending && 'fadein') || ''}>
            {pending && <Loader variant="graph" />}
            {!pending && <GraphCardChart graphData={graphData} />}
          </div>
        </CardBody>
      </MinHeight>
    </Card>
  );
};

/**
 * Prop types.
 *
 * @type {{getGraphReportsCapacity: Function, useProduct: Function, useProductGraphTallyQuery: Function,
 *     useProductGraphConfig: Function, children: Node, meta: object, pending: boolean, graphData: object,
 *     isDisabled: boolean, error: boolean, cardTitle: Node}}
 */
GraphCard.propTypes = {
  cardTitle: PropTypes.node,
  children: PropTypes.node,
  error: PropTypes.bool,
  getGraphReportsCapacity: PropTypes.func,
  graphData: PropTypes.object,
  isDisabled: PropTypes.bool,
  meta: PropTypes.object,
  pending: PropTypes.bool,
  useProduct: PropTypes.func,
  useProductGraphConfig: PropTypes.func,
  useProductGraphTallyQuery: PropTypes.func
};

/**
 * Default props.
 *
 * @type {{getGraphReportsCapacity: Function, useProduct: Function, useProductGraphTallyQuery: Function,
 *     useProductGraphConfig: Function, children: Node, meta: object, pending: boolean, graphData: object,
 *     isDisabled: boolean, error: boolean, cardTitle: Node}}
 */
GraphCard.defaultProps = {
  cardTitle: null,
  children: null,
  error: false,
  getGraphReportsCapacity: helpers.noop,
  graphData: {},
  isDisabled: helpers.UI_DISABLED_GRAPH,
  meta: {},
  pending: false,
  useProduct,
  useProductGraphConfig,
  useProductGraphTallyQuery
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
