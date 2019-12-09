import { rhsmTypes } from '../types';
import { rhsmServices } from '../../services/rhsmServices';

// ToDo: add notifications settings back once "auth" end point available from API
const getGraphReports = (id = null, query = {}) => dispatch =>
  dispatch({
    type: rhsmTypes.GET_GRAPH_REPORT_RHSM,
    payload: rhsmServices.getGraphReports(id, query),
    meta: {
      data: { id },
      query,
      notifications: {}
    }
  });

// ToDo: add notifications settings back once "auth" end point available from API
const getGraphCapacity = (id = null, query = {}) => dispatch =>
  dispatch({
    type: rhsmTypes.GET_GRAPH_CAPACITY_RHSM,
    payload: rhsmServices.getGraphCapacity(id, query),
    meta: {
      data: { id },
      query,
      notifications: {}
    }
  });

const rhsmActions = { getGraphCapacity, getGraphReports };

export { rhsmActions as default, rhsmActions, getGraphCapacity, getGraphReports };
