import { rhsmTypes } from '../types';
import { reduxHelpers } from '../common/reduxHelpers';

const initialState = {
  reportCapacity: {}
};

const graphReducer = (state = initialState, action) =>
  reduxHelpers.generatedPromiseActionReducer(
    [{ ref: 'reportCapacity', type: rhsmTypes.GET_GRAPH_REPORT_CAPACITY_RHSM }],
    state,
    action
  );

graphReducer.initialState = initialState;

export { graphReducer as default, initialState, graphReducer };
