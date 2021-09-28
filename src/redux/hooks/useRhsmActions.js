import { reactReduxHooks } from './useReactRedux';
import { rhsmTypes } from '../types/rhsmTypes';
import { rhsmServices } from '../../services/rhsmServices';

/**
 * Get an updated store RHSM response from message reporting.
 *
 * @param {string} id
 * @param {object} query
 * @returns {Function}
 */
const useGetMessageReports = (id = null, query = {}) =>
  reactReduxHooks.useDispatch()({
    type: rhsmTypes.GET_MESSAGE_REPORTS_RHSM,
    payload: rhsmServices.getGraphReports(id, query, { cancelId: 'messageReport' }),
    meta: {
      id,
      query,
      notifications: {}
    }
  });

const rhsmActionsHooks = {
  useGetMessageReports
};

export { rhsmActionsHooks as default, rhsmActionsHooks, useGetMessageReports };
