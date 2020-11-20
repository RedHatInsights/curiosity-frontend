import { rhsmTypes } from '../types/rhsmTypes';
import { reduxHelpers } from '../common/reduxHelpers';

/**
 * Initial state.
 *
 * @private
 * @type {{subscriptionsInventory: {}, hostsInventory: {}, hostsGuests: {}}}
 */
const initialState = {
  hostsInventory: {},
  hostsGuests: {},
  subscriptionsInventory: {}
};

/**
 * Apply generated inventory observer/reducer for hosts/system and subscriptions inventory to state,
 * against actions.
 *
 * @param {object} state
 * @param {object} action
 * @returns {object|{}}
 */
const inventoryReducer = (state = initialState, action) =>
  reduxHelpers.generatedPromiseActionReducer(
    [
      { ref: 'hostsInventory', type: rhsmTypes.GET_HOSTS_INVENTORY_RHSM },
      { ref: 'hostsGuests', type: rhsmTypes.GET_HOSTS_INVENTORY_GUESTS_RHSM },
      { ref: 'subscriptionsInventory', type: rhsmTypes.GET_SUBSCRIPTIONS_INVENTORY_RHSM }
    ],
    state,
    action
  );

inventoryReducer.initialState = initialState;

export { inventoryReducer as default, initialState, inventoryReducer };
