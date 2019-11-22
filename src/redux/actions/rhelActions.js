import { rhelTypes } from '../types';
import rhelServices from '../../services/rhelServices';

// ToDo: add notifications settings back once "auth" end point available from API
const getGraphReportsRhel = (id = null, query = {}) => dispatch =>
  dispatch({
    type: rhelTypes.GET_GRAPH_REPORT_RHEL,
    payload: rhelServices.getGraphReportsRhel(id, query),
    meta: {
      data: { id },
      query,
      notifications: {}
    }
  });

// ToDo: add notifications settings back once "auth" end point available from API
const getGraphCapacityRhel = (id = null, query = {}) => dispatch =>
  dispatch({
    type: rhelTypes.GET_GRAPH_CAPACITY_RHEL,
    payload: rhelServices.getGraphCapacityRhel(id, query),
    meta: {
      data: { id },
      query,
      notifications: {}
    }
  });

export { getGraphCapacityRhel, getGraphReportsRhel };
