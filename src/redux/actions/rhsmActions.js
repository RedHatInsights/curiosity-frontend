import { rhsmTypes } from '../types';
import { rhsmServices } from '../../services/rhsm/rhsmServices';

/**
 * Get a combined RHSM response from reporting and capacity.
 *
 * @param {string} id
 * @param {object} query
 * @param {object} options
 * @param {string} options.cancelId
 * @returns {Function}
 */
const getGraphReportsCapacity =
  (id = null, query = {}, options = {}) =>
  dispatch => {
    const { cancelId = 'graphReportsCapacity' } = options;

    return dispatch({
      type: rhsmTypes.GET_GRAPH_REPORT_CAPACITY_RHSM,
      payload: Promise.all([
        rhsmServices.getGraphReports(id, query, { cancelId }),
        rhsmServices.getGraphCapacity(id, query, { cancelId })
      ]),
      meta: {
        id,
        query,
        notifications: {}
      }
    });
  };

/**
 * Get a RHSM response from multiple Tally IDs and metrics.
 *
 * @param {object|Array} idMetric An object, or an Array of objects, in the form of { id: PRODUCT_ID, metric: METRIC_ID }
 * @param {object} query
 * @param {object} options
 * @param {string} options.cancelId
 * @returns {Function}
 */
const getGraphTally =
  (idMetric = {}, query = {}, options = {}) =>
  dispatch => {
    const { cancelId = 'graphTally' } = options;
    const multiMetric = (Array.isArray(idMetric) && idMetric) || [idMetric];
    const multiDispatch = [];

    multiMetric.forEach(({ id, metric }) => {
      multiDispatch.push({
        type: rhsmTypes.GET_GRAPH_TALLY_RHSM,
        payload: rhsmServices.getGraphTally([id, metric], query, {
          cancelId: `${cancelId}_${id}_${metric}`
        }),
        meta: {
          id: `${id}_${metric}`,
          idMetric: { id, metric },
          query,
          notifications: {}
        }
      });
    });

    return Promise.all(dispatch(multiDispatch));
  };

/**
 * Get a hosts response listing from RHSM subscriptions.
 *
 * @param {string} id
 * @param {object} query
 * @returns {Function}
 */
const getHostsInventory =
  (id = null, query = {}) =>
  dispatch =>
    dispatch({
      type: rhsmTypes.GET_HOSTS_INVENTORY_RHSM,
      payload: rhsmServices.getHostsInventory(id, query),
      meta: {
        id,
        query,
        notifications: {}
      }
    });

/**
 * Get a host's guest response listing from RHSM subscriptions.
 *
 * @param {string} id
 * @param {object} query
 * @returns {Function}
 */
const getHostsInventoryGuests =
  (id = null, query = {}) =>
  dispatch =>
    dispatch({
      type: rhsmTypes.GET_HOSTS_INVENTORY_GUESTS_RHSM,
      payload: rhsmServices.getHostsInventoryGuests(id, query),
      meta: {
        id,
        query,
        notifications: {}
      }
    });

/**
 * Get an instances response listing from RHSM subscriptions.
 *
 * @param {string} id
 * @param {object} query
 * @returns {Function}
 */
const getInstancesInventory =
  (id = null, query = {}) =>
  dispatch =>
    dispatch({
      type: rhsmTypes.GET_INSTANCES_INVENTORY_RHSM,
      payload: rhsmServices.getInstancesInventory(id, query),
      meta: {
        id,
        query,
        notifications: {}
      }
    });

/**
 * Get a RHSM response from message reporting.
 *
 * @param {string} id
 * @param {object} query
 * @returns {Function}
 */
const getMessageReports =
  (id = null, query = {}) =>
  dispatch =>
    dispatch({
      type: rhsmTypes.GET_MESSAGE_REPORTS_RHSM,
      payload: rhsmServices.getGraphReports(id, query, { cancelId: 'messageReport' }),
      meta: {
        id,
        query,
        notifications: {}
      }
    });

/**
 * Get a subscriptions response from RHSM subscriptions.
 *
 * @param {string} id
 * @param {object} query
 * @returns {Function}
 */
const getSubscriptionsInventory =
  (id = null, query = {}) =>
  dispatch =>
    dispatch({
      type: rhsmTypes.GET_SUBSCRIPTIONS_INVENTORY_RHSM,
      payload: rhsmServices.getSubscriptionsInventory(id, query),
      meta: {
        id,
        query,
        notifications: {}
      }
    });

const rhsmActions = {
  getGraphReportsCapacity,
  getGraphTally,
  getHostsInventory,
  getHostsInventoryGuests,
  getInstancesInventory,
  getMessageReports,
  getSubscriptionsInventory
};

export {
  rhsmActions as default,
  rhsmActions,
  getGraphReportsCapacity,
  getGraphTally,
  getHostsInventory,
  getHostsInventoryGuests,
  getInstancesInventory,
  getMessageReports,
  getSubscriptionsInventory
};
