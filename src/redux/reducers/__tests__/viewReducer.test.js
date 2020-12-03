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
      types.SET_QUERY_CLEAR,
      types.SET_QUERY_CLEAR_INVENTORY_LIST
    ];

    specificTypes.forEach(value => {
      const dispatched = {
        type: value,
        [RHSM_API_QUERY_TYPES.DIRECTION]: 'lorem direction',
        [RHSM_API_QUERY_TYPES.GRANULARITY]: 'lorem granularity',
        [RHSM_API_QUERY_TYPES.LIMIT]: 10,
        [RHSM_API_QUERY_TYPES.OFFSET]: 10,
        [RHSM_API_QUERY_TYPES.SORT]: 'lorem sort',
        [RHSM_API_QUERY_TYPES.SLA]: 'lorem sla',
        [RHSM_API_QUERY_TYPES.UOM]: 'lorem uom',
        [RHSM_API_QUERY_TYPES.USAGE]: 'ipsum usage',
        viewId: 'test_id'
      };

      const resultState = viewReducer(undefined, dispatched);

      expect({ type: value, result: resultState }).toMatchSnapshot(`defined type ${value}`);
    });
  });
});
