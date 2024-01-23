import { inventoryTypes, rhsmTypes } from '../types';
import { reduxHelpers } from '../common/reduxHelpers';

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
 * @type {{subscriptionsInventory: {}, instancesGuests: {}, instancesInventory: {}, tabs: {}}}
 */
const initialState = {
  instancesInventory: {},
  instancesGuests: {},
  subscriptionsInventory: {},
  tabs: {}
};

/**
 * Apply generated inventory observer/reducer for system and subscriptions inventory to state,
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
        'instancesGuests',
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
          { ref: 'instancesInventory', type: rhsmTypes.GET_INSTANCES_INVENTORY_RHSM },
          { ref: 'instancesGuests', type: rhsmTypes.GET_INSTANCES_INVENTORY_GUESTS_RHSM },
          { ref: 'subscriptionsInventory', type: rhsmTypes.GET_SUBSCRIPTIONS_INVENTORY_RHSM }
        ],
        state,
        action
      );
  }
};

inventoryReducer.initialState = initialState;

export { inventoryReducer as default, initialState, inventoryReducer };
