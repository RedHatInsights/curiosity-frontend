import { rhsmTypes } from '../types';
import { rhsmServices } from '../../services/rhsm/rhsmServices';
import { generateChartIds } from '../../components/graphCard/graphCardHelpers';

/**
 * RHSM service wrappers for dispatch, state update.
 *
 * @memberof Actions
 * @module RhsmActions
 */

/**
 * Get a combined billing account id response listing from RHSM instances, subscriptions billing account ids.
 *
 * @param {string} id
 * @param {object} query
 * @returns {Function}
 */
const getBillingAccounts =
  (id = null, query = {}) =>
  dispatch =>
    dispatch({
      type: rhsmTypes.GET_BILLING_ACCOUNTS_RHSM,
      payload: rhsmServices.getBillingAccounts(id, query, { cancelId: `billing_accounts_${id}` }),
      meta: {
        id,
        productId: id,
        query,
        action: 'getBillingAccounts',
        service: rhsmServices.getBillingAccounts.name
      }
    });

/**
 * Get a RHSM response from multiple Tally, or Capacity, IDs and metrics.
 *
 * @param {object|Array} idMetric An object, or an Array of objects, in the form of { id: PRODUCT_ID, metric: METRIC_ID,
 *     isCapacity: boolean }
 * @param {object} query
 * @param {object} options
 * @param {string} options.cancelId
 * @returns {Function}
 */
const getGraphMetrics =
  (idMetric = {}, query = {}, options = {}) =>
  dispatch => {
    const { cancelId = 'graphTally' } = options;
    const multiMetric = (Array.isArray(idMetric) && idMetric) || [idMetric];
    const multiDispatch = [];

    multiMetric.forEach(({ id, metric, isCapacity, query: metricQuery }) => {
      const methodService = isCapacity ? rhsmServices.getGraphCapacity : rhsmServices.getGraphTally;
      const methodType = isCapacity ? rhsmTypes.GET_GRAPH_CAPACITY_RHSM : rhsmTypes.GET_GRAPH_TALLY_RHSM;
      const methodCancelId = isCapacity ? 'graphCapacity' : cancelId;
      const generatedId = generateChartIds({ isCapacity, metric, productId: id, query: metricQuery });

      multiDispatch.push({
        type: methodType,
        payload: methodService(
          [id, metric],
          { ...query, ...metricQuery },
          {
            cancelId: `${methodCancelId}_${generatedId}`
          }
        ),
        meta: {
          id: generatedId,
          productId: id,
          query: { ...query, ...metricQuery },
          action: 'getGraphMetrics',
          service: methodService.name
        }
      });
    });

    return Promise.all(dispatch(multiDispatch));
  };

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
        productId: id,
        query,
        action: 'getInstancesInventory',
        service: rhsmServices.getInstancesInventory.name
      }
    });

/**
 * Get an instance guest response listing from RHSM subscriptions.
 *
 * @param {string} id
 * @param {object} query
 * @returns {Function}
 */
const getInstancesInventoryGuests =
  (id = null, query = {}) =>
  dispatch =>
    dispatch({
      type: rhsmTypes.GET_INSTANCES_INVENTORY_GUESTS_RHSM,
      payload: rhsmServices.getInstancesInventoryGuests(id, query),
      meta: {
        id,
        productId: id,
        query,
        action: 'getInstancesInventoryGuests',
        service: rhsmServices.getInstancesInventoryGuests.name
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
        productId: id,
        query,
        action: 'getSubscriptionsInventory',
        service: rhsmServices.getSubscriptionsInventory.name
      }
    });

const rhsmActions = {
  getBillingAccounts,
  getGraphMetrics,
  getInstancesInventory,
  getInstancesInventoryGuests,
  getSubscriptionsInventory
};

export {
  rhsmActions as default,
  rhsmActions,
  getBillingAccounts,
  getGraphMetrics,
  getInstancesInventory,
  getInstancesInventoryGuests,
  getSubscriptionsInventory
};
