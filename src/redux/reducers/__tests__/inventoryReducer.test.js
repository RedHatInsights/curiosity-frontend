import inventoryReducer from '../inventoryReducer';
import { rhsmTypes as types, inventoryTypes } from '../../types';
import { reduxHelpers } from '../../common/reduxHelpers';

describe('InventoryReducer', () => {
  it('should return the initial state', () => {
    expect(inventoryReducer.initialState).toBeDefined();
  });

  it('should handle specific defined types', () => {
    const specificTypes = [inventoryTypes.SET_INVENTORY_TAB, inventoryTypes.CLEAR_INVENTORY_GUESTS];

    specificTypes.forEach(value => {
      const dispatched = {
        type: value,
        tabs: {
          lorem: 1
        },
        id: 'lorem'
      };

      const resultState = inventoryReducer(undefined, dispatched);

      expect({ type: value, result: resultState }).toMatchSnapshot(`defined type ${value}`);
    });
  });

  it('should handle all defined error types', () => {
    const specificTypes = [
      types.GET_HOSTS_INVENTORY_RHSM,
      types.GET_HOSTS_INVENTORY_GUESTS_RHSM,
      types.GET_INSTANCES_INVENTORY_RHSM,
      types.GET_INSTANCES_INVENTORY_GUESTS_RHSM,
      types.GET_SUBSCRIPTIONS_INVENTORY_RHSM
    ];

    specificTypes.forEach(value => {
      const dispatched = {
        type: reduxHelpers.REJECTED_ACTION(value),
        error: true,
        payload: {
          message: 'MESSAGE',
          response: {
            status: 0,
            statusText: 'ERROR TEST',
            data: {
              detail: 'ERROR'
            }
          }
        }
      };

      const resultState = inventoryReducer(undefined, dispatched);

      expect({ type: reduxHelpers.REJECTED_ACTION(value), result: resultState }).toMatchSnapshot(
        `rejected types ${value}`
      );
    });
  });

  it('should handle all defined pending types', () => {
    const specificTypes = [
      types.GET_HOSTS_INVENTORY_RHSM,
      types.GET_HOSTS_INVENTORY_GUESTS_RHSM,
      types.GET_INSTANCES_INVENTORY_RHSM,
      types.GET_INSTANCES_INVENTORY_GUESTS_RHSM,
      types.GET_SUBSCRIPTIONS_INVENTORY_RHSM
    ];

    specificTypes.forEach(value => {
      const dispatched = {
        type: reduxHelpers.PENDING_ACTION(value)
      };

      const resultState = inventoryReducer(undefined, dispatched);

      expect({ type: reduxHelpers.PENDING_ACTION(value), result: resultState }).toMatchSnapshot(
        `pending types ${value}`
      );
    });
  });

  it('should handle all defined fulfilled types', () => {
    const specificTypes = [
      types.GET_HOSTS_INVENTORY_RHSM,
      types.GET_HOSTS_INVENTORY_GUESTS_RHSM,
      types.GET_INSTANCES_INVENTORY_RHSM,
      types.GET_INSTANCES_INVENTORY_GUESTS_RHSM,
      types.GET_SUBSCRIPTIONS_INVENTORY_RHSM
    ];

    specificTypes.forEach(value => {
      const dispatched = {
        type: reduxHelpers.FULFILLED_ACTION(value),
        payload: {
          data: {
            test: 'success'
          }
        }
      };

      const resultState = inventoryReducer(undefined, dispatched);

      expect({ type: reduxHelpers.FULFILLED_ACTION(value), result: resultState }).toMatchSnapshot(
        `fulfilled types ${value}`
      );
    });
  });
});
