import graphReducer from '../graphReducer';
import { rhsmTypes as types, graphTypes } from '../../types';
import { reduxHelpers } from '../../common/reduxHelpers';

describe('GraphReducer', () => {
  it('should return the initial state', () => {
    expect(graphReducer.initialState).toBeDefined();
  });

  it('should handle specific defined types', () => {
    const specificTypes = [graphTypes.SET_GRAPH_LEGEND];

    specificTypes.forEach(value => {
      const dispatched = {
        type: value,
        id: 'lorem',
        value: true
      };

      const resultState = graphReducer(undefined, dispatched);

      expect({ type: value, result: resultState }).toMatchSnapshot(`defined type ${value}`);
    });
  });

  it('should handle all defined error types', () => {
    const specificTypes = [
      types.GET_GRAPH_REPORT_CAPACITY_RHSM,
      types.GET_GRAPH_CAPACITY_RHSM,
      types.GET_GRAPH_TALLY_RHSM
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

      const resultState = graphReducer(undefined, dispatched);

      expect({ type: reduxHelpers.REJECTED_ACTION(value), result: resultState }).toMatchSnapshot(
        `rejected types ${value}`
      );
    });
  });

  it('should handle all defined pending types', () => {
    const specificTypes = [
      types.GET_GRAPH_REPORT_CAPACITY_RHSM,
      types.GET_GRAPH_CAPACITY_RHSM,
      types.GET_GRAPH_TALLY_RHSM
    ];

    specificTypes.forEach(value => {
      const dispatched = {
        type: reduxHelpers.PENDING_ACTION(value)
      };

      const resultState = graphReducer(undefined, dispatched);

      expect({ type: reduxHelpers.PENDING_ACTION(value), result: resultState }).toMatchSnapshot(
        `pending types ${value}`
      );
    });
  });

  it('should handle all defined fulfilled types', () => {
    const specificTypes = [
      types.GET_GRAPH_REPORT_CAPACITY_RHSM,
      types.GET_GRAPH_CAPACITY_RHSM,
      types.GET_GRAPH_TALLY_RHSM
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

      const resultState = graphReducer(undefined, dispatched);

      expect({ type: reduxHelpers.FULFILLED_ACTION(value), result: resultState }).toMatchSnapshot(
        `fulfilled types ${value}`
      );
    });
  });
});
