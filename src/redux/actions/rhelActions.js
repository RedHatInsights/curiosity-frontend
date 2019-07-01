import { rhelTypes } from '../types';
import rhelServices from '../../services/rhelServices';

const getGraphReports = () => dispatch =>
  dispatch({
    type: rhelTypes.GET_GRAPH_REPORT,
    payload: rhelServices.getGraphReportsRhsm()
  });

export { getGraphReports as default, getGraphReports };
