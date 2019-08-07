import { reduxTypes, rhelTypes } from '../types';
import { rhelApiTypes } from '../../types/rhelApiTypes';
import { reduxHelpers } from '../common/reduxHelpers';
import { dateHelpers } from '../../common/dateHelpers';

const initialState = {
  graphData: {
    usage: []
  },
  error: false,
  errorStatus: null,
  errorMessage: null,
  pending: false,
  fulfilled: false
};

const rhelGraphReducer = (state = initialState, action) => {
  switch (action.type) {
    case reduxHelpers.REJECTED_ACTION(rhelTypes.GET_GRAPH_REPORT):
      return reduxHelpers.setStateProp(
        null,
        {
          error: action.error,
          errorMessage: reduxHelpers.getMessageFromResults(action.payload),
          errorStatus: reduxHelpers.getStatusFromResults(action.payload)
        },
        {
          state,
          initialState
        }
      );

    case reduxHelpers.PENDING_ACTION(rhelTypes.GET_GRAPH_REPORT):
      return reduxHelpers.setStateProp(
        null,
        {
          pending: true
        },
        {
          state,
          initialState
        }
      );

    case reduxHelpers.FULFILLED_ACTION(rhelTypes.GET_GRAPH_REPORT):
      return reduxHelpers.setStateProp(
        null,
        {
          graphData: {
            usage: action.payload.data[rhelApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA] || []
          },
          fulfilled: true
        },
        {
          state,
          initialState
        }
      );

    case reduxTypes.rhel.SET_GRAPH_RHEL_GRANULARITY:
      return reduxHelpers.setStateProp(
        null,
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
      return state;
  }
};

rhelGraphReducer.initialState = initialState;

export { rhelGraphReducer as default, initialState, rhelGraphReducer };
