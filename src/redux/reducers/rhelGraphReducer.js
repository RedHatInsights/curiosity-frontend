import { reduxTypes, rhsmTypes } from '../types';
import { reduxHelpers } from '../common/reduxHelpers';
import { dateHelpers } from '../../common/dateHelpers';

const initialState = {
  capacity: {},
  component: {},
  report: {}
};

const rhelGraphReducer = (state = initialState, action) => {
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
          { ref: 'capacity', type: rhsmTypes.GET_GRAPH_CAPACITY_RHSM },
          { ref: 'report', type: rhsmTypes.GET_GRAPH_REPORT_RHSM }
        ],
        state,
        action
      );
  }
};

rhelGraphReducer.initialState = initialState;

export { rhelGraphReducer as default, initialState, rhelGraphReducer };
