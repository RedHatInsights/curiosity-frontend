import { rhsmConstants } from '../../services/rhsm/rhsmConstants';
import { reduxHelpers } from './reduxHelpers';

/**
 * Parse a query object against a schema for specific RHSM endpoints.
 *
 * @param {object} query
 * @param {object} queries
 * @returns {{graphTallyQuery: object, inventoryHostsQuery: object, inventorySubscriptionsQuery: object,
 *     query: object, inventoryGuestsQuery: object, toolbarQuery: object}}
 */
const parseRhsmQuery = (query = {}, queries = {}) => {
  const { graphTallyQuery, inventoryGuestsQuery, inventoryHostsQuery, inventorySubscriptionsQuery } = queries;

  const updatedGraphTallyQuery = reduxHelpers.setApiQuery(query, rhsmConstants.RHSM_API_QUERY_SET_TALLY_CAPACITY_TYPES);
  const updatedInventoryGuestsQuery = reduxHelpers.setApiQuery(query, rhsmConstants.RHSM_API_QUERY_SET_INVENTORY_TYPES);
  const updatedInventoryHostsQuery = reduxHelpers.setApiQuery(query, rhsmConstants.RHSM_API_QUERY_SET_INVENTORY_TYPES);
  const updatedInventorySubscriptionsQuery = reduxHelpers.setApiQuery(
    query,
    rhsmConstants.RHSM_API_QUERY_SET_INVENTORY_TYPES
  );

  return {
    query,
    graphTallyQuery: { ...updatedGraphTallyQuery, ...graphTallyQuery },
    inventoryGuestsQuery: { ...updatedInventoryGuestsQuery, ...inventoryGuestsQuery },
    inventoryHostsQuery: { ...updatedInventoryHostsQuery, ...inventoryHostsQuery },
    inventorySubscriptionsQuery: { ...updatedInventorySubscriptionsQuery, ...inventorySubscriptionsQuery },
    toolbarQuery: query
  };
};

const apiQueries = {
  parseRhsmQuery
};

export { apiQueries as default, apiQueries };
