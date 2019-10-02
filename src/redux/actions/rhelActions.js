import { rhelTypes } from '../types';
import rhelServices from '../../services/rhelServices';

const getGraphReports = (query = {}) => dispatch =>
  dispatch({
    type: rhelTypes.GET_GRAPH_REPORT,
    payload: rhelServices.getGraphReportsRhsm(query),
    meta: {
      notifications: {
        rejected: {
          variant: 'info',
          title: 'RHSM connection has failed',
          description: 'Product ID Red Hat Enterprise Linux'
        }
      }
    }
  });

export { getGraphReports as default, getGraphReports };
