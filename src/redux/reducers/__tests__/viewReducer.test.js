import viewReducer from '../viewReducer';
import { appTypes, queryTypes as types } from '../../types';
import { RHSM_API_QUERY_SET_TYPES as RHSM_API_QUERY_TYPES } from '../../../services/rhsm/rhsmConstants';

describe('ViewReducer', () => {
  it('should return the initial state', () => {
    expect(viewReducer.initialState).toBeDefined();
  });

  it('should handle specific defined types', () => {
    const specificTypes = [
      appTypes.SET_PRODUCT_VARIANT,
      ...Object.values({
        ...types,
        SET_QUERY_CLEAR: undefined,
        SET_QUERY_CLEAR_INVENTORY_GUESTS_LIST: undefined,
        SET_QUERY_CLEAR_INVENTORY_LIST: undefined,
        SET_QUERY_RESET_INVENTORY_LIST: undefined
      })
    ];

    specificTypes.forEach(value => {
      if (!value) {
        return;
      }

      const dispatched = {
        type: value,
        config: 'lorem ipsum product',
        viewId: 'test_id',
        productGroup: 'test_id',
        variant: 'lorem variant',
        filter: 'dolorFilter',
        value: 'sit any value'
      };

      const resultState = viewReducer(undefined, dispatched);

      expect({ type: value, result: resultState }).toMatchSnapshot(`defined type ${value}`);
    });
  });

  it('should handle clearing state with defined types', () => {
    const specificTypes = [
      appTypes.SET_PRODUCT_VARIANT_QUERY_RESET_ALL,
      types.SET_QUERY_CLEAR,
      types.SET_QUERY_CLEAR_INVENTORY_GUESTS_LIST,
      types.SET_QUERY_CLEAR_INVENTORY_LIST,
      types.SET_QUERY_RESET_INVENTORY_LIST
    ];

    specificTypes.forEach(value => {
      const state = {
        query: {
          test_id: {
            dolor: 'sit'
          },
          another_test_id: {
            lorem: 'ipsum'
          }
        },
        graphTallyQuery: {},
        inventoryGuestsQuery: {
          test_id: {
            [RHSM_API_QUERY_TYPES.OFFSET]: 5
          },
          another_test_id: {
            [RHSM_API_QUERY_TYPES.OFFSET]: 10
          }
        },
        inventoryHostsQuery: {
          test_id: {
            [RHSM_API_QUERY_TYPES.DIRECTION]: 'dolor desc direction',
            [RHSM_API_QUERY_TYPES.OFFSET]: 30,
            [RHSM_API_QUERY_TYPES.SORT]: 'dolor sort'
          },
          another_test_id: {
            [RHSM_API_QUERY_TYPES.DIRECTION]: 'lorem desc direction',
            [RHSM_API_QUERY_TYPES.OFFSET]: 90,
            [RHSM_API_QUERY_TYPES.SORT]: 'lorem sort'
          }
        },
        inventorySubscriptionsQuery: {
          test_id: {
            [RHSM_API_QUERY_TYPES.DIRECTION]: 'ipsum desc direction',
            [RHSM_API_QUERY_TYPES.OFFSET]: 20,
            [RHSM_API_QUERY_TYPES.SORT]: 'ipsum sort'
          },
          another_test_id: {
            [RHSM_API_QUERY_TYPES.DIRECTION]: 'dolor desc direction',
            [RHSM_API_QUERY_TYPES.OFFSET]: 40,
            [RHSM_API_QUERY_TYPES.SORT]: 'dolor sort'
          }
        }
      };

      const dispatched = {
        type: value,
        viewId: 'test_id',
        variant: 'test_id',
        clearFilters: { dolor: undefined }
      };

      const resultState = viewReducer(state, dispatched);

      expect({ type: value, result: resultState }).toMatchSnapshot(`defined type ${value}`);
    });
  });
});
