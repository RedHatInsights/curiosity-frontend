import { rhsmTypes } from '../types';
import { rhsmServices } from '../../services/rhsmServices';

const getGraphReports = (id = null, query = {}) => dispatch =>
  dispatch({
    type: rhsmTypes.GET_GRAPH_REPORT_RHSM,
    payload: rhsmServices.getGraphReports(id, query),
    meta: {
      data: { id },
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
      data: { id },
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

const rhsmActions = { getGraphCapacity, getGraphReports };

export { rhsmActions as default, rhsmActions, getGraphCapacity, getGraphReports };
