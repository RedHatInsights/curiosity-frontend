import { reduxTypes, rhsmTypes } from '../types';
import { reduxHelpers } from '../common/reduxHelpers';
import { dateHelpers } from '../../common/dateHelpers';

const initialState = {
  capacity: {},
  component: {},
  report: {},
  reportCapacity: {}
};

const graphReducer = (state = initialState, action) => {
  switch (action.type) {
    case reduxTypes.rhsm.SET_GRAPH_GRANULARITY_RHSM:
      return reduxHelpers.setStateProp(
        'component',
        {
          graphGranularity: action.graphGranularity,
          ...dateHelpers.getRangedDateTime(action.graphGranularity)
        },
        {
          state,
          initialState
        }
      );

    default:
      return reduxHelpers.generatedPromiseActionReducer(
        [
          { ref: 'reportCapacity', type: rhsmTypes.GET_GRAPH_REPORT_CAPACITY_RHSM },
          { ref: 'capacity', type: rhsmTypes.GET_GRAPH_CAPACITY_RHSM },
          { ref: 'report', type: rhsmTypes.GET_GRAPH_REPORT_RHSM }
        ],
        state,
        action
      );
  }
};

graphReducer.initialState = initialState;

export { graphReducer as default, initialState, graphReducer };
