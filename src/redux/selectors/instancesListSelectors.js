import { createSelector } from 'reselect';
import { apiQueries } from '../common';
import { selector as userSession } from './userSelectors';

/**
 * Return a combined state, props object.
 *
 * @private
 * @param {object} state
 * @param {object} props
 * @returns {object}
 */
const statePropsFilter = (state, props = {}) => ({
  ...state.inventory?.instancesInventory?.[props.productId]
});

/**
 * Return a combined query object.
 *
 * @param {object} state
 * @param {object} props
 * @returns {object}
 */
const queryFilter = (state, props = {}) => {
  const { inventoryHostsQuery: query } = apiQueries.parseRhsmQuery(
    {
      ...props.query,
      ...state.view?.query?.[props.productId],
      ...state.view?.query?.[props.viewId]
    },
    {
      inventoryHostsQuery: {
        ...state.view?.inventoryHostsQuery?.[props.productId],
        ...state.view?.inventoryHostsQuery?.[props.viewId]
      }
    }
  );

  return query;
};

/**
 * Create selector, transform combined state, props into a consumable object.
 *
 * @type {{query: object}}
 */
const selector = createSelector([statePropsFilter, queryFilter], (response, query = {}) => ({
  ...response,
  ...response?.data,
  query
}));

/**
 * Expose selector instance. For scenarios where a selector is reused across component instances.
 *
 * @param {object} defaultProps
 * @returns {{pending: boolean, fulfilled: boolean, graphData: object, error: boolean, session: object,
 *     status: (*|number)}}
 */
const makeSelector = defaultProps => (state, props) => ({
  ...userSession(state, props, defaultProps),
  ...selector(state, props, defaultProps)
});

const instancesListSelectors = {
  instancesList: selector,
  makeInstancesList: makeSelector
};

export { instancesListSelectors as default, instancesListSelectors, selector, makeSelector };
