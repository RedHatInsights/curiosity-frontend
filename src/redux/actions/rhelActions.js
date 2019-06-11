import { rhelTypes } from '../types';
import rhelServices from '../../services/rhelServices';

const getGraphReports = () => dispatch =>
  dispatch({
    type: rhelTypes.GET_GRAPH_REPORT,
    payload: rhelServices.getGraphReports()
  });

export { getGraphReports as default, getGraphReports };
