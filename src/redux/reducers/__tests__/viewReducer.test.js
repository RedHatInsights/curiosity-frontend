import viewReducer from '../viewReducer';
import { rhsmTypes as types } from '../../types';

describe('ViewReducer', () => {
  it('should return the initial state', () => {
    expect(viewReducer.initialState).toBeDefined();
  });

  it('should handle specific defined types', () => {
    const specificTypes = [
      types.SET_FILTER_GRANULARITY_RHSM,
      types.SET_FILTER_SLA_RHSM,
      types.SET_FILTER_USAGE_RHSM,
      types.SET_CLEAR_FILTERS,
      types.SET_PAGE_LIMIT_RHSM,
      types.SET_PAGE_OFFSET_RHSM
    ];

    specificTypes.forEach(value => {
      const dispatched = {
        type: value,
        granularity: 'lorem granularity',
        sla: 'lorem sla',
        viewId: 'test_id'
      };

      const resultState = viewReducer(undefined, dispatched);

      expect({ type: value, result: resultState }).toMatchSnapshot(`defined type ${value}`);
    });
  });
});
