import viewReducer from '../viewReducer';
import { queryTypes as types } from '../../types';
import {
  RHSM_API_QUERY_GRANULARITY,
  RHSM_API_QUERY_LIMIT,
  RHSM_API_QUERY_OFFSET,
  RHSM_API_QUERY_SLA,
  RHSM_API_QUERY_USAGE
} from '../../../types/rhsmApiTypes';

describe('ViewReducer', () => {
  it('should return the initial state', () => {
    expect(viewReducer.initialState).toBeDefined();
  });

  it('should handle specific defined types', () => {
    const specificTypes = [
      types.SET_QUERY_GRANULARITY_RHSM,
      types.SET_QUERY_SLA_RHSM,
      types.SET_QUERY_USAGE_RHSM,
      types.SET_QUERY_CLEAR,
      types.SET_QUERY_PAGE_LIMIT_RHSM,
      types.SET_QUERY_PAGE_OFFSET_RHSM
    ];

    specificTypes.forEach(value => {
      const dispatched = {
        type: value,
        [RHSM_API_QUERY_GRANULARITY]: 'lorem granularity',
        [RHSM_API_QUERY_SLA]: 'lorem sla',
        [RHSM_API_QUERY_USAGE]: 'ipsum usage',
        [RHSM_API_QUERY_LIMIT]: 10,
        [RHSM_API_QUERY_OFFSET]: 10,
        viewId: 'test_id'
      };

      const resultState = viewReducer(undefined, dispatched);

      expect({ type: value, result: resultState }).toMatchSnapshot(`defined type ${value}`);
    });
  });
});
