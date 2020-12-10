import { rhsmApiTypes } from '../../types/rhsmApiTypes';
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

  const updatedGraphTallyQuery = reduxHelpers.setApiQuery(query, rhsmApiTypes.RHSM_API_QUERY_SET_REPORT_CAPACITY_TYPES);
  const updatedInventoryGuestsQuery = reduxHelpers.setApiQuery(
    query,
    rhsmApiTypes.RHSM_API_QUERY_SET_INVENTORY_GUESTS_TYPES
  );
  const updatedInventoryHostsQuery = reduxHelpers.setApiQuery(query, rhsmApiTypes.RHSM_API_QUERY_SET_INVENTORY_TYPES);
  const updatedInventorySubscriptionsQuery = reduxHelpers.setApiQuery(
    query,
    rhsmApiTypes.RHSM_API_QUERY_SET_INVENTORY_TYPES
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
