import toolbarReducer from '../toolbarReducer';
import { toolbarTypes as types } from '../../types';

describe('ToolbarReducer', () => {
  it('should return the initial state', () => {
    expect(toolbarReducer.initialState).toBeDefined();
  });

  it('should handle specific defined types', () => {
    const specificTypes = [types.SET_ACTIVE_FILTERS, types.SET_FILTER_TYPE];

    specificTypes.forEach(value => {
      const dispatched = {
        type: value,
        activeFilters: new Set(['lorem']),
        currentFilter: 'lorem',
        viewId: 'test_id'
      };

      const resultState = toolbarReducer(undefined, dispatched);

      expect({ type: value, result: resultState }).toMatchSnapshot(`defined type ${value}`);
    });
  });
});
