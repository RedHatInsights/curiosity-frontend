import { rhelTypes } from '../types';
import rhelServices from '../../services/rhelServices';

const getGraphReports = (query = {}) => dispatch =>
  dispatch({
    type: rhelTypes.GET_GRAPH_REPORT,
    payload: rhelServices.getGraphReportsRhsm(query)
  });

export { getGraphReports as default, getGraphReports };
