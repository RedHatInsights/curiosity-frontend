import { rhsmTypes } from '../types';
import { rhsmServices } from '../../services/rhsmServices';

const getGraphReportsCapacity = (id = null, query = {}) => dispatch =>
  dispatch({
    type: rhsmTypes.GET_GRAPH_REPORT_CAPACITY_RHSM,
    payload: Promise.all([rhsmServices.getGraphReports(id, query), rhsmServices.getGraphCapacity(id, query)]),
    meta: {
      id,
      query,
      notifications: {}
    }
  });

const rhsmActions = { getGraphReportsCapacity };

export { rhsmActions as default, rhsmActions, getGraphReportsCapacity };
