import { useHistory as useHistoryRRD, useLocation, useParams, useRouteMatch } from 'react-router-dom';
import { useRouteDetail } from '../components/router/routerContext';
import { routerHelpers } from '../components/router/routerHelpers';
import { reduxActions, useDispatch } from '../redux';

/**
 * ToDo: reevaluate this alternative pattern of passing library hooks as options
 * We did this as a test to see if its more convenient for unit testing instead of
 * having to spy or mock entire resources.
 */
/**
 * Pass useHistory methods. Proxy useHistory push with Platform specific navigation update.
 *
 * @param {object} hooks
 * @param {Function} hooks.useHistory
 * @param {Function} hooks.useDispatch
 * @returns {object<history>}
 */
const useHistory = ({
  useHistory: useAliasHistory = useHistoryRRD,
  useDispatch: useAliasDispatch = useDispatch
} = {}) => {
  const history = useAliasHistory();
  const dispatch = useAliasDispatch();

  return {
    ...history,
    push: (pathLocation, historyState) => {
      const pathName = (typeof pathLocation === 'string' && pathLocation) || pathLocation?.pathname;
      const { productParameter, id, routeHref } = routerHelpers.getRouteConfig({ pathName, id: pathName });
      const { hash, search } = window.location;

      if (productParameter) {
        return dispatch(reduxActions.platform.setAppNav(id));
      }

      return history.push(routeHref || (pathName && `${pathName}${search}${hash}`) || pathLocation, historyState);
    }
  };
};

const routerHooks = {
  useHistory,
  useLocation,
  useParams,
  useRouteDetail,
  useRouteMatch
};

export { routerHooks as default, routerHooks, useHistory, useLocation, useParams, useRouteDetail, useRouteMatch };
