import { rhsmTypes } from '../types';
import { reduxHelpers } from '../common/reduxHelpers';

const initialState = {
  capacity: {},
  report: {},
  reportCapacity: {}
};

const graphReducer = (state = initialState, action) =>
  reduxHelpers.generatedPromiseActionReducer(
    [
      { ref: 'reportCapacity', type: rhsmTypes.GET_GRAPH_REPORT_CAPACITY_RHSM },
      { ref: 'capacity', type: rhsmTypes.GET_GRAPH_CAPACITY_RHSM },
      { ref: 'report', type: rhsmTypes.GET_GRAPH_REPORT_RHSM }
    ],
    state,
    action
  );

graphReducer.initialState = initialState;

export { graphReducer as default, initialState, graphReducer };
