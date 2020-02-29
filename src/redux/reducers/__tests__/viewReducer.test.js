import viewReducer from '../viewReducer';
import { rhsmTypes as types } from '../../types';

describe('ViewReducer', () => {
  it('should return the initial state', () => {
    expect(viewReducer.initialState).toBeDefined();
  });

  it('should handle specific defined types', () => {
    const specificTypes = [types.SET_GRAPH_GRANULARITY_RHSM];

    specificTypes.forEach(value => {
      const dispatched = {
        type: value,
        granularity: 'lorem granularity',
        viewId: 'dolor id'
      };

      const resultState = viewReducer(undefined, dispatched);

      expect({ type: value, result: resultState }).toMatchSnapshot(`defined type ${value}`);
    });
  });
});
