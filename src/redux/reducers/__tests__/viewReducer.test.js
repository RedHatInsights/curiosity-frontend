import viewReducer from '../viewReducer';
import { queryTypes as types } from '../../types';
import { RHSM_API_QUERY_TYPES } from '../../../types/rhsmApiTypes';

describe('ViewReducer', () => {
  it('should return the initial state', () => {
    expect(viewReducer.initialState).toBeDefined();
  });

  it('should handle specific defined types', () => {
    const specificTypes = [
      ...Object.values(types.SET_QUERY_RHSM_TYPES),
      ...Object.values(types.SET_QUERY_RHSM_HOSTS_INVENTORY_TYPES),
      ...Object.values(types.SET_QUERY_RHSM_SUBSCRIPTIONS_INVENTORY_TYPES),
      ...Object.values(types.SET_QUERY_RHSM_GUESTS_INVENTORY_TYPES),
      types.SET_QUERY_CLEAR,
      types.SET_QUERY_CLEAR_INVENTORY_LIST,
      types.SET_QUERY_RESET_INVENTORY_LIST,
      types.SET_QUERY_CLEAR_INVENTORY_GUESTS_LIST
    ];

    specificTypes.forEach(value => {
      const state = {
        query: {},
        graphTallyQuery: {},
        inventoryGuestsQuery: {
          test_id: {
            [RHSM_API_QUERY_TYPES.OFFSET]: 5
          }
        },
        inventoryHostsQuery: {
          test_id: {
            [RHSM_API_QUERY_TYPES.DIRECTION]: 'dolor desc direction',
            [RHSM_API_QUERY_TYPES.OFFSET]: 30,
            [RHSM_API_QUERY_TYPES.SORT]: 'dolor sort'
          }
        },
        inventorySubscriptionsQuery: {
          test_id: {
            [RHSM_API_QUERY_TYPES.DIRECTION]: 'ipsum desc direction',
            [RHSM_API_QUERY_TYPES.OFFSET]: 20,
            [RHSM_API_QUERY_TYPES.SORT]: 'ipsum sort'
          }
        }
      };

      const dispatched = {
        type: value,
        [RHSM_API_QUERY_TYPES.DIRECTION]: 'lorem asc direction',
        [RHSM_API_QUERY_TYPES.DISPLAY_NAME]: 'lorem name',
        [RHSM_API_QUERY_TYPES.GRANULARITY]: 'lorem granularity',
        [RHSM_API_QUERY_TYPES.END_DATE]: '2021-02-01T23:59:59.999Z',
        [RHSM_API_QUERY_TYPES.START_DATE]: '2018-02-01T00:00:00.000Z',
        [RHSM_API_QUERY_TYPES.LIMIT]: 10,
        [RHSM_API_QUERY_TYPES.OFFSET]: 10,
        [RHSM_API_QUERY_TYPES.SORT]: 'lorem sort',
        [RHSM_API_QUERY_TYPES.SLA]: 'lorem sla',
        [RHSM_API_QUERY_TYPES.UOM]: 'lorem uom',
        [RHSM_API_QUERY_TYPES.USAGE]: 'ipsum usage',
        viewId: 'test_id'
      };

      const resultState = viewReducer(state, dispatched);

      expect({ type: value, result: resultState }).toMatchSnapshot(`defined type ${value}`);
    });
  });
});
