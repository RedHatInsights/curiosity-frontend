import { reduxTypes } from '../types';
import { reduxHelpers } from '../common/reduxHelpers';
import { RHSM_API_QUERY_GRANULARITY, RHSM_API_QUERY_SLA } from '../../types/rhsmApiTypes';

const initialState = {
  graphQuery: {}
};

const viewReducer = (state = initialState, action) => {
  switch (action.type) {
    case reduxTypes.rhsm.SET_GRAPH_GRANULARITY_RHSM:
      return reduxHelpers.setStateProp(
        'graphQuery',
        {
          [RHSM_API_QUERY_GRANULARITY]: action.granularity
        },
        {
          state,
          reset: false
        }
      );
    case reduxTypes.rhsm.SET_GRAPH_SLA_RHSM:
      return reduxHelpers.setStateProp(
        'graphQuery',
        {
          [RHSM_API_QUERY_SLA]: action.sla
        },
        {
          state,
          reset: false
        }
      );
    default:
      return state;
  }
};

viewReducer.initialState = initialState;

export { viewReducer as default, initialState, viewReducer };
