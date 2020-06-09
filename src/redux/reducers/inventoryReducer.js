import { rhsmTypes } from '../types/rhsmTypes';
import { reduxHelpers } from '../common/reduxHelpers';

/**
 * Initial state.
 *
 * @private
 * @type {{inventory: {}}}
 */
const initialState = {
  hostsInventory: {}
};

/**
 * Apply generated inventory observer/reducer for systemInventory to state, against actions.
 *
 * @param {object} state
 * @param {object} action
 * @returns {object|{}}
 */
const inventoryReducer = (state = initialState, action) =>
  reduxHelpers.generatedPromiseActionReducer(
    [{ ref: 'hostsInventory', type: rhsmTypes.GET_HOSTS_INVENTORY_RHSM }],
    state,
    action
  );

inventoryReducer.initialState = initialState;

export { inventoryReducer as default, initialState, inventoryReducer };
