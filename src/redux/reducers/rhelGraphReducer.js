import { reduxTypes, rhelTypes } from '../types';
import { reduxHelpers } from '../common/reduxHelpers';
import { dateHelpers } from '../../common/dateHelpers';

const initialState = {
  capacity: {},
  component: {},
  report: {}
};

const rhelGraphReducer = (state = initialState, action) => {
  switch (action.type) {
    case reduxTypes.rhel.SET_GRAPH_RHEL_GRANULARITY:
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
          { ref: 'capacity', type: rhelTypes.GET_GRAPH_CAPACITY_RHEL },
          { ref: 'report', type: rhelTypes.GET_GRAPH_REPORT_RHEL }
        ],
        state,
        action
      );
  }
};

rhelGraphReducer.initialState = initialState;

export { rhelGraphReducer as default, initialState, rhelGraphReducer };
