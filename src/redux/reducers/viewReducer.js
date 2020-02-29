import { reduxTypes } from '../types';
import { reduxHelpers } from '../common/reduxHelpers';

const initialState = {};

const viewReducer = (state = initialState, action) => {
  switch (action.type) {
    case reduxTypes.rhsm.SET_GRAPH_GRANULARITY_RHSM:
      return reduxHelpers.setStateProp(
        null,
        {
          granularity: action.granularity
        },
        {
          state,
          initialState
        }
      );
    default:
      return state;
  }
};

viewReducer.initialState = initialState;

export { viewReducer as default, initialState, viewReducer };
