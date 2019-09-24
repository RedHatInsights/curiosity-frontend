import { rhelTypes } from '../types';
import rhelServices from '../../services/rhelServices';

const getGraphReportsRhel = (query = {}) => dispatch =>
  dispatch({
    type: rhelTypes.GET_GRAPH_REPORT_RHEL,
    payload: rhelServices.getGraphReportsRhel(query),
    meta: {
      query,
      notifications: {
        rejected: {
          variant: 'info',
          title: 'Reporting connection has failed',
          description: 'Product ID: Red Hat Enterprise Linux'
        }
      }
    }
  });

const getGraphCapacityRhel = (query = {}) => dispatch =>
  dispatch({
    type: rhelTypes.GET_GRAPH_CAPACITY_RHEL,
    payload: rhelServices.getGraphCapacityRhel(query),
    meta: {
      query,
      notifications: {
        rejected: {
          variant: 'info',
          title: 'Capacity connection has failed',
          description: 'Product ID: Red Hat Enterprise Linux'
        }
      }
    }
  });

export { getGraphCapacityRhel, getGraphReportsRhel };
