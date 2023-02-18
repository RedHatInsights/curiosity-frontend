import { rhsmTypes } from '../types/rhsmTypes';
import { reduxHelpers } from '../common/reduxHelpers';
import { inventoryTypes } from '../types';

/**
 * Inventory, and tabs, related API and user state reducer.
 *
 * @memberof Reducers
 * @module InventoryReducer
 */

/**
 * Initial state.
 *
 * @private
 * @type {{subscriptionsInventory: {}, instancesInventory: {}, tabs: {}, hostsInventory: {}, hostsGuests: {}}}
 */
const initialState = {
  hostsInventory: {},
  hostsGuests: {},
  instancesInventory: {},
  subscriptionsInventory: {},
  tabs: {}
};

/**
 * Apply generated inventory observer/reducer for hosts/system and subscriptions inventory to state,
 * against actions.
 *
 * @param {object} state
 * @param {object} action
 * @returns {object|{}}
 */
const inventoryReducer = (state = initialState, action) => {
  switch (action.type) {
    case inventoryTypes.SET_INVENTORY_TAB:
      return reduxHelpers.setStateProp(
        'tabs',
        {
          ...action.tabs
        },
        {
          state,
          reset: false
        }
      );
    case inventoryTypes.CLEAR_INVENTORY_GUESTS:
      return reduxHelpers.setStateProp(
        'hostsGuests',
        {
          [action.id]: {}
        },
        {
          state,
          reset: false
        }
      );
    default:
      return reduxHelpers.generatedPromiseActionReducer(
        [
          { ref: 'hostsInventory', type: rhsmTypes.GET_HOSTS_INVENTORY_RHSM },
          { ref: 'hostsGuests', type: rhsmTypes.GET_HOSTS_INVENTORY_GUESTS_RHSM },
          { ref: 'instancesInventory', type: rhsmTypes.GET_INSTANCES_INVENTORY_RHSM },
          { ref: 'subscriptionsInventory', type: rhsmTypes.GET_SUBSCRIPTIONS_INVENTORY_RHSM }
        ],
        state,
        action
      );
  }
};

inventoryReducer.initialState = initialState;

export { inventoryReducer as default, initialState, inventoryReducer };
