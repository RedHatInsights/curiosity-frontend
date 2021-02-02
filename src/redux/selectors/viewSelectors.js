import { createSelectorCreator, defaultMemoize } from 'reselect';
import _isEqual from 'lodash/isEqual';

/**
 * Create a custom "are objects equal" selector.
 *
 * @private
 * @type {Function}}
 */
const createDeepEqualSelector = createSelectorCreator(defaultMemoize, _isEqual);

/**
 * ToDo: as part of future potential upgrades consider moving reduxHelpers.setApiQuery into statePropsFilter
 * The side effect is multiple queries being dumped into the views, meaning more "configuration to handle".
 * Leaving it as a single query passed from this selector and handling the "setApiQuery" in "redux/common/apiQueries"
 * is a first step.
 * i.e.
 * queries: {
 *    query: ...,
 *    graph: reduxHelpers.setApiQuery(..., RHSM_API_QUERY_SET_REPORT_CAPACITY_TYPES),
 *    inventory: reduxHelpers.setApiQuery(..., RHSM_API_QUERY_SET_INVENTORY_TYPES)
 * }
 */
/**
 * Return a combined state, props object.
 *
 * @private
 * @param {object} state
 * @param {object} props
 * @param {object} defaultProps
 * @returns {object}
 */
const statePropsFilter = (state = {}, props, defaultProps = {}) => ({
  query: {
    ...defaultProps.query,
    ...state.view?.query?.[defaultProps.viewId]
  },
  graphTallyQuery: {
    ...defaultProps.graphTallyQuery,
    ...state.view?.graphTallyQuery?.[defaultProps.viewId]
  },
  inventoryGuestsQuery: {
    ...defaultProps.inventoryGuestsQuery,
    ...state.view?.inventoryGuestsQuery?.[defaultProps.viewId]
  },
  inventoryHostsQuery: {
    ...defaultProps.inventoryHostsQuery,
    ...state.view?.inventoryHostsQuery?.[defaultProps.viewId]
  },
  inventorySubscriptionsQuery: {
    ...defaultProps.inventorySubscriptionsQuery,
    ...state.view?.inventorySubscriptionsQuery?.[defaultProps.viewId]
  }
});

/**
 * Create selector, transform combined state, props into a consumable API param/query object.
 *
 * @type {{query: object, graphTallyQuery: object, inventoryGuestsQuery: object, inventoryHostsQuery: object,
 *     inventorySubscriptionsQuery: object}}
 */
const selector = createDeepEqualSelector([statePropsFilter], view => ({
  query: { ...view.query },
  graphTallyQuery: { ...view.graphTallyQuery },
  inventoryGuestsQuery: { ...view.inventoryGuestsQuery },
  inventoryHostsQuery: { ...view.inventoryHostsQuery },
  inventorySubscriptionsQuery: { ...view.inventorySubscriptionsQuery }
}));

/**
 * Expose selector instance. For scenarios where a selector is reused across component instances.
 *
 * @param {object} defaultProps
 * @returns {{query: object, graphTallyQuery: object, inventoryGuestsQuery: object, inventoryHostsQuery: object,
 *     inventorySubscriptionsQuery: object}}
 */
const makeSelector = defaultProps => (state, props) => ({
  ...selector(state, props, defaultProps)
});

const viewSelectors = {
  view: selector,
  makeView: makeSelector
};

export { viewSelectors as default, viewSelectors, selector, makeSelector };
