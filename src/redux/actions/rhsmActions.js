import { rhsmTypes } from '../types';
import { rhsmServices } from '../../services/rhsmServices';

const getGraphReportsCapacity = (id = null, query = {}) => dispatch =>
  dispatch({
    type: rhsmTypes.GET_GRAPH_REPORT_CAPACITY_RHSM,
    payload: Promise.all([rhsmServices.getGraphReports(id, query), rhsmServices.getGraphCapacity(id, query)]),
    meta: {
      id,
      query,
      notifications: {
        rejected: {
          variant: 'info',
          title: 'Reporting and capacity connection has failed',
          description: `Product ID: ${id}`
        }
      }
    }
  });

const getGraphReports = (id = null, query = {}) => dispatch =>
  dispatch({
    type: rhsmTypes.GET_GRAPH_REPORT_RHSM,
    payload: rhsmServices.getGraphReports(id, query),
    meta: {
      id,
      query,
      notifications: {
        rejected: {
          variant: 'info',
          title: 'Reporting connection has failed',
          description: `Product ID: ${id}`
        }
      }
    }
  });

const getGraphCapacity = (id = null, query = {}) => dispatch =>
  dispatch({
    type: rhsmTypes.GET_GRAPH_CAPACITY_RHSM,
    payload: rhsmServices.getGraphCapacity(id, query),
    meta: {
      id,
      query,
      notifications: {
        rejected: {
          variant: 'info',
          title: 'Capacity connection has failed',
          description: `Product ID: ${id}`
        }
      }
    }
  });

const rhsmActions = { getGraphReportsCapacity, getGraphCapacity, getGraphReports };

export { rhsmActions as default, rhsmActions, getGraphReportsCapacity, getGraphCapacity, getGraphReports };
